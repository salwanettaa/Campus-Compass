# Campus Compass — Technical Blueprint & Database Specification

> **Dokumen**: `docs/TECH_AND_DATABASE.md`  
> **Status**: Ready for Implementation (Copy-Pasteable SQL & Specs)  
> **Target Vibe Coding**: Selesai Senin, 23 November 2026  
> **Target Debugging & QA**: Selesai Sabtu, 28 November 2026  
> **Dependencies**: [`docs/PRODUCT_SPEC.md`](PRODUCT_SPEC.md)

---

## 1. Tumpukan Teknologi (Tech Stack)

| Komponen | Pilihan Teknologi | Versi / Spesifikasi | Rationale Vibe Coding |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | 14.x / 15.x | Full-stack React dengan Server Actions & streaming SSE bawaan untuk chat AI. |
| **Bahasa** | TypeScript | 5.x (Strict) | Mencegah bug data type dan memastikan sinkronisasi tipe dengan Supabase. |
| **Styling** | Tailwind CSS + Lucide Icons | 3.4+ / Latest | Cepat untuk vibe coding antarmuka yang modern, bersih, dan responsif. |
| **Database & Auth** | Supabase | Managed PostgreSQL 15+ | Autentikasi instan, Row Level Security bawaan, dan ekstensi pgvector. |
| **Vector Search** | pgvector | Supabase extension | Menggabungkan data relasional dengan pencarian kemiripan vektor tanpa database terpisah. |
| **Embedding AI** | Google text-embedding-004 | 768 Dimensi | Model representasi semantik resmi Google dengan akurasi retrieval tinggi. |
| **Generasi AI** | Google Gemini 1.5 Flash | `@google/genai` | Cepat, hemat biaya/token, context window besar, dan latency streaming rendah. |

---

## 2. Skema Database DDL Lengkap (Supabase SQL)

> [!TIP]
> Skrip SQL di bawah ini sudah lengkap dan **dapat langsung dicopy-paste ke SQL Editor Supabase** untuk inisialisasi database proyek!

```sql
-- 1. Enable Ekstensi yang Dibutuhkan
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Tabel Master Universitas
CREATE TABLE public.universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    domain VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Tabel Master Program Studi
CREATE TABLE public.study_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    degree_level VARCHAR(50) NOT NULL DEFAULT 'Undergraduate',
    is_pilot BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_program_code_per_univ UNIQUE (university_id, code)
);

-- 4. Tabel Profil Mahasiswa (Terikat ke Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    study_program_id UUID REFERENCES public.study_programs(id) ON DELETE SET NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'curator', 'admin')),
    semester INT CHECK (semester BETWEEN 1 AND 14),
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Tabel Pengetahuan (Dokumen Induk)
CREATE TABLE public.knowledge_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
    study_program_id UUID REFERENCES public.study_programs(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'academics', 'facilities', 'regulations', 'study_habits'
    is_general BOOLEAN NOT NULL DEFAULT false,
    access_level VARCHAR(50) NOT NULL DEFAULT 'campus_scoped' CHECK (access_level IN ('public', 'campus_scoped', 'private')),
    content_raw TEXT NOT NULL,
    source_reference VARCHAR(500), -- Contoh: 'Buku Pedoman Akademik 2024 §3.1'
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_knowledge_scope CHECK (
        (is_general = true AND university_id IS NULL) OR
        (is_general = false AND university_id IS NOT NULL)
    )
);

-- 6. Tabel Chunk Vektor untuk RAG
CREATE TABLE public.knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_item_id UUID NOT NULL REFERENCES public.knowledge_items(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding VECTOR(768) NOT NULL, -- Dimensi resmi Gemini text-embedding-004
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- HNSW Vector Index untuk pencarian kemiripan kosinus instan
CREATE INDEX idx_knowledge_chunks_embedding 
ON public.knowledge_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 7. Tabel Tips Mahasiswa (Hasil Kurasi Survei Google Form)
CREATE TABLE public.student_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
    study_program_id UUID REFERENCES public.study_programs(id) ON DELETE CASCADE,
    author_name VARCHAR(100) DEFAULT 'Anonymous', -- Mendukung opsi anonimitas
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    helpful_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Tabel Aturan Rekomendasi & Tracking Progres Mahasiswa
CREATE TABLE public.recommendation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_program_id UUID REFERENCES public.study_programs(id) ON DELETE CASCADE,
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
```

