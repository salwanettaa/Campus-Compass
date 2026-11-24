# Campus Compass - Handoff

> **Tujuan dokumen**: serah-terima konteks lengkap agar developer atau AI agent baru bisa langsung melanjutkan tanpa mengulang riset.
> **Diperbarui**: 24 November 2026
> **Branch saat ditulis**: `erick/feat-auth-onboarding`
> **Sumber kebenaran lain**: [`AGENTS.md`](../AGENTS.md), [`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md), [`docs/TECH_AND_DATABASE.md`](TECH_AND_DATABASE.md), [`docs/DEPLOYMENT.md`](DEPLOYMENT.md), `Campus_Compass_Feature_Blueprint.pdf`.
> Bila dokumen ini bertentangan dengan dokumen di atas, **dokumen di atas yang menang**. Perbarui dokumen ini bila berbeda.

---

## 0. Cara memakai dokumen ini

1. Baca bagian 1 sampai 4 (konteks, aturan, preferensi, status) sebelum menyentuh kode.
2. Gunakan bagian 7 (peta file) dan 12 (gotcha teknis) saat mengubah kode.
3. Bagian 15 (backlog) dan 16 (rencana slice berikutnya) menjawab "kerjakan apa selanjutnya".
4. Bagian 17 adalah checklist wajib sebelum menyatakan sesuatu "selesai".

---

## 1. Konteks proyek

**Campus Compass** adalah *Student Adaptation & Community Knowledge Platform* untuk lomba (hackathon). Gabungan tiga hal: komunitas ala Reddit, pengalaman senior terstruktur ala Glassdoor, dan AI Navigator berbasis RAG.

**Empat modul utama** (keputusan final tim, lihat commit `a6bf073`):

| Modul | Isi |
| :--- | :--- |
| Home | Dashboard personal, snapshot adaptasi, rekomendasi, dan **My Journey** (roadmap rule-based, checklist, refleksi). |
| Community | Q&A mahasiswa. Tipe post: `question`, `experience`, `guide`, `opportunity`. Helpful vote dan accepted answer. |
| Knowledge Hub | 6 kategori panduan terkurasi dan pengalaman senior terstruktur. |
| AI Navigator | Chat RAG dari dokumen resmi dan konten komunitas yang diizinkan, dengan sitasi sumber. |

**Catatan penting:** blueprint PDF menyebut 5 area (My Journey berdiri sendiri), tetapi repo sudah menetapkan **4 modul dengan My Journey di dalam Home**. Ikuti repo (`AGENTS.md`).

**Tim dan pemilik domain** (dari `CONTRIBUTING.md`; pemilik aplikasi ini adalah Erick, git user `erick-surbakti`):

| Orang | Domain |
| :--- | :--- |
| Rifal | Product / UI-UX (approval perubahan UI) |
| Kalya | Frontend / user flow |
| Erick | Tech lead / AI / stack |
| Netta | Database / backend |

**Konteks lomba:** utamakan fitur yang jalan dan terhubung, bukan banyak fitur. Hindari kompleksitas awal; pengetatan menyusul setelah fungsi bekerja.

---

## 2. Aturan wajib (dari `AGENTS.md`)

- **Stack tetap:** Next.js App Router, TypeScript strict, Tailwind CSS, Supabase (Auth, PostgreSQL, pgvector), Google Gemini lewat `@google/genai`.
- **Skema database:** hanya tabel dan kolom yang ada di `docs/TECH_AND_DATABASE.md` (skema v2). **Dilarang mengarang kolom atau tabel baru.**
- **Zero secrets in code:** semua kunci lewat environment variable (`.env.local`).
- **Grounding dan sitasi:** setiap jawaban AI soal regulasi kampus wajib menyertakan sitasi `[1]`, `[2]` dari chunk di Supabase.
- **Isolasi tenant:** query vektor dan RLS wajib memfilter `campus_id` dan `program_id`.
- **UU PDP:** jangan minta NIM atau data pribadi sensitif tanpa kebutuhan jelas. Profil memakai `display_name` pseudonim.
- **UI:** setiap layar menangani state loading, empty, dan error.
- **ORM:** tidak dipakai. Keputusan: tetap `supabase-js`, karena ORM yang konek langsung ke Postgres mem-bypass RLS. Tipe database sebaiknya digenerate dengan `supabase gen types typescript` (belum dilakukan; saat ini `src/types/database.ts` ditulis tangan).

Aturan Git dari `CONTRIBUTING.md`: branch dari `main`, jangan push langsung ke `main`, semua lewat PR, pesan commit memakai Conventional Commits (`feat(scope): ...`, `fix`, `docs`, `chore`, `style`, `refactor`, `test`).

---

## 3. Preferensi kerja pemilik

- Bahasa komunikasi: **Indonesia santai**. Teks **UI memakai bahasa Inggris** (mengikuti referensi desain).
- Ejaan harus benar di kode dan UI: "Knowledge Hub", "My Journey", "Explore" (ref desain punya typo "Knowladge", "Jouney", "Ekplore"; **jangan ditiru**).
- Referensi desain `ref.pdf` adalah patokan visual: warna, font, ukuran teks, dan bentuk komponen dipertahankan persis. Ref memang terlihat seperti dihasilkan AI, jadi hal yang tidak ada di ref (atau yang cacat, mis. kontras rendah) boleh diperbaiki dengan standar rapi, tanpa mengubah identitasnya.
- **Jangan commit atau push kecuali diminta.** Pemilik membuat branch dan PR sendiri.
- Jangan membuat solusi yang berat atau kompleks dulu (lomba).
- Konfirmasi dulu untuk hal yang sulit dibalik atau keluar dari repo (deploy, akun, secret).
- Hook notifikasi toast Windows sudah dipasang di `~/.claude/settings.json` (user level, tidak masuk repo).

---

## 4. Status saat ini

### 4.1 Git

- Branch aktif: `erick/feat-auth-onboarding`.
- Commit terbaru yang ada dan sudah di-push: `9f7bb0a slicing feature` (auth, onboarding, dashboard, deploy-ready). `origin/main` isinya sama dengan `5026b6c`; `de7be1e` hanya mengubah dokumen. Simulasi merge tidak menunjukkan konflik, tetapi jalankan ulang `git fetch` dan cek lagi sebelum PR.
- **BELUM di-commit (24 Nov 2026):** `docs/HANDOFF.md`, `docs/NETTA_SUPABASE_TASKS.md`, perubahan `docs/TECH_AND_DATABASE.md`, `.github/workflows/ci.yml`, `vitest.config.mts`, `package.json` dan lockfile (Vitest), `supabase/patches/`, `supabase/tests/`, UI mock Community, Knowledge Hub, AI Navigator, dan perbaikan UI dari audit. Rencana commit ada di `C:\Users\user\OpenBot\Shared\campus-compass-commit-plan.md` bila sudah dibuat.

### 4.2 Yang sudah selesai dan terverifikasi

| Area | Status | Bukti |
| :--- | :--- | :--- |
| Scaffold Next.js + design system | Selesai | Dilihat di browser (`/design-system`). |
| `tsc`, lint, build produksi | Lolos | Dengan dan tanpa env Supabase. |
| Server produksi dengan env palsu | Lolos smoke test | Health OK, halaman publik 200, route privat redirect ke `/login`, header keamanan muncul. |
| `safeNextPath` (anti open-redirect) | Lolos 10 kasus | Termasuk `//evil.com`, `https://evil.com`, `javascript:`. |
| Wizard onboarding (UI) | Teruji di browser | Validasi, dropdown bertingkat, perpindahan langkah. Memakai data contoh di `/design-system`. |
| Test otomatis (Vitest 4) | 103 test lulus | `safeNextPath`, skema zod onboarding dan experience, logika feed, komentar, filter Knowledge Hub, render komponen. Jalankan `npm test`. |
| UI mock `/community`, `/knowledge`, `/ai-navigator` | Build lolos | **Data mock**, belum query Supabase dan belum dilihat di browser dengan login. `?mock=error` dan `?mock=empty` hanya aktif di non-production. |
| Perbaikan audit UI | Dihitung, belum dirender | `lang="en"`, kontras AA (token baru `brand-700`, perlu approval Rifal), bottom bar 12 px, error Home tidak lagi tersamarkan. Laporan: `Shared/campus-compass-ui-audit.md`. |
| CI GitHub Actions | Belum pernah jalan | `.github/workflows/ci.yml` (Node 20 dan 24). Lolos lokal di Node 24 saja. |
| Patch DB untuk Netta | Draft, belum dijalankan | `supabase/patches/01_*`, `02_*`, `README.md` (31 tes penolakan), `supabase/tests/profiles_tenant.sql`. Tugas Netta: `docs/NETTA_SUPABASE_TASKS.md`. |

### 4.3 Yang BELUM teruji (jangan dianggap beres)

1. **Seluruh alur ke Supabase sungguhan:** daftar, email konfirmasi, login, `upsert` ke `profiles`, redirect ke `/home`. Belum pernah dijalankan karena belum ada `.env.local` dan database belum disiapkan.
2. Apakah policy RLS `Insert own profile student` dan `Update own profile basic` benar-benar mengizinkan `upsert` dari onboarding.
3. Tampilan **mobile** (bottom bar dan menu hamburger): resize window pada alat uji tidak mengubah viewport, jadi belum dilihat.
4. Aplikasi **belum di-deploy** ke Vercel.
5. **Semua patch SQL** (`supabase/patches/`) belum dijalankan ke Postgres mana pun; sintaks baru dibaca manual. Helper dan RPC baru (`is_privileged`, `set_accepted_answer`) perlu disetujui Netta.
6. **Verifikasi domain email terhadap `campuses.domain` belum ada:** mahasiswa bisa memilih kampus mana pun saat onboarding. Perlu keputusan.
7. Halaman dashboard baru belum dilihat di browser (butuh sesi Supabase), termasuk bottom bar di 360 px dan kontras hasil perbaikan.
8. `ref.pdf` tidak ada di repo, jadi kesesuaian desain belum bisa disahkan.

---

## 5. Stack dan versi (terpasang)

| Paket | Versi |
| :--- | :--- |
| Node (lokal) | 24.x (`engines.node >=20.9.0`) |
| Next.js | 16.4.6 (Turbopack) |
| React | 19.3.0 |
| Tailwind CSS | 4.3.3 (`@tailwindcss/turbopack`) |
| TypeScript | ^5, `strict: true` |
| `@supabase/supabase-js` | ^2.119.2 |
| `@supabase/ssr` | ^0.12.7 |
| `zod` | ^4.6.7 |
| `lucide-react` | ^1.79.0 |
| `clsx`, `tailwind-merge`, `class-variance-authority` | helper komponen |

Skrip: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`. Tidak ada skrip test.

Konfigurasi Next (`next.config.ts`): `agentRules: false`, `poweredByHeader: false`, header keamanan, aturan Turbopack untuk CSS. **`cacheComponents` dan `partialPrefetching` sengaja dimatikan** (default scaffold menyalakannya; dimatikan agar sederhana, nanti diketatkan).

---

## 6. Environment variables

Lihat `.env.example` dan `docs/DEPLOYMENT.md` (bagian 1) untuk tabel lengkap.

| Variable | Dipakai sekarang | Sisi |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | Client + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Client + server |
| `NEXT_PUBLIC_APP_URL` | Ya | Client + server (link email, `metadataBase`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Belum | **Server saja** |
| `GEMINI_API_KEY` | Belum | **Server saja** |
| `GEMINI_MODEL`, `GEMINI_EMBEDDING_MODEL` | Belum | Server. Nilai di `.env.example` (`gemini-1.5-flash`, `text-embedding-004`) **mungkin sudah usang**: cek model yang tersedia sebelum slice AI. |

Perilaku tanpa env: `hasSupabaseEnv()` bernilai false bila kosong atau masih berisi placeholder dari `.env.example`. Halaman publik tetap tampil (dengan banner "Supabase is not connected" di login/register), proxy tidak memblokir apa pun, dan server action mengembalikan pesan konfigurasi. `.env.local` belum dibuat (di-ignore git). **Jangan pernah menempelkan nilai asli kunci ke chat atau commit.**

---

## 7. Peta file

```
src/
├── proxy.ts                         # Next 16 "proxy" (pengganti middleware): refresh session + proteksi route
├── app/
│   ├── layout.tsx                   # Root: font Poppins, metadataBase (getAppUrl), lang="en"
│   ├── globals.css                  # Design tokens + utilitas tipografi (text-h1..text-caption)
│   ├── page.tsx                     # Landing sederhana (navbar gelap + hero)
│   ├── not-found.tsx, error.tsx     # 404 dan error boundary global
│   ├── design-system/page.tsx       # Showcase semua komponen + wizard (data contoh). noindex.
│   ├── (auth)/                      # layout kartu tengah
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── auth/callback/route.ts       # Tukar ?code= jadi session (konfirmasi email)
│   ├── onboarding/                  # DI LUAR (dashboard): tanpa sidebar
│   │   ├── page.tsx                 # Server: muat campuses/faculties/programs, tangani error/empty
│   │   └── actions.ts               # completeOnboardingAction (validasi + upsert profiles)
│   ├── (dashboard)/
│   │   ├── layout.tsx               # Cek login + onboarding_completed; sidebar desktop + bottom bar mobile
│   │   ├── loading.tsx              # Skeleton
│   │   └── home/page.tsx            # Sapaan, fokus pengguna, placeholder My Journey (#my-journey)
│   └── api/health/route.ts          # Smoke check deploy (tanpa nilai rahasia)
├── components/
│   ├── ui/                          # button, icon-button, chip(+FilterChips), search-bar, guide-card,
│   │                                # field, input, select, checkbox, choice-card, alert
│   ├── layout/                      # navbar, sidebar, bottom-nav, logo, nav-items
│   ├── auth/                        # login-form, register-form, password-input
│   └── onboarding/onboarding-form.tsx   # Wizard 3 langkah (client)
├── lib/
│   ├── utils.ts                     # cn() dengan extendTailwindMerge (lihat gotcha #1)
│   ├── app-url.ts                   # getAppUrl(): NEXT_PUBLIC_APP_URL > VERCEL_URL > localhost
│   ├── auth/actions.ts              # signInAction, signUpAction, signOutAction ("use server")
│   ├── auth/redirect.ts             # safeNextPath()
│   ├── constants/onboarding.ts      # ADAPTATION_AREAS, MAIN_CHALLENGES, rentang semester
│   ├── supabase/{env,client,server,proxy}.ts
│   └── validation/{auth,onboarding}.ts   # Skema zod + tipe FormState
└── types/database.ts                # Tipe baris (tulis tangan): Campus, Faculty, Program, Profile
supabase/seed.sql                    # Data SINTETIS (1 kampus, 2 fakultas, 3 prodi), idempoten
docs/DEPLOYMENT.md, docs/HANDOFF.md
```

`public/*.svg` adalah aset bawaan scaffold Next yang tidak dipakai (boleh dihapus).

---

## 8. Design system

Sumber: `ref.pdf` (halaman 1 dan panel kiri halaman 2 adalah spesifikasi; sisanya moodboard inspirasi dari produk lain).

**Token** (`src/app/globals.css`):

| Token | Hex | Catatan |
| :--- | :--- | :--- |
| `brand-950` | `#04202e` | Teks utama, navbar gelap |
| `brand-900` | `#0a3c55` | |
| `brand-800` | `#0f5d83` | Teks sekunder (kontras baik di putih) |
| `brand-600` | `#1786b4` | Primer. **Jangan dipakai sebagai teks kecil di putih** (kontras sekitar 4.1:1). |
| `brand-400` | `#4fb2db` | |
| `brand-300` | `#98d4ee` | |
| `brand-100` | `#e1f2fa` | |

**Tipografi** (Poppins 400, 500, 600, 700 via `next/font/google`), utilitas kustom:

| Kelas | Ukuran / line-height | Bobot |
| :--- | :--- | :--- |
| `text-h1` | 32 / 40 | Bold |
| `text-h2` | 26 / 34 | SemiBold |
| `text-h3` | 20 / 28 | SemiBold |
| `text-h4` | 16 / 24 | Medium |
| `text-h5` | 14 / 20 | Medium |
| `text-body` | 14 / 22 | Regular |
| `text-caption` | 12 / 18 | Regular |

Bayangan: `shadow-card`, `shadow-nav`. Latar halaman: gradien `brand-100` ke putih.

**Navigasi** (`nav-items.ts`): Home `/home`, Community `/community`, Knowledge Hub `/knowledge`, My Journey `/home#my-journey` (anchor di Home, sesuai keputusan 4 modul), AI Navigator `/ai-navigator`. Sidebar dan bottom bar membaca daftar yang sama.

**Aturan membuat komponen baru:** pakai token di atas (tanpa warna atau ukuran font ad-hoc), `cn()` dari `@/lib/utils`, state hover/focus-visible/disabled, `aria-*` yang benar, dan tambahkan ke `/design-system`.

**Placeholder yang perlu diganti:** logo (ref hanya punya tulisan "LOGO"; saat ini wordmark dengan ikon kompas) dan gambar `GuideCard` (saat ini gradien).

---

## 9. Arsitektur auth dan session

### 9.1 Alur

1. **Register** (`/register`): input `displayName` (pseudonim), `email`, `password`, centang privacy. Validasi `zod` di server. `signUp` mengirim `display_name` ke `user_metadata`. `emailRedirectTo` = `{getAppUrl()}/auth/callback?next=/onboarding`.
   - Jika konfirmasi email **mati**: `data.session` ada, langsung redirect `/onboarding`.
   - Jika **nyala**: tampil pesan "cek email".
2. **Callback** (`/auth/callback`): `exchangeCodeForSession(code)`, redirect ke `next` (lewat `safeNextPath`), gagal ke `/login?error=auth`.
3. **Login** (`/login`): `signInWithPassword`. Semua kegagalan memberi pesan sama ("Invalid email or password.") agar tidak membocorkan email terdaftar. Hormati `?next=` yang sudah disaring.
4. **Onboarding** (`/onboarding`): lihat bagian 10.
5. **Dashboard** (`(dashboard)/layout.tsx`): `getUser()`; tanpa user redirect `/login`; profil tidak ada atau `onboarding_completed = false` redirect `/onboarding`; error query profil menampilkan state error (bukan redirect, agar tidak berputar).
6. **Logout**: `signOutAction` (server action) lalu redirect `/login`.

### 9.2 Proxy (`src/proxy.ts`, logika di `lib/supabase/proxy.ts`)

- Refresh cookie session di setiap request, memakai `getUser()` (memvalidasi token, bukan `getSession()`).
- Publik: `/`, `/design-system`, `/api/health`, `/login`, `/register`, dan `/auth/*`.
- Belum login membuka halaman lain: redirect `/login?next=...`. Sudah login membuka `/login` atau `/register`: redirect `/home`.
- Tanpa env Supabase: proxy meneruskan request apa adanya.
- Konsekuensi: halaman tak dikenal saat belum login dialihkan ke `/login` (bukan 404). Halaman 404 terlihat oleh user yang sudah login.
- Matcher mengecualikan `_next/static`, `_next/image`, `favicon.ico`, dan gambar.

### 9.3 Klien Supabase

- `lib/supabase/server.ts`: `createServerClient` dengan cookie dari `next/headers` (async di Next 16). Dipakai di Server Component, Server Action, Route Handler.
- `lib/supabase/client.ts`: `createBrowserClient`. Belum dipakai di komponen mana pun.
- Hanya **anon key**. Service role belum dipakai dan **tidak boleh** dipakai di jalur request pengguna.

---

## 10. Onboarding

- Server memuat `campuses` (`is_active = true`), `faculties`, `programs`. Error query: tampil Alert error. Kosong: tampil empty state "No campuses yet".
- Wizard 3 langkah (client): **Campus** (kampus, fakultas, prodi bertingkat; kampus otomatis terpilih jika hanya satu), **Semester** (1 sampai 14), **Focus** (area adaptasi dan tantangan utama).
- Nilai area dan tantangan berupa **token terkategori**, bukan teks bebas (menjaga data sensitif tidak masuk profil):
  - `adaptation_area`: `academic`, `social`, `administrative`, `personal`, `facilities`, `opportunity`.
  - `main_challenge`: `time_management`, `study_methods`, `finding_friends`, `joining_organizations`, `administrative_procedures`, `campus_facilities`, `scholarships_competitions`, `career_preparation`.
- `completeOnboardingAction`:
  1. Validasi `zod` (UUID, enum, semester).
  2. `getUser()`; tanpa user redirect `/login`.
  3. **Verifikasi rantai** `programs.id = programId AND campus_id = campusId AND faculty_id = facultyId` (RLS tidak memeriksa ini; mencegah id lintas kampus).
  4. `profiles.upsert({ id, campus_id, faculty_id, program_id, display_name, semester, adaptation_area, main_challenge, onboarding_completed: true })`. **`role` sengaja tidak dikirim** (default `'student'`; trigger `trg_protect_profile_update` mencegah user mengubahnya).
  5. `display_name` diambil dari `user_metadata.display_name`, fallback `"Mahasiswa"`.
  6. Sukses redirect `/home`.
- `entry_year` tidak dikumpulkan (minimalisasi data).

---

## 11. Database

Skema lengkap ada di `docs/TECH_AND_DATABASE.md`. **Tabel yang disentuh kode saat ini:** `campuses`, `faculties`, `programs`, `profiles` (baca dan tulis). Belum ada kode untuk tabel lain.

**Masalah dan celah yang diketahui (belum diperbaiki, perlu keputusan dengan Netta):**

1. **Urutan DDL salah:** `CREATE TABLE public.bookmarks` mereferensi `public.guides` yang dibuat setelahnya, sehingga DDL gagal bila dijalankan berurutan. Solusi: pindahkan `guides` ke atas `bookmarks`.
2. **Dokumen tidak konsisten:** teks menyebut "13 tabel" di satu tempat dan "12 tabel" di tempat lain; daftar `ALTER TABLE ... ENABLE RLS` ada 13.
3. **Slice Community akan butuh logika yang belum ada di DDL:**
   - Tidak ada trigger atau fungsi yang menaikkan/menurunkan `helpful_count` saat baris `votes` dibuat atau dihapus.
   - Trigger anti-tampering hanya berjalan pada `INSERT`; policy `Update own post`/`Update own comment` mengizinkan penulis mengubah kolomnya sendiri, **termasuk `helpful_count`**, lewat `UPDATE`.
   - Tidak ada mekanisme menandai `is_accepted_answer` / `has_accepted_answer` (hanya penanya yang berhak, dan harus konsisten).
   - Fungsi, trigger, atau RPC bukan "tabel atau kolom baru", tetapi tetap perlu disepakati dengan pemilik database sebelum ditambahkan.
4. Data awal belum ada di database: jalankan `supabase/seed.sql` (sintetis; ganti dengan kampus pilot nyata sebelum pilot publik).

**Kebijakan RLS yang relevan** (ringkas): data akademik (`campuses`, `faculties`, `programs`, `journey_steps`) bisa dibaca publik; `profiles` hanya satu kampus atau diri sendiri; `posts`/`comments`/`experiences` dibatasi per kampus pengguna; `votes`, `bookmarks`, `user_journey_progress` privat per user; `guides` hanya yang `is_published` dan umum atau sekampus; `content_chunks` umum atau sekampus.

**Anonimitas:** baca post dan komentar lewat view `v_posts` dan `v_comments` (mask `author_id` untuk konten anonim), bukan tabel langsung.

---

## 12. Pelajaran teknis (gotcha)

1. **`cn()` dan kelas `text-h*`:** `tailwind-merge` standar menganggap `text-h4`/`text-h5` sebagai kelas *warna* dan menghapus `text-white`. Itu sebabnya `lib/utils.ts` memakai `extendTailwindMerge` dengan grup `font-size`. Jangan kembalikan ke `twMerge` biasa. Bila menambah utilitas tipografi baru, daftarkan juga di sana.
2. **Tombol di wizard onboarding:** "Continue" (`type=button`) dan "Finish" (`type=submit`) menempati posisi yang sama. Tanpa `key` berbeda React memakai ulang satu elemen DOM dan mengubah tipenya menjadi `submit` di tengah klik, sehingga form ter-submit sendiri. Selalu beri `key` berbeda pada tombol yang bertukar tipe.
3. **`next dev` menulis ke `AGENTS.md`:** Next 16 menambahkan blok aturan otomatis. Sudah dimatikan lewat `agentRules: false`. Bila `git diff AGENTS.md` tidak kosong, kembalikan (`git checkout -- AGENTS.md`) dan periksa konfigurasi.
4. **Next 16:** pakai `src/proxy.ts` dengan `export function proxy` (bukan `middleware`). `cookies()` dan `headers()` async. Tipe `PageProps<"/path">` dan `LayoutProps<"/path">` bersifat global tetapi baru ada setelah `npx next typegen` (otomatis saat `dev`/`build`). Dokumentasi resmi versi ini ada lokal di `node_modules/next/dist/docs/`.
5. **Halaman bergantung session** harus `export const dynamic = "force-dynamic"` (sudah di `(dashboard)/layout.tsx` dan `onboarding/page.tsx`). Tanpa itu build mencoba prerender dan gagal bila env kosong.
6. **`NEXT_PUBLIC_*`** ditanam saat build: mengubah nilainya di Vercel butuh redeploy. Variabel itu harus dirujuk secara literal (`process.env.NEXT_PUBLIC_X`).
7. **`z.flattenError(error).fieldErrors`** (zod 4) dipakai untuk error per kolom; `z.email()` dan `z.uuid()` adalah bentuk zod 4.
8. **Server Action boleh dikirim sebagai prop** ke Client Component (dipakai untuk `Sidebar.onLogout`).
9. **PowerShell:** hindari `2>&1` pada perintah native; di environment ini shell utama PowerShell, Bash (Git Bash) juga tersedia. `jq` tidak terpasang.
10. **Pengujian browser:** ubah ukuran window tidak mengubah viewport mobile pada alat uji. Untuk uji mobile gunakan DevTools device mode manual.

---

## 13. Keputusan yang sudah diambil (dan alasannya)

| Keputusan | Alasan |
| :--- | :--- |
| 4 modul, My Journey di dalam Home | Sudah distandarkan di repo (`a6bf073`). |
| My Journey di nav menuju `/home#my-journey` | Menu tetap tampil seperti ref, tanpa membuat modul kelima. |
| Tanpa ORM; `supabase-js` + tipe digenerate | ORM langsung ke Postgres mem-bypass RLS; fitur view, RPC, pgvector kurang cocok. |
| Onboarding di `/onboarding`, di luar `(dashboard)` | Tidak ingin sidebar tampil saat onboarding. Sedikit berbeda dari struktur di dokumen. |
| `cacheComponents` dan `partialPrefetching` mati | Hindari kompleksitas sebelum fungsi jalan (permintaan pemilik). |
| Pesan gagal login seragam | Tidak membocorkan email terdaftar. |
| `role` tidak pernah dikirim dari klien | Dilindungi trigger; default `'student'`. |
| Nilai area/tantangan berupa token terkategori | Mencegah data sensitif bebas-teks di profil (UU PDP). |
| Verifikasi rantai kampus-fakultas-prodi di server | RLS tidak mengecek konsistensi ini. |
| Teks UI bahasa Inggris | Mengikuti `ref.pdf`. |
| Seed hanya data sintetis | `CONTRIBUTING.md`: data sintetis tidak boleh bercampur dengan riset atau produksi. |

---

## 14. Perintah berguna

```bash
npm install
npm run dev                  # http://localhost:3000
npm run lint
npx tsc --noEmit
npx next typegen             # buat tipe route global (PageProps/LayoutProps)
npm run build
npx next start -p 3101       # server produksi lokal (setelah build)
git diff -- AGENTS.md        # harus kosong
git status --short
```

Halaman untuk dicek manual: `/design-system`, `/`, `/login`, `/register`, `/api/health`.

---

## 15. Backlog

### 15.1 Harus dilakukan pemilik (tidak bisa dilakukan agen)

- [ ] Buat `.env.local` dari `.env.example` dan isi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Isi sendiri; jangan tempel ke chat.
- [ ] Perbaiki urutan DDL (bagian 11, poin 1) lalu jalankan skema v2 di Supabase.
- [ ] Jalankan `supabase/seed.sql`.
- [ ] Supabase Auth: tambahkan `/auth/callback` (production dan `http://localhost:3000`) ke Redirect URLs; atur Site URL; putuskan konfirmasi email nyala atau mati.
- [ ] Tes alur nyata: daftar, (konfirmasi email), onboarding, `/home`, logout. **Tempel pesan error Supabase bila ada.**
- [ ] Merge PR, buat proyek Vercel, isi env, redeploy setelah `NEXT_PUBLIC_APP_URL` diketahui, lalu jalankan smoke test di `docs/DEPLOYMENT.md`. Cek batasan paket Vercel (repo organisasi dan penggunaan non-komersial) di dokumentasi resmi.

### 15.2 Kode

- [ ] Halaman `/community`, `/knowledge`, `/ai-navigator` (menu ke sana masih 404).
- [ ] Halaman kebijakan privasi (teks persetujuan di register saat ini hanya teks biasa).
- [ ] Ganti logo dan gambar kartu dengan aset asli.
- [ ] Uji tampilan mobile.
- [ ] Generate `src/types/database.ts` dari skema (`supabase gen types typescript`).
- [ ] Tambah test otomatis (belum ada), minimal untuk `safeNextPath`, skema validasi, dan alur penting.
- [ ] Hapus aset `public/*.svg` bawaan yang tidak dipakai.
- [ ] Setelah fungsi jalan: nyalakan kembali `cacheComponents` dan `partialPrefetching`, dan evaluasi CSP.
- [ ] Cek model Gemini yang masih tersedia dan perbarui `.env.example`.
- [ ] Edit profil (blueprint: pengguna bisa memperbarui profil kapan saja).

---

## 16. Rencana slice berikutnya

Urutan mengikuti prioritas blueprint (P0 lalu P1). Setiap slice: **satu branch fokus**, satu PR, diverifikasi dengan checklist bagian 17.

### Slice 2 - Community (P0)

- **Baca:** feed dari view `v_posts`, detail post dengan komentar dari `v_comments`. Mode urutan: For You, New, Helpful, Unanswered. Filter tipe, topik, status jawaban.
- **Tulis:** buat post (tipe `question`, `experience`, `guide`, `opportunity`; judul, isi, kategori, tag, opsi anonim), komentar bertingkat (`parent_comment_id`), helpful vote (`votes`), accepted answer, bookmark (`bookmarks`), report.
- **Wajib diputuskan dengan Netta dulu:** mekanisme `helpful_count` dan accepted answer (bagian 11, poin 3), tanpa menambah tabel/kolom baru.
- UI: `PostCard`, `PostFilter`, `CommentThread`, `HelpfulButton` (lihat struktur di `docs/TECH_AND_DATABASE.md` bagian 6). Pakai komponen yang sudah ada.
- Semua query sudah dibatasi per kampus oleh RLS; tetap isi `campus_id` dari profil pengguna di server, jangan dari input klien.

### Slice 3 - Knowledge Hub (P0/P1)

- 6 kategori panduan (`academic_survival`, `social_community`, `administrative_guide`, `campus_essentials`, `scholarship_growth`, `career_preparation`) dari tabel `guides` (hanya `is_published = true`), label sumber dan `last_verified_at`.
- Form pengalaman senior terstruktur ke tabel `experiences` (situasi, tantangan, solusi, hasil, saran). Label "personal experience", bukan fakta resmi.
- Pencarian dasar dan filter prodi atau semester.

### Slice 4 - AI Navigator (P1)

- Pipeline: seed konten, chunking, embedding 768 dimensi, simpan di `content_chunks`, RPC `match_campus_chunks`, generate dengan Gemini (`@google/genai`), tampilkan **source cards** dan sitasi `[1]`, `[2]`.
- Aturan dari blueprint: hanya konten published dan diizinkan; jangan kutip draft/reported/removed/private; bila bukti tidak cukup, jawab bahwa informasi belum tersedia dan arahkan ke komunitas atau kanal resmi; jangan mengarang tanggal, syarat, atau prosedur; bedakan sumber resmi dari pengalaman.
- Mulai dari Knowledge Hub dan beberapa pengalaman senior terkurasi; **jangan langsung mengindeks seluruh feed**.
- Kunci Gemini dan service role hanya di server. Cek ketersediaan model dulu.
- Endpoint streaming sesuai struktur di dokumen: `src/app/api/rag/query/route.ts`.

### Slice 5 - Home dan My Journey (P1)

- Rekomendasi rule-based berdasarkan `adaptation_area`, `main_challenge`, `program_id`, `semester`.
- Roadmap dari `journey_steps` (6 tahap) dan progres di `user_journey_progress` (status `not_started`, `in_progress`, `completed`, `skipped`; refleksi singkat).
- Persentase progres hanya mencerminkan checklist, **jangan disajikan sebagai skor kesehatan mental atau keberhasilan studi**.
- Ganti placeholder My Journey di `/home` (`id="my-journey"`).

### Setelahnya

Moderasi dasar (report dan antrean), notifikasi, peer connection, dan fitur P2 hanya bila waktu memungkinkan.

---

## 17. Checklist sebelum menyatakan "selesai"

1. `npx tsc --noEmit` dan `npm run lint` bersih; `npm run build` lolos.
2. `git diff -- AGENTS.md` kosong.
3. Tidak ada secret di file yang di-track (`git grep` pola kunci; `.env.local` tidak ter-track).
4. Fitur yang berubah **dilihat dan diklik di browser**, bukan hanya build lolos. Cek juga state loading, empty, dan error.
5. Bila menyentuh database: tabel dan kolom sesuai `docs/TECH_AND_DATABASE.md`; filter `campus_id` dan `program_id` ada; validasi dilakukan di server.
6. Jelaskan dengan jujur apa yang **belum** teruji (mis. belum dijalankan ke Supabase sungguhan).
7. Jangan commit atau push tanpa diminta pemilik.
