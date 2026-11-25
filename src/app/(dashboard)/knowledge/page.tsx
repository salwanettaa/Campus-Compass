import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, SearchX } from "lucide-react";
import { CategoryFilter } from "@/components/knowledge/category-filter";
import { ExperienceCard } from "@/components/knowledge/experience-card";
import { GuideListCard } from "@/components/knowledge/guide-list-card";
import { Alert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import {
  listExperiences,
  listGuides,
  parseSimulation,
} from "@/lib/knowledge/data";
import {
  applyGuides,
  buildKnowledgeQuery,
  countByCategory,
  parseKnowledgeParams,
} from "@/lib/knowledge/filter";

export const metadata: Metadata = { title: "Knowledge Hub" };

type SearchParams = Record<string, string | string[] | undefined>;

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const raw = await searchParams;
  const params = parseKnowledgeParams(raw);
  const simulation = parseSimulation(
    Array.isArray(raw.mock) ? raw.mock[0] : raw.mock,
  );

  const [guidesResult, experiencesResult] = await Promise.all([
    listGuides(simulation),
    listExperiences(simulation),
  ]);

  const guides = guidesResult.ok ? applyGuides(guidesResult.data, params) : [];
  const counts = guidesResult.ok
    ? countByCategory(guidesResult.data)
    : countByCategory([]);
  const isFiltered = params.category !== null || params.q !== "";
  const retryHref = `/knowledge${buildKnowledgeQuery(params)}`;

  return (
    <main className="flex flex-col gap-8">
      <header className="flex flex-col gap-2 border-b border-brand-950/15 pb-5">
        <p className="font-mono text-[10px] tracking-[0.16em] text-brand-700">
          CAMPUS KNOWLEDGE / 02
        </p>
        <h1 className="text-4xl leading-tight font-semibold tracking-[-0.05em] text-brand-950">
          Knowledge Hub
        </h1>
        <p className="text-body max-w-xl text-brand-800">
          Campus guides and student experiences, with sources kept in view.
        </p>
      </header>

      <Alert variant="info">
        You are viewing sample guides. Live content is coming soon, so do not
        rely on anything here as official information.
      </Alert>

      <form action="/knowledge" role="search" className="flex flex-col gap-3 sm:flex-row">
        <SearchBar
          name="q"
          defaultValue={params.q}
          maxLength={100}
          label="Search guides"
          placeholder="Search guides..."
        />
        {params.category ? (
          <input type="hidden" name="category" value={params.category} />
        ) : null}
        <Button type="submit" className="shrink-0">
          Search
        </Button>
      </form>

      <CategoryFilter params={params} counts={counts} />

      <section aria-labelledby="guides-heading" className="flex flex-col gap-4">
        <h2 id="guides-heading" className="text-h2 text-brand-950">
          Guides
        </h2>

        {!guidesResult.ok ? (
          <div className="flex flex-col items-start gap-3">
            <Alert variant="error" title="We could not load the guides">
              {guidesResult.message} Please try again.
            </Alert>
            <ButtonLink href={retryHref} variant="outline" size="sm">
              Try again
            </ButtonLink>
          </div>
        ) : guides.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-brand-950/10 bg-paper-raised p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">
              {isFiltered ? (
                <SearchX className="size-6" aria-hidden="true" />
              ) : (
                <BookOpenText className="size-6" aria-hidden="true" />
              )}
            </span>
            <h3 className="text-h3 text-brand-950">
              {isFiltered ? "No guides match your search" : "No guides yet"}
            </h3>
            <p className="text-body max-w-md text-brand-800">
              {isFiltered
                ? "Try different words or another category."
                : "Curated guides will appear here once they are published."}
            </p>
            {isFiltered ? (
              <Link
                href="/knowledge"
                className="text-h5 text-brand-800 underline underline-offset-4"
              >
                Clear search and filters
              </Link>
            ) : null}
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2" aria-label="Guides">
            {guides.map((guide) => (
              <li key={guide.id}>
                <GuideListCard guide={guide} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="experiences-heading"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="experiences-heading" className="text-h2 text-brand-950">
            Senior experiences
          </h2>
          <ButtonLink
            href="/knowledge/share-experience"
            variant="outline"
            size="sm"
          >
            Share your experience
          </ButtonLink>
        </div>

        {!experiencesResult.ok ? (
          <div className="flex flex-col items-start gap-3">
            <Alert variant="error" title="We could not load experiences">
              {experiencesResult.message} Please try again.
            </Alert>
            <ButtonLink href={retryHref} variant="outline" size="sm">
              Try again
            </ButtonLink>
          </div>
        ) : experiencesResult.data.length === 0 ? (
          <p className="text-body border-l-2 border-brand-300 bg-paper-raised p-6 text-brand-800">
            No experiences yet. Be the first to share what helped you.
          </p>
        ) : (
          <ul className="flex flex-col gap-4" aria-label="Senior experiences">
            {experiencesResult.data.map((experience) => (
              <li key={experience.id}>
                <ExperienceCard experience={experience} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
