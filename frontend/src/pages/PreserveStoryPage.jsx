import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  Tag,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Loader2,
  RefreshCw,
  Edit3,
  Database,
  Check,
  Send,
  ExternalLink,
} from 'lucide-react';
import Badge from '../components/Badge';
import AudioUploader from '../components/AudioUploader';
import AudioRecorder from '../components/AudioRecorder';
import AudioPlayer from '../components/AudioPlayer';
import {
  transcribeAudioFile,
  publishStory,
  getSupabaseStatus,
  generateStoryMetadata,
} from '../services/api';

const DISTRICTS = [
  'Thanjavur (தஞ்சாவூர்)',
  'Madurai (மதுரை)',
  'Tiruvannamalai (திருவண்ணாமலை)',
  'Coimbatore (கோயம்புத்தூர்)',
  'Tirunelveli (திருநெல்வேலி)',
  'Dindigul (திண்டுக்கல்)',
  'Sivagangai (சிவகங்கை)',
  'Salem (சேலம்)',
  'Tiruchirappalli (திருச்சிராப்பள்ளி)',
  'Erode (ஈரோடு)',
  'Kanyakumari (கன்னியாகுமரி)',
  'Cuddalore (கடலூர்)',
  'Nagapattinam (நாகப்பட்டினம்)',
  'Pudukkottai (புதுக்கோட்டை)',
  'Vellore (வேலூர்)',
  'Other / Custom (மற்றவை)',
];

const CATEGORIES = [
  { id: 'Agriculture', en: 'Agriculture', ta: 'விவசாயம் & உழவு மரபு' },
  { id: 'Traditional Medicine & Practices', en: 'Traditional Medicine & Practices', ta: 'சித்த மருத்துவம் & மூலிகை' },
  { id: 'Folk Songs & Storytelling', en: 'Folk Songs & Storytelling', ta: 'நாட்டுப்புற கலை & வாய்மொழிக் கதை' },
  { id: 'Festivals & Rituals', en: 'Festivals & Rituals', ta: 'திருவிழாக்கள் & வழிபாட்டு மரபு' },
  { id: 'Traditional Crafts', en: 'Traditional Crafts', ta: 'பாரம்பரிய கைவினை & நெசவு' },
  { id: 'Food Traditions', en: 'Food Traditions', ta: 'பாரம்பரிய உணவு முறை' },
  { id: 'Water Conservation', en: 'Water Conservation', ta: 'நீர் மேலாண்மை & கண்மாய்' },
  { id: 'Local History', en: 'Local History', ta: 'ஊர் வரலாறு & தொன்மம்' },
  { id: 'Other', en: 'Other', ta: 'மற்றவை' },
];

