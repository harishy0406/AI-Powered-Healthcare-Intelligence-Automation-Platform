# PRD: AI-Powered Healthcare Intelligence Platform
### Version 1.0 (MVP) — Product Requirements Document

| | |
|---|---|
| **Author** | M Harish gautham |
| **Status** | Draft — Ready for build |
| **Target** | Portfolio-grade MVP, scalable to production architecture |
| **Primary stack** | Next.js 14 + FastAPI + Groq/Gemini + Vector DB |

---

## 1. Overview & Vision

An AI-powered platform that helps clinics and healthcare providers turn unstructured clinical knowledge and patient interaction data into **actionable intelligence** — combining a Retrieval-Augmented Generation (RAG) assistant, an analytics dashboard, and workflow automation into one product.

**Vision statement:** *Give a small clinic the intelligence layer that only large hospital systems currently have — an AI copilot for clinical queries, patient workflows, and operational insight.*

> ⚠️ **Scope disclaimer (important for v1):** This is a **decision-support and operations tool**, not a diagnostic device. It does not replace a licensed clinician. All medical content in the MVP uses public, de-identified, or synthetic datasets — never real patient data — until proper compliance review (HIPAA/DPDP Act) is completed.

---

## 2. Problem Statement

Clinics and small healthcare providers struggle with three separate problems today, usually solved by three separate (expensive) tools or not solved at all:

1. **Information retrieval** — staff waste time searching guidelines, drug interactions, or protocols across PDFs and portals.
2. **Operational blindness** — no simple dashboard shows patient load, appointment no-show rates, or common complaint trends.
3. **Manual workflows** — appointment reminders, intake summarization, and follow-ups are done manually or not at all.

## 3. Goals & Success Metrics (v1)

| Goal | Metric (MVP demo target) |
|---|---|
| Fast, grounded clinical Q&A | RAG assistant answers with cited source in < 5s, > 90% answers grounded in retrieved docs (no hallucinated citations) |
| Usable analytics | Dashboard renders live from seeded dataset in < 2s |
| Working automation | At least 1 automated workflow (e.g., patient intake summarization or reminder) runs end-to-end without manual intervention |
| Demonstrable scalability | Architecture supports swapping SQLite→Postgres and single-tenant→multi-tenant with no rewrite, only config change |

## 4. Target Users / Personas

- **Dr. Priya (Clinic owner / physician)** — wants quick answers to clinical/protocol questions and a snapshot of clinic performance.
- **Rahul (Clinic front-desk staff)** — handles patient intake, appointments; needs automation to reduce repetitive admin work.
- **Admin/Ops user** — wants analytics: patient volume, common conditions, appointment trends.

## 5. Scope

### In scope (v1 MVP)
- AI Q&A assistant grounded in a curated clinical knowledge base (RAG)
- Document ingestion pipeline (PDF/text guidelines → vector store)
- Analytics dashboard (patient/appointment trend charts, seeded/synthetic data)
- One automated workflow: **AI-generated patient intake summary** from a symptom form
- Basic auth (single clinic / single admin account, role: admin vs staff)
- Source-citation on every AI answer (builds trust, avoids "black box" answers)

### Out of scope (v1 — planned for v2+)
- Real EHR/FHIR integration
- Multi-tenant billing/subscription system
- Power BI Embedded / enterprise BI connectors
- Voice interface, mobile app
- HIPAA/DPDP full compliance certification (v1 uses synthetic data only)
- Fine-tuned/custom medical LLM (v1 uses off-the-shelf LLM APIs + RAG)

## 6. Feature Breakdown (MoSCoW)

| Priority | Feature | Description |
|---|---|---|
| **Must** | RAG Clinical Assistant | Chat interface; retrieves from vector DB, answers with citations |
| **Must** | Knowledge ingestion pipeline | Upload PDFs/text → chunk → embed → store |
| **Must** | Analytics dashboard | Charts: patient volume, top complaints, appointment status |
| **Must** | Intake summarization workflow | Patient fills symptom form → LLM generates structured summary for staff |
| **Must** | Auth (admin/staff roles) | Login, protected routes |
| **Should** | Appointment reminder automation | Scheduled job → simulated email/SMS reminder (mocked in MVP) |
| **Should** | Answer feedback (👍/👎) | Captures quality signal for future fine-tuning |
| **Could** | Multi-language query support | Gemini/Groq handle regional language input |
| **Won't (v1)** | Real EHR integration, billing, mobile app | Deferred to v2/v3 |

