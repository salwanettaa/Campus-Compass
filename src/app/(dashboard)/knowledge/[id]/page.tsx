import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { VerifiedMeta } from "@/components/knowledge/verified-meta";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { categoryName } from "@/lib/knowledge/categories";
import { getGuide, parseSimulation } from "@/lib/knowledge/data";

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

  const result = await getGuide(id, simulation);

  if (!result.ok) {
    return (
      <main className="flex flex-col items-start gap-3">
        <Alert variant="error" title="We could not load this guide">
          {result.message} Please try again.
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

  return (
    <main className="flex max-w-4xl flex-col gap-6">
      <Link
        href="/knowledge"
        className="text-h5 inline-flex w-fit items-center gap-2 rounded-md text-brand-800 hover:underline focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Knowledge Hub
      </Link>

      <article className="flex flex-col gap-5">
        <p className="text-caption text-brand-800">
          {categoryName(guide.category)}
        </p>
        <h1 className="text-h1 break-words text-brand-950">{guide.title}</h1>
        <div className="border-b border-brand-300 pb-4">
          <VerifiedMeta guide={guide} />
        </div>
        <div className="text-lead max-w-2xl whitespace-pre-line text-brand-950">
          {guide.content_raw}
        </div>

        {guide.source_reference || sourceUrl ? (
          <div className="flex max-w-2xl flex-col gap-1 rounded-md border border-brand-300 bg-paper-raised p-4">
            <h2 className="text-h5 text-brand-950">Source</h2>
            {guide.source_reference ? (
              <p className="text-body text-brand-900">{guide.source_reference}</p>
            ) : null}
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-h5 inline-flex w-fit items-center gap-1 text-brand-800 underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
              >
                Open source
                <ExternalLink className="size-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        ) : null}

        <Alert variant="info">
          This is sample content. Always confirm deadlines and requirements with
          the official campus source.
        </Alert>
      </article>
    </main>
  );
}
