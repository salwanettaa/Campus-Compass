# Entity-Relationship Diagram (ERD)

> **Document**: `docs/database/erd.md`  
> **Owner**: Netta (Backend, Database & AI Architecture Lead)  
> **Status**: Approved (Foundation Phase)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/database/database-schema.md`](database-schema.md), [`docs/database/data-classification.md`](data-classification.md)

---

## 1. Purpose

This document visualizes the relational data model for Campus Compass. It captures all entity types, attributes, primary/foreign keys, and relational cardinalities supporting tenant-scoped knowledge retrieval and user progress tracking.

---

## 2. Visual Entity-Relationship Diagram

```mermaid
erDiagram
    UNIVERSITIES ||--o{ STUDY_PROGRAMS : "offers"
    UNIVERSITIES ||--o{ PROFILES : "enrolls"
    STUDY_PROGRAMS ||--o{ PROFILES : "majors_in"
    
    UNIVERSITIES ||--o{ KNOWLEDGE_ITEMS : "scopes"
    STUDY_PROGRAMS ||--o{ KNOWLEDGE_ITEMS : "scopes"
    KNOWLEDGE_ITEMS ||--|{ KNOWLEDGE_CHUNKS : "partitioned_into"

    UNIVERSITIES ||--o{ SENIOR_TIPS : "scopes"
    STUDY_PROGRAMS ||--o{ SENIOR_TIPS : "scopes"
    PROFILES ||--o{ SENIOR_TIPS : "authors"

    PROFILES ||--o{ USER_RECOMMENDATIONS : "tracks"
    RECOMMENDATION_RULES ||--o{ USER_RECOMMENDATIONS : "generates"
    STUDY_PROGRAMS ||--o{ RECOMMENDATION_RULES : "applies_to"

    PROFILES ||--o{ QUERY_LOGS : "executes"

    UNIVERSITIES {
        uuid id PK
        string name
        string slug UK
        string domain UK
        boolean is_active
        timestamp created_at
    }

    STUDY_PROGRAMS {
        uuid id PK
        uuid university_id FK
        string name
        string code
        string degree_level
        boolean is_pilot
        timestamp created_at
    }

    PROFILES {
        uuid id PK "references auth.users"
        uuid university_id FK
        uuid study_program_id FK
        string full_name
        string role "student | curator | admin"
        int semester
        int enrollment_year
        boolean onboarding_completed
        timestamp updated_at
    }

    KNOWLEDGE_ITEMS {
        uuid id PK
        uuid university_id FK "nullable for general"
        uuid study_program_id FK "nullable"
        string title
        string category
        boolean is_general
        string access_level "public | campus_scoped | private"
        text content_raw
        timestamp created_at
    }

    KNOWLEDGE_CHUNKS {
        uuid id PK
        uuid knowledge_item_id FK
        text chunk_text
        int chunk_index
        vector embedding "768-dim"
        jsonb metadata
        timestamp created_at
    }

    SENIOR_TIPS {
        uuid id PK
        uuid university_id FK
        uuid study_program_id FK
        uuid author_profile_id FK "nullable"
        string title
        text content
        string category
        boolean is_verified
        int helpful_count
        timestamp created_at
    }

    RECOMMENDATION_RULES {
        uuid id PK
        uuid study_program_id FK "nullable"
        string rule_code UK
        string title
        text description
        int target_semester
        string trigger_condition
        string action_link
        boolean is_active
    }

    USER_RECOMMENDATIONS {
        uuid id PK
        uuid profile_id FK
        uuid rule_id FK
        string status "active | completed | dismissed"
        timestamp completed_at
        timestamp created_at
    }

    QUERY_LOGS {
        uuid id PK
        uuid profile_id FK
        text query_text
        jsonb retrieved_chunk_ids
        float execution_time_ms
        timestamp created_at
    }
```

---

## 3. Relational Cardinality Summary

1. **Universities & Programs**:
   - One `university` has many `study_programs` (1:N).
   - In MVP, exactly 1 `university` record and 1 `study_program` record are marked as active pilots.
2. **Profiles & Authentication**:
   - `profiles.id` mirrors Supabase `auth.users.id` (1:1).
   - A `profile` belongs to one `university` and one `study_program` (N:1).
3. **Knowledge Items & Vector Chunks**:
   - A `knowledge_item` has many `knowledge_chunks` (1:N).
   - If `knowledge_items.is_general = TRUE`, then `university_id` and `study_program_id` are NULL.
   - If `is_general = FALSE`, `university_id` is mandatory.
4. **Recommendation Engine**:
   - A `recommendation_rule` generates `user_recommendations` state for students based on their profile semester standing.

---

## 4. Confirmed vs. Proposed Relationships

### Confirmed
- [x] Multi-tenant ready entity structure with foreign key scoping.
- [x] Separation between high-level knowledge items and vector search chunks.
- [x] 1:1 binding between Supabase `auth.users` and application `profiles`.

### Proposed
- [ ] Direct student bookmark / favorite entity for knowledge articles (`profile_bookmarks`).
- [ ] Dedicated audit log table for admin moderation actions.

---

## 5. Open Questions

1. Should senior tips author profiles allow anonymous display while retaining the internal `author_profile_id` reference? (Owner: Netta / Rifal)
