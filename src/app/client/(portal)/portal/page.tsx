import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  LineChart,
  MessageSquare,
  Target,
  UserRound,
} from 'lucide-react';
import { ClientDemoBanner } from '@/components/ui/ClientDemoBanner';

/**
 * Client portal home — the "what matters this week" view for enrolled families.
 * Everything here is personalized; nothing should appear on the public /support side.
 */
export default function ClientPortalHome() {
  return (
    <div className="page-shell space-y-6">
      <header className="page-header">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Welcome back, Maria
        </p>
        <h1 className="page-title">This week with Mateo</h1>
        <p className="page-description">
          A short view of your child&apos;s current goals, what your RBT is working
          on, and the one thing your BCBA asked you to try at home.
        </p>
      </header>

      <ClientDemoBanner />

      {/* Top strip: the week at a glance */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-accent/20 bg-accent/5 p-5">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
            <Target className="h-5 w-5 text-accent" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            This week&apos;s focus
          </p>
          <h2 className="mt-2 text-base font-semibold text-brand-muted-900">
            Requesting a break with his picture card
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            Goal tied to his communication program. RBT will prompt 3–5× per
            session; practice 1× per meal at home.
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
            Tue · 3:30pm with Jasmine (RBT)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            In-home · focus on functional communication and transition routines.
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

      {/* Four portal entry points */}
      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/client/care-plan"
          className="group rounded-3xl border border-surface-border bg-white p-6 transition-all hover:border-accent/30 hover:shadow-card-hover"
        >
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
            <ClipboardList className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-brand-muted-900">Care Plan</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            See Mateo&apos;s current goals, how we measure them, and what your
            team is working on right now.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            Open care plan <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/client/progress"
          className="group rounded-3xl border border-surface-border bg-white p-6 transition-all hover:border-accent/30 hover:shadow-card-hover"
        >
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
            <LineChart className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-brand-muted-900">Progress</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            Data from your RBT&apos;s sessions, in plain language. No charts
            without explanations.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            View progress <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/client/coaching"
          className="group rounded-3xl border border-surface-border bg-white p-6 transition-all hover:border-accent/30 hover:shadow-card-hover"
        >
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
            <GraduationCap className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-brand-muted-900">Parent Coaching</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            Short modules assigned by your BCBA, tied to the exact goals your
            child is working on this month.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            Start this week&apos;s module <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/client/messages"
          className="group rounded-3xl border border-surface-border bg-white p-6 transition-all hover:border-accent/30 hover:shadow-card-hover"
        >
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
            <MessageSquare className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-brand-muted-900">Messages</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            Reach your BCBA or RBT directly. Typical response time: within one
            business day.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            Open messages <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>
    </div>
  );
}
