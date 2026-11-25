from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logger import logger
from app.services.vectorstore import get_vectorstore, get_vector_count
from app.services.embeddings import get_embeddings
from app.routes import health, documents, rag, research

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Pre-warm embeddings and verify Chroma DB
    logger.info("Starting RAG Intelligence API server...")
    try:
        get_embeddings()
        get_vectorstore()
        count = get_vector_count()
        logger.info(f"RAG Server Ready. Chroma Vector Store initialized with {count} chunks.")
    except Exception as e:
        logger.warning(f"Chroma/Embedding deferred initialization notice: {e}")
    yield
    logger.info("Shutting down RAG Intelligence API server...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise REST API for RAG Document Intelligence, Vector Retrieval, and Grounded Groq Generation.",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
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
