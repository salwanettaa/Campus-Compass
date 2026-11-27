import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { CategoryFilter } from "@/components/knowledge/category-filter";
import { GuideListCard } from "@/components/knowledge/guide-list-card";
import { RequestGuideModal } from "@/components/knowledge/request-guide-modal";
import { SmartScopeSwitcher } from "@/components/knowledge/smart-scope-switcher";
import { Alert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { categoryName } from "@/lib/knowledge/categories";
import {
  getKnowledgeContext,
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
  const parsed = parseKnowledgeParams(raw);
  const params = {
    ...parsed,
    scope: parsed.scope ?? "major",
  };
  const simulation = parseSimulation(
    Array.isArray(raw.mock) ? raw.mock[0] : raw.mock,
  );

  const [context, guidesResult] = await Promise.all([
    getKnowledgeContext(),
    listGuides(simulation),
  ]);

  const filterOptions = {
    myProgram: context.myProgram,
    programs: context.programs,
  };

  const scopedGuides = guidesResult.ok
    ? applyGuides(
        guidesResult.data,
        { ...params, category: null, q: "" },
        filterOptions,
      )
    : [];
  const guides = guidesResult.ok
    ? applyGuides(guidesResult.data, params, filterOptions)
    : [];
  const counts = countByCategory(scopedGuides);

  const isFiltered =
    params.category !== null || params.q !== "" || params.scope !== "major";
  const retryHref = `/knowledge${buildKnowledgeQuery(params)}`;
  const bookmarkedSet = new Set(context.bookmarkedGuideIds);
  const isUsingSampleData = guidesResult.source !== "supabase";

  const selectedProgram =
    params.scope === "all"
      ? "General"
      : params.scope === "major"
        ? context.myProgram.shortName
        : (context.programs.find((p) => p.id === params.scope)?.shortName ??
          "Program");

  return (
    <main className="flex w-full flex-col gap-6">
      <PageHeader
        title="Knowledge Hub"
        description="Official campus guides and regulations, with verified sources kept in view."
      />

      <form
        action="/knowledge"
        role="search"
        className="flex flex-col gap-3 sm:flex-row"
      >
        <SearchBar
          name="q"
          defaultValue={params.q}
          maxLength={100}
          label="Search campus guides"
          placeholder="Search by topic (e.g. KRS, Lab Jaringan, Magang, GMC)"
        />
        {params.category ? (
          <input type="hidden" name="category" value={params.category} />
        ) : null}
        <input type="hidden" name="scope" value={params.scope} />
        <Button type="submit" size="lg" className="shrink-0">
          Search
        </Button>
      </form>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start lg:gap-10">
        {/* Main reading column */}
        <div className="flex min-w-0 flex-col gap-6">
          <section aria-labelledby="guides-heading" className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="guides-heading" className="text-h2 text-brand-950">
                Curated guides
              </h2>
              <div className="flex items-center gap-3">
                <p className="text-caption tabular-nums text-brand-800">
                  {guides.length} {guides.length === 1 ? "guide" : "guides"}
                </p>
                <a
                  href="#knowledge-filters"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-brand-400 bg-paper-raised px-3 text-caption font-medium text-brand-900 lg:hidden"
                >
                  <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                  <span>
                    {selectedProgram}
                    {params.category ? ` · ${categoryName(params.category)}` : ""}
                  </span>
                </a>
              </div>
            </div>

            {!guidesResult.ok ? (
              <div className="flex flex-col items-start gap-3">
                <Alert variant="error" title="Unable to load guides">
                  {guidesResult.message} Check your connection and try again.
                </Alert>
                <ButtonLink href={retryHref} variant="outline" size="sm">
                  Try again
                </ButtonLink>
              </div>
            ) : guides.length === 0 ? (
              <div className="flex flex-col items-start gap-3 border-y border-brand-300 py-8">
                <h3 className="text-h3 text-brand-950">
                  {isFiltered ? "No guides match these filters" : "No guides yet"}
                </h3>
                <p className="text-body text-pretty max-w-md text-brand-800">
                  {isFiltered
                    ? "Try different keywords, another category, or switch to General guides."
                    : "Curated guides for this program will appear once verified by curators."}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  {isFiltered ? (
                    <Link
                      href="/knowledge"
                      className="text-h5 inline-flex min-h-11 items-center text-brand-700 underline underline-offset-4"
                    >
                      Clear search and filters
                    </Link>
                  ) : null}
                  <RequestGuideModal />
                </div>
              </div>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2" aria-label="Guides">
                {guides.map((guide) => (
                  <li key={guide.id}>
                    <GuideListCard
                      guide={guide}
                      programs={context.programs}
                      initialBookmarked={bookmarkedSet.has(guide.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="text-caption text-pretty border-t border-brand-300 pt-4 text-brand-800">
            {isUsingSampleData
              ? `Showing sample Knowledge Hub data for ${context.campusName}. Always confirm official deadlines on Simaster or with your academic office.`
              : `Connected to ${context.campusName}. Always confirm official deadlines on Simaster or with your academic office.`}
          </p>
        </div>

        {/* Sticky borderless Split-Rail filter column */}
        <aside
          id="knowledge-filters"
          aria-label="Filters"
          className="flex scroll-mt-6 flex-col gap-6 border-t border-brand-300 pt-6 lg:sticky lg:top-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6"
        >
          <SmartScopeSwitcher
            params={params}
            campusName={context.campusName}
            myProgram={context.myProgram}
            programs={context.programs}
          />

          <CategoryFilter params={params} counts={counts} />

          <div className="flex flex-col gap-1 border-t border-brand-300 pt-4">
            <p className="text-caption text-brand-800">Missing a campus rule?</p>
            <RequestGuideModal />
          </div>
        </aside>
      </div>
    </main>
  );
}
