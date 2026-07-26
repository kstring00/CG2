'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
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
  LoaderCircle,
  Pencil,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  clearCarePlanDraft,
  loadCarePlanDraft,
  saveCarePlan,
  saveCarePlanDraft,
  type CoverageStatus,
  type Hardest,
  type HelpKind,
  type Stage,
} from '@/lib/carePlanStorage';
import {
  getMissingIntakeFields,
  type IntakeInterpretation,
  type MissingIntakeField,
} from '@/lib/intakeInterpretation';
import { ensurePlanStarted } from '@/lib/weeklyCheckIn';
import { markWeeklyIntakeDone, resetWeeklyProgress } from '@/lib/weeklyProgress';
import {
  generateNextSteps,
  generateResources,
  generateSummary,
  generateWeekMessage,
  HARDEST_OPTIONS,
} from '@/lib/generateNextSteps';

const HARDEST_ICONS: Record<Hardest, React.ComponentType<{ className?: string }>> = {
  'understanding-aba': Brain,
  'behavior-home': Home,
  overwhelmed: Heart,
  'finding-resources': Search,
  'financial-insurance': DollarSign,
  siblings: Users,
  'connecting-parents': HeartHandshake,
  'school-iep': GraduationCap,
};

const HARDEST_LABELS: Record<Hardest, string> = Object.fromEntries(
  HARDEST_OPTIONS.map((option) => [option.value, option.label]),
) as Record<Hardest, string>;

type CoverageOption = { value: CoverageStatus; label: string; hint: string };
const COVERAGE_OPTIONS: CoverageOption[] = [
  {
    value: 'private-insurance',
    label: 'Private insurance',
    hint: 'Employer plan, marketplace, or other commercial coverage.',
  },
  {
    value: 'medicaid-waiver',
    label: 'Medicaid, CHIP, or waiver',
    hint: 'Already enrolled or working toward Texas Medicaid or waiver lists.',
  },
  {
    value: 'uninsured-self-pay',
    label: 'No insurance / paying out of pocket',
    hint: 'Grants, sliding scale, school services, and nonprofit help.',
  },
  {
    value: 'not-sure',
    label: 'Not sure yet',
    hint: 'We will keep every approved payment path available.',
  },
];

const COVERAGE_LABELS = Object.fromEntries(
  COVERAGE_OPTIONS.map((option) => [option.value, option.label]),
) as Record<CoverageStatus, string>;

type StageOption = { value: Stage; label: string; hint: string };
const STAGE_OPTIONS: StageOption[] = [
  {
    value: 'newly-diagnosed',
    label: 'Newly diagnosed',
    hint: 'A name was just given to something you have been seeing.',
  },
  {
    value: 'waiting-diagnosis',
    label: 'Waiting on a diagnosis',
    hint: 'In the in-between — appointments and questions.',
  },
  { value: 'in-aba', label: 'In ABA already', hint: 'Therapy is part of your routine.' },
  {
    value: 'looking-for-aba',
    label: 'Looking for ABA',
    hint: 'Comparing providers or navigating waitlists.',
  },
  {
    value: 'past-aba',
    label: 'Past ABA, parenting onward',
    hint: 'Building the next chapter for your family.',
  },
];

const STAGE_LABELS = Object.fromEntries(
  STAGE_OPTIONS.map((option) => [option.value, option.label]),
) as Record<Stage, string>;

type HelpOption = { value: HelpKind; label: string; hint: string };
const HELP_OPTIONS: HelpOption[] = [
  { value: 'practical-info', label: 'Practical information', hint: 'Guides, strategies, and how-to help.' },
  { value: 'local-providers', label: 'Local providers', hint: 'Names, locations, admissions, and waitlists.' },
  { value: 'someone-to-talk-to', label: 'Someone to talk to', hint: 'Parent connection and human support.' },
  { value: 'time-for-me', label: 'Support for me', hint: 'Caregiver mental health and breathing room.' },
  { value: 'not-sure', label: 'Not sure yet', hint: 'A gentle starting point while you sort it out.' },
];

const HELP_LABELS = Object.fromEntries(
  HELP_OPTIONS.map((option) => [option.value, option.label]),
) as Record<HelpKind, string>;

