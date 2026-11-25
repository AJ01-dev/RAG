from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import List
from app.schemas.document import DocumentInfo, DocumentUploadResponse, IngestExistingRequest, IngestExistingResponse
from app.services.document_loader import (
    save_and_index_upload,
    list_all_documents,
    index_existing_file
)
from app.services.vectorstore import clear_vectorstore, get_vector_count
from app.core.logger import logger

router = APIRouter(prefix="/documents", tags=["Documents & Ingestion"])

@router.get("", response_model=List[DocumentInfo])
async def get_documents():
    """
    Returns list of all documents available in server/data/documents and uploads.
    """
    return list_all_documents()

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    chunk_size: int = Form(default=1000),
    chunk_overlap: int = Form(default=200)
):
    """
    Upload a PDF or Text document, extract text, split into chunks, and index into Chroma vector database.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["pdf", "txt", "md"]:
        raise HTTPException(status_code=400, detail="Only PDF and TXT/MD files are supported")

    try:
        chunks_created, total_vectors = await save_and_index_upload(
            upload_file=file,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        return DocumentUploadResponse(
            message=f"Document '{file.filename}' processed and indexed successfully",
            filename=file.filename,
            chunks_created=chunks_created,
            total_vectors=total_vectors
        )
    except Exception as e:
        logger.error(f"Failed to process upload: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Document processing failed: {str(e)}"
        )

@router.post("/index-existing", response_model=IngestExistingResponse)
async def index_existing_document(req: IngestExistingRequest):
    """
    Re-index an existing document stored in server/data/documents/.
    """
    try:
        chunks_indexed, total_vectors = index_existing_file(
            filename=req.filename,
            chunk_size=req.chunk_size,
            chunk_overlap=req.chunk_overlap
        )
        return IngestExistingResponse(
            message=f"Document '{req.filename}' indexed successfully",
            filename=req.filename,
            chunks_indexed=chunks_indexed,
            total_vectors=total_vectors
        )
    except FileNotFoundError as fnf:
        raise HTTPException(status_code=404, detail=str(fnf))
    except Exception as e:
        logger.error(f"Error indexing existing file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/clear")
async def clear_database():
    """
    Clears all vectors from Chroma database.
    """
    success = clear_vectorstore()
    if not success:
        raise HTTPException(status_code=500, detail="Failed to clear vector store")
    return {"message": "Vector store cleared successfully", "total_vectors": get_vector_count()}
