# Google Gemini API Integration Specification

> **Document**: `docs/ai/gemini-integration.md`  
> **Owner**: Erick (Technical Setup & AI Dev Lead)  
> **Status**: Approved (Foundation Phase)  
> **Last Updated**: 2026-11-20  
> **Dependencies**: [`docs/ai/ai-architecture.md`](ai-architecture.md), [`docs/architecture/tech-stack.md`](../architecture/tech-stack.md)

---

## 1. Purpose

This document defines the technical integration specification for the Google Gemini API, including SDK configuration, model selections, system prompts, safety thresholds, and streaming token handlers.

---

## 2. SDK & Client Configuration

We utilize the official Google Gen AI SDK for Node.js / TypeScript.

### Installation (Phase 1 Target)
```bash
npm install @google/genai
```

### Client Initialization (`src/lib/gemini/client.ts`)
```typescript
import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('CRITICAL: GEMINI_API_KEY environment variable is not defined.');
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
```

---

## 3. Model Selection & Roles

| Task | Selected Model | Configuration | Rationale |
| :--- | :--- | :--- | :--- |
| **Semantic Embedding** | `text-embedding-004` | 768 Dimensions | High precision semantic representations, optimized for retrieval tasks. |
| **Standard RAG Chat** | `gemini-1.5-flash` | Temperature: `0.2`<br/>TopP: `0.8` | Ultra-low latency, high token generation speed, cost-effective for student traffic. |
| **Complex Academic Reasoning** | `gemini-1.5-pro` | Temperature: `0.1`<br/>TopP: `0.9` | Deep multi-document reasoning for prerequisite tree analysis and policy comparisons. |

---

## 4. System Instruction & Grounding Guardrails

```typescript
export const CAMPUS_COMPASS_SYSTEM_INSTRUCTION = `
You are Campus Compass, an intelligent, empathetic, and strictly factual academic copilot.
You assist university students by synthesizing official departmental handbooks and curated senior student advice.

Core Operational Rules:
1. Grounding First: Answer solely based on the provided context chunks. Never assume or extrapolate unstated policies.
2. Citation Transparency: Every factual sentence or policy statement must cite its source using [1], [2] notation corresponding to the provided context chunks.
3. Tenant Respect: Never present advice specific to one university or study program as universal fact for another.
4. Tone: Professional, supportive, concise, and clear. Avoid overly verbose filler.
5. Inability to Answer: If the provided context is insufficient, state clearly:
   "I do not have verified department documentation to answer this question accurately. Please verify directly with your academic advisor or study program office."
`;
```

---

## 5. Safety Settings & Content Filtering

To ensure an academically appropriate environment, we configure Google Gemini's safety threshold settings:

```typescript
export const geminiSafetySettings = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_LOW_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_LOW_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_LOW_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
];
```

---

## 6. Confirmed vs. Proposed Specifications

### Confirmed
- [x] Integration via official `@google/genai` SDK on server runtime.
- [x] Zero client-side API key exposure (server-side route handler proxy).
- [x] `text-embedding-004` standard for all vector representations.
- [x] Low temperature ($0.1$ – $0.2$) for strict factual adherence.

### Proposed
- [ ] Evaluation of Gemini 2.0 Flash as standard generation model upon general availability. (Owner: Erick)

---

## 7. Open Questions

1. Does the team possess a Google AI Studio API key with adequate quota for pilot testing, or should Google Cloud Vertex AI be evaluated? (Owner: Erick / Netta)
