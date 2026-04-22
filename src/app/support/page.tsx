'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Heart,
  HeartHandshake,
  HelpCircle,
  Compass,
  MapPin,
  Users,
  Wind,
} from 'lucide-react';
import {
  guidedSteps,
  resources,
  stageMeta,
  type JourneyStageId,
} from '@/lib/data';

export default function SupportHome() {
  const [activeStage, setActiveStage] = useState<JourneyStageId>('just-diagnosed');
  const [overwhelmedOpen, setOverwhelmedOpen] = useState(false);

  const stage = useMemo(
    () => guidedSteps.find((item) => item.id === activeStage) ?? guidedSteps[0],
    [activeStage],
  );

  const recommendedResource = useMemo(
    () =>
      resources.find((r) => r.isFeatured && r.journeyStages.includes(activeStage)) ??
      resources.find((r) => r.journeyStages.includes(activeStage)) ??
      resources[0],
    [activeStage],
  );

  const nextStep = stage.checklist[0];

  return (
    <div className="page-shell">
      {/* Header */}
      <header className="page-header">
        <h1 className="page-title">You are in the right place.</h1>
        <p className="page-description">
          Tell us where you are today and we will keep the next move simple.
          You do not have to figure this out all at once.
        </p>
      </header>

      {/* Overwhelmed Today card — emotionally primary */}
      {overwhelmedOpen ? (
        <section className="rounded-3xl border-2 border-brand-plum-200 bg-gradient-to-br from-brand-plum-50 via-white to-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-plum-100">
              <Wind className="h-6 w-6 text-brand-plum-700" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-plum-700">
                If today feels heavy
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-brand-muted-900">
                One breath. One step. That is enough.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted-600">
                You do not have to solve everything today. Here are the only things that matter right now.
              </p>
              <ol className="mt-5 space-y-3">
                {[
                  'Take one slow breath. Seriously — just that.',
                  'Pick one small thing from the list below, not the whole list.',
                  'If things feel unsafe or unmanageable, call or text 988. Someone will answer.',
                  'Your care team is one message away. You do not have to figure this out alone.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-brand-muted-700">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-plum-100 text-xs font-bold text-brand-plum-700">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/support/caregiver"
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand-plum-700 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-plum-800"
                >
                  <HeartHandshake className="h-4 w-4" /> Support for you
                </Link>
                <Link
                  href="/support/find"
                  className="inline-flex items-center gap-2 rounded-2xl border border-brand-plum-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-plum-700 transition hover:bg-brand-plum-50"
                >
                  Help lines &amp; hotlines
                </Link>
                <button
                  onClick={() => setOverwhelmedOpen(false)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-muted-600 transition hover:bg-surface-muted"
                >
                  I am okay for now
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <button
          onClick={() => setOverwhelmedOpen(true)}
          className="group w-full rounded-3xl border-2 border-brand-plum-100 bg-gradient-to-r from-brand-plum-50/80 to-white p-5 text-left transition hover:border-brand-plum-200 hover:shadow-soft"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-plum-100">
                <Wind className="h-5 w-5 text-brand-plum-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-muted-900">
                  If today feels overwhelming — start here.
                </p>
                <p className="mt-0.5 text-xs text-brand-muted-500">
                  One breath, one step. We will hold the rest.
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-brand-plum-500 transition-transform group-hover:translate-x-1" />
          </div>
        </button>
      )}

      {/* Stage selector + This Week focus */}
      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Where are you right now?
            </p>
            <h2 className="mt-1 text-xl font-semibold text-brand-muted-900">
              Choose the stage that fits today
            </h2>
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

        {/* Four action cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-primary/15 bg-primary/5 p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <Compass className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">This week&apos;s focus</p>
            <p className="mt-2 text-sm font-semibold leading-snug text-brand-muted-900">{stage.focus}</p>
          </article>

          <article className="rounded-3xl border border-surface-border bg-surface-muted p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Next best step</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-brand-muted-900">{nextStep}</p>
            <Link
              href="/support/next-steps"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              See the full plan <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-3xl border border-surface-border bg-white p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Helpful right now</p>
            <p className="mt-2 text-sm font-semibold leading-snug text-brand-muted-900">
              {recommendedResource.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-brand-muted-500">
              {recommendedResource.whoItsFor}
            </p>
            <Link
              href={recommendedResource.url ?? '/support/resources'}
              target={recommendedResource.url ? '_blank' : undefined}
              rel={recommendedResource.url ? 'noopener noreferrer' : undefined}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              {recommendedResource.url ? 'Open resource' : 'Browse the library'} <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-3xl border border-brand-plum-100 bg-brand-plum-50/60 p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <HeartHandshake className="h-5 w-5 text-brand-plum-700" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-plum-700">Support for you</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-brand-muted-900">
              {stage.supportAction}
            </p>
            <Link
              href="/support/caregiver"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-plum-700 hover:underline"
            >
              Caregiver support <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </section>

      {/* Bottom paths */}
      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/support/connect"
          className="group rounded-3xl border border-surface-border bg-white p-6 shadow-card transition hover:border-primary/30 hover:shadow-card-hover"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-brand-muted-900">You are not alone</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            Local groups and online spaces where parents share what is working.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Find your people <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/support/sensory-friendly"
          className="group rounded-3xl border border-surface-border bg-white p-6 shadow-card transition hover:border-emerald-200 hover:shadow-card-hover"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
            <MapPin className="h-5 w-5 text-emerald-700" />
          </div>
          <h3 className="font-semibold text-brand-muted-900">Local sensory-friendly places</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            Haircuts, dentists, parks — real places near you that are good with your child.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            See the guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/support/help"
          className="group rounded-3xl border border-surface-border bg-white p-6 shadow-card transition hover:border-accent/30 hover:shadow-card-hover"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
            <HelpCircle className="h-5 w-5 text-accent" />
          </div>
          <h3 className="font-semibold text-brand-muted-900">Help lines &amp; hotlines</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            If you need to talk to someone right now — real numbers, always staffed.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            See help lines <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>

      {/* Reassurance footer */}
      <div className="rounded-3xl border border-primary/10 bg-white p-6 sm:p-8 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10">
            <Heart className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-brand-muted-900">
              You are doing more than you think.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
              Showing up, searching for help, reading this — that counts. Parenting a child with
              support needs is one of the most demanding things there is. Common Ground is here to
              make it a little lighter. One step at a time.
            </p>
            <p className="mt-3 text-xs text-brand-muted-400">— The team at Texas ABA Centers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
