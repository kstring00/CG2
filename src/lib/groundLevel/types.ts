/**
 * Ground Level — types shared across the bandwidth-mirror feature.
 *
 * This is a private, on-device tool. No PHI, no scoring, no streak. The
 * total "load" number we compute is intentionally never shown to the
 * parent — it exists so the page can decide what to render and how loud
 * to be.
 */

export const CATEGORIES = [
  { id: 'caregiving', label: 'Caregiving' },
  { id: 'work', label: 'Work' },
  { id: 'money', label: 'Money' },
  { id: 'partner', label: 'Marriage / Partner' },
  { id: 'self', label: 'Self' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export type CategoryReading = {
  heaviness: number; // 0–10
  support: number; // 0–10
};

export type GroundLevelInputs = Record<CategoryId, CategoryReading>;

export type LoadTier = 'light' | 'moderate' | 'heavy' | 'crushing';

export type GroundLevelEntry = {
  timestamp: string; // ISO
  inputs: GroundLevelInputs;
  totalLoad: number; // computed; not shown
  tier: LoadTier;
  mirrorText: string;
};

export type GroundLevelHistory = {
  entries: GroundLevelEntry[]; // newest first, capped at 30
};

export type NextStep = {
  label: string;
  href: string;
};

export const DEFAULT_READING: CategoryReading = { heaviness: 5, support: 5 };

export const DEFAULT_INPUTS: GroundLevelInputs = {
  caregiving: { ...DEFAULT_READING },
  work: { ...DEFAULT_READING },
  money: { ...DEFAULT_READING },
  partner: { ...DEFAULT_READING },
  self: { ...DEFAULT_READING },
};
