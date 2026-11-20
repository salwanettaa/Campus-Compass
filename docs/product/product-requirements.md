# Product Requirements Document (PRD)

> **Document**: `docs/product/product-requirements.md`  
> **Owner**: Rifal & Netta  
> **Status**: Draft (In Progress)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/01-product-scope.md`](../01-product-scope.md), [`docs/product/user-personas.md`](user-personas.md), [`docs/architecture/api-contract.md`](../architecture/api-contract.md)

---

## 1. Purpose

This document articulates the functional and non-functional requirements for the Campus Compass MVP. It provides an unambiguous specification for engineers, designers, and AI coding agents.

---

## 2. Functional Requirements (FR)

### Module 1: Authentication & Context Setup
- **FR-1.1**: The system must allow users to register and authenticate using email and password via Supabase Auth.
- **FR-1.2**: Upon initial login, the system must require the user to complete an onboarding context profile:
  - University selection (locked to the 1 pilot university during MVP).
  - Study program selection (locked to the 1 pilot program during MVP).
  - Current academic cohort / semester standing.
- **FR-1.3**: The user session must securely carry the authenticated user’s ID and associated context claims (`university_id`, `study_program_id`, `role`).

### Module 2: Dual-Layer Knowledge Retrieval
- **FR-2.1**: The platform must present a unified search and exploration interface.
- **FR-2.2**: The retrieval engine must automatically query both:
  - *Tier 1 (General Knowledge)*: Universal collegiate survival, study habits, academic integrity.
  - *Tier 2 (Campus-Scoped Knowledge)*: Pilot university and study-program-specific guidelines.
- **FR-2.3**: Search results must visually indicate the scope of the information (e.g., badge: `[General]` vs `[Pilot University - Program Name]`).
- **FR-2.4**: Every AI-generated answer must cite specific source documents with clickable reference links.

### Module 3: Rule-Based Recommendation Dashboard
- **FR-3.1**: The home dashboard must render context-aware recommendation cards based on the student's current semester.
- **FR-3.2**: Recommendations must be derived from deterministic rule evaluation (`docs/ai/recommendation-logic.md`) rather than ungrounded LLM completions.
- **FR-3.3**: Students must be able to mark recommendation items as "Dismissed" or "Completed".

### Module 4: Senior Insights & Survival Guides
- **FR-4.1**: The platform must feature a dedicated section for curated senior student advice.
- **FR-4.2**: Senior advice must be categorized by tags: `Academics`, `Lecturers`, `Campus Life`, `Career & Internships`.
- **FR-4.3**: All senior tips must be vetted by administrators/curators prior to public visibility.

---

## 3. Non-Functional Requirements (NFR)

### Security & Privacy
- **NFR-1.1**: Multi-tenant data segregation must be enforced at the database level using Supabase Row Level Security (RLS).
- **NFR-1.2**: Students must never be able to access or query private data of other students.
- **NFR-1.3**: All communication must use HTTPS / TLS 1.3.
- **NFR-1.4**: No secrets, service keys, or private LLM tokens may be exposed in client-side bundles.

### Performance & Latency
- **NFR-2.1**: First Contentful Paint (FCP) must be under 1.5 seconds on a standard 4G broadband connection.
- **NFR-2.2**: AI RAG query response streaming should initiate within 2.0 seconds of query submission.
- **NFR-2.3**: Database vector similarity search execution must complete within 250 milliseconds.

### Usability & Accessibility
- **NFR-3.1**: Web interface must be fully responsive across mobile screens (minimum 360px width) and desktop monitors (up to 4K).
- **NFR-3.2**: UI must adhere to WCAG 2.1 AA accessibility standards for color contrast and screen-reader navigable headings.

---

## 4. Confirmed Decisions vs. Proposed

### Confirmed Decisions
- [x] Initial release strictly limited to 1 pilot university and 1 study program.
- [x] Dual-layer knowledge partitioning (General vs. Campus-Scoped).
- [x] Rule-based recommendation engine for critical academic milestones.
- [x] Citation transparency is mandatory for all generative AI outputs.

### Proposed (Pending Team Sign-off)
- [ ] Inclusion of bookmarking/saving favorite guides for offline viewing.
- [ ] Direct export of recommendation checklists to PDF.

---

## 5. Open Questions

1. Will students have the ability to submit community questions directly through the app, or is initial feedback restricted to senior interview inputs? (Owner: Rifal)
2. What specific verification criteria (e.g. campus email domain validation) should be required to verify student enrollment in the pilot university? (Owner: Netta)
