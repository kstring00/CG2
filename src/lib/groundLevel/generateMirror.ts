'use client';

import type { CategoryId, GroundLevelInputs, LoadTier } from './types';
import { generateMirrorTemplate } from './mirrorTemplates';

/**
 * Client-side mirror generator. Calls our server route which proxies
 * Anthropic. If the server is unavailable, the key isn't configured, the
 * call fails, or the network is offline, we fall through to the template
 * fallback so the page always works.
 */
export async function generateMirror(
  inputs: GroundLevelInputs,
  tier: LoadTier,
  topCategoryId: CategoryId,
): Promise<string> {
  try {
    const res = await fetch('/api/ground-level/mirror', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs, tier, topCategory: topCategoryId }),
    });
    if (!res.ok) throw new Error(`server returned ${res.status}`);
    const data = await res.json();
    const text = typeof data.text === 'string' ? data.text.trim() : '';
    if (!text) throw new Error('empty response');
    return text;
  } catch (err) {
    if (typeof console !== 'undefined') {
      console.warn('Ground Level mirror AI call failed; using template fallback', err);
    }
    return generateMirrorTemplate(inputs, tier, topCategoryId);
  }
}
