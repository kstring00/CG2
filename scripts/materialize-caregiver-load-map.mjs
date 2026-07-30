import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const OUTPUT = resolve(process.cwd(), 'public/worksheets/load-map.pdf');
const W = 612;
const H = 792;
const navy = [0.102, 0.153, 0.263];
const muted = [0.36, 0.42, 0.53];
const teal = [0.02, 0.44, 0.35];
const red = [0.85, 0.16, 0.13];
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
content.push(circle(52.5, 753.5, 3.5, { fill: red }));
content.push(text(62, 761, 10.5, 'TEXAS ABA CENTERS', { bold: true }));
content.push(text(62, 747, 8.2, 'COMMON GROUND - PARENT SUPPORT', { rgb: muted }));
content.push(text(494, 761, 8, 'CG-WS-02 v0.1 DRAFT', { rgb: muted }));
content.push(text(441, 747, 7.5, 'Clinical review required before publication', { rgb: muted }));
content.push(line(34, 736, 578, 736));
content.push(text(34, 707, 20, 'Caregiver Load Map', { bold: true }));
content.push(text(34, 689, 9.2, 'A right-now snapshot of what one person is carrying. This is not a scorecard and not a daily log - fill only what matters today.', { rgb: muted }));

content.push(sectionBar(649, '1. YOUR HOUSEHOLD REALITY'));
content.push(text(34, 632, 7.8, 'CHECK ANY THAT FIT TODAY', { rgb: muted }));
const realityItems = [
  [50, 615, ['I am the only adult carrying most daily care']],
  [238, 615, ['Another adult is present but not consistently', 'available.']],
  [430, 615, ['Work or school schedules leave little', 'overlap.']],
  [50, 591, ['Other children or relatives also depend on', 'me.']],
  [238, 591, ['I carry most calls, appointments, school, or', 'insurance tasks.']],
  [430, 591, ['Nights or early mornings mostly fall to me.']],
];
for (const [x, y, lines] of realityItems) content.push(labelLines(x, y, lines, { size: 8, rgb: navy, leading: 8.2 }));
for (const [x, y] of [[34,610],[222,610],[414,610],[34,586],[222,586],[414,586]]) content.push(rect(x, y, 10, 10, { fill: white, stroke: border }));
content.push(text(34, 568, 7.6, 'PEOPLE WHO CAN HELP, EVEN OCCASIONALLY (OPTIONAL)', { rgb: muted }));
content.push(rect(34, 539, 544, 20, { fill: fieldFill, stroke: border }));

content.push(sectionBar(500, '2. WHERE THE LOAD LANDS'));
content.push(text(34, 488, 7.6, 'AREA OF THE DAY', { rgb: muted }));
content.push(text(141, 488, 7.6, 'WHAT LANDS ON ME', { rgb: muted }));
content.push(text(376, 488, 7.6, 'WHAT GIVES WAY WHEN I CANNOT DO IT ALL', { rgb: muted }));
const rows = [
  [450, 'Morning'], [414, 'Daytime / appointments'], [378, 'Evening'], [342, 'Overnight'], [306, 'Calls / paperwork /', 'planning'],
];
for (const row of rows) {
  const [y, a, b] = row;
  content.push(rect(34, y, 544, 36, { fill: white, stroke: border }));
  content.push(line(141, y, 141, y + 36));
  content.push(line(376, y, 376, y + 36));
  if (b) content.push(labelLines(42, y + 22, [a, b], { size: 8, rgb: navy, leading: 8.5 }));
  else content.push(text(42, y + 15, 8, a, { rgb: navy }));
  content.push(rect(145, y + 4, 219, 28, { fill: fieldFill, stroke: border }));
  content.push(rect(380, y + 4, 194, 28, { fill: fieldFill, stroke: border }));
}

content.push(sectionBar(267, '3. THE PRESSURE POINT'));
content.push(labelLines(34, 260, ['THE HOUR OR PART OF THE DAY THAT BREAKS', 'FIRST'], { size: 7.4, leading: 8.1 }));
content.push(text(219, 257, 7.4, 'THE RESPONSIBILITY ONLY I KNOW HOW TO DO', { rgb: muted }));
content.push(text(408, 257, 7.4, 'WHAT CANNOT CONTINUE AS-IS', { rgb: muted }));
content.push(rect(34, 231, 170, 19, { fill: fieldFill, stroke: border }));
content.push(rect(219, 231, 174, 19, { fill: fieldFill, stroke: border }));
content.push(rect(408, 231, 170, 19, { fill: fieldFill, stroke: border }));

