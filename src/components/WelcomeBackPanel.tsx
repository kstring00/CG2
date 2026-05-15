'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, CalendarClock, Mail, Sparkles } from 'lucide-react';
import {
  formatShortDate,
  hasCheckedInThisWeek,
  nextMonday,
  shouldShowMondayReminder,
  type WeeklyCheckInState,
} from '@/lib/weeklyCheckIn';

type Props = {
  weekNumber: number;
  state: WeeklyCheckInState;
  onEmailPlan?: () => void;
};

export default function WelcomeBackPanel({ weekNumber, state, onEmailPlan }: Props) {
  const checkedInThisWeek = hasCheckedInThisWeek(state);
  const monday = nextMonday();
  const mondayDisplay = monday.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  const lastCheckInLabel = formatShortDate(state.lastCheckInAt);
  const reminderActive = shouldShowMondayReminder(state);

  return (
    <section
      aria-label={`Welcome back. You are in week ${weekNumber} of your plan.`}
      className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-plum-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
            <Sparkles className="h-3 w-3" aria-hidden /> Welcome back
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-stone-900 sm:text-3xl">
            You’re in <span className="text-primary">Week {weekNumber}</span> of your plan.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-[15px]">
            {checkedInThisWeek
              ? `Your week ${weekNumber} check-in is saved${lastCheckInLabel ? ` (${lastCheckInLabel})` : ''}. We’ll see you Monday for the next one.`
              : reminderActive
              ? 'A new week’s ready. A short check-in helps the plan keep up with what’s actually happening.'
              : `Next check-in: ${mondayDisplay}. Come back any time — your plan is waiting.`}
          </p>
        </div>
        {reminderActive && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[12px] font-semibold text-amber-800 ring-1 ring-amber-200">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden /> Check-in waiting
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Link
          href="/support/check-in"
          className="group flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-left transition hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          <span>
            <span className="block text-sm font-semibold text-brand-navy-700">
              {checkedInThisWeek ? 'Revisit this week’s check-in' : 'Start this week’s check-in'}
            </span>
            <span className="mt-0.5 block text-[12.5px] text-brand-muted-600">
              5 quick questions about you and your child.
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-0.5" aria-hidden />
        </Link>
        <Link
          href="/support/care-plan"
          className="group flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left transition hover:border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          <span>
            <span className="block text-sm font-semibold text-brand-navy-700">Continue my plan</span>
            <span className="mt-0.5 block text-[12.5px] text-brand-muted-600">
              Pick up your saved next steps.
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-brand-muted-500 transition group-hover:translate-x-0.5" aria-hidden />
        </Link>
        <Link
          href="/support/resources"
          className="group flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left transition hover:border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          <span>
            <span className="block text-sm font-semibold text-brand-navy-700">Review resources</span>
            <span className="mt-0.5 block text-[12.5px] text-brand-muted-600">
              Curated guides and local help.
            </span>
          </span>
          <BookOpen className="h-4 w-4 shrink-0 text-brand-muted-500" aria-hidden />
        </Link>
        {onEmailPlan && (
          <button
            type="button"
            onClick={onEmailPlan}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left transition hover:border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            <span>
              <span className="block text-sm font-semibold text-brand-navy-700">Email my plan</span>
              <span className="mt-0.5 block text-[12.5px] text-brand-muted-600">
                Send the current plan to your inbox.
              </span>
            </span>
            <Mail className="h-4 w-4 shrink-0 text-brand-muted-500" aria-hidden />
          </button>
        )}
      </div>

      <p className="mt-4 text-[11.5px] leading-relaxed text-brand-muted-500">
        Your plan is saved on this device — not in an account. Clear your browser data and it’s gone.
        Common Ground is parent support, not a medical or emergency service. {' '}
        <Link href="/privacy" className="underline-offset-2 hover:underline">
          Privacy
        </Link>
        .
      </p>
    </section>
  );
}
