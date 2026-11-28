"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { togglePostBookmarkAction } from "@/lib/community/actions";
import { cn } from "@/lib/utils";

interface SavePostButtonProps {
  postId: string;
  postTitle: string;
  initialBookmarked?: boolean;
  showLabel?: boolean;
}

const POST_BOOKMARK_EVENT = "compass-post-bookmark-change";

function readLocalPostBookmark(postId: string): boolean {
  try {
    return (
      window.localStorage.getItem(`compass_post_bookmark_${postId}`) === "true"
    );
  } catch {
    return false;
  }
}

export function SavePostButton({
  postId,
  postTitle,
  initialBookmarked = false,
  showLabel = false,
}: SavePostButtonProps) {
  const [dbSaved, setDbSaved] = useState(initialBookmarked);
  const [pending, startTransition] = useTransition();

  const localSaved = useSyncExternalStore(
    (onStoreChange) => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key === `compass_post_bookmark_${postId}`) onStoreChange();
      };
      const handleLocal = (event: Event) => {
        if ((event as CustomEvent<string>).detail === postId) onStoreChange();
      };
      window.addEventListener("storage", handleStorage);
      window.addEventListener(POST_BOOKMARK_EVENT, handleLocal);
      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(POST_BOOKMARK_EVENT, handleLocal);
      };
    },
    () => readLocalPostBookmark(postId),
    () => false,
  );

  const isBookmarked = dbSaved || localSaved;

  function handleToggle() {
    const nextState = !isBookmarked;
    setDbSaved(nextState);
    try {
      window.localStorage.setItem(
        `compass_post_bookmark_${postId}`,
        String(nextState),
      );
      window.dispatchEvent(
        new CustomEvent(POST_BOOKMARK_EVENT, { detail: postId }),
      );
    } catch {
      // Ignore storage errors.
    }

    startTransition(async () => {
      const result = await togglePostBookmarkAction(postId, nextState);
      if (!result.ok) {
        setDbSaved(!nextState);
        try {
          window.localStorage.setItem(
            `compass_post_bookmark_${postId}`,
            String(!nextState),
          );
          window.dispatchEvent(
            new CustomEvent(POST_BOOKMARK_EVENT, { detail: postId }),
          );
        } catch {
          // Ignore storage errors.
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
        isBookmarked ? `Remove saved ${postTitle}` : `Save ${postTitle}`
      }
      title={isBookmarked ? "Saved" : "Save discussion"}
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
