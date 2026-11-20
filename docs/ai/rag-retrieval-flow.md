# RAG Retrieval Flow & Chunking Strategy

> **Document**: `docs/ai/rag-retrieval-flow.md`  
> **Owner**: Erick (Technical Setup & AI Dev Lead)  
> **Status**: Approved (Foundation Phase)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/ai/ai-architecture.md`](ai-architecture.md), [`docs/database/database-schema.md`](../database/database-schema.md)

---

## 1. Purpose

This document specifies the document ingestion pipeline, chunking heuristics, embedding generation, vector similarity thresholds, and context assembly format for Campus Compass's RAG system.

---

## 2. Ingestion & Document Processing Pipeline

```mermaid
flowchart LR
    RawDoc[Source Handbook / Markdown Guide] --> Clean[Text Normalization & Clean]
    Clean --> Chunk[Recursive Character Splitter<br/>Size: 600 tokens | Overlap: 100 tokens]
    Chunk --> Meta[Attach Metadata<br/>is_general, university_id, program_id, source]
    Meta --> Embed[Google text-embedding-004]
    Embed --> DB[Insert into knowledge_chunks]
```

### Chunking Parameters
- **Chunking Method**: Recursive Character Splitting on Markdown boundaries (`\n\n# `, `\n\n## `, `\n\n`, `\n`, ` `).
- **Target Chunk Size**: $600$ tokens ($\approx 2,400$ characters).
- **Chunk Overlap**: $100$ tokens ($\approx 400$ characters) to preserve contextual transitions between sections.
- **Metadata Enriched with Every Chunk**:
  - `knowledge_item_id` (UUID)
  - `title` (String)
  - `is_general` (Boolean)
  - `university_id` (UUID or null)
  - `study_program_id` (UUID or null)
  - `chunk_index` (Integer)
  - `section_header` (String)

---

## 3. Retrieval & Similarity Ranking

When a user submits a query:

1. **Query Embedding**: The query text is vectorized using Google Gemini `text-embedding-004` (producing a 768-dimensional float array).
2. **Database Vector Search (RPC)**:
   The query calls `public.match_knowledge_chunks`:
   - Enforces `is_general = true OR (university_id = $user_univ AND (study_program_id = $user_prog OR study_program_id IS NULL))`.
   - Computes cosine similarity ($1 - \text{cosine\_distance}$).
   - Filters out chunks below the minimum threshold ($0.65$).
   - Returns Top-$K$ ($K=5$) most relevant chunks.
3. **Re-Ranking (Optional / Phase 2)**:
   Top-$K$ chunks are sorted by relevance and diversity to prevent multiple near-identical chunks from occupying context.

---

## 4. Context Assembly & Prompt Construction

The retrieved chunks are assembled into a structured prompt context:

```markdown
You are Campus Compass, an authoritative academic assistant for students at {university_name}, majoring in {study_program_name}.

Answer the student's question using ONLY the provided verified context chunks below.
If the context does not contain enough information to answer definitively, state that verified information is not available and recommend contacting the study program academic office.

Do NOT invent prerequisites, dates, or faculty names.
Every factual claim must cite its source chunk using [index] notation.

--- CONTEXT CHUNKS ---
[Chunk 1] (Source: {source_title} - Scope: {scope})
{chunk_text}

[Chunk 2] (Source: {source_title} - Scope: {scope})
{chunk_text}
--- END CONTEXT CHUNKS ---

Student Question: {user_query}
```

---

## 5. Confirmed vs. Proposed Specifications

### Confirmed
- [x] Chunk size fixed at ~600 tokens with 100 token overlap.
- [x] Gemini `text-embedding-004` (768 dimensions) for embeddings.
- [x] Minimum cosine similarity threshold set to 0.65.
- [x] Top-5 chunk retrieval limit for MVP prompt payload.

### Proposed
- [ ] Dynamic Top-K (retrieving 3 chunks for simple queries, up to 7 for complex academic queries). (Owner: Erick)

---

## 6. Open Questions

1. How frequently will campus syllabi embeddings need to be re-indexed (e.g. per semester or on-demand)? (Owner: Erick / Netta)