export default function PreserveStoryPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'upload' ? 'upload' : 'record';
  const [activeTab, setActiveTab] = useState(initialMode); // 'record' | 'upload'
  const [currentStep, setCurrentStep] = useState(1); // 1: Audio, 2: Transcript, 3: Details, 4: Review, 5: Published

  // Audio State
  const [audioData, setAudioData] = useState(null); // { file, name, size, type, duration, url, source }

  // Transcription State (Phase 3)
  const [transcriptionState, setTranscriptionState] = useState('idle'); // 'idle' | 'transcribing' | 'completed' | 'error'
  const [transcriptionData, setTranscriptionData] = useState(null);
  const [rawTranscript, setRawTranscript] = useState(''); // Original unmodified ASR text
  const [editedTranscript, setEditedTranscript] = useState(''); // User reviewed/edited text
  const [transcriptionError, setTranscriptionError] = useState(null);

  // Story Details Form State (Phase 4)
  const [formData, setFormData] = useState({
    title: '',
    contributorName: '', // Storyteller
    uploaderName: '',    // Uploader when different
    villageOrTown: '',
    district: 'Thanjavur (தஞ்சாவூர்)',
    customDistrict: '',
    category: 'Agriculture',
    customCategory: '',
    cropOrTopic: 'Paddy / Rice (நெல்)',
    tags: 'irrigation, organic farming, cauvery delta',
    recordingDate: new Date().toISOString().split('T')[0],
    description: '',
    consentAgreed: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [bannerNotice, setBannerNotice] = useState(null);

  // Metadata Generation State (Phase 5)
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);

  // Publishing State (Phase 4)
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedResult, setPublishedResult] = useState(null);
  const [supabaseStatus, setSupabaseStatus] = useState(null);

  // Check Supabase connection on mount
  useEffect(() => {
    async function checkSupabase() {
      try {
        const status = await getSupabaseStatus();
        setSupabaseStatus(status);
      } catch (err) {
        console.warn('Could not check Supabase status:', err);
      }
    }
    checkSupabase();
  }, []);

  // Clean up Object URL on component unmount
  useEffect(() => {
    return () => {
      if (audioData?.url) {
        URL.revokeObjectURL(audioData.url);
      }
    };
  }, [audioData]);

  const handleAudioSelected = (data) => {
    if (audioData?.url && audioData.url !== data.url) {
      URL.revokeObjectURL(audioData.url);
    }
    setAudioData(data);
    setBannerNotice(null);
    setFormErrors((prev) => ({ ...prev, audio: null }));
    // Reset transcription state when new audio is chosen
    setTranscriptionState('idle');
    setTranscriptionData(null);
    setRawTranscript('');
    setEditedTranscript('');
    setTranscriptionError(null);
  };

  const handleAudioRemoved = () => {
    if (audioData?.url) {
      URL.revokeObjectURL(audioData.url);
    }
    setAudioData(null);
    setTranscriptionState('idle');
    setTranscriptionData(null);
    setRawTranscript('');
    setEditedTranscript('');
    setTranscriptionError(null);
    setCurrentStep(1);
  };

  // Helper to load bundled sample Tamil audio for testing
  const handleLoadSampleAudio = async () => {
    try {
      setBannerNotice({
        type: 'info',
        message: 'மாதிரி தமிழ் ஒலிப்பதிவு ஏற்றப்படுகிறது...',
      });
      const response = await fetch('/test_sample_tamil.wav');
      if (!response.ok) throw new Error('Sample audio not found');
      const blob = await response.blob();
      const file = new File([blob], 'test_sample_tamil.wav', { type: 'audio/wav' });
      const objectUrl = URL.createObjectURL(blob);

      const sampleAudio = {
        file,
        name: 'test_sample_tamil.wav',
        size: blob.size,
        sizeFormatted: `${(blob.size / 1024).toFixed(1)} KB`,
        type: 'audio/wav',
        extension: 'WAV',
        duration: 5.3,
        durationFormatted: '00:05',
        url: objectUrl,
        source: 'sample',
      };

      handleAudioSelected(sampleAudio);
      setFormData((prev) => ({
        ...prev,
        title: 'தஞ்சாவூர் நெல் சாகுபடி வாய்மொழி வரலாறு',
        contributorName: 'ராமசாமி (மூத்த உழவர்)',
        uploaderName: 'தனிஷ் (ஆவணக் காப்பாளர்)',
        villageOrTown: 'திருவையாறு',
        district: 'Thanjavur (தஞ்சாவூர்)',
        category: 'Agriculture',
        cropOrTopic: 'பாரம்பரிய நெல் சாகுபடி',
        tags: 'பாரம்பரிய நெல், பாசனம், டெல்டா வரலாறு, இயற்கை உழவு',
        description: 'காவிரி டெல்டா பகுதியில் ஆனிப் பட்டத்து உழவு மற்றும் பாரம்பரிய நஞ்சை நில மேலாண்மை அனுபவங்களின் வாய்மொழிப் பதிவு.',
        consentAgreed: true,
      }));
      setBannerNotice({
        type: 'success',
        message: 'மாதிரி தமிழ் ஒலிப்பதிவு ஏற்றப்பட்டது! அடுத்த படியில் உரைமாற்றம் செய்யலாம்.',
      });
    } catch (err) {
      setBannerNotice({
        type: 'error',
        message: `மாதிரி ஒலிப்பதிவை ஏற்றுவதில் பிழை: ${err.message}`,
      });
    }
  };

  // Handle Speech-to-Text Transcription via Phase 3 backend
  const handleStartTranscription = async () => {
    if (!audioData?.file) {
      setBannerNotice({
        type: 'error',
        message: 'தயவுசெய்து முதலில் ஒரு ஒலிப்பதிவுக் கோப்பைத் தேர்ந்தெடுக்கவும்.',
      });
      return;
    }

    if (transcriptionState === 'transcribing') {
      return;
    }

    setTranscriptionState('transcribing');
    setTranscriptionError(null);

    try {
      const result = await transcribeAudioFile(audioData.file, audioData.name || 'recording.wav');
      setTranscriptionData(result);
      setRawTranscript(result.text || '');
      setEditedTranscript(result.text || '');
      setTranscriptionState('completed');
      setBannerNotice({
        type: 'success',
        message: 'தமிழ் பேச்சு வெற்றிகரமாக உரைமாற்றம் செய்யப்பட்டது.',
      });
    } catch (err) {
      console.error('Transcription error:', err);
      setTranscriptionError(err.message || 'Speech recognition failed.');
      setTranscriptionState('error');
      setBannerNotice({
        type: 'error',
        message: `உரைமாற்றப் பிழை: ${err.message}`,
      });
    }
  };

  // Phase 5: Auto-generate Story Metadata (Title, Summary, Category, Tags) via AI
  const handleAutoGenerateMetadata = async () => {
    if (!editedTranscript.trim()) {
      setBannerNotice({
        type: 'error',
        message: 'தயவுசெய்து முதலில் தமிழ் உரையை உள்ளிடவும் அல்லது உரைமாற்றம் செய்யவும்.',
      });
      return;
    }

    setIsGeneratingMetadata(true);
    setBannerNotice({
      type: 'info',
      message: 'AI தமிழ் உரையை பகுப்பாய்வு செய்து தலைப்பு, சுருக்கம், குறிச்சொற்களை உருவாக்குகிறது...',
    });

    try {
      const meta = await generateStoryMetadata({
        transcript: editedTranscript.trim(),
        include_english_summary: true,
      });

      // Match canonical category or fallback
      let matchedCategory = meta.category || formData.category;
      const validCategoryIds = CATEGORIES.map((c) => c.id);
      if (!validCategoryIds.includes(matchedCategory)) {
        // Attempt case-insensitive or partial match
        const found = CATEGORIES.find(
          (c) => c.id.toLowerCase() === matchedCategory.toLowerCase() ||
                 c.en.toLowerCase().includes(matchedCategory.toLowerCase())
        );
        matchedCategory = found ? found.id : 'Other';
      }

      const tagsString = Array.isArray(meta.tags) && meta.tags.length > 0
        ? meta.tags.join(', ')
        : (Array.isArray(meta.keywords) ? meta.keywords.join(', ') : formData.tags);

      setFormData((prev) => ({
        ...prev,
        title: meta.title || prev.title,
        description: meta.summary || prev.description,
        category: matchedCategory,
        customCategory: matchedCategory === 'Other' && meta.category ? meta.category : prev.customCategory,
        tags: tagsString || prev.tags,
      }));

      setBannerNotice({
        type: 'success',
        message: `✨ AI விவரங்கள் வெற்றிகரமாக உருவாக்கப்பட்டன! ("${meta.title}")`,
      });
    } catch (err) {
      console.warn('Metadata generation failed:', err);
      setBannerNotice({
        type: 'error',
        message: `AI விவர உருவாக்குவதில் பிழை: ${err.message}`,
      });
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  // Step 2 -> Step 3 Validation
  const handleProceedToDetails = () => {
    if (!editedTranscript.trim()) {
      setBannerNotice({
        type: 'error',
        message: 'தமிழ் உரை காலியாக உள்ளது. தயவுசெய்து உரைமாற்றம் செய்யவும் அல்லது உரையை உள்ளிடவும்.',
      });
      return;
    }
    setCurrentStep(3);
  };

  // Step 3 -> Step 4 Validation
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'கதையின் தலைப்பு கட்டாயமானது.';
    }

    if (!formData.contributorName.trim()) {
      errors.contributorName = 'கதை கூறியவரின் பெயர் கட்டாயமானது.';
    }

    if (!formData.villageOrTown.trim()) {
      errors.villageOrTown = 'கிராமம் அல்லது ஊரின் பெயர் கட்டாயமானது.';
    }

    if (!formData.district) {
      errors.district = 'மாவட்டம் தேர்வு செய்யவும்.';
    } else if (formData.district.startsWith('Other') && !formData.customDistrict.trim()) {
      errors.customDistrict = 'தயவுசெய்து மாவட்டப் பெயரை உள்ளிடவும்.';
    }

    if (!formData.category) {
      errors.category = 'களப்பிரிவு தேர்வு செய்யவும்.';
    } else if (formData.category === 'Other' && !formData.customCategory.trim()) {
      errors.customCategory = 'தயவுசெய்து பிரிவின் பெயரை உள்ளிடவும்.';
    }

    if (!formData.consentAgreed) {
      errors.consent = 'வாய்மொழி ஆவணப்படுத்தலுக்கான சமூக ஒப்புதல் உறுதிமொழி கட்டாயமானது.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToReview = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setBannerNotice({
        type: 'error',
        message: 'தயவுசெய்து படிவத்தில் விடுபட்ட விவரங்களை சரிசெய்து சமர்ப்பிக்கவும்.',
      });
      return;
    }
    setBannerNotice(null);
    setCurrentStep(4);
  };

  // Step 4: Publish Story to Supabase via backend endpoint
  const handlePublishStory = async () => {
    if (isPublishing) return;

    if (!formData.consentAgreed) {
      setBannerNotice({
        type: 'error',
        message: 'பதிவிடுவதற்கான சமூக ஒப்புதல் உறுதிமொழி கட்டாயமானது.',
      });
      return;
    }

    if (!editedTranscript.trim()) {
      setBannerNotice({
        type: 'error',
        message: 'தமிழ் பேச்சு உரை காலியாக இருக்கக்கூடாது.',
      });
      return;
    }

    if (!audioData?.file) {
      setBannerNotice({
        type: 'error',
        message: 'ஒலிப்பதிவுக் கோப்பு விடுபட்டுள்ளது. ஒலியைப் பதிவு செய்யவும் அல்லது பதிவேற்றவும்.',
      });
      return;
    }

    setIsPublishing(true);
    setBannerNotice({
      type: 'info',
      message: 'ஒலிப்பதிவு மற்றும் கதை விவரங்கள் சுபாபேஸ் களஞ்சியத்தில் பதிவேற்றப்படுகின்றன...',
    });

    const finalDistrict = formData.district.startsWith('Other')
      ? formData.customDistrict.trim()
      : formData.district;

    const finalCategory = formData.category === 'Other'
      ? formData.customCategory.trim()
      : formData.category;

    try {
      const result = await publishStory({
        audioFile: audioData.file,
        audioFilename: audioData.name || 'recording.wav',
        title: formData.title,
        contributorName: formData.contributorName,
        uploaderName: formData.uploaderName,
        villageOrTown: formData.villageOrTown,
        district: finalDistrict,
        category: finalCategory,
        cropOrTopic: formData.cropOrTopic,
        tags: formData.tags,
        recordingDate: formData.recordingDate,
        description: formData.description,
        transcript: editedTranscript,
        originalTranscript: rawTranscript,
        consentConfirmed: formData.consentAgreed,
        audioDurationSeconds: audioData.duration,
      });

      setPublishedResult(result);
      setCurrentStep(5); // Success state
      setBannerNotice({
        type: 'success',
        message: 'கதை வெற்றிகரமாக சுபாபேஸ் களஞ்சியத்தில் பாதுகாக்கப்பட்டது!',
      });
    } catch (err) {
      console.error('Publish error:', err);
      // Detailed error reporting without fabricating success
      let displayMessage = err.message || 'கதையைச் சேமிப்பதில் பிழை ஏற்பட்டது.';
      if (err.detail?.missing) {
        displayMessage = `சுபாபேஸ் கட்டமைப்பு தேவை: ${err.detail.message || displayMessage} (${err.detail.missing.join(', ')})`;
      }
      setBannerNotice({
        type: 'error',
        message: displayMessage,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleResetForNewStory = () => {
    handleAudioRemoved();
    setFormData({
      title: '',
      contributorName: '',
      uploaderName: '',
      villageOrTown: '',
      district: 'Thanjavur (தஞ்சாவூர்)',
      customDistrict: '',
      category: 'Agriculture',
      customCategory: '',
      cropOrTopic: 'Paddy / Rice (நெல்)',
      tags: '',
      recordingDate: new Date().toISOString().split('T')[0],
      description: '',
      consentAgreed: false,
    });
    setPublishedResult(null);
    setCurrentStep(1);
    setBannerNotice(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/dashboard"
              className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-ivory-200 transition-colors"
              title="முகப்புப் பலகைக்குத் திரும்பு"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight font-tamil">
              வாய்மொழி வரலாற்றை ஆவணப்படுத்துக
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 font-tamil pl-8">
            முழுமையான ஆவணப்படுத்தல் முறை: ஒலிப்பதிவு → தமிழ் பேச்சு உரை → சரிபார்த்தல் → கதை விவரங்கள் → சமூக ஒப்புதல் → களஞ்சியத்தில் பதிவேற்றம்.
          </p>
        </div>

        {/* Supabase Status Pill */}
        <div className="self-start sm:self-auto flex items-center gap-2">
          {supabaseStatus?.configured ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900 border border-emerald-200 shadow-2xs font-tamil">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>சுபாபேஸ் இணைக்கப்பட்டுள்ளது</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-200 shadow-2xs font-tamil"
              title="சுபாபேஸ் திட்டம்"
            >
              <Database className="h-3.5 w-3.5 text-amber-600" />
              <span>திட்டம்: cfnqbwxgtzusysfmirby</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress Steps Header */}
      <div className="rounded-2xl border border-ivory-300 bg-white p-3 sm:p-4 shadow-2xs">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center font-tamil">
          {/* Step 1: Audio */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${
              currentStep === 1
                ? 'bg-forest-800 text-white font-bold shadow-xs'
                : audioData
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'text-charcoal-500 hover:bg-ivory-100'
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                currentStep === 1
                  ? 'bg-white text-forest-800'
                  : audioData
                  ? 'bg-emerald-600 text-white'
                  : 'bg-ivory-200 text-charcoal-700'
              }`}
            >
              {audioData && currentStep !== 1 ? <Check className="h-3.5 w-3.5" /> : '1'}
            </div>
            <span className="text-[11px] sm:text-xs">1. ஒலிப்பதிவு</span>
          </button>

          {/* Step 2: Transcript */}
          <button
            type="button"
            disabled={!audioData}
            onClick={() => audioData && setCurrentStep(2)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${
              currentStep === 2
                ? 'bg-forest-800 text-white font-bold shadow-xs'
                : editedTranscript.trim()
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : !audioData
                ? 'opacity-40 cursor-not-allowed text-charcoal-400'
                : 'text-charcoal-500 hover:bg-ivory-100'
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                currentStep === 2
                  ? 'bg-white text-forest-800'
                  : editedTranscript.trim()
                  ? 'bg-emerald-600 text-white'
                  : 'bg-ivory-200 text-charcoal-700'
              }`}
            >
              {editedTranscript.trim() && currentStep !== 2 ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                '2'
              )}
            </div>
            <span className="text-[11px] sm:text-xs">2. பேச்சு உரை ஆய்வு</span>
          </button>

          {/* Step 3: Details */}
          <button
            type="button"
            disabled={!audioData || !editedTranscript.trim()}
            onClick={() => audioData && editedTranscript.trim() && setCurrentStep(3)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${
              currentStep === 3
                ? 'bg-forest-800 text-white font-bold shadow-xs'
                : formData.title && formData.contributorName && formData.consentAgreed
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : !audioData || !editedTranscript.trim()
                ? 'opacity-40 cursor-not-allowed text-charcoal-400'
                : 'text-charcoal-500 hover:bg-ivory-100'
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                currentStep === 3
                  ? 'bg-white text-forest-800'
                  : formData.title && formData.contributorName && formData.consentAgreed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-ivory-200 text-charcoal-700'
              }`}
            >
              {formData.title && formData.contributorName && formData.consentAgreed && currentStep !== 3 ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                '3'
              )}
            </div>
            <span className="text-[11px] sm:text-xs">3. கதை விவரங்கள்</span>
          </button>

          {/* Step 4: Publish */}
          <button
            type="button"
            disabled={!audioData || !editedTranscript.trim() || !formData.title}
            onClick={() => audioData && editedTranscript.trim() && formData.title && setCurrentStep(4)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${
              currentStep === 4
                ? 'bg-forest-800 text-white font-bold shadow-xs'
                : currentStep === 5
                ? 'bg-emerald-600 text-white font-bold'
                : !audioData || !editedTranscript.trim() || !formData.title
                ? 'opacity-40 cursor-not-allowed text-charcoal-400'
                : 'text-charcoal-500 hover:bg-ivory-100'
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                currentStep >= 4
                  ? 'bg-white text-forest-800'
                  : 'bg-ivory-200 text-charcoal-700'
              }`}
            >
              4
            </div>
            <span className="text-[11px] sm:text-xs">4. சரிபார்த்து பதிவேற்றுக</span>
          </button>
        </div>
      </div>

      {/* Global Notice Banner */}
      {bannerNotice && (
        <div
          className={`rounded-2xl p-4 text-xs flex items-center justify-between gap-3 shadow-xs border ${
            bannerNotice.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : bannerNotice.type === 'info'
              ? 'bg-blue-50 text-blue-900 border-blue-200'
              : 'bg-emerald-50 text-emerald-950 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {bannerNotice.type === 'error' ? (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            ) : bannerNotice.type === 'info' ? (
              <Info className="h-5 w-5 text-blue-600 shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            )}
            <span className="font-medium font-tamil leading-relaxed">{bannerNotice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerNotice(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100 shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          STEP 1: AUDIO CAPTURE / UPLOAD
          ========================================================================= */}
      {currentStep === 1 && (
        <div className="rounded-3xl border border-ivory-300 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="phase">படி 1 / 4</Badge>
                <h2 className="text-lg font-bold text-charcoal-900 font-tamil">
                  வாய்மொழி வரலாற்றை பதிவு செய்க அல்லது பதிவேற்றுக
                </h2>
              </div>
              <p className="text-xs text-charcoal-500 mt-1 font-tamil">
                ஏற்கனவே உள்ள கள ஒலிப்பதிவுகளைப் பதிவேற்றவும் அல்லது நேரடியாக உலாவியில் பதிவு செய்யவும் (அதிகபட்சம் 25 MB).
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex rounded-xl border border-ivory-300 bg-ivory-50 p-1 self-start sm:self-auto font-tamil">
              <button
                type="button"
                onClick={() => setActiveTab('record')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === 'record'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                <Mic className="h-3.5 w-3.5" />
                <span>ஒலியைப் பதிவு செய்க</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === 'upload'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>ஒலிப்பதிவைப் பதிவேற்றுக</span>
              </button>
            </div>
          </div>

          {/* Quick Action: Load Sample Audio */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-forest-50/70 border border-forest-200">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-forest-700 shrink-0" />
              <span className="text-xs font-medium text-forest-950 font-tamil">
                உடனடியாக சோதிக்க வேண்டுமா? தஞ்சாவூர் மாதிரி தமிழ் ஒலிப்பதிவை ஏற்றவும்:
              </span>
            </div>
            <button
              type="button"
              onClick={handleLoadSampleAudio}
              className="inline-flex items-center gap-1 rounded-xl bg-forest-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-forest-900 transition-colors shrink-0 font-tamil"
            >
              <span>+ மாதிரி ஒலியை ஏற்று</span>
            </button>
          </div>

          {/* Audio Input Component */}
          {activeTab === 'record' ? (
            <AudioRecorder
              audioData={audioData}
              onAudioRecorded={handleAudioSelected}
              onAudioDiscarded={handleAudioRemoved}
              onTranscribeClick={() => setCurrentStep(2)}
            />
          ) : (
            <AudioUploader
              audioData={audioData}
              onAudioSelected={handleAudioSelected}
              onAudioRemoved={handleAudioRemoved}
              onTranscribeClick={() => setCurrentStep(2)}
            />
          )}

          {/* Bottom Action */}
          {audioData && (
            <div className="flex items-center justify-between pt-4 border-t border-ivory-200">
              <span className="text-xs text-charcoal-500 font-tamil">
                ஒலிப்பதிவு தயார்: <strong>{audioData.name}</strong> ({audioData.sizeFormatted})
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 rounded-xl bg-forest-800 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-forest-900 transition-colors font-tamil"
              >
                <span>பேச்சு உரை ஆய்வுக்குத் தொடர்க</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STEP 2: TRANSCRIPT REVIEW & EDITING
          ========================================================================= */}
      {currentStep === 2 && (
        <div className="rounded-3xl border border-ivory-300 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="phase">படி 2 / 4</Badge>
                <h2 className="text-lg font-bold text-charcoal-900 font-tamil">
                  தமிழ் பேச்சு உரை ஆய்வு மற்றும் திருத்தம்
                </h2>
              </div>
              <p className="text-xs text-charcoal-500 mt-1 font-tamil">
                வாய்மொழிப் பதிவைக் கேட்டு, களஞ்சியத்தில் பதிவேற்றுவதற்கு முன் பிழைகள் இருப்பின் சரிசெய்யவும்.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1 self-start sm:self-auto font-tamil"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>ஒலிப்பதிவை மாற்றுக</span>
            </button>
          </div>

          {/* Audio Player Card */}
          <div className="rounded-2xl bg-ivory-50 p-5 border border-ivory-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-charcoal-900 flex items-center gap-2">
                <FileAudio className="h-4 w-4 text-forest-700" />
                <span>{audioData?.name}</span>
              </span>
              <span className="font-mono text-charcoal-500">
                {audioData?.sizeFormatted} • {audioData?.durationFormatted}
              </span>
            </div>
            {audioData?.url && (
              <AudioPlayer src={audioData.url} title={audioData.name} />
            )}
          </div>

          {/* Transcription Engine Status & Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5 font-tamil">
                <Sparkles className="h-4 w-4 text-forest-700" />
                <span>தானியங்கி பேச்சு உரைமாற்றம் (Whisper Tamil AI)</span>
              </h3>

              {transcriptionState === 'completed' && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-tamil">
                    {transcriptionData?.inference_time_seconds || 0} வினாடிகளில் பெறப்பட்டது ({transcriptionData?.device})
                  </span>
                  {rawTranscript !== editedTranscript && (
                    <button
                      type="button"
                      onClick={() => setEditedTranscript(rawTranscript)}
                      className="text-[11px] text-forest-700 hover:text-forest-900 underline font-semibold font-tamil"
                      title="தொடக்க உரைக்கு மீட்டமைக்க"
                    >
                      அசல் உரைக்கு மீட்டமை
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Transcription State Displays */}
            {transcriptionState === 'idle' && (
              <div className="rounded-2xl border border-dashed border-ivory-300 bg-ivory-50/50 p-7 text-center space-y-3">
                <Sparkles className="h-7 w-7 text-forest-700 mx-auto" />
                <div>
                  <h4 className="font-bold text-sm text-charcoal-900 font-tamil">
                    தமிழ் பேச்சு உரையாக மாற்றத் தயார்
                  </h4>
                  <p className="text-xs text-charcoal-600 mt-1 max-w-md mx-auto font-tamil">
                    ஒலிப்பதிவை உரைமாற்றம் செய்ய கீழே உள்ள பொத்தானைச் சொடுக்கவும்.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartTranscription}
                  className="inline-flex items-center gap-2 rounded-xl bg-forest-800 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-forest-900 transition-colors font-tamil"
                >
                  <Sparkles className="h-4 w-4 text-emerald-300" />
                  <span>உரைமாற்றத்தைத் தொடங்கு</span>
                </button>
              </div>
            )}

            {transcriptionState === 'transcribing' && (
              <div className="rounded-2xl border border-forest-200 bg-forest-50/60 p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[180px]">
                <Loader2 className="h-8 w-8 text-forest-800 animate-spin" />
                <div>
                  <h4 className="font-bold text-sm text-forest-950 font-tamil">
                    தமிழ் பேச்சு உரைமாற்றம் செய்யப்படுகிறது...
                  </h4>
                  <p className="text-xs text-forest-800 font-tamil mt-1">
                    தயவுசெய்து காத்திருக்கவும்...
                  </p>
                </div>
                <span className="text-[10px] text-forest-700 bg-white px-3 py-1 rounded-full border border-forest-200 font-tamil">
                  செயல்முறை: உரைமாற்றம் • மொழி: தமிழ்
                </span>
              </div>
            )}

            {transcriptionState === 'error' && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-rose-900 block font-tamil">
                      உரைமாற்றத்தில் பிழை ஏற்பட்டது
                    </strong>
                    <p className="text-xs text-rose-800 mt-0.5 font-tamil">
                      {transcriptionError}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleStartTranscription}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-forest-800 px-4 py-2 text-xs font-bold text-white hover:bg-forest-900 transition-colors font-tamil"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>மீண்டும் முயற்சிக்கவும்</span>
                </button>
              </div>
            )}

            {/* Editable Tamil Textarea */}
            {(transcriptionState === 'completed' || editedTranscript) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-charcoal-600">
                  <label className="font-semibold flex items-center gap-1.5 font-tamil">
                    <Edit3 className="h-3.5 w-3.5 text-forest-700" />
                    <span>திருத்தக்கூடிய தமிழ் உரை *</span>
                  </label>
                  {rawTranscript !== editedTranscript && (
                    <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-tamil">
                      பயனரால் திருத்தப்பட்டது
                    </span>
                  )}
                </div>

                <textarea
                  rows={6}
                  value={editedTranscript}
                  onChange={(e) => setEditedTranscript(e.target.value)}
                  placeholder="அங்கீகரிக்கப்பட்ட தமிழ் உரை இங்கே தோன்றும். தவறுகள் இருப்பின் திருத்தலாம்..."
                  className="w-full rounded-2xl border border-ivory-300 bg-white p-4 font-tamil text-sm leading-relaxed text-charcoal-900 focus:border-forest-600 focus:ring-1 focus:ring-forest-600 focus:outline-none shadow-2xs"
                />

                <p className="text-[11px] text-charcoal-500 font-tamil">
                  குறிப்பு: மேலே உள்ள ஒலிப்பதிவைக் கேட்டு வட்டார வழக்குச் சொற்கள் அல்லது பெயர்களைத் திருத்தவும்.
                </p>

                {/* AI Metadata Assistant Card */}
                <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-ivory-50 to-white p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-700 shrink-0" />
                      <span className="font-bold text-xs text-charcoal-900 font-tamil">
                        செயற்கை நுண்ணறிவு கதை விவர உதவியாளர்
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full border border-amber-200 font-tamil">
                        தானியங்கி குறிச்சொற்கள்
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 font-tamil">
                      சரிபார்க்கப்பட்ட தமிழ் உரையிலிருந்து தலைப்பு, சுருக்கம், களப்பிரிவு மற்றும் குறிச்சொற்களைத் தானாக உருவாக்கவும்.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isGeneratingMetadata}
                    onClick={handleAutoGenerateMetadata}
                    className="inline-flex items-center gap-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs px-4 py-2.5 shadow-xs transition-colors disabled:opacity-50 shrink-0 cursor-pointer font-tamil"
                  >
                    {isGeneratingMetadata ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-300" />
                        <span>விவரங்கள் உருவாக்கப்படுகின்றன...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                        <span>தானாக கதை விவரங்களை உருவாக்கு</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 2 Bottom Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-ivory-200">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-ivory-300 bg-white px-4 py-2 text-xs font-semibold text-charcoal-700 hover:bg-ivory-100 font-tamil"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>ஒலிப்பதிவுக்குத் திரும்பு</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToDetails}
              className="inline-flex items-center gap-2 rounded-xl bg-forest-800 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-forest-900 transition-colors font-tamil"
            >
              <span>கதை விவரங்களுக்குத் தொடர்க</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: STORY DETAILS & MANDATORY CONSENT FORM
          ========================================================================= */}
      {currentStep === 3 && (
        <form
          onSubmit={handleProceedToReview}
          className="rounded-3xl border border-ivory-300 bg-white p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="phase">படி 3 / 4</Badge>
                <h2 className="text-lg font-bold text-charcoal-900 font-tamil">
                  கதை விவரங்கள் மற்றும் சமூக ஒப்புதல்
                </h2>
              </div>
              <p className="text-xs text-charcoal-500 mt-1 font-tamil">
                கதைக்கான விவரங்கள், விவரிப்பாளர் அடையாளம், ஊர் மற்றும் பாதுகாப்பிற்கான சமூக ஒப்புதலைப் பதிவு செய்யவும்.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1 self-start sm:self-auto font-tamil"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>பேச்சு உரைக்குத் திரும்பு</span>
            </button>
          </div>

          {/* Quick AI Metadata Auto-fill banner in Step 3 */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-forest-50/40 to-ivory-50 border border-emerald-200/80 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-emerald-700 shrink-0" />
              <div className="text-xs font-tamil">
                <span className="font-semibold text-emerald-950">செயற்கை நுண்ணறிவு தானியங்கி நிரப்புதல்: </span>
                <span className="text-emerald-800">
                  சரிபார்க்கப்பட்ட உரையிலிருந்து தலைப்பு, சுருக்கம், பிரிவு மற்றும் குறிச்சொற்களை ஒரே சொடுக்கில் நிரப்பலாம்.
                </span>
              </div>
            </div>
            <button
              type="button"
              disabled={isGeneratingMetadata}
              onClick={handleAutoGenerateMetadata}
              className="inline-flex items-center gap-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs px-3.5 py-1.5 shadow-2xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer self-start sm:self-auto font-tamil"
            >
              {isGeneratingMetadata ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-emerald-300" />
                  <span>உருவாக்கப்படுகிறது...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 text-emerald-300" />
                  <span>விவரங்களைத் தானாக நிரப்புக</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Story Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 font-tamil">
                கதைத் தலைப்பு / பொருள் *
              </label>
              <input
                type="text"
                placeholder="எ.கா: பாரம்பரிய நெல் ரகங்கள் மற்றும் பாசன முறை"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600 font-tamil"
              />
              {formErrors.title && (
                <p className="mt-1 text-xs text-rose-600 font-tamil">{formErrors.title}</p>
              )}
            </div>

            {/* Contributor / Storyteller Name (Required) */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 font-tamil">
                கதை கூறியவர் / விவரிப்பாளர் பெயர் *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
                <input
                  type="text"
                  placeholder="எ.கா: ராமசாமி (மூத்த விவசாயி)"
                  value={formData.contributorName}
                  onChange={(e) => setFormData({ ...formData, contributorName: e.target.value })}
                  className="w-full rounded-xl border border-ivory-300 bg-white pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600 font-tamil"
                />
              </div>
              {formErrors.contributorName && (
                <p className="mt-1 text-xs text-rose-600 font-tamil">{formErrors.contributorName}</p>
              )}
            </div>

            {/* Uploader Name (Optional when different from storyteller) */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 font-tamil">
                பதிவேற்றுபவர் / சேகரிப்பாளர் பெயர் (விருப்பத்திற்குரியது)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
                <input
                  type="text"
                  placeholder="எ.கா: தனிஷ் (ஆராய்ச்சியாளர் / தன்னார்வலர்)"
                  value={formData.uploaderName}
                  onChange={(e) => setFormData({ ...formData, uploaderName: e.target.value })}
                  className="w-full rounded-xl border border-ivory-300 bg-white pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600 font-tamil"
                />
              </div>
              <span className="text-[10px] text-charcoal-500 mt-0.5 block font-tamil">
                கதை கூறியவரே நேரடியாகப் பதிவேற்றினால் இதைக் காலியாக விடலாம்.
              </span>
            </div>

            {/* Village or Town (Required) */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 font-tamil">
                கிராமம் / ஊர் *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
                <input
                  type="text"
                  placeholder="எ.கா: திருவையாறு"
                  value={formData.villageOrTown}
                  onChange={(e) => setFormData({ ...formData, villageOrTown: e.target.value })}
                  className="w-full rounded-xl border border-ivory-300 bg-white pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600 font-tamil"
                />
              </div>
              {formErrors.villageOrTown && (
                <p className="mt-1 text-xs text-rose-600 font-tamil">{formErrors.villageOrTown}</p>
              )}
            </div>

            {/* District (Required) */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 font-tamil">
                மாவட்டம் *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full rounded-xl border border-ivory-300 bg-white pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600 font-tamil"
                >
                  {DISTRICTS.map((dist) => {
                    const cleanDist = dist.includes('(') ? dist.split('(')[1].replace(')', '') : dist;
                    return (
                      <option key={dist} value={dist}>
                        {cleanDist}
                      </option>
                    );
                  })}
                </select>
              </div>
              {formData.district.startsWith('Other') && (
                <input
                  type="text"
                  placeholder="விருப்ப மாவட்டப் பெயரை உள்ளிடவும்..."
                  value={formData.customDistrict}
                  onChange={(e) => setFormData({ ...formData, customDistrict: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2 text-xs text-charcoal-900 focus:border-forest-600 focus:outline-none font-tamil"
                />
              )}
              {formErrors.district && (
                <p className="mt-1 text-xs text-rose-600 font-tamil">{formErrors.district}</p>
              )}
            </div>

            {/* Category Dropdown (Required) */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 font-tamil">
                மரபுசார் களப்பிரிவு *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600 font-tamil"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.ta}
                  </option>
                ))}
              </select>
              {formData.category === 'Other' && (
                <input
                  type="text"
                  placeholder="விருப்பக் களப்பிரிவின் பெயரை உள்ளிடவும்..."
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2 text-xs text-charcoal-900 focus:border-forest-600 focus:outline-none font-tamil"
                />
              )}
              {formErrors.category && (
                <p className="mt-1 text-xs text-rose-600 font-tamil">{formErrors.category}</p>
              )}
            </div>

            {/* Crop or Specific Topic */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 font-tamil">
                குறிப்பிட்ட பயிர் அல்லது தலைப்பு
              </label>
              <input
                type="text"
                placeholder="எ.கா: பாரம்பரிய நெல், சிறுதானியம், பனை மரபு"
                value={formData.cropOrTopic}
                onChange={(e) => setFormData({ ...formData, cropOrTopic: e.target.value })}
                className="w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600 font-tamil"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 font-tamil">
                குறிச்சொற்கள் (காற்புள்ளியால் பிரிக்கவும்)
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
                <input
                  type="text"
                  placeholder="பாசனம், இயற்கை பூச்சி விரட்டி, நாட்டுப்புற மரபு"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full rounded-xl border border-ivory-300 bg-white pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600 font-tamil"
                />
              </div>
            </div>

            {/* Recording Date */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 font-tamil">
                பதிவு செய்யப்பட்ட நாள்
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
                <input
                  type="date"
                  value={formData.recordingDate}
                  onChange={(e) => setFormData({ ...formData, recordingDate: e.target.value })}
                  className="w-full rounded-xl border border-ivory-300 bg-white pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 font-tamil">
                கூடுதல் குறிப்புகள் / வரலாற்றுப் பின்னணி (விருப்பத்திற்குரியது)
              </label>
              <textarea
                rows={3}
                placeholder="களப்பணிப் பின்னணி, பெரியவரின் வரலாற்று அனுபவம் அல்லது சூழல் குறிப்புகளை உள்ளிடவும்..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border border-ivory-300 bg-white p-3 text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600 font-tamil"
              />
            </div>
          </div>

          {/* Mandatory Archival Consent Section */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consentAgreed}
                onChange={(e) => setFormData({ ...formData, consentAgreed: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-ivory-300 text-forest-800 focus:ring-forest-600 cursor-pointer"
              />
              <div className="text-xs text-charcoal-800 leading-relaxed font-tamil">
                <strong className="block text-charcoal-900 mb-0.5">
                  தகவலறிந்த சமூக ஆவண ஒப்புதல் *
                </strong>
                இக்குரல் பதிவு மற்றும் பாரம்பரிய அறிவு, சமூகத்தின் ஒப்புதலுடன் எதிர்காலத் தலைமுறையினரின் கல்வி மற்றும் மரபுப் பாதுகாப்பிற்காக நினைவோசை பொது ஆவணக் களஞ்சியத்தில் சேர்க்கப்பட முழு ஒப்புதல் அளிக்கிறேன்.
              </div>
            </label>
            {formErrors.consent && (
              <p className="text-xs font-semibold text-rose-600 pl-7 font-tamil">{formErrors.consent}</p>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-ivory-200">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-ivory-300 bg-white px-4 py-2 text-xs font-semibold text-charcoal-700 hover:bg-ivory-100 font-tamil"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>பேச்சு உரைக்குத் திரும்பு</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-forest-800 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-forest-900 transition-colors font-tamil"
            >
              <span>இறுதிச் சரிபார்ப்புக்குத் தொடர்க</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          STEP 4: FINAL REVIEW & PUBLISH TO SUPABASE
          ========================================================================= */}
      {currentStep === 4 && (
        <div className="rounded-3xl border border-ivory-300 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="phase">படி 4 / 4</Badge>
                <h2 className="text-lg font-bold text-charcoal-900 font-tamil">
                  இறுதிச் சரிபார்ப்பு மற்றும் களஞ்சியத்தில் பதிவேற்றம்
                </h2>
              </div>
              <p className="text-xs text-charcoal-500 mt-1 font-tamil">
                அனைத்து விவரங்களையும் சரிபார்த்து, ஒலிப்பதிவு மற்றும் உரையை நினைவோசை ஆவணக் களஞ்சியத்தில் சேமிக்கவும்.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1 self-start sm:self-auto font-tamil"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>விவரங்களைத் திருத்துக</span>
            </button>
          </div>

          {/* Review Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column: Audio & Transcript Summary */}
            <div className="md:col-span-7 space-y-4">
              {/* Audio Card */}
              <div className="rounded-2xl bg-ivory-50 p-4 border border-ivory-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-charcoal-900 flex items-center gap-1.5">
                    <FileAudio className="h-4 w-4 text-forest-700" />
                    <span>{audioData?.name}</span>
                  </span>
                  <span className="text-charcoal-500 font-mono text-[11px]">
                    {audioData?.sizeFormatted} • {audioData?.durationFormatted}
                  </span>
                </div>
                {audioData?.url && <AudioPlayer src={audioData.url} title={audioData.name} />}
              </div>

              {/* Reviewed Tamil Transcript */}
              <div className="rounded-2xl border border-ivory-300 bg-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5 font-tamil">
                    <Sparkles className="h-3.5 w-3.5 text-forest-700" />
                    <span>பாதுகாக்கப்பட்ட தமிழ் உரை</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-tamil">
                    Whisper Tamil AI
                  </span>
                </div>
                <div className="rounded-xl bg-ivory-50/50 p-3 font-tamil text-sm text-charcoal-900 leading-relaxed max-h-48 overflow-y-auto border border-ivory-200">
                  {editedTranscript}
                </div>
              </div>
            </div>

            {/* Right Column: Metadata & Target Supabase Status */}
            <div className="md:col-span-5 rounded-2xl bg-ivory-50 p-5 border border-ivory-200 space-y-3 text-xs">
              <h4 className="font-bold text-charcoal-900 text-sm border-b border-ivory-200 pb-2 font-tamil">
                ஆவணக் குறிப்பு விவரங்கள்
              </h4>

              <div>
                <span className="text-charcoal-400 block text-[11px] font-tamil">கதைத் தலைப்பு:</span>
                <strong className="text-charcoal-900 text-sm font-tamil">{formData.title}</strong>
              </div>

              <div>
                <span className="text-charcoal-400 block text-[11px] font-tamil">விவரிப்பாளர்:</span>
                <span className="font-bold text-forest-900 font-tamil">{formData.contributorName}</span>
              </div>

              {formData.uploaderName && (
                <div>
                  <span className="text-charcoal-400 block text-[11px] font-tamil">பதிவேற்றுபவர்:</span>
                  <span className="text-charcoal-700 font-tamil">{formData.uploaderName}</span>
                </div>
              )}

              <div>
                <span className="text-charcoal-400 block text-[11px] font-tamil">இருப்பிடம்:</span>
                <span className="font-medium text-charcoal-800 flex items-center gap-1 mt-0.5 font-tamil">
                  <MapPin className="h-3 w-3 text-forest-700 shrink-0" />
                  <span>
                    {formData.villageOrTown},{' '}
                    {formData.district.startsWith('Other')
                      ? formData.customDistrict
                      : (formData.district.includes('(') ? formData.district.split('(')[1].replace(')', '') : formData.district)}
                  </span>
                </span>
              </div>

              <div>
                <span className="text-charcoal-400 block text-[11px] font-tamil">களப்பிரிவு & தலைப்பு:</span>
                <div className="flex flex-wrap gap-1 mt-1 font-tamil">
                  <span className="bg-white text-forest-800 font-semibold px-2 py-0.5 rounded border border-forest-100 text-[11px]">
                    {formData.category === 'Other' ? formData.customCategory : (CATEGORIES.find((c) => c.id === formData.category)?.ta || formData.category)}
                  </span>
                  {formData.cropOrTopic && (
                    <span className="bg-white text-charcoal-700 px-2 py-0.5 rounded border border-ivory-200 text-[11px]">
                      {formData.cropOrTopic}
                    </span>
                  )}
                </div>
              </div>

              {formData.tags && (
                <div>
                  <span className="text-charcoal-400 block text-[11px] font-tamil">குறிச்சொற்கள்:</span>
                  <div className="flex flex-wrap gap-1 mt-1 font-tamil">
                    {formData.tags.split(',').map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-white text-charcoal-600 px-2 py-0.5 rounded border border-ivory-200 text-[10px]"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-ivory-200">
                <span className="text-charcoal-400 block text-[11px] font-tamil">சமூக ஆவண ஒப்புதல்:</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mt-0.5 font-tamil">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>சரிபார்க்கப்பட்ட ஒப்புதல்</span>
                </span>
              </div>

              {/* Supabase Target Details */}
              <div className="pt-2 border-t border-ivory-200">
                <span className="text-charcoal-400 block text-[11px] font-tamil">சேமிப்பக இலக்கு விவரங்கள்:</span>
                <div className="text-[11px] font-mono text-charcoal-700 bg-white p-2 rounded border border-ivory-200 mt-1 space-y-0.5 font-tamil">
                  <div>திட்ட குறிப்பு: cfnqbwxgtzusysfmirby</div>
                  <div>சேமிப்பகம்: oral-history-audio</div>
                  <div>தரவு அட்டவணை: Interviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* Publish Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-ivory-200">
            <button
              type="button"
              disabled={isPublishing}
              onClick={() => setCurrentStep(3)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-ivory-300 bg-white px-5 py-2.5 text-xs font-semibold text-charcoal-700 hover:bg-ivory-100 disabled:opacity-50 font-tamil"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>விவரங்களைத் திருத்தத் திரும்பு</span>
            </button>

            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublishStory}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-forest-800 px-8 py-3 text-sm font-bold text-white shadow-xs hover:bg-forest-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-tamil"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>களஞ்சியத்தில் சேமிக்கப்படுகிறது...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 text-emerald-300" />
                  <span>களஞ்சியத்தில் பதிவிடுக</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 5: PUBLISHED SUCCESS SCREEN
          ========================================================================= */}
      {currentStep === 5 && (
        <div className="rounded-3xl border border-emerald-200 bg-white p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="h-9 w-9 text-emerald-700" />
          </div>

          <div className="space-y-2">
            <Badge variant="success">வெற்றிகரமாகப் பாதுகாக்கப்பட்டது</Badge>
            <h2 className="text-2xl font-extrabold text-charcoal-900 font-tamil">
              வாய்மொழி வரலாறு வெற்றிகரமாகப் பாதுகாக்கப்பட்டது!
            </h2>
            <p className="text-sm text-charcoal-600 max-w-lg mx-auto font-tamil">
              ஒலிப்பதிவு மற்றும் தமிழ் உரையுடன் கதை நினைவோசை ஆவணக் களஞ்சியத்தில் பாதுகாக்கப்பட்டுள்ளது.
            </p>
          </div>

          {/* Preservation Receipt */}
          <div className="max-w-md mx-auto rounded-2xl bg-ivory-50 p-5 border border-ivory-200 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
              <span className="text-charcoal-500 font-tamil">கதைத் தலைப்பு:</span>
              <strong className="text-charcoal-900 font-tamil">{formData.title}</strong>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
              <span className="text-charcoal-500 font-tamil">விவரிப்பாளர்:</span>
              <span className="font-semibold text-charcoal-800 font-tamil">{formData.contributorName}</span>
            </div>

            {publishedResult?.story_id && (
              <div className="flex items-center justify-between pb-2 border-b border-ivory-200 font-mono text-[11px]">
                <span className="text-charcoal-500 font-tamil">கதை அடையாள எண் (ID):</span>
                <span className="text-forest-900">{publishedResult.story_id}</span>
              </div>
            )}

            {publishedResult?.audio_storage_path && (
              <div className="flex items-center justify-between pb-2 border-b border-ivory-200 font-mono text-[11px]">
                <span className="text-charcoal-500 font-tamil">ஒலி சேமிப்புப் பாதை:</span>
                <span className="text-forest-900">{publishedResult.audio_storage_path}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-emerald-800 font-semibold pt-1 font-tamil">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>சரிபார்க்கப்பட்ட ஒப்புதல்</span>
              </span>
              <span>நிலை: களஞ்சியத்தில் சேர்க்கப்பட்டது</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/archive"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-forest-800 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-forest-900 transition-colors font-tamil"
            >
              <span>களஞ்சியத்தில் காண்க</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleResetForNewStory}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-ivory-300 bg-white px-6 py-2.5 text-xs font-semibold text-charcoal-700 hover:bg-ivory-100 transition-colors font-tamil"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>மற்றொரு கதையை ஆவணப்படுத்துக</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