---

## 3. Fungsi RPC Supabase: Hybrid Vector Search (`match_knowledge_chunks`)

Fungsi ini menjamin **zero cross-campus bleed**: query mahasiswa hanya akan mencari dokumen umum DAN dokumen khusus kampus/prodi mahasiswa tersebut.

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
    source_reference VARCHAR,
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
        ki.source_reference,
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

## 4. Kebijakan Row Level Security (RLS) Inti

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recommendations ENABLE ROW LEVEL SECURITY;

-- Mahasiswa hanya bisa baca & update profil sendiri
CREATE POLICY "Users access own profile" 
ON public.profiles FOR ALL TO authenticated 
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Mahasiswa membaca pengetahuan umum atau yang sesuai kampusnya
CREATE POLICY "Read scoped knowledge"
ON public.knowledge_items FOR SELECT TO authenticated
USING (
    is_published = true AND (
        is_general = true OR 
        university_id = (SELECT university_id FROM public.profiles WHERE id = auth.uid())
    )
);

-- Mahasiswa membaca tips kampusnya
CREATE POLICY "Read campus tips"
ON public.student_tips FOR SELECT TO authenticated
USING (
    is_verified = true AND 
    university_id = (SELECT university_id FROM public.profiles WHERE id = auth.uid())
);

-- Tracking rekomendasi hanya milik sendiri
CREATE POLICY "Manage own recommendations"
ON public.user_recommendations FOR ALL TO authenticated
USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());
```

---

## 5. Google Gemini API Specification & System Prompt

### Inisialisasi Klien (`src/lib/gemini/client.ts`)
```typescript
import { GoogleGenAI } from '@google/genai';

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
```

### System Instruction Grounding & Sitasi
```typescript
export const CAMPUS_COMPASS_SYSTEM_PROMPT = `
Kamu adalah Campus Compass, asisten navigasi akademik cerdas dan terpercaya untuk mahasiswa.

Aturan Penting:
1. Grounding Penuh: Jawab HANYA berdasarkan cuplikan dokumen resmi kampus yang disediakan. Dilarang mengarang aturan.
2. Sitasi Wajib: Setiap kalimat fakta atau aturan wajib mencantumkan tanda sitasi sumber rujukan dengan format [1], [2] yang mengacu pada nomor chunk dokumen.
3. Keterbatasan Data: Jika dokumen rujukan tidak memuat informasi yang ditanyakan, katakan secara jujur:
   "Informasi resmi mengenai hal ini belum tersedia dalam basis data prodi. Silakan konfirmasi langsung ke bagian akademik departemen atau dosen PA."
4. Gaya Bahasa: Ringkas, suportif, dan ramah mahasiswa.
`;
```

---

## 6. Target Struktur Kode Aplikasi (`src/`)

```
src/
├── app/
│   ├── (auth)/login/page.tsx          # Login & Registrasi
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx         # Dashboard mahasiswa (Rekomendasi semester)
│   │   ├── search/page.tsx            # Antarmuka Chatbot RAG AI
│   │   ├── tips/page.tsx              # Halaman Tips Mahasiswa (Kurasi Form)
│   │   ├── onboarding/page.tsx        # Pilih Kampus, Prodi & Semester
│   │   └── layout.tsx                 # Sidebar & Header
│   └── api/
│       ├── rag/query/route.ts         # Endpoint streaming query AI + Sitasi
│       └── recommendations/route.ts   # Endpoint list rekomendasi semester
├── components/
│   ├── ui/                            # Button, Card, Badge, Input (Tailwind)
│   └── chat/                          # ChatBox, CitationPill, MessageList
└── lib/
    ├── supabase/client.ts             # Supabase browser client
    ├── supabase/server.ts             # Supabase server action client
    └── gemini/client.ts               # Google GenAI client
```
