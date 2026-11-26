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

export const metadata: Metadata = {
  title: "Knowledge Hub | Campus Compass",
  description: "Pusat panduan resmi kampus terkurasi dan pengalaman adaptasi mahasiswa dengan rujukan terpercaya.",
};

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
  const experiences = experiencesResult.ok
    ? applyExperiences(experiencesResult.data, params)
    : [];

  const counts = guidesResult.ok
    ? countByCategory(guidesResult.data)
    : countByCategory([]);

  const isFiltered =
    params.category !== null ||
    params.q !== "" ||
    (params.scope && params.scope !== "major");
  const retryHref = `/knowledge${buildKnowledgeQuery(params)}`;
  const currentPillar = params.pillar ?? "guides";

  return (
    <main className="flex max-w-5xl flex-col gap-7 pb-12">
      {/* Header with Title and Primary Actions */}
      <PageHeader
        title="Knowledge Hub"
        description="Panduan kurasi kampus resmi & dokumentasi pengalaman adaptasi senior terverifikasi."
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <RequestGuideModal />
          <ButtonLink href="/knowledge/share-experience" variant="outline">
            Bagikan Pengalaman
          </ButtonLink>
        </div>
      </PageHeader>

      {/* Smart Scope Switcher (UGM General vs D4 TRI Pilot vs Jelajahi Jurusan Lain) */}
      <SmartScopeSwitcher
        params={params}
        campusName="Universitas Gadjah Mada (UGM)"
      />

      {/* Search & Category Filter Section */}
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
            label="Cari panduan kampus"
            placeholder="Cari topik panduan (misal: KRS, Lab Jaringan, Magang, GMC, Wi-Fi)..."
          />
          {params.category ? (
            <input type="hidden" name="category" value={params.category} />
          ) : null}
          {params.scope ? (
            <input type="hidden" name="scope" value={params.scope} />
          ) : null}
          {params.pillar ? (
            <input type="hidden" name="pillar" value={params.pillar} />
          ) : null}
          <Button type="submit" size="lg" className="shrink-0">
            Cari
          </Button>
        </form>

        {/* 6 Category Tiles */}
        <CategoryFilter params={params} counts={counts} />
      </div>

      {/* Pillar Switcher: Panduan Terkurasi vs Pengalaman Senior */}
      <PillarSwitch
        params={params}
        guidesCount={guides.length}
        experiencesCount={experiences.length}
      />

      {/* PILLAR 1: Official & Curated Guides */}
      {currentPillar === "guides" ? (
        <section aria-labelledby="guides-heading" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 id="guides-heading" className="text-h2 text-brand-950 font-semibold">
              Panduan Terkurasi
            </h2>
            <span className="text-caption text-brand-800">
              Menampilkan {guides.length} panduan
            </span>
          </div>

          {!guidesResult.ok ? (
            <div className="flex flex-col items-start gap-3 pt-4">
              <Alert variant="error" title="Gagal memuat panduan">
                {guidesResult.message} Silakan coba lagi.
              </Alert>
              <ButtonLink href={retryHref} variant="outline" size="sm">
                Coba lagi
              </ButtonLink>
            </div>
          ) : guides.length === 0 ? (
            <div className="flex flex-col items-start gap-3 py-10 rounded-2xl border border-brand-200 bg-paper-raised p-8 text-center sm:text-left">
              <h3 className="text-h3 text-brand-950 font-semibold">
                {isFiltered ? "Tidak ada panduan yang cocok" : "Belum ada panduan"}
              </h3>
              <p className="text-body max-w-md text-brand-800">
                {isFiltered
                  ? "Coba gunakan kata kunci lain, pilih kategori berbeda, atau ganti filter lingkup jurusan."
                  : "Panduan terkurasi akan muncul di sini setelah diverifikasi oleh admin."}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {isFiltered ? (
                  <Link
                    href="/knowledge"
                    className="text-h5 inline-flex min-h-11 items-center text-brand-700 underline underline-offset-4 font-medium"
                  >
                    Reset semua pencarian & filter
                  </Link>
                ) : null}
                <RequestGuideModal />
              </div>
            </div>
          ) : (
            <ul
              className="grid gap-5 md:grid-cols-2"
              aria-label="Daftar Panduan"
            >
              {guides.map((guide) => (
                <li key={guide.id}>
                  <GuideListCard guide={guide} />
                </li>
              ))}
            </ul>
          )}

          {/* Contribute to Unlock Banner */}
          <div className="pt-4">
            <ContributeUnlockCard />
          </div>
        </section>
      ) : (
        /* PILLAR 2: Senior Experiences (STAR) */
        <section aria-labelledby="experiences-heading" className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="experiences-heading" className="text-h2 text-brand-950 font-semibold">
                Pengalaman Senior (STAR)
              </h2>
              <p className="text-caption text-brand-800">
                Cerita adaptasi riil kakak tingkat dengan format Situation, Challenge, Solution, Result, & Advice.
              </p>
            </div>
            <ButtonLink
              href="/knowledge/share-experience"
              variant="outline"
              size="sm"
              className="shrink-0 hidden sm:inline-flex"
            >
              Tulis Cerita
            </ButtonLink>
          </div>

          {!experiencesResult.ok ? (
            <div className="flex flex-col items-start gap-3">
              <Alert variant="error" title="Gagal memuat pengalaman senior">
                {experiencesResult.message} Silakan coba lagi.
              </Alert>
              <ButtonLink href={retryHref} variant="outline" size="sm">
                Coba lagi
              </ButtonLink>
            </div>
          ) : experiences.length === 0 ? (
            <div className="flex flex-col items-start gap-3 py-10 rounded-2xl border border-brand-200 bg-paper-raised p-8">
              <h3 className="text-h3 text-brand-950 font-semibold">
                Belum ada pengalaman untuk lingkup ini
              </h3>
              <p className="text-body max-w-md text-brand-800">
                Jadilah yang pertama membagikan cerita dan tips adaptasimu untuk membantu mahasiswa baru!
              </p>
              <ButtonLink href="/knowledge/share-experience" variant="primary">
                Bagikan Pengalaman Pertama
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

      {/* Grounding and Disclaimer footer */}
      <Alert variant="info">
        Seluruh panduan di Knowledge Hub diverifikasi secara berkala berdasarkan rujukan resmi universitas dan fakultas. Selalu konfirmasikan jadwal dan prosedur spesifik ke Simaster atau bagian akademik terkait.
      </Alert>
    </main>
  );
}
