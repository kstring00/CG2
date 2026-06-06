'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, CalendarClock, Compass as CompassIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getNextStepStatus,
  NEW_VISITOR_STATUS,
  type NextStepStatus,
} from '@/lib/nextStepStatus';
import { WEEKLY_PROGRESS_EVENT } from '@/lib/weeklyProgress';

/**
 * The sidebar's adaptive "next step" button. Reflects where the parent is in
 * their weekly check-in cadence instead of being a static CTA. See
 * lib/nextStepStatus for the phase logic.
 *
 * State is read client-side (localStorage), so it renders the new-visitor
 * default on the server and resolves after mount. It re-reads on route change
 * and when the weekly progress store changes (same-tab event + cross-tab
 * `storage`) so completing a check-in updates the button immediately.
 */
export default function NextStepButton({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<NextStepStatus>(NEW_VISITOR_STATUS);

  useEffect(() => {
    const refresh = () => setStatus(getNextStepStatus());
    refresh();
    window.addEventListener(WEEKLY_PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(WEEKLY_PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [pathname]);

  const isStatus = status.variant === 'status';
  const isSecondary = status.variant === 'secondary';
  const Icon = isStatus ? CalendarClock : CompassIcon;

  return (
    <Link
      href={status.href}
      onClick={onNavigate}
      aria-label={
        isStatus
          ? `${status.label} — view your care plan`
          : `${status.label} — go to your guided care plan`
      }
      className={cn(
        'group flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-soft transition',
        isStatus &&
          'border border-surface-border bg-surface-subtle text-brand-muted-700 hover:bg-surface-subtle/70',
        isSecondary &&
          'border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10',
        !isStatus && !isSecondary && 'bg-primary text-white hover:bg-primary/90',
      )}
    >
      <span className="inline-flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        {status.label}
      </span>
      {isStatus ? (
        <span className="text-[11px] font-medium text-brand-muted-500">View plan</span>
      ) : (
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}
