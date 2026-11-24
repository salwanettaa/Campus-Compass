-- Regression checks: cross-campus and cross-program READ isolation for content tables.
-- Tables: posts, comments, experiences, guides, content_chunks, v_posts, match_campus_chunks.
-- Run with psql AFTER schema v2, seed, and patches/01 and 02. Read-only; wrapped in ROLLBACK.
-- Run as a database owner (psql). Uses SET ROLE authenticated + JWT GUCs like profiles_tenant.sql.
-- This is NOT a PostgREST test. See supabase/patches/README.md for the API-level tests.
--
-- Example:
-- psql "$DATABASE_URL" -v member_a_id=<user-in-campus-A-program-A> -v campus_a_id=<A> -v campus_b_id=<B> -v program_a_id=<A-program> -v program_a2_id=<another-A-program> -v program_b_id=<B-program> -f supabase/tests/content_tenant.sql
--
-- Preconditions (checked in the preflight block; the test refuses to run if not met):
--   * member_a_id has a profile with campus A, program_a_id, onboarding completed.
--   * program_a2_id is a different program in campus A (for same-campus cross-program checks).
--   * program_b_id belongs to campus B (campus_b_id).
--   * Campus B has at least one: non-general guide, post, comment on a post, experience, content_chunk.
--   * Campus A/program_a has at least one published post (positive control).
--   * Campus A/program_a2 has at least one published post (cross-program fixture).
--
-- Expected: every cross-campus / cross-program query returns 0 rows, and the positive
-- control returns >= 1 row. A FAIL raises an exception.

\set ON_ERROR_STOP on

BEGIN;

SELECT set_config('content_test.member_a_id', :'member_a_id', true);
SELECT set_config('content_test.campus_a_id', :'campus_a_id', true);
SELECT set_config('content_test.campus_b_id', :'campus_b_id', true);
SELECT set_config('content_test.program_a_id', :'program_a_id', true);
SELECT set_config('content_test.program_a2_id', :'program_a2_id', true);
SELECT set_config('content_test.program_b_id', :'program_b_id', true);

DO $preflight$
DECLARE
    v_member UUID := current_setting('content_test.member_a_id')::uuid;
    v_campus_a UUID := current_setting('content_test.campus_a_id')::uuid;
    v_campus_b UUID := current_setting('content_test.campus_b_id')::uuid;
    v_prog_a UUID := current_setting('content_test.program_a_id')::uuid;
    v_prog_a2 UUID := current_setting('content_test.program_a2_id')::uuid;
    v_prog_b UUID := current_setting('content_test.program_b_id')::uuid;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = v_member AND campus_id = v_campus_a AND program_id = v_prog_a AND onboarding_completed
    ) THEN
        RAISE EXCEPTION 'Precondition failed: member_a must have a completed profile in campus A / program A.';
    END IF;
    IF v_prog_a2 = v_prog_a OR NOT EXISTS (
        SELECT 1 FROM public.programs WHERE id = v_prog_a2 AND campus_id = v_campus_a
    ) OR NOT EXISTS (
        SELECT 1 FROM public.programs WHERE id = v_prog_b AND campus_id = v_campus_b
    ) OR v_campus_a = v_campus_b THEN
        RAISE EXCEPTION 'Precondition failed: program fixtures must be distinct and in the right campus.';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.posts WHERE campus_id = v_campus_b)
       OR NOT EXISTS (SELECT 1 FROM public.comments WHERE campus_id = v_campus_b)
       OR NOT EXISTS (SELECT 1 FROM public.experiences WHERE campus_id = v_campus_b)
       OR NOT EXISTS (SELECT 1 FROM public.guides WHERE campus_id = v_campus_b AND is_general = false)
       OR NOT EXISTS (SELECT 1 FROM public.content_chunks WHERE campus_id = v_campus_b AND is_general = false) THEN
        RAISE EXCEPTION 'Precondition failed: campus B needs fixture rows in every content table.';
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM public.posts WHERE campus_id = v_campus_a AND program_id = v_prog_a AND status = 'published'
    ) THEN
        RAISE EXCEPTION 'Precondition failed: positive control needs a published post in campus A / program A.';
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM public.posts WHERE campus_id = v_campus_a AND program_id = v_prog_a2
    ) THEN
        RAISE EXCEPTION 'Precondition failed: program A2 needs at least one post.';
    END IF;
END;
$preflight$;

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.role', 'authenticated', true);
SELECT set_config('request.jwt.claim.sub', current_setting('content_test.member_a_id'), true);
SELECT set_config(
    'request.jwt.claims',
    json_build_object('role', 'authenticated', 'sub', current_setting('content_test.member_a_id'))::text,
    true
);

