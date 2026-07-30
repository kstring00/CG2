import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const OUTPUT = resolve(process.cwd(), 'public/worksheets/incident-log.pdf');

const W = 612;
const H = 792;
const navy = [0.102, 0.153, 0.263];
const muted = [0.36, 0.42, 0.53];
const teal = [0.02, 0.44, 0.35];
const red = [0.78, 0.12, 0.1];
const border = [0.78, 0.82, 0.88];
const paleTeal = [0.94, 0.975, 0.965];
const paleRed = [1, 0.95, 0.94];

function n(value) {
  return Number(value.toFixed(3));
}

function pdfString(value) {
  return String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E]/g, '');
}

function color(rgb, stroke = false) {
  return `${rgb.map(n).join(' ')} ${stroke ? 'RG' : 'rg'}`;
}

function text(x, y, size, value, { bold = false, rgb = navy } = {}) {
  return `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${color(rgb)} 1 0 0 1 ${x} ${y} Tm (${pdfString(value)}) Tj ET`;
}

function line(x1, y1, x2, y2, rgb = border, width = 0.7) {
  return `q ${color(rgb, true)} ${width} w ${x1} ${y1} m ${x2} ${y2} l S Q`;
}

function rect(x, y, width, height, { fill = null, stroke = null, lineWidth = 0.7 } = {}) {
  const parts = ['q'];
  if (fill) parts.push(color(fill));
  if (stroke) parts.push(color(stroke, true), `${lineWidth} w`);
  parts.push(`${x} ${y} ${width} ${height} re`);
  parts.push(fill && stroke ? 'B' : fill ? 'f' : 'S', 'Q');
  return parts.join(' ');
}

function roundRect(x, y, width, height, radius, { fill = null, stroke = null, lineWidth = 0.7 } = {}) {
  const k = 0.5522847498;
  const c = radius * k;
  const x2 = x + width;
  const y2 = y + height;
  const path = [
    `${x + radius} ${y} m`,
    `${x2 - radius} ${y} l`,
    `${x2 - radius + c} ${y} ${x2} ${y + radius - c} ${x2} ${y + radius} c`,
    `${x2} ${y2 - radius} l`,
    `${x2} ${y2 - radius + c} ${x2 - radius + c} ${y2} ${x2 - radius} ${y2} c`,
    `${x + radius} ${y2} l`,
    `${x + radius - c} ${y2} ${x} ${y2 - radius + c} ${x} ${y2 - radius} c`,
    `${x} ${y + radius} l`,
    `${x} ${y + radius - c} ${x + radius - c} ${y} ${x + radius} ${y} c`,
    'h',
  ].join(' ');
  const parts = ['q'];
  if (fill) parts.push(color(fill));
  if (stroke) parts.push(color(stroke, true), `${lineWidth} w`);
  parts.push(path, fill && stroke ? 'B' : fill ? 'f' : 'S', 'Q');
  return parts.join(' ');
}

function sectionBar(y, label) {
  return [
    roundRect(34, y, 544, 23, 8, { fill: paleTeal }),
    text(44, y + 8, 8.4, label, { bold: true, rgb: teal }),
  ].join('\n');
}

const content = [];

content.push(rect(35, 756, 11, 11, { fill: teal }));
content.push(rect(48, 762, 9, 9, { fill: navy }));
content.push(rect(49, 750, 7, 7, { fill: [0.85, 0.16, 0.13] }));
content.push(text(62, 761, 10.5, 'TEXAS ABA CENTERS', { bold: true }));
content.push(text(62, 747, 8.2, 'COMMON GROUND - PARENT SUPPORT', { rgb: muted }));
content.push(text(500, 761, 8, 'CG-WS-01 v0.2 DRAFT', { rgb: muted }));
content.push(text(437, 747, 7.5, 'Clinical review required before publication', { rgb: muted }));
content.push(line(34, 736, 578, 736));

content.push(text(34, 707, 20, 'Incident & Safety Record', { bold: true }));
content.push(text(34, 689, 9.5, 'One incident per sheet. Complete this after everyone is safe. Record what you saw or heard - not why you think it happened.', { rgb: muted }));

content.push(sectionBar(648, '1. INCIDENT FACTS'));
content.push(text(34, 640, 7.8, 'DATE', { rgb: muted }));
content.push(text(166, 640, 7.8, 'START TIME', { rgb: muted }));
content.push(text(298, 640, 7.8, 'APPROX. DURATION', { rgb: muted }));
content.push(text(430, 640, 7.8, 'LOCATION', { rgb: muted }));
content.push(text(34, 599, 7.8, 'CHILD INITIALS (OPTIONAL)', { rgb: muted }));
content.push(text(204, 599, 7.8, 'PEOPLE PRESENT', { rgb: muted }));

