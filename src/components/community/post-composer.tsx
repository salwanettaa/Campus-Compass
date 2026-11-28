"use client";

import { useState } from "react";
import { Eye, EyeOff, HelpCircle, Info, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type SocialCommunity,
  type SocialPostType,
  type ViewerCommunityProfile,
} from "@/lib/community/social-types";
import { cn } from "@/lib/utils";

export type PostComposerProps = {
  viewer: ViewerCommunityProfile;
  communities: SocialCommunity[];
  activeScope: "general" | "university" | "department";
  defaultCommunityId?: string;
  defaultDepartment?: string;
  onCreatePost: (payload: {
    content: string;
    postType: SocialPostType;
    communityId?: string;
    department: string;
    scope: "general" | "university" | "department";
    isAnonymous?: boolean;
  }) => void;
};

const TYPE_OPTIONS: {
  value: SocialPostType;
  label: string;
  icon: typeof MessageSquare;
}[] = [
  { value: "discussion", label: "Discussion", icon: MessageSquare },
  { value: "question", label: "Question", icon: HelpCircle },
  { value: "information", label: "Information", icon: Info },
];

export function PostComposer({
  viewer,
  communities,
  activeScope,
  defaultCommunityId = "",
  defaultDepartment,
  onCreatePost,
}: PostComposerProps) {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<SocialPostType>("discussion");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [prevDefaultCommunityId, setPrevDefaultCommunityId] =
    useState(defaultCommunityId);
  const [communityId, setCommunityId] = useState(defaultCommunityId);
  const department = defaultDepartment || viewer.department;
  const [error, setError] = useState<string | null>(null);

  if (defaultCommunityId !== prevDefaultCommunityId) {
    setPrevDefaultCommunityId(defaultCommunityId);
    setCommunityId(defaultCommunityId);
  }

  const initials =
    viewer.displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "ST";

  const scopeLabel =
    activeScope === "department"
      ? `${viewer.department} (${viewer.universityShort})`
      : activeScope === "university"
        ? `${viewer.universityShort} Internal Feed`
        : "General Feed";

  function openWithType(type: SocialPostType) {
    setPostType(type);
    setExpanded(true);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setError("Write something before posting.");
      return;
    }

    onCreatePost({
      content: trimmed,
      postType,
      communityId: communityId || undefined,
      department,
      scope: activeScope,
      isAnonymous,
    });

    setContent("");
    setPostType("discussion");
    setIsAnonymous(false);
    setError(null);
    setExpanded(false);
  }

  return (
    <section
      aria-label="Create post"
      className="rounded-xl border border-brand-300 bg-paper-raised p-4 sm:p-5"
    >
      {!expanded ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill text-h5 font-semibold text-white"
            >
              {initials}
            </div>
            <button
              type="button"
              onClick={() => openWithType("discussion")}
              className="flex min-h-11 min-w-0 flex-1 items-center rounded-lg border border-brand-300 bg-paper px-4 text-left text-body text-brand-800 transition-colors hover:border-brand-600 hover:text-brand-950"
            >
              <span className="truncate">
                What&apos;s on your mind? Share in {scopeLabel}...
              </span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:flex-nowrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openWithType("question")}
            >
              <HelpCircle className="size-4 text-route-on-dark" aria-hidden="true" />
              Ask Question
            </Button>
            <Button size="sm" onClick={() => openWithType("discussion")}>
              Create Post
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div
              aria-hidden="true"
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full text-h5 font-semibold text-white transition-colors",
                isAnonymous ? "bg-brand-900" : "bg-fill",
              )}
            >
              {isAnonymous ? (
                <EyeOff className="size-5" aria-hidden="true" />
              ) : (
                initials
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-h5 font-semibold text-brand-950">
                  {isAnonymous ? "Anonymous Student" : viewer.displayName}
                </span>
                {isAnonymous ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-[0.6875rem] font-medium text-brand-700">
                    <EyeOff className="size-3" aria-hidden="true" />
                    Name hidden
                  </span>
                ) : null}
              </div>
              <span className="text-caption text-brand-800">
                Posting to {scopeLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {TYPE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const selected = postType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setPostType(option.value)}
                  className={cn(
                    "inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3.5 text-caption transition-colors",
                    selected
                      ? option.value === "question"
                        ? "border-route bg-paper font-semibold text-route-on-dark"
                        : "border-brand-700 bg-fill font-semibold text-white"
                      : "border-brand-300 bg-paper text-brand-800 hover:border-brand-600 hover:text-brand-950",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {option.label}
                </button>
              );
            })}
          </div>

          <div>
            <label htmlFor="social-post-content" className="sr-only">
              Post content
            </label>
            <Textarea
              id="social-post-content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError(null);
              }}
              placeholder={
                postType === "question"
                  ? "Ask a clear question (e.g. course tips, internship prep, campus orgs)..."
                  : postType === "information"
                    ? "Share helpful campus updates, events, or deadlines..."
                    : "What's on your mind? Start a discussion..."
              }
              className="min-h-24"
              autoFocus
            />
            {error ? (
              <p className="mt-1.5 text-caption text-red-700">{error}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="composer-community"
              className="text-caption text-brand-800"
            >
              Community (optional)
            </label>
            <Select
              id="composer-community"
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              className="h-10 text-caption"
            >
              <option value="">No specific community</option>
              {communities.map((comm) => (
                <option key={comm.id} value={comm.id}>
                  {comm.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-300 pt-3">
            <button
              type="button"
              role="switch"
              aria-checked={isAnonymous}
              onClick={() => setIsAnonymous((prev) => !prev)}
              className={cn(
                "inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 text-caption font-medium transition-colors",
                isAnonymous
                  ? "border-brand-700 bg-brand-100 font-semibold text-brand-950"
                  : "border-brand-300 bg-paper text-brand-800 hover:border-brand-600 hover:text-brand-950",
              )}
            >
              {isAnonymous ? (
                <>
                  <Eye className="size-3.5 text-brand-700" aria-hidden="true" />
                  <span>Show my name ({viewer.displayName})</span>
                </>
              ) : (
                <>
                  <EyeOff className="size-3.5 text-brand-700" aria-hidden="true" />
                  <span>Post as Anonymous</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setExpanded(false);
                  setIsAnonymous(false);
                  setError(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                <Send className="size-3.5" aria-hidden="true" />
                {postType === "question" ? "Post Question" : "Post"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
