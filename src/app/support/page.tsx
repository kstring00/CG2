'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Heart,
  HeartHandshake,
  Home,
  MessageCircleHeart,
  Sparkles,
  Users,
  Wallet,
  MapPin,
  HandHelping,
  CheckCircle2,
  Wind,
  ChevronDown,
  ChevronUp,
  Feather,
} from 'lucide-react';
import WellnessMirror from '@/components/WellnessMirror';
import GroundLevelHomeNudge from '@/components/groundLevel/GroundLevelHomeNudge';

const supportActions = [
  {
    title: 'I need a next step',
    desc: 'Get a simple plan for what to do first.',
    cta: 'Build my plan',
    href: '/support/intake',
    icon: Compass,
  },
  {
    title: 'I need help at home',
    desc: 'Try practical routines and home strategies.',
    cta: 'Home strategies',
    href: '/support/help',
    icon: Home,
  },
  {
    title: 'I feel overwhelmed',
    desc: 'Use gentle tools when today feels too heavy.',
    cta: 'Start small',
    href: '/support/hard-days',
    icon: Wind,
  },
  {
    title: 'I want to understand ABA',
    desc: 'Learn the basics in clear, parent-friendly language.',
    cta: 'ABA basics',
    href: '/support/what-is-aba',
    icon: BookOpen,
  },
  {
    title: 'I want to connect',
    desc: 'Find parent groups and supportive community spaces.',
    cta: 'Parent connection',
    href: '/support/connect',
    icon: Users,
  },
  {
    title: 'I need practical resources',
    desc: 'Access financial, local, and daily-life support options.',
    cta: 'Practical resources',
    href: '/support/resources',
    icon: HandHelping,
  },
];

