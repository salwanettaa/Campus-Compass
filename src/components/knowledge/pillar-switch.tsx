"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Sparkles } from "lucide-react";
import {
  buildKnowledgeQuery,
  type KnowledgeParams,
} from "@/lib/knowledge/filter";
import { cn } from "@/lib/utils";

interface PillarSwitchProps {
  params: KnowledgeParams;
  guidesCount: number;
  experiencesCount: number;
}

export function PillarSwitch({
  params,
  guidesCount,
  experiencesCount,
}: PillarSwitchProps) {
  const router = useRouter();
  const currentPillar = params.pillar ?? "guides";

  const handlePillarChange = (newPillar: "guides" | "experiences") => {
    const nextParams = { ...params, pillar: newPillar };
    router.push(`/knowledge${buildKnowledgeQuery(nextParams)}`);
  };

  return (
    <div className="flex border-b border-brand-300">
      <div
        role="tablist"
        aria-label="Pilih Tipe Konten"
        className="flex w-full sm:w-auto gap-2"
      >
        {/* Tab 1: Official & Curated Guides */}
        <button
          type="button"
          role="tab"
          aria-selected={currentPillar === "guides"}
          onClick={() => handlePillarChange("guides")}
          className={cn(
            "flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-5 py-3 text-body font-medium transition-all duration-150 border-b-2 -mb-px focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none",
            currentPillar === "guides"
              ? "border-brand-950 text-brand-950 font-semibold"
              : "border-transparent text-brand-700 hover:text-brand-950 hover:border-brand-300",
          )}
        >
          <BookOpen className="size-4 shrink-0 text-brand-800" aria-hidden="true" />
          <span>Panduan Resmi & Terkurasi</span>
          <span
            className={cn(
              "font-mono text-xs tabular-nums rounded-full px-2 py-0.5",
              currentPillar === "guides"
                ? "bg-brand-100 text-brand-900 font-bold"
                : "bg-paper-raised text-brand-700 border border-brand-200",
            )}
          >
            {guidesCount}
          </span>
        </button>

        {/* Tab 2: Senior Experiences */}
        <button
          type="button"
          role="tab"
          aria-selected={currentPillar === "experiences"}
          onClick={() => handlePillarChange("experiences")}
          className={cn(
            "flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-5 py-3 text-body font-medium transition-all duration-150 border-b-2 -mb-px focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none",
            currentPillar === "experiences"
              ? "border-brand-950 text-brand-950 font-semibold"
              : "border-transparent text-brand-700 hover:text-brand-950 hover:border-brand-300",
          )}
        >
          <Sparkles className="size-4 shrink-0 text-amber-700" aria-hidden="true" />
          <span>Pengalaman Senior (STAR)</span>
          <span
            className={cn(
              "font-mono text-xs tabular-nums rounded-full px-2 py-0.5",
              currentPillar === "experiences"
                ? "bg-brand-100 text-brand-900 font-bold"
                : "bg-paper-raised text-brand-700 border border-brand-200",
            )}
          >
            {experiencesCount}
          </span>
        </button>
      </div>
    </div>
  );
}
