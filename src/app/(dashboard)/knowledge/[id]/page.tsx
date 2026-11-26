import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bot, ExternalLink } from "lucide-react";
import { GuideCardActions } from "@/components/knowledge/guide-card-actions";
import { VerifiedMeta } from "@/components/knowledge/verified-meta";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { categoryName } from "@/lib/knowledge/categories";
import { getGuide, parseSimulation } from "@/lib/knowledge/data";
import { PILOT_PROGRAM } from "@/lib/knowledge/types";

export const metadata: Metadata = { title: "Guide Detail | Campus Compass" };

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
        <Alert variant="error" title="Gagal memuat panduan">
          {result.message} Silakan coba lagi.
        </Alert>
        <ButtonLink href={`/knowledge/${id}`} variant="outline" size="sm">
          Coba lagi
        </ButtonLink>
      </main>
    );
  }
  if (!result.data) notFound();

  const guide = result.data;
  const sourceUrl = safeUrl(guide.source_url);
  const scopeLabel = guide.is_general
    ? "🌐 Semua UGM (General)"
    : guide.program_id === PILOT_PROGRAM.id
      ? `🎯 ${PILOT_PROGRAM.name} (${PILOT_PROGRAM.faculty})`
      : "📚 Program Khusus";

  const aiQuery = encodeURIComponent(
    `Bantu jelaskan panduan resmi "${guide.title}" secara lengkap beserta tahapan penting yang wajib diperhatikan mahasiswa.`,
  );

  return (
    <main className="flex max-w-4xl flex-col gap-6 pb-12">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/knowledge"
          className="text-h5 inline-flex w-fit items-center gap-2 rounded-md text-brand-800 hover:underline focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Kembali ke Knowledge Hub</span>
        </Link>
      </div>

      <article className="flex flex-col gap-6 rounded-3xl border border-brand-300 bg-paper-raised p-6 sm:p-9 shadow-xs">
        <div className="flex flex-col gap-3 border-b border-brand-200 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-caption font-bold text-brand-700">
              {categoryName(guide.category)}
            </span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-card-tint border border-brand-200 text-brand-900 font-semibold">
              {scopeLabel}
            </span>
          </div>

          <h1 className="text-h1 text-balance break-words text-brand-950 font-semibold leading-tight">
            {guide.title}
          </h1>

          <div className="pt-1">
            <VerifiedMeta guide={guide} />
          </div>
        </div>

        {/* Content Body */}
        <div className="text-body text-pretty whitespace-pre-line text-brand-950 leading-relaxed max-w-3xl space-y-4">
          {guide.content_raw}
        </div>

        {/* Official Source Reference Card */}
        {guide.source_reference || sourceUrl ? (
          <div className="flex max-w-2xl flex-col gap-2 rounded-2xl border border-brand-300 bg-card-tint p-5">
            <h2 className="text-h5 font-semibold text-brand-950">
              Rujukan Sumber Resmi
            </h2>
            {guide.source_reference ? (
              <p className="text-body text-brand-900 font-medium">
                {guide.source_reference}
              </p>
            ) : null}
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption font-semibold inline-flex w-fit items-center gap-1.5 text-brand-800 underline underline-offset-4 hover:text-brand-950 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
              >
                <span>Buka Tautan Resmi</span>
                <ExternalLink className="size-3.5" aria-hidden="true" />
                <span className="sr-only">(buka di tab baru)</span>
              </a>
            ) : null}
          </div>
        ) : null}

        {/* AI Navigator Bridge Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-brand-300 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
              <Bot className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-h5 font-semibold text-brand-950">
                Punya pertanyaan tentang panduan ini?
              </h3>
              <p className="text-caption text-brand-800">
                AI Navigator dapat menjawab pertanyaanmu dengan dasar rujukan dokumen resmi ini.
              </p>
            </div>
          </div>
          <ButtonLink
            href={`/ai-navigator?q=${aiQuery}`}
            variant="outline"
            className="inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Tanya AI Navigator</span>
          </ButtonLink>
        </div>

        <GuideCardActions guideId={guide.id} guideTitle={guide.title} />

        <Alert variant="info">
          Panduan ini dikurasi langsung dari dokumen dan regulasi kampus resmi. Selalu periksa kembali pengumuman terkini pada kalender akademik atau portal Simaster.
        </Alert>
      </article>
    </main>
  );
}