DO $content_reads$
DECLARE
    v_campus_a UUID := current_setting('content_test.campus_a_id')::uuid;
    v_campus_b UUID := current_setting('content_test.campus_b_id')::uuid;
    v_prog_a UUID := current_setting('content_test.program_a_id')::uuid;
    v_prog_a2 UUID := current_setting('content_test.program_a2_id')::uuid;
    v_prog_b UUID := current_setting('content_test.program_b_id')::uuid;
    v_rows BIGINT;
    v_emb TEXT;
BEGIN
    -- Kontrol positif: pengguna melihat post programnya sendiri.
    SELECT count(*) INTO v_rows FROM public.posts WHERE campus_id = v_campus_a AND program_id = v_prog_a;
    IF v_rows < 1 THEN RAISE EXCEPTION 'FAIL: positive control, own-program posts not visible (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: positive control, own-program posts visible (%).', v_rows;

    -- posts
    SELECT count(*) INTO v_rows FROM public.posts WHERE campus_id = v_campus_b;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: posts of campus B visible (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: posts of campus B hidden.';

    SELECT count(*) INTO v_rows FROM public.posts WHERE program_id = v_prog_b;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: posts of program B visible (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: posts of program B hidden.';

    SELECT count(*) INTO v_rows FROM public.posts WHERE program_id = v_prog_a2;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: posts of sibling program A2 visible (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: posts of sibling program in same campus hidden.';

    -- comments: diwarisi visibilitas post induk
    SELECT count(*) INTO v_rows FROM public.comments WHERE campus_id = v_campus_b;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: comments of campus B visible (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: comments of campus B hidden.';

    SELECT count(*) INTO v_rows FROM public.comments cm
    WHERE cm.post_id IN (SELECT p.id FROM public.posts p WHERE p.program_id = v_prog_a2);
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: comments of sibling program A2 posts visible (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: comments of sibling-program posts hidden.';

    -- experiences
    SELECT count(*) INTO v_rows FROM public.experiences WHERE campus_id = v_campus_b OR program_id = v_prog_b;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: experiences of campus/program B visible (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: experiences of campus B hidden.';

    SELECT count(*) INTO v_rows FROM public.experiences WHERE program_id = v_prog_a2;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: experiences of sibling program A2 visible (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: experiences of sibling program hidden.';

    -- guides
    SELECT count(*) INTO v_rows FROM public.guides WHERE campus_id = v_campus_b OR program_id = v_prog_b;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: guides of campus/program B visible (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: guides of campus B hidden.';

    SELECT count(*) INTO v_rows FROM public.guides WHERE is_published = false AND campus_id = v_campus_a;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: unpublished guides visible (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: unpublished guides hidden.';

    -- content_chunks
    SELECT count(*) INTO v_rows FROM public.content_chunks
    WHERE is_general = false AND campus_id = v_campus_b;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: chunks of campus B visible (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: chunks of campus B hidden.';

    SELECT count(*) INTO v_rows FROM public.content_chunks WHERE program_id = v_prog_a2;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: chunks of sibling program A2 visible (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: chunks of sibling program hidden.';

    -- RPC RAG: argumen filter klien tidak boleh membuka kampus lain.
    SELECT embedding::text INTO v_emb FROM public.content_chunks WHERE campus_id = v_campus_b AND is_general = false LIMIT 1;
    SELECT count(*) INTO v_rows
      FROM public.match_campus_chunks(v_emb::vector, v_campus_b, NULL, -1.0, 100) m
     WHERE m.campus_id = v_campus_b;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: match_campus_chunks returned campus B chunks (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: match_campus_chunks ignores caller-supplied campus filter.';

    SELECT count(*) INTO v_rows
      FROM public.match_campus_chunks(v_emb::vector, NULL, v_prog_b, -1.0, 100) m
     WHERE m.program_id = v_prog_b;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: match_campus_chunks returned program B chunks (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: match_campus_chunks ignores caller-supplied program filter.';

    -- v_posts: identitas anonim orang lain tidak boleh terbaca
    SELECT count(*) INTO v_rows
      FROM public.v_posts
     WHERE is_anonymous AND author_id IS NOT NULL AND author_id IS DISTINCT FROM auth.uid();
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: anonymous author_id of others exposed in v_posts (%)', v_rows; END IF;
    RAISE NOTICE 'PASS: v_posts masks anonymous author_id of others.';
END;
$content_reads$;

ROLLBACK;
