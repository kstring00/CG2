/**
 * CLINICAL-REVIEW DRAFT — 8-week care-plan arcs by intake stage.
 *
 * Themes and candidateStepIds are intentionally easy to edit. Each `candidateStepId`
 * must exist in the step library (`generateNextSteps.ts` → `C`). Use `todo-*`
 * placeholders where content is not authored yet — the generator skips unknown ids.
 *
 * TODO (product decision — do not implement): child age-band field (ECI birth–3 vs
 * school-age) to place school themes correctly across arcs.
 */

import type { Stage } from './carePlanStorage';

export type Phase = 'orient' | 'setup' | 'sustain';

export interface ArcWeek {
  week: number;
  theme: string;
  phase: Phase;
  candidateStepIds: string[];
}

export interface Arc {
  stage: Stage;
  weeks: ArcWeek[];
}

export const ARC_WEEK_COUNT = 8;

const newlyDiagnosedArc: Arc = {
  stage: 'newly-diagnosed',
  weeks: [
    {
      week: 1,
      theme: 'Understand the diagnosis',
      phase: 'orient',
      candidateStepIds: ['practicalGuides', 'documentHard', 'todo-understand-diagnosis'],
    },
    {
      week: 2,
      theme: 'Learn what ABA actually is',
      phase: 'orient',
      candidateStepIds: ['whatIsAba', 'practicalGuides', 'questionsForBCBA'],
    },
    {
      week: 3,
      theme: 'Sort how care is paid for',
      phase: 'setup',
      candidateStepIds: [
        'financialGuide',
        'checkCoverageStatus',
        'verifyCoverage',
        'insuranceCall',
        'hopeForThree',
        'medicaidWaiver',
        'slidingScaleFind',
      ],
    },
    {
      week: 4,
      theme: 'Find providers & connect with admissions',
      phase: 'setup',
      candidateStepIds: ['findLocal', 'shortlistProviders', 'admissionsConsult', 'callOneProvider'],
    },
    {
      week: 5,
      theme: 'Questions to evaluate a provider',
      phase: 'setup',
      candidateStepIds: ['questionsForBCBA', 'firstCallQuestions', 'compareThree'],
    },
    {
      week: 6,
      theme: 'Get ready to start services',
      phase: 'setup',
      candidateStepIds: ['trackNotes', 'documentHard', 'admissionsConsult', 'todo-intake-readiness'],
    },
    {
      week: 7,
      theme: 'School & early intervention',
      phase: 'setup',
      candidateStepIds: ['schoolServicesPath', 'iepPrep', 'parentAdvocate'],
    },
    {
      week: 8,
      theme: 'First strategies to use at home',
      phase: 'sustain',
      candidateStepIds: ['homeStrategy', 'meltdownNow', 'practicalGuides'],
    },
  ],
};

const waitingDiagnosisArc: Arc = {
  stage: 'waiting-diagnosis',
  weeks: [
    {
      week: 1,
      theme: 'Trust your instinct, screen',
      phase: 'orient',
      candidateStepIds: ['mchat', 'documentHard', 'todo-trust-instinct'],
    },
    {
      week: 2,
      theme: 'Start the evaluation path',
      phase: 'setup',
      candidateStepIds: ['devPed', 'mchat', 'findLocal'],
    },
    {
      week: 3,
      theme: 'Understand what diagnosis involves',
      phase: 'orient',
      candidateStepIds: ['practicalGuides', 'todo-diagnosis-process'],
    },
    {
      week: 4,
      theme: 'Learn what ABA is',
      phase: 'orient',
      candidateStepIds: ['whatIsAba', 'questionsForBCBA'],
    },
    {
      week: 5,
      theme: 'Early supports you can start now',
      phase: 'setup',
      candidateStepIds: ['schoolServicesPath', 'hopeForThree', 'findLocal'],
    },
    {
      week: 6,
      theme: 'At-home strategies that help regardless',
      phase: 'sustain',
      candidateStepIds: ['homeStrategy', 'meltdownNow', 'fourMinutes'],
    },
    {
      week: 7,
      theme: 'Line up coverage & options early',
      phase: 'setup',
      candidateStepIds: [
        'financialGuide',
        'checkCoverageStatus',
        'medicaidWaiver',
        'hopeForThree',
        'slidingScaleFind',
      ],
    },
    {
      week: 8,
      theme: 'Prepare for results, plan next step',
      phase: 'setup',
      candidateStepIds: ['whatIsAba', 'shortlistProviders', 'admissionsConsult', 'todo-after-results'],
    },
  ],
};

const lookingForAbaArc: Arc = {
  stage: 'looking-for-aba',
  weeks: [
    {
      week: 1,
      theme: 'Know what good ABA looks like',
      phase: 'orient',
      candidateStepIds: ['whatIsAba', 'questionsForBCBA', 'practicalGuides'],
    },
    {
      week: 2,
      theme: 'Sort how care is paid for',
      phase: 'setup',
      candidateStepIds: [
        'financialGuide',
        'checkCoverageStatus',
        'verifyCoverage',
        'insuranceCall',
        'hopeForThree',
        'slidingScaleFind',
      ],
    },
    {
      week: 3,
      theme: 'Build a provider shortlist',
      phase: 'setup',
      candidateStepIds: ['shortlistProviders', 'compareThree', 'findLocal', 'saveShortlist'],
    },
    {
      week: 4,
      theme: 'Prep your questions & red flags',
      phase: 'setup',
      candidateStepIds: ['firstCallQuestions', 'questionsForBCBA', 'todo-provider-red-flags'],
    },
    {
      week: 5,
      theme: 'Make contact & connect with admissions',
      phase: 'setup',
      candidateStepIds: ['callOneProvider', 'admissionsConsult', 'findLocal'],
    },
    {
      week: 6,
      theme: 'Tour, intake, compare',
      phase: 'setup',
      candidateStepIds: ['compareThree', 'trackNotes', 'todo-tour-intake'],
    },
    {
      week: 7,
      theme: 'Decide & track your notes',
      phase: 'setup',
      candidateStepIds: ['trackNotes', 'compareThree', 'saveShortlist'],
    },
    {
      week: 8,
      theme: 'Get ready to start services',
      phase: 'sustain',
      candidateStepIds: ['documentHard', 'admissionsConsult', 'todo-start-services'],
    },
  ],
};

