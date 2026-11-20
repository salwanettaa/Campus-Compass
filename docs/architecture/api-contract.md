# API Contract & Endpoint Specifications

> **Dokumen**: `docs/architecture/api-contract.md`  
> **Owner**: Netta (Backend, Database & AI Architecture Lead)  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/database/database-schema.md`](../database/database-schema.md), [`docs/ai/rag-retrieval-flow.md`](../ai/rag-retrieval-flow.md)

---

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan kontrak antarmuka API (REST route handlers dan Supabase RPC functions), format payload JSON permintaan dan respons, penanganan error, serta kode status HTTP.

---

## 2. Status Pengerjaan

> [!NOTE]
> Spesifikasi kontrak API resmi **belum dikerjakan**. Kontrak detail endpoint akan dirumuskan oleh **Netta** dan disinkronkan dengan kebutuhan frontend Kalya.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] Format standar respons error dan kode status HTTP.
- [ ] Spesifikasi endpoint streaming RAG query (`POST /api/rag/query`).
- [ ] Spesifikasi endpoint rekomendasi milestone (`GET /api/recommendations`).
- [ ] Spesifikasi endpoint penelusuran artikel pengetahuan (`GET /api/knowledge`).
- [ ] Spesifikasi endpoint tips mahasiswa (`GET /api/tips`).
- [ ] Kontrak parameter fungsi RPC Supabase `match_knowledge_chunks`.

---

## 4. Referensi & Dokumen Terkait

- [`docs/database/database-schema.md`](../database/database-schema.md): Skema tabel database PostgreSQL.
- [`docs/architecture/integration-flow.md`](integration-flow.md): Alur siklus pemanggilan API.