content.push(sectionBar(527, '2. WHAT HAPPENED'));
content.push(text(34, 518, 7.8, 'WHAT WAS HAPPENING IN THE TWO MINUTES BEFORE?', { rgb: muted }));
content.push(text(312, 518, 7.8, 'WHAT DID YOU SEE OR HEAR?', { rgb: muted }));

content.push(sectionBar(424, '3. SAFETY IMPACT'));
content.push(text(34, 406, 7.8, 'CHECK ALL THAT APPLY', { rgb: muted }));
const checkboxLabels = [
  [50, 397, 'No known injury'],
  [176, 397, 'Child injured'],
  [282, 397, 'Caregiver injured'],
  [402, 397, 'Sibling / other person injured'],
  [50, 376, 'Property damaged'],
  [176, 376, '911 / emergency help used'],
  [355, 376, 'Medical care sought'],
];
for (const [x, y, label] of checkboxLabels) {
  content.push(rect(x - 16, y, 10.5, 10.5, { fill: [1, 1, 1], stroke: border }));
  content.push(text(x, y + 1, 8.2, label, { rgb: navy }));
}
content.push(text(34, 348, 7.8, 'INJURY, DAMAGE, OR EMERGENCY DETAILS', { rgb: muted }));

content.push(sectionBar(265, '4. HOW IT ENDED AND WHAT IT COST THE FAMILY'));
content.push(text(34, 258, 7.5, 'WHAT HAPPENED IMMEDIATELY BEFORE THE INCIDENT ENDED?', { rgb: muted }));
content.push(text(312, 258, 7.5, 'WHAT DID THE INCIDENT INTERRUPT, PREVENT, OR CHANGE?', { rgb: muted }));

content.push(sectionBar(166, '5. HAND-OFF SUMMARY'));
content.push(text(34, 160, 7.5, 'THE ONE THING I NEED THE CARE TEAM TO UNDERSTAND', { rgb: muted }));
content.push(text(34, 111, 7.5, 'DATE SHARED WITH TEAM', { rgb: muted }));
content.push(text(219, 111, 7.5, 'PERSON / ROLE CONTACTED', { rgb: muted }));
content.push(text(403, 111, 7.5, 'NEXT REVIEW DATE', { rgb: muted }));

content.push(roundRect(34, 19, 544, 48, 9, { fill: paleRed, stroke: [1, 0.55, 0.52], lineWidth: 0.8 }));
content.push(text(44, 53, 7.7, 'SAFETY', { bold: true, rgb: red }));
content.push(text(44, 41, 7, 'If anyone is in immediate danger, call 911. If you may harm yourself or cannot stay safe, call or text 988.', { rgb: red }));
content.push(text(44, 29, 6.5, 'Documentation only - this record does not determine why behavior occurred or tell you how to respond.', { rgb: muted }));
content.push(text(44, 20.5, 6.5, 'Bring it to your BCBA or provider. Private file: Common Ground does not receive or store what you enter.', { rgb: muted }));

const textRects = [
  [34, 614, 118, 21], [166, 614, 118, 21], [298, 614, 118, 21], [430, 614, 148, 21],
  [34, 570, 154, 21], [204, 570, 374, 21],
  [34, 465, 266, 50], [312, 465, 266, 50],
  [34, 306, 544, 35], [34, 206, 266, 50], [312, 206, 266, 50],
  [34, 129, 544, 28], [34, 84, 174.667, 20], [218.667, 84, 174.666, 20], [403.333, 84, 174.667, 20],
];
for (const [x, y, width, height] of textRects) {
  content.push(rect(x, y, width, height, { fill: [0.995, 0.997, 1], stroke: border }));
}

const stream = content.join('\n');
const objects = [];

function addObject(body) {
  objects.push(body);
  return objects.length;
}

function addStream(dict, data) {
  return addObject(`<< ${dict} /Length ${Buffer.byteLength(data, 'ascii')} >>\nstream\n${data}\nendstream`);
}

