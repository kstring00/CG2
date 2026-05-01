'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParentContext } from '@/lib/useParentContext';

const AGE_OPTIONS = ['Under 3', '3–5', '6–10', '11+'] as const;

const SITUATION_OPTIONS = [
  'We just got the diagnosis',
  "We're waiting on an evaluation",
  "School isn't working",
  'Therapy is in progress',
  "I'm just tired",
] as const;

export type IntakeAnswers = {
  childAge: string;
  currentSituation: string;
};

type Props = {
  onComplete?: (answers: IntakeAnswers) => void;
  className?: string;
};

type Step = 0 | 1;

export default function IntakeFlow({ onComplete, className }: Props) {
  const { setContext } = useParentContext();
  const [step, setStep] = useState<Step>(0);
  const [childAge, setChildAge] = useState<string | null>(null);
  const [situation, setSituation] = useState<string | null>(null);

  function selectAge(value: string) {
    setChildAge(value);
    window.setTimeout(() => setStep(1), 180);
  }

  function selectSituation(value: string) {
    setSituation(value);
    if (!childAge) return;
    setContext({
      childAge,
      currentSituation: value,
      lastVisit: new Date().toISOString(),
    });
    onComplete?.({ childAge, currentSituation: value });
  }

  function goBack() {
    setStep(0);
  }

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-2xl rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10',
        className,
      )}
    >
      {/* Progress */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2">
          <span
            aria-hidden
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              step >= 0 ? 'bg-primary' : 'bg-stone-200',
            )}
          />
          <span
            aria-hidden
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              step >= 1 ? 'bg-primary' : 'bg-stone-200',
            )}
          />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
          Step {step + 1} of 2
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="q1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-bold leading-tight text-stone-900 sm:text-3xl">
              How old is your child?
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Pick the closest range. You can change this later.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {AGE_OPTIONS.map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={childAge === option}
                  onClick={() => selectAge(option)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="q2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <button
              type="button"
              onClick={goBack}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 transition hover:text-stone-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>

            <h2 className="text-2xl font-bold leading-tight text-stone-900 sm:text-3xl">
              What&apos;s happening this week?
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Pick the one that sounds most like right now.
            </p>

            <div className="mt-7 grid gap-3">
              {SITUATION_OPTIONS.map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={situation === option}
                  onClick={() => selectSituation(option)}
                  trailing={<ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-primary" />}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
  trailing,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'group flex min-h-[64px] w-full items-center justify-between gap-4 rounded-2xl border bg-white px-5 py-4 text-left text-base font-semibold text-stone-800 shadow-sm transition',
        'hover:border-primary hover:bg-primary/[0.03] hover:shadow-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        selected
          ? 'border-primary bg-primary/[0.05] text-primary'
          : 'border-stone-200',
      )}
    >
      <span>{label}</span>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        {selected ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
            <Check className="h-3.5 w-3.5" />
          </span>
        ) : (
          trailing
        )}
      </span>
    </button>
  );
}
