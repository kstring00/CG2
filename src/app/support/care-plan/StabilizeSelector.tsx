'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { CopyEntry, StandardRowId } from '@/content/carePlan';

const CONFIRM_DURATION_MS = 680;
const CONFIRM_EASE = [0.22, 1, 0.36, 1] as const;

function resolveSelected(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 2 ? parsed : 0;
}

export default function StabilizeSelector({
  row,
  options,
}: {
  row: StandardRowId;
  options: [CopyEntry, CopyEntry, CopyEntry];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const searchString = searchParams.toString();

  const [selected, setSelected] = useState(() => resolveSelected(searchParams.get('a')));
  const [confirming, setConfirming] = useState<number | null>(null);
  const confirmTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setSelected(resolveSelected(searchParams.get('a')));
  }, [searchParams, searchString]);

  useEffect(() => {
    return () => {
      if (confirmTimerRef.current !== null) {
        window.clearTimeout(confirmTimerRef.current);
      }
    };
  }, []);

  function choose(index: number) {
    setSelected(index);

    if (!reduceMotion) {
      setConfirming(index);
      if (confirmTimerRef.current !== null) {
        window.clearTimeout(confirmTimerRef.current);
      }
      confirmTimerRef.current = window.setTimeout(() => {
        setConfirming(null);
        confirmTimerRef.current = null;
      }, CONFIRM_DURATION_MS);
    }

    const params = new URLSearchParams(searchString);
    params.set('a', String(index));
    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      '',
      query ? `${pathname}?${query}` : pathname,
    );
  }

  return (
    <>
      <fieldset className="overflow-visible rounded-xl border border-surface-border bg-white">
        <legend className="sr-only">Pick one thing for today</legend>
        {options.map((option, index) => {
          const checked = selected === index;
          const isConfirming = confirming === index;
          const isDimmed = confirming !== null && !isConfirming;

          return (
            <motion.label
              key={option.id}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: isDimmed ? -3 : 0,
                      y: isConfirming ? -5 : 0,
                      scale: isConfirming ? 0.992 : 1,
                      opacity: isDimmed ? 0.38 : 1,
                      boxShadow: isConfirming
                        ? '0 16px 36px rgba(26, 46, 82, 0.14)'
                        : '0 0 0 rgba(26, 46, 82, 0)',
                    }
              }
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              transition={{ duration: 0.3, ease: CONFIRM_EASE }}
              className={`relative flex min-h-16 cursor-pointer items-center gap-4 border-t border-surface-border px-5 py-4 first:border-t-0 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-navy-500 sm:px-6 ${
                checked
                  ? 'z-[2] bg-gradient-to-r from-brand-warm-50 via-white to-brand-plum-50/40'
                  : 'z-[1] bg-white hover:bg-brand-warm-50/60'
              }`}
            >
              <input
                type="radio"
                name={`care-plan-action-${row}`}
                value={index}
                checked={checked}
                onChange={() => choose(index)}
                className="sr-only"
              />
              <motion.span
                aria-hidden="true"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        scale: isConfirming ? 1.12 : 1,
                        boxShadow: checked
                          ? '0 0 0 5px rgba(69, 130, 128, 0.12)'
                          : '0 0 0 0 rgba(69, 130, 128, 0)',
                      }
                }
                transition={{ duration: 0.24, ease: CONFIRM_EASE }}
                className={`relative grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${
                  checked
                    ? 'border-brand-navy-700 bg-brand-navy-700'
                    : 'border-brand-muted-400 bg-white'
                }`}
              >
                <AnimatePresence initial={false}>
                  {checked && (
                    <motion.span
                      key="check"
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.4, rotate: -18 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.22, ease: CONFIRM_EASE }}
                      className="absolute inset-0 grid place-items-center text-white"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
              <span className="text-[15px] font-medium leading-relaxed text-brand-navy-700">
                {option.text}
              </span>
            </motion.label>
          );
        })}
      </fieldset>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {confirming !== null ? 'Starting point selected.' : ''}
      </p>
    </>
  );
}
