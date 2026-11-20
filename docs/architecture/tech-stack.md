# Technology Stack Specification

> **Dokumen**: `docs/architecture/tech-stack.md`  
> **Owner**: Erick (Technical Setup & AI-Assisted Dev Lead)  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/architecture/system-architecture.md`](system-architecture.md), [`docs/architecture/folder-structure.md`](folder-structure.md)

---

## 1. Tujuan Dokumen

Dokumen ini memuat konfirmasi pilihan teknologi, framework, runtime, pustaka inti, serta alat bantu pengembangan yang akan digunakan dalam implementasi Campus Compass.

---

## 2. Status Pengerjaan

> [!NOTE]
> Konfirmasi teknis final **belum dikerjakan**. Usulan teknologi telah dipetakan, namun versi dan dependensi resmi akan difinalisasi oleh **Erick**.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] Framework frontend: Next.js (versi target, runtime, App Router).
- [ ] Bahasa pemrograman: TypeScript (konfigurasi strict mode).
- [ ] Styling & UI: Tailwind CSS dan pustaka komponen primitif.
- [ ] Backend & Database: Supabase (PostgreSQL, GoTrue Auth, Storage).
- [ ] Vector database: pgvector extension pada Supabase.
- [ ] Model AI & SDK: Google Gemini API (model embedding dan model generasi).
- [ ] Tooling & Linter: ESLint, Prettier, package manager (pnpm/npm).

---

## 4. Referensi & Dokumen Terkait

- [`docs/architecture/system-architecture.md`](system-architecture.md): Arsitektur sistem.
- [`docs/architecture/folder-structure.md`](folder-structure.md): Struktur folder target.
