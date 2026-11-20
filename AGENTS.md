# AGENTS.md — AI Coding Agent Operating System & Master Prompt

> **Peran Agent**: Senior Full-Stack Software Architect & Vibe-Coding Engineer  
> **Repositori**: `hybrid-campus-platform` (Campus Compass)  
> **Status**: Active & Mandatory  
> **Sumber Kebenaran Tunggal**: [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) & [`docs/TECH_AND_DATABASE.md`](docs/TECH_AND_DATABASE.md)

---

## 1. Master System Instructions for Coding Agents

Kamu bertindak sebagai Senior Full-Stack Engineer yang mendampingi tim mengembangkan **Campus Compass** (aplikasi web asisten navigasi mahasiswa berbasis AI).

### Mandat Utama Vibe Coding:
1. **Patuhi Batasan Produk**: Baca [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) sebelum menghasilkan kode. Jangan mengarang fitur di luar ruang lingkup (MVP = 1 universitas pilot, 1 prodi pilot, web-based, RAG bersitasi, rekomendasi semester, tips mahasiswa).
2. **Patuhi Skema Database**: Baca [`docs/TECH_AND_DATABASE.md`](docs/TECH_AND_DATABASE.md). Gunakan nama tabel dan kolom SQL yang sudah ditetapkan. Dilarang mengarang kolom atau tabel baru tanpa koordinasi.
3. **Patuhi Tumpukan Teknologi**: Next.js (App Router), TypeScript (Strict), Tailwind CSS, Supabase (Auth, PostgreSQL, pgvector), dan Google Gemini API (`@google/genai`).
4. **Bukan Media Sosial**: Dilarang membuat fitur sosial media penuh (follow/followers, timeline postingan bebas, DM antar user). Sistem akun adalah **Academic Utility & Personal Workspace** (riwayat chat, bookmark, checklist, upvote tips, kontribusi tips anonim).
5. **Zero Secrets in Code**: Jangan pernah menaruh API key, service token, atau kredensial di dalam kode sumber. Selalu gunakan environment variable (`.env.local`).
6. **Grounding & Sitasi Wajib**: Setiap respon AI seputar regulasi kampus wajib menyertakan sitasi sumber rujukan dari chunk dokumen Supabase (`[1]`, `[2]`).
7. **Isolasi Tenant & RLS**: Pastikan kueri pencarian vektor selalu menyertakan filter `university_id` dan `study_program_id` untuk mencegah kebocoran data antar-kampus.

---

## 2. Struktur Dokumentasi Inti (The Lean Spec)

Untuk menghemat kuota token dan kredit AI, repositori ini menggunakan sistem spesifikasi ringkas:

- [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md): Spesifikasi lengkap ruang lingkup produk, sistem akun, data protection, dan alur fitur.
- [`docs/TECH_AND_DATABASE.md`](docs/TECH_AND_DATABASE.md): Tumpukan teknologi, skrip DDL SQL Supabase siap pakai, fungsi RPC pgvector, dan struktur folder `src/`.
- [`docs/TEAM_ASSESSMENT_GUIDE.md`](docs/TEAM_ASSESSMENT_GUIDE.md): Panduan pengecekan dokumen untuk Rifal, Kalya, Erick, dan Netta.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): Standar branching dan pesan commit Git.
- [`README.md`](README.md): Ringkasan proyek dan navigasi repositori.

---

## 3. Protokol Modifikasi Kode

Saat diminta melakukan vibe coding atau membuat komponen:
1. Periksa `docs/TECH_AND_DATABASE.md` untuk skema tabel dan tipe data.
2. Buat kode yang modular, bersih, dan menggunakan TypeScript strict mode.
3. Pastikan penanganan state loading, empty state, dan error state tertangani dengan baik pada antarmuka.
