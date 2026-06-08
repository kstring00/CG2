'use client';

/**
 * /support/at-home — At-Home Strategies
 *
 * 10 ABA-grounded tools in a compact 2-column card grid. Parents scan visually,
 * filter by situation, and open one strategy at a time with a smooth inline
 * expansion — same interaction language as the Mental Health Toolbox.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  Award,
  BookOpen,
  ChevronRight,
  Footprints,
  Hand,
  Heart,
  Home as HomeIcon,
  LayoutGrid,
  Lightbulb,
  ListChecks,
  ShieldAlert,
  Signpost,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Users,
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
  all: 'Show all',
  transitions: SITUATION_LABELS.transitions,
  meltdowns: SITUATION_LABELS.meltdowns,
  refusal: SITUATION_LABELS.refusal,
  overwhelm: SITUATION_LABELS.overwhelm,
  routines: SITUATION_LABELS.routines,
  communication: SITUATION_LABELS.communication,
  'unsafe-behavior': SITUATION_LABELS['unsafe-behavior'],
};

const STRATEGY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'first-then': LayoutGrid,
  'catch-them-being-good': Award,
  'two-good-choices': Signpost,
  'smaller-step': Footprints,
  'visuals-not-words': LayoutGrid,
  'replacement-behavior': ArrowLeftRight,
  'practice-when-calm': BookOpen,
  'timer-transitions': Timer,
  'ask-for-break': Hand,
  'reduce-demand': SlidersHorizontal,
};

function strategyNumber(id: string): number {
  return AT_HOME_STRATEGIES.findIndex((s) => s.id === id) + 1;
}

export default function AtHomeStrategiesPage() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = useMemo(() => strategiesForSituation(filter), [filter]);

  useEffect(() => {
    setExpanded(null);
  }, [filter]);

  const toggleStrategy = (id: string) => {
    setExpanded((current) => (current === id ? null : id));
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-[12px] text-brand-muted-500">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/support" className="hover:text-brand-navy-700">
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3 w-3" />
          </li>
          <li className="font-medium text-brand-muted-700">At-Home Strategies</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mt-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1 text-[11px] font-semibold text-brand-plum-700">
              <HomeIcon className="h-3.5 w-3.5" /> At-Home Strategies
            </span>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-brand-navy-700 sm:text-4xl">
              Ten things to try when the moment is hard.
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-brand-muted-700">
              Real ABA strategies, written in parent-friendly language. Each one is something you
              can try in the next 60 seconds — not after months of training.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-plum-200 bg-brand-plum-50/60 px-3 py-1.5 text-[11px] font-semibold text-brand-plum-700">
            <Sparkles className="h-3.5 w-3.5" />
            10 starter strategies
          </span>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 px-4 py-3">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
          <p className="text-[13px] leading-relaxed text-amber-900">
            These are starting points, not a treatment plan. If a behavior is unsafe, getting
            worse, or doesn&rsquo;t respond to anything you try, bring it to your BCBA or care
            team. Common Ground is parent support — it does not diagnose, treat, or replace
            clinical care.
          </p>
        </div>
      </header>

      {/* Situation filter */}
      <section aria-label="Filter by situation" className="mt-8">
        <h2 className="text-base font-bold text-brand-navy-700 sm:text-lg">
          When are you using this?
        </h2>
        <p className="mt-0.5 text-[13px] text-brand-muted-600">
          Pick the situation. We&rsquo;ll show the strategies that fit.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {FILTER_ORDER.map((value) => {
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors duration-200',
                  active
                    ? 'border-brand-navy-700 bg-brand-navy-700 text-white shadow-sm'
                    : 'border-brand-plum-100 bg-brand-plum-50/80 text-brand-muted-700 hover:bg-brand-plum-100',
                )}
              >
                {FILTER_LABEL[value]}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[12px] text-brand-muted-500">
          Showing{' '}
          <span className="font-semibold text-brand-muted-700">{visible.length}</span> of{' '}
          {AT_HOME_STRATEGIES.length}
        </p>
      </section>

      {/* Strategy card grid */}
      <section
        aria-label="Strategy list"
        className="mt-6 grid items-start gap-4 sm:grid-cols-2"
      >
        {visible.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            index={strategyNumber(strategy.id)}
            isExpanded={expanded === strategy.id}
            onToggle={() => toggleStrategy(strategy.id)}
          />
        ))}
        {visible.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-surface-border bg-white p-6 text-center text-sm text-brand-muted-600">
            No strategies match that situation yet. Try another filter or show all.
          </div>
        )}
      </section>

      {/* Bottom callout */}
      <footer className="mt-9 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/50 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-plum-100 text-brand-plum-700">
              <Heart className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-brand-navy-700">
                These ten are a starting library.
              </h2>
              <p className="mt-1 text-[14px] leading-relaxed text-brand-muted-700">
                Your BCBA can help you choose which ones fit your child best — and add more that
                are specific to your family&rsquo;s routines.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Link
              href="/support/care-plan"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-soft transition hover:bg-primary/90"
            >
              See my care plan <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/support/connect"
              className="inline-flex items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-plum-700 transition hover:bg-brand-plum-100"
            >
              <Users className="h-4 w-4" /> Talk to other parents
            </Link>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-brand-muted-500">
          Saved nowhere. Read privately. Common Ground is parent support, not clinical care.
        </p>
      </footer>
    </main>
  );
}

