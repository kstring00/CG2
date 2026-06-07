/**
 * Per-week progress meter state.
 *
 * The meter is always visible across the Parent Support area. Its purpose is
 * to show parents exactly where they stand this week:
 *
 *   notch 0 (empty)     → weekly bandwidth check-in not yet done
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

import { loadBandwidth } from './bandwidth';
import {
  getStepCompletionKey,
  loadCarePlan,
  type CarePlanStep,
} from './carePlanStorage';
import { TIER_STEP_LIMIT } from './bandwidth';

const KEY = 'cg.weeklyProgress.v1';
const PREV_KEY = 'cg.weeklyProgress.prev.v1';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type WeeklyProgress = {
  version: 1;
  /** ISO date (YYYY-MM-DD) of the Monday this object represents. */
  weekStart: string;
  /** ISO timestamp when the weekly intake/check-in was explicitly marked done. */
  intakeDoneAt: string | null;
  /** Stable per-step keys marked done this week. Order = completion order. */
  completedStepKeys: string[];
  /** @deprecated Legacy href-based completion — read for backward compat only. */
  completedStepHrefs?: string[];
};

export type WeeklyProgressSummary = {
  /** ISO date of the Monday this summary belongs to. */
  weekStart: string;
  /** Has the weekly bandwidth/intake check-in been completed this week? */
  intakeDoneThisWeek: boolean;
  /** Plan step keys the parent has marked complete this week. */
  completedStepKeys: string[];
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
    completedStepKeys: [],
  };
}

/** True when this step is marked done — key-based, with legacy href fallback. */
export function isStepComplete(
  step: CarePlanStep,
  completedKeys: string[],
  legacyHrefs: string[],
  visibleSteps: CarePlanStep[],
): boolean {
  const key = getStepCompletionKey(step);
  if (completedKeys.includes(key)) return true;
  const hrefDupes = visibleSteps.filter((s) => s.href === step.href).length;
  if (hrefDupes === 1 && legacyHrefs.includes(step.href)) return true;
  return false;
}

/** Merge key-based progress with legacy href completions (unique hrefs only). */
function resolveCompletedKeys(
  progress: WeeklyProgress,
  visibleSteps: CarePlanStep[],
): string[] {
  const keys = new Set(progress.completedStepKeys ?? []);
  const legacyHrefs = progress.completedStepHrefs ?? [];
  for (const href of legacyHrefs) {
    const matches = visibleSteps.filter((s) => s.href === href);
    if (matches.length === 1) keys.add(getStepCompletionKey(matches[0]));
  }
  return [...keys];
}

function readRaw(): WeeklyProgress | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WeeklyProgress> | null;
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.weekStart !== 'string') return null;
    const legacyHrefs = Array.isArray(parsed.completedStepHrefs)
      ? parsed.completedStepHrefs.filter((s): s is string => typeof s === 'string')
      : [];
    const completedStepKeys = Array.isArray(parsed.completedStepKeys)
      ? parsed.completedStepKeys.filter((s): s is string => typeof s === 'string')
      : [];
    return {
      version: 1,
      weekStart: parsed.weekStart,
      intakeDoneAt: typeof parsed.intakeDoneAt === 'string' ? parsed.intakeDoneAt : null,
      completedStepKeys,
      ...(legacyHrefs.length ? { completedStepHrefs: legacyHrefs } : {}),
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

/** Mark a plan step done. Idempotent — same step key won't tick twice. */
export function markStepDone(stepKey: string, now: Date = new Date()): WeeklyProgress {
  const current = loadWeeklyProgress(now);
  if (current.completedStepKeys.includes(stepKey)) return current;
  const next: WeeklyProgress = {
    ...current,
    completedStepKeys: [...current.completedStepKeys, stepKey],
  };
  writeRaw(next);
  return next;
}

/** Unmark a plan step (parent changed their mind). */
export function unmarkStepDone(stepKey: string, now: Date = new Date()): WeeklyProgress {
  const current = loadWeeklyProgress(now);
  if (!current.completedStepKeys.includes(stepKey)) return current;
  const next: WeeklyProgress = {
    ...current,
    completedStepKeys: current.completedStepKeys.filter((k) => k !== stepKey),
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
 *   - the bandwidth result (so a fresh BandwidthCheck this week implicitly
 *     fills the intake notch — the parent doesn't have to do it twice)
 *   - the saved care plan, which provides the *list* of steps. The plan
 *     today is sized by the parent's bandwidth tier (TIER_STEP_LIMIT), so
 *     the meter uses the same visible-step count to stay honest.
 */
export function getWeeklyProgressSummary(now: Date = new Date()): WeeklyProgressSummary {
  const progress = loadWeeklyProgress(now);
  const plan = loadCarePlan();
  const bandwidth = loadBandwidth();

  // Bandwidth recorded inside this calendar week counts as this week's check-in.
  const bandwidthThisWeek = (() => {
    if (!bandwidth?.recordedAt) return false;
    const recorded = new Date(bandwidth.recordedAt);
    if (Number.isNaN(recorded.getTime())) return false;
    return weekStartISO(recorded) === weekStartISO(now);
  })();
  const intakeDoneThisWeek = Boolean(progress.intakeDoneAt) || bandwidthThisWeek;

  // Care plan steps gated by current tier — that's what the parent actually
  // sees on /support/care-plan, so the meter shouldn't promise more notches
  // than steps shown.
  const tier = bandwidth?.tier ?? 'doing-well';
  const stepLimit = TIER_STEP_LIMIT[tier];
  const allSteps = plan?.steps ?? [];
  const visibleSteps = allSteps.slice(0, stepLimit);
  const stepCount = visibleSteps.length;
  const totalNotches = 1 + stepCount; // intake + each visible plan step

  const legacyHrefs = progress.completedStepHrefs ?? [];
  const resolvedKeys = resolveCompletedKeys(progress, visibleSteps);
  const validStepKeys = new Set(visibleSteps.map(getStepCompletionKey));
  const completedStepKeys = resolvedKeys.filter((k) => validStepKeys.has(k));
  const filledNotches =
    (intakeDoneThisWeek ? 1 : 0) +
    visibleSteps.filter((s) =>
      isStepComplete(s, completedStepKeys, legacyHrefs, visibleSteps),
    ).length;
  const fraction = totalNotches === 0 ? 0 : filledNotches / totalNotches;

  let nextLabel: string;
  let nextHref: string;
  let weekComplete = false;

  if (!plan) {
    nextLabel = 'Build my plan';
    nextHref = '/support/intake';
  } else if (!intakeDoneThisWeek) {
    nextLabel = 'Start this week’s check-in';
    nextHref = '/support/intake';
  } else {
    const remaining = visibleSteps.find(
      (s) => !isStepComplete(s, completedStepKeys, legacyHrefs, visibleSteps),
    );
    if (remaining) {
      nextLabel = remaining.title;
      nextHref = remaining.href;
    } else {
      nextLabel = 'You’re all caught up for this week';
      nextHref = '/support/care-plan';
      weekComplete = true;
    }
  }

  // Quiet the unused-import warning on MS_PER_DAY — kept exported in case
  // future logic wants a day-precision diff.
  void MS_PER_DAY;

  return {
    weekStart: progress.weekStart,
    intakeDoneThisWeek,
    completedStepKeys,
    totalNotches,
    filledNotches,
    fraction,
    nextLabel,
    nextHref,
    weekComplete,
    noPlanYet: !plan,
  };
}
