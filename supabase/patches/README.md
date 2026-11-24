# supabase/patches - untuk review Netta

Status: **SIAP-REVIEW, BELUM DIJALANKAN, BELUM DIUJI** ke Supabase. Tidak ada kunci atau secret di folder ini.

## Mengapa `patches/` dan bukan `migrations/`

Proyek belum punya riwayat migrasi Supabase CLI. `docs/TECH_AND_DATABASE.md` adalah sumber skema. Patch dibuat berurutan supaya Netta bisa menerapkannya ke project yang sudah berisi skema v2. Jika tim nanti memakai Supabase CLI, pindahkan isinya ke `supabase/migrations/` dengan timestamp.

## Urutan menjalankan (SQL Editor, sebagai owner project)

1. Skema v2 dari `docs/TECH_AND_DATABASE.md`, bagian 2 sampai 10, dari awal sampai akhir tanpa error.
2. `supabase/seed.sql` (data sintetis).
3. `01_profiles_tenant_hardening.sql` (wajib)
4. `02_community_helpful_accepted.sql` (wajib)
5. `03_campus_domain_check.sql` **USULAN, butuh keputusan Netta dan Erick.** Jangan dijalankan sebelum keputusan. Bukan bagian dari urutan wajib.

Setiap file memakai `BEGIN ... COMMIT`. Jika ada error, file itu batal dan tidak ada perubahan parsial.

## Ringkasan perubahan

| File | Isi |
| :--- | :--- |
| `docs/TECH_AND_DATABASE.md` | `guides` dipindah ke atas `bookmarks`. Judul bagian 4 jadi 13 tabel. `trg_protect_profile_update` memakai `IS DISTINCT FROM` dan `SET search_path`. Catatan ditambahkan: `match_campus_chunks` dan view dikoreksi di patch 01. |
| `01_profiles_tenant_hardening.sql` | Helper, trigger konsistensi profil, policy tanpa rekursi. Policy posts dan comments kini memfilter program. Bagian 11 sampai 14: hak EXECUTE, search_path, view anonim, dan RPC RAG. |
| `02_community_helpful_accepted.sql` | `set_accepted_answer` memeriksa kampus komentar sama dengan kampus post. Fungsi trigger di-REVOKE EXECUTE. |
| `03_campus_domain_check.sql` | **USULAN.** Trigger verifikasi domain email terhadap `campuses.domain`. |
| `supabase/tests/content_tenant.sql` | **BARU.** Tes baca lintas kampus dan lintas program untuk posts, comments, experiences, guides, content_chunks, RPC RAG, dan v_posts. |

Tidak ada tabel atau kolom baru. Yang ditambah: fungsi, trigger, RPC, view (CREATE OR REPLACE dengan kolom sama), satu index, dan GRANT.

## Perbaikan terhadap laporan QA

### [MEDIUM] Hak EXECUTE helper dan search_path (patch 01 bagian 11 dan 14)
- `is_privileged()`: REVOKE dari PUBLIC, anon, dan authenticated. Hanya dipakai di dalam fungsi DEFINER.
- `current_campus_id()`, `current_program_id()`, `current_profile_role()`: REVOKE dari PUBLIC dan anon, GRANT ke authenticated. Dibutuhkan oleh policy. `service_role` tidak perlu, karena service_role melewati RLS.
- Fungsi trigger: EXECUTE dicabut. PostgreSQL hanya memeriksa EXECUTE saat `CREATE TRIGGER`.
- `match_campus_chunks`: REVOKE dari PUBLIC dan anon, GRANT ke authenticated.
- Audit search_path. Semua fungsi SECURITY DEFINER sekarang punya `SET search_path = public`:
  - `is_privileged`, `current_*`, `trg_validate_profile_tenant`, `trg_protect_profile_update`, `trg_votes_sync_helpful_count`, `trg_votes_block_update`, `trg_comments_clear_accepted_on_delete`, `set_accepted_answer`, `match_campus_chunks`, `trg_profiles_check_campus_email_domain` (03).
  - `trg_enforce_clean_insert` (v2, SECURITY INVOKER): di-ALTER agar seragam.
  - `match_campus_chunks` di v2 tidak punya search_path. Diperbaiki di patch 01.

### [MEDIUM] Batas program di RLS Community (patch 01 bagian 5 dan 6)
- Spec (`docs/TECH_AND_DATABASE.md`) dan `AGENTS.md` mewajibkan query memfilter `campus_id` dan `program_id`. Spec eksplisit untuk `match_campus_chunks` (filter program opsional, chunk program NULL tetap boleh). Untuk Community, spec tidak menyebut aturan program.
- Keputusan saya: post dengan `program_id` NULL = umum satu kampus. Post dengan program terisi hanya terlihat oleh program yang sama. Curator dan admin melihat semua post kampus untuk moderasi. **Tandai untuk Netta: apakah Community memang per kampus, atau per program.**
- Comments mewarisi visibilitas post induk (EXISTS ke `posts` yang ikut RLS).
- Vote juga mewarisi visibilitas karena EXISTS ke `posts` dan `comments` ikut RLS.

