"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import type { PersonalizedJourney } from "@/lib/journey/types";
import { cn } from "@/lib/utils";
import { ChecklistItemRow } from "./checklist-item-row";

export type JourneySummaryCardProps = {
  journey: PersonalizedJourney;
  schemaReady: boolean;
};

export function JourneySummaryCard({
  journey,
  schemaReady,
}: JourneySummaryCardProps) {
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const previewItems = journey.currentStage.items.slice(0, 3);
  const hiddenCount = journey.currentStage.items.length - previewItems.length;

  return (
    <section
      id="my-journey"
      aria-labelledby="journey-heading"
      className="flex min-w-0 scroll-mt-24 flex-col gap-3 rounded-xl border border-brand-300 bg-paper-raised p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <div className="min-w-0 flex-1 basis-52">
          <h2 id="journey-heading" className="text-h3 text-brand-950">
            Checklist for this stage
          </h2>
          <p className="text-caption mt-0.5 text-brand-800">
            {journey.focusReason}
          </p>
        </div>
        <Link
          href={`/journey#stage-${journey.currentStage.id}`}
          className="tap inline-flex min-h-9 shrink-0 items-center rounded-lg text-caption font-semibold text-brand-700 hover:bg-brand-100 lg:px-2"
        >
          Open in My Journey
        </Link>
      </div>

      {!schemaReady ? (
        <Alert variant="info" title="Journey sync pending database setup">
          Run <code>supabase/patches/04_journey_and_tasks.sql</code> in Supabase
          to save checklist progress and tasks across sessions.
        </Alert>
      ) : null}

      {feedback ? (
        <Alert variant={feedback.ok ? "success" : "error"}>
          {feedback.message}
        </Alert>
      ) : null}

      {journey.nextAction ? null : (
        <div className="rounded-lg border border-emerald-700/40 bg-emerald-50 px-3.5 py-2.5 text-body text-emerald-950">
          All checklist items in this journey are resolved. Review your
          reflection in the full journey view.
        </div>
      )}

      <ul className="flex flex-col divide-y divide-brand-300 border-t border-brand-300">
        {previewItems.map((item) => {
          const upNext = item.id === journey.nextAction?.id;
          return (
            <li
              key={item.id}
              className={cn("px-3", upNext && "rounded-lg bg-brand-100")}
            >
              {upNext ? (
                <p className="text-caption pt-3 font-semibold text-brand-700">
                  Up next
                </p>
              ) : null}
              <ChecklistItemRow
                item={item}
                allowSkip={false}
                flush
                onFeedback={(ok, message) => setFeedback({ ok, message })}
              />
            </li>
          );
        })}
      </ul>

      {hiddenCount > 0 ? (
        <p className="text-caption mt-auto text-brand-800">
          {hiddenCount} more in My Journey.
        </p>
      ) : null}
    </section>
  );
}
