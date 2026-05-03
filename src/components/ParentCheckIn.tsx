'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  RATING_LABELS,
  RATING_RESPONSES,
  type ParentCheckIn as ParentCheckInEntry,
  type SupportRating,
  computeSupportReadiness,
  getTodaysCheckIn,
  recordCheckIn,
} from '@/lib/supportReadiness';

type Variant = 'compact' | 'card';

export type ParentCheckInProps = {
  /** "compact" fits a 256px sidebar; "card" is for wider portal areas. */
  variant?: Variant;
  className?: string;
  onCheckIn?: (entry: ParentCheckInEntry) => void;
};

const RATINGS: SupportRating[] = [1, 2, 3, 4, 5];

/**
 * Color stops along the gauge. Left tones acknowledge low capacity without
 * alarm; right tones lean into the brand's calmer navy/teal.
 * No red — we never want a "danger" connotation here.
 */
const SEGMENT_TONES: Record<SupportRating, { active: string; dot: string }> = {
  1: { active: 'bg-brand-burgundy-300', dot: 'bg-brand-burgundy-400' },
  2: { active: 'bg-brand-plum-300', dot: 'bg-brand-plum-400' },
  3: { active: 'bg-brand-purple-300', dot: 'bg-brand-purple-400' },
  4: { active: 'bg-primary/70', dot: 'bg-primary' },
  5: { active: 'bg-emerald-400', dot: 'bg-emerald-500' },
};

export default function ParentCheckIn({
  variant = 'compact',
  className,
  onCheckIn,
}: ParentCheckInProps) {
  const [hydrated, setHydrated] = useState(false);
  const [today, setToday] = useState<ParentCheckInEntry | null>(null);
  const [hovered, setHovered] = useState<SupportRating | null>(null);

  useEffect(() => {
    setHydrated(true);
    setToday(getTodaysCheckIn());
  }, []);

  const readiness = useMemo(() => computeSupportReadiness(), [today, hydrated]);

  const handleSelect = (rating: SupportRating) => {
    const entry = recordCheckIn(rating);
    setToday(entry);
    onCheckIn?.(entry);
  };

  const handleReset = () => setToday(null);

  // Pre-hydration: render a stable, neutral shell so SSR/CSR markup matches.
  if (!hydrated) {
    return <Shell variant={variant} className={className} skeleton />;
  }

  const activeRating = (today?.rating ?? hovered ?? null) as SupportRating | null;
  const fill = today
    ? readiness.fill
    : hovered
    ? ((hovered - 1) / 4) * 90 + 10
    : 0;

  return (
    <Shell variant={variant} className={className}>
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-muted-400">
            Today’s support level
          </p>
          <h3 className={cn('mt-1 font-semibold text-brand-navy-700', variant === 'compact' ? 'text-[13px] leading-snug' : 'text-base')}>
            {today ? 'Thanks for checking in.' : 'How are you doing today?'}
          </h3>
        </div>
        {today && (
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 rounded-full p-1 text-brand-muted-400 transition hover:bg-surface-subtle hover:text-brand-muted-700"
            aria-label="Update today’s check-in"
            title="Update today’s check-in"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </header>

      <Gauge fill={fill} active={activeRating} variant={variant} />

      {!today && (
        <fieldset
          className="mt-3"
          aria-label="Choose a number from 1 to 5 that reflects how supported you feel today"
        >
          <legend className="sr-only">How supported do you feel today?</legend>
          <div className="grid grid-cols-5 gap-1">
            {RATINGS.map((r) => {
              const isHover = hovered === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleSelect(r)}
                  onMouseEnter={() => setHovered(r)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(r)}
                  onBlur={() => setHovered(null)}
                  aria-label={`${r} — ${RATING_LABELS[r]}`}
                  className={cn(
                    'group flex h-9 flex-col items-center justify-center rounded-xl border text-[12px] font-semibold transition',
                    isHover
                      ? 'border-primary/40 bg-primary/5 text-primary shadow-soft'
                      : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary',
                  )}
                >
                  {r}
                </button>
              );
            })}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[9.5px] font-medium uppercase tracking-wide text-brand-muted-400">
            <span>Running on Empty</span>
            <span>Set Up for Success</span>
          </div>
          {hovered && (
            <p className="mt-2 text-center text-[11px] font-medium text-brand-muted-700">
              {RATING_LABELS[hovered]}
            </p>
          )}
          <p className="mt-2 text-[10.5px] leading-snug text-brand-muted-500">
            You are not being graded. This helps us point you toward a kinder next step.
          </p>
        </fieldset>
      )}

      {today && <Response rating={today.rating} variant={variant} />}
    </Shell>
  );
}

function Shell({
  children,
  variant,
  className,
  skeleton = false,
}: {
  children?: React.ReactNode;
  variant: Variant;
  className?: string;
  skeleton?: boolean;
}) {
  return (
    <section
      aria-label="Parent support check-in"
      className={cn(
        'rounded-2xl border bg-white shadow-soft',
        variant === 'compact' ? 'border-surface-border p-3.5' : 'border-surface-border p-5',
        className,
      )}
    >
      {skeleton ? (
        <div className="space-y-3">
          <div className="h-3 w-24 rounded-full bg-surface-subtle" />
          <div className="h-2 w-full rounded-full bg-surface-subtle" />
          <div className="grid grid-cols-5 gap-1">
            {RATINGS.map((r) => (
              <div key={r} className="h-9 rounded-xl bg-surface-subtle" />
            ))}
          </div>
        </div>
      ) : (
        children
      )}
    </section>
  );
}

function Gauge({
  fill,
  active,
  variant,
}: {
  fill: number;
  active: SupportRating | null;
  variant: Variant;
}) {
  const tone = active ? SEGMENT_TONES[active].active : 'bg-primary/40';
  return (
    <div className={cn('mt-3', variant === 'compact' ? '' : 'mt-4')}>
      <div
        className="relative h-2 w-full overflow-hidden rounded-full bg-surface-subtle"
        role="progressbar"
        aria-label="Support readiness gauge"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(fill)}
      >
        <div
          className={cn('absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out', tone)}
          style={{ width: `${fill}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between px-0.5">
        {RATINGS.map((r) => (
          <span
            key={r}
            className={cn(
              'h-1.5 w-1.5 rounded-full transition',
              active && r <= active ? SEGMENT_TONES[r].dot : 'bg-surface-border',
            )}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}

function Response({ rating, variant }: { rating: SupportRating; variant: Variant }) {
  const r = RATING_RESPONSES[rating];
  return (
    <div
      className={cn(
        'mt-3 rounded-xl border border-primary/10 bg-primary/[0.04] p-3 animate-fade-in',
        variant === 'card' && 'p-4',
      )}
    >
      <p className={cn('font-semibold text-brand-navy-700', variant === 'compact' ? 'text-[12.5px] leading-snug' : 'text-sm')}>
        {r.headline}
      </p>
      <p className={cn('mt-1 text-brand-muted-600', variant === 'compact' ? 'text-[11.5px] leading-snug' : 'text-[13px] leading-relaxed')}>
        {r.body}
      </p>
      <Link
        href={r.actionHref}
        className={cn(
          'mt-2.5 inline-flex w-full items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 font-semibold text-primary shadow-soft transition hover:bg-primary/5',
          variant === 'compact' ? 'text-[12px]' : 'text-sm',
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          {r.actionLabel}
        </span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
