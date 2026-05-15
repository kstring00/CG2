/**
 * Returning-parent weekly check-in storage + week tracking.
 *
 * Lives entirely on the parent's device (localStorage). Stores:
 *   - planStartedAt           when the parent first finished intake
 *   - parentEmail             optional, for sending the plan to themselves
 *   - lastCheckInAt           ISO date of most recent check-in
 *   - history                 lightweight per-week summaries (capped)
 *
 * Intentionally light — no clinical detail, no child PHI beyond what the
 * intake already saves. Summaries only.
 */

import type { WeekMood } from './carePlanStorage';

const KEY = 'cg.weeklyCheckIn.v1';
const MAX_HISTORY = 26; // ~6 months
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type ParentStress = 'low' | 'moderate' | 'high' | 'overwhelmed';
export type ParentConfidence = 'shaky' | 'mixed' | 'steady' | 'strong';
export type ChildProgress = 'harder' | 'about-same' | 'small-wins' | 'real-progress';
export type TriedSteps = 'all' | 'some' | 'none' | 'not-sure';

export type ResourceNeed =
  | 'practical-info'
  | 'local-providers'
  | 'someone-to-talk-to'
  | 'time-for-me'
  | 'school-iep'
  | 'financial'
  | 'sleep-sensory'
  | 'nothing-right-now';

export type WeeklyCheckInAnswers = {
  parentStress: ParentStress;
  parentConfidence: ParentConfidence;
  childProgress: ChildProgress;
  triedSteps: TriedSteps;
  newConcerns: string | null;
  resourceNeeds: ResourceNeed[];
  weekMood: WeekMood | null;
};

export type WeeklyCheckInEntry = {
  weekNumber: number;
  completedAt: string; // ISO
  answers: WeeklyCheckInAnswers;
  summary: string;
  nextSteps: string[];
};

export type WeeklyCheckInState = {
  version: 1;
  planStartedAt: string | null; // ISO; null until first intake completes
  parentEmail: string | null;
  lastCheckInAt: string | null; // ISO
  history: WeeklyCheckInEntry[];
};

const EMPTY: WeeklyCheckInState = {
  version: 1,
  planStartedAt: null,
  parentEmail: null,
  lastCheckInAt: null,
  history: [],
};

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadCheckInState(): WeeklyCheckInState {
  if (!isBrowser()) return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<WeeklyCheckInState> | null;
    if (!parsed || typeof parsed !== 'object') return EMPTY;
    return {
      version: 1,
      planStartedAt: typeof parsed.planStartedAt === 'string' ? parsed.planStartedAt : null,
      parentEmail: typeof parsed.parentEmail === 'string' ? parsed.parentEmail : null,
      lastCheckInAt: typeof parsed.lastCheckInAt === 'string' ? parsed.lastCheckInAt : null,
      history: Array.isArray(parsed.history) ? (parsed.history as WeeklyCheckInEntry[]).slice(-MAX_HISTORY) : [],
    };
  } catch {
    return EMPTY;
  }
}

function writeState(next: WeeklyCheckInState) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}

/**
 * Mark the plan as started. Idempotent — only sets the date the first time
 * so the week count remains stable across re-runs of intake. Accepts an
 * optional `startedAtISO` to backfill from an existing plan's createdAt.
 */
export function ensurePlanStarted(startedAtISO?: string, now: Date = new Date()): WeeklyCheckInState {
  const state = loadCheckInState();
  if (state.planStartedAt) return state;
  const stamp = startedAtISO && !Number.isNaN(new Date(startedAtISO).getTime())
    ? new Date(startedAtISO).toISOString()
    : now.toISOString();
  const next: WeeklyCheckInState = { ...state, planStartedAt: stamp };
  writeState(next);
  return next;
}

export function setParentEmail(email: string | null): WeeklyCheckInState {
  const state = loadCheckInState();
  const cleaned = email && email.trim() ? email.trim() : null;
  const next: WeeklyCheckInState = { ...state, parentEmail: cleaned };
  writeState(next);
  return next;
}

export function recordCheckIn(entry: Omit<WeeklyCheckInEntry, 'completedAt'>, now: Date = new Date()): WeeklyCheckInState {
  const state = loadCheckInState();
  const completed: WeeklyCheckInEntry = { ...entry, completedAt: now.toISOString() };
  const history = [...state.history, completed].slice(-MAX_HISTORY);
  const next: WeeklyCheckInState = {
    ...state,
    planStartedAt: state.planStartedAt ?? now.toISOString(),
    lastCheckInAt: now.toISOString(),
    history,
  };
  writeState(next);
  return next;
}

export function clearCheckInState() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

// ---------------------------------------------------------------------------
// Week math
// ---------------------------------------------------------------------------

/** Returns the 1-indexed week number the parent is in, given a start date. */
export function computeWeekNumber(planStartedAt: string | null, now: Date = new Date()): number {
  if (!planStartedAt) return 1;
  const start = new Date(planStartedAt);
  if (Number.isNaN(start.getTime())) return 1;
  const diffDays = Math.floor((now.getTime() - start.getTime()) / MS_PER_DAY);
  return Math.max(1, Math.floor(diffDays / 7) + 1);
}

/** Date of the upcoming (or current) Monday. */
export function nextMonday(now: Date = new Date()): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const offset = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
  d.setDate(d.getDate() + offset);
  return d;
}

/** Has the parent already completed this calendar week's check-in? */
export function hasCheckedInThisWeek(state: WeeklyCheckInState, now: Date = new Date()): boolean {
  if (!state.lastCheckInAt) return false;
  const last = new Date(state.lastCheckInAt);
  if (Number.isNaN(last.getTime())) return false;
  return startOfWeek(last).getTime() === startOfWeek(now).getTime();
}

/** Monday 00:00 of the calendar week containing `d`. */
function startOfWeek(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  const day = out.getDay();
  const offsetToMonday = day === 0 ? -6 : 1 - day;
  out.setDate(out.getDate() + offsetToMonday);
  return out;
}

/**
 * True when today is Monday or later in the week, AND the parent has not
 * checked in this calendar week. This is what powers the in-site reminder.
 */
export function shouldShowMondayReminder(state: WeeklyCheckInState, now: Date = new Date()): boolean {
  if (!state.planStartedAt) return false;
  // Day 0 of week-1 doesn't need a reminder; let things settle a few days.
  const ageDays = (now.getTime() - new Date(state.planStartedAt).getTime()) / MS_PER_DAY;
  if (ageDays < 3) return false;
  return !hasCheckedInThisWeek(state, now);
}

export function formatShortDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
