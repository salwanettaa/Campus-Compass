import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export type LogoProps = {
  /** "onDark" = for dark backgrounds, "onLight" = for light backgrounds. */
  tone?: "onDark" | "onLight";
  href?: string;
  className?: string;
};

/**
 * Temporary wordmark. The reference only has a "LOGO" placeholder;
 * swap the mark for the real logo asset once it is available.
 */
export function Logo({ tone = "onLight", href = "/", className }: LogoProps) {
  const onDark = tone === "onDark";

  return (
    <Link
      href={href}
      aria-label="Campus Compass, home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl",
          onDark
            ? "bg-white text-brand-900"
            : "bg-brand-900 text-white",
        )}
      >
        <Compass className="size-5" aria-hidden="true" />
      </span>
      <span
        className={cn(
          "text-h4 font-bold whitespace-nowrap tracking-tight",
          onDark ? "text-white" : "text-brand-950",
        )}
      >
        Campus Compass
      </span>
    </Link>
  );
}
