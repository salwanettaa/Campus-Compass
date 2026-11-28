# Campus Compass — Development Plan & Handoff Guide

> **Kompetisi**: STACK 2026 by GDGoC ITB — *Case 1: Smarter Campus and Learning*  
> **Tim**: Nanti Makan Sushi (Salwanetta Jauza Y, Kalya Andriana, Rifaludin, Erick)  
> **Pilot**: Universitas Gadjah Mada (UGM) — Sekolah Vokasi D4 Teknologi Rekayasa Internet (TRI)  
> **Baseline Commit `main`**: `2d68673` (per 28 Nov 2026 — synced through PR #16)

Dokumen ini menjadi panduan eksekusi untuk member atau AI coding agent berikutnya agar pengembangan aplikasi **sinkron dengan Abstract Preliminary**, **mematuhi aturan tahapan STACK 2026**, dan **tetap menyisakan *meaningful development* untuk Final Day**.

---

## 0. Status Baseline Saat Ini

| Area | Status Saat Ini | Lokasi Kode Utama |
| :--- | :--- | :--- |
| **Auth & Onboarding** | ✅ Live Supabase (`profiles`, `campuses`, `faculties`, `programs`) — **5 `adaptation_area`** (`social`, `academic`, `internship`, `scholarship`, `competition`); Patch 03 disiapkan untuk Pra-Final | `src/lib/auth/`, `src/app/onboarding/page.tsx` |
| **Knowledge Hub** | ✅ Live Supabase (`guides`, `bookmarks`) — `16` verified official UGM guides + `2` `[Sample]` cross-program guides (`18` total) + fallback sample, UI Split-Rail & scope/category filter sudah jalan; *Senior Experiences* telah dihapus dari Knowledge Hub dan dipusatkan ke Community (PR #15 & PR #16) | `src/app/(dashboard)/knowledge/`, `src/lib/knowledge/` |
| **Home, `My Journey` & `My Tasks`** | ✅ Rule-based `personalizeJourney()` (`adaptation_area` + `main_challenge`), checklist + notes, reflections, `My Tasks`, & `Saved Items` (Patch `04` & `05`); **roadmap masih hardcoded** di `roadmap-data.ts` (belum pakai `journey_steps` per `campus_id`/`program_id`/`semester` & belum auto-recommend `guides`) | `src/app/(dashboard)/home/page.tsx`, `src/app/(dashboard)/journey/page.tsx`, `src/lib/journey/`, `src/lib/tasks/` |
| **Community** | 🟡 Interactive UI Preview (Live Viewer Profile + Mock Feed) | Profil user (`display_name`, kampus, prodi) ditarik dari Supabase; UI feed & diskusi (`CommunityHub`, `PostComposer`, `ThreadModal`, `CreateCommunityModal`, toggle `Post as Anonymous` & `Reply as Anonymous`, filter komunitas) sudah interaktif berbasis mock state (`src/lib/community/social-mock-data.ts`) — live DB persistence (`v_posts`, `v_comments`) masuk Fase Pra-Final | `src/lib/community/`, `src/components/community/`, `src/app/(dashboard)/community/` |
| **AI Navigator** | 🟡 Interactive UI preview (`SampleChat`, *"Demo, not live"*, 4 skenario & `?q=` handoff); belum terhubung ke Gemini API / `content_chunks` (target Pra-Final) | `src/app/(dashboard)/ai-navigator/page.tsx`, `src/components/ai-navigator/` |
| **Database & Security** | ✅ Schema V2 + Patch `01` & `02` terpasang di Supabase Cloud; Patch `04` (`04_journey_and_tasks.sql`) & `05` (`05_checklist_notes.sql`) tersedia di repo (pastikan sudah di-apply di SQL Editor) | `docs/TECH_AND_DATABASE.md`, `supabase/patches/` |

### Aturan Wajib Sebelum Mengubah Kode
1. **Branching**: Selalu mulai dari `main` terbaru dan buat branch sesuai fitur (`feat/...`, `fix/...`), jangan push langsung ke `main` (`CONTRIBUTING.md`):
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/nama-fitur
   ```
2. **Skema & Keamanan (`AGENTS.md`)**: Gunakan hanya tabel, view, dan kolom yang ada di `docs/TECH_AND_DATABASE.md` (`v_posts`, `v_comments`, `votes`, `guides`, `bookmarks`, `experiences`, `journey_steps`, `user_journey_progress`, `content_chunks`). Dilarang membuat tabel/kolom liar, dilarang meminta NIM/nama lengkap asli (UU PDP), dan `campus_id` / `program_id` / `author_id` pada mutasi wajib diambil dari session server + `profiles`.
3. **Design System & UI Skills (`AGENTS.md` & `docs/DESIGN_SYSTEM.md`)**:
   - Pakai hanya token di `src/app/globals.css` (`brand-950`, `900`, `800`, `700`, `600`, `400`, `300`, `100`, `paper`, `paper-raised`, `route`).
   - Dilarang menambah shadow pada kartu biasa, dilarang memakai token non-eksisten (seperti `brand-200`, `brand-500`), dan dilarang memakai emoji pada kontrol UI (pakai `lucide-react`).
   - Wajib baca `.agents/skills/baseline-ui/SKILL.md` dan skill `better-*` sebelum edit UI.
4. **Kepatuhan Handbook STACK 2026**:
   - Semua submission tertulis (Proposal, Video, Deck, Pitching) dan UI utama memakai **Bahasa Inggris** (data panduan kampus lokal berbahasa Indonesia harus dijelaskan konteksnya).
   - Data simulasi/mockup & fitur yang belum selesai wajib **diberi label jujur** di UI.
   - Catat semua bantuan AI (*vibe coding*) di Proposal dan `README.md`.

---

## 1. Fase Semifinal (`Deadline: 30 Nov 2026`)
**Target Produk**: Menuntaskan janji **Abstract Week 1** (*core auth, profile, community feed*) + **Knowledge Hub Live Data** + **UI Preview Jujur** untuk fitur yang belum live (*Progress Honesty = 20%* di rubrik video).

### Task 1.1 — Seed Data Lengkap UGM & D4 TRI ke Supabase Cloud
- **Owner**: Netta / Rifal
- **Langkah**:
  1. Jalankan [`supabase/seed_ugm_pilot.sql`](../supabase/seed_ugm_pilot.sql) di **Supabase SQL Editor** agar `campuses` (UGM), `faculties` (SV, FT, FEB), `programs` (`TRI`, `TRPL`, `TI`, `MN`), dan `guides` masuk ke DB.
  2. Pastikan isi `guides` mencakup **minimal 2 panduan per kategori (12–18 panduan)** di 6 kategori (`academic_survival`, `social_community`, `administrative_guide`, `campus_essentials`, `scholarship_growth`, `career_preparation`) — seluruh cerita pengalaman mahasiswa diarahkan ke modul Community (`posts`).
  3. *(Persiapan Fase 2)* Siapkan seed awal `posts` dan `comments` untuk UGM D4 TRI agar halaman Community langsung terisi saat disambungkan ke Supabase di Pra-Final.
- **Definition of Done**: Banner di bawah `/knowledge` menampilkan `Connected to Universitas Gadjah Mada.` (bukan lagi sample fallback).

### Task 1.2 — Pembatasan Auth Email Kampus + Akun Demo
- **Owner**: Netta
- **Langkah**:
  1. Jalankan [`supabase/patches/03_campus_domain_check.sql`](../supabase/patches/03_campus_domain_check.sql) di Supabase SQL Editor (atau pastikan domain `ugm.ac.id` / `mail.ugm.ac.id` tervalidasi saat registrasi & onboarding).
  2. Tambahkan validasi pesan error yang jelas pada `src/lib/validation/auth.ts` & form Register (`src/components/auth/register-form.tsx`) agar pendaftar dengan email non-kampus langsung mendapat arahan sebelum submit.
  3. **Penting untuk juri**: Jika `Confirm email` dinyalakan lagi (karena Patch 03 mengecek `email_confirmed_at IS NOT NULL`), buat **1–2 akun demo pre-confirmed** di Supabase Auth dan cantumkan kredensial aksesnya secara aman di catatan submission (jangan pernah commit password/token ke Git!).

### Task 1.3 — Interactive UI Preview `Community` (Selesai di Kode — PR #14 `e663e76` & PR #15 `57ce0e5`)
- **Owner**: Kalya (`feat/community-preview` / `update-community`)
- **Status**: ✅ Selesai di kode sebagai interactive UI preview berlabel jujur (live DB read/write untuk `posts` & `comments` dijadwalkan di **Fase Pra-Final** Task 2.0).
- **Cakupan yang sudah jalan**:
  1. **Live Viewer Profile**: Halaman `/community` menarik `display_name`, kampus, dan jurusan user yang login dari Supabase (`profiles`, `campuses`, `programs`).
  2. **Interactive Feed & Filters**: `CommunityHub` menampilkan filter komunitas/scope, pencarian, Create Post (`PostComposer`), balasan thread (`ThreadModal`), like/bookmark state lokal, serta modal `CreateCommunityModal` berbasis `MOCK_SOCIAL_POSTS` & `MOCK_SOCIAL_COMMUNITIES`.
  3. **Anonymous Mode**: Pengguna bisa memilih **Post as Anonymous** saat membuat postingan dan **Reply as Anonymous** saat membalas pertanyaan di `ThreadModal`.

### Task 1.4 — Home, `My Journey` & `My Tasks` (Selesai di Kode — PR #13 `8452f72`)
- **Owner**: Erick (UI/UX) & Kalya (Frontend Integration)
- **Status**: ✅ Selesai di kode (`src/app/(dashboard)/journey/page.tsx`, `src/app/(dashboard)/home/page.tsx`, `src/components/tasks/my-tasks-panel.tsx`).
- **Cakupan**:
  1. Memperbarui `adaptation_area` menjadi 5 area (`social`, `academic`, `internship`, `scholarship`, `competition`) dan menyediakan rule-based `personalizeJourney()` berbasis `adaptation_area` + `main_challenge`.
  2. Menambahkan `My Journey` (checklist interaktif, personal notes per item, reflection note), `My Tasks` (personal task board yang bisa ditautkan ke item journey), dan `Saved Items` (bookmark Knowledge Hub + saved Community posts) di `Home`.
  3. **Wajib sebelum demo**: Jalankan [`supabase/patches/04_journey_and_tasks.sql`](../supabase/patches/04_journey_and_tasks.sql) dan [`supabase/patches/05_checklist_notes.sql`](../supabase/patches/05_checklist_notes.sql) di **Supabase SQL Editor** agar tabel `journey_checklist_progress`, `journey_reflections`, dan `user_tasks` aktif (`schemaReady = true`).
  4. **Batasan jujur untuk Semifinal**: Konten langkah roadmap masih statis di `src/lib/journey/roadmap-data.ts` (belum dinamis per `campus_id`/`program_id`/`semester` dari tabel `journey_steps` dan belum otomatis merekomendasikan panduan Knowledge Hub).

### Task 1.5 — Interactive UI Preview `AI Navigator` (Selesai — `feat/ai-navigator-preview`)
- **Status**: ✅ Selesai (preview interaktif berlabel jujur `"Demo, not live"` tanpa panggilan Gemini API/backend dulu).
- **Cakupan**:
  - Pilihan 4 skenario pertanyaan kampus (termasuk SOP Lab Jaringan D4 TRI, Magang 6 Bulan & Sertifikasi, dan skenario *insufficient evidence* $\rightarrow$ *Ask in Community*).
  - Menangkap parameter `?q=` dari tombol `Ask AI` di Knowledge Hub dan memperbarui panel `Sources` `[1]`, `[2]` secara dinamis.

### Task 1.6 — Deliverables Non-Kode Semifinal (`30 Nov`)
- **Proposal (PDF, maks 10 halaman konten, Bahasa Inggris)** + **Signed Declaration of Originality** (`s.id/DeclarationOfOriginalitySTACK2026`).
- **Video Demo (maks 2 menit, 1080p, Bahasa Inggris)**:
  - Tunjukkan live flow: Onboarding (5 area) $\rightarrow$ Home (`My Tasks`, `Saved Items`) $\rightarrow$ `My Journey` (rule-based checklist + notes + reflections) $\rightarrow$ Knowledge Hub.
  - Tunjukkan preview jujur Community (atau live jika sudah merge) & AI Navigator sambil menjelaskan secara jujur fitur yang sudah selesai vs rencana Pra-Final & Final Day (*Progress Honesty = 20%*).

---

## 2. Fase Pra-Final (`7–16 Dec 2026` — *Partially Developed Prototype*)
**Target Produk**: Menyambungkan **Community ke Supabase Live**, mengimplementasikan **Abstract Week 2** (*Gemini API RAG Integration*), dan menjalankan **Pilot Trial Awal** untuk validasi, sambil **tetap menyimpan 3 tugas substantif untuk Final Day (`19 Dec`)**.

### Task 2.0 — Sambungkan `Community` ke Supabase (Live Read + Write)
- **Owner**: Kalya (`feat/community-live`) & Netta
- **Kontrak yang sudah ada**: `src/lib/community/types.ts` (mirror kolom `v_posts`, `v_comments`), `supabase/patches/02_community_helpful_accepted.sql` (`trg_votes_sync_helpful_count`, `set_accepted_answer()`).
- **Langkah**:
  1. Ubah `listFeed()` dan `getThread()` di `src/lib/community/data.ts` untuk query `v_posts` (`status = 'published'`), filter scope (`General` / `campus_id` / `program_id`), hitung `commentCount` dari `v_comments`, dan cek `votes` user login.
  2. Buat Server Actions di `src/lib/community/actions.ts` dengan validasi Zod + cek PII (`src/lib/validation/personal-data.ts`): `createPostAction`, `createCommentAction`, `toggleVoteAction`, `acceptAnswerAction` (`set_accepted_answer` RPC).
  3. Hubungkan form Create Post, Reply Comment, dan `HelpfulButton` yang sudah dibuat di Task 1.3 ke Server Actions Supabase.

### Task 2.1 — Ingestion `content_chunks` & Embeddings
- **Owner**: Netta & Erick
- **Langkah**:
  1. Buat script ingestion server-only (misal `scripts/ingest-chunks.ts`, tidak dijalankan di browser) yang memecah isi `guides` dan `experiences` terverifikasi menjadi chunk teks (`public.content_chunks`).
  2. Generate vector embedding menggunakan `GEMINI_API_KEY` dan `GEMINI_EMBEDDING_MODEL=text-embedding-004` (`768` dimensi sesuai skema `content_chunks` di `docs/TECH_AND_DATABASE.md`).
  3. Pastikan setiap baris `content_chunks` mengisi `campus_id`, `program_id`, `is_general`, serta `guide_id` / `experience_id` dengan benar agar isolasi tenant tetap ketat.

### Task 2.2 — Live `AI Navigator` (Gemini RAG + Source Citations)
- **Owner**: Erick (`feat/ai-navigator`) & Netta
- **Kontrak DB**: RPC `public.match_campus_chunks(query_embedding, p_campus_id, p_program_id, match_threshold, match_count)` di `docs/TECH_AND_DATABASE.md`.
- **Langkah**:
  1. Install `@google/genai` dan pastikan `GEMINI_API_KEY` hanya dibaca di server (API Route `src/app/api/ai-navigator/route.ts` atau Server Action).
  2. Alur request AI Navigator:
     - Ambil `campus_id` dan `program_id` user dari session + `profiles` di server.
     - Embed pertanyaan user dengan `text-embedding-004`, lalu panggil `match_campus_chunks` dengan `p_campus_id` & `p_program_id` milik user.
     - Jika chunk relevan ditemukan: kirim pertanyaan + konteks chunk ke `gemini-1.5-flash` dengan prompt ketat untuk **wajib menyertakan sitasi `[1]`, `[2]`** dan dilarang mengarang di luar konteks.
     - Jika tidak ada chunk di atas threshold: kembalikan respon jujur (*insufficient evidence*) agar AI tidak berhalusinasi.
  3. Perbarui `src/app/(dashboard)/ai-navigator/page.tsx` menjadi antarmuka chat interaktif yang membaca query `?q=` (dari tombol `Ask AI` di Knowledge Hub) dan merender **Source Cards** yang bisa diklik langsung ke `/knowledge/[guide_id]`.

### Task 2.3 — Uji Coba Pilot Awal (*Validation & Impact*)
- **Owner**: Seluruh Tim (Rifal, Netta, Kalya, Erick)
- **Langkah**:
  1. Deploy preview/staging ke Vercel dengan env lengkap.
  2. Minta 5–10 mahasiswa/maba (prioritas UGM D4 TRI) mencoba mencari 2–3 informasi kampus lewat Knowledge Hub, Community, dan AI Navigator.
  3. Catat metrik nyata: waktu rata-rata menemukan jawaban (*target Abstract: < 5 menit*), rasio pertanyaan terjawab, dan **2–3 temuan usability** untuk diperbaiki di Final Day.

---

## 3. Fase Final Day Build Session (`19 Dec 2026` — *Meaningful Development Tasks*)
**Aturan Handbook**: Tim check-in dengan *starting commit*, lalu mengerjakan **2–3 substantive tasks** secara live selama *Build Session* (**bobot 10% Final Day Execution**). Jangan kerjakan 3 tugas di bawah ini sebelum hari Final!

### Final Task A — Dynamic `journey_steps` per Kampus/Prodi/Semester & Rekomendasi Guide Otomatis
- **Owner**: Erick & Netta
- **Ruang Lingkup**:
  1. Migrasikan konten roadmap yang saat ini masih hardcoded di `src/lib/journey/roadmap-data.ts` ke tabel `public.journey_steps` di Supabase agar terikat ke `campus_id`, `program_id`, dan `semester` (mulai dari UGM D4 TRI Semester 1–4+).
  2. Kembangkan logika *rule-based* (tanpa ML, sesuai Abstract Section 6) agar mempertimbangkan `profiles.semester` dan `program_id` — bukan hanya `adaptation_area` & `main_challenge` — serta otomatis menampilkan **3 rekomendasi panduan Knowledge Hub (`guides`)** yang relevan per langkah/fokus area.

### Final Task B — Fitur Moderasi & Verifikasi Dasar
- **Owner**: Kalya & Netta
- **Ruang Lingkup** (*sesuai Abstract Week 3: "moderation"*):
  1. Tambahkan tombol **Report** pada post/komentar Community atau experience untuk menandai konten bermasalah (update status ke `reported` sesuai kebijakan RLS/RPC aman).
  2. Tambahkan tampilan/alur kurator untuk memverifikasi `is_verified_contributor` atau meninjau konten terlapor.

### Final Task C — AI-to-Community Fallback & Perbaikan Usability Pilot Test
- **Owner**: Erick, Kalya & Rifal
- **Ruang Lingkup**:
  1. Saat AI Navigator menyatakan *insufficient evidence*, tampilkan tombol **"Ask in Community"** yang langsung membawa pertanyaan user ke form Create Post di `/community`.
  2. Selesaikan 1–2 perbaikan UI/UX nyata yang ditemukan dari uji coba mahasiswa pada Task 2.3.
  3. Catat *starting commit*, *final commit*, ringkasan perubahan Final Day, kontribusi tiap anggota, serta deklarasi AI di `README.md` sebelum batas waktu judging.

---

## 4. Checklist Verifikasi Wajib Sebelum Merge / Demo

Setiap PR atau sebelum demo, pastikan seluruh langkah CI (`.github/workflows/ci.yml`) lulus 100% di lokal:

```bash
npm run lint
npx next typegen
npx tsc --noEmit
npm test
npm run build
```

Dan cek manual di browser desktop (`>= 1024px`) serta mobile (`375px`):
- [ ] Daftar/login dan onboarding berjalan tanpa error dan tanpa membocorkan NIM/PII.
- [ ] Knowledge Hub scope filter (`My Program`, `General`, `Browse another program`), category filter, search, dan bookmark bekerja dengan data Supabase (tanpa tab Senior Experiences).
- [ ] Home, `My Journey` (checklist, notes, reflections), `My Tasks`, dan `Saved Items` tersimpan per user di Supabase (Patch `04` & `05` aktif) *(target Semifinal)*.
- [ ] Community interactive UI preview (filter komunitas, create post, thread reply, toggle anonim, + live viewer profile dari Supabase) siap untuk demo Semifinal; persistensi ke `v_posts`/`v_comments` selesai di **Pra-Final**.
- [ ] AI Navigator menjawab berbasis chunk + menampilkan Source Cards yang bisa diklik *(target Pra-Final)*.
- [ ] Dynamic `journey_steps` per `campus_id`/`program_id`/`semester` & rekomendasi otomatis panduan Knowledge Hub *(target Final Day)*.


---
