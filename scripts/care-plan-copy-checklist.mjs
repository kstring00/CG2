import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/content/carePlan.ts', import.meta.url), 'utf8');

function skipSpace(index) {
  while (/\s/.test(source[index] ?? '')) index += 1;
  return index;
}

function readLiteral(index) {
  index = skipSpace(index);
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
      // Source is trusted and literals contain only authored copy.
      const value = Function(`"use strict"; return (${raw});`)();
      return { value, next: cursor + 1 };
    }
    if (!escaped && char === '\\') escaped = true;
    else escaped = false;
    cursor += 1;
  }

  throw new Error(`Unterminated string literal at source offset ${index}`);
}

const entries = [];
let cursor = 0;
while ((cursor = source.indexOf('draft(', cursor)) !== -1) {
  let index = cursor + 'draft('.length;
  const id = readLiteral(index);
  index = skipSpace(id.next);
  if (source[index] !== ',') throw new Error(`Expected comma after ${id.value}`);
  const text = readLiteral(index + 1);
  entries.push({ id: id.value, text: text.value });
  cursor = text.next;
}

const duplicateIds = entries
  .map((entry) => entry.id)
  .filter((id, index, all) => all.indexOf(id) !== index);
if (duplicateIds.length) {
  throw new Error(`Duplicate copy IDs: ${[...new Set(duplicateIds)].join(', ')}`);
}

console.log('CARE_PLAN_COPY_CHECKLIST_BEGIN');
entries.forEach((entry, index) => {
  console.log(`${index + 1}. ${entry.id} — ${entry.text.replace(/\s+/g, ' ').trim()}`);
});
console.log(`CARE_PLAN_COPY_CHECKLIST_COUNT=${entries.length}`);
console.log('CARE_PLAN_COPY_CHECKLIST_END');
