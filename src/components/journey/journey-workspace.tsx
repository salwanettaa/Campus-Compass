"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  Lightbulb,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveJourneyReflectionAction } from "@/lib/journey/actions";
import type { PersonalizedJourney } from "@/lib/journey/types";
import { categoryName } from "@/lib/knowledge/categories";
import type { GuideRow } from "@/lib/knowledge/types";
import { cn } from "@/lib/utils";
import { ChecklistItemRow } from "./checklist-item-row";
import { ProgressBar } from "./progress-bar";

export type JourneyWorkspaceProps = {
  journey: PersonalizedJourney;
  recommendedGuides: GuideRow[];
  schemaReady: boolean;
};

export function JourneyWorkspace({
  journey,
  recommendedGuides,
  schemaReady,
}: JourneyWorkspaceProps) {
  const [reflection, setReflection] = useState(journey.reflectionNote);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [reflectionFeedback, setReflectionFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [isSavingReflection, startSavingReflection] = useTransition();

  function handleSaveReflection(event: React.FormEvent) {
    event.preventDefault();
    startSavingReflection(async () => {
      const res = await saveJourneyReflectionAction(
        journey.definition.area,
        reflection,
      );
      setReflectionFeedback(res);
    });
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <header className="flex flex-col gap-4">
        <div>
          <ButtonLink href="/home" variant="ghost" size="sm" className="-ml-3">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Home
          </ButtonLink>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-brand-300 bg-paper-raised p-5 sm:p-6">
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

          <h1 className="text-h1 text-brand-950">{journey.definition.title}</h1>
          <p className="text-lead max-w-2xl text-brand-800">
            {journey.definition.description}
          </p>
          <p className="text-caption text-brand-700">{journey.focusReason}</p>

          <ProgressBar
            className="pt-2"
            value={journey.progress.percentage}
            label={`${journey.progress.percentage}% complete`}
            detail={`${journey.progress.completed} completed · ${journey.progress.skipped} skipped · ${journey.progress.total} total steps`}
          />
        </div>
      </header>

      {!schemaReady ? (
        <Alert variant="info" title="Database patch required for persistence">
          Run <code>supabase/patches/04_journey_and_tasks.sql</code> in Supabase
          to persist checklist progress, reflections, and tasks.
        </Alert>
      ) : null}

      {feedback ? (
        <Alert variant={feedback.ok ? "success" : "error"}>
          {feedback.message}
        </Alert>
      ) : null}

      <section aria-labelledby="roadmap-heading" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="roadmap-heading" className="text-h2 text-brand-950">
            Roadmap Stages
          </h2>
          <p className="text-caption text-brand-800">
            Complete items, skip what isn&apos;t relevant, or send items to My Tasks.
          </p>
        </div>

        <ol className="flex flex-col gap-4">
          {journey.stages.map((stage) => (
            <li
              key={stage.id}
              className={cn(
                "flex flex-col gap-4 rounded-2xl border p-5 sm:p-6",
                stage.isFocus
                  ? "border-brand-600 bg-paper-raised"
                  : "border-brand-300 bg-paper-raised",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-caption font-medium text-brand-700">
                      Stage {stage.order} of {journey.stages.length}
                    </span>
                    {stage.isFocus ? (
                      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-caption font-medium text-route-on-dark">
                        Priority focus
                      </span>
                    ) : null}
                    {stage.id === journey.currentStage.id ? (
                      <span className="rounded-full border border-brand-600 px-2.5 py-0.5 text-caption text-brand-700">
                        Current stage
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-h3 text-brand-950">{stage.title}</h3>
                </div>
                <span className="text-caption text-brand-800">
                  {stage.completedCount}/{stage.totalCount} completed
                  {stage.skippedCount > 0
                    ? ` · ${stage.skippedCount} skipped`
                    : ""}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {stage.items.map((item) => (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    onFeedback={(ok, message) => setFeedback({ ok, message })}
                  />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="insights-heading" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Lightbulb
            className="size-5 text-route-on-dark"
            aria-hidden="true"
          />
          <h2 id="insights-heading" className="text-h2 text-brand-950">
            Key Insights
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {journey.definition.insights.map((insight) => (
            <article
              key={insight.id}
              className="flex flex-col gap-2 rounded-2xl border border-brand-300 bg-paper-raised p-5"
            >
              <h3 className="text-h4 text-brand-950">{insight.title}</h3>
              <p className="text-body text-brand-800">{insight.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="recommendations-heading"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-brand-700" aria-hidden="true" />
            <h2 id="recommendations-heading" className="text-h2 text-brand-950">
              Recommended from Knowledge Hub
            </h2>
          </div>
          <ButtonLink
            href={`/knowledge?category=${journey.definition.guideCategory}`}
            variant="outline"
            size="sm"
          >
            Browse {categoryName(journey.definition.guideCategory)}
          </ButtonLink>
        </div>

        {recommendedGuides.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {recommendedGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/knowledge/${guide.id}`}
                className="flex flex-col gap-2 rounded-2xl border border-brand-300 bg-paper-raised p-5 transition-colors hover:border-brand-600 hover:bg-brand-100/50"
              >
                <span className="text-caption text-brand-700">
                  {categoryName(guide.category)}
                </span>
                <h3 className="text-h4 text-brand-950">{guide.title}</h3>
                <p className="text-body line-clamp-2 text-brand-800">
                  {guide.content_raw}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-300 bg-paper-raised p-5 text-body text-brand-800">
            No guides are available in this category yet. Check back in{" "}
            <Link href="/knowledge" className="text-brand-700 underline">
              Knowledge Hub
            </Link>
            .
          </div>
        )}
      </section>

      <section
        aria-labelledby="reflection-heading"
        className="flex flex-col gap-4 rounded-2xl border border-brand-300 bg-paper-raised p-5 sm:p-6"
      >
        <div className="flex items-center gap-2">
          <MessageSquareText
            className="size-5 text-brand-700"
            aria-hidden="true"
          />
          <h2 id="reflection-heading" className="text-h3 text-brand-950">
            Progress Reflection
          </h2>
        </div>
        <p className="text-body text-brand-800">
          {journey.definition.reflectionPrompt}
        </p>

        {reflectionFeedback ? (
          <Alert variant={reflectionFeedback.ok ? "success" : "error"}>
            {reflectionFeedback.message}
          </Alert>
        ) : null}

        <form onSubmit={handleSaveReflection} className="flex flex-col gap-3">
          <label htmlFor="journey-reflection" className="sr-only">
            Progress reflection
          </label>
          <Textarea
            id="journey-reflection"
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="Write a quick note about what you tried, what worked, or what you want to focus on next..."
            maxLength={2000}
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-caption text-brand-800">
              Saved privately to your profile
            </span>
            <Button type="submit" size="sm" loading={isSavingReflection}>
              Save Reflection
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
