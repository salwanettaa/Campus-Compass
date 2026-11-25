import { BadgeCheck } from "lucide-react";
import { HelpfulButton } from "@/components/community/helpful-button";
import { buildCommentTree, type CommentNode } from "@/lib/community/comments";
import { formatRelativeTime, pluralize } from "@/lib/community/format";
import type { CommentRow } from "@/lib/community/types";
import { cn } from "@/lib/utils";

/** Replies are indented up to this depth; deeper ones stay at the same level. */
const MAX_INDENT_DEPTH = 3;

function CommentItem({
  node,
  depth,
  helpfulIds,
}: {
  node: CommentNode;
  depth: number;
  helpfulIds: ReadonlySet<string>;
}) {
  const { comment } = node;

  return (
    <li className="flex flex-col gap-3">
      <article
        aria-label={`Comment by ${comment.author_display_name ?? "unknown author"}`}
        className={cn(
          "flex flex-col gap-2 rounded-md border p-4",
          comment.is_accepted_answer
            ? "border-emerald-700 bg-emerald-50"
            : "border-brand-300 bg-paper-raised",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-h5 text-brand-950">
            {comment.author_display_name ?? "Unknown author"}
          </p>
          <time
            dateTime={comment.created_at}
            className="text-caption text-brand-800"
          >
            {formatRelativeTime(comment.created_at)}
          </time>
          {comment.is_accepted_answer ? (
            <span className="text-caption inline-flex items-center gap-1 font-medium text-emerald-800">
              <BadgeCheck className="size-4" aria-hidden="true" />
              Accepted answer
            </span>
          ) : null}
        </div>
        <p className="text-body whitespace-pre-line text-brand-950">
          {comment.content}
        </p>
        <HelpfulButton
          target="comment"
          initialCount={comment.helpful_count}
          initialActive={helpfulIds.has(comment.id)}
        />
      </article>

      {node.replies.length > 0 ? (
        <ul
          className={cn(
            "flex flex-col gap-3",
            depth < MAX_INDENT_DEPTH &&             "ml-3 border-l border-brand-300 pl-3",
          )}
        >
          {node.replies.map((reply) => (
            <CommentItem
              key={reply.comment.id}
              node={reply}
              depth={depth + 1}
              helpfulIds={helpfulIds}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export type CommentThreadProps = {
  comments: readonly CommentRow[];
  helpfulCommentIds?: readonly string[];
};

export function CommentThread({
  comments,
  helpfulCommentIds = [],
}: CommentThreadProps) {
  const tree = buildCommentTree(comments);
  const total = comments.filter((c) => c.status === "published").length;
  const helpfulIds = new Set(helpfulCommentIds);

  return (
    <section aria-labelledby="comments-heading" className="flex flex-col gap-4">
      <h2 id="comments-heading" className="text-h3 text-brand-950">
        {pluralize(total, "comment")}
      </h2>
      {tree.length === 0 ? (
        <p className="text-body rounded-md border border-brand-300 bg-paper-raised p-4 text-brand-900">
          No comments yet. Be the first to share what you know.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {tree.map((node) => (
            <CommentItem
              key={node.comment.id}
              node={node}
              depth={0}
              helpfulIds={helpfulIds}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
