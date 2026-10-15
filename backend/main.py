import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables if present
load_dotenv()

app = FastAPI(
    title="Tamil Oral History Preservation API",
    description="Backend API for Tamil Oral History Digital Preservation (TAMIZH HACK FEST 2026)",
    version="1.0.0",
)

# Configure CORS for Vite development frontend
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


class HealthResponse(BaseModel):
    status: str
    phase: str
    app: str
    version: str
    message: str


@app.get("/", tags=["Root"])
def read_root():
    return {
        "app": "Tamil Oral History Digital Preservation API",
        "description": "Preserving Tamil voices, dialects, and cultural narratives.",
        "status": "online",
        "version": "1.0.0",
        "phase": "Phase 1 - Project Foundation",
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    return HealthResponse(
        status="ok",
        phase="Phase 1: Project Foundation and UI Shell",
        app="Tamil Heritage Preservation",
        version="1.0.0",
        message="Backend service is healthy and CORS configured.",
    )


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run("main:app", host=host, port=port, reload=True)
