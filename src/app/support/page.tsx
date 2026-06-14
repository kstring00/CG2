'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  Lightbulb,
  Search,
  Sparkles,
  Wallet,
  Users,
} from 'lucide-react';
import WeeklyProgressMeter from '@/components/WeeklyProgressMeter';
import CarePlanSupportPanel from '@/components/CarePlanSupportPanel';
import AdmissionsHandoff from '@/components/AdmissionsHandoff';
import CrisisPill from '@/components/CrisisPill';
import HomeBaseDayCheck from '@/components/homeBase/HomeBaseDayCheck';
import {
  getStepCompletionKey,
  loadCarePlan,
  type CarePlanStep,
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
  ROUGH_DAY_SELF_CARE,
  saveHomeBaseDayMood,
  type HomeBaseDayMood,
} from '@/lib/homeBaseDayCheck';

const CHECK_IN_HREF = '/support/check-in';

const QUICK_DOORS = [
  {
    label: 'At-home strategy',
    href: '/support/at-home',
    icon: Lightbulb,
  },
  {
    label: 'Find local help',
    href: '/support/find',
    icon: Search,
  },
  {
    label: 'Paying for care',
    href: '/support/financial',
    icon: Wallet,
  },
  {
    label: 'Connect with parents',
    href: '/support/connect',
    icon: Users,
  },
] as const;

function StepLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (href.startsWith('http') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

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

  return { hydrated, plan, weekView, summary, refresh };
}

function HeroStepCard({
  step,
  softened,
  intakeMode,
}: {
  step: { title: string; href: string; because?: string; why?: string };
  softened?: boolean;
  intakeMode?: boolean;
}) {
  const becauseLine = step.because ?? step.why;

  return (
    <section
      aria-label={intakeMode ? 'Start this week' : 'Your next step'}
      className={[
        'rounded-3xl border transition',
        softened
          ? 'border-surface-border/80 bg-white/80 p-5 shadow-none sm:p-6'
          : 'border-primary/20 bg-gradient-to-br from-white via-white to-primary/[0.04] p-6 shadow-soft sm:p-7',
      ].join(' ')}
    >
      {softened && (
        <p className="mb-2 text-[12px] font-medium text-brand-muted-500">
          When you&rsquo;re ready — your plan step is still here.
        </p>
      )}
      {!softened && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          {intakeMode ? 'Start here' : 'Your next step'}
        </p>
      )}
      <StepLink
        href={step.href}
        className={[
          'group mt-2 block rounded-2xl transition',
          softened ? '' : '-mx-1 px-1 py-1 hover:bg-primary/[0.03]',
        ].join(' ')}
      >
        <h2
          className={[
            'font-semibold leading-snug text-brand-navy-700 group-hover:text-primary',
            softened ? 'text-lg' : 'text-xl sm:text-2xl',
          ].join(' ')}
        >
          {step.title}
          <ArrowRight
            className={[
              'ml-2 inline-block shrink-0 transition group-hover:translate-x-0.5',
              softened ? 'h-4 w-4 opacity-50' : 'h-5 w-5 opacity-70',
            ].join(' ')}
            aria-hidden
          />
        </h2>
        {becauseLine && (
          <p
            className={[
              'mt-3 leading-relaxed',
              softened ? 'text-[13px] text-brand-muted-600' : 'text-[14px] text-brand-muted-700',
            ].join(' ')}
          >
            {becauseLine}
          </p>
        )}
      </StepLink>
    </section>
  );
}

function RoughDayLead() {
  return (
    <section
      aria-label="Support for a rough day"
      className="rounded-3xl border border-brand-plum-200/80 bg-gradient-to-br from-brand-plum-50/90 to-white p-6 shadow-soft sm:p-7"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
        For you, first
      </p>
      <Link
        href={ROUGH_DAY_SELF_CARE.href}
        className="group mt-2 block"
      >
        <h2 className="text-xl font-semibold leading-snug text-brand-navy-700 group-hover:text-brand-plum-800 sm:text-2xl">
          {ROUGH_DAY_SELF_CARE.title}
          <ArrowRight className="ml-2 inline-block h-5 w-5 opacity-70 transition group-hover:translate-x-0.5" />
        </h2>
        <p className="mt-3 text-[14px] leading-relaxed text-brand-muted-700">
          {ROUGH_DAY_SELF_CARE.body}
        </p>
      </Link>
    </section>
  );
}

