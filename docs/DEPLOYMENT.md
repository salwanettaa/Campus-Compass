# Campus Compass - Deployment Guide

> **Dokumen**: `docs/DEPLOYMENT.md`
> **Tujuan**: Checklist agar aplikasi bisa di-deploy (Vercel + Supabase) dan dicek oleh tim.
> **Dependensi**: [`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md), [`.env.example`](../.env.example)

---

## 1. Environment variables

Set di **Vercel > Project > Settings > Environment Variables** (dan di `.env.local` untuk lokal).
Jangan pernah commit nilai asli.

| Variable | Wajib sekarang? | Tempat | Catatan |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | Client + Server | Dari Supabase > Project Settings > API. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Client + Server | Aman dipublikasikan; dilindungi RLS. |
| `NEXT_PUBLIC_APP_URL` | Ya (production) | Client + Server | URL hasil deploy, tanpa `/` di akhir. Fallback: `VERCEL_URL`, lalu `localhost:3000`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Belum | **Server saja** | Baru dipakai nanti (seed/ingest). **Jangan** beri awalan `NEXT_PUBLIC_`. |
| `GEMINI_API_KEY` | Belum | **Server saja** | Dipakai di slice AI Navigator. **Jangan** beri awalan `NEXT_PUBLIC_`. |
| `GEMINI_MODEL`, `GEMINI_EMBEDDING_MODEL` | Belum | Server | Cek model yang masih tersedia sebelum slice AI (nilai di `.env.example` bisa sudah usang). |

Aturan: variabel berawalan `NEXT_PUBLIC_` ikut terbundel ke browser. Rahasia (service role, Gemini) tidak boleh punya awalan itu.

---

## 2. Setup Supabase

1. **Jalankan skema** dari `docs/TECH_AND_DATABASE.md` (bagian 2, 3, dan 4) di SQL Editor.
   - **Masalah yang diketahui:** `CREATE TABLE public.bookmarks` mereferensi `public.guides`, padahal `guides` dibuat setelahnya. Pindahkan blok `guides` ke atas `bookmarks` agar tidak error. Koordinasikan perbaikannya dengan owner database.
2. **Isi data awal:** jalankan `supabase/seed.sql` (data sintetis: 1 kampus, 2 fakultas, 3 prodi). Tanpa ini onboarding menampilkan "No campuses yet".
3. **Authentication > URL Configuration:**
   - **Site URL:** URL production (mis. `https://your-app.vercel.app`).
   - **Redirect URLs:** tambahkan `https://your-app.vercel.app/auth/callback` dan `http://localhost:3000/auth/callback`.
4. **Authentication > Providers > Email:** putuskan apakah *Confirm email* dinyalakan.
   - Nyala: user harus klik link di email sebelum login (lebih aman, butuh redirect URL di atas benar).
   - Mati: user langsung masuk ke onboarding setelah daftar (lebih cepat untuk demo).
5. Gunakan **data uji saja** selama tahap demo (UU PDP).

---

## 3. Deploy ke Vercel

1. Pastikan PR sudah ter-merge ke `main`.
2. Di Vercel: **Add New > Project**, import repository, framework otomatis terdeteksi **Next.js**. Build command dan output bawaan sudah benar.
3. Isi environment variables (bagian 1) untuk environment **Production** (dan **Preview** bila ingin PR preview berfungsi penuh).
4. Deploy.
5. Setelah selesai, set `NEXT_PUBLIC_APP_URL` ke URL final, lalu **Redeploy** (nilai `NEXT_PUBLIC_*` ditanam saat build).

> Cek batasan paket Vercel (repo organisasi, penggunaan non-komersial) di dokumentasi resmi Vercel sebelum membuat proyek.

---

## 4. Smoke test setelah deploy

Buka berurutan dan centang:

- [ ] `/api/health` menampilkan `{"status":"ok","supabaseConfigured":true}`.
- [ ] `/` dan `/design-system` tampil dengan font Poppins dan warna yang benar.
- [ ] `/register`: daftar dengan email uji berhasil (atau tampil pesan cek email).
- [ ] Link konfirmasi email membuka aplikasi dan masuk ke `/onboarding`.
- [ ] Onboarding: pilih kampus > fakultas > prodi > semester > fokus, lalu **Finish** membawa ke `/home`.
- [ ] `/home` menampilkan nama, kampus, prodi, dan fokus yang dipilih.
- [ ] **Log out** membawa ke `/login`; membuka `/home` saat logout mengarah ke `/login`.
- [ ] Membuka halaman yang tidak ada menampilkan halaman 404 yang rapi.

---

## 5. Troubleshooting

| Gejala | Kemungkinan penyebab |
| :--- | :--- |
| Banner "Supabase is not connected" | Env Supabase belum diisi di Vercel, atau belum redeploy setelah mengisi. |
| Link email mengarah ke `localhost` | `NEXT_PUBLIC_APP_URL` salah/kosong, atau Site URL Supabase belum diubah. |
| Link email menampilkan "invalid or expired" | Redirect URL `/auth/callback` belum ada di Supabase, atau link sudah dipakai. |
| Onboarding: "No campuses yet" | `supabase/seed.sql` belum dijalankan, atau `is_active = false`. |
| Onboarding gagal menyimpan profil | Cek policy RLS pada `profiles` dan log Supabase; pastikan skema v2 terpasang utuh. |
