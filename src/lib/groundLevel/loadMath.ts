/**
 * Ground Level — load calculations.
 *
 * The math is not shown to the parent. It's a private signal the page uses
 * to decide what to render: which mirror tone, whether the
 * nervous-system list appears, which next-step links surface.
 */

import type { CategoryId, GroundLevelInputs, LoadTier } from './types';
import { CATEGORIES } from './types';

/** Per-category load: heaviness × (10 − support). Range 0–100. */
export function categoryLoad(reading: { heaviness: number; support: number }): number {
  return reading.heaviness * (10 - reading.support);
}

/**
 * Total load: sum of per-category loads, capped at 350. Past the cap the
 * body doesn't add more — it breaks down differently. The cap keeps the
 * tier mapping honest at the high end.
 */
export function totalLoad(inputs: GroundLevelInputs): number {
  let sum = 0;
  for (const cat of CATEGORIES) {
    sum += categoryLoad(inputs[cat.id]);
  }
  return Math.min(sum, 350);
}

export function loadTier(total: number): LoadTier {
  if (total < 80) return 'light';
  if (total < 160) return 'moderate';
  if (total < 250) return 'heavy';
  return 'crushing';
}

/** The category carrying the most load right now. Ties break by CATEGORIES order. */
export function topCategory(inputs: GroundLevelInputs): CategoryId {
  let bestId: CategoryId = CATEGORIES[0].id;
  let bestLoad = -1;
  for (const cat of CATEGORIES) {
    const load = categoryLoad(inputs[cat.id]);
    if (load > bestLoad) {
      bestLoad = load;
      bestId = cat.id;
    }
  }
  return bestId;
}
