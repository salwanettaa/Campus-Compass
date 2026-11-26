# Campus Compass — Student Adaptation & Community Knowledge Platform

**Campus Compass** is a responsive web application built for **STACK 2026 by GDGoC ITB** (*Case 1: Smarter Campus and Learning*) by team **Nanti Makan Sushi**.

> *"A centralized student community, structured knowledge hub, and source-grounded AI guidance — designed to help university students navigate academic, administrative, and campus life."*

---

## 1. Problem & Pilot Scope

First- and second-year university students often spend excessive time searching across fragmented group chats, scattered websites, and unverified social feeds for basic campus information.

- **Pilot Campus**: Universitas Gadjah Mada (UGM)
- **Pilot Program**: Sekolah Vokasi — D4 Teknologi Rekayasa Internet (TRI), alongside sample exploration options for other programs (`D4 TRPL`, `S1 TI`, `S1 Ilkom`, `S1 Manajemen`).
- **Privacy by Design (UU PDP)**: The platform intentionally avoids collecting sensitive student IDs (NIM) or real full names, using privacy-friendly display pseudonyms (`profiles.display_name`) and tenant-isolated PostgreSQL Row Level Security (RLS).

---

## 2. Core Modules & Current Implementation Status

To keep development progress transparent across competition stages:

| Module | Route | Current Status | What Exists Today |
| :--- | :--- | :--- | :--- |
| **Auth & Onboarding** | `/register`, `/login`, `/onboarding` | **Live (Supabase)** | Email/password authentication via Supabase Auth (`@supabase/ssr`), plus onboarding wizard to set `campus_id`, `program_id`, `semester`, `adaptation_area`, and `main_challenge`. |
| **Knowledge Hub** | `/knowledge`, `/knowledge/[id]`, `/knowledge/share-experience` | **Live (Supabase + Sample Fallback)** | Multi-tenant Split-Rail layout with program scope switcher (`My Program`, `General`, `Browse another program`), 6 curated guide categories, full-text search, guide detail view, DB-synced bookmarks (`public.bookmarks`), and STAR-format senior experience submission (`public.experiences`). Falls back to labeled sample data if database tables are empty. |
| **Home** | `/home` | **Partial (Live Profile)** | Displays signed-in student's campus, program, semester, and focus area from `profiles`. `#my-journey` currently displays a `"Coming soon"` placeholder. |
| **Community** | `/community`, `/community/[id]` | **UI Preview (Sample Data)** | Feed, type/sort filtering, nested comment thread view, and optimistic `HelpfulButton` UI are implemented against isolated mock fixtures (`src/lib/community/mock-data.ts`). DB triggers & RPC (`02_community_helpful_accepted.sql`) are deployed for live wiring. |
| **AI Navigator** | `/ai-navigator` | **Interactive Preview (Not Live AI)** | Interactive 4-scenario preview (including UGM D4 TRI lab SOP, 6-month internship/certification, and insufficient-evidence fallback to Community) with clickable Knowledge Hub `Sources` and `?q=` topic handoff. Live Gemini API + `pgvector` RAG is scheduled for the next development phase. |

---

## 3. Tech Stack & Architecture

- **Framework**: Next.js `16.4.6` (App Router, Server Components, Server Actions) & React `19.3.0`
- **Language**: TypeScript (`strict` mode)
- **Styling**: Tailwind CSS `v4` with project design tokens (`src/app/globals.css`, `docs/DESIGN_SYSTEM.md`) & `lucide-react` icons
- **Backend & Database**: Supabase (Auth, PostgreSQL, `pgvector`, Row Level Security)
- **Validation & Utilities**: `zod`, `class-variance-authority`, `clsx`, `tailwind-merge`
- **Testing & Quality**: Vitest `4.1.12`, ESLint `9` (`eslint-config-next`), TypeScript compiler (`tsc --noEmit`)

### Repository Structure

```text
├── docs/
│   ├── PRODUCT_SPEC.md          # Product scope, 4 core modules, UU PDP rules, demo flow
│   ├── TECH_AND_DATABASE.md     # PostgreSQL schema v2, RLS policies, RPC match_campus_chunks
│   ├── DESIGN_SYSTEM.md         # Color palette tokens, typography scale, elevation & components
│   ├── DEVELOPMENT_PLAN.md      # Phased plan (Semifinal -> Pre-Final -> Final Day)
│   └── QA.md                    # QA and setup verification notes
├── supabase/
│   ├── patches/                 # Hardening & Community trigger/RPC SQL patches (01, 02, 03)
│   ├── tests/                   # SQL tenant-isolation verification scripts
│   ├── seed.sql                 # Synthetic demo university seed
│   └── seed_ugm_vokasi_tri.sql  # UGM + Sekolah Vokasi D4 TRI seed (programs, guides, experiences)
├── src/
│   ├── app/                     # Next.js App Router pages ((auth), (dashboard), onboarding, design-system)
│   ├── components/              # Modular UI primitives and module-specific components
│   ├── lib/                     # Data layers, filters, Zod schemas, Supabase SSR clients
│   └── types/                   # Shared database row types
├── AGENTS.md                    # Operating rules and guardrails for AI coding assistants
├── CONTRIBUTING.md              # Branching model and conventional commit standards
└── .env.example                 # Environment variable template (no secrets committed)
```

