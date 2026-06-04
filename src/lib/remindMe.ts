/**
 * Tiny localStorage helper for the "Remind me next week" toggle on the care
 * plan page. We do not send real notifications — Common Ground has no email
 * backend wired up. Instead, a saved timestamp drives the in-site reminder
 * banner that shows up when the parent comes back on or after that date.
 *
 * Saved privately on this device. Clearing browser data removes it.
 */

const KEY = 'cg.remindMe.v1';
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_DELAY_DAYS = 7;

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/** Returns the ISO date the parent asked us to remind them on, or null. */
export function getRemindAt(): string | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { remindAt?: unknown };
    if (parsed && typeof parsed.remindAt === 'string') return parsed.remindAt;
    return null;
  } catch {
    return null;
  }
}

/** Set the reminder for 7 days from now (default) or a custom day offset. */
export function setRemindMeNextWeek(daysFromNow: number = DEFAULT_DELAY_DAYS): string {
  const target = new Date(Date.now() + daysFromNow * MS_PER_DAY).toISOString();
  if (isBrowser()) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ remindAt: target }));
    } catch {
      /* quota / private mode */
    }
  }
  return target;
}

export function clearRemindMeNextWeek() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

/** True when a reminder is currently scheduled (regardless of whether it is due). */
export function isRemindMeSet(): boolean {
  return getRemindAt() !== null;
}

/** True when a reminder is set AND its date has arrived. */
export function isRemindMeDue(now: Date = new Date()): boolean {
  const at = getRemindAt();
  if (!at) return false;
  const target = new Date(at);
  if (Number.isNaN(target.getTime())) return false;
  return target.getTime() <= now.getTime();
}
