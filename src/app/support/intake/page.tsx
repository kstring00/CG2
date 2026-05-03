'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveCarePlan, type ChildAge, type Hardest, type HelpKind, type Stage, type WeekMood } from '@/lib/carePlanStorage';
import {
  generateNextSteps,
  generateResources,
  generateSummary,
  generateWeekMessage,
  HARDEST_OPTIONS,
} from '@/lib/generateNextSteps';

type StageOption = { value: Stage; label: string };
const STAGE_OPTIONS: StageOption[] = [
  { value: 'newly-diagnosed', label: 'Newly diagnosed' },
  { value: 'waiting-diagnosis', label: 'Waiting on diagnosis' },
  { value: 'in-aba', label: 'In ABA already' },
  { value: 'looking-for-aba', label: 'Looking for ABA' },
  { value: 'past-aba', label: 'Past ABA, ongoing parenting' },
];

const AGE_OPTIONS: { value: ChildAge; label: string }[] = [
  { value: '0-2', label: '0–2' },
  { value: '2-5', label: '2–5' },
  { value: '6-12', label: '6–12' },
  { value: '13-17', label: '13–17' },
];

const HELP_OPTIONS: { value: HelpKind; label: string }[] = [
  { value: 'practical-info', label: 'Practical info' },
  { value: 'local-providers', label: 'Local providers' },
  { value: 'someone-to-talk-to', label: 'Someone to talk to' },
  { value: 'time-for-me', label: 'Time for me' },
  { value: 'not-sure', label: 'Not sure' },
];

