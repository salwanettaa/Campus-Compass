import Link from "next/link";
import { GuideCardActions } from "@/components/knowledge/guide-card-actions";
import { VerifiedMeta } from "@/components/knowledge/verified-meta";
import { categoryName } from "@/lib/knowledge/categories";
import { PILOT_PROGRAM, type GuideRow } from "@/lib/knowledge/types";

/** One row in the guide index. The whole title is the link. */
export function GuideListCard({ guide }: { guide: GuideRow }) {
  const excerpt = guide.content_raw.split("\n").find((line) => line.trim());

  const scopeLabel = guide.is_general
    ? "🌐 Semua UGM"
    : guide.program_id === PILOT_PROGRAM.id
      ? `🎯 ${PILOT_PROGRAM.shortName}`
      : "📚 Program Khusus";

  return (
    <article
      aria-labelledby={`guide-${guide.id}`}
      className="bg-card-tint flex h-full flex-col justify-between gap-3 rounded-2xl border border-brand-300 p-5 sm:p-6 transition-all duration-150 hover:border-brand-500 hover:shadow-xs"
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-caption font-semibold text-brand-700">
            {categoryName(guide.category)}
          </p>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-paper-raised border border-brand-200 text-brand-800">
            {scopeLabel}
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <h3 id={`guide-${guide.id}`} className="text-h3 text-balance text-brand-950 font-semibold leading-snug">
            <Link
              href={`/knowledge/${guide.id}`}
              className="rounded-sm underline decoration-brand-300 underline-offset-4 hover:decoration-brand-950 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
            >
              {guide.title}
            </Link>
          </h3>
          {excerpt ? (
            <p className="text-body text-pretty line-clamp-2 max-w-2xl text-brand-900">{excerpt}</p>
          ) : null}
          <VerifiedMeta guide={guide} />
        </div>
      </div>

      <GuideCardActions guideId={guide.id} guideTitle={guide.title} />
    </article>
  );
}
