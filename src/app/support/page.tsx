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
  Phone,
  Users,
  Wind,
  TrendingUp,
  Clock3,
  ShieldCheck,
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


  const stagePlaybook: Record<JourneyStageId, { title: string; stat: string; actions: string[]; reassurance: string }> = {
    'just-diagnosed': {
      title: 'Most families start by stabilizing the week',
      stat: 'Week 1 focus used by families nationwide',
      actions: [
        'Schedule one pediatrician or specialist follow-up and write down 3 questions beforehand.',
        'Start a single-page notes tracker for behavior, sleep, and communication patterns.',
        'Choose one trusted education resource instead of doom-scrolling every source.',
      ],
      reassurance: 'You are not behind. Families who simplify early usually make faster, calmer progress by month two.',
    },
    'evaluation': {
      title: 'Most families gather records and clarify next decisions',
      stat: 'Top workflow during evaluation weeks',
      actions: [
        'Collect school/daycare observations plus medical history in one folder.',
        'Confirm insurance benefits for assessments and therapies before appointments.',
        'Prepare a 60-second summary of your concerns to share with each provider.',
      ],
      reassurance: 'Clarity beats speed. A better-organized evaluation week reduces delays later.',
    },
    'starting-therapy': {
      title: 'Most families build consistency over intensity',
      stat: 'Common first-month therapy pattern',
      actions: [
        'Pick 1–2 home carryover routines your family can actually sustain.',
        'Create a shared communication rhythm with the care team (weekly notes/check-in).',
        'Protect caregiver energy by scheduling one no-therapy recovery block this week.',
      ],
      reassurance: 'Consistency at home drives compounding wins more than trying to do everything at once.',
    },
    'ongoing-support': {
      title: 'Most families shift to progress tracking and resilience',
      stat: 'Typical long-term family cadence',
      actions: [
        'Review one measurable gain from the last month with your care team.',
        'Choose one friction point (sleep, transitions, meals) to target this week only.',
        'Refresh your support network touchpoint: group, coach, or caregiver check-in.',
      ],
      reassurance: 'Plateaus are normal. Families who review data and protect routines keep moving forward.',
    },
  };

  const playbook = stagePlaybook[activeStage];

  return (
    <div className="page-shell">
      {/* Header */}
      <header className="page-header">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-2">
          Get Help Choosing What to Do
        </p>
        <h1 className="page-title">Your visual action plan starts here</h1>
        <p className="page-description">
          Built for parents under pressure: choose your current stage and get the exact moves most families make this week.
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">What families do this week</p>
            <p className="mt-2 text-sm font-semibold leading-snug text-brand-muted-900">{playbook.title}</p>
            <p className="mt-2 text-xs text-brand-muted-600">{playbook.stat}</p>
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

      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Parent playbook</p>
            <h2 className="mt-1 text-2xl font-semibold text-brand-muted-900">What parents across the U.S. usually do next</h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
            <TrendingUp className="h-3.5 w-3.5" /> Stage-based guidance
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {playbook.actions.map((action, idx) => (
            <article key={action} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-brand-muted-500">
                <Clock3 className="h-3.5 w-3.5" /> Step {idx + 1}
              </p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-brand-muted-800">{action}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <ShieldCheck className="h-4 w-4" /> Reassurance from real family patterns
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-900">{playbook.reassurance}</p>
        </div>
      </section>

      {/* Decision-path section label */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          Or go directly to
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* Bottom paths */}
      <section className="grid gap-4 md:grid-cols-3">

        {/* Card 1 — Community */}
        <Link
          href="/support/connect"
          className="group relative overflow-hidden rounded-3xl p-6 shadow-card transition hover:shadow-card-hover hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #1a2e52 0%, #32175a 100%)' }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 60%)' }} />
          <div className="relative">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <Users className="h-5 w-5 text-white" />
            </div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">Community</p>
            <h3 className="text-lg font-bold text-white leading-snug">You are not alone in this.</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Local groups and online spaces where parents share what is actually working — not just what sounds good.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
              Find your people <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        {/* Card 2 — Sensory-friendly */}
        <Link
          href="/support/find?need=sensory-friendly"
          className="group relative overflow-hidden rounded-3xl p-6 shadow-card transition hover:shadow-card-hover hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #ffffff 0%, transparent 60%)' }} />
          <div className="relative">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">Local Guide</p>
            <h3 className="text-lg font-bold text-white leading-snug">Places that actually get it.</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Haircuts, dentists, parks, restaurants — real Houston-area spots that are good with your child.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
              See the guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        {/* Card 3 — Crisis / Help lines */}
        <Link
          href="/support/find?need=crisis"
          className="group relative overflow-hidden rounded-3xl p-6 shadow-card transition hover:shadow-card-hover hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)' }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #ffffff 0%, transparent 55%)' }} />
          <div className="relative">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">Crisis Support</p>
            <h3 className="text-lg font-bold text-white leading-snug">Someone is always there.</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Real numbers, always staffed. If today is hard — or if you need to talk right now.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
              See help lines <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
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
