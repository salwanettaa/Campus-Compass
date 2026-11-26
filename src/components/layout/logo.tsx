import Link from "next/link";
import { cn } from "@/lib/utils";
import { WayfinderMark } from "@/components/ui/wayfinder-mark";

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
        "inline-flex min-h-11 items-center gap-2.5 rounded-md",
        compact && "justify-center",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl text-white",
          "bg-white/10",
        )}
      >
        <WayfinderMark className="size-6" />
      </span>
      <span
        className={cn(
          "text-base font-bold tracking-tight whitespace-nowrap",
          compact && "sr-only",
          onDark ? "text-white" : "text-brand-950",
        )}
      >
        Campus Compass
      </span>
    </Link>
  );
}
