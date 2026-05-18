'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  computeWeekNumber,
  loadCheckInState,
  recordCheckIn,
  type ChildProgress,
  type ParentConfidence,
  type ParentStress,
  type ResourceNeed,
  type TriedSteps,
  type WeeklyCheckInAnswers,
} from '@/lib/weeklyCheckIn';
import {
  nextStepsForCheckIn,
  resourceLinksForCheckIn,
  summarizeCheckIn,
} from '@/lib/weeklyCheckInSummary';
import { loadCarePlan } from '@/lib/carePlanStorage';
import type { WeekMood } from '@/lib/carePlanStorage';
import { markWeeklyIntakeDone } from '@/lib/weeklyProgress';

const STRESS_OPTIONS: { value: ParentStress; label: string; hint: string }[] = [
  { value: 'low', label: 'Low', hint: 'Mostly steady this week.' },
  { value: 'moderate', label: 'Moderate', hint: 'Some hard moments, some good.' },
  { value: 'high', label: 'High', hint: 'Heavy. Carrying a lot.' },
  { value: 'overwhelmed', label: 'Overwhelmed', hint: 'Past the edge of what fits.' },
];

const CONFIDENCE_OPTIONS: { value: ParentConfidence; label: string; hint: string }[] = [
  { value: 'shaky', label: 'Shaky', hint: 'Not sure the plan fits right now.' },
  { value: 'mixed', label: 'Mixed', hint: 'Parts fit, parts don’t.' },
  { value: 'steady', label: 'Steady', hint: 'It feels like the right direction.' },
  { value: 'strong', label: 'Strong', hint: 'I’ve got this, this week.' },
];

const PROGRESS_OPTIONS: { value: ChildProgress; label: string; hint: string }[] = [
  { value: 'harder', label: 'Harder', hint: 'More tough moments than usual.' },
  { value: 'about-same', label: 'About the same', hint: 'Steady — nothing big shifted.' },
  { value: 'small-wins', label: 'Small wins', hint: 'A few moments I want to remember.' },
  { value: 'real-progress', label: 'Real progress', hint: 'Something clearly clicked.' },
];

const TRIED_OPTIONS: { value: TriedSteps; label: string; hint: string }[] = [
  { value: 'all', label: 'All of them', hint: 'Worked through every step.' },
  { value: 'some', label: 'Some', hint: 'A few — life got busy for the rest.' },
  { value: 'none', label: 'None', hint: 'This week wasn’t the week. That’s okay.' },
  { value: 'not-sure', label: 'Not sure', hint: 'Honestly, it’s a blur.' },
];

const RESOURCE_OPTIONS: { value: ResourceNeed; label: string }[] = [
  { value: 'practical-info', label: 'Practical info' },
  { value: 'local-providers', label: 'Local providers' },
  { value: 'someone-to-talk-to', label: 'Someone to talk to' },
  { value: 'time-for-me', label: 'Time for me' },
  { value: 'school-iep', label: 'School / IEP help' },
  { value: 'financial', label: 'Financial / insurance' },
  { value: 'sleep-sensory', label: 'Sleep & sensory' },
  { value: 'nothing-right-now', label: 'Nothing right now — just space' },
];

const MOOD_OPTIONS: { value: WeekMood; label: string; swatch: string }[] = [
  { value: 'frayed', label: 'Frayed', swatch: 'bg-brand-red-300' },
  { value: 'heavy', label: 'Heavy', swatch: 'bg-brand-navy-300' },
  { value: 'numb', label: 'Numb', swatch: 'bg-brand-muted-300' },
  { value: 'steady', label: 'Steady', swatch: 'bg-brand-plum-200' },
  { value: 'hopeful', label: 'Hopeful', swatch: 'bg-brand-burgundy-200' },
];

type Step = 'stress' | 'confidence' | 'progress' | 'tried' | 'resources' | 'mood' | 'notes' | 'done';
const STEP_ORDER: Step[] = ['stress', 'confidence', 'progress', 'tried', 'resources', 'mood', 'notes', 'done'];