const inAbaArc: Arc = {
  stage: 'in-aba',
  weeks: [
    {
      week: 1,
      theme: 'Partner with your BCBA & RBT',
      phase: 'orient',
      candidateStepIds: ['questionsForBCBA', 'documentHard', 'todo-partner-bcba'],
    },
    {
      week: 2,
      theme: "Understand your child's goals",
      phase: 'orient',
      candidateStepIds: ['documentHard', 'practicalGuides', 'todo-session-goals'],
    },
    {
      week: 3,
      theme: 'Carry goals into the home',
      phase: 'sustain',
      candidateStepIds: ['homeStrategy', 'documentHard', 'trackNotes'],
    },
    {
      week: 4,
      theme: 'At-home strategies & routines',
      phase: 'sustain',
      candidateStepIds: ['homeStrategy', 'meltdownNow', 'practicalGuides'],
    },
    {
      week: 5,
      theme: 'School & advocacy / IEP',
      phase: 'setup',
      candidateStepIds: ['iepPrep', 'parentAdvocate', 'schoolServicesPath'],
    },
    {
      week: 6,
      theme: 'Track & understand progress',
      phase: 'setup',
      candidateStepIds: ['trackNotes', 'documentHard', 'todo-progress-tracking'],
    },
    {
      week: 7,
      theme: 'Coordinate the whole care team',
      phase: 'sustain',
      candidateStepIds: ['parentMatch', 'smallGroups', 'admissionsConsult', 'todo-care-team'],
    },
    {
      week: 8,
      theme: 'Build long-term sustainability',
      phase: 'sustain',
      candidateStepIds: ['fourMinutes', 'parentTherapist', 'homeStrategy', 'todo-sustain-aba'],
    },
  ],
};

const pastAbaArc: Arc = {
  stage: 'past-aba',
  weeks: [
    {
      week: 1,
      theme: 'Maintain the gains at home',
      phase: 'sustain',
      candidateStepIds: ['homeStrategy', 'practicalGuides', 'documentHard'],
    },
    {
      week: 2,
      theme: 'Understand the transition',
      phase: 'orient',
      candidateStepIds: ['practicalGuides', 'todo-transition-guide'],
    },
    {
      week: 3,
      theme: 'Keep skills generalizing',
      phase: 'sustain',
      candidateStepIds: ['homeStrategy', 'meltdownNow', 'todo-generalize-skills'],
    },
    {
      week: 4,
      theme: 'School & life-skills continuity',
      phase: 'setup',
      candidateStepIds: ['iepPrep', 'schoolServicesPath', 'parentAdvocate'],
    },
    {
      week: 5,
      theme: 'Practical & financial resources',
      phase: 'setup',
      candidateStepIds: ['financialGuide', 'hopeForThree', 'medicaidWaiver', 'slidingScaleFind'],
    },
    {
      week: 6,
      theme: 'Independence & self-advocacy',
      phase: 'sustain',
      candidateStepIds: ['practicalGuides', 'documentHard', 'todo-self-advocacy'],
    },
    {
      week: 7,
      theme: 'Community & belonging',
      phase: 'sustain',
      candidateStepIds: ['parentMatch', 'smallGroups', 'siblingGuide'],
    },
    {
      week: 8,
      theme: 'Plan for the future',
      phase: 'sustain',
      candidateStepIds: ['practicalGuides', 'todo-future-planning', 'parentMatch'],
    },
  ],
};

export const ARCS: Record<Stage, Arc> = {
  'newly-diagnosed': newlyDiagnosedArc,
  'waiting-diagnosis': waitingDiagnosisArc,
  'looking-for-aba': lookingForAbaArc,
  'in-aba': inAbaArc,
  'past-aba': pastAbaArc,
};

export function getArcForStage(stage: Stage | null | undefined): Arc {
  return ARCS[stage ?? 'newly-diagnosed'];
}

export function getArcWeek(stage: Stage | null | undefined, weekNumber: number): ArcWeek {
  const arc = getArcForStage(stage);
  const clamped = Math.min(Math.max(weekNumber, 1), ARC_WEEK_COUNT);
  return arc.weeks[clamped - 1];
}

/** Calendar week + completion state → which arc week the parent is on (max 8). */
export function resolveArcWeekNumber(calendarWeek: number, weekOneComplete: boolean): number {
  if (calendarWeek <= 1 && !weekOneComplete) return 1;
  if (calendarWeek <= 1 && weekOneComplete) return 2;
  return Math.min(Math.max(calendarWeek, 1), ARC_WEEK_COUNT);
}

/** True when a candidate id is a known library step (not a todo placeholder). */
export function isResolvableCandidateId(id: string): boolean {
  return !id.startsWith('todo-');
}
