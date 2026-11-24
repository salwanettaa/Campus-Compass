import { describe, expect, it } from "vitest";
import { applyFeed, buildFeedQuery, parseFeedParams } from "./feed";
import { MOCK_POSTS, MOCK_COMMENTS } from "./mock-data";
import type { FeedItem } from "./types";

const items: FeedItem[] = MOCK_POSTS.map((post) => ({
  post,
  commentCount: MOCK_COMMENTS.filter((c) => c.post_id === post.id).length,
  viewerHelpful: false,
}));

describe("parseFeedParams", () => {
  it("uses defaults for missing or invalid values", () => {
    expect(parseFeedParams({})).toEqual({ sort: "for-you", type: null });
    expect(parseFeedParams({ sort: "hacked", type: "<script>" })).toEqual({
      sort: "for-you",
      type: null,
    });
  });

  it("accepts valid values, also when repeated in the URL", () => {
    expect(parseFeedParams({ sort: "helpful", type: "guide" })).toEqual({
      sort: "helpful",
      type: "guide",
    });
    expect(parseFeedParams({ sort: ["new", "helpful"] }).sort).toBe("new");
  });
});

describe("buildFeedQuery", () => {
  it("omits defaults", () => {
    expect(buildFeedQuery({ sort: "for-you", type: null })).toBe("");
    expect(buildFeedQuery({ sort: "new", type: "question" })).toBe(
      "?sort=new&type=question",
    );
  });
});

describe("applyFeed", () => {
  const now = Date.now();

  it("sorts New by date, newest first", () => {
    const result = applyFeed(items, { sort: "new", type: null }, now);
    const dates = result.map((i) => Date.parse(i.post.created_at));
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it("sorts Helpful by helpful_count, highest first", () => {
    const counts = applyFeed(items, { sort: "helpful", type: null }, now).map(
      (i) => i.post.helpful_count,
    );
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  it("Unanswered keeps only questions without comments or accepted answer", () => {
    const result = applyFeed(items, { sort: "unanswered", type: null }, now);
    expect(result.length).toBeGreaterThan(0);
    for (const item of result) {
      expect(item.post.post_type).toBe("question");
      expect(item.commentCount).toBe(0);
      expect(item.post.has_accepted_answer).toBe(false);
    }
  });

  it("filters by post type", () => {
    const result = applyFeed(items, { sort: "new", type: "guide" }, now);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((i) => i.post.post_type === "guide")).toBe(true);
  });

  it("hides posts that are not published", () => {
    const hidden: FeedItem[] = items.map((i) => ({
      ...i,
      post: { ...i.post, status: "reported" },
    }));
    expect(applyFeed(hidden, { sort: "new", type: null }, now)).toEqual([]);
  });

  it("does not mutate the input", () => {
    const copy = [...items];
    applyFeed(items, { sort: "helpful", type: null }, now);
    expect(items).toEqual(copy);
  });
});
