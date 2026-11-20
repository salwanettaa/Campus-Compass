# Database Schema Specification

> **Document**: `docs/database/database-schema.md`  
> **Owner**: Netta (Backend, Database & AI Architecture Lead)  
> **Status**: Approved (Foundation Phase)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/database/erd.md`](erd.md), [`docs/database/rls-policies.md`](rls-policies.md)

---

## 1. Purpose

This document provides the exhaustive PostgreSQL DDL schema definition for Campus Compass, including table structures, data types, constraints, foreign keys, vector indexes, and triggers.

---

## 2. Extensions & Configuration

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";      -- pgvector for semantic search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- trigram search for fuzzy title matching
```

---

## 3. Core Tables DDL

### 1. `universities`
```sql
CREATE TABLE public.universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    domain VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_universities_slug ON public.universities(slug);
```

### 2. `study_programs`
```sql
CREATE TABLE public.study_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    degree_level VARCHAR(50) NOT NULL DEFAULT 'Undergraduate', -- Undergraduate, Master, etc.
    is_pilot BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_program_code_per_univ UNIQUE (university_id, code)
);

CREATE INDEX idx_study_programs_univ ON public.study_programs(university_id);
```

### 3. `profiles`
```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    study_program_id UUID REFERENCES public.study_programs(id) ON DELETE SET NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'curator', 'admin')),
    semester INT CHECK (semester BETWEEN 1 AND 14),
    enrollment_year INT CHECK (enrollment_year >= 2015),
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_profiles_univ ON public.profiles(university_id);
CREATE INDEX idx_profiles_program ON public.profiles(study_program_id);
```

### 4. `knowledge_items`
```sql
CREATE TABLE public.knowledge_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
    study_program_id UUID REFERENCES public.study_programs(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'academics', 'facilities', 'regulations'
    is_general BOOLEAN NOT NULL DEFAULT false,
    access_level VARCHAR(50) NOT NULL DEFAULT 'campus_scoped' 
        CHECK (access_level IN ('public', 'campus_scoped', 'private')),
    content_raw TEXT NOT NULL,
    source_reference VARCHAR(500), -- e.g., 'Handbook 2024 §3.1'
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- General items MUST have NULL university_id; campus items MUST have university_id
    CONSTRAINT chk_knowledge_scope CHECK (
        (is_general = true AND university_id IS NULL) OR
        (is_general = false AND university_id IS NOT NULL)
    )
);

CREATE INDEX idx_knowledge_items_scope ON public.knowledge_items(is_general, university_id, study_program_id);
```

### 5. `knowledge_chunks`
```sql
CREATE TABLE public.knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_item_id UUID NOT NULL REFERENCES public.knowledge_items(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    token_count INT,
    embedding VECTOR(768) NOT NULL, -- Matched to Gemini text-embedding-004 dimensions
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- HNSW Vector Index for low-latency cosine similarity search
CREATE INDEX idx_knowledge_chunks_embedding 
ON public.knowledge_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_knowledge_chunks_item ON public.knowledge_chunks(knowledge_item_id);
```

### 6. `senior_tips`
```sql
CREATE TABLE public.senior_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
    study_program_id UUID REFERENCES public.study_programs(id) ON DELETE CASCADE,
    author_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_verified BOOLEAN NOT NULL DEFAULT false,
    helpful_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_senior_tips_scope ON public.senior_tips(university_id, study_program_id, is_verified);
```

### 7. `recommendation_rules` & `user_recommendations`
```sql
CREATE TABLE public.recommendation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_program_id UUID REFERENCES public.study_programs(id) ON DELETE CASCADE, -- NULL means universal
    rule_code VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'academic_requirement',
    target_semester INT NOT NULL CHECK (target_semester BETWEEN 1 AND 14),
    action_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.user_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rule_id UUID NOT NULL REFERENCES public.recommendation_rules(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dismissed')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_rule UNIQUE (profile_id, rule_id)
);

CREATE INDEX idx_user_recommendations_profile ON public.user_recommendations(profile_id, status);
```

---

## 4. Vector Match RPC Function Definition

```sql
CREATE OR REPLACE FUNCTION public.match_knowledge_chunks(
    query_embedding VECTOR(768),
    filter_university_id UUID,
    filter_study_program_id UUID,
    match_threshold FLOAT DEFAULT 0.65,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    chunk_id UUID,
    knowledge_item_id UUID,
    chunk_text TEXT,
    title VARCHAR,
    is_general BOOLEAN,
    university_id UUID,
    study_program_id UUID,
    similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
    SELECT
        kc.id AS chunk_id,
        ki.id AS knowledge_item_id,
        kc.chunk_text,
        ki.title,
        ki.is_general,
        ki.university_id,
        ki.study_program_id,
        1 - (kc.embedding <=> query_embedding) AS similarity
    FROM public.knowledge_chunks kc
    JOIN public.knowledge_items ki ON kc.knowledge_item_id = ki.id
    WHERE ki.is_published = true
      AND (
          ki.is_general = true 
          OR (
              ki.university_id = filter_university_id 
              AND (ki.study_program_id = filter_study_program_id OR ki.study_program_id IS NULL)
          )
      )
      AND (1 - (kc.embedding <=> query_embedding)) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
$$;
```

---

## 5. Confirmed vs. Proposed Elements

### Confirmed
- [x] Schema includes explicit constraint `chk_knowledge_scope`.
- [x] 768-dimension vector configuration aligned with Gemini `text-embedding-004`.
- [x] HNSW index specified for performant vector lookups.

### Proposed
- [ ] Partitioning `knowledge_chunks` by `university_id` (deferred until multi-campus expansion).

---

## 6. Open Questions

1. Should the `senior_tips` table support a student upvoting history table to prevent duplicate votes? (Owner: Netta)
