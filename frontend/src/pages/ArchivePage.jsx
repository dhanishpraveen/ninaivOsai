import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Volume2,
  X,
  User,
  Clock,
  Tag,
  BookOpen,
  Share2,
  Sparkles,
} from 'lucide-react';
import Badge from '../components/Badge';
import StoryCard from '../components/StoryCard';
import { SAMPLE_STORIES } from '../data/sampleData';

export default function ArchivePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeStoryModal, setActiveStoryModal] = useState(null);

  // Filtered stories
  const filteredStories = SAMPLE_STORIES.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.contributor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRegion =
      selectedRegion === 'ALL' || story.region.includes(selectedRegion);

    const matchesCategory =
      selectedCategory === 'ALL' || story.category.includes(selectedCategory);

    return matchesSearch && matchesRegion && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Title & Demo Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-300 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">
              வாய்மொழி வரலாற்றுக் களஞ்சியம் (Story Archive)
            </h1>
            <Badge variant="demo">Demo Archive</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 font-sans mt-1">
            Explore indexed oral records, elder memories, and artisanal techniques preserved in Tamil.
          </p>
        </div>

        <div className="text-xs text-charcoal-500 font-medium bg-ivory-200/80 px-3 py-1.5 rounded-lg border border-ivory-300 self-start sm:self-auto">
          காட்டப்படும் கதைகள்: <span className="font-bold text-maroon-900">{filteredStories.length}</span> / {SAMPLE_STORIES.length}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-xl border border-ivory-300 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
            <input
              type="text"
              placeholder="தலைப்பு, பேச்சாளர், ஊர் அல்லது குறிச்சொல் தேடுக... (Search stories, contributors, topics...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-ivory-300 bg-ivory-50/50 pl-10 pr-4 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-maroon-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-maroon-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-charcoal-500 shrink-0" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="rounded-lg border border-ivory-300 bg-white px-3 py-2 text-xs font-medium text-charcoal-700 focus:border-maroon-500 focus:outline-none focus:ring-1 focus:ring-maroon-500"
            >
              <option value="ALL">அனைத்து மாவட்டங்கள் (All Regions)</option>
              <option value="தஞ்சாவூர்">தஞ்சாவூர் (Thanjavur)</option>
              <option value="காஞ்சிபுரம்">காஞ்சிபுரம் (Kanchipuram)</option>
              <option value="தூத்துக்குடி">தூத்துக்குடி (Thoothukudi)</option>
              <option value="பொள்ளாச்சி">பொள்ளாச்சி (Pollachi)</option>
              <option value="காரைக்குடி">காரைக்குடி (Karaikudi)</option>
              <option value="திருநெல்வேலி">திருநெல்வேலி (Tirunelveli)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-charcoal-500 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-ivory-300 bg-white px-3 py-2 text-xs font-medium text-charcoal-700 focus:border-maroon-500 focus:outline-none focus:ring-1 focus:ring-maroon-500"
            >
              <option value="ALL">அனைத்துப் பிரிவுகள் (All Categories)</option>
              <option value="விவசாய மரபு">விவசாய மரபு (Agriculture)</option>
              <option value="கைவினைக் கலை">கைவினைக் கலை (Artisans)</option>
              <option value="கடல் மரபு">கடல் மரபு (Maritime)</option>
              <option value="பாரம்பரிய மருத்துவம்">பாரம்பரிய மருத்துவம் (Folk Medicine)</option>
              <option value="உணவு மரபு">உணவு மரபு (Culinary)</option>
              <option value="நாட்டுப்புறக் கலை">நாட்டுப்புறக் கலை (Folklore)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="rounded-2xl border border-ivory-300 bg-white p-12 text-center">
          <BookOpen className="h-10 w-10 text-charcoal-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-charcoal-800">
            பொருத்தமான கதைகள் காணப்படவில்லை (No matching stories found)
          </h3>
          <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset filters to browse all demo records.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('ALL');
              setSelectedCategory('ALL');
            }}
            className="mt-4 text-xs font-semibold text-maroon-800 hover:underline"
          >
            அனைத்து வடிப்பான்களையும் மீட்டமைக்க (Reset Filters)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onSelect={(selected) => setActiveStoryModal(selected)}
            />
          ))}
        </div>
      )}

      {/* Story Detail Modal (Phase 1 UI View) */}
      {activeStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-ivory-300">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-ivory-200 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="maroon">{activeStoryModal.category}</Badge>
                  <Badge variant="demo">Curated Demo Archive</Badge>
                </div>
                <h2 className="text-xl font-bold text-charcoal-900 leading-snug">
                  {activeStoryModal.title}
                </h2>
                <p className="text-xs text-charcoal-500 font-sans italic">
                  {activeStoryModal.titleEn}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveStoryModal(null)}
                className="p-1 rounded-lg text-charcoal-400 hover:bg-ivory-100 hover:text-charcoal-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-sm">
              {/* Contributor Card */}
              <div className="rounded-xl bg-ivory-50 p-4 border border-ivory-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-charcoal-500 block">கதை கூறியவர் (Narrator):</span>
                  <strong className="text-charcoal-900 text-sm">{activeStoryModal.contributor}</strong>
                </div>
                <div>
                  <span className="text-charcoal-500 block">மாவட்டம் / பகுதி (Region):</span>
                  <strong className="text-charcoal-900 text-sm flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-gold-600" />
                    {activeStoryModal.region}
                  </strong>
                </div>
                <div>
                  <span className="text-charcoal-500 block">ஒலிப்பதிவு கால அளவு (Duration):</span>
                  <strong className="text-charcoal-900 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3 text-charcoal-600" />
                    {activeStoryModal.duration}
                  </strong>
                </div>
                <div>
                  <span className="text-charcoal-500 block">ஆவணப்படுத்திய நாள் (Date):</span>
                  <strong className="text-charcoal-900">{activeStoryModal.date}</strong>
                </div>
              </div>

              {/* Cultural Summary */}
              <div>
                <h4 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  கலாச்சாரச் சுருக்கம் (Cultural Summary)
                </h4>
                <p className="text-charcoal-800 leading-relaxed bg-white p-3 rounded-lg border border-ivory-200">
                  {activeStoryModal.summary}
                </p>
              </div>

              {/* Transcript Excerpt */}
              <div>
                <h4 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  வாய்மொழி உரைப்பகுதி (Verbatim Transcript Excerpt)
                </h4>
                <div className="rounded-lg bg-maroon-50/50 p-3.5 border border-maroon-100 text-maroon-950 font-serif italic text-sm leading-relaxed">
                  "{activeStoryModal.excerpt}"
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                  வகைப்படுத்தப்பட்ட குறிச்சொற்கள் (Topic Tags)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeStoryModal.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs text-maroon-800 bg-maroon-50 px-2.5 py-1 rounded-md border border-maroon-200"
                    >
                      <Tag className="h-3 w-3 text-maroon-600" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Phase Note */}
              <div className="rounded-lg bg-ivory-100 p-3 text-xs text-charcoal-600 border border-ivory-200">
                <strong>Phase 6 Notice: </strong>
                Full audio playback streaming and Supabase database records will connect in Phase 6. In Phase 1, archive displays local curated sample records.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-ivory-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStoryModal(null)}
                className="rounded-lg bg-charcoal-800 px-4 py-2 text-xs font-semibold text-white hover:bg-charcoal-900"
              >
                மூடுக (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
