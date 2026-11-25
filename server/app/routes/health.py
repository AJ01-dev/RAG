from fastapi import APIRouter
from app.core.config import settings
from app.schemas.status import HealthResponse, SystemStats
from app.services.vectorstore import get_vector_count
from app.services.document_loader import list_all_documents

router = APIRouter(tags=["Health & Status"])

@router.get("/health", response_model=HealthResponse)
async def check_health():
    total_vectors = get_vector_count()
    return HealthResponse(
        status="healthy",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        vectorstore_ready=total_vectors > 0,
        total_vectors=total_vectors,
        groq_configured=bool(settings.GROQ_API_KEY),
        active_embedding_model=settings.EMBEDDING_MODEL_NAME,
        active_default_model=settings.DEFAULT_LLM_MODEL
    )

@router.get("/stats", response_model=SystemStats)
async def get_system_stats():
    total = get_vector_count()
    docs = [d.filename for d in list_all_documents()]
    return SystemStats(
        total_chunks=total,
        collection_name="chroma_rag_collection",
        documents=docs
    )
