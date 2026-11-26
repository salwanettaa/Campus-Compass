import Link from "next/link";
import { CATEGORY_INFO } from "@/lib/knowledge/categories";
import {
  buildKnowledgeQuery,
  type KnowledgeParams,
} from "@/lib/knowledge/filter";
import { GUIDE_CATEGORIES, type GuideCategory } from "@/lib/knowledge/types";
import { cn } from "@/lib/utils";

/** Category index. Plain links, so it works without JavaScript. */
export function CategoryFilter({
  params,
  counts,
}: {
  params: KnowledgeParams;
  counts: Record<GuideCategory, number>;
}) {
  return (
    <nav aria-label="Guide categories">
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
                  "flex min-h-11 h-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-body transition-all duration-150 shadow-2xs",
                  selected
                    ? "border-brand-700 bg-brand-700 font-semibold text-white shadow-xs"
                    : "bg-card-tint border-brand-300 text-brand-900 hover:border-brand-700 hover:bg-white",
                )}
              >
                <span>{CATEGORY_INFO[category].label}</span>
                <span
                  className={cn(
                    "font-mono text-xs tabular-nums",
                    selected ? "text-paper-raised" : "text-brand-800",
                  )}
                >
                  {counts[category]}
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
