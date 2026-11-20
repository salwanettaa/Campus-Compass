# AI Subsystem Architecture & Safety Guardrails

> **Dokumen**: `docs/ai/ai-architecture.md`  
> **Owner**: Erick & Netta  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/ai/rag-retrieval-flow.md`](rag-retrieval-flow.md), [`docs/ai/gemini-integration.md`](gemini-integration.md)

---

## 1. Tujuan Dokumen

Dokumen ini menjelaskan arsitektur subsistem kecerdasan buatan (AI), prinsip grounding tanpa halusinasi untuk aturan akademik, serta pembagian peran antara model generatif LLM dan rule engine deterministik.

---

## 2. Status Pengerjaan

> [!NOTE]
> Desain arsitektur AI detail **belum dikerjakan**. Dokumen ini merupakan template perencanaan yang akan disusun oleh **Erick & Netta** sebelum pipeline AI diimplementasikan.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] Diagram alur subsistem AI (klasifikasi intent, routing pertanyaan, retrieval, sitasi).
- [ ] Batasan anti-halusinasi untuk peraturan akademik kampus (kewajiban sitasi sumber dokumen resmi).
- [ ] Mekanisme pemisahan context blending antara lingkup umum dan lingkup kampus pilot.
- [ ] Penentuan model AI untuk generasi teks dan embedding vektor.

---

## 4. Referensi & Dokumen Terkait

- [`docs/ai/rag-retrieval-flow.md`](rag-retrieval-flow.md): Alur chunking dan retrieval vektor.
- [`docs/ai/gemini-integration.md`](gemini-integration.md): Spesifikasi integrasi Google Gemini API.
- [`docs/ai/recommendation-logic.md`](recommendation-logic.md): Logika rekomendasi berbasis aturan.
