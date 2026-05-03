'use client';

/**
 * Step 7: shared client-side wellness state derived from the dashboard's
 * existing localStorage data. Read-only — the dashboard owns writes.
 *
 * This is what makes the sliders *do something* outside the dashboard.
 * Home Base reads it (see WellnessMirror); the Care Plan footer reads it.
 *
 * Temporary persistence — when a backend exists, swap the source.
 */

import { useEffect, useState } from 'react';

const HISTORY_KEY = 'cg-history-v2';
const INPUTS_KEY = 'cg-inputs-v2';
const STREAK_KEY = 'cg-streak';

export type Zone = 'steady' | 'watch' | 'at-risk' | 'no-data';
export type Trend = 'improving' | 'steady' | 'declining' | 'unknown';

export type WellnessState = {
  hasData: boolean;
  /** Number of stored history days (last 30 max). */
  historyLen: number;
  /** Most recent history points, oldest → newest. Up to 7 entries. */
  recent: number[];
  /** 0–100 most recent overall. */
  latestOverall: number | null;
  /** Composite zone derived from latest overall. */
  zone: Zone;
  /** Trend over the last 7 vs the prior 7. */
  trend: Trend;
  streak: number;
  /** Slider that has shifted the most over ~7 days. */
  topMover: { field: string; direction: 'up' | 'down'; delta: number } | null;
};

const EMPTY: WellnessState = {
  hasData: false,
  historyLen: 0,
  recent: [],
  latestOverall: null,
  zone: 'no-data',
  trend: 'unknown',
  streak: 0,
  topMover: null,
};

type RawHistoryDay = {
  date: string;
  overall: number;
  stress: number;
  anxiety: number;
  sleep: number;
  support: number;
  energy: number;
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function zoneFor(overall: number): Zone {
  if (overall >= 70) return 'steady';
  if (overall >= 40) return 'watch';
  return 'at-risk';
}

function avg(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((s, n) => s + n, 0) / xs.length;
}

function computeTopMover(history: RawHistoryDay[]): WellnessState['topMover'] {
  if (history.length < 4) return null;
  const recent = history.slice(-7);
  const prior = history.slice(-14, -7);
  if (prior.length < 3) return null;

  const fields: Array<keyof RawHistoryDay> = ['stress', 'anxiety', 'sleep', 'support', 'energy'];
  let best: WellnessState['topMover'] = null;

  for (const field of fields) {
    const recentAvg = avg(recent.map((d) => d[field] as number));
    const priorAvg = avg(prior.map((d) => d[field] as number));
    const delta = recentAvg - priorAvg;
    if (Math.abs(delta) < 4) continue;
    if (!best || Math.abs(delta) > Math.abs(best.delta)) {
      best = { field, direction: delta > 0 ? 'up' : 'down', delta: Math.round(delta) };
    }
  }
  return best;
}

function read(): WellnessState {
  if (typeof window === 'undefined') return EMPTY;

  const history = safeParse<RawHistoryDay[]>(window.localStorage.getItem(HISTORY_KEY));
  const streakRaw = window.localStorage.getItem(STREAK_KEY);
  const streak = streakRaw ? parseInt(streakRaw, 10) || 0 : 0;

  if (!history || history.length === 0) return EMPTY;

  const latest = history[history.length - 1];
  const recent7 = history.slice(-7).map((d) => d.overall);
  const prior7 = history.slice(-14, -7).map((d) => d.overall);

  let trend: Trend = 'unknown';
  if (history.length >= 4) {
    const recAvg = avg(recent7);
    const priAvg = avg(prior7.length ? prior7 : recent7);
    const diff = recAvg - priAvg;
    if (diff >= 4) trend = 'improving';
    else if (diff <= -4) trend = 'declining';
    else trend = 'steady';
  }

  return {
    hasData: true,
    historyLen: history.length,
    recent: recent7,
    latestOverall: latest?.overall ?? null,
    zone: zoneFor(latest?.overall ?? 50),
    trend,
    streak,
    topMover: computeTopMover(history),
  };
}

/**
 * Read-only hook. Hydrates from localStorage on mount; updates on
 * cross-tab storage events (e.g. when the dashboard saves a check-in).
 */
export function useWellnessState(): { state: WellnessState; ready: boolean } {
  const [state, setState] = useState<WellnessState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(read());
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (
        e.key === HISTORY_KEY ||
        e.key === INPUTS_KEY ||
        e.key === STREAK_KEY ||
        e.key === null // localStorage.clear()
      ) {
        setState(read());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { state, ready };
}
