-- Regression checks for profiles tenant isolation.
-- Run with psql after the schema, seed, and patches/01_profiles_tenant_hardening.sql.
-- Do not run this as a service-role/API request. It uses SET ROLE authenticated
-- and JWT claim GUCs so auth.uid()/auth.role() follow the ordinary-user path.
--
-- Example:
-- psql "$DATABASE_URL" -v insert_user_id=<fresh-auth-user-uuid> -v member_a_id=<completed-profile-user-uuid> -v member_b_id=<other-campus-profile-user-uuid> -v campus_a_id=<campus-a-uuid> -v campus_b_id=<campus-b-uuid> -v faculty_a_id=<faculty-a-uuid> -v faculty_b_id=<faculty-b-uuid> -v program_a_id=<program-a-uuid> -v program_b_id=<program-b-uuid> -f supabase/tests/profiles_tenant.sql
--
-- Preconditions:
--   * insert_user_id exists in auth.users and has no profiles row.
--   * member_a_id has a completed profile in campus A / faculty A / program A.
--   * member_b_id has a profile in campus B.
--   * Both program/faculty/campus chains are valid and A differs from B.
--   * Run as a database owner able to SET ROLE authenticated.
--
-- Every mutation is rolled back. No rows or schema objects are kept.
--
-- Expected results:
-- | Case | Expected |
-- | Insert B campus with A program | REJECT |
-- | Insert A campus with B faculty/program | REJECT |
-- | Insert onboarding complete without campus | REJECT |
-- | Insert onboarding complete without program | REJECT |
-- | Create incomplete profile with valid campus | ACCEPT |
-- | Clear campus (NULL) on that profile | REJECT |
-- | Move profile from A to valid B chain | REJECT |
-- | Change profile to mismatched B program/faculty | REJECT |
-- | Complete onboarding with valid A chain | ACCEPT |
-- | Cancel completed onboarding | REJECT |
-- | Update own display_name | ACCEPT |
-- | Read own profile | ACCEPT |
-- | Read member B profile while in campus A | REJECT (0 rows) |
--
-- Scope note: a first-time user's coherent campus-B profile cannot be called
-- "another campus" from the database alone: the current design lets onboarding
-- choose any campus and has no trusted campus-membership claim. This script
-- checks cross-campus UPDATE and inconsistent cross-campus INSERT; a policy
-- rejecting a coherent first insert needs a separate product rule/source.

\set ON_ERROR_STOP on

BEGIN;

SELECT set_config('profiles_test.insert_user_id', :'insert_user_id', true);
SELECT set_config('profiles_test.member_a_id', :'member_a_id', true);
SELECT set_config('profiles_test.member_b_id', :'member_b_id', true);
SELECT set_config('profiles_test.campus_a_id', :'campus_a_id', true);
SELECT set_config('profiles_test.campus_b_id', :'campus_b_id', true);
SELECT set_config('profiles_test.faculty_a_id', :'faculty_a_id', true);
SELECT set_config('profiles_test.faculty_b_id', :'faculty_b_id', true);
SELECT set_config('profiles_test.program_a_id', :'program_a_id', true);
SELECT set_config('profiles_test.program_b_id', :'program_b_id', true);

