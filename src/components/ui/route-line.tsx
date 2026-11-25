import { cn } from "@/lib/utils";

/** The brand motif: a dashed map route ending at a pin. It draws itself once. */
export function RouteLine({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 120"
      preserveAspectRatio="xMidYMid slice"
      className={cn("route-draw w-full shrink-0", className)}
      fill="none"
    >
      <path
        d="M-20 92C150 100 230 30 400 42s210 70 390 52 180-62 281-58"
        stroke="var(--color-route-on-dark)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="2 12"
      />
      <circle cx="1096" cy="36" r="9" fill="var(--color-route-on-dark)" />
      <circle cx="1096" cy="36" r="21" stroke="var(--color-route-on-dark)" strokeWidth="1.5" />
    </svg>
  );
}
