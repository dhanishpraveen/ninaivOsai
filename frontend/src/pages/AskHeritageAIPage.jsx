import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  HelpCircle,
  BookOpen,
  Info,
  MapPin,
  Clock,
  ExternalLink,
  ShieldAlert,
  MessageSquare,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import Badge from '../components/Badge';
import { SAMPLE_QUESTIONS, SAMPLE_STORIES } from '../data/sampleData';

export default function AskHeritageAIPage() {
  const [inputQuery, setInputQuery] = useState('');
  const [selectedCitation, setSelectedCitation] = useState(SAMPLE_STORIES[0]);
  const [systemNotice, setSystemNotice] = useState(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    // Do NOT fabricate live AI answers in Phase 1
    setSystemNotice({
      query: inputQuery,
      message:
        'கட்ட நிலை 1 (Phase 1): மரபு AI உதவியாளர் UI வடிவம் மட்டுமே தயார் செய்யப்பட்டுள்ளது. ' +
        'வாய்மொழி வரலாற்றுக் களஞ்சியத்தில் உள்ள ஆதாரங்களுடன் (Source Excerpts) பதிலளிக்கும் உண்மை LLM மாதிரி ' +
        'கட்ட நிலை 8 இல் (Phase 8: Heritage Knowledge Agent) செயல்படுத்தப்படும். தற்போதைக்கு போலி பதில்கள் உருவாக்கப்படாது.',
    });
    setInputQuery('');
  };

  const handleSelectSuggested = (q) => {
    setInputQuery(q.question);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <span className="font-bold">Phase 1 UI Shell: </span>
            This screen demonstrates the Heritage Knowledge Agent layout and the dual-panel Source Citation design. 
            Real retrieval-augmented generation grounded in oral transcripts will be activated in <strong className="font-semibold text-maroon-900">Phase 8</strong>. 
            In compliance with hackathon rules, no fabricated AI answers are produced.
          </div>
        </div>
      </div>

      {/* Main Dual-Panel Grid: Chat Interface (Left/Center) & Source Citation Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chat Layout */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col rounded-2xl border border-ivory-300 bg-white shadow-sm overflow-hidden min-h-[580px]">
          {/* Chat Header */}
          <div className="border-b border-ivory-200 p-4 bg-ivory-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-800 text-gold-300 shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-charcoal-900 text-sm">
                    தமிழ் மரபு AI உதவியாளர் (Heritage AI)
                  </h2>
                  <Badge variant="demo">Phase 1 UI</Badge>
                </div>
                <p className="text-[11px] text-charcoal-500 font-sans">
                  Answers strictly grounded in preserved elder oral recordings.
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Evidence-first architecture</span>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-white to-ivory-50/30">
            {/* System Intro Message */}
            <div className="flex items-start gap-3 max-w-xl">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-maroon-100 text-maroon-800 text-xs font-bold">
                AI
              </div>
              <div className="rounded-2xl rounded-tl-none bg-ivory-100 p-4 border border-ivory-200 text-xs sm:text-sm text-charcoal-800 leading-relaxed space-y-2">
                <p className="font-semibold text-maroon-900">
                  வணக்கம்! நான் தமிழ் மரபு களஞ்சிய அறிவு உதவியாளர்.
                </p>
                <p>
                  களஞ்சியத்தில் ஆவணப்படுத்தப்பட்டுள்ள உழவர்கள், கைவினைஞர்கள், மற்றும் மூத்த தலைமுறையின் வாய்மொழி வரலாற்றுக் குறிப்புகளிலிருந்து மட்டுமே நான் பதில்களை மேற்கோள் காட்டுவேன்.
                </p>
                <p className="text-xs text-charcoal-500 font-sans italic border-t border-ivory-300 pt-2">
                  You can explore suggested questions below to inspect how citations and evidence verification will appear.
                </p>
              </div>
            </div>

            {/* Notice if user submitted a question */}
            {systemNotice && (
              <div className="space-y-3">
                {/* User Bubble */}
                <div className="flex items-start justify-end gap-3">
                  <div className="rounded-2xl rounded-tr-none bg-maroon-800 p-3.5 text-xs sm:text-sm text-white max-w-md shadow-xs">
                    {systemNotice.query}
                  </div>
                </div>

                {/* System Phase Alert */}
                <div className="flex items-start gap-3 max-w-xl">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">
                    !
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-amber-50 p-4 border border-amber-200 text-xs sm:text-sm text-amber-900 leading-relaxed">
                    <p className="font-semibold text-amber-950 mb-1">
                      உண்மை AI உலாவி நிலை (Phase Notice):
                    </p>
                    <p>{systemNotice.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Questions Section */}
          <div className="border-t border-ivory-200 p-4 bg-ivory-50/50">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-gold-600" />
              <span>மாதிரி கேள்விகள் (Suggested Cultural Questions):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleSelectSuggested(q)}
                  className="text-left p-2.5 rounded-lg border border-ivory-300 bg-white hover:border-maroon-300 hover:bg-maroon-50/30 transition-all text-xs text-charcoal-800 line-clamp-2"
                >
                  <span className="font-medium text-maroon-900 block truncate">{q.category}</span>
                  <span className="text-charcoal-700">{q.question}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Query Input Bar */}
          <form onSubmit={handleSend} className="p-4 border-t border-ivory-200 bg-white flex gap-2">
            <input
              type="text"
              placeholder="தமிழ் கலாச்சாரம், வேளாண்மை, கைவினைப் பாரம்பரியம் பற்றி வினவுக... (Ask about Tamil oral heritage...)"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 rounded-xl border border-ivory-300 bg-ivory-50/40 px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-maroon-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-maroon-500"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-maroon-800 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-maroon-900 transition-colors"
            >
              <Send className="h-4 w-4 text-gold-300" />
              <span className="hidden sm:inline">கேட்க (Send)</span>
            </button>
          </form>
        </div>

        {/* Right Column: Source Citation Panel Design */}
        <div className="lg:col-span-5 xl:col-span-4 rounded-2xl border border-ivory-300 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-maroon-700" />
              <h3 className="font-bold text-sm text-charcoal-900">
                சான்று மேற்கோள் பலகை (Source Evidence Panel)
              </h3>
            </div>
            <Badge variant="maroon">Citations</Badge>
          </div>

          <p className="text-xs text-charcoal-600 leading-relaxed">
            Every AI answer in Phase 8 will be linked directly to a verified source interview excerpt, region coordinates, and narrator credentials.
          </p>

          {/* Sample Citation Mock Card */}
          <div className="rounded-xl border border-gold-300 bg-gold-50/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-2 py-0.5 rounded border border-gold-200">
                Verified Excerpt (Demo)
              </span>
              <span className="text-[11px] text-charcoal-500 font-semibold">
                Confidence: 94%
              </span>
            </div>

            <div>
              <h4 className="font-bold text-charcoal-900 text-sm">
                {selectedCitation.title}
              </h4>
              <p className="text-xs text-charcoal-500 font-sans italic">
                {selectedCitation.titleEn}
              </p>
            </div>

            {/* Verbatim quote */}
            <div className="rounded-lg bg-white p-3 border border-gold-200 text-xs text-charcoal-800 italic leading-relaxed">
              "{selectedCitation.excerpt}"
            </div>

            {/* Narrator metadata */}
            <div className="text-xs text-charcoal-600 space-y-1 pt-1 border-t border-gold-200">
              <div className="flex items-center gap-1.5">
                <span className="text-charcoal-400">கூறியவர்:</span>
                <strong className="text-charcoal-800">{selectedCitation.contributor}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-gold-600" />
                <span>{selectedCitation.region}</span>
              </div>
            </div>
          </div>

          {/* Select other sample interviews to inspect citation card */}
          <div>
            <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block mb-2">
              பிற மேற்கோள்களை மாதிரியாகப் பார்க்க (Switch Sample Citation):
            </span>
            <div className="space-y-1.5">
              {SAMPLE_STORIES.slice(0, 3).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedCitation(st)}
                  className={`w-full text-left p-2 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                    selectedCitation.id === st.id
                      ? 'border-maroon-400 bg-maroon-50 text-maroon-900 font-medium'
                      : 'border-ivory-200 bg-ivory-50 text-charcoal-700 hover:bg-ivory-100'
                  }`}
                >
                  <span className="truncate max-w-[200px]">{st.title}</span>
                  <span className="text-[10px] text-charcoal-400">{st.region.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Insufficient Evidence Policy Card */}
          <div className="rounded-xl border border-ivory-200 bg-ivory-100 p-3.5 text-xs text-charcoal-600 space-y-1">
            <div className="flex items-center gap-1 text-maroon-800 font-semibold">
              <ShieldAlert className="h-3.5 w-3.5 text-maroon-700" />
              <span>Insufficient Evidence Standard:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              When no preserved oral history confirms an inquiry, the agent explicitly reports insufficient archive evidence rather than halluncinating facts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