---

## 4. Local Setup & Verification

### Prerequisites
- **Node.js** `>= 20.9.0` and `npm`
- A **Supabase** project (Cloud or local CLI)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your Supabase project credentials:
```bash
cp .env.example .env.local
```
Required for current features:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

*(Planned for live AI Navigator phase: `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_EMBEDDING_MODEL` — server-side only, never exposed to client bundles).*

### 3. Database Setup (Supabase SQL Editor)
Run scripts in order:
1. Schema V2 DDL, triggers, views (`v_posts`, `v_comments`), RPCs, and RLS policies from [`docs/TECH_AND_DATABASE.md`](docs/TECH_AND_DATABASE.md).
2. [`supabase/patches/01_profiles_tenant_hardening.sql`](supabase/patches/01_profiles_tenant_hardening.sql)
3. [`supabase/patches/02_community_helpful_accepted.sql`](supabase/patches/02_community_helpful_accepted.sql)
4. Seed campus & Knowledge Hub data: [`supabase/seed_ugm_vokasi_tri.sql`](supabase/seed_ugm_vokasi_tri.sql) (or [`supabase/seed.sql`](supabase/seed.sql) for generic demo data).
5. *(Optional)* [`supabase/patches/03_campus_domain_check.sql`](supabase/patches/03_campus_domain_check.sql) to restrict onboarding to verified campus email domains.

### 4. Run & Verify
```bash
# Development server (http://localhost:3000)
npm run dev

# Full CI verification suite
npm run lint
npx next typegen
npx tsc --noEmit
npm test
npm run build
```

---

## 5. Known Limitations & Simulated Functionality

- **Community Module**: Uses static fixtures (`src/lib/community/mock-data.ts`) on `/community` and `/community/[id]`; creating posts, posting replies, and persisting helpful votes to `public.votes` are scheduled next.
- **AI Navigator**: Currently runs an interactive scenario preview (`Demo, not live`) without live LLM calls or `pgvector` retrieval.
- **My Journey**: Displays a `"Coming soon"` section on `/home#my-journey`; rule-based milestone tracking via `journey_steps` and `user_journey_progress` is planned for later phases.
- **Request a Guide**: `RequestGuideModal` on `/knowledge` currently confirms requests in the UI without persisting to a backend table.
- **Campus Email Enforcement**: Domain restriction (`03_campus_domain_check.sql`) is not yet enabled in the default sign-up flow so reviewers can test onboarding flexibly.

---

## 6. Material AI Assistance & Third-Party Resources

### AI Assistance Disclosure
In accordance with STACK 2026 competition rules, the team discloses that AI coding assistants (including Google Antigravity / Gemini models) were used as development productivity tools for:
- Drafting boilerplate TypeScript/Next.js components, unit tests, and SQL seed scripts.
- Conducting code reviews against security/RLS rules (`AGENTS.md`) and UI consistency audits (`baseline-ui`, `improve-ui`, `better-*` skills).
- Reviewing English documentation structure and refactoring layouts.

All architecture decisions, product specifications, database schemas, UI/UX direction, and final code merges were reviewed, tested, and verified by team members.

### Third-Party Libraries & Tools
- [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (`@supabase/ssr`, `@supabase/supabase-js`)
- [Lucide Icons](https://lucide.dev/), [Zod](https://zod.dev/), [Class Variance Authority](https://cva.style/)
- [Vitest](https://vitest.dev/), [ESLint](https://eslint.org/)
- Agent UI skills installed in `.agents/skills/`: `ibelick/ui-skills` & `jakubkrehel/skills`

---

## 7. Team Members (**Nanti Makan Sushi**)

| Member | Role | Core Focus |
| :--- | :--- | :--- |
| **Salwanetta Jauza Y** *(Leader)* | Backend, Database & Knowledge Hub | Supabase PostgreSQL schema, RLS tenant isolation, Knowledge Hub, & project coordination |
| **Kalya Andriana** | Frontend & User Experience | Onboarding flow, responsive navigation, Home & My Journey UI |
| **Rifaludin** | Product & UI/UX Direction | Visual identity, Design System (`docs/DESIGN_SYSTEM.md`), moodboard, & storytelling |
| **Erick** | Technical Lead & AI Integration | Tech setup, auth & community architecture, planned Gemini API RAG pipeline |
