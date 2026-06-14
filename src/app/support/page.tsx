'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Home,
  Users,
  HandHelping,
  CheckCircle2,
} from 'lucide-react';
import WeeklyProgressMeter from '@/components/WeeklyProgressMeter';

const supportActions = [
  {
    title: 'I need a next step',
    desc: 'Get a simple plan for what to do first.',
    cta: 'Build my plan',
    href: '/support/intake',
    icon: Compass,
  },
  {
    // CCO round 3: this used to point at /support/help (external referrals
    // like therapists / hotlines). Parents need actual tactics for the hard
    // moment in front of them, not phone numbers. Now routes to 10 ABA-
    // grounded strategies they can try in the next minute.
    title: 'I need help at home',
    desc: 'Real ABA strategies you can try in the next minute.',
    cta: 'At-home strategies',
    href: '/support/at-home',
    icon: Home,
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
  return (
    <div className="page-shell gap-8">
      {/* Weekly progress — top of Home Base, only when a plan exists */}
      <WeeklyProgressMeter variant="panel" />

      <section className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-[#f8f2ea] via-white to-[#fdf7f2] p-7 sm:p-9">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-70">
          <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-brand-plum-100/80" />
          <div className="absolute right-28 top-24 h-16 w-16 rounded-full bg-accent/20" />
          <div className="absolute bottom-10 right-16 h-24 w-24 rounded-3xl bg-primary/10" />
          <div className="absolute bottom-24 right-40 h-10 w-10 rounded-full bg-primary/20" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          {/* CCO round 2: Home Base used to read as a second "Parent Support" landing.
              Now it's framed as a map — a place where the parent picks a direction.
              Parent Support itself lives at /support/caregiver as the deep page. */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Home Base</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-brand-muted-900 sm:text-4xl">
              Everything in Common Ground, one step away.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-muted-600 sm:text-base">
              Build your plan, find local help, learn what ABA actually is, or connect with other parents — pick what fits today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/support/intake" className="btn-primary px-5 py-2.5 text-sm">
                Find My Next Step
              </Link>
              <Link href="#support-actions" className="btn-secondary px-5 py-2.5 text-sm">
                See everything available
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
    </div>
  );
}
