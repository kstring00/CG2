'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParentContext, type ParentContext } from '@/lib/useParentContext';

const AGE_OPTIONS = ['Under 3', '3 to 5', '6 to 10', '11 and up'] as const;

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
  onComplete?: (context: ParentContext) => void;
  onSkip?: () => void;
  className?: string;
};

type Step = 0 | 1;

export default function IntakeFlow({ onComplete, onSkip, className }: Props) {
  const { setContext } = useParentContext();
  const [step, setStep] = useState<Step>(0);
  const [childAge, setChildAge] = useState<string | null>(null);
  const [situation, setSituation] = useState<string | null>(null);
  const firstOptionRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    firstOptionRef.current?.focus();
  }, [step]);

  function selectAge(value: string) {
    setChildAge(value);
    window.setTimeout(() => setStep(1), 180);
  }

  function selectSituation(value: string) {
    setSituation(value);
    if (!childAge) return;
    const completedIntakeAt = new Date().toISOString();
    setContext({
      childAge,
      currentSituation: value,
      completedIntakeAt,
      lastVisit: completedIntakeAt,
    });
    onComplete?.({
      childAge,
      currentSituation: value,
      completedIntakeAt,
      lastVisit: completedIntakeAt,
      lastSection: null,
      calmModeUsedAt: null,
    });
  }

  function goBack() {
    setStep(0);
  }

  return (
    <section
      aria-labelledby="intake-question-heading"
      className={cn(
        'mx-auto w-full max-w-2xl rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10',
        className,
      )}
    >
      {/* Progress */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2" aria-hidden="true">
          <span
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              step >= 0 ? 'bg-primary' : 'bg-stone-200',
            )}
          />
          <span
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
            <h2
              id="intake-question-heading"
              className="text-2xl font-bold leading-tight text-stone-900 sm:text-3xl"
            >
              How old is your child?
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Pick the closest range. You can change this later.
            </p>

            <div
              role="radiogroup"
              aria-labelledby="intake-question-heading"
              className="mt-7 grid gap-3 sm:grid-cols-2"
            >
              {AGE_OPTIONS.map((option, i) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={childAge === option}
                  onClick={() => selectAge(option)}
                  ref={i === 0 ? firstOptionRef : undefined}
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
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 transition hover:text-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>

            <h2
              id="intake-question-heading"
              className="text-2xl font-bold leading-tight text-stone-900 sm:text-3xl"
            >
              What&apos;s happening this week?
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Pick the one that sounds most like right now.
            </p>

            <div
              role="radiogroup"
              aria-labelledby="intake-question-heading"
              className="mt-7 grid gap-3"
            >
              {SITUATION_OPTIONS.map((option, i) => (
                <OptionButton
                  key={option}
                  label={option}
                  selected={situation === option}
                  onClick={() => selectSituation(option)}
                  trailing={<ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-primary" />}
                  ref={i === 0 ? firstOptionRef : undefined}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {onSkip ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-medium text-stone-400 underline-offset-2 transition hover:text-stone-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            or skip and browse
          </button>
        </div>
      ) : null}
    </section>
  );
}

type OptionButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  trailing?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
};

function OptionButton({ label, selected, onClick, trailing, ref }: OptionButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        'group flex min-h-[64px] w-full items-center justify-between gap-4 rounded-2xl border bg-white px-5 py-4 text-left text-base font-semibold text-stone-800 shadow-sm transition',
        'hover:border-primary hover:bg-primary/[0.03] hover:shadow-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        selected ? 'border-primary bg-primary/[0.05] text-primary' : 'border-stone-200',
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