DO $preflight$
DECLARE
    v_insert_id UUID := current_setting('profiles_test.insert_user_id')::uuid;
    v_member_a UUID := current_setting('profiles_test.member_a_id')::uuid;
    v_member_b UUID := current_setting('profiles_test.member_b_id')::uuid;
    v_campus_a UUID := current_setting('profiles_test.campus_a_id')::uuid;
    v_campus_b UUID := current_setting('profiles_test.campus_b_id')::uuid;
    v_faculty_a UUID := current_setting('profiles_test.faculty_a_id')::uuid;
    v_faculty_b UUID := current_setting('profiles_test.faculty_b_id')::uuid;
    v_program_a UUID := current_setting('profiles_test.program_a_id')::uuid;
    v_program_b UUID := current_setting('profiles_test.program_b_id')::uuid;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_insert_id)
       OR EXISTS (SELECT 1 FROM public.profiles WHERE id = v_insert_id) THEN
        RAISE EXCEPTION 'Precondition failed: insert_user_id must be an auth user without a profile.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = v_member_a AND campus_id = v_campus_a
          AND faculty_id = v_faculty_a AND program_id = v_program_a
          AND onboarding_completed
    ) THEN
        RAISE EXCEPTION 'Precondition failed: member_a_id must have a completed A profile.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = v_member_b AND campus_id = v_campus_b
    ) THEN
        RAISE EXCEPTION 'Precondition failed: member_b_id must have a profile in campus B.';
    END IF;

    IF v_campus_a = v_campus_b OR NOT EXISTS (
        SELECT 1 FROM public.faculties
        WHERE id = v_faculty_a AND campus_id = v_campus_a
    ) OR NOT EXISTS (
        SELECT 1 FROM public.faculties
        WHERE id = v_faculty_b AND campus_id = v_campus_b
    ) OR NOT EXISTS (
        SELECT 1 FROM public.programs
        WHERE id = v_program_a AND campus_id = v_campus_a AND faculty_id = v_faculty_a
    ) OR NOT EXISTS (
        SELECT 1 FROM public.programs
        WHERE id = v_program_b AND campus_id = v_campus_b AND faculty_id = v_faculty_b
    ) THEN
        RAISE EXCEPTION 'Precondition failed: campus A/B and faculty/program fixtures must be distinct and consistent.';
    END IF;
END;
$preflight$;

SET LOCAL ROLE authenticated;

SELECT set_config('request.jwt.claim.role', 'authenticated', true);
SELECT set_config('request.jwt.claim.sub', current_setting('profiles_test.insert_user_id'), true);
SELECT set_config(
    'request.jwt.claims',
    json_build_object(
        'role', 'authenticated',
        'sub', current_setting('profiles_test.insert_user_id')
    )::text,
    true
);

DO $insert_rejections$
DECLARE
    v_user UUID := auth.uid();
    v_campus_a UUID := current_setting('profiles_test.campus_a_id')::uuid;
    v_campus_b UUID := current_setting('profiles_test.campus_b_id')::uuid;
    v_faculty_a UUID := current_setting('profiles_test.faculty_a_id')::uuid;
    v_faculty_b UUID := current_setting('profiles_test.faculty_b_id')::uuid;
    v_program_a UUID := current_setting('profiles_test.program_a_id')::uuid;
    v_program_b UUID := current_setting('profiles_test.program_b_id')::uuid;
    v_rows BIGINT;
    v_message TEXT;
    v_state TEXT;
