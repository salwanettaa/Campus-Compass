# Data Seeding & Ingestion Architecture Guide

> **Owner**: Netta (Backend, Database & Knowledge Hub Lead)  
> **Scope**: Pilot **Universitas Gadjah Mada (UGM)** — **Sekolah Vokasi D4 Teknologi Rekayasa Internet (TRI)**  
> **Related Docs**: [`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md) · [`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md) · [`AGENTS.md`](../AGENTS.md)

Dokumen ini menjelaskan standar teknis dan aturan kurasi **Data Seeding** pada Campus Compass agar pengisian basis data awal bersifat *scalable*, bersih, aman terhadap privasi (UU PDP), dan mudah dirawat ketika informasi kampus berubah.

---

## 1. Arsitektur: *Config-Driven ETL + Idempotent Seeding*

Alih-alih membuat satu script terpisah untuk setiap jurusan atau kampus, repositori ini memisahkan **konfigurasi sumber (`data/sources.json`)**, **satu mesin universal (`scripts/sync-sources.mjs`)**, **dataset terkurasi (`data/curated/guides.json`)**, dan **output SQL (`supabase/seed_ugm_vokasi_tri.sql`)**:

```text
  Public Official Web (tri.sv.ugm.ac.id/wp-json/wp/v2)
                         │
                         ▼  [1. Config] data/sources.json
  Universal Engine: scripts/sync-sources.mjs
    ├─ Adapter Dispatch (wordpress-rest, extensible to html/pdf)
    ├─ HTML Cleanup & Markdown Serializer (##, **, nested lists, [Label](url))
    └─ UU PDP Hygiene (Redaksi email/no HP & blokir wa.me pribadi)
                         │
                         ▼  [2. Transform] data/curated/guides.json
  Human-Readable Curated JSON (Markdown terstruktur, mudah di-review PR)
                         │
                         ▼  [3. Load] supabase/seed_ugm_vokasi_tri.sql
  Supabase PostgreSQL (ON CONFLICT DO UPDATE / Idempotent)
                         │
                         ├─▶ [UI Renderer] GuideContent + stripMarkdownForExcerpt()
                         └─▶ [Phase 2 - AI RAG] public.content_chunks (768d)
```

### Mengapa Pola Ini Dipilih?
1. **Satu Script untuk Banyak Prodi/Kampus**: Menambah prodi baru (misalnya `D4 TRPL` atau `S1 TI`) cukup menambahkan blok konfigurasi di [`data/sources.json`](../data/sources.json) tanpa menyalin-tempel kode script.
2. **Kurasi Sebelum Masuk Database**: Hasil ekstraksi web publik tidak pernah langsung dibuang mentah ke produksi. Dataset perantara (`data/curated/guides.json`) memudahkan tim membaca dan merapikan teks sebelum SQL dihasilkan.
3. **Idempotent Load**: Script SQL memakai `ON CONFLICT (id) DO UPDATE`, sehingga aman dijalankan ulang berkali-kali di Supabase SQL Editor tanpa menyebabkan duplikasi baris.

---

## 2. Daftar File & Perannya

| File | Fungsi |
| :--- | :--- |
| [`data/sources.json`](../data/sources.json) | Registry sumber resmi (adapter, `baseUrl`, daftar `slug`, mapping `category`, aturan potong `stopBefore`, serta entri terkurasi manual & `[Sample]`). |
| [`scripts/sync-sources.mjs`](../scripts/sync-sources.mjs) | Mesin ETL tunggal: mengambil data dari adapter, membersihkan HTML/noise ke **Markdown terstruktur** (heading `##`/`###`, `**bold**`, nested list, `[Label](url)`), melacak status perubahan, menulis JSON terkurasi, dan membangun file SQL. |
| [`data/curated/guides.json`](../data/curated/guides.json) | Snapshot data panduan bersih dalam format JSON terstruktur (`content` berupa Markdown). |
| [`supabase/seed_ugm_vokasi_tri.sql`](../supabase/seed_ugm_vokasi_tri.sql) | Script SQL siap eksekusi untuk Supabase (`campuses`, `faculties`, `programs`, `guides`, dan `experiences` berlabel). |
| [`src/lib/knowledge/format.ts`](../src/lib/knowledge/format.ts) & [`GuideContent`](../src/components/knowledge/guide-content.tsx) | Parser & komponen renderer Markdown UI (heading, nested `<ol>`/`<ul>`, `<strong>`, link eksternal aman `http(s)` saja, dan pembersih excerpt pada [`GuideListCard`](../src/components/knowledge/guide-list-card.tsx)). |

---

## 3. Cara Menjalankan Pipeline

Semua perintah dijalankan dari root repositori (membutuhkan Node.js `>= 20.9.0`, tanpa dependensi tambahan):

```bash
# 1. Preview hasil ekstraksi & status perubahan tanpa menulis file
node scripts/sync-sources.mjs --inspect

# 2. Ambil sumber terbaru -> perbarui data/curated/guides.json -> generate SQL
node scripts/sync-sources.mjs

# 3. Regenerasi SQL langsung dari JSON jika kamu mengedit teks manual di data/curated/guides.json
node scripts/sync-sources.mjs --from-curated
```

