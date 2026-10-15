import React from 'react';
import { MapPin, User, Clock, Play } from 'lucide-react';
import Badge from './Badge';

export default function StoryCard({ story, onSelect }) {
  return (
    <div
      onClick={() => onSelect && onSelect(story)}
      className="group flex flex-col justify-between rounded-2xl border border-[#E5DDCF] bg-white shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#073D2B]/50 cursor-pointer h-full"
    >
      <div>
        {/* Top Image Thumbnail with Play Overlay */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F0EBE0]">
          <img
            src={story.image || '/farmer_ramasamy.jpg'}
            alt={story.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/farmer_ramasamy.jpg';
            }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141A17]/65 via-transparent to-transparent pointer-events-none" />

          {/* Centered Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all pointer-events-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073D2B]/85 text-white backdrop-blur-xs shadow-md border border-white/30">
              <Play className="h-4 w-4 fill-white ml-0.5" />
            </div>
          </div>

          {/* Category Pill top left */}
          <div className="absolute top-2.5 left-2.5">
            <span className="rounded-md bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-[#073D2B] shadow-xs border border-white/60">
              {story.category}
            </span>
          </div>

          {/* Duration Pill bottom right */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-md bg-[#141A17]/85 px-2 py-0.5 text-[11px] font-mono font-medium text-white backdrop-blur-xs border border-white/10">
            <Clock className="h-3 w-3 text-[#52D19D]" />
            <span>{story.duration}</span>
          </div>
        </div>

        {/* Content Body with tightened spacing to prevent excessive card height */}
        <div className="p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-bold text-[#141A17] text-sm sm:text-base leading-snug group-hover:text-[#073D2B] transition-colors line-clamp-1">
                {story.title}
              </h3>
              {story.isDemo && (
                <Badge variant="demo">மாதிரி</Badge>
              )}
            </div>

            {/* Subtitle in Tamil */}
            {story.titleTa && (
              <p className="text-xs text-[#525A56] font-tamil mb-2.5 line-clamp-1">
                {story.titleTa}
              </p>
            )}

            {/* Metadata: Contributor & Region */}
            <div className="space-y-1 text-xs text-[#525A56] mb-3">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#073D2B] shrink-0" />
                <span className="font-semibold text-[#262D2A] truncate">
                  {story.contributor} {story.contributorRole ? `(${story.contributorRole})` : ''}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[#6B7570]">
                <MapPin className="h-3.5 w-3.5 text-[#135C43] shrink-0" />
                <span className="truncate">{story.region}</span>
              </div>
            </div>
          </div>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-[#F0EBE0]">
            {story.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold text-[#073D2B] bg-[#E8F3EE] px-2 py-0.5 rounded-md border border-[#CDE5D8]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
