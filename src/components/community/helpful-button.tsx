"use client";

import { useState, useTransition } from "react";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type HelpfulToggleResult = { ok: boolean; message?: string };

export type HelpfulButtonProps = {
  initialCount: number;
  initialActive?: boolean;
  /** What is being rated, for screen readers: "post" or "comment". */
  target?: "post" | "comment";
  /**
   * Saves the vote (later: a Server Action that writes to `votes`).
   * Without it the button only changes locally, which is what the mock UI uses.
   */
  onToggle?: (active: boolean) => Promise<HelpfulToggleResult>;
  className?: string;
};

/** Optimistic "Helpful" toggle that rolls back if saving fails. */
export function HelpfulButton({
  initialCount,
  initialActive = false,
  target = "post",
  onToggle,
  className,
}: HelpfulButtonProps) {
  const [active, setActive] = useState(initialActive);
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const next = !active;
    const previous = { active, count };
    setError(null);
    setActive(next);
    setCount(Math.max(0, count + (next ? 1 : -1)));

    if (!onToggle) return;
    startTransition(async () => {
      let result: HelpfulToggleResult;
      try {
        result = await onToggle(next);
      } catch {
        result = { ok: false };
      }
      if (!result.ok) {
        setActive(previous.active);
        setCount(previous.count);
        setError(result.message ?? "Could not save your vote. Please try again.");
      }
    });
  }

  return (
    <span className={cn("inline-flex flex-col items-start gap-1", className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={active}
        aria-label={`Mark this ${target} as helpful`}
        className={cn(
          "text-h5 inline-flex h-9 items-center gap-2 rounded-full px-4",
          "transition-[background-color,color] duration-200",
          "focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none",
          "disabled:opacity-60",
          active
            ? "bg-brand-950 text-white"
            : "bg-brand-100 text-brand-950 hover:bg-brand-300/60",
        )}
      >
        <ThumbsUp
          className="size-4"
          fill={active ? "currentColor" : "none"}
          aria-hidden="true"
        />
        <span>Helpful</span>
        <span aria-label={`${count} helpful votes`}>{count}</span>
      </button>
      {error ? (
        <span role="alert" className="text-caption text-red-700">
          {error}
        </span>
      ) : null}
    </span>
  );
}
