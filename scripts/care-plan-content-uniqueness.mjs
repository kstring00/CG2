import { readFileSync } from 'node:fs';

const parentFirstSource = readFileSync(
  new URL('../src/content/carePlanParentFirst.ts', import.meta.url),
  'utf8',
);
const canonicalSource = readFileSync(
  new URL('../src/content/carePlan.ts', import.meta.url),
  'utf8',
);

const behaviorRows = [
  'big-moments',
  'outings',
  'daily-routines',
  'communication-wall',
  'why-behavior',
];

function skipSpace(source, index) {
  while (/\s/.test(source[index] ?? '')) index += 1;
  return index;
}

function readLiteral(source, index) {
  index = skipSpace(source, index);
  const quote = source[index];
  if (quote !== "'" && quote !== '"') {
    throw new Error(`Expected string literal at source offset ${index}`);
  }

  let cursor = index + 1;
  let escaped = false;
  while (cursor < source.length) {
    const char = source[cursor];
    if (!escaped && char === quote) {
      const raw = source.slice(index, cursor + 1);
      return {
        value: Function(`"use strict"; return (${raw});`)(),
        next: cursor + 1,
      };
    }
    if (!escaped && char === '\\') escaped = true;
    else escaped = false;
    cursor += 1;
  }

  throw new Error(`Unterminated string literal at source offset ${index}`);
}

function extractDrafts(source) {
  const entries = [];
  let cursor = 0;
  while ((cursor = source.indexOf('draft(', cursor)) !== -1) {
    let index = cursor + 'draft('.length;
    const id = readLiteral(source, index);
    index = skipSpace(source, id.next);
    if (source[index] !== ',') throw new Error(`Expected comma after ${id.value}`);
    const text = readLiteral(source, index + 1);
    entries.push({ id: id.value, text: text.value });
    cursor = text.next;
  }
  return entries;
}

const parentFirstEntries = extractDrafts(parentFirstSource).filter((entry) =>
  behaviorRows.some(
    (row) =>
      entry.id.startsWith(`parent-first.${row}.reflect.`) ||
      entry.id.startsWith(`parent-first.${row}.stabilize.`) ||
      entry.id.startsWith(`parent-first.${row}.path.`),
  ),
);

const questionEntries = extractDrafts(canonicalSource).filter((entry) =>
  behaviorRows.some((row) => entry.id.startsWith(`row.${row}.question-`)),
);

const entries = [...parentFirstEntries, ...questionEntries];
const byNormalizedText = new Map();

for (const entry of entries) {
  const normalized = entry.text.replace(/\s+/g, ' ').trim().toLowerCase();
  const existing = byNormalizedText.get(normalized) ?? [];
  existing.push(entry.id);
  byNormalizedText.set(normalized, existing);
}

const duplicates = [...byNormalizedText.entries()].filter(([, ids]) => ids.length > 1);
if (duplicates.length) {
  const report = duplicates
    .map(([text, ids]) => `DUPLICATE: ${JSON.stringify(text)} -> ${ids.join(', ')}`)
    .join('\n');
  throw new Error(`Parent-first copy must be unique across rows.\n${report}`);
}

for (const row of behaviorRows) {
  const rowEntries = entries.filter(
    (entry) =>
      entry.id.startsWith(`parent-first.${row}.reflect.`) ||
      entry.id.startsWith(`parent-first.${row}.stabilize.`) ||
      entry.id.startsWith(`parent-first.${row}.path.`) ||
      entry.id.startsWith(`row.${row}.question-`),
  );
  if (!rowEntries.length) throw new Error(`No uniqueness-audited content found for ${row}`);
}

console.log(
  `PARENT_FIRST_UNIQUENESS_OK rows=${behaviorRows.length} strings=${entries.length} duplicates=0`,
);
