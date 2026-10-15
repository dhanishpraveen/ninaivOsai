"""
Story Metadata API Router (Phase 5)
===================================
Provides dedicated endpoints for AI-powered oral history metadata generation.
Routes:
- POST /metadata/generate : Generates title, summary, keywords, category, and tags
- GET /metadata/status    : Returns service configuration and health status
"""

import logging
from fastapi import APIRouter, HTTPException, status
from pydantic import ValidationError

from schemas.story_metadata import (
    StoryMetadataRequest,
    StoryMetadataResponse,
    MetadataServiceStatusResponse,
)
from services.story_metadata_service import (
    StoryMetadataService,
    LLMNotConfiguredError,
    LLMTimeoutError,
    LLMProviderError,
    LLMMalformedResponseError,
    TranscriptValidationError,
)

logger = logging.getLogger("ninaivosai.metadata.api")

# Isolated APIRouter for Story Metadata
router = APIRouter(prefix="/metadata", tags=["Story Metadata (Phase 5)"])


@router.get(
    "/status",
    response_model=MetadataServiceStatusResponse,
    summary="Get Metadata Service Status",
    description="Checks whether an LLM provider or test mode is configured and ready.",
)
def get_metadata_service_status():
    """
    Returns the current configuration and operational status of the Story Metadata AI service.
    """
    service = StoryMetadataService.get_instance()
    info = service.get_status()
    return MetadataServiceStatusResponse(**info)


@router.post(
    "/generate",
    response_model=StoryMetadataResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate AI Story Metadata",
    description="Generates authentic Tamil story title, summary, keywords, category, and tags from a reviewed transcript.",
)
async def generate_story_metadata(request: StoryMetadataRequest):
    """
    Receives a reviewed Tamil oral-history transcript and invokes the configured LLM service.
    
    Returns structured metadata:
    - title: Authentic Tamil title
    - summary: Concise 2-4 sentence Tamil summary
    - keywords: Key thematic Tamil terms
    - category: Canonical oral history category
    - tags: Discovery and search tags
    - english_summary: Optional English translation
    """
    service = StoryMetadataService.get_instance()

    try:
        result = await service.generate_metadata(request)
        return result

    except TranscriptValidationError as val_err:
        logger.warning(f"Transcript validation rejected: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )

    except LLMNotConfiguredError as config_err:
        logger.error(f"Metadata generation requested but LLM is unconfigured: {config_err}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "message": str(config_err),
                "configured": False,
                "provider": service.provider,
                "resolution": (
                    "To generate story metadata with AI, please configure LLM_API_KEY in backend/.env "
                    "(e.g. Gemini, OpenAI, or Groq). For independent testing without API charges, "
                    "set LLM_TEST_MODE=true in backend/.env."
                ),
            },
        )

    except LLMTimeoutError as timeout_err:
        logger.error(f"LLM request timed out: {timeout_err}")
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=f"The AI metadata service timed out. Please try again or test with a shorter transcript: {timeout_err}",
        )

    except LLMMalformedResponseError as malformed_err:
        logger.error(f"Malformed LLM response: {malformed_err}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"The AI provider returned a malformed or non-compliant response: {malformed_err}",
        )

    except LLMProviderError as provider_err:
        logger.error(f"LLM provider error: {provider_err}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"LLM Provider failure: {provider_err}",
        )

    except Exception as exc:
        logger.exception(f"Unexpected error during story metadata generation: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected internal error occurred while generating metadata: {str(exc)}",
        )
