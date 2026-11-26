import { CATEGORY_INFO } from "./categories";
import {
  GUIDE_CATEGORIES,
  PILOT_PROGRAM,
  type ExperienceRow,
  type GuideCategory,
  type GuideRow,
} from "./types";

export type KnowledgeScope = "all" | "major" | string;
export type KnowledgePillar = "guides" | "experiences";

export type KnowledgeParams = {
  /** `null` means all categories. */
  category: GuideCategory | null;
  q: string;
  scope?: KnowledgeScope;
  pillar?: KnowledgePillar;
};

type RawParams = Record<string, string | string[] | undefined>;

const MAX_QUERY_LENGTH = 100;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** Reads `?category=`, `?q=`, `?scope=`, and `?pillar=`; ignores invalid tokens. */
export function parseKnowledgeParams(raw: RawParams): KnowledgeParams {
  const category = first(raw.category);
  const scopeRaw = first(raw.scope);
  const pillarRaw = first(raw.pillar);

  const parsed: KnowledgeParams = {
    category: GUIDE_CATEGORIES.find((value) => value === category) ?? null,
    q: (first(raw.q) ?? "").trim().slice(0, MAX_QUERY_LENGTH),
  };

  if (scopeRaw) {
    parsed.scope = scopeRaw;
  }

  if (pillarRaw === "experiences" || pillarRaw === "guides") {
    parsed.pillar = pillarRaw;
  }

  return parsed;
}

export function buildKnowledgeQuery(params: KnowledgeParams): string {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.scope && params.scope !== "all") query.set("scope", params.scope);
  if (params.pillar && params.pillar !== "guides") query.set("pillar", params.pillar);
  const text = query.toString();
  return text ? `?${text}` : "";
}

function normalize(text: string) {
  return text.toLowerCase();
}

/**
 * Basic search: every word must appear in the title, category name, source
 * reference, or text. Published guides only, newest verification first.
 * Filtered by scope if specified.
 */
export function applyGuides(
  guides: readonly GuideRow[],
  params: KnowledgeParams,
): GuideRow[] {
  const words = normalize(params.q).split(/\s+/).filter(Boolean);

  return guides
    .filter((guide) => guide.is_published)
    .filter((guide) => !params.category || guide.category === params.category)
    .filter((guide) => {
      // If no scope is specified or scope is "all", include all matching guides
      if (!params.scope || params.scope === "all") return true;

      // "major" defaults to the pilot major (D4 TRI)
      if (params.scope === "major" || params.scope === PILOT_PROGRAM.id) {
        return guide.is_general || guide.program_id === PILOT_PROGRAM.id;
      }

      // Specific program chosen
      return guide.is_general || guide.program_id === params.scope;
    })
    .filter((guide) => {
      if (words.length === 0) return true;
      const haystack = normalize(
        [
          guide.title,
          CATEGORY_INFO[guide.category].label,
          guide.source_reference ?? "",
          guide.content_raw,
        ].join(" "),
      );
      return words.every((word) => haystack.includes(word));
    })
    .sort(
      (a, b) => Date.parse(b.last_verified_at) - Date.parse(a.last_verified_at),
    );
}

/**
 * Filter experiences by search term and program scope.
 */
export function applyExperiences(
  experiences: readonly ExperienceRow[],
  params: KnowledgeParams,
): ExperienceRow[] {
  const words = normalize(params.q).split(/\s+/).filter(Boolean);

  return experiences
    .filter((exp) => {
      if (!params.scope || params.scope === "all") return true;

      if (params.scope === "major" || params.scope === PILOT_PROGRAM.id) {
        return exp.program_id === PILOT_PROGRAM.id || exp.program_id.includes("00000000-0000");
      }

      return exp.program_id === params.scope;
    })
    .filter((exp) => {
      if (words.length === 0) return true;
      const haystack = normalize(
        [
          exp.title,
          exp.situation,
          exp.challenge,
          exp.solution,
          exp.result,
          exp.advice_for_juniors,
          ...exp.tags,
        ].join(" "),
      );
      return words.every((word) => haystack.includes(word));
    })
    .sort((a, b) => b.helpful_count - a.helpful_count);
}

/** Number of published guides per category, for the category tiles. */
export function countByCategory(guides: readonly GuideRow[]) {
  const counts = Object.fromEntries(
    GUIDE_CATEGORIES.map((c) => [c, 0]),
  ) as Record<GuideCategory, number>;
  for (const guide of guides) {
    if (guide.is_published) counts[guide.category] += 1;
  }
  return counts;
}

const DAY = 86_400_000;
/** Guides not verified for this long get an "may be outdated" hint. */
export const STALE_AFTER_DAYS = 180;

export function isStale(lastVerifiedAt: string, now: number = Date.now()) {
  const time = Date.parse(lastVerifiedAt);
  if (Number.isNaN(time)) return true;
  return now - time > STALE_AFTER_DAYS * DAY;
}

export function formatVerifiedDate(iso: string) {
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return "unknown date";
  return new Date(time).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
