import { describe, expect, it } from "vitest";
import { MOCK_GUIDES } from "@/lib/knowledge/mock-data";
import {
  SAMPLE_MESSAGES,
  SAMPLE_SOURCES,
  citationNumbers,
} from "./mock-data";

describe("AI Navigator sample data", () => {
  it("every source points to a published guide", () => {
    for (const source of SAMPLE_SOURCES) {
      const guide = MOCK_GUIDES.find((g) => g.id === source.guideId);
      expect(guide?.is_published).toBe(true);
    }
  });

  it("every citation in an answer has a source card", () => {
    const known = new Set(SAMPLE_SOURCES.map((s) => s.index));
    for (const message of SAMPLE_MESSAGES) {
      if (message.role !== "assistant") continue;
      const used = citationNumbers(message.text);
      expect(used.length).toBeGreaterThan(0);
      for (const n of used) expect(known.has(n)).toBe(true);
      expect([...new Set(used)].sort()).toEqual([...message.citations].sort());
    }
  });
});