const fontRegular = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
const fontBold = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
const contentObj = addStream('', stream);
const offAppearance = addStream('/Type /XObject /Subtype /Form /BBox [0 0 11 11] /Resources << >>', 'q 1 1 1 rg 0.78 0.82 0.88 RG 0.8 w 0.5 0.5 10 10 re B Q');
const yesAppearance = addStream('/Type /XObject /Subtype /Form /BBox [0 0 11 11] /Resources << >>', `q 1 1 1 rg ${color(teal, true)} 1 w 0.5 0.5 10 10 re B 1.4 w 2.2 5.4 m 4.5 3.1 l 8.8 8.2 l S Q`);
const pageObj = addObject('PAGE_PLACEHOLDER');
const fields = [];

function addTextField(name, rectValues, multiline = false) {
  const [x1, y1, x2, y2] = rectValues;
  const flags = multiline ? 4096 : 0;
  const field = addObject(`<< /Type /Annot /Subtype /Widget /FT /Tx /T (${pdfString(name)}) /Rect [${x1} ${y1} ${x2} ${y2}] /F 4 /Ff ${flags} /P ${pageObj} 0 R /V () /DA (/F1 9 Tf 0.102 0.153 0.263 rg) /Q 0 /BS << /W 0 >> >>`);
  fields.push(field);
}

function addCheckbox(name, rectValues) {
  const [x1, y1, x2, y2] = rectValues;
  const field = addObject(`<< /Type /Annot /Subtype /Widget /FT /Btn /T (${pdfString(name)}) /Rect [${x1} ${y1} ${x2} ${y2}] /F 4 /Ff 0 /P ${pageObj} 0 R /V /Off /AS /Off /AP << /N << /Off ${offAppearance} 0 R /Yes ${yesAppearance} 0 R >> >> >>`);
  fields.push(field);
}

addTextField('incident_date', [34, 614, 152, 635]);
addTextField('start_time', [166, 614, 284, 635]);
addTextField('duration', [298, 614, 416, 635]);
addTextField('location', [430, 614, 578, 635]);
addTextField('child_initials', [34, 570, 188, 591]);
addTextField('people_present', [204, 570, 578, 591]);
addTextField('two_minutes_before', [34, 465, 300, 515], true);
addTextField('observed_behavior', [312, 465, 578, 515], true);
addCheckbox('no_known_injury', [34, 397, 44.5, 407.5]);
addCheckbox('child_injured', [160, 397, 170.5, 407.5]);
addCheckbox('caregiver_injured', [266, 397, 276.5, 407.5]);
addCheckbox('other_injured', [386, 397, 396.5, 407.5]);
addCheckbox('property_damage', [34, 376, 44.5, 386.5]);
addCheckbox('emergency_help', [160, 376, 170.5, 386.5]);
addCheckbox('medical_care', [339, 376, 349.5, 386.5]);
addTextField('safety_details', [34, 306, 578, 341], true);
addTextField('how_ended', [34, 206, 300, 256], true);
addTextField('family_impact', [312, 206, 578, 256], true);
addTextField('priority_summary', [34, 129, 578, 157], true);
addTextField('date_shared', [34, 84, 208.667, 104]);
addTextField('contacted_person', [218.667, 84, 393.333, 104]);
addTextField('next_review_date', [403.333, 84, 578, 104]);

const pagesObj = addObject('PAGES_PLACEHOLDER');
const acroFormObj = addObject(`<< /Fields [${fields.map((id) => `${id} 0 R`).join(' ')}] /NeedAppearances true /DA (/F1 9 Tf 0.102 0.153 0.263 rg) /DR << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> >>`);
const catalogObj = addObject(`<< /Type /Catalog /Pages ${pagesObj} 0 R /AcroForm ${acroFormObj} 0 R >>`);
const infoObj = addObject('<< /Title (Incident & Safety Record) /Author (Texas ABA Centers - Common Ground) /Subject (Private parent incident documentation worksheet) /Creator (Common Ground worksheet materializer) >>');

objects[pageObj - 1] = `<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> /Contents ${contentObj} 0 R /Annots [${fields.map((id) => `${id} 0 R`).join(' ')}] >>`;
objects[pagesObj - 1] = `<< /Type /Pages /Kids [${pageObj} 0 R] /Count 1 >>`;

let pdf = '%PDF-1.4\n%CGWS\n';
const offsets = [0];
for (let index = 0; index < objects.length; index += 1) {
  offsets.push(Buffer.byteLength(pdf, 'ascii'));
  pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
}
const xref = Buffer.byteLength(pdf, 'ascii');
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += '0000000000 65535 f \n';
for (let index = 1; index <= objects.length; index += 1) {
  pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObj} 0 R /Info ${infoObj} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, Buffer.from(pdf, 'ascii'));
console.log(`WORKSHEET_ASSET_READY=${OUTPUT}`);
