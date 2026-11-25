from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class HealthResponse(BaseModel):
    status: str
    project: str
    version: str
    vectorstore_ready: bool
    total_vectors: int
    groq_configured: bool
    active_embedding_model: str
    active_default_model: str

class SystemStats(BaseModel):
    total_chunks: int
    collection_name: str
    documents: List[str]