/** Reuses Still Waters mood vocabulary for consistency. */
const MOOD_OPTIONS: { value: WeekMood; label: string }[] = [
  { value: 'frayed', label: 'Frayed' },
  { value: 'heavy', label: 'Heavy' },
  { value: 'numb', label: 'Numb' },
  { value: 'steady', label: 'Steady' },
  { value: 'hopeful', label: 'Hopeful' },
];

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function IntakePage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [hardest, setHardest] = useState<Hardest[]>([]);
  const [stage, setStage] = useState<Stage | null>(null);
  const [childAge, setChildAge] = useState<ChildAge | null>(null);
  const [helpKind, setHelpKind] = useState<HelpKind | null>(null);
  const [weekMood, setWeekMood] = useState<WeekMood | null>(null);
  const [notes, setNotes] = useState('');

  const total = 7;
  const canAdvance = useMemo(() => {
    switch (step) {
      case 1: return hardest.length > 0;
      case 2: return stage !== null;
      case 3: return childAge !== null;
      case 4: return helpKind !== null;
      case 5: return weekMood !== null;
      case 6: return true; // notes optional
      default: return true;
    }
  }, [step, hardest, stage, childAge, helpKind, weekMood]);

  const next = () => setStep((s) => (s < 7 ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  const toggleHardest = (h: Hardest) => {
    setHardest((arr) => (arr.includes(h) ? arr.filter((x) => x !== h) : [...arr, h]));
  };

  // Step 7 — confirmation: build & save the plan, then redirect to /support/care-plan.
  useEffect(() => {
    if (step !== 7) return;
    const answers = { hardest, stage, childAge, helpKind, weekMood, notes: notes || null };
    const steps = generateNextSteps(answers);
    const resources = generateResources(answers);
    saveCarePlan({
      answers,
      summary: generateSummary(answers),
      steps,
      resources,
      weekMessage: generateWeekMessage(weekMood),
    });
    const t = window.setTimeout(() => router.push('/support/care-plan'), 1600);
    return () => window.clearTimeout(t);
  }, [step, hardest, stage, childAge, helpKind, weekMood, notes, router]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="rounded-3xl border border-surface-border bg-white p-6 shadow-soft sm:p-8">
        {step < 7 && (
          <header className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              question {step} of {total - 1}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${((step - 1) / (total - 1)) * 100}%` }}
              />
            </div>
          </header>
        )}

        {step === 1 && (
          <Question
            title="What feels hardest right now?"
            hint="Pick anything that fits — you can choose more than one."
          >
            <div className="grid gap-2">
              {HARDEST_OPTIONS.map((opt) => (
                <Toggle
                  key={opt.value}
                  active={hardest.includes(opt.value)}
                  onClick={() => toggleHardest(opt.value)}
                  label={opt.label}
                />
              ))}
            </div>
          </Question>
        )}

        {step === 2 && (
          <Question title="What stage are you in?" hint="Pick one. There&rsquo;s no wrong answer.">
            <div className="grid gap-2">
              {STAGE_OPTIONS.map((opt) => (
                <Toggle
                  key={opt.value}
                  active={stage === opt.value}
                  onClick={() => setStage(opt.value)}
                  label={opt.label}
                />
              ))}
            </div>
          </Question>
        )}

        {step === 3 && (
          <Question title="How old is your child?">
            <div className="grid grid-cols-4 gap-2">
              {AGE_OPTIONS.map((opt) => (
                <Toggle
                  key={opt.value}
                  active={childAge === opt.value}
                  onClick={() => setChildAge(opt.value)}
                  label={opt.label}
                  compact
                />
              ))}
            </div>
          </Question>
        )}

        {step === 4 && (
          <Question title="What kind of help feels right today?">
            <div className="grid gap-2 sm:grid-cols-2">
              {HELP_OPTIONS.map((opt) => (
                <Toggle
                  key={opt.value}
                  active={helpKind === opt.value}
                  onClick={() => setHelpKind(opt.value)}
                  label={opt.label}
                />
              ))}
            </div>
          </Question>
        )}

        {step === 5 && (
          <Question title="How are you doing this week?" hint="The same words you'd see in Still Waters.">
            <div className="grid grid-cols-5 gap-2">
              {MOOD_OPTIONS.map((opt) => (
                <Toggle
                  key={opt.value}
                  active={weekMood === opt.value}
                  onClick={() => setWeekMood(opt.value)}
                  label={opt.label}
                  compact
                />
              ))}
            </div>
          </Question>
        )}

        {step === 6 && (
          <Question title="Anything you want us to know?" hint="Optional. Skip if today isn&rsquo;t a writing day.">
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="A sentence is enough."
              className="w-full rounded-2xl border border-surface-border bg-white px-3 py-3 text-[14px] focus:border-primary focus:outline-none"
            />
          </Question>
        )}

        {step === 7 && (
          <div className="py-10 text-center">
            <div
              aria-hidden
              className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
            />
            <h1 className="mt-6 text-2xl font-semibold text-brand-navy-700">building your plan…</h1>
            <p className="mt-2 text-[14px] text-brand-muted-600">
              we&rsquo;ll keep it simple. one moment.
            </p>
          </div>
        )}

        {step < 7 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={back}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold',
                step === 1
                  ? 'cursor-not-allowed text-brand-muted-300'
                  : 'text-brand-muted-700 hover:bg-surface-subtle hover:text-brand-muted-900',
              )}
            >
              <ArrowLeft className="h-4 w-4" /> back
            </button>
            <button
              type="button"
              disabled={!canAdvance}
              onClick={next}
              className={cn(
                'inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition',
                canAdvance ? 'bg-primary hover:bg-primary/90' : 'bg-stone-300',
              )}
            >
              {step === 6 ? 'build my plan' : 'continue'} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function Question({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h1 className="text-2xl font-semibold leading-snug text-brand-navy-700">{title}</h1>
      {hint && <p className="mt-1 text-[13.5px] text-brand-muted-500">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Toggle({
  active,
  onClick,
  label,
  compact,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex w-full items-center justify-between gap-2 rounded-2xl border-2 text-left text-[13.5px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        compact ? 'px-3 py-2 text-center justify-center' : 'px-4 py-3.5',
        active
          ? 'border-primary bg-primary/5 text-brand-navy-700'
          : 'border-surface-border bg-white text-brand-muted-700 hover:border-primary/40 hover:bg-primary/5',
      )}
    >
      <span className={compact ? 'mx-auto' : ''}>{label}</span>
      {!compact && <Check className={cn('h-4 w-4 text-primary', active ? 'opacity-100' : 'opacity-0')} />}
    </button>
  );
}
