'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Heart, Lock, Wind } from 'lucide-react';
import CrisisPill from '@/components/CrisisPill';

const CREDIBILITY_CHECKS = [
  'Parent mental health tools & therapist referrals',
  'Clinically reviewed by BCBAs at Texas ABA Centers',
  'Free for every family — no sign-up required',
] as const;

const PATH_STEPS = [
  { n: '1', title: 'Understand where you are', desc: 'Quick guidance based on your situation — no jargon.' },
  { n: '2', title: 'Get your next steps', desc: 'Clear, simple actions. No guessing. No overwhelm.' },
  { n: '3', title: 'Find real support', desc: 'Local providers, parent connections, and help for you.' },
] as const;

const GROUNDING_TOOLS = [
  {
    label: '4-7-8 breathing',
    time: '2 min',
    desc: 'Inhale 4, hold 7, exhale 8. Repeat 4×.',
  },
  {
    label: '5-4-3-2-1 grounding',
    time: '5 min',
    desc: 'Name 5 things you see, hear, feel, smell, taste.',
  },
  {
    label: 'One permission',
    time: '10 sec',
    desc: '"I am allowed to do this. This is hard and I\'m still a good parent."',
  },
] as const;

export default function HomePage() {
  function handleStartIntake() {
    // Placeholder — Prompt 4 will wire this to IntakeFlow.
    console.log('intake will open here');
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f4efe8' }}>
      {/* NAV — copied forward verbatim from the prior homepage. */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" aria-label="Common Ground home">
            <Image
              src="/logos/cg2-lockup-final.png"
              alt="Texas ABA Centers | Common Ground"
              width={320}
              height={48}
              priority
              className="h-8 w-auto sm:h-9"
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <CrisisPill />
            <Link
              href="/client"
              className="hidden items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent/80 sm:inline-flex"
            >
              <Lock className="h-3.5 w-3.5" /> Client sign in
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              Care Navigation <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO — warm photograph + emotional headline + action subhead + intake CTA */}
      <section className="relative overflow-hidden pt-16" style={{ minHeight: '680px' }}>
        <div className="absolute inset-0">
          <Image
            src="/hero-selected.jpg"
            alt="Father and daughter doing a puzzle with Texas ABA Centers therapy kit"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: '62% 28%' }}
          />
          {/* Left overlay — keeps the headline readable over the bright left side */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(8,15,30,0.82) 0%, rgba(8,15,30,0.70) 28%, rgba(8,15,30,0.30) 52%, rgba(8,15,30,0.0) 72%)',
            }}
          />
          {/* Top fade — softens the boundary with the fixed nav */}
          <div
            className="absolute top-0 left-0 right-0 h-20"
            style={{ background: 'linear-gradient(to bottom, rgba(8,15,30,0.55) 0%, transparent 100%)' }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex min-h-[620px] items-center py-20 sm:py-28">
            <div className="w-full max-w-[560px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                <Heart className="h-3 w-3 text-rose-400" /> Texas ABA Centers · Common Ground
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.07] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                You don&apos;t have to figure this out alone.
              </h1>
              <p className="mt-5 text-xl font-semibold leading-snug text-white sm:text-2xl">
                Get your next steps now.
              </p>
              <p className="mt-3 max-w-md text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                Common Ground helps parents understand what to do next — with clear guidance, local support, and real help for you, not just your child.
              </p>

              <div className="mt-7 flex flex-col gap-2.5 text-sm text-white/80">
                {CREDIBILITY_CHECKS.map((line) => (
                  <div key={line} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-col items-start gap-3">
                <button
                  type="button"
                  onClick={handleStartIntake}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-md transition hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  Get your next steps <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  href="/support"
                  className="text-sm font-medium text-white/80 underline-offset-4 transition hover:text-white hover:underline"
                >
                  Or browse support directly →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PATH PREVIEW — what to expect after clicking the CTA */}
      <section className="border-y border-stone-100 bg-white px-6 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {PATH_STEPS.map((step) => (
              <div key={step.n} className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {step.n}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{step.title}</p>
                  <p className="mt-0.5 text-sm text-stone-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUIET WARMTH — short paragraph + grounding tools, compact */}
      <section className="px-6 py-12 sm:px-8 sm:py-14" style={{ backgroundColor: '#f4efe8' }}>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-plum-600">
              You don&apos;t have to figure this out alone
            </p>
            <h2 className="mt-3 text-2xl font-bold text-stone-900 sm:text-3xl">
              You are part of the plan, too.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
              Common Ground was built by Texas ABA Centers to support whole families — not just clients. The intake adapts to where you are today, so the next step you see is actually yours.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-7">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
              <Wind className="h-3.5 w-3.5" /> If today is hard — right now
            </p>
            <h3 className="mt-2 text-lg font-bold text-stone-900">One breath. One step.</h3>
            <div className="mt-4 space-y-2.5">
              {GROUNDING_TOOLS.map((tool) => (
                <div key={tool.label} className="rounded-2xl border border-stone-200 bg-white p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-stone-900">{tool.label}</span>
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] text-stone-500">{tool.time}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-stone-500">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 sm:px-8" style={{ backgroundColor: '#f4efe8' }}>
        <p className="mx-auto max-w-3xl text-center text-xs text-stone-400">
          Powered by <span className="font-semibold text-stone-600">Texas ABA Centers</span> · Common Ground is available to every family in Texas. {' · '}
          <Link href="/privacy" className="underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </main>
  );
}
