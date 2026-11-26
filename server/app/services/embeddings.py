import os
os.environ["MALLOC_ARENA_MAX"] = "2"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

import gc
from typing import List, Optional
from langchain_core.embeddings import Embeddings
from app.core.config import settings
from app.core.logger import logger

class ChromaOnnxEmbeddings(Embeddings):
    """
    Ultra-lightweight ONNX Runtime embeddings using sentence-transformers/all-MiniLM-L6-v2.
    Consumes ~35MB RAM compared to PyTorch's 450MB+, making it ideal for 512MB cloud environments (Render Free Tier).
    Produces normalized 384-dimensional vectors 100% compatible with existing Chroma vector databases.
    """
    def __init__(self):
        from chromadb.utils import embedding_functions
        self._ef = embedding_functions.ONNXMiniLM_L6_V2()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self._ef(texts)

    def embed_query(self, text: str) -> List[float]:
        return self._ef([text])[0]

_embedding_instance: Optional[Embeddings] = None

def get_embeddings() -> Embeddings:
    """
    Singleton factory for embeddings.
    Uses ultra-lightweight Chroma ONNX MiniLM runtime (~35MB RAM).
    """
    global _embedding_instance
    if _embedding_instance is None:
        try:
            logger.info("Initializing lightweight ChromaOnnxEmbeddings (ONNX Runtime, ~35MB RAM)...")
            _embedding_instance = ChromaOnnxEmbeddings()
            logger.info("ChromaOnnxEmbeddings initialized successfully.")
        except Exception as e:
            logger.warning(f"ChromaOnnxEmbeddings failed ({e}), falling back to HuggingFaceEmbeddings...")
            from langchain_huggingface import HuggingFaceEmbeddings
            _embedding_instance = HuggingFaceEmbeddings(
                model_name=settings.EMBEDDING_MODEL_NAME,
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True, 'batch_size': 4}
            )
        gc.collect()
    return _embedding_instance
