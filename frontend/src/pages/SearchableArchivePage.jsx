import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  BookOpen,
  RotateCcw,
  Layers,
  Database,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useArchiveSearch } from '../hooks/useArchiveSearch';
import ArchiveStoryCard from '../components/ArchiveStoryCard';
import StoryDetailView from '../components/StoryDetailView';
import { CANONICAL_CATEGORIES, DISTRICTS } from '../data/archiveMockData';
import { TAMIL_STRINGS } from '../constants/tamilStrings';

/**
 * SearchableArchivePage
 * =====================
 * Complete, responsive Tamil Oral History Archive discovery interface in pure natural Tamil.
 */
export default function SearchableArchivePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const targetStoryId = searchParams.get('id');

  const {
    stories,
    totalCount,
    filteredCount,
    loading,
    error,
    isLiveSource,
    liveCount,
    stats,
    searchTerm,
    setSearchTerm,
    clearSearch,
    selectedCategory,
    setSelectedCategory,
    selectedDistrict,
    setSelectedDistrict,
    audioFilter,
    setAudioFilter,
    sortBy,
    setSortBy,
    isFilterActive,
    resetAllFilters,
    reloadStories,
  } = useArchiveSearch(initialQuery);

  const [activeStoryModal, setActiveStoryModal] = useState(null);

  // Auto-open story modal when deep-linked from RAG citations (e.g. ?id=uuid)
  useEffect(() => {
    if (targetStoryId && stories && stories.length > 0) {
      const match = stories.find((s) => String(s.id) === String(targetStoryId));
      if (match) {
        setActiveStoryModal(match);
      }
    }
  }, [targetStoryId, stories]);

  // Sync search input with URL search param
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setSearchParams({});
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-7xl mx-auto">
      {/* 1. Page Header & Digital Heritage Collection Banner */}
      <div className="bg-forest-900 text-ivory-50 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-forest-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 font-tamil">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-forest-800 text-gold-300 border border-forest-700">
              {TAMIL_STRINGS.archive.headerBadge}
            </span>
            {isLiveSource ? (
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Database className="h-3 w-3" />
                <span>சுபாபேஸ் நேரடித் தரவு ({liveCount} பதிவுகள்)</span>
              </span>
            ) : (
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Layers className="h-3 w-3" />
                <span>மாதிரித் தரவகம்</span>
              </span>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs text-forest-200">
            <span className="bg-forest-800/80 px-3 py-1 rounded-xl border border-forest-700 font-medium">
              {TAMIL_STRINGS.archive.totalStories} <strong className="text-ivory-50 font-sans">{totalCount}</strong>
            </span>
            <span className="bg-forest-800/80 px-3 py-1 rounded-xl border border-forest-700 font-medium hidden sm:inline-block">
              {TAMIL_STRINGS.archive.totalDistricts} <strong className="text-ivory-50 font-sans">{stats.totalDistricts}</strong>
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-tamil text-ivory-50 leading-tight">
            {TAMIL_STRINGS.archive.title}
          </h1>
          <p className="text-xs sm:text-sm text-forest-200 font-tamil mt-2 max-w-3xl leading-relaxed">
            {TAMIL_STRINGS.archive.description}
          </p>
        </div>
      </div>

      {/* 2. Search Bar & Filter Controls Toolbar */}
      <div className="rounded-2xl border border-ivory-300 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative font-tamil">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
          <input
            type="text"
            placeholder={TAMIL_STRINGS.archive.searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-ivory-300 bg-ivory-50/50 pl-11 pr-11 py-3 text-xs sm:text-sm font-tamil text-charcoal-900 placeholder:text-charcoal-400 focus:border-forest-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20 transition-all shadow-inner"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="தேடலை அழி"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-charcoal-400 hover:text-charcoal-700 hover:bg-ivory-200 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Row: Category, District, Audio, Sort By in Pure Tamil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-tamil">
          {/* Category Dropdown */}
          <div>
            <label className="text-[11px] font-bold text-charcoal-700 block mb-1">
              {TAMIL_STRINGS.archive.filterCategory}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-ivory-300 bg-ivory-50/50 px-3 py-2 text-xs font-semibold text-charcoal-800 focus:border-forest-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
            >
              {CANONICAL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.ta}
                </option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div>
            <label className="text-[11px] font-bold text-charcoal-700 block mb-1">
              {TAMIL_STRINGS.archive.filterDistrict}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-xl border border-ivory-300 bg-ivory-50/50 px-3 py-2 text-xs font-semibold text-charcoal-800 focus:border-forest-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
            >
              <option value="ALL">{TAMIL_STRINGS.archive.allDistricts}</option>
              {DISTRICTS.filter((d) => d !== 'ALL').map((dist, idx) => {
                const cleanDist = dist.includes('(') ? dist.split('(')[1].replace(')', '') : dist;
                return (
                  <option key={idx} value={dist}>
                    {cleanDist}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Audio Availability Filter */}
          <div>
            <label className="text-[11px] font-bold text-charcoal-700 block mb-1">
              {TAMIL_STRINGS.archive.filterAudio}
            </label>
            <select
              value={audioFilter}
              onChange={(e) => setAudioFilter(e.target.value)}
              className="w-full rounded-xl border border-ivory-300 bg-ivory-50/50 px-3 py-2 text-xs font-semibold text-charcoal-800 focus:border-forest-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
            >
              <option value="ALL">{TAMIL_STRINGS.archive.allAudio}</option>
              <option value="WITH_AUDIO">{TAMIL_STRINGS.archive.withAudioOnly}</option>
              <option value="TRANSCRIPT_ONLY">{TAMIL_STRINGS.archive.transcriptOnly}</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[11px] font-bold text-charcoal-700 block mb-1">
              {TAMIL_STRINGS.archive.sortBy}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-ivory-300 bg-ivory-50/50 px-3 py-2 text-xs font-semibold text-charcoal-800 focus:border-forest-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
            >
              <option value="RECENT">{TAMIL_STRINGS.archive.sortNewest}</option>
              <option value="OLDEST">{TAMIL_STRINGS.archive.sortOldest}</option>
              <option value="TITLE">{TAMIL_STRINGS.archive.sortTitle}</option>
            </select>
          </div>
        </div>

        {/* Results Count & Reset Actions Bar */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-ivory-200 text-xs gap-2 font-tamil">
          <div className="flex items-center gap-2">
            <span className="text-charcoal-600 font-medium">
              {TAMIL_STRINGS.archive.showingStories}{' '}
              <strong className="text-forest-900 font-bold font-sans">{filteredCount}</strong> / <span className="font-sans">{totalCount}</span>
            </span>

            {isFilterActive && (
              <span className="text-[11px] bg-ivory-200 text-charcoal-700 px-2 py-0.5 rounded-full font-medium">
                {TAMIL_STRINGS.archive.filterActive}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isFilterActive && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{TAMIL_STRINGS.archive.resetFilters}</span>
              </button>
            )}

            <button
              type="button"
              onClick={reloadStories}
              title="கதைகளைப் புதுப்பி"
              className="p-1 rounded-lg text-charcoal-500 hover:text-forest-800 hover:bg-ivory-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 font-tamil">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">தரவுத்தள இணைப்பு எச்சரிக்கை:</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* 3. Stories Grid or Empty State */}
      {loading ? (
        <div className="p-12 rounded-3xl bg-white border border-ivory-300 text-center space-y-3 font-tamil">
          <RefreshCw className="h-8 w-8 text-forest-700 animate-spin mx-auto mb-2" />
          <h3 className="text-sm font-bold text-charcoal-800">
            வாய்மொழி வரலாற்று ஆவணங்களை ஏற்றுகிறது...
          </h3>
          <p className="text-xs text-charcoal-500">
            கதைகள் மற்றும் உரைப்பகுதிகள் தயாராகின்றன.
          </p>
        </div>
      ) : stories.length === 0 ? (
        <div className="rounded-3xl border border-ivory-300 bg-white p-12 text-center space-y-3 shadow-xs font-tamil">
          <div className="h-12 w-12 rounded-2xl bg-ivory-100 text-charcoal-400 flex items-center justify-center mx-auto">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-charcoal-900">
            {TAMIL_STRINGS.archive.noResultsTitle}
          </h3>
          <p className="text-xs text-charcoal-500 max-w-md mx-auto leading-relaxed">
            {TAMIL_STRINGS.archive.noResultsDesc}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-forest-800 text-ivory-50 hover:bg-forest-900 transition-colors"
            >
              {TAMIL_STRINGS.archive.resetFilters}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <ArchiveStoryCard
              key={story.id}
              story={story}
              onSelect={(selected) => setActiveStoryModal(selected)}
            />
          ))}
        </div>
      )}

      {/* 4. Full Story Detail View Modal */}
      {activeStoryModal && (
        <StoryDetailView
          story={activeStoryModal}
          onClose={() => setActiveStoryModal(null)}
        />
      )}
    </div>
  );
}
