-- =============================================================================
-- PATCH 03 - USULAN: verifikasi domain email terhadap campuses.domain
-- STATUS: USULAN, BUTUH KEPUTUSAN NETTA DAN ERICK. Tidak wajib di urutan jalan.
-- Jalankan hanya jika keputusan produk menerima aturan ini. Setelah 01 dan 02.
--
-- Masalah yang ditutup: tanpa patch ini, pengguna baru bisa memilih kampus/program
-- valid mana pun saat onboarding dan langsung memperoleh akses RLS tenant itu.
--
-- Aturan (sederhana, bisa diaudit):
--   - Kampus ditetapkan oleh pemanggil biasa (authenticated) hanya jika email akun
--     sudah terverifikasi DAN domainnya sama dengan campuses.domain, atau subdomain-nya
--     (contoh: budi@student.contoh.ac.id cocok dengan contoh.ac.id).
--   - Kampus tidak aktif (is_active = false) ditolak.
--   - Domain kosong: DITOLAK (fail closed). Admin yang mengisi domain atau menetapkan
--     kampus lewat service_role/SQL Editor.
--   - Pengecualian: is_privileged() (service_role, admin, koneksi DB langsung).
--   - Hanya diperiksa saat campus_id berubah. Profil lama yang tidak berubah tidak terkena.
--
-- Batasan yang harus diterima jika patch ini dipakai:
--   - Hanya memverifikasi KAMPUS. Program tetap dipilih pengguna dalam kampus itu.
--   - Mahasiswa dengan email publik (gmail, dll.) tidak bisa memilih kampus manapun.
--   - Bergantung pada email_confirmed_at. Pastikan pengaturan Confirm email sesuai
--     (jika Confirm email mati, periksa apakah email_confirmed_at tetap terisi saat daftar).
--   - Tes di supabase/tests/profiles_tenant.sql memakai akun fixture: email-nya harus
--     berdomain kampus A/B agar tes ACCEPT tetap lolos.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.trg_profiles_check_campus_email_domain()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_email       TEXT;
    v_verified_at TIMESTAMPTZ;
    v_domain      TEXT;
    v_active      BOOLEAN;
    v_email_domain TEXT;
BEGIN
    IF NEW.campus_id IS NULL THEN
        RETURN NEW;
    END IF;

    IF TG_OP = 'UPDATE' AND NEW.campus_id IS NOT DISTINCT FROM OLD.campus_id THEN
        RETURN NEW;
    END IF;

    IF public.is_privileged() THEN
        RETURN NEW;
    END IF;

    SELECT u.email, u.email_confirmed_at
      INTO v_email, v_verified_at
      FROM auth.users u
     WHERE u.id = NEW.id;

    SELECT c.domain, c.is_active
      INTO v_domain, v_active
      FROM public.campuses c
     WHERE c.id = NEW.campus_id;

    IF v_domain IS NULL OR btrim(v_domain) = '' THEN
        RAISE EXCEPTION 'Kampus ini belum memiliki domain email terdaftar. Hubungi administrator.';
    END IF;

    IF NOT COALESCE(v_active, false) THEN
        RAISE EXCEPTION 'Kampus ini tidak aktif.';
    END IF;

    IF v_email IS NULL OR v_verified_at IS NULL THEN
        RAISE EXCEPTION 'Email belum terverifikasi. Konfirmasi email terlebih dahulu.';
    END IF;

    v_email_domain := lower(split_part(v_email, '@', 2));

    IF v_email_domain <> lower(btrim(v_domain))
       AND right(v_email_domain, length(lower(btrim(v_domain))) + 1) <> '.' || lower(btrim(v_domain)) THEN
        RAISE EXCEPTION 'Domain email tidak sesuai dengan kampus yang dipilih.';
    END IF;

    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.trg_profiles_check_campus_email_domain() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_profiles_campus_email_domain ON public.profiles;
CREATE TRIGGER trg_profiles_campus_email_domain
BEFORE INSERT OR UPDATE OF campus_id ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.trg_profiles_check_campus_email_domain();

COMMIT;
