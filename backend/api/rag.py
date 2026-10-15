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


SUGGESTED_HERITAGE_QUESTIONS = [
    {
        "id": "q-agri-1",
        "question": "காவிரி பாசனப் பகுதியில் ஆனிப் பட்டத்து உழவு மற்றும் பாரம்பரிய நெல் சாகுபடி முறை என்ன?",
        "category": "வேளாண்மை மரபு",
        "topic": "Agriculture",
        "district": "தஞ்சாவூர்",
        "speaker": "விவசாயி ராமசாமி",
    },
    {
        "id": "q-cow-2",
        "question": "நாட்டு மாட்டு சாணம் மற்றும் கோமியம் கொண்டு பாரம்பரிய பஞ்சகவ்யா இயற்கை உரம் தயாரிக்கும் முறை என்ன?",
        "category": "இயற்கை உரம்",
        "topic": "Agriculture",
        "district": "மதுரை",
        "speaker": "மீனாட்சி அம்மாள்",
    },
    {
        "id": "q-water-3",
        "question": "திருவண்ணாமலை கிராமங்களில் ஏரி கண்மாய் மதகு பராமரிப்பும் குடிமராமத்து நீர் பங்கீடும் எப்படி நடந்தது?",
        "category": "நீர் மேலாண்மை",
        "topic": "Water Conservation",
        "district": "திருவண்ணாமலை",
        "speaker": "சண்முகம்",
    },
    {
        "id": "q-herb-4",
        "question": "கொல்லிமலை பாரம்பரிய மூலிகை மருத்துவம் மற்றும் நாடி பார்த்தல் முறைகள் என்ன?",
        "category": "மூலிகை மருத்துவம்",
        "topic": "Traditional Medicine & Practices",
        "district": "நாமக்கல்",
        "speaker": "வைத்தியர் முத்துசாமி",
    },
    {
        "id": "q-folk-5",
        "question": "தாமிரபரணி ஆற்றங்கரை கிராமங்களில் வில்லுப்பாட்டுக் கலைஞர்கள் வரலாற்றை எப்படி பாடினர்?",
        "category": "நாட்டுப்புறக் கலை",
        "topic": "Folk Songs & Storytelling",
        "district": "திருநெல்வேலி",
        "speaker": "பேச்சிமுத்துப் புலவர்",
    },
    {
        "id": "q-craft-6",
        "question": "பவானி மற்றும் கொங்கு நாட்டில் கைத்தறி நெசவு மற்றும் மரபுவழி இயற்கை சாயமிடும் முறை என்ன?",
        "category": "கைவினை மரபு",
        "topic": "Traditional Crafts",
        "district": "ஈரோடு",
        "speaker": "பழனிசாமி",
    },
]


@router.get(
    "/suggested-questions",
    summary="Get Predefined Suggested Questions for the Tamil Heritage Knowledge Agent",
    description="Returns grounded Tamil questions reflecting the actual oral histories in the repository.",
)
async def get_suggested_questions():
    """
    Returns curated, grounded Tamil oral-history questions supported by the indexed archive.
    Allows dynamic updates without frontend redeployment.
    """
    return {
        "title": "என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?",
        "questions": SUGGESTED_HERITAGE_QUESTIONS,
        "count": len(SUGGESTED_HERITAGE_QUESTIONS),
    }


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

