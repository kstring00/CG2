'use client';

import { useCallback, useEffect, useState } from 'react';

export type ParentContext = {
  childAge: string | null;
  currentSituation: string | null;
  lastVisit: string | null;
  lastSection: string | null;
  calmModeUsedAt: string | null;
};

export const PARENT_CONTEXT_STORAGE_KEY = 'cg_parent_context';

const DEFAULT_CONTEXT: ParentContext = {
  childAge: null,
  currentSituation: null,
  lastVisit: null,
  lastSection: null,
  calmModeUsedAt: null,
};

const FIELDS: (keyof ParentContext)[] = [
  'childAge',
  'currentSituation',
  'lastVisit',
  'lastSection',
  'calmModeUsedAt',
];

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readFromStorage(): ParentContext {
  if (!isBrowser()) return DEFAULT_CONTEXT;
  try {
    const raw = window.localStorage.getItem(PARENT_CONTEXT_STORAGE_KEY);
    if (!raw) return DEFAULT_CONTEXT;
    const parsed = JSON.parse(raw) as Partial<ParentContext> | null;
    if (!parsed || typeof parsed !== 'object') return DEFAULT_CONTEXT;
    const next: ParentContext = { ...DEFAULT_CONTEXT };
    for (const key of FIELDS) {
      const value = parsed[key];
      next[key] = typeof value === 'string' ? value : null;
    }
    return next;
  } catch {
    return DEFAULT_CONTEXT;
  }
}

function writeToStorage(value: ParentContext) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(PARENT_CONTEXT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* noop — storage may be full or disabled */
  }
}

function removeFromStorage() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(PARENT_CONTEXT_STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export type UseParentContextReturn = {
  context: ParentContext;
  setContext: (partial: Partial<ParentContext>) => void;
  clearContext: () => void;
  ready: boolean;
};

export function useParentContext(): UseParentContextReturn {
  const [context, setContextState] = useState<ParentContext>(DEFAULT_CONTEXT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setContextState(readFromStorage());
    setReady(true);
  }, []);

  const setContext = useCallback((partial: Partial<ParentContext>) => {
    setContextState((prev) => {
      const next: ParentContext = { ...prev };
      for (const key of FIELDS) {
        if (key in partial) {
          const value = partial[key];
          next[key] = typeof value === 'string' ? value : null;
        }
      }
      writeToStorage(next);
      return next;
    });
  }, []);

  const clearContext = useCallback(() => {
    removeFromStorage();
    setContextState(DEFAULT_CONTEXT);
  }, []);

  return { context, setContext, clearContext, ready };
}
