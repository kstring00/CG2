'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
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
  Search,
  Sparkles,
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
import EmailPlanDialog from '@/components/EmailPlanDialog';
import WeeklyProgressMeter from '@/components/WeeklyProgressMeter';
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
 * Persistent care plan view — the *result* of the intake flow.
 *
 *   /support/intake     → on-ramp (the questions)
 *   /support/care-plan  → outcome (saved + revisitable)
 *
 * Presentation only. All recommendations come from the saved plan; this page
 * never recomputes scoring. Where it limits how many items show, it slices the
 * already-computed arrays for display.
 */
export default function CarePlanPage() {
  const [hydrated, setHydrated] = useState(false);
  const [plan, setPlan] = useState<SavedCarePlan | null>(null);

  useEffect(() => {
    setHydrated(true);
    setPlan(loadCarePlan());
  }, []);

  if (!hydrated) {
    return <Shell><div className="h-40 animate-pulse rounded-2xl bg-surface-subtle" /></Shell>;
  }

  if (!plan) return <EmptyState />;

  return <PopulatedPlan plan={plan} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
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
        <p className="mt-3 text-[15px] leading-relaxed text-brand-muted-700">
          A few honest questions, and we&rsquo;ll put together a small starting point
          for the week ahead. Three minutes, no sign-up, no clinical paperwork.
        </p>
        <Link
          href="/support/intake"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4" /> Start Find My Next Step <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-4 text-[13px] text-brand-muted-500">
          Saved privately on this device. You can change it anytime.
        </p>
      </div>
    </Shell>
  );
}

// ---------------------------------------------------------------------------
// Presentation helpers (no scoring/logic — display only)
// ---------------------------------------------------------------------------

const INTAKE_HREF = '/support/intake';
const CHECK_IN_HREF = '/support/check-in';

/** Icon per key-concern, mirroring the intake page so the two stay in sync. */
const HARDEST_ICONS: Record<Hardest, React.ComponentType<{ className?: string }>> = {
  'understanding-aba': Brain,
  'behavior-home': Home,
  'overwhelmed': Heart,
  'finding-resources': Search,
  'financial-insurance': DollarSign,
  'siblings': Users,
  'connecting-parents': HeartHandshake,
  'school-iep': GraduationCap,
};

const HARDEST_LABEL_BY_VALUE: Record<string, string> = Object.fromEntries(
  HARDEST_OPTIONS.map((o) => [o.value, o.label]),
);

/** Soft color tint per bucket for the small category pill. */
const BUCKET_PILL: Record<StepBucket, string> = {
  'do-today': 'bg-brand-plum-50 text-brand-plum-700',
  'ask-bcba': 'bg-brand-purple-50 text-brand-purple-500',
  'try-home': 'bg-emerald-50 text-emerald-700',
  'save-resource': 'bg-brand-warm-100 text-brand-muted-700',
  'next-week': 'bg-sky-50 text-sky-700',
};

