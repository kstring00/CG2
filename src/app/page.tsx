'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Heart,
  HeartHandshake,
  Lock,
  MapPin,
  Phone,
  Shield,
  Star,
  Users,
  Wind,
} from 'lucide-react';


export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f4efe8' }}>

      {/* ─────────────────────────────────────────
          NAV
      ───────────────────────────────────────── */}
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

      {/* ─────────────────────────────────────────
          HERO — full bleed photo, split layout:
          left = emotional headline, right = action guide
      ───────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16" style={{ minHeight: '680px' }}>

        {/* Photo — full bleed, framed on therapist face + logo */}
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
          {/* Left overlay — photo is naturally bright on left so use a warm dark tint */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(8,15,30,0.82) 0%, rgba(8,15,30,0.70) 28%, rgba(8,15,30,0.30) 52%, rgba(8,15,30,0.0) 72%)',
            }}
          />
          {/* No bottom fade — crisp edge */}
          {/* Top fade — nav edge */}
          <div
            className="absolute top-0 left-0 right-0 h-20"
            style={{ background: 'linear-gradient(to bottom, rgba(8,15,30,0.55) 0%, transparent 100%)' }}
          />
        </div>

        {/* Content — left-aligned headline only, photo fills right */}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex min-h-[620px] items-center py-20 sm:py-28">

            {/* LEFT: Headline + CTAs — sits over the natural open left zone */}
            <div className="w-full max-w-[540px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                <Heart className="h-3 w-3 text-rose-400" /> Texas ABA Centers · Common Ground
              </span>
              <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.07] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                You don&apos;t have to figure this out alone.
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                Common Ground helps parents understand what to do next — with clear guidance, local support, and real help for you, not just your child.
              </p>
              <div className="mt-7 flex flex-col gap-2.5 text-sm text-white/70">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Parent mental health tools &amp; therapist referrals</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Clinically reviewed by BCBAs at Texas ABA Centers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Free for every family — no sign-up required</span>
                </div>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/support/next-steps"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-md transition hover:bg-white/92"
                >
                  Start Here <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Explore Support Options
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          HOW THIS WORKS — 3-step, right below hero
      ───────────────────────────────────────── */}
      <section className="border-b border-stone-100 bg-white px-6 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { n: '1', title: 'Understand where you are', desc: 'Quick guidance based on your situation — no jargon.' },
              { n: '2', title: 'Get your next steps', desc: 'Clear, simple actions. No guessing. No overwhelm.' },
              { n: '3', title: 'Find real support', desc: 'Local providers, parent connections, and help for you.' },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{step.n}</div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{step.title}</p>
                  <p className="mt-0.5 text-sm text-stone-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 border-t border-stone-100 pt-5 text-center text-xs text-stone-400">
            Built by <span className="font-semibold text-stone-600">Texas ABA Centers</span> to support families — not just clients.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          CRISIS BAR
      ───────────────────────────────────────── */}
      <div className="border-b border-rose-200 bg-rose-600 px-6 py-3 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center text-sm">
          <span className="flex items-center gap-2 font-bold text-white">
            <Phone className="h-3.5 w-3.5" /> Need help right now?
          </span>
          <span className="text-rose-100">Call or text <a href="tel:988" className="font-bold text-white underline hover:text-rose-200">988</a></span>
          <span className="hidden text-rose-300 sm:inline">·</span>
          <span className="text-rose-100">Harris Center <a href="tel:7139707000" className="font-bold text-white underline hover:text-rose-200">(713) 970-7000</a></span>
          <span className="hidden text-rose-300 sm:inline">·</span>
          <span className="text-rose-100">Emergency: call <span className="font-bold text-white">911</span></span>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          WHAT DO YOU NEED
      ───────────────────────────────────────── */}
      <section className="px-6 py-16 sm:px-8 sm:py-20" style={{ backgroundColor: '#f4efe8' }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">
              What do you need right now?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-stone-500">
              Pick the one that sounds like your week. We&apos;ll take it from there.
            </p>
          </div>

          {/* Primary CTA — dominant, unmissable */}
          <Link
            href="/support/next-steps"
            className="group mb-5 flex items-center justify-between gap-6 overflow-hidden rounded-3xl border-2 border-primary bg-primary p-7 shadow-md transition hover:bg-primary/95 sm:p-9"
          >
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                  Most parents start here
                </p>
                <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                  &ldquo;I don&apos;t know what to do next.&rdquo;
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80">
                  A short plan for where you are today — just the next right step.
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 flex-col items-center gap-1.5 sm:flex">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition group-hover:bg-white/95">
                Start here <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-xs text-white/50">Takes about 2 minutes</span>
            </div>
          </Link>

          {/* 3 companion cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                eyebrow: 'I need real-world help near me',
                title: 'Local sensory-friendly guide',
                desc: 'Parks, restaurants, stores, and places that are sensory-smart and good for kids on the spectrum. Verified. Local. Go-ready.',
                cta: 'See places near you',
                href: '/support/find',
                icon: MapPin,
                color: 'text-emerald-400',
                eyebrow_color: 'text-emerald-400',
              },
              {
                eyebrow: 'I want to understand more',
                title: 'What is ABA, really?',
                desc: 'Plain answers to the questions every parent has. No jargon. Just clarity on what ABA therapy actually looks like day to day.',
                cta: 'Get clear answers',
                href: '/support/what-is-aba',
                icon: BookOpen,
                color: 'text-amber-400',
                eyebrow_color: 'text-amber-400',
              },
              {
                eyebrow: 'I feel alone',
                title: 'Community & connection',
                desc: 'Other parents who have been where you are. Local meetups, online spaces, and people who get it.',
                cta: 'Find your people',
                href: '/support/connect',
                icon: Users,
                color: 'text-violet-400',
                eyebrow_color: 'text-violet-400',
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group flex flex-col rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <p className={`text-[10px] font-semibold uppercase tracking-widest ${card.eyebrow_color}`}>
                  {card.eyebrow}
                </p>
                <h3 className="mt-2 text-base font-bold text-stone-900">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{card.desc}</p>
                <span className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${card.color}`}>
                  {card.cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          {/* Quiet secondary links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <p className="w-full text-center text-[11px] font-medium uppercase tracking-widest text-stone-400">Or go straight to what you need</p>
            <Link href="/support/caregiver" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-plum-700 underline-offset-2 hover:underline">
              <Heart className="h-3.5 w-3.5" /> I need support too
            </Link>
            <span className="text-stone-300">·</span>
            <Link href="/support/siblings" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-plum-700 underline-offset-2 hover:underline">
              <Users className="h-3.5 w-3.5" /> My other kids are struggling
            </Link>
            <span className="text-stone-300">·</span>
            <Link href="/support/hard-days" className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 underline-offset-2 hover:underline">
              <Wind className="h-3.5 w-3.5" /> I need support right now
            </Link>
          </div>
        </div>
      </section>



      {/* ─────────────────────────────────────────
          PARENT SUPPORT — two col
      ───────────────────────────────────────── */}
      <section className="px-6 py-16 sm:py-20 sm:px-8" style={{ backgroundColor: '#f9f8f6' }}>
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            {/* Left */}
            <div className="p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-plum-600">
                Support for you — the parent
              </p>
              <h2 className="mt-3 text-2xl font-bold text-stone-900 sm:text-3xl">
                You are part of the plan too.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                When parents are supported, children thrive. These tools are here to help
                you take care of you.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Burnout signs checklist',
                  '4-7-8 breathing & grounding tools',
                  'Therapist referral pathway for caregivers',
                  'Crisis line & quick help, always one tap away',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-stone-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-plum-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/support/caregiver"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-plum-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-plum-800"
              >
                <HeartHandshake className="h-4 w-4" /> Your mental health
              </Link>
            </div>

            {/* Right — grounding tools */}
            <div className="border-t border-stone-100 bg-stone-50 p-8 lg:border-l lg:border-t-0 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                If today is hard — right now
              </p>
              <h3 className="mt-2 text-xl font-bold text-stone-900">One breath. One step.</h3>
              <div className="mt-5 space-y-3">
                {[
                  { label: '4-7-8 breathing', time: '2 min', desc: 'Inhale 4, hold 7, exhale 8. Repeat 4×.' },
                  { label: '5-4-3-2-1 grounding', time: '5 min', desc: 'Name 5 things you see, hear, feel, smell, taste.' },
                  { label: 'One permission', time: '10 sec', desc: '"I am allowed to do this. This is hard and I\'m still a good parent."' },
                ].map((tool) => (
                  <div key={tool.label} className="rounded-2xl border border-stone-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-stone-900">{tool.label}</span>
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] text-stone-500">{tool.time}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-stone-500">{tool.desc}</p>
                  </div>
                ))}
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                  <p className="text-xs font-semibold text-rose-600">If danger feels unmanageable</p>
                  <p className="mt-1 text-sm text-stone-700">
                    Call or text <a href="tel:988" className="font-bold text-rose-600 hover:underline">988</a> — someone will answer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          YOU ARE NOT ALONE
      ───────────────────────────────────────── */}
      <section className="px-6 py-12 sm:px-8 sm:py-16" style={{ backgroundColor: '#f9f8f6' }}>
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/80">
          <div className="grid gap-6 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            {/* Left */}
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <HeartHandshake className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">
                  You are not alone, and you are doing enough.
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone-600">
                  Parenting a child with support needs can feel overwhelming. It&apos;s okay to
                  ask for help. We see you, we hear you, and we&apos;re with you.
                </p>
              </div>
            </div>
            {/* Right — 3 values */}
            <div className="flex flex-wrap gap-3 lg:gap-4">
              {[
                { icon: Star, label: 'Every family', sub: 'Every stage. Every step.' },
                { icon: Heart, label: 'Real support', sub: 'From real people who understand.' },
                { icon: Shield, label: 'Safe, private,', sub: 'and here when you need us.' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm">
                  <item.icon className="h-5 w-5 text-primary" />
                  <p className="text-xs font-semibold text-stone-800">{item.label}</p>
                  <p className="text-[11px] text-stone-500">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          TRUST SIGNALS
      ───────────────────────────────────────── */}
      <div className="border-y border-stone-200 bg-white px-6 py-6 sm:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Shield, label: 'Clinically reviewed', sub: 'by BCBAs' },
            { icon: Users, label: 'Built for families,', sub: 'clients' },
            { icon: Heart, label: 'Serving every stage', sub: 'of the journey' },
            { icon: Lock, label: 'Safe & secure', sub: 'HIPAA-protected' },
          ].map((sig) => (
            <div key={sig.label} className="flex items-center gap-3">
              <sig.icon className="h-5 w-5 shrink-0 text-primary/70" />
              <div>
                <p className="text-xs font-semibold text-stone-700">{sig.label}</p>
                <p className="text-[11px] text-stone-400">{sig.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────
          HONESTY SECTION
      ───────────────────────────────────────── */}
      <section className="px-6 py-14 sm:py-16 sm:px-8" style={{ backgroundColor: '#f9f8f6' }}>
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-5 rounded-3xl border border-stone-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-plum-100">
              <Heart className="h-6 w-6 text-brand-plum-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">
                This is hard. That is not because you are doing it wrong.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                You are carrying a lot. Common Ground is here to lighten the load so it feels
                like a page, not a mountain. Come back anytime. The resources will wait.
              </p>
              <p className="mt-3 text-xs text-stone-400">— the team at Texas ABA Centers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          FOOTER CTA — dark navy
      ───────────────────────────────────────── */}
      <section className="px-6 py-16 sm:py-20 sm:px-8" style={{ backgroundColor: '#1a2e52' }}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            One step at a time. That is enough.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/60">
            You don&apos;t need a plan for the next ten years. Start where you are today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/support/next-steps"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-white/95"
            >
              Start here <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-10 text-xs text-white/35">
            Powered by <span className="font-semibold text-white/60">Texas ABA Centers</span> · Common Ground is available to every family in Texas.
          </p>
        </div>
      </section>

    </main>
  );
}
