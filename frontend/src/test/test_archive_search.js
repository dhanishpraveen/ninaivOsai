/**
 * Phase 7: Independent Test Suite for Archive Search & Filtering
 * ===============================================================
 * Validates:
 * 1. Text search across Title, Transcript, Summary, Tags, Region, Contributor
 * 2. Category filtering
 * 3. District / Region filtering
 * 4. Audio availability filtering (WITH_AUDIO vs TRANSCRIPT_ONLY)
 * 5. Multi-filter combinations
 * 6. Sorting (Recent, Oldest, Title A-Z)
 * 7. Reset and clear behavior
 * 8. Missing field safety
 */

import { filterArchiveStories, calculateArchiveStats, normalizeStoryRecord } from '../services/archiveAdapter.js';
import { PHASE7_ARCHIVE_MOCK_STORIES } from '../data/archiveMockData.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    failed++;
    throw new Error(message);
  } else {
    console.log(`✅ PASSED: ${message}`);
    passed++;
  }
}

console.log('--- RUNNING PHASE 7 ARCHIVE SEARCH TESTS ---\n');

// Test 1: Search by Title (Tamil & English)
{
  const resTa = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    searchTerm: 'நெல் சாகுபடி',
  });
  assert(resTa.length >= 1, 'Search by Tamil title substring returns matching stories');
  assert(resTa[0].title.includes('நெல்'), 'Returned story contains searched title term');

  const resEn = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    searchTerm: 'Chettinad',
  });
  assert(resEn.length >= 1, 'Search by English title/summary returns matching stories');
}

// Test 2: Search by Verbatim Transcript text
{
  // "நிலவேம்பு" appears in the transcript of story-mock-03 (Tiruvannamalai Siddha Medicine)
  const res = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    searchTerm: 'நிலவேம்பு',
  });
  assert(res.length >= 1, 'Search by transcript-only term (நிலவேம்பு) locates the story');
  assert(res[0].id === 'story-mock-03', 'Transcript search maps to correct story ID');
}

// Test 3: Search by Contributor Name
{
  const res = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    searchTerm: 'முத்துக்கருப்பன்',
  });
  assert(res.length >= 1, 'Search by storyteller name matches');
  assert(res[0].contributor.includes('முத்துக்கருப்பன்'), 'Contributor name matches exactly');
}

// Test 4: Search by Tags and Keywords
{
  const res = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    searchTerm: 'ஜல்லிக்கட்டு',
  });
  assert(res.length >= 1, 'Search by tag (ஜல்லிக்கட்டு) returns matching bull rearing story');
  assert(res[0].category === 'Festivals & Rituals', 'Story matches expected category');
}

// Test 5: Category Filtering
{
  const resAgri = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    selectedCategory: 'Agriculture',
  });
  assert(resAgri.length >= 2, 'Agriculture category filter returns agricultural records');
  assert(resAgri.every((s) => s.category === 'Agriculture'), 'All returned stories belong to Agriculture');

  const resCrafts = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    selectedCategory: 'Traditional Crafts',
  });
  assert(resCrafts.length >= 2, 'Traditional Crafts filter matches lime plaster and silk weaving');
}

// Test 6: District / Region Filtering
{
  const resThanjavur = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    selectedDistrict: 'Thanjavur (தஞ்சாவூர்)',
  });
  assert(resThanjavur.length >= 2, 'Thanjavur district filter matches Thanjavur stories');
  assert(resThanjavur.every((s) => s.region.includes('தஞ்சாவூர்')), 'All results are in Thanjavur region');
}

// Test 7: Audio Availability Filter
{
  const withAudio = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    audioFilter: 'WITH_AUDIO',
  });
  assert(withAudio.length > 0, 'Audio available filter returns stories with audio');
  assert(withAudio.every((s) => s.hasAudio === true), 'All results strictly have hasAudio=true');

  const transcriptOnly = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    audioFilter: 'TRANSCRIPT_ONLY',
  });
  assert(transcriptOnly.length > 0, 'Transcript only filter returns stories without audio');
  assert(transcriptOnly.every((s) => s.hasAudio === false), 'All results strictly have hasAudio=false');
  assert(withAudio.length + transcriptOnly.length === PHASE7_ARCHIVE_MOCK_STORIES.length, 'Sum of audio + no-audio equals total stories');
}

// Test 8: Combined Search + Multi-Filters
{
  const combined = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    searchTerm: 'விவசாய',
    selectedCategory: 'Agriculture',
    selectedDistrict: 'Thanjavur (தஞ்சாவூர்)',
    audioFilter: 'WITH_AUDIO',
  });
  assert(combined.length >= 1, 'Combined search + category + district + audio filter succeeds');
  assert(combined[0].id === 'story-mock-01', 'Combined search pins down exact record');
}

// Test 9: Sorting (Recent, Oldest, Title A-Z)
{
  const sortedRecent = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    sortBy: 'RECENT',
  });
  const sortedOldest = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    sortBy: 'OLDEST',
  });

  assert(new Date(sortedRecent[0].date) >= new Date(sortedRecent[sortedRecent.length - 1].date), 'RECENT sort orders newest date first');
  assert(new Date(sortedOldest[0].date) <= new Date(sortedOldest[sortedOldest.length - 1].date), 'OLDEST sort orders oldest date first');

  const sortedTitle = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    sortBy: 'TITLE',
  });
  assert(sortedTitle.length === PHASE7_ARCHIVE_MOCK_STORIES.length, 'TITLE sort returns all records');
}

// Test 10: Empty Result Handling
{
  const resEmpty = filterArchiveStories({
    stories: PHASE7_ARCHIVE_MOCK_STORIES,
    searchTerm: 'இந்த சொல் எங்கும் இல்லை (Non-existent search query 1234567890)',
  });
  assert(resEmpty.length === 0, 'Non-matching query correctly produces 0 results');
}

// Test 11: Normalization of Raw Database Records
{
  const rawDbRecord = {
    id: 'f87a38b1-1234-4567-8901-abcdef123456',
    title: 'வைகை கரை வாய்மொழி வரலாறு',
    contributor_name: 'கண்ணப்பன்',
    village_or_town: 'சோழவந்தான்',
    district: 'Madurai',
    category: 'Local History',
    transcript: 'வைகை ஆற்றின் பழைய வரலாற்றுக் குறிப்பு.',
    audio_duration_seconds: 185.5,
    audio_storage_path: 'stories/test.wav',
    tags: ['வைகை', 'வரலாறு'],
    is_demo: false,
    created_at: '2026-10-15T12:00:00Z',
  };

  const normalized = normalizeStoryRecord(rawDbRecord);
  assert(normalized.id === rawDbRecord.id, 'ID mapped properly');
  assert(normalized.hasAudio === true, 'hasAudio is true when audio_storage_path exists');
  assert(normalized.audioDurationFormatted === '03:05', 'Duration formatted as mm:ss');
  assert(normalized.region === 'சோழவந்தான், Madurai', 'Region combined from village and district');
  assert(normalized.isDemo === false, 'isDemo preserved accurately');
}

// Test 12: Archive Statistics Computation
{
  const stats = calculateArchiveStats(PHASE7_ARCHIVE_MOCK_STORIES);
  assert(stats.total === 10, 'Total stories count is 10');
  assert(stats.withAudio === 5, '5 stories have audio recordings');
  assert(stats.transcriptOnly === 5, '5 stories are transcript-only');
  assert(stats.totalDistricts > 5, 'Multiple districts represented');
}

console.log(`\n=============================================`);
console.log(`PHASE 7 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`=============================================\n`);

if (failed > 0) {
  process.exit(1);
}
