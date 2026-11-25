import Link from "next/link";
import { VerifiedMeta } from "@/components/knowledge/verified-meta";
import { categoryName } from "@/lib/knowledge/categories";
import type { GuideRow } from "@/lib/knowledge/types";

/** One row in the guide index. The whole title is the link. */
export function GuideListCard({ guide }: { guide: GuideRow }) {
  const excerpt = guide.content_raw.split("\n").find((line) => line.trim());

  return (
    <article
      aria-labelledby={`guide-${guide.id}`}
      className="bg-card-tint flex h-full flex-col gap-2 rounded-md border border-brand-300 p-5 sm:p-6"
    >
      <p className="text-caption font-medium text-brand-700">
        {categoryName(guide.category)}
      </p>
      <div className="flex min-w-0 flex-col gap-2">
        <h3 id={`guide-${guide.id}`} className="text-h3 text-brand-950">
          <Link
            href={`/knowledge/${guide.id}`}
            className="rounded-sm underline decoration-brand-300 underline-offset-4 hover:decoration-brand-950"
          >
            {guide.title}
          </Link>
        </h3>
        {excerpt ? (
          <p className="text-body line-clamp-2 max-w-2xl text-brand-900">{excerpt}</p>
        ) : null}
        <VerifiedMeta guide={guide} />
      </div>
    </article>
  );
}
