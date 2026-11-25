import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VerifiedMeta } from "@/components/knowledge/verified-meta";
import { categoryName } from "@/lib/knowledge/categories";
import type { GuideRow } from "@/lib/knowledge/types";

export function GuideListCard({ guide }: { guide: GuideRow }) {
  const excerpt = guide.content_raw.split("\n").find((line) => line.trim());

  return (
    <article
      aria-labelledby={`guide-${guide.id}`}
      className="flex flex-col gap-3 rounded-xl border border-brand-950/10 bg-paper-raised p-4 sm:p-5"
    >
      <span className="font-mono text-[10px] w-fit rounded-md bg-brand-100 px-2.5 py-1 font-medium uppercase tracking-wide text-brand-900">
        {categoryName(guide.category)}
      </span>
      <h3 id={`guide-${guide.id}`} className="text-h3 text-brand-950">
        <Link
          href={`/knowledge/${guide.id}`}
          className="rounded-md hover:underline focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
        >
          {guide.title}
        </Link>
      </h3>
      {excerpt ? (
        <p className="text-body line-clamp-2 text-brand-900">{excerpt}</p>
      ) : null}
      <VerifiedMeta guide={guide} />
      <Link
        href={`/knowledge/${guide.id}`}
        className="text-h5 inline-flex min-h-11 w-fit items-center gap-1 text-brand-800 hover:underline focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
      >
        Read guide
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
