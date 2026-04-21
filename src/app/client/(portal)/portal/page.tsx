'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  Heart,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  Star,
  UserRound,
  Wind,
} from 'lucide-react';
import { ClientDemoBanner } from '@/components/ui/ClientDemoBanner';

const recentWins = [
  {
    highlight: 'Used his break card without being asked',
    context: 'During snack on Tuesday — first time unprompted.',
    date: 'This week',
  },
  {
    highlight: 'Transitioned to mealtime with one visual cue',
    context: '3 of 4 tries this week. Getting more consistent.',
    date: 'This week',
  },
];

export default function ClientPortalHome() {
  const [overwhelmedOpen, setOverwhelmedOpen] = useState(false);

  return (
    <div className="page-shell space-y-6">
      <header className="page-header">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Welcome back, Maria
        </p>
        <h1 className="page-title">Here&apos;s where things stand with Mateo.</h1>
        <p className="page-description">
          What is going well, what to focus on this week, and where to go if you need support.
        </p>
      </header>

      <ClientDemoBanner />

      {/* Overwhelmed today card */}
      {overwhelmedOpen ? (
        <section className="rounded-3xl border-2 border-brand-plum-200 bg-gradient-to-br from-brand-plum-50 via-white to-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-plum-100">
              <Wind className="h-6 w-6 text-brand-plum-700" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-plum-700">
                If today is hard
              </p>
              <h2 className="mt-2 text-xl font-semibold text-brand-muted-900">
                You do not have to hold all of this alone.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted-600">
                Start here. One step is enough for today.
              </p>
              <ol className="mt-4 space-y-2">
                {[
                  'Take one slow breath — seriously, just that first.',
                  'Send your care team a quick message. "This week has been hard" is enough.',
                  'If things feel unsafe, call or text 988 right now.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-brand-muted-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-plum-100 text-xs font-bold text-brand-plum-700">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/client/concerns"
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand-plum-700 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-plum-800"
                >
                  <MessageSquare className="h-4 w-4" /> Message your team
                </Link>
                <Link
                  href="/support/caregiver"
                  className="inline-flex items-center gap-2 rounded-2xl border border-brand-plum-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-plum-700 transition hover:bg-brand-plum-50"
                >
                  <HeartHandshake className="h-4 w-4" /> Support for you
                </Link>
                <button
                  onClick={() => setOverwhelmedOpen(false)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-muted-600 transition hover:bg-surface-muted"
                >
                  I&apos;m okay for now
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
                  If today feels overwhelming — open this.
                </p>
                <p className="mt-0.5 text-xs text-brand-muted-500">
                  We have a short, simple path for exactly this.
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-brand-plum-400 transition-transform group-hover:translate-x-1" />
          </div>
        </button>
      )}

      {/* Week at a glance */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-accent/20 bg-accent/5 p-5">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
            <Heart className="h-5 w-5 text-accent" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            This week&apos;s focus
          </p>
          <h2 className="mt-2 text-base font-semibold text-brand-muted-900">
            Requesting a break with his picture card
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            Practice once per meal at home — the card should be where he can see it.
          </p>
        </article>

        <article className="rounded-3xl border border-surface-border bg-white p-5">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <CalendarCheck className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Next session
          </p>
          <h2 className="mt-2 text-base font-semibold text-brand-muted-900">
            Tue · 3:30 pm with Jasmine
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            In-home · communication and transition routines.
          </p>
        </article>

        <article className="rounded-3xl border border-surface-border bg-white p-5">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <UserRound className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Your BCBA
          </p>
          <h2 className="mt-2 text-base font-semibold text-brand-muted-900">
            Dr. Rachel Ortiz, BCBA-D
          </h2>
          <Link
            href="/client/messages"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            Send a message <ArrowRight className="h-4 w-4" />
          </Link>
        </article>
      </section>

      {/* Recent wins */}
      <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Recent wins</h2>
        </div>
        <p className="mt-1 text-sm text-brand-muted-500">
          Progress is built from moments like these.
        </p>
        <ul className="mt-4 space-y-3">
          {recentWins.map((win) => (
            <li
              key={win.highlight}
              className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <Star className="h-3.5 w-3.5 text-emerald-600" />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-muted-900">{win.highlight}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-brand-muted-600">{win.context}</p>
                <p className="mt-1 text-xs text-brand-muted-400">{win.date}</p>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href="/client/progress"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
        >
          See all growth highlights <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Portal entry points */}
      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/client/care-plan"
          className="group rounded-3xl border border-surface-border bg-white p-6 transition-all hover:border-accent/30 hover:shadow-card-hover"
        >
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
            <ClipboardList className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-brand-muted-900">Current care plan</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            What your team is focusing on with Mateo right now — explained in plain language.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            See the plan <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/client/coaching"
          className="group rounded-3xl border border-surface-border bg-white p-6 transition-all hover:border-accent/30 hover:shadow-card-hover"
        >
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
            <GraduationCap className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-brand-muted-900">Practice at home</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            Short coaching modules tied to what Mateo is working on — so you can support him between sessions.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            Start this week&apos;s module <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/client/concerns"
          className="group rounded-3xl border border-primary/15 bg-primary/5 p-6 transition-all hover:border-primary/30 hover:shadow-card-hover"
        >
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-brand-muted-900">Questions &amp; concerns</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            Something changed at home? A question you don&apos;t know how to ask? Share it here — your team reads everything.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Share with your team <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/client/messages"
          className="group rounded-3xl border border-surface-border bg-white p-6 transition-all hover:border-accent/30 hover:shadow-card-hover"
        >
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-brand-muted-900">Messages</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            Direct, HIPAA-protected messaging with Dr. Ortiz and Jasmine. Response within one business day.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            Open messages <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>
    </div>
  );
}
