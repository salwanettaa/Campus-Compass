/**
 * Public base URL of the app, used for links in emails (auth confirmation) and
 * absolute metadata URLs.
 *
 * Priority:
 *   1. NEXT_PUBLIC_APP_URL      - set this explicitly for production.
 *   2. VERCEL_URL               - automatic on Vercel (previews get their own URL).
 *   3. http://localhost:3000    - local development.
 */
export function getAppUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
