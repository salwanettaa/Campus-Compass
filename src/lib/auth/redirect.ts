/**
 * Only allow redirects to paths inside this app, preventing open-redirect
 * attacks via a crafted ?next= value (e.g. "//evil.com" or "https://evil.com").
 */
export function safeNextPath(value: unknown, fallback = "/home"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\")) return fallback;
  return value;
}
