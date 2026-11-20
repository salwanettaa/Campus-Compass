# 01 — Product Scope

> **Document**: `docs/01-product-scope.md`  
> **Owner**: Netta & Rifal  
> **Status**: Approved (Foundation Phase)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/00-project-overview.md`](00-project-overview.md), [`docs/decisions/decision-log.md`](decisions/decision-log.md)

---

## 1. Purpose

This document defines the strict boundaries of the **Minimum Viable Product (MVP)** for Campus Compass. Clear scoping prevents feature creep, protects the delivery timeline, and ensures the architecture remains clean and maintainable.

---

## 2. In-Scope for Initial MVP

The initial launch covers the following functional capabilities exclusively within **1 Pilot University** and **1 Study Program**:

### A. Student Authentication & Profile Context
- User sign-up and authentication via email/password (backed by Supabase Auth).
- Mandatory profile context selection: University, Study Program, Current Semester/Year.
- Role-based authorization: Student (Pilot Cohort) and Administrator/Curator.

### B. Dual-Layer Knowledge Access
- **General Knowledge Base (Unscoped)**: Universal academic guidelines, time management strategies, study tools, mental wellness references.
- **Campus-Scoped Knowledge Base (Scoped)**: Course prerequisite maps, lecturer submission guidelines, lab procedures, campus survival tips specific to the pilot study program.

### C. Grounded AI Assistant (RAG)
- Conversational chat interface for natural language student queries.
- Hybrid vector retrieval utilizing pgvector and Google Gemini embeddings.
- Automatic metadata filtering ensuring students only retrieve knowledge authorized for their university/program.
- Explicit citation rendering (linking responses to underlying source documents).

### D. Deterministic Recommendation Cards
- Rule-based dashboard cards triggered by student semester context (e.g., "Semester 1: Register for Lab Safety Induction").
- Zero reliance on ungrounded generative hallucinations for critical administrative steps.

### E. Curated Senior Insights
- Categorized repository of vetted senior student tips and advice gathered from qualitative interviews.

---

## 3. Explicitly Out-of-Scope (Deferred to Future Phases)

To ensure rapid delivery, the following features are strictly **OUT-OF-SCOPE** for the initial MVP:

| Feature / Capability | Rationale for Deferral | Target Phase |
| :--- | :--- | :--- |
| **Multi-University Self-Service Onboarding** | Focus must remain on qualitative depth for 1 pilot institution. | Phase 4 |
| **Native Mobile Applications (iOS / Android)** | Web-first responsive application provides adequate mobile access with half the maintenance overhead. | Phase 3/4 |
| **Direct LMS / SIS Two-Way Sync (Moodle, Canvas)** | Bypasses complex academic bureaucracy and institutional API authorization during MVP. | Phase 4 |
| **Tuition / Fee Payment Gateways** | High regulatory and compliance overhead; not required for knowledge navigation. | Out of Scope |
| **Unmoderated Peer-to-Peer Chat / Social Network** | Requires high-effort moderation systems and distracts from high-value knowledge retrieval. | Phase 3 |
| **Voice / Multimodal Live Audio Interaction** | Text-based RAG provides lower latency and higher factual auditability. | Phase 3 |

---

## 4. Multi-Campus Scalability Guardrails

While the MVP is restricted to 1 university and 1 study program, the database schema and software architecture must be **multi-tenant ready** from Day 1:

1. **Foreign Key Scoping**: Every campus-specific table (`courses`, `knowledge_items`, `senior_tips`, etc.) must include `university_id` and optional `study_program_id`.
2. **Row Level Security (RLS)**: Access controls must evaluate tenant boundaries at the database layer, ensuring adding a second university requires zero application rewrites.
3. **No Hardcoded University IDs**: Codebase must never contain hardcoded university strings, IDs, or flags.

---

## 5. Confirmed vs. Proposed Boundaries

### Confirmed
- [x] Exactly 1 Pilot University and 1 Study Program for the first deployment.
- [x] Responsive Web Application (Desktop & Mobile Web).
- [x] Strict tenant isolation implemented at the database level.

### Proposed
- [ ] Inclusion of an anonymous student feedback submission mechanism in the MVP.
- [ ] Exportable semester schedule planning checklist.

---

## 6. Open Questions

1. Will the pilot study program provide official PDF documentation for ingestion, or will ingestion rely solely on senior interviews and synthesized guides?
2. Does the pilot institution require single-sign-on (SSO) integration (e.g. Google Workspace for Education), or is standard email auth acceptable for MVP?
