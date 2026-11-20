# Entity-Relationship Diagram (ERD)

> **Dokumen**: `docs/database/erd.md`  
> **Owner**: Netta (Backend, Database & AI Architecture Lead)  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/database/database-schema.md`](database-schema.md), [`docs/database/data-classification.md`](data-classification.md)

---

## 1. Tujuan Dokumen

Dokumen ini memvisualisasikan model data relasional, entitas utama, atribut, serta kardinalitas relasi yang mendukung penyimpanan data mahasiswa, pengetahuan umum, pengetahuan kampus pilot, dan riwayat rekomendasi.

---

## 2. Status Pengerjaan

> [!NOTE]
> Diagram relasi entitas (ERD) detail **belum difinalisasi**. Perancangan diagram resmi akan diselesaikan oleh **Netta**.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] Diagram ERD visual (Mermaid erDiagram) mencakup:
  - Entitas universitas dan program studi (`universities`, `study_programs`).
  - Entitas profil mahasiswa yang terikat ke Supabase Auth (`profiles`).
  - Entitas artikel pengetahuan dan chunk vektor (`knowledge_items`, `knowledge_chunks`).
  - Entitas tips senior (`senior_tips`).
  - Entitas aturan dan riwayat rekomendasi (`recommendation_rules`, `user_recommendations`).
- [ ] Definisi kardinalitas (1:1, 1:N, N:M) dan foreign key constraints.

---

## 4. Referensi & Dokumen Terkait

- [`docs/database/database-schema.md`](database-schema.md): Skema DDL tabel database.
- [`docs/database/data-classification.md`](data-classification.md): Klasifikasi privasi data.
