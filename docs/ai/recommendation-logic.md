# Rule-Based Recommendation Logic

> **Dokumen**: `docs/ai/recommendation-logic.md`  
> **Owner**: Netta (Backend, Database & AI Architecture Lead)  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/database/database-schema.md`](../database/database-schema.md), [`docs/product/product-requirements.md`](../product/product-requirements.md)

---

## 1. Tujuan Dokumen

Dokumen ini memuat katalog aturan bisnis rekomendasi akademik yang bersifat deterministik untuk memandu mahasiswa baru berdasarkan semester dan status perkuliahan.

---

## 2. Status Pengerjaan

> [!NOTE]
> Logika dan katalog aturan rekomendasi **belum dikerjakan**. Daftar milestone akademik resmi akan disusun oleh **Netta** setelah data silabus program studi pilot diperoleh.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] Katalog aturan rekomendasi per semester (misal: induksi lab semester 1, konsultasi dosen PA, panduan KRS, magang semester 5).
- [ ] Logika evaluasi kondisi aturan (state machine: aktif, selesai, disembunyikan).
- [ ] Kueri pengambilan kartu rekomendasi aktif mahasiswa berdasarkan semester di profil.
- [ ] Mekanisme pencatatan riwayat kartu yang telah diselesaikan mahasiswa (`user_recommendations`).

---

## 4. Referensi & Dokumen Terkait

- [`docs/database/database-schema.md`](../database/database-schema.md): Tabel `recommendation_rules` dan `user_recommendations`.
- [`docs/product/user-flow.md`](../product/user-flow.md): Alur interaksi kartu rekomendasi di dashboard.
