'use client';

/**
 * PulseCard — Home Base widget that surfaces the parent's most recent
 * Quick Bandwidth Check result and a low-friction way to update it.
 *
 * Previously this card surfaced the qualitative weekly check-in score. As of
 * the bandwidth-consolidation pass, the check-in concept is unified around
 * the Quick Bandwidth Check (stress, sleep, support → tier), so this card
 * now reads from `loadBandwidth()` instead. The visual contract is unchanged:
 * a calm tile on Home Base that anchors the parent to their last check-in.
 *
 * Design rules (locked):
 *   • Not a clinical score. Disclaimer is on the card.
 *   • No streaks, no benchmarking, no shaming.
 *   • Empty state is warm, not pushy.
 *   • Local-only — surfaces a localStorage value, sends nothing.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Gauge, Sparkles } from 'lucide-react';
import {
  freshnessLabel,
  loadBandwidth,
  TIER_LABEL,
  TIER_RESULT_COPY,
  TIER_THEME,
  type BandwidthResult,
} from '@/lib/bandwidth';
import { cn } from '@/lib/utils';

export default function PulseCard() {
  // Client-only — localStorage is not available during SSR.
  const [bandwidth, setBandwidth] = useState<BandwidthResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBandwidth(loadBandwidth());
    setHydrated(true);
  }, []);

  // Pre-hydration placeholder keeps layout stable and avoids SSR mismatch.
  if (!hydrated) {
    return (
      <section
        className="rounded-3xl border border-surface-border bg-white p-5 shadow-card sm:p-6"
        aria-hidden
      >
        <div className="h-24" />
      </section>
    );
  }

  // Empty state — parent has not done a bandwidth check yet.
  if (!bandwidth) {
    return (
      <section
        aria-label="Quick bandwidth check"
        className="rounded-3xl border border-brand-plum-200 bg-brand-plum-50/40 p-5 shadow-card sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 max-w-xl">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
              <Sparkles className="h-3.5 w-3.5" /> Quick Bandwidth Check
            </p>
            <h2 className="mt-2 text-base font-semibold text-brand-navy-700 sm:text-lg">
              Before we send you anywhere, how is today?
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-muted-600">
              A 30-second check so the rest of the site sizes itself to the kind of day
              you&rsquo;re actually having. No score is shared. No streaks.
            </p>
          </div>
          <Link
            href="/support/connect"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-plum-700 transition hover:bg-brand-plum-100"
          >
            Start the check-in <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  const theme = TIER_THEME[bandwidth.tier];

  return (
    <section
      aria-label={`Today's bandwidth: ${TIER_LABEL[bandwidth.tier]}`}
      className={cn('rounded-3xl border p-5 shadow-card sm:p-6', theme.bg, theme.border)}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-xl">
          <p className={cn('inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]', theme.text)}>
            <Gauge className="h-3.5 w-3.5" /> Today&rsquo;s bandwidth
          </p>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className={cn('text-xl font-semibold sm:text-2xl', theme.text)}>
              {TIER_LABEL[bandwidth.tier]}
            </span>
            <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-semibold', theme.text)}>
              <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', theme.dot)} />
              {bandwidth.bandwidth}/100
            </span>
          </div>
          <p className={cn('mt-2 text-sm leading-relaxed', theme.text)}>
            {TIER_RESULT_COPY[bandwidth.tier]}
          </p>
          <p className="mt-1.5 text-xs text-brand-muted-500">
            {freshnessLabel(bandwidth)} &middot; this isn&rsquo;t a diagnosis, just a check-in.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link
            href="/support/connect"
            className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            Update my check-in <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
