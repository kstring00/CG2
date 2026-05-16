'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  CalendarCheck,
  Check,
  Compass,
  Mail,
  Printer,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  clearCarePlan,
  loadCarePlan,
  type SavedCarePlan,
  type StepBucket,
} from '@/lib/carePlanStorage';
import {
  freshnessLabel,
  loadBandwidth,
  shouldShowCrisisCallout,
  shouldShowSupportCard,
  TIER_LABEL,
  TIER_RESULT_COPY,
  TIER_STEP_LIMIT,
  TIER_THEME,
  type BandwidthResult,
} from '@/lib/bandwidth';
import { cn } from '@/lib/utils';
import {
  BUCKET_BLURBS,
  BUCKET_LABELS,
  generateBucketSteps,
} from '@/lib/generateNextSteps';
import PathfinderCard from '@/components/PathfinderCard';
import EmailPlanDialog from '@/components/EmailPlanDialog';
import JourneyStepper from '@/components/JourneyStepper';
import { inferJourneyStage } from '@/lib/journeyStage';
import {
  clearRemindMeNextWeek,
  isRemindMeSet,
  setRemindMeNextWeek,
} from '@/lib/remindMe';
import { useWellnessState } from '@/lib/wellnessState';
import {
  computeWeekNumber,
  ensurePlanStarted,
  formatShortDate,
  hasCheckedInThisWeek,
  loadCheckInState,
  type WeeklyCheckInState,
} from '@/lib/weeklyCheckIn';

/**
 * Persistent care plan view — the *result* of the intake flow.
 *
 *   /support/intake     → on-ramp (the questions)
 *   /support/care-plan  → outcome (saved + revisitable)
 */
