import Link from "next/link";
import { FileText } from "lucide-react";
import { sourceLabel } from "@/lib/knowledge/categories";
import { formatVerifiedDate } from "@/lib/knowledge/filter";
import {
  SAMPLE_MESSAGES,
  SAMPLE_SOURCES,
  type SampleMessage,
} from "@/lib/ai-navigator/mock-data";
import { cn } from "@/lib/utils";

function Message({ message }: { message: SampleMessage }) {
  const isUser = message.role === "user";
  return (
    <li className="flex flex-col gap-2">
      <p className="font-mono text-[10px] tracking-wide text-brand-700">
        {isUser ? "YOUR QUESTION" : "NAVIGATOR / SAMPLE"}
      </p>
      <div
        className={cn(
          "text-body border-l-2 px-4 py-3",
          isUser
            ? "border-brand-700 bg-brand-950 text-white"
            : "border-brand-400 bg-white/70 text-brand-950",
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

/** Static layout preview of the chat and its source cards. Nothing here is interactive. */
export function SampleChat() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <section
        aria-labelledby="chat-heading"
        className="flex flex-col gap-5 rounded-xl border border-brand-950/10 bg-paper-raised p-4 sm:p-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-brand-950/10 pb-4">
          <h2
            id="chat-heading"
            className="text-xl font-semibold tracking-tight text-brand-950"
          >
            Example conversation
          </h2>
          <span className="font-mono text-[10px] tracking-wide text-brand-700">
            DEMO / NOT LIVE
          </span>
        </div>

        <ol className="flex flex-col gap-4" aria-label="Sample conversation">
          {SAMPLE_MESSAGES.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </ol>
      </section>

      <section aria-labelledby="sources-heading" className="flex flex-col gap-3">
        <div className="border-b border-brand-950/15 pb-3">
          <p className="font-mono text-[10px] tracking-wide text-brand-700">
            TRACEABLE BY DESIGN
          </p>
          <h2
            id="sources-heading"
            className="mt-1 text-xl font-semibold tracking-tight text-brand-950"
          >
            Sources
          </h2>
        </div>
        <p className="text-body text-brand-800">
          Every sample answer points back to the material it used.
        </p>
        <ul className="flex flex-col gap-3">
          {SAMPLE_SOURCES.map((source) => (
            <li key={source.index}>
              <Link
                href={`/knowledge/${source.guideId}`}
                className="flex gap-3 border border-brand-950/10 border-l-2 border-l-brand-600 bg-paper-raised p-4 transition-colors duration-200 hover:bg-white focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className="font-mono flex size-8 shrink-0 items-center justify-center border border-brand-950/15 bg-brand-100 text-sm text-brand-950"
                >
                  {source.index}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-h5 text-brand-950">
                    <span className="sr-only">Source {source.index}: </span>
                    {source.title}
                  </span>
                  <span className="text-caption inline-flex items-center gap-1 text-brand-800">
                    <FileText className="size-4" aria-hidden="true" />
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
