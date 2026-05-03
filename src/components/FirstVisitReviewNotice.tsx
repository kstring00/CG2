'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

const STORAGE_KEY = 'cg_review_notice_seen';

/**
 * One-time first-visit modal explaining the site is in active review.
 * Replaces the global ReviewBanner. Sets cg_review_notice_seen on dismiss
 * (either button) so returning visitors don't see it again.
 */
export default function FirstVisitReviewNotice() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const seen = window.localStorage.getItem(STORAGE_KEY) === 'true';
      if (!seen) setOpen(true);
    } catch {
      // localStorage unavailable — show the notice but don't block.
      setOpen(true);
    }
  }, []);

  const markSeen = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const handleGotIt = () => {
    markSeen();
    setOpen(false);
  };

  const handleLearnMore = () => {
    markSeen();
    setOpen(false);
    router.push('/about/in-review');
  };

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleGotIt();
    }
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!hydrated || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-visit-title"
      aria-describedby="first-visit-body"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4 py-8"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-surface-border bg-white p-6 shadow-card sm:p-7">
        <button
          type="button"
          onClick={handleGotIt}
          aria-label="dismiss"
          className="absolute right-3 top-3 rounded-full p-1 text-brand-muted-400 hover:bg-surface-subtle hover:text-brand-muted-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-muted-400"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          welcome
        </p>
        <h2
          id="first-visit-title"
          className="mt-2 text-xl font-semibold leading-snug text-brand-navy-700 sm:text-2xl"
        >
          Common Ground is being built in the open.
        </h2>
        <p
          id="first-visit-body"
          className="mt-3 text-[14px] leading-relaxed text-brand-muted-700"
        >
          this site is currently in review with families and providers. some sections show example listings, demo profiles, and placeholder data while we partner with real ones. look for{' '}
          <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[11.5px] font-semibold text-amber-800">
            example
          </span>{' '}
          tags throughout the site to know what&rsquo;s a placeholder.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleLearnMore}
            className="rounded-xl border border-surface-border bg-white px-4 py-2 text-sm font-semibold text-brand-muted-700 transition hover:bg-surface-subtle"
          >
            learn more
          </button>
          <button
            type="button"
            onClick={handleGotIt}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
            autoFocus
          >
            got it
          </button>
        </div>
      </div>
    </div>
  );
}
