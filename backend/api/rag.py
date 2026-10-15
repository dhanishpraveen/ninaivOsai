"""
FastAPI router for Phase 8: RAG-based Tamil Heritage Knowledge Agent.
Mounts:
- POST /knowledge/ask
- POST /knowledge/index
- GET /knowledge/status
"""

import logging
from fastapi import APIRouter, HTTPException, status
from schemas.rag import (
    KnowledgeAskRequest,
    KnowledgeAskResponse,
    IndexStatusResponse,
)
from services.rag_service import RAGService

logger = logging.getLogger("ninaivosai.rag.api")

router = APIRouter(prefix="/knowledge", tags=["Knowledge Agent (Phase 8)"])


@router.post(
    "/ask",
    response_model=KnowledgeAskResponse,
    summary="Ask the Tamil Oral History Knowledge Agent",
    description="Answers natural language questions strictly grounded in verified Tamil oral history transcripts.",
)
async def ask_heritage_agent(request: KnowledgeAskRequest):
    """
    Submits a question to the RAG Knowledge Agent.
    Retrieves the most relevant transcript chunks and synthesizes a grounded Tamil response.
    """
    try:
        service = RAGService.get_instance()
        response = await service.ask_question(request)
        return response
    except Exception as e:
        logger.error(f"[KnowledgeAsk] Error processing question '{request.question}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating answer from oral history archives: {str(e)}",
        )


@router.post(
    "/index",
    summary="Re-index Oral History Transcripts",
    description="Extracts transcripts from public.interviews, chunks them, generates 384-d embeddings, and updates public.transcript_chunks.",
)
async def trigger_indexing():
    """
    Triggers indexing of all eligible oral history transcripts into pgvector.
    Safe and idempotent (replaces old chunks per story without duplication).
    """
    try:
        service = RAGService.get_instance()
        result = await service.index_all_interviews()
        return result
    except Exception as e:
        logger.error(f"[KnowledgeIndex] Indexing failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to index transcripts into vector store: {str(e)}",
        )


@router.get(
    "/status",
    response_model=IndexStatusResponse,
    summary="Get RAG Knowledge Agent status",
    description="Returns vector chunk counts, embedding model status, and readiness.",
)
async def get_knowledge_status():
    """
    Returns current index statistics and operational status.
    """
    try:
        service = RAGService.get_instance()
        status_info = await service.get_index_status()
        return status_info
    except Exception as e:
        logger.error(f"[KnowledgeStatus] Error fetching status: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error checking RAG status: {str(e)}",
        )