type StepKind =
  | 'q-stage'
  | 'q-hardest'
  | 'q-context'
  | 'interpreting'
  | 'review'
  | 'human-support'
  | 'q-coverage'
  | 'q-other-children'
  | 'q-partner'
  | 'q-help'
  | 'building';

const REQUIRED_FIELD_STEP: Record<MissingIntakeField, StepKind> = {
  coverageStatus: 'q-coverage',
  hasOtherChildren: 'q-other-children',
  hasPartner: 'q-partner',
  helpKinds: 'q-help',
};

const FIXED_STEP_ORDER: StepKind[] = [
  'q-coverage',
  'q-other-children',
  'q-partner',
  'q-help',
];

const STEP_HUE: Record<StepKind, string> = {
  'q-stage': 'bg-brand-warm-50',
  'q-hardest': 'bg-brand-warm-100',
  'q-context': 'bg-brand-warm-50',
  interpreting: 'bg-brand-warm-50',
  review: 'bg-brand-warm-50',
  'human-support': 'bg-brand-warm-50',
  'q-coverage': 'bg-brand-warm-50',
  'q-other-children': 'bg-brand-warm-50',
  'q-partner': 'bg-brand-warm-50',
  'q-help': 'bg-brand-warm-100',
  building: 'bg-brand-warm-50',
};

const PROGRESS: Partial<Record<StepKind, { current: number; total: number; label: string }>> = {
  'q-stage': { current: 1, total: 4, label: 'Your family’s position' },
  'q-hardest': { current: 2, total: 4, label: 'Your concerns' },
  'q-context': { current: 3, total: 4, label: 'What is happening' },
  review: { current: 4, total: 4, label: 'Confirm our understanding' },
};

