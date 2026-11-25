"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Chip } from "@/components/ui/chip";
import {
  buildFeedQuery,
  parseFeedParams,
  SORT_MODES,
  TYPE_LABELS,
  type FeedParams,
} from "@/lib/community/feed";
import { POST_TYPES } from "@/lib/community/types";
import { cn } from "@/lib/utils";

/**
 * Sort and type filters. The state lives in the URL (?sort=&type=) so the page
 * can be shared and the server renders the matching list.
 */
export function PostFilter({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const current = parseFeedParams(Object.fromEntries(searchParams.entries()));

  function update(next: Partial<FeedParams>) {
    const params = { ...current, ...next };
    startTransition(() => {
      router.push(`/community${buildFeedQuery(params)}`, { scroll: false });
    });
  }

  return (
    <div
      className={cn(
        "grid gap-4 rounded-xl border border-brand-950/10 bg-paper-raised p-4 sm:grid-cols-2 sm:gap-5",
        pending && "opacity-70",
        className,
      )}
      aria-busy={pending}
    >
      <fieldset className="min-w-0">
        <legend className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-brand-700">
          Sort the feed
        </legend>
        <div role="group" aria-label="Sort posts" className="flex flex-wrap gap-2">
          {SORT_MODES.map((mode) => (
            <Chip
              key={mode.value}
              selected={current.sort === mode.value}
              onClick={() => update({ sort: mode.value })}
            >
              {mode.label}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset className="min-w-0 sm:border-l sm:border-brand-950/10 sm:pl-5">
        <legend className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-brand-700">
          Narrow by type
        </legend>
        <div
          role="group"
          aria-label="Filter by post type"
          className="flex flex-wrap gap-2"
        >
          <Chip
            selected={current.type === null}
            onClick={() => update({ type: null })}
          >
            All types
          </Chip>
          {POST_TYPES.map((type) => (
            <Chip
              key={type}
              selected={current.type === type}
              onClick={() => update({ type })}
            >
              {TYPE_LABELS[type]}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
