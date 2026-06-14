/**
 * Care plan presentation helpers — keeps /support/care-plan and the weekly
 * progress meter aligned on the same step list (bucket-based, not the raw
 * tier-limited plan.steps array).
 */

import {
  getStepCompletionKey,
  type CarePlanStep,
  type SavedCarePlan,
} from './carePlanStorage';
import { enrichCarePlanStep, generateBucketSteps, generateWeekTwoSteps } from './generateNextSteps';
import { isStepComplete, type WeeklyProgress } from './weeklyProgress';

/** All bucket steps shown on the care plan (up to 5). */
export function getCarePlanBucketSteps(plan: SavedCarePlan): CarePlanStep[] {
  const fromBuckets = generateBucketSteps(plan.answers)
    .map((b) => b.step)
    .filter((s): s is CarePlanStep => s !== null);
  const source = fromBuckets.length ? fromBuckets : plan.steps;
  return source.map(enrichCarePlanStep);
}

export type CarePlanWeekView = {
  /** Steps the parent should focus on right now. */
  activeSteps: CarePlanStep[];
  /** Parked until week-one work is done (or calendar week 2+). */
  nextWeekSteps: CarePlanStep[];
  /** True when every non–next-week step is marked done. */
  weekOneComplete: boolean;
  /** Week 2+ guide is unlocked — next-week steps move into focus. */
  weekTwoUnlocked: boolean;
};

/**
 * Week 1: focus on do-today / ask-bcba / try-home / save-resource.
 * When those are done — or the parent is in calendar week 2+ — promote
 * next-week steps into the active guide.
 */
export function getCarePlanWeekView(
  plan: SavedCarePlan,
  weekNumber: number,
  completedKeys: string[],
  legacyHrefs: string[] = [],
): CarePlanWeekView {
  const all = getCarePlanBucketSteps(plan);
  const thisWeekSteps = all.filter((s) => s.bucket !== 'next-week');
  const nextWeekSteps = all.filter((s) => s.bucket === 'next-week');

  const weekOneComplete =
    thisWeekSteps.length > 0 &&
    thisWeekSteps.every((s) => isStepComplete(s, completedKeys, legacyHrefs, all));

  const weekTwoUnlocked = weekNumber >= 2 || weekOneComplete;

  if (weekTwoUnlocked) {
    const completedWeekOneIds = thisWeekSteps
      .filter((s) => isStepComplete(s, completedKeys, legacyHrefs, all))
      .map((s) => s.id ?? s.title);

    const generatedWeekTwo = generateWeekTwoSteps({
      answers: plan.answers,
      weekOneSteps: thisWeekSteps,
      completedWeekOneIds,
    }).map(enrichCarePlanStep);

    return {
      activeSteps: generatedWeekTwo,
      nextWeekSteps: [],
      weekOneComplete,
      weekTwoUnlocked,
    };
  }

  return {
    activeSteps: thisWeekSteps,
    nextWeekSteps,
    weekOneComplete,
    weekTwoUnlocked: false,
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
