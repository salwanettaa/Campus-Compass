# Row Level Security (RLS) Policies

> **Document**: `docs/database/rls-policies.md`  
> **Owner**: Netta (Backend, Database & AI Architecture Lead)  
> **Status**: Approved (Foundation Phase)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/database/database-schema.md`](database-schema.md), [`docs/database/data-classification.md`](data-classification.md)

---

## 1. Purpose

This document defines the Row Level Security (RLS) policies implemented in Supabase PostgreSQL. RLS guarantees that data isolation rules are enforced at the database engine level, ensuring that bugs in the application layer cannot cause cross-tenant or private data leakage.

---

## 2. Security Fundamentals & Auth Helpers

All tables in the `public` schema have RLS enabled:
```sql
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.senior_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recommendations ENABLE ROW LEVEL SECURITY;
```

### Helper Functions for Policy Evaluation
To avoid repetitive joins, we define cached security definer helper functions:

```sql
-- Retrieve the authenticated user's assigned university ID
CREATE OR REPLACE FUNCTION public.get_auth_university_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT university_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Retrieve the authenticated user's assigned study program ID
CREATE OR REPLACE FUNCTION public.get_auth_program_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT study_program_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Check if user is curator or administrator
CREATE OR REPLACE FUNCTION public.is_admin_or_curator()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT role IN ('curator', 'admin') FROM public.profiles WHERE id = auth.uid();
$$;
```

---

## 3. Policy Definitions by Table

### 1. `universities` & `study_programs`
- **Read**: Authenticated and anonymous users can read active universities and study programs (needed for registration & onboarding).
- **Write**: Restricted to administrators.

```sql
CREATE POLICY "Public read active universities"
ON public.universities FOR SELECT
USING (is_active = true);

CREATE POLICY "Public read study programs"
ON public.study_programs FOR SELECT
USING (true);
```

### 2. `profiles`
- **Read**: Users can read their own profile. Curators/Admins can read profiles in their university.
- **Update**: Users can update their own profile fields (e.g. semester, onboarding status), but cannot self-promote their `role`.

```sql
CREATE POLICY "Users read own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_admin_or_curator());

CREATE POLICY "Users update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));
```

### 3. `knowledge_items`
- **Read**:
  - If `is_general = true`, any authenticated user may read.
  - If `is_general = false`, user's `university_id` must match `knowledge_items.university_id`, AND `study_program_id` must either match or be NULL.
- **Write**: Curators and Admins only.

```sql
CREATE POLICY "Read general or campus-scoped knowledge"
ON public.knowledge_items FOR SELECT
TO authenticated
USING (
    is_published = true AND (
        is_general = true OR 
        (
            university_id = public.get_auth_university_id() AND
            (study_program_id = public.get_auth_program_id() OR study_program_id IS NULL)
        )
    )
);

CREATE POLICY "Curators manage knowledge items"
ON public.knowledge_items FOR ALL
TO authenticated
USING (public.is_admin_or_curator())
WITH CHECK (public.is_admin_or_curator());
```

### 4. `knowledge_chunks`
- Inherits access control from the parent `knowledge_items` record.

```sql
CREATE POLICY "Read chunks through parent item scope"
ON public.knowledge_chunks FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.knowledge_items ki
        WHERE ki.id = knowledge_chunks.knowledge_item_id
          AND ki.is_published = true
          AND (
              ki.is_general = true OR
              (
                  ki.university_id = public.get_auth_university_id() AND
                  (ki.study_program_id = public.get_auth_program_id() OR ki.study_program_id IS NULL)
              )
          )
    )
);
```

### 5. `senior_tips`
- **Read**: Authenticated students enrolled in the matching `university_id` can read verified tips.
- **Insert**: Authenticated students can submit tips scoped to their own university/program.
- **Update / Delete**: Only authors can edit unverified tips; Curators/Admins can verify or moderate.

```sql
CREATE POLICY "Students read verified senior tips in campus"
ON public.senior_tips FOR SELECT
TO authenticated
USING (
    is_verified = true AND 
    university_id = public.get_auth_university_id() AND
    (study_program_id = public.get_auth_program_id() OR study_program_id IS NULL)
);

CREATE POLICY "Students submit senior tips"
ON public.senior_tips FOR INSERT
TO authenticated
WITH CHECK (
    author_profile_id = auth.uid() AND
    university_id = public.get_auth_university_id()
);
```

### 6. `user_recommendations`
- Strictly private to the owning user.

```sql
CREATE POLICY "Users manage own recommendations"
ON public.user_recommendations FOR ALL
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());
```

---

## 4. Confirmed vs. Proposed RLS Policies

### Confirmed
- [x] All tables have RLS enabled by default.
- [x] Strict tenant isolation using `get_auth_university_id()`.
- [x] `knowledge_chunks` access derived from parent `knowledge_items` scoping.

### Proposed
- [ ] Rate-limit logging table (`query_logs`) RLS allowing insert only, read by user only.

---

## 5. Open Questions

1. Should anonymous prospective students be allowed to read general knowledge articles before registering? (Owner: Netta / Rifal)
