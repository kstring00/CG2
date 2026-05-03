'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, RefreshCcw, Sparkles, Trash2 } from 'lucide-react';
import {
  clearCarePlan,
  loadCarePlan,
  type SavedCarePlan,
} from '@/lib/carePlanStorage';

/**
 * Persistent care plan view — the *result* of the intake flow.
 *
 *   /support/intake     → on-ramp (the questions)
 *   /support/care-plan  → outcome (saved + revisitable)
 */
export default function CarePlanPage() {
  const [hydrated, setHydrated] = useState(false);
  const [plan, setPlan] = useState<SavedCarePlan | null>(null);

  useEffect(() => {
    setHydrated(true);
    setPlan(loadCarePlan());
  }, []);

  if (!hydrated) {
    return <Shell><div className="h-40 animate-pulse rounded-2xl bg-surface-subtle" /></Shell>;
  }

  if (!plan) return <EmptyState />;

  return <PopulatedPlan plan={plan} onCleared={() => setPlan(null)} />;
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
          you haven&rsquo;t built a plan yet.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-muted-700">
          it takes about 3 minutes. we&rsquo;ll keep it simple.
        </p>
        <Link
          href="/support/intake"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          build my plan <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-4 text-[13px] text-brand-muted-500">
          you can always come back and change it.
        </p>
      </div>
    </Shell>
  );
}

function PopulatedPlan({
  plan,
  onCleared,
}: {
  plan: SavedCarePlan;
  onCleared: () => void;
}) {
  const handleClear = () => {
    if (typeof window === 'undefined') return;
    const ok = window.confirm('clear your saved plan? you can re-run the intake to build a new one.');
    if (!ok) return;
    clearCarePlan();
    onCleared();
  };

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
          your care plan
        </p>
        <h1 className="mt-1 text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
          your plan, friend.
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-brand-muted-700">
          built from what you told us. you can change it anytime.
        </p>
        <p className="mt-1 text-[12px] text-brand-muted-500">
          last updated {updatedDisplay}
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
          start here
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-brand-muted-800">
          {plan.summary}
        </p>
      </section>

      <section className="mt-6 space-y-3">
        {plan.steps.map((step, i) => (
          <div
            key={step.title}
            className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              step {i + 1}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-brand-navy-700">
              {step.title}
            </h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-brand-muted-700">
              {step.why}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link
                href={step.href}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
              >
                start this step <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                className="text-[13px] font-medium text-brand-muted-500 hover:text-brand-muted-800"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.alert('skipped for now. nothing happens to your plan — pick this back up whenever you want.');
                  }
                }}
              >
                skip for now
              </button>
            </div>
          </div>
        ))}
      </section>

      {plan.resources.length > 0 && (
        <section className="mt-8 rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
          <h2 className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> tools we picked for you
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

      {plan.weekMessage && (
        <section className="mt-6 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/60 p-5 sm:p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
            for you, this week
          </h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-brand-plum-800">
            {plan.weekMessage}
          </p>
        </section>
      )}

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-6">
        <Link
          href="/support/intake"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
        >
          <RefreshCcw className="h-4 w-4" /> update my plan
        </Link>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-brand-muted-500 hover:text-accent"
        >
          <Trash2 className="h-3.5 w-3.5" /> clear plan
        </button>
      </footer>
    </Shell>
  );
}
