import os
# Strict memory caps for 512MB RAM cloud environments (Render Free Tier)
os.environ["MALLOC_ARENA_MAX"] = "2"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

import sys
# Linux cloud deployment compatibility for ChromaDB (Render, Railway, etc.)
try:
    __import__('pysqlite3')
    sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
except ImportError:
    pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logger import logger
from app.routes import health, documents, rag, research

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Port binds immediately so Render detects open port in <1 second!
    logger.info("RAG Intelligence API server ready. Port bound immediately.")
    yield
    logger.info("Shutting down RAG Intelligence API server...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise REST API for RAG Document Intelligence, Vector Retrieval, and Grounded Groq Generation.",
    lifespan=lifespan
)

# CORS configuration: dynamically allow local dev and all Vercel domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(health.router, prefix=settings.API_PREFIX)
app.include_router(documents.router, prefix=settings.API_PREFIX)
app.include_router(rag.router, prefix=settings.API_PREFIX)
app.include_router(research.router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_status": f"{settings.API_PREFIX}/health"
    }
