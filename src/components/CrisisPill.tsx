'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const CRISIS_NUMBER_DISPLAY = '988';
const CRISIS_TEL = 'tel:988';
const CRISIS_RESOURCES_HREF = '/support/hard-days';

type Props = {
  className?: string;
};

export default function CrisisPill({ className }: Props) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const callRef = useRef<HTMLAnchorElement>(null);
  const popoverId = useId();

  useEffect(() => {
    if (!open) return;
    callRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointerDown(e: MouseEvent) {
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
  }, [open]);

  return (
    <div className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popoverId}
        aria-label="Talk to someone now — open crisis resources"
        className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 sm:px-3.5"
      >
        <Phone className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">Talk to someone now</span>
      </button>

      {open ? (
        <div
          ref={popoverRef}
          id={popoverId}
          role="dialog"
          aria-label="Crisis support"
          className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[260px] rounded-2xl border border-stone-200 bg-white p-4 shadow-lg sm:w-72"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600">
                If today feels unsafe
              </p>
              <p className="mt-1 text-sm font-bold text-stone-900">
                988 Suicide &amp; Crisis Lifeline
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
                Free, confidential, 24/7. Someone will answer.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label="Close"
              className="-mr-1 -mt-1 rounded-full p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>

          <a
            ref={callRef}
            href={CRISIS_TEL}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
          >
            <Phone className="h-4 w-4" aria-hidden />
            Call now · {CRISIS_NUMBER_DISPLAY}
          </a>

          <a
            href={`sms:${CRISIS_NUMBER_DISPLAY}`}
            className="mt-2 block text-center text-xs font-medium text-rose-600 underline-offset-2 hover:underline"
          >
            Or text {CRISIS_NUMBER_DISPLAY}
          </a>

          <div className="mt-4 border-t border-stone-100 pt-3">
            <Link
              href={CRISIS_RESOURCES_HREF}
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-rose-600"
            >
              See all crisis resources
              <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
