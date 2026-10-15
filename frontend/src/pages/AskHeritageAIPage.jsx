import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  HelpCircle,
  BookOpen,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import Badge from '../components/Badge';
import { TAMIL_STRINGS } from '../constants/tamilStrings';

const SAMPLE_QUESTIONS = [
  {
    id: "q1",
    question: "தஞ்சாவூர் ஆனிப் பட்டத்து உழவு மற்றும் பாரம்பரிய நெல் சாகுபடி முறை என்ன?",
    category: "பாரம்பரிய வேளாண்மை",
    topic: "Agriculture",
  },
  {
    id: "q2",
    question: "பாரம்பரிய பஞ்சகவ்யா இயற்கை உரம் தயாரிக்கும் முறை என்ன?",
    category: "இயற்கை உரம்",
    topic: "Agriculture",
  },
  {
    id: "q3",
    question: "திருவண்ணாமலை கண்மாய் மடை பராமரிப்பும் நீர் பங்கீட்டு முறையும் எப்படி இருந்தது?",
    category: "நீர் மேலாண்மை",
    topic: "Water Conservation",
  },
  {
    id: "q4",
    question: "காஞ்சிபுரம் தறி நெசவாளர்கள் வேலை செய்யும் போது பாடிய தறிப் பாட்டுகளின் நோக்கம் என்ன?",
    category: "கைவினை மரபு",
    topic: "Traditional Crafts",
  },
  {
    id: "q5",
    question: "செவ்வாய் கிரக ஆராய்ச்சி மற்றும் நாசா விண்கலம் (ஆதாரம் இல்லாத கேள்வி)",
    category: "ஆதாரமற்ற சோதனை",
    topic: null,
  },
];

const INITIAL_WELCOME_MESSAGE = {
  id: 'welcome-0',
  type: 'agent',
  question: null,
  answer: "வணக்கம்! நான் நினைவோசை வாய்மொழி வரலாற்று அறிவு உதவியாளர். காப்பகத்தில் சேகரிக்கப்பட்ட உண்மை மனிதர்களின் வாய்மொழி வாக்குமூலங்கள், பாரம்பரிய வேளாண்மை, நாட்டுப்புறப் பாடல்கள் மற்றும் கைவினைத் தொழில் பதிவுகளிலிருந்து மட்டுமே எனது பதில்கள் ஆதாரபூர்வமாக உருவாக்கப்படுகின்றன. நீங்கள் அறிய விரும்பும் செய்தியை கீழே கேளுங்கள்.",
  has_evidence: true,
  insufficient_evidence: false,
  evidence_status: 'sufficient',
  sources: [],
  excerpts: [],
  model: 'நினைவோசை மரபு RAG',
  timestamp: 'இப்போது',
};

