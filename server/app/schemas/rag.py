from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal

class Citation(BaseModel):
    content: str
    source: Optional[str] = "Unknown"
    page: Optional[int] = None
    metadata: Dict[str, Any] = {}
    score: Optional[float] = None

class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, description="Question to answer from the indexed documents")
    retriever_type: Literal["mmr", "similarity", "multiquery"] = Field(
        default="mmr",
        description="Retrieval algorithm to apply"
    )
    k: int = Field(default=4, ge=1, le=20, description="Number of context chunks to retrieve")
    fetch_k: int = Field(default=10, ge=1, le=50, description="Number of candidate chunks to fetch before MMR filtering")
    lambda_mult: float = Field(default=0.5, ge=0.0, le=1.0, description="MMR diversity parameter (0 = max diversity, 1 = max relevance)")
    model: Optional[str] = Field(default=None, description="Groq LLM model name")

class QueryResponse(BaseModel):
    question: str
    answer: str
    retriever_type: str
    model_used: str
    citations: List[Citation]
    execution_time_ms: float

class SimilaritySearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    k: int = Field(default=4, ge=1, le=20)
    retriever_type: Literal["similarity", "mmr"] = "similarity"

class SimilaritySearchResult(BaseModel):
    query: str
    count: int
    results: List[Citation]
