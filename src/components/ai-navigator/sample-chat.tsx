import Link from "next/link";
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
    <li className={cn("flex flex-col gap-1.5", isUser && "items-end")}>
      <p className="text-caption text-brand-800">
        {isUser ? "Your question" : "Navigator (sample answer)"}
      </p>
      <div
        className={cn(
          "rounded-md px-4 py-3",
          isUser
            ? "text-body bg-brand-gradient max-w-[85%] text-white"
            : "text-lead max-w-2xl border border-brand-300 bg-paper-raised text-brand-950",
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
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <section aria-labelledby="chat-heading" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-brand-300 pb-3">
          <h2 id="chat-heading" className="text-h2 text-brand-950">
            Example conversation
          </h2>
          <span className="font-mono text-xs text-brand-800">
            Demo, not live
          </span>
        </div>

        <ol className="flex flex-col gap-5" aria-label="Sample conversation">
          {SAMPLE_MESSAGES.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="sources-heading"
        className="flex flex-col gap-3 lg:sticky lg:top-6 lg:border-l lg:border-brand-300 lg:pl-6"
      >
        <h2 id="sources-heading" className="text-h2 border-b border-brand-300 pb-3 text-brand-950">
          Sources
        </h2>
        <p className="text-body text-brand-800">
          Every sample answer points back to the material it used.
        </p>
        <ul className="divide-y divide-brand-300 border-y border-brand-300">
          {SAMPLE_SOURCES.map((source) => (
            <li key={source.index}>
              <Link
                href={`/knowledge/${source.guideId}`}
                className="flex gap-3 rounded-sm py-4 hover:bg-brand-100"
              >
                <span aria-hidden="true" className="font-mono text-sm tabular-nums text-brand-700">
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
