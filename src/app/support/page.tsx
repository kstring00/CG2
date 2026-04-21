'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Flag,
  HandHeart,
  Link2,
} from 'lucide-react';
import { DemoDataNotice } from '@/components/ui/DemoDataNotice';
import {
  guidedSteps,
  resources,
  stageMeta,
  supportProviders,
  type JourneyStageId,
} from '@/lib/data';

export default function DashboardHome() {
  const [activeStage, setActiveStage] = useState<JourneyStageId>('just-diagnosed');

  const stage = useMemo(
    () => guidedSteps.find((item) => item.id === activeStage) ?? guidedSteps[0],
    [activeStage],
  );
  const recommendedResource = useMemo(
    () =>
      resources.find((resource) => resource.isFeatured && resource.journeyStages.includes(activeStage)) ??
      resources.find((resource) => resource.journeyStages.includes(activeStage)) ??
      resources[0],
    [activeStage],
  );
  const supportRoute = useMemo(
    () =>
      supportProviders.find((provider) => provider.journeyStages.includes(activeStage)) ??
      supportProviders[0],
    [activeStage],
  );

  const nextStep = stage.checklist[0];
  const weekSteps = stage.checklist.slice(0, 3);

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="page-title">What to do next</h1>
        <p className="page-description">
          Start with the stage that fits today. We will keep the next move simple.
        </p>
      </header>

      <DemoDataNotice
        compact
        title="Example family plan"
        description="Profiles, resources, and support listings are demo content. The simplified navigation flow is the product behavior being shown."
      />

      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Current stage</p>
            <h2 className="mt-1 text-2xl font-semibold text-brand-muted-900">{stageMeta[activeStage].label}</h2>
            <p className="mt-2 text-sm text-brand-muted-500">{stage.timeframe}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {guidedSteps.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveStage(item.id)}
                className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                  activeStage === item.id
                    ? 'border-primary bg-primary text-white shadow-soft'
                    : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary'
                }`}
              >
                {stageMeta[item.id].shortLabel}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-surface-border bg-surface-muted p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <Flag className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your stage</p>
            <h3 className="mt-2 text-base font-semibold text-brand-muted-900">{stage.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{stage.focus}</p>
          </article>

          <article className="rounded-3xl border border-primary/15 bg-primary/5 p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <Compass className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Next best step</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-brand-muted-900">{nextStep}</p>
            <Link href="/support/next-steps" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              See my next step <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-3xl border border-surface-border bg-white p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <HandHeart className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Support action</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-brand-muted-900">{supportRoute.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{supportRoute.urgency}</p>
            <Link href="/support/help" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Get support now <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-3xl border border-brand-plum-100 bg-brand-plum-50/70 p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <HandHeart className="h-4.5 w-4.5 text-accent" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">If overwhelmed</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-brand-muted-900">{stage.supportAction}</p>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">One stabilizing action is enough for today.</p>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Compass className="h-4.5 w-4.5 text-primary" />
            <h2 className="section-title">This week</h2>
          </div>
          <ol className="mt-4 space-y-3 text-sm text-brand-muted-600">
            {weekSteps.map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <Link href="/support/next-steps" className="btn-primary mt-5">
            See my full step list <ArrowRight className="h-4 w-4" />
          </Link>
        </article>

        <div className="space-y-5">
          <article className="rounded-3xl border border-surface-border bg-white p-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-primary" />
              <h2 className="section-title">Helpful right now</h2>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-brand-muted-900">{recommendedResource.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{recommendedResource.whyNow}</p>
            <Link href="/support/resources" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Find help for this stage <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-3xl border border-surface-border bg-white p-5">
            <div className="flex items-center gap-2">
              <Link2 className="h-4.5 w-4.5 text-primary" />
              <h2 className="section-title">Community</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted-600">
              Local groups, online spaces, and events where other Texas parents share what is working for them.
            </p>
            <Link href="/support/community" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Find a group near you <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}
