"use client";

import { useState } from "react";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import type { PersonalizedJourney } from "@/lib/journey/types";
import { ChecklistItemRow } from "./checklist-item-row";
import { ProgressBar } from "./progress-bar";

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

  return (
    <section
      id="my-journey"
      aria-labelledby="journey-heading"
      className="flex scroll-mt-6 flex-col gap-5 rounded-2xl border border-brand-300 bg-paper-raised p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-caption font-medium text-brand-700">
              <Compass className="size-3.5" aria-hidden="true" />
              My Journey
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-300 px-3 py-1 text-caption text-brand-800">
              <Sparkles
                className="size-3.5 text-route-on-dark"
                aria-hidden="true"
              />
              Focus: {journey.challengeLabel}
            </span>
          </div>
          <h2 id="journey-heading" className="text-h2 text-brand-950">
            {journey.definition.title}
          </h2>
          <p className="text-body max-w-2xl text-brand-800">
            {journey.definition.description}
          </p>
        </div>

        <ButtonLink href="/journey" size="sm" className="shrink-0">
          Continue Journey
          <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
      </div>

      <ProgressBar
        value={journey.progress.percentage}
        label={`${journey.progress.percentage}% complete`}
        detail={`${journey.progress.completed} completed · ${journey.progress.skipped} skipped · ${journey.progress.total} steps`}
      />

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

      <div className="flex flex-col gap-3 rounded-xl border border-brand-300 bg-paper p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-caption text-brand-700">
              Current Stage · Stage {journey.currentStage.order} of{" "}
              {journey.stages.length}
            </p>
            <h3 className="text-h4 text-brand-950">
              {journey.currentStage.title}
            </h3>
          </div>
          <span className="text-caption text-brand-800">
            {journey.currentStage.completedCount}/
            {journey.currentStage.totalCount} done
          </span>
        </div>

        <p className="text-caption text-brand-800">{journey.focusReason}</p>

        {journey.nextAction ? (
          <div className="rounded-lg border border-brand-300/80 bg-brand-100/60 px-3.5 py-2.5">
            <span className="text-caption font-medium text-brand-700">
              Next recommended action:{" "}
            </span>
            <span className="text-body text-brand-950">
              {journey.nextAction.title}
            </span>
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-700/40 bg-emerald-50/40 px-3.5 py-2.5 text-body text-emerald-950">
            All checklist items in this journey are resolved. Review your
            reflection in the full journey view.
          </div>
        )}

        <div className="flex flex-col gap-2.5 pt-1">
          {previewItems.map((item) => (
            <ChecklistItemRow
              key={item.id}
              item={item}
              allowSkip={false}
              onFeedback={(ok, message) => setFeedback({ ok, message })}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-caption text-brand-800">
            Showing {previewItems.length} of {journey.currentStage.items.length}{" "}
            items in this stage
          </span>
          <ButtonLink href="/journey" variant="outline" size="sm">
            View Full Roadmap
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
