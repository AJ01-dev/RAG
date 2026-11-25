from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class DocumentInfo(BaseModel):
    filename: str
    file_type: str
    size_bytes: int
    is_indexed: bool
    path: str

class DocumentUploadResponse(BaseModel):
    message: str
    filename: str
    chunks_created: int
    total_vectors: int

class IngestExistingRequest(BaseModel):
    filename: str
    chunk_size: int = Field(default=1000, ge=100, le=5000)
    chunk_overlap: int = Field(default=200, ge=0, le=1000)

class IngestExistingResponse(BaseModel):
    message: str
    filename: str
    chunks_indexed: int
    total_vectors: int
