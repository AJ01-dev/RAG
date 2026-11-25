from typing import List, Optional, Tuple, Literal
import time
from langchain_core.documents import Document
from langchain_classic.retrievers.multi_query import MultiQueryRetriever
from app.services.vectorstore import get_vectorstore
from app.services.llm import get_llm
from app.schemas.rag import Citation
from app.core.logger import logger

def get_retriever(
    retriever_type: Literal["mmr", "similarity", "multiquery"] = "mmr",
    k: int = 4,
    fetch_k: int = 10,
    lambda_mult: float = 0.5,
    llm_model: Optional[str] = None
):
    vectorstore = get_vectorstore()
    
    if retriever_type == "mmr":
        return vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={
                "k": k,
                "fetch_k": fetch_k,
                "lambda_mult": lambda_mult
            }
        )
    elif retriever_type == "similarity":
        return vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": k}
        )
    elif retriever_type == "multiquery":
        base_retriever = vectorstore.as_retriever(search_kwargs={"k": k})
        llm = get_llm(llm_model)
        return MultiQueryRetriever.from_llm(
            retriever=base_retriever,
            llm=llm
        )
    else:
        # Default fallback to MMR
        return vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={"k": k, "fetch_k": fetch_k, "lambda_mult": lambda_mult}
        )

def format_citations(docs: List[Document]) -> List[Citation]:
    citations = []
    for doc in docs:
        meta = doc.metadata or {}
        source = meta.get("source") or meta.get("file_path") or meta.get("filename") or "Document"
        # Simplify source path to basename if it's a file path
        if "/" in str(source):
            source = str(source).split("/")[-1]
            
        page = meta.get("page")
        if page is not None and isinstance(page, int):
            page = page + 1  # 1-indexed for human readability

        citations.append(Citation(
            content=doc.page_content,
            source=source,
            page=page,
            metadata=meta
        ))
    return citations

def execute_rag_retrieval(
    question: str,
    retriever_type: Literal["mmr", "similarity", "multiquery"] = "mmr",
    k: int = 4,
    fetch_k: int = 10,
    lambda_mult: float = 0.5,
    model: Optional[str] = None
) -> Tuple[str, List[Citation]]:
    """
    Executes retrieval and builds joined context string along with structured citations.
    """
    retriever = get_retriever(
        retriever_type=retriever_type,
        k=k,
        fetch_k=fetch_k,
        lambda_mult=lambda_mult,
        llm_model=model
    )
    
    docs = retriever.invoke(question)
    citations = format_citations(docs)
    context = "\n\n".join([doc.page_content for doc in docs])
    
    return context, citations
