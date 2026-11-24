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
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                className={cn(
                  "flex h-full flex-col gap-1 rounded-3xl p-4 shadow-card transition-colors duration-200",
                  "focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none",
                  selected
                    ? "bg-brand-950 text-white"
                    : "bg-white text-brand-950 hover:bg-brand-100",
                )}
              >
                <span className="text-h4">{CATEGORY_INFO[category].label}</span>
                <span
                  className={cn(
                    "text-caption",
                    selected ? "text-brand-100" : "text-brand-800",
                  )}
                >
                  {CATEGORY_INFO[category].description}
                </span>
                <span
                  className={cn(
                    "text-caption mt-1 font-medium",
                    selected ? "text-white" : "text-brand-900",
                  )}
                >
                  {counts[category]} {counts[category] === 1 ? "guide" : "guides"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
