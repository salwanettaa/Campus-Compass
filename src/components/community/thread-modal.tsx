"use client";

import { useState } from "react";
import {
  CornerDownRight,
  Eye,
  EyeOff,
  Heart,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type {
  SocialCommunity,
  SocialPost,
  ViewerCommunityProfile,
} from "@/lib/community/social-types";
import { cn } from "@/lib/utils";

export type ThreadModalProps = {
  post: SocialPost | null;
  community?: SocialCommunity;
  viewer?: ViewerCommunityProfile;
  onClose: () => void;
  onTogglePostLike: (postId: string) => void;
  onToggleReplyLike: (postId: string, replyId: string) => void;
  onSubmitReply: (
    postId: string,
    content: string,
    replyToAuthor?: string,
    isAnonymous?: boolean,
  ) => void;
};

export function ThreadModal({
  post,
  community,
  viewer,
  onClose,
  onTogglePostLike,
  onToggleReplyLike,
  onSubmitReply,
}: ThreadModalProps) {
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!post) return null;

  const displayName = viewer?.displayName || "Student";
  const viewerInitials =
    displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "ST";

  function handleReplySubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!post) return;
    const trimmed = replyText.trim();
    if (!trimmed) {
      setError("Write a reply first.");
      return;
    }
    onSubmitReply(post.id, trimmed, replyingTo ?? undefined, isAnonymous);
    setReplyText("");
    setReplyingTo(null);
    setIsAnonymous(false);
    setError(null);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="thread-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-paper/80 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-brand-300 bg-paper-raised">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-brand-300 px-5 py-4">
          <div className="flex items-center gap-2">
            <MessageCircle
              className="size-5 text-brand-700"
              aria-hidden="true"
            />
            <h2 id="thread-modal-title" className="text-h4 text-brand-950">
              Discussion Thread
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close thread"
            className="flex size-9 items-center justify-center rounded-full text-brand-800 transition-colors hover:bg-brand-100 hover:text-brand-950"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Thread Body */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
          {/* Original Post */}
          <article className="flex gap-3.5 border-b border-brand-300 pb-5">
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
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-center gap-x-2">
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
              </div>

              {community ? (
                <span className="w-fit rounded-full border border-brand-300 bg-paper px-2.5 py-0.5 text-caption text-brand-700">
                  {community.name}
                </span>
              ) : null}

              <p className="text-lead whitespace-pre-line text-brand-950">
                {post.content}
              </p>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onTogglePostLike(post.id)}
                  aria-pressed={post.likedByViewer}
                  className={cn(
                    "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-caption transition-colors",
                    post.likedByViewer
                      ? "border-route/60 bg-paper text-route-on-dark"
                      : "border-brand-300 bg-paper text-brand-800 hover:border-brand-600",
                  )}
                >
                  <Heart
                    className="size-4"
                    fill={post.likedByViewer ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                  {post.likes}
                </button>
                <span className="text-caption text-brand-800">
                  {post.replies.length}{" "}
                  {post.replies.length === 1 ? "reply" : "replies"}
                </span>
              </div>
            </div>
          </article>

          {/* Replies */}
          <section aria-label="Replies" className="flex flex-col gap-4">
            {post.replies.length === 0 ? (
              <p className="rounded-xl border border-dashed border-brand-300 bg-paper p-5 text-center text-body text-brand-800">
                No replies yet. Be the first to respond!
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {post.replies.map((reply) => (
                  <li
                    key={reply.id}
                    className={cn(
                      "flex gap-3 rounded-xl border border-brand-300 bg-paper p-4",
                      reply.replyToAuthor ? "ml-4 sm:ml-6" : "",
                    )}
                  >
                    <div
                      aria-hidden="true"
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-caption font-semibold",
                        reply.isAnonymous
                          ? "bg-brand-900 text-white"
                          : "bg-brand-100 text-brand-700",
                      )}
                    >
                      {reply.isAnonymous ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        reply.authorInitials
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-x-2">
                          <span className="text-h5 font-semibold text-brand-950">
                            {reply.authorName}
                          </span>
                          {reply.isAnonymous ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-[0.6875rem] font-medium text-brand-700">
                              <EyeOff className="size-3" aria-hidden="true" />
                              Anonymous
                            </span>
                          ) : null}
                          <span className="text-caption text-brand-800">
                            {reply.university} · {reply.department}
                          </span>
                        </div>
                        <span className="text-caption text-brand-800">
                          {reply.createdAtLabel}
                        </span>
                      </div>

                      {reply.replyToAuthor ? (
                        <p className="inline-flex items-center gap-1 text-caption text-brand-700">
                          <CornerDownRight
                            className="size-3"
                            aria-hidden="true"
                          />
                          Replying to {reply.replyToAuthor}
                        </p>
                      ) : null}

                      <p className="text-body whitespace-pre-line text-brand-950">
                        {reply.content}
                      </p>

                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => onToggleReplyLike(post.id, reply.id)}
                          aria-pressed={reply.likedByViewer}
                          className={cn(
                            "inline-flex min-h-8 items-center gap-1 rounded-full px-2.5 text-caption transition-colors",
                            reply.likedByViewer
                              ? "text-route-on-dark"
                              : "text-brand-800 hover:bg-brand-100 hover:text-brand-950",
                          )}
                        >
                          <Heart
                            className="size-3.5"
                            fill={reply.likedByViewer ? "currentColor" : "none"}
                            aria-hidden="true"
                          />
                          {reply.likes}
                        </button>

                        <button
                          type="button"
                          onClick={() => setReplyingTo(reply.authorName)}
                          className="inline-flex min-h-8 items-center gap-1 rounded-full px-2.5 text-caption text-brand-800 transition-colors hover:bg-brand-100 hover:text-brand-950"
                        >
                          <CornerDownRight
                            className="size-3.5"
                            aria-hidden="true"
                          />
                          Reply
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Reply Composer */}
        <form
          onSubmit={handleReplySubmit}
          className="flex flex-col gap-2.5 border-t border-brand-300 bg-paper p-4"
        >
          {/* Identity preview & Anonymous button */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-caption font-semibold text-white transition-colors",
                  isAnonymous ? "bg-brand-900" : "bg-fill",
                )}
              >
                {isAnonymous ? (
                  <EyeOff className="size-3.5" aria-hidden="true" />
                ) : (
                  viewerInitials
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-caption font-medium text-brand-950">
                  {isAnonymous
                    ? "Replying as Anonymous Student"
                    : `Replying as ${displayName}`}
                </span>
                {isAnonymous ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-[0.625rem] font-medium text-brand-700">
                    <EyeOff className="size-3" aria-hidden="true" />
                    Name hidden
                  </span>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isAnonymous}
              onClick={() => setIsAnonymous((prev) => !prev)}
              className={cn(
                "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-2.5 text-caption transition-colors",
                isAnonymous
                  ? "border-brand-700 bg-brand-100 font-semibold text-brand-950"
                  : "border-brand-300 bg-paper text-brand-800 hover:border-brand-600 hover:text-brand-950",
              )}
            >
              {isAnonymous ? (
                <>
                  <Eye className="size-3 text-brand-700" aria-hidden="true" />
                  <span>Show my name ({displayName})</span>
                </>
              ) : (
                <>
                  <EyeOff className="size-3 text-brand-700" aria-hidden="true" />
                  <span>Reply as Anonymous</span>
                </>
              )}
            </button>
          </div>

          {replyingTo ? (
            <div className="flex items-center justify-between rounded-lg border border-brand-300 bg-paper-raised px-3 py-1.5 text-caption text-brand-700">
              <span>
                Replying to <strong>{replyingTo}</strong>
              </span>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                aria-label="Cancel reply target"
                className="text-brand-800 hover:text-brand-950"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          <label htmlFor="thread-reply-input" className="sr-only">
            Write your reply
          </label>
          <Textarea
            id="thread-reply-input"
            value={replyText}
            onChange={(e) => {
              setReplyText(e.target.value);
              if (error) setError(null);
            }}
            placeholder={
              replyingTo
                ? `Reply to ${replyingTo}...`
                : "Post your reply..."
            }
            className="min-h-20"
          />
          {error ? <p className="text-caption text-red-700">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" size="sm">
              <Send className="size-3.5" aria-hidden="true" />
              Reply
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
