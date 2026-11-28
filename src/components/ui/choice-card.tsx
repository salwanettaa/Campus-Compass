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
          "flex h-full flex-col gap-1 rounded-md border border-brand-400 bg-paper-raised p-4",
          "transition-colors duration-150",
          "hover:border-brand-600 hover:bg-frost",
          "peer-checked:border-brand-700 peer-checked:bg-brand-100 peer-checked:ring-1 peer-checked:ring-brand-700",
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
