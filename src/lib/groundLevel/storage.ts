/**
 * Ground Level — localStorage persistence.
 *
 * Stays on the parent's device. Nothing leaves the browser.
 */

import type { GroundLevelEntry, GroundLevelHistory } from './types';

export const GROUND_LEVEL_STORAGE_KEY = 'cg_ground_level_v1';
const MAX_ENTRIES = 30;

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadHistory(): GroundLevelHistory {
  if (!isBrowser()) return { entries: [] };
  try {
    const raw = window.localStorage.getItem(GROUND_LEVEL_STORAGE_KEY);
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.entries)) return { entries: [] };
    return { entries: parsed.entries.slice(0, MAX_ENTRIES) as GroundLevelEntry[] };
  } catch {
    return { entries: [] };
  }
}

export function loadLatestEntry(): GroundLevelEntry | null {
  const { entries } = loadHistory();
  return entries[0] ?? null;
}

export function saveEntry(entry: GroundLevelEntry): GroundLevelHistory {
  const current = loadHistory();
  const next: GroundLevelHistory = {
    entries: [entry, ...current.entries].slice(0, MAX_ENTRIES),
  };
  if (isBrowser()) {
    try {
      window.localStorage.setItem(GROUND_LEVEL_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota / private mode
    }
  }
  return next;
}

export function clearHistory() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(GROUND_LEVEL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Days since the most recent entry, or null if no history yet. */
export function daysSinceLastEntry(): number | null {
  const latest = loadLatestEntry();
  if (!latest) return null;
  const ms = Date.now() - new Date(latest.timestamp).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}
