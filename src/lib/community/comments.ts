import type { CommentRow } from "./types";

export type CommentNode = {
  comment: CommentRow;
  replies: CommentNode[];
};

/**
 * Turns the flat `v_comments` rows into a tree using `parent_comment_id`.
 * Only published comments are shown. A reply whose parent is missing (for
 * example hidden) is dropped with its parent instead of floating to the top.
 * Top-level comments: accepted answer first, then oldest first. Replies: oldest first.
 */
export function buildCommentTree(
  comments: readonly CommentRow[],
): CommentNode[] {
  const visible = comments.filter((c) => c.status === "published");
  const nodes = new Map<string, CommentNode>(
    visible.map((comment) => [comment.id, { comment, replies: [] }]),
  );

  const roots: CommentNode[] = [];
  for (const node of nodes.values()) {
    const parentId = node.comment.parent_comment_id;
    if (parentId === null) {
      roots.push(node);
    } else {
      nodes.get(parentId)?.replies.push(node);
    }
  }

  const byDate = (a: CommentNode, b: CommentNode) =>
    Date.parse(a.comment.created_at) - Date.parse(b.comment.created_at);

  for (const node of nodes.values()) node.replies.sort(byDate);
  roots.sort(
    (a, b) =>
      Number(b.comment.is_accepted_answer) -
        Number(a.comment.is_accepted_answer) || byDate(a, b),
  );
  return roots;
}
