'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Compass,
  DollarSign,
  Flag,
  GraduationCap,
  Heart,
  HeartHandshake,
  Home,
  Mail,
  Pencil,
  Printer,
  RefreshCw,
  Route,
  Search,
  Sparkles,
  Target,
  Users,
  Wrench,
} from 'lucide-react';
import {
  getStepCompletionKey,
  loadCarePlan,
  type CarePlanStep,
  type Hardest,
  type SavedCarePlan,
  type StepBucket,
  type StepEvidence,
} from '@/lib/carePlanStorage';
import {
  BUCKET_LABELS,
  getWeekTwoGuideIntro,
  HARDEST_OPTIONS,
} from '@/lib/generateNextSteps';
import type { Phase } from '@/lib/arcs';
import EmailPlanDialog from '@/components/EmailPlanDialog';
import CarePlanSupportPanel from '@/components/CarePlanSupportPanel';
import AdmissionsHandoff from '@/components/AdmissionsHandoff';
import { ADMISSIONS_STEP_IDS } from '@/lib/carePlanSupport';
import {
  completedStepTitles,
  getCarePlanBucketSteps,
  getCarePlanWeekView,
  resolvedCompletionKeys,
} from '@/lib/carePlanDisplay';
import {
  isStepComplete,
  loadPreviousWeeklyProgress,
  loadWeeklyProgress,
  markStepDone,
  recordSupportNudgeThread,
  unmarkStepDone,
  WEEKLY_PROGRESS_EVENT,
} from '@/lib/weeklyProgress';
import {
  computeWeekNumber,
  ensurePlanStarted,
  type WeeklyCheckInState,
} from '@/lib/weeklyCheckIn';

/**
 * Persistent care plan view — the result of Find My Next Step.
 *
 * The saved recommendation engine still uses the legacy arc-position model
 * internally. This page deliberately presents that work as a current stage,
 * focus, and evidence of progress so parents are not locked into a calendar.
 */
export default function CarePlanPage() {
  const [hydrated, setHydrated] = useState(false);
  const [plan, setPlan] = useState<SavedCarePlan | null>(null);

  useEffect(() => {
    setHydrated(true);
    setPlan(loadCarePlan());
  }, []);

  if (!hydrated) {
    return (
      <Shell>
        <div className="h-40 animate-pulse rounded-3xl bg-surface-subtle" />
      </Shell>
    );
  }

  if (!plan) return <EmptyState />;

  return <PopulatedPlan plan={plan} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      {children}
    </main>
  );
}

function EmptyState() {
  return (
    <Shell>
      <div className="rounded-3xl border border-surface-border bg-white p-8 text-center shadow-soft sm:p-12">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-brand-navy-700 sm:text-3xl">
          You don&rsquo;t have a plan yet — that&rsquo;s okay.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-brand-muted-700">
          Tell us where your family is and what feels hardest right now. Common Ground will
          turn that into one clear starting point using the support already available here.
        </p>
        <Link
          href="/support/intake"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4" /> Start Find My Next Step{' '}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-4 text-[13px] text-brand-muted-500">
          Saved privately on this device. You can update it whenever something changes.
        </p>
      </div>
    </Shell>
  );
}

const INTAKE_HREF = '/support/intake';
const CHECK_IN_HREF = '/support/check-in';

const HARDEST_ICONS: Record<Hardest, React.ComponentType<{ className?: string }>> = {
  'understanding-aba': Brain,
  'behavior-home': Home,
  overwhelmed: Heart,
  'finding-resources': Search,
  'financial-insurance': DollarSign,
  siblings: Users,
  'connecting-parents': HeartHandshake,
  'school-iep': GraduationCap,
};

const HARDEST_LABEL_BY_VALUE: Record<string, string> = Object.fromEntries(
  HARDEST_OPTIONS.map((option) => [option.value, option.label]),
);

