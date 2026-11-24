import Link from "next/link";
import { FileText, SendHorizontal, Sparkles, User } from "lucide-react";
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
  const Icon = isUser ? User : Sparkles;
  return (
    <li className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <span
        aria-hidden="true"
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-brand-950 text-white" : "bg-brand-100 text-brand-800",
        )}
      >
        <Icon className="size-4" />
      </span>
      <div
        className={cn(
          "text-body max-w-[85%] rounded-3xl px-4 py-3",
          isUser ? "bg-brand-950 text-white" : "bg-brand-100 text-brand-950",
        )}
      >
        <span className="sr-only">{isUser ? "You said: " : "Navigator said: "}</span>
        {message.text}
      </div>
    </li>
  );
}

/** Static layout preview of the chat and its source cards. Nothing here is interactive. */
export function SampleChat() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section
        aria-labelledby="chat-heading"
        className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-card sm:p-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="chat-heading" className="text-h3 text-brand-950">
            Conversation
          </h2>
          <span className="text-caption rounded-full bg-amber-50 px-3 py-0.5 font-medium text-amber-900">
            Sample
          </span>
        </div>

        <ol className="flex flex-col gap-4" aria-label="Sample conversation">
          {SAMPLE_MESSAGES.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </ol>

        <form
          aria-label="Ask the AI Navigator (not available yet)"
          className="flex items-center gap-2"
        >
          <input
            type="text"
            disabled
            aria-label="Your question"
            placeholder="Chat is not available yet"
            className="text-body h-12 w-full rounded-full border border-brand-300 bg-brand-100 px-5 text-brand-950 placeholder:text-brand-800 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            aria-label="Send (not available yet)"
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-900 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal className="size-5" aria-hidden="true" />
          </button>
        </form>
      </section>

      <section aria-labelledby="sources-heading" className="flex flex-col gap-3">
        <h2 id="sources-heading" className="text-h3 text-brand-950">
          Sources
        </h2>
        <ul className="flex flex-col gap-3">
          {SAMPLE_SOURCES.map((source) => (
            <li key={source.index}>
              <Link
                href={`/knowledge/${source.guideId}`}
                className="flex gap-3 rounded-3xl bg-white p-4 shadow-card transition-colors duration-200 hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-950 text-h5 text-white"
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
