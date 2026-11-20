# User Flow & Journey Maps

> **Document**: `docs/product/user-flow.md`  
> **Owner**: Kalya (Frontend & UX Lead)  
> **Status**: Draft (In Progress)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/product/sitemap.md`](sitemap.md), [`docs/product/product-requirements.md`](product-requirements.md)

---

## 1. Purpose

This document details the core user journeys through Campus Compass, mapping touchpoints, system validations, and edge cases. It guides Kalya in state management and component interaction design.

---

## 2. Journey 1: Student Onboarding & Context Locking

This flow ensures every student is properly associated with the pilot university and study program before accessing scoped knowledge.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Web as Web Frontend (Next.js)
    participant Auth as Supabase Auth
    participant DB as Supabase Postgres (Profiles)

    Student->>Web: Navigate to /auth/register
    Web->>Student: Render registration form
    Student->>Web: Submit Email & Password
    Web->>Auth: signUp(email, password)
    Auth-->>Web: Session created / Confirmation sent
    Web->>Student: Redirect to /app/onboarding
    Student->>Web: Select University (Pilot) & Program (Pilot) & Semester
    Web->>DB: UPDATE profiles SET university_id, program_id, semester
    DB-->>Web: Profile updated successfully
    Web->>Student: Redirect to /app/dashboard (Ready)
```

### Edge Cases
- **User abandons onboarding**: If the user leaves `/app/onboarding` and returns later, Next.js middleware detects `profile.onboarding_completed == false` and redirects back to `/app/onboarding`.
- **User selects non-pilot university**: UI locks non-pilot institutions with a "Coming Soon to Your Campus" notification and email waitlist capture.

---

## 3. Journey 2: Dual-Layer RAG Knowledge Search

This journey represents the primary interaction loop: asking questions and receiving grounded, cited answers.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Web as Search Interface
    participant API as Next.js API Route (/api/rag/query)
    participant DB as Supabase pgvector (RPC match_chunks)
    participant Gemini as Google Gemini 1.5/2.0 API

    Student->>Web: Enter query (e.g., "What are prerequisites for Advanced Algorithms?")
    Web->>API: POST query + session token
    API->>API: Validate session & extract (university_id, program_id)
    API->>Gemini: Generate Query Embedding (text-embedding-004)
    Gemini-->>API: Return query_vector [768 dimensions]
    API->>DB: Call match_knowledge_chunks(query_vector, university_id, program_id)
    DB-->>API: Return Top-K chunks (General + Scoped)
    API->>Gemini: Stream prompt with chunks + system instructions
    Gemini-->>API: Stream tokens
    API-->>Web: Stream response with citation references
    Web-->>Student: Render formatted markdown + Clickable source pills
```

---

## 4. Journey 3: Exploring Rule-Based Recommendations

Students review curated milestones tailored to their academic standing.

```mermaid
flowchart TD
    Start([User opens Dashboard]) --> CheckContext{Read Student Semester}
    CheckContext -->|Semester 1| R1[Card: Essential Lab Safety Clearance]
    CheckContext -->|Semester 1| R2[Card: Academic Advisor Introduction Protocol]
    CheckContext -->|Semester 3| R3[Card: Prerequisite Check for Core Specializations]
    CheckContext -->|Semester 6| R4[Card: Internship Registration Checklist]
    
    R1 & R2 & R3 & R4 --> Action{User Interaction}
    Action -->|Click Learn More| Detail[Open Scoped Knowledge Article]
    Action -->|Mark Done| Complete[Save to completed_recommendations]
    Action -->|Dismiss| Dismiss[Hide Card for Session]
```

---

## 5. Confirmed vs. Proposed Flows

### Confirmed
- [x] Context onboarding is mandatory before accessing `/app/dashboard`.
- [x] AI search streaming flow includes real-time citation pills.
- [x] Student recommendation cards are semester-driven.

### Proposed
- [ ] Save-for-later workflow for senior tips.
- [ ] In-line student feedback widget ("Was this answer accurate for your department?").

---

## 6. Open Questions

1. Should the student be allowed to change their study program after onboarding without contacting an administrator? (Owner: Kalya / Netta)
2. How should the UI handle zero-result RAG queries when no relevant chunks are found? (Owner: Kalya / Erick)
