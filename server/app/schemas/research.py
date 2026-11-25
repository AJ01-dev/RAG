from pydantic import BaseModel, Field
from typing import Optional, List

class ArxivPaper(BaseModel):
    title: str
    authors: List[str]
    summary: str
    pdf_url: Optional[str] = None
    published: Optional[str] = None
    entry_id: Optional[str] = None

class ArxivSearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    max_results: int = Field(default=5, ge=1, le=20)

class ArxivSearchResponse(BaseModel):
    query: str
    count: int
    papers: List[ArxivPaper]