function RestOfWeekExpander({
  steps,
  completedKeys,
  legacyHrefs,
  allSteps,
}: {
  steps: CarePlanStep[];
  completedKeys: string[];
  legacyHrefs: string[];
  allSteps: CarePlanStep[];
}) {
  const [open, setOpen] = useState(false);
  if (steps.length === 0) return null;

  return (
    <div className="rounded-2xl border border-surface-border/70 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[13px] font-medium text-brand-muted-700 transition hover:text-brand-navy-700 sm:px-5"
      >
        <span>See the rest of this week</span>
        <ChevronDown
          className={['h-4 w-4 shrink-0 transition', open ? 'rotate-180' : ''].join(' ')}
          aria-hidden
        />
      </button>
      {open && (
        <ol className="border-t border-surface-border/70 px-4 py-2 sm:px-5">
          {steps.map((step) => {
            const done = isStepComplete(step, completedKeys, legacyHrefs, allSteps);
            return (
              <li
                key={getStepCompletionKey(step)}
                className="border-b border-surface-border/50 py-3 last:border-0"
              >
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <div className="min-w-0">
                    <p
                      className={[
                        'text-[14px] font-semibold text-brand-navy-700',
                        done ? 'text-brand-muted-500 line-through decoration-brand-muted-300' : '',
                      ].join(' ')}
                    >
                      {step.title}
                    </p>
                    {(step.because ?? step.why) && (
                      <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-600">
                        {step.because ?? step.why}
                      </p>
                    )}
                  </div>
                  <StepLink
                    href={step.href}
                    className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary/80"
                  >
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </StepLink>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function QuickDoorsRow() {
  return (
    <section aria-label="Other paths" className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-400">
        Or explore on your own
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_DOORS.map((door) => (
          <Link
            key={door.href}
            href={door.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface-muted/20 px-3 py-1.5 text-[12.5px] font-medium text-brand-muted-700 transition hover:border-primary/25 hover:bg-white hover:text-brand-navy-700"
          >
            <door.icon className="h-3.5 w-3.5 opacity-60" aria-hidden />
            {door.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function HumanRow() {
  return (
    <section
      aria-label="Talk to a person"
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-surface-border/60 bg-white px-4 py-4 sm:px-5"
    >
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-brand-muted-800">
          Here when you&rsquo;re ready
        </p>
        <p className="mt-0.5 text-[12px] text-brand-muted-500">
          A free consultation with admissions — or crisis support if today feels unsafe.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <AdmissionsHandoff compact />
        <CrisisPill />
      </div>
    </section>
  );
}

function HomeBaseNoPlan() {
  return (
    <div className="page-shell gap-8">
      <section className="rounded-3xl border border-primary/15 bg-gradient-to-br from-[#f8f2ea] via-white to-[#fdf7f2] p-7 sm:p-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Home Base
        </p>
        <h1 className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-brand-muted-900 sm:text-4xl">
          What do I do right now?
        </h1>
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

      <QuickDoorsRow />
      <HumanRow />
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

  const restSteps = useMemo(() => {
    if (!summary.intakeDoneThisWeek) return incompleteSteps;
    return incompleteSteps.slice(1);
  }, [summary.intakeDoneThisWeek, incompleteSteps]);

  const isRoughDay = dayMoodHydrated && dayMood === 'rough';
  const softenHero = isRoughDay;

  return (
    <div className="page-shell gap-6 sm:gap-7">
      <WeeklyProgressMeter variant="panel" calm />

      {isRoughDay && <RoughDayLead />}

      {!isRoughDay && (
        <>
          <HeroStepCard
            step={heroStep}
            intakeMode={!summary.intakeDoneThisWeek}
          />
          <RestOfWeekExpander
            steps={restSteps}
            completedKeys={completedKeys}
            legacyHrefs={legacyHrefs}
            allSteps={allSteps}
          />
        </>
      )}

      {dayMoodHydrated && (
        <HomeBaseDayCheck value={dayMood} onChange={handleDayMood} />
      )}

      {isRoughDay && (
        <HeroStepCard
          step={heroStep}
          softened={softenHero}
          intakeMode={!summary.intakeDoneThisWeek}
        />
      )}

      {isRoughDay && (
        <RestOfWeekExpander
          steps={restSteps}
          completedKeys={completedKeys}
          legacyHrefs={legacyHrefs}
          allSteps={allSteps}
        />
      )}

      <CarePlanSupportPanel answers={plan.answers} />

      <QuickDoorsRow />

      <HumanRow />

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
      <div className="page-shell">
        <div className="h-28 animate-pulse rounded-2xl bg-surface-subtle" />
        <div className="mt-6 h-40 animate-pulse rounded-3xl bg-surface-subtle" />
      </div>
    );
  }

  if (!plan || !weekView || !summary) {
    return <HomeBaseNoPlan />;
  }

  return <HomeBaseWithPlan plan={plan} weekView={weekView} summary={summary} />;
}
