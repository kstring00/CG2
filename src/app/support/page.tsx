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
  Wind,
  ChevronDown,
  ChevronUp,
  Circle,
} from 'lucide-react';

const supportActions = [
  {
    title: 'I need a next step',
    desc: 'Answer a few questions and get a simple Family Care Plan.',
    cta: 'Build my plan',
    href: '/support/intake',
    icon: Compass,
  },
  {
    title: 'I need help at home',
    desc: 'Simple strategies for routines, transitions, and everyday challenges.',
    cta: 'See strategies',
    href: '/support/help',
    icon: Home,
  },
  {
    title: 'I feel overwhelmed',
    desc: 'Find encouragement and one small step for today.',
    cta: 'Get support',
    href: '/support/hard-days',
    icon: Wind,
  },
  {
    title: 'I want to understand ABA',
    desc: 'Plain-language explanations of common ABA terms.',
    cta: 'Learn basics',
    href: '/support/what-is-aba',
    icon: BookOpen,
  },
  {
    title: 'I want to connect',
    desc: 'Explore parent connection and community support.',
    cta: 'Connect',
    href: '/support/connect',
    icon: Users,
  },
  {
    title: 'I need practical resources',
    desc: 'Find local help, financial support, and family resources.',
    cta: 'Find resources',
    href: '/support/resources',
    icon: HandHelping,
  },
];

export default function SupportHome() {
  const [checkInOpen, setCheckInOpen] = useState(false);

  return (
    <div className="page-shell gap-12 pb-2 sm:gap-14">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-[#f7f1e9] via-[#fcfaf7] to-white px-6 py-8 shadow-soft sm:px-9 sm:py-10 lg:px-10 lg:py-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-8 -top-12 h-52 w-52 rounded-full bg-brand-plum-100/45 blur-2xl" />
          <div className="absolute bottom-4 right-20 h-32 w-32 rounded-full bg-primary/10 blur-xl" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Parent Support</p>
            <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight text-brand-muted-900 sm:text-4xl lg:text-[2.65rem]">
              You do not have to figure this out alone.
            </h1>
            <p className="mt-4 text-base leading-7 text-brand-muted-600">
              Start with what your family needs today. Common Ground will point you toward simple next steps,
              helpful tools, and support options.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/support/intake" className="btn-primary px-6 py-3 text-sm">
                Build My Family Care Plan
              </Link>
              <Link href="#support-actions" className="btn-secondary px-6 py-3 text-sm">
                Find support for today
              </Link>
            </div>
            <p className="mt-4 text-sm text-brand-muted-500">
              No pressure. No clinical form. Just a simple place to start.
            </p>
          </div>

          <div className="rounded-3xl bg-white/70 p-5 backdrop-blur-sm sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Compass, label: 'Plan' },
                { icon: Home, label: 'Tools' },
                { icon: BookOpen, label: 'Learn' },
                { icon: HeartHandshake, label: 'Support' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white px-4 py-3 shadow-card">
                  <p className="flex items-center gap-2 text-sm font-medium text-brand-muted-700">
                    <item.icon className="h-4 w-4 text-primary" /> {item.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary/[0.06] px-4 py-3">
              <p className="text-sm text-brand-muted-700">A calmer path, one step at a time.</p>
              <Sparkles className="h-4 w-4 text-brand-plum-700" />
            </div>
          </div>
        </div>
      </section>

      <section id="support-actions" className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-brand-muted-900 sm:text-[1.8rem]">What do you need today?</h2>
          <p className="mt-2 text-base text-brand-muted-500">Choose one starting point. You can come back anytime.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {supportActions.map((item) => (
            <article
              key={item.title}
              className="group rounded-3xl bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold leading-snug text-brand-muted-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-muted-600">{item.desc}</p>
              <Link href={item.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                {item.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-10 rounded-[2rem] bg-gradient-to-b from-[#faf6f0] to-white px-5 py-7 sm:px-8 sm:py-9">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-plum-700">Start small</p>
          <h2 className="mt-2 text-2xl font-semibold text-brand-muted-900">When everything feels like too much</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Pause', icon: Wind },
              { label: 'Pick one thing', icon: Circle },
              { label: 'Reach out', icon: MessageCircleHeart },
            ].map((step) => (
              <div key={step.label} className="rounded-2xl bg-white/90 px-4 py-4 text-center shadow-soft">
                <step.icon className="mx-auto h-4 w-4 text-brand-plum-700" />
                <p className="mt-2 text-sm font-medium text-brand-muted-800">{step.label}</p>
              </div>
            ))}
          </div>
          <Link href="/support/hard-days" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-plum-700 hover:underline">
            See support for hard days <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Support for your family</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { title: 'Understand ABA', href: '/support/what-is-aba', icon: BookOpen },
              { title: 'Try home strategies', href: '/support/help', icon: Home },
              { title: 'Find local resources', href: '/support/find', icon: MapPin },
              { title: 'Connect with parents', href: '/support/connect', icon: Users },
              { title: 'Financial Help', href: '/support/financial', icon: Wallet },
              { title: 'Sibling Support', href: '/support/siblings', icon: Heart },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="rounded-2xl bg-white px-4 py-3.5 shadow-soft transition hover:shadow-card hover:-translate-y-0.5">
                <p className="flex items-center gap-2 text-sm font-semibold text-brand-muted-800">
                  <item.icon className="h-4 w-4 text-primary" /> {item.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-[#f5f2ec] px-5 py-5 sm:px-6">
        <button onClick={() => setCheckInOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 text-left">
          <div>
            <h3 className="text-lg font-semibold text-brand-muted-900">Want to check in with yourself for a minute?</h3>
            <p className="mt-1 text-sm leading-6 text-brand-muted-600">
              A quick check-in can help you pause, notice what feels heavy, and choose one next step.
            </p>
          </div>
          {checkInOpen ? <ChevronUp className="h-5 w-5 text-brand-muted-500" /> : <ChevronDown className="h-5 w-5 text-brand-muted-500" />}
        </button>
        {checkInOpen && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link href="/support/mental-health" className="btn-secondary px-4 py-2 text-sm">Start quick check-in</Link>
            <p className="text-xs text-brand-muted-500">Optional and private to this device.</p>
          </div>
        )}
      </section>

      <section className="space-y-6 rounded-3xl bg-white px-6 py-7 shadow-soft sm:px-8">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-muted-500">Common Ground is a support guide</h2>
          <p className="mt-2 text-sm leading-6 text-brand-muted-500">
            Common Ground does not replace your child&apos;s clinical team, BCBA, doctor, therapist, or emergency
            support. For clinical questions, treatment changes, safety concerns, or urgent needs, please contact
            the appropriate professional or your care team.
          </p>
        </div>

        <div className="rounded-2xl bg-primary/[0.04] px-5 py-5">
          <h3 className="text-2xl font-semibold text-brand-muted-900">Ready to find your next step?</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted-600">
            Answer a few quick questions and get a simple Family Care Plan built around what your family needs.
          </p>
          <Link href="/support/intake" className="btn-primary mt-4 px-5 py-2.5 text-sm">Build My Family Care Plan</Link>
        </div>
      </section>
    </div>
  );
}
