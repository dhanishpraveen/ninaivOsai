-- ==============================================================================
-- PHASE 8: RAG KNOWLEDGE AGENT - SUPABASE PGVECTOR CONFIGURATION & SEARCH RPC
-- ==============================================================================
-- Project: NinaivOsai, Tamil Oral History Digital Preservation
--
-- This script configures pgvector similarity search on the existing
-- `public.transcript_chunks` table and provides the `match_transcript_chunks` RPC.
--
-- Note: The Python backend includes an in-memory cosine fallback so queries work
-- immediately out-of-the-box even before this RPC is applied in Supabase SQL editor.
-- ==============================================================================

-- 1. Ensure pgvector extension is enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Verify `public.transcript_chunks` has the 384-dimension vector column
-- (Matches intfloat/multilingual-e5-small and sentence-transformers/all-MiniLM-L6-v2)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'transcript_chunks' 
      AND column_name = 'embedding'
  ) THEN
    ALTER TABLE public.transcript_chunks 
    ADD COLUMN embedding vector(384);
  END IF;
END $$;

-- 3. Create HNSW index for sub-millisecond vector similarity search
CREATE INDEX IF NOT EXISTS idx_transcript_chunks_embedding_hnsw
ON public.transcript_chunks
USING hnsw (embedding vector_cosine_ops);

-- 4. Primary deployed Vector similarity search RPC function: match_interview_chunks
-- Deployed in Supabase PostgreSQL, supports topic, region, and demo filtering with cosine similarity.
CREATE OR REPLACE FUNCTION public.match_interview_chunks(
    query_embedding vector(384),
    match_count int DEFAULT 5,
    similarity_threshold float DEFAULT 0.2,
    filter_region text DEFAULT NULL,
    filter_topic text DEFAULT NULL,
    include_demo boolean DEFAULT TRUE
)
RETURNS TABLE (
    chunk_id uuid,
    interview_id uuid,
    story_title text,
    speaker_name text,
    region text,
    topic text,
    content text,
    chunk_index int,
    similarity float,
    is_demo boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        tc.id AS chunk_id,
        tc.interview_id,
        i.story_title,
        i.speaker_name,
        i.region,
        i.topic,
        tc.content,
        tc.chunk_index,
        (1 - (tc.embedding <=> query_embedding))::float AS similarity,
        COALESCE(i.is_demo, FALSE) AS is_demo
    FROM public.transcript_chunks tc
    JOIN public.interviews i ON tc.interview_id = i.id
    WHERE 
        tc.embedding IS NOT NULL
        AND (1 - (tc.embedding <=> query_embedding)) >= similarity_threshold
        AND (filter_topic IS NULL OR i.topic ILIKE '%' || filter_topic || '%')
        AND (filter_region IS NULL OR i.region ILIKE '%' || filter_region || '%')
        AND (include_demo IS TRUE OR COALESCE(i.is_demo, FALSE) IS FALSE)
        AND COALESCE(i.consent_confirmed, TRUE) IS TRUE
    ORDER BY tc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 5. Model-specific RPC function: match_interview_chunks_by_model
CREATE OR REPLACE FUNCTION public.match_interview_chunks_by_model(
    query_embedding vector(384),
    match_count int DEFAULT 5,
    similarity_threshold float DEFAULT 0.2,
    target_model text DEFAULT 'sentence-transformers/all-MiniLM-L6-v2',
    filter_region text DEFAULT NULL,
    filter_topic text DEFAULT NULL,
    include_demo boolean DEFAULT TRUE
)
RETURNS TABLE (
    chunk_id uuid,
    interview_id uuid,
    story_title text,
    speaker_name text,
    region text,
    topic text,
    content text,
    chunk_index int,
    similarity float,
    is_demo boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        tc.id AS chunk_id,
        tc.interview_id,
        i.story_title,
        i.speaker_name,
        i.region,
        i.topic,
        tc.content,
        tc.chunk_index,
        (1 - (tc.embedding <=> query_embedding))::float AS similarity,
        COALESCE(i.is_demo, FALSE) AS is_demo
    FROM public.transcript_chunks tc
    JOIN public.interviews i ON tc.interview_id = i.id
    WHERE 
        tc.embedding IS NOT NULL
        AND (target_model IS NULL OR tc.embedding_model = target_model)
        AND (1 - (tc.embedding <=> query_embedding)) >= similarity_threshold
        AND (filter_topic IS NULL OR i.topic ILIKE '%' || filter_topic || '%')
        AND (filter_region IS NULL OR i.region ILIKE '%' || filter_region || '%')
        AND (include_demo IS TRUE OR COALESCE(i.is_demo, FALSE) IS FALSE)
        AND COALESCE(i.consent_confirmed, TRUE) IS TRUE
    ORDER BY tc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 6. Convenience wrapper: match_transcript_chunks
CREATE OR REPLACE FUNCTION public.match_transcript_chunks(
    query_embedding vector(384),
    match_threshold float DEFAULT 0.3,
    match_count int DEFAULT 5,
    filter_topic text DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    interview_id uuid,
    chunk_index int,
    content text,
    similarity float,
    story_title text,
    speaker_name text,
    region text,
    topic text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.chunk_id AS id,
        m.interview_id,
        m.chunk_index,
        m.content,
        m.similarity,
        m.story_title,
        m.speaker_name,
        m.region,
        m.topic
    FROM public.match_interview_chunks(
        query_embedding,
        match_count,
        match_threshold,
        NULL,
        filter_topic,
        TRUE
    ) m;
END;
$$;
