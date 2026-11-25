import os
import shutil
from pathlib import Path
from typing import List, Dict, Any, Tuple
from fastapi import UploadFile
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

from app.core.config import settings
from app.core.logger import logger
from app.services.vectorstore import add_documents_to_vectorstore, get_vector_count
from app.schemas.document import DocumentInfo

def get_splitter(chunk_size: int = 1000, chunk_overlap: int = 200) -> RecursiveCharacterTextSplitter:
    return RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""]
    )

def load_and_split_document(
    file_path: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 200
) -> List[Document]:
    """
    Loads PDF or text file, splits it into chunks and injects filename metadata.
    """
    path = Path(file_path)
    filename = path.name
    ext = path.suffix.lower()
    
    if ext == ".pdf":
        loader = PyPDFLoader(str(path))
        docs = loader.load()
    elif ext in [".txt", ".md", ".csv"]:
        loader = TextLoader(str(path), encoding="utf-8")
        docs = loader.load()
    else:
        raise ValueError(f"Unsupported file extension: {ext}")
        
    for doc in docs:
        doc.metadata["filename"] = filename
        doc.metadata["source"] = filename

    splitter = get_splitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    chunks = splitter.split_documents(docs)
    logger.info(f"Loaded '{filename}': {len(docs)} pages/sections split into {len(chunks)} chunks.")
    return chunks

async def save_and_index_upload(
    upload_file: UploadFile,
    chunk_size: int = 1000,
    chunk_overlap: int = 200
) -> Tuple[int, int]:
    """
    Saves an uploaded file to uploads directory, splits and indexes into Chroma.
    Returns (chunks_created, total_vectors).
    """
    dest_path = Path(settings.UPLOADS_DIR) / upload_file.filename
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
        
    chunks = load_and_split_document(
        str(dest_path),
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    
    chunks_created = add_documents_to_vectorstore(chunks)
    total_vectors = get_vector_count()
    return chunks_created, total_vectors

def index_existing_file(
    filename: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 200
) -> Tuple[int, int]:
    """
    Indexes an existing document from data/documents/.
    """
    file_path = Path(settings.DOCUMENTS_DIR) / filename
    if not file_path.exists():
        raise FileNotFoundError(f"Document '{filename}' not found in {settings.DOCUMENTS_DIR}")
        
    chunks = load_and_split_document(
        str(file_path),
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    chunks_indexed = add_documents_to_vectorstore(chunks)
    total_vectors = get_vector_count()
    return chunks_indexed, total_vectors

def list_all_documents() -> List[DocumentInfo]:
    """
    Lists all documents present in data/documents and data/uploads.
    """
    docs_info = []
    seen = set()
    
    for search_dir in [Path(settings.DOCUMENTS_DIR), Path(settings.UPLOADS_DIR)]:
        if not search_dir.exists():
            continue
        for p in search_dir.glob("*"):
            if p.is_file() and p.name not in seen and not p.name.startswith("."):
                ext = p.suffix.lower()
                if ext in [".pdf", ".txt", ".md", ".json"]:
                    seen.add(p.name)
                    docs_info.append(DocumentInfo(
                        filename=p.name,
                        file_type=ext.replace(".", "").upper(),
                        size_bytes=p.stat().st_size,
                        is_indexed=True,
                        path=str(p)
                    ))
    return docs_info
