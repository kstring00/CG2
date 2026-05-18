/**
 * Per-week progress meter state.
 *
 * The meter is always visible across the Parent Support area. Its purpose is
 * to show parents exactly where they stand this week:
 *
 *   notch 0 (empty)     → weekly intake / check-in not yet done
 *   notch 1             → weekly check-in is done; tools and plan steps unlock
 *   notch 1+i           → +1 for each plan step the parent has marked done
 *   notch (1 + N)       → all plan steps done — week complete
 *
 * The progress object is keyed by the ISO date of Monday for the calendar
 * week it belongs to. When the page loads on a new week, the previous week's
 * object is left in localStorage as `cg.weeklyProgress.prev.v1` (so the UI
 * can show a "last week" recap if it wants), and the active object is
 * regenerated from scratch — the meter naturally empties on Monday.
 *
 * Everything lives in localStorage. No backend yet — see README/PR notes for
 * what would be required to send a real Monday email or run a scheduled job.
 */

import { loadCarePlan } from './carePlanStorage';
import { hasCheckedInThisWeek, loadCheckInState } from './weeklyCheckIn';

const KEY = 'cg.weeklyProgress.v1';
const PREV_KEY = 'cg.weeklyProgress.prev.v1';

export type WeeklyProgress = {
  version: 1;
  /** ISO date (YYYY-MM-DD) of the Monday this object represents. */
  weekStart: string;
  /** ISO timestamp when the weekly intake/check-in was completed, if at all. */
  intakeDoneAt: string | null;
  /** Hrefs (or titles) of plan steps marked done this week. Order = completion order. */
  completedStepHrefs: string[];
};

export type WeeklyProgressSummary = {
  /** ISO date of the Monday this summary belongs to. */
  weekStart: string;
  /** Has the weekly intake/check-in been completed this week? */
  intakeDoneThisWeek: boolean;
  /** Plan steps the parent has marked complete this week. */
  completedStepHrefs: string[];
  /** Total notches in the meter (1 intake + N plan steps). */
  totalNotches: number;
  /** How many notches are filled right now. */
  filledNotches: number;
  /** 0..1 — fraction of notches filled. */
  fraction: number;
  /** Human-readable label for the next thing to do. */
  nextLabel: string;
  /** Route the next action should send the parent to. */
  nextHref: string;
  /** True when every plan step + the weekly intake is done. */
  weekComplete: boolean;
  /** True when no plan exists yet — meter still renders, intake is the only step. */
  noPlanYet: boolean;
};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/** Monday 00:00 of the calendar week containing `d`, as a YYYY-MM-DD string. */
export function weekStartISO(d: Date = new Date()): string {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  const day = out.getDay(); // 0 Sun .. 6 Sat
  const offsetToMonday = day === 0 ? -6 : 1 - day;
  out.setDate(out.getDate() + offsetToMonday);
  const y = out.getFullYear();
  const m = String(out.getMonth() + 1).padStart(2, '0');
  const da = String(out.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

function emptyProgress(now: Date = new Date()): WeeklyProgress {
  return {
    version: 1,
    weekStart: weekStartISO(now),
    intakeDoneAt: null,
    completedStepHrefs: [],
  };
}

function readRaw(): WeeklyProgress | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WeeklyProgress> | null;
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.weekStart !== 'string') return null;
    return {
      version: 1,
      weekStart: parsed.weekStart,
      intakeDoneAt: typeof parsed.intakeDoneAt === 'string' ? parsed.intakeDoneAt : null,
      completedStepHrefs: Array.isArray(parsed.completedStepHrefs)
        ? parsed.completedStepHrefs.filter((s): s is string => typeof s === 'string')
        : [],
    };
  } catch {
    return null;
  }
}

/** Same-tab event name. Components listening can subscribe to keep the meter
 *  in sync without waiting for the cross-tab `storage` event. */
export const WEEKLY_PROGRESS_EVENT = 'cg:weeklyProgress';

function writeRaw(next: WeeklyProgress) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode — meter still functions in-memory for the page */
  }
  try {
    window.dispatchEvent(new CustomEvent(WEEKLY_PROGRESS_EVENT));
  } catch {
    /* CustomEvent unsupported — fall back to storage event listeners */
  }
}

function archivePrev(prev: WeeklyProgress) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(PREV_KEY, JSON.stringify(prev));
  } catch {
    /* noop */
  }
}

/**
 * Load the current week's progress, auto-rolling over if Monday has passed
 * since the stored object was written. Pure-on-server: returns a transient
 * empty object so SSR can render without crashing.
 */
