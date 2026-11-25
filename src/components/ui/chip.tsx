"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ChipProps = Omit<ComponentProps<"button">, "aria-pressed"> & {
  selected?: boolean;
};

/** A compact single-select control (e.g. "All", "Academic"). */
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
        "inline-flex min-h-11 items-center rounded-lg border border-brand-950/10 px-4 text-h5",
        "transition-[background-color,color,box-shadow] duration-200",
        selected
          ? "border-brand-950 bg-brand-950 text-white"
          : "bg-paper-raised text-brand-900 hover:bg-brand-100",
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
