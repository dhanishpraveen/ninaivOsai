import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  UploadCloud,
  Sparkles,
  Compass,
  Search,
  ArrowRight,
  Database,
} from 'lucide-react';
import StoryCard from '../components/StoryCard';
import { SAMPLE_STORIES, STATS_DATA } from '../data/sampleData';
import { fetchPublishedStories, fetchDashboardStats } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TAMIL_STRINGS } from '../constants/tamilStrings';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { userName } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [storiesList, setStoriesList] = useState(SAMPLE_STORIES);
  const [dashboardStats, setDashboardStats] = useState({
    preservedStories: STATS_DATA.preservedStories,
    recordedHours: STATS_DATA.recordedHours,
    regionsRepresented: STATS_DATA.regionsRepresented,
    communitiesDocumented: STATS_DATA.communitiesDocumented,
    categoriesCount: 7,
    categoryBreakdown: {},
    districtBreakdown: {},
    isLiveSupabase: false,
    backendMode: 'loading',
  });

  React.useEffect(() => {
    async function loadData() {
      // 1. Load Live Stats
      try {
        const stats = await fetchDashboardStats();
        if (stats) {
          setDashboardStats({
            preservedStories: stats.total_stories ?? STATS_DATA.preservedStories,
            recordedHours: stats.audio_hours ?? STATS_DATA.recordedHours,
            regionsRepresented: stats.districts_count ?? STATS_DATA.regionsRepresented,
            communitiesDocumented: stats.total_stories ?? STATS_DATA.communitiesDocumented,
            categoriesCount: stats.categories_count ?? 7,
            categoryBreakdown: stats.category_breakdown || {},
            districtBreakdown: stats.district_breakdown || {},
            isLiveSupabase: Boolean(stats.is_live_supabase),
            backendMode: stats.backend_mode || 'demo_offline',
          });
        }
      } catch (err) {
        console.warn('Dashboard stats fetch failed (using local demo stats):', err);
      }

      // 2. Load Stories
      try {
        const data = await fetchPublishedStories(6);
        if (data?.stories && data.stories.length > 0) {
          const liveMapped = data.stories.map((s) => ({
            id: s.id,
            isDemo: Boolean(s.is_demo),
            title: s.title,
            titleTa: s.title,
            contributor: s.contributor_name,
            contributorRole: s.uploader_name ? `சொல்லாளர் (பதிவேற்றியவர்: ${s.uploader_name})` : 'சொல்லாளர்',
            region: `${s.village_or_town}, ${s.district}`,
            category: s.category,
            crop: s.crop_or_topic || '',
            duration: s.audio_duration_seconds
              ? `${Math.floor(s.audio_duration_seconds / 60)}:${Math.floor(s.audio_duration_seconds % 60).toString().padStart(2, '0')}`
              : '00:00',
            date: s.recording_date || new Date(s.created_at).toLocaleDateString(),
            image: '/farmer_ramasamy.jpg',
            summary: s.description || s.transcript,
            tags: s.tags || [],
            status: 'preserved',
            excerpt: s.transcript,
          }));

          setStoriesList((prev) => {
            const liveIds = new Set(liveMapped.map((m) => m.id));
            const samples = prev.filter((p) => !liveIds.has(p.id));
            return [...liveMapped, ...samples];
          });
        }
      } catch (err) {
        console.warn('Dashboard live stories fetch failed:', err);
      }
    }
    loadData();
  }, []);

  const recentStories = storiesList.slice(0, 3);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/archive?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/archive');
    }
  };

  return (
    <div className="space-y-8 pb-8 max-w-7xl mx-auto font-sans">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E5DDCF]/60">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141A17] tracking-tight flex items-center gap-2 font-tamil">
            <span>வணக்கம், {userName}!</span>
            <span className="text-2xl" role="img" aria-label="Waving hand">👋</span>
          </h1>
          <p className="text-sm text-[#525A56] font-tamil">
            {TAMIL_STRINGS.dashboard.welcomeSubtitle}
          </p>
        </div>

        {/* Search input in top header right */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80 shrink-0 font-tamil">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E9792]" />
          <input
            type="text"
            placeholder={TAMIL_STRINGS.dashboard.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#E5DDCF] bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#141A17] placeholder:text-[#8E9792] focus:border-[#073D2B] focus:outline-none focus:ring-1 focus:ring-[#073D2B] shadow-2xs transition-colors"
          />
        </form>
      </div>

      {/* 4 Quick Action Cards in Pure Tamil */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch font-tamil">
          {/* Card 1: Record Audio */}
          <Link
            to="/preserve?mode=record"
            className="group rounded-2xl border border-[#E5DDCF] bg-white p-5 shadow-xs hover:shadow-md hover:border-[#073D2B]/50 transition-all duration-200 flex flex-col justify-between cursor-pointer min-h-[155px]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F3EE] text-[#073D2B] mb-4 group-hover:scale-105 transition-transform">
              <Mic className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#141A17] text-base mb-1 group-hover:text-[#073D2B] transition-colors">
                {TAMIL_STRINGS.dashboard.recordAudioTitle}
              </h3>
              <p className="text-xs text-[#6B7570] flex items-center justify-between">
                <span>{TAMIL_STRINGS.dashboard.recordAudioDesc}</span>
                <span className="text-[#073D2B] font-bold text-sm group-hover:translate-x-1 transition-transform">→</span>
              </p>
            </div>
          </Link>

          {/* Card 2: Upload Audio */}
          <Link
            to="/preserve?mode=upload"
            className="group rounded-2xl border border-[#E5DDCF] bg-white p-5 shadow-xs hover:shadow-md hover:border-[#6941C6]/50 transition-all duration-200 flex flex-col justify-between cursor-pointer min-h-[155px]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1EDF9] text-[#6941C6] mb-4 group-hover:scale-105 transition-transform">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#141A17] text-base mb-1 group-hover:text-[#6941C6] transition-colors">
                {TAMIL_STRINGS.dashboard.uploadAudioTitle}
              </h3>
              <p className="text-xs text-[#6B7570] flex items-center justify-between">
                <span>{TAMIL_STRINGS.dashboard.uploadAudioDesc}</span>
                <span className="text-[#6941C6] font-bold text-sm group-hover:translate-x-1 transition-transform">→</span>
              </p>
            </div>
          </Link>

          {/* Card 3: Ask AI Agent */}
          <Link
            to="/ask-ai"
            className="group rounded-2xl border border-[#E5DDCF] bg-white p-5 shadow-xs hover:shadow-md hover:border-[#B5791E]/50 transition-all duration-200 flex flex-col justify-between cursor-pointer min-h-[155px]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FBF3E8] text-[#B5791E] mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#141A17] text-base mb-1 group-hover:text-[#B5791E] transition-colors">
                {TAMIL_STRINGS.dashboard.askAiTitle}
              </h3>
              <p className="text-xs text-[#6B7570] flex items-center justify-between">
                <span>{TAMIL_STRINGS.dashboard.askAiDesc}</span>
                <span className="text-[#B5791E] font-bold text-sm group-hover:translate-x-1 transition-transform">→</span>
              </p>
            </div>
          </Link>

          {/* Card 4: Explore Stories */}
          <Link
            to="/archive"
            className="group rounded-2xl border border-[#E5DDCF] bg-white p-5 shadow-xs hover:shadow-md hover:border-[#2E689E]/50 transition-all duration-200 flex flex-col justify-between cursor-pointer min-h-[155px]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EBF3F8] text-[#2E689E] mb-4 group-hover:scale-105 transition-transform">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#141A17] text-base mb-1 group-hover:text-[#2E689E] transition-colors">
                {TAMIL_STRINGS.dashboard.exploreStoriesTitle}
              </h3>
              <p className="text-xs text-[#6B7570] flex items-center justify-between">
                <span>{TAMIL_STRINGS.dashboard.exploreStoriesDesc}</span>
                <span className="text-[#2E689E] font-bold text-sm group-hover:translate-x-1 transition-transform">→</span>
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Statistics Section in Pure Tamil */}
      <div className="space-y-3 font-tamil">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-[#073D2B]" />
            <h2 className="text-xs font-bold text-[#525A56] uppercase tracking-wider">
              {TAMIL_STRINGS.dashboard.statsHeader}
            </h2>
          </div>
          {dashboardStats.isLiveSupabase ? (
            <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{TAMIL_STRINGS.dashboard.supabaseLive}</span>
            </span>
          ) : (
            <span className="text-[11px] text-[#717C76] font-medium bg-[#EFE9DD] px-2.5 py-0.5 rounded-full border border-[#E5DDCF]">
              {TAMIL_STRINGS.dashboard.demoStats}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          <div className="rounded-2xl border border-[#E5DDCF] bg-white p-4 shadow-2xs flex flex-col justify-between">
            <span className="text-xs text-[#6B7570] font-medium block mb-1">
              {TAMIL_STRINGS.dashboard.statPreservedStories}
            </span>
            <div className="flex items-baseline justify-between gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#073D2B] tracking-tight font-sans">
                {dashboardStats.preservedStories}
              </span>
              <span className="text-[10px] text-[#073D2B] bg-[#E8F3EE] px-2 py-0.5 rounded font-semibold border border-[#CDE5D8]">
                கதைகள்
              </span>
            </div>
            <span className="text-[10px] text-[#8E9792] mt-2 block">ஆவணப்படுத்தப்பட்ட நினைவுகள்</span>
          </div>

          <div className="rounded-2xl border border-[#E5DDCF] bg-white p-4 shadow-2xs flex flex-col justify-between">
            <span className="text-xs text-[#6B7570] font-medium block mb-1">
              {TAMIL_STRINGS.dashboard.statRecordedHours}
            </span>
            <div className="flex items-baseline justify-between gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#073D2B] tracking-tight font-sans">
                {dashboardStats.recordedHours}
              </span>
              <span className="text-[10px] text-[#073D2B] bg-[#E8F3EE] px-2 py-0.5 rounded font-semibold border border-[#CDE5D8]">
                மணிநேரங்கள்
              </span>
            </div>
            <span className="text-[10px] text-[#8E9792] mt-2 block">பாதுகாக்கப்பட்ட குரல்கள்</span>
          </div>

          <div className="rounded-2xl border border-[#E5DDCF] bg-white p-4 shadow-2xs flex flex-col justify-between">
            <span className="text-xs text-[#6B7570] font-medium block mb-1">
              {TAMIL_STRINGS.dashboard.statDistricts}
            </span>
            <div className="flex items-baseline justify-between gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#073D2B] tracking-tight font-sans">
                {dashboardStats.regionsRepresented}
              </span>
              <span className="text-[10px] text-[#073D2B] bg-[#E8F3EE] px-2 py-0.5 rounded font-semibold border border-[#CDE5D8]">
                மாவட்டங்கள்
              </span>
            </div>
            <span className="text-[10px] text-[#8E9792] mt-2 block">தமிழ்நாடு முழுவதும்</span>
          </div>

          <div className="rounded-2xl border border-[#E5DDCF] bg-white p-4 shadow-2xs flex flex-col justify-between">
            <span className="text-xs text-[#6B7570] font-medium block mb-1">
              {TAMIL_STRINGS.dashboard.statTraditions}
            </span>
            <div className="flex items-baseline justify-between gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#073D2B] tracking-tight font-sans">
                {dashboardStats.categoriesCount || 7}
              </span>
              <span className="text-[10px] text-[#073D2B] bg-[#E8F3EE] px-2 py-0.5 rounded font-semibold border border-[#CDE5D8]">
                பகுப்புகள்
              </span>
            </div>
            <span className="text-[10px] text-[#8E9792] mt-2 block">வேளாண்மை, கலை, மருத்துவம்</span>
          </div>
        </div>

        {/* Category Breakdown Badges */}
        {Object.keys(dashboardStats.categoryBreakdown).length > 0 && (
          <div className="rounded-2xl border border-[#E5DDCF] bg-white/70 p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-[#525A56] uppercase tracking-wider block">
              துறை வாரியான வரலாற்று ஆவணங்கள்:
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(dashboardStats.categoryBreakdown).map(([cat, count]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => navigate(`/archive?category=${encodeURIComponent(cat)}`)}
                  className="inline-flex items-center gap-1.5 text-xs bg-white text-[#073D2B] hover:bg-[#E8F3EE] px-2.5 py-1 rounded-lg border border-[#E5DDCF] shadow-2xs transition-colors cursor-pointer"
                >
                  <span className="font-medium">{cat}</span>
                  <span className="bg-[#E8F3EE] text-[#073D2B] font-bold text-[10px] px-1.5 py-0.2 rounded-full font-sans">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Stories Section in Pure Tamil */}
      <div className="space-y-4 pt-2 font-tamil">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#141A17] flex items-center gap-2">
              <span>{TAMIL_STRINGS.dashboard.recentStoriesTitle}</span>
            </h2>
          </div>

          <Link
            to="/archive"
            className="text-xs font-bold text-[#073D2B] hover:text-[#135C43] flex items-center gap-1 group py-1 px-2.5 rounded-lg hover:bg-[#E8F3EE] transition-colors"
          >
            <span>{TAMIL_STRINGS.dashboard.viewAll}</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {recentStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onSelect={() => navigate(`/archive`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
