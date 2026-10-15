import React from 'react';
import { MapPin, User, Clock, Tag, Volume2, ArrowRight } from 'lucide-react';
import Badge from './Badge';

export default function StoryCard({ story, onSelect }) {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-ivory-300 bg-white p-5 shadow-sm transition-all duration-200 hover:border-maroon-300 hover:shadow-md">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-maroon-700 bg-maroon-50 px-2.5 py-0.5 rounded-full border border-maroon-100">
              {story.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-charcoal-600 bg-ivory-100 px-2 py-0.5 rounded-md border border-ivory-200">
              <MapPin className="h-3 w-3 text-gold-600" />
              {story.region}
            </span>
          </div>
          {story.isDemo && (
            <Badge variant="demo">Demo Data</Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-charcoal-900 text-lg leading-snug group-hover:text-maroon-800 transition-colors">
          {story.title}
        </h3>
        <p className="text-xs text-charcoal-500 font-sans mt-0.5 mb-3 italic">
          {story.titleEn}
        </p>

        {/* Excerpt / Summary */}
        <p className="text-sm text-charcoal-700 leading-relaxed line-clamp-3 mb-4">
          {story.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {story.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[11px] text-charcoal-600 bg-ivory-100 px-2 py-0.5 rounded border border-ivory-200"
            >
              <Tag className="h-2.5 w-2.5 text-gold-600" />
              {tag}
            </span>
          ))}
          {story.tags.length > 3 && (
            <span className="text-[11px] text-charcoal-400 self-center">
              +{story.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-ivory-200">
        <div className="flex items-center justify-between text-xs text-charcoal-600 mb-3">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-charcoal-400" />
            <span className="truncate max-w-[170px]">{story.contributor}</span>
          </div>
          <div className="flex items-center gap-1 text-charcoal-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{story.duration}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect && onSelect(story)}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-maroon-200 bg-maroon-50/50 py-2 text-xs font-medium text-maroon-800 transition-colors hover:bg-maroon-100 hover:text-maroon-900"
        >
          <Volume2 className="h-3.5 w-3.5 text-maroon-700" />
          <span>கதையை வாசிக்க (View Story)</span>
          <ArrowRight className="h-3 w-3 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
