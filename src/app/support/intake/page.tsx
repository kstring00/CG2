'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  Compass,
  DollarSign,
  GraduationCap,
  Heart,
  HeartHandshake,
  Home,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  saveCarePlan,
  loadCarePlanDraft,
  saveCarePlanDraft,
  clearCarePlanDraft,
  type Hardest,
  type HelpKind,
  type Stage,
} from '@/lib/carePlanStorage';
import { ensurePlanStarted } from '@/lib/weeklyCheckIn';
import { markWeeklyIntakeDone, resetWeeklyProgress } from '@/lib/weeklyProgress';
import {
  generateNextSteps,
  generateResources,
  generateSummary,
  generateWeekMessage,
  HARDEST_OPTIONS,
} from '@/lib/generateNextSteps';

// ---------------------------------------------------------------------------
// Option data — labels, supporting copy, and icons for visual differentiation
// ---------------------------------------------------------------------------

const HARDEST_ICONS: Record<Hardest, React.ComponentType<{ className?: string }>> = {
  'understanding-aba': Brain,
  'behavior-home': Home,
  'overwhelmed': Heart,
  'finding-resources': Search,
  'financial-insurance': DollarSign,
  'siblings': Users,
  'connecting-parents': HeartHandshake,
  'school-iep': GraduationCap,
};

type StageOption = { value: Stage; label: string; hint: string };
const STAGE_OPTIONS: StageOption[] = [
  { value: 'newly-diagnosed', label: 'Newly diagnosed', hint: 'A name was just given to something you’ve been seeing.' },
  { value: 'waiting-diagnosis', label: 'Waiting on a diagnosis', hint: 'In the in-between — appointments and questions.' },
  { value: 'in-aba', label: 'In ABA already', hint: 'Therapy is part of your week.' },
  { value: 'looking-for-aba', label: 'Looking for ABA', hint: 'Comparing providers or waitlists.' },
  { value: 'past-aba', label: 'Past ABA, parenting onward', hint: 'Building the next chapter for your family.' },
];

type HelpOption = { value: HelpKind; label: string; hint: string };
const HELP_OPTIONS: HelpOption[] = [
  { value: 'practical-info', label: 'Practical info', hint: 'Guides, strategies, and how-to.' },
  { value: 'local-providers', label: 'Local providers', hint: 'Names, locations, and waitlists near you.' },
  { value: 'someone-to-talk-to', label: 'Someone to talk to', hint: 'A parent who gets it, on your timing.' },
  { value: 'time-for-me', label: 'Time for me', hint: 'Your own breathing room — the parent side.' },
  { value: 'not-sure', label: 'Not sure yet', hint: 'That’s a real answer. We’ll show you a gentle starting point.' },
];


// ---------------------------------------------------------------------------
// Step model — Week 1 intake. A short, focused flow:
//   1. Where are you in this right now?  (stage)
//   2. What's hardest right now?         (hardest, multi)
//   3. What would help most?             (help, multi)
// ---------------------------------------------------------------------------

type StepKind =
  | 'q-stage'
  | 'q-hardest'
  | 'q-help'
  | 'building';

const STEP_ORDER: StepKind[] = [
  'q-stage',
  'q-hardest',
  'q-help',
  'building',
];

// Steps that count toward the parent-facing progress bar (questions only).
const PROGRESS_STEPS: StepKind[] = [
  'q-stage',
  'q-hardest',
  'q-help',
];

