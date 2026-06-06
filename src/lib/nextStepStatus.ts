/**
 * Sidebar "next step" status — turns the static "Find My Next Step" CTA into a
 * small check-in status system.
 *
 * This is a thin read-only layer over the data the app already keeps on the
 * parent's device. It does NOT invent a new store:
 *   - care plan existence + createdAt  → carePlanStorage (cg.carePlan.v1)
 *   - this week's check-in + progress  → weeklyProgress  (cg.weeklyProgress.v1,
 *                                        plus a bandwidth check counts as the
 *                                        weekly check-in — see getWeeklyProgressSummary)
 *
 * The weekly cadence is Monday-based and resets every Monday, mirroring the
 * progress meter, so "next check-in" is always the upcoming Monday.
 *
 * Phases (in priority order):
 *   new       → no plan yet                         → "Find My Next Step"     → /support/intake
 *   due       → plan exists, not checked in this wk  → "Update My Next Step"   → /support/intake
 *   countdown → checked in, week still in progress   → "Next check-in in Nd"  → /support/care-plan
 *   plan      → checked in, all steps done this week  → "View My Care Plan"    → /support/care-plan
 */

import { loadCarePlan } from './carePlanStorage';
import { getWeeklyProgressSummary, weekStartISO } from './weeklyProgress';

export type NextStepPhase = 'new' | 'due' | 'countdown' | 'plan';
export type NextStepVariant = 'primary' | 'status' | 'secondary';

export type NextStepStatus = {
  phase: NextStepPhase;
  label: string;
  href: string;
  variant: NextStepVariant;
  /** Days until the next Monday check-in (only set for the countdown phase). */
  daysUntil?: number;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Whole days from `now` until the next weekly check-in (next Monday 00:00). */
function daysUntilNextCheckIn(now: Date): number {
  // weekStartISO gives this week's Monday; the next check-in opens 7 days later.
  const thisMonday = new Date(`${weekStartISO(now)}T00:00:00`);
  const nextCheckIn = new Date(thisMonday);
  nextCheckIn.setDate(nextCheckIn.getDate() + 7);
  return Math.max(1, Math.ceil((nextCheckIn.getTime() - now.getTime()) / MS_PER_DAY));
}

/** The default shown before client state has loaded (also the true new-visitor state). */
export const NEW_VISITOR_STATUS: NextStepStatus = {
  phase: 'new',
  label: 'Find My Next Step',
  href: '/support/intake',
  variant: 'primary',
};

export function getNextStepStatus(now: Date = new Date()): NextStepStatus {
  const plan = loadCarePlan();

  // Phase 1 — brand new: nothing started yet.
  if (!plan) return NEW_VISITOR_STATUS;

  const summary = getWeeklyProgressSummary(now);

  // Phase 2 — a plan exists but this week's check-in hasn't been done: it's due.
  if (!summary.intakeDoneThisWeek) {
    return {
      phase: 'due',
      label: 'Update My Next Step',
      href: '/support/intake',
      variant: 'primary',
    };
  }

  // Phase 4 — checked in and everything is done for the week: just view the plan.
  if (summary.weekComplete) {
    return {
      phase: 'plan',
      label: 'View My Care Plan',
      href: '/support/care-plan',
      variant: 'secondary',
    };
  }

  // Phase 3 — checked in, week still in progress: count down to the next one.
  const daysUntil = daysUntilNextCheckIn(now);
  return {
    phase: 'countdown',
    label: `Next check-in in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`,
    href: '/support/care-plan',
    variant: 'status',
    daysUntil,
  };
}
