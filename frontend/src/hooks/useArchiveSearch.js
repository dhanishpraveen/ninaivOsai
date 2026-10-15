/**
 * Phase 7: useArchiveSearch Custom React Hook
 * ============================================
 * State management and filtering controller for the Tamil Oral History Archive.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { loadArchiveStories, filterArchiveStories, calculateArchiveStats } from '../services/archiveAdapter';

export function useArchiveSearch(initialSearchTerm = '') {
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiveSource, setIsLiveSource] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [audioFilter, setAudioFilter] = useState('ALL'); // 'ALL' | 'WITH_AUDIO' | 'TRANSCRIPT_ONLY'
  const [sortBy, setSortBy] = useState('RECENT');        // 'RECENT' | 'OLDEST' | 'TITLE'

  // Reload action
  const reloadStories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadArchiveStories();
      setAllStories(result.stories);
      setIsLiveSource(result.isLiveSource);
      setLiveCount(result.liveCount);
    } catch (err) {
      console.error('Failed to reload archive stories:', err);
      setError(err.message || 'கதைகளை ஏற்றுவதில் பிழை ஏற்பட்டது.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const result = await loadArchiveStories();
        if (isMounted) {
          setAllStories(result.stories);
          setIsLiveSource(result.isLiveSource);
          setLiveCount(result.liveCount);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'கதைகளை ஏற்றுவதில் பிழை ஏற்பட்டது.');
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute filtered & sorted stories
  const filteredStories = useMemo(() => {
    return filterArchiveStories({
      stories: allStories,
      searchTerm,
      selectedCategory,
      selectedDistrict,
      audioFilter,
      sortBy,
    });
  }, [allStories, searchTerm, selectedCategory, selectedDistrict, audioFilter, sortBy]);

  // Compute statistics
  const stats = useMemo(() => {
    return calculateArchiveStats(allStories);
  }, [allStories]);

  // Has user applied any non-default filter?
  const isFilterActive = useMemo(() => {
    return (
      Boolean(searchTerm.trim()) ||
      selectedCategory !== 'ALL' ||
      selectedDistrict !== 'ALL' ||
      audioFilter !== 'ALL' ||
      sortBy !== 'RECENT'
    );
  }, [searchTerm, selectedCategory, selectedDistrict, audioFilter, sortBy]);

  // Reset actions
  const resetAllFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedDistrict('ALL');
    setAudioFilter('ALL');
    setSortBy('RECENT');
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    stories: filteredStories,
    allStories,
    totalCount: allStories.length,
    filteredCount: filteredStories.length,
    loading,
    error,
    isLiveSource,
    liveCount,
    stats,
    // Filter controls
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
  };
}
