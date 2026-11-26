import os
os.environ["MALLOC_ARENA_MAX"] = "2"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

try:
    import torch
    torch.set_num_threads(1)
except Exception:
    pass

import gc
from langchain_huggingface import HuggingFaceEmbeddings
from app.core.config import settings
from app.core.logger import logger
from typing import Optional

_embedding_instance: Optional[HuggingFaceEmbeddings] = None

def get_embeddings() -> HuggingFaceEmbeddings:
    """
    Singleton factory for HuggingFace embeddings.
    Loads sentence-transformers/all-MiniLM-L6-v2 lazily with strict memory controls for 512MB RAM.
    """
    global _embedding_instance
    if _embedding_instance is None:
        logger.info(f"Initializing HuggingFaceEmbeddings with model: {settings.EMBEDDING_MODEL_NAME}")
        _embedding_instance = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL_NAME,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True, 'batch_size': 4}
        )
        gc.collect()
        logger.info("HuggingFaceEmbeddings loaded successfully.")
    return _embedding_instance
