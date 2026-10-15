import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  RotateCcw,
} from 'lucide-react';
import Badge from '../components/Badge';
import AudioUploader from '../components/AudioUploader';
import AudioRecorder from '../components/AudioRecorder';
import AudioPlayer from '../components/AudioPlayer';

export default function PreserveStoryPage() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'record'
  const [audioData, setAudioData] = useState(null); // { file, name, size, type, duration, url, source }

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

  const [formErrors, setFormErrors] = useState({});
  const [reviewModalData, setReviewModalData] = useState(null);
  const [bannerNotice, setBannerNotice] = useState(null);

  // Clean up Object URL on component unmount
  useEffect(() => {
    return () => {
      if (audioData?.url) {
        URL.revokeObjectURL(audioData.url);
      }
    };
  }, [audioData]);

  const handleAudioSelected = (data) => {
    // Revoke previous url if changing audio
    if (audioData?.url && audioData.url !== data.url) {
      URL.revokeObjectURL(audioData.url);
    }
    setAudioData(data);
    setBannerNotice(null);
    setFormErrors((prev) => ({ ...prev, audio: null }));
  };

  const handleAudioRemoved = () => {
    if (audioData?.url) {
      URL.revokeObjectURL(audioData.url);
    }
    setAudioData(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!audioData) {
      errors.audio = 'தயவுசெய்து ஒரு தமிழ் ஒலிப்பதிவுக் கோப்பைப் பதிவேற்றவும் அல்லது நேரடி ஒலிப்பதிவு செய்யவும் (Audio is required).';
    }

    if (!formData.title.trim()) {
      errors.title = 'கதையின் தலைப்பு கட்டாயமானது (Story title is required).';
    }

    if (!formData.contributorName.trim()) {
      errors.contributorName = 'கதை கூறியவரின் பெயர் கட்டாயமானது (Contributor name is required).';
    }

    if (!formData.region) {
      errors.region = 'மாவட்டம் / பகுதி தேர்வு செய்யவும் (Region is required).';
    }

    if (!formData.category) {
      errors.category = 'களப்பிரிவு தேர்வு செய்யவும் (Category is required).';
    }

    if (!formData.consentAgreed) {
      errors.consent = 'வாய்மொழி ஆவணப்படுத்தலுக்கான சமூக ஒப்புதல் உறுதிமொழி கட்டாயமானது (Consent is mandatory).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReviewProceed = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setBannerNotice({
        type: 'error',
        message: 'தயவுசெய்து படிவத்தில் விடுபட்ட விவரங்களை சரிசெய்து சமர்ப்பிக்கவும் (Please fix form validation errors).',
      });
      return;
    }

    // Open Review Summary
    setReviewModalData({
      audio: audioData,
      metadata: formData,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Notice - Phase 2 Specific */}
      <div className="rounded-xl border border-maroon-200 bg-maroon-50/60 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-maroon-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-maroon-950 leading-relaxed">
            <span className="font-bold">கட்ட நிலை 2 (Phase 2 Active): </span>
            உண்மை ஒலிப்பதிவுப் பதிவேற்றம் (Drag-and-Drop / File Picker with 25MB validation) மற்றும் உலாவி மைக்ரோஃபோன் நேரடிப் பதிவு (MediaRecorder API) செயலில் உள்ளன. 
            ஒலிப்பதிவை இயக்கி சரிபார்க்கலாம். <strong className="font-semibold text-maroon-900">கட்ட நிலை 3 இல்</strong> Hugging Face தமிழ் உரைமாற்றம் (Whisper-Tamil-Small) செயல்படுத்தப்படும்.
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-ivory-300 bg-white p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-200 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">
                புதிய வாய்மொழிப் பதிவு (Preserve a Story)
              </h1>
              <Badge variant="maroon">Phase 2: Audio Capture</Badge>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-600 font-sans mt-1">
              Select or record Tamil oral narratives, inspect audio playback, and specify community metadata.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg border border-ivory-300 bg-ivory-100 p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
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
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
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

        <form onSubmit={handleReviewProceed} className="space-y-6">
          {/* Audio Input Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                1. தமிழ் ஒலிப்பதிவு (Tamil Audio Capture) *
              </label>
              {audioData && (
                <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Audio Ready ({audioData.source === 'record' ? 'Recorded' : 'Uploaded'})</span>
                </span>
              )}
            </div>

            {/* Render selected mode */}
            {activeTab === 'upload' ? (
              <AudioUploader
                audioData={audioData}
                onAudioSelected={handleAudioSelected}
                onAudioRemoved={handleAudioRemoved}
              />
            ) : (
              <AudioRecorder
                audioData={audioData}
                onAudioRecorded={handleAudioSelected}
                onAudioDiscarded={handleAudioRemoved}
              />
            )}

            {/* Audio Validation Error */}
            {formErrors.audio && (
              <p className="mt-2 text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{formErrors.audio}</span>
              </p>
            )}
          </div>

          {/* Metadata Section */}
          <div className="pt-6 border-t border-ivory-200">
            <h2 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>2. வாய்மொழி வரலாறு பற்றிய விவரங்கள் (Oral History Metadata) *</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  கதையின் தலைப்பு (Story Title / Topic) *
                </label>
                <input
                  type="text"
                  placeholder="எ.கா: காவிரி டெல்டா பாரம்பரிய ஏர் உழவு முறை (e.g. Traditional ploughing wisdom of Delta)"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (formErrors.title) setFormErrors({ ...formErrors, title: null });
                  }}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-1 ${
                    formErrors.title
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-ivory-300 focus:border-maroon-500 focus:ring-maroon-500'
                  }`}
                />
                {formErrors.title && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{formErrors.title}</p>
                )}
              </div>

              {/* Contributor Name */}
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  கதை கூறியவர் / மூத்தோர் பெயர் (Contributor / Narrator Name) *
                </label>
                <input
                  type="text"
                  placeholder="எ.கா: க. முத்துக்கிருஷ்ணன் (K. Muthukrishnan)"
                  value={formData.contributorName}
                  onChange={(e) => {
                    setFormData({ ...formData, contributorName: e.target.value });
                    if (formErrors.contributorName)
                      setFormErrors({ ...formErrors, contributorName: null });
                  }}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-1 ${
                    formErrors.contributorName
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-ivory-300 focus:border-maroon-500 focus:ring-maroon-500'
                  }`}
                />
                {formErrors.contributorName && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{formErrors.contributorName}</p>
                )}
              </div>

              {/* Contributor Age */}
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  வயது / தலைமுறை (Age / Generation)
                </label>
                <input
                  type="text"
                  placeholder="எ.கா: 74 வயது (74 years)"
                  value={formData.contributorAge}
                  onChange={(e) =>
                    setFormData({ ...formData, contributorAge: e.target.value })
                  }
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

              {/* Cultural Category */}
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
          <div
            className={`rounded-xl border p-4 transition-colors ${
              formErrors.consent
                ? 'border-rose-300 bg-rose-50/60'
                : 'border-ivory-300 bg-ivory-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                id="consent"
                type="checkbox"
                checked={formData.consentAgreed}
                onChange={(e) => {
                  setFormData({ ...formData, consentAgreed: e.target.checked });
                  if (formErrors.consent) setFormErrors({ ...formErrors, consent: null });
                }}
                className="mt-1 h-4 w-4 rounded border-ivory-300 text-maroon-800 focus:ring-maroon-500 cursor-pointer"
              />
              <label htmlFor="consent" className="text-xs text-charcoal-700 leading-relaxed cursor-pointer">
                <strong className="text-charcoal-900">சமூக ஒப்புதல் உறுதிமொழி (Informed Cultural Consent) *: </strong>
                இக்கதை கூறியவரிடம் வாய்மொழி வரலாற்றை பொது பயன்பாட்டிற்கும் கலாச்சார ஆராய்ச்சிக்கும் ஆவணப்படுத்த முழு முன்-அனுமதி பெறப்பட்டுள்ளது. (I certify that informed verbal/written consent has been granted by the narrator for digital cultural archiving.)
              </label>
            </div>
            {formErrors.consent && (
              <p className="mt-2 text-xs font-semibold text-rose-600 pl-7">{formErrors.consent}</p>
            )}
          </div>

          {/* Banner notification if any */}
          {bannerNotice && (
            <div
              className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
                bannerNotice.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-ivory-200 text-charcoal-800 border border-ivory-300'
              }`}
            >
              <Info className="h-4 w-4 shrink-0 text-maroon-700" />
              <span>{bannerNotice.message}</span>
            </div>
          )}

          {/* Submit Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-ivory-200">
            <div className="text-xs text-charcoal-500">
              * Required fields: Tamil Audio, Title, Contributor, Region, Category, Consent.
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-maroon-800 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-maroon-900 transition-colors"
            >
              <Eye className="h-4 w-4 text-gold-300" />
              <span>ஒலிப்பதிவை மதிப்பாய்வு செய் (Review Audio & Metadata)</span>
              <ArrowRight className="h-4 w-4 ml-0.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Review Modal - Phase 2 Session State */}
      {reviewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-ivory-300 space-y-5">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="phase">Phase 2 Verified</Badge>
                  <span className="text-xs font-bold text-maroon-800">Browser Session Ready</span>
                </div>
                <h3 className="text-lg font-bold text-charcoal-900">
                  தயாரிக்கப்பட்ட வாய்மொழிப் பதிவு மதிப்பாய்வு (Story Review)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setReviewModalData(null)}
                className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-800"
              >
                மூடுக (Close)
              </button>
            </div>

            {/* Audio Preview Card */}
            <div className="rounded-xl bg-ivory-50 p-4 border border-ivory-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-charcoal-800 flex items-center gap-1.5">
                  <FileAudio className="h-4 w-4 text-maroon-700" />
                  <span>{reviewModalData.audio.name}</span>
                </span>
                <span className="font-mono text-charcoal-500">
                  {reviewModalData.audio.sizeFormatted} • {reviewModalData.audio.durationFormatted}
                </span>
              </div>
              <AudioPlayer
                src={reviewModalData.audio.url}
                title={reviewModalData.audio.name}
              />
            </div>

            {/* Metadata Summary */}
            <div className="rounded-xl border border-ivory-200 p-4 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-charcoal-700">
                <div>
                  <span className="text-charcoal-400 block">தலைப்பு:</span>
                  <strong className="text-charcoal-900 text-sm">{reviewModalData.metadata.title}</strong>
                </div>
                <div>
                  <span className="text-charcoal-400 block">கூறியவர்:</span>
                  <strong className="text-charcoal-900 text-sm">
                    {reviewModalData.metadata.contributorName}{' '}
                    {reviewModalData.metadata.contributorAge ? `(${reviewModalData.metadata.contributorAge})` : ''}
                  </strong>
                </div>
                <div>
                  <span className="text-charcoal-400 block">மண்டலம்:</span>
                  <strong className="text-charcoal-900">{reviewModalData.metadata.region}</strong>
                </div>
                <div>
                  <span className="text-charcoal-400 block">களப்பிரிவு:</span>
                  <strong className="text-charcoal-900">{reviewModalData.metadata.category}</strong>
                </div>
                {reviewModalData.metadata.description && (
                  <div className="col-span-2 pt-1 border-t border-ivory-200">
                    <span className="text-charcoal-400 block">குறிப்பு:</span>
                    <p className="text-charcoal-800 italic mt-0.5">{reviewModalData.metadata.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Phase 3 Roadmap Notice - Honesty requirement */}
            <div className="rounded-xl bg-gold-50/70 border border-gold-300 p-4 text-xs text-gold-950 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-gold-900">
                <Sparkles className="h-4 w-4 text-gold-700" />
                <span>அடுத்த கட்டம் (Next Step - Phase 3):</span>
              </div>
              <p>
                ஒலிப்பதிவு மற்றும் விவரங்கள் பிரவுசர் அமர்வில் வெற்றிகரமாக சரிபார்க்கப்பட்டு தயாராக உள்ளன.
              </p>
              <p className="text-[11px] text-charcoal-700 font-sans">
                In <strong>Phase 3</strong>, this validated audio file will be submitted to the isolated FastAPI backend pipeline for automated Tamil speech-to-text conversion using the Hugging Face <code>vasista22/whisper-tamil-small</code> model. No fake server upload or mock transcript is produced in Phase 2.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewModalData(null)}
                className="rounded-xl border border-ivory-300 bg-white px-4 py-2 text-xs font-semibold text-charcoal-700 hover:bg-ivory-100"
              >
                மீண்டும் திருத்து (Edit Details)
              </button>
              <button
                type="button"
                onClick={() => setReviewModalData(null)}
                className="rounded-xl bg-maroon-800 px-5 py-2 text-xs font-semibold text-white hover:bg-maroon-900"
              >
                சரிபார்ப்பு முடிந்தது (Ready for Phase 3)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
