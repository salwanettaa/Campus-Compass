# Campus Compass — Development Plan & Handoff Guide

> **Kompetisi**: STACK 2026 by GDGoC ITB — *Case 1: Smarter Campus and Learning*  
> **Tim**: Nanti Makan Sushi (Salwanetta Jauza Y, Kalya Andriana, Rifaludin, Erick)  
> **Pilot**: Universitas Gadjah Mada (UGM) — Sekolah Vokasi D4 Teknologi Rekayasa Internet (TRI)  
> **Baseline Commit `main`**: `8570747` (per 26 Nov 2026)

Dokumen ini menjadi panduan eksekusi untuk member atau AI coding agent berikutnya agar pengembangan aplikasi **sinkron dengan Abstract Preliminary**, **mematuhi aturan tahapan STACK 2026**, dan **tetap menyisakan *meaningful development* untuk Final Day**.

---

## 0. Status Baseline Saat Ini

| Area | Status Saat Ini | Lokasi Kode Utama |
| :--- | :--- | :--- |
| **Auth & Onboarding** | ✅ Live Supabase (`profiles`, `campuses`, `faculties`, `programs`) — belum pakai pembatasan email kampus | `src/lib/auth/`, `src/app/onboarding/page.tsx` |
| **Knowledge Hub** | ✅ Live Supabase (`guides`, `experiences`, `bookmarks`) + fallback sample, UI Split-Rail & filter sudah jalan | `src/app/(dashboard)/knowledge/`, `src/lib/knowledge/` |
| **Home Dashboard** | 🟡 Profil kampus/prodi/fokus live; rekomendasi rule-based & `#my-journey` masih placeholder `"Coming soon"` | `src/app/(dashboard)/home/page.tsx` |
| **Community** | ❌ UI sudah ada, tapi data masih mock (`MOCK_POSTS`, `MOCK_COMMENTS`); belum ada form Create Post / Comment / Vote live | `src/lib/community/data.ts`, `src/app/(dashboard)/community/` |
| **AI Navigator** | ❌ Masih static preview (`SampleChat`, *"Demo, not live"*); belum terhubung ke Gemini API / `content_chunks` | `src/app/(dashboard)/ai-navigator/page.tsx`, `src/components/ai-navigator/` |
| **Database & Security** | ✅ Schema V2 + Patch 01 & Patch 02 (`votes` trigger, `set_accepted_answer()`) sudah terpasang di Supabase Cloud | `docs/TECH_AND_DATABASE.md`, `supabase/patches/` |

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
  1. Jalankan [`supabase/seed_ugm_vokasi_tri.sql`](../supabase/seed_ugm_vokasi_tri.sql) di **Supabase SQL Editor** agar `campuses` (UGM), `faculties` (SV, FT, FEB), `programs` (`TRI`, `TRPL`, `TI`, `MN`), `guides`, dan `experiences` masuk ke DB.
  2. Perbanyak isi `guides` hingga mencakup **minimal 2 panduan per kategori (total 12–15 panduan)** di 6 kategori (`academic_survival`, `social_community`, `administrative_guide`, `campus_essentials`, `scholarship_growth`, `career_preparation`) dan **5+ `experiences`** (tandai mana hasil wawancara senior dan mana contoh sintetis).
  3. Tambahkan seed awal `posts` dan `comments` untuk UGM D4 TRI agar halaman Community langsung terisi saat live.
- **Definition of Done**: Banner di bawah `/knowledge` menampilkan `Connected to Universitas Gadjah Mada.` (bukan lagi sample fallback).

### Task 1.2 — Pembatasan Auth Email Kampus + Akun Demo
- **Owner**: Netta
- **Langkah**:
  1. Jalankan [`supabase/patches/03_campus_domain_check.sql`](../supabase/patches/03_campus_domain_check.sql) di Supabase SQL Editor (atau pastikan domain `ugm.ac.id` / `mail.ugm.ac.id` tervalidasi saat registrasi & onboarding).
  2. Tambahkan validasi pesan error yang jelas pada `src/lib/validation/auth.ts` & form Register (`src/components/auth/register-form.tsx`) agar pendaftar dengan email non-kampus langsung mendapat arahan sebelum submit.
  3. **Penting untuk juri**: Jika `Confirm email` dinyalakan lagi (karena Patch 03 mengecek `email_confirmed_at IS NOT NULL`), buat **1–2 akun demo pre-confirmed** di Supabase Auth dan cantumkan kredensial aksesnya secara aman di catatan submission (jangan pernah commit password/token ke Git!).

### Task 1.3 — Sambungkan Community ke Supabase (Live Read + Write)
- **Owner**: Erick / Kalya (`feat/community-live`)
- **Kontrak yang sudah ada**: `src/lib/community/types.ts` (mirror kolom `v_posts`, `v_comments`), `supabase/patches/02_community_helpful_accepted.sql` (`trg_votes_sync_helpful_count`, `set_accepted_answer()`).
- **Langkah**:
  1. Ubah `listFeed()` dan `getThread()` di `src/lib/community/data.ts`:
     - Query `v_posts` (`status = 'published'`), hitung `commentCount` dari `v_comments`, dan cek `votes` milik user login untuk `viewerHelpful` & `helpfulCommentIds`.
     - Gunakan fallback aman ke `MOCK_POSTS` hanya saat env/request berada di luar Next server (unit test) atau beri simulasi error/empty tetap berjalan.
  2. Buat `src/lib/community/actions.ts` dengan validasi Zod + cek PII (`src/lib/validation/personal-data.ts`):
     - `createPostAction`: insert ke `public.posts` (ambil `campus_id`, `program_id`, `author_id` dari server session & `profiles`).
     - `createCommentAction`: insert ke `public.comments` (`parent_comment_id` opsional untuk nested reply).
     - `toggleVoteAction`: insert/delete ke `public.votes` untuk post atau comment (trigger DB otomatis update `helpful_count`).
     - `acceptAnswerAction`: panggil RPC `set_accepted_answer` (khusus `question` oleh author post).
  3. Tambahkan UI form **Ask Question / New Post**, **Reply Comment** di `src/app/(dashboard)/community/[id]/page.tsx`, dan hubungkan `HelpfulButton` (`onToggle`) ke Server Action.
