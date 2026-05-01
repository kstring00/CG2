'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Phone, X } from 'lucide-react';
import { useParentContext } from '@/lib/useParentContext';

const PHASES = ['Breathe in', 'Hold', 'Breathe out', 'Hold'] as const;
const PHASE_SECONDS = 4;
const CYCLE_SECONDS = PHASE_SECONDS * PHASES.length; // 16
const SESSION_SECONDS = 60;

export default function CalmMode() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const { setContext } = useParentContext();

  const [elapsed, setElapsed] = useState(0);
  const [logged, setLogged] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const phoneRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Log calmModeUsedAt once on entry
  useEffect(() => {
    if (logged) return;
    setContext({ calmModeUsedAt: new Date().toISOString() });
    setLogged(true);
  }, [logged, setContext]);

  // 1Hz tick for phase label, timer, and reduced-motion guide
  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  // Initial focus on the primary action
  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  // Escape returns home, focus trap for Tab/Shift+Tab
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        router.push('/');
        return;
      }
      if (e.key !== 'Tab') return;
      const candidates: (HTMLElement | null)[] = [phoneRef.current, buttonRef.current];
      const focusables = candidates.filter((el): el is HTMLElement => el !== null);
      if (focusables.length === 0) return;
      const active = document.activeElement as HTMLElement | null;
      const idx = active ? focusables.indexOf(active) : -1;
      if (idx === -1) {
        e.preventDefault();
        focusables[0]?.focus();
        return;
      }
      const nextIdx = e.shiftKey
        ? (idx - 1 + focusables.length) % focusables.length
        : (idx + 1) % focusables.length;
      e.preventDefault();
      focusables[nextIdx]?.focus();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [router]);

  const phaseIndex = Math.floor((elapsed % CYCLE_SECONDS) / PHASE_SECONDS);
  const phaseLabel = PHASES[phaseIndex];
  const phaseSecondsLeft = PHASE_SECONDS - (elapsed % PHASE_SECONDS);
  const remaining = Math.max(SESSION_SECONDS - elapsed, 0);
  const sessionDone = elapsed >= SESSION_SECONDS;

  function handleReturn() {
    router.push('/');
  }

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calm-heading"
      className="fixed inset-0 flex flex-col items-center justify-center bg-brand-warm-50 px-6 py-16 text-center sm:px-10"
    >
      {/* SR-only live announcement on entry */}
      <p className="sr-only" aria-live="polite">
        Calm mode is open. A 60-second box breathing exercise will begin. Press Escape at any time to return home.
      </p>

      <h1
        id="calm-heading"
        className="max-w-xl text-2xl font-semibold leading-relaxed text-brand-muted-800 sm:text-3xl"
      >
        You don&apos;t have to do anything else today.
      </h1>

      <div className="mt-16 flex flex-col items-center gap-6">
        {reducedMotion ? (
          <ReducedMotionGuide phaseLabel={phaseLabel} phaseSecondsLeft={phaseSecondsLeft} />
        ) : (
          <BreathingVisual phaseLabel={phaseLabel} />
        )}

        <p
          aria-live="off"
          className="font-mono text-sm tabular-nums text-brand-muted-500"
        >
          {sessionDone
            ? 'Stay as long as you need.'
            : `${formatTime(remaining)} remaining`}
        </p>
      </div>

      <div className="mt-16 flex flex-col items-center gap-4">
        <a
          ref={phoneRef}
          href="tel:988"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-muted-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-50"
        >
          <Phone className="h-4 w-4" aria-hidden />
          <span>
            If you need someone — call or text <span className="font-semibold">988</span>
          </span>
        </a>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleReturn}
          className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-brand-muted-200 bg-white px-7 py-3.5 text-sm font-semibold text-brand-muted-800 shadow-sm transition duration-700 ease-out hover:border-brand-muted-300 hover:bg-brand-warm-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-muted-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-50"
        >
          I&apos;m ready to come back
        </button>

        <p className="mt-2 text-[11px] text-brand-muted-400">
          Or press <kbd className="rounded border border-brand-muted-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-brand-muted-500">Esc</kbd>
        </p>
      </div>

      {/* Quiet exit affordance for users who don't see the button */}
      <button
        type="button"
        onClick={handleReturn}
        aria-label="Close calm mode"
        tabIndex={-1}
        className="absolute right-5 top-5 rounded-full p-2 text-brand-muted-300 transition hover:text-brand-muted-600"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function BreathingVisual({ phaseLabel }: { phaseLabel: string }) {
  return (
    <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
      <motion.div
        aria-hidden
        className="absolute h-40 w-40 rounded-full bg-brand-warm-200"
        animate={{ scale: [1, 1.55, 1.55, 1, 1], opacity: [0.55, 0.85, 0.85, 0.55, 0.55] }}
        transition={{
          duration: CYCLE_SECONDS,
          times: [0, 0.25, 0.5, 0.75, 1],
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
      <motion.div
        aria-hidden
        className="absolute h-40 w-40 rounded-full border border-brand-muted-200"
        animate={{ scale: [1, 1.55, 1.55, 1, 1] }}
        transition={{
          duration: CYCLE_SECONDS,
          times: [0, 0.25, 0.5, 0.75, 1],
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
      <p className="relative text-base font-medium text-brand-muted-700">
        {phaseLabel}
      </p>
    </div>
  );
}

function ReducedMotionGuide({
  phaseLabel,
  phaseSecondsLeft,
}: {
  phaseLabel: string;
  phaseSecondsLeft: number;
}) {
  return (
    <div className="flex h-72 w-72 flex-col items-center justify-center gap-4 sm:h-80 sm:w-80">
      <div
        aria-hidden
        className="flex h-40 w-40 items-center justify-center rounded-full bg-brand-warm-200"
      >
        <span className="font-mono text-3xl tabular-nums text-brand-muted-700">
          {phaseSecondsLeft}
        </span>
      </div>
      <p className="text-base font-semibold text-brand-muted-800">{phaseLabel}</p>
      <p className="max-w-[220px] text-xs leading-relaxed text-brand-muted-500">
        Box breathing: 4 seconds in, 4 hold, 4 out, 4 hold. Repeat for one minute.
      </p>
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
