/**
 * Convert a weekly check-in into a short, warm summary + concrete next steps.
 * Pure functions — no storage, no React.
 */

import type {
  ChildProgress,
  ParentConfidence,
  ParentStress,
  ResourceNeed,
  TriedSteps,
  WeeklyCheckInAnswers,
} from './weeklyCheckIn';

const STRESS_PHRASE: Record<ParentStress, string> = {
  low: 'You said this week felt manageable.',
  moderate: 'You said this week was a mixed bag.',
  high: 'You said this week was heavy.',
  overwhelmed: 'You said this week was overwhelming.',
};

const CONFIDENCE_PHRASE: Record<ParentConfidence, string> = {
  shaky: 'You’re feeling shaky about the plan right now.',
  mixed: 'Confidence in the plan feels mixed.',
  steady: 'You’re feeling steady about the plan.',
  strong: 'You’re feeling strong about the plan this week.',
};

const PROGRESS_PHRASE: Record<ChildProgress, string> = {
  harder: 'Things with your child felt harder this week.',
  'about-same': 'Things with your child felt about the same.',
  'small-wins': 'You noticed some small wins this week.',
  'real-progress': 'You saw real progress this week.',
};

const TRIED_PHRASE: Record<TriedSteps, string> = {
  all: 'You worked through every recommended step.',
  some: 'You worked through some of the recommended steps.',
  none: 'The recommended steps didn’t happen this week — that’s okay.',
  'not-sure': 'You’re not sure where the steps landed this week.',
};

const RESOURCE_LABEL: Record<ResourceNeed, string> = {
  'practical-info': 'practical info',
  'local-providers': 'local providers',
  'someone-to-talk-to': 'someone to talk to',
  'time-for-me': 'time for yourself',
  'school-iep': 'school / IEP help',
  'financial': 'financial / insurance help',
  'sleep-sensory': 'sleep & sensory support',
  'nothing-right-now': 'space, not more to-dos',
};

const RESOURCE_LINK: Partial<Record<ResourceNeed, { label: string; href: string }>> = {
  'practical-info': { label: 'Browse the resource library', href: '/support/resources' },
  'local-providers': { label: 'Find providers near you', href: '/support/providers' },
  'someone-to-talk-to': { label: 'Connect with other parents', href: '/support/connect' },
  'time-for-me': { label: 'Visit Parent Support', href: '/support/caregiver' },
  'school-iep': { label: 'Open the school & IEP guide', href: '/support/resources' },
  'financial': { label: 'See financial help', href: '/support/financial' },
  'sleep-sensory': { label: 'Open the sleep guide', href: '/support/sleep' },
};

export function summarizeCheckIn(answers: WeeklyCheckInAnswers): string {
  const parts = [
    STRESS_PHRASE[answers.parentStress],
    CONFIDENCE_PHRASE[answers.parentConfidence],
    PROGRESS_PHRASE[answers.childProgress],
    TRIED_PHRASE[answers.triedSteps],
  ];
  if (answers.resourceNeeds.length && !answers.resourceNeeds.includes('nothing-right-now')) {
    const labels = answers.resourceNeeds.map((r) => RESOURCE_LABEL[r]);
    parts.push(`You asked for help with ${humanList(labels)}.`);
  }
  if (answers.newConcerns && answers.newConcerns.trim().length > 0) {
    parts.push('You wrote down a new concern — we kept it with your plan.');
  }
  return parts.join(' ');
}

export function nextStepsForCheckIn(answers: WeeklyCheckInAnswers): string[] {
  const steps: string[] = [];

  if (answers.parentStress === 'high' || answers.parentStress === 'overwhelmed') {
    steps.push('Start with one breath, not the to-do list. Try a 2-minute grounding tool before anything else.');
  }
  if (answers.parentConfidence === 'shaky') {
    steps.push('Pick the smallest step on your plan and try just that one this week.');
  }
  if (answers.triedSteps === 'none') {
    steps.push('Drop a step that isn’t fitting and keep only the one that matters most this week.');
  }
  if (answers.childProgress === 'harder') {
    steps.push('Note what was different this week — sleep, schedule, sensory — before changing the plan.');
  }
  for (const need of answers.resourceNeeds) {
    const link = RESOURCE_LINK[need];
    if (link) steps.push(`${link.label}.`);
  }
  if (answers.newConcerns && answers.newConcerns.trim().length > 0) {
    steps.push('Bring the new concern you wrote down to your next conversation with your care team.');
  }
  if (steps.length === 0) {
    steps.push('Keep doing what’s working. Same plan, one more week.');
  }
  // De-dupe while preserving order.
  return Array.from(new Set(steps)).slice(0, 5);
}

export function resourceLinksForCheckIn(
  answers: WeeklyCheckInAnswers,
): { label: string; href: string }[] {
  const out: { label: string; href: string }[] = [];
  for (const need of answers.resourceNeeds) {
    const link = RESOURCE_LINK[need];
    if (link && !out.some((o) => o.href === link.href)) out.push(link);
  }
  return out;
}

function humanList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
