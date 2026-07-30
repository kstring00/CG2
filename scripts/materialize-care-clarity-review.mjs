import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const OUTPUT = resolve(process.cwd(), 'public/worksheets/care-clarity-review.pdf');
const W = 612;
const H = 792;
const navy = [0.102, 0.153, 0.263];
const muted = [0.36, 0.42, 0.53];
const teal = [0.02, 0.44, 0.35];
const red = [0.78, 0.12, 0.1];
const border = [0.78, 0.82, 0.88];
const paleTeal = [0.94, 0.975, 0.965];
const paleRed = [1, 0.95, 0.94];
const white = [1, 1, 1];
const fieldFill = [0.995, 0.997, 1];

function n(value) { return Number(value.toFixed(3)); }
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
function color(rgb, stroke = false) { return `${rgb.map(n).join(' ')} ${stroke ? 'RG' : 'rg'}`; }
function text(x, y, size, value, { bold = false, rgb = navy } = {}) {
  return `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${color(rgb)} 1 0 0 1 ${x} ${y} Tm (${pdfString(value)}) Tj ET`;
}
function line(x1, y1, x2, y2, rgb = border, width = 0.7) {
  return `q ${color(rgb, true)} ${width} w ${x1} ${y1} m ${x2} ${y2} l S Q`;
}
function circle(cx, cy, r, { fill = null, stroke = null, lineWidth = 0.7 } = {}) {
  const k = 0.5522847498;
  const c = r * k;
  const path = [
    `${cx + r} ${cy} m`, `${cx + r} ${cy + c} ${cx + c} ${cy + r} ${cx} ${cy + r} c`,
    `${cx - c} ${cy + r} ${cx - r} ${cy + c} ${cx - r} ${cy} c`,
    `${cx - r} ${cy - c} ${cx - c} ${cy - r} ${cx} ${cy - r} c`,
    `${cx + c} ${cy - r} ${cx + r} ${cy - c} ${cx + r} ${cy} c`, 'h',
  ].join(' ');
  const parts = ['q'];
  if (fill) parts.push(color(fill));
  if (stroke) parts.push(color(stroke, true), `${lineWidth} w`);
  parts.push(path, fill && stroke ? 'B' : fill ? 'f' : 'S', 'Q');
  return parts.join(' ');
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
    `${x + radius} ${y} m`, `${x2 - radius} ${y} l`,
    `${x2 - radius + c} ${y} ${x2} ${y + radius - c} ${x2} ${y + radius} c`,
    `${x2} ${y2 - radius} l`, `${x2} ${y2 - radius + c} ${x2 - radius + c} ${y2} ${x2 - radius} ${y2} c`,
    `${x + radius} ${y2} l`, `${x + radius - c} ${y2} ${x} ${y2 - radius + c} ${x} ${y2 - radius} c`,
    `${x} ${y + radius} l`, `${x} ${y + radius - c} ${x + radius - c} ${y} ${x + radius} ${y} c`, 'h',
  ].join(' ');
  const parts = ['q'];
  if (fill) parts.push(color(fill));
  if (stroke) parts.push(color(stroke, true), `${lineWidth} w`);
  parts.push(path, fill && stroke ? 'B' : fill ? 'f' : 'S', 'Q');
  return parts.join(' ');
}
function sectionBar(y, label) {
  return [roundRect(34, y, 544, 23, 8, { fill: paleTeal }), text(44, y + 8, 8.4, label, { bold: true, rgb: teal })].join('\n');
}
function labelLines(x, y, lines, { size = 7.6, rgb = muted, bold = false, leading = 8.5 } = {}) {
  return lines.map((value, index) => text(x, y - index * leading, size, value, { rgb, bold })).join('\n');
}

const content = [];
content.push(circle(40.5, 761.5, 5.5, { fill: teal }));
content.push(circle(52.5, 766.5, 4.5, { fill: navy }));
content.push(circle(52.5, 753.5, 3.5, { fill: [0.85, 0.16, 0.13] }));
content.push(text(62, 761, 10.5, 'TEXAS ABA CENTERS', { bold: true }));
content.push(text(62, 747, 8.2, 'COMMON GROUND - PARENT SUPPORT', { rgb: muted }));
content.push(text(494, 761, 8, 'CG-WS-03 v0.1 DRAFT', { rgb: muted }));
content.push(text(441, 747, 7.5, 'Clinical review required before publication', { rgb: muted }));
content.push(line(34, 736, 578, 736));
content.push(text(34, 707, 20, 'Care Clarity & Review Sheet', { bold: true }));
content.push(labelLines(34, 690, [
  'Put the report, the real-life picture, and the decision you need in one place. This is not a scorecard or complaint form -',
  'use only the sections that fit.',
], { size: 8.8, rgb: muted, leading: 10 }));

