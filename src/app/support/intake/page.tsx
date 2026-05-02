'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'cg_intake_progress';
const TOTAL_QUESTION_STEPS = 5;

type IntakeProgress = {
  step: number;
  caregiver: string | null;
  journeyStage: string | null;
  hardest: string[];
  supportWanted: string[];
  email: string | null;
  isClient: string | null;
  wantsUpdates: string | null;
  completedAt: string | null;
};

const initialProgress: IntakeProgress = {
  step: 0,
  caregiver: null,
  journeyStage: null,
  hardest: [],
  supportWanted: [],
  email: null,
  isClient: null,
  wantsUpdates: null,
  completedAt: null,
};

const CAREGIVER_OPTIONS = [
  'Parent',
  'Grandparent',
  'Foster caregiver',
  'Guardian or relative caregiver',
  "I help care for the child, but I'm not the primary caregiver",
];

const JOURNEY_OPTIONS = [
  'We are still trying to understand what is going on',
  'My child was recently diagnosed',
  'My child is in therapy now',
  'We are navigating school, IEPs, or services',
  'My child is older, and we are thinking about teen or adult needs',
];

const HARDEST_OPTIONS = [
  "I'm exhausted",
  'I feel alone in this',
  "I'm fighting a system",
  "I'm worried about my child's future",
  "I'm doubting myself",
  'I need help understanding therapy or services',
  'School feels overwhelming',
  'Money, insurance, or paperwork is stressful',
  'Siblings are being affected',
  'Home routines feel hard to manage',
];

const SUPPORT_OPTIONS = [
  'Clear information I can actually understand',
  'A real person or parent to talk to',
  'Local resources near me',
  'Simple tools I can use at home',
  'Help knowing what questions to ask',
  "Encouragement that I'm not doing this alone",
];

const CLIENT_OPTIONS = [
  'Yes, we are already a Texas ABA Centers family',
  'Not yet',
  "I'm not sure",
];

const UPDATES_OPTIONS = [
  'Yes, send me updates',
  'No thanks, just send my plan',
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function loadProgress(): IntakeProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<IntakeProgress>;
    return { ...initialProgress, ...parsed };
  } catch {
    return null;
  }
}

function saveProgress(progress: IntakeProgress) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage might be disabled — silently ignore
  }
}

