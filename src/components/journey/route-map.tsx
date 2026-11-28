import Link from "next/link";
import { Check } from "lucide-react";
import { LogoMark } from "@/components/ui/logo-mark";
import type { PersonalizedJourney, PersonalizedStage } from "@/lib/journey/types";
import { cn } from "@/lib/utils";

/** A stage is cleared when every item is either completed or skipped. */
function isCleared(stage: PersonalizedStage) {
  return (
    stage.totalCount > 0 &&
    stage.completedCount + stage.skippedCount >= stage.totalCount
  );
}

/**
 * The student's journey drawn as a route: one stop per stage, with the logo
 * mark on the current one. A leg turns solid once the stage before it is
 * cleared. Every stop links to that stage on the My Journey page.
 */
export function RouteMap({
  journey,
  className,
}: {
  journey: PersonalizedJourney;
  className?: string;
}) {
  const { stages, currentStage, progress } = journey;
  const finished = journey.nextAction === null;

  return (
    <div className={cn("w-full", className)}>
      <p className="text-caption mb-3 flex flex-wrap justify-between gap-x-4 text-brand-800 tabular-nums">
        <span className="font-semibold text-brand-950">Your route</span>
        <span>
          {progress.completed} of {progress.total} steps done
          {progress.skipped > 0 ? `, ${progress.skipped} skipped` : ""} (
          {progress.percentage}%)
        </span>
      </p>
      <ol className="flex flex-col md:flex-row">
        {stages.map((stage, index) => {
          const cleared = isCleared(stage);
          const current = !finished && stage.id === currentStage.id;
          return (
            <li key={stage.id} className="relative min-w-0 md:flex-1">
              {index < stages.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-11 bottom-0 left-[1.3125rem] border-l-2 md:top-[1.3125rem] md:right-[calc(-50%+1.75rem)] md:bottom-auto md:left-[calc(50%+1.75rem)] md:border-t-2 md:border-l-0",
                    cleared ? "border-fill" : "border-dashed border-brand-600/50",
                  )}
                />
              ) : null}
              <Link
                href={`/journey#stage-${stage.id}`}
                aria-current={current ? "step" : undefined}
                className="group flex gap-3 rounded-lg pb-4 md:flex-col md:items-center md:gap-1.5 md:px-2 md:pb-1 md:text-center"
              >
                <span
                  className={cn(
                    "relative flex size-11 shrink-0 items-center justify-center rounded-full border-2 bg-paper-raised text-h5 tabular-nums transition-colors duration-150",
                    current
                      ? "border-fill text-ink ring-4 ring-brand-600/25"
                      : cleared
                        ? "border-fill bg-fill text-white"
                        : "border-brand-600/45 font-semibold text-brand-700 group-hover:border-brand-600 group-hover:bg-brand-100",
                  )}
                >
                  {current ? (
                    <LogoMark className="size-6" />
                  ) : cleared ? (
                    <Check className="size-5" strokeWidth={3} aria-hidden="true" />
                  ) : (
                    stage.order
                  )}
                </span>
                <span className="flex min-w-0 flex-col md:items-center">
                  {current ? (
                    <span className="text-caption font-semibold text-brand-700">
                      You are here
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "text-h5 group-hover:underline",
                      current ? "font-semibold text-brand-950" : "text-brand-800",
                    )}
                  >
                    {stage.title}
                  </span>
                  <span className="text-caption text-brand-800 tabular-nums">
                    {cleared ? "Cleared, " : ""}
                    {stage.completedCount}/{stage.totalCount} done
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
