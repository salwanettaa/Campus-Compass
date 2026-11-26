"use client";

import { useEffect, useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleBookmarkAction } from "@/lib/knowledge/actions";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  guideId: string;
  guideTitle: string;
  initialBookmarked?: boolean;
  /** Shows text label alongside the icon (used on the detail view). */
  showLabel?: boolean;
}

/**
 * Quiet bookmark toggle synced to Supabase `public.bookmarks` with
 * `localStorage` fallback for unseeded sample guides.
 */
export function BookmarkButton({
  guideId,
  guideTitle,
  initialBookmarked = false,
  showLabel = false,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (initialBookmarked) {
      setIsBookmarked(true);
      return;
    }
    try {
      if (localStorage.getItem(`compass_bookmark_${guideId}`) === "true") {
        setIsBookmarked(true);
      }
    } catch {
      // Ignore storage access errors in restricted browsing contexts.
    }
  }, [guideId, initialBookmarked]);

  function handleToggle() {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    try {
      localStorage.setItem(`compass_bookmark_${guideId}`, String(nextState));
    } catch {
      // Ignore storage access errors.
    }

    startTransition(async () => {
      const result = await toggleBookmarkAction(guideId, nextState);
      if (!result.ok) {
        setIsBookmarked(!nextState);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      aria-pressed={isBookmarked}
      aria-label={
        isBookmarked
          ? `Remove bookmark for ${guideTitle}`
          : `Bookmark ${guideTitle}`
      }
      title={isBookmarked ? "Saved" : "Save guide"}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border transition-colors duration-150 disabled:opacity-60",
        showLabel ? "min-h-11 gap-2 px-4 text-h5" : "size-11",
        isBookmarked
          ? "border-brand-700 bg-brand-700 text-white"
          : "border-brand-400 bg-white text-brand-900 hover:border-brand-700 active:bg-brand-100",
      )}
    >
      <Bookmark
        className="size-4"
        fill={isBookmarked ? "currentColor" : "none"}
        aria-hidden="true"
      />
      {showLabel ? <span>{isBookmarked ? "Saved" : "Save"}</span> : null}
    </button>
  );
}