function clearProgress() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function IntakePage() {
  const [hydrated, setHydrated] = useState(false);
  const [progress, setProgress] = useState<IntakeProgress>(initialProgress);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      if (saved.completedAt) {
        // Skip directly to the plan screen.
        setProgress({ ...saved, step: 7 });
      } else if (saved.step > 0) {
        // Render Step 0 with a resume banner; don't auto-jump.
        setProgress({ ...saved, step: 0 });
        setShowResumeBanner(true);
      } else {
        setProgress(saved);
      }
    }
    setHydrated(true);
  }, []);

  // Persist on every meaningful change.
  useEffect(() => {
    if (!hydrated) return;
    saveProgress(progress);
  }, [progress, hydrated]);

  // Loading step → auto-advance after 2s.
  useEffect(() => {
    if (progress.step !== 6) return;
    const t = window.setTimeout(() => {
      setProgress((p) => ({
        ...p,
        step: 7,
        completedAt: p.completedAt ?? new Date().toISOString(),
      }));
    }, 2000);
    return () => window.clearTimeout(t);
  }, [progress.step]);

  // Announce step transitions to screen readers.
  useEffect(() => {
    if (!hydrated) return;
    const labels: Record<number, string> = {
      0: 'Welcome to the Family Care Plan intake.',
      1: 'Step 1 of 5. What best describes you?',
      2: 'Step 2 of 5. Where does your family feel like you are right now?',
      3: 'Step 3 of 5. What feels heaviest right now? Choose up to three.',
      4: 'Step 4 of 5. What kind of support would help you most? Choose up to two.',
      5: 'Step 5 of 5. Where should we send your plan?',
      6: 'Building your Family Care Plan.',
      7: 'Your plan is on the way.',
    };
    setAnnouncement(labels[progress.step] ?? '');
  }, [progress.step, hydrated]);

  function startOver() {
    clearProgress();
    setProgress(initialProgress);
    setShowResumeBanner(false);
    setEmailError(null);
  }

  function resume() {
    const saved = loadProgress();
    if (saved) {
      setProgress({ ...saved, step: Math.max(saved.step, 1) });
    }
    setShowResumeBanner(false);
  }

  function goNext(step: number) {
    setProgress((p) => ({ ...p, step }));
  }

  function goBack() {
    setProgress((p) => ({ ...p, step: Math.max(0, p.step - 1) }));
  }

  if (!hydrated) {
    // Render a minimal shell while we hydrate, to avoid a localStorage flash.
    return (
      <div className="page-shell">
        <div className="h-32 animate-pulse rounded-3xl bg-white/60" />
      </div>
    );
  }

  return (
    <div className="page-shell">
      {/* SR-only announcer for step transitions */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Progress indicator — only visible during actual question steps */}
      {progress.step >= 1 && progress.step <= 5 && (
        <ProgressBar current={progress.step} total={TOTAL_QUESTION_STEPS} />
      )}

      <AnimatePresence mode="wait">
        {progress.step === 0 && (
          <StepWrapper key="step-0">
            <IntroStep
              onStart={() => goNext(1)}
              showResumeBanner={showResumeBanner}
              onResume={resume}
              onStartOver={startOver}
            />
          </StepWrapper>
        )}

        {progress.step === 1 && (
          <StepWrapper key="step-1">
            <SingleSelectStep
              heading="What best describes you?"
              sub="Tap one."
              options={CAREGIVER_OPTIONS}
              value={progress.caregiver}
              onChange={(v) => setProgress((p) => ({ ...p, caregiver: v }))}
              onBack={goBack}
              onContinue={() => goNext(2)}
            />
          </StepWrapper>
        )}

        {progress.step === 2 && (
          <StepWrapper key="step-2">
            <SingleSelectStep
              heading="Where does your family feel like you are right now?"
              sub="Choose the one that feels most true today. You can always come back later."
              options={JOURNEY_OPTIONS}
              value={progress.journeyStage}
              onChange={(v) => setProgress((p) => ({ ...p, journeyStage: v }))}
              onBack={goBack}
              onContinue={() => goNext(3)}
            />
          </StepWrapper>
        )}

        {progress.step === 3 && (
          <StepWrapper key="step-3">
            <MultiSelectStep
              heading="What feels heaviest right now?"
              sub="Choose up to 3."
              options={HARDEST_OPTIONS}
              max={3}
              value={progress.hardest}
              onChange={(v) => setProgress((p) => ({ ...p, hardest: v }))}
              onBack={goBack}
              onContinue={() => goNext(4)}
            />
          </StepWrapper>
        )}

        {progress.step === 4 && (
          <StepWrapper key="step-4">
            <MultiSelectStep
              heading="What kind of support would help you most right now?"
              sub="Choose up to 2."
              options={SUPPORT_OPTIONS}
              max={2}
              value={progress.supportWanted}
              onChange={(v) => setProgress((p) => ({ ...p, supportWanted: v }))}
              onBack={goBack}
              onContinue={() => goNext(5)}
            />
          </StepWrapper>
        )}

        {progress.step === 5 && (
          <StepWrapper key="step-5">
            <EmailStep
              email={progress.email}
              isClient={progress.isClient}
              wantsUpdates={progress.wantsUpdates}
              emailError={emailError}
              onEmailChange={(v) => {
                setEmailError(null);
                setProgress((p) => ({ ...p, email: v }));
              }}
              onIsClientChange={(v) =>
                setProgress((p) => ({ ...p, isClient: v }))
              }
              onWantsUpdatesChange={(v) =>
                setProgress((p) => ({ ...p, wantsUpdates: v }))
              }
              onBack={goBack}
              onContinue={() => {
                if (!progress.email || !isValidEmail(progress.email)) {
                  setEmailError('Please enter a valid email address.');
                  return;
                }
                goNext(6);
              }}
            />
          </StepWrapper>
        )}

        {progress.step === 6 && (
          <StepWrapper key="step-6">
            <LoadingStep />
          </StepWrapper>
        )}

        {progress.step === 7 && (
          <StepWrapper key="step-7">
            <PlanPlaceholderStep
              progress={progress}
              onStartOver={startOver}
            />
          </StepWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-muted-500">
        <span className="inline-flex items-center gap-1.5 text-primary">
          <Compass className="h-3.5 w-3.5" /> Family Care Plan
        </span>
        <span>
          Step {current} of {total}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function IntroStep({
  onStart,
  showResumeBanner,
  onResume,
  onStartOver,
}: {
  onStart: () => void;
  showResumeBanner: boolean;
  onResume: () => void;
  onStartOver: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      {showResumeBanner && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <p className="flex-1 text-sm text-brand-muted-700">
            <span className="font-semibold text-brand-muted-900">
              Welcome back.
            </span>{' '}
            You started this last time.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onResume}
              className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={onStartOver}
              className="rounded-xl border border-surface-border bg-white px-3 py-1.5 text-xs font-semibold text-brand-muted-700 transition hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
            >
              Start over
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-surface-border bg-white p-7 shadow-card sm:p-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
          <Compass className="h-3.5 w-3.5" /> Family Care Plan
        </span>
        <h1 className="mt-5 text-balance text-3xl font-bold leading-tight text-brand-muted-900 sm:text-4xl">
          Let&apos;s build your Family Care Plan.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-brand-muted-700 sm:text-lg">
          Answer a few quick questions so Common Ground can point you toward the
          most helpful next steps, resources, and people.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted-500 sm:text-base">
          This is not a test. There are no wrong answers. Pick what feels
          closest to where you are right now.
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 sm:w-auto"
          >
            Start <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-6 text-xs text-brand-muted-500">
          5 quick questions · about 2 minutes
        </p>
      </div>
    </div>
  );
}

function StepShell({
  heading,
  sub,
  children,
  onBack,
  onContinue,
  continueDisabled,
  continueLabel = 'Continue',
}: {
  heading: string;
  sub: string;
  children: React.ReactNode;
  onBack: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-brand-muted-600 underline-offset-2 transition hover:text-brand-muted-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="rounded-3xl border border-surface-border bg-white p-6 shadow-card sm:p-9">
        <h2 className="text-2xl font-bold leading-tight text-brand-muted-900 sm:text-3xl">
          {heading}
        </h2>
        <p className="mt-2 text-sm text-brand-muted-500 sm:text-base">{sub}</p>

        <div className="mt-6">{children}</div>

        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onContinue}
            disabled={continueDisabled}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-semibold shadow-soft transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
              continueDisabled
                ? 'cursor-not-allowed bg-surface-subtle text-brand-muted-400'
                : 'bg-primary text-white hover:bg-primary/90',
            )}
          >
            {continueLabel} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SingleSelectStep({
  heading,
  sub,
  options,
  value,
  onChange,
  onBack,
  onContinue,
}: {
  heading: string;
  sub: string;
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <StepShell
      heading={heading}
      sub={sub}
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!value}
    >
      <ul
        role="radiogroup"
        aria-label={heading}
        className="m-0 flex list-none flex-col gap-2.5 p-0"
      >
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <li key={opt}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(opt)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 sm:text-base',
                  selected
                    ? 'border-primary bg-primary/5 text-brand-muted-900 shadow-soft'
                    : 'border-surface-border bg-white text-brand-muted-700 hover:border-primary/40 hover:bg-primary/[0.03]',
                )}
              >
                <span className="flex-1">{opt}</span>
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition',
                    selected
                      ? 'border-primary bg-primary text-white'
                      : 'border-surface-border bg-white',
                  )}
                  aria-hidden
                >
                  {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </StepShell>
  );
}