### [MEDIUM] Bukti pembacaan lintas kampus (tes baru)
- `supabase/tests/content_tenant.sql` menguji lintas kampus dan lintas program untuk setiap tabel konten, plus kontrol positif agar tes tidak lolos karena kosong.

### [HIGH] Pemilihan kampus bebas (patch 03, USULAN)
- Verifikasi domain email (`auth.users.email`) terhadap `campuses.domain`. Ini sumber tepercaya yang sudah ada di skema, tanpa tabel atau kolom baru.
- Aturan: domain sama atau subdomain. Email harus sudah terverifikasi. Kampus harus aktif. Domain kosong = ditolak (fail closed). Admin, service_role, dan koneksi DB langsung dikecualikan.
- Hanya dicek saat `campus_id` berubah.
- **Batasan yang harus diterima:** hanya memverifikasi kampus. Program masih dipilih bebas dalam kampus itu. Email publik (gmail) tidak bisa memilih kampus. Menghubungkan ke alur undangan atau persetujuan admin adalah alternatif lain.

### [LOW] v_posts dan v_comments (patch 01 bagian 12)
- `!=` diganti `IS DISTINCT FROM` pada `author_id`. Label diubah ke `'Anonymous Student'`.
- **Catatan:** skema asli di `docs/TECH_AND_DATABASE.md` bagian 10 tidak diubah. Versi final ada di patch 01.

### Temuan lain dari QA, dicatat tetapi belum diubah di DB
- **RPC accepted answer dan unique index**: jika data live sudah punya lebih dari satu accepted answer per post, `CREATE UNIQUE INDEX` gagal. Bersihkan dulu sebelum menjalankan patch 02.
- **helpful_count dari data lama**: patch tidak merekonsiliasi jumlah vote yang sudah ada. Hitung ulang sekali sebelum rollout.
- **Filter PII di form pengalaman (`tags`, format nomor)**: ditangani di kode, bukan di patch ini. Diteruskan ke Senior Dev.

## Keputusan yang perlu disetujui Netta dan Erick

1. **Fungsi, trigger, RPC, dan view baru**: helper, `set_accepted_answer`, `match_campus_chunks`, dan view anonim. Aturan repo: "harus disepakati dulu".
2. **Patch 03 (verifikasi domain)**: USULAN. Tidak wajib.
3. **Program scope Community**: lihat catatan di atas.
4. **Konvensi admin**: koneksi tanpa JWT (SQL Editor) dianggap privileged.
5. **`posts.status`** tidak bisa diubah penulis. Jika penulis perlu mengarsipkan post sendiri, tambahkan `status` ke GRANT di patch 01.
6. **Self-vote**: penulis masih boleh memberi vote pada post sendiri. Tutup dengan `posts.author_id <> auth.uid()` di policy "Insert own votes" jika tidak diinginkan.
7. **Label anonim**: `'Anonymous Student'` di view. Jika UI memakai label lain, samakan.

## Tes yang harus dijalankan Netta

### A. Tes SQL (psql, owner)
- `supabase/tests/profiles_tenant.sql`: tes profil (sudah ada, tidak berubah).
- `supabase/tests/content_tenant.sql`: tes baca lintas kampus dan program (baru). Butuh fixture: member A, program A dan A2 di kampus A, program B di kampus B, serta baris di setiap tabel.

### B. Tes PostgREST dengan token user biasa (bukan SQL Editor)
Jalankan dari terminal. Nilai diisi lewat environment variable, **jangan ditulis ke file**.

