/**
 * Config-Driven Data Seeding Engine (Extract -> Curate JSON -> Generate SQL).
 *
 * Reads `data/sources.json`, runs registered adapters (currently `wordpress-rest`
 * for UGM D4 TRI, extensible to other programs/campuses via config only),
 * writes sanitized output to `data/curated/guides.json`, and generates the
 * idempotent Supabase SQL seed at `supabase/seed_ugm_vokasi_tri.sql`.
 *
 * Usage:
 *   node scripts/sync-sources.mjs --inspect      # Preview extracted output without writing files
 *   node scripts/sync-sources.mjs                # Fetch sources -> update curated JSON -> generate SQL
 *   node scripts/sync-sources.mjs --from-curated # Regenerate SQL directly from data/curated/guides.json
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const SOURCES_PATH = resolve(process.cwd(), "data/sources.json");
const CURATED_PATH = resolve(process.cwd(), "data/curated/guides.json");
const SQL_OUT_PATH = resolve(process.cwd(), "supabase/seed_ugm_vokasi_tri.sql");

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#038;/gi, "&")
    .replace(/&#8211;/gi, "-")
    .replace(/&#8212;/gi, "--")
    .replace(/&#8216;|&#8217;/gi, "'")
    .replace(/&#8220;|&#8221;/gi, '"')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)));
}

function formatNestedLists(html) {
  const stack = [];
  return html.replace(/<\/?(ul|ol|li)\b[^>]*>/gi, (tag) => {
    const lower = tag.toLowerCase();
    if (lower.startsWith("<ul")) {
      stack.push({ type: "ul", count: 0 });
      return "\n";
    }
    if (lower.startsWith("<ol")) {
      const typeMatch = tag.match(/type=["']([aAiI1])["']/);
      stack.push({ type: "ol", style: typeMatch?.[1] ?? "1", count: 0 });
      return "\n";
    }
    if (lower.startsWith("</ul") || lower.startsWith("</ol")) {
      stack.pop();
      return "\n";
    }
    if (lower.startsWith("<li")) {
      const top = stack[stack.length - 1];
      // Use a temporary sentinel for intentional nested-list indent so raw HTML spaces can be trimmed.
      const indent = "\u0000".repeat(Math.max(0, stack.length - 1) * 2);
      if (!top || top.type === "ul") {
        return `\n${indent}- `;
      }
      top.count += 1;
      const marker =
        top.style === "a"
          ? `${String.fromCharCode(96 + top.count)}.`
          : top.style === "A"
            ? `${String.fromCharCode(64 + top.count)}.`
            : `${top.count}.`;
      return `\n${indent}${marker} `;
    }
    return "\n";
  });
}

function cleanHtml(html, { maxChars = 3200, stopBefore = [] } = {}) {
  let prepared = html
    .replace(/<\?[\s\S]*?\?>/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<img\b[^>]*>/gi, "");

  // Keep label:<br>value on a single readable line before block conversion.
  prepared = prepared.replace(/:\s*<br\s*\/?>\s*/gi, ": ");

  // Convert links to readable plain-text references, removing empty/duplicate UI controls.
  prepared = prepared.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gi,
    (_, attrs, rawInner) => {
      const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
      const href = hrefMatch ? decodeEntities(hrefMatch[1]).trim() : "";
      const inner = decodeEntities(rawInner.replace(/<[^>]+>/g, " "))
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (!inner) return "";
      if (/^(Baca Selengkapnya|View All|More Information|View)$/i.test(inner)) {
        return "";
      }
      if (
        !href ||
        href.startsWith("#") ||
        /^(mailto:|tel:)/i.test(href) ||
        /wa\.me|api\.whatsapp\.com/i.test(href)
      ) {
        return ` ${inner} `;
      }
      if (/docs\.google\.com\/gview/i.test(href)) {
        return "";
      }
      if (/^Download$/i.test(inner)) {
        return ` (${href})\n`;
      }
      // Button-style links (e.g. layanan-akademik flex buttons) sit nicely as bullet lines.
      if (/display:\s*flex|btn/i.test(attrs)) {
        return `\n- ${inner}: ${href}\n`;
      }

      const normHref = href
        .replace(/^https?:\/\//i, "")
        .replace(/\/+$/, "")
        .toLowerCase();
      const normInner = inner
        .replace(/^https?:\/\//i, "")
        .replace(/\/+$/, "")
        .toLowerCase();
      if (normInner === normHref) {
        return ` ${href} `;
      }
      return ` ${inner} (${href}) `;
    },
  );

  // Format section headings and nested lists cleanly.
  prepared = prepared
    .replace(/<h([1-6])\b[^>]*>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n");

  prepared = formatNestedLists(prepared);

  const structured = prepared
    .replace(/<p\b[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/(div|tr|section|article|blockquote)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  let text = decodeEntities(structured)
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "")
    // Strip personal email/phone strings (UU PDP hygiene).
    .replace(
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
      "[official campus email]",
    )
    .replace(/(\+62|08)[0-9\-\s]{8,15}/g, "[official contact]")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\u0000/g, " ")
    // Collapse extra spaces right after list markers (e.g. "-  Label" -> "- Label").
    .replace(/\n([ ]*(?:-|(?:\d+|[a-zA-Z])\.) )[ \t]+/g, "\n$1")
    // Keep consecutive list items compact without blank lines between them.
    .replace(/\n+(?=[ ]*(?:-|(?:\d+|[a-zA-Z])\.) )/g, "\n")
    .replace(/\n[ \t]*[-•]\s*(?=\n|$)/g, "")
    .replace(
      /^\s*(Baca Selengkapnya|View All|Poster|More Information|Our Sponsors|Our Media Partners|Presented By)\s*$/gim,
      "",
    )
    .replace(/\s+\(/g, " (")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  for (const marker of stopBefore) {
    const idx = text.indexOf(marker);
    if (idx !== -1) {
      text = text.slice(0, idx).trim();
    }
  }

  // Clean up any dangling empty list marker caused by stopBefore truncation (e.g. trailing "i.").
  text = text.replace(/\n[ ]*(?:-|(?:\d+|[a-zA-Z])\.)\s*$/, "").trim();

  if (text.length > maxChars) {
    const cut = text.slice(0, maxChars);
    const lastBreak = cut.lastIndexOf("\n");
    text =
      (lastBreak > maxChars * 0.6 ? cut.slice(0, lastBreak) : cut).trim() +
      "\n\n(Selengkapnya tersedia pada tautan sumber resmi.)";
  }

  return text;
}

/** Adapter registry: add new CMS/HTML/PDF adapters here without changing callers. */
const ADAPTERS = {
  "wordpress-rest": async (sourceConfig, previousById) => {
    const types = [...new Set(sourceConfig.entries.map((e) => e.type))];
    const buckets = {};
    await Promise.all(
      types.map(async (type) => {
        const res = await fetch(`${sourceConfig.baseUrl}/${type}?per_page=100`);
        if (!res.ok) {
          throw new Error(
            `Adapter [${sourceConfig.id}] failed fetching ${type}: HTTP ${res.status}`,
          );
        }
        buckets[type] = await res.json();
      }),
    );

    const results = [];
    for (const entry of sourceConfig.entries) {
      const item = buckets[entry.type]?.find((x) => x.slug === entry.slug);
      if (!item) {
        console.warn(
          `[WARN] Missing ${entry.type}/${entry.slug} in ${sourceConfig.id}`,
        );
        continue;
      }

      const title = decodeEntities(
        (entry.titleOverride ?? item.title?.rendered ?? entry.slug)
          .replace(/<[^>]+>/g, "")
          .trim(),
      );
      const content = cleanHtml(item.content?.rendered ?? "", {
        maxChars: entry.maxChars,
        stopBefore: entry.stopBefore,
      });
      const modifiedAt = item.modified_gmt ? `${item.modified_gmt}Z` : null;
      const prev = previousById.get(entry.id);
      const status = !prev
        ? "new"
        : prev.lastVerifiedAt !== modifiedAt
          ? "updated"
          : "unchanged";

      results.push({
        id: entry.id,
        adapterId: sourceConfig.id,
        programCode: sourceConfig.programCode,
        isGeneral: false,
        title,
        category: entry.category,
        content,
        sourceType: "official_campus_source",
        sourceReference: `${sourceConfig.sourceLabel} — ${title}`,
        sourceUrl: item.link,
        lastVerifiedAt: modifiedAt,
        syncStatus: status,
      });
    }
    return results;
  },
};

function sqlEscape(str) {
  return str.replace(/'/g, "''");
}

function resolveProgramExpr(guide) {
  if (guide.isGeneral) return { campus: "NULL", program: "NULL" };
  if (guide.programCode === "TRI") return { campus: "v_ugm", program: "v_tri" };
  if (guide.programCode === "TRPL") return { campus: "v_ugm", program: "v_trpl" };
  if (guide.programCode === "TI") return { campus: "v_ugm", program: "v_ti" };
  return { campus: "v_ugm", program: "NULL" };
}

function buildSqlSeed(guides) {
  const rows = guides
    .map((g) => {
      const scope = resolveProgramExpr(g);
      const verifiedExpr = g.lastVerifiedAt
        ? `'${sqlEscape(g.lastVerifiedAt)}'::timestamptz`
        : "timezone('utc'::text, now())";

      return `    (
        '${g.id}',
        ${scope.campus}, ${scope.program},
        '${sqlEscape(g.title)}',
        '${g.category}', ${g.isGeneral ? "true" : "false"},
        '${sqlEscape(g.content)}',
        '${sqlEscape(g.sourceType)}', '${sqlEscape(g.sourceReference)}', ${
          g.sourceUrl ? `'${sqlEscape(g.sourceUrl)}'` : "NULL"
        },
        true, ${verifiedExpr}
    )`;
    })
    .join(",\n");

  return `-- =============================================================================
-- SEED DATA PILOT UGM & SEKOLAH VOKASI D4 TEKNOLOGI REKAYASA INTERNET (TRI)
-- Generated automatically by scripts/sync-sources.mjs from data/curated/guides.json
-- Jalankan di Supabase SQL Editor SETELAH schema v2 di docs/TECH_AND_DATABASE.md
-- dan patches 01 & 02. Aman dijalankan berulang kali (idempotent).
-- =============================================================================
DO $$
DECLARE
    v_ugm     UUID;
    v_sv      UUID;
    v_ft      UUID;
    v_fmipa   UUID;
    v_feb     UUID;
    v_tri     UUID;
    v_trpl    UUID;
    v_ti      UUID;
BEGIN
    -- 1. Campus: Universitas Gadjah Mada
    INSERT INTO public.campuses (name, slug, domain, is_active)
    VALUES ('Universitas Gadjah Mada', 'ugm', 'ugm.ac.id', true)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

    SELECT id INTO v_ugm FROM public.campuses WHERE slug = 'ugm';

    -- 2. Faculties
    INSERT INTO public.faculties (campus_id, name, code)
    SELECT v_ugm, 'Sekolah Vokasi', 'SV'
    WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE campus_id = v_ugm AND code = 'SV');

    INSERT INTO public.faculties (campus_id, name, code)
    SELECT v_ugm, 'Fakultas Teknik', 'FT'
    WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE campus_id = v_ugm AND code = 'FT');

    INSERT INTO public.faculties (campus_id, name, code)
    SELECT v_ugm, 'Fakultas Matematika dan Ilmu Pengetahuan Alam', 'FMIPA'
    WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE campus_id = v_ugm AND code = 'FMIPA');

    INSERT INTO public.faculties (campus_id, name, code)
    SELECT v_ugm, 'Fakultas Ekonomika dan Bisnis', 'FEB'
    WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE campus_id = v_ugm AND code = 'FEB');

    SELECT id INTO v_sv    FROM public.faculties WHERE campus_id = v_ugm AND code = 'SV';
    SELECT id INTO v_ft    FROM public.faculties WHERE campus_id = v_ugm AND code = 'FT';
    SELECT id INTO v_fmipa FROM public.faculties WHERE campus_id = v_ugm AND code = 'FMIPA';
    SELECT id INTO v_feb   FROM public.faculties WHERE campus_id = v_ugm AND code = 'FEB';

    -- 3. Programs
    INSERT INTO public.programs (campus_id, faculty_id, name, code, degree_level, is_pilot)
    VALUES
        (v_ugm, v_sv,    'D4 Teknologi Rekayasa Internet',         'TRI',   'D4',            true),
        (v_ugm, v_sv,    'D4 Teknologi Rekayasa Perangkat Lunak',  'TRPL',  'D4',            false),
        (v_ugm, v_ft,    'S1 Teknologi Informasi',                 'TI',    'Undergraduate', false),
        (v_ugm, v_fmipa, 'S1 Ilmu Komputer',                       'ILKOM', 'Undergraduate', false),
        (v_ugm, v_feb,   'S1 Manajemen',                           'MN',    'Undergraduate', false)
    ON CONFLICT (campus_id, code) DO UPDATE
    SET name = EXCLUDED.name, faculty_id = EXCLUDED.faculty_id, is_pilot = EXCLUDED.is_pilot;

    SELECT id INTO v_tri  FROM public.programs WHERE campus_id = v_ugm AND code = 'TRI';
    SELECT id INTO v_trpl FROM public.programs WHERE campus_id = v_ugm AND code = 'TRPL';
    SELECT id INTO v_ti   FROM public.programs WHERE campus_id = v_ugm AND code = 'TI';

    -- Remove legacy uncurated IDs from earlier seed iterations if present
    DELETE FROM public.guides
    WHERE id IN (
        '41000000-0000-4000-8000-000000000008',
        '41000000-0000-4000-8000-000000000009',
        '41000000-0000-4000-8000-000000000010',
        '41000000-0000-4000-8000-000000000011'
    );

    -- 4. Guides — Program-specific & General Campus Guides
    INSERT INTO public.guides (
        id, campus_id, program_id, title, category, is_general, content_raw,
        source_type, source_reference, source_url, is_published, last_verified_at
    ) VALUES
${rows}
    ON CONFLICT (id) DO UPDATE
    SET campus_id = EXCLUDED.campus_id,
        program_id = EXCLUDED.program_id,
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        is_general = EXCLUDED.is_general,
        content_raw = EXCLUDED.content_raw,
        source_type = EXCLUDED.source_type,
        source_reference = EXCLUDED.source_reference,
        source_url = EXCLUDED.source_url,
        last_verified_at = EXCLUDED.last_verified_at;

    -- 5. Senior Experiences — Labeled Synthetic Entries for Pilot Demo
    INSERT INTO public.experiences (
        id, campus_id, program_id, author_id, title, semester_context,
        situation, challenge, solution, result, advice_for_juniors, tags
    ) VALUES
    (
        '51000000-0000-4000-8000-000000000001',
        v_ugm, v_tri, NULL,
        '[Synthetic Demo] Persiapan Praktikum Jaringan & Pembagian Waktu Semester 3 D4 TRI', 3,
        'Pada semester 3, beban mata kuliah praktikum jaringan meningkat cukup tajam dengan asistensi dan laporan mingguan.',
        'Kesulitan membagi waktu antara konfigurasi lab, laporan praktikum, dan kegiatan organisasi mahasiswa FORKOMTRI.',
        'Menyelesaikan analisis hasil praktikum langsung di hari yang sama sebelum pulang dan membuat kelompok belajar kecil berisi 3-4 orang.',
        'Tugas lab selesai tepat waktu sebelum tenggat asistensi dan aktivitas organisasi tetap berjalan seimbang.',
        'Jangan menumpuk laporan praktikum hingga malam sebelum asistensi. Aktif berdiskusi di kelompok belajar atau forum mahasiswa sangat membantu.',
        ARRAY['synthetic-example', 'praktikum', 'time-management', 'vokasi-tri']
    ),
    (
        '51000000-0000-4000-8000-000000000002',
        v_ugm, v_tri, NULL,
        '[Synthetic Demo] Menyiapkan Portofolio & Pelatihan Kompetensi Sebelum Magang D4 TRI', 6,
        'Menjelang semester akhir D4 TRI, mahasiswa perlu menyiapkan diri untuk praktik industri dan sertifikasi kompetensi jaringan.',
        'Bingung menentukan proyek portofolio dan sertifikasi yang relevan dengan kebutuhan industri jaringan dan cloud.',
        'Mengikuti informasi pelatihan kompetensi dari website resmi prodi (tri.sv.ugm.ac.id), mendokumentasikan topologi lab, serta berlatih melalui kompetisi jaringan seperti NETCOMP.',
        'Lebih siap menghadapi wawancara teknis magang karena sudah memiliki dokumentasi proyek nyata dan pemahaman standar sertifikasi.',
        'Pantau pengumuman pelatihan kompetensi dan kegiatan lomba di situs resmi Prodi TRI sejak semester 4 atau 5.',
        ARRAY['synthetic-example', 'magang', 'sertifikasi', 'vokasi-tri']
    )
    ON CONFLICT (id) DO NOTHING;

    UPDATE public.experiences
    SET is_verified_contributor = true, helpful_count = 14
    WHERE id = '51000000-0000-4000-8000-000000000001' AND helpful_count = 0;

    UPDATE public.experiences
    SET is_verified_contributor = true, helpful_count = 11
    WHERE id = '51000000-0000-4000-8000-000000000002' AND helpful_count = 0;
END $$;
`;
}

async function main() {
  const inspectMode = process.argv.includes("--inspect");
  const fromCurated = process.argv.includes("--from-curated");

  if (fromCurated) {
    if (!existsSync(CURATED_PATH)) {
      throw new Error(`Missing curated JSON at ${CURATED_PATH}. Run without --from-curated first.`);
    }
    const curated = JSON.parse(readFileSync(CURATED_PATH, "utf8"));
    writeFileSync(SQL_OUT_PATH, buildSqlSeed(curated.guides), "utf8");
    console.log(`Regenerated ${SQL_OUT_PATH} from ${curated.guides.length} curated guides.`);
    return;
  }

  const config = JSON.parse(readFileSync(SOURCES_PATH, "utf8"));
  const previousById = new Map();
  if (existsSync(CURATED_PATH)) {
    const prevDoc = JSON.parse(readFileSync(CURATED_PATH, "utf8"));
    for (const g of prevDoc.guides ?? []) previousById.set(g.id, g);
  }

  const fetchedGuides = [];
  for (const sourceConfig of config.adapters) {
    const adapterFn = ADAPTERS[sourceConfig.adapter];
    if (!adapterFn) {
      throw new Error(`Unsupported adapter: ${sourceConfig.adapter}`);
    }
    const items = await adapterFn(sourceConfig, previousById);
    fetchedGuides.push(...items);
  }

  const manualGuides = (config.curatedEntries ?? []).map((entry) => ({
    id: entry.id,
    adapterId: "manual-config",
    programCode: entry.programCode,
    isGeneral: Boolean(entry.isGeneral),
    title: entry.title,
    category: entry.category,
    content: entry.content,
    sourceType: entry.sourceType,
    sourceReference: entry.sourceReference,
    sourceUrl: entry.sourceUrl,
    lastVerifiedAt: null,
    syncStatus: "manual",
  }));

  const allGuides = [...fetchedGuides, ...manualGuides];

  if (inspectMode) {
    for (const g of allGuides) {
      console.log(
        `\n[${g.syncStatus.toUpperCase()}] [${g.category}] (${g.isGeneral ? "General" : g.programCode}) ${g.title}`,
      );
      console.log(`Source: ${g.sourceUrl ?? g.sourceReference}`);
    }
    console.log(`\nTotal guides: ${allGuides.length}`);
    return;
  }

  mkdirSync(dirname(CURATED_PATH), { recursive: true });
  writeFileSync(
    CURATED_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        campus: config.campus,
        totalGuides: allGuides.length,
        guides: allGuides.map((guide) => {
          const clean = { ...guide };
          delete clean.syncStatus;
          return clean;
        }),
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  writeFileSync(SQL_OUT_PATH, buildSqlSeed(allGuides), "utf8");
  console.log(`Saved ${allGuides.length} curated guides -> ${CURATED_PATH}`);
  console.log(`Generated idempotent SQL -> ${SQL_OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
