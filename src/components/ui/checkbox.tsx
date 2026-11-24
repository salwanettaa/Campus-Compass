import { Check } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<ComponentProps<"input">, "type" | "children"> & {
  label: ReactNode;
  invalid?: boolean;
};

export function Checkbox({
  className,
  label,
  invalid,
  id,
  ...props
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn("flex cursor-pointer items-start gap-3", className)}
    >
      <span className="relative mt-0.5 flex size-5 shrink-0">
        <input
          id={id}
          type="checkbox"
          aria-invalid={invalid || undefined}
          className={cn(
            "peer size-5 cursor-pointer appearance-none rounded-md border-2 bg-white",
            "checked:border-brand-800 checked:bg-brand-800",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
            invalid ? "border-red-600" : "border-brand-400",
          )}
          {...props}
        />
        <Check
          className="pointer-events-none absolute inset-0 m-auto size-3.5 text-white opacity-0 peer-checked:opacity-100"
          strokeWidth={3}
          aria-hidden="true"
        />
      </span>
      <span className="text-body text-brand-950">{label}</span>
    </label>
  );
}
