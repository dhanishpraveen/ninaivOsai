"""
Phase 5 Integration Adapter & Standalone Runner
===============================================
This adapter allows Phase 5 AI Story Metadata Generation to run and be tested
100% independently from Phase 4 without modifying existing Phase 4 files or main.py.

Usage during parallel development:
    python backend/phase5_integration_adapter.py --port 8002

Final Phase 4 Integration Instructions:
    To attach Phase 5 to the primary backend after parallel development:
    ```python
    # Add to backend/main.py:
    from api.story_metadata import router as metadata_router
    app.include_router(metadata_router)
    ```
"""

import os
import sys
import argparse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Ensure backend root is on Python sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

load_dotenv()

from api.story_metadata import router as metadata_router
from services.story_metadata_service import StoryMetadataService

# Create isolated FastAPI instance for Phase 5
app = FastAPI(
    title="Tamil Oral History Story Metadata Service (Phase 5 Adapter)",
    description="Standalone adapter for AI-powered Tamil story metadata generation (TAMIZH HACK FEST 2026)",
    version="1.0.0",
)

# CORS configuration
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

# Mount Phase 5 Metadata Router
app.include_router(metadata_router)


@app.get("/health", tags=["Health"])
def health():
    service = StoryMetadataService.get_instance()
    status = service.get_status()
    return {
        "status": "healthy",
        "phase": "Phase 5: AI-Powered Story Metadata Generation",
        "service": "Metadata Generation",
        "configuration": status,
    }


def attach_to_existing_app(main_app: FastAPI):
    """
    Adapter helper function to attach Phase 5 router to an existing FastAPI instance.
    Call this from main.py during final integration:
        from phase5_integration_adapter import attach_to_existing_app
        attach_to_existing_app(app)
    """
    main_app.include_router(metadata_router)
    return main_app


if __name__ == "__main__":
    import uvicorn

    parser = argparse.ArgumentParser(description="Phase 5 Metadata Service Standalone Runner")
    parser.add_argument("--port", type=int, default=8002, help="Port to bind (default: 8002)")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host to bind (default: 127.0.0.1)")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload")
    args = parser.parse_args()

    print(f"Starting Phase 5 Story Metadata Service on http://{args.host}:{args.port}")
    uvicorn.run("phase5_integration_adapter:app", host=args.host, port=args.port, reload=args.reload)
