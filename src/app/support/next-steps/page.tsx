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
import PathToIndependence from '@/components/PathToIndependence';

const validStageIds: JourneyStageId[] = [
  'pre-diagnosis',
  'just-diagnosed',
  'starting-therapy',
  'school-transition',
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

      {/* ── Just Diagnosed: warm narrative layout ── */}
      {activeStage === 'just-diagnosed' && (
        <>
          {/* 1. Emotional acknowledgment — full width, warm */}
          <section className="rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #f4efe8 0%, #fff8f8 100%)', border: '1px solid #e8e0d8' }}>
            <div className="px-6 pt-7 pb-6 sm:px-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#8b2442' }}>You are not alone in this</p>
              <h2 className="text-2xl font-bold leading-snug mb-4" style={{ color: '#1a2e52' }}>
                What you are feeling right now is real.<br />And it makes complete sense.
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#474950' }}>
                Relief. Grief. Love. Fear. Urgency. Confusion. They can all be true at once — and they usually are.
                A diagnosis is not a ceiling on your child. It is a door to the support they have always deserved.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#474950' }}>
                The fact that you are here — searching, reading, trying to figure out what comes next —
                already says everything about the kind of parent you are. <strong style={{ color: '#1a2e52' }}>That love is the foundation everything else is built on.</strong>
              </p>
            </div>
            {/* Mental health bridge */}
            <div className="border-t px-6 py-4 sm:px-8 flex flex-wrap items-center justify-between gap-3" style={{ borderColor: '#e8e0d8', backgroundColor: 'rgba(139,36,66,0.04)' }}>
              <p className="text-sm" style={{ color: '#5a5d64' }}>
                <strong style={{ color: '#8b2442' }}>Your mental health matters too.</strong>{' '}
                Parents of newly diagnosed children are at significantly higher risk of burnout, anxiety, and grief spirals. You need support as much as your child does.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/support/caregiver" className="inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition hover:opacity-80" style={{ borderColor: '#8b2442', color: '#8b2442', backgroundColor: 'white' }}>
                  <HeartHandshake className="h-3.5 w-3.5" /> Support for you
                </Link>
                <Link href="/support/hard-days" className="inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition hover:opacity-80" style={{ borderColor: '#d4d8e3', color: '#1a2e52', backgroundColor: 'white' }}>
                  <HandHeart className="h-3.5 w-3.5" /> Hard days
                </Link>
              </div>
            </div>
          </section>

          {/* 2. Why right now matters — early intervention urgency, not clinical */}
          <section className="rounded-3xl border p-6 sm:p-8" style={{ borderColor: '#d4d8e3', backgroundColor: '#ffffff' }}>
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: '#fff3cd' }}>
                <TrendingUp className="h-5 w-5" style={{ color: '#92400e' }} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: '#92400e' }}>Why the next few weeks matter</p>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1a2e52' }}>Early ABA therapy changes outcomes. The research is not subtle about this.</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: '#5a5d64' }}>
                  Children who start ABA therapy early — especially before age 5 — show dramatically stronger gains in communication, social connection, and daily independence than those who start later.
                  Every month of early intervention compounds. The steps you take in the next few weeks are not just logistical. <strong style={{ color: '#1a2e52' }}>They are developmental.</strong>
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#5a5d64' }}>
                  This is not meant to pressure you. It is meant to tell you the truth: <strong style={{ color: '#1a2e52' }}>what you do next is one of the most important things you will ever do for your child.</strong> And you can do it.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Texas ABA Centers — why us, warm not salesy */}
          <section className="overflow-hidden rounded-3xl" style={{ background: 'linear-gradient(135deg, #1a2e52 0%, #32175a 100%)' }}>
            <div className="px-6 pt-7 pb-5 sm:px-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 mb-2">Texas ABA Centers</p>
              <h3 className="text-xl font-bold text-white mb-2">We were built for this exact moment.</h3>
              <p className="text-sm leading-relaxed text-white/75 max-w-2xl">
                Most families wait 5+ months to get into ABA therapy in Texas. We disrupted that. From your first call to your child’s first therapy session, most families are in care within <strong className="text-white">47 days</strong>. We handle the diagnosis and the therapy in one place — so your child never gets lost between providers.
              </p>
            </div>
            {/* Differentiators — horizontal strip */}
            <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <Sparkles className="h-4 w-4" />, label: 'Individualized programs', desc: 'Your child’s BCBA builds a plan around them specifically — not a template' },
                { icon: <Home className="h-4 w-4" />, label: 'Home, clinic, school & community', desc: 'We go where your child is so skills transfer to real life' },
                { icon: <Infinity className="h-4 w-4" />, label: 'No aging out', desc: 'We serve children through their teen years — you never have to start over' },
                { icon: <HeartHandshake className="h-4 w-4" />, label: 'Family included', desc: 'Parent coaching and caregiver support are part of how we work' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2 bg-white/5 px-5 py-4">
                  <span className="text-white/50">{item.icon}</span>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-xs leading-relaxed text-white/60">{item.desc}</p>
                </div>
              ))}
            </div>
            {/* CTA */}
            <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-sm text-white/60 max-w-md">
                One call. Free. They will verify your insurance, answer your questions, and schedule your intake — no referral needed.
              </p>
              <a
                href="tel:8777715725"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
                style={{ backgroundColor: '#e2283a' }}
              >
                <Phone className="h-4 w-4" /> Call (877) 771-5725
              </a>
            </div>
          </section>

          {/* 4. Your checklist — warm, not clinical */}
          <section className="rounded-3xl border p-6 sm:p-8" style={{ borderColor: '#d4d8e3', backgroundColor: '#ffffff' }}>
            <div className="flex items-center gap-2 mb-5">
              <Compass className="h-5 w-5" style={{ color: '#1a2e52' }} />
              <h3 className="text-base font-bold" style={{ color: '#1a2e52' }}>Your next steps — one at a time</h3>
            </div>
            <div className="space-y-2">
              {firstSteps.map((item, index) => {
                const isDone = checkedSet.has(index);
                return (
                  <button
                    key={item}
                    onClick={() => toggleCheck(index)}
                    className={`flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
                      isDone ? 'border-green-200 bg-green-50' : 'border-surface-border hover:bg-surface-muted'
                    }`}
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: isDone ? '#16a34a' : '#1a2e52' }}>
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </div>
                    <p className={`text-sm leading-relaxed ${ isDone ? 'text-green-700 line-through' : 'text-brand-muted-700' }`}>{item}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 5. If you are struggling — mental health bottom strip */}
          <section className="rounded-3xl border p-6 sm:p-8" style={{ borderColor: '#e8d5de', backgroundColor: '#fdf6f8' }}>
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: '#f9e4eb' }}>
                <HandHeart className="h-5 w-5" style={{ color: '#8b2442' }} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: '#8b2442' }}>For the parent right now</p>
                <h3 className="text-base font-bold mb-2" style={{ color: '#1a2e52' }}>If you are struggling, that is not weakness. It is love under pressure.</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#5a5d64' }}>
                  Grief after a diagnosis is real. So is the fear, the overwhelm, and the loneliness that can follow. These pages were built for exactly where you are right now.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/support/caregiver" className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90" style={{ backgroundColor: '#8b2442' }}>
                    <HeartHandshake className="h-3.5 w-3.5" /> Your mental health
                  </Link>
                  <Link href="/support/hard-days" className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition hover:bg-white" style={{ borderColor: '#d4b3cd', color: '#8b2442', backgroundColor: 'transparent' }}>
                    <HandHeart className="h-3.5 w-3.5" /> Hard days guide
                  </Link>
                  <Link href="/support/help" className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition hover:bg-white" style={{ borderColor: '#d4d8e3', color: '#1a2e52', backgroundColor: 'transparent' }}>
                    Crisis lines &amp; helplines
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Starting Therapy — interactive Path to Independence */}
      {activeStage === 'starting-therapy' && (
        <PathToIndependence />
      )}

      {/* ── School Transition: IEP, placement, advocacy ── */}
      {activeStage === 'school-transition' && (
        <>
          {/* Hero block */}
          <section
            className="rounded-3xl p-8 sm:p-10"
            style={{ background: 'linear-gradient(135deg, #1a2e52 0%, #2d4a7a 60%, #3a5a8a 100%)' }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200 mb-2">School Transition</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              You don’t need to know every rule.<br />
              <span className="text-blue-300">You need to know your child.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-blue-100 max-w-2xl">
              Whether this is your child’s first IEP meeting, a school transition, or a fight for services that aren’t happening — the system can feel overwhelming. You are the most important person in that room. Here’s how to show up prepared.
            </p>
            <a
              href="tel:+18777715725"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-red-700 transition-colors"
            >
              <Phone className="h-4 w-4" /> Talk to our school navigation team — (877) 771-5725
            </a>
          </section>

          {/* What the school system owes your child */}
          <section className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-1">Know Your Rights</p>
            <h3 className="text-xl font-bold text-brand-muted-900 mb-4">What the school system is required to provide</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Free Appropriate Public Education (FAPE)', desc: 'Every child with a disability is entitled to a free education tailored to their individual needs — at no cost to you.' },
                { title: 'Least Restrictive Environment (LRE)', desc: 'Your child must be educated alongside non-disabled peers to the maximum extent appropriate.' },
                { title: 'An Individualized Education Program (IEP)', desc: 'A legally binding document with specific goals, services, accommodations, and timelines your child’s team must follow.' },
                { title: 'Prior Written Notice', desc: 'The school must notify you in writing before making any change to your child’s placement or services.' },
                { title: 'Independent Educational Evaluation', desc: 'If you disagree with the school’s evaluation, you have the right to request an IEE at public expense.' },
                { title: 'Annual Review', desc: 'The IEP must be reviewed at least once per year. You can request a meeting at any time if things change.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-white border border-blue-100 p-4">
                  <p className="text-sm font-bold text-primary mb-1">{item.title}</p>
                  <p className="text-sm leading-relaxed text-brand-muted-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* IEP meeting prep */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-1">Before the Meeting</p>
            <h3 className="text-xl font-bold text-brand-muted-900 mb-2">How to walk into an IEP meeting prepared</h3>
            <p className="text-sm text-brand-muted-500 mb-5">You don’t have to be an expert. You just need to be organized and specific about what your child needs. </p>
            <div className="space-y-3">
              {[
                { step: '1', label: 'Gather everything in one place', desc: 'Diagnosis reports, therapy progress notes, teacher feedback, past IEPs. Bring physical copies.' },
                { step: '2', label: 'Write your parent concerns letter', desc: 'A 1-page summary of what is hard right now, what’s working, and what you need the school to address. This becomes part of the official record.' },
                { step: '3', label: 'List 2–3 specific goals you want discussed', desc: 'Be concrete: “I want reading support for decoding, not just comprehension.” Vague requests get vague answers.' },
                { step: '4', label: 'Ask for the agenda in advance', desc: 'You have the right to know what’s on the table before you walk in. Request it in writing at least 2 days prior.' },
                { step: '5', label: 'Bring someone with you', desc: 'A spouse, advocate, or trusted friend. Two sets of ears catch more. You can also record meetings in Texas with one-party consent.' },
                { step: '6', label: 'Leave with action items in writing', desc: 'Before you walk out: confirm who owns what, and by when. Follow up with an email summary within 24 hours.' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4 rounded-2xl border border-surface-border px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{item.step}</div>
                  <div>
                    <p className="text-sm font-semibold text-brand-muted-900">{item.label}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-brand-muted-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Texas ABA in school */}
          <section
            className="rounded-3xl p-6 sm:p-8"
            style={{ background: 'linear-gradient(135deg, #8b2442 0%, #6b1a32 100%)' }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-200 mb-2">Texas ABA Centers</p>
            <h3 className="text-xl font-bold text-white mb-3">We go to school with your child</h3>
            <p className="text-base leading-relaxed text-pink-100 mb-5">
              Therapy doesn’t stop at the clinic door. Texas ABA Centers provides support in the school environment so the skills your child builds in therapy transfer directly into the classroom, hallway, and lunch line.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 mb-6">
              {[
                { icon: '🏫', label: 'School-based ABA support', desc: 'BCBAs and RBTs work directly in your child’s school setting' },
                { icon: '📋', label: 'IEP goal alignment', desc: 'Therapy goals are coordinated with school IEP objectives' },
                { icon: '🤝', label: 'Teacher collaboration', desc: 'We communicate directly with teachers and school staff' },
                { icon: '🏠', label: 'Home + clinic + school', desc: 'One seamless plan across every environment your child is in' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/10 border border-white/20 p-4">
                  <p className="text-lg mb-1">{item.icon}</p>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-xs text-pink-200 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
            <a
              href="tel:+18777715725"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-accent shadow hover:bg-pink-50 transition-colors"
            >
              <Phone className="h-4 w-4" /> Call (877) 771-5725 — no referral needed
            </a>
          </section>

          {/* Red flags and advocacy */}
          <section className="grid gap-5 sm:grid-cols-2">
            <article className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 mb-2">Watch For These</p>
              <h3 className="text-base font-bold text-brand-muted-900 mb-3">Red flags in an IEP meeting</h3>
              <ul className="space-y-2">
                {[
                  'The team discourages you from bringing an advocate',
                  'Goals are vague (“make progress” with no baseline)',
                  'Services are cut without a written explanation',
                  'You’re told “we don’t do that here” without citing policy',
                  'The meeting feels rushed or pre-decided before you arrived',
                  'No one asks what you’ve observed at home',
                ].map((flag) => (
                  <li key={flag} className="flex items-start gap-2 text-sm text-amber-900">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                    {flag}
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-3xl border border-surface-border bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-2">When Things Get Stuck</p>
              <h3 className="text-base font-bold text-brand-muted-900 mb-3">Escalation options in Texas</h3>
              <ul className="space-y-3">
                {[
                  { label: 'Request mediation', desc: 'TEA offers free mediation between families and districts — less adversarial than due process.' },
                  { label: 'File a state complaint', desc: 'If the district violates IDEA, you can file a complaint with the Texas Education Agency.' },
                  { label: 'Request due process', desc: 'A formal legal proceeding. Get an advocate or attorney before this step.' },
                  { label: 'Contact Disability Rights Texas', desc: 'Free legal advocacy for Texans with disabilities — disabilityrightstx.org' },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-brand-muted-900">{item.label}</p>
                      <p className="text-xs text-brand-muted-500 mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          {/* For the parent */}
          <section className="rounded-3xl border border-brand-plum-100 bg-brand-plum-50/50 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent mb-2">For You, Not Just Your Child</p>
            <h3 className="text-xl font-bold text-brand-muted-900 mb-2">IEP meetings are emotionally exhausting.</h3>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-4">
              Sitting across a table from a team of professionals while advocating for your child is one of the hardest things a parent does. It’s okay to leave a meeting and fall apart in the car. It’s okay to feel like you failed when you didn’t get everything. You showed up. That matters.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/support/caregiver" className="inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-white px-4 py-2 text-sm font-semibold text-accent hover:bg-brand-plum-50 transition-colors">
                Caregiver support <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/support/hard-days" className="inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-white px-4 py-2 text-sm font-semibold text-accent hover:bg-brand-plum-50 transition-colors">
                Hard days <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/support/help" className="inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-white px-4 py-2 text-sm font-semibold text-accent hover:bg-brand-plum-50 transition-colors">
                Find support now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        </>
      )}






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