BEGIN
    BEGIN
        INSERT INTO public.profiles (id, campus_id, faculty_id, program_id, role)
        VALUES (v_user, v_campus_b, v_faculty_b, v_program_a, 'student');
        GET DIAGNOSTICS v_rows = ROW_COUNT;
        IF v_rows > 0 THEN RAISE EXCEPTION 'FAIL: cross-campus/program-mismatch INSERT succeeded'; END IF;
        RAISE NOTICE 'PASS: mismatched campus/program INSERT rejected by RLS.';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_message = MESSAGE_TEXT, v_state = RETURNED_SQLSTATE;
        IF v_message LIKE 'FAIL:%' THEN RAISE; END IF;
        IF v_state NOT IN ('42501', 'P0001') OR position('Program tidak cocok' in v_message) = 0 THEN
            RAISE EXCEPTION 'FAIL: mismatched INSERT raised unexpected error [%] %', v_state, v_message;
        END IF;
        RAISE NOTICE 'PASS: mismatched campus/program INSERT rejected by trigger.';
    END;

    BEGIN
        INSERT INTO public.profiles (id, campus_id, faculty_id, program_id, role)
        VALUES (v_user, v_campus_a, v_faculty_b, v_program_b, 'student');
        GET DIAGNOSTICS v_rows = ROW_COUNT;
        IF v_rows > 0 THEN RAISE EXCEPTION 'FAIL: mismatched faculty/program INSERT succeeded'; END IF;
        RAISE NOTICE 'PASS: mismatched faculty/program INSERT rejected by RLS.';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_message = MESSAGE_TEXT, v_state = RETURNED_SQLSTATE;
        IF v_message LIKE 'FAIL:%' THEN RAISE; END IF;
        IF v_state NOT IN ('42501', 'P0001') OR position('Program tidak cocok' in v_message) = 0 THEN
            RAISE EXCEPTION 'FAIL: mismatched faculty/program INSERT raised unexpected error [%] %', v_state, v_message;
        END IF;
        RAISE NOTICE 'PASS: mismatched faculty/program INSERT rejected by trigger.';
    END;

    BEGIN
        INSERT INTO public.profiles (id, role, onboarding_completed)
        VALUES (v_user, 'student', true);
        GET DIAGNOSTICS v_rows = ROW_COUNT;
        IF v_rows > 0 THEN RAISE EXCEPTION 'FAIL: onboarding without campus succeeded'; END IF;
        RAISE NOTICE 'PASS: completed onboarding without campus rejected by RLS.';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_message = MESSAGE_TEXT, v_state = RETURNED_SQLSTATE;
        IF v_message LIKE 'FAIL:%' THEN RAISE; END IF;
        IF v_state NOT IN ('42501', 'P0001') OR position('Onboarding butuh kampus dan program' in v_message) = 0 THEN
            RAISE EXCEPTION 'FAIL: onboarding-without-campus INSERT raised unexpected error [%] %', v_state, v_message;
        END IF;
        RAISE NOTICE 'PASS: completed onboarding without campus rejected by trigger.';
    END;

    BEGIN
        INSERT INTO public.profiles (id, campus_id, faculty_id, role, onboarding_completed)
        VALUES (v_user, v_campus_a, v_faculty_a, 'student', true);
        GET DIAGNOSTICS v_rows = ROW_COUNT;
        IF v_rows > 0 THEN RAISE EXCEPTION 'FAIL: onboarding without program succeeded'; END IF;
        RAISE NOTICE 'PASS: completed onboarding without program rejected by RLS.';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_message = MESSAGE_TEXT, v_state = RETURNED_SQLSTATE;
        IF v_message LIKE 'FAIL:%' THEN RAISE; END IF;
        IF v_state NOT IN ('42501', 'P0001') OR position('Onboarding butuh kampus dan program' in v_message) = 0 THEN
            RAISE EXCEPTION 'FAIL: onboarding-without-program INSERT raised unexpected error [%] %', v_state, v_message;
        END IF;
        RAISE NOTICE 'PASS: completed onboarding without program rejected by trigger.';
    END;

    INSERT INTO public.profiles (id, campus_id, role, display_name, onboarding_completed)
    VALUES (v_user, v_campus_a, 'student', 'RLS test user', false);
    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows <> 1 THEN RAISE EXCEPTION 'FAIL: valid incomplete profile INSERT affected % rows', v_rows; END IF;
    RAISE NOTICE 'PASS: valid incomplete profile INSERT accepted.';
END;
$insert_rejections$;

DO $profile_updates$
DECLARE
    v_user UUID := auth.uid();
    v_campus_a UUID := current_setting('profiles_test.campus_a_id')::uuid;
    v_campus_b UUID := current_setting('profiles_test.campus_b_id')::uuid;
    v_faculty_a UUID := current_setting('profiles_test.faculty_a_id')::uuid;
    v_faculty_b UUID := current_setting('profiles_test.faculty_b_id')::uuid;
    v_program_a UUID := current_setting('profiles_test.program_a_id')::uuid;
    v_program_b UUID := current_setting('profiles_test.program_b_id')::uuid;
    v_rows BIGINT;
    v_message TEXT;
    v_state TEXT;
