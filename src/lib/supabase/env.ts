/**
 * Supabase public configuration.
 *
 * NEXT_PUBLIC_* values must be referenced literally (process.env.NEXT_PUBLIC_X)
 * so Next.js can inline them into the browser bundle.
 * The service-role key is deliberately NOT read here: it is server-only and no
 * code in this slice needs it.
 */

const PLACEHOLDER_MARKERS = ["your-project-ref", "your-supabase-anon-key"];

function isRealValue(value: string | undefined): value is string {
  if (!value) return false;
  return !PLACEHOLDER_MARKERS.some((marker) => value.includes(marker));
}

export function hasSupabaseEnv(): boolean {
  return (
    isRealValue(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    isRealValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isRealValue(url) || !isRealValue(anonKey)) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env.local and set " +
        "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { url, anonKey };
}
