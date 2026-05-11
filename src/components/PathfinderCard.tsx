'use client';

import { Mail, ShieldCheck, UserRound } from 'lucide-react';

/**
 * Demo Pathfinder card — clearly labeled, never a real photo or name.
 * Used on /support/pathfinders and on the dashboard summary.
 *
 * Step 6: introduces the Pathfinder concept across the site in demo form so
 * reviewers can see the relationship layer that makes Common Ground different
 * from a resource directory. Real Pathfinders are being onboarded now.
 */
export type PathfinderCardProps = {
  /** When true, the "send to my Pathfinder" affordance is disabled with a
   *  tooltip — the relationship hasn't been matched yet. */
  showSendAction?: boolean;
  className?: string;
};

export default function PathfinderCard({ showSendAction = false, className }: PathfinderCardProps) {
  return (
    <article
      className={[
        'rounded-2xl border border-brand-plum-200 bg-brand-plum-50/40 p-5 sm:p-6',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-plum-300/60 bg-white px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-plum-700">
          <ShieldCheck className="h-3 w-3" /> Example Pathfinder
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div
          aria-hidden
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-brand-plum-200 bg-white text-brand-plum-500"
        >
          <UserRound className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-brand-navy-700">Maria R.</h3>
          <p className="mt-0.5 text-[13px] text-brand-muted-600">
            Caregiver mental health &middot; school advocacy
          </p>
        </div>
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-brand-muted-700">
        A real human who has walked this road. Pathfinders sort the next step,
        sit in on school meetings if you want, and check in when the weeks get
        heavy. You don&rsquo;t have to explain everything from scratch.
      </p>

      {showSendAction && (
        <button
          type="button"
          disabled
          title="Available once your Pathfinder is matched. Pathfinders are being onboarded — see the Pathfinders page to learn more."
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-brand-plum-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-brand-plum-700 opacity-70"
        >
          <Mail className="h-3.5 w-3.5" /> Send to my Pathfinder
        </button>
      )}
    </article>
  );
}
