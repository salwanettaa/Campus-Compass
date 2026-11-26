import { CATEGORY_INFO } from "./categories";
import {
  AVAILABLE_PROGRAMS,
  GUIDE_CATEGORIES,
  PILOT_PROGRAM,
  type ExperienceRow,
  type GuideCategory,
  type GuideRow,
  type ProgramOption,
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
  const scopeRaw = first(raw.scope)?.trim();
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

/**
 * Serializes active filter state to a query string.
 * Always preserves `scope` (including `scope=all`) when set so switching to
 * General does not fall back to the default `major` view.
 */
export function buildKnowledgeQuery(params: KnowledgeParams): string {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.scope) query.set("scope", params.scope);
  if (params.pillar && params.pillar !== "guides") {
    query.set("pillar", params.pillar);
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}

function normalize(text: string) {
  return text.toLowerCase();
}

/**
 * Matches a guide/experience `program_id` against a selected program option.
 * Supports both live database UUIDs and fallback mock IDs (`prog-d4-tri`, etc.)
 * mapped via program code so mock data still works when DB programs use UUIDs.
 */
export function matchesProgram(
  rowProgramId: string | null,
  targetProgram: ProgramOption,
  allPrograms: readonly ProgramOption[] = AVAILABLE_PROGRAMS,
): boolean {
  if (!rowProgramId) return false;
  if (rowProgramId === targetProgram.id) return true;

  // Map DB program codes to mock IDs if the row comes from sample fallback data.
  const code = targetProgram.code.toUpperCase();
  if (rowProgramId === `prog-d4-${code.toLowerCase()}`) return true;
  if (rowProgramId === `prog-s1-${code.toLowerCase()}`) return true;
  if (code === "TRI" || code === "IF") {
    if (
      rowProgramId === PILOT_PROGRAM.id ||
      rowProgramId === "00000000-0000-4000-8000-000000000011"
    ) {
      return true;
    }
  }

  const matchedMock = allPrograms.find(
    (p) => p.id === rowProgramId && p.code.toUpperCase() === code,
  );
  return Boolean(matchedMock);
}

/**
 * Filters published guides by scope, category, and search terms.
 * - No scope (unit tests): all published guides
 * - `scope === "all"`: general campus guides (`is_general === true`)
 * - `scope === "major"`: guides for `myProgram`
 * - `scope === "<programId>"`: guides for that chosen program
 */
export function applyGuides(
  guides: readonly GuideRow[],
  params: KnowledgeParams,
  options?: {
    myProgram?: ProgramOption;
    programs?: readonly ProgramOption[];
  },
): GuideRow[] {
  const words = normalize(params.q).split(/\s+/).filter(Boolean);
  const myProgram = options?.myProgram ?? PILOT_PROGRAM;
  const programs = options?.programs ?? AVAILABLE_PROGRAMS;

  return guides
    .filter((guide) => guide.is_published)
    .filter((guide) => !params.category || guide.category === params.category)
    .filter((guide) => {
      if (!params.scope) return true;
      if (params.scope === "all") return guide.is_general;

      const targetProgram =
        params.scope === "major"
          ? myProgram
          : programs.find((p) => p.id === params.scope);

      if (!targetProgram) {
        return guide.program_id === params.scope;
      }

      return matchesProgram(guide.program_id, targetProgram, programs);
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
 * Filters senior experiences by search term and program scope.
 * - No scope or `scope === "all"`: all experiences in the campus
 * - `scope === "major"`: experiences for `myProgram`
 * - `scope === "<programId>"`: experiences for that chosen program
 */
export function applyExperiences(
  experiences: readonly ExperienceRow[],
  params: KnowledgeParams,
  options?: {
    myProgram?: ProgramOption;
    programs?: readonly ProgramOption[];
  },
): ExperienceRow[] {
  const words = normalize(params.q).split(/\s+/).filter(Boolean);
  const myProgram = options?.myProgram ?? PILOT_PROGRAM;
  const programs = options?.programs ?? AVAILABLE_PROGRAMS;

  return experiences
    .filter((exp) => {
      if (!params.scope || params.scope === "all") return true;

      const targetProgram =
        params.scope === "major"
          ? myProgram
          : programs.find((p) => p.id === params.scope);

      if (!targetProgram) {
        return exp.program_id === params.scope;
      }

      return matchesProgram(exp.program_id, targetProgram, programs);
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
