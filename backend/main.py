import os
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import json
from dotenv import load_dotenv

from services.transcription_service import (
    TranscriptionService,
    AudioProcessingError,
    ModelNotReadyError,
    TranscriptionError,
    MAX_FILE_SIZE_BYTES,
)
from services.supabase_service import (
    SupabaseService,
    SupabaseNotConfiguredError,
    AudioUploadError,
    ImageUploadError,
    DatabaseInsertError,
)

# Load environment variables
from pathlib import Path
_backend_env = Path(__file__).resolve().parent / ".env"
if _backend_env.exists():
    load_dotenv(dotenv_path=_backend_env, override=False)
else:
    load_dotenv(override=False)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initiate model loading in background thread during backend startup
    service = TranscriptionService.get_instance()
    asyncio.create_task(asyncio.to_thread(service.initialize_model))
    yield
    # Cleanup on shutdown if needed


app = FastAPI(
    title="Tamil Oral History Preservation API",
    description="Backend API with Hugging Face vasista22/whisper-tamil-small Speech-to-Text (TAMIZH HACK FEST 2026)",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    frontend_url,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Phase 5 Story Metadata Router
from api.story_metadata import router as metadata_router
app.include_router(metadata_router)

# Mount Phase 8 RAG Knowledge Agent Router
from api.rag import router as rag_router
app.include_router(rag_router)


class HealthResponse(BaseModel):
    status: str
    phase: str
    app: str
    version: str
    message: str
    model: str
    model_ready: bool
    model_loading: bool
    device: str


class TranscribeResponse(BaseModel):
    success: bool
    text: str
    duration_seconds: Optional[float] = None
    inference_time_seconds: Optional[float] = None
    language: str = "ta"
    model: str = "vasista22/whisper-tamil-small"
    device: str


class ModelStatusResponse(BaseModel):
    ready: bool
    loading: bool
    model: str
    device: str
    error: Optional[str] = None


@app.get("/", tags=["Root"])
def read_root():
    service = TranscriptionService.get_instance()
    return {
        "app": "Tamil Oral History Digital Preservation API",
        "description": "Preserving Tamil voices, dialects, and cultural narratives with Whisper Speech-to-Text.",
        "status": "online",
        "version": "1.0.0",
        "phase": "Phase 3: Integrate Hugging Face Tamil Speech-to-Text",
        "model": service.model_name,
        "model_ready": service.is_ready,
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    service = TranscriptionService.get_instance()
    return HealthResponse(
        status="ok",
        phase="Phase 3: Integrate Hugging Face Tamil Speech-to-Text",
        app="Tamil Heritage Preservation",
        version="1.0.0",
        message="Backend service is healthy with Whisper Tamil STT module loaded.",
        model=service.model_name,
        model_ready=service.is_ready,
        model_loading=service.is_loading,
        device=service.device,
    )


@app.get("/transcribe/status", response_model=ModelStatusResponse, tags=["Transcription"])
def get_transcription_status():
    service = TranscriptionService.get_instance()
    return ModelStatusResponse(
        ready=service.is_ready,
        loading=service.is_loading,
        model=service.model_name,
        device=service.device,
        error=service.load_error,
    )


@app.post(
    "/transcribe",
    response_model=TranscribeResponse,
    status_code=status.HTTP_200_OK,
    tags=["Transcription"],
)
async def transcribe_audio(
    file: UploadFile = File(..., description="Audio file in WAV, MP3, M4A, OGG, or WebM format (max 25MB)")
):
    """
    Receives an audio file via multipart/form-data, validates file size and format,
    preprocesses the audio into 16kHz mono, and runs automatic speech recognition
    using vasista22/whisper-tamil-small.
    """
    service = TranscriptionService.get_instance()

    # Read binary content into memory
    try:
        content = await file.read()
    except Exception as read_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read audio file upload stream: {read_err}",
        )

    # Size limit validation
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB.",
        )

    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded audio file is empty (0 bytes).",
        )

    # Execute transcription
    try:
        result = await service.transcribe_audio_file(content, file.filename or "recording.wav")
        return TranscribeResponse(**result)

    except ModelNotReadyError as not_ready_err:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(not_ready_err),
        )
    except AudioProcessingError as audio_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(audio_err),
        )
    except TranscriptionError as stt_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(stt_err),
        )
    except Exception as unhandled_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error during transcription: {unhandled_err}",
        )


