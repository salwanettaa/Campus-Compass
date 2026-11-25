import { cn } from "@/lib/utils";
import { TYPE_LABELS } from "@/lib/community/feed";
import type { PostType } from "@/lib/community/types";

const STYLES: Record<PostType, string> = {
  question: "border-brand-700/30 bg-brand-100 text-brand-900",
  experience: "border-emerald-800/20 bg-emerald-50 text-emerald-900",
  guide: "border-amber-800/20 bg-amber-50 text-amber-900",
  opportunity: "border-violet-800/20 bg-violet-50 text-violet-900",
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
        "font-mono text-[10px] inline-flex items-center rounded-md border px-2.5 py-1 font-medium uppercase tracking-wide",
        STYLES[type],
        className,
      )}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}
