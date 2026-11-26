/**
 * Fetches official public student guides from Prodi D4 Teknologi Rekayasa Internet
 * (https://tri.sv.ugm.ac.id) via its public WordPress REST API, sanitizes HTML
 * and personal contact info, and generates an idempotent Supabase SQL seed file:
 *   supabase/seed_ugm_vokasi_tri.sql
 *
 * Usage:
 *   node scripts/sync-tri-ugm-seed.mjs --inspect   # Preview extracted guides
 *   node scripts/sync-tri-ugm-seed.mjs             # Write supabase/seed_ugm_vokasi_tri.sql
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const WP_BASE = "https://tri.sv.ugm.ac.id/wp-json/wp/v2";

/** Curated mapping from public tri.sv.ugm.ac.id pages/posts -> Knowledge Hub categories. */
const CURATED_SOURCES = [
  {
    type: "pages",
    slug: "akademik",
    id: "41000000-0000-4000-8000-000000000001",
    category: "academic_survival",
    titleOverride: "Layanan & Panduan Akademik Prodi D4 TRI SV UGM",
  },
  {
    type: "pages",
    slug: "rekognisi-pembelajaran-lampau-rpl",
    id: "41000000-0000-4000-8000-000000000002",
    category: "academic_survival",
  },
  {
    type: "pages",
    slug: "penyesuaian-ukt",
    id: "41000000-0000-4000-8000-000000000003",
    category: "administrative_guide",
    titleOverride: "Pengajuan Keringanan & Penyesuaian UKT Sarjana Terapan TRI",
  },
  {
    type: "pages",
    slug: "layanan-akademik",
    id: "41000000-0000-4000-8000-000000000004",
    category: "administrative_guide",
    titleOverride: "Portal Layanan Administrasi Akademik Mahasiswa D4 TRI",
  },
  {
    type: "pages",
    slug: "ketentuan-wisuda",
    id: "41000000-0000-4000-8000-000000000005",
    category: "administrative_guide",
  },
  {
    type: "pages",
    slug: "dokumen-yudisium",
    id: "41000000-0000-4000-8000-000000000006",
    category: "administrative_guide",
    titleOverride: "Persyaratan & Kelengkapan Dokumen Yudisium D4 TRI SV UGM",
  },
  {
    type: "pages",
    slug: "forkomtri",
    id: "41000000-0000-4000-8000-000000000007",
    category: "social_community",
    titleOverride: "FORKOMTRI — Forum Komunikasi Mahasiswa Teknologi Rekayasa Internet",
  },
  {
    type: "pages",
    slug: "hearing",
    id: "41000000-0000-4000-8000-000000000008",
    category: "social_community",
  },
  {
    type: "pages",
    slug: "netcompugm",
    id: "41000000-0000-4000-8000-000000000009",
    category: "scholarship_growth",
    titleOverride: "National Networking Competition (NETCOMP) — Ajang Kompetisi D4 TRI",
  },
  {
    type: "posts",
    slug: "periotect-pimnas",
    id: "41000000-0000-4000-8000-000000000010",
    category: "scholarship_growth",
  },
  {
    type: "posts",
    slug: "isc-2026",
    id: "41000000-0000-4000-8000-000000000011",
    category: "career_preparation",
  },
];

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

