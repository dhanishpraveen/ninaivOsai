-- ==============================================================================
-- TAMIL ORAL HISTORY DIGITAL PRESERVATION (நினைவோசை / Ninaivosai)
-- Supabase Schema & Storage Configuration for Phase 4
-- Conforms to Supabase Postgres Best Practices
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create the oral history stories table
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    contributor_name TEXT NOT NULL, -- Storyteller / elder
    uploader_name TEXT,             -- When distinct from storyteller
    village_or_town TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Tamil Nadu',
    category TEXT NOT NULL,
    crop_or_topic TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    recording_date DATE,
    original_transcript TEXT,       -- Raw speech recognition output (vasista22/whisper-tamil-small)
    transcript TEXT NOT NULL,       -- Human-reviewed / edited Tamil transcript
    summary TEXT,                   -- Cultural summary (for future Phase 5)
    language TEXT NOT NULL DEFAULT 'ta',
    audio_filename TEXT,
    audio_storage_path TEXT NOT NULL,
    audio_duration_seconds NUMERIC(8, 2),
    audio_size_bytes BIGINT,
    consent_confirmed BOOLEAN NOT NULL DEFAULT false,
    publication_status TEXT NOT NULL DEFAULT 'published' CHECK (publication_status IN ('draft', 'published', 'archived')),
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_stories_publication_status ON public.stories(publication_status);
CREATE INDEX IF NOT EXISTS idx_stories_category ON public.stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_district ON public.stories(district);
CREATE INDEX IF NOT EXISTS idx_stories_created_at_desc ON public.stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_is_demo ON public.stories(is_demo);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- 5. Define RLS Policies
-- Allow public access to view published stories
CREATE POLICY "Public can view published oral history stories"
ON public.stories
FOR SELECT
TO public
USING (publication_status = 'published');

-- Allow service role and server API to insert validated stories
CREATE POLICY "Server API and Authenticated Users can create stories"
ON public.stories
FOR INSERT
TO public
WITH CHECK (consent_confirmed = true AND length(trim(transcript)) > 0);

-- 6. Storage Bucket Configuration for Audio
-- Insert storage bucket if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'oral-history-audio',
    'oral-history-audio',
    true,
    26214400, -- 25MB max size
    ARRAY['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm', 'audio/x-m4a', 'audio/mp4']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 26214400,
    allowed_mime_types = ARRAY['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm', 'audio/x-m4a', 'audio/mp4'];

-- Storage bucket access policies
CREATE POLICY "Public can stream audio files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'oral-history-audio');

CREATE POLICY "Public and Server can upload audio files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'oral-history-audio');
