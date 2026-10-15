import React from 'react';
import {
  MapPin,
  User,
  Clock,
  Play,
  VolumeX,
  ArrowRight,
  FileText,
} from 'lucide-react';
import Badge from './Badge';

/**
 * ArchiveStoryCard (Phase 7)
 * ==========================
 * Polished, responsive story card designed specifically for the Searchable Archive.
 * Clearly differentiates stories with audio recordings from transcript-only records.
 */
export default function ArchiveStoryCard({ story, onSelect }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onSelect) {
        onSelect(story);
      }
    }
  };

  return (
    <article
      tabIndex={0}
      role="button"
      onClick={() => onSelect && onSelect(story)}
      onKeyDown={handleKeyDown}
      aria-label={`Open story: ${story.title}`}
      className="group flex flex-col justify-between rounded-2xl border border-ivory-300 bg-white shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md hover:border-forest-700/50 cursor-pointer h-full focus:outline-none focus:ring-2 focus:ring-forest-600 select-none"
    >
      <div>
        {/* Top Thumbnail Container */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-ivory-200">
          <img
            src={story.image || '/farmer_ramasamy.jpg'}
            alt={story.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/farmer_ramasamy.jpg';
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/20 to-transparent pointer-events-none" />

          {/* Center Indicator (Play or Transcript icon) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all pointer-events-none">
            {story.hasAudio ? (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-900/90 text-ivory-50 backdrop-blur-xs shadow-md border border-ivory-100/30">
                <Play className="h-5 w-5 fill-ivory-50 ml-0.5 text-ivory-50" />
              </div>
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-charcoal-900/80 text-gold-300 backdrop-blur-xs shadow-md border border-ivory-100/20">
                <FileText className="h-5 w-5" />
              </div>
            )}
          </div>

          {/* Top-Left Category Badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className="rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-bold text-forest-900 shadow-xs border border-white/60 font-tamil">
              {story.category}
            </span>
          </div>

          {/* Top-Right Demo Badge */}
          {story.isDemo && (
            <div className="absolute top-2.5 right-2.5">
              <Badge variant="demo">மாதிரித் தரவு</Badge>
            </div>
          )}

          {/* Bottom Audio / Duration Status */}
          <div className="absolute bottom-2.5 right-2.5">
            {story.hasAudio ? (
              <div className="flex items-center gap-1.5 rounded-lg bg-charcoal-950/85 px-2 py-0.5 text-[11px] font-mono font-medium text-ivory-50 backdrop-blur-xs border border-white/10 shadow-xs">
                <Clock className="h-3 w-3 text-emerald-400" />
                <span>{story.audioDurationFormatted || '00:00'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 rounded-lg bg-amber-950/90 px-2 py-0.5 text-[10px] font-medium text-amber-200 backdrop-blur-xs border border-amber-500/30 shadow-xs">
                <VolumeX className="h-3 w-3 text-amber-300" />
                <span className="font-tamil">உரை மட்டுமே</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-charcoal-950 text-sm sm:text-base leading-snug group-hover:text-forest-800 transition-colors line-clamp-2 font-tamil">
              {story.title}
            </h3>

            {story.titleEn && (
              <p className="text-xs text-charcoal-500 mt-1 line-clamp-1 italic">
                {story.titleEn}
              </p>
            )}

            {/* Contributor and Region Metadata */}
            <div className="mt-3 space-y-1.5 text-xs text-charcoal-600">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-forest-700 shrink-0" />
                <span className="font-semibold text-charcoal-800 truncate font-tamil">
                  {story.contributor}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-charcoal-500">
                <MapPin className="h-3.5 w-3.5 text-forest-600 shrink-0" />
                <span className="truncate font-tamil">{story.region}</span>
              </div>
            </div>

            {/* Summary Excerpt */}
            {story.summary && (
              <p className="mt-2.5 text-xs text-charcoal-600 font-tamil line-clamp-2 leading-relaxed">
                {story.summary}
              </p>
            )}
          </div>

          {/* Tags Footer */}
          <div className="mt-3.5 pt-2.5 border-t border-ivory-200 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {story.tags?.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium text-forest-800 bg-forest-50 px-2 py-0.5 rounded-md border border-forest-200/60 font-tamil truncate max-w-[120px]"
                >
                  #{tag}
                </span>
              ))}
              {story.tags?.length > 2 && (
                <span className="text-[10px] text-charcoal-400 self-center">
                  +{story.tags.length - 2}
                </span>
              )}
            </div>

            <span className="text-xs font-bold text-forest-800 group-hover:text-forest-950 flex items-center gap-1 shrink-0 font-tamil">
              <span>வாசிக்க</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
