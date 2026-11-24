-- =============================================================================
-- PATCH 02 - Logika Community: helpful_count dari votes dan accepted answer
-- Status: SIAP-REVIEW. Belum dijalankan ke Supabase, belum diuji.
-- Urutan: jalankan SETELAH schema v2 dan 01_profiles_tenant_hardening.sql.
-- Dijalankan oleh: Netta. Jangan dijalankan dari chat/agen.
--
-- Desain (tanpa tabel atau kolom baru):
--   - helpful_count posts/comments dihitung trigger pada votes (INSERT +1, DELETE -1).
--     Trigger berjalan SECURITY DEFINER, jadi tidak terhalang RLS, dan UPDATE baris
--     induk atomik (row lock). Vote duplikat ditolak uq_vote_user_post / uq_vote_user_comment.
--   - helpful_count dikunci dari UPDATE penulis lewat GRANT di patch 01.
--   - Accepted answer lewat RPC set_accepted_answer(). Hanya penanya (posts.author_id),
--     campus harus sama, post bertipe 'question', dan satu jawaban per post dijaga
--     partial unique index.
-- Fungsi, trigger, dan RPC di sini perlu disepakati Netta dan Erick.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. helpful_count DARI VOTES
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trg_votes_sync_helpful_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.post_id IS NOT NULL THEN
            UPDATE public.posts SET helpful_count = helpful_count + 1 WHERE id = NEW.post_id;
        ELSE
            UPDATE public.comments SET helpful_count = helpful_count + 1 WHERE id = NEW.comment_id;
        END IF;
        RETURN NEW;
    END IF;

    -- DELETE
    IF OLD.post_id IS NOT NULL THEN
        UPDATE public.posts SET helpful_count = GREATEST(helpful_count - 1, 0) WHERE id = OLD.post_id;
    ELSE
        UPDATE public.comments SET helpful_count = GREATEST(helpful_count - 1, 0) WHERE id = OLD.comment_id;
    END IF;
    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_votes_helpful_insert ON public.votes;
CREATE TRIGGER trg_votes_helpful_insert
AFTER INSERT ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.trg_votes_sync_helpful_count();

DROP TRIGGER IF EXISTS trg_votes_helpful_delete ON public.votes;
CREATE TRIGGER trg_votes_helpful_delete
AFTER DELETE ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.trg_votes_sync_helpful_count();

-- Vote tidak boleh diubah. Pindah target lewat UPDATE akan menghitung ganda.
-- (Policy UPDATE untuk votes memang tidak ada; trigger ini menjaga juga dari service_role.)
CREATE OR REPLACE FUNCTION public.trg_votes_block_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    RAISE EXCEPTION 'Vote tidak dapat diubah. Hapus lalu buat ulang.';
END;
$$;

DROP TRIGGER IF EXISTS trg_votes_block_update ON public.votes;
CREATE TRIGGER trg_votes_block_update
BEFORE UPDATE ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.trg_votes_block_update();

-- -----------------------------------------------------------------------------
-- 2. ACCEPTED ANSWER: satu jawaban per post (dijaga DB)
-- -----------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS uq_one_accepted_answer_per_post
ON public.comments (post_id)
WHERE is_accepted_answer = true;

-- Saat komentar yang diterima dihapus, flag di post ikut dilepas.
CREATE OR REPLACE FUNCTION public.trg_comments_clear_accepted_on_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF OLD.is_accepted_answer THEN
        UPDATE public.posts SET has_accepted_answer = false WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_comments_accepted_on_delete ON public.comments;
CREATE TRIGGER trg_comments_accepted_on_delete
AFTER DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.trg_comments_clear_accepted_on_delete();

-- RPC: tandai atau lepas jawaban diterima. p_comment_id NULL = lepas tanda.
CREATE OR REPLACE FUNCTION public.set_accepted_answer(p_post_id UUID, p_comment_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid  UUID := auth.uid();
    v_post public.posts%ROWTYPE;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'Harus login.' USING ERRCODE = '42501';
    END IF;

    -- Kunci baris post: dua permintaan bersamaan harus berurutan.
    SELECT * INTO v_post FROM public.posts WHERE id = p_post_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Post tidak ditemukan.';
    END IF;

    IF v_post.author_id IS DISTINCT FROM v_uid THEN
        RAISE EXCEPTION 'Hanya penanya yang boleh menandai jawaban diterima.' USING ERRCODE = '42501';
    END IF;

    -- Tenant: post harus di kampus pemanggil.
    IF v_post.campus_id IS DISTINCT FROM public.current_campus_id() THEN
        RAISE EXCEPTION 'Post tidak ditemukan.';
    END IF;

    IF v_post.post_type <> 'question' THEN
        RAISE EXCEPTION 'Jawaban diterima hanya untuk post bertipe question.';
    END IF;

    IF p_comment_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM public.comments c
        WHERE c.id = p_comment_id
          AND c.post_id = p_post_id
          AND c.campus_id = v_post.campus_id  -- RPC SECURITY DEFINER melewati RLS, jadi cek eksplisit
          AND c.parent_comment_id IS NULL     -- jawaban = komentar level atas
          AND c.status = 'published'
    ) THEN
        RAISE EXCEPTION 'Komentar tidak valid sebagai jawaban untuk post ini.';
    END IF;

    UPDATE public.comments
       SET is_accepted_answer = false
     WHERE post_id = p_post_id AND is_accepted_answer = true;

    IF p_comment_id IS NOT NULL THEN
        UPDATE public.comments SET is_accepted_answer = true WHERE id = p_comment_id;
    END IF;

    UPDATE public.posts
       SET has_accepted_answer = (p_comment_id IS NOT NULL)
     WHERE id = p_post_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_accepted_answer(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_accepted_answer(UUID, UUID) TO authenticated;

-- Fungsi trigger tidak perlu EXECUTE untuk role mana pun (EXECUTE dicek saat CREATE TRIGGER).
REVOKE ALL ON FUNCTION public.trg_votes_sync_helpful_count(), public.trg_votes_block_update(),
    public.trg_comments_clear_accepted_on_delete() FROM PUBLIC, anon, authenticated;

COMMIT;
