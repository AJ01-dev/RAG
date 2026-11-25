from fastapi import APIRouter, HTTPException
from app.schemas.research import ArxivSearchRequest, ArxivSearchResponse
from app.services.arxiv_service import search_arxiv_papers
from app.core.logger import logger

router = APIRouter(prefix="/research", tags=["Academic Research"])

@router.post("/arxiv", response_model=ArxivSearchResponse)
async def query_arxiv(req: ArxivSearchRequest):
    """
    Search Arxiv for scholarly papers matching the query string.
    """
    try:
        papers = search_arxiv_papers(query=req.query, max_results=req.max_results)
        return ArxivSearchResponse(
            query=req.query,
            count=len(papers),
            papers=papers
        )
    except Exception as e:
        logger.error(f"Arxiv search failed: {e}")
        raise HTTPException(status_code=500, detail=f"Arxiv search error: {str(e)}")
