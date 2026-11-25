import Link from "next/link";
import { CATEGORY_INFO } from "@/lib/knowledge/categories";
import {
  buildKnowledgeQuery,
  type KnowledgeParams,
} from "@/lib/knowledge/filter";
import { GUIDE_CATEGORIES, type GuideCategory } from "@/lib/knowledge/types";
import { cn } from "@/lib/utils";

/** Category tiles. They are plain links, so they work without JavaScript. */
export function CategoryFilter({
  params,
  counts,
}: {
  params: KnowledgeParams;
  counts: Record<GuideCategory, number>;
}) {
  return (
    <nav aria-label="Guide categories">
      <ul className="flex snap-x gap-2 overflow-x-auto pb-2">
        {GUIDE_CATEGORIES.map((category) => {
          const selected = params.category === category;
          // Selecting the active category again clears it.
          const href = `/knowledge${buildKnowledgeQuery({
            ...params,
            category: selected ? null : category,
          })}`;
          return (
            <li key={category}>
              <Link
                href={href}
                aria-current={selected ? "true" : undefined}
                aria-label={`${CATEGORY_INFO[category].label}, ${counts[category]} ${counts[category] === 1 ? "guide" : "guides"}`}
                title={CATEGORY_INFO[category].description}
                className={cn(
                  "flex min-h-11 shrink-0 snap-start items-center gap-3 rounded-lg border px-3 text-sm transition-colors duration-200",
                  "focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none",
                  selected
                    ? "border-brand-950 bg-brand-950 text-white"
                    : "border-brand-950/15 bg-paper-raised text-brand-900 hover:bg-brand-100",
                )}
              >
                <span className="whitespace-nowrap">
                  {CATEGORY_INFO[category].label}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    selected ? "text-brand-100" : "text-brand-700",
                  )}
                >
                  {counts[category]} {counts[category] === 1 ? "guide" : "guides"}
                </span>
                <span className="sr-only">
                  {CATEGORY_INFO[category].description}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
