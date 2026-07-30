import { readFileSync } from 'node:fs';

const files = [
  {
    name: 'src/content/carePlan.ts',
    source: readFileSync(new URL('../src/content/carePlan.ts', import.meta.url), 'utf8'),
    callNames: ['draft'],
  },
  {
    name: 'src/content/carePlanSixBeatDraft.ts',
    source: readFileSync(new URL('../src/content/carePlanSixBeatDraft.ts', import.meta.url), 'utf8'),
    callNames: ['d'],
  },
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

for (const file of files) {
  for (const callName of file.callNames) {
    let cursor = 0;
    const needle = `${callName}(`;
    while ((cursor = file.source.indexOf(needle, cursor)) !== -1) {
      let index = cursor + needle.length;
      const id = readLiteral(file.source, index);
      index = skipSpace(file.source, id.next);
      if (file.source[index] !== ',') throw new Error(`Expected comma after ${id.value}`);
      const text = readLiteral(file.source, index + 1);
      entries.push({ id: id.value, text: text.value, file: file.name });
      cursor = text.next;
    }
  }
}

const duplicateIds = entries
  .map((entry) => entry.id)
  .filter((id, index, all) => all.indexOf(id) !== index);
if (duplicateIds.length) {
  throw new Error(`Duplicate copy IDs: ${[...new Set(duplicateIds)].join(', ')}`);
}

console.log('CARE_PLAN_COPY_CHECKLIST_BEGIN');
entries.forEach((entry, index) => {
  console.log(`${index + 1}. ${entry.id} — ${entry.text.replace(/\s+/g, ' ').trim()} [${entry.file}]`);
});
console.log(`CARE_PLAN_COPY_CHECKLIST_COUNT=${entries.length}`);
console.log('CARE_PLAN_COPY_CHECKLIST_END');