const BUCKET_PILL: Record<StepBucket, string> = {
  'do-today': 'bg-brand-plum-50 text-brand-plum-700',
  'ask-bcba': 'bg-brand-purple-50 text-brand-purple-500',
  'try-home': 'bg-emerald-50 text-emerald-700',
  'save-resource': 'bg-brand-warm-100 text-brand-muted-700',
  'next-week': 'bg-sky-50 text-sky-700',
};

const BUCKET_CTA: Record<StepBucket, string> = {
  'do-today': 'Start here',
  'ask-bcba': 'Find help',
  'try-home': 'Open guide',
  'save-resource': 'Browse guides',
  'next-week': 'Open guide',
};

type StageMeta = {
  label: string;
  description: string;
  badgeClass: string;
};

const PHASE_STAGE: Record<Phase, StageMeta> = {
  orient: {
    label: 'Getting clear',
    description: 'Understand the situation, your options, and what matters most before acting.',
    badgeClass: 'border-brand-purple-100 bg-brand-purple-50 text-brand-purple-600',
  },
  setup: {
    label: 'Preparing',
    description: 'Gather the information, questions, and support needed for the next action.',
    badgeClass: 'border-sky-100 bg-sky-50 text-sky-700',
  },
  sustain: {
    label: 'Maintaining & reassessing',
    description: 'Keep what is helping, notice what has changed, and decide what support is next.',
    badgeClass: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  },
};

function resolveStageMeta(phase: Phase, doneCount: number, totalSteps: number): StageMeta {
  if (totalSteps > 0 && doneCount >= totalSteps) {
    return {
      label: 'Ready to reassess',
      description: 'You completed the current actions. Check in so the plan can respond to what changed.',
      badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };
  }

  if (doneCount > 0) {
    return {
      label: 'Taking action',
      description: 'You are actively working the plan. Keep going, or check in when the situation changes.',
      badgeClass: 'border-primary/15 bg-primary/10 text-primary',
    };
  }

  return PHASE_STAGE[phase];
}

function stageLanguage(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/\bweek one\b/gi, 'the first part of your plan')
    .replace(/\bweek two\b/gi, 'the next part of your plan')
    .replace(/\bweek-two\b/gi, 'next-step')
    .replace(/\bnext week\b/gi, 'later in your plan')
    .replace(/\bthis week\b/gi, 'right now')
    .replace(/\bthe week ahead\b/gi, 'what comes next');
}

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

