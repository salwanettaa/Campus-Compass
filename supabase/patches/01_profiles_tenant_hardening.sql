-- =============================================================================
-- PATCH 01 - Tenant hardening: profiles, helper RLS, dan kunci kolom penulis
-- Status: SIAP-REVIEW. Belum dijalankan ke Supabase, belum diuji.
-- Urutan: jalankan SETELAH skema v2 (docs/TECH_AND_DATABASE.md) berhasil dari awal
--         sampai akhir. Lalu jalankan 02_community_helpful_accepted.sql.
-- Dijalankan oleh: Netta (pemilik database). Jangan dijalankan dari chat/agen.
--
-- Dampak:
--   1. Menutup celah: user bisa menyimpan campus/faculty/program yang tidak konsisten
--      lewat Supabase API langsung (validasi onboarding Server Action bisa dilewati).
--   2. Memutus infinite recursion: policy profiles dan policy tabel lain memakai
--      subquery ke profiles, sehingga RLS profiles memicu dirinya sendiri. Helper
--      SECURITY DEFINER membaca profiles tanpa RLS.
--   3. Mengunci kolom penulis (helpful_count, accepted answer) dari UPDATE langsung
--      lewat column-level GRANT.
--   4. Tidak menambah tabel atau kolom. Fungsi helper baru perlu disetujui Netta
--      dan Erick (aturan di docs/NETTA_SUPABASE_TASKS.md).
--
-- Catatan admin: SQL Editor memakai koneksi postgres langsung tanpa JWT, sehingga
-- auth.role() bernilai NULL dan dianggap privileged. Tes penolakan HARUS dijalankan
-- lewat API dengan access_token user biasa, bukan lewat SQL Editor.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. HELPER FUNCTIONS (SECURITY DEFINER + search_path tetap)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_privileged()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        auth.role() IS NULL                  -- koneksi DB langsung (SQL Editor); request API selalu punya claim role
        OR auth.role() = 'service_role'
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        );
$$;

CREATE OR REPLACE FUNCTION public.current_campus_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT p.campus_id FROM public.profiles p WHERE p.id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_program_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT p.program_id FROM public.profiles p WHERE p.id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_profile_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT p.role FROM public.profiles p WHERE p.id = auth.uid();
$$;

-- -----------------------------------------------------------------------------
-- 2. TRIGGER PROFILES: konsistensi kampus -> fakultas -> program + onboarding
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trg_validate_profile_tenant()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_privileged BOOLEAN := public.is_privileged();
BEGIN
    -- Berlaku untuk semua pemanggil, termasuk admin.
    IF NEW.program_id IS NOT NULL THEN
        IF NEW.campus_id IS NULL OR NOT EXISTS (
            SELECT 1 FROM public.programs pr
            WHERE pr.id = NEW.program_id
              AND pr.campus_id = NEW.campus_id
              AND pr.faculty_id IS NOT DISTINCT FROM NEW.faculty_id
        ) THEN
            RAISE EXCEPTION 'Program tidak cocok dengan kampus/fakultas.';
        END IF;
    ELSIF NEW.faculty_id IS NOT NULL THEN
        IF NEW.campus_id IS NULL OR NOT EXISTS (
            SELECT 1 FROM public.faculties f
            WHERE f.id = NEW.faculty_id AND f.campus_id = NEW.campus_id
        ) THEN
            RAISE EXCEPTION 'Fakultas tidak cocok dengan kampus.';
        END IF;
    END IF;

    IF NEW.onboarding_completed AND (NEW.campus_id IS NULL OR NEW.program_id IS NULL) THEN
        RAISE EXCEPTION 'Onboarding butuh kampus dan program.';
    END IF;

    IF TG_OP = 'UPDATE' AND NOT v_privileged THEN
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
$$;

DROP TRIGGER IF EXISTS trg_profiles_validate_tenant ON public.profiles;
CREATE TRIGGER trg_profiles_validate_tenant
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.trg_validate_profile_tenant();

-- -----------------------------------------------------------------------------
-- 3. TRIGGER PROFILES: proteksi role dan campus (menggantikan versi v2)
--    Perubahan: IS DISTINCT FROM (bukan !=), SET search_path, dan helper is_privileged().
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trg_protect_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_privileged() THEN
        RAISE EXCEPTION 'Akses Ditolak: Perubahan role hanya dapat dilakukan oleh Administrator.';
    END IF;

    IF OLD.campus_id IS NOT NULL AND NEW.campus_id IS DISTINCT FROM OLD.campus_id
       AND NOT public.is_privileged() THEN
        RAISE EXCEPTION 'Akses Ditolak: Pemindahan kampus memerlukan bantuan Administrator.';
    END IF;

    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- 4. POLICY: profiles (tanpa subquery ke profiles)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Read profiles in same campus" ON public.profiles;
