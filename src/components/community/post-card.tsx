import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { HelpfulButton } from "@/components/community/helpful-button";
import { SavePostButton } from "@/components/community/save-post-button";
import { TypeBadge } from "@/components/community/type-badge";
import {
  categoryLabel,
  formatRelativeTime,
  pluralize,
} from "@/lib/community/format";
import type { FeedItem } from "@/lib/community/types";

/** One row of the feed. The list that holds it draws the dividing rules. */
export function PostCard({ item }: { item: FeedItem }) {
  const { post, commentCount, viewerHelpful } = item;
  const href = `/community/${post.id}`;

  return (
    <article
      aria-labelledby={`post-${post.id}`}
      className="bg-card-tint flex flex-col gap-2.5 rounded-md border border-brand-300 p-5 sm:p-6"
    >
      <div className="text-caption flex flex-wrap items-center gap-x-3 gap-y-1 text-brand-800">
        <TypeBadge type={post.post_type} />
        <span>{categoryLabel(post.category)}</span>
        {post.has_accepted_answer ? (
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Answered
          </span>
        ) : null}
      </div>

      <h2 id={`post-${post.id}`} className="text-h3 max-w-3xl text-brand-950">
        <Link href={href} className="rounded-sm underline-offset-4 hover:underline">
          {post.title}
        </Link>
      </h2>

      <p className="text-body line-clamp-2 max-w-2xl text-brand-900">
        {post.content}
      </p>

      {post.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-x-3" aria-label="Tags">
          {post.tags.map((tag) => (
            <li key={tag} className="font-mono text-xs text-brand-800">
              #{tag}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-brand-800">
          {post.author_display_name ?? "Unknown author"} ·{" "}
          <time dateTime={post.created_at}>
            {formatRelativeTime(post.created_at)}
          </time>
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={href}
            className="text-h5 inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-brand-900 hover:bg-brand-100"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {pluralize(commentCount, "comment")}
          </Link>
          <HelpfulButton
            initialCount={post.helpful_count}
            initialActive={viewerHelpful}
            target="post"
          />
          <SavePostButton postId={post.id} postTitle={post.title} />
        </div>
      </div>
    </article>
  );
}
