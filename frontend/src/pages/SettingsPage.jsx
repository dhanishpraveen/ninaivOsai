import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  CheckCircle2,
  Globe,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import Badge from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { TAMIL_STRINGS } from '../constants/tamilStrings';

export default function SettingsPage() {
  const { user, userName, userInitials, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'settings'
  const [preferences, setPreferences] = useState({
    language: 'ta',
    audioQuality: 'high',
    showTamilTranscriptsFirst: true,
  });

  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('[Settings] Logout error:', err);
    }
  };

  const userEmail = user?.email || 'archivist@ninaivosai.org';

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Profile Header */}
      <div className="rounded-3xl border border-ivory-300 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-ivory-200">
          <div className="flex items-center gap-4">
            <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-forest-900 text-emerald-300 text-xl font-extrabold border-2 border-forest-600 shadow-sm font-tamil">
              {userInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 font-tamil">
                  {userName}
                </h1>
                <Badge variant="phase">ஆவணக் காப்பாளர்</Badge>
              </div>
              <p className="text-xs text-charcoal-500 font-tamil mt-0.5">
                {userEmail} • {TAMIL_STRINGS.settings.userRole}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto font-tamil">
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{TAMIL_STRINGS.settings.logoutButton}</span>
            </button>
          </div>
        </div>

        {/* 4 Profile Stats in Pure Tamil */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 font-tamil">
          <div className="rounded-2xl bg-ivory-50 p-4 border border-ivory-200 text-center">
            <span className="text-2xl font-extrabold text-forest-900 block font-sans">12</span>
            <span className="text-xs text-charcoal-600">{TAMIL_STRINGS.settings.stats.recordedStories}</span>
          </div>

          <div className="rounded-2xl bg-ivory-50 p-4 border border-ivory-200 text-center">
            <span className="text-2xl font-extrabold text-forest-900 block font-sans">5</span>
            <span className="text-xs text-charcoal-600">{TAMIL_STRINGS.settings.stats.bookmarks}</span>
          </div>

          <div className="rounded-2xl bg-ivory-50 p-4 border border-ivory-200 text-center">
            <span className="text-2xl font-extrabold text-forest-900 block font-sans">24</span>
            <span className="text-xs text-charcoal-600">{TAMIL_STRINGS.settings.stats.questionsAsked}</span>
          </div>

          <div className="rounded-2xl bg-ivory-50 p-4 border border-ivory-200 text-center">
            <span className="text-2xl font-extrabold text-forest-900 block font-sans">3</span>
            <span className="text-xs text-charcoal-600">{TAMIL_STRINGS.settings.stats.collections}</span>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-ivory-300 gap-4 text-xs font-semibold text-charcoal-600 font-tamil">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'border-forest-800 text-forest-950 font-bold'
              : 'border-transparent hover:text-charcoal-900'
          }`}
        >
          {TAMIL_STRINGS.settings.tabs.pipeline}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'border-forest-800 text-forest-950 font-bold'
              : 'border-transparent hover:text-charcoal-900'
          }`}
        >
          {TAMIL_STRINGS.settings.tabs.preferences}
        </button>
      </div>

      {/* Tab 1: System Pipeline Status in Pure Tamil */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl border border-ivory-300 bg-white p-6 shadow-xs space-y-4 font-tamil">
          <div className="flex items-center gap-2 border-b border-ivory-200 pb-3">
            <Cpu className="h-4 w-4 text-forest-700" />
            <h2 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
              கணினி தொழில்நுட்ப கட்டமைப்பு நிலை
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl bg-ivory-50 p-4 border border-ivory-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-charcoal-900">{TAMIL_STRINGS.settings.pipeline.backend}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {TAMIL_STRINGS.settings.pipeline.backendReady}
                </span>
              </div>
              <p className="text-charcoal-500 font-sans">Port 8001 • CORS: localhost:5173</p>
            </div>

            <div className="rounded-2xl bg-ivory-50 p-4 border border-ivory-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-charcoal-900">{TAMIL_STRINGS.settings.pipeline.stt}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {TAMIL_STRINGS.settings.pipeline.sttReady}
                </span>
              </div>
              <p className="text-charcoal-500 font-sans">vasista22/whisper-tamil-small</p>
            </div>

            <div className="rounded-2xl bg-ivory-50 p-4 border border-ivory-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-charcoal-900">{TAMIL_STRINGS.settings.pipeline.supabase}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {TAMIL_STRINGS.settings.pipeline.supabaseReady}
                </span>
              </div>
              <p className="text-charcoal-500 font-sans">PostgreSQL, Auth & Storage</p>
            </div>

            <div className="rounded-2xl bg-ivory-50 p-4 border border-ivory-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-charcoal-900">{TAMIL_STRINGS.settings.pipeline.rag}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {TAMIL_STRINGS.settings.pipeline.ragReady}
                </span>
              </div>
              <p className="text-charcoal-500 font-sans">Gemini 3.1 Flash Lite RAG</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Language & Display Settings in Pure Tamil */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSave} className="rounded-3xl border border-ivory-300 bg-white p-6 shadow-xs space-y-6 font-tamil">
          <div className="flex items-center gap-2 border-b border-ivory-200 pb-3">
            <Globe className="h-4 w-4 text-forest-700" />
            <h2 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
              {TAMIL_STRINGS.settings.preferences.title}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-charcoal-900">
                  {TAMIL_STRINGS.settings.preferences.languageLabel}
                </p>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  இத்தளத்தின் அனைத்துப் பக்கங்களும் இயல்பாகவே முழுமையான தமிழில் வடிவமைக்கப்பட்டுள்ளன.
                </p>
              </div>
              <div className="rounded-xl border border-ivory-300 bg-ivory-50 px-3 py-1.5 text-xs font-semibold text-charcoal-800">
                {TAMIL_STRINGS.settings.preferences.tamilOnly}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-ivory-200 pt-3">
              <div>
                <p className="text-sm font-semibold text-charcoal-900">
                  {TAMIL_STRINGS.settings.preferences.highlightTamil}
                </p>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  {TAMIL_STRINGS.settings.preferences.highlightTamilDesc}
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.showTamilTranscriptsFirst}
                onChange={() =>
                  setPreferences((p) => ({
                    ...p,
                    showTamilTranscriptsFirst: !p.showTamilTranscriptsFirst,
                  }))
                }
                className="h-4 w-4 rounded border-ivory-300 text-forest-800 focus:ring-forest-600 cursor-pointer"
              />
            </div>
          </div>

          {savedStatus && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{TAMIL_STRINGS.settings.preferences.savedSuccess}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl bg-forest-800 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-forest-900 transition-colors cursor-pointer"
            >
              {TAMIL_STRINGS.settings.preferences.saveButton}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