## 7. Core User Flows

**Flow A — Clinical Q&A**
1. Staff/doctor types a question ("interaction between drug X and Y?")
2. Query embedded → top-k chunks retrieved from vector store
3. LLM (Groq/Gemini) generates answer **constrained to retrieved context**, with inline source citation
4. User can thumbs up/down the answer (stored for analytics + future tuning)

**Flow B — Patient Intake Automation**
1. Patient/staff fills a structured symptom intake form
2. Backend sends form data to LLM with a summarization prompt
3. LLM returns a structured note (chief complaint, duration, flags) → stored + shown to staff
4. Staff reviews/edits before it's finalized (human-in-the-loop — critical for trust & safety)

**Flow C — Analytics**
1. Dashboard queries Postgres/SQLite for aggregated stats
2. Charts render: appointments/day, top 5 complaint categories, no-show rate
3. Filters: date range, provider

## 8. System Architecture (v1 MVP)

```
┌─────────────────────────┐        ┌──────────────────────────────┐
│      Next.js 14          │ HTTPS  │           FastAPI              │
│  (React 19, Tailwind)    │───────▶│   /api/chat  /api/ingest       │
│  - Chat UI                │        │   /api/intake  /api/analytics │
│  - Dashboard (Recharts)   │◀───────│   - Auth (JWT)                 │
│  - Intake form             │        │   - Orchestration layer        │
└─────────────────────────┘        └──────────────┬────────────────┘
                                                     │
                     ┌───────────────────────────────┼───────────────────────────┐
                     ▼                               ▼                           ▼
            ┌─────────────────┐          ┌────────────────────┐        ┌──────────────────┐
            │  Vector Store     │          │  Relational DB       │        │  LLM Providers     │
            │  (Chroma → v2:     │          │  (SQLite → v2:        │        │  Groq API           │
            │   Pinecone/Weaviate)│         │   Postgres)           │        │  Google Gemini      │
            └─────────────────┘          └────────────────────┘        └──────────────────┘
```

**Why this stack:**
- **Next.js/React** — matches your existing skillset directly, fast to iterate on UI.
- **FastAPI (Python)** — best ecosystem for RAG/LLM orchestration (LangChain-compatible, async-friendly, easy vector DB SDKs).
- **Chroma (local, embedded)** for v1 — zero infra cost, swappable later for Pinecone/Weaviate at scale.
- **SQLite for v1** — same reason; Prisma or SQLAlchemy schema is designed to move to Postgres with a config change, not a rewrite.
- **Groq + Gemini** — you already have access; Groq gives near-instant inference for the chat UX, Gemini as a fallback/secondary model for redundancy.

## 9. Data Model (Core Entities)

```
User (id, name, email, role[admin|staff], clinic_id)
Clinic (id, name, config)
Document (id, title, source_type, uploaded_by, created_at)
DocumentChunk (id, document_id, content, embedding_vector, page_ref)
ChatQuery (id, user_id, question, answer, sources[], feedback, created_at)
Patient (id, clinic_id, name[or anonymized_id], created_at)  -- synthetic data only in v1
IntakeForm (id, patient_id, symptoms, duration, raw_input, ai_summary, reviewed_by, created_at)
Appointment (id, patient_id, provider, scheduled_at, status[scheduled|completed|no_show])
```

## 10. API Design (FastAPI — key endpoints)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Auth, returns JWT |
| POST | `/api/documents/ingest` | Upload doc → chunk → embed → store |
| POST | `/api/chat` | RAG query → returns answer + sources |
| POST | `/api/intake` | Submit symptom form → returns AI summary |
| PATCH | `/api/intake/{id}/review` | Staff approves/edits AI summary |
| GET | `/api/analytics/overview` | Aggregated dashboard stats |
| GET | `/api/appointments` | List/filter appointments |
| POST | `/api/feedback` | Store 👍/👎 on a chat answer |