CREATE POLICY "Read profiles in same campus" ON public.profiles
FOR SELECT TO authenticated
USING (id = auth.uid() OR campus_id = public.current_campus_id());

-- Insert: id harus milik sendiri dan role student. Konsistensi campus/program dijaga trigger.
DROP POLICY IF EXISTS "Insert own profile student" ON public.profiles;
CREATE POLICY "Insert own profile student" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (id = auth.uid() AND role = 'student');

-- "Update own profile basic" tidak diubah: USING dan WITH CHECK sudah tanpa subquery.
-- Batas kolom dijaga oleh trigger di atas.

-- -----------------------------------------------------------------------------
-- 5. POLICY: posts (campus + program wajib; subquery diganti helper)
-- -----------------------------------------------------------------------------
-- Keputusan (tandai untuk Netta): post dengan program_id NULL = umum satu kampus
-- (pola yang sama dengan filter program opsional di match_campus_chunks).
-- Post dengan program_id terisi hanya terlihat oleh program yang sama.
-- curator/admin melihat seluruh post kampus untuk moderasi.
DROP POLICY IF EXISTS "Read posts in same campus" ON public.posts;
DROP POLICY IF EXISTS "Read posts in same campus and program" ON public.posts;
CREATE POLICY "Read posts in same campus and program" ON public.posts
FOR SELECT TO authenticated
USING (
    campus_id = public.current_campus_id()
    AND (
        posts.program_id IS NULL
        OR posts.program_id = public.current_program_id()
        OR public.current_profile_role() IN ('curator', 'admin')
    )
    AND (
        status = 'published'
        OR author_id = auth.uid()
        OR public.current_profile_role() IN ('curator', 'admin')
    )
);

DROP POLICY IF EXISTS "Create post in own campus" ON public.posts;
CREATE POLICY "Create post in own campus" ON public.posts
FOR INSERT TO authenticated
WITH CHECK (
    author_id = auth.uid()
    AND campus_id = public.current_campus_id()
    AND (
        posts.program_id IS NULL
        OR posts.program_id = public.current_program_id()
    )
);

-- -----------------------------------------------------------------------------
-- 6. POLICY: comments (campus wajib, post induk harus di kampus yang sama)
-- -----------------------------------------------------------------------------
-- Komentar tidak punya program_id. Visibilitas diwarisi dari post induk:
-- EXISTS ke posts ikut RLS posts (kampus + program), jadi komentar post program lain tidak terlihat.
DROP POLICY IF EXISTS "Read comments in same campus" ON public.comments;
CREATE POLICY "Read comments in same campus" ON public.comments
FOR SELECT TO authenticated
USING (
    campus_id = public.current_campus_id()
    AND (status = 'published' OR author_id = auth.uid())
    AND EXISTS (SELECT 1 FROM public.posts p WHERE p.id = comments.post_id)
);

DROP POLICY IF EXISTS "Create comment in own campus" ON public.comments;
CREATE POLICY "Create comment in own campus" ON public.comments
FOR INSERT TO authenticated
WITH CHECK (
    author_id = auth.uid()
    AND campus_id = public.current_campus_id()
    AND EXISTS (
        SELECT 1 FROM public.posts p
        WHERE p.id = comments.post_id AND p.campus_id = comments.campus_id
    )
);

-- -----------------------------------------------------------------------------
-- 7. POLICY: votes (hanya target yang terlihat oleh pemanggil, yaitu satu kampus)
--    Tidak ada policy UPDATE: vote tidak bisa diubah. Hapus lalu buat ulang.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Manage own votes" ON public.votes;

CREATE POLICY "Select own votes" ON public.votes
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- EXISTS ke posts/comments ikut RLS pemanggil: target di kampus lain tidak terlihat, jadi ditolak.
CREATE POLICY "Insert own votes" ON public.votes
FOR INSERT TO authenticated
WITH CHECK (
    user_id = auth.uid()
    AND vote_type = 'helpful'
    AND (
        (votes.post_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.posts p WHERE p.id = votes.post_id
        ))
        OR (votes.comment_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.comments c WHERE c.id = votes.comment_id
        ))
    )
);

