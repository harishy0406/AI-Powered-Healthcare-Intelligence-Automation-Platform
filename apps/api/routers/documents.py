"""Documents router — upload and manage clinical documents."""

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.database import Document, User, get_db
from models.schemas import DocumentOut
from services.auth_service import get_current_user

router = APIRouter(prefix="/api/documents", tags=["Documents"])


@router.post("/ingest", response_model=DocumentOut)
async def ingest_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Upload a document for RAG ingestion.
    
    In production, this would:
    1. Extract text from PDF/TXT
    2. Split into ~500-token chunks with overlap
    3. Embed each chunk
    4. Store in vector database (ChromaDB/Pinecone)
    
    For MVP, we store the document metadata and simulate chunk count.
    """
    content = await file.read()
    # Simulate chunk count based on file size (~500 tokens ≈ ~2000 bytes per chunk)
    estimated_chunks = max(1, len(content) // 2000)

    title = file.filename or "Untitled"
    if title.endswith(".pdf"):
        title = title[:-4]
    elif title.endswith(".txt"):
        title = title[:-4]

    doc = Document(
        title=title,
        source_type=file.content_type or "application/octet-stream",
        uploaded_by=user.id,
        chunk_count=estimated_chunks,
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    return doc


@router.get("", response_model=list[DocumentOut])
async def list_documents(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Document).order_by(Document.created_at.desc()))
    return result.scalars().all()
