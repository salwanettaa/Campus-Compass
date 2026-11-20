# 02 — Team Responsibilities & RACI Matrix

> **Dokumen**: `docs/02-team-responsibilities.md`  
> **Owner**: Seluruh Tim (Rifal, Kalya, Erick, Netta)  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`AGENTS.md`](../AGENTS.md), [`docs/00-project-overview.md`](00-project-overview.md)

---

## 1. Tujuan Dokumen

Dokumen ini memetakan pembagian tanggung jawab, batas kepemilikan modul, dan matriks RACI (Responsible, Accountable, Consulted, Informed) di antara anggota tim.

---

## 2. Status Pengerjaan

> [!NOTE]
> Dokumen ini **belum difinalisasi**. Struktur dasar kepemilikan telah ditetapkan, namun matriks detail dan protokol koordinasi teknis akan disepakati bersama oleh tim.

---

## 3. Pembagian Peran Tim (Ringkasan Tanggung Jawab)

- **Rifal (Product & UI/UX Direction)**:
  - Konsep video produk & storytelling.
  - Moodboard UI/UX (palet warna, tipografi, visual style, referensi desain).
  - Referensi visual dashboard & landing page.
  - Panduan aset visual di `assets/moodboard/` dan `assets/references/`.
- **Kalya (Frontend & User Experience)**:
  - Sitemap dan struktur navigasi halaman web.
  - User flow dari onboarding hingga fitur utama.
  - Struktur routing frontend Next.js App Router.
  - Implementasi komponen UI berdasarkan arahan moodboard Rifal.
- **Erick (Technical Setup & AI-Assisted Dev)**:
  - Konfirmasi tech stack dan arsitektur folder proyek.
  - Konvensi kode dan struktur komponen frontend-backend.
  - Arsitektur RAG retrieval flow dan integrasi Google Gemini API.
- **Netta (Backend, Database & AI Architecture)**:
  - Perancangan skema database & ERD.
  - Aturan akses data (Public, Campus-scoped, Private).
  - Kebijakan Supabase Row Level Security (RLS).
  - Setup repository GitHub & kontrak API backend.
  - Logika rule-based recommendation engine.

---

## 4. Poin-Poin yang Akan Diisi oleh Tim

- [ ] Matriks RACI per modul fitur.
- [ ] Alur handoff antar anggota tim (desain -> frontend -> backend/AI).
- [ ] Aturan resolusi konflik teknis dan persetujuan PR.

---

## 5. Referensi & Dokumen Terkait

- [`AGENTS.md`](../AGENTS.md): Panduan operasional dan 13 aturan wajib coding agent.
