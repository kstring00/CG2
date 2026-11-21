/**
 * Always-on support threads — not part of the weekly arc. Shown beside the plan
 * every week; the balance layer nudges parents toward eligible threads.
 */

import type { CarePlanAnswers } from './carePlanStorage';

export type SupportThreadId = 'mental-health' | 'siblings';

export type SupportThread = {
  id: SupportThreadId;
  title: string;
  blurb: string;
  href: string;
};

const SUPPORT_THREADS: Record<SupportThreadId, SupportThread> = {
  'mental-health': {
    id: 'mental-health',
    title: 'Mental health (for you)',
    blurb: 'Parent burnout, anxiety, and small resets — from the Mental Health Toolbox.',
    href: '/support/mental-health',
  },
  siblings: {
    id: 'siblings',
    title: 'Sibling support',
    blurb: 'Guides and one small thing to try when brothers or sisters feel the strain.',
    href: '/support/siblings',
  },
};

export function resolveHasOtherChildren(answers: CarePlanAnswers): boolean {
  return answers.hasOtherChildren === true;
}

/** Threads visible in the always-on support panel. */
export function getEligibleSupportThreads(answers: CarePlanAnswers): SupportThread[] {
  const threads: SupportThread[] = [SUPPORT_THREADS['mental-health']];
  if (resolveHasOtherChildren(answers)) {
    threads.push(SUPPORT_THREADS.siblings);
  }
  return threads;
}

/** Pick a nudge thread — rotate away from last week when possible. */
export function pickSupportNudgeThread(
  answers: CarePlanAnswers,
  lastThread: SupportThreadId | null | undefined,
): SupportThreadId {
  const eligible = getEligibleSupportThreads(answers).map((t) => t.id);
  if (eligible.length === 0) return 'mental-health';
  const rotated = lastThread ? eligible.filter((id) => id !== lastThread) : eligible;
  return rotated[0] ?? eligible[0];
}

const NUDGE_COPY: Record<SupportThreadId, string> = {
  'mental-health':
    'Your mental-health thread is always beside your plan — four minutes for you this week.',
  siblings:
    'Your sibling support thread is in the panel beside your plan — one small thing to try.',
};

const NUDGE_CANDIDATE: Record<SupportThreadId, string> = {
  'mental-health': 'fourMinutes',
  siblings: 'siblingOneThing',
};

export function getSupportNudgeCopy(thread: SupportThreadId): string {
  return NUDGE_COPY[thread];
}

export function getSupportNudgeCandidateId(thread: SupportThreadId): string {
  return NUDGE_CANDIDATE[thread];
}