content.push(sectionBar(648, '1. WHAT THIS REVIEW IS ABOUT'));
content.push(text(34, 632, 7.6, 'CHECK THE CLOSEST REASON FOR USING THIS SHEET', { rgb: muted }));
const focusItems = [
  [50, 615, ['I am deciding whether continuing still makes sense.']],
  [316, 615, ['The progress report does not match home life.']],
  [50, 591, ['Something about a session or handoff concerns me.']],
  [316, 591, ['I do not understand the goals, data, or purpose.']],
];
for (const [x, y, lines] of focusItems) content.push(labelLines(x, y, lines, { size: 8, rgb: navy, leading: 8.2 }));
for (const [x, y] of [[34,610],[300,610],[34,586],[300,586]]) content.push(rect(x, y, 10, 10, { fill: white, stroke: border }));
content.push(text(34, 565, 7.5, 'THE GOAL, SESSION, REPORT, OR DECISION I WANT REVIEWED', { rgb: muted }));
content.push(rect(34, 540, 544, 20, { fill: fieldFill, stroke: border }));

content.push(sectionBar(503, '2. PUT THE TWO PICTURES SIDE BY SIDE'));
content.push(text(34, 490, 7.4, 'WHAT I WAS TOLD OR WHAT THE REPORT SHOWS', { bold: true, rgb: muted }));
content.push(text(312, 490, 7.4, 'WHAT I SEE AT HOME OR AFTER SESSIONS', { bold: true, rgb: muted }));
content.push(rect(34, 427, 266, 56, { fill: fieldFill, stroke: border }));
content.push(rect(312, 427, 266, 56, { fill: fieldFill, stroke: border }));
content.push(text(34, 412, 7.3, 'ONE CONCRETE EXAMPLE', { rgb: muted }));
content.push(text(312, 412, 7.3, 'ONE CONCRETE EXAMPLE', { rgb: muted }));
content.push(rect(34, 382, 266, 24, { fill: fieldFill, stroke: border }));
content.push(rect(312, 382, 266, 24, { fill: fieldFill, stroke: border }));

content.push(sectionBar(344, '3. NAME WHAT HAS ACTUALLY CHANGED'));
content.push(text(34, 331, 7.2, 'BETTER OR MORE POSSIBLE NOW', { bold: true, rgb: muted }));
content.push(text(220, 331, 7.2, 'UNCHANGED OR STILL COSTLY', { bold: true, rgb: muted }));
content.push(text(406, 331, 7.2, 'WORSE, NEW, OR MORE CONCERNING', { bold: true, rgb: muted }));
content.push(rect(34, 284, 172, 40, { fill: fieldFill, stroke: border }));
content.push(rect(220, 284, 172, 40, { fill: fieldFill, stroke: border }));
content.push(rect(406, 284, 172, 40, { fill: fieldFill, stroke: border }));

content.push(sectionBar(246, '4. THE GAP I NEED EXPLAINED - AND THE DECISION I NEED NEXT'));
content.push(text(34, 233, 7.4, 'CHECK ANY THAT FIT', { rgb: muted }));
const gapItems = [
  [50, 213, ['Progress appears in sessions but not in daily', 'life.']],
  [230, 213, ['The goal or measure is not clear to me.']],
  [410, 213, ['The family priority is missing or too small.']],
  [50, 190, ['A session event or handoff needs a factual', 'explanation.']],
  [230, 190, ['The current schedule or family cost may not be', 'sustainable.']],
  [410, 190, ['I need options before deciding what happens', 'next.']],
];
for (const [x, y, lines] of gapItems) content.push(labelLines(x, y, lines, { size: 7.6, rgb: navy, leading: 8.1 }));
for (const [x, y] of [[34,210],[214,210],[394,210],[34,187],[214,187],[394,187]]) content.push(rect(x, y, 10, 10, { fill: white, stroke: border }));
content.push(text(34, 166, 7.4, 'COMPLETE ONE SENTENCE: THE GAP I NEED EXPLAINED IS...', { rgb: muted }));
content.push(rect(34, 139, 544, 22, { fill: fieldFill, stroke: border }));
content.push(text(34, 126, 7.4, 'CHECK THE DECISION OR CLARITY YOU NEED', { rgb: muted }));
const decisionItems = [
  [50, 106, ['Explain the data and goal in plain language.']],
  [230, 106, ['Explain why session and home look different.']],
  [410, 106, ['Review whether the current priority should', 'change.']],
  [50, 83, ['Review the session concern and tell me what', 'was found.']],
  [230, 83, ['Explain the available options and tradeoffs.']],
  [410, 83, ['Name who owns the next step and the timeline.']],
];
for (const [x, y, lines] of decisionItems) content.push(labelLines(x, y, lines, { size: 7.5, rgb: navy, leading: 8.1 }));
for (const [x, y] of [[34,103],[214,103],[394,103],[34,80],[214,80],[394,80]]) content.push(rect(x, y, 10, 10, { fill: white, stroke: border }));

