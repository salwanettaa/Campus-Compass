import Link from "next/link";
import { GuideCardActions } from "@/components/knowledge/guide-card-actions";
import { VerifiedMeta } from "@/components/knowledge/verified-meta";
import { categoryName } from "@/lib/knowledge/categories";
import { AVAILABLE_PROGRAMS, type GuideRow } from "@/lib/knowledge/types";

/** One row in the guide index. Follows the PostCard surface grammar. */
export function GuideListCard({ guide }: { guide: GuideRow }) {
  const excerpt = guide.content_raw.split("\n").find((line) => line.trim());
  const program = guide.program_id
    ? AVAILABLE_PROGRAMS.find((p) => p.id === guide.program_id)
    : null;
  const scopeLabel = guide.is_general
    ? "General · UGM"
    : program
      ? program.shortName
      : "Program guide";

  return (
    <article
      aria-labelledby={`guide-${guide.id}`}
      className="bg-card-tint flex h-full flex-col gap-2.5 rounded-md border border-brand-300 p-5 sm:p-6 transition-colors duration-150 hover:border-brand-700"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="text-caption font-medium text-brand-700">
          {categoryName(guide.category)}
        </p>
        <span className="text-caption text-brand-800">{scopeLabel}</span>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <h3 id={`guide-${guide.id}`} className="text-h3 text-balance text-brand-950">
          <Link
            href={`/knowledge/${guide.id}`}
            className="rounded-sm underline decoration-brand-300 underline-offset-4 hover:decoration-brand-950"
          >
            {guide.title}
          </Link>
        </h3>
        {excerpt ? (
          <p className="text-body text-pretty line-clamp-2 max-w-2xl text-brand-900">
            {excerpt}
          </p>
        ) : null}
        <VerifiedMeta guide={guide} />
      </div>

      <GuideCardActions guideId={guide.id} guideTitle={guide.title} />
    </article>
  );
}
