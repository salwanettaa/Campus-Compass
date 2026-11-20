# Database Schema Specification

> **Dokumen**: `docs/database/database-schema.md`  
> **Owner**: Netta (Backend, Database & AI Architecture Lead)  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/database/erd.md`](erd.md), [`docs/database/rls-policies.md`](rls-policies.md)

---

## 1. Tujuan Dokumen

Dokumen ini menyediakan spesifikasi skrip DDL PostgreSQL untuk pembuatan tabel, tipe data, indeks (termasuk indeks vektor HNSW untuk pgvector), trigger, dan fungsi RPC pada Supabase.

---

## 2. Status Pengerjaan

> [!NOTE]
> Skema database resmi **belum dieksekusi / belum final**. Rancangan tabel dan skrip migrasi akan disiapkan dan diuji oleh **Netta**.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] DDL tabel master: `universities`, `study_programs`.
- [ ] DDL tabel pengguna: `profiles` (terkait `auth.users`).
- [ ] DDL tabel pengetahuan & vektor: `knowledge_items`, `knowledge_chunks` (kolom tipe `vector(768)`).
- [ ] DDL tabel tips & rekomendasi: `senior_tips`, `recommendation_rules`, `user_recommendations`.
- [ ] Konfigurasi indeks HNSW/IVFFlat untuk pencarian kemiripan kosinus.
- [ ] Skrip fungsi RPC `match_knowledge_chunks` untuk filter hybrid tenant.

---

## 4. Referensi & Dokumen Terkait

- [`docs/database/erd.md`](erd.md): Diagram relasi entitas database.
- [`docs/database/rls-policies.md`](rls-policies.md): Kebijakan Row Level Security (RLS).
