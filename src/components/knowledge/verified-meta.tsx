import { ShieldCheck, TriangleAlert } from "lucide-react";
import {
  formatVerifiedDate,
  isStale,
} from "@/lib/knowledge/filter";
import { sourceLabel } from "@/lib/knowledge/categories";
import type { GuideRow } from "@/lib/knowledge/types";

/** Source label plus the `last_verified_at` date, with a hint for old guides. */
export function VerifiedMeta({ guide }: { guide: GuideRow }) {
  const stale = isStale(guide.last_verified_at);
  return (
    <p className="text-caption flex flex-wrap items-center gap-x-3 gap-y-1 text-brand-800">
      <span className="inline-flex items-center gap-1 font-medium">
        <ShieldCheck className="size-4" aria-hidden="true" />
        {sourceLabel(guide.source_type)}
      </span>
      <span>
        Last verified{" "}
        <time dateTime={guide.last_verified_at}>
          {formatVerifiedDate(guide.last_verified_at)}
        </time>
      </span>
      {stale ? (
        <span className="inline-flex items-center gap-1 font-medium text-amber-800">
          <TriangleAlert className="size-4" aria-hidden="true" />
          May be outdated
        </span>
      ) : null}
    </p>
  );
}
