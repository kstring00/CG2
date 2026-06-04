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
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  saveCarePlan,
  type ChildAge,
  type Hardest,
  type HelpKind,
  type Stage,
  type WeekMood,
} from '@/lib/carePlanStorage';
import { ensurePlanStarted } from '@/lib/weeklyCheckIn';
import { markWeeklyIntakeDone, resetWeeklyProgress } from '@/lib/weeklyProgress';
import {
  generateNextSteps,
  generateNoteEchoes,
  generateResources,
  generateSummary,
  generateWeekMessage,
  HARDEST_OPTIONS,
  parseNotes,
} from '@/lib/generateNextSteps';
import JourneyStepper from '@/components/JourneyStepper';
import { inferJourneyStage } from '@/lib/journeyStage';
import BandwidthCheck from '@/components/BandwidthCheck';
import { loadBandwidth, type BandwidthResult } from '@/lib/bandwidth';

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

const AGE_OPTIONS: { value: ChildAge; label: string }[] = [
  { value: '0-2', label: '0–2' },
  { value: '2-5', label: '2–5' },
  { value: '6-12', label: '6–12' },
  { value: '13-17', label: '13–17' },
];

type HelpOption = { value: HelpKind; label: string; hint: string };
const HELP_OPTIONS: HelpOption[] = [
  { value: 'practical-info', label: 'Practical info', hint: 'Guides, strategies, and how-to.' },
  { value: 'local-providers', label: 'Local providers', hint: 'Names, locations, and waitlists near you.' },
  { value: 'someone-to-talk-to', label: 'Someone to talk to', hint: 'A parent who gets it, on your timing.' },
  { value: 'time-for-me', label: 'Time for me', hint: 'Your own breathing room — the parent side.' },
  { value: 'not-sure', label: 'Not sure yet', hint: 'That’s a real answer. We’ll show you a gentle starting point.' },
];

type MoodOption = { value: WeekMood; label: string; swatch: string; ring: string };
const MOOD_OPTIONS: MoodOption[] = [
  { value: 'frayed', label: 'Frayed', swatch: 'bg-brand-red-300', ring: 'ring-brand-red-400' },
  { value: 'heavy', label: 'Heavy', swatch: 'bg-brand-navy-300', ring: 'ring-brand-navy-500' },
  { value: 'numb', label: 'Numb', swatch: 'bg-brand-muted-300', ring: 'ring-brand-muted-500' },
  { value: 'steady', label: 'Steady', swatch: 'bg-brand-plum-200', ring: 'ring-brand-plum-400' },
  { value: 'hopeful', label: 'Hopeful', swatch: 'bg-brand-burgundy-200', ring: 'ring-brand-burgundy-300' },
];

const STAGE_LABEL = Object.fromEntries(STAGE_OPTIONS.map((o) => [o.value, o.label])) as Record<Stage, string>;
const HELP_LABEL = Object.fromEntries(HELP_OPTIONS.map((o) => [o.value, o.label])) as Record<HelpKind, string>;
const MOOD_LABEL = Object.fromEntries(MOOD_OPTIONS.map((o) => [o.value, o.label])) as Record<WeekMood, string>;
const HARDEST_LABEL = Object.fromEntries(HARDEST_OPTIONS.map((o) => [o.value, o.label])) as Record<Hardest, string>;

// ---------------------------------------------------------------------------
// Step model — questions plus short "we hear you" interstitials in between
// ---------------------------------------------------------------------------

type StepKind =
  | 'q-hardest'
  | 'r-hardest'
  | 'q-stage'
  | 'q-age'
  | 'q-help'
  | 'q-mood'
  | 'r-mood'
  | 'q-bandwidth'
  | 'q-notes'
  | 'building';

// Bandwidth check is inserted right before the freeform notes step. The plan
// is then sized to match the parent's actual capacity — see generateNextSteps.
const STEP_ORDER: StepKind[] = [
  'q-hardest',
  'r-hardest',
  'q-stage',
  'q-age',
  'q-help',
  'q-mood',
  'r-mood',
  'q-bandwidth',
  'q-notes',
  'building',
];

// Steps that count toward the parent-facing progress bar (questions only).
const PROGRESS_STEPS: StepKind[] = [
  'q-hardest',
  'q-stage',
  'q-age',
  'q-help',
  'q-mood',
  'q-bandwidth',
  'q-notes',
];