content.push(sectionBar(190, '4. ONE CHANGE TO ASK FOR'));
content.push(text(34, 180, 7.6, 'CHECK THE CHANGE THAT WOULD REDUCE THE LOAD MOST', { rgb: muted }));
const changeItems = [
  [50, 168, 'Remove or pause something.'], [192, 168, 'Share it with another adult.'],
  [342, 168, 'Train another adult to do it.'], [490, 168, 'Change timing or scheduling.'],
  [50, 145, 'Clarify who to contact between sessions.'], [244, 145, 'Ask what respite or support options exist.'],
  [444, 145, 'Another specific change.'],
];
for (const [x, y, value] of changeItems) content.push(text(x, y, 7.8, value, { rgb: navy }));
for (const [x, y] of [[34,166],[176,166],[326,166],[474,166],[34,143],[228,143],[428,143]]) content.push(rect(x, y, 10, 10, { fill: white, stroke: border }));
content.push(text(34, 123, 7.4, 'COMPLETE ONE SENTENCE: I AM CARRYING... I NEED... TO CHANGE.', { rgb: muted }));
content.push(rect(34, 91, 544, 25, { fill: fieldFill, stroke: border }));

content.push(sectionBar(59, '5. HAND-OFF'));
content.push(text(34, 47, 7.4, 'DATE SHARED', { rgb: muted }));
content.push(text(196, 47, 7.4, 'PERSON / ROLE', { rgb: muted }));
content.push(text(392, 47, 7.4, 'NEXT REVIEW DATE', { rgb: muted }));
content.push(rect(34, 27, 146, 17, { fill: fieldFill, stroke: border }));
content.push(rect(196, 27, 180, 17, { fill: fieldFill, stroke: border }));
content.push(rect(392, 27, 186, 17, { fill: fieldFill, stroke: border }));
content.push(roundRect(34, 4, 544, 18, 8, { fill: paleRed, stroke: [1, 0.55, 0.52], lineWidth: 0.7 }));
content.push(text(44, 10.2, 6.1, 'If you may harm yourself or cannot stay safe, call or text 988. Immediate danger: call 911. Private file - Common Ground never receives what you enter.', { rgb: red }));

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

addCheckbox('reality_only_adult', [34, 610, 44, 620]);
addCheckbox('reality_inconsistent_support', [222, 610, 232, 620]);
addCheckbox('reality_little_overlap', [414, 610, 424, 620]);
addCheckbox('reality_other_dependents', [34, 586, 44, 596]);
addCheckbox('reality_admin_load', [222, 586, 232, 596]);
addCheckbox('reality_nights', [414, 586, 424, 596]);
addTextField('occasional_helpers', [34, 539, 578, 559]);
addTextField('load_morning', [141, 450, 368, 478], true);
addTextField('cost_morning', [376, 450, 574, 478], true);
addTextField('load_daytime', [141, 414, 368, 442], true);
addTextField('cost_daytime', [376, 414, 574, 442], true);
addTextField('load_evening', [141, 378, 368, 406], true);
addTextField('cost_evening', [376, 378, 574, 406], true);
addTextField('load_overnight', [141, 342, 368, 370], true);
addTextField('cost_overnight', [376, 342, 574, 370], true);
addTextField('load_admin', [141, 306, 368, 334], true);
addTextField('cost_admin', [376, 306, 574, 334], true);
addTextField('breaking_hour', [34, 231, 204, 250]);
addTextField('only_i_know', [219, 231, 393, 250]);
addTextField('cannot_continue', [408, 231, 578, 250]);
addCheckbox('change_remove', [34, 166, 44, 176]);
addCheckbox('change_share', [176, 166, 186, 176]);
addCheckbox('change_train', [326, 166, 336, 176]);
addCheckbox('change_schedule', [474, 166, 484, 176]);
addCheckbox('change_contact', [34, 143, 44, 153]);
addCheckbox('change_respite', [228, 143, 238, 153]);
addCheckbox('change_other', [428, 143, 438, 153]);
addTextField('advocacy_sentence', [34, 91, 578, 116], true);
addTextField('date_shared', [34, 27, 180, 44]);
addTextField('person_role', [196, 27, 376, 44]);
addTextField('next_review_date', [392, 27, 578, 44]);

const pagesObj = addObject('PAGES_PLACEHOLDER');
const acroFormObj = addObject(`<< /Fields [${fields.map((id) => `${id} 0 R`).join(' ')}] /NeedAppearances true /DA (/F1 8 Tf 0.102 0.153 0.263 rg) /DR << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> >>`);
const catalogObj = addObject(`<< /Type /Catalog /Pages ${pagesObj} 0 R /AcroForm ${acroFormObj} 0 R >>`);
const infoObj = addObject('<< /Title (Common Ground - Caregiver Load Map) /Author (Texas ABA Centers - Common Ground) /Subject (Private fillable caregiver load snapshot for parent use) /Creator (Common Ground worksheet materializer) >>');
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
console.log(`WORKSHEET_ASSET_READY=${OUTPUT}`);
