import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const OUTPUT = resolve(process.cwd(), 'public/worksheets/care-clarity-review.pdf');
const BASE64 = '__BASE64_PLACEHOLDER__';

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, Buffer.from(BASE64, 'base64'));
console.log(`WORKSHEET_ASSET_READY=${OUTPUT}`);
