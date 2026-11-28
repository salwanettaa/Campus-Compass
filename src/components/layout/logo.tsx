import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/logo-mark";

export type LogoProps = {
  /** "onDark" = for dark backgrounds, "onLight" = for light backgrounds. */
  tone?: "onDark" | "onLight";
  compact?: boolean;
  href?: string;
  className?: string;
};

export function Logo({
  tone = "onLight",
  compact = false,
  href = "/",
  className,
}: LogoProps) {
  const onDark = tone === "onDark";

  return (
    <Link
      href={href}
      aria-label="Campus Compass, home"
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-md",
        compact && "justify-center",
        className,
      )}
    >
      <LogoMark
        className={cn("size-7 shrink-0", onDark ? "text-white" : "text-ink")}
        needle={onDark ? "#fb923c" : "#ea580c"}
      />
      <span
        className={cn(
          "text-[1.0625rem] font-bold tracking-[-0.025em] whitespace-nowrap",
          compact && "sr-only",
          onDark ? "text-white" : "text-brand-950",
        )}
      >
        Campus Compass
      </span>
    </Link>
  );
}
