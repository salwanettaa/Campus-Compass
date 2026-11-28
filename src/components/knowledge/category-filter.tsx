import Link from "next/link";
import { CATEGORY_INFO } from "@/lib/knowledge/categories";
import {
  buildKnowledgeQuery,
  type KnowledgeParams,
} from "@/lib/knowledge/filter";
import { GUIDE_CATEGORIES, type GuideCategory } from "@/lib/knowledge/types";
import { cn } from "@/lib/utils";

/**
 * Borderless category filter list for the Split-Rail sidebar.
 * Renders as a clean vertical list on desktop and wraps into quiet pills on mobile.
 */
export function CategoryFilter({
  params,
  counts,
}: {
  params: KnowledgeParams;
  counts: Record<GuideCategory, number>;
}) {
  const totalCount = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const allHref = `/knowledge${buildKnowledgeQuery({
    ...params,
    category: null,
  })}`;

  return (
    <nav aria-label="Guide categories" className="flex flex-col gap-2">
      <h3 className="text-h5 text-brand-950">Category</h3>
      <ul className="scroll-row flex flex-wrap gap-2 lg:flex-col lg:gap-0.5">
        <li>
          <Link
            href={allHref}
            aria-current={params.category === null ? "true" : undefined}
            className={cn(
              "flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 py-2 text-body transition-colors duration-150 max-lg:border max-lg:border-brand-300",
              params.category === null
                ? "bg-brand-100 font-semibold text-brand-950 max-lg:border-brand-600/40 max-lg:text-brand-700"
                : "text-brand-900 hover:bg-paper-raised hover:text-brand-950",
            )}
          >
            <span>All categories</span>
            <span className="font-mono text-xs tabular-nums text-brand-800">
              {totalCount}
            </span>
          </Link>
        </li>
        {GUIDE_CATEGORIES.map((category) => {
          const selected = params.category === category;
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
                  "flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 py-2 text-body transition-colors duration-150 max-lg:border max-lg:border-brand-300",
                  selected
                    ? "bg-brand-100 font-semibold text-brand-950 max-lg:border-brand-600/40 max-lg:text-brand-700"
                    : "text-brand-900 hover:bg-paper-raised hover:text-brand-950",
                )}
              >
                <span>{CATEGORY_INFO[category].label}</span>
                <span className="font-mono text-xs tabular-nums text-brand-800">
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
