'use client';

/**
 * /support/at-home — At-Home Strategies
 *
 * 10 ABA-grounded tools a parent can actually use in the next 60 seconds.
 *
 * Replaces the "I need help at home" action on Home Base, which previously
 * pointed to a triage page of external referrals (Kyle's CCO feedback: those
 * outsourced resources "really don't affect much" — parents need tactics, not
 * phone numbers).
 *
 * Page structure
 * --------------
 *   1. Header (eyebrow, title, subtitle, disclaimer)
 *   2. "When are you using this?" situation filter (also serves as TOC)
 *   3. List of matching strategies as expandable cards
 *   4. Quiet footer reminding this is parent support, not clinical care
 *
 * Each card opens to show: parent-friendly explanation, copy-able example
 * scripts, a "how to try it" checklist, and a "common mistake" callout so the
 * parent doesn't blame themselves when it stumbles the first time.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Home as HomeIcon,
  Lightbulb,
  ListChecks,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  AT_HOME_STRATEGIES,
  SITUATION_LABELS,
  strategiesForSituation,
  type AtHomeStrategy,
  type StrategySituation,
} from '@/lib/atHomeStrategies';
import { cn } from '@/lib/utils';

type FilterValue = StrategySituation | 'all';

const FILTER_ORDER: FilterValue[] = [
  'all',
  'transitions',
  'meltdowns',
  'refusal',
  'overwhelm',
  'routines',
  'communication',
  'unsafe-behavior',
];

const FILTER_LABEL: Record<FilterValue, string> = {
  all: 'Show all 10',
  transitions: SITUATION_LABELS.transitions,
  meltdowns: SITUATION_LABELS.meltdowns,
  refusal: SITUATION_LABELS.refusal,
  overwhelm: SITUATION_LABELS.overwhelm,
  routines: SITUATION_LABELS.routines,
  communication: SITUATION_LABELS.communication,
  'unsafe-behavior': SITUATION_LABELS['unsafe-behavior'],
};

export default function AtHomeStrategiesPage() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = useMemo(() => strategiesForSituation(filter), [filter]);

  return (
    <div className="page-shell gap-8">
      {/* Header */}
      <header className="rounded-3xl border border-surface-border bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-plum-700">
              <HomeIcon className="h-3.5 w-3.5" /> At-Home Strategies
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-brand-muted-900 sm:text-4xl">
              Ten things to try when the moment is hard.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted-600 sm:text-base">
              Real ABA strategies, written in parent-friendly language. Each one is something you can
              try in the next 60 seconds — not after months of training. Pick the situation that
              matches what&rsquo;s happening, then read the cards that come up.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-brand-plum-200 bg-brand-plum-50/60 px-3 py-1.5 text-xs font-semibold text-brand-plum-700">
            <Sparkles className="h-3.5 w-3.5" />
            10 starter strategies
          </div>
        </div>

        {/* Disclaimer — kept here, not buried at the bottom, per CCO guidance. */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
          <p className="text-[13.5px] leading-relaxed text-amber-900">
            These are starting points, not a treatment plan. If a behavior is unsafe, getting worse,
            or doesn&rsquo;t respond to anything you try, bring it to your BCBA or care team. Common
            Ground is parent support — it does not diagnose, treat, or replace clinical care.
          </p>
        </div>
      </header>

      {/* Situation filter — also acts as a TOC. */}
      <section
        aria-label="Filter by situation"
        className="rounded-3xl border border-surface-border bg-white p-5 shadow-card sm:p-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
              When are you using this?
            </p>
            <h2 className="mt-1 text-base font-semibold text-brand-muted-900 sm:text-lg">
              Pick the situation. We&rsquo;ll show the strategies that fit.
            </h2>
          </div>
          <p className="text-xs text-brand-muted-500">
            Showing <span className="font-semibold text-brand-muted-700">{visible.length}</span>{' '}
            of {AT_HOME_STRATEGIES.length}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {FILTER_ORDER.map((value) => {
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                  active
                    ? 'border-primary bg-primary text-white shadow-sm'
                    : 'border-surface-border bg-surface-subtle text-brand-muted-700 hover:bg-white',
                )}
              >
                {FILTER_LABEL[value]}
              </button>
            );
          })}
        </div>
      </section>

      {/* Strategy cards */}
      <section aria-label="Strategy list" className="grid gap-4">
        {visible.map((strategy, idx) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            index={idx + 1}
            isExpanded={expanded === strategy.id}
            onToggle={() =>
              setExpanded((current) => (current === strategy.id ? null : strategy.id))
            }
          />
        ))}
        {visible.length === 0 && (
          <div className="rounded-3xl border border-dashed border-surface-border bg-white p-6 text-center text-sm text-brand-muted-600">
            No strategies match that situation yet. Try another filter or show all 10.
          </div>
        )}
      </section>

      {/* Quiet footer */}
      <footer className="rounded-3xl border border-surface-border bg-surface-subtle p-5 text-sm text-brand-muted-600 sm:p-6">
        <p>
          These ten are a starting library. Your BCBA can help you choose which ones fit your
          child best — and add more that are specific to your family&rsquo;s routines.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/support/care-plan"
            className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            See my care plan <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/support/connect"
            className="inline-flex items-center gap-2 rounded-2xl border border-surface-border bg-white px-4 py-2 text-sm font-semibold text-brand-muted-700 transition hover:bg-surface-subtle"
          >
            Talk to other parents
          </Link>
        </div>
        <p className="mt-4 text-xs text-brand-muted-500">
          Saved nowhere. Read privately. Common Ground is parent support, not clinical care.
        </p>
      </footer>
    </div>
  );
}