CREATE POLICY "Delete own votes" ON public.votes
FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 8. POLICY: experiences (campus + program wajib)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Read experiences in same campus" ON public.experiences;
CREATE POLICY "Read experiences in same campus" ON public.experiences
FOR SELECT TO authenticated
USING (
    campus_id = public.current_campus_id()
    AND program_id = public.current_program_id()
);

DROP POLICY IF EXISTS "Create experience in own campus" ON public.experiences;
CREATE POLICY "Create experience in own campus" ON public.experiences
FOR INSERT TO authenticated
WITH CHECK (
    author_id = auth.uid()
    AND campus_id = public.current_campus_id()
    AND program_id = public.current_program_id()
);

-- -----------------------------------------------------------------------------
-- 9. POLICY: guides dan content_chunks (campus + program; RAG memakai filter yang sama)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Read guides scoped" ON public.guides;
CREATE POLICY "Read guides scoped" ON public.guides
FOR SELECT TO authenticated
USING (
    is_published = true
    AND (is_general = true OR campus_id = public.current_campus_id())
    AND (guides.program_id IS NULL OR guides.program_id = public.current_program_id())
);

DROP POLICY IF EXISTS "Read chunks scoped" ON public.content_chunks;
CREATE POLICY "Read chunks scoped" ON public.content_chunks
FOR SELECT TO authenticated
USING (
    (content_chunks.guide_id IS NULL OR EXISTS (
        SELECT 1 FROM public.guides g WHERE g.id = content_chunks.guide_id   -- RLS guides ikut berlaku
    ))
    AND (content_chunks.experience_id IS NULL OR EXISTS (
        SELECT 1 FROM public.experiences e WHERE e.id = content_chunks.experience_id  -- RLS experiences ikut berlaku
    ))
    AND (content_chunks.is_general OR content_chunks.campus_id = public.current_campus_id())
    AND (content_chunks.program_id IS NULL OR content_chunks.program_id = public.current_program_id())
);

-- -----------------------------------------------------------------------------
-- 10. KUNCI KOLOM PENULIS (column-level GRANT, bukan tabel atau kolom baru)
--     User tidak boleh menulis helpful_count, is_accepted_answer, has_accepted_answer,
--     is_verified_contributor, status, campus_id, program_id, author_id.
--     Trigger (SECURITY DEFINER, owner) tetap bisa mengubahnya.
-- -----------------------------------------------------------------------------
REVOKE UPDATE ON public.posts, public.comments, public.experiences FROM anon, authenticated;

GRANT UPDATE (title, content, category, post_type, tags, is_anonymous, updated_at)
    ON public.posts TO authenticated;
GRANT UPDATE (content, is_anonymous)
    ON public.comments TO authenticated;
GRANT UPDATE (title, semester_context, situation, challenge, solution, result, advice_for_juniors, tags)
    ON public.experiences TO authenticated;

-- -----------------------------------------------------------------------------
-- 11. HAK EXECUTE DAN SEARCH_PATH (audit)
--     Default Supabase memberi EXECUTE ke PUBLIC dan anon pada fungsi baru.
--     Helper hanya perlu dipanggil authenticated (dari policy) dan dari dalam fungsi DEFINER.
--     Trigger tidak memerlukan EXECUTE saat dipicu (hanya saat CREATE TRIGGER).
--     Audit search_path: semua fungsi SECURITY DEFINER wajib SET search_path (lihat daftar).
-- -----------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.is_privileged() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.current_campus_id(), public.current_program_id(),
    public.current_profile_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_campus_id(), public.current_program_id(),
    public.current_profile_role() TO authenticated;

REVOKE ALL ON FUNCTION public.trg_validate_profile_tenant(), public.trg_protect_profile_update(),
    public.trg_enforce_clean_insert() FROM PUBLIC, anon, authenticated;

-- v2 trg_enforce_clean_insert adalah SECURITY INVOKER tanpa search_path; kunci agar seragam.
ALTER FUNCTION public.trg_enforce_clean_insert() SET search_path = public;

