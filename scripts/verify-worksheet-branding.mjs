#!/usr/bin/env node
// Fails the build if any generated worksheet still carries legacy branding.
//
// Written because a plain grep over these PDFs is not a real check: their text
// lives inside content streams that are ASCII85-encoded and then Flate-
// compressed, so a byte-level search reports "clean" on a page that visibly
// reads TEXAS ABA CENTERS. This decodes every stream through its declared
// filter chain before looking.
import { readdirSync, readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { resolve } from 'node:path';

const DIR = resolve(process.cwd(), 'public/worksheets');

/** Legacy brand text that must never appear in a shipped worksheet. */
const FORBIDDEN = [/texas\s*aba/i, /aba\s*centers/i, /texasaba/i];

/** The retired brand red, in any float spelling, inside the header mark. */
const HEADER_REGION = 1200;
const RED_RG = /(?<![\d.])(0?\.\d+|1(?:\.0+)?)\s+(0?\.\d+|0)\s+(0?\.\d+|0)\s+rg/g;

function a85decode(buf) {
  let s = buf.toString('latin1').replace(/\s/g, '');
  if (s.startsWith('<~')) s = s.slice(2);
  const end = s.indexOf('~>');
  if (end !== -1) s = s.slice(0, end);
  const out = [];
  let tuple = 0;
  let count = 0;
  for (const ch of s) {
    if (ch === 'z' && count === 0) { out.push(0, 0, 0, 0); continue; }
    tuple = tuple * 85 + (ch.charCodeAt(0) - 33);
    if (++count === 5) {
      out.push((tuple >>> 24) & 0xff, (tuple >>> 16) & 0xff, (tuple >>> 8) & 0xff, tuple & 0xff);
      tuple = 0; count = 0;
    }
  }
  if (count > 0) {
    for (let i = count; i < 5; i++) tuple = tuple * 85 + 84;
    const bytes = [(tuple >>> 24) & 0xff, (tuple >>> 16) & 0xff, (tuple >>> 8) & 0xff, tuple & 0xff];
    out.push(...bytes.slice(0, count - 1));
  }
  return Buffer.from(out);
}

/** Every decoded stream in the file, plus the raw bytes themselves. */
function decodedParts(raw) {
  const parts = [raw.toString('latin1')];
  const text = raw.toString('latin1');
  const re = /(\d+)\s+0\s+obj([\s\S]*?)stream\r?\n/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const dictStr = m[2];
    const start = m.index + m[0].length;
    const end = text.indexOf('endstream', start);
    if (end === -1) continue;
    const filters = [...dictStr.matchAll(/\/(ASCII85Decode|FlateDecode)/g)].map((f) => f[1]);
    let data = Buffer.from(text.slice(start, end), 'latin1');
    try {
      for (const f of filters) {
        if (f === 'ASCII85Decode') data = a85decode(data);
        else if (f === 'FlateDecode') data = inflateSync(data);
      }
      parts.push(data.toString('latin1'));
    } catch {
      // Unreadable stream — nothing we can assert about it.
    }
  }
  return parts;
}

const failures = [];
const files = readdirSync(DIR).filter((f) => f.endsWith('.pdf')).sort();

if (files.length === 0) {
  console.error('WORKSHEET_BRANDING_FAIL: no worksheets found — run care-plan:worksheets first');
  process.exit(1);
}

for (const file of files) {
  const raw = readFileSync(resolve(DIR, file));
  const parts = decodedParts(raw);

  for (const pattern of FORBIDDEN) {
    if (parts.some((p) => pattern.test(p))) {
      failures.push(`${file}: matches ${pattern}`);
    }
  }

  for (const part of parts.slice(1)) {
    const head = part.slice(0, HEADER_REGION);
    for (const m of head.matchAll(RED_RG)) {
      const [R, G, B] = [m[1], m[2], m[3]].map(Number);
      if (R >= 0.75 && G <= 0.35 && B <= 0.35) {
        failures.push(`${file}: retired brand red ${m[0]} in the header mark`);
      }
    }
  }
}

if (failures.length) {
  console.error('WORKSHEET_BRANDING_FAIL');
  failures.forEach((f) => console.error(`  ${f}`));
  process.exit(1);
}

console.log(`WORKSHEET_BRANDING_OK=${files.length} worksheets clean`);
