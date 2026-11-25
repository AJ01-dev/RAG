from langchain_huggingface import HuggingFaceEmbeddings
from app.core.config import settings
from app.core.logger import logger
from typing import Optional

_embedding_instance: Optional[HuggingFaceEmbeddings] = None

def get_embeddings() -> HuggingFaceEmbeddings:
    """
    Singleton factory for HuggingFace embeddings.
    Loads sentence-transformers/all-MiniLM-L6-v2 once in memory.
    """
    global _embedding_instance
    if _embedding_instance is None:
        logger.info(f"Initializing HuggingFaceEmbeddings with model: {settings.EMBEDDING_MODEL_NAME}")
        _embedding_instance = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL_NAME
        )
        logger.info("HuggingFaceEmbeddings loaded successfully.")
    return _embedding_instance
