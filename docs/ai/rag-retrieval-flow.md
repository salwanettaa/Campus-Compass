# RAG Retrieval Flow & Chunking Strategy

> **Dokumen**: `docs/ai/rag-retrieval-flow.md`  
> **Owner**: Erick (Technical Setup & AI-Assisted Dev Lead)  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/ai/ai-architecture.md`](ai-architecture.md), [`docs/database/database-schema.md`](../database/database-schema.md)

---

## 1. Tujuan Dokumen

Dokumen ini mengatur strategi pemecahan dokumen (chunking), parameter overlap, dimensi vektor embedding, ambang batas kemiripan (similarity threshold), serta perakitan prompt context untuk pipeline Retrieval-Augmented Generation (RAG).

---

## 2. Status Pengerjaan

> [!NOTE]
> Pipeline RAG detail **belum dikerjakan**. Parameter chunking dan evaluasi retrieval akan diuji dan didokumentasikan oleh **Erick**.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] Parameter pemotongan dokumen (ukuran token target, overlap antar chunk).
- [ ] Atribut metadata yang wajib melekat pada setiap chunk (`is_general`, `university_id`, `study_program_id`, judul sumber).
- [ ] Model embedding yang digunakan (target: Google `text-embedding-004`).
- [ ] Nilai ambang batas kemiripan kosinus (similarity threshold) minimum untuk menampilkan jawaban.
- [ ] Template perakitan prompt grounding ke Gemini API.

---

## 4. Referensi & Dokumen Terkait

- [`docs/ai/gemini-integration.md`](gemini-integration.md): Konfigurasi SDK Gemini.
- [`docs/database/database-schema.md`](../database/database-schema.md): Struktur tabel `knowledge_chunks`.
