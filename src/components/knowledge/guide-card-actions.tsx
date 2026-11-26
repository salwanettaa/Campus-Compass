"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, Signpost } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideCardActionsProps {
  guideId: string;
  guideTitle: string;
}

/**
 * Quiet action row on each guide card:
 * - Bookmark toggle persisted locally
 * - Direct link to discuss the guide in AI Navigator
 * - Link to read the full guide
 */
export function GuideCardActions({
  guideId,
  guideTitle,
}: GuideCardActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(`compass_bookmark_${guideId}`) === "true") {
        setIsBookmarked(true);
      }
    } catch {
      // Ignore storage access errors in restricted browsing contexts.
    }
  }, [guideId]);

  function toggleBookmark() {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    try {
      localStorage.setItem(`compass_bookmark_${guideId}`, String(nextState));
    } catch {
      // Ignore storage access errors.
    }
  }

  const aiQuery = encodeURIComponent(
    `Explain the official guide "${guideTitle}" and summarize the key steps.`,
  );

  return (
    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleBookmark}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? `Remove bookmark for ${guideTitle}` : `Bookmark ${guideTitle}`}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 text-h5 transition-colors duration-150",
            isBookmarked
              ? "border-brand-700 bg-brand-700 text-white"
              : "border-brand-300 bg-white text-brand-900 hover:border-brand-700 active:bg-brand-100",
          )}
        >
          <Bookmark
            className="size-4"
            fill={isBookmarked ? "currentColor" : "none"}
            aria-hidden="true"
          />
          <span>{isBookmarked ? "Saved" : "Save"}</span>
        </button>

        <Link
          href={`/ai-navigator?q=${aiQuery}`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-brand-300 bg-white px-3.5 text-h5 text-brand-900 transition-colors duration-150 hover:border-brand-700 active:bg-brand-100"
        >
          <Signpost className="size-4 text-brand-700" aria-hidden="true" />
          <span>Ask AI</span>
        </Link>
      </div>

      <Link
        href={`/knowledge/${guideId}`}
        className="group inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-h5 text-brand-700 underline-offset-4 hover:text-brand-950 hover:underline"
      >
        <span>Read guide</span>
        <ArrowRight
          className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
