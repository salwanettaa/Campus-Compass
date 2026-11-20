# 01 — Product Scope

> **Dokumen**: `docs/01-product-scope.md`  
> **Owner**: Netta & Rifal  
> **Status**: Baseline Approved (Foundation Phase)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/00-project-overview.md`](00-project-overview.md), [`docs/decisions/decision-log.md`](decisions/decision-log.md)

---

## 1. Tujuan Dokumen

Dokumen ini menetapkan batasan ruang lingkup dasar (baseline scope) untuk Minimum Viable Product (MVP) Campus Compass. Batasan ini dirancang agar tim fokus pada validasi nilai utama, menjaga kecepatan peluncuran, dan mencegah ekspansi fitur yang prematur.

---

## 2. In-Scope: Fitur & Kapabilitas MVP

Platform MVP berfokus pada ekosistem terpadu untuk **1 Universitas Pilot** dan **1 Program Studi Pilot** dengan rincian kapabilitas berikut:

### A. Autentikasi Mahasiswa & Penguncian Konteks
- Pendaftaran akun dan login menggunakan email & kata sandi via Supabase Auth.
- Onboarding pemilihan konteks: Universitas pilot, Program studi pilot, dan semester berjalan.
- Penetapan session context pada database (`university_id`, `study_program_id`, `semester`).

### B. Dual-Layer Knowledge Base
- **Layer Pengetahuan Umum**: Artikel strategi belajar, penulisan akademik, etika kuliah, dan kesehatan mental yang dapat diakses oleh seluruh mahasiswa.
- **Layer Pengetahuan Kampus/Prodi**: Regulasi kurikulum, prasyarat matakuliah, panduan laboratorium, dan kebijakan departemen yang terisolasi khusus untuk kampus dan program studi pilot.

### C. Grounded AI Assistant (RAG dengan Sitasi)
- Antarmuka tanya-jawab bahasa alami berbasis teks.
- Pipeline Retrieval-Augmented Generation (RAG) menggunakan model embedding dan model generasi Google Gemini API.
- Filter pencarian vektor otomatis berdasarkan identitas kampus dan prodi mahasiswa.
- Tampilan komponen *citation pill* (sitasi sumber) yang transparan dan dapat diklik pada setiap jawaban.

### D. Kartu Rekomendasi Milestone Akademik (Rule-Based)
- Kartu panduan di dashboard utama mahasiswa yang muncul berdasarkan semester berjalan (misal: "Semester 1: Selesaikan Induksi Keselamatan Lab").
- Dievaluasi menggunakan aturan deterministik bisnis (bukan tebakan probabilistik AI).
- Fitur penandaan status selesai (*Mark as Completed*) atau sembunyikan (*Dismiss*).

### E. Repositori Tips & Panduan Kampus Mahasiswa
- Kumpulan wawasan dan tips praktis yang dikurasi dari **hasil survei Google Form mahasiswa**.
- Pengelompokan kategori (akademik, dosen, lingkungan kampus, praktikum).

---

## 3. Out-of-Scope: Di Luar Ruang Lingkup MVP

Fitur-fitur berikut secara eksplisit **DITANGGUHKAN** untuk fase selanjutnya:

| Fitur / Modul | Alasan Penundaan | Rencana Fase |
| :--- | :--- | :--- |
| **Onboarding Mandiri Banyak Kampus** | Fokus awal adalah kedalaman dan validitas data 1 prodi pilot. | Fase 4 (Scaling) |
| **Aplikasi Native Mobile (iOS / Android)** | Web responsif sudah cukup menjangkau perangkat mobile dengan biaya pemeliharaan lebih hemat. | Fase 3 / 4 |
| **Integrasi Pembayaran UKT / Finansial** | Regulasi perbankan tinggi dan bukan fokus utama solusi navigasi akademik. | Di luar scope produk |
| **Sinkronisasi Otomatis Dua Arah dengan SIAKAD/LMS** | Menghindari hambatan birokrasi perizinan API institusi di tahap validasi awal. | Fase 4 |
| **Fitur Media Sosial / Chat Komunitas Terbuka** | Memerlukan moderasi berat; fokus utama tetap pada pencarian informasi terverifikasi. | Fase 3 |

---

## 4. Prinsip Skalabilitas Multi-Tenant

Meskipun MVP hanya mencakup 1 universitas dan 1 prodi, arsitektur data dirancang **siap multi-tenant sejak hari pertama**:
1. **Foreign Key Scoping**: Seluruh tabel khusus kampus (`knowledge_items`, `student_tips`, `study_programs`) memiliki foreign key `university_id`.
2. **Row Level Security (RLS)**: Isolasi data ditegakkan di level PostgreSQL, sehingga saat kampus kedua ditambahkan tidak memerlukan perombakan kode aplikasi.
3. **Bebas Nilai Hardcoded**: Kode aplikasi dilarang keras menaruh ID kampus atau nama universitas secara *hardcoded*.

---

## 5. Referensi & Dokumen Terkait

- [`docs/00-project-overview.md`](00-project-overview.md): Gambaran umum dan latar belakang proyek.
- [`docs/database/database-schema.md`](database/database-schema.md): Skema tabel database pendukung.
- [`docs/decisions/decision-log.md`](decisions/decision-log.md): Catatan keputusan arsitektur.
