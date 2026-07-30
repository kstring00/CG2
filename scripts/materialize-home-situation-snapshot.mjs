import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const OUTPUT = resolve(process.cwd(), 'public/worksheets/home-situation-snapshot.pdf');
const W = 612;
const H = 792;
const navy = [0.102, 0.153, 0.263];
const muted = [0.36, 0.42, 0.53];
const teal = [0.02, 0.44, 0.35];
const red = [0.85, 0.16, 0.13];
const border = [0.78, 0.82, 0.88];
const paleTeal = [0.94, 0.975, 0.965];
const paleBlue = [0.95, 0.97, 0.99];
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
function sectionBar(y, label, fill = paleTeal, rgb = teal) {
  return [roundRect(34, y, 544, 23, 8, { fill }), text(44, y + 8, 8.4, label, { bold: true, rgb })].join('\n');
}
function labelLines(x, y, lines, { size = 7.6, rgb = navy, bold = false, leading = 8.2 } = {}) {
  return lines.map((value, index) => text(x, y - index * leading, size, value, { rgb, bold })).join('\n');
}

const content = [];
content.push(circle(40.5, 761.5, 5.5, { fill: teal }));
content.push(circle(52.5, 766.5, 4.5, { fill: navy }));
content.push(circle(52.5, 753.5, 3.5, { fill: red }));
content.push(text(62, 761, 10.5, 'TEXAS ABA CENTERS', { bold: true }));
content.push(text(62, 747, 8.2, 'COMMON GROUND - PARENT SUPPORT', { rgb: muted }));
content.push(text(497, 761, 8, 'CG-WS-05 v1.0', { rgb: muted }));
content.push(text(448, 747, 7.5, 'Private fillable parent worksheet', { rgb: muted }));
content.push(line(34, 736, 578, 736));
content.push(text(34, 707, 20, 'Home Situation Snapshot', { bold: true }));
content.push(text(34, 690, 8.8, 'Record one real situation so another person can understand it clearly.', { rgb: muted }));
content.push(text(34, 679, 8.8, 'Describe what you saw and heard. Do not guess why it happened.', { rgb: muted }));
content.push(text(380, 707, 6.9, 'DATE SHARED', { rgb: muted }));
content.push(text(446, 707, 6.9, 'PERSON / ROLE', { rgb: muted }));
content.push(text(528, 707, 6.9, 'FOLLOW-UP', { rgb: muted }));
content.push(rect(380, 687, 58, 16, { fill: fieldFill, stroke: border }));
content.push(rect(446, 687, 74, 16, { fill: fieldFill, stroke: border }));
content.push(rect(528, 687, 50, 16, { fill: fieldFill, stroke: border }));

content.push(sectionBar(642, '1. NAME THE SITUATION'));
content.push(text(34, 627, 7.5, 'CHECK THE CLOSEST FIT', { rgb: muted }));
const typeItems = [
  [50, 610, ['Outing or public place']], [230, 610, ['Morning / getting ready']], [410, 610, ['Meal or food routine']],
  [50, 586, ['Bedtime or sleep']], [230, 586, ['Communication breakdown']], [410, 586, ['Appointment or transition']],
  [50, 562, ['Another home situation']],
];
for (const [x, y, lines] of typeItems) content.push(labelLines(x, y, lines, { size: 7.8 }));
for (const [x, y] of [[34,608],[214,608],[394,608],[34,584],[214,584],[394,584],[34,560]]) content.push(rect(x, y, 10, 10, { fill: white, stroke: border }));
content.push(text(214, 568, 7.4, 'DATE', { rgb: muted }));
content.push(text(319, 568, 7.4, 'START TIME', { rgb: muted }));
content.push(text(424, 568, 7.4, 'ABOUT HOW LONG?', { rgb: muted }));
content.push(rect(214, 546, 90, 18, { fill: fieldFill, stroke: border }));
content.push(rect(319, 546, 90, 18, { fill: fieldFill, stroke: border }));
content.push(rect(424, 546, 154, 18, { fill: fieldFill, stroke: border }));
content.push(text(34, 529, 7.4, 'WHERE IT HAPPENED', { rgb: muted }));
content.push(text(310, 529, 7.4, 'WHO WAS THERE', { rgb: muted }));
content.push(rect(34, 507, 260, 18, { fill: fieldFill, stroke: border }));
content.push(rect(310, 507, 268, 18, { fill: fieldFill, stroke: border }));

content.push(sectionBar(470, '2. WHAT HAPPENED'));
content.push(text(34, 455, 7.4, 'WHAT WAS HAPPENING JUST BEFORE?', { rgb: muted }));
content.push(text(313, 455, 7.4, 'THE EXACT MOMENT THINGS CHANGED', { rgb: muted }));
content.push(rect(34, 405, 264, 42, { fill: fieldFill, stroke: border }));
content.push(rect(313, 405, 265, 42, { fill: fieldFill, stroke: border }));
content.push(text(34, 389, 7.4, 'WHAT I SAW OR HEARD - WORDS, ACTIONS, SOUNDS, INJURY, OR DAMAGE', { rgb: muted }));
content.push(rect(34, 335, 544, 46, { fill: fieldFill, stroke: border }));
content.push(text(34, 319, 7.4, 'WHAT I TRIED', { rgb: muted }));
content.push(text(313, 319, 7.4, 'HOW IT ENDED', { rgb: muted }));
content.push(rect(34, 278, 264, 33, { fill: fieldFill, stroke: border }));
content.push(rect(313, 278, 265, 33, { fill: fieldFill, stroke: border }));

