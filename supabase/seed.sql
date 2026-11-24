-- =============================================================================
-- SYNTHETIC DEMO DATA - for development, demos and testing ONLY.
-- Not real campus data. Never mix with research data (see CONTRIBUTING.md).
--
-- Run in the Supabase SQL Editor AFTER the schema in docs/TECH_AND_DATABASE.md.
-- Safe to run more than once (idempotent).
-- Replace the names below with the real pilot campus before a public pilot.
-- =============================================================================
DO $$
DECLARE
    v_campus  UUID;
    v_teknik  UUID;
    v_ekonomi UUID;
BEGIN
    -- Campus
    INSERT INTO public.campuses (name, slug, domain, is_active)
    VALUES ('Universitas Contoh (Demo)', 'universitas-contoh', 'contoh.ac.id', true)
    ON CONFLICT (slug) DO NOTHING;

    SELECT id INTO v_campus FROM public.campuses WHERE slug = 'universitas-contoh';

    -- Faculties
    INSERT INTO public.faculties (campus_id, name, code)
    SELECT v_campus, 'Fakultas Teknik', 'FT'
    WHERE NOT EXISTS (
        SELECT 1 FROM public.faculties WHERE campus_id = v_campus AND code = 'FT'
    );

    INSERT INTO public.faculties (campus_id, name, code)
    SELECT v_campus, 'Fakultas Ekonomi dan Bisnis', 'FEB'
    WHERE NOT EXISTS (
        SELECT 1 FROM public.faculties WHERE campus_id = v_campus AND code = 'FEB'
    );

    SELECT id INTO v_teknik  FROM public.faculties WHERE campus_id = v_campus AND code = 'FT';
    SELECT id INTO v_ekonomi FROM public.faculties WHERE campus_id = v_campus AND code = 'FEB';

    -- Programs (unique per campus by code)
    INSERT INTO public.programs (campus_id, faculty_id, name, code, degree_level, is_pilot)
    VALUES
        (v_campus, v_teknik,  'Informatika',       'IF', 'Undergraduate', true),
        (v_campus, v_teknik,  'Sistem Informasi',  'SI', 'Undergraduate', true),
        (v_campus, v_ekonomi, 'Manajemen',         'MN', 'Undergraduate', false)
    ON CONFLICT (campus_id, code) DO NOTHING;
END $$;
