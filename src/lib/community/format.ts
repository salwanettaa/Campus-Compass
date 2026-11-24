import { ADAPTATION_AREAS } from "@/lib/constants/onboarding";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "just now", "5 min ago", "3 h ago", "2 d ago", then a short date. */
export function formatRelativeTime(iso: string, now: number = Date.now()) {
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return "";
  const diff = Math.max(0, now - time);
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} min ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} h ago`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)} d ago`;
  return new Date(time).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Label for `posts.category`; falls back to a readable version of the token. */
export function categoryLabel(category: string) {
  const known = ADAPTATION_AREAS.find((area) => area.value === category);
  if (known) return known.label;
  const text = category.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function pluralize(count: number, singular: string, plural?: string) {
  return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}