export default function CarePlanPage() {
  const [hydrated, setHydrated] = useState(false);
  const [plan, setPlan] = useState<SavedCarePlan | null>(null);
  const [bandwidth, setBandwidth] = useState<BandwidthResult | null>(null);

  useEffect(() => {
    setHydrated(true);
    setPlan(loadCarePlan());
    setBandwidth(loadBandwidth());
  }, []);

  if (!hydrated) {
    return <Shell><div className="h-40 animate-pulse rounded-2xl bg-surface-subtle" /></Shell>;
  }

  if (!plan) return <EmptyState />;

  return (
    <PopulatedPlan
      plan={plan}
      bandwidth={bandwidth}
      onCleared={() => setPlan(null)}
    />
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
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

function PopulatedPlan({
  plan,
  bandwidth,
  onCleared,
}: {
  plan: SavedCarePlan;
  bandwidth: BandwidthResult | null;
  onCleared: () => void;
}) {
  const { state: wellness } = useWellnessState();
  const [checkInState, setCheckInState] = useState<WeeklyCheckInState | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [remindSet, setRemindSet] = useState(false);

  useEffect(() => {
    setCheckInState(ensurePlanStarted(plan.createdAt));
    setRemindSet(isRemindMeSet());
  }, [plan.createdAt]);

  const bucketSteps = useMemo(() => generateBucketSteps(plan.answers), [plan.answers]);

  // Gate the rendered count of priority steps by current bandwidth tier so a
  // heavy day shows a smaller plan even if the saved plan has more steps.
  const tier = bandwidth?.tier ?? 'doing-well';
  const stepLimit = TIER_STEP_LIMIT[tier];
  const visibleSteps = useMemo(
    () => plan.steps.slice(0, stepLimit),
    [plan.steps, stepLimit],
  );

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleToggleRemind = () => {
    if (remindSet) {
      clearRemindMeNextWeek();
      setRemindSet(false);
    } else {
      setRemindMeNextWeek(7);
      setRemindSet(true);
    }
  };

  const handleClear = () => {
    if (typeof window === 'undefined') return;
    const ok = window.confirm('Clear your saved plan? You can re-run the intake to build a new one.');
    if (!ok) return;
    clearCarePlan();
    onCleared();
  };

  const weekNumber = checkInState ? computeWeekNumber(checkInState.planStartedAt) : null;
  const lastCheckIn = checkInState ? formatShortDate(checkInState.lastCheckInAt) : null;
  const checkedInThisWeek = checkInState ? hasCheckedInThisWeek(checkInState) : false;
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
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
          My Family Care Plan
        </p>
        <h1 className="mt-1 text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
          Your plan, friend.
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-brand-muted-700">
          Built from what you told us. You can change it anytime.
        </p>
        <p className="mt-1 text-[12px] text-brand-muted-500">
          Last updated {updatedDisplay} · saved privately on this device.
        </p>
      </header>

      {/* Soft "where am I?" anchor — inferred from saved intake answers. */}
      <div className="mt-5">
        <JourneyStepper activeStage={inferJourneyStage(plan.answers)} compact />
      </div>

      {/* Today's bandwidth — the single visible summary of the parent's most
          recent check-in, with a low-friction way to update it. */}
      <BandwidthSummaryCard bandwidth={bandwidth} />

      {bandwidth && shouldShowCrisisCallout(bandwidth.tier) && (
        <section
          className="mt-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 sm:p-5"
          aria-label="If today feels unsafe"
        >
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" aria-hidden />
          <div className="text-[13.5px] leading-relaxed text-rose-900">
            <p className="font-semibold">If today feels unsafe for you or your child, please reach out for live support.</p>
            <p className="mt-1">
              Call or text <a href="tel:988" className="underline">988</a> (Suicide &amp; Crisis Lifeline) or contact your BCBA or care team. Common Ground is parent support — not a crisis service.
            </p>
          </div>
        </section>
      )}

      {bandwidth && shouldShowSupportCard(bandwidth.tier) && (
        <section
          className="mt-4 rounded-2xl border border-brand-warm-200 bg-brand-warm-50/60 p-5 sm:p-6"
          aria-label="Live support suggestion"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-warm-700">
            A gentle suggestion
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-800">
            Today is heavy. Before you tackle anything from this plan, consider looping in your BCBA or someone on your care team — a 10-minute phone call can lift more weight than five tools combined.
          </p>
          <Link
            href="/support/parent-connection"
            className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-warm-800 hover:text-brand-warm-900"
          >
            Find a live support option <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      )}

      {weekNumber !== null && (
        <section
          aria-label={`You are in week ${weekNumber} of your plan.`}
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/60 px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <CalendarCheck className="h-5 w-5 shrink-0 text-brand-plum-700" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-brand-plum-800">
                Week {weekNumber}
                {checkedInThisWeek && lastCheckIn ? ` · checked in ${lastCheckIn}` : ''}
              </p>
              <p className="text-[12.5px] text-brand-plum-700/80">
                {checkedInThisWeek
                  ? 'You’re up to date for this week. The plan adjusts as your check-ins build up.'
                  : 'A short check-in keeps your plan honest. Takes about 2 minutes.'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/support/check-in"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-[13px] font-semibold text-white shadow-soft transition hover:bg-primary/90"
            >
              {checkedInThisWeek ? 'Revisit check-in' : 'Start check-in'} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setEmailOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand-plum-300 bg-white px-3.5 py-2 text-[13px] font-semibold text-brand-plum-700 transition hover:bg-brand-plum-50"
            >
              <Mail className="h-3.5 w-3.5" /> Email my plan
            </button>
          </div>
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
          Start Here
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-brand-muted-800">
          {plan.summary}
        </p>
      </section>

      {/* Gentle clinical-scope disclaimer requested by the CCO. Lives directly
          above the recommended steps so it sets framing before any action. */}
      <section className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
        <p className="text-[13.5px] leading-relaxed text-amber-900">
          Here is a simple starting point. Bring anything serious, unsafe, or
          confusing to your BCBA or care team. Common Ground is parent support
          — it does not diagnose, treat, or replace clinical care.
        </p>
      </section>

      {/* Quick actions row — print/PDF + remind-me + email. All client-side; no
          backend is wired up for email or push, so the email button opens the
          existing dialog that handles the "not configured" path gracefully. */}
      <section
          className="mt-4 flex flex-wrap items-center gap-2 print:hidden"
          aria-label="Plan actions"
      >
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-white px-3.5 py-2 text-[13px] font-semibold text-brand-muted-700 transition hover:border-primary/40 hover:text-brand-navy-700"
        >
          <Printer className="h-3.5 w-3.5" /> Print or save as PDF
        </button>
        <button
          type="button"
          onClick={handleToggleRemind}
          aria-pressed={remindSet}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition ${
            remindSet
              ? 'border-brand-plum-300 bg-brand-plum-50 text-brand-plum-800'
              : 'border-surface-border bg-white text-brand-muted-700 hover:border-primary/40 hover:text-brand-navy-700'
          }`}
        >
          {remindSet ? <Check className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
          {remindSet ? 'Reminder set for next week' : 'Remind me next week'}
        </button>
        <button
          type="button"
          onClick={() => setEmailOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-white px-3.5 py-2 text-[13px] font-semibold text-brand-muted-700 transition hover:border-primary/40 hover:text-brand-navy-700"
        >
          <Mail className="h-3.5 w-3.5" /> Email my plan
        </button>
      </section>

      {/* 5-BUCKET PLAN — CCO-requested framing. Each bucket gets one suggested
          step so a parent can scan today/BCBA/home/save/next-week in one pass. */}
      <section className="mt-6" aria-label="Your plan in five small parts">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
          Your plan, in five small parts
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-muted-600">
          One thing per bucket. You don’t have to do all of them — pick what fits today.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {bucketSteps.map(({ bucket, step }) => (
            <BucketCard key={bucket} bucket={bucket} step={step} />
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
            Your priority steps
          </h2>
          {bandwidth && (
            <p className="text-[12px] text-brand-muted-500">
              Sized for today &middot; {visibleSteps.length} of {plan.steps.length}
            </p>
          )}
        </div>
        {visibleSteps.map((step, i) => (
          <div
            key={step.title}
            className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Step {i + 1}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-brand-navy-700">
              {step.title}
            </h3>
            {step.because && (
              <p className="mt-1 inline-block rounded-full bg-brand-plum-50 px-2.5 py-0.5 text-[12px] font-semibold text-brand-plum-700">
                {step.because}
              </p>
            )}
            <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-700">
              {step.why}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link
                href={step.href}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
              >
                Start this step <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                className="text-[13px] font-medium text-brand-muted-500 hover:text-brand-muted-800"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.alert('Skipped for now. Nothing happens to your plan — pick this back up whenever you want.');
                  }
                }}
              >
                Skip for now
              </button>
            </div>
          </div>
        ))}
      </section>

      {plan.resources.length > 0 && (
        <section className="mt-8 rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
          <h2 className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Tools we picked for you
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {plan.resources.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="flex items-center justify-between gap-3 rounded-xl border border-surface-border bg-surface-muted/40 px-4 py-3 text-[14px] font-medium text-brand-muted-800 transition hover:border-primary/40 hover:bg-primary/5 hover:text-brand-navy-700"
                >
                  <span>{r.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-brand-muted-400" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {plan.noteEchoes && plan.noteEchoes.length > 0 && (
        <section className="mt-6 rounded-2xl border border-brand-warm-200 bg-brand-warm-50/60 p-5 sm:p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-600">
            What you wrote, reflected back
          </h2>
          <ul className="mt-3 space-y-2">
            {plan.noteEchoes.map((e) => (
              <li key={e.phrase} className="flex items-start gap-2 text-[14px] leading-relaxed text-brand-muted-800">
                <span className="mt-0.5 inline-flex shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-brand-plum-700 ring-1 ring-brand-plum-200">
                  {e.phrase}
                </span>
                <span>{e.reflection}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {plan.weekMessage && (
        <section className="mt-6 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/60 p-5 sm:p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
            For You, This Week
          </h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-brand-plum-800">
            {plan.weekMessage}
          </p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
          Your Pathfinder
        </h2>
        <div className="mt-3">
          <PathfinderCard />
        </div>
      </section>

      {wellness.hasData && wellness.historyLen >= 3 && (
        <section className="mt-8 rounded-2xl border border-surface-border bg-surface-muted/40 p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
            From Your Check-Ins
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-700">
            {wellness.trend === 'declining'
              ? 'Your check-ins from the last few weeks suggest things have felt heavier. We ordered your steps to start with the lighter ones.'
              : wellness.trend === 'improving'
              ? 'Your check-ins suggest things have steadied a little. These next steps build on that — they don’t replace it.'
              : 'Your check-ins look fairly steady. These steps are a way to keep momentum without adding load.'}
          </p>
        </section>
      )}

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-6">
        <Link
          href="/support/intake"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
        >
          <RefreshCcw className="h-4 w-4" /> Update my plan
        </Link>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-brand-muted-500 hover:text-accent"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear plan
        </button>
      </footer>

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

/**
 * Today's bandwidth summary — the one canonical surface on the care plan that
 * shows the parent's last check-in and offers a low-friction way to update it.
 * When no check-in has been taken yet, it nudges them into the standalone
 * /support/check-in page.
 */
function BandwidthSummaryCard({ bandwidth }: { bandwidth: BandwidthResult | null }) {
  if (!bandwidth) {
    return (
      <section
        aria-label="Today's bandwidth check"
        className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-border bg-white px-5 py-4 shadow-soft"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
            Today&rsquo;s bandwidth
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-brand-muted-700">
            Take a quick 30-second check so we can size your plan to the day.
          </p>
        </div>
        <Link
          href="/support/check-in?from=/support/care-plan"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-[13px] font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          Quick bandwidth check <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    );
  }

  const theme = TIER_THEME[bandwidth.tier];
  const freshness = freshnessLabel(bandwidth);

  return (
    <section
      aria-label={`Today's bandwidth: ${TIER_LABEL[bandwidth.tier]}`}
      className={cn(
        'mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4',
        theme.bg,
        theme.border,
      )}
    >
      <div className="min-w-0">
        <p className={cn('text-[11px] font-semibold uppercase tracking-[0.18em]', theme.text)}>
          <span aria-hidden className={cn('mr-1.5 inline-block h-2 w-2 rounded-full align-middle', theme.dot)} />
          Today&rsquo;s bandwidth &middot; {TIER_LABEL[bandwidth.tier]}
        </p>
        <p className={cn('mt-1 text-[13.5px] leading-relaxed', theme.text)}>
          {TIER_RESULT_COPY[bandwidth.tier]}
        </p>
        <p className="mt-1 text-[11.5px] text-brand-muted-500">{freshness}</p>
      </div>
      <Link
        href="/support/check-in?from=/support/care-plan"
        className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-white px-3.5 py-2 text-[13px] font-semibold text-brand-muted-700 transition hover:border-primary/40 hover:text-brand-navy-700"
      >
        <RefreshCcw className="h-3.5 w-3.5" /> Update check-in
      </Link>
    </section>
  );
}

/** A single bucket tile in the 5-bucket plan grid. Renders an empty state
 *  when no candidate filled this bucket so the framing is preserved. */
function BucketCard({
  bucket,
  step,
}: {
  bucket: StepBucket;
  step: { title: string; why: string; href: string; because?: string } | null;
}) {
  const label = BUCKET_LABELS[bucket];
  const blurb = BUCKET_BLURBS[bucket];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-surface-border bg-white p-4 shadow-soft sm:p-5">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-brand-plum-700">
        {label}
      </p>
      <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-500">
        {blurb}
      </p>
      {step ? (
        <>
          <h3 className="mt-3 text-[15px] font-semibold leading-snug text-brand-navy-700">
            {step.title}
          </h3>
          {step.because && (
            <p className="mt-1 inline-block self-start rounded-full bg-brand-plum-50 px-2 py-0.5 text-[11px] font-semibold text-brand-plum-700">
              {step.because}
            </p>
          )}
          <p className="mt-2 text-[13px] leading-relaxed text-brand-muted-700">
            {step.why}
          </p>
          <div className="mt-auto pt-3">
            <Link
              href={step.href}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-primary/80"
            >
              Open this step <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </>
      ) : (
        <p className="mt-3 text-[13px] leading-relaxed text-brand-muted-500">
          Nothing pulled in for this one yet. That’s fine — it just means the
          rest of the plan is enough for now.
        </p>
      )}
    </div>
  );
}
