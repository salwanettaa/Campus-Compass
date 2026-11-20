# Sitemap & Route Structure

> **Dokumen**: `docs/product/sitemap.md`  
> **Owner**: Kalya (Frontend & User Experience Lead)  
> **Status**: Belum Dikerjakan (Pending / To Do)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/product/product-requirements.md`](product-requirements.md), [`docs/product/user-flow.md`](user-flow.md)

---

## 1. Tujuan Dokumen

Dokumen ini memetakan hierarki halaman, struktur sitemap, dan pembagian hak akses rute (publik, terautentikasi, kurator/admin) untuk aplikasi web Campus Compass.

---

## 2. Status Pengerjaan

> [!NOTE]
> Dokumen ini **belum dikerjakan**. Struktur rute final Next.js App Router akan dirancang dan didokumentasikan oleh **Kalya**.

---

## 3. Poin-Poin yang Akan Diisi oleh Owner

- [ ] Daftar rute publik (landing page `/`, login `/auth/login`, register `/auth/register`).
- [ ] Daftar rute terlindungi mahasiswa (`/app/dashboard`, `/app/search`, `/app/knowledge`, `/app/tips`, `/app/profile`).
- [ ] Daftar rute onboarding konteks mahasiswa baru (`/app/onboarding`).
- [ ] Rute pengelolaan untuk admin/kurator (jika diperlukan pada fase berikutnya).
- [ ] Pemetaan segmen rute ke folder Next.js App Router `src/app/`.

---

## 4. Referensi & Dokumen Terkait

- [`docs/product/user-flow.md`](user-flow.md): Alur interaksi pengguna antar halaman.
- [`docs/architecture/folder-structure.md`](../architecture/folder-structure.md): Struktur folder proyek Next.js.
