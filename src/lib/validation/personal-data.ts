/**
 * Heuristic detector for personal data that must not appear in public text:
 * email addresses, phone numbers, and student ID numbers (NIM).
 *
 * This is a safety net, NOT anonymization. It cannot catch spelled-out digits
 * ("zero eight one two ..."), obfuscated emails like "budi at gmail dot com",
 * or social media handles.
 */

// Dates and similar patterns are blanked out first so their digits are not
// mistaken for an ID or phone number.
const SAFE_NUMBER_PATTERNS: RegExp[] = [
  // 24-11-2026, 24/11/2026, 24.11.26
  /\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b/g,
  // 2026-11-24
  /\b(?:19|20)\d{2}[-/.]\d{1,2}[-/.]\d{1,2}\b/g,
  // Year ranges: 2024-2025, 2024/2025, 2024 - 2025
  /\b(?:19|20)\d{2}\s*[-/–]\s*(?:19|20)\d{2}\b/g,
  // Decimals such as GPA 3.75 or 3,8
  /\b\d{1,2}[.,]\d{1,3}\b/g,
];

const EMAIL =
  /[\w.+-]+\s*(?:@|\(at\)|\[at\])\s*[\w-]+(?:\s*(?:\.|\(dot\)|\[dot\])\s*[\w-]+)+/i;

/** Digits that may be separated by spaces, dots, dashes, slashes, brackets. */
const NUMBER_RUN = /\+?\(?\d(?:[\s.\-/()]*\d)+/g;

/** Phone numbers start with 0, a country code (+ or 62), or a bracketed area code. */
const PHONE_START = /^(?:\+|0|62)/;

const MIN_PHONE_DIGITS = 9;
const MIN_ID_DIGITS = 8;

export function containsPersonalData(text: string): boolean {
  if (EMAIL.test(text)) return true;

  let cleaned = text;
  for (const pattern of SAFE_NUMBER_PATTERNS) {
    cleaned = cleaned.replace(pattern, " ");
  }

  // Student IDs (NIM) and unformatted phone numbers: a long unbroken digit run.
  if (new RegExp(`\\d{${MIN_ID_DIGITS},}`).test(cleaned)) return true;

  // Phone numbers written with separators, brackets, or single digits apart.
  for (const match of cleaned.matchAll(NUMBER_RUN)) {
    const run = match[0].replace(/^\(/, "");
    const digits = run.replace(/\D/g, "");
    if (digits.length >= MIN_PHONE_DIGITS && PHONE_START.test(run.replace(/[\s.\-/()]/g, ""))) {
      return true;
    }
  }
  return false;
}
