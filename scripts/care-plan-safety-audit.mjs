import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const roots = [
  'src/app/support/intake',
  'src/app/support/care-plan',
  'src/lib/buildPlan.ts',
  'src/content/carePlanParentFirst.ts',
];

function filesUnder(path) {
  if (statSync(path).isFile()) return [path];
  return readdirSync(path).flatMap((name) => filesUnder(join(path, name)));
}

const files = roots.flatMap(filesUnder).filter((path) => /\.(ts|tsx)$/.test(path));
const sources = files.map((path) => ({ path, source: readFileSync(path, 'utf8') }));

function locations(pattern) {
  const found = [];
  for (const { path, source } of sources) {
    const lines = source.split('\n');
    lines.forEach((line, index) => {
      if (pattern.test(line)) found.push(`${relative('.', path)}:${index + 1}:${line.trim()}`);
      pattern.lastIndex = 0;
    });
  }
  return found;
}

const storageMatches = locations(/localStorage|sessionStorage|document\.cookie/);
const unexpectedStorage = storageMatches.filter(
  (line) =>
    !line.includes('LegacyStoredDataCleanup.tsx') ||
    !line.includes('localStorage.removeItem'),
);
if (unexpectedStorage.length) {
  throw new Error(`Unexpected storage access:\n${unexpectedStorage.join('\n')}`);
}
console.log(`STORAGE_AUDIT_OK allowed_legacy_deletions=${storageMatches.length}`);

const networkMatches = locations(/fetch\(|axios|ai-gateway|AI_GATEWAY_API_KEY|AI_INTAKE_MODEL/);
if (networkMatches.length) {
  throw new Error(`Runtime network or AI reference found:\n${networkMatches.join('\n')}`);
}
console.log('NETWORK_AI_AUDIT_OK matches=0');

const formMatches = locations(/<form\b/);
if (formMatches.length) {
  throw new Error(`Form element found in Care Plan flow:\n${formMatches.join('\n')}`);
}
console.log('FORM_AUDIT_OK matches=0');

for (const { path, source } of sources) {
  if (/<textarea\b/i.test(source) || /contenteditable/i.test(source)) {
    throw new Error(`Free-text control found in ${path}`);
  }

  const inputTags = source.match(/<input\b[\s\S]*?\/>/gi) ?? [];
  for (const tag of inputTags) {
    const type = tag.match(/type=["']([^"']+)["']/i)?.[1];
    if (type !== 'radio' && type !== 'checkbox') {
      throw new Error(`Forbidden input type in ${path}: ${tag.replace(/\s+/g, ' ')}`);
    }
  }
}

const inputSummary = sources.flatMap(({ path, source }) =>
  (source.match(/<input\b[\s\S]*?\/>/gi) ?? []).map((tag) => {
    const type = tag.match(/type=["']([^"']+)["']/i)?.[1] ?? 'missing';
    return `${relative('.', path)}:type=${type}`;
  }),
);
console.log(`INPUT_AUDIT_OK ${inputSummary.join(' ') || 'no-inputs'}`);
console.log('FREE_TEXT_AUDIT_OK textarea=0 contenteditable=0');
