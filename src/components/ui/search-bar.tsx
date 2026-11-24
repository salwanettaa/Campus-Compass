import { Search } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type SearchBarProps = Omit<ComponentProps<"input">, "type"> & {
  variant?: "dark" | "light";
  /** Accessible name; the visible placeholder alone is not a label. */
  label?: string;
};

export function SearchBar({
  className,
  variant = "light",
  label = "Search campus information",
  placeholder = "Search campus information...",
  ...props
}: SearchBarProps) {
  const dark = variant === "dark";

  return (
    <div
      className={cn(
        "relative flex h-12 w-full items-center rounded-full",
        "transition-shadow duration-200 focus-within:ring-2 focus-within:ring-brand-600",
        dark
          ? "bg-brand-950 text-white"
          : "border border-brand-300 bg-white text-brand-950",
        className,
      )}
    >
      <Search
        className={cn(
          "pointer-events-none absolute left-4 size-5",
          dark ? "text-brand-300" : "text-brand-800",
        )}
        aria-hidden="true"
      />
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        className={cn(
          "h-full w-full rounded-full bg-transparent pr-5 pl-12 text-body outline-none",
          dark ? "placeholder:text-brand-300" : "placeholder:text-brand-800",
        )}
        {...props}
      />
    </div>
  );
}
