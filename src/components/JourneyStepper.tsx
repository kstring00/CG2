'use client';

/**
 * <JourneyStepper> — a soft, low-pressure visual of the six common stops on
 * the autism parenting road. It is not a progress bar, not a quiz, and never
 * "wrong". The intent is to quietly answer "where am I, roughly?" while
 * keeping the next stop visible without committing the parent to a path.
 *
 * Mounts on the homepage, intake top, care plan top, and parent support top.
 * Pure presentational — no localStorage, no side effects.
 */

import { JOURNEY_STAGES, stageIndex, type JourneyStageId } from '@/lib/journeyStage';
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
        {activeIdx >= 0 && (
          <p className="text-[11px] font-medium text-brand-muted-500">
            Step {activeIdx + 1} of {JOURNEY_STAGES.length}
          </p>
        )}
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
