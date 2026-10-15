/**
 * Centralized API service for communicating with the Tamil Heritage FastAPI backend.
 * Configured for port 8001 with environment variable fallback.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';

export async function checkBackendHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) {
    throw new Error(`Health check failed with status ${res.status}`);
  }
  return res.json();
}

export async function getTranscriptionStatus() {
  const res = await fetch(`${API_BASE_URL}/transcribe/status`);
  if (!res.ok) {
    throw new Error(`Failed to fetch transcription status: HTTP ${res.status}`);
  }
  return res.json();
}

export async function transcribeAudioFile(fileOrBlob, filename = 'recording.wav') {
  const formData = new FormData();
  formData.append('file', fileOrBlob, filename);

  const response = await fetch(`${API_BASE_URL}/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorDetail = `Transcription failed with HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        errorDetail = errorJson.detail;
      }
    } catch {
      // Fallback to HTTP error
    }
    const error = new Error(errorDetail);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function getSupabaseStatus() {
  const res = await fetch(`${API_BASE_URL}/supabase/status`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Supabase status: HTTP ${res.status}`);
  }
  return res.json();
}

export async function publishStory(storyData) {
  const formData = new FormData();
  
  // Append audio file
  if (storyData.audioFile) {
    formData.append('audio_file', storyData.audioFile, storyData.audioFilename || 'recording.wav');
  }

  // Required fields
  formData.append('title', storyData.title || '');
  formData.append('contributor_name', storyData.contributorName || '');
  formData.append('village_or_town', storyData.villageOrTown || '');
  formData.append('district', storyData.district || '');
  formData.append('category', storyData.category || '');
  formData.append('transcript', storyData.transcript || '');
  formData.append('consent_confirmed', String(Boolean(storyData.consentConfirmed)));

  // Optional contributor image file
  if (storyData.imageFile) {
    formData.append('image_file', storyData.imageFile, storyData.imageFilename || storyData.imageFile.name || 'story_image.jpg');
  }

  // Optional fields
  if (storyData.originalTranscript) formData.append('original_transcript', storyData.originalTranscript);
  if (storyData.uploaderName) formData.append('uploader_name', storyData.uploaderName);
  if (storyData.description) formData.append('description', storyData.description);
  if (storyData.cropOrTopic) formData.append('crop_or_topic', storyData.cropOrTopic);
  if (storyData.tags) formData.append('tags', Array.isArray(storyData.tags) ? storyData.tags.join(', ') : storyData.tags);
  if (storyData.recordingDate) formData.append('recording_date', storyData.recordingDate);
  if (storyData.audioDurationSeconds) formData.append('audio_duration_seconds', String(storyData.audioDurationSeconds));
  if (storyData.isDemo !== undefined) formData.append('is_demo', String(Boolean(storyData.isDemo)));

  const response = await fetch(`${API_BASE_URL}/stories/publish`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorDetail = `Publish failed with HTTP ${response.status}`;
    let errorObj = null;
    try {
      const errorJson = await response.json();
      errorObj = errorJson.detail;
      if (typeof errorJson.detail === 'string') {
        errorDetail = errorJson.detail;
      } else if (errorJson.detail?.message) {
        errorDetail = errorJson.detail.message;
      }
    } catch {
      // Fallback
    }
    const error = new Error(errorDetail);
    error.status = response.status;
    error.detail = errorObj;
    throw error;
  }

  return response.json();
}

export async function fetchPublishedStories(limit = 50, category = null) {
  let url = `${API_BASE_URL}/stories?limit=${limit}`;
  if (category && category !== 'ALL') {
    url += `&category=${encodeURIComponent(category)}`;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch stories: HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchStoryById(storyId) {
  const res = await fetch(`${API_BASE_URL}/stories/${encodeURIComponent(storyId)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch story details: HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/stats`);
  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard stats: HTTP ${res.status}`);
  }
  return res.json();
}

export async function seedDemoData() {
  const res = await fetch(`${API_BASE_URL}/demo/seed`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(`Failed to seed demo data: HTTP ${res.status}`);
  }
  return res.json();
}

export async function generateStoryMetadata(payload) {
  const res = await fetch(`${API_BASE_URL}/metadata/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorDetail = `Metadata generation failed with HTTP ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : (errJson.detail.message || JSON.stringify(errJson.detail));
      }
    } catch {
      // Fallback
    }
    const err = new Error(errorDetail);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function fetchMetadataServiceStatus() {
  const res = await fetch(`${API_BASE_URL}/metadata/status`);
  if (!res.ok) {
    throw new Error(`Failed to fetch metadata service status: HTTP ${res.status}`);
  }
  return res.json();
}
