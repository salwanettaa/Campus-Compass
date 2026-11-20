# Row Level Security (RLS) Policies

> **Dokumen**: `docs/database/rls-policies.md`  
> **Owner**: Netta (Backend, Database & AI Architecture Lead)  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/database/database-schema.md`](database-schema.md), [`docs/database/data-classification.md`](data-classification.md)

---

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan aturan Row Level Security (RLS) pada Supabase PostgreSQL guna menjamin isolasi data kampus pilot dan privasi data mahasiswa di level mesin database.

---

## 2. Status Pengerjaan

> [!NOTE]
> Dokumen kebijakan RLS ini **belum dikerjakan**. Kebijakan SQL resmi per tabel akan dirumuskan dan diuji oleh **Netta**.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] Perintah `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` untuk setiap tabel.
- [ ] Fungsi helper konteks autentikasi (`get_auth_university_id()`, `get_auth_program_id()`).
- [ ] Kebijakan SELECT/INSERT/UPDATE untuk data profil mahasiswa (akses pribadi).
- [ ] Kebijakan SELECT untuk data pengetahuan umum (terbuka untuk seluruh user terautentikasi).
- [ ] Kebijakan SELECT untuk data kampus-scoped (hanya untuk mahasiswa yang terdaftar di kampus/prodi yang sama).
- [ ] Kebijakan akses kurasi dan moderasi untuk admin/kurator.

---

## 4. Referensi & Dokumen Terkait

- [`docs/database/database-schema.md`](database-schema.md): Struktur tabel database.
- [`docs/database/data-classification.md`](data-classification.md): Klasifikasi sensitivitas data.
