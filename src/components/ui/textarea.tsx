import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = ComponentProps<"textarea"> & {
  invalid?: boolean;
};

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        "min-h-28 w-full resize-y rounded-2xl border bg-white px-4 py-3 text-body text-brand-950",
        "placeholder:text-brand-800",
        "transition-[border-color,box-shadow] duration-200",
        "focus:border-brand-600 focus:ring-2 focus:ring-brand-600/30 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
        invalid ? "border-red-600" : "border-brand-300",
        className,
      )}
      {...props}
    />
  );
}