export default function WeeklyCheckInPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [weekNumber, setWeekNumber] = useState(1);
  const [hasPlan, setHasPlan] = useState(false);

  const [stepIdx, setStepIdx] = useState(0);
  const step = STEP_ORDER[stepIdx];

  const [parentStress, setParentStress] = useState<ParentStress | null>(null);
  const [parentConfidence, setParentConfidence] = useState<ParentConfidence | null>(null);
  const [childProgress, setChildProgress] = useState<ChildProgress | null>(null);
  const [triedSteps, setTriedSteps] = useState<TriedSteps | null>(null);
  const [resourceNeeds, setResourceNeeds] = useState<ResourceNeed[]>([]);
  const [weekMood, setWeekMood] = useState<WeekMood | null>(null);
  const [newConcerns, setNewConcerns] = useState('');

  const [summary, setSummary] = useState<string | null>(null);
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [resourceLinks, setResourceLinks] = useState<{ label: string; href: string }[]>([]);

  useEffect(() => {
    setHydrated(true);
    const state = loadCheckInState();
    setWeekNumber(computeWeekNumber(state.planStartedAt));
    setHasPlan(Boolean(loadCarePlan()));
  }, []);

  const canAdvance = useMemo(() => {
    switch (step) {
      case 'stress': return Boolean(parentStress);
      case 'confidence': return Boolean(parentConfidence);
      case 'progress': return Boolean(childProgress);
      case 'tried': return Boolean(triedSteps);
      case 'resources': return resourceNeeds.length > 0;
      case 'mood': return true; // mood is optional
      case 'notes': return true; // notes are optional
      default: return false;
    }
  }, [step, parentStress, parentConfidence, childProgress, triedSteps, resourceNeeds, weekMood]);

  function advance() {
    if (step === 'notes') {
      if (!parentStress || !parentConfidence || !childProgress || !triedSteps) return;
      const answers: WeeklyCheckInAnswers = {
        parentStress,
        parentConfidence,
        childProgress,
        triedSteps,
        newConcerns: newConcerns.trim() || null,
        resourceNeeds,
        weekMood,
      };
      const sum = summarizeCheckIn(answers);
      const steps = nextStepsForCheckIn(answers);
      const links = resourceLinksForCheckIn(answers);
      recordCheckIn({
        weekNumber,
        answers,
        summary: sum,
        nextSteps: steps,
      });
      // Fill the first notch of this week's progress meter.
      markWeeklyIntakeDone();
      setSummary(sum);
      setNextSteps(steps);
      setResourceLinks(links);
      setStepIdx(STEP_ORDER.indexOf('done'));
      return;
    }
    setStepIdx((i) => Math.min(i + 1, STEP_ORDER.length - 1));
  }

  function back() {
    setStepIdx((i) => Math.max(i - 1, 0));
  }

  function toggleResource(r: ResourceNeed) {
    setResourceNeeds((prev) => {
      // "nothing right now" is exclusive
      if (r === 'nothing-right-now') {
        return prev.includes(r) ? [] : ['nothing-right-now'];
      }
      const without = prev.filter((x) => x !== 'nothing-right-now');
      return without.includes(r) ? without.filter((x) => x !== r) : [...without, r];
    });
  }

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="h-48 animate-pulse rounded-2xl bg-surface-subtle" />
      </main>
    );
  }

  if (!hasPlan && step !== 'done') {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-surface-border bg-white p-8 text-center shadow-soft">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-brand-navy-700">
            Let’s build your plan first.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-brand-muted-700">
            The weekly check-in updates your plan over time. We need a starting plan to update.
          </p>
          <Link
            href="/support/intake"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
          >
            Build my plan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  const totalQuestionSteps = STEP_ORDER.length - 1; // exclude 'done'
  const progress = Math.min(stepIdx + 1, totalQuestionSteps);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
          Weekly check-in · Week {weekNumber}
        </p>
        <h1 className="mt-1 text-2xl font-semibold leading-tight text-brand-navy-700 sm:text-3xl">
          How was your week, really?
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-brand-muted-700">
          A short pulse-check for both of you. We keep it on your device, and use it to refresh your next steps.
        </p>
      </header>

      <div className="rounded-3xl border border-surface-border bg-white p-6 shadow-soft sm:p-8">
        {step !== 'done' && (
          <div className="mb-5">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
              <span>
                Question {progress} of {totalQuestionSteps}
              </span>
              <Link
                href="/support/care-plan"
                className="font-medium normal-case tracking-normal text-brand-muted-500 hover:text-brand-muted-800"
              >
                Save for later
              </Link>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(progress / totalQuestionSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {step === 'stress' && (
          <Question
            label="How was your stress this week?"
            help="Parent first. There’s no wrong answer."
            options={STRESS_OPTIONS}
            value={parentStress}
            onSelect={setParentStress}
          />
        )}
        {step === 'confidence' && (
          <Question
            label="How confident are you in the plan right now?"
            help="A plan that doesn’t fit isn’t failing you — it’s asking to be adjusted."
            options={CONFIDENCE_OPTIONS}
            value={parentConfidence}
            onSelect={setParentConfidence}
          />
        )}
        {step === 'progress' && (
          <Question
            label="How did things go with your child?"
            help="The small wins count. So do the hard days."
            options={PROGRESS_OPTIONS}
            value={childProgress}
            onSelect={setChildProgress}
          />
        )}
        {step === 'tried' && (
          <Question
            label="Did you get to the recommended steps?"
            help="Honest answer is the useful one — we’ll adapt the plan either way."
            options={TRIED_OPTIONS}
            value={triedSteps}
            onSelect={setTriedSteps}
          />
        )}
        {step === 'resources' && (
          <fieldset>
            <legend className="text-lg font-semibold text-brand-navy-700">
              What would actually help right now?
            </legend>
            <p className="mt-1 text-[13.5px] text-brand-muted-600">
              Pick anything that fits. Or pick nothing — that’s a real answer too.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {RESOURCE_OPTIONS.map((opt) => {
                const selected = resourceNeeds.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleResource(opt.value)}
                    className={cn(
                      'rounded-2xl border px-4 py-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
                      selected
                        ? 'border-primary bg-primary/5 text-brand-navy-700'
                        : 'border-surface-border bg-white text-brand-muted-700 hover:border-stone-300',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {selected && <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden />}
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}
        {step === 'mood' && (
          <fieldset>
            <legend className="text-lg font-semibold text-brand-navy-700">
              A word for the week?
            </legend>
            <p className="mt-1 text-[13.5px] text-brand-muted-600">
              Optional — skip if nothing fits.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((opt) => {
                const selected = weekMood === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setWeekMood(selected ? null : opt.value)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
                      selected
                        ? 'border-primary bg-primary/5 text-brand-navy-700'
                        : 'border-surface-border bg-white text-brand-muted-700 hover:border-stone-300',
                    )}
                  >
                    <span className={cn('h-3 w-3 rounded-full', opt.swatch)} aria-hidden />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}
        {step === 'notes' && (
          <div>
            <label htmlFor="newConcerns" className="text-lg font-semibold text-brand-navy-700">
              Anything new on your mind?
            </label>
            <p className="mt-1 text-[13.5px] text-brand-muted-600">
              Optional. A sentence or two — only saved on this device.
            </p>
            <textarea
              id="newConcerns"
              value={newConcerns}
              onChange={(e) => setNewConcerns(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="A new question, something different this week, something you want to bring up next time…"
              className="mt-3 w-full rounded-2xl border border-surface-border bg-white p-4 text-[14.5px] leading-relaxed text-brand-muted-800 shadow-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="mt-1 text-[12px] text-brand-muted-500">{newConcerns.length} / 500</p>
          </div>
        )}

        {step === 'done' && (
          <DoneState
            weekNumber={weekNumber}
            summary={summary}
            nextSteps={nextSteps}
            resourceLinks={resourceLinks}
            onUpdatePlan={() => router.push('/support/care-plan')}
          />
        )}

        {step !== 'done' && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={back}
              disabled={stepIdx === 0}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-brand-muted-600 transition hover:text-brand-muted-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={advance}
              disabled={!canAdvance}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === 'notes' ? 'Save check-in' : 'Next'} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-[12px] text-brand-muted-500">
        Your answers stay on this device. Common Ground is parent support, not clinical care.
      </p>
    </main>
  );
}

type QuestionOption<V extends string> = { value: V; label: string; hint: string };

function Question<V extends string>({
  label,
  help,
  options,
  value,
  onSelect,
}: {
  label: string;
  help: string;
  options: QuestionOption<V>[];
  value: V | null;
  onSelect: (v: V) => void;
}) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold text-brand-navy-700">{label}</legend>
      <p className="mt-1 text-[13.5px] text-brand-muted-600">{help}</p>
      <div className="mt-4 space-y-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(opt.value)}
              className={cn(
                'flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
                selected
                  ? 'border-primary bg-primary/5'
                  : 'border-surface-border bg-white hover:border-stone-300',
              )}
            >
              <span>
                <span className="block text-sm font-semibold text-brand-navy-700">{opt.label}</span>
                <span className="mt-0.5 block text-[13px] text-brand-muted-600">{opt.hint}</span>
              </span>
              {selected && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function DoneState({
  weekNumber,
  summary,
  nextSteps,
  resourceLinks,
  onUpdatePlan,
}: {
  weekNumber: number;
  summary: string | null;
  nextSteps: string[];
  resourceLinks: { label: string; href: string }[];
  onUpdatePlan: () => void;
}) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full bg-brand-plum-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
        <Heart className="h-3 w-3" /> Week {weekNumber} saved
      </div>
      <h2 className="mt-3 text-xl font-semibold text-brand-navy-700 sm:text-2xl">
        Thanks for checking in.
      </h2>
      {summary && (
        <p className="mt-3 text-[14.5px] leading-relaxed text-brand-muted-800">{summary}</p>
      )}

      {nextSteps.length > 0 && (
        <section className="mt-6 rounded-2xl border border-surface-border bg-surface-muted/40 p-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
            What we’d try this week
          </h3>
          <ul className="mt-3 space-y-2">
            {nextSteps.map((s) => (
              <li key={s} className="flex items-start gap-2 text-[14px] leading-relaxed text-brand-muted-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {resourceLinks.length > 0 && (
        <section className="mt-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
            Resources you asked about
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {resourceLinks.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="flex items-center justify-between gap-3 rounded-xl border border-surface-border bg-white px-4 py-3 text-[14px] font-medium text-brand-muted-800 transition hover:border-primary/40 hover:bg-primary/5 hover:text-brand-navy-700"
                >
                  <span>{r.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-brand-muted-400" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onUpdatePlan}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          Back to my plan <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <Link
          href="/"
          className="text-sm font-medium text-brand-muted-500 underline-offset-4 hover:text-brand-muted-800 hover:underline"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
