from fastapi import APIRouter, HTTPException, status
import time
from app.schemas.rag import (
    QueryRequest,
    QueryResponse,
    SimilaritySearchRequest,
    SimilaritySearchResult
)
from app.services.retrieval import execute_rag_retrieval, get_retriever, format_citations
from app.services.llm import generate_rag_answer
from app.core.logger import logger
from app.core.config import settings

router = APIRouter(prefix="/rag", tags=["RAG & Retrieval"])

@router.post("/query", response_model=QueryResponse)
async def query_rag(req: QueryRequest):
    """
    Core RAG endpoint:
    1. Retrieves relevant document context from Chroma vectorstore (MMR, Similarity, or MultiQuery).
    2. Builds grounded context.
    3. Invokes Groq LLM with strict context-only prompting.
    4. Returns answer and structured source citations.
    """
    start_time = time.time()
    
    try:
        # Retrieve context & citations
        context, citations = execute_rag_retrieval(
            question=req.question,
            retriever_type=req.retriever_type,
            k=req.k,
            fetch_k=req.fetch_k,
            lambda_mult=req.lambda_mult,
            model=req.model
        )
        
        # If no documents were retrieved at all
        if not context.strip():
            execution_time = (time.time() - start_time) * 1000
            return QueryResponse(
                question=req.question,
                answer="I could not find the answer in the document (no relevant context retrieved).",
                retriever_type=req.retriever_type,
                model_used=req.model or settings.DEFAULT_LLM_MODEL,
                citations=[],
                execution_time_ms=round(execution_time, 2)
            )

        # Generate answer with Groq LLM
        answer, model_used = generate_rag_answer(
            context=context,
            question=req.question,
            model=req.model
        )
        
        execution_time = (time.time() - start_time) * 1000
        return QueryResponse(
            question=req.question,
            answer=answer,
            retriever_type=req.retriever_type,
            model_used=model_used,
            citations=citations,
            execution_time_ms=round(execution_time, 2)
        )
    except Exception as e:
        logger.error(f"Error in RAG query: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG query execution failed: {str(e)}"
        )

@router.post("/similarity-search", response_model=SimilaritySearchResult)
async def similarity_search(req: SimilaritySearchRequest):
    """
    Directly query Chroma vectorstore without LLM generation to inspect retrieved chunks and metadata.
    """
    try:
        retriever = get_retriever(
            retriever_type=req.retriever_type,
            k=req.k
        )
        docs = retriever.invoke(req.query)
        citations = format_citations(docs)
        return SimilaritySearchResult(
            query=req.query,
            count=len(citations),
            results=citations
        )
    except Exception as e:
        logger.error(f"Error in similarity search: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Vector search failed: {str(e)}"
        )
