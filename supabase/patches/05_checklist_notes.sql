-- =============================================================================
-- 05_checklist_notes.sql
-- Adds a personal note column to journey_checklist_progress so students can
-- record their findings or outcomes on any roadmap checklist step.
-- =============================================================================

BEGIN;

ALTER TABLE public.journey_checklist_progress
    ADD COLUMN IF NOT EXISTS note TEXT;

COMMIT;
