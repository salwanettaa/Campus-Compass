# Architectural Decision Log (ADR)

> **Document**: `docs/decisions/decision-log.md`  
> **Owner**: Full Team (Coordinated by Netta & Erick)  
> **Status**: Active Living Document  
> **Last Updated**: 2026-11-20

---

## 1. Overview & ADR Lifecycle

This decision log records all critical product, architectural, database, and AI decisions for Campus Compass. It establishes historical rationale, documents trade-offs, and prevents re-debating settled architectural tenets.

### Decision Status Legend
- **Proposed**: Under team discussion; open to feedback and trade-off evaluation.
- **Approved**: Formally signed off by the responsible domain owner and team.
- **Superseded**: Replaced by a newer approved ADR.
- **Rejected**: Evaluated and discarded with recorded justification.

---

## 2. Decision Records Index

| ID | Date | Title | Owner | Status |
| :--- | :--- | :--- | :--- | :--- |
| **ADR-001** | 2026-11-20 | Documentation-First & Agent-Readable Repository Structure | Netta & Erick | **Approved** |
| **ADR-002** | 2026-11-20 | Strict Pilot MVP Scope Boundary (1 University, 1 Study Program) | Rifal & Netta | **Approved** |
| **ADR-003** | 2026-11-20 | Dual-Layer Hybrid Knowledge Architecture | Erick & Netta | **Approved** |
| **ADR-004** | 2026-11-20 | Supabase PostgreSQL, RLS, and pgvector for Unified Backend | Netta | **Approved** |
| **ADR-005** | 2026-11-20 | Google Gemini API & text-embedding-004 for RAG Pipeline | Erick | **Approved** |
| **ADR-006** | 2026-11-20 | Deterministic Rule Engine for Critical Academic Milestones | Netta | **Approved** |
| **ADR-007** | 2026-11-20 | Strict Synthetic Data Isolation & Labeling Standard | Rifal & Netta | **Approved** |
| **ADR-008** | 2026-11-20 | Next.js App Router & Tailwind CSS for Web Platform | Kalya & Erick | **Proposed** |

---

## 3. Detailed Decision Records

### ADR-001: Documentation-First & Agent-Readable Repository Structure
- **Date**: 2026-11-20
- **Status**: **Approved**
- **Owner**: Netta & Erick
- **Context**: Before initiating application coding, the team requires an unambiguous single source of truth that is understandable to human developers and AI coding agents.
- **Decision**: Establish a comprehensive markdown documentation tree in `docs/` and create `AGENTS.md` at repository root defining 13 mandatory agent operational rules.
- **Consequences**: No application code will be generated in `src/` until initial schemas, contracts, and guidelines are reviewed and approved.

---

### ADR-002: Strict Pilot MVP Scope Boundary
- **Date**: 2026-11-20
- **Status**: **Approved**
- **Owner**: Rifal & Netta
- **Context**: Student platforms often fail due to premature multi-campus scaling and shallow, unverified content.
- **Decision**: Restrict initial release strictly to **1 pilot university** and **1 study program** on a responsive web platform.
- **Consequences**: Native mobile apps, cross-university self-service onboarding, and payment integrations are explicitly out of scope for the MVP.

---

### ADR-003: Dual-Layer Hybrid Knowledge Architecture
- **Date**: 2026-11-20
- **Status**: **Approved**
- **Owner**: Erick & Netta
- **Context**: University students need both universal academic advice (time management, essay citations) and hyper-local regulations (course prerequisites, department grading policies).
- **Decision**: Partition knowledge into **General (Tier 1)** and **Campus-Scoped (Tier 2)** at the database and retrieval layer.
- **Consequences**: Every campus-specific item must have `university_id` foreign keys; queries automatically blend general and scoped context via SQL unions/filters.

---

### ADR-004: Supabase PostgreSQL, RLS, and pgvector for Unified Backend
- **Date**: 2026-11-20
- **Status**: **Approved**
- **Owner**: Netta
- **Context**: Managing separate relational databases, authentication providers, and standalone vector databases increases infrastructure complexity and maintenance risk for a lean team.
- **Decision**: Use Supabase as a unified platform: PostgreSQL for relational entities, Row Level Security (RLS) for tenant isolation, GoTrue for Auth, and pgvector for vector embeddings.
- **Consequences**: Eliminates separate vector database costs and allows single-query hybrid vector + relational filtering.

---

### ADR-005: Google Gemini API & text-embedding-004 for RAG Pipeline
- **Date**: 2026-11-20
- **Status**: **Approved**
- **Owner**: Erick
- **Context**: RAG synthesis requires an LLM with large context capability, reliable instruction adherence, low latency, and cost efficiency.
- **Decision**: Standardize on Google Gemini `text-embedding-004` (768 dimensions) for embeddings and `gemini-1.5-flash` (with optional `gemini-1.5-pro` fallback) for conversational generation.
- **Consequences**: Temperature is locked low ($0.1$ – $0.2$) for factual grounding; citations are strictly required in all responses.

---

### ADR-006: Deterministic Rule Engine for Critical Academic Milestones
- **Date**: 2026-11-20
- **Status**: **Approved**
- **Owner**: Netta
- **Context**: Generative models are probabilistic and risk hallucinating deadlines or prerequisite rules.
- **Decision**: Critical milestones (e.g., lab safety clearance, KRS deadlines) are managed by a deterministic rule engine (`docs/ai/recommendation-logic.md`) evaluated on student semester attributes.
- **Consequences**: 100% predictable compliance for regulatory university procedures.

---

### ADR-007: Strict Synthetic Data Isolation & Labeling Standard
- **Date**: 2026-11-20
- **Status**: **Approved**
- **Owner**: Rifal & Netta
- **Context**: Early prototyping requires test data, but unvetted synthetic mockups must never be confused with real qualitative interview findings or official university policy.
- **Decision**: Store all synthetic fixtures in `research/synthetic-data/`, mandate explicit `[SYNTHETIC]` metadata tags, and ban synthetic data from production seeds.
- **Consequences**: Preserves integrity of qualitative research and prevents false claims during pilot testing.

---

### ADR-008: Next.js App Router & Tailwind CSS for Web Platform
- **Date**: 2026-11-20
- **Status**: **Proposed** (Pending Kalya & Rifal sign-off)
- **Owner**: Kalya & Erick
- **Context**: Need a full-stack framework with streaming SSR support and rapid styling primitives.
- **Decision**: Adopt Next.js 14+ (App Router) with TypeScript and Tailwind CSS.
- **Consequences**: Standardizes component architecture in `src/components/` and route handlers in `src/app/api/`.
