"use client";

import {
  EyeOff,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  Info,
  MessageCircle,
  MessageSquare,
} from "lucide-react";
import { SavePostButton } from "@/components/community/save-post-button";
import type { SocialCommunity, SocialPost } from "@/lib/community/social-types";
import { cn } from "@/lib/utils";

export type SocialPostCardProps = {
  post: SocialPost;
  community?: SocialCommunity;
  onToggleLike: (postId: string) => void;
  onOpenThread: (postId: string) => void;
  onSelectCommunity?: (communityId: string) => void;
};

const POST_TYPE_CONFIG = {
  question: {
    label: "Question",
    icon: HelpCircle,
    badgeClass: "border-route/60 bg-paper text-route-on-dark font-semibold",
  },
  information: {
    label: "Information",
    icon: Info,
    badgeClass: "border-brand-600/50 bg-brand-100 text-brand-700 font-medium",
  },
  discussion: {
    label: "Discussion",
    icon: MessageSquare,
    badgeClass: "border-brand-300 bg-paper text-brand-800",
  },
} as const;

export function SocialPostCard({
  post,
  community,
  onToggleLike,
  onOpenThread,
  onSelectCommunity,
}: SocialPostCardProps) {
  const typeConfig = POST_TYPE_CONFIG[post.postType];
  const TypeIcon = typeConfig.icon;
  const isQuestion = post.postType === "question";

  return (
    <article
      className={cn(
        "flex gap-3.5 rounded-xl border bg-paper-raised p-4 transition-colors sm:p-5",
        isQuestion
          ? "border-brand-300"
          : "border-brand-300",
      )}
    >
      {/* Avatar */}
      <div
        aria-hidden="true"
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full text-h5 font-semibold text-white",
          post.isAnonymous ? "bg-brand-900" : "bg-fill",
        )}
      >
        {post.isAnonymous ? (
          <EyeOff className="size-5" aria-hidden="true" />
        ) : (
          post.authorInitials
        )}
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        {/* Header */}
        <header className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2">
            <span className="text-h5 font-semibold text-brand-950">
              {post.authorName}
            </span>
            {post.isAnonymous ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-[0.6875rem] font-medium text-brand-700">
                <EyeOff className="size-3" aria-hidden="true" />
                Anonymous
              </span>
            ) : null}
            <span className="text-caption text-brand-800">
              {post.university} · {post.department}
            </span>
          </div>
          <span className="text-caption text-brand-800">
            {post.createdAtLabel}
          </span>
        </header>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-caption",
              typeConfig.badgeClass,
            )}
          >
            <TypeIcon className="size-3.5" aria-hidden="true" />
            {typeConfig.label}
          </span>

          {community ? (
            <button
              type="button"
              onClick={() => onSelectCommunity?.(community.id)}
              className="inline-flex items-center rounded-full border border-brand-300 bg-paper px-2.5 py-0.5 text-caption text-brand-700 transition-colors hover:border-brand-600 hover:bg-brand-100"
            >
              {community.name}
            </button>
          ) : null}
        </div>

        {/* Content */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onOpenThread(post.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenThread(post.id);
            }
          }}
          className="cursor-pointer rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <p className="text-body whitespace-pre-line text-brand-950">
            {post.content}
          </p>
        </div>

        {/* Optional Image Placeholder */}
        {post.imagePlaceholder ? (
          <div className="flex flex-col gap-2 rounded-xl border border-brand-300 bg-paper p-4">
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-brand-300 bg-brand-100/40">
              <div className="flex flex-col items-center gap-1.5 text-center text-brand-800">
                <ImageIcon className="size-6 text-brand-700" aria-hidden="true" />
                <span className="text-caption font-medium text-brand-900">
                  {post.imagePlaceholder.label}
                </span>
              </div>
            </div>
            <p className="text-caption text-brand-800">
              {post.imagePlaceholder.caption}
            </p>
          </div>
        ) : null}

        {/* Action Bar */}
        <footer className="mt-1 flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenThread(post.id)}
              aria-label={`Reply to ${post.authorName}'s post (${post.replies.length} replies)`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-transparent px-3 text-caption text-brand-800 transition-colors hover:border-brand-300 hover:bg-brand-100 hover:text-brand-950"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              <span>{post.replies.length}</span>
              <span>{post.replies.length === 1 ? "Reply" : "Replies"}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleLike(post.id)}
              aria-pressed={post.likedByViewer}
              aria-label={`Like post (${post.likes} likes)`}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-caption transition-colors",
                post.likedByViewer
                  ? "border-route/60 bg-paper text-route-on-dark"
                  : "border-transparent text-brand-800 hover:border-brand-300 hover:bg-brand-100 hover:text-brand-950",
              )}
            >
              <Heart
                className="size-4"
                fill={post.likedByViewer ? "currentColor" : "none"}
                aria-hidden="true"
              />
              <span>{post.likes}</span>
            </button>
          </div>

          <SavePostButton
            postId={post.id}
            postTitle={post.content.slice(0, 60)}
          />
        </footer>
      </div>
    </article>
  );
}
