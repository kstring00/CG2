/**
 * Home Base day-check — presentation layer only.
 *
 * Persists for the browser session (sessionStorage). Resets when the tab closes.
 * Does not touch the care plan, arc engine, or completion state.
 */

export type HomeBaseDayMood = 'good' | 'in-between' | 'rough';

const KEY = 'cg.homeBase.dayCheck.v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

export function loadHomeBaseDayMood(): HomeBaseDayMood | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw === 'good' || raw === 'in-between' || raw === 'rough') return raw;
    return null;
  } catch {
    return null;
  }
}

export function saveHomeBaseDayMood(mood: HomeBaseDayMood | null): void {
  if (!isBrowser()) return;
  try {
    if (mood === null) window.sessionStorage.removeItem(KEY);
    else window.sessionStorage.setItem(KEY, mood);
  } catch {
    /* private mode — in-memory only for this page load */
  }
}

/** Short self-care lead when the parent taps "rough day" — not a plan step. */
export const ROUGH_DAY_SELF_CARE = {
  title: 'Take four minutes for yourself',
  body: 'Open this when you are running on empty. A short, guided reset you can do right now — the rest can wait until you have caught your breath.',
  href: '/support/caregiver',
} as const;