// Per-step background hue — soft, not loud. The form feels like walking through rooms.
const STEP_HUE: Record<StepKind, string> = {
  'q-hardest': 'bg-brand-warm-50',
  'r-hardest': 'bg-brand-plum-50',
  'q-stage': 'bg-brand-warm-100',
  'q-age': 'bg-brand-warm-50',
  'q-help': 'bg-brand-warm-100',
  'q-mood': 'bg-brand-warm-50',
  'r-mood': 'bg-brand-plum-50',
  'q-bandwidth': 'bg-brand-plum-50',
  'q-notes': 'bg-brand-warm-100',
  'building': 'bg-brand-warm-50',
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function IntakePage() {
  const router = useRouter();

  const [stepIdx, setStepIdx] = useState(0);
  const [hardest, setHardest] = useState<Hardest[]>([]);
  const [stage, setStage] = useState<Stage | null>(null);
  const [childAge, setChildAge] = useState<ChildAge | null>(null);
  const [helpKind, setHelpKind] = useState<HelpKind | null>(null);
  const [weekMood, setWeekMood] = useState<WeekMood | null>(null);
  const [notes, setNotes] = useState('');
  // Bandwidth result — either freshly captured in the q-bandwidth step or
  // pre-loaded from a prior session so the parent isn't forced to redo it.
  const [bandwidth, setBandwidth] = useState<BandwidthResult | null>(null);
  useEffect(() => {
    const existing = loadBandwidth();
    if (existing) setBandwidth(existing);
  }, []);

  const step = STEP_ORDER[stepIdx];
  const progressIdx = PROGRESS_STEPS.indexOf(step);
  const progressTotal = PROGRESS_STEPS.length;

  const canAdvance = useMemo(() => {
    switch (step) {
      case 'q-hardest': return hardest.length > 0;
      case 'q-stage': return stage !== null;
      case 'q-age': return childAge !== null;
      case 'q-help': return helpKind !== null;
      case 'q-mood': return weekMood !== null;
      case 'q-bandwidth': return bandwidth !== null;
      case 'q-notes': return true; // optional
      default: return true; // interstitials and building auto-advance
    }
  }, [step, hardest, stage, childAge, helpKind, weekMood, bandwidth]);

  const next = () => setStepIdx((i) => Math.min(i + 1, STEP_ORDER.length - 1));
  const back = () => setStepIdx((i) => Math.max(i - 1, 0));

  const toggleHardest = (h: Hardest) => {
    setHardest((arr) => (arr.includes(h) ? arr.filter((x) => x !== h) : [...arr, h]));
  };

  // Build & save on 'building' step. Pass the bandwidth tier through so the
  // plan generator can size the priority steps to today's capacity.
  useEffect(() => {
    if (step !== 'building') return;
    const answers = { hardest, stage, childAge, helpKind, weekMood, notes: notes || null };
    saveCarePlan({
      answers,
      summary: generateSummary(answers),
      steps: generateNextSteps(answers, bandwidth?.tier),
      resources: generateResources(answers),
      weekMessage: generateWeekMessage(weekMood),
      noteEchoes: generateNoteEchoes(notes || null),
    });
    ensurePlanStarted();
    // Running intake regenerates the plan steps, so clear any per-step
    // progress from earlier in the week (the old hrefs are gone) and credit
    // the first notch for completing the intake/check-in flow.
    resetWeeklyProgress();
    markWeeklyIntakeDone();
    const t = window.setTimeout(() => router.push('/support/care-plan'), 1700);
    return () => window.clearTimeout(t);
  }, [step, hardest, stage, childAge, helpKind, weekMood, notes, bandwidth, router]);

  // Chip removers — let the parent edit a prior answer without going back step-by-step.
  const clearHardest = (h: Hardest) => setHardest((arr) => arr.filter((x) => x !== h));
  const clearStage = () => setStage(null);
  const clearAge = () => setChildAge(null);
  const clearHelp = () => setHelpKind(null);
  const clearMood = () => setWeekMood(null);

  const hasAnyAnswer = hardest.length > 0 || stage || childAge || helpKind || weekMood;

  return (
    <main className={cn('min-h-[calc(100vh-4rem)] transition-colors duration-500', STEP_HUE[step])}>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Soft "where am I?" anchor at the entry of the flow. Hidden once
            the parent is mid-question so it doesn't compete with the prompt. */}
        {step === 'q-hardest' && (
          <div className="mb-5">
            <JourneyStepper
              activeStage={inferJourneyStage({ hardest, stage, childAge, helpKind, weekMood })}
              compact
            />
          </div>
        )}
        <div className="rounded-3xl border border-surface-border bg-white p-6 shadow-soft sm:p-8">
          {/* Pinned summary chips — visible from step 2 onward */}
          {hasAnyAnswer && step !== 'building' && (
            <SummaryChips
              hardest={hardest}
              stage={stage}
              childAge={childAge}
              helpKind={helpKind}
              weekMood={weekMood}
              onClearHardest={clearHardest}
              onClearStage={clearStage}
              onClearAge={clearAge}
              onClearHelp={clearHelp}
              onClearMood={clearMood}
            />
          )}

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
          {step === 'q-hardest' && (
            <Question
              title="Let’s start where it hurts most."
              hint="Pick anything that fits — choose more than one. Each pick shapes your plan."
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

          {step === 'r-hardest' && (
            <Reflection
              eyebrow="We hear you."
              title={reflectionForHardest(hardest)}
              body="That’s a lot to carry. The next few questions help us match this plan to your week — not a general one."
              onContinue={next}
            />
          )}

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

          {step === 'q-age' && (
            <Question title="How old is your child?" hint="The plan changes a lot depending on age.">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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

          {step === 'q-help' && (
            <Question title="What would help most today?" hint="Pick the one that fits this week.">
              <div className="grid gap-2">
                {HELP_OPTIONS.map((opt) => (
                  <Toggle
                    key={opt.value}
                    active={helpKind === opt.value}
                    onClick={() => setHelpKind(opt.value)}
                    label={opt.label}
                    sublabel={opt.hint}
                  />
                ))}
              </div>
            </Question>
          )}

          {step === 'q-mood' && (
            <Question title="How are you doing this week?" hint="Honest beats polished.">
              <div className="grid grid-cols-5 gap-2">
                {MOOD_OPTIONS.map((opt) => (
                  <MoodSwatch
                    key={opt.value}
                    active={weekMood === opt.value}
                    onClick={() => setWeekMood(opt.value)}
                    label={opt.label}
                    swatch={opt.swatch}
                    ring={opt.ring}
                  />
                ))}
              </div>
            </Question>
          )}

          {step === 'r-mood' && (
            <Reflection
              eyebrow="Thanks for being honest."
              title={reflectionForMood(weekMood)}
              body="One more — totally optional — and then we’ll build your plan."
              onContinue={next}
            />
          )}

          {step === 'q-bandwidth' && (
            <BandwidthCheck
              initialInputs={bandwidth?.inputs}
              onComplete={(result) => {
                setBandwidth(result);
                next();
              }}
              submitLabel="Continue"
            />
          )}

          {step === 'q-notes' && (
            <Question
              title="Anything you want us to know?"
              hint="Optional. What you write here shapes your plan — keywords like sleep, IEP, insurance, meltdowns, or siblings pull in specific resources."
            >
              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="A sentence is enough. Example: We’re waiting on a diagnosis and my older child is struggling with the bedtime routine."
                className="w-full rounded-2xl border border-surface-border bg-white px-3 py-3 text-[14px] focus:border-primary focus:outline-none"
              />
              <NotesFeedback notes={notes} />
            </Question>
          )}

          {step === 'building' && (
            <BuildingScreen
              hardestCount={hardest.length}
              hasNotes={notes.trim().length > 0}
              moodIsHeavy={weekMood === 'frayed' || weekMood === 'heavy'}
            />
          )}

          {/* Footer — only on real questions, not on reflections or building */}
          {progressIdx >= 0 && step !== 'q-bandwidth' && (
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
                {step === 'q-notes' ? 'Build my plan' : 'Continue'} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Reflections — short validations between key questions
// ---------------------------------------------------------------------------

function reflectionForHardest(picks: Hardest[]): string {
  if (picks.length === 0) return 'We’ll start small.';
  if (picks.length === 1) {
    const only = picks[0];
    return `So ${HARDEST_LABEL[only].toLowerCase()} is what’s loudest right now.`;
  }
  if (picks.length === 2) {
    return `${HARDEST_LABEL[picks[0]]} and ${HARDEST_LABEL[picks[1]].toLowerCase()} — both are real, and both shape your plan.`;
  }
  return `That’s ${picks.length} hard things at once. We’ll order your plan so the heaviest one is first.`;
}

function reflectionForMood(mood: WeekMood | null): string {
  switch (mood) {
    case 'frayed':
      return 'Frayed weeks are real. We’ll make this lighter, not longer.';
    case 'heavy':
      return 'Heavy is a hard place to live from. Your plan will start with you.';
    case 'numb':
      return 'Numb is information too — not a flaw. Small first.';
    case 'steady':
      return 'Steady is worth marking. We’ll build on it gently.';
    case 'hopeful':
      return 'Hopeful is a good place to plan from. One small thing, on purpose.';
    default:
      return 'However this week feels, you’re in the right place.';
  }
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

function Reflection({
  eyebrow,
  title,
  body,
  onContinue,
}: {
  eyebrow: string;
  title: string;
  body: string;
  onContinue: () => void;
}) {
  return (
    <section className="py-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-plum-700">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold leading-snug text-brand-navy-700 sm:text-2xl">
        {title}
      </h2>
      <p className="mt-3 text-[14.5px] leading-relaxed text-brand-muted-700">{body}</p>
      <button
        type="button"
        onClick={onContinue}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
      >
        Keep going <ArrowRight className="h-4 w-4" />
      </button>
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

function MoodSwatch({
  active,
  onClick,
  label,
  swatch,
  ring,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  swatch: string;
  ring: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'group flex flex-col items-center gap-2 rounded-2xl border-2 px-2 py-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        active ? 'border-primary bg-primary/5' : 'border-surface-border bg-white hover:border-primary/40 hover:bg-primary/5',
      )}
    >
      <span
        className={cn(
          'h-7 w-7 rounded-full shadow-inner transition',
          swatch,
          active ? `ring-2 ring-offset-2 ${ring}` : '',
        )}
        aria-hidden
      />
      <span className={cn('text-[12.5px] font-semibold', active ? 'text-brand-navy-700' : 'text-brand-muted-700')}>
        {label}
      </span>
    </button>
  );
}

// Live feedback under the notes field — shows the parent that what they write matters.
function NotesFeedback({ notes }: { notes: string }) {
  const { echoes } = useMemo(() => parseNotes(notes), [notes]);
  const wordCount = notes.trim().length === 0 ? 0 : notes.trim().split(/\s+/).length;

  if (notes.trim().length === 0) {
    return (
      <p className="mt-2 text-[12.5px] text-brand-muted-500">
        The more you share, the more tailored your plan.
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <p className="text-[12.5px] text-brand-muted-600">
        <span className="font-semibold text-brand-navy-700">{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>{' '}
        — we’ll keep the parts that matter.
      </p>
      {echoes.length > 0 && (
        <div className="rounded-xl border border-brand-plum-200 bg-brand-plum-50/60 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
            What we’re picking up
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {echoes.map((e) => (
              <li
                key={e.phrase}
                className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-brand-plum-700 shadow-sm"
              >
                {e.phrase}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12.5px] leading-relaxed text-brand-plum-800">
            These keywords will pull specific steps and resources into your plan.
          </p>
        </div>
      )}
    </div>
  );
}

// Pinned, editable summary of answers so far.
function SummaryChips({
  hardest,
  stage,
  childAge,
  helpKind,
  weekMood,
  onClearHardest,
  onClearStage,
  onClearAge,
  onClearHelp,
  onClearMood,
}: {
  hardest: Hardest[];
  stage: Stage | null;
  childAge: ChildAge | null;
  helpKind: HelpKind | null;
  weekMood: WeekMood | null;
  onClearHardest: (h: Hardest) => void;
  onClearStage: () => void;
  onClearAge: () => void;
  onClearHelp: () => void;
  onClearMood: () => void;
}) {
  return (
    <div className="mb-5 rounded-2xl border border-brand-warm-200 bg-brand-warm-50/70 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-600">
        So far
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {hardest.map((h) => (
          <Chip key={h} label={HARDEST_LABEL[h]} onRemove={() => onClearHardest(h)} />
        ))}
        {stage && <Chip label={STAGE_LABEL[stage]} onRemove={onClearStage} />}
        {childAge && <Chip label={`Age ${childAge}`} onRemove={onClearAge} />}
        {helpKind && <Chip label={HELP_LABEL[helpKind]} onRemove={onClearHelp} />}
        {weekMood && <Chip label={`Feeling ${MOOD_LABEL[weekMood].toLowerCase()}`} onRemove={onClearMood} />}
      </ul>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-brand-navy-700 shadow-sm ring-1 ring-surface-border">
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="rounded-full p-0.5 text-brand-muted-400 transition hover:bg-surface-subtle hover:text-brand-muted-800"
      >
        <X className="h-3 w-3" />
      </button>
    </li>
  );
}

function BuildingScreen({
  hardestCount,
  hasNotes,
  moodIsHeavy,
}: {
  hardestCount: number;
  hasNotes: boolean;
  moodIsHeavy: boolean;
}) {
  const lines: string[] = [];
  if (hardestCount > 1) lines.push(`Weighing ${hardestCount} things at once.`);
  if (moodIsHeavy) lines.push('Starting your plan with you, not a task list.');
  if (hasNotes) lines.push('Reading what you wrote — pulling in what matters.');
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

