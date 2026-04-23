'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Compass,
  Flag,
  HandHeart,
} from 'lucide-react';
import { guidedSteps, resources, stageMeta, type JourneyStageId } from '@/lib/data';

const validStageIds: JourneyStageId[] = [
  'pre-diagnosis',
  'just-diagnosed',
  'starting-therapy',
  'school-transition',
  'family-sustainability',
];

function NextStepsPageInner() {
  const searchParams = useSearchParams();
  const [activeStage, setActiveStage] = useState<JourneyStageId>('just-diagnosed');
  const [checked, setChecked] = useState<Record<string, Set<number>>>({});

  // If the URL contains ?stage=<id>, sync it to the active stage so the
  // homepage entry points land people on the right place.
  useEffect(() => {
    const stageParam = searchParams.get('stage');
    if (stageParam && validStageIds.includes(stageParam as JourneyStageId)) {
      setActiveStage(stageParam as JourneyStageId);
    }
  }, [searchParams]);

  const step = useMemo(
    () => guidedSteps.find((item) => item.id === activeStage) ?? guidedSteps[0],
    [activeStage],
  );
  const linkedResources = useMemo(
    () => resources.filter((resource) => step.resources.includes(resource.id)),
    [step.resources],
  );
  const checkedSet = checked[step.id] ?? new Set();
  const firstSteps = step.checklist.slice(0, 3);
  const extraSteps = step.checklist.slice(3);
  const featuredResource = linkedResources[0];

  const toggleCheck = (index: number) => {
    setChecked((prev) => {
      const current = new Set(prev[step.id] ?? []);
      if (current.has(index)) current.delete(index);
      else current.add(index);
      return { ...prev, [step.id]: current };
    });
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="page-title">Let&apos;s take this one step at a time.</h1>
        <p className="page-description">Pick the stage that fits today — then focus only on the next right move. Not the whole plan. Just the next step.</p>
      </header>

      {/* Stage picker */}
      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Where are you right now?</p>
          <p className="mt-1 text-sm text-brand-muted-500">Pick the stage that sounds most like your family today. Not sure? Start with &ldquo;Just Diagnosed.&rdquo;</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { id: 'pre-diagnosis' as const, hint: 'Something feels off, waiting on answers' },
            { id: 'just-diagnosed' as const, hint: 'Got the diagnosis in the last few months' },
            { id: 'starting-therapy' as const, hint: 'ABA or therapy is underway' },
            { id: 'school-transition' as const, hint: 'Navigating IEP, school placement' },
            { id: 'family-sustainability' as const, hint: 'Finding long-term balance' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveStage(item.id)}
              className={`flex flex-col rounded-2xl border p-3 text-left transition-all ${
                activeStage === item.id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-surface-border bg-white hover:border-primary/30'
              }`}
            >
              <span className={`text-sm font-semibold ${
                activeStage === item.id ? 'text-primary' : 'text-brand-muted-800'
              }`}>{stageMeta[item.id].shortLabel}</span>
              <span className="mt-0.5 text-[11px] leading-relaxed text-brand-muted-400">{item.hint}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              {step.timeframe}
            </span>
            <span className="rounded-full bg-surface-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-muted-500">
              {step.lastUpdated}
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-brand-muted-900">{step.title}</h2>
          <p className="mt-3 text-base leading-relaxed text-brand-muted-600">{step.reassurance}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Current focus</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted-700">{step.focus}</p>
            </div>
            <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Next milestone</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted-700">{step.milestone}</p>
            </div>
          </div>
        </article>

        <div className="space-y-5">
          <article className="rounded-3xl border border-surface-border bg-white p-5">
            <div className="flex items-center gap-2">
              <Flag className="h-4.5 w-4.5 text-primary" />
              <h2 className="section-title">What matters now</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-brand-muted-600">
              {step.whatMattersNow.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-brand-plum-100 bg-brand-plum-50/70 p-5">
            <div className="flex items-center gap-2">
              <HandHeart className="h-4.5 w-4.5 text-accent" />
              <h2 className="section-title">If overwhelmed</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted-700">{step.supportAction}</p>
            <p className="mt-2 text-sm text-brand-muted-500">One stabilizing action is enough for today.</p>
            <Link href="/support/help" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Get support now <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Compass className="h-4.5 w-4.5 text-primary" />
              <h2 className="section-title">Start with these 3 steps</h2>
            </div>
            <span className="rounded-full bg-surface-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-muted-500">
              {checkedSet.size} done
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {firstSteps.map((item, index) => {
              const isDone = checkedSet.has(index);
              return (
                <button
                  key={item}
                  onClick={() => toggleCheck(index)}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                    isDone
                      ? 'border-green-200 bg-green-50'
                      : 'border-surface-border hover:bg-surface-muted'
                  }`}
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-primary ring-1 ring-primary/10">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm leading-relaxed ${isDone ? 'text-green-700 line-through' : 'text-brand-muted-700'}`}>
                      {item}
                    </p>
                  </div>
                  {isDone && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />}
                </button>
              );
            })}
          </div>
        </article>

        <div className="space-y-5">
          {featuredResource && (
            <article className="rounded-3xl border border-surface-border bg-white p-5">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-primary" />
                <h2 className="section-title">Helpful right now</h2>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-brand-muted-900">{featuredResource.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{featuredResource.whyNow}</p>
              <Link href="/support/resources" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                Find help for this stage <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          )}

          <Link href="/support/community" className="btn-secondary w-full justify-between py-3">
            Find a local group or event <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <details className="group rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">See more</p>
            <h2 className="mt-1 text-xl font-semibold text-brand-muted-900">See the rest of this stage</h2>
          </div>
          <ChevronDown className="h-5 w-5 text-brand-muted-400 transition-transform group-open:rotate-180" />
        </summary>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr_1fr]">
          <article className="rounded-2xl border border-surface-border bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">More steps</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-brand-muted-600">
              {extraSteps.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-surface-border bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">What can wait</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-brand-muted-600">
              {step.whatCanWait.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-muted-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-surface-border bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">When to get more help</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-brand-muted-600">
              {step.supportEscalation.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {linkedResources.length > 1 && (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {linkedResources.slice(1).map((resource) => (
              <article key={resource.id} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                <h3 className="text-base font-semibold text-brand-muted-900">{resource.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{resource.action}</p>
              </article>
            ))}
          </div>
        )}
      </details>
    </div>
  );
}

export default function NextStepsPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell">
          <header className="page-header">
            <h1 className="page-title">Let&apos;s take this one step at a time.</h1>
            <p className="page-description">Start with what matters now. The rest can wait.</p>
          </header>
          <div className="animate-pulse space-y-4">
            <div className="h-32 rounded-3xl bg-surface-muted" />
            <div className="h-48 rounded-3xl bg-surface-muted" />
          </div>
        </div>
      }
    >
      <NextStepsPageInner />
    </Suspense>
  );
}
