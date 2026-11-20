# Technology Stack Specification

> **Document**: `docs/architecture/tech-stack.md`  
> **Owner**: Erick (Technical Setup & AI Dev Lead)  
> **Status**: Approved (Foundation Phase)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/architecture/system-architecture.md`](system-architecture.md), [`docs/decisions/decision-log.md`](../decisions/decision-log.md)

---

## 1. Purpose

This document specifies the technology choices, programming languages, frameworks, runtime environments, and third-party developer platforms for Campus Compass. It establishes the technical constraints for all code generation.

---

## 2. Core Stack Overview

| Layer | Selected Technology | Version / Specification | Rationale |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 14.x / 15.x (App Router) | Full-stack React framework with built-in SSR, Edge streaming, and Server Actions. |
| **Language** | TypeScript | 5.x (Strict Mode) | Type safety across client, server, and database interfaces. |
| **UI Styling** | Tailwind CSS | 3.4+ | Utility-first styling enabling rapid, consistent design token implementation. |
| **Component Primitives** | Radix UI / Shadcn UI | Latest | Accessible, unstyled UI primitives tailored for custom design system theming. |
| **Icons** | Lucide React | Latest | Clean, lightweight, consistent SVG icon library. |
| **Database & Auth** | Supabase | Managed PostgreSQL 15+ | Built-in Auth, Row Level Security, instant REST APIs, and vector extension. |
| **Vector Search** | pgvector | Supabase extension | Co-locates relational student data with high-dimensional vector embeddings. |
| **AI LLM / Generation** | Google Gemini API | Gemini 1.5 Pro / Flash | Large context window, high reasoning capability, low latency, and cost efficiency. |
| **AI Embeddings** | Google Gemini Embedding | `text-embedding-004` | 768-dimensional embeddings optimized for semantic document search. |
| **State / Data Fetching** | React Server Components + SWR / TanStack Query | Latest | Seamless server-side caching and optimistic client updates. |
| **Code Quality** | ESLint + Prettier | Latest | Strict linting, accessibility checks, and automated formatting. |

---

## 3. Technology Evaluation & Selection Rationale

### Why Next.js (App Router)?
- Enables streaming responses via React Suspense and Edge runtime, essential for low-latency AI chat.
- Consolidates frontend and backend API handlers in a single repository, reducing deployment overhead for the MVP.
- Server Components minimize client bundle size by keeping heavy markdown and citation parsers on the server.

### Why Supabase & pgvector?
- Avoids the operational complexity of managing a separate vector database (e.g. Pinecone or Weaviate) alongside a relational database.
- Enables single-query hybrid joins combining vector similarity (`<->`) with strict relational tenant filters (`university_id = ...`).
- Supabase Row Level Security provides native defense-in-depth against data leakage.

### Why Google Gemini API?
- Industry-leading context window allows processing comprehensive course handbooks without excessive chunk fragmentation.
- Structured output modes (JSON schema enforcement) ensure reliable citation and recommendation payloads.
- High speed and generous rate limits ideal for student query workloads.

---

## 4. Confirmed vs. Proposed Stack Elements

### Confirmed Choices
- [x] Next.js (App Router) with TypeScript in strict mode.
- [x] Tailwind CSS for utility styling.
- [x] Supabase for PostgreSQL, GoTrue Auth, and pgvector.
- [x] Google Gemini API for embeddings and text generation.

### Proposed Choices (Under Active Review)
- [ ] ORM Selection: Prisma vs. Drizzle ORM vs. native Supabase JS Client (`@supabase/supabase-js`).  
  *Proposal: Prefer `@supabase/supabase-js` with auto-generated TypeScript database types to avoid ORM abstraction overhead over RLS.* (Owner: Erick / Netta)
- [ ] UI Component Kit: Shadcn UI components copied into `src/components/ui`. (Owner: Kalya / Rifal)

---

## 5. Development Tooling & Environment Requirements

- **Node.js**: `v20.x LTS` or higher.
- **Package Manager**: `pnpm` (preferred for strict dependency resolution) or `npm` (v10+).
- **Environment Configuration**: Stored in `.env.local` (git-ignored), documented in `.env.example`.

---

## 6. Open Questions

1. Which specific Gemini model tier should be used for production query generation: `gemini-1.5-flash` (faster, lower cost) vs. `gemini-1.5-pro` (higher reasoning depth)? (Owner: Erick)
2. Should we implement client-side state management (e.g., Zustand) or rely entirely on URL search params and Server Component state? (Owner: Kalya / Erick)
