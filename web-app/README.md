# CognitiveRAG - Web Application Frontend

A modern, responsive React + Vite application for technical document intelligence, semantic vector search, and grounded LLM synthesis.

## Features
- **Assistant Workbench**:
  - Interactive chat interface with real-time streaming feel.
  - Strict document context grounding (prevents hallucinations).
  - Inline source citations with page numbers and document names.
  - Slide-out Chunk Inspector to inspect exact retrieved text sections.
  - Configurable retrieval strategy: **MMR (Maximal Marginal Relevance)**, **Similarity Search**, and **Multi-Query Expansion**.
  - Tunable `k`, `fetch_k`, and `lambda_mult` parameters.
- **Document Ingestion Hub**:
  - Upload PDF, TXT, and Markdown files.
  - Configurable `RecursiveCharacterTextSplitter` chunk size and overlap sliders.
  - Ingest or re-index baseline documents from storage.
  - Instant vector collection reset with safety confirmation.
- **Vector Space Explorer**:
  - Direct semantic vector search against Chroma embeddings without calling the LLM.
  - Inspect cosine/L2 nearest chunks, raw distance, and metadata.
- **Academic Research (arXiv)**:
  - Search arXiv for scientific papers and view abstracts + direct PDF links.
- **Responsive Layout**:
  - Adaptive desktop dual-pane workbench and mobile bottom navigation dock.

## Tech Stack
- **Framework**: React 18 + Vite 6
- **Styling**: TailwindCSS
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **HTTP Client**: Axios with centralized interceptors & timeouts

## Getting Started

### 1. Requirements
- Node.js 18+ (tested with v25)
- npm 9+

### 2. Installation
```bash
cd web-app
npm install
```

### 3. Configure API Target (Optional)
By default, the Vite dev server proxies `/api` requests to `http://localhost:8000`. If your backend runs elsewhere, create `.env` in `web-app`:
```bash
VITE_API_URL=http://localhost:8000/api
```

### 4. Run Development Server
```bash
npm run dev
```
The app will be accessible at: `http://localhost:5173/`

### 5. Production Build
```bash
npm run build
npm run preview
```
