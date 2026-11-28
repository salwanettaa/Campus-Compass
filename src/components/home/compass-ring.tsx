import {
  ADAPTATION_AREAS,
  normalizeAdaptationProfile,
} from "@/lib/constants/onboarding";
import { LogoMark } from "@/components/ui/logo-mark";
import { cn } from "@/lib/utils";

const CENTER = 160;
const RADIUS = 128;
const TICKS = 72;
const AREA_STEP = 360 / ADAPTATION_AREAS.length;

function point(degrees: number, radius: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  // Rounded so server and client render identical attributes.
  const round = (value: number) => Math.round(value * 100) / 100;
  return {
    x: round(CENTER + radius * Math.cos(radians)),
    y: round(CENTER + radius * Math.sin(radians)),
  };
}

/**
 * A compass with one stop per adaptation area. The needle points at the area the
 * student chose. It shows a choice, not a score or progress.
 */
export function CompassRing({
  area,
  caption = "Your focus",
  title,
  compactOnPhone = false,
}: {
  area: string | null;
  /** Hides the centre text on phones, where the ring is too small to hold it. */
  compactOnPhone?: boolean;
  caption?: string;
  /** Centre text. Defaults to the chosen area. */
  title?: string;
}) {
  const normalizedArea = area ? normalizeAdaptationProfile(area, null).area : null;
  const index = ADAPTATION_AREAS.findIndex(
    (entry) => entry.value === normalizedArea,
  );
  const selected = ADAPTATION_AREAS[index];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-80">
      <svg
        aria-hidden="true"
        viewBox="0 0 320 320"
        fill="none"
        className="absolute inset-0 size-full"
      >
        {Array.from({ length: TICKS }, (_, tick) => {
          const from = point((tick * 360) / TICKS, 146);
          const to = point((tick * 360) / TICKS, tick % 6 === 0 ? 156 : 151);
          return (
            <line
              key={tick}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--color-brand-400)"
              strokeWidth="1"
            />
          );
        })}
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="var(--color-frost)" stroke="var(--color-brand-600)" strokeWidth="1.5" />
        <circle cx={CENTER} cy={CENTER} r="104" fill="var(--color-paper-raised)" stroke="var(--color-brand-300)" />
        {ADAPTATION_AREAS.map((entry, position) => {
          const { x, y } = point(position * AREA_STEP, RADIUS);
          return (
            <circle
              key={entry.value}
              cx={x}
              cy={y}
              r="5"
              fill="var(--color-paper-raised)"
              stroke="var(--color-brand-600)"
              strokeWidth="2"
            />
          );
        })}
        {selected ? (
          <g className="compass-needle" style={{ transformOrigin: "160px 160px" }}>
            <g transform={`rotate(${index * AREA_STEP} ${CENTER} ${CENTER})`}>
              <path d="M160 44 151 62h18Z" fill="var(--color-route-on-dark)" />
              <circle cx={CENTER} cy={CENTER - RADIUS} r="9" fill="var(--color-route-on-dark)" />
            </g>
          </g>
        ) : null}
      </svg>
      {compactOnPhone ? (
        <span className="absolute inset-0 flex items-center justify-center md:hidden">
          <LogoMark className="size-9 text-ink" />
        </span>
      ) : null}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center px-[16%] text-center",
          compactOnPhone && "max-md:hidden",
        )}
      >
        <p className="text-caption text-brand-800">{caption}</p>
        <p className="text-h3 text-brand-950">{title ?? selected?.label ?? "Not set"}</p>
      </div>
    </div>
  );
}
