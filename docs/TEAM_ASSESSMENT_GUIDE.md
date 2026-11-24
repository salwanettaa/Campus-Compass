# Team Assessment & Review Checklist (Phase 0)

> **Dokumen**: `docs/TEAM_ASSESSMENT_GUIDE.md`  
> **Target Review**: Selesai sebelum Senin, 23 November 2026  
> **Tujuan**: Memastikan seluruh anggota tim memeriksa dan menyetujui dokumen spesifikasi produk ([`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md)) dan teknis ([`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md)) sesuai dengan Blueprint resmi.

---

## 1. Panduan Assessment untuk Rifal (Product & UI/UX Direction)

- [ ] **Review Product Positioning & 4 Modul Utama ([`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md))**:
  - Apakah konsep *Reddit-inspired Community, Glassdoor-organized Experiences, dan AI Navigator* sudah jelas dipahami untuk narasi produk?
  - Apakah struktur 4 area utama (**Home & My Journey, Community, Knowledge Hub, AI Navigator**) sudah sesuai untuk desain antarmuka?
- [ ] **Persiapan Skenario Demo Hackathon**:
  - Pelajari 6 adegan demo di Bab 6 [`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md) (Onboarding $\rightarrow$ Home $\rightarrow$ Community $\rightarrow$ Knowledge Hub $\rightarrow$ AI Navigator $\rightarrow$ My Journey). Apakah alur ini sudah siap dijadikan storyboard video produk / pitch deck?
- [ ] **Visual Theme & Moodboard**:
  - Siapkan palet warna, tipografi, dan referensi komponen di `assets/moodboard/` dan `assets/references/`.

---

## 2. Panduan Assessment untuk Kalya (Frontend & User Experience)

- [ ] **Review Alur Onboarding & Personalisasi ([`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md))**:
  - Apakah form pemilihan kampus, fakultas, prodi, semester, dan **pilihan tantangan utama adaptasi** sudah dirancang alurnya agar *frictionless*?
- [ ] **Review Navigasi 4 Modul ([`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md))**:
  - Pastikan tata letak navigasi responsif 4 menu utama: sidebar untuk desktop dan bottom navigation bar untuk mobile browser.
- [ ] **Review Struktur Folder Next.js ([`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md))**:
  - Apakah pembagian folder route `src/app/(dashboard)/home`, `community`, `knowledge`, dan `ai-navigator` sudah siap dieksekusi saat vibe coding?

---

## 3. Panduan Assessment untuk Erick (Technical Setup & AI Navigator)

- [ ] **Review Pipeline RAG & Sitasi ([`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md))**:
  - Apakah integrasi model `text-embedding-004` (768 dimensi) dan model chat `gemini-1.5-flash` via `@google/genai` sudah siap diinstal?
  - Apakah fungsi RPC `match_campus_chunks` dengan threshold $0.65$ sudah dipahami untuk dipanggil dari Next.js route handler?
- [ ] **Review Penanganan Insufficient Evidence**:
  - Pastikan AI tidak berhalusinasi jika data resmi belum tersedia, dan mengarahkan mahasiswa ke forum Community atau kontak resmi prodi.

---

## 4. Panduan Assessment untuk Netta (Backend, Database & AI Architecture)

- [x] **Review Skema Database Supabase ([`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md)) — APPROVED (V2 Hardened)**:
  - DDL SQL telah diaudit mendalam dan direfaktor ke **Versi 2 (Hardened)**.
  - Mengaktifkan RLS pada seluruh 13 tabel tanpa celah *unauthenticated bypass*.
  - Menambahkan B-Tree index pada seluruh Foreign Keys dan filter krusial.
  - Memperbaiki indeks HNSW vector dengan ordering `c.embedding <=> query_embedding ASC` (<100ms).
  - Skrip siap dicopy-paste dan dijalankan di Supabase SQL Editor.
- [x] **Review Row Level Security (RLS) & UU PDP ([`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md)) — APPROVED (V2 Hardened)**:
  - Multi-tenant isolation terkunci ketat per `campus_id` untuk semua tabel komunitas, panduan, dan pengalaman.
  - Database-level anonymity: Author asli postingan anonim di-mask menjadi `NULL` via Secure Views (`v_posts`, `v_comments`).
  - Mencegah *privilege escalation* role admin dan manipulasi `helpful_count` via database trigger.
  - Kepatuhan UU PDP No. 27/2022 terpenuhi: Kolom `full_name` dihapus (hanya `display_name` pseudonim), nol data sensitif (tanpa NIM, NIK, atau nomor telepon).
