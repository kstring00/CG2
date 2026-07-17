/**
 * Care plan presentation helpers — keeps /support/care-plan and the weekly
 * progress meter aligned on the same step list (bucket-based, not the raw
 * tier-limited plan.steps array).
 */

import {
  getArcWeek,
  resolveArcWeekNumber,
  type Phase,
} from './arcs';
import {
  getStepCompletionKey,
  type CarePlanAnswers,
  type CarePlanStep,
  type SavedCarePlan,
} from './carePlanStorage';
import type { SupportThreadId } from './carePlanSupport';
import {
  enrichCarePlanStep,
  generateArcWeekSteps,
  generateBucketSteps,
  generateNewToAbaSteps,
  isNewToAbaWithoutProvider,
} from './generateNextSteps';
import { isStepComplete, type WeeklyProgress } from './weeklyProgress';

/** All bucket steps for a given arc week (default week 1). */
export function getCarePlanBucketSteps(
  plan: SavedCarePlan,
  arcWeekNumber = 1,
): CarePlanStep[] {
  // Stage gate: new-to-ABA families see the fixed intake-first plan in its
  // authored order — never the bucket-scored mix.
  if (arcWeekNumber <= 1 && isNewToAbaWithoutProvider(plan.answers)) {
    return generateNewToAbaSteps().map(enrichCarePlanStep);
  }
  const arcWeek = getArcWeek(plan.answers.stage, arcWeekNumber);
  const fromBuckets = generateBucketSteps(plan.answers, arcWeek)
    .map((b) => b.step)
    .filter((s): s is CarePlanStep => s !== null);
  const source = fromBuckets.length ? fromBuckets : plan.steps;
  return source.map(enrichCarePlanStep);
}

/** Stage-named week label — e.g. "Week 3 — sort how care is paid for". */
export function formatArcWeekLabel(arcWeekNumber: number, arcTheme: string): string {
  return `Week ${arcWeekNumber} — ${arcTheme.toLowerCase()}`;
}

export type CarePlanWeekView = {
  /** Steps the parent should focus on right now. */
  activeSteps: CarePlanStep[];
  /** Parked until week-one work is done (arc week 1 only). */
  nextWeekSteps: CarePlanStep[];
  /** True when every non–next-week step is marked done. */
  weekOneComplete: boolean;
  /** Week 2+ guide is unlocked — next-week steps move into focus. */
  weekTwoUnlocked: boolean;
  /** Which arc week (1–8) the parent is on. */
  arcWeekNumber: number;
  arcTheme: string;
  arcPhase: Phase;
  /** Support-panel thread nudged this week (for rotation next week). */
  supportNudgeThread: SupportThreadId | null;
};

function weekOneBucketView(
  plan: SavedCarePlan,
  completedKeys: string[],
  legacyHrefs: string[],
): Pick<
  CarePlanWeekView,
  'activeSteps' | 'nextWeekSteps' | 'weekOneComplete' | 'weekTwoUnlocked'
> {
  const all = getCarePlanBucketSteps(plan, 1);
  const thisWeekSteps = all.filter((s) => s.bucket !== 'next-week');
  const nextWeekSteps = all.filter((s) => s.bucket === 'next-week');

  const weekOneComplete =
    thisWeekSteps.length > 0 &&
    thisWeekSteps.every((s) => isStepComplete(s, completedKeys, legacyHrefs, all));

  const weekTwoUnlocked = weekOneComplete;

  return {
    activeSteps: thisWeekSteps,
    nextWeekSteps,
    weekOneComplete,
    weekTwoUnlocked,
  };
}

function resolveActiveStepsForArcWeek(
  plan: SavedCarePlan,
  arcWeekNumber: number,
  completedKeys: string[],
  legacyHrefs: string[],
  lastSupportNudgeThread: SupportThreadId | null | undefined,
): { steps: CarePlanStep[]; supportNudgeThread: SupportThreadId | null } {
  if (arcWeekNumber <= 1) {
    const steps = getCarePlanBucketSteps(plan, 1).filter((s) => s.bucket !== 'next-week');
    return { steps, supportNudgeThread: null };
  }

  const prior = resolveActiveStepsForArcWeek(
    plan,
    arcWeekNumber - 1,
    completedKeys,
    legacyHrefs,
    lastSupportNudgeThread,
  );

  const completedPriorWeekIds = prior.steps
    .filter((s) => isStepComplete(s, completedKeys, legacyHrefs, prior.steps))
    .map((s) => s.id ?? s.title);

  const arcWeek = getArcWeek(plan.answers.stage, arcWeekNumber);
  const rotationInput =
    arcWeekNumber === 2 ? lastSupportNudgeThread : prior.supportNudgeThread;

  return generateArcWeekSteps({
    answers: plan.answers,
    arcWeek,
    priorWeekSteps: prior.steps,
    completedPriorWeekIds,
    lastSupportNudgeThread: rotationInput,
  });
}

/**
 * Week 1: focus on do-today / ask-bcba / try-home / save-resource from arc week 1.
 * When those are done — or calendar week advances — promote into arc week 2+ guide.
 */
export function getCarePlanWeekView(
  plan: SavedCarePlan,
  weekNumber: number,
  completedKeys: string[],
  legacyHrefs: string[] = [],
  lastSupportNudgeThread: SupportThreadId | null | undefined = null,
): CarePlanWeekView {
  const week1 = weekOneBucketView(plan, completedKeys, legacyHrefs);
  const arcWeekNumber = resolveArcWeekNumber(weekNumber, week1.weekOneComplete);
  const arcWeek = getArcWeek(plan.answers.stage, arcWeekNumber);

  if (arcWeekNumber === 1) {
    return {
      ...week1,
      arcWeekNumber: 1,
      arcTheme: arcWeek.theme,
      arcPhase: arcWeek.phase,
      supportNudgeThread: null,
    };
  }

  const generated = resolveActiveStepsForArcWeek(
    plan,
    arcWeekNumber,
    completedKeys,
    legacyHrefs,
    lastSupportNudgeThread,
  );

  return {
    activeSteps: generated.steps.map(enrichCarePlanStep),
    nextWeekSteps: [],
    weekOneComplete: week1.weekOneComplete,
    weekTwoUnlocked: true,
    arcWeekNumber,
    arcTheme: arcWeek.theme,
    arcPhase: arcWeek.phase,
    supportNudgeThread: generated.supportNudgeThread,
  };
}

/** Titles of steps completed in a prior weekly-progress snapshot. */
export function completedStepTitles(
  steps: CarePlanStep[],
  progress: WeeklyProgress | null,
): string[] {
  if (!progress) return [];
  const legacy = progress.completedStepHrefs ?? [];
  return steps
    .filter((s) => isStepComplete(s, progress.completedStepKeys, legacy, steps))
    .map((s) => s.title);
}

/** Resolve completion keys for a specific step list (no tier filtering). */
export function resolvedCompletionKeys(
  steps: CarePlanStep[],
  progress: WeeklyProgress,
): string[] {
  const legacy = progress.completedStepHrefs ?? [];
  const keys = new Set(progress.completedStepKeys ?? []);
  for (const href of legacy) {
    const matches = steps.filter((s) => s.href === href);
    if (matches.length === 1) keys.add(getStepCompletionKey(matches[0]));
  }
  return [...keys];
}
