import Link from "next/link";
import { BookmarkButton } from "@/components/knowledge/bookmark-button";
import { VerifiedMeta } from "@/components/knowledge/verified-meta";
import { categoryName } from "@/lib/knowledge/categories";
import {
  AVAILABLE_PROGRAMS,
  type GuideRow,
  type ProgramOption,
} from "@/lib/knowledge/types";

/** One row in the guide index. Matches the calm PostCard surface grammar. */
export function GuideListCard({
  guide,
  programs = AVAILABLE_PROGRAMS,
  initialBookmarked = false,
}: {
  guide: GuideRow;
  programs?: readonly ProgramOption[];
  initialBookmarked?: boolean;
}) {
  const excerpt = guide.content_raw.split("\n").find((line) => line.trim());
  const program = guide.program_id
    ? programs.find((p) => p.id === guide.program_id) ??
      AVAILABLE_PROGRAMS.find((p) => p.id === guide.program_id)
    : null;
  const scopeLabel = guide.is_general
    ? "General"
    : program
      ? program.shortName
      : "Program guide";

  return (
    <article
      aria-labelledby={`guide-${guide.id}`}
      className="bg-card-tint flex h-full flex-col justify-between gap-4 rounded-md border border-brand-300 p-5 sm:p-6"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <p className="text-caption pt-1 font-medium text-brand-700">
            {categoryName(guide.category)}
            <span className="text-brand-800"> · {scopeLabel}</span>
          </p>
          <BookmarkButton
            guideId={guide.id}
            guideTitle={guide.title}
            initialBookmarked={initialBookmarked}
          />
        </div>

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
      </div>

      <VerifiedMeta guide={guide} />
    </article>
  );
}
