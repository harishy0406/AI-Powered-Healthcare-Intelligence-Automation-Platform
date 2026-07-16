"""RAG service — knowledge base search with demo data."""

import json
import os

# Load clinical knowledge from bundled JSON
_KNOWLEDGE_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "seed", "clinical_knowledge.json")
_KNOWLEDGE: list[dict] = []


def _load_knowledge():
    global _KNOWLEDGE
    if _KNOWLEDGE:
        return
    try:
        with open(_KNOWLEDGE_PATH, "r", encoding="utf-8") as f:
            _KNOWLEDGE = json.load(f)
    except FileNotFoundError:
        _KNOWLEDGE = []


def search_knowledge(query: str, top_k: int = 3) -> list[dict]:
    """Simple keyword-based search against the clinical knowledge base.
    
    In a production system, this would embed the query and perform
    cosine similarity search against a vector store (ChromaDB/Pinecone).
    """
    _load_knowledge()
    if not _KNOWLEDGE:
        return []

    query_lower = query.lower()
    scored: list[tuple[float, dict]] = []

    for entry in _KNOWLEDGE:
        keywords = entry.get("keywords", [])
        content = entry.get("content", "").lower()
        title = entry.get("title", "").lower()

        # Simple keyword match scoring
        score = 0.0
        for kw in keywords:
            if kw.lower() in query_lower:
                score += 2.0
        # Partial content match
        query_words = query_lower.split()
        for word in query_words:
            if len(word) > 3 and word in content:
                score += 0.5
            if len(word) > 3 and word in title:
                score += 1.0

        if score > 0:
            scored.append((score, entry))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [entry for _, entry in scored[:top_k]]


def format_rag_context(results: list[dict]) -> str:
    """Format retrieved chunks into a context string for the LLM."""
    if not results:
        return ""
    
    context_parts = []
    for i, entry in enumerate(results, 1):
        title = entry.get("title", "Unknown Source")
        page = entry.get("page", "")
        content = entry.get("content", "")
        context_parts.append(
            f"[Source {i}: {title}"
            + (f", {page}" if page else "")
            + f"]\n{content}"
        )
    return "\n\n---\n\n".join(context_parts)


def get_source_citations(results: list[dict]) -> list[dict]:
    """Extract source citations from search results."""
    return [
        {"title": r.get("title", "Unknown"), "page": r.get("page")}
        for r in results
    ]
