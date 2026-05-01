'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TodayCard from '@/components/TodayCard';
import { getRecommendedAction } from '@/lib/getRecommendedAction';

const SITUATIONS = [
  null,
  'We just got the diagnosis',
  "We're waiting on an evaluation",
  "School isn't working",
  'Therapy is in progress',
  "I'm just tired",
] as const;

export default function TodayPreviewPage() {
  const [situation, setSituation] = useState<string | null>(null);

  const action = getRecommendedAction({ currentSituation: situation });

  return (
    <main
      className="min-h-screen px-6 py-12 sm:px-8 sm:py-16"
      style={{ backgroundColor: '#f4efe8' }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 transition hover:text-stone-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Home
          </Link>
          <span className="rounded-full bg-stone-900/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-stone-500">
            Dev preview · /today
          </span>
        </div>

        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          TodayCard preview
        </h1>
        <p className="mt-2 max-w-md text-sm text-stone-500">
          Toggle a simulated <code className="rounded bg-stone-900/5 px-1 py-0.5 text-[11px]">currentSituation</code>{' '}
          to see what <code className="rounded bg-stone-900/5 px-1 py-0.5 text-[11px]">getRecommendedAction</code>{' '}
          returns and how the card renders.
        </p>

        <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
            Simulated situation
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SITUATIONS.map((s) => {
              const selected = situation === s;
              const label = s ?? '— none (default) —';
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSituation(s)}
                  className={
                    selected
                      ? 'rounded-full border border-primary bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary'
                      : 'rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:border-primary hover:text-primary'
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-10">
          <TodayCard action={action} fallback={<FallbackOptions />} />
        </div>

        <section className="mt-10 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
            getRecommendedAction output
          </p>
          <pre className="mt-3 overflow-x-auto rounded-2xl bg-stone-50 p-4 text-xs leading-relaxed text-stone-700">
{JSON.stringify(action, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}

function FallbackOptions() {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {[
        { label: 'See places near you', href: '/support/find' },
        { label: 'What is ABA, really?', href: '/support/what-is-aba' },
        { label: 'Community & connection', href: '/support/connect' },
        { label: 'Caregiver mental health', href: '/support/caregiver' },
      ].map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-primary hover:text-primary"
          >
            {item.label}
            <span aria-hidden className="text-stone-300">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
