// Applies the deployment's org name to a pre-built PDF blob.
//
// The three card/guide worksheets ship as encoded PDF blobs rather than being
// laid out at build time, so the brand string sits inside the byte stream and
// the xref table's offsets depend on it. We therefore patch in place at a fixed
// width — the same approach finalize-worksheet-assets.mjs already uses — which
// keeps every byte offset and /Length valid without re-laying out the PDF.
import { SITE, ORG_HEADER } from './site-config.mjs';

/** Pad (never truncate) so byte offsets in the xref table stay correct. */
function fixedWidth(value, width, context) {
  if (value.length > width) {
    throw new Error(
      `Org name "${value}" is ${value.length} chars but only ${width} fit in ${context}. ` +
        'Shorten NEXT_PUBLIC_SITE_ORG_NAME or rebuild this worksheet from a generator script.',
    );
  }
  return value.padEnd(width, ' ');
}

/**
 * Replace legacy brand strings in a decoded PDF (latin1 string) with the
 * configured org name. Returns the patched string.
 */
export function applyBrand(pdfLatin1, file) {
  let out = pdfLatin1;
  const replacements = [
    ['TEXAS ABA CENTERS', ORG_HEADER],
    ['Texas ABA Centers - Common Ground', SITE.orgName],
    ['Texas ABA Centers', SITE.orgName],
  ];
  for (const [before, after] of replacements) {
    if (!out.includes(before)) continue;
    out = out.replaceAll(before, fixedWidth(after, before.length, file));
  }
  return out;
}

export default applyBrand;
