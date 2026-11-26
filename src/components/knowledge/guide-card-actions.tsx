"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Bot, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideCardActionsProps {
  guideId: string;
  guideTitle: string;
}

export function GuideCardActions({
  guideId,
  guideTitle,
}: GuideCardActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`compass_bookmark_${guideId}`);
      if (stored === "true") {
        setIsBookmarked(true);
      }
    } catch {
      // Ignore localStorage availability issues in SSR/private browsing
    }
  }, [guideId]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    try {
      localStorage.setItem(`compass_bookmark_${guideId}`, String(nextState));
    } catch {
      // Ignore
    }
  };

  const aiQuery = encodeURIComponent(
    `Bantu jelaskan panduan resmi "${guideTitle}" beserta langkah-langkah praktisnya untuk mahasiswa.`,
  );

  return (
    <div className="flex items-center justify-between gap-2 pt-3 border-t border-brand-200 mt-auto">
      <div className="flex items-center gap-1.5">
        {/* Bookmark toggle */}
        <button
          type="button"
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Hapus dari simpanan" : "Simpan panduan ini"}
          title={isBookmarked ? "Tersimpan" : "Simpan panduan"}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-lg border transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none",
            isBookmarked
              ? "border-amber-600 bg-amber-50 text-amber-800"
              : "border-brand-300 bg-white text-brand-700 hover:border-brand-500 hover:text-brand-950",
          )}
        >
          <Bookmark
            className={cn("size-4", isBookmarked && "fill-amber-700")}
            aria-hidden="true"
          />
        </button>

        {/* AI Bridge Button */}
        <Link
          href={`/ai-navigator?q=${aiQuery}`}
          title="Tanyakan ke AI Navigator dengan rujukan panduan ini"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-300 bg-white px-2.5 text-caption font-medium text-brand-800 hover:border-brand-600 hover:text-brand-950 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
        >
          <Bot className="size-3.5 text-brand-700" aria-hidden="true" />
          <span>Tanya AI</span>
        </Link>
      </div>

      {/* Read Guide Link */}
      <Link
        href={`/knowledge/${guideId}`}
        className="inline-flex h-9 items-center gap-1 text-caption font-semibold text-brand-800 hover:text-brand-950 group focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none rounded-md px-1.5"
      >
        <span>Baca Panduan</span>
        <ChevronRight
          className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
