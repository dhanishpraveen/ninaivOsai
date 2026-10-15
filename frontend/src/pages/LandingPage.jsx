import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  ScrollText,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Headphones,
  FileText,
  Compass,
  CheckCircle2,
  Users,
  Feather,
} from 'lucide-react';
import Badge from '../components/Badge';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ivory-100 text-charcoal-900 selection:bg-maroon-100">
      {/* Top Navigation Bar */}
      <header className="border-b border-ivory-300 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-800 text-gold-300 shadow-sm">
              <ScrollText className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-maroon-900 tracking-tight">தமிழ் மரபு</span>
              <span className="text-xs text-charcoal-500 font-sans ml-2 hidden sm:inline">Tamil Heritage</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/dashboard"
              className="text-xs sm:text-sm font-medium text-charcoal-700 hover:text-maroon-800 px-3 py-1.5 transition-colors"
            >
              முகப்பு பலகை (Dashboard)
            </Link>
            <Link
              to="/preserve"
              className="inline-flex items-center gap-1.5 rounded-lg bg-maroon-800 px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-maroon-900 transition-colors"
            >
              <Mic className="h-3.5 w-3.5 text-gold-300" />
              <span>Preserve a Story</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-ivory-300 bg-gradient-to-b from-white via-ivory-50 to-ivory-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-maroon-200 bg-maroon-50 px-3.5 py-1 mb-6">
            <Feather className="h-3.5 w-3.5 text-maroon-700" />
            <span className="text-xs font-semibold text-maroon-800">
              TAMIZH HACK FEST 2026 • Problem Statement P4
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-maroon-950 tracking-tight leading-tight mb-6">
            Every Voice Holds a Piece of Our History.
          </h1>

          <p className="text-lg sm:text-xl text-charcoal-700 max-w-3xl mx-auto leading-relaxed mb-4">
            மூத்த தலைமுறையின் அனுபவங்கள், உழவர்களின் உழைப்புப் பாட்டுகள், கைவினைஞர்களின் நுட்பங்கள் மற்றும் வட்டார வாய்மொழி வரலாறுகளை டிஜிட்டல் வடிவில் பாதுகாக்கும் தேசிய முயற்சி.
          </p>

          <p className="text-sm sm:text-base text-charcoal-600 max-w-2xl mx-auto mb-10 font-sans">
            Preserving indigenous Tamil oral traditions, elder narratives, folk wisdom, and dialectal nuances through AI speech transcription and grounded cultural discovery.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/preserve"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-maroon-800 px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-maroon-900 hover:shadow-lg transition-all"
            >
              <Mic className="h-5 w-5 text-gold-300" />
              <span>Preserve a Story</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>

            <Link
              to="/archive"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-maroon-800 bg-white px-6 py-3.5 text-sm sm:text-base font-semibold text-maroon-800 hover:bg-maroon-50 transition-colors"
            >
              <Search className="h-5 w-5 text-maroon-700" />
              <span>Explore the Archive</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 pt-8 border-t border-ivory-300 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-maroon-900">148+</p>
              <p className="text-xs text-charcoal-600 font-medium mt-1">Preserved Stories (Demo)</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-maroon-900">54.6 hrs</p>
              <p className="text-xs text-charcoal-600 font-medium mt-1">Recorded Audio Archives</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-maroon-900">14</p>
              <p className="text-xs text-charcoal-600 font-medium mt-1">Tamil Nadu Regions</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-maroon-900">100%</p>
              <p className="text-xs text-charcoal-600 font-medium mt-1">Ethical Community Consent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="gold">முக்கிய அம்சங்கள் (Core Pillars)</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 mt-3 mb-4">
            End-to-End Cultural Heritage Pipeline
          </h2>
          <p className="text-sm sm:text-base text-charcoal-600">
            Engineered to handle colloquial Tamil speech variations, preserve community ownership, and unlock traditional knowledge through verified citations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="rounded-2xl border border-ivory-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-50 text-maroon-800 mb-5 border border-maroon-100">
              <Headphones className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900 mb-2">
              Tamil Speech Transcription
            </h3>
            <p className="text-xs text-maroon-700 font-medium mb-3">
              AI Speech Engine (Whisper-Tamil)
            </p>
            <p className="text-sm text-charcoal-600 leading-relaxed mb-4">
              Specially tuned for rural dialects, elder pacing, and colloquial vocabulary across Kongu, Chettinad, Tirunelveli, and Delta regions.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-500 border-t border-ivory-200 pt-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Full review & manual edit controls</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-ivory-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-700 mb-5 border border-gold-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900 mb-2">
              Digital Cultural Preservation
            </h3>
            <p className="text-xs text-gold-700 font-medium mb-3">
              Tamper-proof Storage & Consent
            </p>
            <p className="text-sm text-charcoal-600 leading-relaxed mb-4">
              Stores raw audio together with dual-script transcripts, contributor biographies, region coordinates, and explicit ethical consent.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-500 border-t border-ivory-200 pt-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Cloud audio & structured relational tables</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-ivory-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-charcoal-100 text-charcoal-800 mb-5 border border-charcoal-200">
              <Sparkles className="h-6 w-6 text-maroon-700" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900 mb-2">
              Heritage Knowledge Discovery
            </h3>
            <p className="text-xs text-charcoal-600 font-medium mb-3">
              Evidence-Grounded AI Assistant
            </p>
            <p className="text-sm text-charcoal-600 leading-relaxed mb-4">
              Ask questions about traditional agricultural rituals, folk medicine recipes, or folklore, backed with verbatim transcript citations.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-500 border-t border-ivory-200 pt-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Truthful responses without hallucinations</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white border-y border-ivory-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-maroon-800 tracking-wider uppercase">
              செயல்முறை விளக்கம்
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 mt-2">
              How Tamil Heritage Works
            </h2>
            <p className="text-sm text-charcoal-600 mt-2">
              A 4-step preservation loop connecting elders with future generations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative p-5 rounded-xl bg-ivory-50 border border-ivory-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-maroon-800 text-white text-xs font-bold mb-3">
                1
              </div>
              <h4 className="font-semibold text-charcoal-900 text-sm mb-1">
                Record or Upload
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Directly capture elder voice interviews in the field or upload existing Tamil audio recordings (.wav, .mp3, .m4a).
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-ivory-50 border border-ivory-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-maroon-800 text-white text-xs font-bold mb-3">
                2
              </div>
              <h4 className="font-semibold text-charcoal-900 text-sm mb-1">
                Transcribe & Edit
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Hugging Face Tamil speech model converts voice into editable Unicode Tamil text, ready for human verification.
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-ivory-50 border border-ivory-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-maroon-800 text-white text-xs font-bold mb-3">
                3
              </div>
              <h4 className="font-semibold text-charcoal-900 text-sm mb-1">
                Tag & Preserve
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Extract summaries, cultural keywords, regional tags, and archive permanently with ethical consent.
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-ivory-50 border border-ivory-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-maroon-800 text-white text-xs font-bold mb-3">
                4
              </div>
              <h4 className="font-semibold text-charcoal-900 text-sm mb-1">
                Explore & Inquire
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Researchers and students interact with the Tamil Heritage Knowledge Agent to retrieve source-grounded answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-ivory-100 text-charcoal-600 text-center text-xs border-t border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-maroon-900">தமிழ் மரபு (Tamil Heritage)</span>
            <span>•</span>
            <span>Digital Preservation Platform</span>
          </div>
          <div>
            <span>TAMIZH HACK FEST 2026</span>
            <span className="mx-2">•</span>
            <span>Problem Statement P4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
