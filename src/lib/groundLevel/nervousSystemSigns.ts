/**
 * The 9 nervous-system lines — verbatim from the spec. Do not edit, soften,
 * or reorder these. They are the founder's voice.
 */

import type { GroundLevelInputs, LoadTier } from './types';
import { CATEGORIES } from './types';

export const NERVOUS_SYSTEM_SIGNS = [
  "A pull to leave the room. Not because you don't love them — because the part of you that recharges by being alone hasn't had a chance to in a long time, and your body is asking for it the only way it knows how.",
  "A shorter fuse than usual. Frustration that comes faster, lands bigger, and surprises you afterward.",
  "Wanting to escape — the car, the bathroom, your phone, anywhere that isn't here — even when you know you can't actually go.",
  "Feeling pulled in directions you can't physically split into. Like every part of your life is asking for the energy you don't have, and you can't choose because choosing means failing one of them.",
  "Trouble falling asleep even when you're exhausted, or sleep that doesn't restore.",
  "Forgetting small things. Walking into rooms and not knowing why. Decisions feeling bigger than they should.",
  "A tightness somewhere that doesn't go away — chest, jaw, shoulders, stomach.",
  "Feeling either too much at once, or nothing at all. Both are the nervous system doing what it does when there's nowhere to put the load.",
  "Snapping at the people you love most, then feeling worse about it than the moment deserved.",
] as const;

/**
 * Pick which lines to show, based on the parent's pattern.
 * Cap at 6. Only call this when tier is 'heavy' or 'crushing' — for lighter
 * tiers the section doesn't render at all.
 */
export function selectSigns(inputs: GroundLevelInputs, tier: LoadTier): string[] {
  // Index 0..8 of NERVOUS_SYSTEM_SIGNS
  const picks = new Set<number>();

  // Parent-specific signals first.
  if (inputs.self.heaviness >= 7 || inputs.self.support <= 3) {
    picks.add(0); // pull to leave the room
  }

  const anyHigh = CATEGORIES.some((c) => inputs[c.id].heaviness >= 8);
  if (anyHigh) {
    picks.add(1); // shorter fuse
    picks.add(8); // snapping at people you love
  }

  if (inputs.partner.heaviness >= 6) {
    picks.add(8); // snapping at people you love (re-affirms; Set dedupes)
  }

  const heavyCount = CATEGORIES.filter((c) => inputs[c.id].heaviness >= 7).length;
  if (heavyCount >= 2) {
    picks.add(3); // pulled in directions
  }

  // Tier-default signals: high-load body language.
  if (tier === 'heavy' || tier === 'crushing') {
    picks.add(4); // sleep that doesn't restore
    picks.add(5); // forgetting small things
    picks.add(6); // tightness somewhere
  }

  if (tier === 'crushing') {
    picks.add(7); // too much / nothing at all
  }

  // Priority order: parent-specific lines first, then tier-default, then others.
  // Indices grouped by signal type:
  const parentSpecific = [0, 3, 8];
  const tierDefault = [4, 5, 6, 1];
  const escape = [2, 7];

  const ordered: number[] = [];
  for (const i of [...parentSpecific, ...tierDefault, ...escape]) {
    if (picks.has(i) && !ordered.includes(i)) ordered.push(i);
  }

  return ordered.slice(0, 6).map((i) => NERVOUS_SYSTEM_SIGNS[i]);
}
