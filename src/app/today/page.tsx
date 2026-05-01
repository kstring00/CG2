'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TodayCard from '@/components/TodayCard';
import {
  getRecommendedAction,
  isCalmSignal,
  type RecommendedAction,
} from '@/lib/getRecommendedAction';

const SITUATIONS = [
  null,
  'We just got the diagnosis',
  "We're waiting on an evaluation",
  "School isn't working",
  'Therapy is in progress',
  "I'm just tired",
] as const;

const FRAMING: Record<string, string> = {
  'We just got the diagnosis':
    'A diagnosis is a starting point, not a verdict. Here is the next concrete step.',
  "We're waiting on an evaluation":
    'While you wait, you can track milestones and prepare what to bring.',
  "School isn't working":
    'A clearer plan starts with the right document. Begin with the IEP basics.',
  'Therapy is in progress':
    "You're already on the path. Here is one small focus for this week.",
  "I'm just tired":
    'Take a breath first. Everything else can wait two minutes.',
  default: 'Two short questions and we will tailor what to do next.',
};

const PERMISSION_LINE =
  "If today isn't the day for this, that's okay. Come back when you can.";

export default function TodayPreviewPage() {
  const [situation, setSituation] = useState<string | null>(null);

  const action: RecommendedAction = getRecommendedAction({
    currentSituation: situation,
  });

  const framing = FRAMING[situation ?? 'default'] ?? FRAMING.default;

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
          {isCalmSignal(action) ? (
            <CalmPlaceholder />
          ) : (
            <TodayCard
              framing={framing}
              action={action}
              permissionLine={PERMISSION_LINE}
              fallback={<FallbackOptions />}
            />
          )}
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

function CalmPlaceholder() {
  return (
    <div className="rounded-3xl border border-brand-plum-200 bg-brand-plum-50 p-8 text-center shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-plum-600">
        Calm signal received
      </p>
      <p className="mt-2 text-base font-semibold text-stone-800">
        getRecommendedAction returned <code className="rounded bg-white/60 px-1.5 py-0.5 text-sm">{`{ type: 'calm' }`}</code>
      </p>
      <p className="mt-2 text-sm text-stone-600">
        The home page will render Calm Mode here instead of TodayCard. That UI is a later phase.
      </p>
    </div>
  );
}
