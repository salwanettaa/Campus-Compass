# Data Classification & Privacy Matrix

> **Dokumen**: `docs/database/data-classification.md`  
> **Owner**: Netta (Backend, Database & AI Architecture Lead)  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/database/rls-policies.md`](rls-policies.md), [`docs/database/database-schema.md`](database-schema.md)

---

## 1. Tujuan Dokumen

Dokumen ini menetapkan taksonomi klasifikasi data, batasan akses data sensitif, retensi data, serta panduan kepatuhan privasi (UU PDP Indonesia).

---

## 2. Status Pengerjaan

> [!NOTE]
> Matriks klasifikasi data **belum dikerjakan**. Rincian aturan retensi dan batasan privasi akan difinalisasi oleh **Netta**.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] Matriks pembagian 4 tingkat sensitivitas data:
  - Tier 1: Public (informasi umum, panduan belajar umum).
  - Tier 2: Campus-Scoped (peraturan prodi, panduan praktikum, tips lokal).
  - Tier 3: Private PII (nama, email, semester, log pencarian mahasiswa).
  - Tier 4: Restricted / Secrets (API key, service role key).
- [ ] Aturan retensi dan penghapusan data mahasiswa (Right to Erasure).
- [ ] Aturan anonimisasi narasumber wawancara mahasiswa senior.

---

## 4. Referensi & Dokumen Terkait

- [`docs/database/rls-policies.md`](rls-policies.md): Penegakan isolasi akses data via RLS.
- [`docs/03-user-research.md`](../03-user-research.md): Panduan penanganan data riset.
