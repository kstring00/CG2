'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useWellnessState } from '@/lib/wellnessState';
import { cn } from '@/lib/utils';

/**
 * Step 7c (and 7b): the small, slow-breathing tile on Home Base that
 * reflects what the parent has been carrying. No streaks, no scores, no
 * pulsing icons — a quiet mirror.
 *
 * Reads from useWellnessState (hydrated from localStorage). When in a
 * crisis route during this session, the mirror goes silent.
 */

const QUIET_FLAG = 'cg.quiet.mirror';

function inCrisisSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(QUIET_FLAG) === '1';
  } catch {
    return false;
  }
}

export default function WellnessMirror({ className }: { className?: string }) {
  const { state, ready } = useWellnessState();

  if (!ready) {
    return (
      <section className={cn('rounded-2xl border border-surface-border bg-white p-5 shadow-soft', className)}>
        <div className="h-20 w-full animate-pulse rounded-xl bg-surface-subtle" aria-hidden />
      </section>
    );
  }

  if (inCrisisSession()) {
    return (
      <section
        aria-label="quiet mirror"
        className={cn(
          'rounded-2xl border border-surface-border bg-surface-muted/40 p-5 sm:p-6',
          className,
        )}
      >
        <p className="text-[14px] leading-relaxed text-brand-muted-700">we&rsquo;re here. take what you need.</p>
      </section>
    );
  }

  if (!state.hasData) {
    return (
      <section
        aria-label="wellness mirror"
        className={cn(
          'rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6',
          className,
        )}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-400">
          a quiet mirror
        </p>
        <p className="mt-2 text-[14.5px] leading-relaxed text-brand-muted-700">
          this space will reflect what you&rsquo;ve been carrying — once you&rsquo;ve done a check-in or two. no streaks, no scores. just a quiet mirror.
        </p>
        <Link
          href="/support/mental-health"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          try a check-in <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    );
  }

  const { zone, recent, streak } = state;

  const tone =
    zone === 'steady'
      ? { ring: 'border-emerald-200', bg: 'bg-emerald-50/40', dot: 'text-emerald-600', stroke: '#10b981' }
      : zone === 'watch'
      ? { ring: 'border-amber-200', bg: 'bg-amber-50/40', dot: 'text-amber-700', stroke: '#d97706' }
      : { ring: 'border-rose-200', bg: 'bg-rose-50/40', dot: 'text-rose-700', stroke: '#9f1239' };

  const message =
    zone === 'steady'
      ? 'this week has felt steadier than last. whatever you did this week — keep doing it.'
      : zone === 'watch'
      ? `this week has been heavier. you&rsquo;ve still shown up ${streak || recent.length} of the last 7 days. that counts.`
      : 'you&rsquo;ve been carrying a lot. reaching out moves the needle more than anything else — would today be a day for that?';

  return (
    <section
      aria-label="wellness mirror"
      className={cn(
        'rounded-2xl border p-5 shadow-soft sm:p-6',
        tone.ring,
        tone.bg,
        className,
      )}
    >
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
            wellness mirror
          </p>
          <p
            className="mt-2 text-[14.5px] leading-relaxed text-brand-muted-800"
            dangerouslySetInnerHTML={{ __html: message }}
          />
          {zone === 'at-risk' && (
            <Link
              href="/support/hard-days"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-rose-800 hover:underline"
            >
              open hard days <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
        <Sparkline values={recent} stroke={tone.stroke} />
      </div>
    </section>
  );
}

/**
 * Slow, calm sparkline. Animates in with a stroke-dashoffset draw over
 * ~1.2s on mount, then sits still. No pulsing, no glowing.
 */
function Sparkline({ values, stroke }: { values: number[]; stroke: string }) {
  if (!values || values.length === 0) return null;

  const w = 120;
  const h = 40;
  const pad = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  const points = values.map((v, i) => {
    const x = pad + (i / Math.max(1, values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="shrink-0"
      aria-label="last 7 days"
    >
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 400,
          strokeDashoffset: 0,
          animation: 'sparklineDraw 1.2s ease-out both',
        }}
      />
      <style>{`
        @keyframes sparklineDraw {
          from { stroke-dashoffset: 400; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}
