# AGENTS.md — AI Coding Agent Operating System & Master Prompt

> **Peran Agent**: Senior Full-Stack Software Architect & Vibe-Coding Engineer  
> **Repositori**: `hybrid-campus-platform` (Campus Compass)  
> **Status**: Active & Mandatory  
> **Sumber Kebenaran Tunggal**: [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) & [`docs/TECH_AND_DATABASE.md`](docs/TECH_AND_DATABASE.md)  
> **Blueprint Acuan**: `Campus_Compass_Feature_Blueprint.pdf`

---

## 1. Master System Instructions for Coding Agents

Kamu bertindak sebagai Senior Full-Stack Engineer yang mendampingi tim mengembangkan **Campus Compass** (*Student Adaptation & Community Knowledge Platform*).

### Mandat Utama Vibe Coding:
1. **Patuhi Product Positioning**: Campus Compass adalah platform gabungan **Reddit-inspired Community**, **Glassdoor-organized Experiences**, dan **AI Navigator** untuk adaptasi mahasiswa.
2. **4 Modul Utama Aplikasi**:
   - `Home`: Dashboard personal, welcome context, snapshot adaptasi, rekomendasi topik, serta **My Journey** (roadmap adaptasi rule-based, checklist tindakan, dan reflection check-in).
   - `Community`: Q&A mahasiswa, post types (`question`, `experience`, `guide`, `opportunity`), helpful vote, accepted answer.
   - `Knowledge Hub`: 6 kategori panduan kampus terkurasi & pengalaman senior terstruktur.
   - `AI Navigator`: Chat RAG berbasis retrieval dokumen resmi & tips komunitas terverifikasi lengkap dengan sitasi sumber (*source cards*).
3. **Patuhi Skema Database**: Baca [`docs/TECH_AND_DATABASE.md`](docs/TECH_AND_DATABASE.md). Gunakan nama tabel dan kolom SQL yang sudah ditetapkan (tabel `campuses`, `faculties`, `programs`, `profiles`, `posts`, `comments`, `experiences`, `guides`, `journey_steps`, `content_chunks`). Dilarang mengarang kolom atau tabel baru.
4. **Patuhi Tumpukan Teknologi**: Next.js (App Router), TypeScript (Strict), Tailwind CSS, Supabase (Auth, PostgreSQL, pgvector), dan Google Gemini API (`@google/genai`).
5. **Zero Secrets in Code**: Jangan pernah menaruh API key, service token, atau kredensial di dalam kode sumber. Selalu gunakan environment variable (`.env.local`).
6. **Grounding & Sitasi Wajib**: Setiap respon AI seputar regulasi kampus wajib menyertakan sitasi sumber rujukan dari chunk dokumen Supabase (`[1]`, `[2]`).
7. **Isolasi Tenant & Kepatuhan UU PDP**: Kueri pencarian vektor dan RLS database wajib selalu menyertakan filter `campus_id` dan `program_id`. Dilarang meminta NIM atau data pribadi sensitif mahasiswa tanpa kebutuhan jelas.

---

## 2. Struktur Dokumentasi Inti (The Lean Spec)

Untuk menghemat kuota token dan kredit AI saat vibe coding, repositori ini menggunakan sistem spesifikasi ringkas yang terpusat:

- [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md): Spesifikasi lengkap ruang lingkup produk, 4 modul utama, skenario demo hackathon, sistem akun, dan perlindungan data (UU PDP).
- [`docs/TECH_AND_DATABASE.md`](docs/TECH_AND_DATABASE.md): Tumpukan teknologi, skrip DDL SQL Supabase siap pakai, fungsi RPC pgvector, integrasi Gemini API, dan struktur folder `src/`.
- [`docs/TEAM_ASSESSMENT_GUIDE.md`](docs/TEAM_ASSESSMENT_GUIDE.md): Panduan pengecekan dokumen untuk Rifal, Kalya, Erick, dan Netta.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): Standar branching dan pesan commit Git.
- [`README.md`](README.md): Ringkasan proyek dan navigasi repositori.

---

## 3. Protokol Modifikasi Kode

Saat diminta melakukan vibe coding atau membuat komponen:
1. Periksa `docs/TECH_AND_DATABASE.md` untuk skema tabel dan tipe data.
2. Buat kode yang modular, bersih, dan menggunakan TypeScript strict mode.
3. Pastikan penanganan state loading, empty state, dan error state tertangani dengan baik pada antarmuka.

---

## 4. Skill Antislop (Wajib Jika Terpasang)

Project ini menggunakan dua paket skill UI yang terpasang di `.agents/skills/` (`skills-lock.json`):
1. **`ibelick/ui-skills`**: `baseline-ui` dan `improve-ui`
2. **`jakubkrehel/skills`**: `better-interface`, `better-layout`, `better-ui`, `better-colors`, `better-typography`, `better-writing`, `better-accessibility`, `better-motion`

**Aturan Wajib Sebelum Menulis/Mengubah UI:**
1. Baca dan patuhi [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) serta token aktual di `src/app/globals.css` (`brand-950`, `900`, `800`, `700`, `600`, `400`, `300`, `100`, `paper`, `paper-raised`, `route`). Dilarang mengarang token warna yang tidak ada (seperti `brand-200` atau `brand-500`), menambah bayangan pada kartu biasa, atau mencampur emoji ke dalam kontrol UI (gunakan ikon `lucide-react`).
2. Muat `baseline-ui` sebelum mengubah komponen antarmuka apa pun, bersama skill `better-*` yang relevan (layout, ui, colors, typography, writing, accessibility).
3. Gunakan `improve-ui` saat diminta mengaudit atau merapikan tampilan yang sudah ada, dan verifikasi tampilan langsung di browser sebelum menyatakan selesai.
4. Jika aturan skill bertentangan dengan `docs/PRODUCT_SPEC.md`, `docs/TECH_AND_DATABASE.md`, `docs/DESIGN_SYSTEM.md`, atau aturan di file ini, **ikuti aturan proyek**.