// Per-step background hue — soft, not loud. The form feels like walking through rooms.
const STEP_HUE: Record<StepKind, string> = {
  'q-stage': 'bg-brand-warm-50',
  'q-hardest': 'bg-brand-warm-100',
  'q-help': 'bg-brand-warm-100',
  'building': 'bg-brand-warm-50',
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function IntakePage() {
  const router = useRouter();

  const [stepIdx, setStepIdx] = useState(0);
  const [stage, setStage] = useState<Stage | null>(null);
  const [hardest, setHardest] = useState<Hardest[]>([]);
  const [helpKinds, setHelpKinds] = useState<HelpKind[]>([]);

  // Tracks whether we've finished restoring any saved draft. We must not
  // autosave until the restore pass runs, or the initial empty state would
  // overwrite a real draft on first render.
  const [draftLoaded, setDraftLoaded] = useState(false);

  useEffect(() => {
    // Restore any in-progress answers from a prior visit so leaving the flow
    // (or an accidental tap) never throws away what the parent already typed.
    const draft = loadCarePlanDraft();
    if (draft) {
      if (draft.stage) setStage(draft.stage);
      if (Array.isArray(draft.hardest)) setHardest(draft.hardest);
      if (Array.isArray(draft.helpKinds)) setHelpKinds(draft.helpKinds);
    }
    setDraftLoaded(true);
  }, []);

  // Autosave the draft on every answer change once restore has run.
  useEffect(() => {
    if (!draftLoaded) return;
    saveCarePlanDraft({ stage, hardest, helpKinds });
  }, [draftLoaded, stage, hardest, helpKinds]);

  const step = STEP_ORDER[stepIdx];
  const progressIdx = PROGRESS_STEPS.indexOf(step);
  const progressTotal = PROGRESS_STEPS.length;

  const canAdvance = useMemo(() => {
    switch (step) {
      case 'q-stage': return stage !== null;
      case 'q-hardest': return hardest.length > 0;
      case 'q-help': return helpKinds.length > 0;
      default: return true; // building auto-advances
    }
  }, [step, stage, hardest, helpKinds]);

  const next = () => setStepIdx((i) => Math.min(i + 1, STEP_ORDER.length - 1));
  const back = () => setStepIdx((i) => Math.max(i - 1, 0));

  const toggleHardest = (h: Hardest) => {
    setHardest((arr) => (arr.includes(h) ? arr.filter((x) => x !== h) : [...arr, h]));
  };

  const toggleHelp = (h: HelpKind) => {
    setHelpKinds((arr) => (arr.includes(h) ? arr.filter((x) => x !== h) : [...arr, h]));
  };

  // Build & save on 'building' step.
  useEffect(() => {
    if (step !== 'building') return;
    const answers = { hardest, stage, helpKinds };
    saveCarePlan({
      answers,
      summary: generateSummary(answers),
      steps: generateNextSteps(answers),
      resources: generateResources(answers),
      weekMessage: generateWeekMessage(null),
    });
    ensurePlanStarted();
    // Running intake regenerates the plan steps, so clear any per-step
    // progress from earlier in the week (the old hrefs are gone) and credit
    // the first notch for completing the intake/check-in flow.
    resetWeeklyProgress();
    markWeeklyIntakeDone();
    // The plan is now committed — drop the in-progress draft.
    clearCarePlanDraft();
    const t = window.setTimeout(() => router.push('/support/care-plan'), 1700);
    return () => window.clearTimeout(t);
  }, [step, hardest, stage, helpKinds, router]);

  return (
    <main className={cn('min-h-[calc(100vh-4rem)] transition-colors duration-500', STEP_HUE[step])}>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-3xl border border-surface-border bg-white p-6 shadow-soft sm:p-8">
          {/* Week 1 marker — frames the intake as the first week of the plan. */}
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-plum-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
            Week 1
          </p>

          {progressIdx >= 0 && (
            <header className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Question {progressIdx + 1} of {progressTotal}
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${((progressIdx + 1) / progressTotal) * 100}%` }}
                />
              </div>
            </header>
          )}

          {/* Questions */}
          {step === 'q-stage' && (
            <Question title="Where are you in this right now?" hint="Pick one. There’s no wrong answer.">
              <div className="grid gap-2">
                {STAGE_OPTIONS.map((opt) => (
                  <Toggle
                    key={opt.value}
                    active={stage === opt.value}
                    onClick={() => setStage(opt.value)}
                    label={opt.label}
                    sublabel={opt.hint}
                  />
                ))}
              </div>
            </Question>
          )}

          {step === 'q-hardest' && (
            <Question
              title="What’s hardest right now?"
              hint="Pick anything that fits — you can choose more than one. Each pick shapes your plan."
            >
              <div className="grid gap-2">
                {HARDEST_OPTIONS.map((opt) => {
                  const Icon = HARDEST_ICONS[opt.value];
                  return (
                    <Toggle
                      key={opt.value}
                      active={hardest.includes(opt.value)}
                      onClick={() => toggleHardest(opt.value)}
                      label={opt.label}
                      icon={<Icon className="h-4 w-4" />}
                    />
                  );
                })}
              </div>
              {hardest.length > 1 && (
                <p className="mt-3 text-[12.5px] text-brand-muted-600">
                  You picked {hardest.length}. We’ll weight your plan toward all of them.
                </p>
              )}
            </Question>
          )}

          {step === 'q-help' && (
            <Question
              title="What would help most?"
              hint="Pick as many as apply — you can choose more than one."
            >
              <div className="grid gap-2">
                {HELP_OPTIONS.map((opt) => (
                  <Toggle
                    key={opt.value}
                    active={helpKinds.includes(opt.value)}
                    onClick={() => toggleHelp(opt.value)}
                    label={opt.label}
                    sublabel={opt.hint}
                  />
                ))}
              </div>
              {helpKinds.length > 1 && (
                <p className="mt-3 text-[12.5px] text-brand-muted-600">
                  You picked {helpKinds.length}. We’ll pull in support for each.
                </p>
              )}
            </Question>
          )}

          {step === 'building' && (
            <BuildingScreen
              hardestCount={hardest.length}
              helpCount={helpKinds.length}
            />
          )}

          {/* Footer — only on real questions, not on the building screen. */}
          {progressIdx >= 0 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                disabled={stepIdx === 0}
                onClick={back}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold',
                  stepIdx === 0
                    ? 'cursor-not-allowed text-brand-muted-300'
                    : 'text-brand-muted-700 hover:bg-surface-subtle hover:text-brand-muted-900',
                )}
              >
                <ArrowLeft className="h-4 w-4" /> Back
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
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

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
      {hint && <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-muted-600">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Toggle({
  active,
  onClick,
  label,
  sublabel,
  icon,
  compact,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'group flex w-full items-center gap-3 rounded-2xl border-2 text-left text-[14px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        compact ? 'justify-center px-3 py-2.5' : 'px-4 py-3.5',
        active
          ? 'border-primary bg-primary/5 text-brand-navy-700'
          : 'border-surface-border bg-white text-brand-muted-700 hover:border-primary/40 hover:bg-primary/5',
      )}
    >
      {icon && !compact && (
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition',
            active ? 'bg-primary text-white' : 'bg-brand-warm-100 text-brand-muted-600 group-hover:bg-primary/10 group-hover:text-primary',
          )}
        >
          {icon}
        </span>
      )}
      <span className={cn('flex-1', compact ? 'text-center' : '')}>
        <span className="block leading-tight">{label}</span>
        {sublabel && (
          <span className="mt-0.5 block text-[12.5px] font-medium text-brand-muted-500">
            {sublabel}
          </span>
        )}
      </span>
      {!compact && (
        <Check className={cn('h-4 w-4 shrink-0 text-primary transition-opacity', active ? 'opacity-100' : 'opacity-0')} />
      )}
    </button>
  );
}

function BuildingScreen({
  hardestCount,
  helpCount,
}: {
  hardestCount: number;
  helpCount: number;
}) {
  const lines: string[] = [];
  if (hardestCount > 1) lines.push(`Weighing ${hardestCount} things at once.`);
  if (helpCount > 1) lines.push('Pulling in support for everything you picked.');
  if (lines.length === 0) lines.push('Sorting the pieces into one short list.');

  return (
    <div className="py-10 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
        <Sparkles className="h-6 w-6 text-primary animate-pulse" aria-hidden />
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-brand-navy-700">Building your plan</h1>
      <ul className="mt-4 space-y-1.5 text-[14px] leading-relaxed text-brand-muted-700">
        {lines.map((l) => (
          <li key={l} className="inline-flex items-center gap-2">
            <Compass className="h-3.5 w-3.5 text-primary" aria-hidden />
            <span>{l}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[13px] text-brand-muted-500">One moment.</p>
    </div>
  );
}
