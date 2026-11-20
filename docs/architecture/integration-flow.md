# Integration Flow & Data Lifecycle

> **Dokumen**: `docs/architecture/integration-flow.md`  
> **Owner**: Erick (Technical Setup & AI-Assisted Dev Lead)  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/architecture/system-architecture.md`](system-architecture.md), [`docs/architecture/api-contract.md`](api-contract.md)

---

## 1. Tujuan Dokumen

Dokumen ini merinci alur integrasi end-to-end antara antarmuka pengguna web, runtime server Next.js, database Supabase, dan Google Gemini API.

---

## 2. Status Pengerjaan

> [!NOTE]
> Alur integrasi teknis **belum dikerjakan**. Diagram urutan panggilan data dan penanganan fallback akan disusun oleh **Erick**.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] Diagram alur (sequence diagram) pencarian RAG dari query pengguna hingga streaming balasan.
- [ ] Alur proses ingesti dokumen (parsing dokumen, chunking, embedding, penyimpanan ke Supabase).
- [ ] Penanganan kegagalan & graceful degradation (misal: kuota API habis, tidak ditemukan referensi relevan).
- [ ] Kebijakan timeout dan retry request.

---

## 4. Referensi & Dokumen Terkait

- [`docs/architecture/api-contract.md`](api-contract.md): Kontrak endpoint API.
- [`docs/ai/rag-retrieval-flow.md`](../ai/rag-retrieval-flow.md): Alur retrieval vektor RAG.
