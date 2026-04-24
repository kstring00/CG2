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
  Phone,
  Clock,
  ShieldCheck,
  CalendarCheck,
  ChevronRight,
  Home,
  School,
  Infinity,
  HeartHandshake,
  Sparkles,
  TrendingUp,
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

      {/* ── Pre-Diagnosis: CTA block right after stage picker ── */}
      {activeStage === 'pre-diagnosis' && (
        <>
          {/* Big conversion block */}
          <section className="overflow-hidden rounded-3xl" style={{ background: 'linear-gradient(135deg, #1a2e52 0%, #32175a 100%)' }}>
            <div className="px-6 pt-7 pb-6 sm:px-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 mb-2">Texas ABA Centers</p>
              <h2 className="text-2xl font-bold text-white leading-snug mb-2">
                Don&apos;t wait another month.<br />Get your child evaluated now.
              </h2>
              <p className="text-sm leading-relaxed text-white/70 max-w-lg">
                The average Texas family waits <strong className="text-white">5+ months</strong> to get into ABA therapy.
                Texas ABA Centers handles the diagnosis <em>and</em> the therapy in one place —
                most families are in therapy within <strong className="text-white">47 days</strong> of their first call.
              </p>
            </div>
            <div className="grid gap-px bg-white/10 sm:grid-cols-4">
              {[
                { icon: <Phone className="h-4 w-4" />, step: '1', label: 'Free Call', desc: 'We verify insurance + schedule your evaluation' },
                { icon: <CalendarCheck className="h-4 w-4" />, step: '2', label: 'ADOS-2 Eval', desc: 'Play-based autism assessment, 2–4 hours' },
                { icon: <Clock className="h-4 w-4" />, step: '3', label: '1–2 Weeks', desc: 'Our team reviews all data' },
                { icon: <ShieldCheck className="h-4 w-4" />, step: '4', label: 'Diagnosis + Plan', desc: 'Written report + therapy starts here' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2 bg-white/5 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: 'rgba(226,40,58,0.7)' }}>{item.step}</span>
                    <span className="text-white/50">{item.icon}</span>
                  </div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-xs leading-relaxed text-white/60">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="flex flex-wrap gap-4">
                {['Free consultation', 'Insurance verified on first call', 'Diagnosis + therapy in one place', 'No referral needed'].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <a href="tel:8777715725" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: '#e2283a' }}>
                  <Phone className="h-4 w-4" /> Call (877) 771-5725
                </a>
                <p className="text-[11px] text-white/40 text-center">Free · No referral needed · Mon–Fri</p>
              </div>
            </div>
            <div className="border-t px-6 py-4 sm:px-8" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-2">What happens on that first call</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {['We listen to what you\'re seeing', 'We verify your insurance benefits', 'We schedule your evaluation appointment'].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs text-white/60">
                    <ChevronRight className="h-3 w-3 text-white/30" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Why Texas ABA Centers — value prop cards */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-3">Why Texas ABA Centers</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <TrendingUp className="h-5 w-5 text-amber-700" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-1">Early intervention matters most</p>
                <p className="text-sm leading-relaxed text-brand-muted-700">
                  Research is clear: the earlier ABA therapy starts, the greater the impact. Every month without services is a month of development your child cannot get back. Starting the evaluation process now — not next quarter — is the most important thing you can do.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                  <Sparkles className="h-5 w-5 text-sky-700" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-sky-700 mb-1">Individualized — not cookie-cutter</p>
                <p className="text-sm leading-relaxed text-brand-muted-700">
                  Every child gets a program built specifically for them by a Board Certified Behavior Analyst. No shared curricula, no one-size approach. Goals are set around your child’s actual needs, updated with data every session, and adjusted as they grow.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <Home className="h-5 w-5 text-emerald-700" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 mb-1">Home, clinic, school, community</p>
                <p className="text-sm leading-relaxed text-brand-muted-700">
                  Skills learned in one place don’t always transfer to another. We go where your child is — home, clinic, school, and community settings — so therapy generalizes into real life, not just the therapy room.
                </p>
              </div>

              <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                  <Infinity className="h-5 w-5 text-violet-700" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-violet-700 mb-1">We don’t age out children</p>
                <p className="text-sm leading-relaxed text-brand-muted-700">
                  Many ABA providers stop services at age 6 or 8. We don’t. Texas ABA Centers serves children through their teen years, adapting programming as your child’s needs evolve. You don’t have to start over somewhere new.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                  <HeartHandshake className="h-5 w-5 text-rose-700" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-rose-700 mb-1">Care that includes you</p>
                <p className="text-sm leading-relaxed text-brand-muted-700">
                  We are expanding our support beyond just your child. Parent training, caregiver coaching, and family guidance are becoming core parts of how we work — because when parents are supported, children thrive faster. You are part of the plan.
                </p>
              </div>

              <div className="rounded-2xl border border-surface-border bg-white p-5 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-primary mb-1">Ready to take the first step?</p>
                  <p className="text-sm leading-relaxed text-brand-muted-600 mb-4">
                    One call is all it takes to find out if your child qualifies and what your insurance covers. It’s free and takes less than 10 minutes.
                  </p>
                </div>
                <a
                  href="tel:8777715725"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#1a2e52' }}
                >
                  <Phone className="h-4 w-4" /> (877) 771-5725
                </a>
              </div>

            </div>
          </div>
        </>
      )}

      {/* Non-pre-diagnosis: show original main card + what matters now */}
      {activeStage !== 'pre-diagnosis' && (
        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{step.timeframe}</span>
              <span className="rounded-full bg-surface-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-muted-500">{step.lastUpdated}</span>
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
      )}

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
