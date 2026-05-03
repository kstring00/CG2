'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Floating crisis access — replaces the top-of-page CrisisStrip.
 *
 * Bottom-left so it doesn't overlap the bottom-right ChatWidget. Muted
 * neutral, calm presence — not a flashing red emergency tile. On
 * /support/hard-days the popover is pre-opened and the button is larger,
 * since the parent is already on a crisis route.
 */
export default function CrisisButton() {
  const pathname = usePathname() ?? '';
  const isCrisisRoute =
    pathname.startsWith('/support/hard-days') || pathname.includes('/crisis');

  const [open, setOpen] = useState(isCrisisRoute);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  // Re-sync the auto-open behavior on route change.
  useEffect(() => {
    if (isCrisisRoute) setOpen(true);
  }, [isCrisisRoute]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isCrisisRoute) {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointerDown(e: MouseEvent) {
      if (isCrisisRoute) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (popoverRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [open, isCrisisRoute]);

  const buttonSize = isCrisisRoute ? 'h-16 w-16' : 'h-14 w-14';
  const iconSize = isCrisisRoute ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {open && (
        <div
          ref={popoverRef}
          id={popoverId}
          role="dialog"
          aria-label="crisis support"
          className="absolute bottom-[calc(100%+10px)] left-0 w-72 rounded-2xl border border-stone-200 bg-white p-4 shadow-card"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
                need help right now?
              </p>
              <p className="mt-1 text-[13.5px] leading-snug text-brand-muted-700">
                free, confidential, 24/7. someone will answer.
              </p>
            </div>
            {!isCrisisRoute && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                aria-label="close"
                className="-mr-1 -mt-1 rounded-full p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <ul className="mt-3 space-y-1.5">
            <li>
              <a
                href="tel:988"
                className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-brand-navy-700 transition hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-300"
              >
                <span>988</span>
                <span className="text-[12px] font-medium text-brand-muted-600">
                  call or text
                </span>
              </a>
            </li>
            <li>
              <a
                href="tel:7139707000"
                className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-brand-navy-700 transition hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-300"
              >
                <span>harris center</span>
                <span className="text-[12px] font-medium text-brand-muted-600">
                  (713) 970-7000
                </span>
              </a>
            </li>
            <li>
              <a
                href="tel:911"
                className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-brand-navy-700 transition hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-300"
              >
                <span>emergency</span>
                <span className="text-[12px] font-medium text-brand-muted-600">911</span>
              </a>
            </li>
          </ul>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (isCrisisRoute) return; // already pre-expanded
          setOpen((v) => !v);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popoverId}
        aria-label="open crisis support — call or text 988, harris center, or 911"
        className={cn(
          'group inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white text-brand-navy-700 shadow-card transition hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-400',
          buttonSize,
        )}
      >
        <Phone className={cn(iconSize, 'shrink-0')} aria-hidden />
        <span className="sr-only group-hover:not-sr-only group-focus-visible:not-sr-only">
          help
        </span>
      </button>
    </div>
  );
}
