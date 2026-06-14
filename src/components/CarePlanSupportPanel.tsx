'use client';

import Link from 'next/link';
import { ArrowRight, Heart, Users, Brain } from 'lucide-react';
import type { CarePlanAnswers } from '@/lib/carePlanStorage';
import { getEligibleSupportThreads, type SupportThreadId } from '@/lib/carePlanSupport';

const THREAD_ICONS: Record<SupportThreadId, React.ComponentType<{ className?: string }>> = {
  'mental-health': Brain,
  siblings: Users,
  marriage: Heart,
};

type Props = {
  answers: CarePlanAnswers;
  className?: string;
};

/** Persistent support threads — not a week; always beside the arc plan. */
export default function CarePlanSupportPanel({ answers, className }: Props) {
  const threads = getEligibleSupportThreads(answers);

  return (
    <aside
      aria-label="Always-on support"
      className={[
        'rounded-2xl border border-surface-border/80 bg-white px-4 py-4 sm:px-5',
        className ?? '',
      ].join(' ')}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
        Support alongside your plan
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-600">
        These threads stay available every week — separate from your arc steps.
      </p>
      <ul className="mt-3 space-y-2">
        {threads.map((thread) => {
          const Icon = THREAD_ICONS[thread.id];
          return (
            <li key={thread.id}>
              <Link
                href={thread.href}
                className="group flex items-start gap-3 rounded-xl border border-surface-border/70 px-3 py-2.5 transition hover:border-primary/30 hover:bg-primary/[0.03]"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-warm-100 text-brand-plum-700">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-brand-navy-700 group-hover:text-primary">
                    {thread.title}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-brand-muted-600">
                    {thread.blurb}
                  </span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand-muted-300 group-hover:text-primary" />
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
