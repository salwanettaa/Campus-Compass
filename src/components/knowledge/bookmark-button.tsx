"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
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

const BOOKMARK_EVENT = "compass-bookmark-change";

function readLocalBookmark(guideId: string): boolean {
  try {
    return window.localStorage.getItem(`compass_bookmark_${guideId}`) === "true";
  } catch {
    return false;
  }
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
  const [dbSaved, setDbSaved] = useState(initialBookmarked);
  const [pending, startTransition] = useTransition();

  const localSaved = useSyncExternalStore(
    (onStoreChange) => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key === `compass_bookmark_${guideId}`) onStoreChange();
      };
      const handleLocal = (event: Event) => {
        if ((event as CustomEvent<string>).detail === guideId) onStoreChange();
      };
      window.addEventListener("storage", handleStorage);
      window.addEventListener(BOOKMARK_EVENT, handleLocal);
      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(BOOKMARK_EVENT, handleLocal);
      };
    },
    () => readLocalBookmark(guideId),
    () => false,
  );

  const isBookmarked = dbSaved || localSaved;

  function handleToggle() {
    const nextState = !isBookmarked;
    setDbSaved(nextState);
    try {
      window.localStorage.setItem(
        `compass_bookmark_${guideId}`,
        String(nextState),
      );
      window.dispatchEvent(new CustomEvent(BOOKMARK_EVENT, { detail: guideId }));
    } catch {
      // Ignore storage access errors.
    }

    startTransition(async () => {
      const result = await toggleBookmarkAction(guideId, nextState);
      if (!result.ok) {
        setDbSaved(!nextState);
        try {
          window.localStorage.setItem(
            `compass_bookmark_${guideId}`,
            String(!nextState),
          );
          window.dispatchEvent(
            new CustomEvent(BOOKMARK_EVENT, { detail: guideId }),
          );
        } catch {
          // Ignore storage access errors.
        }
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
        "inline-flex shrink-0 items-center justify-center rounded-lg border transition-colors duration-150 disabled:opacity-60",
        showLabel ? "min-h-11 gap-2 px-4 text-h5" : "size-11",
        isBookmarked
          ? "border-brand-700 bg-fill text-white"
          : "border-brand-400 bg-paper-raised text-brand-900 hover:border-brand-700 active:bg-brand-100",
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