/* ── Collapsible reveal (reuses toolbox animation from globals.css) ── */

function CollapsibleReveal({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="toolbox-reveal" data-open={open ? 'true' : 'false'}>
      <div className="toolbox-reveal-inner">
        <div className="toolbox-reveal-content">{children}</div>
      </div>
    </div>
  );
}

/* ── Strategy Card ─────────────────────────────────────────────────── */

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
  const Icon = STRATEGY_ICONS[strategy.id] ?? Lightbulb;

  return (
    <article
      className={cn(
        'self-start rounded-2xl border bg-white shadow-soft transition-colors duration-200 ease-out',
        isExpanded
          ? 'border-brand-plum-300 bg-brand-plum-50/30 ring-1 ring-brand-plum-200/60'
          : 'border-surface-border hover:border-brand-plum-100',
      )}
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-colors duration-200',
              isExpanded
                ? 'bg-brand-plum-200 text-brand-plum-900'
                : 'bg-brand-plum-100 text-brand-plum-800',
            )}
          >
            {index}
          </span>
          <span
            className={cn(
              'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200',
              isExpanded
                ? 'bg-brand-plum-100 text-brand-plum-800'
                : 'bg-brand-plum-50 text-brand-plum-700',
            )}
          >
            <Icon className="h-6 w-6" aria-hidden />
          </span>
        </div>

        <div className="mt-3 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                'text-[15px] font-semibold leading-snug',
                isExpanded ? 'text-brand-plum-900' : 'text-brand-navy-700',
              )}
            >
              {strategy.title}
            </h3>
            <span className="rounded-full border border-surface-border bg-surface-subtle px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-brand-muted-600">
              {strategy.abaConcept}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-brand-muted-600">
            {strategy.tagline}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {strategy.bestFor.map((s) => (
              <span
                key={s}
                className="rounded-full bg-brand-plum-50 px-2 py-0.5 text-[10px] font-semibold text-brand-plum-700"
              >
                {SITUATION_LABELS[s]}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={`strategy-${strategy.id}-body`}
          className={cn(
            'mt-4 inline-flex items-center gap-1 self-start text-[13px] font-semibold transition-colors duration-200',
            isExpanded
              ? 'text-brand-plum-800 hover:text-brand-plum-900'
              : 'text-primary hover:text-primary/80',
          )}
        >
          {isExpanded ? 'Close' : 'Open strategy'}
          <ArrowRight
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-200',
              isExpanded && 'rotate-90',
            )}
          />
        </button>
      </div>

      <CollapsibleReveal open={isExpanded}>
        <div
          id={`strategy-${strategy.id}-body`}
          className="border-t border-brand-plum-100/80 px-5 pb-5 pt-4"
        >
          <p className="text-[13.5px] leading-relaxed text-brand-muted-800">
            {strategy.explanation}
          </p>

          <section className="mt-4">
            <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted-600">
              <Lightbulb className="h-3.5 w-3.5 text-brand-plum-600" /> Try saying
            </h4>
            <ul className="mt-2 space-y-1.5">
              {strategy.examples.map((ex) => (
                <li
                  key={ex}
                  className="rounded-xl border border-brand-plum-100 bg-white px-3.5 py-2 text-[13px] text-brand-muted-800"
                >
                  {ex}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-4">
            <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted-600">
              <ListChecks className="h-3.5 w-3.5 text-emerald-600" /> How to try it
            </h4>
            <ol className="mt-2 space-y-1.5">
              {strategy.howTo.map((step, i) => (
                <li key={step} className="flex gap-2 text-[13px] text-brand-muted-800">
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

          <section className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                Common mistake
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-amber-900">
                {strategy.commonMistake}
              </p>
            </div>
          </section>

          <button
            type="button"
            onClick={onToggle}
            className="mt-4 text-[12px] font-semibold text-brand-muted-500 transition-colors hover:text-brand-navy-700"
          >
            Close
          </button>
        </div>
      </CollapsibleReveal>
    </article>
  );
}
