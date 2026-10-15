import React, { useState } from 'react';
import {
  UploadCloud,
  Mic,
  AlertCircle,
  FileAudio,
  ShieldCheck,
  Info,
  Calendar,
  MapPin,
  User,
  Globe,
  Tag,
  Sparkles,
} from 'lucide-react';
import Badge from '../components/Badge';

export default function PreserveStoryPage() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'record'
  const [formData, setFormData] = useState({
    title: '',
    contributorName: '',
    contributorAge: '',
    region: 'தஞ்சாவூர் (Thanjavur)',
    dialect: 'வட்டாரத் தமிழ் (Colloquial / Regional Tamil)',
    category: 'விவசாய மரபு (Agriculture)',
    description: '',
    consentAgreed: false,
  });

  const [notification, setNotification] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consentAgreed) {
      setNotification({
        type: 'error',
        message: 'தயவுசெய்து வாய்மொழிப் பகிர்வுக்கான ஒப்புதல் படிவத்தை சரிபார்க்கவும் (Consent is mandatory).',
      });
      return;
    }

    // Explicit Phase 1 notice: Do NOT claim backend operations succeeded
    setNotification({
      type: 'info',
      message: 'கட்ட நிலை 1 (Phase 1): UI மாதிரி மட்டுமே செயலில் உள்ளது. ஒலிப்பதிவுப் பதிவேற்றம் மற்றும் தமிழ் உரைமாற்றம் கட்ட நிலை 2 & 3 இல் செயல்படுத்தப்படும்.',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <span className="font-bold">Phase 1 Development Notice: </span>
            This screen provides the preservation workflow layout and metadata collection interface. 
            Live audio capture (MediaRecorder API) will be implemented in <strong className="font-semibold text-maroon-900">Phase 2</strong>, 
            and Hugging Face Tamil speech-to-text transcription in <strong className="font-semibold text-maroon-900">Phase 3</strong>. 
            No simulated transcription or fake audio storage operations will take place.
          </div>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="rounded-2xl border border-ivory-300 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-200 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">
                புதிய வாய்மொழிப் பதிவு (Preserve a Story)
              </h1>
              <Badge variant="maroon">படி 1: உள்ளீடு</Badge>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-600 font-sans mt-1">
              Capture or upload Tamil oral narrative, specify metadata, and record ethical consent.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg border border-ivory-300 bg-ivory-100 p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-maroon-900 shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <UploadCloud className="h-4 w-4" />
              <span>கோப்பு பதிவேற்றம் (Upload)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('record')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'record'
                  ? 'bg-white text-maroon-900 shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <Mic className="h-4 w-4" />
              <span>நேரடி ஒலிப்பதிவு (Record)</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Audio Input Area */}
          <div>
            <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2">
              ஒலிப்பதிவுக் கோப்பு அல்லது நேரடிப் பதிவு (Tamil Audio Input)
            </label>

            {activeTab === 'upload' ? (
              /* Upload Area */
              <div className="border-2 border-dashed border-ivory-300 rounded-xl p-8 text-center bg-ivory-50/50 hover:bg-ivory-50 hover:border-maroon-300 transition-colors">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-maroon-50 text-maroon-800 mx-auto mb-3 border border-maroon-100">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <p className="text-sm font-semibold text-charcoal-900">
                  தமிழ் ஒலிப்பதிவுக் கோப்பை இங்கே இழுத்துவிடவும் (Drag & Drop Tamil Audio)
                </p>
                <p className="text-xs text-charcoal-500 font-sans mt-1">
                  Supports MP3, WAV, M4A, OGG, or FLAC (Max 50MB)
                </p>
                <div className="mt-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-maroon-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-maroon-900 transition-colors">
                    <FileAudio className="h-4 w-4 text-gold-300" />
                    <span>கோப்பைத் தேர்ந்தெடுக்க (Browse Files)</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNotification({
                            type: 'info',
                            message: `தேர்ந்தெடுக்கப்பட்ட கோப்பு: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB). ஒலி பாகுபாடு & உரைமாற்றம் Phase 2 & 3 இல் செயல்படுத்தப்படும்.`,
                          });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              /* Record Audio Placeholder Area */
              <div className="border-2 border-dashed border-maroon-200 rounded-xl p-8 text-center bg-maroon-50/20">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-maroon-100 text-maroon-800 mx-auto mb-3">
                  <Mic className="h-7 w-7" />
                </div>
                <p className="text-sm font-semibold text-charcoal-900">
                  நேரடி உலாவி ஒலிப்பதிவு (Direct Browser Audio Recording)
                </p>
                <p className="text-xs text-charcoal-500 max-w-md mx-auto mt-1">
                  In-browser audio capture with real-time audio visualizer waveform and pause/resume controls will be unlocked in <strong>Phase 2</strong>.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-maroon-200 bg-white px-4 py-2 text-xs font-semibold text-maroon-800">
                  <Sparkles className="h-4 w-4 text-gold-600" />
                  <span>MediaRecorder Interface Ready for Phase 2</span>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Form Fields */}
          <div className="pt-4 border-t border-ivory-200">
            <h2 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>வாய்மொழி வரலாறு பற்றிய விவரங்கள் (Metadata)</span>
              <span className="text-xs font-normal text-charcoal-500 lowercase">(story context)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  கதையின் தலைப்பு (Story Title / Topic) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="எ.கா: காவிரி டெல்டா பாரம்பரிய ஏர் உழவு முறை (e.g. Cauvery delta ploughing wisdom)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-ivory-300 bg-white px-3.5 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-maroon-500 focus:outline-none focus:ring-1 focus:ring-maroon-500"
                />
              </div>

              {/* Contributor Name */}
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  கதை கூறியவர் / மூத்தோர் பெயர் (Contributor / Narrator Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="எ.கா: க. முத்துக்கிருஷ்ணன் (K. Muthukrishnan)"
                  value={formData.contributorName}
                  onChange={(e) => setFormData({ ...formData, contributorName: e.target.value })}
                  className="w-full rounded-lg border border-ivory-300 bg-white px-3.5 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-maroon-500 focus:outline-none focus:ring-1 focus:ring-maroon-500"
                />
              </div>

              {/* Contributor Age / Generation */}
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  வயது / தலைமுறை (Age / Generation)
                </label>
                <input
                  type="text"
                  placeholder="எ.கா: 74 வயது (74 years)"
                  value={formData.contributorAge}
                  onChange={(e) => setFormData({ ...formData, contributorAge: e.target.value })}
                  className="w-full rounded-lg border border-ivory-300 bg-white px-3.5 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-maroon-500 focus:outline-none focus:ring-1 focus:ring-maroon-500"
                />
              </div>

              {/* Region */}
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  மாவட்டம் / வட்டாரம் (Region / District) *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full rounded-lg border border-ivory-300 bg-white px-3.5 py-2 text-sm text-charcoal-900 focus:border-maroon-500 focus:outline-none focus:ring-1 focus:ring-maroon-500"
                >
                  <option value="தஞ்சாவூர் (Thanjavur)">தஞ்சாவூர் (Thanjavur - Delta)</option>
                  <option value="காஞ்சிபுரம் (Kanchipuram)">காஞ்சிபுரம் (Kanchipuram - Thondai)</option>
                  <option value="மதுரை (Madurai)">மதுரை (Madurai - Pandiya)</option>
                  <option value="தூத்துக்குடி (Thoothukudi)">தூத்துக்குடி (Thoothukudi - Maritime)</option>
                  <option value="கோயம்புத்தூர் (Coimbatore)">கோயம்புத்தூர் (Coimbatore - Kongu)</option>
                  <option value="காரைக்குடி / சிவகங்கை (Chettinad)">காரைக்குடி / சிவகங்கை (Chettinad)</option>
                  <option value="திருநெல்வேலி (Tirunelveli)">திருநெல்வேலி (Tirunelveli)</option>
                  <option value="ஈரோடு (Erode)">ஈரோடு (Erode)</option>
                  <option value="பிற வட்டாரங்கள் (Other Region)">பிற வட்டாரங்கள் (Other Region)</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  களப்பிரிவு (Cultural Category) *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-ivory-300 bg-white px-3.5 py-2 text-sm text-charcoal-900 focus:border-maroon-500 focus:outline-none focus:ring-1 focus:ring-maroon-500"
                >
                  <option value="விவசாய மரபு (Agriculture)">விவசாய மரபு (Agriculture & Farming)</option>
                  <option value="கைவினைக் கலை (Artisans)">கைவினைக் கலை (Traditional Crafts & Weaving)</option>
                  <option value="நாட்டுப்புற மருத்துவம் (Folk Medicine)">நாட்டுப்புற மருத்துவம் (Folk Medicine & Herbals)</option>
                  <option value="நாட்டுப்புற கலை & பாடல் (Folklore & Music)">நாட்டுப்புற கலை & பாடல் (Folklore, Ballads & Music)</option>
                  <option value="கடல் & மீனவர் மரபு (Maritime)">கடல் & மீனவர் மரபு (Maritime & Coastal Lore)</option>
                  <option value="உணவு மரபு (Culinary Lore)">உணவு மரபு (Traditional Cuisine & Recipes)</option>
                  <option value="வரலாற்று நினைவுகள் (Oral Memoirs)">வரலாற்று நினைவுகள் (Elder Community Memoirs)</option>
                </select>
              </div>

              {/* Language / Dialect */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  மொழி நடை / வட்டார வழக்கு (Language / Dialect Specification)
                </label>
                <input
                  type="text"
                  value={formData.dialect}
                  onChange={(e) => setFormData({ ...formData, dialect: e.target.value })}
                  className="w-full rounded-lg border border-ivory-300 bg-white px-3.5 py-2 text-sm text-charcoal-900 focus:border-maroon-500 focus:outline-none focus:ring-1 focus:ring-maroon-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  பதிவின் சுருக்கமான குறிப்பு (Brief Context & Background)
                </label>
                <textarea
                  rows={3}
                  placeholder="பதிவு செய்யப்பட்ட சூழல், விவாதிக்கப்பட்ட முக்கிய தகவல்கள் பற்றிய குறிப்பு..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-ivory-300 bg-white px-3.5 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-maroon-500 focus:outline-none focus:ring-1 focus:ring-maroon-500"
                />
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="rounded-xl border border-ivory-300 bg-ivory-50 p-4">
            <div className="flex items-start gap-3">
              <input
                id="consent"
                type="checkbox"
                required
                checked={formData.consentAgreed}
                onChange={(e) => setFormData({ ...formData, consentAgreed: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-ivory-300 text-maroon-800 focus:ring-maroon-500"
              />
              <label htmlFor="consent" className="text-xs text-charcoal-700 leading-relaxed cursor-pointer">
                <strong className="text-charcoal-900">சமூக ஒப்புதல் உறுதிமொழி (Informed Cultural Consent): </strong>
                இக்கதை கூறியவரிடம் வாய்மொழி வரலாற்றை பொது பயன்பாட்டிற்கும் கலாச்சார ஆராய்ச்சிக்கும் ஆவணப்படுத்த முழு முன்-அனுமதி பெறப்பட்டுள்ளது. (I certify that informed verbal/written consent has been granted by the narrator for digital cultural archiving.)
              </label>
            </div>
          </div>

          {/* Notification Alert if any */}
          {notification && (
            <div
              className={`rounded-lg p-3 text-xs flex items-center gap-2 ${
                notification.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-ivory-200 text-charcoal-800 border border-ivory-300'
              }`}
            >
              <Info className="h-4 w-4 shrink-0 text-maroon-700" />
              <span>{notification.message}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-ivory-200">
            <div className="text-xs text-charcoal-500">
              * Required fields for metadata preservation
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-maroon-800 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-maroon-900 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-gold-300" />
              <span>அடுத்த படி: உரைமாற்றத்திற்குச் செல்ல (Proceed to Transcribe)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
