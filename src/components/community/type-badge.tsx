import { cn } from "@/lib/utils";
import { TYPE_LABELS } from "@/lib/community/feed";
import type { PostType } from "@/lib/community/types";

/** The post type is always written out, so it never depends on color. */
export function TypeBadge({
  type,
  className,
}: {
  type: PostType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-caption inline-flex items-center rounded-sm border border-brand-300 bg-brand-100 px-2 font-semibold text-brand-950",
        className,
      )}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}