# ==============================================================================
# PHASE 4: SUPABASE STORY PUBLISHING & ARCHIVAL ENDPOINTS
# ==============================================================================

@app.get("/supabase/status", tags=["Supabase"])
def get_supabase_status():
    """
    Returns connection and configuration status for the Supabase backend integration.
    """
    service = SupabaseService.get_instance()
    return service.get_status()


@app.post("/stories/publish", status_code=status.HTTP_201_CREATED, tags=["Stories"])
async def publish_story_endpoint(
    audio_file: UploadFile = File(..., description="Original audio recording file"),
    title: str = Form(..., description="Story title"),
    contributor_name: str = Form(..., description="Storyteller / narrator name"),
    village_or_town: str = Form(..., description="Village or town"),
    district: str = Form(..., description="District"),
    category: str = Form(..., description="Oral history category"),
    transcript: str = Form(..., description="Final reviewed / edited Tamil transcript"),
    consent_confirmed: bool = Form(..., description="Mandatory community informed consent"),
    original_transcript: Optional[str] = Form(None, description="Raw ASR transcript output"),
    uploader_name: Optional[str] = Form(None, description="Uploader name when different from narrator"),
    description: Optional[str] = Form(None, description="Detailed story description"),
    crop_or_topic: Optional[str] = Form(None, description="Specific crop or topic"),
    tags: Optional[str] = Form(None, description="Comma-separated or JSON list of tags"),
    recording_date: Optional[str] = Form(None, description="Recording date (YYYY-MM-DD)"),
    audio_duration_seconds: Optional[float] = Form(None, description="Duration of audio in seconds"),
    is_demo: bool = Form(False, description="Flag for demonstration oral histories"),
    image_file: Optional[UploadFile] = File(None, description="Optional contributor story image (JPEG, PNG, WebP)"),
):
    """
    Publish Story Endpoint:
    1. Validates required fields (title, contributor, location, category, transcript, consent)
    2. Validates audio file presence and size
    3. Handles optional contributor image upload with validation
    4. Uploads audio & image to Supabase Storage bucket ('oral-history-audio')
    5. Persists story metadata to Supabase 'public.interviews' table
    6. Cleans up orphaned storage objects if database insert fails
    """
    # 1. Field validations
    if not consent_confirmed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Informed oral history archiving consent is mandatory to publish a story.",
        )

    if not title or not title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Story title is required.",
        )

    if not contributor_name or not contributor_name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contributor / storyteller name is required.",
        )

    if not village_or_town or not village_or_town.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Village or town is required.",
        )

    if not district or not district.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="District is required.",
        )

    if not category or not category.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Story category is required.",
        )

    if not transcript or not transcript.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tamil transcript is required and cannot be empty.",
        )

    # 2. Audio reading & validation
    try:
        audio_bytes = await audio_file.read()
    except Exception as read_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read audio file upload stream: {read_err}",
        )

    if len(audio_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Audio file is empty (0 bytes). A valid oral recording is required.",
        )

    if len(audio_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Audio file exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB.",
        )

    # 3. Optional image reading & validation
    image_bytes = None
    image_filename = None
    if image_file and image_file.filename:
        try:
            raw_img = await image_file.read()
            if len(raw_img) > 0:
                if len(raw_img) > 5 * 1024 * 1024:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="Image file exceeds maximum allowed size of 5 MB.",
                    )
                clean_img_name = image_file.filename.replace(" ", "_")
                img_ext = os.path.splitext(clean_img_name)[1].lower()
                if img_ext not in [".jpg", ".jpeg", ".png", ".webp"]:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Unsupported image format '{img_ext}'. Supported formats: JPEG, PNG, WebP.",
                    )
                image_bytes = raw_img
                image_filename = clean_img_name
        except HTTPException:
            raise
        except Exception as img_read_err:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to read image upload stream: {img_read_err}",
            )

    # Parse tags
    parsed_tags: List[str] = []
    if tags:
        try:
            if tags.strip().startswith("[") and tags.strip().endswith("]"):
                parsed_tags = json.loads(tags)
            else:
                parsed_tags = [t.strip() for t in tags.split(",") if t.strip()]
        except Exception:
            parsed_tags = [t.strip() for t in tags.split(",") if t.strip()]

    # 4. Publish via SupabaseService
    supabase_service = SupabaseService.get_instance()
    try:
        result = await supabase_service.publish_story(
            audio_bytes=audio_bytes,
            audio_filename=audio_file.filename or "recording.wav",
            title=title,
            contributor_name=contributor_name,
            village_or_town=village_or_town,
            district=district,
            category=category,
            transcript=transcript,
            consent_confirmed=consent_confirmed,
            original_transcript=original_transcript,
            uploader_name=uploader_name,
            description=description,
            crop_or_topic=crop_or_topic,
            tags=parsed_tags,
            recording_date=recording_date,
            audio_duration_seconds=audio_duration_seconds,
            is_demo=is_demo,
            image_bytes=image_bytes,
            image_filename=image_filename,
        )

        # 5. Trigger safe RAG auto-indexing for the newly published story
        if result.get("success") and result.get("story_id") and transcript.strip():
            try:
                from services.rag_service import RAGService
                rag_service = RAGService.get_instance()
                await rag_service.index_single_story(
                    story_id=result["story_id"],
                    transcript=transcript.strip(),
                    metadata={
                        "story_title": title,
                        "speaker_name": contributor_name,
                        "region": f"{village_or_town}, {district}",
                        "topic": category,
                    }
                )
            except Exception as index_err:
                print(f"[main.py] Non-fatal RAG auto-indexing error for {result.get('story_id')}: {index_err}")

        return result

    except SupabaseNotConfiguredError as config_err:
        status_info = supabase_service.get_status()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "message": str(config_err),
                "configured": False,
                "project_ref": status_info["project_ref"],
                "missing": status_info["missing_credentials"],
                "instruction": (
                    "To persist stories to Supabase, add SUPABASE_URL and SUPABASE_KEY "
                    "(or SUPABASE_SERVICE_ROLE_KEY) to backend/.env."
                ),
            },
        )
    except AudioUploadError as upload_err:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(upload_err),
        )
    except ImageUploadError as img_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(img_err),
        )
    except DatabaseInsertError as db_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(db_err),
        )
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except Exception as general_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during publishing: {general_err}",
        )


