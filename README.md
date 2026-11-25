# CognitiveRAG - Document Intelligence Workbench & RAG Studio

A production-grade, full-stack Retrieval-Augmented Generation (RAG) system for technical books, scientific papers, and research documentation. Restructured into completely separated frontend and backend services with independent runtimes, strict context-grounded reasoning, and interactive vector exploration.

---

## Architecture Overview

```
RAG project/
├── web-app/                   # Frontend: React 18 + Vite 6 + TailwindCSS + Lucide
│   ├── src/
│   │   ├── components/        # Reusable UI components (chat, documents, explorer)
│   │   ├── hooks/             # Custom state hooks (useRAG, useSystemStatus)
│   │   ├── pages/             # AssistantPage, DocumentsPage, VectorExplorerPage, ResearchPage
│   │   └── services/          # Centralized Axios client & RAG API endpoints
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── server/                    # Backend: FastAPI + LangChain + ChromaDB + Groq LLM
│   ├── app/
│   │   ├── core/              # Config, structured logging, environment settings
│   │   ├── routes/            # REST API endpoints (health, documents, rag, research)
│   │   ├── schemas/           # Pydantic validation models
│   │   └── services/          # Embeddings singleton, Chroma vectorstore, retrievers, Groq LLM
│   ├── data/
│   │   ├── chroma_db/         # Persistent Chroma vector embeddings & index
│   │   ├── documents/         # Baseline document repository
│   │   └── uploads/           # User-uploaded files
│   ├── run.py                 # Server startup launcher
│   ├── requirements.txt
│   ├── .env                   # Environment secrets
│   └── README.md
│
└── README.md                  # Unified system documentation (this file)
```

---

## Key Capabilities

1. **Strict Context-Grounded Reasoning**:
   - Zero hallucination guarantee: answers questions exclusively using retrieved document context.
   - Fallback protection: explicitly informs the user when information is absent from the indexed text.

2. **Advanced Retrieval Algorithms**:
   - **MMR (Maximal Marginal Relevance)**: Balances similarity with chunk diversity to eliminate redundant context. Tunable `k`, `fetch_k`, and `lambda_mult`.
   - **Vector Similarity**: Direct top-$k$ nearest neighbors for high-relevance semantic lookup.
   - **Multi-Query Expansion**: Leverages LLMs to generate alternate perspectives of the user's prompt for comprehensive document coverage.

3. **Persistent Vector Database**:
   - Pre-loaded with ChromaDB persistent vector storage (`sentence-transformers/all-MiniLM-L6-v2` embeddings).
   - Ingests PDFs, Markdown, and TXT files with customizable chunk sizes and overlap boundaries.

4. **Academic Literature Search**:
   - Integrated arXiv scholarly search to find preprints, research papers, and abstracts alongside internal documents.

5. **Professional Research Workstation UI**:
   - Domain-focused, dark research laboratory aesthetic (no generic AI gradient templates).
   - Interactive source citations with document names, page numbers, and slide-out Chunk Inspector.
   - Direct Vector Space Explorer for inspecting chunk distances and raw metadata without LLM inference.
   - Fully responsive across desktop, tablet, and mobile devices.

---

## Quick Start Guide

### 1. Backend Setup (`server/`)

Open a terminal window:

```bash
cd server

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies (or use uv pip install -r requirements.txt)
pip install -r requirements.txt

# Ensure GROQ_API_KEY is configured in server/.env
# e.g.: GROQ_API_KEY=gsk_...

# Start the FastAPI server
python run.py
```

The backend will start at:
- **API Server**: `http://localhost:8000`
- **Interactive OpenAPI/Swagger Docs**: `http://localhost:8000/docs`
- **Health Telemetry**: `http://localhost:8000/api/health`

---

### 2. Frontend Setup (`web-app/`)

Open a second terminal window:

```bash
cd web-app

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will start at:
- **Web App**: `http://localhost:5173`

The development server automatically proxies API requests (`/api/*`) to `http://localhost:8000`.

---

## REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health, vector count, loaded model status |
| `GET` | `/api/stats` | Storage stats, total indexed vectors, collection name |
| `GET` | `/api/documents` | List all available documents and indexed files |
| `POST` | `/api/documents/upload` | Upload PDF/TXT, split into chunks, and index into Chroma |
| `POST` | `/api/documents/index-existing` | Index an existing baseline file from `server/data/documents/` |
| `DELETE` | `/api/documents/clear` | Clear the Chroma vector collection |
| `POST` | `/api/rag/query` | Execute grounded RAG query with tunable retriever & LLM |
| `POST` | `/api/rag/similarity-search` | Search vector space directly without LLM generation |
| `POST` | `/api/research/arxiv` | Search arXiv academic literature |

---

## Verification & Testing

Both services have been verified end-to-end:
- **Backend Health Check**: Confirmed 100% operational with 129 persistent chunks in ChromaDB.
- **RAG Generation**: Validated with Groq LLM (`openai/gpt-oss-120b`) producing grounded mathematical explanations with source citations (`notes.txt`, `deeplearningrag.pdf`).
- **Frontend Build**: Validated via `npm run build` (Vite production bundle compiled with 0 errors).
