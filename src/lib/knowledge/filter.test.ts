import { describe, expect, it } from "vitest";
import { sourceLabel } from "./categories";
import {
  applyExperiences,
  applyGuides,
  buildKnowledgeQuery,
  countByCategory,
  isStale,
  parseKnowledgeParams,
} from "./filter";
import { MOCK_EXPERIENCES, MOCK_GUIDES } from "./mock-data";
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

  it("accepts scope and pillar parameters", () => {
    const parsed = parseKnowledgeParams({
      scope: "prog-d4-tri",
      pillar: "experiences",
    });
    expect(parsed.scope).toBe("prog-d4-tri");
    expect(parsed.pillar).toBe("experiences");
  });
});

describe("buildKnowledgeQuery", () => {
  it("omits empty values and encodes text", () => {
    expect(buildKnowledgeQuery({ category: null, q: "" })).toBe("");
    expect(
      buildKnowledgeQuery({ category: "academic_survival", q: "a b&c" }),
    ).toBe("?q=a+b%26c&category=academic_survival");
  });

  it("includes scope (including all) and pillar when provided", () => {
    expect(
      buildKnowledgeQuery({
        category: null,
        q: "",
        scope: "prog-d4-tri",
        pillar: "experiences",
      }),
    ).toBe("?scope=prog-d4-tri&pillar=experiences");
    expect(
      buildKnowledgeQuery({
        category: null,
        q: "",
        scope: "all",
      }),
    ).toBe("?scope=all");
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

  it("filters cleanly by scope: all (general), major (D4 TRI), and another program", () => {
    const general = applyGuides(MOCK_GUIDES, {
      category: null,
      q: "",
      scope: "all",
    });
    expect(general.length).toBeGreaterThan(0);
    expect(general.every((g) => g.is_general)).toBe(true);

    const tri = applyGuides(MOCK_GUIDES, {
      category: null,
      q: "",
      scope: "major",
    });
    expect(tri.length).toBeGreaterThan(0);
    expect(tri.every((g) => g.program_id === "prog-d4-tri")).toBe(true);

    const trpl = applyGuides(MOCK_GUIDES, {
      category: null,
      q: "",
      scope: "prog-d4-trpl",
    });
    expect(trpl).toHaveLength(1);
    expect(trpl[0].program_id).toBe("prog-d4-trpl");
  });
});

describe("applyExperiences", () => {
  it("filters experiences by keyword and sorts by helpful_count", () => {
    const result = applyExperiences(MOCK_EXPERIENCES, {
      category: null,
      q: "Telkom",
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].title).toContain("Telkom");
  });

  it("filters experiences by major scope", () => {
    const result = applyExperiences(MOCK_EXPERIENCES, {
      category: null,
      q: "",
      scope: "major",
    });
    expect(result.length).toBeGreaterThanOrEqual(3);
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