content.push(sectionBar(241, '3. WHAT IT COST THE FAMILY', paleBlue, navy));
content.push(text(34, 226, 7.4, 'CHECK ANY THAT FIT', { rgb: muted }));
const impactItems = [
  [50, 207, ['We had to leave or cancel']],
  [230, 207, ['Work, school, or an appointment', 'was missed']],
  [410, 207, ['A sibling or another family member', 'was affected']],
  [50, 179, ['Sleep or the next day was affected']],
  [230, 179, ['Someone was hurt or safety was', 'uncertain']],
  [410, 179, ['Property was damaged']],
  [50, 151, ['The routine could not be finished']],
];
for (const [x, y, lines] of impactItems) content.push(labelLines(x, y, lines, { size: 7.45, leading: 7.7 }));
for (const [x, y] of [[34,205],[214,205],[394,205],[34,177],[214,177],[394,177],[34,149]]) content.push(rect(x, y, 10, 10, { fill: white, stroke: border }));
content.push(text(214, 157, 7.4, 'THE FAMILY COST IN ONE LINE', { rgb: muted }));
content.push(rect(214, 134, 364, 21, { fill: fieldFill, stroke: border }));

content.push(sectionBar(99, '4. TAKE THIS TO THE TEAM'));
content.push(text(34, 84, 7.4, 'ONE-SENTENCE SUMMARY', { rgb: muted }));
content.push(rect(34, 55, 544, 22, { fill: fieldFill, stroke: border }));
content.push(text(34, 41, 7.4, 'MY EXACT QUESTION', { rgb: muted }));
content.push(rect(34, 14, 544, 21, { fill: fieldFill, stroke: border }));
content.push(roundRect(34, 0.5, 544, 10.5, 5, { fill: paleRed, stroke: [1, 0.55, 0.52], lineWidth: 0.5 }));
content.push(text(44, 3.3, 5.7, 'Immediate danger: call 911. Private file - Common Ground never receives or stores what you enter.', { rgb: red }));

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
function addTextField(name, rectValues, multiline = false, fontSize = 8) {
  const [x1, y1, x2, y2] = rectValues;
  const flags = multiline ? 4096 : 0;
  const field = addObject(`<< /Type /Annot /Subtype /Widget /FT /Tx /T (${pdfString(name)}) /Rect [${x1} ${y1} ${x2} ${y2}] /F 4 /Ff ${flags} /P ${pageObj} 0 R /V () /DA (/F1 ${fontSize} Tf 0.102 0.153 0.263 rg) /Q 0 /BS << /W 0 >> >>`);
  fields.push(field);
}
function addCheckbox(name, rectValues) {
  const [x1, y1, x2, y2] = rectValues;
  const field = addObject(`<< /Type /Annot /Subtype /Widget /FT /Btn /T (${pdfString(name)}) /Rect [${x1} ${y1} ${x2} ${y2}] /F 4 /Ff 0 /P ${pageObj} 0 R /V /Off /AS /Off /AP << /N << /Off ${offAppearance} 0 R /Yes ${yesAppearance} 0 R >> >> >>`);
  fields.push(field);
}

addCheckbox('type_outing', [34,608,44,618]);
addCheckbox('type_morning', [214,608,224,618]);
addCheckbox('type_meal', [394,608,404,618]);
addCheckbox('type_bedtime', [34,584,44,594]);
addCheckbox('type_communication', [214,584,224,594]);
addCheckbox('type_transition', [394,584,404,594]);
addCheckbox('type_other', [34,560,44,570]);
addTextField('situation_date', [214,546,304,564]);
addTextField('start_time', [319,546,409,564]);
addTextField('duration', [424,546,578,564]);
addTextField('location', [34,507,294,525]);
addTextField('people_present', [310,507,578,525]);
addTextField('just_before', [34,405,298,447], true, 7.5);
addTextField('changed_moment', [313,405,578,447], true, 7.5);
addTextField('observed', [34,335,578,381], true, 7.5);
addTextField('what_i_tried', [34,278,298,311], true, 7.5);
addTextField('how_it_ended', [313,278,578,311], true, 7.5);
addCheckbox('impact_left_or_cancelled', [34,205,44,215]);
addCheckbox('impact_work_school', [214,205,224,215]);
addCheckbox('impact_sibling', [394,205,404,215]);
addCheckbox('impact_sleep', [34,177,44,187]);
addCheckbox('impact_safety', [214,177,224,187]);
addCheckbox('impact_property', [394,177,404,187]);
addCheckbox('impact_routine', [34,149,44,159]);
addTextField('family_cost', [214,134,578,155], false, 7.5);
addTextField('one_sentence_summary', [34,55,578,77], true, 7.5);
addTextField('exact_question', [34,14,578,35], true, 7.5);
addTextField('date_shared', [380,687,438,703], false, 7);
addTextField('person_role', [446,687,520,703], false, 7);
addTextField('follow_up_date', [528,687,578,703], false, 7);

const pagesObj = addObject('PAGES_PLACEHOLDER');
const acroFormObj = addObject(`<< /Fields [${fields.map((id) => `${id} 0 R`).join(' ')}] /NeedAppearances true /DA (/F1 8 Tf 0.102 0.153 0.263 rg) /DR << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> >>`);
const catalogObj = addObject(`<< /Type /Catalog /Pages ${pagesObj} 0 R /AcroForm ${acroFormObj} 0 R >>`);
const infoObj = addObject('<< /Title (Common Ground - Home Situation Snapshot) /Author (Texas ABA Centers - Common Ground) /Subject (Private fillable home situation snapshot for parent use) /Creator (Common Ground worksheet materializer) >>');
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
