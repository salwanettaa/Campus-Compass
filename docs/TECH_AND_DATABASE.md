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

## 2. Skema Database DDL Lengkap (Supabase SQL)

> [!TIP]
> Skrip SQL di bawah ini sudah lengkap dan terorganisasi sesuai dengan kelompok tabel di **Blueprint PDF** (Campus, User, Community, Experience, Knowledge, Journey, dan AI).
> **Dapat langsung dicopy-paste ke SQL Editor Supabase untuk mengeksekusi inisialisasi database!**

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
-- 2. KELOMPOK USER & PROFIL
-- =============================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES public.campuses(id) ON DELETE SET NULL,
    faculty_id UUID REFERENCES public.faculties(id) ON DELETE SET NULL,
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    full_name VARCHAR(255),
    display_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'senior_contributor', 'curator', 'admin')),
    semester INT CHECK (semester BETWEEN 1 AND 14),
    entry_year INT,
    adaptation_area VARCHAR(100), -- 'academic', 'social', 'administrative', 'personal', 'facilities', 'opportunity'
    main_challenge VARCHAR(255),  -- e.g., 'time_management', 'finding_friends', 'curriculum'
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
    helpful_count INT NOT NULL DEFAULT 0,
    has_accepted_answer BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'under_review', 'reported', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    is_accepted_answer BOOLEAN NOT NULL DEFAULT false,
    helpful_count INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'published',
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

CREATE TABLE public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    guide_id UUID, -- Digunakan nanti untuk bookmark panduan
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_bookmark_user_post UNIQUE (user_id, post_id)
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
    helpful_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =============================================================================
-- 5. KELOMPOK KNOWLEDGE HUB (PANDUAN TERKURASI 6 KATEGORI)
-- =============================================================================
CREATE TABLE public.guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID REFERENCES public.campuses(id) ON DELETE CASCADE, -- NULL jika panduan umum (universal)
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
    source_type VARCHAR(100) NOT NULL DEFAULT 'official_campus_source', -- 'official', 'curated_experience', 'community'
    source_reference VARCHAR(500), -- Judul rujukan/pasal
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

-- =============================================================================
-- 6. KELOMPOK MY JOURNEY (ROADMAP ADAPTASI MAHASISWA)
-- =============================================================================
CREATE TABLE public.journey_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE, -- NULL jika universal
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
    embedding VECTOR(768) NOT NULL, -- Dimensi resmi Gemini text-embedding-004
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- HNSW Vector Index untuk pencarian kemiripan kosinus instan (< 100ms)
CREATE INDEX idx_content_chunks_embedding 
ON public.content_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

---

## 3. Fungsi RPC Supabase: Hybrid Vector Search (`match_campus_chunks`)

Fungsi ini menjamin **zero cross-campus bleed** dan grounding anti-halusinasi:

```sql
CREATE OR REPLACE FUNCTION public.match_campus_chunks(
    query_embedding VECTOR(768),
    filter_campus_id UUID,
    filter_program_id UUID,
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
LANGUAGE sql STABLE
AS $$
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
    WHERE (
        c.is_general = true 
        OR (
            c.campus_id = filter_campus_id 
            AND (c.program_id = filter_program_id OR c.program_id IS NULL)
        )
    )
    AND (1 - (c.embedding <=> query_embedding)) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
$$;
```

---

## 4. Kebijakan Row Level Security (RLS) & Kepatuhan UU PDP

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey_progress ENABLE ROW LEVEL SECURITY;

-- Profil: Pengguna hanya dapat membaca dan memperbarui data profil sendiri
CREATE POLICY "Users access own profile" 
ON public.profiles FOR ALL TO authenticated 
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Community Posts: Mahasiswa hanya dapat membaca postingan kampusnya
CREATE POLICY "Read posts in same campus" 
ON public.posts FOR SELECT TO authenticated
USING (
    status = 'published' AND
    campus_id = (SELECT campus_id FROM public.profiles WHERE id = auth.uid())
);

-- Community Posts Insert: Mahasiswa membuat post dengan campus_id yang sesuai profil
CREATE POLICY "Create post in own campus"
ON public.posts FOR INSERT TO authenticated
WITH CHECK (
    author_id = auth.uid() AND
    campus_id = (SELECT campus_id FROM public.profiles WHERE id = auth.uid())
);

-- Guides: Membaca panduan umum ATAU panduan kampusnya
CREATE POLICY "Read guides scoped" 
ON public.guides FOR SELECT TO authenticated
USING (
    is_published = true AND (
        is_general = true OR 
        campus_id = (SELECT campus_id FROM public.profiles WHERE id = auth.uid())
    )
);

-- Journey: Mahasiswa hanya dapat mengelola progres roadmap-nya sendiri
CREATE POLICY "Manage own journey progress"
ON public.user_journey_progress FOR ALL TO authenticated
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
