'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import HomeBaseHeader from '@/components/homeBase/HomeBaseHeader';
import HomeBaseJourneyCard from '@/components/homeBase/HomeBaseJourneyCard';
import HomeBaseDayCheck from '@/components/homeBase/HomeBaseDayCheck';
import HomeBaseHero from '@/components/homeBase/HomeBaseHero';
import HomeBaseRoughDayLead from '@/components/homeBase/HomeBaseRoughDayLead';
import HomeBaseInsightGrid from '@/components/homeBase/HomeBaseInsightGrid';
import HomeBaseQuickLinks from '@/components/homeBase/HomeBaseQuickLinks';
import HomeBaseHumanFooter from '@/components/homeBase/HomeBaseHumanFooter';
import {
  getStepCompletionKey,
  loadCarePlan,
  type SavedCarePlan,
} from '@/lib/carePlanStorage';
import {
  getCarePlanBucketSteps,
  getCarePlanWeekView,
  resolvedCompletionKeys,
  type CarePlanWeekView,
} from '@/lib/carePlanDisplay';
import {
  isStepComplete,
  loadPreviousWeeklyProgress,
  loadWeeklyProgress,
  type WeeklyProgressSummary,
  getWeeklyProgressSummary,
  WEEKLY_PROGRESS_EVENT,
} from '@/lib/weeklyProgress';
import { computeWeekNumber, loadCheckInState } from '@/lib/weeklyCheckIn';
import {
  loadHomeBaseDayMood,
  saveHomeBaseDayMood,
  type HomeBaseDayMood,
} from '@/lib/homeBaseDayCheck';

const CHECK_IN_HREF = '/support/check-in';

function useHomeBasePlan() {
  const [hydrated, setHydrated] = useState(false);
  const [plan, setPlan] = useState<SavedCarePlan | null>(null);
  const [progressTick, setProgressTick] = useState(0);

  const refresh = useCallback(() => {
    setPlan(loadCarePlan());
    setProgressTick((t) => t + 1);
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);

    function onStorage(e: StorageEvent) {
      if (
        e.key === null ||
        e.key === 'cg.carePlan.v1' ||
        e.key?.startsWith('cg.weeklyProgress')
      ) {
        refresh();
      }
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener(WEEKLY_PROGRESS_EVENT, refresh);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(WEEKLY_PROGRESS_EVENT, refresh);
    };
  }, [refresh]);

  const weekView = useMemo(() => {
    if (!plan) return null;
    void progressTick;
    const progress = loadWeeklyProgress();
    const checkIn = loadCheckInState();
    const weekNumber = computeWeekNumber(checkIn.planStartedAt ?? plan.createdAt ?? null);
    const bucketSteps = getCarePlanBucketSteps(plan);
    const completedKeys = resolvedCompletionKeys(bucketSteps, progress);
    const legacyHrefs = progress.completedStepHrefs ?? [];
    return getCarePlanWeekView(
      plan,
      weekNumber,
      completedKeys,
      legacyHrefs,
      loadPreviousWeeklyProgress()?.lastSupportNudgeThread ?? null,
    );
  }, [plan, progressTick]);

  const summary = useMemo((): WeeklyProgressSummary | null => {
    if (!plan) return null;
    void progressTick;
    return getWeeklyProgressSummary();
  }, [plan, progressTick]);

  return { hydrated, plan, weekView, summary };
}

function HomeBaseNoPlan() {
  return (
    <div className="page-shell gap-8">
      <HomeBaseHeader />

      <section className="rounded-[1.75rem] border border-primary/15 bg-gradient-to-br from-brand-plum-50/80 via-white to-[#fdf7f2] p-7 shadow-soft sm:p-9">
        <h2 className="max-w-xl text-2xl font-semibold leading-tight text-brand-navy-700 sm:text-3xl">
          What do I do right now?
        </h2>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-brand-muted-600">
          A few honest questions, and we&rsquo;ll put together a small starting point for the
          week ahead. No sign-up, no clinical paperwork — saved privately on this device.
        </p>
        <Link
          href="/support/intake"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4" />
          Build my plan
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-4 text-[13px] text-brand-muted-500">
          About three minutes. You can change it anytime.
        </p>
      </section>

      <HomeBaseQuickLinks
        answers={{ hasOtherChildren: false, hasPartner: false }}
      />
      <HomeBaseHumanFooter />
    </div>
  );
}

