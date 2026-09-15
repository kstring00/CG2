// Shared white-label config for the Node build scripts.
// Reads the same defaults as src/config/site.ts so the two cannot drift.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const defaults = JSON.parse(
  readFileSync(resolve(process.cwd(), 'src/config/site.defaults.json'), 'utf8'),
);

export const SITE = {
  orgName: process.env.NEXT_PUBLIC_SITE_ORG_NAME ?? defaults.orgName,
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? defaults.domain,
  phone: process.env.NEXT_PUBLIC_SITE_PHONE ?? defaults.phone,
  phoneDisplay: process.env.NEXT_PUBLIC_SITE_PHONE_DISPLAY ?? defaults.phoneDisplay,
  email: process.env.NEXT_PUBLIC_SITE_EMAIL ?? defaults.email,
};

/** Uppercase org name for PDF headers. */
export const ORG_HEADER = SITE.orgName.toUpperCase();

export default SITE;
