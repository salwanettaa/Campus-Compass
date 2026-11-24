import { cn } from "@/lib/utils";
import { TYPE_LABELS } from "@/lib/community/feed";
import type { PostType } from "@/lib/community/types";

const STYLES: Record<PostType, string> = {
  question: "bg-brand-100 text-brand-900",
  experience: "bg-emerald-50 text-emerald-900",
  guide: "bg-amber-50 text-amber-900",
  opportunity: "bg-violet-50 text-violet-900",
};

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
        "text-caption inline-flex items-center rounded-full px-3 py-0.5 font-medium",
        STYLES[type],
        className,
      )}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}
