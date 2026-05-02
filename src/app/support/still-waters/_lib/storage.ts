import type { Entry, Mood } from './types';

/**
 * Local-only persistence for journal entries.
 *
 * Common Ground does not have authenticated parent accounts yet, so v1 keeps
 * entries in the parent's own browser via localStorage. The "encryption at
 * rest" requirement from the spec depends on a real auth/backend layer; until
 * that exists, entries never leave the device. When auth is added, replace
 * `loadAll` / `saveEntry` / `deleteEntry` with server calls — the rest of the
 * UI talks only to this module.
 */

const STORAGE_KEY = 'still-waters:entries:v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readRaw(): Entry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Entry[];
  } catch {
    return [];
  }
}

function writeRaw(entries: Entry[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function loadAll(): Entry[] {
  return readRaw().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function loadById(id: string): Entry | null {
  return readRaw().find((e) => e.id === id) ?? null;
}

export function newEntryId(): string {
  return `e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export type EntryDraft = {
  id: string;
  mood: Mood | null;
  promptId: string | null;
  promptText: string | null;
  body: string;
};

export function saveEntry(draft: EntryDraft): Entry {
  const all = readRaw();
  const now = new Date().toISOString();
  const existing = all.find((e) => e.id === draft.id);

  const entry: Entry = existing
    ? { ...existing, ...draft, updatedAt: now }
    : {
        id: draft.id,
        createdAt: now,
        updatedAt: now,
        mood: draft.mood,
        promptId: draft.promptId,
        promptText: draft.promptText,
        body: draft.body,
        meaningful: false,
      };

  const next = existing
    ? all.map((e) => (e.id === entry.id ? entry : e))
    : [...all, entry];
  writeRaw(next);
  return entry;
}

export function deleteEntry(id: string): void {
  writeRaw(readRaw().filter((e) => e.id !== id));
}

export function toggleMeaningful(id: string): Entry | null {
  const all = readRaw();
  const idx = all.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const updated: Entry = { ...all[idx], meaningful: !all[idx].meaningful };
  all[idx] = updated;
  writeRaw(all);
  return updated;
}

/**
 * Returns entries whose createdAt month/day matches today's, from prior years
 * or prior multi-month windows. Buckets: 1 year ago, 6 months ago, 3 months
 * ago — within a small window so a missed day still surfaces something.
 */
export type LookBackBucket = {
  label: string;
  entries: Entry[];
};

export function getLookBack(now: Date = new Date()): LookBackBucket[] {
  const all = readRaw();
  const buckets: { label: string; targetDays: number; windowDays: number }[] = [
    { label: 'A year ago', targetDays: 365, windowDays: 3 },
    { label: 'Six months ago', targetDays: 182, windowDays: 4 },
    { label: 'Three months ago', targetDays: 91, windowDays: 4 },
  ];

  const dayMs = 24 * 60 * 60 * 1000;
  const result: LookBackBucket[] = [];
  for (const b of buckets) {
    const target = new Date(now.getTime() - b.targetDays * dayMs);
    const matches = all.filter((e) => {
      const created = new Date(e.createdAt).getTime();
      return Math.abs(created - target.getTime()) <= b.windowDays * dayMs;
    });
    if (matches.length > 0) {
      result.push({ label: b.label, entries: matches });
    }
  }
  return result;
}

export function firstLine(body: string, max = 120): string {
  const trimmed = body.trim();
  if (!trimmed) return '';
  const line = trimmed.split(/\r?\n/).find((l) => l.trim().length > 0) ?? '';
  return line.length > max ? line.slice(0, max).trimEnd() + '…' : line;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
