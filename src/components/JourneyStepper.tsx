'use client';

/**
 * <JourneyStepper> — a soft, low-pressure visual of the six common stops on
 * the autism parenting road. It is not a progress bar, not a quiz, and never
 * "wrong". The intent is to quietly answer "where am I, roughly?" while
 * keeping the next stop visible without committing the parent to a path.
 *
 * Mounts on the homepage, intake top, care plan top, and parent support top.
 *
 * CCO round 2: this component also carries the soft check-in nudge — a small
 * pill in the header that surfaces "last checked in: X days ago · update" so
 * the weekly check-in becomes part of the same companion that's already
 * following the parent through the journey, instead of a hidden tab.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { JOURNEY_STAGES, stageIndex, type JourneyStageId } from '@/lib/journeyStage';
import { loadCheckInState } from '@/lib/weeklyCheckIn';
import { computePulse, daysAgoLabel } from '@/lib/pulse';
import { cn } from '@/lib/utils';

type Props = {
  /** The stage we believe the parent is on. Pass null to render all stops dimmed. */
  activeStage?: JourneyStageId | null;
  /** Optional override of the framing line above the row. */
  reassurance?: string;
  /** Tighter vertical rhythm when embedded inside another card. */
  compact?: boolean;
  className?: string;
};

export default function JourneyStepper({
  activeStage = null,
  reassurance = 'You don’t have to know the whole road today. Most families bounce between these — that’s normal.',
  compact = false,
  className,
}: Props) {
  const activeIdx = stageIndex(activeStage);

  return (
    <section
      aria-label="Where you are on the parenting road"
      className={cn(
        'rounded-2xl border border-surface-border bg-white shadow-soft',
        compact ? 'px-4 py-4 sm:px-5 sm:py-5' : 'px-5 py-5 sm:px-6 sm:py-6',
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
          Your road, roughly
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <CheckInPill />
          {activeIdx >= 0 && (
            <p className="text-[11px] font-medium text-brand-muted-500">
              Step {activeIdx + 1} of {JOURNEY_STAGES.length}
            </p>
          )}
        </div>
      </div>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-muted-700">
        {reassurance}
      </p>

      {/* Horizontal scroll on mobile, wrap on desktop — pills keep it readable
          either way. We avoid a strict timeline so it never feels prescriptive. */}
      <ol
        className="mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
        role="list"
      >
        {JOURNEY_STAGES.map((stage, i) => {
          const isActive = i === activeIdx;
          const isPast = activeIdx >= 0 && i < activeIdx;
          return (
            <li key={stage.id} className="snap-start">
              <span
                title={stage.blurb}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold leading-none transition-colors',
                  isActive && 'border-primary bg-primary text-white shadow-soft',
                  !isActive && isPast && 'border-brand-plum-200 bg-brand-plum-50/60 text-brand-plum-700',
                  !isActive && !isPast && 'border-surface-border bg-surface-subtle text-brand-muted-600',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : isPast
                      ? 'bg-brand-plum-100 text-brand-plum-700'
                      : 'bg-white text-brand-muted-500',
                  )}
                >
                  {i + 1}
                </span>
                {stage.label}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/**
 * Soft inline link surfaced in the JourneyStepper header. Three states:
 *   • no history       → "Take your first check-in"
 *   • recent (<14 days) → "Checked in {label}"
 *   • stale (≥14 days)  → "Check in this week" with amber tint
 * Always hydrates client-side to avoid SSR mismatch.
 */
function CheckInPill() {
  const [label, setLabel] = useState<string | null>(null);
  const [tone, setTone] = useState<'neutral' | 'soft' | 'nudge'>('soft');

  useEffect(() => {
    const pulse = computePulse(loadCheckInState());
    if (!pulse) {
      setLabel('Take your first check-in');
      setTone('soft');
      return;
    }
    if (pulse.daysSince !== null && pulse.daysSince >= 14) {
      setLabel('Check in this week');
      setTone('nudge');
      return;
    }
    setLabel(`Checked in ${daysAgoLabel(pulse.daysSince ?? 0)}`);
    setTone('neutral');
  }, []);

  if (!label) return null;

  return (
    <Link
      href="/support/check-in"
      aria-label={`${label} — open weekly check-in`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors',
        tone === 'nudge' && 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100',
        tone === 'soft' && 'border-brand-plum-200 bg-brand-plum-50/70 text-brand-plum-700 hover:bg-brand-plum-100',
        tone === 'neutral' && 'border-surface-border bg-white text-brand-muted-700 hover:bg-surface-subtle',
      )}
    >
      <Activity className="h-3 w-3" />
      {label}
    </Link>
  );
}
