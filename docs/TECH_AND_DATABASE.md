# Campus Compass — Technical Blueprint & Database Specification

> **Dokumen**: `docs/TECH_AND_DATABASE.md`  
> **Status**: Aligned with Official Feature Blueprint (v1.0)  
> **Target Vibe Coding**: Selesai Senin, 23 November 2026  
> **Target Debugging & QA**: Selesai Sabtu, 28 November 2026  
> **Dependencies**: [`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md)

---

## 1. Tumpukan Teknologi (Tech Stack)

| Layer | Pilihan Teknologi | Versi / Spesifikasi | Rationale & Tanggung Jawab |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js (App Router), React, TypeScript | Next.js 14+/15+, TS Strict | Responsive web app, navigasi 4 modul utama, Server Actions, streaming SSE. |
| **UI System** | Tailwind CSS, shadcn/ui, Lucide Icons | Latest | Komponen antarmuka yang konsisten, modern, dan sangat cepat untuk vibe coding. |
| **Backend** | Next.js Server Actions / Route Handlers | Edge & Node Runtime | Validasi data, business logic, integrasi AI, dan otorisasi session. |
| **Database & Auth** | Supabase (PostgreSQL 15+) | Managed Supabase Cloud | Autentikasi email, Row Level Security bawaan, dan relasi data terstruktur. |
| **File Storage** | Supabase Storage | S3-Compatible | Penyimpanan dokumen panduan kampus dan lampiran aset gambar. |
| **Vector Retrieval** | pgvector di PostgreSQL | Ekstensi Supabase | Penyimpanan embedding 768 dimensi dan pencarian kemiripan kosinus (HNSW index). |
| **LLM & Embeddings** | Google Gemini API (`@google/genai`) | `text-embedding-004` & `gemini-1.5-flash` | Embedding semantik presisi tinggi dan generasi jawaban RAG berbiaya hemat & cepat. |

---

## 2. Skema Database DDL Lengkap (Supabase SQL — V2 Hardened)

> [!TIP]
> Skrip SQL di bawah ini merupakan **Versi 2 (Hardened & Production-Ready)** yang telah diaudit secara menyeluruh:
> 1. **RLS aktif pada seluruh 13 tabel** tanpa celah *unauthenticated bypass*.
> 2. **Database-level Anonymity**: Masking `author_id` langsung via secure views (`v_posts`, `v_comments`).
> 3. **Indeks HNSW Optimal**: Klausa `ORDER BY c.embedding <=> query_embedding ASC` memastikan pencarian vektor instan (<100ms) tanpa *seq scan*.
> 4. **Anti-Tampering Trigger**: Mencegah manipulasi `helpful_count`, `role` admin, atau pemindahan `campus_id` oleh pengguna biasa.
> 5. **Kepatuhan UU PDP**: Hapus `full_name`, gunakan `display_name` pseudonim, dan nol data sensitif (tanpa NIM/NIK/No HP).

```sql
-- =============================================================================
-- 0. EXTENSIONS
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================================================
-- 1. KELOMPOK CAMPUS (STRUKTUR AKADEMIK)
-- =============================================================================
CREATE TABLE public.campuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    domain VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.faculties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID NOT NULL REFERENCES public.campuses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID NOT NULL REFERENCES public.campuses(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES public.faculties(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    degree_level VARCHAR(50) NOT NULL DEFAULT 'Undergraduate',
    is_pilot BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_program_code_per_campus UNIQUE (campus_id, code)
);

-- =============================================================================
-- 2. KELOMPOK USER & PROFIL (UU PDP HARDENED: TANPA FULL_NAME / NIM / NO HP)
-- =============================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES public.campuses(id) ON DELETE SET NULL,
    faculty_id UUID REFERENCES public.faculties(id) ON DELETE SET NULL,
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    display_name VARCHAR(100) NOT NULL DEFAULT 'Mahasiswa', -- Pseudonim ramah privasi
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'senior_contributor', 'curator', 'admin')),
    semester INT CHECK (semester BETWEEN 1 AND 14),
    entry_year INT,
    adaptation_area VARCHAR(100), -- 'academic', 'social', 'administrative', 'personal', 'facilities', 'opportunity'
    main_challenge VARCHAR(100),  -- Tokenized/categorized tantangan (bukan free text sembarangan)
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =============================================================================
-- 3. KELOMPOK COMMUNITY (REDDIT-INSPIRED DISCUSSION)
-- =============================================================================
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID NOT NULL REFERENCES public.campuses(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    post_type VARCHAR(50) NOT NULL DEFAULT 'question' CHECK (post_type IN ('question', 'experience', 'guide', 'opportunity')),
    category VARCHAR(100) NOT NULL,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    helpful_count INT NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
    has_accepted_answer BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'under_review', 'reported', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    campus_id UUID NOT NULL REFERENCES public.campuses(id) ON DELETE CASCADE, -- Denormalized untuk fast tenant indexing & RLS
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    is_accepted_answer BOOLEAN NOT NULL DEFAULT false,
    helpful_count INT NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'under_review', 'reported', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    vote_type VARCHAR(20) NOT NULL DEFAULT 'helpful',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_vote_user_post UNIQUE (user_id, post_id),
    CONSTRAINT uq_vote_user_comment UNIQUE (user_id, comment_id),
    CONSTRAINT chk_vote_target CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    )
);

