import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Sliders,
  Volume2,
  Database,
  Cpu,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
} from 'lucide-react';
import Badge from '../components/Badge';

export default function SettingsPage() {
  const [preferences, setPreferences] = useState({
    language: 'ta',
    dialectPreset: 'all',
    audioQuality: 'high',
    autoPlayAudio: false,
    showTamilTranscriptsFirst: true,
  });

  const [savedStatus, setSavedStatus] = useState(false);

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ivory-300 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">
              அமைப்புகள் மற்றும் விருப்பத்தேர்வுகள் (Settings)
            </h1>
            <Badge variant="demo">Preferences</Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 font-sans mt-1">
            Application configurations, language display modes, and backend pipeline status.
          </p>
        </div>
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-ivory-300 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-ivory-200 pb-3 mb-4">
            <User className="h-4 w-4 text-maroon-700" />
            <h2 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
              பயனாளர் சுயவிவரம் (Contributor Profile)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-charcoal-700 mb-1">
                பெயர் (Contributor / Archivist Name)
              </label>
              <input
                type="text"
                defaultValue="கள ஆய்வாளர் (Field Researcher)"
                className="w-full rounded-lg border border-ivory-300 bg-white px-3 py-2 text-sm text-charcoal-900 focus:border-maroon-500 focus:outline-none focus:ring-1 focus:ring-maroon-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-700 mb-1">
                பங்களிப்பாளர் பங்கு (Archival Role)
              </label>
              <input
                type="text"
                defaultValue="வாய்மொழி வரலாற்று ஆவணப் பதிவாளர் (Oral Historian)"
                disabled
                className="w-full rounded-lg border border-ivory-200 bg-ivory-100 px-3 py-2 text-sm text-charcoal-600 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Display & Language Preferences */}
        <div className="rounded-2xl border border-ivory-300 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-ivory-200 pb-3 mb-4">
            <Globe className="h-4 w-4 text-maroon-700" />
            <h2 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
              மொழி மற்றும் காட்சி விருப்பங்கள் (Language & Display)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-charcoal-900">
                  முதன்மை இடைமுக மொழி (Primary UI Language)
                </p>
                <p className="text-xs text-charcoal-500 font-sans">
                  Dual Tamil/English labels are rendered throughout the application.
                </p>
              </div>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="rounded-lg border border-ivory-300 bg-white px-3 py-1.5 text-xs font-medium text-charcoal-800"
              >
                <option value="ta">தமிழ் (Tamil Primary)</option>
                <option value="en">English (Secondary)</option>
              </select>
            </div>

            <div className="flex items-center justify-between border-t border-ivory-200 pt-3">
              <div>
                <p className="text-sm font-semibold text-charcoal-900">
                  தமிழில் உரையை முன்னிலைப்படுத்தல் (Prioritize Tamil Unicode Transcripts)
                </p>
                <p className="text-xs text-charcoal-500 font-sans">
                  Show verbatim Tamil text above English summaries in archive stories.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.showTamilTranscriptsFirst}
                onChange={() => handleToggle('showTamilTranscriptsFirst')}
                className="h-4 w-4 rounded border-ivory-300 text-maroon-800 focus:ring-maroon-500"
              />
            </div>
          </div>
        </div>

        {/* System & Architecture Status Card */}
        <div className="rounded-2xl border border-ivory-300 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-ivory-200 pb-3 mb-4">
            <Cpu className="h-4 w-4 text-maroon-700" />
            <h2 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
              கட்டமைப்பு மற்றும் சேவைகள் நிலை (System & Pipeline Status)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-ivory-50 p-3.5 border border-ivory-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-charcoal-800">FastAPI Backend:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Ready (GET /health)
                </span>
              </div>
              <p className="text-charcoal-500 font-sans">CORS configured for Vite localhost:5173</p>
            </div>

            <div className="rounded-xl bg-ivory-50 p-3.5 border border-ivory-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-charcoal-800">Tamil Whisper Model:</span>
                <span className="text-amber-700 font-bold">Planned for Phase 3</span>
              </div>
              <p className="text-charcoal-500 font-sans">vasista22/whisper-tamil-small (Isolated service)</p>
            </div>

            <div className="rounded-xl bg-ivory-50 p-3.5 border border-ivory-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-charcoal-800">Supabase Storage & DB:</span>
                <span className="text-amber-700 font-bold">Planned for Phase 6</span>
              </div>
              <p className="text-charcoal-500 font-sans">Audio bucket + stories relational schema</p>
            </div>

            <div className="rounded-xl bg-ivory-50 p-3.5 border border-ivory-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-charcoal-800">Heritage AI Agent:</span>
                <span className="text-amber-700 font-bold">Planned for Phase 8</span>
              </div>
              <p className="text-charcoal-500 font-sans">Evidence-grounded Tamil RAG pipeline</p>
            </div>
          </div>
        </div>

        {/* Saved Feedback Alert */}
        {savedStatus && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>விருப்பத்தேர்வுகள் சேமிக்கப்பட்டன (Client-side preferences updated).</span>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-charcoal-500">
            * Note: Account authentication and backend database sync are not fabricated in Phase 1.
          </p>
          <button
            type="submit"
            className="rounded-xl bg-maroon-800 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-maroon-900 transition-colors"
          >
            விருப்பங்களைச் சேமிக்க (Save Preferences)
          </button>
        </div>
      </form>
    </div>
  );
}