function MultiSelectStep({
  heading,
  sub,
  options,
  max,
  value,
  onChange,
  onBack,
  onContinue,
}: {
  heading: string;
  sub: string;
  options: string[];
  max: number;
  value: string[];
  onChange: (v: string[]) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const atCap = value.length >= max;

  function toggle(opt: string) {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else if (!atCap) {
      onChange([...value, opt]);
    }
  }

  return (
    <StepShell
      heading={heading}
      sub={sub}
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={value.length === 0}
    >
      <p className="mb-3 text-xs font-semibold text-brand-muted-500">
        {value.length} of {max} selected
      </p>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {options.map((opt) => {
          const selected = value.includes(opt);
          const dimmed = !selected && atCap;
          return (
            <li key={opt}>
              <button
                type="button"
                role="checkbox"
                aria-checked={selected}
                aria-disabled={dimmed}
                onClick={() => toggle(opt)}
                disabled={dimmed}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 sm:text-base',
                  selected
                    ? 'border-primary bg-primary/5 text-brand-muted-900 shadow-soft'
                    : dimmed
                    ? 'cursor-not-allowed border-surface-border bg-surface-muted text-brand-muted-400 opacity-60'
                    : 'border-surface-border bg-white text-brand-muted-700 hover:border-primary/40 hover:bg-primary/[0.03]',
                )}
              >
                <span className="flex-1">{opt}</span>
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition',
                    selected
                      ? 'border-primary bg-primary text-white'
                      : 'border-surface-border bg-white',
                  )}
                  aria-hidden
                >
                  {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </StepShell>
  );
}

function EmailStep({
  email,
  isClient,
  wantsUpdates,
  emailError,
  onEmailChange,
  onIsClientChange,
  onWantsUpdatesChange,
  onBack,
  onContinue,
}: {
  email: string | null;
  isClient: string | null;
  wantsUpdates: string | null;
  emailError: string | null;
  onEmailChange: (v: string) => void;
  onIsClientChange: (v: string) => void;
  onWantsUpdatesChange: (v: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const continueDisabled =
    !email ||
    !isValidEmail(email) ||
    !isClient ||
    !wantsUpdates;

  return (
    <StepShell
      heading="Where should we send your plan?"
      sub="Your plan will show on this screen right away. We can also email it so you can come back to it later."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={continueDisabled}
      continueLabel="Build my plan"
    >
      <div className="space-y-7">
        <div>
          <label
            htmlFor="intake-email"
            className="block text-sm font-semibold text-brand-muted-800"
          >
            Email address
          </label>
          <input
            id="intake-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email ?? ''}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? 'intake-email-error' : undefined}
            className={cn(
              'mt-2 block w-full rounded-2xl border-2 bg-white px-4 py-3.5 text-base text-brand-muted-900 placeholder:text-brand-muted-400 transition focus:outline-none focus:ring-2 focus:ring-primary/30',
              emailError
                ? 'border-accent focus:border-accent'
                : 'border-surface-border focus:border-primary',
            )}
          />
          {emailError && (
            <p id="intake-email-error" className="mt-2 text-sm text-accent">
              {emailError}
            </p>
          )}
        </div>

        <SubSingleSelect
          legend="Are you currently connected with Texas ABA Centers?"
          options={CLIENT_OPTIONS}
          value={isClient}
          onChange={onIsClientChange}
        />

        <SubSingleSelect
          legend="Would you like occasional Common Ground updates about parent events, resources, and support options?"
          options={UPDATES_OPTIONS}
          value={wantsUpdates}
          onChange={onWantsUpdatesChange}
        />
      </div>
    </StepShell>
  );
}

function SubSingleSelect({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-brand-muted-800">
        {legend}
      </legend>
      <div
        role="radiogroup"
        aria-label={legend}
        className="mt-3 flex flex-col gap-2"
      >
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt)}
              className={cn(
                'flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
                selected
                  ? 'border-primary bg-primary/5 text-brand-muted-900'
                  : 'border-surface-border bg-white text-brand-muted-700 hover:border-primary/40 hover:bg-primary/[0.03]',
              )}
            >
              <span className="flex-1">{opt}</span>
              <span
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition',
                  selected
                    ? 'border-primary bg-primary text-white'
                    : 'border-surface-border bg-white',
                )}
                aria-hidden
              >
                {selected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function LoadingStep() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-surface-border bg-white p-10 text-center shadow-card sm:p-14">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-7 w-7 animate-spin text-primary" aria-hidden />
        </div>
        <h2 className="text-2xl font-bold text-brand-muted-900 sm:text-3xl">
          Building your Family Care Plan…
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted-700 sm:text-base">
          We&apos;re matching your answers with the most helpful Common Ground
          resources.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-brand-muted-500 sm:text-sm">
          This is not locked. You can come back anytime as your family&apos;s
          needs change.
        </p>
      </div>
    </div>
  );
}

function PlanPlaceholderStep({
  progress,
  onStartOver,
}: {
  progress: IntakeProgress;
  onStartOver: () => void;
}) {
  const summary = useMemo(
    () => [
      { label: 'You', value: progress.caregiver },
      { label: 'Where you are', value: progress.journeyStage },
      {
        label: 'Heaviest right now',
        value:
          progress.hardest.length > 0 ? progress.hardest.join(' · ') : null,
      },
      {
        label: 'Support you want',
        value:
          progress.supportWanted.length > 0
            ? progress.supportWanted.join(' · ')
            : null,
      },
      { label: 'Email', value: progress.email },
    ],
    [progress],
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-surface-border bg-white p-7 shadow-card sm:p-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Family Care Plan
        </span>
        <h1 className="mt-5 text-3xl font-bold leading-tight text-brand-muted-900 sm:text-4xl">
          Your plan is on the way.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-brand-muted-700">
          Plan generation is being built. For now, your answers are saved. When
          we ship plan generation in the next update, your plan will appear here
          automatically.
        </p>

        <div className="mt-7 rounded-2xl border border-surface-border bg-surface-muted/60 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted-500">
            What we captured
          </p>
          <dl className="mt-3 space-y-3">
            {summary.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-1 gap-1 sm:grid-cols-[140px_1fr] sm:gap-4"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-brand-muted-500">
                  {item.label}
                </dt>
                <dd className="text-sm text-brand-muted-800">
                  {item.value || (
                    <span className="text-brand-muted-400">—</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-soft transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            Back to Common Ground <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={onStartOver}
            className="text-sm font-semibold text-brand-muted-500 underline-offset-4 transition hover:text-brand-muted-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 sm:ml-3"
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
