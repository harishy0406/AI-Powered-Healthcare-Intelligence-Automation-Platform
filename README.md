# 🏥 CareCopilot — AI-Powered Healthcare Intelligence Platform

An AI intelligence layer for small clinics — combining a **RAG-based clinical assistant**, **real-time analytics dashboard**, and **automated patient intake workflows** into one product.

> **⚠️ Important:** This is a **decision-support and operations tool**, not a diagnostic device. All data in the MVP is synthetic — never real patient data.

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Clinical Assistant** | Chat interface with RAG-powered Q&A, source citations, and feedback capture |
| 📊 **Analytics Dashboard** | Real-time charts — patient volume, top complaints, appointment status, no-show rate |
| 📋 **Patient Intake Automation** | Structured symptom form → AI-generated clinical summary with human-in-the-loop review |
| 📄 **Knowledge Base Management** | Upload PDFs/text → chunked & embedded for RAG retrieval |
| 🔐 **JWT Authentication** | Role-based access (admin / staff) with secure password hashing |
| 🔄 **Dual LLM Support** | Groq (primary) + Google Gemini (fallback) + mock mode for demo |

## 🏗️ Architecture

```
┌──────────────────────────┐       ┌──────────────────────────────┐
│   React 18 + Vite 6       │ HTTP  │          FastAPI               │
│   Tailwind CSS + Recharts  │◄────►│  /api/auth  /api/chat          │
│   - Landing Page           │       │  /api/intake  /api/analytics   │
│   - Chat UI                │       │  /api/documents                │
│   - Dashboard              │       │  - JWT Auth                    │
│   - Intake Form            │       │  - RAG Pipeline                │
└──────────────────────────┘       └──────────────┬─────────────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────────────┐
                    ▼                              ▼                      ▼
           ┌────────────────┐          ┌────────────────┐       ┌──────────────┐
           │ Knowledge Base  │          │   SQLite DB     │       │ LLM APIs     │
           │ (JSON → v2:     │          │  (→ v2:         │       │ Groq         │
           │  ChromaDB)      │          │   Postgres)     │       │ Gemini       │
           └────────────────┘          └────────────────┘       └──────────────┘
```

## 📁 Project Structure

```
├── apps/
│   ├── web/                    # React + Vite frontend
│   │   ├── src/
│   │   │   ├── pages/          # LandingPage, LoginPage, ChatPage, AnalyticsPage, IntakePage, DocumentsPage
│   │   │   ├── layouts/        # AppLayout (sidebar + header)
│   │   │   ├── App.tsx         # Router + Auth context
│   │   │   └── index.css       # Design system
│   │   └── public/images/      # Generated hero/dashboard images
│   └── api/                    # FastAPI backend
│       ├── routers/            # auth, chat, intake, analytics, documents, appointments
│       ├── services/           # auth_service, llm_service, rag_service
│       ├── models/             # SQLAlchemy models + Pydantic schemas
│       ├── main.py             # App entry point
│       └── seed.py             # Database seeder
├── data/
│   └── seed/                   # Synthetic patients, appointments, clinical knowledge
├── .gitignore
└── AI_Healthcare_Intelligence_Platform_PRD_v1.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Frontend

```bash
cd apps/web
npm install
npm run dev          # → http://localhost:5173
```

### Backend

```bash
cd apps/api
pip install -r requirements.txt
cp .env.example .env   # Edit with your API keys (optional)
uvicorn main:app --reload --port 8000
```

The backend auto-seeds the database on first start with demo data.

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** (Dr. Priya) | `admin@carecopilot.com` | `demo123` |
| **Staff** (Rahul) | `staff@carecopilot.com` | `demo123` |

> The frontend works in **demo mode** without the backend running — login uses client-side fallback, chat uses a built-in knowledge base, and analytics shows synthetic data.

## 🔑 API Keys (Optional)

For AI-generated responses instead of mock mode, add API keys to `apps/api/.env`:

```env
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_api_key
```

Without keys, all features work using the bundled clinical knowledge base and template-based summaries.

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Login → JWT token |
| GET | `/api/auth/me` | Current user info |
| POST | `/api/chat` | RAG clinical Q&A |
| POST | `/api/feedback` | Submit answer feedback (👍/👎) |
| POST | `/api/intake` | Submit intake → AI summary |
| PATCH | `/api/intake/{id}/review` | Staff approves/edits summary |
| GET | `/api/analytics/overview` | Dashboard stats |
| POST | `/api/documents/ingest` | Upload document for RAG |
| GET | `/api/documents` | List documents |
| GET | `/api/appointments` | List/filter appointments |

Full interactive docs at: `http://localhost:8000/docs` (Swagger UI)

## 🛡️ Safety & Compliance

- All AI responses include source citations and disclaimers
- Patient intake summaries require human-in-the-loop review
- System prompt enforces "decision support only — not diagnosis"
- MVP uses synthetic data exclusively
- Architecture supports future HIPAA/DPDP audit (encryption-at-rest, audit logs)

## 🗺️ Roadmap

| Version | Features |
|---|---|
| **v1 (Current)** | RAG chat, analytics, intake automation, auth |
| **v2** | Postgres, multi-tenant, Twilio/SMTP reminders, Pinecone |
| **v3** | EHR/FHIR integration, Power BI, fine-tuned model, compliance audit |
| **v4** | Multi-clinic benchmarking, mobile app, voice intake |

## 📜 License

Private — portfolio project by Dhruba Kumar Agarwalla.
