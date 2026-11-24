import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { HelpfulButton } from "@/components/community/helpful-button";
import { TypeBadge } from "@/components/community/type-badge";
import {
  categoryLabel,
  formatRelativeTime,
  pluralize,
} from "@/lib/community/format";
import type { FeedItem } from "@/lib/community/types";

export function PostCard({ item }: { item: FeedItem }) {
  const { post, commentCount, viewerHelpful } = item;
  const href = `/community/${post.id}`;

  return (
    <article
      aria-labelledby={`post-${post.id}`}
      className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-2">
        <TypeBadge type={post.post_type} />
        <span className="text-caption text-brand-800">
          {categoryLabel(post.category)}
        </span>
        {post.has_accepted_answer ? (
          <span className="text-caption inline-flex items-center gap-1 font-medium text-emerald-800">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Answered
          </span>
        ) : null}
      </div>

      <h2 id={`post-${post.id}`} className="text-h3 text-brand-950">
        <Link
          href={href}
          className="rounded-md hover:underline focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
        >
          {post.title}
        </Link>
      </h2>

      <p className="text-body line-clamp-3 text-brand-900">{post.content}</p>

      {post.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Tags">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="text-caption rounded-full bg-brand-100 px-3 py-0.5 text-brand-900"
            >
              #{tag}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="text-caption text-brand-800">
          {post.author_display_name ?? "Unknown author"} ·{" "}
          <time dateTime={post.created_at}>
            {formatRelativeTime(post.created_at)}
          </time>
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={href}
            className="text-h5 inline-flex h-9 items-center gap-2 rounded-full px-3 text-brand-800 hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {pluralize(commentCount, "comment")}
          </Link>
          <HelpfulButton
            initialCount={post.helpful_count}
            initialActive={viewerHelpful}
            target="post"
          />
        </div>
      </div>
    </article>
  );
}