function EvidenceStrip({ evidence }: { evidence: StepEvidence }) {
  return (
    <p className="mt-3 rounded-xl border border-brand-plum-100 bg-brand-plum-50/60 px-3 py-2.5 text-[12px] leading-relaxed text-brand-muted-700">
      <span className="font-semibold text-brand-plum-800">Why this is worth trying: </span>
      {stageLanguage(evidence.text)}
      <span className="mt-1 block text-[11px] text-brand-muted-500">
        Source: {evidence.source}
      </span>
    </p>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  right,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="border-b border-brand-plum-100 pb-3">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <h2 className="text-lg font-bold leading-tight text-brand-navy-700 sm:text-xl">
            {title}
          </h2>
        </div>
        {right}
      </div>
      {subtitle && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-brand-muted-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function PopulatedPlan({ plan }: { plan: SavedCarePlan }) {
  const [checkInState, setCheckInState] = useState<WeeklyCheckInState | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [completedKeys, setCompletedKeys] = useState<string[]>([]);
  const [legacyHrefs, setLegacyHrefs] = useState<string[]>([]);

  const allBucketSteps = useMemo(() => getCarePlanBucketSteps(plan), [plan]);
  const legacyArcPosition = checkInState
    ? computeWeekNumber(checkInState.planStartedAt)
    : 1;

  const weekView = useMemo(
    () =>
      getCarePlanWeekView(
        plan,
        legacyArcPosition,
        completedKeys,
        legacyHrefs,
        loadPreviousWeeklyProgress()?.lastSupportNudgeThread ?? null,
      ),
    [plan, legacyArcPosition, completedKeys, legacyHrefs],
  );

  useEffect(() => {
    if (weekView.supportNudgeThread) {
      recordSupportNudgeThread(weekView.supportNudgeThread);
    }
  }, [weekView.supportNudgeThread]);

  const topSteps = weekView.activeSteps;
  const focusIntro = useMemo(
    () => (weekView.weekTwoUnlocked ? getWeekTwoGuideIntro(plan.answers) : null),
    [plan.answers, weekView.weekTwoUnlocked],
  );

  const previousProgress = useMemo(
    () => loadPreviousWeeklyProgress(),
    [completedKeys],
  );
  const recentlyCompleted = useMemo(
    () => completedStepTitles(allBucketSteps, previousProgress),
    [allBucketSteps, previousProgress],
  );

  const refreshProgress = () => {
    const raw = loadWeeklyProgress();
    setCompletedKeys(resolvedCompletionKeys(allBucketSteps, raw));
    setLegacyHrefs(raw.completedStepHrefs ?? []);
  };

  useEffect(() => {
    setCheckInState(ensurePlanStarted(plan.createdAt));
    refreshProgress();
    const onUpdate = () => refreshProgress();
    window.addEventListener(WEEKLY_PROGRESS_EVENT, onUpdate);
    return () => window.removeEventListener(WEEKLY_PROGRESS_EVENT, onUpdate);
  }, [plan.createdAt, allBucketSteps]);

  const handleToggleStep = (stepKey: string, currentlyDone: boolean) => {
    if (currentlyDone) {
      unmarkStepDone(stepKey);
    } else {
      markStepDone(stepKey);
    }
    refreshProgress();
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const completionUniverse = useMemo(
    () => [...allBucketSteps, ...topSteps],
    [allBucketSteps, topSteps],
  );
  const isStepDone = (step: CarePlanStep) =>
    isStepComplete(step, completedKeys, legacyHrefs, completionUniverse);
  const doneCount = topSteps.filter(isStepDone).length;
  const progressPercent = topSteps.length
    ? Math.round((doneCount / topSteps.length) * 100)
    : 0;
  const stageMeta = resolveStageMeta(weekView.arcPhase, doneCount, topSteps.length);

  const resources = plan.resources;
  const nextActions = resources.slice(0, 3);
  const toolItems = resources.slice(3, 6).length
    ? resources.slice(3, 6)
    : resources.slice(0, 3);
  const recommended = resources.slice(0, 3);
  const concerns = (plan.answers.hardest ?? []) as Hardest[];

  const latestCheckIn =
    checkInState && checkInState.history.length
      ? checkInState.history[checkInState.history.length - 1]
      : null;

  const updated = new Date(plan.updatedAt);
  const updatedDisplay = updated.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Shell>
      <section
        aria-label={`Current stage: ${stageMeta.label}`}
        className="rounded-3xl border border-surface-border bg-gradient-to-br from-white via-white to-brand-plum-50/35 p-5 shadow-soft sm:p-6"
      >
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.55fr)] sm:items-start">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-muted-500">
              Your current stage
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold ${stageMeta.badgeClass}`}
              >
                {stageMeta.label}
              </span>
              <span className="text-[13px] font-medium text-brand-muted-600">
                Based on your latest check-in
              </span>
            </div>
            <h2 className="mt-3 text-xl font-bold leading-tight text-brand-navy-700 sm:text-2xl">
              {weekView.arcTheme}
            </h2>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-brand-muted-700">
              {stageMeta.description}
            </p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-white/85 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
                  Action progress
                </p>
                <p className="mt-1 text-[14px] font-semibold text-brand-navy-700">
                  {doneCount} of {topSteps.length} complete
                </p>
              </div>
              <span className="text-lg font-bold tabular-nums text-primary">
                {progressPercent}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`${doneCount} of ${topSteps.length} current actions complete`}
              aria-valuemin={0}
              aria-valuemax={Math.max(topSteps.length, 1)}
              aria-valuenow={doneCount}
              className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200/80"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <Link
              href={CHECK_IN_HREF}
              className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:text-primary/80"
            >
              Tell us what changed <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-surface-muted/45 px-3.5 py-3 text-[12px] leading-relaxed text-brand-muted-600">
          <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum-600" />
          <p>
            Check in whenever your situation, completed actions, or biggest concern changes.
            That gives Common Ground the information it needs to recalculate what comes next.
          </p>
        </div>
      </section>

      <nav aria-label="Breadcrumb" className="mt-6 text-[12px] text-brand-muted-500">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/support" className="hover:text-brand-navy-700">
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3 w-3" />
          </li>
          <li className="font-medium text-brand-muted-700">My Family Care Plan</li>
        </ol>
      </nav>

      <header className="mt-3">
        <h1 className="text-3xl font-bold leading-tight text-brand-navy-700 sm:text-4xl">
          <span className="inline-block border-b-[3px] border-brand-plum-300 pb-0.5">
            Your plan
          </span>
          , simplified
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-brand-muted-700">
          A focused plan built from what you told us. Complete what is useful, return when
          something changes, and let the next check-in keep the plan accurate.
        </p>
        <p className="mt-1.5 text-[12px] text-brand-muted-500">
          Last updated {updatedDisplay} · Saved privately on this device
        </p>
      </header>

      {concerns.length > 0 && (
        <section
          aria-label="What shaped this plan"
          className="mt-5 rounded-2xl bg-brand-plum-50 px-4 py-3 sm:px-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
                What shaped this plan
              </p>
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {concerns.map((concern) => {
                  const Icon = HARDEST_ICONS[concern];
                  return (
                    <li
                      key={concern}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-navy-700"
                    >
                      {Icon && <Icon className="h-3.5 w-3.5 text-brand-plum-600" />}
                      {HARDEST_LABEL_BY_VALUE[concern] ?? concern}
                    </li>
                  );
                })}
              </ul>
            </div>
            <Link
              href={INTAKE_HREF}
              className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-brand-plum-700 hover:text-brand-plum-800"
            >
              Edit my concerns <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}

      {recentlyCompleted.length > 0 && (
        <section
          aria-label="Recently completed actions"
          className="mt-5 rounded-2xl border border-surface-border bg-surface-muted/40 px-4 py-3 sm:px-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
            Recently completed
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {recentlyCompleted.map((title) => (
              <li
                key={title}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-medium text-emerald-800"
              >
                <Check className="h-3 w-3" aria-hidden /> {title}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        aria-label="Current focus"
        className="mt-5 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/75 via-white to-white shadow-soft"
      >
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_245px]">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-emerald-700">
                Current focus
              </p>
              <span className="h-1 w-1 rounded-full bg-emerald-300" aria-hidden />
              <p className="text-[11px] font-semibold text-emerald-700">{stageMeta.label}</p>
            </div>
            <h2 className="mt-2 text-xl font-bold leading-tight text-brand-navy-700">
              {weekView.arcTheme}
            </h2>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-brand-muted-700">
              {focusIntro
                ? stageLanguage(focusIntro.body)
                : 'These actions were selected from your most recent answers. Start with the smallest useful step, then update the plan when your circumstances change.'}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href={CHECK_IN_HREF}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
              >
                Update my next step <ArrowRight className="h-4 w-4" />
              </Link>
              <AdmissionsHandoff compact />
            </div>
          </div>

          <div className="border-t border-emerald-100 bg-white/70 p-5 lg:border-l lg:border-t-0">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Route className="h-4.5 w-4.5" />
            </div>
            <h3 className="mt-3 text-[14px] font-semibold text-brand-navy-700">
              How your plan moves
            </h3>
            <p className="mt-1.5 text-[12px] leading-relaxed text-brand-muted-600">
              Complete actions at your pace. When something changes, check in again so the
              system can validate your situation and update the focus.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div>
          <section aria-label="Your next steps">
            <SectionHeader
              icon={Target}
              title="Your next steps"
              subtitle="The smallest useful actions for your current focus. You do not have to complete everything at once."
              right={
                <div className="flex items-center gap-2">
                  {doneCount >= topSteps.length && topSteps.length > 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white">
                      {Math.min(doneCount + 1, Math.max(topSteps.length, 1))}
                    </span>
                  )}
                  <span className="text-[12px] font-semibold text-brand-muted-600">
                    {doneCount} of {topSteps.length} complete
                  </span>
                </div>
              }
            />

            <ol className="mt-1 divide-y divide-surface-border">
              {topSteps.map((step, index) => {
                const isDone = isStepDone(step);
                const stepKey = getStepCompletionKey(step);
                const bucket = step.bucket;
                const isExternal = step.href.startsWith('http') || step.href.startsWith('tel:');
                const showAdmissions =
                  step.id !== undefined && ADMISSIONS_STEP_IDS.has(step.id);
                const ctaVerb =
                  step.id === 'parentTherapist'
                    ? 'Find a therapist'
                    : bucket
                      ? BUCKET_CTA[bucket]
                      : 'Open guide';

                return (
                  <li
                    key={stepKey}
                    className={
                      'flex gap-3 rounded-xl py-4 transition ' +
                      (isDone ? '-mx-3 bg-emerald-50/50 px-3 opacity-90' : '')
                    }
                  >
                    <span
                      className={
                        'mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ' +
                        (isDone
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-primary/10 text-primary')
                      }
                    >
                      {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                        <h3
                          className={
                            'text-[15px] font-semibold text-brand-navy-700 ' +
                            (isDone ? 'line-through decoration-brand-muted-300' : '')
                          }
                        >
                          {step.title}
                        </h3>
                        <StepLink
                          href={step.href}
                          className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary/80"
                        >
                          {ctaVerb} <ArrowRight className="h-3.5 w-3.5" />
                          {isExternal && (
                            <span className="sr-only"> (opens in new tab)</span>
                          )}
                        </StepLink>
                      </div>

                      <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-600">
                        {stageLanguage(step.because ?? step.why)}
                      </p>

                      {step.evidence && <EvidenceStrip evidence={step.evidence} />}

                      {showAdmissions && step.id !== 'admissionsConsult' && (
                        <div className="mt-2">
                          <AdmissionsHandoff compact />
                        </div>
                      )}

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        {bucket && (
                          <span
                            className={
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ' +
                              BUCKET_PILL[bucket]
                            }
                          >
                            {stageLanguage(BUCKET_LABELS[bucket])}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleStep(stepKey, isDone)}
                          aria-pressed={isDone}
                          className={
                            'inline-flex items-center gap-1.5 text-[12px] font-semibold transition ' +
                            (isDone
                              ? 'text-emerald-700 hover:text-emerald-800'
                              : 'text-brand-muted-500 hover:text-brand-navy-700')
                          }
                        >
                          {isDone ? (
                            <>
                              <Check className="h-3.5 w-3.5" /> Done
                            </>
                          ) : (
                            <>
                              <Circle className="h-3.5 w-3.5" /> Mark done
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {!weekView.weekTwoUnlocked && weekView.nextWeekSteps.length > 0 && (
            <aside
              aria-label="Later in this support arc"
              className="mt-6 rounded-2xl border border-dashed border-sky-200 bg-sky-50/40 p-5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                Later in this arc
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-600">
                These are useful, but they are not the priority yet. Your next check-in can
                move them into focus when the information supports it.
              </p>
              <ul className="mt-3 space-y-2">
                {weekView.nextWeekSteps.map((step) => (
                  <li
                    key={getStepCompletionKey(step)}
                    className="flex items-start gap-2 rounded-xl border border-sky-100 bg-white/80 px-3 py-2.5"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[10px] font-bold text-sky-700">
                      →
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold text-brand-navy-700">
                        {step.title}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-brand-muted-500">
                        {stageLanguage(step.because ?? step.why)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>

        <CarePlanSupportPanel answers={plan.answers} className="lg:sticky lg:top-24" />
      </div>

      <div className="mt-6 print:hidden">
        <AdmissionsHandoff />
      </div>

      {resources.length > 0 && (
        <section aria-label="Next actions and tools" className="mt-9 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft">
            <SectionHeader
              icon={Flag}
              title="Do this next"
              subtitle="Useful actions that support the focus above."
            />
            <ul className="mt-1 divide-y divide-surface-border">
              {nextActions.map((resource) => (
                <li key={resource.href}>
                  <Link
                    href={resource.href}
                    className="flex items-center justify-between gap-3 py-3 text-[14px] font-medium text-brand-navy-700 hover:text-primary"
                  >
                    <span className="min-w-0 truncate">{resource.label}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-primary">
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft">
            <SectionHeader
              icon={Wrench}
              title="Helpful tools"
              subtitle="Calculators, templates, and checklists."
            />
            <ul className="mt-1 divide-y divide-surface-border">
              {toolItems.map((resource) => (
                <li key={resource.href}>
                  <Link
                    href={resource.href}
                    className="flex items-center justify-between gap-3 py-3 text-[14px] font-medium text-brand-navy-700 hover:text-primary"
                  >
                    <span className="min-w-0 truncate">{resource.label}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-primary">
                      Use tool <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/support/resources"
              className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-plum-700 hover:text-brand-plum-800"
            >
              See all tools <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}

      {recommended.length > 0 && (
        <section aria-label="Recommended resources" className="mt-9">
          <SectionHeader
            icon={BookOpen}
            title="Recommended resources"
            subtitle="Curated reads and videos connected to your current focus."
            right={
              <Link
                href="/support/resources"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-plum-700 hover:text-brand-plum-800"
              >
                See all resources <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <ul className="mt-1 divide-y divide-surface-border">
            {recommended.map((resource, index) => (
              <li key={resource.href}>
                <Link
                  href={resource.href}
                  className="flex items-center justify-between gap-3 py-3 hover:text-primary"
                >
                  <span className="min-w-0 truncate text-[14px] font-medium text-brand-navy-700">
                    {resource.label}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-warm-100 px-2.5 py-0.5 text-[11px] font-semibold text-brand-muted-700">
                    {index === 1 ? 'Video (3 min)' : 'Article'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        aria-label="Plan actions"
        className="mt-9 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 rounded-2xl bg-brand-plum-50 px-4 py-3 text-[13px] font-semibold text-brand-plum-700 print:hidden sm:gap-x-4"
      >
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 hover:text-brand-plum-800"
        >
          <Printer className="h-4 w-4" /> Print my plan
        </button>
        <span aria-hidden className="text-brand-plum-200">
          |
        </span>
        <button
          type="button"
          onClick={() => setEmailOpen(true)}
          className="inline-flex items-center gap-1.5 hover:text-brand-plum-800"
        >
          <Mail className="h-4 w-4" /> Email my plan
        </button>
        <span aria-hidden className="text-brand-plum-200">
          |
        </span>
        <Link
          href={CHECK_IN_HREF}
          className="inline-flex items-center gap-1.5 hover:text-brand-plum-800"
        >
          <RefreshCw className="h-4 w-4" /> Check in &amp; update
        </Link>
        <span aria-hidden className="text-brand-plum-200">
          |
        </span>
        <Link
          href={INTAKE_HREF}
          className="inline-flex items-center gap-1.5 hover:text-brand-plum-800"
        >
          <Pencil className="h-4 w-4" /> Edit concerns
        </Link>
      </section>

      <p className="mt-6 text-[11.5px] leading-relaxed text-brand-muted-500">
        Saved privately on this device. Clearing your browser data removes it. Common
        Ground is parent support — it does not diagnose, treat, or replace clinical care.
      </p>

      <EmailPlanDialog
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        plan={plan}
        latestCheckIn={latestCheckIn}
      />
    </Shell>
  );
}