- **Definition of Done**: User bisa membuat post, membalas komentar, memberi helpful vote, dan menandai jawaban diterima, serta tetap tersimpan setelah refresh.

### Task 1.4 — UI Preview `My Journey` di Home (Mockup Berlabel Jujur)
- **Owner**: Kalya
- **Langkah**:
  1. Ganti placeholder `"Coming soon"` pada `#my-journey` di `src/app/(dashboard)/home/page.tsx` dengan tampilan **preview checklist adaptasi rule-based** (3–4 langkah relevan berdasarkan `profile.adaptation_area` dan `profile.semester`, lengkap dengan link ke panduan Knowledge Hub terkait).
  2. Beri label eksplisit di bagian atas section: **`Preview only · Progress is not saved yet`** (mematuhi aturan transparansi mockup Handbook).
- **Definition of Done**: Tampilan Home tidak kosong dan menunjukkan konsep *adaptation roadmap* dengan jelas untuk Video Semifinal.

### Task 1.5 — Deliverables Non-Kode Semifinal (`30 Nov`)
- **Proposal (PDF, maks 10 halaman konten, Bahasa Inggris)** + **Signed Declaration of Originality** (`s.id/DeclarationOfOriginalitySTACK2026`).
- **Video Demo (maks 2 menit, 1080p, Bahasa Inggris)**:
  - Tunjukkan live flow: Onboarding $\rightarrow$ Home $\rightarrow$ Knowledge Hub $\rightarrow$ Community.
  - Tunjukkan preview AI Navigator & My Journey sambil menjelaskan secara jujur fitur yang sudah selesai vs rencana Pra-Final & Final Day (*Progress Honesty = 20%*).

---

## 2. Fase Pra-Final (`7–16 Dec 2026` — *Partially Developed Prototype*)
**Target Produk**: Mengimplementasikan **Abstract Week 2** (*Gemini API RAG Integration*) + **Pilot Trial Awal** untuk validasi, sambil **tetap menyimpan 2–3 tugas substantif untuk Final Day (`19 Dec`)**.

### Task 2.1 — Ingestion `content_chunks` & Embeddings
- **Owner**: Netta & Erick
- **Langkah**:
  1. Buat script ingestion server-only (misal `scripts/ingest-chunks.ts`, tidak dijalankan di browser) yang memecah isi `guides` dan `experiences` terverifikasi menjadi chunk teks (`public.content_chunks`).
  2. Generate vector embedding menggunakan `GEMINI_API_KEY` dan `GEMINI_EMBEDDING_MODEL=text-embedding-004` (`768` dimensi sesuai skema `content_chunks` di `docs/TECH_AND_DATABASE.md`).
  3. Pastikan setiap baris `content_chunks` mengisi `campus_id`, `program_id`, `is_general`, serta `guide_id` / `experience_id` dengan benar agar isolasi tenant tetap ketat.

### Task 2.2 — Live `AI Navigator` (Gemini RAG + Source Citations)
- **Owner**: Erick (`feat/ai-navigator`)
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

### Final Task A — `My Journey` Rule-Based Tracker & Home Recommendations
- **Owner**: Kalya & Netta
- **Ruang Lingkup**:
  1. Seed `public.journey_steps` di Supabase untuk tahap adaptasi Semester 1–4 & topik `adaptation_area` / `main_challenge`.
  2. Buat logika *rule-based* (tanpa ML, sesuai Abstract Section 6) yang memilihkan langkah journey & 3 rekomendasi panduan Knowledge Hub sesuai `profiles.semester`, `adaptation_area`, dan `main_challenge`.
  3. Sambungkan checklist di `/home#my-journey` ke tabel `public.user_journey_progress` (toggle `completed`), hapus label preview, dan tampilkan kembali tautan `My Journey` di `NAV_ITEMS` (`src/components/layout/nav-items.ts`).

### Final Task B — Fitur Moderasi & Verifikasi Dasar
- **Owner**: Erick & Netta
- **Ruang Lingkup** (*sesuai Abstract Week 3: "moderation"*):
  1. Tambahkan tombol **Report** pada post/komentar Community atau experience untuk menandai konten bermasalah (update status ke `reported` sesuai kebijakan RLS/RPC aman).
  2. Tambahkan tampilan/alur kurator untuk memverifikasi `is_verified_contributor` atau meninjau konten terlapor.

### Final Task C — AI-to-Community Fallback & Perbaikan Usability Pilot Test
- **Owner**: Erick & Rifal
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
- [ ] Knowledge Hub scope filter (`My Program`, `General`, `Browse another program`), category filter, search, dan bookmark bekerja dengan data Supabase.
- [ ] Community feed, create post, comment, helpful vote, dan accepted answer tersimpan di Supabase *(target Semifinal)*.
- [ ] AI Navigator menjawab berbasis chunk + menampilkan Source Cards yang bisa diklik *(target Pra-Final)*.
- [ ] My Journey checklist & rekomendasi rule-based tersimpan per user *(target Final Day)*.
