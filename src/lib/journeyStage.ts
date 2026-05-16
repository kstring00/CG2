/**
 * Journey stage inference for the <JourneyStepper> component.
 *
 * Maps the parent's saved intake answers onto a soft, 6-stop journey so the
 * site can quietly answer "where am I right now?" without forcing a parent
 * to declare it. Inference is intentionally forgiving — if we can't tell,
 * we return null and the stepper renders all six stops with none active.
 *
 * The stages are descriptive, never prescriptive. A parent can scroll past
 * them at any time; nothing about the rest of the plan depends on this.
 */

import type { CarePlanAnswers } from './carePlanStorage';

export type JourneyStageId =
  | 'wondering'
  | 'diagnosis'
  | 'starting-aba'
  | 'building-routines'
  | 'school-community'
  | 'independence';

export type JourneyStage = {
  id: JourneyStageId;
  label: string;
  /** One-line companion phrase used as a tooltip and aria-description. */
  blurb: string;
};

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'wondering',
    label: 'Wondering',
    blurb: 'Something feels off and you’re looking for answers.',
  },
  {
    id: 'diagnosis',
    label: 'Diagnosis',
    blurb: 'You’re in evaluation or just got a diagnosis.',
  },
  {
    id: 'starting-aba',
    label: 'Starting ABA',
    blurb: 'You’re lining up providers or just beginning therapy.',
  },
  {
    id: 'building-routines',
    label: 'Building routines',
    blurb: 'You’re working on the day-to-day at home.',
  },
  {
    id: 'school-community',
    label: 'School & community',
    blurb: 'IEPs, classrooms, and life outside the home.',
  },
  {
    id: 'independence',
    label: 'Growing independence',
    blurb: 'Long-haul parenting and growing autonomy.',
  },
];

/**
 * Infer the most likely stage from saved intake answers. Returns null when
 * there is nothing meaningful to anchor on (no intake yet, or a stage we
 * cannot map). Callers should treat null as "render all stages, none active".
 */
export function inferJourneyStage(
  answers: CarePlanAnswers | null | undefined,
): JourneyStageId | null {
  if (!answers) return null;
  const stage = answers.stage ?? null;
  const hardest = answers.hardest ?? [];

  switch (stage) {
    case 'waiting-diagnosis':
      // Pre-diagnosis is split across two soft stops; lean to "diagnosis" if
      // the parent has named school/IEP stress (they're often further along).
      if (hardest.includes('school-iep')) return 'diagnosis';
      return 'wondering';
    case 'newly-diagnosed':
      return 'starting-aba';
    case 'looking-for-aba':
      return 'starting-aba';
    case 'in-aba':
      if (hardest.includes('school-iep')) return 'school-community';
      if (hardest.includes('behavior-home')) return 'building-routines';
      return 'building-routines';
    case 'past-aba':
      return 'independence';
    default:
      // No stage saved. If the parent only flagged school as hard, surface
      // the school stop quietly — it's a common entry path.
      if (hardest.includes('school-iep')) return 'school-community';
      return null;
  }
}

/** Returns the 1-based index of the given stage, or -1. */
export function stageIndex(id: JourneyStageId | null): number {
  if (!id) return -1;
  return JOURNEY_STAGES.findIndex((s) => s.id === id);
}