```bash
# Variabel (isi sendiri, jangan commit):
#   SUPABASE_URL, ANON_KEY, USER_JWT (access_token user A di kampus A/program A),
#   CAMPUS_B, PROG_B, POST_OWN (id post milik user A), POST_B (id post di kampus B)
H_ANON=(-H "apikey: $ANON_KEY")
H_USER=(-H "apikey: $ANON_KEY" -H "Authorization: Bearer $USER_JWT" -H "Content-Type: application/json")

# 1. Baca lintas kampus: harus []
curl -s "$SUPABASE_URL/rest/v1/posts?select=id&campus_id=eq.$CAMPUS_B" "${H_USER[@]}"
curl -s "$SUPABASE_URL/rest/v1/posts?select=id&program_id=eq.$PROG_B" "${H_USER[@]}"
curl -s "$SUPABASE_URL/rest/v1/comments?select=id&post_id=eq.$POST_B" "${H_USER[@]}"
curl -s "$SUPABASE_URL/rest/v1/experiences?select=id&program_id=eq.$PROG_B" "${H_USER[@]}"
curl -s "$SUPABASE_URL/rest/v1/guides?select=id&campus_id=eq.$CAMPUS_B" "${H_USER[@]}"
curl -s "$SUPABASE_URL/rest/v1/content_chunks?select=id&campus_id=eq.$CAMPUS_B" "${H_USER[@]}"

# 2. Anon: harus [] untuk semua tabel konten (tidak ada policy anon)
curl -s "$SUPABASE_URL/rest/v1/posts?select=id" "${H_ANON[@]}"

# 3. RPC RAG lintas kampus: tidak boleh ada baris campus B
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/match_campus_chunks" "${H_USER[@]}" \
  -d "{\"query_embedding\": <vector-768-dari-chunk-campus-B>, \"filter_campus_id\": \"$CAMPUS_B\", \"match_threshold\": -1, \"match_count\": 100}"

# 4. Hak EXECUTE: harus ditolak "permission denied"
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/is_privileged" "${H_USER[@]}" -d '{}'
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/current_campus_id" "${H_ANON[@]}" -d '{}'
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/set_accepted_answer" "${H_ANON[@]}" -d '{"p_post_id":null,"p_comment_id":null}'

# 5. Kolom terlarang: harus 403 "permission denied for column"
curl -s -X PATCH "$SUPABASE_URL/rest/v1/posts?id=eq.$POST_OWN" "${H_USER[@]}" -d '{"helpful_count": 999}'

# 6. Kontrol positif: update kolom yang diizinkan harus 204 (tanpa body)
curl -s -o /dev/null -w "%{http_code}\n" -X PATCH "$SUPABASE_URL/rest/v1/posts?id=eq.$POST_OWN" "${H_USER[@]}" -d '{"title": "QA test title"}'

# 7. Pindah kampus lewat API: harus ditolak
curl -s -X PATCH "$SUPABASE_URL/rest/v1/profiles?id=eq.<uid-user-A>" "${H_USER[@]}" -d "{\"campus_id\": \"$CAMPUS_B\"}"

# 8. Anonim: author_id orang lain tidak boleh terbaca lewat view
curl -s "$SUPABASE_URL/rest/v1/v_posts?select=author_id,author_display_name&is_anonymous=eq.true" "${H_USER[@]}"
```

Tanda harus: langkah 1, 2, 3 mengembalikan `[]` (atau 0 baris campus B). Langkah 4 dan 5 ditolak. Langkah 6 berhasil. Langkah 7 ditolak. Langkah 8 tidak menampilkan `author_id` orang lain.

### C. Tes profil (sudah ada, tidak berubah)
Tabel lengkap ada di header `supabase/tests/profiles_tenant.sql`.

### D. Tes patch 03 (hanya jika USULAN diterima)
1. Daftar email di domain kampus A, lalu buat profil kampus A: diterima.
2. Daftar email subdomain (`budi@student.<domain-A>`): diterima.
3. Daftar email domain lain (`budi@gmail.com`), pilih kampus A: ditolak.
4. Kampus dengan domain kosong: ditolak.
5. Email belum terverifikasi: ditolak.
6. Admin atau service_role mengubah campus: diterima.
7. Fixture di `profiles_tenant.sql` harus berdomain kampus A/B agar tes ACCEPT tetap lolos. Jika tidak, tes itu gagal karena domain, bukan karena bug.

## Hal yang tidak bisa diverifikasi tanpa Supabase live

- **Tidak ada Postgres atau Supabase di mesin ini.** Semua SQL belum dijalankan. Sintaks dan urutan hanya dibaca manual.
- Skema v2 belum pernah dijalankan dari awal.
- Perilaku GRANT kolom dan EXECUTE di project Supabase (default privilege dan `PUBLIC`).
- Apakah trigger tetap berjalan setelah EXECUTE fungsi trigger dicabut. Dokumentasi PostgreSQL menyatakan EXECUTE hanya dicek saat CREATE TRIGGER, tetapi belum diuji di sini.
- Apakah `auth.role()` bernilai NULL di SQL Editor dan `anon`/`authenticated` lewat API.
- Apakah `email_confirmed_at` terisi saat signup jika Confirm email mati (berpengaruh ke patch 03).
- Isi `supabase/seed.sql` belum dicek terhadap fixture tes. Fixture harus disesuaikan.
- Hasil `match_campus_chunks` memakai vektor 768 dimensi. Tes memakai embedding nyata dari chunk campus B. Nilai threshold `-1` diasumsikan memuat semua baris.
- Tes PostgREST di atas tidak dijalankan. Token dan URL harus diisi Netta.
- Tidak ada yang di-commit atau di-push.
