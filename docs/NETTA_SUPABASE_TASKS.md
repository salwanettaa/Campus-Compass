# Campus Compass - Tugas Supabase untuk Netta

> **Owner**: Netta (Database / backend)
> **Dibuat**: 24 November 2026, oleh Erick (Tech Lead)
> **Status**: Semua item di bawah **belum dikerjakan dan belum diuji** ke Supabase sungguhan.
> **Aturan**: tidak ada tabel atau kolom baru di luar `docs/TECH_AND_DATABASE.md`. Fungsi, trigger, dan RPC boleh, tapi harus disepakati dulu.
> **Jangan** menempelkan kunci Supabase ke chat atau commit.

Urutan = prioritas. Item 1 sampai 4 harus selesai sebelum Slice 2 (Community) memakai query ke database.

---

## 1. Perbaiki urutan DDL (blocker)

- `CREATE TABLE public.bookmarks` mereferensi `public.guides`, tapi `guides` dibuat setelahnya, jadi DDL gagal bila dijalankan berurutan.
- **Kerjaan**: pindahkan blok `guides` ke atas `bookmarks` di `docs/TECH_AND_DATABASE.md`.
- **Selesai bila**: seluruh skema v2 jalan dari awal sampai akhir di SQL Editor tanpa error.

## 2. Rapikan dokumen skema

- Teks menyebut "13 tabel" di satu tempat dan "12 tabel" di tempat lain, sedangkan daftar `ENABLE RLS` ada 13. Samakan.

## 3. Tutup celah RLS tenant pada `profiles` (kritis, temuan QA dan Senior Dev)

**Masalah**
- Policy `Insert own profile student` hanya mengecek `id` dan `role`. User bisa menyimpan `campus_id`, `faculty_id`, `program_id` apa saja lewat Supabase API langsung. Validasi di Server Action onboarding bisa dilewati.
- RLS konten memakai `profiles.campus_id`, jadi data kampus lain berpotensi terbaca.
- Trigger `trg_protect_profile_update` memakai `NEW.campus_id != OLD.campus_id`. Bila `NEW.campus_id` NULL, hasilnya NULL dan proteksi terlewati. `program_id` dan `faculty_id` tidak dijaga.

**Kerjaan**
- Review dan terapkan patch di bawah (draft dari Senior Dev, belum diuji).
- Ganti `!=` jadi `IS DISTINCT FROM` di `trg_protect_profile_update`, dan beri `SET search_path = public` karena `SECURITY DEFINER`.
- Uji dengan akun biasa lewat API langsung: insert atau update ke kampus lain, program tidak cocok, dan `onboarding_completed = true` tanpa kampus atau program harus **ditolak**.

**Draft patch**