## 11. RAG Pipeline Detail

1. **Ingestion:** PDF/text → split into ~500-token chunks with overlap → embed (e.g., `text-embedding-3-small` or Gemini embeddings) → store in Chroma with metadata (source, page).
2. **Retrieval:** user query embedded → cosine similarity top-k (k=4–6) → re-rank by relevance if time allows.
3. **Generation:** prompt template forces the model to **only answer from provided context** and **cite chunk source**; if confidence/similarity is below threshold, respond "Not found in knowledge base — consult a clinician."
4. **Guardrail:** system prompt explicitly instructs the model not to give direct diagnoses — only informational/decision-support answers with a disclaimer footer.

## 12. Non-Functional Requirements

| Category | v1 requirement |
|---|---|
| **Security** | JWT auth, hashed passwords, role-based access, HTTPS only |
| **Privacy** | No real PII/PHI in v1 — synthetic/anonymized data only |
| **Performance** | Chat response < 5s p95; dashboard load < 2s |
| **Reliability** | Graceful fallback if primary LLM (Groq) fails → retry on Gemini |
| **Observability** | Basic request logging; store LLM latency + token usage per call |
| **Compliance (future)** | Architecture must not block later HIPAA/DPDP audit (no shortcuts that hardcode assumptions incompatible with encryption-at-rest, audit logs, etc.) |

## 13. Suggested Repo Structure

```
healthcare-ai-platform/
├── apps/
│   ├── web/               # Next.js 14 frontend
│   └── api/                # FastAPI backend
│       ├── routers/
│       ├── services/       # rag_service.py, llm_service.py, ingest_service.py
│       ├── models/         # SQLAlchemy/Prisma schema
│       └── main.py
├── data/
│   ├── seed/                # synthetic patients, sample guideline PDFs
│   └── vectorstore/          # Chroma persistence
├── docs/
│   └── PRD.md               # this file
└── README.md
```

## 14. 4-Week MVP Build Plan

| Week | Milestone |
|---|---|
| **1** | Repo scaffold, auth, DB schema, seed synthetic data; basic Next.js shell |
| **2** | Document ingestion pipeline + working RAG chat endpoint + chat UI |
| **3** | Intake form + AI summarization workflow + analytics dashboard (charts) |
| **4** | Polish: citations UI, feedback capture, guardrails, deploy (Vercel + Railway/Render for FastAPI), demo video/README |

## 15. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| LLM hallucination on medical content | Strict RAG-only prompting + "not found" fallback + visible disclaimers |
| Perceived as giving medical advice | Clear UI disclaimers, human-in-the-loop review for intake summaries |
| Vector store cost/scale at growth | Start with local Chroma, design retrieval layer behind an interface so swapping to Pinecone/Weaviate is a config change |
| Single point of failure (one LLM provider) | Dual-provider fallback (Groq primary, Gemini secondary) |

## 16. Scalability Roadmap (Post-v1)

| Version | Upgrade |
|---|---|
| **v2** | Postgres migration, multi-tenant clinics, real appointment reminders (Twilio/SMTP), Pinecone/Weaviate vector store |
| **v3** | EHR/FHIR integration, Power BI Embedded or custom BI layer for enterprise clients, fine-tuned domain model, HIPAA/DPDP compliance audit |
| **v4** | Role-based multi-clinic analytics benchmarking, mobile app, voice intake |

## 17. Open Questions / Assumptions

- Assuming a **single demo clinic** with synthetic data for v1 — confirm before adding real patient data at any stage.
- Assuming **Groq + Gemini** are sufficient for v1 (no GPU/self-hosted model needed).
- Power BI mentioned in the original pitch is treated as a **v3 enterprise feature** rather than MVP — a custom Recharts dashboard is faster to build and fully within your current stack for v1.

---
*End of PRD v1.0*
