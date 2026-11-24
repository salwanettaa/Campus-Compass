"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ChipProps = Omit<ComponentProps<"button">, "aria-pressed"> & {
  selected?: boolean;
};

/** A single filter pill (e.g. "All", "Academic"). */
export function Chip({
  className,
  selected = false,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        "inline-flex h-10 items-center rounded-full px-5 text-h5",
        "transition-[background-color,color,box-shadow] duration-200",
        selected
          ? "bg-brand-950 text-white shadow-card"
          : "bg-brand-300/60 text-brand-950 hover:bg-brand-300",
        className,
      )}
      {...props}
    />
  );
}

export type FilterChipsProps = {
  options: readonly string[];
  /** Initially selected option. Defaults to the first one. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  className?: string;
};

/** Single-select row of chips. */
export function FilterChips({
  options,
  defaultValue,
  onChange,
  label = "Filter",
  className,
}: FilterChipsProps) {
  const [value, setValue] = useState(defaultValue ?? options[0]);

  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((option) => (
        <Chip
          key={option}
          selected={option === value}
          onClick={() => {
            setValue(option);
            onChange?.(option);
          }}
        >
          {option}
        </Chip>
      ))}
    </div>
  );
}
