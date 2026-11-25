import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type SelectProps = ComponentProps<"select"> & {
  invalid?: boolean;
};

/** Native select (best accessibility + mobile pickers) with the app styling. */
export function Select({ className, invalid, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          "h-12 w-full appearance-none rounded-lg border bg-paper-raised pr-11 pl-4 text-body text-brand-950",
          "transition-[border-color,box-shadow] duration-200",
          "focus:border-brand-600 focus:ring-2 focus:ring-brand-600/30 focus:outline-none",
          "disabled:cursor-not-allowed disabled:bg-paper disabled:text-brand-800",
          invalid ? "border-red-600" : "border-brand-950/20",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-brand-800"
        aria-hidden="true"
      />
    </div>
  );
}
