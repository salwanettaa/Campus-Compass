import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FieldProps = {
  /** Must match the `id` of the control inside. */
  htmlFor: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

/** Label + control + hint + error, wired for screen readers. */
export function Field({
  htmlFor,
  label,
  hint,
  error,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-h5 text-brand-950">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-caption text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-caption text-brand-800">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Builds the aria props a control needs to point at its hint/error text. */
export function fieldAria(id: string, error?: string, hint?: string) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}
