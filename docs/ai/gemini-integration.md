# Google Gemini API Integration Specification

> **Dokumen**: `docs/ai/gemini-integration.md`  
> **Owner**: Erick (Technical Setup & AI-Assisted Dev Lead)  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/ai/ai-architecture.md`](ai-architecture.md), [`docs/architecture/tech-stack.md`](../architecture/tech-stack.md)

---

## 1. Tujuan Dokumen

Dokumen ini merinci integrasi Google Gemini API, meliputi pemilihan SDK, pemilihan varian model (Flash / Pro), system prompt, konfigurasi safety settings, serta penanganan token streaming.

---

## 2. Status Pengerjaan

> [!NOTE]
> Konfigurasi integrasi SDK Gemini **belum dikerjakan**. Spesifikasi prompt resmi dan kredensial API akan disiapkan oleh **Erick**.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] Pemilihan pustaka SDK resmi (`@google/genai`).
- [ ] Konfirmasi varian model: `gemini-1.5-flash` vs `gemini-1.5-pro` beserta pengaturannya (temperature rendah untuk akurasi fakta).
- [ ] Rumusan system instruction resmi untuk asisten akademik Campus Compass.
- [ ] Konfigurasi filter keamanan (safety settings) untuk lingkungan akademik.
- [ ] Pengamanan kunci API (`GEMINI_API_KEY`) di level server agar tidak bocor ke browser klien.

---

## 4. Referensi & Dokumen Terkait

- [`docs/architecture/tech-stack.md`](../architecture/tech-stack.md): Spesifikasi tumpukan teknologi.
- [`.env.example`](../../.env.example): Template konfigurasi environment variable.
