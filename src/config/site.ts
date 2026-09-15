/**
 * Single source of truth for white-label deployment values.
 *
 * Common Ground ships brand-neutral. Everything an operator needs to make it
 * their own lives here — no brand strings, phone numbers, or domains are
 * hardcoded anywhere else in the app.
 *
 * To rebrand a deployment, set the NEXT_PUBLIC_SITE_* environment variables
 * below. Unset values fall back to safe, obviously-placeholder defaults so a
 * misconfigured deploy is visible rather than silently wrong.
 */

// Defaults live in JSON so the Node build scripts in /scripts can read the
// same values without duplicating them (see scripts/site-config.mjs).
import defaults from './site.defaults.json';

export interface SiteConfig {
  /** Operator / organization name shown in copy, footers and PDF metadata. */
  orgName: string;
  /** Absolute origin, used for metadataBase, OG urls, sitemap and print headers. */
  domain: string;
  /** E.164 phone for `tel:` hrefs. */
  phone: string;
  /** Human-formatted phone for visible labels. */
  phoneDisplay: string;
  /** Contact address for privacy / policy enquiries. */
  email: string;
  /**
   * Provider id in `src/lib/providers.ts` that acts as "your clinic" — the
   * recommended first call for families who need therapy services. Set to
   * null (the default) when the deployment has no affiliated clinic, in which
   * case the UI falls back to neutral "choose a provider" guidance.
   */
  firstCallProviderId: string | null;
  /** Primary brand mark, served from /public. */
  logoSrc: string;
}

export const SITE: SiteConfig = {
  orgName: process.env.NEXT_PUBLIC_SITE_ORG_NAME ?? defaults.orgName,
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? defaults.domain,
  phone: process.env.NEXT_PUBLIC_SITE_PHONE ?? defaults.phone,
  phoneDisplay: process.env.NEXT_PUBLIC_SITE_PHONE_DISPLAY ?? defaults.phoneDisplay,
  email: process.env.NEXT_PUBLIC_SITE_EMAIL ?? defaults.email,
  firstCallProviderId: process.env.NEXT_PUBLIC_SITE_FIRST_CALL_PROVIDER_ID ?? null,
  logoSrc: process.env.NEXT_PUBLIC_SITE_LOGO_SRC ?? defaults.logoSrc,
};

/** Host without protocol — for print headers and plain-text contexts. */
export const siteHost = SITE.domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

export default SITE;
