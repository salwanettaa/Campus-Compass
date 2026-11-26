import type { Metadata } from "next";
import Link from "next/link";
import { CategoryFilter } from "@/components/knowledge/category-filter";
import { ContributeUnlockCard } from "@/components/knowledge/contribute-unlock-card";
import { ExperienceCard } from "@/components/knowledge/experience-card";
import { GuideListCard } from "@/components/knowledge/guide-list-card";
import { PillarSwitch } from "@/components/knowledge/pillar-switch";
import { RequestGuideModal } from "@/components/knowledge/request-guide-modal";
import { SmartScopeSwitcher } from "@/components/knowledge/smart-scope-switcher";
import { Alert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import {
  listExperiences,
  listGuides,
  parseSimulation,
} from "@/lib/knowledge/data";
import {
  applyExperiences,
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
  // Default dashboard view to the student's pilot program + general campus guides.
  const params = {
    ...parsed,
    scope: parsed.scope ?? "major",
  };
  const simulation = parseSimulation(
    Array.isArray(raw.mock) ? raw.mock[0] : raw.mock,
  );

  const [guidesResult, experiencesResult] = await Promise.all([
    listGuides(simulation),
    listExperiences(simulation),
  ]);

  const scopedGuides = guidesResult.ok
    ? applyGuides(guidesResult.data, { ...params, category: null, q: "" })
    : [];
  const guides = guidesResult.ok ? applyGuides(guidesResult.data, params) : [];
  const experiences = experiencesResult.ok
    ? applyExperiences(experiencesResult.data, params)
    : [];
  const counts = countByCategory(scopedGuides);

  const isFiltered =
    params.category !== null || params.q !== "" || params.scope !== "major";
  const retryHref = `/knowledge${buildKnowledgeQuery(params)}`;
  const currentPillar = params.pillar ?? "guides";

  return (
    <main className="flex max-w-5xl flex-col gap-8">
      <PageHeader
        title="Knowledge Hub"
        description="Campus guides and senior experiences, with verified sources kept in view."
      >
        <div className="flex flex-wrap items-center gap-2">
          <RequestGuideModal />
          <ButtonLink href="/knowledge/share-experience" variant="outline">
            Share your experience
          </ButtonLink>
        </div>
      </PageHeader>

      <SmartScopeSwitcher
        params={params}
        campusName="Universitas Gadjah Mada"
      />

      <div className="flex flex-col gap-4">
        <form
          action="/knowledge"
          role="search"
          className="flex flex-col gap-3 sm:flex-row"
        >
          <SearchBar
            name="q"
            defaultValue={params.q}
            maxLength={100}
            label="Search guides and experiences"
            placeholder="Search by topic (e.g. KRS, Lab Jaringan, Magang, GMC)"
          />
          {params.category ? (
            <input type="hidden" name="category" value={params.category} />
          ) : null}
          {params.scope && params.scope !== "all" ? (
            <input type="hidden" name="scope" value={params.scope} />
          ) : null}
          {params.pillar && params.pillar !== "guides" ? (
            <input type="hidden" name="pillar" value={params.pillar} />
          ) : null}
          <Button type="submit" size="lg" className="shrink-0">
            Search
          </Button>
        </form>

        {currentPillar === "guides" ? (
          <CategoryFilter params={params} counts={counts} />
        ) : null}
      </div>

      <PillarSwitch
        params={params}
        guidesCount={guides.length}
        experiencesCount={experiences.length}
      />

      {currentPillar === "guides" ? (
        <section aria-labelledby="guides-heading" className="flex flex-col gap-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="guides-heading" className="text-h2 text-brand-950">
              Curated guides
            </h2>
            <p className="text-caption tabular-nums text-brand-800">
              {guides.length} {guides.length === 1 ? "guide" : "guides"}
            </p>
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
                  ? "Try different keywords, another category, or switch the program scope."
                  : "Curated guides for this program will appear once verified by curators."}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
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
                  <GuideListCard guide={guide} />
                </li>
              ))}
            </ul>
          )}

          <ContributeUnlockCard />
        </section>
      ) : (
        <section aria-labelledby="experiences-heading" className="flex flex-col gap-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="experiences-heading" className="text-h2 text-brand-950">
              Senior experiences
            </h2>
            <p className="text-caption tabular-nums text-brand-800">
              {experiences.length}{" "}
              {experiences.length === 1 ? "story" : "stories"}
            </p>
          </div>

          {!experiencesResult.ok ? (
            <div className="flex flex-col items-start gap-3">
              <Alert variant="error" title="Unable to load experiences">
                {experiencesResult.message} Check your connection and try again.
              </Alert>
              <ButtonLink href={retryHref} variant="outline" size="sm">
                Try again
              </ButtonLink>
            </div>
          ) : experiences.length === 0 ? (
            <div className="flex flex-col items-start gap-3 border-y border-brand-300 py-8">
              <h3 className="text-h3 text-brand-950">
                No senior experiences in this view yet
              </h3>
              <p className="text-body text-pretty max-w-md text-brand-800">
                Share how you handled a tough semester or internship to help incoming students.
              </p>
              <ButtonLink href="/knowledge/share-experience" variant="outline">
                Share your experience
              </ButtonLink>
            </div>
          ) : (
            <ul className="flex flex-col gap-5" aria-label="Senior experiences">
              {experiences.map((experience) => (
                <li key={experience.id}>
                  <ExperienceCard experience={experience} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <Alert variant="info">
        Sample pilot guides for Universitas Gadjah Mada (D4 TRI Sekolah Vokasi). Always confirm official deadlines on Simaster or with your academic office.
      </Alert>
    </main>
  );
}