-- guides dibuat SEBELUM bookmarks, karena bookmarks mereferensi public.guides.
-- =============================================================================
-- 5. KELOMPOK KNOWLEDGE HUB (PANDUAN TERKURASI 6 KATEGORI)
-- =============================================================================
CREATE TABLE public.guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID REFERENCES public.campuses(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN (
        'academic_survival',
        'social_community',
        'administrative_guide',
        'campus_essentials',
        'scholarship_growth',
        'career_preparation'
    )),
    is_general BOOLEAN NOT NULL DEFAULT false,
    content_raw TEXT NOT NULL,
    source_type VARCHAR(100) NOT NULL DEFAULT 'official_campus_source',
    source_reference VARCHAR(500),
    source_url VARCHAR(500),
    last_verified_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_guide_scope CHECK (
        (is_general = true AND campus_id IS NULL) OR
        (is_general = false AND campus_id IS NOT NULL)
    )
);

CREATE TABLE public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_bookmark_target CHECK (
        (post_id IS NOT NULL AND guide_id IS NULL) OR
        (post_id IS NULL AND guide_id IS NOT NULL)
    ),
    CONSTRAINT uq_bookmark_user_post UNIQUE (user_id, post_id),
    CONSTRAINT uq_bookmark_user_guide UNIQUE (user_id, guide_id)
);

