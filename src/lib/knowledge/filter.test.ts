import { describe, expect, it } from "vitest";
import { sourceLabel } from "./categories";
import {
  applyGuides,
  buildKnowledgeQuery,
  countByCategory,
  isStale,
  parseKnowledgeParams,
} from "./filter";
import { MOCK_GUIDES } from "./mock-data";
import { GUIDE_CATEGORIES } from "./types";

describe("parseKnowledgeParams", () => {
  it("uses defaults and ignores invalid categories", () => {
    expect(parseKnowledgeParams({})).toEqual({ category: null, q: "" });
    expect(parseKnowledgeParams({ category: "hacked" }).category).toBeNull();
  });

  it("accepts a valid category, trims and limits the query", () => {
    const parsed = parseKnowledgeParams({
      category: "campus_essentials",
      q: `  ${"a".repeat(300)}  `,
    });
    expect(parsed.category).toBe("campus_essentials");
    expect(parsed.q).toHaveLength(100);
  });

  it("uses the first value when a param is repeated", () => {
    expect(parseKnowledgeParams({ q: ["one", "two"] }).q).toBe("one");
  });
});

describe("buildKnowledgeQuery", () => {
  it("omits empty values and encodes text", () => {
    expect(buildKnowledgeQuery({ category: null, q: "" })).toBe("");
    expect(
      buildKnowledgeQuery({ category: "academic_survival", q: "a b&c" }),
    ).toBe("?q=a+b%26c&category=academic_survival");
  });
});

describe("applyGuides", () => {
  const all = { category: null, q: "" } as const;

  it("never returns unpublished guides", () => {
    const result = applyGuides(MOCK_GUIDES, all);
    expect(result.every((g) => g.is_published)).toBe(true);
    expect(result.some((g) => g.title.startsWith("Draft"))).toBe(false);
  });

  it("sorts by last_verified_at, newest first", () => {
    const dates = applyGuides(MOCK_GUIDES, all).map((g) =>
      Date.parse(g.last_verified_at),
    );
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it("filters by category", () => {
    const result = applyGuides(MOCK_GUIDES, {
      category: "academic_survival",
      q: "",
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((g) => g.category === "academic_survival")).toBe(true);
  });

  it("searches case-insensitively and needs every word", () => {
    expect(
      applyGuides(MOCK_GUIDES, { category: null, q: "SCHOLARSHIP" }).length,
    ).toBeGreaterThan(0);
    expect(
      applyGuides(MOCK_GUIDES, { category: null, q: "scholarship zebra" }),
    ).toEqual([]);
  });

  it("combines search and category", () => {
    expect(
      applyGuides(MOCK_GUIDES, { category: "career_preparation", q: "internship" }),
    ).toHaveLength(1);
    expect(
      applyGuides(MOCK_GUIDES, { category: "social_community", q: "internship" }),
    ).toEqual([]);
  });
});

describe("countByCategory", () => {
  it("counts only published guides and covers all 6 categories", () => {
    const counts = countByCategory(MOCK_GUIDES);
    expect(Object.keys(counts)).toHaveLength(6);
    expect(counts.administrative_guide).toBe(1);
    for (const category of GUIDE_CATEGORIES) {
      expect(counts[category]).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("isStale / sourceLabel", () => {
  const now = Date.parse("2026-11-24T00:00:00Z");
  it("flags guides older than 180 days and invalid dates", () => {
    expect(isStale("2026-11-01T00:00:00Z", now)).toBe(false);
    expect(isStale("2026-01-01T00:00:00Z", now)).toBe(true);
    expect(isStale("nope", now)).toBe(true);
  });
  it("labels known and unknown source types", () => {
    expect(sourceLabel("official_campus_source")).toBe("Official campus source");
    expect(sourceLabel("some_new_type")).toBe("Some new type");
  });
});
