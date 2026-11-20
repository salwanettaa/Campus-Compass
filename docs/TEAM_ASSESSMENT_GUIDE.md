# Team Assessment & Review Checklist (Phase 0)

> **Dokumen**: `docs/TEAM_ASSESSMENT_GUIDE.md`  
> **Target Review**: Selesai sebelum Senin, 23 November 2026  
> **Tujuan**: Memastikan seluruh anggota tim memeriksa dan menyetujui dokumen spesifikasi sebelum tahap coding dimulai.

---

## 1. Panduan Assessment untuk Rifal (Product & UI/UX)

- [ ] **Review Product Scope ([`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md))**:
  - Apakah batasan fitur MVP (Chat RAG, Rekomendasi Milestone, Tips Mahasiswa) sudah sesuai dengan visi produk?
  - Apakah model akun (utilitas akademik, bookmark, tips anonim, tanpa full sosmed) sudah tepat?
- [ ] **Persiapan Visual & Moodboard**:
  - Apakah palet warna utama, font, dan moodboard visual sudah siap diunggah ke `assets/moodboard/`?
  - Apakah konsep cerita / video produk sudah siap disusun untuk bahan presentasi?

---

## 2. Panduan Assessment untuk Kalya (Frontend & User Experience)

- [ ] **Review Sitemap & User Flow ([`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md))**:
  - Apakah alur login $\rightarrow$ onboarding kampus/prodi/semester $\rightarrow$ dashboard sudah jelas dan bebas hambatan (*frictionless*)?
  - Apakah tata letak navigasi (Dashboard, Chat AI, Tips Mahasiswa) sudah ergonomis untuk desktop dan mobile?
- [ ] **Review Struktur Routing Frontend ([`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md))**:
  - Apakah pembagian folder Next.js App Router (`(auth)`, `(dashboard)`, `components/ui/`, `components/chat/`) sudah siap digunakan saat vibe coding?

---

## 3. Panduan Assessment untuk Erick (Tech Lead & AI Development)

- [ ] **Review Tech Stack & Setup Environment ([`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md))**:
  - Apakah tumpukan Next.js + Tailwind + Supabase + Google GenAI SDK sudah teruji dan siap diinstal?
  - Apakah API key Gemini di `.env.local` sudah memiliki kuota memadai untuk model `gemini-1.5-flash` dan `text-embedding-004`?
- [ ] **Review Pipeline RAG & Sitasi ([`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md))**:
  - Apakah ambang batas kemiripan kosinus ($0.65$) dan fungsi RPC `match_knowledge_chunks` sudah siap dipanggil dari Next.js route handler?

---

## 4. Panduan Assessment untuk Netta (Backend, Database & AI Architecture)

- [ ] **Review Skema Database PostgreSQL ([`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md))**:
  - Apakah DDL tabel `universities`, `study_programs`, `profiles`, `knowledge_chunks` (dimensi 768), dan `student_tips` sudah siap dieksekusi di SQL Editor Supabase?
- [ ] **Review Row Level Security (RLS) & UU PDP ([`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md))**:
  - Apakah aturan RLS menjamin mahasiswa dari kampus/prodi lain tidak bisa mengakses dokumen internal prodi pilot?
  - Apakah data identitas mahasiswa (PII) sudah terlindungi sesuai standar UU Perlindungan Data Pribadi?
