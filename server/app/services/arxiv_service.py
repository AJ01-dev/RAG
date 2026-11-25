from typing import List
import arxiv
from app.schemas.research import ArxivPaper
from app.core.logger import logger

def search_arxiv_papers(query: str, max_results: int = 5) -> List[ArxivPaper]:
    """
    Searches Arxiv for research papers matching the query string.
    Configured with low retry and delay to prevent blocking.
    """
    logger.info(f"Querying Arxiv for '{query}' (limit: {max_results})")
    try:
        client = arxiv.Client(
            page_size=max_results,
            delay_seconds=0.5,
            num_retries=1
        )
        search = arxiv.Search(
            query=query,
            max_results=max_results,
            sort_by=arxiv.SortCriterion.Relevance
        )
        
        papers: List[ArxivPaper] = []
        for result in client.results(search):
            authors = [a.name for a in result.authors]
            published_str = result.published.strftime("%Y-%m-%d") if result.published else None
            
            papers.append(ArxivPaper(
                title=result.title.replace("\n", " ").strip(),
                authors=authors,
                summary=result.summary.replace("\n", " ").strip(),
                pdf_url=result.pdf_url,
                published=published_str,
                entry_id=result.entry_id
            ))
        return papers
    except Exception as e:
        logger.warning(f"Arxiv query encountered an issue: {e}")
        return []
