'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  getWeeklyProgressSummary,
  WEEKLY_PROGRESS_EVENT,
  type WeeklyProgressSummary,
} from '@/lib/weeklyProgress';

/**
 * Always-visible weekly progress meter.
 *
 * The meter has 1 notch for the weekly intake/check-in plus 1 notch per
 * priority plan step (so a 3-step plan = 4 notches). It empties every Monday
 * and refills as the parent finishes the week's check-in and works through
 * their plan steps.
 *
 * Two variants:
 *   - `variant="rail"`   compact one-line strip for the layout shell
 *   - `variant="panel"`  larger card for the care plan / dashboard
 */
type Variant = 'rail' | 'panel';

type Props = {
  variant?: Variant;
  className?: string;
};

function useWeeklySummary(): WeeklyProgressSummary | null {
  const [summary, setSummary] = useState<WeeklyProgressSummary | null>(null);

  useEffect(() => {
    function recompute() {
      try {
        setSummary(getWeeklyProgressSummary());
      } catch {
        setSummary(null);
      }
    }
    recompute();

    function onStorage(e: StorageEvent) {
      if (
        e.key === null ||
        e.key.startsWith('cg.weeklyProgress') ||
        e.key === 'cg.bandwidth.v1' ||
        e.key === 'cg.carePlan.v1'
      ) {
        recompute();
      }
    }
    window.addEventListener('storage', onStorage);

    // Same-tab updates: any markStepDone/markWeeklyIntakeDone in the current
    // tab dispatches this so every mounted meter (rail + panel) re-reads
    // immediately.
    window.addEventListener(WEEKLY_PROGRESS_EVENT, recompute);

    // Recompute when the tab regains focus — covers the case where a parent
    // came back to the tab on a new day / week and the meter needs to roll over.
    function onVisible() {
      if (document.visibilityState === 'visible') recompute();
    }
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(WEEKLY_PROGRESS_EVENT, recompute);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return summary;
}

export default function WeeklyProgressMeter({
  variant = 'rail',
  className,
}: Props) {
  const summary = useWeeklySummary();
  if (!summary) return null;

  if (variant === 'panel') {
    return <PanelMeter summary={summary} className={className} />;
  }
  return <RailMeter summary={summary} className={className} />;
}

function MeterTrack({ summary }: { summary: WeeklyProgressSummary }) {
  const { totalNotches, filledNotches } = summary;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={totalNotches}
      aria-valuenow={filledNotches}
      aria-label={`Week progress: ${filledNotches} of ${totalNotches} steps complete`}
      className="flex w-full items-center gap-1.5"
    >
      {Array.from({ length: totalNotches }).map((_, i) => {
        const filled = i < filledNotches;
        const isIntake = i === 0;
        return (
          <span
            key={i}
            className={[
              'h-2 flex-1 rounded-full transition-colors duration-300',
              filled
                ? isIntake
                  ? 'bg-brand-plum-600'
                  : 'bg-primary'
                : 'bg-stone-200',
            ].join(' ')}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

function RailMeter({
  summary,
  className,
}: {
  summary: WeeklyProgressSummary;
  className?: string;
}) {
  const {
    filledNotches,
    totalNotches,
    nextLabel,
    nextHref,
    weekComplete,
    intakeDoneThisWeek,
    completedStepHrefs,
  } = summary;
  const planStepCount = Math.max(0, totalNotches - 1);
  const stepsDone = completedStepHrefs.length;

  return (
    <section
      aria-label={`Weekly progress: ${filledNotches} of ${totalNotches} notches filled (1 weekly check-in + ${planStepCount} plan ${planStepCount === 1 ? 'step' : 'steps'})`}
      className={[
        'rounded-2xl border border-surface-border bg-white p-3 shadow-soft sm:p-4',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
              This week
            </p>
            <span className="text-[11px] font-semibold text-brand-muted-700">
              {filledNotches} of {totalNotches} done
            </span>
            <span className="hidden text-[10.5px] text-brand-muted-500 sm:inline">
              · check-in {intakeDoneThisWeek ? '✓' : '○'} + {stepsDone}/{planStepCount} plan {planStepCount === 1 ? 'step' : 'steps'}
            </span>
            {weekComplete && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> Week complete
              </span>
            )}
          </div>
          <div className="mt-2">
            <MeterTrack summary={summary} />
          </div>
          <p className="mt-2 truncate text-[12.5px] text-brand-muted-700">
            {weekComplete ? (
              <span>
                You finished this week&rsquo;s check-in and all {planStepCount} plan {planStepCount === 1 ? 'step' : 'steps'}. The meter resets Monday.
              </span>
            ) : !intakeDoneThisWeek ? (
              <span>
                <span className="font-semibold text-brand-plum-700">Start here:</span>{' '}
                this week&rsquo;s check-in is notch 1 of {totalNotches}.
              </span>
            ) : (
              <span>
                <span className="font-semibold text-primary">Up next:</span>{' '}
                {nextLabel}
              </span>
            )}
          </p>
        </div>
        <Link
          href={nextHref}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[12.5px] font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          {weekComplete ? 'Open my plan' : !intakeDoneThisWeek ? 'Start check-in' : 'Next step'}{' '}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}

function PanelMeter({
  summary,
  className,
}: {
  summary: WeeklyProgressSummary;
  className?: string;
}) {
  const {
    filledNotches,
    totalNotches,
    nextLabel,
    nextHref,
    weekComplete,
    intakeDoneThisWeek,
    noPlanYet,
    completedStepHrefs,
  } = summary;
  const planStepCount = Math.max(0, totalNotches - 1);
  const stepsDone = completedStepHrefs.length;

  return (
    <section
      aria-label={`Weekly progress: ${filledNotches} of ${totalNotches} notches filled`}
      className={[
        'rounded-3xl border border-surface-border bg-white p-5 shadow-soft sm:p-6',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-muted-500">
            Where you are this week
          </p>
          <h2 className="mt-1 text-xl font-semibold text-brand-navy-700 sm:text-2xl">
            {weekComplete
              ? 'You finished this week’s plan.'
              : !intakeDoneThisWeek
              ? 'Start with this week’s check-in.'
              : 'Keep going — one step at a time.'}
          </h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-muted-700">
            The meter has <span className="font-semibold text-brand-muted-900">{totalNotches}</span> notches this week:
            {' '}1 for the weekly check-in + {planStepCount} for your priority plan {planStepCount === 1 ? 'step' : 'steps'}.
            It empties every Monday.
          </p>
        </div>
        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-brand-muted-700">
          {filledNotches} / {totalNotches}
        </span>
      </div>

      <div className="mt-4">
        <MeterTrack summary={summary} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-brand-muted-600">
        <span className="inline-flex items-center gap-1">
          <span
            aria-hidden
            className={
              'inline-block h-2 w-2 rounded-full ' +
              (intakeDoneThisWeek ? 'bg-brand-plum-600' : 'bg-stone-300')
            }
          />
          Check-in {intakeDoneThisWeek ? 'done' : 'not yet'}
        </span>
        <span aria-hidden className="text-brand-muted-300">·</span>
        <span className="inline-flex items-center gap-1">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-primary" />
          Plan steps: {stepsDone} of {planStepCount} done
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-brand-muted-700">
          {weekComplete ? (
            <span>Lovely. Come back Monday for a fresh check-in.</span>
          ) : noPlanYet ? (
            <span>
              <span className="font-semibold text-brand-plum-700">Next:</span> build a plan so
              the meter has steps to track.
            </span>
          ) : !intakeDoneThisWeek ? (
            <span>
              <span className="font-semibold text-brand-plum-700">Next:</span> this week&rsquo;s
              check-in — that&rsquo;s notch 1 of {totalNotches}.
            </span>
          ) : (
            <span>
              <span className="font-semibold text-primary">Up next:</span> {nextLabel}{' '}
              <span className="text-brand-muted-500">
                (notch {filledNotches + 1} of {totalNotches})
              </span>
            </span>
          )}
        </p>
        <Link
          href={nextHref}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-[13px] font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          {weekComplete
            ? 'Open my plan'
            : noPlanYet
            ? 'Build my plan'
            : !intakeDoneThisWeek
            ? 'Start check-in'
            : 'Open next step'}{' '}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
