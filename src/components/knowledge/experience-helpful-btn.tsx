"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExperienceHelpfulBtnProps {
  experienceId: string;
  initialCount: number;
}

export function ExperienceHelpfulBtn({
  experienceId,
  initialCount,
}: ExperienceHelpfulBtnProps) {
  const [count, setCount] = useState(initialCount);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (hasVoted) {
      setCount((prev) => Math.max(0, prev - 1));
      setHasVoted(false);
    } else {
      setCount((prev) => prev + 1);
      setHasVoted(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleVote}
      aria-label={`Tandai bermanfaat, saat ini ${count} mahasiswa merasa terbantu`}
      aria-pressed={hasVoted}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-caption font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none",
        hasVoted
          ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold"
          : "border-brand-300 bg-white text-brand-800 hover:border-brand-600 hover:text-brand-950",
      )}
    >
      <ThumbsUp
        className={cn("size-3.5", hasVoted && "fill-emerald-700 text-emerald-700")}
        aria-hidden="true"
      />
      <span>Membantu</span>
      <span className="font-mono text-xs tabular-nums text-brand-900 font-semibold">
        ({count})
      </span>
    </button>
  );
}
