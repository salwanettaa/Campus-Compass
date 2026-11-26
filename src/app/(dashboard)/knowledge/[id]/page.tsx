import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Signpost } from "lucide-react";
import { BookmarkButton } from "@/components/knowledge/bookmark-button";
import { VerifiedMeta } from "@/components/knowledge/verified-meta";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { categoryName } from "@/lib/knowledge/categories";
import {
  getGuide,
  getKnowledgeContext,
  parseSimulation,
} from "@/lib/knowledge/data";
import { AVAILABLE_PROGRAMS } from "@/lib/knowledge/types";

export const metadata: Metadata = { title: "Guide" };

type SearchParams = Record<string, string | string[] | undefined>;

/** Only http(s) links are shown, so a bad `source_url` can never run script. */
function safeUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export default async function GuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const raw = await searchParams;
  const simulation = parseSimulation(
    Array.isArray(raw.mock) ? raw.mock[0] : raw.mock,
  );

  const [result, context] = await Promise.all([
    getGuide(id, simulation),
    getKnowledgeContext(),
  ]);

  if (!result.ok) {
    return (
      <main className="flex flex-col items-start gap-3">
        <Alert variant="error" title="Unable to load guide">
          {result.message} Check your connection and try again.
        </Alert>
        <ButtonLink href={`/knowledge/${id}`} variant="outline" size="sm">
          Try again
        </ButtonLink>
      </main>
    );
  }
  if (!result.data) notFound();

  const guide = result.data;
  const sourceUrl = safeUrl(guide.source_url);
  const program = guide.program_id
    ? context.programs.find((p) => p.id === guide.program_id) ??
      AVAILABLE_PROGRAMS.find((p) => p.id === guide.program_id)
    : null;
  const scopeLabel = guide.is_general
    ? `General · ${context.campusName}`
    : program
      ? `${program.name} (${program.faculty})`
      : "Program guide";
  const initialBookmarked = context.bookmarkedGuideIds.includes(guide.id);

  const aiQuery = encodeURIComponent(
    `Explain the official guide "${guide.title}" and summarize the key steps.`,
  );

  return (
    <main className="flex w-full max-w-4xl flex-col gap-6">
      <Link
        href="/knowledge"
        className="text-h5 inline-flex min-h-11 w-fit items-center gap-2 rounded-md text-brand-800 hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        <span>Back to Knowledge Hub</span>
      </Link>

      <article className="flex flex-col gap-5 rounded-md border border-brand-300 bg-paper-raised p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-caption font-medium text-brand-700">
              {categoryName(guide.category)}
              <span className="text-brand-800"> · {scopeLabel}</span>
            </p>
            <h1 className="text-h1 text-balance break-words text-brand-950">
              {guide.title}
            </h1>
          </div>

          <BookmarkButton
            guideId={guide.id}
            guideTitle={guide.title}
            initialBookmarked={initialBookmarked}
            showLabel
          />
        </div>

        <div className="border-b border-brand-300 pb-4">
          <VerifiedMeta guide={guide} />
        </div>

        <div className="text-lead text-pretty max-w-2xl whitespace-pre-line text-brand-950">
          {guide.content_raw}
        </div>

        {guide.source_reference || sourceUrl ? (
          <div className="flex max-w-2xl flex-col gap-1.5 rounded-md border border-brand-300 bg-card-tint p-4">
            <h2 className="text-h5 text-brand-950">Source</h2>
            {guide.source_reference ? (
              <p className="text-body text-brand-900">
                {guide.source_reference}
              </p>
            ) : null}
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-h5 inline-flex min-h-11 w-fit items-center gap-1.5 text-brand-700 underline underline-offset-4 hover:text-brand-950"
              >
                <span>Open official source</span>
                <ExternalLink className="size-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col justify-between gap-4 rounded-md border border-brand-300 bg-card-tint p-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <Signpost className="mt-0.5 size-5 shrink-0 text-brand-700" aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
              <h2 className="text-h5 text-brand-950">Questions about this guide?</h2>
              <p className="text-body text-pretty text-brand-800">
                Ask AI Navigator to walk through these steps with citations.
              </p>
            </div>
          </div>
          <ButtonLink
            href={`/ai-navigator?q=${aiQuery}`}
            variant="outline"
            size="sm"
            className="shrink-0 self-start sm:self-auto"
          >
            Ask AI Navigator
          </ButtonLink>
        </div>

        <p className="text-caption text-pretty border-t border-brand-300 pt-4 text-brand-800">
          Always confirm official deadlines and requirements with your faculty or Simaster.
        </p>
      </article>
    </main>
  );
}
