"""
Pydantic schemas for Phase 8: RAG-based Tamil Heritage Knowledge Agent.
Validates question requests, retrieved evidence sources, and grounded Tamil answers.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class KnowledgeAskRequest(BaseModel):
    """
    User query request for the Tamil Heritage Knowledge Agent.
    """
    question: str = Field(
        ...,
        description="Natural language question in Tamil or English",
        min_length=2,
        max_length=1000,
    )
    topic: Optional[str] = Field(
        default=None,
        description="Optional filter by canonical category/topic (e.g., Agriculture, Water Conservation)",
    )
    region: Optional[str] = Field(
        default=None,
        description="Optional filter by region or district (e.g., Thanjavur, Madurai)",
    )
    filters: Optional[dict] = Field(
        default=None,
        description="Optional nested filters object {'region': ..., 'category': ...} for API compatibility",
    )
    top_k: int = Field(
        default=4,
        ge=1,
        le=10,
        description="Maximum number of relevant evidence chunks to retrieve",
    )
    language: str = Field(
        default="ta",
        description="Preferred response language ISO code ('ta' for Tamil, 'en' for English)",
    )

    @field_validator("question")
    @classmethod
    def validate_question(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Question cannot be empty.")
        return trimmed


class SourceReference(BaseModel):
    """
    Grounded source story and excerpt reference used for the generated answer.
    """
    story_id: str = Field(..., description="UUID of the interview / oral-history story")
    story_title: str = Field(..., description="Title of the source oral history story")
    speaker_name: str = Field(..., description="Name of the elder, artisan, or storyteller")
    region: Optional[str] = Field(None, description="Region or district of the recording")
    topic: Optional[str] = Field(None, description="Category or topic of the story")
    chunk_index: int = Field(..., description="Index of the chunk in the story transcript")
    relevance_score: float = Field(..., description="Similarity relevance score (0.0 to 1.0)")
    excerpt: str = Field(..., description="Exact supporting transcript text chunk")
    archive_url: str = Field(..., description="Direct frontend route to view this story")


class KnowledgeAskResponse(BaseModel):
    """
    Response returned by POST /knowledge/ask.
    """
    question: str = Field(..., description="Original user question")
    answer: str = Field(..., description="Answer synthesized strictly from verified evidence")
    has_evidence: bool = Field(..., description="True if sufficient evidence was found in transcripts")
    insufficient_evidence: bool = Field(
        default=False,
        description="True if evidence is insufficient (Phase 8 contract flag)",
    )
    evidence_status: str = Field(
        ...,
        description="Status indicator: 'sufficient', 'insufficient', or 'no_match'",
    )
    sources: List[SourceReference] = Field(
        default_factory=list,
        description="List of verified oral-history sources with verbatim excerpts",
    )
    excerpts: List[str] = Field(
        default_factory=list,
        description="Verbatim text snippets supporting the answer",
    )
    model: str = Field(..., description="LLM or synthesis engine used for answer generation")
    embedding_model: str = Field(..., description="Embedding model used for vector retrieval")
    insufficient_reason: Optional[str] = Field(
        default=None,
        description="Explanation when evidence is insufficient",
    )


class IndexStatusResponse(BaseModel):
    """
    Status of the RAG vector index and database chunks.
    """
    indexed_stories: int = Field(..., description="Number of stories indexed in vector database")
    total_chunks: int = Field(..., description="Total transcript chunks stored in public.transcript_chunks")
    embedding_model: str = Field(..., description="Active vector embedding model")
    vector_dimension: int = Field(default=384, description="Vector dimension (384)")
    is_ready: bool = Field(..., description="Whether the knowledge agent is ready for queries")
    message: str = Field(..., description="Status summary message")
