import React, { useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  User,
  Calendar,
  Clock,
  Tag,
  Volume2,
  VolumeX,
  FileText,
  Copy,
  Check,
  ArrowLeft,
} from 'lucide-react';
import Badge from './Badge';
import AudioPlayer from './AudioPlayer';

/**
 * StoryDetailView
 * ===============
 * Full-screen modal detailed view for exploring a preserved Tamil oral history record in pure Tamil.
 */
export default function StoryDetailView({ story, onClose }) {
  const [copiedTranscript, setCopiedTranscript] = React.useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!story) return null;

  const handleCopyTranscript = () => {
    if (story.transcript) {
      navigator.clipboard.writeText(story.transcript);
      setCopiedTranscript(true);
      setTimeout(() => setCopiedTranscript(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-charcoal-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200 font-sans"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-ivory-50 text-charcoal-900 shadow-2xl border border-ivory-300 p-5 sm:p-7 md:p-8 space-y-6 focus:outline-none"
      >
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-ivory-300 font-tamil">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-950 bg-forest-50 hover:bg-forest-100 px-3 py-1.5 rounded-xl border border-forest-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>ஆவணத்திற்குத் திரும்பு</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="விவரங்களை மூடுக"
            className="p-1.5 rounded-xl text-charcoal-400 hover:text-charcoal-800 hover:bg-ivory-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Story Thumbnail / Image Banner */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl bg-ivory-200 border border-ivory-300 shadow-xs">
          <img
            src={story.image || '/story_fallback_cultural.svg'}
            alt={story.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/story_fallback_cultural.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-charcoal-950/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 font-tamil">
            {story.isContributorImage && (
              <span className="rounded-lg bg-emerald-950/90 text-emerald-300 px-2.5 py-1 text-xs font-bold border border-emerald-500/40 shadow-xs">
                பங்களிப்பாளர் சமர்ப்பித்த படம்
              </span>
            )}
            {story.isDemo && (
              <Badge variant="demo">மாதிரிப் படம்</Badge>
            )}
          </div>
        </div>

        {/* Story Header */}
        <div className="space-y-2.5 font-tamil">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-forest-900 text-gold-300 px-3 py-0.5 text-xs font-bold border border-forest-700">
              {story.category}
            </span>
            {story.cropOrTopic && (
              <span className="rounded-lg bg-ivory-200 text-charcoal-700 px-2.5 py-0.5 text-xs font-medium border border-ivory-300">
                {story.cropOrTopic}
              </span>
            )}
            {story.isDemo && (
              <Badge variant="demo">மாதிரித் தரவு</Badge>
            )}
          </div>

          <h2 id="story-modal-title" className="text-xl sm:text-2xl md:text-3xl font-extrabold text-charcoal-950 leading-tight">
            {story.title}
          </h2>
        </div>

        {/* Metadata Grid in Pure Tamil */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-2xl border border-ivory-300 text-xs shadow-xs font-tamil">
          <div>
            <span className="text-charcoal-400 block text-[11px]">கதை கூறியவர்</span>
            <strong className="text-charcoal-900 font-semibold text-sm flex items-center gap-1 mt-0.5">
              <User className="h-3.5 w-3.5 text-forest-700 shrink-0" />
              <span className="truncate">{story.contributor}</span>
            </strong>
            {story.contributorRole && (
              <span className="text-[10px] text-charcoal-500 block truncate">{story.contributorRole}</span>
            )}
          </div>

          <div>
            <span className="text-charcoal-400 block text-[11px]">மாவட்டம் / பகுதி</span>
            <strong className="text-charcoal-900 font-semibold text-sm flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-forest-700 shrink-0" />
              <span className="truncate">{story.region}</span>
            </strong>
          </div>

          <div>
            <span className="text-charcoal-400 block text-[11px]">பதிவு செய்த நாள்</span>
            <strong className="text-charcoal-900 font-medium text-sm flex items-center gap-1 mt-0.5 font-sans">
              <Calendar className="h-3.5 w-3.5 text-charcoal-500 shrink-0" />
              <span>{story.date}</span>
            </strong>
          </div>

          <div>
            <span className="text-charcoal-400 block text-[11px]">கால அளவு</span>
            <strong className="text-charcoal-900 font-mono font-medium text-sm flex items-center gap-1 mt-0.5 font-sans">
              <Clock className="h-3.5 w-3.5 text-charcoal-500 shrink-0" />
              <span>{story.hasAudio ? story.audioDurationFormatted : 'இல்லை'}</span>
            </strong>
          </div>
        </div>

        {/* Audio Player or Missing Audio Indicator */}
        <div className="space-y-2 font-tamil">
          {story.hasAudio && story.audioUrl ? (
            <div className="rounded-2xl bg-white p-4 border border-ivory-300 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-forest-900">
                <Volume2 className="h-4 w-4 text-emerald-600" />
                <span>அசல் வாய்மொழி ஒலிப்பதிவு</span>
              </div>
              <AudioPlayer src={story.audioUrl} title={story.title} />
            </div>
          ) : (
            <div className="rounded-2xl bg-amber-50/80 p-4 border border-amber-200 text-amber-900 flex items-start gap-3">
              <VolumeX className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs">
                <h4 className="font-bold text-amber-950">
                  ஒலிப்பதிவு இணைக்கப்படவில்லை
                </h4>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  இப்பதிவு வாய்மொழி உரைப்பகுதியாக மட்டுமே ஆவணப்படுத்தப்பட்டுள்ளது. கீழே உள்ள முழுமையான உரை ஆவணத்தைப் படிக்கலாம்.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cultural Summary */}
        {story.summary && (
          <div className="rounded-2xl bg-white p-4 sm:p-5 border border-ivory-300 shadow-xs space-y-2 font-tamil">
            <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-forest-800" />
              <span>கலாச்சாரச் சுருக்கம்</span>
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed">
              {story.summary}
            </p>
          </div>
        )}

        {/* Verbatim Full Transcript */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 border border-ivory-300 shadow-xs space-y-3 font-tamil">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <h4 className="text-xs sm:text-sm font-bold text-forest-950 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-forest-800" />
              <span>முழுமையான வாய்மொழி உரை</span>
            </h4>

            <button
              type="button"
              onClick={handleCopyTranscript}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-forest-800 hover:text-forest-950 bg-forest-50 hover:bg-forest-100 px-2.5 py-1 rounded-lg border border-forest-200 transition-colors"
            >
              {copiedTranscript ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>நகலெடுக்கப்பட்டது!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>உரையை நகலெடு</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-ivory-100/60 border border-ivory-200 text-charcoal-900 text-sm sm:text-base leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
            {story.transcript || 'உரைப்பகுதி எதுவும் கிடைக்கவில்லை.'}
          </div>
        </div>

        {/* Topic Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="space-y-2 font-tamil">
            <h4 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-forest-700" />
              <span>வகைப்படுத்தப்பட்ட குறிச்சொற்கள்</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {story.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs text-forest-900 bg-forest-50 px-3 py-1 rounded-lg border border-forest-200 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-ivory-300 flex items-center justify-between font-tamil">
          <span className="text-xs text-charcoal-500">
            நினைவோசை • தமிழ் வாய்மொழி வரலாற்றுப் பாதுகாப்புத் திட்டம்
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-forest-900 hover:bg-forest-950 px-5 py-2 text-xs font-bold text-ivory-50 shadow-sm transition-colors active:scale-95"
          >
            மூடுக
          </button>
        </div>
      </div>
    </div>
  );
}