content.push(sectionBar(45, '5. LEAVE WITH A NEXT STEP'));
content.push(text(34, 32, 7.0, 'PERSON / ROLE RESPONSIBLE', { rgb: muted }));
content.push(text(245, 32, 7.0, 'WHAT HAPPENS NEXT', { rgb: muted }));
content.push(text(456, 32, 7.0, 'DATE I SHOULD HEAR BACK', { rgb: muted }));
content.push(rect(34, 13, 190, 15, { fill: fieldFill, stroke: border }));
content.push(rect(245, 13, 190, 15, { fill: fieldFill, stroke: border }));
content.push(rect(456, 13, 122, 15, { fill: fieldFill, stroke: border }));
content.push(roundRect(34, 0, 544, 10, 5, { fill: paleRed, stroke: [1, 0.55, 0.52], lineWidth: 0.6 }));
content.push(text(44, 3, 5.6, 'Private file - Common Ground does not receive or store what you enter. Immediate danger: call 911. If you cannot stay safe, call or text 988.', { rgb: red }));

const stream = content.join('\n');
const objects = [];
function addObject(body) { objects.push(body); return objects.length; }
function addStream(dict, data) { return addObject(`<< ${dict} /Length ${Buffer.byteLength(data, 'ascii')} >>\nstream\n${data}\nendstream`); }
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
  const field = addObject(`<< /Type /Annot /Subtype /Widget /FT /Tx /T (${pdfString(name)}) /Rect [${x1} ${y1} ${x2} ${y2}] /F 4 /Ff ${flags} /P ${pageObj} 0 R /V () /DA (/F1 8 Tf 0.102 0.153 0.263 rg) /Q 0 /BS << /W 0 >> >>`);
  fields.push(field);
}
function addCheckbox(name, rectValues) {
  const [x1, y1, x2, y2] = rectValues;
  const field = addObject(`<< /Type /Annot /Subtype /Widget /FT /Btn /T (${pdfString(name)}) /Rect [${x1} ${y1} ${x2} ${y2}] /F 4 /Ff 0 /P ${pageObj} 0 R /V /Off /AS /Off /AP << /N << /Off ${offAppearance} 0 R /Yes ${yesAppearance} 0 R >> >> >>`);
  fields.push(field);
}

addCheckbox('focus_stopping', [34, 610, 44, 620]);
addCheckbox('focus_no_progress', [300, 610, 310, 620]);
addCheckbox('focus_session_concern', [34, 586, 44, 596]);
addCheckbox('focus_unclear_goals', [300, 586, 310, 596]);
addTextField('review_subject', [34, 540, 578, 560]);
addTextField('reported_picture', [34, 427, 300, 483], true);
addTextField('real_life_picture', [312, 427, 578, 483], true);
addTextField('reported_example', [34, 382, 300, 406], true);
addTextField('real_life_example', [312, 382, 578, 406], true);
addTextField('better_now', [34, 284, 206, 324], true);
addTextField('unchanged_now', [220, 284, 392, 324], true);
addTextField('worse_or_new', [406, 284, 578, 324], true);
addCheckbox('gap_session_only', [34, 210, 44, 220]);
addCheckbox('gap_goal_unclear', [214, 210, 224, 220]);
addCheckbox('gap_priority_missing', [394, 210, 404, 220]);
addCheckbox('gap_session_event', [34, 187, 44, 197]);
addCheckbox('gap_cost_unsustainable', [214, 187, 224, 197]);
addCheckbox('gap_options_needed', [394, 187, 404, 197]);
addTextField('gap_sentence', [34, 139, 578, 161], true);
addCheckbox('need_explain_data', [34, 103, 44, 113]);
addCheckbox('need_compare_settings', [214, 103, 224, 113]);
addCheckbox('need_review_priority', [394, 103, 404, 113]);
addCheckbox('need_session_review', [34, 80, 44, 90]);
addCheckbox('need_options', [214, 80, 224, 90]);
addCheckbox('need_owner_timeline', [394, 80, 404, 90]);
addTextField('responsible_person_role', [34, 13, 224, 28]);
addTextField('next_step', [245, 13, 435, 28]);
addTextField('followup_date', [456, 13, 578, 28]);

const pagesObj = addObject('PAGES_PLACEHOLDER');
const acroFormObj = addObject(`<< /Fields [${fields.map((id) => `${id} 0 R`).join(' ')}] /NeedAppearances true /DA (/F1 8 Tf 0.102 0.153 0.263 rg) /DR << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> >>`);
const catalogObj = addObject(`<< /Type /Catalog /Pages ${pagesObj} 0 R /AcroForm ${acroFormObj} 0 R >>`);
const infoObj = addObject('<< /Title (Common Ground - Care Clarity & Review Sheet) /Author (Texas ABA Centers - Common Ground) /Subject (Private fillable care clarity and review worksheet for parent use) /Creator (Common Ground worksheet materializer) >>');
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
for (let index = 1; index <= objects.length; index += 1) pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObj} 0 R /Info ${infoObj} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, Buffer.from(pdf, 'ascii'));
console.log(`WORKSHEET_ASSET_READY=${OUTPUT} fields=${fields.length}`);
