/**
 * Phone parsing for directory listings.
 *
 * Listing phone strings can carry extensions and secondary numbers
 * ("(512) 479-4199 ext. 2 (English) / ext. 3 (Spanish)",
 * "(866) 896-6001 or (512) 458-8600") or no number at all
 * ("Contact via website", "Varies by therapist"). A tel: link must dial
 * exactly one valid number, so callers link `dial` and show the full
 * string — extensions included — as visible text. When no dialable
 * number exists, no tel: link is rendered at all.
 */

export type DialablePhone = {
  /** Digits-only value for the tel: href — one number, no extension. */
  dial: string;
  /** The full human-readable string, extensions and notes included. */
  display: string;
};

/** Short dial codes that are valid on their own (crisis/info lines). */
const SHORT_CODES = /^(911|988|211|741741)$/;

/** First US ten-digit number in the string, with optional leading 1. */
const US_NUMBER = /(?:\+?1[\s.-]?)?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})/;

export function parsePhone(raw: string | null | undefined): DialablePhone | null {
  if (!raw) return null;
  const display = raw.trim();
  if (!display) return null;

  const bare = display.replace(/\s*\(call or text\)\s*/i, '').trim();
  if (SHORT_CODES.test(bare)) {
    return { dial: bare, display };
  }

  const match = display.match(US_NUMBER);
  if (!match) return null;
  return { dial: `+1${match[1]}${match[2]}${match[3]}`, display };
}
