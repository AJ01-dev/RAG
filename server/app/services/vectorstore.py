import os
from pathlib import Path
from typing import List, Dict, Any, Optional
from langchain_chroma import Chroma
from langchain_core.documents import Document
from app.core.config import settings
from app.core.logger import logger
from app.services.embeddings import get_embeddings

_vectorstore_instance: Optional[Chroma] = None

def get_vectorstore() -> Chroma:
    """
    Returns the persistent Chroma vectorstore instance.
    """
    global _vectorstore_instance
    if _vectorstore_instance is None:
        embeddings = get_embeddings()
        persist_dir = settings.CHROMA_PERSIST_DIR
        
        # Check if directory exists; if not, check fallback
        if not os.path.exists(persist_dir):
            parent_fallback = str(Path(persist_dir).parent.parent.parent / "chroma_db")
            if os.path.exists(parent_fallback):
                persist_dir = parent_fallback
                logger.info(f"Using root Chroma database at: {persist_dir}")
        
        logger.info(f"Connecting to Chroma vectorstore at: {persist_dir}")
        _vectorstore_instance = Chroma(
            persist_directory=persist_dir,
            embedding_function=embeddings
        )
    return _vectorstore_instance

def get_vector_count() -> int:
    """
    Returns the total number of document embeddings stored.
    """
    try:
        vs = get_vectorstore()
        return vs._collection.count()
    except Exception as e:
        logger.warning(f"Could not get vector count: {e}")
        return 0

def add_documents_to_vectorstore(documents: List[Document]) -> int:
    """
    Adds a list of LangChain documents to Chroma and returns the count added.
    """
    vs = get_vectorstore()
    vs.add_documents(documents)
    return len(documents)

def clear_vectorstore() -> bool:
    """
    Clears all vectors from Chroma collection.
    """
    global _vectorstore_instance
    try:
        vs = get_vectorstore()
        # Delete collection
        vs.delete_collection()
        _vectorstore_instance = None
        # Reinitialize
        get_vectorstore()
        return True
    except Exception as e:
        logger.error(f"Error clearing vectorstore: {e}")
        return False
