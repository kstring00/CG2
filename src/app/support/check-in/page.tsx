'use client';

/**
 * /support/check-in — Quick Bandwidth Check (standalone)
 *
 * This used to be a separate weekly qualitative form. Per CCO direction, the
 * check-in is now a single, consistent Bandwidth Check across the entire
 * site. This page is the standalone home for it — entered from:
 *
 *   • "Update check-in" on /support/care-plan
 *   • The soft CheckInPill in the JourneyStepper header
 *   • Direct nav (only surfaced after the parent has a plan)
 *
 * The intake flow uses the same <BandwidthCheck /> component inline as a
 * step, so the parent never has to do this twice.
 */

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, LifeBuoy } from 'lucide-react';
import BandwidthCheck from '@/components/BandwidthCheck';
import {
  loadBandwidth,
  TIER_LABEL,
  TIER_RESULT_COPY,
  TIER_STEP_LIMIT,
  TIER_THEME,
  shouldShowSupportCard,
  shouldShowCrisisCallout,
  type BandwidthResult,
} from '@/lib/bandwidth';
import { cn } from '@/lib/utils';

export default function CheckInPage() {
  return (
    <Suspense fallback={null}>
      <CheckInPageInner />
    </Suspense>
  );
}

function CheckInPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const fromParam = params.get('from'); // e.g. /support/care-plan
  const back = fromParam && fromParam.startsWith('/') ? fromParam : '/support';

  const [result, setResult] = useState<BandwidthResult | null>(null);

  // Read existing for pre-fill (lets parents make small adjustments).
  const existing = typeof window === 'undefined' ? null : loadBandwidth();

  return (
    <div className="page-shell gap-6">
      <div className="flex items-center justify-between">
        <Link
          href={back}
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted-600 transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      {!result ? (
        <BandwidthCheck
          initialInputs={existing?.inputs}
          onComplete={(r) => setResult(r)}
          submitLabel={existing ? 'Update my check-in' : 'See my result'}
        />
      ) : (
        <ResultPanel
          result={result}
          onContinue={() => router.push(back)}
          onRedo={() => setResult(null)}
        />
      )}
    </div>
  );
}

/* ── Result Panel ────────────────────────────────────────────────────── */

function ResultPanel({
  result,
  onContinue,
  onRedo,
}: {
  result: BandwidthResult;
  onContinue: () => void;
  onRedo: () => void;
}) {
  const theme = TIER_THEME[result.tier];
  const stepLimit = TIER_STEP_LIMIT[result.tier];
  const showSupport = shouldShowSupportCard(result.tier);
  const showCrisis = shouldShowCrisisCallout(result.tier);

  return (
    <div className="space-y-4">
      <section
        aria-label="Your bandwidth result"
        className={cn('rounded-3xl border p-6 shadow-card sm:p-8', theme.bg, theme.border)}
      >
        <div className="flex flex-wrap items-baseline gap-3">
          <CheckCircle2 className={cn('h-5 w-5', theme.text)} aria-hidden />
          <p className={cn('text-[11px] font-semibold uppercase tracking-[0.18em]', theme.text)}>
            Today&rsquo;s bandwidth
          </p>
        </div>
        <h2 className={cn('mt-2 text-2xl font-semibold sm:text-3xl', theme.text)}>
          {TIER_LABEL[result.tier]}
        </h2>
        <p className={cn('mt-3 text-sm leading-relaxed sm:text-base', theme.text)}>
          {TIER_RESULT_COPY[result.tier]}
        </p>
        <p className={cn('mt-3 text-xs', theme.text, 'opacity-80')}>
          Your plan will show <span className="font-semibold">{stepLimit}</span>{' '}
          {stepLimit === 1 ? 'priority step' : 'priority steps'} to match this.
        </p>
      </section>

      {showSupport && (
        <section className="rounded-3xl border border-brand-plum-200 bg-brand-plum-50/50 p-5 sm:p-6">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
            <LifeBuoy className="h-3.5 w-3.5" /> A gentle suggestion
          </p>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-800">
            You don&rsquo;t have to carry this alone. If your family is enrolled with us, your BCBA
            or care team is a good first call. If you&rsquo;re looking for parent-to-parent support,
            other parents have been here too.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/support/connect"
              className="inline-flex items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2 text-sm font-semibold text-brand-plum-700 hover:bg-brand-plum-100"
            >
              Talk to other parents <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/client"
              className="inline-flex items-center gap-2 rounded-2xl border border-surface-border bg-white px-4 py-2 text-sm font-semibold text-brand-muted-700 hover:bg-surface-subtle"
            >
              Reach my care team
            </Link>
          </div>
        </section>
      )}

      {showCrisis && (
        <section className="rounded-3xl border border-rose-300 bg-rose-50/70 p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-800">
            If you&rsquo;re in crisis
          </p>
          <p className="mt-2 text-sm leading-relaxed text-rose-900">
            If you feel unsafe — or you&rsquo;re worried someone in your family does — please reach
            a person right now. You can call or text 988 in the US, 24/7. Common Ground is not a
            crisis service.
          </p>
          <a
            href="tel:988"
            className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Call or text 988
          </a>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onRedo}
          className="text-sm font-semibold text-brand-muted-600 underline-offset-2 hover:underline"
        >
          Adjust my answers
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          <Compass className="h-4 w-4" /> See my plan
        </button>
      </div>
    </div>
  );
}