export function loadWeeklyProgress(now: Date = new Date()): WeeklyProgress {
  const current = readRaw();
  const thisWeek = weekStartISO(now);
  if (!current) return emptyProgress(now);
  if (current.weekStart === thisWeek) return current;
  // New week — archive last week's progress, return a fresh empty one.
  archivePrev(current);
  const fresh = emptyProgress(now);
  writeRaw(fresh);
  return fresh;
}

/** Mark this week's intake/check-in as done. Idempotent. */
export function markWeeklyIntakeDone(now: Date = new Date()): WeeklyProgress {
  const current = loadWeeklyProgress(now);
  if (current.intakeDoneAt) return current;
  const next: WeeklyProgress = { ...current, intakeDoneAt: now.toISOString() };
  writeRaw(next);
  return next;
}

/** Mark a plan step done. Idempotent — same href won't tick twice. */
export function markStepDone(href: string, now: Date = new Date()): WeeklyProgress {
  const current = loadWeeklyProgress(now);
  if (current.completedStepHrefs.includes(href)) return current;
  const next: WeeklyProgress = {
    ...current,
    completedStepHrefs: [...current.completedStepHrefs, href],
  };
  writeRaw(next);
  return next;
}

/** Unmark a plan step (parent changed their mind). */
export function unmarkStepDone(href: string, now: Date = new Date()): WeeklyProgress {
  const current = loadWeeklyProgress(now);
  if (!current.completedStepHrefs.includes(href)) return current;
  const next: WeeklyProgress = {
    ...current,
    completedStepHrefs: current.completedStepHrefs.filter((h) => h !== href),
  };
  writeRaw(next);
  return next;
}

/** Force-reset the current week's progress (debug / test affordance). */
export function resetWeeklyProgress(now: Date = new Date()): WeeklyProgress {
  const fresh = emptyProgress(now);
  writeRaw(fresh);
  return fresh;
}

/**
 * Build the meter summary parents see. Combines:
 *   - the current week's progress object
 *   - the weekly check-in state (so finishing a check-in implicitly counts
 *     as the weekly intake notch even if `markWeeklyIntakeDone` wasn't
 *     explicitly called — e.g. existing flow)
 *   - the saved care plan, which provides the *list* of steps
 */
export function getWeeklyProgressSummary(now: Date = new Date()): WeeklyProgressSummary {
  const progress = loadWeeklyProgress(now);
  const plan = loadCarePlan();
  const checkIn = loadCheckInState();

  // The intake notch is filled if either:
  //   (a) the parent explicitly completed the weekly intake/check-in this
  //       week (markWeeklyIntakeDone was called), OR
  //   (b) they already submitted a weekly check-in inside this calendar week
  //       through the existing /support/check-in flow.
  const checkedInThisWeek = hasCheckedInThisWeek(checkIn, now);
  const intakeDoneThisWeek = Boolean(progress.intakeDoneAt) || checkedInThisWeek;

  const stepCount = plan?.steps.length ?? 0;
  const totalNotches = 1 + stepCount; // intake + each plan step

  // Only count completed steps that still exist in the current plan, so
  // editing the intake (which rewrites steps) doesn't leave ghost notches.
  const validStepHrefs = new Set(plan?.steps.map((s) => s.href) ?? []);
  const completedStepHrefs = progress.completedStepHrefs.filter((h) => validStepHrefs.has(h));
  const filledNotches = (intakeDoneThisWeek ? 1 : 0) + completedStepHrefs.length;
  const fraction = totalNotches === 0 ? 0 : filledNotches / totalNotches;

  let nextLabel: string;
  let nextHref: string;
  let weekComplete = false;

  if (!plan) {
    nextLabel = 'Build my plan';
    nextHref = '/support/intake';
  } else if (!intakeDoneThisWeek) {
    nextLabel = 'Start this week’s check-in';
    nextHref = '/support/check-in';
  } else {
    // Pick the first plan step that isn't completed yet.
    const remaining = plan.steps.find((s) => !completedStepHrefs.includes(s.href));
    if (remaining) {
      nextLabel = remaining.title;
      nextHref = remaining.href;
    } else {
      nextLabel = 'You’re all caught up for this week';
      nextHref = '/support/care-plan';
      weekComplete = true;
    }
  }

  return {
    weekStart: progress.weekStart,
    intakeDoneThisWeek,
    completedStepHrefs,
    totalNotches,
    filledNotches,
    fraction,
    nextLabel,
    nextHref,
    weekComplete,
    noPlanYet: !plan,
  };
}
