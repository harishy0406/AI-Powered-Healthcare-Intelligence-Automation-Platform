"""Chat router — RAG clinical Q&A endpoint."""

import time
import json

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from models.database import ChatQuery, User, get_db
from models.schemas import ChatRequest, ChatResponse, FeedbackRequest
from services.auth_service import get_current_user
from services.rag_service import search_knowledge, format_rag_context, get_source_citations
from services.llm_service import generate_chat_response

router = APIRouter(prefix="/api", tags=["Chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    start = time.time()

    # 1. Search knowledge base
    results = search_knowledge(request.question)
    context = format_rag_context(results)
    sources = get_source_citations(results)

    # 2. Generate response
    answer = await generate_chat_response(request.question, context)

    latency_ms = int((time.time() - start) * 1000)

    # 3. Store in DB
    query = ChatQuery(
        user_id=user.id,
        question=request.question,
        answer=answer,
        sources=json.dumps([{"title": s["title"], "page": s.get("page")} for s in sources]),
        latency_ms=latency_ms,
    )
    db.add(query)
    await db.commit()
    await db.refresh(query)

    return ChatResponse(
        id=query.id,
        question=request.question,
        answer=answer,
        sources=sources,
        latency_ms=latency_ms,
    )


@router.post("/feedback")
async def submit_feedback(
    request: FeedbackRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from sqlalchemy import select

    result = await db.execute(select(ChatQuery).where(ChatQuery.id == request.query_id))
    query = result.scalar_one_or_none()
    if query:
        query.feedback = request.feedback
        await db.commit()
    return {"status": "ok"}