function nextMissingStep(
  coverageStatus: CoverageStatus | null,
  hasOtherChildren: boolean | null,
  hasPartner: boolean | null,
  helpKinds: HelpKind[],
  after?: StepKind,
): StepKind | null {
  const missing: StepKind[] = [];
  if (!coverageStatus) missing.push('q-coverage');
  if (hasOtherChildren === null) missing.push('q-other-children');
  if (hasPartner === null) missing.push('q-partner');
  if (helpKinds.length === 0) missing.push('q-help');

  if (!after) return missing[0] ?? null;
  const afterIndex = FIXED_STEP_ORDER.indexOf(after);
  return missing.find((candidate) => FIXED_STEP_ORDER.indexOf(candidate) > afterIndex) ?? null;
}

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState<StepKind>('q-stage');
  const [stage, setStage] = useState<Stage | null>(null);
  const [hardest, setHardest] = useState<Hardest[]>([]);
  const [parentContext, setParentContext] = useState('');
  const [interpretation, setInterpretation] = useState<IntakeInterpretation | null>(null);
  const [coverageStatus, setCoverageStatus] = useState<CoverageStatus | null>(null);
  const [hasOtherChildren, setHasOtherChildren] = useState<boolean | null>(null);
  const [hasPartner, setHasPartner] = useState<boolean | null>(null);
  const [helpKinds, setHelpKinds] = useState<HelpKind[]>([]);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const draft = loadCarePlanDraft();
    if (draft) {
      if (draft.stage) setStage(draft.stage);
      if (Array.isArray(draft.hardest)) setHardest(draft.hardest);
      if (typeof draft.notes === 'string') setParentContext(draft.notes);
      if (draft.coverageStatus) setCoverageStatus(draft.coverageStatus);
      if (typeof draft.hasOtherChildren === 'boolean') setHasOtherChildren(draft.hasOtherChildren);
      if (typeof draft.hasPartner === 'boolean') setHasPartner(draft.hasPartner);
      if (Array.isArray(draft.helpKinds)) setHelpKinds(draft.helpKinds);
    }
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    saveCarePlanDraft({
      stage,
      hardest,
      notes: parentContext,
      coverageStatus,
      hasOtherChildren,
      hasPartner,
      helpKinds,
    });
  }, [
    draftLoaded,
    stage,
    hardest,
    parentContext,
    coverageStatus,
    hasOtherChildren,
    hasPartner,
    helpKinds,
  ]);

  const progress = PROGRESS[step];

  const canAdvance = useMemo(() => {
    switch (step) {
      case 'q-stage':
        return stage !== null;
      case 'q-hardest':
        return hardest.length > 0;
      case 'q-context':
        return parentContext.trim().length >= 20;
      case 'q-coverage':
        return coverageStatus !== null;
      case 'q-other-children':
        return hasOtherChildren !== null;
      case 'q-partner':
        return hasPartner !== null;
      case 'q-help':
        return helpKinds.length > 0;
      default:
        return false;
    }
  }, [step, stage, hardest, parentContext, coverageStatus, hasOtherChildren, hasPartner, helpKinds]);

  const toggleHardest = (value: Hardest) => {
    setHardest((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const toggleHelp = (value: HelpKind) => {
    setHelpKinds((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const runInterpretation = async () => {
    if (!stage || hardest.length === 0 || parentContext.trim().length < 20) return;
    setError(null);
    setStep('interpreting');

    try {
      const response = await fetch('/api/support/intake/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, hardest, parentContext }),
      });
      const payload = (await response.json()) as IntakeInterpretation | { error?: string };
      if (!response.ok || !('summary' in payload)) {
        throw new Error('error' in payload && payload.error ? payload.error : 'We could not organize that yet.');
      }

      setInterpretation(payload);
      setCoverageStatus((current) => current ?? payload.coverageStatus);
      setHasOtherChildren((current) =>
        current === null ? payload.hasOtherChildren : current,
      );
      setHasPartner((current) => (current === null ? payload.hasPartner : current));
      setHelpKinds((current) => (current.length ? current : payload.helpKinds));
      setStep(payload.requiresHumanSupport ? 'human-support' : 'review');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Please try again.');
      setStep('q-context');
    }
  };

  const confirmInterpretation = () => {
    if (!interpretation) return;
    const missing = getMissingIntakeFields({
      ...interpretation,
      coverageStatus,
      hasOtherChildren,
      hasPartner,
      helpKinds,
    });
    const nextStep = missing.length ? REQUIRED_FIELD_STEP[missing[0]] : null;
    setStep(nextStep ?? 'building');
  };

  const editContext = () => {
    setInterpretation(null);
    setCoverageStatus(null);
    setHasOtherChildren(null);
    setHasPartner(null);
    setHelpKinds([]);
    setError(null);
    setStep('q-context');
  };

  const continueFromFixedQuestion = () => {
    const nextStep = nextMissingStep(
      coverageStatus,
      hasOtherChildren,
      hasPartner,
      helpKinds,
      step,
    );
    setStep(nextStep ?? 'building');
  };

  useEffect(() => {
    if (step !== 'building' || !stage) return;

    const answers = {
      hardest,
      stage,
      coverageStatus,
      hasOtherChildren,
      hasPartner,
      helpKinds,
      notes: parentContext,
      support: interpretation?.currentBarrier ?? null,
      confidence: interpretation?.whatAlreadyTried ?? null,
      easier: interpretation?.desiredOutcome ?? null,
      connected: interpretation?.source ?? null,
    };

    saveCarePlan({
      answers,
      summary: generateSummary(answers),
      steps: generateNextSteps(answers),
      resources: generateResources(answers),
      weekMessage: generateWeekMessage(null),
    });
    ensurePlanStarted();
    resetWeeklyProgress();
    markWeeklyIntakeDone();
    clearCarePlanDraft();

    const timeout = window.setTimeout(() => router.push('/support/care-plan'), 1500);
    return () => window.clearTimeout(timeout);
  }, [
    step,
    stage,
    hardest,
    coverageStatus,
    hasOtherChildren,
    hasPartner,
    helpKinds,
    parentContext,
    interpretation,
    router,
  ]);

  const goBack = () => {
    setError(null);
    switch (step) {
      case 'q-hardest':
        setStep('q-stage');
        break;
      case 'q-context':
        setStep('q-hardest');
        break;
      case 'q-coverage':
      case 'q-other-children':
      case 'q-partner':
      case 'q-help':
        setStep('review');
        break;
      default:
        break;
    }
  };

  const continueQuestion = () => {
    if (!canAdvance) return;
    switch (step) {
      case 'q-stage':
        setStep('q-hardest');
        break;
      case 'q-hardest':
        setStep('q-context');
        break;
      case 'q-context':
        void runInterpretation();
        break;
      case 'q-coverage':
      case 'q-other-children':
      case 'q-partner':
      case 'q-help':
        continueFromFixedQuestion();
        break;
      default:
        break;
    }
  };

  const showQuestionFooter = [
    'q-stage',
    'q-hardest',
    'q-context',
    'q-coverage',
    'q-other-children',
    'q-partner',
    'q-help',
  ].includes(step);

  return (
    <main className={cn('min-h-[calc(100vh-4rem)] transition-colors duration-500', STEP_HUE[step])}>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-3xl border border-surface-border bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-plum-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
              <Sparkles className="h-3.5 w-3.5" /> Find My Next Step
            </p>
            <p className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-brand-muted-500">
              <ShieldCheck className="h-3.5 w-3.5" /> Recommendations stay inside Common Ground
            </p>
          </div>

          {progress && (
            <header className="mb-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {progress.label}
                </p>
                <p className="text-[11px] font-medium tabular-nums text-brand-muted-500">
                  {progress.current} of {progress.total}
                </p>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </header>
          )}

          {step === 'q-stage' && (
            <Question title="Where are you in this right now?" hint="Choose the position that best describes your family today.">
              <div className="grid gap-2">
                {STAGE_OPTIONS.map((option) => (
                  <Toggle
                    key={option.value}
                    active={stage === option.value}
                    onClick={() => setStage(option.value)}
                    label={option.label}
                    sublabel={option.hint}
                  />
                ))}
              </div>
            </Question>
          )}

          {step === 'q-hardest' && (
            <Question
              title="What feels hardest right now?"
              hint="Choose everything that fits. These approved categories set the boundaries for your plan."
            >
              <div className="grid gap-2">
                {HARDEST_OPTIONS.map((option) => {
                  const Icon = HARDEST_ICONS[option.value];
                  return (
                    <Toggle
                      key={option.value}
                      active={hardest.includes(option.value)}
                      onClick={() => toggleHardest(option.value)}
                      label={option.label}
                      icon={<Icon className="h-4 w-4" />}
                    />
                  );
                })}
              </div>
              {hardest.length > 1 && (
                <p className="mt-3 text-[12.5px] text-brand-muted-600">
                  You selected {hardest.length} concerns. One will guide the main plan and the others can remain alongside it.
                </p>
              )}
            </Question>
          )}

          {step === 'q-context' && (
            <Question
              title="Tell us more about what is happening."
              hint="Share what feels confusing, what you have already tried, and what you hope to do next."
            >
              <textarea
                value={parentContext}
                onChange={(event) => setParentContext(event.target.value.slice(0, 2000))}
                rows={8}
                placeholder="For example: We completed intake and sent our insurance information, but we have not heard whether authorization was submitted. I am not sure who to contact next."
                className="w-full resize-none rounded-2xl border-2 border-surface-border bg-white px-4 py-3.5 text-[14px] leading-relaxed text-brand-navy-700 outline-none transition placeholder:text-brand-muted-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <div className="mt-2 flex items-start justify-between gap-3">
                <p className="max-w-lg text-[11.5px] leading-relaxed text-brand-muted-500">
                  AI organizes your words into approved intake fields. It does not diagnose, create treatment advice, or invent resources.
                </p>
                <span className="shrink-0 text-[11px] tabular-nums text-brand-muted-400">
                  {parentContext.length}/2000
                </span>
              </div>
              {error && (
                <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-800">
                  {error}
                </p>
              )}
            </Question>
          )}

          {step === 'interpreting' && <InterpretingScreen />}

          {step === 'review' && interpretation && stage && (
            <ReviewScreen
              interpretation={interpretation}
              stage={stage}
              hardest={hardest}
              coverageStatus={coverageStatus}
              hasOtherChildren={hasOtherChildren}
              hasPartner={hasPartner}
              helpKinds={helpKinds}
              onEdit={editContext}
              onConfirm={confirmInterpretation}
            />
          )}

          {step === 'human-support' && interpretation && (
            <HumanSupportScreen reason={interpretation.humanSupportReason} onEdit={editContext} />
          )}

          {step === 'q-coverage' && (
            <Question
              title="How is care paid for right now?"
              hint="We could not confirm this from what you wrote, so we are asking the approved site question."
            >
              <div className="grid gap-2">
                {COVERAGE_OPTIONS.map((option) => (
                  <Toggle
                    key={option.value}
                    active={coverageStatus === option.value}
                    onClick={() => setCoverageStatus(option.value)}
                    label={option.label}
                    sublabel={option.hint}
                  />
                ))}
              </div>
            </Question>
          )}

          {step === 'q-other-children' && (
            <Question
              title="Do you have other children?"
              hint="This decides whether sibling support should appear alongside your main plan."
            >
              <div className="grid grid-cols-2 gap-2">
                <Toggle active={hasOtherChildren === true} onClick={() => setHasOtherChildren(true)} label="Yes" compact />
                <Toggle active={hasOtherChildren === false} onClick={() => setHasOtherChildren(false)} label="No" compact />
              </div>
            </Question>
          )}

          {step === 'q-partner' && (
            <Question
              title="Are you parenting with a partner?"
              hint="This personalizes optional support alongside the plan. It never gates your recommendations."
            >
              <div className="grid grid-cols-2 gap-2">
                <Toggle active={hasPartner === true} onClick={() => setHasPartner(true)} label="Yes" compact />
                <Toggle active={hasPartner === false} onClick={() => setHasPartner(false)} label="No" compact />
              </div>
            </Question>
          )}

          {step === 'q-help' && (
            <Question
              title="What kind of help would be most useful?"
              hint="We could not confirm this from your description. Choose as many as apply."
            >
              <div className="grid gap-2">
                {HELP_OPTIONS.map((option) => (
                  <Toggle
                    key={option.value}
                    active={helpKinds.includes(option.value)}
                    onClick={() => toggleHelp(option.value)}
                    label={option.label}
                    sublabel={option.hint}
                  />
                ))}
              </div>
            </Question>
          )}

          {step === 'building' && <BuildingScreen />}

          {showQuestionFooter && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                disabled={step === 'q-stage'}
                onClick={goBack}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold',
                  step === 'q-stage'
                    ? 'cursor-not-allowed text-brand-muted-300'
                    : 'text-brand-muted-700 hover:bg-surface-subtle hover:text-brand-muted-900',
                )}
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                disabled={!canAdvance}
                onClick={continueQuestion}
                className={cn(
                  'inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition',
                  canAdvance ? 'bg-primary hover:bg-primary/90' : 'cursor-not-allowed bg-stone-300',
                )}
              >
                {step === 'q-context' ? 'Organize my answers' : 'Continue'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
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
            active
              ? 'bg-primary text-white'
              : 'bg-brand-warm-100 text-brand-muted-600 group-hover:bg-primary/10 group-hover:text-primary',
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

function InterpretingScreen() {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <LoaderCircle className="h-7 w-7 animate-spin" aria-hidden />
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-brand-navy-700">Organizing what you shared</h1>
      <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-brand-muted-600">
        We are mapping your words into approved Common Ground fields. No recommendation is being created yet.
      </p>
      <div className="mx-auto mt-5 max-w-sm rounded-2xl border border-brand-plum-100 bg-brand-plum-50/60 px-4 py-3 text-left text-[12.5px] leading-relaxed text-brand-muted-700">
        <p className="font-semibold text-brand-plum-800">The boundary</p>
        <p className="mt-1">AI may interpret the intake. Common Ground’s rules and approved site content determine the plan.</p>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="rounded-2xl border border-surface-border bg-white px-4 py-3">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.15em] text-brand-muted-500">{label}</p>
      <p className="mt-1 text-[13.5px] leading-relaxed text-brand-navy-700">{value}</p>
    </div>
  );
}

function ReviewScreen({
  interpretation,
  stage,
  hardest,
  coverageStatus,
  hasOtherChildren,
  hasPartner,
  helpKinds,
  onEdit,
  onConfirm,
}: {
  interpretation: IntakeInterpretation;
  stage: Stage;
  hardest: Hardest[];
  coverageStatus: CoverageStatus | null;
  hasOtherChildren: boolean | null;
  hasPartner: boolean | null;
  helpKinds: HelpKind[];
  onEdit: () => void;
  onConfirm: () => void;
}) {
  const missingCount = [
    coverageStatus === null,
    hasOtherChildren === null,
    hasPartner === null,
    helpKinds.length === 0,
  ].filter(Boolean).length;

  return (
    <section>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold leading-snug text-brand-navy-700">What we understood</h1>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-muted-600">
            Confirm this before Common Ground chooses an approved pathway.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Your situation</p>
        <p className="mt-2 text-[15px] leading-relaxed text-brand-navy-700">{interpretation.summary}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <SummaryItem label="Already tried" value={interpretation.whatAlreadyTried} />
        <SummaryItem label="Current barrier" value={interpretation.currentBarrier} />
        <SummaryItem label="Desired outcome" value={interpretation.desiredOutcome} />
      </div>

      <div className="mt-5 rounded-2xl border border-surface-border bg-surface-muted/30 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">Structured intake</p>
        <dl className="mt-3 space-y-3 text-[13px]">
          <ReviewRow label="Journey position" value={STAGE_LABELS[stage]} />
          <ReviewRow label="Primary concerns" value={hardest.map((item) => HARDEST_LABELS[item]).join(' · ')} />
          <ReviewRow label="Paying for care" value={coverageStatus ? COVERAGE_LABELS[coverageStatus] : 'We still need to ask'} muted={!coverageStatus} />
          <ReviewRow label="Other children" value={hasOtherChildren === null ? 'We still need to ask' : hasOtherChildren ? 'Yes' : 'No'} muted={hasOtherChildren === null} />
          <ReviewRow label="Parenting with a partner" value={hasPartner === null ? 'We still need to ask' : hasPartner ? 'Yes' : 'No'} muted={hasPartner === null} />
          <ReviewRow label="Helpful support" value={helpKinds.length ? helpKinds.map((item) => HELP_LABELS[item]).join(' · ') : 'We still need to ask'} muted={helpKinds.length === 0} />
        </dl>
      </div>

      {missingCount > 0 && (
        <p className="mt-3 text-[12px] leading-relaxed text-brand-muted-500">
          After you confirm, the site will ask {missingCount === 1 ? 'one fixed question' : `${missingCount} fixed questions`} for details that were not clearly stated. AI will not invent them.
        </p>
      )}

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-muted-700 hover:bg-surface-subtle"
        >
          <Pencil className="h-4 w-4" /> Something is missing or incorrect
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          Yes, continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function ReviewRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="grid gap-1 border-b border-surface-border pb-3 last:border-0 last:pb-0 sm:grid-cols-[150px_1fr] sm:gap-4">
      <dt className="font-semibold text-brand-muted-600">{label}</dt>
      <dd className={cn('leading-relaxed', muted ? 'italic text-brand-muted-400' : 'text-brand-navy-700')}>{value}</dd>
    </div>
  );
}

function HumanSupportScreen({ reason, onEdit }: { reason: string | null; onEdit: () => void }) {
  return (
    <section className="py-3">
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-brand-navy-700">This needs a person, not a self-guided plan</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-700">
          {reason || 'What you shared may involve an immediate safety concern that Common Ground should not route automatically.'}
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-brand-muted-600">
          Use <strong>Talk to someone now</strong> at the top of the site. If anyone is in immediate danger, contact emergency services.
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-muted-700 hover:bg-surface-subtle"
      >
        <ArrowLeft className="h-4 w-4" /> Edit what I wrote
      </button>
    </section>
  );
}

function BuildingScreen() {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Compass className="h-7 w-7 animate-pulse text-primary" aria-hidden />
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-brand-navy-700">Building your approved plan</h1>
      <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-brand-muted-600">
        Common Ground is matching your confirmed intake to site-approved steps, tools, and resources.
      </p>
      <div className="mx-auto mt-5 max-w-sm rounded-2xl border border-brand-plum-100 bg-brand-plum-50/60 px-4 py-3 text-[12.5px] leading-relaxed text-brand-muted-700">
        AI organized the intake. The site’s deterministic recommendation rules are creating the output.
      </div>
    </div>
  );
}
