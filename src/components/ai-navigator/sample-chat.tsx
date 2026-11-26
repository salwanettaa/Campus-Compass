"use client";

import { useState } from "react";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  SAMPLE_SCENARIOS,
  pickInitialScenarioId,
  type SampleMessage,
} from "@/lib/ai-navigator/mock-data";
import { sourceLabel } from "@/lib/knowledge/categories";
import { formatVerifiedDate } from "@/lib/knowledge/filter";
import { cn } from "@/lib/utils";

function Message({ message }: { message: SampleMessage }) {
  const isUser = message.role === "user";
  return (
    <li className={cn("flex flex-col gap-1.5", isUser && "items-end")}>
      <p className="text-caption text-brand-800">
        {isUser ? "Your question" : "Navigator (sample answer)"}
      </p>
      <div
        className={cn(
          "rounded-md px-4 py-3",
          isUser
            ? "text-body bg-brand-gradient max-w-[85%] text-white"
            : "text-lead text-pretty max-w-2xl border border-brand-300 bg-paper-raised text-brand-950",
        )}
      >
        <span className="sr-only">
          {isUser ? "You said: " : "Navigator said: "}
        </span>
        {message.text}
      </div>
    </li>
  );
}

/**
 * Interactive preview of the AI Navigator chat and citation rail.
 * Lets reviewers switch between curated UGM/D4 TRI scenarios and an
 * insufficient-evidence guardrail without a live LLM or fake input.
 */
export function SampleChat({ initialQuery }: { initialQuery?: string }) {
  const [selectedId, setSelectedId] = useState(() =>
    pickInitialScenarioId(initialQuery),
  );
  const scenario =
    SAMPLE_SCENARIOS.find((item) => item.id === selectedId) ??
    SAMPLE_SCENARIOS[0];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <section aria-labelledby="chat-heading" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-brand-300 pb-3">
          <h2 id="chat-heading" className="text-h2 text-brand-950">
            Interactive preview
          </h2>
          <span className="font-mono text-xs text-brand-800">
            Demo, not live
          </span>
        </div>

        {initialQuery ? (
          <p className="text-body text-pretty rounded-md border border-brand-300 bg-brand-100 px-4 py-3 text-brand-950">
            Opened from Knowledge Hub with topic:{" "}
            <strong className="font-semibold">{initialQuery}</strong>. Live
            Gemini RAG retrieval connects in the next phase; previewing closest
            grounded scenario below.
          </p>
        ) : null}

        <div className="flex flex-col gap-2">
          <p className="text-caption text-brand-800">
            Select a sample campus question to preview grounded citations:
          </p>
          <div
            role="group"
            aria-label="Sample questions"
            className="flex flex-wrap gap-2"
          >
            {SAMPLE_SCENARIOS.map((item) => {
              const active = item.id === scenario.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full border px-4 text-body transition-colors duration-150",
                    active
                      ? "border-brand-700 bg-brand-700 font-semibold text-white"
                      : "border-brand-400 bg-white text-brand-900 hover:border-brand-700 active:bg-brand-100",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <ol className="flex flex-col gap-5" aria-label="Sample conversation">
          {scenario.messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </ol>

        {scenario.insufficientEvidence ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-brand-300 bg-card-tint p-4">
            <p className="text-body text-pretty text-brand-900">
              No verified source covers this yet. Ask seniors in the campus
              forum instead.
            </p>
            <ButtonLink href="/community" variant="outline" size="sm">
              <MessagesSquare className="size-4" aria-hidden="true" />
              <span>Ask in Community</span>
            </ButtonLink>
          </div>
        ) : null}
      </section>

      <section
        aria-labelledby="sources-heading"
        className="flex flex-col gap-3 lg:sticky lg:top-6 lg:border-l lg:border-brand-300 lg:pl-6"
      >
        <h2
          id="sources-heading"
          className="text-h2 border-b border-brand-300 pb-3 text-brand-950"
        >
          Sources
        </h2>
        <p className="text-body text-pretty text-brand-800">
          {scenario.insufficientEvidence
            ? "Related campus guides checked, with no direct match found."
            : "Every sample answer points back to the guide it used."}
        </p>
        <ul className="divide-y divide-brand-300 border-y border-brand-300">
          {scenario.sources.map((source) => (
            <li key={`${scenario.id}-${source.index}`}>
              <Link
                href={`/knowledge/${source.guideId}`}
                className="flex gap-3 rounded-sm py-4 hover:bg-brand-100"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-sm tabular-nums text-brand-700"
                >
                  [{source.index}]
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-h5 text-brand-950 underline underline-offset-4">
                    <span className="sr-only">Source {source.index}: </span>
                    {source.title}
                  </span>
                  <span className="text-caption text-brand-800">
                    {sourceLabel(source.sourceType)} · verified{" "}
                    {formatVerifiedDate(source.lastVerifiedAt)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