/* ── Strategy Card ───────────────────────────────────────────────────── */

function StrategyCard({
  strategy,
  index,
  isExpanded,
  onToggle,
}: {
  strategy: AtHomeStrategy;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={cn(
        'overflow-hidden rounded-3xl border bg-white shadow-card transition-shadow',
        isExpanded ? 'border-primary/40 shadow-md' : 'border-surface-border',
      )}
    >
      {/* Header (always visible, clickable to expand) */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`strategy-${strategy.id}-body`}
        className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-6"
      >
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-plum-50 text-sm font-semibold text-brand-plum-700"
        >
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-brand-muted-900">{strategy.title}</h3>
            <span className="rounded-full border border-surface-border bg-surface-subtle px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-brand-muted-600">
              {strategy.abaConcept}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-brand-muted-700">{strategy.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {strategy.bestFor.map((s) => (
              <span
                key={s}
                className="rounded-full bg-brand-plum-50/70 px-2 py-0.5 text-[10.5px] font-semibold text-brand-plum-700"
              >
                {SITUATION_LABELS[s]}
              </span>
            ))}
          </div>
        </div>
        <span className="mt-1 shrink-0 text-brand-muted-500">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </span>
      </button>

      {/* Body */}
      {isExpanded && (
        <div
          id={`strategy-${strategy.id}-body`}
          className="border-t border-surface-border bg-surface-subtle/40 p-5 sm:p-6"
        >
          <p className="text-sm leading-relaxed text-brand-muted-800">{strategy.explanation}</p>

          {/* Examples */}
          <section className="mt-5">
            <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted-600">
              <Lightbulb className="h-3.5 w-3.5 text-brand-plum-600" /> Try saying
            </h4>
            <ul className="mt-2 space-y-1.5">
              {strategy.examples.map((ex) => (
                <li
                  key={ex}
                  className="rounded-xl border border-brand-plum-100 bg-white px-3.5 py-2 text-sm text-brand-muted-800"
                >
                  {ex}
                </li>
              ))}
            </ul>
          </section>

          {/* How to try it */}
          <section className="mt-5">
            <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted-600">
              <ListChecks className="h-3.5 w-3.5 text-emerald-600" /> How to try it
            </h4>
            <ol className="mt-2 space-y-1.5">
              {strategy.howTo.map((step, i) => (
                <li key={step} className="flex gap-2 text-sm text-brand-muted-800">
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-800"
                  >
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Common mistake */}
          <section className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                Common mistake
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-amber-900">
                {strategy.commonMistake}
              </p>
            </div>
          </section>
        </div>
      )}
    </article>
  );
}