Setelah [`supabase/seed_ugm_vokasi_tri.sql`](../supabase/seed_ugm_vokasi_tri.sql) ter-update, jalankan isinya di **Supabase SQL Editor** (setelah Schema V2 serta Patch `01` dan `02` terpasang).

---

## 4. Cara Menambah Prodi atau Kampus Baru (Ekspansi Masa Depan)

Untuk menambahkan sumber prodi lain (misal prodi dengan website WordPress serupa):
1. Pastikan kode prodi sudah terdaftar di tabel `public.programs` (dan `resolveProgramExpr()` di `scripts/sync-sources.mjs`).
2. Tambahkan objek adapter baru di array `adapters` pada [`data/sources.json`](../data/sources.json):
   - Set `"adapter": "wordpress-rest"`, `"programCode"`, `"baseUrl"`, dan daftar `entries` (pilih **hanya halaman panduan mahasiswa**, bukan berita umum atau halaman tombol kosong).
3. Jika sumber non-WordPress (misal halaman HTML statis), tambahkan fungsi adapter baru di objek `ADAPTERS` pada [`scripts/sync-sources.mjs`](../scripts/sync-sources.mjs) tanpa mengubah alur JSON/SQL-nya.
4. Jalankan `node scripts/sync-sources.mjs --inspect` untuk memverifikasi kebersihan teks sebelum commit.

---

## 5. Strategi Pembaruan Konten & Deteksi Data Usang

1. **Sinkronisasi Otomatis Berbasis Timestamp (`modified_gmt`)**:
   - Adapter `wordpress-rest` menyimpan `modified_gmt` sumber resmi sebagai `lastVerifiedAt` di `data/curated/guides.json` dan kolom `guides.last_verified_at` di Supabase.
   - Saat `scripts/sync-sources.mjs` dijalankan ulang secara berkala (manual atau via GitHub Actions terjadwal), script otomatis mendeteksi item dengan status `updated` dan memperbarui SQL seed.
2. **Peringatan Otomatis di UI (`STALE_AFTER_DAYS = 180`)**:
   - Sesuai `src/lib/knowledge/filter.ts`, setiap panduan yang `last_verified_at`-nya lebih dari **180 hari** otomatis menampilkan label **`May be outdated`** di antarmuka Knowledge Hub agar mahasiswa selalu waspada.
3. **Kurasi Manual (`curator` / `admin`)**:
   - Untuk perubahan kebijakan mendadak di luar website (misal surat edaran PDF atau pengumuman DPA), peran `curator` atau `admin` memperbarui panduan langsung melalui panel database/admin.

---

## 6. Standar Format Konten (Markdown) & Aturan Kurasi (UU PDP)

1. **Format Konten (`guides.content_raw` = Markdown Terstruktur)**:
   - Jangan pernah menyimpan HTML mentah dari website kampus (berisiko XSS dan merusak tata letak CSS) maupun teks polos tanpa struktur.
   - `scripts/sync-sources.mjs` menserialisasi isi web ke **Markdown ringkas**:
     - Subjudul utama `##` dan subbagian `###` (heading pembuka yang hanya mengulang judul panduan dibuang otomatis).
     - Penekanan penting memakai `**bold**`, dan nested list memakai `1.`, `a.`, serta indentasi 2 spasi (`  - `) untuk sub-poin.
     - Tautan dokumen/formulir ditulis sebagai `[Label Dokumen](https://...)` agar URL panjang tidak mengganggu keterbacaan.
   - Di frontend, halaman detail [`knowledge/[id]`](../src/app/%28dashboard%29/knowledge/%5Bid%5D/page.tsx) me-render Markdown lewat `<GuideContent />` (lebar penuh kartu, validasi URL `http:`/`https:` via `safeHttpUrl()`), dan kartu ringkasan memakai `stripMarkdownForExcerpt()`.
2. **Selektif (*Quality over Quantity*)**: Hanya masukkan dokumen atau direktori layanan yang membantu adaptasi/administrasi mahasiswa (misal: kebijakan magang, keringanan UKT, yudisium, wisuda, himpunan/kompetisi, direktori layanan lab). Jangan memasukkan berita kegiatan seremonial lepas atau halaman kosong tanpa informasi/tautan bermanfaat.
3. **Wajib Atribusi Sumber**: Setiap panduan resmi harus menyimpan `source_type = 'official_campus_source'`, `source_reference`, dan `source_url` valid (`http://` / `https://`) menuju halaman sumber aslinya.
4. **Kepatuhan Tenant Scope (`chk_guide_scope`)**:
   - Panduan umum lintas jurusan (`is_general = true`) **wajib** memiliki `campus_id = NULL` sesuai constraint `chk_guide_scope` pada [`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md).
   - Panduan spesifik jurusan (`is_general = false`) **wajib** mengisi `campus_id` dan `program_id`.
5. **Sanitasi Data Pribadi (UU PDP)**: Engine otomatis menyensor pola email dan nomor telepon pribadi (`[official campus email]`, `[official contact]`), memblokir link WhatsApp pribadi (`wa.me`), dan melarang pengumpulan NIM/nama lengkap asli mahasiswa.
6. **Transparansi Data Sintetis**: Entri yang bukan berasal dari dokumen resmi atau wawancara terverifikasi (misal contoh perbandingan prodi lain atau contoh awal *senior experiences*) **wajib** diberi penanda eksplisit (`[Sample]` / `[Synthetic Demo]`).
