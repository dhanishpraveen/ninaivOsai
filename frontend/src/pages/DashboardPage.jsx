import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  Library,
  Sparkles,
  BookOpen,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  TrendingUp,
  Volume2,
  AlertCircle,
} from 'lucide-react';
import Badge from '../components/Badge';
import StoryCard from '../components/StoryCard';
import { SAMPLE_STORIES, STATS_DATA } from '../data/sampleData';

export default function DashboardPage() {
  const recentStories = SAMPLE_STORIES.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome & Overview Header */}
      <div className="relative rounded-2xl border border-maroon-200 bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 p-6 sm:p-8 text-white shadow-md overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-gold-300 backdrop-blur-xs mb-3 border border-white/15">
            <Sparkles className="h-3 w-3" />
            <span>வணக்கம் (Welcome) • Tamil Oral History Digital Archive</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            மூத்த குரல்களை அழியாமல் பாதுகாப்போம்
          </h1>
          <p className="text-xs sm:text-sm text-maroon-100 font-sans leading-relaxed mb-6">
            Preserve elder memories, indigenous crafts, and dialectal folklore across Tamil Nadu. Review stories, transcribe audio, and explore living cultural knowledge.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/preserve"
              className="inline-flex items-center gap-2 rounded-xl bg-gold-500 hover:bg-gold-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-charcoal-950 shadow-sm transition-all"
            >
              <Mic className="h-4 w-4" />
              <span>புதிய கதை பதிவு செய்ய (Preserve Story)</span>
            </Link>
            <Link
              to="/ask-ai"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all"
            >
              <Sparkles className="h-4 w-4 text-gold-300" />
              <span>மரபு AI-யிடம் கேளுங்கள் (Ask AI)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-ivory-300 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-charcoal-500">பாதுகாக்கப்பட்ட கதைகள்</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-maroon-50 text-maroon-700">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-charcoal-900">{STATS_DATA.preservedStories}</span>
            <Badge variant="demo">Sample</Badge>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">Preserved oral stories across genres</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-ivory-300 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-charcoal-500">பதிவான நேர அளவு</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-50 text-gold-700">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-charcoal-900">{STATS_DATA.recordedHours}</span>
            <span className="text-xs text-charcoal-500 font-semibold">மணி நேரம் (Hours)</span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">Total high-fidelity Tamil audio</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-ivory-300 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-charcoal-500">பிரதிநிதித்துவ மாவட்டங்கள்</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-charcoal-900">{STATS_DATA.regionsRepresented}</span>
            <span className="text-xs text-charcoal-500 font-semibold">மண்டலங்கள்</span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">Delta, Kongu, Chettinad, Pandiya</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-ivory-300 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-charcoal-500">கள சமூகம் & மூத்தோர்</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-charcoal-100 text-charcoal-700">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-charcoal-900">{STATS_DATA.communitiesDocumented}</span>
            <span className="text-xs text-charcoal-500 font-semibold">சமூகங்கள்</span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">Farmers, artisans, and storytellers</p>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-charcoal-900">
            விரைவுச் செயல்பாடுகள் (Quick Actions)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/preserve"
            className="group flex items-start gap-4 p-4 rounded-xl border border-ivory-300 bg-white hover:border-maroon-300 hover:shadow-xs transition-all"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-maroon-50 text-maroon-800 group-hover:bg-maroon-800 group-hover:text-white transition-colors">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-charcoal-900 text-sm group-hover:text-maroon-800">
                வாய்மொழி ஒலிப்பதிவு (Upload/Record)
              </h3>
              <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                Record new interviews or upload audio to initiate Tamil transcription and preservation.
              </p>
            </div>
          </Link>

          <Link
            to="/archive"
            className="group flex items-start gap-4 p-4 rounded-xl border border-ivory-300 bg-white hover:border-gold-300 hover:shadow-xs transition-all"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold-50 text-gold-700 group-hover:bg-gold-600 group-hover:text-white transition-colors">
              <Library className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-charcoal-900 text-sm group-hover:text-gold-700">
                களஞ்சியத்தை உலாவுதல் (Browse Archive)
              </h3>
              <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                Filter and search through community oral narratives, traditional songs, and artisan memoirs.
              </p>
            </div>
          </Link>

          <Link
            to="/ask-ai"
            className="group flex items-start gap-4 p-4 rounded-xl border border-ivory-300 bg-white hover:border-charcoal-400 hover:shadow-xs transition-all"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-charcoal-100 text-charcoal-800 group-hover:bg-charcoal-800 group-hover:text-white transition-colors">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-charcoal-900 text-sm group-hover:text-charcoal-900">
                மரபு AI கேள்வி-பதில் (Ask Heritage AI)
              </h3>
              <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                Query cultural practices with evidence grounded in preserved elder testimonies.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Stories Section (Sample Data) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-charcoal-900">
                சமீபத்திய வாய்மொழிப் பதிவுகள் (Recent Preserved Stories)
              </h2>
              <Badge variant="demo">Demo Data</Badge>
            </div>
            <p className="text-xs text-charcoal-500 font-sans mt-0.5">
              These records represent curated community stories used for Phase 1 interface demonstration.
            </p>
          </div>

          <Link
            to="/archive"
            className="inline-flex items-center gap-1 text-xs font-semibold text-maroon-800 hover:text-maroon-950"
          >
            <span>முழு களஞ்சியத்தைப் பார்க்க (View All)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
}