@app.get("/stories", tags=["Stories"])
async def list_stories_endpoint(limit: int = 50, category: Optional[str] = None):
    """
    Returns published stories from Supabase (or demo records).
    """
    supabase_service = SupabaseService.get_instance()
    stories = await supabase_service.list_stories(limit=limit, category=category)
    return {"stories": stories, "count": len(stories)}


@app.get("/stories/{story_id}", tags=["Stories"])
async def get_story_endpoint(story_id: str):
    """
    Retrieves full details of an individual oral history story by its ID.
    """
    supabase_service = SupabaseService.get_instance()
    story = await supabase_service.get_story_by_id(story_id)
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Story with id '{story_id}' not found.",
        )
    return {"story": story}


@app.get("/stats", tags=["Dashboard"])
async def get_stats_endpoint():
    """
    Returns aggregated metrics and distributions for the Dashboard:
    - Total preserved stories
    - Community submissions vs demo records
    - Category distribution
    - District distribution
    - Total recorded audio hours
    """
    supabase_service = SupabaseService.get_instance()
    stats_data = await supabase_service.get_dashboard_stats()
    return stats_data


@app.post("/demo/seed", tags=["Demo Data"])
async def seed_demo_data_endpoint():
    """
    Idempotently seeds the 10 realistic Tamil oral history demo records into Supabase.
    - Safe to run multiple times (no duplicate records).
    - Preserves all genuine user contributions.
    """
    supabase_service = SupabaseService.get_instance()
    result = await supabase_service.seed_demo_data()
    return result


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run("main:app", host=host, port=port, reload=False)
