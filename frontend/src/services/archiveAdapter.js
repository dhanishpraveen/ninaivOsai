/**
 * Phase 7: Archive Data Adapter & Normalization Service
 * =====================================================
 * Encapsulates data retrieval, normalization, search, filtering, and sorting
 * for the Tamil Oral History Archive.
 * 
 * Safely consumes Phase 6 Supabase records when available, while providing
 * rich Phase 7 mock data fallback during parallel development.
 */

import { PHASE7_ARCHIVE_MOCK_STORIES } from '../data/archiveMockData.js';

const getApiBaseUrl = () => {
  try {
    return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://127.0.0.1:8001';
  } catch {
    return 'http://127.0.0.1:8001';
  }
};

/**
 * Direct fetch helper that does not depend on Vite-only global objects
 */
export async function fetchArchiveFromBackend(limit = 100, category = null) {
  const base = getApiBaseUrl();
  let url = `${base}/stories?limit=${limit}`;
  if (category && category !== 'ALL') {
    url += `&category=${encodeURIComponent(category)}`;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch stories: HTTP ${res.status}`);
  }
  return res.json();
}

const DEMO_IMAGES_MAP = {
  'demo-story-01': '/farmer_ramasamy.jpg',
  'demo-story-02': '/farmer_muthulakshmi.jpg',
  'demo-story-03': '/water_sluice_irrigation.jpg',
  'demo-story-04': '/kongu_handloom_weaving.jpg',
  'demo-story-05': '/heritage_seed_preservation.jpg',
  'demo-story-06': '/tirunelveli_villupaattu.svg',
  'demo-story-07': '/kolli_herbal_medicine.svg',
  'demo-story-08': '/chettinad_terracotta_craft.svg',
  'demo-story-09': '/pongal_festival_ritual.svg',
  'demo-story-10': '/traditional_fermented_food.svg',
};

/**
 * Normalizes a raw Supabase story record into the canonical Archive Story shape.
 */
export function normalizeStoryRecord(raw) {
  if (!raw) return null;

  const durationSec = raw.audio_duration_seconds ? Number(raw.audio_duration_seconds) : null;
  const durationFormatted = durationSec
    ? `${Math.floor(durationSec / 60).toString().padStart(2, '0')}:${Math.floor(durationSec % 60).toString().padStart(2, '0')}`
    : '00:00';

  const hasAudio = Boolean(
    raw.audio_url || (raw.audio_storage_path && raw.audio_storage_path.trim() !== '')
  );

  // Parse tags if array or comma-delimited string
  let tags = [];
  if (Array.isArray(raw.tags)) {
    tags = raw.tags;
  } else if (typeof raw.tags === 'string' && raw.tags.trim()) {
    try {
      if (raw.tags.startsWith('[') && raw.tags.endsWith(']')) {
        tags = JSON.parse(raw.tags);
      } else {
        tags = raw.tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    } catch {
      tags = raw.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
  }

  const district = raw.district || '';
  const village = raw.village_or_town || '';
  const region = village && district ? `${village}, ${district}` : district || village || 'Tamil Nadu';

  const storyIdStr = String(raw.id);
  const isDemoStory = Boolean(raw.is_demo ?? raw.isDemo ?? false);
  const isContributorImage = Boolean(raw.is_contributor_image ?? raw.isContributorImage ?? false);

  let storyImage = raw.image || raw.image_url || null;
  if (!storyImage) {
    if (isDemoStory && DEMO_IMAGES_MAP[storyIdStr]) {
      storyImage = DEMO_IMAGES_MAP[storyIdStr];
    } else if (isDemoStory) {
      const matchingMock = PHASE7_ARCHIVE_MOCK_STORIES.find((m) => m.id === storyIdStr);
      storyImage = matchingMock?.image || null;
    }
  }

  return {
    id: storyIdStr,
    title: raw.title || 'தலைப்பற்ற வாய்மொழிப் பதிவு',
    titleEn: raw.title_en || raw.titleEn || null,
    summary: raw.summary || raw.description || '',
    englishSummary: raw.english_summary || raw.englishSummary || null,
    transcript: raw.transcript || raw.original_transcript || '',
    contributor: raw.contributor_name || raw.contributor || 'அறியப்படாதவர் (Unknown Narrator)',
    contributorRole: raw.contributor_role || raw.contributorRole || 'வாய்மொழி உரையாளர் (Storyteller)',
    uploader: raw.uploader_name || raw.uploader || null,
    villageOrTown: village,
    district: district,
    region: region,
    category: raw.category || 'Other',
    cropOrTopic: raw.crop_or_topic || raw.cropOrTopic || null,
    date: raw.recording_date || (raw.created_at ? raw.created_at.split('T')[0] : '2025-01-01'),
    audioDurationSeconds: durationSec,
    audioDurationFormatted: durationFormatted,
    audioUrl: raw.audio_url || null,
    audioStoragePath: raw.audio_storage_path || null,
    hasAudio: hasAudio,
    tags: tags,
    keywords: Array.isArray(raw.keywords) ? raw.keywords : [],
    image: storyImage,
    isContributorImage: isContributorImage,
    isDemo: isDemoStory,
    source: raw.source || 'supabase',
    publicationStatus: raw.publication_status || 'published',
  };
}

/**
 * Loads stories for the archive.
 * Reuses existing backend/Supabase interface; falls back to Phase 7 mock data if no records exist.
 * 
 * @returns {Promise<{ stories: Array, isLiveSource: boolean, liveCount: number }>}
 */
export async function loadArchiveStories() {
  try {
    const response = await fetchArchiveFromBackend(100);
    const rawStories = response?.stories || [];

    if (rawStories.length > 0) {
      const normalizedLive = rawStories.map(normalizeStoryRecord).filter(Boolean);
      const liveIds = new Set(normalizedLive.map((s) => s.id));
      // Include mock stories for demonstrative richness if needed, ensuring unique IDs
      const nonDuplicateMocks = PHASE7_ARCHIVE_MOCK_STORIES.filter((m) => !liveIds.has(m.id));

      return {
        stories: [...normalizedLive, ...nonDuplicateMocks],
        isLiveSource: true,
        liveCount: normalizedLive.length,
      };
    }
  } catch (err) {
    console.warn('Backend stories fetch failed or unconfigured; using Phase 7 standalone archive data:', err.message);
  }

  // Standalone fallback: Return rich Phase 7 mock dataset
  return {
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    isLiveSource: false,
    liveCount: 0,
  };
}

/**
 * Pure filter function for client-side multi-dimensional search & filtering.
 */
export function filterArchiveStories({
  stories = [],
  searchTerm = '',
  selectedCategory = 'ALL',
  selectedDistrict = 'ALL',
  audioFilter = 'ALL', // 'ALL' | 'WITH_AUDIO' | 'TRANSCRIPT_ONLY'
  sortBy = 'RECENT',   // 'RECENT' | 'OLDEST' | 'TITLE'
}) {
  const cleanQuery = searchTerm.trim().toLowerCase();

  return stories
    .filter((story) => {
      // 1. Text Search across Title, Transcript, Summary, Tags, Region, Contributor
      if (cleanQuery) {
        const titleMatch = story.title?.toLowerCase().includes(cleanQuery);
        const titleEnMatch = story.titleEn?.toLowerCase().includes(cleanQuery);
        const transcriptMatch = story.transcript?.toLowerCase().includes(cleanQuery);
        const summaryMatch = story.summary?.toLowerCase().includes(cleanQuery);
        const englishSummaryMatch = story.englishSummary?.toLowerCase().includes(cleanQuery);
        const contributorMatch = story.contributor?.toLowerCase().includes(cleanQuery);
        const regionMatch = story.region?.toLowerCase().includes(cleanQuery);
        const districtMatch = story.district?.toLowerCase().includes(cleanQuery);
        const tagsMatch = story.tags?.some((t) => t.toLowerCase().includes(cleanQuery));
        const keywordsMatch = story.keywords?.some((k) => k.toLowerCase().includes(cleanQuery));

        const matchesQuery = Boolean(
          titleMatch ||
          titleEnMatch ||
          transcriptMatch ||
          summaryMatch ||
          englishSummaryMatch ||
          contributorMatch ||
          regionMatch ||
          districtMatch ||
          tagsMatch ||
          keywordsMatch
        );

        if (!matchesQuery) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'ALL') {
        const catA = (story.category || '').toLowerCase();
        const catB = selectedCategory.toLowerCase();
        if (catA !== catB && !catA.includes(catB)) {
          return false;
        }
      }

      // 3. District / Region Filter
      if (selectedDistrict !== 'ALL') {
        // District string may look like 'Thanjavur (தஞ்சாவூர்)'
        const pureDistrict = selectedDistrict.split('(')[0].trim().toLowerCase();
        const storyDist = (story.district || '').toLowerCase();
        const storyReg = (story.region || '').toLowerCase();

        if (!storyDist.includes(pureDistrict) && !storyReg.includes(pureDistrict)) {
          return false;
        }
      }

      // 4. Audio Availability Filter
      if (audioFilter === 'WITH_AUDIO' && !story.hasAudio) {
        return false;
      }
      if (audioFilter === 'TRANSCRIPT_ONLY' && story.hasAudio) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'TITLE') {
        return (a.title || '').localeCompare(b.title || '', 'ta');
      }
      if (sortBy === 'OLDEST') {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }
      // Default: RECENT (newest first)
      return new Date(b.date || 0) - new Date(a.date || 0);
    });
}

/**
 * Calculates high-level statistics across stories.
 */
export function calculateArchiveStats(stories = []) {
  const categoryCounts = {};
  const districtCounts = {};
  let totalWithAudio = 0;

  stories.forEach((s) => {
    // Categories
    const cat = s.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    // Districts
    if (s.district) {
      districtCounts[s.district] = (districtCounts[s.district] || 0) + 1;
    }

    // Audio
    if (s.hasAudio) {
      totalWithAudio++;
    }
  });

  return {
    total: stories.length,
    withAudio: totalWithAudio,
    transcriptOnly: stories.length - totalWithAudio,
    categoryCounts,
    districtCounts,
    totalDistricts: Object.keys(districtCounts).length,
  };
}
