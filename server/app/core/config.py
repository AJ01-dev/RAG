from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path

# Base server directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "RAG Document Intelligence"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Environment variables
    GROQ_API_KEY: str = ""
    MISTRAL_API_KEY: str = ""
    
    # Model configuration
    DEFAULT_LLM_MODEL: str = "openai/gpt-oss-120b"
    FALLBACK_LLM_MODELS: List[str] = [
        "llama-3.3-70b-versatile",
        "llama-3.1-70b-versatile",
        "mixtral-8x7b-32768"
    ]
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # Paths
    CHROMA_PERSIST_DIR: str = str(BASE_DIR / "data" / "chroma_db")
    DOCUMENTS_DIR: str = str(BASE_DIR / "data" / "documents")
    UPLOADS_DIR: str = str(BASE_DIR / "data" / "uploads")
    
    # Retrieval defaults
    DEFAULT_CHUNK_SIZE: int = 1000
    DEFAULT_CHUNK_OVERLAP: int = 200
    DEFAULT_RETRIEVAL_K: int = 4
    DEFAULT_FETCH_K: int = 10
    DEFAULT_LAMBDA_MULT: float = 0.5
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]

    class Config:
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()

# Ensure directories exist
Path(settings.CHROMA_PERSIST_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.DOCUMENTS_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.UPLOADS_DIR).mkdir(parents=True, exist_ok=True)
