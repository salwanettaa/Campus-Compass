import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ChoiceCardProps = Omit<ComponentProps<"input">, "type" | "children"> & {
  title: string;
  description?: string;
};

/**
 * A selectable card backed by a real radio input (keyboard + screen-reader
 * friendly). Group several with the same `name`.
 */
export function ChoiceCard({
  className,
  title,
  description,
  ...props
}: ChoiceCardProps) {
  return (
    <label className={cn("block cursor-pointer", className)}>
      <input type="radio" className="peer sr-only" {...props} />
      <span
        className={cn(
          "flex h-full flex-col gap-1 rounded-lg border border-brand-950/15 bg-paper-raised p-4",
          "transition-[border-color,background-color] duration-200",
          "hover:border-brand-600",
          "peer-checked:border-brand-800 peer-checked:bg-brand-100",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600",
        )}
      >
        <span className="text-h4 text-brand-950">{title}</span>
        {description ? (
          <span className="text-caption text-brand-800">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
