import { cn } from "@/lib/utils";

export type ProgressBarProps = {
  value: number;
  label?: string;
  detail?: string;
  className?: string;
};

export function ProgressBar({
  value,
  label,
  detail,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label || detail ? (
        <div className="flex items-baseline justify-between gap-3">
          {label ? (
            <span className="text-caption font-medium text-brand-900">
              {label}
            </span>
          ) : (
            <span />
          )}
          {detail ? (
            <span className="text-caption text-brand-800">{detail}</span>
          ) : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className="h-2.5 w-full overflow-hidden rounded-full bg-brand-100"
      >
        <div
          className="h-full rounded-full bg-fill transition-[width] duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