export default function AskHeritageAIPage() {
  const [inputQuery, setInputQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedExcerpts, setExpandedExcerpts] = useState({});
  const [activeConversation, setActiveConversation] = useState([INITIAL_WELCOME_MESSAGE]);
  const [agentStatus, setAgentStatus] = useState(null);
  const [lastQuery, setLastQuery] = useState('');

  // Load backend status on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8001/knowledge/status');
      if (res.ok) {
        const data = await res.json();
        setAgentStatus(data);
      }
    } catch (e) {
      console.warn("Could not fetch RAG status:", e);
    }
  };

  const handleResetConversation = () => {
    setActiveConversation([INITIAL_WELCOME_MESSAGE]);
    setInputQuery('');
    setError(null);
    setExpandedExcerpts({});
  };

  const toggleExcerpt = (idx) => {
    setExpandedExcerpts((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSendQuery = async (queryText, topicFilter = selectedTopic) => {
    const q = (queryText || inputQuery).trim();
    if (!q || loading) return;

    setError(null);
    setLoading(true);
    setLastQuery(q);

    const userMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      const payload = {
        question: q,
        topic: topicFilter || null,
        top_k: 4,
        language: 'ta',
      };

      const res = await fetch('http://127.0.0.1:8001/knowledge/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `சேவை பிழை (${res.status})`);
      }

      const data = await res.json();

      setActiveConversation((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          type: 'interaction',
          question: q,
          answer: data.answer,
          has_evidence: data.has_evidence,
          insufficient_evidence: data.insufficient_evidence,
          evidence_status: data.evidence_status,
          sources: data.sources || [],
          excerpts: data.excerpts || [],
          model: data.model,
          embedding_model: data.embedding_model,
          insufficient_reason: data.insufficient_reason,
          timestamp: userMessageTime,
        },
      ]);

      setInputQuery('');
    } catch (err) {
      console.error("RAG Query Error:", err);
      setError(err.message || "பதில் பெறுவதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggested = (item) => {
    setInputQuery(item.question);
    if (item.topic) {
      setSelectedTopic(item.topic);
    }
    handleSendQuery(item.question, item.topic);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-300 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-charcoal-900 tracking-tight flex items-center gap-2 font-tamil">
              <Sparkles className="h-6 w-6 text-forest-700" />
              {TAMIL_STRINGS.aiAgent.title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 font-tamil mt-0.5">
            {TAMIL_STRINGS.aiAgent.description}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap font-tamil">
          {agentStatus && (
            <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{agentStatus.indexed_stories} கதைகள் குறியிடப்பட்டுள்ளன</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetConversation}
            className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-700 bg-white px-3 py-1 rounded-full border border-ivory-300 hover:bg-ivory-100 hover:text-charcoal-900 transition-colors shadow-2xs cursor-pointer"
            title="உரையாடலை மீட்டமைத்து புதிய வினாவைத் தொடங்குக"
          >
            <RotateCcw className="h-3 w-3 text-charcoal-500" />
            <span>புதிய வினா</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-3xl border border-ivory-300 bg-white shadow-xs overflow-hidden flex flex-col min-h-[660px]">
        {/* Suggested Quick Question Pills at top */}
        <div className="p-4 bg-ivory-50/70 border-b border-ivory-200 font-tamil">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-600">
              <HelpCircle className="h-3.5 w-3.5 text-forest-700" />
              <span>{TAMIL_STRINGS.aiAgent.sampleQuestionsTitle}</span>
            </div>
            <span className="text-[10px] text-charcoal-500 hidden sm:inline">
              கிளிக் செய்து உடனே விடைபெறவும்
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => handleSelectSuggested(q)}
                disabled={loading}
                className="text-left px-3 py-1.5 rounded-xl border border-ivory-300 bg-white text-xs text-charcoal-700 hover:border-forest-500 hover:bg-forest-50/40 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span className="font-bold text-forest-800 mr-1.5">{q.category}:</span>
                <span className="truncate max-w-[260px] inline-block align-bottom">{q.question}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat / Q&A Thread Body */}
        <div className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto bg-ivory-50/20 font-tamil">
          {activeConversation.map((msg) => (
            <div key={msg.id} className="space-y-4">
              {/* User Question Bubble */}
              {msg.question && (
                <div className="flex items-start justify-end gap-3">
                  <div className="space-y-1 max-w-xl text-right">
                    <div className="rounded-2xl rounded-tr-none bg-forest-800 text-white p-4 text-xs sm:text-sm text-left leading-relaxed shadow-xs">
                      {msg.question}
                    </div>
                    <span className="text-[10px] text-charcoal-400 font-mono pr-2">{msg.timestamp}</span>
                  </div>
                </div>
              )}

              {/* Agent Response Card */}
              <div className="flex items-start gap-3 max-w-3xl">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-forest-100 text-forest-800 font-bold text-xs shadow-2xs border border-forest-200">
                  <Sparkles className="h-4 w-4 text-forest-700" />
                </div>

                <div className="flex-1 space-y-3">
                  {/* Status indicator banner if no evidence */}
                  {(!msg.has_evidence || msg.insufficient_evidence) && msg.question && (
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-800">
                        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                        <span>நேரடி ஆதாரம் இல்லை</span>
                      </div>
                      <p className="leading-relaxed text-amber-950 font-medium">
                        {msg.answer}
                      </p>
                      <div className="pt-1 text-[11px] text-amber-800/80">
                        குறிப்பு: நினைவோசை முகப்பில் போலித் தகவல்களை தவிர்க்கும் வகையில், சேகரிக்கப்பட்ட உண்மை வாக்குமூலங்களில் இல்லாத வினாக்களுக்கு போலி பதில்கள் அளிக்கப்படாது.
                      </div>
                    </div>
                  )}

                  {/* Grounded Answer Card */}
                  {msg.has_evidence && !msg.insufficient_evidence && (
                    <div className="rounded-2xl rounded-tl-none bg-white p-5 border border-ivory-300 shadow-2xs space-y-3 text-xs sm:text-sm text-charcoal-800 leading-relaxed">
                      <div className="flex items-center justify-between border-b border-ivory-200 pb-2 mb-2">
                        <span className="text-[11px] font-bold text-forest-800 flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          வாய்மொழி ஆவண ஆதாரப் பதில்
                        </span>
                        <span className="text-[10px] text-charcoal-400 font-mono">
                          {msg.model || 'நினைவோசை RAG'}
                        </span>
                      </div>

                      <div className="whitespace-pre-line text-charcoal-900 leading-relaxed">
                        {msg.answer}
                      </div>

                      <span className="text-[10px] text-charcoal-400 font-mono block pt-1">{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Sources Section: Evidence Cards */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="rounded-2xl bg-white border border-ivory-300 p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between border-b border-ivory-200 pb-2">
                        <span className="text-[11px] font-bold text-charcoal-700 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-forest-700" />
                          சரிபார்க்கப்பட்ட மூல ஆவணங்கள் ({msg.sources.length} சான்றுகள்)
                        </span>
                        <span className="text-[10px] text-forest-700 font-semibold bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
                          சுபாபேஸ் உறுதிப்படுத்தப்பட்டது
                        </span>
                      </div>

                      <div className="space-y-3 pt-1">
                        {msg.sources.map((src, sIdx) => {
                          const excerptKey = `${msg.id}-${sIdx}`;
                          const isExpanded = !!expandedExcerpts[excerptKey];
                          const targetArchiveUrl = `/archive?q=${encodeURIComponent(src.story_title)}`;

                          return (
                            <div
                              key={excerptKey}
                              className="rounded-xl border border-ivory-200 bg-ivory-50/40 p-3.5 space-y-2 hover:border-forest-300 transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-xs sm:text-sm text-charcoal-900">
                                      {src.story_title}
                                    </h4>
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                                      பொருத்தம்: {Math.round(src.relevance_score * 100)}%
                                    </span>
                                  </div>
                                  <p className="text-xs text-charcoal-600 flex items-center gap-3">
                                    <span>சொல்லாளர்: <strong className="text-charcoal-800">{src.speaker_name}</strong></span>
                                    {src.region && (
                                      <span className="flex items-center gap-1 text-charcoal-500">
                                        <MapPin className="h-3 w-3" />
                                        {src.region}
                                      </span>
                                    )}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                                  <Link
                                    to={targetArchiveUrl}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-forest-800 bg-white px-2.5 py-1.5 rounded-lg border border-ivory-300 hover:border-forest-400 hover:bg-forest-50/50 transition-colors"
                                  >
                                    <ExternalLink className="h-3 w-3 text-forest-600" />
                                    <span>ஆவணத்தைக் காண்க</span>
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={() => toggleExcerpt(excerptKey)}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-charcoal-700 bg-white px-2.5 py-1.5 rounded-lg border border-ivory-300 hover:bg-ivory-100 transition-colors cursor-pointer"
                                  >
                                    <FileText className="h-3 w-3 text-charcoal-500" />
                                    <span>{isExpanded ? 'மறைக்க' : 'நேரடி உரை'}</span>
                                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                  </button>
                                </div>
                              </div>

                              {/* Expandable Exact Transcript Chunk */}
                              {isExpanded && (
                                <div className="mt-2 pt-2 border-t border-ivory-200 text-xs text-charcoal-800 bg-white p-3 rounded-lg border border-ivory-300 shadow-2xs leading-relaxed">
                                  <span className="text-[10px] uppercase font-bold text-forest-700 block mb-1">
                                    உண்மை வாய்மொழி உரைப்பகுதி (#{src.chunk_index}):
                                  </span>
                                  <blockquote className="italic border-l-2 border-forest-500 pl-2.5 text-charcoal-700">
                                    "{src.excerpt}"
                                  </blockquote>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-3 max-w-2xl animate-pulse font-tamil">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-forest-100 text-forest-800 font-bold text-xs">
                <RefreshCw className="h-4 w-4 text-forest-700 animate-spin" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-white p-4 border border-ivory-300 shadow-2xs space-y-2 flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-forest-800">
                  <span>வாய்மொழி ஆவணக் களஞ்சியத்தில் தேடுகிறது...</span>
                </div>
                <div className="h-3 bg-ivory-200 rounded w-5/6"></div>
                <div className="h-3 bg-ivory-200 rounded w-3/4"></div>
              </div>
            </div>
          )}

          {/* Error Message with Retry */}
          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-900 flex items-start justify-between gap-3 font-tamil">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">பிழை:</p>
                  <p>{error}</p>
                </div>
              </div>
              {lastQuery && (
                <button
                  type="button"
                  onClick={() => handleSendQuery(lastQuery)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors shrink-0 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>மீண்டும் முயற்சி</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(inputQuery);
          }}
          className="p-4 border-t border-ivory-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-tamil"
        >
          {/* Optional Category Filter Dropdown */}
          <div className="sm:w-48 shrink-0">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full rounded-2xl border border-ivory-300 bg-ivory-50/70 px-3 py-2.5 text-xs text-charcoal-800 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600"
            >
              <option value="">அனைத்துத் துறைகளும்</option>
              <option value="Agriculture">பாரம்பரிய வேளாண்மை</option>
              <option value="Traditional Medicine & Practices">நாட்டு மருத்துவம்</option>
              <option value="Water Conservation">நீர் மேலாண்மை</option>
              <option value="Traditional Crafts">பாரம்பரிய கைவினை</option>
              <option value="Food Traditions">உணவு மரபு</option>
              <option value="Folk Songs & Storytelling">நாட்டுப்புறப் பாடல்கள்</option>
              <option value="Festivals & Rituals">திருவிழாக்கள்</option>
            </select>
          </div>

          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder={TAMIL_STRINGS.aiAgent.searchPlaceholder}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-2xl border border-ivory-300 bg-ivory-50/50 px-4 py-3 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-forest-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
            />

            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-forest-800 text-white shadow-xs hover:bg-forest-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="வினாவை அனுப்புக"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-300" />
              ) : (
                <Send className="h-4 w-4 text-emerald-300 ml-0.5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
