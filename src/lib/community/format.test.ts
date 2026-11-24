import { describe, expect, it } from "vitest";
import { categoryLabel, formatRelativeTime, pluralize } from "./format";

describe("formatRelativeTime", () => {
  const now = Date.parse("2026-11-24T12:00:00Z");
  it.each([
    ["2026-11-24T11:59:40Z", "just now"],
    ["2026-11-24T11:55:00Z", "5 min ago"],
    ["2026-11-24T09:00:00Z", "3 h ago"],
    ["2026-11-22T12:00:00Z", "2 d ago"],
    ["2026-10-01T12:00:00Z", "1 Oct 2026"],
  ])("%s -> %s", (iso, expected) => {
    expect(formatRelativeTime(iso, now)).toBe(expected);
  });

  it("returns empty text for invalid dates and never goes negative", () => {
    expect(formatRelativeTime("nope", now)).toBe("");
    expect(formatRelativeTime("2026-11-25T12:00:00Z", now)).toBe("just now");
  });
});

describe("categoryLabel / pluralize", () => {
  it("maps known tokens and humanizes unknown ones", () => {
    expect(categoryLabel("academic")).toBe("Academic");
    expect(categoryLabel("career_prep")).toBe("Career prep");
  });
  it("pluralizes", () => {
    expect(pluralize(1, "comment")).toBe("1 comment");
    expect(pluralize(0, "comment")).toBe("0 comments");
  });
});
