# System Architecture Overview

> **Dokumen**: `docs/architecture/system-architecture.md`  
> **Owner**: Erick & Netta  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/architecture/tech-stack.md`](tech-stack.md), [`docs/database/database-schema.md`](../database/database-schema.md)

---

## 1. Tujuan Dokumen

Dokumen ini mendeskripsikan topologi sistem, batasan arsitektur (network/service boundaries), dan perimeter keamanan platform Campus Compass.

---

## 2. Status Pengerjaan

> [!NOTE]
> Desain arsitektur detail **belum dikerjakan**. Dokumen ini merupakan template perencanaan yang akan disusun oleh **Erick & Netta** sebelum pengembangan backend dan AI dimulai.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] Diagram topologi tingkat tinggi: Klien web (Next.js), Data layer (Supabase PostgreSQL + pgvector), dan AI service (Google Gemini).
- [ ] Batasan layer aplikasi: Server components vs Server actions vs Route handlers.
- [ ] Batasan layer keamanan: Manajemen session JWT, anon key vs service role key, dan isolasi tenant di level database.
- [ ] Arsitektur multi-tenant scoping untuk memisahkan data kampus pilot dan data umum.

---

## 4. Referensi & Dokumen Terkait

- [`docs/architecture/tech-stack.md`](tech-stack.md): Spesifikasi tumpukan teknologi.
- [`docs/architecture/integration-flow.md`](integration-flow.md): Alur integrasi data end-to-end.
- [`docs/ai/ai-architecture.md`](../ai/ai-architecture.md): Arsitektur subsistem AI.
