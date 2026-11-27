-- =============================================================================
-- 04_journey_and_tasks.sql
-- Adds persistence tables for My Journey (checklist progress + reflections)
-- and My Tasks (personal tasks with optional link to My Journey checklist).
-- Safe to run once in Supabase SQL Editor. Wrapped in BEGIN ... COMMIT.
-- =============================================================================

BEGIN;

-- Shared updated_at trigger helper
CREATE OR REPLACE FUNCTION public.trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1. My Journey Checklist Progress
CREATE TABLE IF NOT EXISTS public.journey_checklist_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    area VARCHAR(50) NOT NULL CHECK (area IN ('social', 'academic', 'internship', 'scholarship', 'competition')),
    checklist_item_id VARCHAR(120) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_checklist_item UNIQUE (user_id, checklist_item_id)
);

CREATE INDEX IF NOT EXISTS idx_journey_checklist_user_area
    ON public.journey_checklist_progress(user_id, area);

DROP TRIGGER IF EXISTS trg_journey_checklist_updated_at ON public.journey_checklist_progress;
CREATE TRIGGER trg_journey_checklist_updated_at
    BEFORE UPDATE ON public.journey_checklist_progress
    FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();

ALTER TABLE public.journey_checklist_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own journey checklist" ON public.journey_checklist_progress;
CREATE POLICY "Users manage own journey checklist"
    ON public.journey_checklist_progress
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

REVOKE ALL ON public.journey_checklist_progress FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journey_checklist_progress TO authenticated;

-- 2. My Journey Reflections
CREATE TABLE IF NOT EXISTS public.journey_reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    area VARCHAR(50) NOT NULL CHECK (area IN ('social', 'academic', 'internship', 'scholarship', 'competition')),
    note TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_journey_reflection UNIQUE (user_id, area)
);

CREATE INDEX IF NOT EXISTS idx_journey_reflections_user_area
    ON public.journey_reflections(user_id, area);

DROP TRIGGER IF EXISTS trg_journey_reflections_updated_at ON public.journey_reflections;
CREATE TRIGGER trg_journey_reflections_updated_at
    BEFORE UPDATE ON public.journey_reflections
    FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();

ALTER TABLE public.journey_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own journey reflections" ON public.journey_reflections;
CREATE POLICY "Users manage own journey reflections"
    ON public.journey_reflections
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

REVOKE ALL ON public.journey_reflections FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journey_reflections TO authenticated;

-- 3. My Tasks
CREATE TABLE IF NOT EXISTS public.user_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATE,
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')),
    category VARCHAR(50) NOT NULL DEFAULT 'personal' CHECK (category IN ('social', 'academic', 'internship', 'scholarship', 'competition', 'personal')),
    status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'completed')),
    journey_checklist_id VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_user_tasks_user_status
    ON public.user_tasks(user_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_tasks_journey_item
    ON public.user_tasks(user_id, journey_checklist_id)
    WHERE journey_checklist_id IS NOT NULL;

DROP TRIGGER IF EXISTS trg_user_tasks_updated_at ON public.user_tasks;
CREATE TRIGGER trg_user_tasks_updated_at
    BEFORE UPDATE ON public.user_tasks
    FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();

ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own tasks" ON public.user_tasks;
CREATE POLICY "Users manage own tasks"
    ON public.user_tasks
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

REVOKE ALL ON public.user_tasks FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_tasks TO authenticated;

COMMIT;
