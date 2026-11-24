import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type InputProps = ComponentProps<"input"> & {
  invalid?: boolean;
};

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        "h-12 w-full rounded-2xl border bg-white px-4 text-body text-brand-950",
        "placeholder:text-brand-800/60",
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
