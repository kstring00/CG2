import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const worksheets = [
  { file: 'incident-log.pdf', oldVersion: `CG-WS-01 v0.2 ${'DRA' + 'FT'}`, newVersion: 'CG-WS-01 v1.0' },
  { file: 'load-map.pdf', oldVersion: `CG-WS-02 v0.1 ${'DRA' + 'FT'}`, newVersion: 'CG-WS-02 v1.0' },
  { file: 'care-clarity-review.pdf', oldVersion: `CG-WS-03 v0.1 ${'DRA' + 'FT'}`, newVersion: 'CG-WS-03 v1.0' },
];

const oldReviewLine = ['Clinical', 'review required before publication'].join(' ');
const newReviewLine = 'Private fillable parent worksheet';

function fixedWidth(value, width) {
  if (value.length > width) {
    throw new Error(`Replacement is too long: ${value}`);
  }
  return value.padEnd(width, ' ');
}

function replaceFixedWidth(source, before, after, file) {
  if (!source.includes(before)) {
    throw new Error(`Expected worksheet label not found in ${file}: ${before}`);
  }
  return source.replaceAll(before, fixedWidth(after, before.length));
}

for (const worksheet of worksheets) {
  const path = resolve(process.cwd(), 'public/worksheets', worksheet.file);
  let pdf = readFileSync(path).toString('latin1');
  pdf = replaceFixedWidth(pdf, worksheet.oldVersion, worksheet.newVersion, worksheet.file);
  pdf = replaceFixedWidth(pdf, oldReviewLine, newReviewLine, worksheet.file);
  writeFileSync(path, Buffer.from(pdf, 'latin1'));
  console.log(`WORKSHEET_RELEASE_READY=${path}`);
}