```sql
-- DRAFT patch (belum diterapkan, belum diuji ke Supabase). Review dengan Netta sebelum dipakai.
-- Menutup: user bisa menyimpan campus/faculty/program yang tidak konsisten lewat Supabase API langsung,
-- dan bypass trigger lama lewat NULL (NEW.campus_id != OLD.campus_id bernilai NULL jika NEW NULL).
-- Tidak menambah tabel/kolom, hanya fungsi + trigger.

CREATE OR REPLACE FUNCTION public.trg_validate_profile_tenant()
RETURNS TRIGGER AS $$
DECLARE
    privileged BOOLEAN := (auth.role() = 'service_role')
        OR COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin', false);
BEGIN
    -- Rantai campus -> faculty -> program harus konsisten.
    IF NEW.program_id IS NOT NULL THEN
        IF NEW.campus_id IS NULL OR NOT EXISTS (
            SELECT 1 FROM public.programs p
            WHERE p.id = NEW.program_id
              AND p.campus_id = NEW.campus_id
              AND p.faculty_id IS NOT DISTINCT FROM NEW.faculty_id
        ) THEN
            RAISE EXCEPTION 'Program tidak cocok dengan kampus/fakultas.';
        END IF;
    ELSIF NEW.faculty_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.faculties f
            WHERE f.id = NEW.faculty_id AND f.campus_id = NEW.campus_id
        ) THEN
            RAISE EXCEPTION 'Fakultas tidak cocok dengan kampus.';
        END IF;
    END IF;

    IF NEW.onboarding_completed AND (NEW.campus_id IS NULL OR NEW.program_id IS NULL) THEN
        RAISE EXCEPTION 'Onboarding butuh kampus dan program.';
    END IF;

    IF TG_OP = 'UPDATE' AND NOT privileged THEN
        -- IS DISTINCT FROM menutup bypass lewat NULL.
        IF OLD.campus_id IS NOT NULL AND NEW.campus_id IS DISTINCT FROM OLD.campus_id THEN
            RAISE EXCEPTION 'Pemindahan kampus memerlukan Administrator.';
        END IF;
        IF OLD.program_id IS NOT NULL AND NEW.program_id IS DISTINCT FROM OLD.program_id THEN
            RAISE EXCEPTION 'Perubahan program memerlukan Administrator.';
        END IF;
        IF OLD.onboarding_completed AND NOT NEW.onboarding_completed THEN
            RAISE EXCEPTION 'Status onboarding tidak boleh dibatalkan.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_profiles_validate_tenant ON public.profiles;
CREATE TRIGGER trg_profiles_validate_tenant
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.trg_validate_profile_tenant();

-- Catatan: trg_protect_profile_update lama sebaiknya juga diganti `!=` menjadi `IS DISTINCT FROM`,
-- dan diberi SET search_path = public karena SECURITY DEFINER.
```

## 4. Siapkan Supabase project

1. Buat project, jalankan skema v2 (setelah item 1 dan 3), lalu `supabase/seed.sql` (data sintetis).
2. **Authentication > URL Configuration**: isi Site URL production, dan Redirect URLs `https://<app>.vercel.app/auth/callback` serta `http://localhost:3000/auth/callback`.
3. **Providers > Email**: putuskan *Confirm email* nyala atau mati (nyala lebih aman, mati lebih cepat untuk demo).
4. Beri Erick nilai `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` lewat kanal privat, bukan chat tim.
5. Tes alur nyata bersama Erick: daftar, konfirmasi email, onboarding (`upsert` ke `profiles`), `/home`, logout. Catat pesan error Supabase bila ada.

## 5. Siapkan logika Community (sebelum Slice 2)

Belum ada di DDL:
- Trigger atau fungsi yang menaikkan atau menurunkan `helpful_count` saat baris `votes` dibuat atau dihapus.
- Trigger anti-tampering hanya jalan pada `INSERT`. Policy `Update own post` dan `Update own comment` mengizinkan penulis mengubah `helpful_count` lewat `UPDATE`. Kunci kolom itu.
- Mekanisme `is_accepted_answer` dan `has_accepted_answer`: hanya penanya yang boleh menandai, dan harus konsisten (satu jawaban diterima per post).
- **Usul Erick**: pakai trigger pada `votes` untuk `helpful_count`, dan RPC kecil untuk accepted answer. Tanpa tabel atau kolom baru. Kabari Erick bila tidak cocok.

## 6. Setelah database hidup

- Jalankan `supabase gen types typescript` dan serahkan hasilnya untuk mengganti `src/types/database.ts` yang ditulis tangan.
- Slice 4 (AI Navigator) nanti: pastikan `content_chunks`, RPC `match_campus_chunks` (768 dimensi), dan filter `campus_id` serta `program_id` bekerja.

---

## Checklist serah-terima

- [ ] Item 1: DDL jalan tanpa error
- [ ] Item 2: dokumen konsisten
- [ ] Item 3: patch RLS diterapkan dan lolos tes penolakan
- [ ] Item 4: project, seed, redirect URL, dan alur auth teruji
- [ ] Item 5: logika vote dan accepted answer disepakati
- [ ] Item 6: tipe database digenerate
