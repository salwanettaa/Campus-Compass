# Project Folder Structure & Coding Conventions

> **Document**: `docs/architecture/folder-structure.md`  
> **Owner**: Erick & Kalya  
> **Status**: Approved (Foundation Phase)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/architecture/tech-stack.md`](tech-stack.md), [`docs/product/sitemap.md`](../product/sitemap.md)

---

## 1. Purpose

This document specifies the target organization of the `src/` directory and establishes coding standards, component conventions, and naming rules. It ensures architectural coherence across human and AI developers.

---

## 2. Target `src/` Directory Layout

```
src/
├── app/                               # Next.js App Router (Routes & Layouts)
│   ├── (auth)/                        # Route group for unauthenticated flows
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/                   # Route group for authenticated student hub
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── knowledge/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── tips/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── onboarding/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/                           # Server API Route Handlers
│   │   ├── auth/
│   │   │   └── callback/route.ts
│   │   ├── rag/
│   │   │   └── query/route.ts
│   │   ├── recommendations/
│   │   │   └── route.ts
│   │   └── tips/
│   │       └── route.ts
│   ├── layout.tsx                     # Global Root Layout
│   └── page.tsx                       # Public Landing Page
├── components/                        # Reusable React Components
│   ├── ui/                            # Base primitives (Button, Card, Dialog, Badge)
│   ├── ai/                            # Chat input, citation pill, streaming message
│   ├── knowledge/                     # Knowledge card, scope badge, document viewer
│   ├── recommendations/               # Milestone card, checklist item
│   └── navigation/                    # Header, sidebar, mobile navigation bar
├── lib/                               # Core libraries and clients
│   ├── supabase/
│   │   ├── client.ts                  # Browser-side Supabase client
│   │   ├── server.ts                  # Server-side Supabase client (cookies)
│   │   └── middleware.ts              # Session refresh & route guard helper
│   ├── gemini/
│   │   ├── client.ts                  # Google GenAI client initialization
│   │   ├── embeddings.ts              # Vector embedding helper
│   │   └── prompts.ts                 # Versioned system prompts and templates
│   └── utils/
│       ├── formatters.ts              # Text and date formatters
│       └── cn.ts                      # Tailwind class merging utility (clsx + twMerge)
├── hooks/                             # Custom React Hooks
│   ├── use-rag-chat.ts                # Streaming chat state and citation handler
│   ├── use-student-profile.ts         # User context and semester hook
│   └── use-debounce.ts                # Debounced search input hook
├── services/                          # Business logic & data access abstractions
│   ├── knowledge-service.ts           # Hybrid retrieval and search queries
│   ├── recommendation-service.ts      # Deterministic rule evaluation logic
│   └── tips-service.ts                # Senior tips retrieval and filtering
└── types/                             # TypeScript Definitions & Database Types
    ├── database.types.ts              # Auto-generated Supabase schema types
    ├── rag.types.ts                   # Chunk, citation, and query interfaces
    ├── recommendation.types.ts        # Milestone rule and card interfaces
    └── user.types.ts                  # Session and profile interfaces
```

---

## 3. Coding Conventions & Standards

### File & Directory Naming
- **Directories**: Kebab-case (`kebab-case`), e.g., `components/ui/`, `knowledge-service.ts`.
- **React Components**: PascalCase for component identifiers (`KnowledgeCard.tsx`), but file names should follow kebab-case (`knowledge-card.tsx`).
- **Hook Files**: Prefix with `use-`, e.g., `use-rag-chat.ts`.
- **API Routes**: Next.js convention `route.ts`.

### TypeScript Best Practices
- Enable `strict: true` in `tsconfig.json`.
- Disallow `any`. Always declare explicit types or use `unknown` with type narrowing.
- Rely on `database.types.ts` generated from Supabase schema to ensure end-to-end type safety.

### Server vs. Client Component Rules
- Default to **Server Components** (`page.tsx`, data-fetching layouts).
- Use `"use client"` only when components require browser APIs, state hooks (`useState`, `useEffect`), or event listeners.
- Keep client boundaries as deep and localized in the component tree as possible.

---

## 4. Confirmed vs. Proposed Standards

### Confirmed
- [x] Strict kebab-case naming for all files.
- [x] Clear separation between `components/ui/` primitives and domain-specific feature components.
- [x] Centralization of Supabase and Gemini clients inside `src/lib/`.

### Proposed
- [ ] Integration of Storybook for isolated component development (Owner: Kalya).

---

## 5. Open Questions

1. Should database type generation be scripted as a pre-build step via Supabase CLI? (Owner: Erick / Netta)