export default function SupportHome() {
  const [checkInOpen, setCheckInOpen] = useState(false);

  return (
    <div className="page-shell gap-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-[#f8f2ea] via-white to-[#fdf7f2] p-7 sm:p-9">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-70">
          <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-brand-plum-100/80" />
          <div className="absolute right-28 top-24 h-16 w-16 rounded-full bg-accent/20" />
          <div className="absolute bottom-10 right-16 h-24 w-24 rounded-3xl bg-primary/10" />
          <div className="absolute bottom-24 right-40 h-10 w-10 rounded-full bg-primary/20" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Parent Support</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-brand-muted-900 sm:text-4xl">
              You do not have to figure this out alone.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-muted-600 sm:text-base">
              Start with what your family needs today. Common Ground will point you toward simple next steps,
              helpful tools, and support options.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/support/intake" className="btn-primary px-5 py-2.5 text-sm">
                Build My Family Care Plan
              </Link>
              <Link href="#support-actions" className="btn-secondary px-5 py-2.5 text-sm">
                Find support for today
              </Link>
            </div>
            <p className="mt-4 text-xs text-brand-muted-500">
              No pressure. No clinical form. Just a simple place to start.
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-plum-700">Today can be lighter</p>
              <div className="mt-4 space-y-3">
                {['One clear next step', 'Tools for home and school', 'Support for you, too'].map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm text-brand-muted-700">
                    <CheckCircle2 className="h-4 w-4 text-brand-plum-600" /> {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <WellnessMirror />
        <GroundLevelHomeNudge />
      </div>

      {/* Pathfinder presence — above the fold, gentle indicator that there is
          a real human layer being built. Demo until matching is live. */}
      <section className="rounded-2xl border border-brand-plum-200 bg-brand-plum-50/40 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
              Your Pathfinder
            </p>
            <h2 className="mt-1 text-base font-semibold text-brand-navy-700 sm:text-lg">
              Your Pathfinder will appear here once we&rsquo;re matched.
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-muted-600">
              Pathfinders are real human navigators. They sort the next step, sit in on school meetings, and check in when the weeks get heavy.
            </p>
          </div>
          <Link
            href="/support/pathfinders"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-plum-700 transition hover:bg-brand-plum-100"
          >
            Learn what a Pathfinder does <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section id="support-actions" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-brand-muted-900">What do you need today?</h2>
          <p className="mt-1 text-sm text-brand-muted-500">Pick one path. You can always come back for the rest.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {supportActions.map((item) => (
            <article key={item.title} className="group rounded-2xl border border-surface-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-brand-muted-900">{item.title}</h3>
              <p className="mt-1 text-sm text-brand-muted-600">{item.desc}</p>
              <Link href={item.href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                {item.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-300/60" style={{ background: 'linear-gradient(135deg, #2a3956 0%, #1f2c44 55%, #1a2335 100%)' }}>
        <div className="grid gap-6 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="text-white">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
              <Feather className="h-3.5 w-3.5" /> Still Waters
            </p>
            <h2 className="mt-3 text-2xl leading-snug sm:text-[1.7rem]" style={{ fontFamily: 'Lora, Georgia, serif' }}>
              A quiet place to write. One prompt at a time.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
              No streaks. No metrics. Just a page that holds whatever today was.
            </p>
          </div>
          <Link
            href="/support/still-waters"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
          >
            Open Still Waters <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-brand-plum-100 bg-brand-plum-50/60 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-plum-700">Start small</p>
          <h2 className="mt-2 text-xl font-semibold text-brand-muted-900">When everything feels like too much</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Pause', icon: Wind },
              { label: 'Pick one thing', icon: Sparkles },
              { label: 'Reach out', icon: MessageCircleHeart },
            ].map((step) => (
              <div key={step.label} className="rounded-2xl bg-white/90 p-3 text-center">
                <step.icon className="mx-auto h-4 w-4 text-brand-plum-700" />
                <p className="mt-2 text-sm font-medium text-brand-muted-800">{step.label}</p>
              </div>
            ))}
          </div>
          <Link href="/support/hard-days" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-plum-700 hover:underline">
            See calm-now support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-3xl border border-surface-border bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Support for your family</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { title: 'Understanding ABA', href: '/support/what-is-aba', icon: BookOpen },
              { title: 'Home strategies', href: '/support/help', icon: Home },
              { title: 'Family resources', href: '/support/resources', icon: Wallet },
              { title: 'Parent connection', href: '/support/connect', icon: Users },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="rounded-2xl border border-surface-border bg-surface-muted p-3.5 transition hover:border-primary/30 hover:bg-white">
                <p className="flex items-center gap-2 text-sm font-semibold text-brand-muted-800">
                  <item.icon className="h-4 w-4 text-primary" /> {item.title}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-4 grid gap-2 text-sm text-brand-muted-600 sm:grid-cols-2">
            <Link href="/support/financial" className="flex items-center gap-1.5 hover:text-primary"><Wallet className="h-4 w-4" /> Financial Help</Link>
            <Link href="/support/siblings" className="flex items-center gap-1.5 hover:text-primary"><Heart className="h-4 w-4" /> Sibling Support</Link>
            <Link href="/support/find" className="flex items-center gap-1.5 hover:text-primary"><MapPin className="h-4 w-4" /> Local Help</Link>
            <Link href="/support/connect" className="flex items-center gap-1.5 hover:text-primary"><HeartHandshake className="h-4 w-4" /> Connect With Parents</Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border bg-surface-muted/60 p-5">
        <button onClick={() => setCheckInOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 text-left">
          <div>
            <h3 className="text-lg font-semibold text-brand-muted-900">Want to check in with yourself for a minute?</h3>
            <p className="mt-1 text-sm text-brand-muted-600">A quick check-in can help you pause and notice what you need today.</p>
          </div>
          {checkInOpen ? <ChevronUp className="h-5 w-5 text-brand-muted-500" /> : <ChevronDown className="h-5 w-5 text-brand-muted-500" />}
        </button>
        {checkInOpen && (
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-surface-border pt-4">
            <Link href="/support/mental-health" className="btn-secondary px-4 py-2 text-sm">Start quick check-in</Link>
            <p className="text-xs text-brand-muted-500">Optional and private to this device.</p>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-primary/10 bg-white p-6 sm:p-8 shadow-soft">
        <h2 className="text-xl font-semibold text-brand-muted-900">You are doing more than you think.</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
          Common Ground is a support guide, not clinical care. For urgent safety concerns, call or text 988.
        </p>
        <div className="mt-5">
          <Link href="/support/intake" className="btn-primary px-5 py-2.5 text-sm">Build My Family Care Plan</Link>
        </div>
      </section>
    </div>
  );
}
