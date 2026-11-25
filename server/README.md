# RAG Document Intelligence - Server

High-performance Python backend powered by **FastAPI**, **LangChain**, **ChromaDB**, and **Groq Cloud LLMs**.

## Features
- **Vector Search Engine**: Persistent Chroma vector database with cosine / L2 distance indexing.
- **Configurable Retrievers**:
  - **MMR (Maximal Marginal Relevance)**: Balances relevance and diversity with tunable `k`, `fetch_k`, and `lambda_mult`.
  - **Similarity Search**: Direct top-k semantic retrieval.
  - **Multi-Query Retriever**: Automatically expands user prompts into multiple search angles via LLM.
- **Document Ingestion**:
  - Direct PDF ingestion with `PyPDFLoader`.
  - Text & Markdown ingestion.
  - Chunking with `RecursiveCharacterTextSplitter`.
- **Academic Research**:
  - Arxiv paper search and metadata extraction.
- **Strict Grounded Generation**: Context-bound prompt engineering guaranteeing no hallucinated answers.
- **Full REST API**: Interactive Swagger UI docs at `/docs`.

## Directory Structure
```
server/
├── app/
│   ├── core/           # Configuration, logging, environment settings
│   ├── models/         # Database models (if applicable)
│   ├── schemas/        # Pydantic request/response schemas
│   ├── services/       # RAG, Chroma, Embeddings, LLM, Ingestion services
│   ├── routes/         # REST API route controllers
│   └── main.py         # FastAPI application entry
├── data/
│   ├── chroma_db/      # Persistent Chroma embeddings storage
│   ├── documents/      # Baseline documents
│   └── uploads/        # User-uploaded files
├── run.py              # Server launcher
├── requirements.txt
├── .env
└── README.md
```

## Getting Started

### 1. Requirements
- Python 3.10+ (Python 3.13 tested)
- Valid `GROQ_API_KEY` (in `.env`)

### 2. Setup Virtual Environment
```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
*(Or using `uv`: `uv pip install -r requirements.txt`)*

### 3. Configure Environment Variables
Copy `.env.example` to `.env` if not already present:
```bash
cp .env.example .env
```
Ensure your `GROQ_API_KEY` is set inside `server/.env`.

### 4. Run Server
```bash
python run.py
```
Or directly with uvicorn:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be live at:
- **API Root**: `http://localhost:8000/`
- **Swagger Documentation**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/health`
