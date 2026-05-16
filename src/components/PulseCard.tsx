'use client';

/**
 * PulseCard — Home Base widget that surfaces the parent's most recent
 * weekly check-in score and a 4-week sparkline.
 *
 * CCO ask (round 2): the check-in dashboard at /support/mental-health was
 * invisible because nothing on the main journey pointed to it. This card
 * is the discoverable on-ramp — it appears at the top of Home Base so a
 * returning parent immediately sees where they were last and has a one-
 * click path to update it.
 *
 * Design rules (per Kyle's locked preferences):
 *   • Not a clinical score. Disclaimer is on the card itself.
 *   • No streaks, no benchmarking, no shaming.
 *   • Empty state is warm, not pushy.
 *   • Local-only data — surfaces a localStorage value, sends nothing.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, Sparkles } from 'lucide-react';
import { loadCheckInState } from '@/lib/weeklyCheckIn';
import {
  computePulse,
  daysAgoLabel,
  PULSE_BLURBS,
  PULSE_LABELS,
  type Pulse,
} from '@/lib/pulse';

const BAND_THEME: Record<Pulse['band'], { ring: string; dot: string; text: string }> = {
  heavy: { ring: 'border-rose-200 bg-rose-50/60', dot: 'bg-rose-500', text: 'text-rose-800' },
  mixed: { ring: 'border-amber-200 bg-amber-50/60', dot: 'bg-amber-500', text: 'text-amber-800' },
  steady: { ring: 'border-emerald-200 bg-emerald-50/60', dot: 'bg-emerald-500', text: 'text-emerald-800' },
  strong: { ring: 'border-sky-200 bg-sky-50/60', dot: 'bg-sky-500', text: 'text-sky-800' },
};

function Sparkline({ values }: { values: number[] }) {
  if (!values.length) return null;
  const max = 10;
  const min = 1;
  const w = 96;
  const h = 28;
  const step = values.length > 1 ? w / (values.length - 1) : 0;
  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / (max - min)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`Recent check-in trail: ${values.join(', ')}`}
      className="text-brand-plum-500"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / (max - min)) * h;
        return <circle key={i} cx={x} cy={y} r={2.2} fill="currentColor" />;
      })}
    </svg>
  );
}

export default function PulseCard() {
  // Client-only — localStorage is not available during SSR.
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPulse(computePulse(loadCheckInState()));
    setHydrated(true);
  }, []);

  // Pre-hydration placeholder keeps layout stable and avoids SSR mismatch.
  if (!hydrated) {
    return (
      <section className="rounded-3xl border border-surface-border bg-white p-5 shadow-card sm:p-6" aria-hidden>
        <div className="h-24" />
      </section>
    );
  }

  // Empty state — parent has not checked in yet.
  if (!pulse) {
    return (
      <section
        aria-label="Your weekly pulse"
        className="rounded-3xl border border-brand-plum-200 bg-brand-plum-50/40 p-5 shadow-card sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 max-w-xl">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
              <Sparkles className="h-3.5 w-3.5" /> Your weekly pulse
            </p>
            <h2 className="mt-2 text-base font-semibold text-brand-navy-700 sm:text-lg">
              Take a 2-minute check-in for yourself.
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-muted-600">
              No score is shared. No streaks. Just a quiet way to notice how your weeks are going,
              so heavy stretches don&rsquo;t sneak up on you.
            </p>
          </div>
          <Link
            href="/support/check-in"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-plum-700 transition hover:bg-brand-plum-100"
          >
            Start my first check-in <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  const theme = BAND_THEME[pulse.band];
  const lastLabel = pulse.daysSince === null ? 'recently' : daysAgoLabel(pulse.daysSince);

  return (
    <section
      aria-label="Your weekly pulse"
      className={`rounded-3xl border ${theme.ring} p-5 shadow-card sm:p-6`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-xl">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
            <Activity className="h-3.5 w-3.5" /> Your weekly pulse
          </p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className={`text-3xl font-semibold ${theme.text}`}>{pulse.score}<span className="text-lg text-brand-muted-500">/10</span></span>
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold ${theme.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} aria-hidden /> {PULSE_LABELS[pulse.band]}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-700">{PULSE_BLURBS[pulse.band]}</p>
          <p className="mt-1.5 text-xs text-brand-muted-500">
            From your check-in {lastLabel}. This is your read on your own week, not a clinical score.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <Sparkline values={pulse.trail} />
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/support/check-in"
              className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              Update my check-in <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/support/mental-health"
              className="text-xs font-semibold text-brand-muted-700 underline-offset-2 hover:underline"
            >
              See the full dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