function cleanHtml(html) {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  const structured = withoutNoise
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(p|div|h[1-6]|tr|li|ul|ol|section|article)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  const decoded = decodeEntities(structured)
    .replace(/\r/g, "")
    // Remove accidental email/phone strings to align with UU PDP hygiene.
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[official campus email]")
    .replace(/(\+62|08)[0-9\-\s]{8,15}/g, "[official contact]")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    // Drop empty bullet markers and button labels left by page-builder HTML
    .replace(/^\s*-\s*$/gm, "")
    .replace(/^\s*Baca Selengkapnya\s*$/gim, "")
    .replace(/-\s*\n+\s*/g, "- ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Cap overly long reference pages cleanly at paragraph boundaries (~2,500 chars)
  if (decoded.length <= 2500) return decoded;
  const truncated = decoded.slice(0, 2500);
  const lastNewline = truncated.lastIndexOf("\n");
  return (lastNewline > 1500 ? truncated.slice(0, lastNewline) : truncated) +
    "\n\n(Selengkapnya dapat dibaca pada tautan sumber resmi di bawah.)";
}

function sqlEscape(str) {
  return str.replace(/'/g, "''");
}

async function fetchWpItems(type) {
  const res = await fetch(`${WP_BASE}/${type}?per_page=100`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${type}: HTTP ${res.status}`);
  }
  return res.json();
}

async function main() {
  const inspectMode = process.argv.includes("--inspect");
  const [pages, posts] = await Promise.all([
    fetchWpItems("pages"),
    fetchWpItems("posts"),
  ]);

  const byType = { pages, posts };
  const extracted = [];

  for (const spec of CURATED_SOURCES) {
    const item = byType[spec.type].find((entry) => entry.slug === spec.slug);
    if (!item) {
      console.warn(`[WARN] Slug not found: ${spec.type}/${spec.slug}`);
      continue;
    }

    const title = decodeEntities(
      (spec.titleOverride ?? item.title?.rendered ?? spec.slug)
        .replace(/<[^>]+>/g, "")
        .trim(),
    );
    const content = cleanHtml(item.content?.rendered ?? "");
    if (content.length < 60) {
      console.warn(`[SKIP] Content too short (${content.length} chars): ${spec.slug}`);
      continue;
    }

    extracted.push({
      id: spec.id,
      slug: spec.slug,
      title,
      category: spec.category,
      content,
      sourceReference: `Official Prodi D4 TRI SV UGM — ${title}`,
      sourceUrl: item.link,
      modified: item.modified_gmt ? `${item.modified_gmt}Z` : null,
    });
  }

  if (inspectMode) {
    for (const g of extracted) {
      console.log(`\n=== [${g.category}] ${g.title} (${g.content.length} chars) ===`);
      console.log(`URL: ${g.sourceUrl}`);
      console.log(g.content.slice(0, 450));
    }
    console.log(`\nTotal extracted: ${extracted.length} guides.`);
    return;
  }

  const sqlRows = extracted
    .map(
      (g) => `    (
        '${g.id}',
        v_ugm, v_tri,
        '${sqlEscape(g.title)}',
        '${g.category}', false,
        '${sqlEscape(g.content)}',
        'official_campus_source', '${sqlEscape(g.sourceReference)}', '${sqlEscape(g.sourceUrl)}',
        true, ${g.modified ? `'${sqlEscape(g.modified)}'::timestamptz` : "timezone('utc'::text, now())"}
    )`,
    )
    .join(",\n");

  const sql = `-- =============================================================================
-- SEED DATA PILOT UGM & SEKOLAH VOKASI D4 TEKNOLOGI REKAYASA INTERNET (TRI)
-- Generated/augmented from public official pages at https://tri.sv.ugm.ac.id/
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

    -- 4. Guides — Real Public Official Content from https://tri.sv.ugm.ac.id/
    INSERT INTO public.guides (
        id, campus_id, program_id, title, category, is_general, content_raw,
        source_type, source_reference, source_url, is_published, last_verified_at
    ) VALUES
${sqlRows},
    -- Mockup guides untuk perbandingan program lain (TRPL & TI)
    (
        '41000000-0000-4000-8000-000000000091',
        v_ugm, v_trpl,
        'Standar Version Control Git & CI/CD Praktikum TRPL SV UGM [Sample]',
        'academic_survival', false,
        'Panduan contoh untuk eksplorasi prodi lain: mahasiswa D4 TRPL mengikuti konvensi commit terstruktur dan workflow Git pada mata kuliah proyek perangkat lunak.',
        'curated_guide', 'Sample Program Exploration Entry (TRPL)', NULL,
        true, timezone('utc'::text, now()) - interval '30 days'
    ),
    (
        '41000000-0000-4000-8000-000000000092',
        v_ugm, v_ti,
        'Panduan Jalur Minat Riset AI & Sistem Cerdas FT UGM [Sample]',
        'academic_survival', false,
        'Panduan contoh untuk eksplorasi prodi lain: informasi pemilihan peminatan AI dan Sistem Cerdas dibuka pada pertengahan masa studi sarjana.',
        'curated_guide', 'Sample Program Exploration Entry (TI)', NULL,
        true, timezone('utc'::text, now()) - interval '30 days'
    )
    ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        category = EXCLUDED.category,
        content_raw = EXCLUDED.content_raw,
        source_reference = EXCLUDED.source_reference,
        source_url = EXCLUDED.source_url,
        last_verified_at = EXCLUDED.last_verified_at;

    -- 5. Guides — General UGM (is_general = true requires campus_id IS NULL per chk_guide_scope)
    INSERT INTO public.guides (
        id, campus_id, program_id, title, category, is_general, content_raw,
        source_type, source_reference, source_url, is_published, last_verified_at
    ) VALUES
    (
        '42000000-0000-4000-8000-000000000001',
        NULL, NULL,
        'Panduan Lengkap Simaster & Pengisian KRS Tiap Semester',
        'administrative_guide', true,
        E'KRS (Kartu Rencana Studi) wajib diisi seluruh mahasiswa UGM melalui portal Simaster.\n\n1. Cek Status UKT: Pastikan tagihan lunas atau mengantongi surat dispensasi.\n\n2. Batas SKS: Sesuaikan dengan IPK semester sebelumnya.\n\n3. Persetujuan DPA: Hubungi Dosen Pembimbing Akademik setelah submit KRS.',
        'official_campus_source', 'Portal Akademik UGM (Simaster)', 'https://simaster.ugm.ac.id',
        true, timezone('utc'::text, now()) - interval '8 days'
    ),
    (
        '42000000-0000-4000-8000-000000000002',
        NULL, NULL,
        'Layanan Kesehatan Mahasiswa di Gadjah Mada Medical Center (GMC)',
        'campus_essentials', true,
        E'Mahasiswa aktif UGM berhak mengakses layanan kesehatan primer di Gadjah Mada Medical Center (GMC), Jl. Colombo.\n\n1. Layanan: Dokter umum, gigi, konseling psikologi, dan farmasi.\n\n2. Syarat: Tunjukkan KTM fisik atau e-KTM Simaster aktif.\n\n3. Rujukan: Dokter GMC menerbitkan rujukan ke RSA UGM bila diperlukan.',
        'official_campus_source', 'Gadjah Mada Medical Center (GMC) UGM', 'https://gmc.ugm.ac.id',
        true, timezone('utc'::text, now()) - interval '14 days'
    ),
    (
        '42000000-0000-4000-8000-000000000003',
        NULL, NULL,
        'Portal Beasiswa & Kemahasiswaan UGM (Ditmawa)',
        'scholarship_growth', true,
        E'Direktorat Kemahasiswaan (Ditmawa) UGM mengelola pengajuan beasiswa mitra yayasan, korporasi, dan pemerintah melalui portal terpadu.\n\n1. Portal Resmi: Cek pengumuman dan syarat berkas di ditmawa.ugm.ac.id / simaster.\n\n2. Berkas Umum: Transkrip nilai terbaru, surat keterangan aktif, dan esai kontribusi.',
        'official_campus_source', 'Direktorat Kemahasiswaan (Ditmawa) UGM', 'https://ditmawa.ugm.ac.id',
        true, timezone('utc'::text, now()) - interval '18 days'
    ),
    (
        '42000000-0000-4000-8000-000000000004',
        NULL, NULL,
        'Akses Wi-Fi Kampus (UGM-Hotspot) & Jaringan Eduroam',
        'campus_essentials', true,
        E'Akses internet nirkabel tersedia di area gedung kuliah, perpustakaan, dan ruang terbuka kampus UGM.\n\n1. UGM-Hotspot: Login menggunakan akun SSO (@mail.ugm.ac.id).\n\n2. Eduroam: Autentikasi 802.1x EAP menggunakan email UGM lengkap dan kata sandi SSO.',
        'official_campus_source', 'DSSDI Universitas Gadjah Mada', 'https://dssdi.ugm.ac.id',
        true, timezone('utc'::text, now()) - interval '14 days'
    )
    ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        category = EXCLUDED.category,
        content_raw = EXCLUDED.content_raw,
        source_reference = EXCLUDED.source_reference,
        source_url = EXCLUDED.source_url;

    -- 6. Senior Experiences — Labeled Synthetic Entries for Pilot Demo
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

  const outPath = resolve(process.cwd(), "supabase/seed_ugm_vokasi_tri.sql");
  writeFileSync(outPath, sql, "utf8");
  console.log(`Wrote ${extracted.length} official TRI guides + general/sample entries to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
