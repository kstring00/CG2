import { readFileSync } from 'node:fs';

const parentFirstFiles = [
  'carePlanParentFirst.ts',
  'carePlanParentFirstLoad.ts',
  'carePlanParentFirstEmpty.ts',
  'carePlanParentFirstWorking.ts',
  'carePlanParentFirstEvaluation.ts',
];

const parentFirstSources = parentFirstFiles.map((file) =>
  readFileSync(new URL(`../src/content/${file}`, import.meta.url), 'utf8'),
);
const teamNoSource = readFileSync(
  new URL('../src/content/carePlanParentFirstTeamNo.ts', import.meta.url),
  'utf8',
);
const canonicalSource = readFileSync(
  new URL('../src/content/carePlan.ts', import.meta.url),
  'utf8',
);

const rows = [
  'big-moments',
  'outings',
  'daily-routines',
  'communication-wall',
  'why-behavior',
  'alone',
  'marriage-strain',
  'partner-load',
  'judged',
  'cannot-keep-doing',
  'nothing-left',
  'grieving',
  'disappeared',
  'thinking-stopping',
  'no-progress',
  'sessions-concern',
  'unclear-care',
  'deciding',
  'first-months',
  'judging-provider',
  'what-is-aba',
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

const parentFirstEntries = parentFirstSources
  .flatMap(extractDrafts)
  .filter((entry) =>
    rows.some(
      (row) =>
        entry.id.startsWith(`parent-first.${row}.reflect.`) ||
        entry.id.startsWith(`parent-first.${row}.stabilize.`) ||
        entry.id.startsWith(`parent-first.${row}.path.`),
    ),
  );

const teamYesQuestions = extractDrafts(canonicalSource).filter((entry) =>
  rows.some((row) => entry.id.startsWith(`row.${row}.question-`)),
);
const teamNoQuestions = extractDrafts(teamNoSource).filter((entry) =>
  entry.id.startsWith('parent-first.team-no.'),
);

const entries = [...parentFirstEntries, ...teamYesQuestions, ...teamNoQuestions];
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
  throw new Error(`Parent-first copy must be unique across rows and team modes.\n${report}`);
}

for (const row of rows) {
  const rowEntries = entries.filter(
    (entry) =>
      entry.id.startsWith(`parent-first.${row}.reflect.`) ||
      entry.id.startsWith(`parent-first.${row}.stabilize.`) ||
      entry.id.startsWith(`parent-first.${row}.path.`) ||
      entry.id.startsWith(`row.${row}.question-`) ||
      entry.id.startsWith(`parent-first.team-no.${row}.question-`),
  );
  if (!rowEntries.length) throw new Error(`No uniqueness-audited content found for ${row}`);
}

console.log(
  `PARENT_FIRST_UNIQUENESS_OK rows=${rows.length} strings=${entries.length} duplicates=0 team_modes=2`,
);
