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

Sebelum mengerjakan UI, teks, atau komentar kode, muat skill `antislop:antislop` (inti) bersama skill yang sesuai:

| Jenis pekerjaan | Skill tambahan |
| :--- | :--- |
| Membuat atau mengubah antarmuka (warna, layout, komponen, animasi) | `antislop:antislop-ui` |
| Layout responsif dan tampilan mobile | `antislop:antislop-layoutmobile` |
| Aksesibilitas (kontras, keyboard, fokus, state interaksi) | `antislop:antislop-human` |
| Teks di aplikasi dan dokumentasi (headline, CTA, copy) | `antislop:antislop-copywriting` |
| Komentar kode | `antislop:antislop-code` |

- Jika aturan skill bertentangan dengan `docs/PRODUCT_SPEC.md`, `docs/TECH_AND_DATABASE.md`, atau aturan di file ini, **ikuti aturan proyek**.
- Jika plugin belum terpasang, lanjutkan pekerjaan tanpa skill ini dan beri tahu pengguna. Cara memasang (jalankan satu per satu):
  1. `/plugin marketplace add https://github.com/miqdadbadjuber/anti-slop`
  2. `/plugin install antislop@anti-slop`
