import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  Sprout,
  Sparkles,
  ArrowRight,
  Headphones,
  Compass,
  Play,
} from 'lucide-react';
import Badge from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { TAMIL_STRINGS } from '../constants/tamilStrings';

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-ivory-100 text-charcoal-900 selection:bg-forest-100 font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-ivory-300 bg-white/95 backdrop-blur-md sticky top-0 z-30 font-tamil">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-800 text-emerald-300 shadow-xs">
              <Sprout className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-xl text-forest-950 tracking-tight">{TAMIL_STRINGS.brand.name}</span>
              <p className="text-[10px] text-forest-800 tracking-wide">
                {TAMIL_STRINGS.brand.tagline}
              </p>
            </div>
          </Link>

          {/* Nav Links in Pure Tamil */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-charcoal-700">
            <Link to="/dashboard" className="hover:text-forest-800 transition-colors">
              {TAMIL_STRINGS.nav.home}
            </Link>
            <Link to="/archive" className="hover:text-forest-800 transition-colors">
              {TAMIL_STRINGS.nav.archive}
            </Link>
            <a href="#how-it-works" className="hover:text-forest-800 transition-colors">
              {TAMIL_STRINGS.nav.howItWorks}
            </a>
            <Link to="/ask-ai" className="hover:text-forest-800 transition-colors">
              {TAMIL_STRINGS.nav.askAi}
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-forest-800 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-forest-900 transition-colors"
              >
                <span>{TAMIL_STRINGS.nav.dashboard}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-forest-900 hover:text-forest-700 px-3 py-2 transition-colors"
                >
                  {TAMIL_STRINGS.nav.signIn}
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-forest-800 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-forest-900 transition-colors"
                >
                  <span>{TAMIL_STRINGS.nav.signUp}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section in Pure Tamil */}
      <section className="relative overflow-hidden bg-forest-950 text-white py-16 lg:py-24 font-tamil">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forest-800/40 via-forest-950 to-forest-950 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-forest-800/80 border border-forest-600/60 px-3.5 py-1 text-xs text-emerald-300 font-medium">
                <Sprout className="h-3.5 w-3.5 text-emerald-400" />
                <span>{TAMIL_STRINGS.brand.hackathonLabel}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                தமிழர் பாரம்பரிய அறிவை தலைமுறைகள் கடந்து பாதுகாப்போம்.
              </h1>

              <p className="text-base sm:text-lg text-forest-100/90 leading-relaxed max-w-xl">
                உண்மையான மனிதர்களின் குரல்கள். நேரடி வாழ்வியல் அனுபவங்கள். விவசாயிகள், கைவினைஞர்கள் மற்றும் மரபு மருத்துவர்களின் அரிய வாய்மொழி வரலாற்றைப் பதிவு செய்து ஆவணப்படுத்துங்கள்.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/preserve"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3.5 text-sm sm:text-base font-bold text-forest-950 shadow-md transition-all"
                >
                  <span>{TAMIL_STRINGS.nav.getStarted}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 px-6 py-3.5 text-sm sm:text-base font-semibold text-white backdrop-blur-xs transition-colors"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>களஞ்சியப் பார்வை</span>
                </Link>
              </div>
            </div>

            {/* Right Photo Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-forest-700/60 aspect-[4/3] lg:aspect-auto lg:h-[460px]">
                <img
                  src="/tamil_farmer_hero.jpg"
                  alt="பாரம்பரிய உழவர்"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
                
                {/* Photo caption overlay in Tamil */}
                <div className="absolute bottom-4 left-4 right-4 bg-forest-900/90 backdrop-blur-md rounded-2xl p-3 border border-forest-700/60 text-xs font-tamil">
                  <p className="font-bold text-white">கே. இராமசாமி (வயது 74) • மூத்த உழவர்</p>
                  <p className="text-forest-200 text-[11px]">காவிரி பாசன வாய்மொழி வரலாற்று ஆவணம், தஞ்சாவூர்</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Icons Row */}
        <div className="mt-14 pt-8 border-t border-forest-800/80 bg-forest-900/60 backdrop-blur-xs font-tamil">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-800 text-emerald-400">
                  <Mic className="h-5 w-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white">வாய்மொழி ஒலிப்பதிவு</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-800 text-emerald-400">
                  <Headphones className="h-5 w-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white">AI தமிழ் பேச்சு உரை</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-800 text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white">மரபு AI அறிவு உதவியாளர்</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-800 text-emerald-400">
                  <Compass className="h-5 w-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white">மாவட்ட வாரியாகத் தேடல்</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section in Pure Tamil */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-tamil">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="phase">செயல்முறை விளக்கம்</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-2">
            நினைவோசை எவ்வாறு செயல்படுகிறது?
          </h2>
          <p className="text-sm text-charcoal-600 mt-2">
            மூத்த தலைமுறையினரின் வாய்மொழி அறிவை எதிர்கால சந்ததியினருடன் இணைக்கும் 4-படி ஆவண முறை.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-800 text-white font-bold text-xs mb-4 font-sans">
              1
            </div>
            <h4 className="font-bold text-charcoal-900 text-base mb-1">
              ஒலிப்பதிவு அல்லது பதிவேற்றம்
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              கிராமங்களில் நேரடியாக மூத்தவர்களின் வாய்மொழிப் பேச்சுகளைப் பதிவு செய்யுங்கள் அல்லது ஒலிக் கோப்புகளைப் பதிவேற்றுங்கள்.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-800 text-white font-bold text-xs mb-4 font-sans">
              2
            </div>
            <h4 className="font-bold text-charcoal-900 text-base mb-1">
              தமிழ் பேச்சு உரை மாற்றம்
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Whisper Tamil மாதிரி ஒலிப்பதிவைத் துல்லியமான தமிழ் உரையாக மாற்றுகிறது; தேவைப்பட்டால் எளிதாகத் திருத்தலாம்.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-800 text-white font-bold text-xs mb-4 font-sans">
              3
            </div>
            <h4 className="font-bold text-charcoal-900 text-base mb-1">
              தலைப்பு & சுருக்கம் உருவாக்குதல்
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              AI மொழி மாதிரி கதையின் தலைப்பு, சுருக்கம், பகுப்பு மற்றும் குறிச்சொற்களைத் தானாக உருவாக்கி ஆவணப்படுத்துகிறது.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-ivory-300 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-800 text-white font-bold text-xs mb-4 font-sans">
              4
            </div>
            <h4 className="font-bold text-charcoal-900 text-base mb-1">
              களஞ்சிய ஆய்வு & AI வினாவிடை
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              ஆய்வாளர்களும் பொதுமக்களும் களஞ்சியத்தைத் தேடலாம், அசல் சான்றுகளுடன் மரபு AI உதவியாளரிடம் கேள்விகளைக் கேட்கலாம்.
            </p>
          </div>
        </div>
      </section>

      {/* Footer in Pure Tamil */}
      <footer className="py-8 bg-forest-950 text-forest-200 text-xs border-t border-forest-900 font-tamil">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{TAMIL_STRINGS.brand.name}</span>
            <span>•</span>
            <span>{TAMIL_STRINGS.brand.tagline}</span>
          </div>
          <div>
            <span>{TAMIL_STRINGS.brand.hackathonLabel}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
