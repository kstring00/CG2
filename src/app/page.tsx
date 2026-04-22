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
import { TexasAbaLogo } from '@/components/brand/TexasAbaLogo';

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f9f8f6' }}>

      {/* ─────────────────────────────────────────
          NAV
      ───────────────────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Common Ground home">
            <TexasAbaLogo priority decorative className="h-7 w-auto sm:h-8" />
            <span className="border-l border-stone-200 pl-3 font-display text-base font-bold text-stone-900 sm:text-lg">
              Common Ground
            </span>
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
          HERO — 2-column, image in rounded card
      ───────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16" style={{ backgroundColor: '#f7f2eb' }}>
        <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-20">

          {/* LEFT — text */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white/80 px-3 py-1 text-xs font-medium text-rose-500">
              <Heart className="h-3 w-3" /> Care begins with understanding.
            </span>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.08] tracking-tight text-slate-900 lg:text-6xl">
              You don&apos;t have to figure this out alone.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Common Ground is here for every family in Texas — whether you&apos;re just getting
              started or years into the journey. Support, answers, and real help are right here.
            </p>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <Heart className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>Made for parents, by people who care</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>Trusted resources, verified for you</span>
              </div>
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                <span>All in one place, when you need it</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/support"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Care Navigation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/client"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Lock className="h-4 w-4 text-accent" /> Client sign in
              </Link>
            </div>
          </div>

          {/* RIGHT — framed image card */}
          <div className="relative">
            <div className="relative h-[400px] overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.09)] lg:h-[520px]">
              <Image
                src="/hero-mom-child.png"
                alt="Parent holding child in a calm, supportive moment"
                fill
                priority
                className="object-cover object-[50%_18%]"
              />
              {/* Soft premium overlay */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-white/15" />
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────
          CHOOSE THE DOOR
      ───────────────────────────────────────── */}
      <section className="px-6 py-16 sm:py-20 sm:px-8" style={{ backgroundColor: '#f9f8f6' }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              Two ways to begin
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
              Choose the door that fits you.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-stone-500">
              Everyone&apos;s starting point is different. We&apos;ll meet you where you are.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Care Navigation */}
            <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 shadow-sm transition hover:shadow-md sm:p-10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <Compass className="h-3 w-3" /> For every family
              </span>
              <h3 className="text-2xl font-bold text-stone-900">Care Navigation</h3>
              <p className="mt-1.5 text-sm font-semibold text-primary">
                Guidance, resources, and support for every family.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                You do not have to have all the answers. We will help you find direction,
                community, and local resources — wherever you are in your journey.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  { label: 'Guided next steps', sub: 'A short plan for where you are — not the whole journey at once.' },
                  { label: 'Support for you', sub: 'Caregiver wellness, grounding tools, and mental health resources.' },
                  { label: 'Local resources & community', sub: 'Sensory-friendly places, local groups, and help from near you.' },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm">
                      <span className="font-semibold text-stone-800">{item.label}</span>
                      <span className="block text-stone-500">{item.sub}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  Explore Care Navigation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>

            {/* Client Portal */}
            <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 shadow-sm transition hover:shadow-md sm:p-10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                <Lock className="h-6 w-6 text-accent" />
              </div>
              <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
                <Lock className="h-3 w-3" /> Client portal — sign-in required
              </span>
              <h3 className="text-2xl font-bold text-stone-900">Client Portal</h3>
              <p className="mt-1.5 text-sm font-semibold text-accent">
                Personalized support for families actively receiving our services.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                Access your child&apos;s care plan, progress updates, and tools designed to help
                you celebrate progress and work together with your care team.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  { label: "Your child's plan & progress", sub: 'View goals, session notes, updates, and parent coaching in one place.' },
                  { label: 'Care team messaging', sub: 'Reach your BCBAs & RBT directly. HIPAA-protected, only your team can see it.' },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm">
                      <span className="font-semibold text-stone-800">{item.label}</span>
                      <span className="block text-stone-500">{item.sub}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <Link
                  href="/client"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90"
                >
                  Go to Client Portal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          CRISIS BAR
      ───────────────────────────────────────── */}
      <div className="border-y border-rose-100 bg-rose-50 px-6 py-3 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center text-sm">
          <span className="flex items-center gap-2 font-semibold text-rose-600">
            <Phone className="h-3.5 w-3.5" /> Need immediate help?
          </span>
          <span className="text-stone-600">Call or text <a href="tel:988" className="font-bold text-rose-600 hover:underline">988</a></span>
          <span className="hidden text-stone-300 sm:inline">·</span>
          <span className="text-stone-600">Harris Center Crisis Line <a href="tel:7139707000" className="font-bold text-rose-600 hover:underline">(713) 970-7000</a></span>
          <span className="hidden text-stone-300 sm:inline">·</span>
          <span className="text-stone-600">Life-threatening emergency: call <span className="font-bold text-rose-600">911</span></span>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          YOU ARE NOT ALONE
      ───────────────────────────────────────── */}
      <section className="px-6 py-12 sm:py-16 sm:px-8" style={{ backgroundColor: '#f9f8f6' }}>
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
          WHAT DO YOU NEED — dark navy
      ───────────────────────────────────────── */}
      <section className="px-6 py-16 sm:py-20 sm:px-8" style={{ backgroundColor: '#1a2e52' }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Start here
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              What do you need right now?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/60">
              Pick the one that sounds like your week. We&apos;ll take it from there.
            </p>
          </div>

          {/* Primary CTA */}
          <Link
            href="/support/next-steps"
            className="group mb-5 flex items-center justify-between gap-6 overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm transition hover:bg-white/15 sm:p-9"
          >
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
                  Most parents start here
                </p>
                <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                  &ldquo;I don&apos;t know what to do next.&rdquo;
                </h3>
                <p className="mt-1 text-sm font-semibold text-white/80">We will walk you through it.</p>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/55">
                  A short plan for where you are today — not the whole journey at once. Clear
                  direction, nothing overwhelming, just the next right step.
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 flex-col items-center gap-1.5 sm:flex">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition group-hover:bg-white/95">
                Start guided next steps <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-xs text-white/40">Takes about 2 minutes</span>
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
                title: 'Resource library',
                desc: 'Short, curated guides for the stage you\'re in. Not too long. Straight talk. Written by people who get it.',
                cta: 'Browse the library',
                href: '/support/resources',
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
                className="group flex flex-col rounded-3xl border border-white/10 bg-white/8 p-6 transition hover:bg-white/15"
              >
                <p className={`text-[10px] font-semibold uppercase tracking-widest ${card.eyebrow_color}`}>
                  {card.eyebrow}
                </p>
                <h3 className="mt-2 text-base font-bold text-white">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{card.desc}</p>
                <span className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${card.color}`}>
                  {card.cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
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
                <HeartHandshake className="h-4 w-4" /> Support for you
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
              href="/support"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-white/95"
            >
              Care Navigation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/support/caregiver"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <Heart className="h-4 w-4 text-rose-400" /> Support for you
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