/** Link-style CTA verb per bucket — reuses the bucket's intent. */
const BUCKET_CTA: Record<StepBucket, string> = {
  'do-today': 'Start here',
  'ask-bcba': 'Find help',
  'try-home': 'Open guide',
  'save-resource': 'Browse guides',
  'next-week': 'Open guide',
};

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
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className={className}>
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
    <p className="mt-2 rounded-xl border border-brand-plum-100 bg-brand-plum-50/60 px-3 py-2 text-[12px] leading-relaxed text-brand-muted-700">
      <span className="font-semibold text-brand-plum-800">Why this is worth trying: </span>
      {evidence.text}
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
    <div className="border-b border-brand-plum-100 pb-2.5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <h2 className="text-lg font-bold leading-tight text-brand-navy-700 sm:text-xl">
            {title}
          </h2>
        </div>
        {right}
      </div>
      {subtitle && (
        <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-600">
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
  const weekNumber = checkInState
    ? computeWeekNumber(checkInState.planStartedAt)
    : 1;

  const weekView = useMemo(
    () =>
      getCarePlanWeekView(
        plan,
        weekNumber,
        completedKeys,
        legacyHrefs,
        loadPreviousWeeklyProgress()?.lastSupportNudgeThread ?? null,
      ),
    [plan, weekNumber, completedKeys, legacyHrefs],
  );

  useEffect(() => {
    if (weekView.supportNudgeThread) {
      recordSupportNudgeThread(weekView.supportNudgeThread);
    }
  }, [weekView.supportNudgeThread]);

  const topSteps = weekView.activeSteps;
  const weekTwoIntro = useMemo(
    () => (weekView.weekTwoUnlocked ? getWeekTwoGuideIntro(plan.answers) : null),
    [plan.answers, weekView.weekTwoUnlocked],
  );
  const prevWeekProgress = useMemo(() => loadPreviousWeeklyProgress(), [completedKeys]);
  const lastWeekDone = useMemo(
    () => completedStepTitles(allBucketSteps, prevWeekProgress),
    [allBucketSteps, prevWeekProgress],
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

  const isStepDone = (step: CarePlanStep) =>
    isStepComplete(step, completedKeys, legacyHrefs, allBucketSteps);
  const doneCount = topSteps.filter(isStepDone).length;

  // The page computes one resources array; split it for the two lower cards
  // and the resources strip. There is no dedicated "tools" source, so the
  // left/right split is a presentational slice of the same resource list.
  const resources = plan.resources;
  const weekActions = resources.slice(0, 3);
  const toolItems = resources.slice(3, 6).length
    ? resources.slice(3, 6)
    : resources.slice(0, 3);
  const recommended = resources.slice(0, 3);

  const concerns = (plan.answers.hardest ?? []) as Hardest[];

  const latestCheckIn = checkInState && checkInState.history.length
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
      {/* Weekly progress — top of the care-plan area, only when a plan exists */}
      <WeeklyProgressMeter variant="panel" className="mb-5" />

      {/* 1) TOP — breadcrumb, title, subtitle, saved note */}
      <nav aria-label="Breadcrumb" className="text-[12px] text-brand-muted-500">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/support" className="hover:text-brand-navy-700">Home</Link>
          </li>
          <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
          <li className="font-medium text-brand-muted-700">My Family Care Plan</li>
        </ol>
      </nav>

      <header className="mt-3">
        <h1 className="text-3xl font-bold leading-tight text-brand-navy-700 sm:text-4xl">
          <span className="inline-block border-b-[3px] border-brand-plum-300 pb-0.5">Your plan</span>,
          simplified
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-muted-700">
          {plan.summary || 'A clear, step-by-step plan that fits your life. You can change it anytime.'}
        </p>
        <p className="mt-1.5 text-[12px] text-brand-muted-500">
          Last updated {updatedDisplay} · Saved privately on this device
        </p>
      </header>

      {/* 2) KEY CONCERNS STRIP */}
      {concerns.length > 0 && (
        <section
          aria-label="Your key concerns"
          className="mt-5 rounded-2xl bg-brand-plum-50 px-4 py-3 sm:px-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
                Your key concerns
              </p>
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {concerns.map((c) => {
                  const Icon = HARDEST_ICONS[c];
                  return (
                    <li
                      key={c}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-navy-700"
                    >
                      {Icon && <Icon className="h-3.5 w-3.5 text-brand-plum-600" />}
                      {HARDEST_LABEL_BY_VALUE[c] ?? c}
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

      {lastWeekDone.length > 0 && (
        <section
          aria-label="Last week recap"
          className="mt-5 rounded-2xl border border-surface-border bg-surface-muted/40 px-4 py-3 sm:px-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
            Last week you finished
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {lastWeekDone.map((title) => (
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

      {weekView.weekTwoUnlocked && weekTwoIntro && (
        <section
          aria-label="Arc week guide"
          className="mt-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-5 sm:p-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Week {weekView.arcWeekNumber} · {weekView.arcPhase}
          </p>
          <h2 className="mt-1 text-lg font-bold text-brand-navy-700">
            {weekView.arcTheme}
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-brand-muted-700">
            {weekTwoIntro.body}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href={CHECK_IN_HREF}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
            >
              Start your next check-in <ArrowRight className="h-4 w-4" />
            </Link>
            <AdmissionsHandoff compact />
          </div>
        </section>
      )}

      {!weekView.weekTwoUnlocked && (
        <section
          aria-label="Arc week theme"
          className="mt-5 rounded-2xl border border-brand-plum-100 bg-brand-plum-50/50 px-4 py-3 sm:px-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
            Week {weekView.arcWeekNumber} · {weekView.arcPhase}
          </p>
          <p className="mt-1 text-[15px] font-semibold text-brand-navy-700">{weekView.arcTheme}</p>
        </section>
      )}

      {/* "Support alongside your plan" panel removed pending clinical
          director review — caregiver mental-health content lives only under
          Parent Support and never appears inside a generated care plan. */}
      <div className="mt-8">
        <div>
      {/* 3) START HERE — the strongest section, numbered list */}
      <section aria-label="Start here">
        <SectionHeader
          icon={Flag}
          title="Start here"
          subtitle={
            weekView.weekTwoUnlocked
              ? `Week ${weekView.arcWeekNumber} — ${weekView.arcTheme.toLowerCase()}.`
              : 'Your top priority steps for this week.'
          }
          right={
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white">
                1
              </span>
              <span className="text-[12px] font-semibold text-brand-muted-600">
                {doneCount} of {topSteps.length} steps done
              </span>
            </div>
          }
        />

        <ol className="mt-1 divide-y divide-surface-border">
          {topSteps.map((step, i) => {
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
                  (isDone
                    ? 'bg-emerald-50/50 px-3 -mx-3 opacity-90'
                    : '')
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
                  {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
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
                      {isExternal && <span className="sr-only"> (opens in new tab)</span>}
                    </StepLink>
                  </div>

                  <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-600">
                    {step.because ?? step.why}
                  </p>

                  {step.evidence && <EvidenceStrip evidence={step.evidence} />}

                  {showAdmissions && step.id !== 'admissionsConsult' && (
                    <div className="mt-2">
                      <AdmissionsHandoff compact />
                    </div>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    {bucket && (
                      <span
                        className={
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ' +
                          BUCKET_PILL[bucket]
                        }
                      >
                        {BUCKET_LABELS[bucket]}
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
          aria-label="Saved for next week"
          className="mt-6 rounded-2xl border border-dashed border-sky-200 bg-sky-50/40 p-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
            Saved for next week
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-600">
            These become your week-two guide once you finish the steps above.
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
                    {step.because ?? step.why}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      )}

        </div>
      </div>

      <div className="mt-6 print:hidden">
        <AdmissionsHandoff />
      </div>

      {/* 4) LOWER — two compact columns */}
      {resources.length > 0 && (
        <section aria-label="This week and tools" className="mt-9 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft">
            <SectionHeader
              icon={CalendarDays}
              title="Do this this week"
              subtitle="Helpful actions to make progress."
            />
            <ul className="mt-1 divide-y divide-surface-border">
              {weekActions.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="flex items-center justify-between gap-3 py-3 text-[14px] font-medium text-brand-navy-700 hover:text-primary"
                  >
                    <span className="min-w-0 truncate">{r.label}</span>
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
              subtitle="Calculators, templates & checklists."
            />
            <ul className="mt-1 divide-y divide-surface-border">
              {toolItems.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="flex items-center justify-between gap-3 py-3 text-[14px] font-medium text-brand-navy-700 hover:text-primary"
                  >
                    <span className="min-w-0 truncate">{r.label}</span>
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

      {/* 5) RECOMMENDED RESOURCES — short list, not cards */}
      {recommended.length > 0 && (
        <section aria-label="Recommended resources" className="mt-9">
          <SectionHeader
            icon={BookOpen}
            title="Recommended resources"
            subtitle="Curated reads and videos from our team."
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
            {recommended.map((r, i) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="flex items-center justify-between gap-3 py-3 hover:text-primary"
                >
                  <span className="min-w-0 truncate text-[14px] font-medium text-brand-navy-700">
                    {r.label}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-warm-100 px-2.5 py-0.5 text-[11px] font-semibold text-brand-muted-700">
                    {i === 1 ? 'Video (3 min)' : 'Article'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 6) BOTTOM — slim action bar */}
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
        <span aria-hidden className="text-brand-plum-200">|</span>
        <button
          type="button"
          onClick={() => setEmailOpen(true)}
          className="inline-flex items-center gap-1.5 hover:text-brand-plum-800"
        >
          <Mail className="h-4 w-4" /> Email my plan
        </button>
        <span aria-hidden className="text-brand-plum-200">|</span>
        <Link
          href={INTAKE_HREF}
          className="inline-flex items-center gap-1.5 hover:text-brand-plum-800"
        >
          <Pencil className="h-4 w-4" /> Update my plan
        </Link>
      </section>

      <p className="mt-6 text-[11.5px] leading-relaxed text-brand-muted-500">
        Saved privately on this device. Clearing your browser data removes it.
        Common Ground is parent support — it does not diagnose, treat, or
        replace clinical care.
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