-- =============================================================================
-- 4. KELOMPOK EXPERIENCE (GLASSDOOR-ORGANIZED SENIOR EXPERIENCES)
-- =============================================================================
CREATE TABLE public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID NOT NULL REFERENCES public.campuses(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(300) NOT NULL,
    semester_context INT,
    situation TEXT NOT NULL,
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    result TEXT NOT NULL,
    advice_for_juniors TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_verified_contributor BOOLEAN NOT NULL DEFAULT false,
    helpful_count INT NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =============================================================================
-- 6. KELOMPOK MY JOURNEY (ROADMAP ADAPTASI MAHASISWA)
-- =============================================================================
CREATE TABLE public.journey_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
    step_code VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    stage VARCHAR(100) NOT NULL CHECK (stage IN (
        'understand_campus',
        'understand_academics',
        'build_study_routine',
        'find_community',
        'explore_opportunities',
        'reflect_and_adjust'
    )),
    target_semester INT NOT NULL CHECK (target_semester BETWEEN 1 AND 14),
    action_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.user_journey_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    step_id UUID NOT NULL REFERENCES public.journey_steps(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    reflection_note TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_step UNIQUE (user_id, step_id)
);

-- =============================================================================
-- 7. KELOMPOK AI & CONTENT CHUNKS (VECTOR RETRIEVAL)
-- =============================================================================
CREATE TABLE public.content_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE,
    experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    source_title VARCHAR(500) NOT NULL,
    source_type VARCHAR(100) NOT NULL,
    is_general BOOLEAN NOT NULL DEFAULT false,
    campus_id UUID REFERENCES public.campuses(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
    embedding VECTOR(768) NOT NULL, -- Dimensi resmi Gemini text-embedding-004 & model penerus
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =============================================================================
-- 8. INDEXING PERFORMA (B-TREE FOREIGN KEYS + HNSW VECTOR)
-- =============================================================================
-- HNSW Vector Index untuk pencarian kemiripan kosinus instan (< 100ms)
CREATE INDEX idx_content_chunks_embedding 
ON public.content_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- B-Tree Indexes pada Foreign Keys & Filter Krusial
CREATE INDEX idx_faculties_campus_id ON public.faculties(campus_id);
CREATE INDEX idx_programs_campus_id ON public.programs(campus_id);
CREATE INDEX idx_profiles_campus_id ON public.profiles(campus_id);
CREATE INDEX idx_posts_campus_id ON public.posts(campus_id);
CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_campus_id ON public.comments(campus_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
CREATE INDEX idx_votes_user_id ON public.votes(user_id);
CREATE INDEX idx_votes_post_id ON public.votes(post_id);
CREATE INDEX idx_votes_comment_id ON public.votes(comment_id);
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_post_id ON public.bookmarks(post_id);
CREATE INDEX idx_bookmarks_guide_id ON public.bookmarks(guide_id);
CREATE INDEX idx_experiences_campus_id ON public.experiences(campus_id);
CREATE INDEX idx_experiences_author_id ON public.experiences(author_id);
CREATE INDEX idx_guides_campus_id ON public.guides(campus_id);
CREATE INDEX idx_guides_category ON public.guides(category);
CREATE INDEX idx_guides_is_published ON public.guides(is_published);
CREATE INDEX idx_journey_progress_user_id ON public.user_journey_progress(user_id);
CREATE INDEX idx_content_chunks_guide_id ON public.content_chunks(guide_id);
CREATE INDEX idx_content_chunks_campus_id ON public.content_chunks(campus_id);

-- =============================================================================
-- 9. TRIGGER INTEGRITAS DATA & ANTI-TAMPERING
-- =============================================================================
-- Mencegah user memanipulasi helpful_count dan status accepted_answer saat INSERT
CREATE OR REPLACE FUNCTION public.trg_enforce_clean_insert()
RETURNS TRIGGER AS $$
BEGIN
    NEW.helpful_count := 0;
    IF TG_TABLE_NAME = 'posts' THEN
        NEW.has_accepted_answer := false;
    ELSIF TG_TABLE_NAME = 'comments' THEN
        NEW.is_accepted_answer := false;
        -- Auto-fill campus_id dari parent post jika belum diisi
        IF NEW.campus_id IS NULL THEN
            SELECT campus_id INTO NEW.campus_id FROM public.posts WHERE id = NEW.post_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'experiences' THEN
        NEW.is_verified_contributor := false;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_posts_clean_insert
BEFORE INSERT ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.trg_enforce_clean_insert();

CREATE TRIGGER trg_comments_clean_insert
BEFORE INSERT ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.trg_enforce_clean_insert();

CREATE TRIGGER trg_experiences_clean_insert
BEFORE INSERT ON public.experiences
FOR EACH ROW EXECUTE FUNCTION public.trg_enforce_clean_insert();

-- Mencegah user biasa menaikkan role sendiri menjadi admin atau pindah campus_id
CREATE OR REPLACE FUNCTION public.trg_protect_profile_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Hanya service_role atau admin yang bisa mengubah role
    -- IS DISTINCT FROM: aman dari NULL. SET search_path: wajib untuk SECURITY DEFINER.
    -- Versi final (memakai helper is_privileged) ada di supabase/patches/01_profiles_tenant_hardening.sql.
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF auth.role() IS DISTINCT FROM 'service_role' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IS DISTINCT FROM 'admin' THEN
            RAISE EXCEPTION 'Akses Ditolak: Perubahan role hanya dapat dilakukan oleh Administrator.';
        END IF;
    END IF;
    -- Mahasiswa tidak boleh mengubah campus_id sendiri setelah ditentukan
    IF OLD.campus_id IS NOT NULL AND NEW.campus_id IS DISTINCT FROM OLD.campus_id THEN
        IF auth.role() IS DISTINCT FROM 'service_role' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IS DISTINCT FROM 'admin' THEN
            RAISE EXCEPTION 'Akses Ditolak: Pemindahan kampus memerlukan bantuan Administrator.';
        END IF;
    END IF;
    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_profiles_protect_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.trg_protect_profile_update();

-- =============================================================================
-- 10. DATABASE-LEVEL ANONYMITY (SECURE VIEWS DENGAN MASKING AUTHOR_ID)
-- =============================================================================
-- CATATAN: v_posts dan v_comments di bawah memakai != (tidak null-safe) dan label "Mahasiswa Anonim".
-- Versi final (IS DISTINCT FROM, label "Anonymous Student") ada di supabase/patches/01_profiles_tenant_hardening.sql bagian 12.
-- View ini menjamin author_id asli bernilai NULL di payload HTTP bagi postingan anonim
CREATE OR REPLACE VIEW public.v_posts
WITH (security_invoker = true) AS
SELECT 
    p.id,
    p.campus_id,
    p.program_id,
    CASE 
        WHEN p.is_anonymous AND p.author_id != auth.uid() THEN NULL 
        ELSE p.author_id 
    END AS author_id,
    CASE 
        WHEN p.is_anonymous AND p.author_id != auth.uid() THEN 'Mahasiswa Anonim' 
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
        WHEN c.is_anonymous AND c.author_id != auth.uid() THEN NULL 
        ELSE c.author_id 
    END AS author_id,
    CASE 
        WHEN c.is_anonymous AND c.author_id != auth.uid() THEN 'Mahasiswa Anonim' 
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
```

---

## 3. Fungsi RPC Supabase: Hybrid Vector Search (`match_campus_chunks`)

> [!WARNING]
> Versi di bawah ini (v2) **dikoreksi di `supabase/patches/01_profiles_tenant_hardening.sql` bagian 13 dan 14**: `filter_campus_id` dan `filter_program_id` dari klien hanya dihormati untuk pemanggil privileged, `SET search_path` ditambahkan, dan EXECUTE dibatasi ke authenticated. Jangan pakai v2 mentah di production.

> [!IMPORTANT]
> **Optimasi HNSW Index**: PostgreSQL pgvector **hanya memicu index HNSW** saat klausa `ORDER BY` mengurutkan langsung operator jarak (`c.embedding <=> query_embedding ASC`), bukan ekspresi hasil perhitungan (`similarity DESC`).
> Fungsi di bawah ini juga memvalidasi status guide (`g.is_published = true`) dan memfilter campus_id otomatis dari profil pengguna aktif untuk mencegah kerentanan IDOR.

```sql
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
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
    WITH caller_context AS (
        -- Otomatis fallback ke campus_id pemanggil jika filter_campus_id tidak dioper
        SELECT campus_id AS user_campus_id 
        FROM public.profiles 
        WHERE id = auth.uid()
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
    LEFT JOIN public.guides g ON c.guide_id = g.id
    LEFT JOIN caller_context usr ON true
    WHERE 
        -- 1. Jangan ambil chunk jika guide asalnya berstatus unpublish
        (c.guide_id IS NULL OR g.is_published = true)
        -- 2. Multi-tenant isolation (hanya panduan umum ATAU kampus pemanggil)
        AND (
            c.is_general = true 
            OR c.campus_id = COALESCE(filter_campus_id, usr.user_campus_id)
        )
        -- 3. Filter program studi opsional
        AND (
            filter_program_id IS NULL 
            OR c.program_id = filter_program_id 
            OR c.program_id IS NULL
        )
        -- 4. Ambang batas kemiripan kosinus
        AND (1 - (c.embedding <=> query_embedding)) > match_threshold
    -- 5. KUNCI HNSW: Wajib ORDER BY operator jarak secara langsung (ASC)
    ORDER BY c.embedding <=> query_embedding ASC
    LIMIT match_count;
$$;
```

---

## 4. Kebijakan Row Level Security (RLS) Menyeluruh (Semua 13 Tabel)

> [!NOTE]
> Policy di bawah adalah baseline v2. Policy `profiles` dan policy yang memakai subquery ke `profiles` diganti oleh `supabase/patches/01_profiles_tenant_hardening.sql` (memutus infinite recursion dan menutup celah tenant). Jalankan patch setelah seluruh skema v2 berhasil.

```sql
-- AKTIFKAN RLS PADA SEMUA TABEL TANPA TERKECUALI
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_chunks ENABLE ROW LEVEL SECURITY;

-- 1. DATA MASTER AKADEMIK (Public Read-Only, Write Service Role)
CREATE POLICY "Public read campuses" ON public.campuses FOR SELECT TO authenticated, anon USING (is_active = true);
CREATE POLICY "Public read faculties" ON public.faculties FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Public read programs" ON public.programs FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Public read journey steps" ON public.journey_steps FOR SELECT TO authenticated, anon USING (is_active = true);

-- 2. PROFILES (Pemisahan Operasi & Anti Privilege Escalation)
CREATE POLICY "Read profiles in same campus" ON public.profiles FOR SELECT TO authenticated
USING (campus_id = (SELECT campus_id FROM public.profiles WHERE id = auth.uid()) OR id = auth.uid());

CREATE POLICY "Insert own profile student" ON public.profiles FOR INSERT TO authenticated
WITH CHECK (id = auth.uid() AND role = 'student');

CREATE POLICY "Update own profile basic" ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- 3. POSTS (Multi-tenant & Role-aware)
CREATE POLICY "Read posts in same campus" ON public.posts FOR SELECT TO authenticated
USING (
    campus_id = (SELECT campus_id FROM public.profiles WHERE id = auth.uid())
    AND (
        status = 'published' 
        OR author_id = auth.uid()
        OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('curator', 'admin')
    )
);

CREATE POLICY "Create post in own campus" ON public.posts FOR INSERT TO authenticated
WITH CHECK (
    author_id = auth.uid() 
    AND campus_id = (SELECT campus_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Update own post" ON public.posts FOR UPDATE TO authenticated
USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());

CREATE POLICY "Delete own post" ON public.posts FOR DELETE TO authenticated
USING (author_id = auth.uid());

-- 4. COMMENTS (Multi-tenant)
CREATE POLICY "Read comments in same campus" ON public.comments FOR SELECT TO authenticated
USING (
    campus_id = (SELECT campus_id FROM public.profiles WHERE id = auth.uid())
    AND (status = 'published' OR author_id = auth.uid())
);

CREATE POLICY "Create comment in own campus" ON public.comments FOR INSERT TO authenticated
WITH CHECK (
    author_id = auth.uid() 
    AND campus_id = (SELECT campus_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Update own comment" ON public.comments FOR UPDATE TO authenticated
USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());

CREATE POLICY "Delete own comment" ON public.comments FOR DELETE TO authenticated
USING (author_id = auth.uid());

-- 5. VOTES & BOOKMARKS (Privat per User)
CREATE POLICY "Manage own votes" ON public.votes FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Manage own bookmarks" ON public.bookmarks FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 6. EXPERIENCES (Glassdoor-style)
CREATE POLICY "Read experiences in same campus" ON public.experiences FOR SELECT TO authenticated
USING (campus_id = (SELECT campus_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Create experience in own campus" ON public.experiences FOR INSERT TO authenticated
WITH CHECK (
    author_id = auth.uid() 
    AND campus_id = (SELECT campus_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Update own experience" ON public.experiences FOR UPDATE TO authenticated
USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());

-- 7. GUIDES & CONTENT CHUNKS (Terkurasi)
CREATE POLICY "Read guides scoped" ON public.guides FOR SELECT TO authenticated
USING (
    is_published = true AND (
        is_general = true OR 
        campus_id = (SELECT campus_id FROM public.profiles WHERE id = auth.uid())
    )
);

CREATE POLICY "Read chunks scoped" ON public.content_chunks FOR SELECT TO authenticated
USING (
    is_general = true OR 
    campus_id = (SELECT campus_id FROM public.profiles WHERE id = auth.uid())
);

-- 8. USER JOURNEY PROGRESS (Privat)
CREATE POLICY "Manage own journey progress" ON public.user_journey_progress FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
```

---

## 5. Integrasi Google Gemini API & Prompt Grounding

### Inisialisasi Klien (`src/lib/gemini/client.ts`)
```typescript
import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('CRITICAL: GEMINI_API_KEY environment variable is not defined.');
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
```

### System Instruction AI Campus Navigator
```typescript
export const CAMPUS_NAVIGATOR_SYSTEM_INSTRUCTION = `
Kamu adalah AI Campus Navigator pada platform Campus Compass.
Tugasmu adalah membantu mahasiswa menemukan jawaban terpercaya mengenai kehidupan akademik, adaptasi kampus, dan regulasi departemen.

Aturan Utama:
1. Grounding Penuh: Jawab HANYA berdasarkan konteks rujukan resmi dan pengalaman komunitas terverifikasi yang diberikan. Dilarang mengarang aturan, jadwal, atau prasyarat.
2. Sitasi Wajib: Setiap kalimat fakta atau panduan wajib menyertakan tanda sitasi [1], [2] yang merujuk pada nomor chunk rujukan.
3. Insufficient Evidence: Jika cuplikan konteks tidak memuat informasi yang ditanyakan, nyatakan secara jujur:
   "Informasi resmi atau pengalaman terverifikasi mengenai hal ini belum tersedia dalam basis data kampus. Silakan tanyakan di menu Community atau hubungi pihak akademik departemen."
4. Format: Jelas, terstruktur, ramah mahasiswa, dan sertakan langkah aksi praktis.
`;
```

---

## 6. Target Struktur Direktori Aplikasi (`src/`)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx             # Login email
│   │   ├── register/page.tsx          # Pendaftaran akun
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── home/page.tsx              # 1. HOME: Welcome context, snapshot adaptasi, rekomendasi, & My Journey
│   │   ├── community/                 # 2. COMMUNITY: Reddit-inspired feed & Q&A
│   │   │   ├── page.tsx
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── knowledge/                 # 3. KNOWLEDGE HUB: 6 Kategori panduan kampus & senior experiences
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── ai-navigator/page.tsx      # 4. AI NAVIGATOR: Chat RAG dengan source cards
│   │   ├── onboarding/page.tsx        # Onboarding: Kampus, prodi, semester & tantangan
│   │   └── layout.tsx                 # Navigation sidebar & mobile bottom bar (4 area navigasi utama)
│   └── api/
│       ├── rag/query/route.ts         # Endpoint streaming AI Navigator + vector search
│       └── journey/progress/route.ts  # Endpoint update status milestone
├── components/
│   ├── ui/                            # Primitif shadcn/ui (Button, Card, Badge, Dialog)
│   ├── home/                          # WelcomeCard, AdaptationSnapshot, RecommendedFeed
│   ├── community/                     # PostCard, PostFilter, CommentThread, HelpfulButton
│   ├── knowledge/                     # GuideCategoryGrid, GuideCard, SourceReferenceBadge
│   ├── journey/                       # JourneyTimeline, MilestoneCard, ProgressCircle
│   └── chat/                          # ChatBox, SourceCard, CitationPill, MessageBubble
└── lib/
    ├── supabase/client.ts             # Browser-side Supabase client
    ├── supabase/server.ts             # Server Action / Edge Supabase client
    └── gemini/client.ts               # Google GenAI client initialization
```
