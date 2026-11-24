import { describe, expect, it } from "vitest";
import { buildCommentTree } from "./comments";
import type { CommentRow } from "./types";

function c(id: string, extra: Partial<CommentRow> = {}): CommentRow {
  return {
    id,
    post_id: "p",
    campus_id: "c",
    parent_comment_id: null,
    author_id: null,
    author_display_name: "x",
    content: id,
    is_anonymous: false,
    is_accepted_answer: false,
    helpful_count: 0,
    status: "published",
    created_at: "2026-01-01T00:00:00Z",
    ...extra,
  };
}

describe("buildCommentTree", () => {
  it("nests replies under their parent", () => {
    const tree = buildCommentTree([
      c("a"),
      c("b", { parent_comment_id: "a" }),
      c("d", { parent_comment_id: "b" }),
    ]);
    expect(tree).toHaveLength(1);
    expect(tree[0].replies[0].replies[0].comment.id).toBe("d");
  });

  it("puts the accepted answer first, then oldest first", () => {
    const tree = buildCommentTree([
      c("old", { created_at: "2026-01-01T00:00:00Z" }),
      c("new", { created_at: "2026-01-03T00:00:00Z" }),
      c("accepted", {
        created_at: "2026-01-05T00:00:00Z",
        is_accepted_answer: true,
      }),
    ]);
    expect(tree.map((n) => n.comment.id)).toEqual(["accepted", "old", "new"]);
  });

  it("drops unpublished comments and their replies", () => {
    const tree = buildCommentTree([
      c("a", { status: "reported" }),
      c("b", { parent_comment_id: "a" }),
      c("e"),
    ]);
    expect(tree.map((n) => n.comment.id)).toEqual(["e"]);
  });

  it("returns an empty list for no comments", () => {
    expect(buildCommentTree([])).toEqual([]);
  });
});
