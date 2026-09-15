// Applies the deployment's org name and palette to a pre-built PDF blob.
//
// Three of the worksheets ship as encoded PDF blobs rather than being laid out
// at build time. Their brand text lives inside content streams that are
// ASCII85-encoded and then Flate-compressed, so a plain byte replacement (or a
// plain grep) never sees it. This module decodes each stream through its
// declared filter chain, rewrites the brand, re-encodes through the same chain,
// and then rebuilds the xref table because the byte offsets shift.
import { deflateSync, inflateSync } from 'node:zlib';
import { SITE, ORG_HEADER } from './site-config.mjs';

// ── ASCII85 ─────────────────────────────────────────────────────────────────

function a85decode(input) {
  let s = input.toString('latin1').replace(/\s/g, '');
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

function a85encode(buf) {
  let out = '';
  for (let i = 0; i < buf.length; i += 4) {
    const chunk = buf.subarray(i, i + 4);
    const n = chunk.length;
    let tuple = 0;
    for (let j = 0; j < 4; j++) tuple = tuple * 256 + (j < n ? chunk[j] : 0);
    if (n === 4 && tuple === 0) { out += 'z'; continue; }
    const enc = [];
    for (let j = 0; j < 5; j++) { enc.unshift(String.fromCharCode(33 + (tuple % 85))); tuple = Math.floor(tuple / 85); }
    out += enc.slice(0, n + 1).join('');
  }
  return out + '~>';
}

// ── Filter chain ────────────────────────────────────────────────────────────

function filtersOf(dict) {
  return [...dict.matchAll(/\/(ASCII85Decode|FlateDecode|ASCIIHexDecode)/g)].map((m) => m[1]);
}

function decodeChain(buf, filters) {
  let data = buf;
  for (const f of filters) {
    if (f === 'ASCII85Decode') data = a85decode(data);
    else if (f === 'FlateDecode') data = inflateSync(data);
    else throw new Error(`Unsupported filter ${f}`);
  }
  return data;
}

function encodeChain(buf, filters) {
  let data = buf;
  for (const f of [...filters].reverse()) {
    if (f === 'ASCII85Decode') data = Buffer.from(a85encode(data), 'latin1');
    else if (f === 'FlateDecode') data = deflateSync(data);
    else throw new Error(`Unsupported filter ${f}`);
  }
  return data;
}

// ── Brand rewrites applied inside a decoded content stream ──────────────────

/** Legacy brand text, longest first so partial matches cannot win. */
const TEXT_REPLACEMENTS = [
  ['TEXAS ABA CENTERS', () => ORG_HEADER],
  ['Texas ABA Centers - Common Ground', () => SITE.orgName],
  ['Texas ABA Centers', () => SITE.orgName],
];

/**
 * The header mark's third dot used the retired brand red. Repoint it at plum,
 * which is still in the palette. PDF colour operands are 0-1 floats.
 */
const PLUM_RG = '.439216 .188235 .407843 rg';

/** How far into a content stream the header mark is drawn. */
const HEADER_REGION = 1200;

/**
 * The mark's third dot used the retired brand red, spelled with different float
 * precision in every blob. Rather than enumerate spellings, match the red hue
 * structurally — but only inside the header region, so the genuine 911/988
 * safety red further down a worksheet is never recoloured.
 */
const RED_RG = /(?<![\d.])(0?\.\d+|1(?:\.0+)?)\s+(0?\.\d+|0)\s+(0?\.\d+|0)\s+rg/g;

function recolorHeaderRed(text) {
  const head = text.slice(0, HEADER_REGION);
  const tail = text.slice(HEADER_REGION);
  const fixed = head.replace(RED_RG, (match, r, g, b) => {
    const [R, G, B] = [r, g, b].map(Number);
    const isBrandRed = R >= 0.75 && G <= 0.35 && B <= 0.35;
    return isBrandRed ? PLUM_RG : match;
  });
  return fixed + tail;
}

function rewrite(text) {
  let out = text;
  for (const [needle, value] of TEXT_REPLACEMENTS) {
    if (!out.includes(needle)) continue;
    out = out.split(needle).join(value());
  }
  return recolorHeaderRed(out);
}

// ── xref rebuild ────────────────────────────────────────────────────────────

function rebuildXref(pdf) {
  const trailerMatch = [...pdf.matchAll(/trailer\s*(<<[\s\S]*?>>)/g)].pop();
  if (!trailerMatch) throw new Error('no trailer dict found');
  let trailer = trailerMatch[1];

  const offsets = new Map();
  for (const m of pdf.matchAll(/(?:^|[\r\n>\s])(\d+)\s+0\s+obj\b/g)) {
    const num = parseInt(m[1], 10);
    offsets.set(num, m.index + m[0].length - `${m[1]} 0 obj`.length);
  }
  const max = Math.max(...offsets.keys());
  const size = max + 1;

  // Drop the old xref/trailer/startxref tail and re-emit it.
  const lastXref = pdf.lastIndexOf('\nxref');
  const body = (lastXref === -1 ? pdf : pdf.slice(0, lastXref)).replace(/\s*$/, '\n');

  let table = `xref\n0 ${size}\n0000000000 65535 f \n`;
  for (let i = 1; i < size; i++) {
    const off = offsets.get(i);
    table += off === undefined
      ? '0000000000 65535 f \n'
      : `${String(off).padStart(10, '0')} 00000 n \n`;
  }
  trailer = trailer.replace(/\/Size\s+\d+/, `/Size ${size}`);
  if (!/\/Size\s+\d+/.test(trailer)) trailer = trailer.replace(/^<</, `<< /Size ${size}`);

  return `${body}${table}trailer\n${trailer}\nstartxref\n${body.length}\n%%EOF\n`;
}

// ── Public entry point ──────────────────────────────────────────────────────

/**
 * Rewrite every brand reference in a PDF (latin1 string in, latin1 string out).
 * Returns the patched PDF with a rebuilt xref table.
 */
export function applyBrand(pdfLatin1, file) {
  let pdf = pdfLatin1;
  let touched = 0;

  // Walk stream objects from the end so earlier offsets stay valid mid-loop.
  const objs = [...pdf.matchAll(/(\d+)\s+0\s+obj([\s\S]*?)stream\r?\n/g)].reverse();

  for (const m of objs) {
    const dict = m[2];
    const dataStart = m.index + m[0].length;
    const dataEnd = pdf.indexOf('endstream', dataStart);
    if (dataEnd === -1) continue;

    const filters = filtersOf(dict);
    const rawSlice = Buffer.from(pdf.slice(dataStart, dataEnd), 'latin1');

    let decoded;
    try {
      decoded = filters.length ? decodeChain(rawSlice, filters) : rawSlice;
    } catch {
      continue; // not a stream we can read; leave it untouched
    }

    const before = decoded.toString('latin1');
    const after = rewrite(before);
    if (after === before) continue;

    const reencoded = filters.length
      ? encodeChain(Buffer.from(after, 'latin1'), filters)
      : Buffer.from(after, 'latin1');

    // Swap the stream bytes and correct this object's /Length.
    const newDict = dict.replace(/\/Length\s+\d+/, `/Length ${reencoded.length}`);
    pdf =
      pdf.slice(0, m.index) +
      `${m[1]} 0 obj${newDict}stream\n` +
      reencoded.toString('latin1') +
      pdf.slice(dataEnd);
    touched += 1;
  }

  // Uncompressed objects (text outside any stream, /Author in the info dict).
  const plain = rewrite(pdf);
  if (plain !== pdf) { pdf = plain; touched += 1; }

  if (touched === 0) return pdfLatin1;
  return rebuildXref(pdf);
}

export default applyBrand;
