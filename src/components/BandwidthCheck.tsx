'use client';

/**
 * <BandwidthCheck> — the one canonical bandwidth check used across the site.
 *
 * Used in two places:
 *   1. /support/check-in — the standalone page (entered from "Update check-in"
 *      on the care plan).
 *   2. Inside the intake flow as the step before plan generation.
 *
 * The component is intentionally framework-light. No animation libs, no chart
 * libs, no third-party slider — native <input type="range"> styled with the
 * brand palette. Submitting persists the result via saveBandwidth() and calls
 * onComplete with the BandwidthResult.
 *
 * Visual contract (per CCO direction):
 *   • Calm, soft, parent-friendly.
 *   • Frames the purpose first ("we ask this so we don't give you a plan
 *     that's too heavy for the day you're actually having").
 *   • Three sliders only.
 *   • Result is shown as a tier + a short forward-looking line — never a
 *     diagnosis, never a numeric badge by itself.
 */

import { useMemo, useState } from 'react';
import { ArrowRight, Gauge, ShieldAlert } from 'lucide-react';
import {
  BANDWIDTH_DEFAULTS,
  BANDWIDTH_SLIDERS,
  recordBandwidth,
  scoreBandwidth,
  TIER_LABEL,
  TIER_RESULT_COPY,
  TIER_THEME,
  type BandwidthInputs,
  type BandwidthResult,
} from '@/lib/bandwidth';
import { cn } from '@/lib/utils';

type Props = {
  /** Pre-fill the sliders (e.g. when the parent is updating an earlier check-in). */
  initialInputs?: BandwidthInputs;
  /** Called when the parent submits. Result is already persisted. */
  onComplete: (result: BandwidthResult) => void;
  /** Label for the submit button. Defaults to "See my result". */
  submitLabel?: string;
  /** If true, hides the eyebrow + title block (used when host page provides its own header). */
  hideHeader?: boolean;
};

export default function BandwidthCheck({
  initialInputs,
  onComplete,
  submitLabel = 'See my result',
  hideHeader = false,
}: Props) {
  const [inputs, setInputs] = useState<BandwidthInputs>(initialInputs ?? BANDWIDTH_DEFAULTS);

  // Preview of the tier as the parent moves the sliders. This is purely for
  // feedback — it's not what we save. We save on submit.
  const previewResult = useMemo(() => scoreBandwidth(inputs), [inputs]);
  const previewTheme = TIER_THEME[previewResult.tier];

  function update<K extends keyof BandwidthInputs>(key: K, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function submit() {
    const result = recordBandwidth(inputs);
    onComplete(result);
  }

  return (
    <section
      aria-label="Quick Bandwidth Check"
      className="rounded-3xl border border-surface-border bg-white p-6 shadow-card sm:p-8"
    >
      {!hideHeader && (
        <header>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-plum-700">
            <Gauge className="h-3.5 w-3.5" /> Quick Bandwidth Check
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-brand-muted-900 sm:text-[28px]">
            Before we build your plan, let&rsquo;s match the kind of day you&rsquo;re actually having.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted-700 sm:text-base">
            If today already feels heavy, we&rsquo;ll keep your next steps smaller. This takes about
            30 seconds.
          </p>
        </header>
      )}

      {/* Sliders */}
      <div className="mt-6 space-y-5">
        {BANDWIDTH_SLIDERS.map((slider) => {
          const value = inputs[slider.key];
          return (
            <div key={slider.key} className="rounded-2xl border border-surface-border bg-surface-subtle/60 p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-brand-muted-900">{slider.label}</p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-brand-muted-500">
                  {value}/100
                </p>
              </div>
              <p className="mt-1 text-[13px] text-brand-muted-600">{slider.question}</p>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={value}
                onChange={(e) => update(slider.key, Number(e.target.value))}
                aria-label={slider.question}
                className={cn(
                  'mt-3 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-brand-plum-100 via-brand-plum-200 to-brand-plum-300',
                  'h-2 accent-brand-plum-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                )}
              />
              <div className="mt-2 flex justify-between text-[11px] text-brand-muted-500">
                <span>{slider.lowLabel}</span>
                <span>{slider.highLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live preview of where they're landing — soft, not alarming. */}
      <div className={cn('mt-6 rounded-2xl border p-4 sm:p-5', previewTheme.bg, previewTheme.border)}>
        <div className="flex items-baseline gap-2">
          <span aria-hidden className={cn('inline-block h-2 w-2 rounded-full', previewTheme.dot)} />
          <p className={cn('text-[11px] font-semibold uppercase tracking-[0.14em]', previewTheme.text)}>
            How it looks right now: {TIER_LABEL[previewResult.tier]}
          </p>
        </div>
        <p className={cn('mt-2 text-sm leading-relaxed', previewTheme.text)}>
          {TIER_RESULT_COPY[previewResult.tier]}
        </p>
      </div>

      {/* Disclaimer — small but unavoidable. */}
      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-surface-border bg-surface-subtle px-3.5 py-3">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted-500" aria-hidden />
        <p className="text-[12.5px] leading-relaxed text-brand-muted-600">
          This isn&rsquo;t a diagnosis or a crisis tool. It&rsquo;s a simple check-in to help us
          adjust your next steps. If you feel unsafe or in crisis, contact emergency services or a
          crisis support line right away.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={submit}
          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          {submitLabel} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
