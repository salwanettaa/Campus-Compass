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

- [ ] **Review Skema Database Supabase ([`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md))**:
  - Periksa skrip DDL SQL untuk 7 kelompok tabel: *Campuses, Profiles, Posts, Comments, Experiences, Guides, Journey Steps, dan Content Chunks*.
  - Apakah skrip siap dicopy-paste dan dijalankan di Supabase SQL Editor?
- [ ] **Review Row Level Security (RLS) & UU PDP ([`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md))**:
  - Pastikan kueri dan policy RLS mengunci akses data per `campus_id` sehingga tidak ada kebocoran data antar-kampus (*multi-tenant isolation*).
  - Pastikan tidak ada pengumpulan data sensitif (NIM, nomor telepon) tanpa dasar yang jelas sesuai UU No. 27 Tahun 2022.
