# API Contract & Endpoint Specifications

> **Document**: `docs/architecture/api-contract.md`  
> **Owner**: Netta (Backend & Database Lead)  
> **Status**: Approved (Foundation Phase)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/database/database-schema.md`](../database/database-schema.md), [`docs/ai/rag-retrieval-flow.md`](../ai/rag-retrieval-flow.md)

---

## 1. Purpose

This document defines the REST API routes, RPC functions, request/response JSON schemas, authentication expectations, and error envelopes for Campus Compass. It serves as the formal interface contract between frontend and backend.

---

## 2. Standard Request & Error Format

### Standard Error Envelope
All error responses from Next.js route handlers adhere to the following schema:
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested knowledge article does not exist or is outside your campus scope.",
    "details": null,
    "timestamp": "2026-11-20T13:00:00Z"
  }
}
```

### Standard HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Invalid payload or missing parameters.
- `401 Unauthorized`: Session missing or expired.
- `403 Forbidden`: Authenticated user lacks permission / tenant mismatch.
- `429 Too Many Requests`: Rate limit reached.
- `500 Internal Server Error`: Server or third-party service exception.

---

## 3. Core API Endpoints

### Endpoint 1: RAG Streaming Query
- **Path**: `POST /api/rag/query`
- **Access**: Authenticated Student
- **Description**: Submits a natural language query, performs dual-layer vector search, and streams a grounded response with source citations.
- **Request Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <supabase_jwt>`
- **Request Body**:
  ```json
  {
    "query": "What are the lab safety requirements for freshman chemistry?",
    "conversation_id": "optional-uuid-string"
  }
  ```
- **Response**: Server-Sent Events (SSE) or `ReadableStream` of text tokens and final metadata event:
  ```json
  event: metadata
  data: {
    "citations": [
      {
        "chunk_id": "c7a840e6-...",
        "title": "Chemistry Dept Safety Manual §2",
        "scope": "campus",
        "university_id": "univ-01",
        "study_program_id": "prog-chem-01",
        "similarity_score": 0.89
      }
    ]
  }
  ```

---

### Endpoint 2: Get Recommendation Cards
- **Path**: `GET /api/recommendations`
- **Access**: Authenticated Student
- **Description**: Returns deterministic recommendation milestones tailored to the student's current semester and academic context.
- **Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "rec-sem1-lab-safety",
        "title": "Complete Mandatory Lab Induction",
        "description": "All first-year students must pass the digital lab safety quiz before Week 3.",
        "category": "academic_requirement",
        "semester_target": 1,
        "is_completed": false,
        "action_url": "/app/knowledge/chem-safety-induction",
        "due_date_relative": "Week 3 of Semester"
      }
    ]
  }
  ```

---

### Endpoint 3: Browse Knowledge Items
- **Path**: `GET /api/knowledge`
- **Access**: Authenticated Student
- **Query Parameters**:
  - `category` (optional): Filter by category (e.g., `academics`, `facilities`).
  - `scope` (optional): `all` (default) | `general` | `campus`.
  - `limit` (default: 20): Integer.
- **Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "8c41d1a9-...",
        "title": "Campus Shuttle Timetable & Routes",
        "category": "facilities",
        "is_general": false,
        "university_id": "univ-pilot-01",
        "study_program_id": null,
        "updated_at": "2026-11-20T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20
    }
  }
  ```

---

### Endpoint 4: Curated Senior Tips
- **Path**: `GET /api/tips`
- **Access**: Authenticated Student
- **Query Parameters**:
  - `tag` (optional): Filter tag (`lecturers`, `study_habits`, `internships`).
- **Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "tip-99b-...",
        "title": "How to Prepare for Dr. Wahyu's Lab Practicals",
        "content_excerpt": "Always write your pre-lab report by hand; he checks the methodology diagrams first...",
        "author_tag": "Senior Class of 2024",
        "tags": ["practicum", "lab", "study_habits"],
        "helpful_count": 42
      }
    ]
  }
  ```

---

## 4. Supabase RPC Function Contracts

### RPC: `match_knowledge_chunks`
- **Invoked by**: Server-side API route handler via Supabase client.
- **Parameters**:
  - `query_embedding`: `vector(768)`
  - `filter_university_id`: `UUID`
  - `filter_study_program_id`: `UUID`
  - `match_threshold`: `float` (e.g. 0.65)
  - `match_count`: `int` (e.g. 5)
- **Returns**: Table of matched chunk records with similarity score.

---

## 5. Confirmed vs. Proposed Contracts

### Confirmed
- [x] Standard error envelope with machine-readable error codes.
- [x] Streaming response format for RAG queries.
- [x] Scoped RPC vector search enforcing tenant constraints.

### Proposed
- [ ] GraphQL API alternative (Rejected in favor of REST / Server Actions for MVP simplicity).
- [ ] WebSocket connection for bi-directional chat (SSE selected as lighter and HTTP/2 friendly).

---

## 6. Open Questions

1. Should we support anonymous public previews for general articles without login? (Owner: Netta / Rifal)
2. What maximum token limit should be enforced per user per day on the RAG query endpoint? (Owner: Netta / Erick)