-- -----------------------------------------------------------------------------
-- 12. VIEW ANONIM (CREATE OR REPLACE dari v2, kolom tidak berubah)
--     Perubahan: != diganti IS DISTINCT FROM (null-safe), label diselaraskan ke
--     Inggris "Anonymous Student". Skema asli di docs/TECH_AND_DATABASE.md bagian 10
--     TIDAK diubah; catatan ada di sana.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_posts
WITH (security_invoker = true) AS
SELECT
    p.id,
    p.campus_id,
    p.program_id,
    CASE
        WHEN p.is_anonymous AND p.author_id IS DISTINCT FROM auth.uid() THEN NULL
        ELSE p.author_id
    END AS author_id,
    CASE
        WHEN p.is_anonymous AND p.author_id IS DISTINCT FROM auth.uid() THEN 'Anonymous Student'
        ELSE pr.display_name
    END AS author_display_name,
    p.post_type,
    p.category,
    p.title,
    p.content,
    p.tags,
    p.is_anonymous,
    p.helpful_count,
    p.has_accepted_answer,
    p.status,
    p.created_at,
    p.updated_at
FROM public.posts p
LEFT JOIN public.profiles pr ON p.author_id = pr.id;

CREATE OR REPLACE VIEW public.v_comments
WITH (security_invoker = true) AS
SELECT
    c.id,
    c.post_id,
    c.campus_id,
    c.parent_comment_id,
    CASE
        WHEN c.is_anonymous AND c.author_id IS DISTINCT FROM auth.uid() THEN NULL
        ELSE c.author_id
    END AS author_id,
    CASE
        WHEN c.is_anonymous AND c.author_id IS DISTINCT FROM auth.uid() THEN 'Anonymous Student'
        ELSE pr.display_name
    END AS author_display_name,
    c.content,
    c.is_anonymous,
    c.is_accepted_answer,
    c.helpful_count,
    c.status,
    c.created_at
FROM public.comments c
LEFT JOIN public.profiles pr ON c.author_id = pr.id;

-- -----------------------------------------------------------------------------
-- 13. RPC RAG match_campus_chunks (menggantikan versi v2 yang SECURITY DEFINER tanpa search_path)
--     Celah v2: filter_campus_id dari klien dihormati, dan fungsi berjalan sebagai owner
--     sehingga RLS terlewati. Perbaikan: campus dan program selalu dari profil pemanggil,
--     argumen filter hanya dihormati untuk pemanggil privileged (admin/service/SQL Editor).
--     Signature tidak berubah.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.match_campus_chunks(
    query_embedding VECTOR(768),
    filter_campus_id UUID DEFAULT NULL,
    filter_program_id UUID DEFAULT NULL,
    match_threshold FLOAT DEFAULT 0.65,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    chunk_id UUID,
    source_title VARCHAR,
    source_type VARCHAR,
    chunk_text TEXT,
    is_general BOOLEAN,
    campus_id UUID,
    program_id UUID,
    similarity FLOAT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    WITH scope AS (
        SELECT
            CASE
                WHEN public.is_privileged() AND filter_campus_id IS NOT NULL THEN filter_campus_id
                ELSE public.current_campus_id()
            END AS scope_campus_id,
            CASE
                WHEN public.is_privileged() AND filter_program_id IS NOT NULL THEN filter_program_id
                ELSE public.current_program_id()
            END AS scope_program_id
    )
    SELECT
        c.id AS chunk_id,
        c.source_title,
        c.source_type,
        c.chunk_text,
        c.is_general,
        c.campus_id,
        c.program_id,
        1 - (c.embedding <=> query_embedding) AS similarity
    FROM public.content_chunks c
    CROSS JOIN scope s
    LEFT JOIN public.guides g ON c.guide_id = g.id
    WHERE
        -- Guide yang tidak dipublikasikan tidak ikut.
        (c.guide_id IS NULL OR g.is_published = true)
        -- Tenant: panduan umum, atau kampus pemanggil.
        AND (c.is_general = true OR c.campus_id = s.scope_campus_id)
        -- Program: chunk umum (NULL) atau program pemanggil. Wajib, bukan opsional.
        AND (c.program_id IS NULL OR c.program_id = s.scope_program_id)
        AND (1 - (c.embedding <=> query_embedding)) > match_threshold
    ORDER BY c.embedding <=> query_embedding ASC
    LIMIT match_count;
$$;

-- -----------------------------------------------------------------------------
-- 14. HAK EXECUTE RPC RAG
-- -----------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.match_campus_chunks(vector, uuid, uuid, double precision, integer)
    FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.match_campus_chunks(vector, uuid, uuid, double precision, integer)
    TO authenticated;

COMMIT;