BEGIN
    BEGIN
        UPDATE public.profiles
        SET campus_id = NULL, faculty_id = NULL, program_id = NULL
        WHERE id = v_user;
        GET DIAGNOSTICS v_rows = ROW_COUNT;
        IF v_rows > 0 THEN RAISE EXCEPTION 'FAIL: campus_id NULL update succeeded'; END IF;
        RAISE NOTICE 'PASS: NULL campus update rejected by RLS.';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_message = MESSAGE_TEXT, v_state = RETURNED_SQLSTATE;
        IF v_message LIKE 'FAIL:%' THEN RAISE; END IF;
        IF v_state NOT IN ('42501', 'P0001') OR position('Pemindahan kampus' in v_message) = 0 THEN
            RAISE EXCEPTION 'FAIL: NULL campus update raised unexpected error [%] %', v_state, v_message;
        END IF;
        RAISE NOTICE 'PASS: NULL campus update rejected by trigger (IS DISTINCT FROM guard).';
    END;

    BEGIN
        UPDATE public.profiles
        SET campus_id = v_campus_b, faculty_id = v_faculty_b, program_id = v_program_b
        WHERE id = v_user;
        GET DIAGNOSTICS v_rows = ROW_COUNT;
        IF v_rows > 0 THEN RAISE EXCEPTION 'FAIL: cross-campus profile update succeeded'; END IF;
        RAISE NOTICE 'PASS: cross-campus profile update rejected by RLS.';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_message = MESSAGE_TEXT, v_state = RETURNED_SQLSTATE;
        IF v_message LIKE 'FAIL:%' THEN RAISE; END IF;
        IF v_state NOT IN ('42501', 'P0001') OR position('Pemindahan kampus' in v_message) = 0 THEN
            RAISE EXCEPTION 'FAIL: cross-campus update raised unexpected error [%] %', v_state, v_message;
        END IF;
        RAISE NOTICE 'PASS: cross-campus profile update rejected by trigger.';
    END;

    BEGIN
        UPDATE public.profiles SET program_id = v_program_b WHERE id = v_user;
        GET DIAGNOSTICS v_rows = ROW_COUNT;
        IF v_rows > 0 THEN RAISE EXCEPTION 'FAIL: mismatched program update succeeded'; END IF;
        RAISE NOTICE 'PASS: mismatched program update rejected by RLS.';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_message = MESSAGE_TEXT, v_state = RETURNED_SQLSTATE;
        IF v_message LIKE 'FAIL:%' THEN RAISE; END IF;
        IF v_state NOT IN ('42501', 'P0001') OR position('Program tidak cocok' in v_message) = 0 THEN
            RAISE EXCEPTION 'FAIL: mismatched program update raised unexpected error [%] %', v_state, v_message;
        END IF;
        RAISE NOTICE 'PASS: mismatched program update rejected by trigger.';
    END;

    BEGIN
        UPDATE public.profiles
        SET campus_id = v_campus_a, faculty_id = v_faculty_b, program_id = v_program_a
        WHERE id = v_user;
        GET DIAGNOSTICS v_rows = ROW_COUNT;
        IF v_rows > 0 THEN RAISE EXCEPTION 'FAIL: mismatched faculty update succeeded'; END IF;
        RAISE NOTICE 'PASS: mismatched faculty update rejected by RLS.';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_message = MESSAGE_TEXT, v_state = RETURNED_SQLSTATE;
        IF v_message LIKE 'FAIL:%' THEN RAISE; END IF;
        IF v_state NOT IN ('42501', 'P0001') OR position('Program tidak cocok' in v_message) = 0 THEN
            RAISE EXCEPTION 'FAIL: mismatched faculty update raised unexpected error [%] %', v_state, v_message;
        END IF;
        RAISE NOTICE 'PASS: mismatched faculty update rejected by trigger.';
    END;

    BEGIN
        UPDATE public.profiles SET onboarding_completed = true WHERE id = v_user;
        GET DIAGNOSTICS v_rows = ROW_COUNT;
        IF v_rows > 0 THEN RAISE EXCEPTION 'FAIL: onboarding without program update succeeded'; END IF;
        RAISE NOTICE 'PASS: onboarding completion without program rejected by RLS.';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_message = MESSAGE_TEXT, v_state = RETURNED_SQLSTATE;
        IF v_message LIKE 'FAIL:%' THEN RAISE; END IF;
        IF v_state NOT IN ('42501', 'P0001') OR position('Onboarding butuh kampus dan program' in v_message) = 0 THEN
            RAISE EXCEPTION 'FAIL: incomplete onboarding update raised unexpected error [%] %', v_state, v_message;
        END IF;
        RAISE NOTICE 'PASS: onboarding completion without program rejected by trigger.';
    END;

    UPDATE public.profiles
    SET faculty_id = v_faculty_a, program_id = v_program_a, onboarding_completed = true
    WHERE id = v_user;
    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows <> 1 THEN RAISE EXCEPTION 'FAIL: valid onboarding completion affected % rows', v_rows; END IF;
    RAISE NOTICE 'PASS: valid onboarding completion accepted.';

    BEGIN
        UPDATE public.profiles SET onboarding_completed = false WHERE id = v_user;
        GET DIAGNOSTICS v_rows = ROW_COUNT;
        IF v_rows > 0 THEN RAISE EXCEPTION 'FAIL: completed onboarding was cancelled'; END IF;
        RAISE NOTICE 'PASS: onboarding cancellation rejected by RLS.';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_message = MESSAGE_TEXT, v_state = RETURNED_SQLSTATE;
        IF v_message LIKE 'FAIL:%' THEN RAISE; END IF;
        IF v_state NOT IN ('42501', 'P0001') OR position('Status onboarding tidak boleh dibatalkan' in v_message) = 0 THEN
            RAISE EXCEPTION 'FAIL: onboarding cancellation raised unexpected error [%] %', v_state, v_message;
        END IF;
        RAISE NOTICE 'PASS: onboarding cancellation rejected by trigger.';
    END;

    UPDATE public.profiles SET display_name = 'Updated test name' WHERE id = v_user;
    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows <> 1 THEN RAISE EXCEPTION 'FAIL: own display_name update affected % rows', v_rows; END IF;
    RAISE NOTICE 'PASS: own display_name update accepted.';
END;
$profile_updates$;

SELECT set_config('request.jwt.claim.sub', current_setting('profiles_test.member_a_id'), true);
SELECT set_config(
    'request.jwt.claims',
    json_build_object(
        'role', 'authenticated',
        'sub', current_setting('profiles_test.member_a_id')
    )::text,
    true
);

DO $profile_reads$
DECLARE
    v_own UUID := auth.uid();
    v_other UUID := current_setting('profiles_test.member_b_id')::uuid;
    v_rows BIGINT;
BEGIN
    SELECT count(*) INTO v_rows FROM public.profiles WHERE id = v_own;
    IF v_rows <> 1 THEN RAISE EXCEPTION 'FAIL: own profile should be readable; got % rows', v_rows; END IF;
    RAISE NOTICE 'PASS: own profile is readable.';

    SELECT count(*) INTO v_rows FROM public.profiles WHERE id = v_other;
    IF v_rows <> 0 THEN RAISE EXCEPTION 'FAIL: cross-campus profile leaked; got % rows', v_rows; END IF;
    RAISE NOTICE 'PASS: cross-campus profile is hidden by RLS.';
END;
$profile_reads$;

ROLLBACK;