function HomeBaseWithPlan({
  plan,
  weekView,
  summary,
}: {
  plan: SavedCarePlan;
  weekView: CarePlanWeekView;
  summary: WeeklyProgressSummary;
}) {
  const [dayMood, setDayMood] = useState<HomeBaseDayMood | null>(null);
  const [dayMoodHydrated, setDayMoodHydrated] = useState(false);

  useEffect(() => {
    setDayMood(loadHomeBaseDayMood());
    setDayMoodHydrated(true);
  }, []);

  const handleDayMood = (value: HomeBaseDayMood | null) => {
    setDayMood(value);
    saveHomeBaseDayMood(value);
  };

  const progress = loadWeeklyProgress();
  const legacyHrefs = progress.completedStepHrefs ?? [];
  const allSteps = weekView.activeSteps;
  const completedKeys = summary.completedStepKeys;

  const incompleteSteps = allSteps.filter(
    (s) => !isStepComplete(s, completedKeys, legacyHrefs, allSteps),
  );

  const heroStep = useMemo(() => {
    if (!summary.intakeDoneThisWeek) {
      return {
        title: 'Start this week’s check-in',
        href: CHECK_IN_HREF,
        why: 'A quick pulse on how the week feels — then your plan steps unlock.',
      };
    }
    if (incompleteSteps.length > 0) return incompleteSteps[0];
    return {
      title: 'You’re caught up for this week',
      href: '/support/care-plan',
      why: 'Nothing urgent right now. Your full plan is always here when you want it.',
    };
  }, [summary.intakeDoneThisWeek, incompleteSteps]);

  const heroStepKey = useMemo(() => {
    if (!summary.intakeDoneThisWeek || incompleteSteps.length === 0) return undefined;
    return getStepCompletionKey(incompleteSteps[0]);
  }, [summary.intakeDoneThisWeek, incompleteSteps]);

  const isRoughDay = dayMoodHydrated && dayMood === 'rough';

  return (
    <div className="page-shell gap-6 sm:gap-8">
      <HomeBaseHeader />

      <div className="grid gap-4 lg:grid-cols-2">
        <HomeBaseJourneyCard
          summary={summary}
          arcWeekNumber={weekView.arcWeekNumber}
          arcTheme={weekView.arcTheme}
        />
        {dayMoodHydrated && (
          <HomeBaseDayCheck value={dayMood} onChange={handleDayMood} />
        )}
      </div>

      {isRoughDay && <HomeBaseRoughDayLead />}

      {!isRoughDay && (
        <HomeBaseHero
          step={heroStep}
          intakeMode={!summary.intakeDoneThisWeek}
        />
      )}

      {isRoughDay && (
        <HomeBaseHero
          step={heroStep}
          softened
          intakeMode={!summary.intakeDoneThisWeek}
        />
      )}

      <HomeBaseInsightGrid
        steps={allSteps}
        completedKeys={completedKeys}
        legacyHrefs={legacyHrefs}
        heroStepKey={heroStepKey}
      />

      <HomeBaseQuickLinks answers={plan.answers} />

      <HomeBaseHumanFooter />

      <p className="text-center text-[12px] text-brand-muted-400">
        <Link href="/support/care-plan" className="font-medium hover:text-primary">
          Open full care plan
        </Link>
      </p>
    </div>
  );
}

export default function SupportHome() {
  const { hydrated, plan, weekView, summary } = useHomeBasePlan();

  if (!hydrated) {
    return (
      <div className="page-shell gap-6">
        <div className="h-16 animate-pulse rounded-2xl bg-surface-subtle" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-36 animate-pulse rounded-2xl bg-surface-subtle" />
          <div className="h-36 animate-pulse rounded-2xl bg-surface-subtle" />
        </div>
        <div className="h-48 animate-pulse rounded-3xl bg-surface-subtle" />
      </div>
    );
  }

  if (!plan || !weekView || !summary) {
    return <HomeBaseNoPlan />;
  }

  return <HomeBaseWithPlan plan={plan} weekView={weekView} summary={summary} />;
}
