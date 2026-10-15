import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Tag,
  BookOpen,
  Folder,
  Globe,
  RotateCcw,
  Plus,
  X,
  FileText,
  Copy,
  Check,
  Cpu,
} from 'lucide-react';
import { generateStoryMetadata, fetchMetadataServiceStatus } from '../services/metadataApi';

// Canonical Tamil Oral History categories
const CANONICAL_CATEGORIES = [
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

/**
 * StoryMetadataGenerator
 * ======================
 * Independent Phase 5 component for AI-powered story metadata generation.
 * Generates and allows human editing of:
 * - Story Title (Tamil)
 * - Cultural Summary (Tamil)
 * - Thematic Keywords
 * - Archival Category
 * - Search Tags
 * - Bilingual English Summary
 * 
 * @param {Object} props
 * @param {string} props.transcript - The reviewed/edited Tamil transcript text
 * @param {Function} [props.onApplyMetadata] - Callback invoked when user confirms metadata (passes final edited object)
 * @param {Object} [props.initialMetadata] - Optional initial metadata
 * @param {boolean} [props.disabled=false] - Disable interactions (e.g. if transcript is empty)
 * @param {string} [props.apiBaseUrl] - Optional custom API base URL for testing
 */
export default function StoryMetadataGenerator({
  transcript = '',
  onApplyMetadata,
  initialMetadata = null,
  disabled = false,
  apiBaseUrl = null,
}) {
  // Generation & Service State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceStatus, setServiceStatus] = useState(null);
  const [includeEnglish, setIncludeEnglish] = useState(true);

  // Original AI output (stored to compare user edits)
  const [aiOriginal, setAiOriginal] = useState(null);

  // Editable Form State
  const [formData, setFormData] = useState({
    title: initialMetadata?.title || '',
    summary: initialMetadata?.summary || '',
    category: initialMetadata?.category || 'Agriculture',
    keywords: initialMetadata?.keywords || [],
    tags: initialMetadata?.tags || [],
    englishSummary: initialMetadata?.englishSummary || initialMetadata?.english_summary || '',
  });

  // Track which fields have been modified by the user
  const [editedFields, setEditedFields] = useState({
    title: false,
    summary: false,
    category: false,
    keywords: false,
    tags: false,
    englishSummary: false,
  });

  // Inputs for adding individual tags/keywords
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState(false);

  // Check service health on mount
  useEffect(() => {
    let isMounted = true;
    async function checkStatus() {
      try {
        const status = await fetchMetadataServiceStatus(apiBaseUrl);
        if (isMounted) setServiceStatus(status);
      } catch (err) {
        if (isMounted) {
          console.warn('Metadata service status check warning:', err.message);
        }
      }
    }
    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  // Handle generation action
  const handleGenerate = async () => {
    if (!transcript || !transcript.trim()) {
      setError({
        message: 'வாய்மொழிப் பதிவு உரை (Transcript) காலியாக உள்ளது.',
        detail: 'மெட்டாடேட்டா உருவாக்க முன், ஆய்வு செய்யப்பட்ட தமிழ் உரையை வழங்கவும்.',
      });
      return;
    }

    setLoading(true);
    setError(null);
    setAppliedNotice(false);

    try {
      const result = await generateStoryMetadata({
        transcript,
        language: 'ta',
        includeEnglishSummary: includeEnglish,
        apiBaseUrl,
      });

      // Save raw AI generated baseline
      setAiOriginal(result);

      // Populate editable fields
      setFormData({
        title: result.title || '',
        summary: result.summary || '',
        category: result.category || 'Agriculture',
        keywords: Array.isArray(result.keywords) ? result.keywords : [],
        tags: Array.isArray(result.tags) ? result.tags : [],
        englishSummary: result.english_summary || '',
      });

      // Reset edited flags since freshly generated
      setEditedFields({
        title: false,
        summary: false,
        category: false,
        keywords: false,
        tags: false,
        englishSummary: false,
      });
    } catch (err) {
      console.error('Metadata generation failed:', err);
      setError({
        status: err.status,
        message: err.message || 'மெட்டாடேட்டா உருவாக்க முடியவில்லை.',
        detail: err.resolution || 'API விசை சரிபார்க்கவும் அல்லது LLM_TEST_MODE=true இயக்கவும்.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Revert a field or all fields back to AI original
  const handleResetToAI = () => {
    if (!aiOriginal) return;
    setFormData({
      title: aiOriginal.title || '',
      summary: aiOriginal.summary || '',
      category: aiOriginal.category || 'Agriculture',
      keywords: Array.isArray(aiOriginal.keywords) ? [...aiOriginal.keywords] : [],
      tags: Array.isArray(aiOriginal.tags) ? [...aiOriginal.tags] : [],
      englishSummary: aiOriginal.english_summary || '',
    });
    setEditedFields({
      title: false,
      summary: false,
      category: false,
      keywords: false,
      tags: false,
      englishSummary: false,
    });
  };

  // Field change handler
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setEditedFields((prev) => ({ ...prev, [field]: true }));
    setAppliedNotice(false);
  };

  // Keyword management
  const handleAddKeyword = () => {
    const trimmed = newKeywordInput.trim();
    if (trimmed && !formData.keywords.includes(trimmed)) {
      const updated = [...formData.keywords, trimmed];
      handleFieldChange('keywords', updated);
      setNewKeywordInput('');
    }
  };

  const handleRemoveKeyword = (indexToRemove) => {
    const updated = formData.keywords.filter((_, i) => i !== indexToRemove);
    handleFieldChange('keywords', updated);
  };

  // Tag management
  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      const updated = [...formData.tags, trimmed];
      handleFieldChange('tags', updated);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    const updated = formData.tags.filter((_, i) => i !== indexToRemove);
    handleFieldChange('tags', updated);
  };

  // Apply to parent callback
  const handleApply = () => {
    const payload = {
      title: formData.title.trim(),
      summary: formData.summary.trim(),
      category: formData.category,
      keywords: formData.keywords,
      tags: formData.tags,
      englishSummary: formData.englishSummary.trim() || null,
      isAiGenerated: Boolean(aiOriginal),
      isUserEdited: Object.values(editedFields).some(Boolean),
      sourceModel: aiOriginal?.model || null,
      isMock: Boolean(aiOriginal?.is_mock),
    };

    if (onApplyMetadata) {
      onApplyMetadata(payload);
    }
    setAppliedNotice(true);
  };

  // Copy JSON to clipboard
  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const isAnyFieldEdited = Object.values(editedFields).some(Boolean);
  const hasMetadata = Boolean(formData.title || formData.summary || aiOriginal);

  return (
    <div className="bg-ivory-50 border border-ivory-300 rounded-2xl p-6 shadow-sm font-sans">
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ivory-300 gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-forest-900 text-gold-400 flex items-center justify-center shadow-inner">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-forest-950 font-tamil">
                AI கதை மெட்டாடேட்டா உருவாக்கம்
              </h3>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200">
                Phase 5
              </span>
            </div>
            <p className="text-xs text-charcoal-500 font-tamil mt-0.5">
              வாய்மொழி வரலாற்றை ஆராய்ந்து தலைப்பு, சுருக்கம், பகுப்பு மற்றும் குறிச்சொற்களை உருவாக்குகிறது.
            </p>
          </div>
        </div>

        {/* Generate / Regenerate Controls */}
        <div className="flex items-center gap-2">
          {hasMetadata && (
            <button
              type="button"
              onClick={handleResetToAI}
              disabled={!isAnyFieldEdited || loading}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                isAnyFieldEdited && !loading
                  ? 'text-charcoal-700 bg-ivory-200 hover:bg-ivory-300 border border-ivory-400'
                  : 'text-charcoal-400 bg-ivory-100 border border-ivory-200 cursor-not-allowed opacity-60'
              }`}
              title="அசல் AI பரிந்துரைகளுக்கு மீட்டமை"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>மீட்டமை</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || disabled || !transcript?.trim()}
            className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all ${
              loading || disabled || !transcript?.trim()
                ? 'bg-charcoal-200 text-charcoal-400 cursor-not-allowed'
                : 'bg-forest-800 hover:bg-forest-900 text-ivory-50 active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-gold-400" />
                <span className="font-tamil">உருவாக்குகிறது...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-gold-400" />
                <span className="font-tamil">
                  {hasMetadata ? 'மீண்டும் உருவாக்கு' : 'மெட்டாடேட்டா உருவாக்கு'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Options Bar */}
      <div className="flex flex-wrap items-center justify-between py-2.5 text-xs text-charcoal-600 gap-2 border-b border-ivory-200">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeEnglish}
            onChange={(e) => setIncludeEnglish(e.target.checked)}
            className="rounded border-ivory-400 text-forest-700 focus:ring-forest-500 h-3.5 w-3.5"
          />
          <span className="font-tamil">இருமொழி தேடலுக்காக ஆங்கில சுருக்கத்தை இணைக்கவும்</span>
        </label>

        {/* Test Mode / Provider Pill */}
        {aiOriginal?.is_mock ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-300">
            <Cpu className="h-3 w-3" />
            <span>சோதனை மாதிரி</span>
          </span>
        ) : serviceStatus?.provider ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-forest-50 text-forest-700 border border-forest-200">
            <Cpu className="h-3 w-3" />
            <span>AI Provider: {serviceStatus.provider} ({serviceStatus.model})</span>
          </span>
        ) : null}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">{error.message}</p>
              {error.detail && <p className="mt-1 text-red-700 font-mono text-[11px]">{error.detail}</p>}
              <p className="mt-2 text-red-800">
                குறிப்பு:后端 backend/.env கோப்பில் LLM_API_KEY சேர்க்கவும் அல்லது சுதந்திரமான சோதனைக்கு LLM_TEST_MODE=true இயக்கவும்.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="mt-6 p-6 rounded-xl border border-dashed border-forest-300 bg-forest-50/50 flex flex-col items-center justify-center text-center animate-pulse">
          <RefreshCw className="h-8 w-8 text-forest-700 animate-spin mb-3" />
          <h4 className="text-sm font-bold text-forest-900 font-tamil">
            தமிழ் வாய்மொழி வரலாற்றை AI பகுப்பாய்வு செய்கிறது...
          </h4>
          <p className="text-xs text-forest-700 font-tamil mt-1 max-w-md">
            மூதாதையர் அனுபவங்கள், உழவு மரபுகள் மற்றும் பண்பாட்டுக் குறிப்புகளைச் சேகரித்து தலைப்பு மற்றும் சுருக்கத்தை உருவாக்குகிறது.
          </p>
        </div>
      )}

      {/* Form / Metadata Display */}
      {!loading && hasMetadata && (
        <div className="mt-5 space-y-4">
          {/* Status Indicators */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-charcoal-500 font-medium font-tamil">நிலை:</span>
              {isAnyFieldEdited ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  <Edit3 className="h-3 w-3" />
                  <span>பயனரால் திருத்தப்பட்டது</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  <span>AI பரிந்துரை</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopyJson}
              className="text-[11px] text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1 underline underline-offset-2"
            >
              {copiedJson ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              <span>{copiedJson ? 'நகலெடுக்கப்பட்டது!' : 'JSON நகலெடு'}</span>
            </button>
          </div>

          {/* 1. Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-charcoal-800 font-tamil flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-forest-800" />
                <span>கதையின் தலைப்பு *</span>
              </label>
              {editedFields.title && (
                <span className="text-[10px] text-amber-700 font-medium">திருத்தப்பட்டது</span>
              )}
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="எ.கா: பாரம்பரிய நெல் ரகங்களும் உழவு நுணுக்கங்களும்"
              className="w-full px-3.5 py-2 text-sm font-tamil bg-white border border-ivory-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900 shadow-sm"
            />
          </div>

          {/* 2. Tamil Summary */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-charcoal-800 font-tamil flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-forest-800" />
                <span>தமிழ் சுருக்கம் *</span>
              </label>
              {editedFields.summary && (
                <span className="text-[10px] text-amber-700 font-medium">திருத்தப்பட்டது</span>
              )}
            </div>
            <textarea
              rows={3}
              value={formData.summary}
              onChange={(e) => handleFieldChange('summary', e.target.value)}
              placeholder="வாய்மொழிப் பதிவில் கூறப்பட்ட முக்கிய வரலாற்றுச் செய்திகளின் சுருக்கம்..."
              className="w-full px-3.5 py-2 text-xs font-tamil bg-white border border-ivory-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900 leading-relaxed shadow-sm resize-y"
            />
          </div>

          {/* 3. Category & English Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-charcoal-800 font-tamil flex items-center gap-1.5">
                  <Folder className="h-3.5 w-3.5 text-forest-800" />
                  <span>பகுப்பு பரிந்துரை</span>
                </label>
                {editedFields.category && (
                  <span className="text-[10px] text-amber-700 font-medium">திருத்தப்பட்டது</span>
                )}
              </div>
              <select
                value={formData.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                className="w-full px-3 py-2 text-xs font-tamil bg-white border border-ivory-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900 shadow-sm"
              >
                {CANONICAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.ta}
                  </option>
                ))}
              </select>
            </div>

            {/* Bilingual English Summary (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5 font-tamil">
                  <Globe className="h-3.5 w-3.5 text-forest-800" />
                  <span>ஆங்கில சுருக்கம் (இருமொழித் தேடல்)</span>
                </label>
                {editedFields.englishSummary && (
                  <span className="text-[10px] text-amber-700 font-medium">திருத்தப்பட்டது</span>
                )}
              </div>
              <textarea
                rows={2}
                value={formData.englishSummary}
                onChange={(e) => handleFieldChange('englishSummary', e.target.value)}
                placeholder="சுருக்கமான ஆங்கில சுருக்கம்..."
                className="w-full px-3 py-2 text-xs bg-white border border-ivory-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 text-charcoal-900 leading-relaxed shadow-sm resize-y"
              />
            </div>
          </div>

          {/* 4. Thematic Keywords */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-charcoal-800 font-tamil flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-forest-800" />
                <span>முக்கியக் குறிச்சொற்கள்</span>
              </label>
              {editedFields.keywords && (
                <span className="text-[10px] text-amber-700 font-medium">திருத்தப்பட்டது</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border border-ivory-400 rounded-xl min-h-[42px] shadow-sm">
              {formData.keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-forest-50 text-forest-900 border border-forest-200 font-tamil"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(idx)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1 flex-1 min-w-[130px]">
                <input
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                  placeholder="+ சொல் சேர்..."
                  className="text-xs px-2 py-0.5 bg-transparent border-0 focus:outline-none font-tamil text-charcoal-800 w-full"
                />
                {newKeywordInput.trim() && (
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="p-1 rounded bg-forest-100 text-forest-800 hover:bg-forest-200"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 5. Search Tags */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-charcoal-800 font-tamil flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-forest-800" />
                <span>தேடல் குறிச்சொற்கள்</span>
              </label>
              {editedFields.tags && (
                <span className="text-[10px] text-amber-700 font-medium">திருத்தப்பட்டது</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border border-ivory-400 rounded-xl min-h-[42px] shadow-sm">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-gold-50 text-gold-900 border border-gold-300"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1 flex-1 min-w-[130px]">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="+ குறிச்சொல் சேர்..."
                  className="text-xs px-2 py-0.5 bg-transparent border-0 focus:outline-none text-charcoal-800 w-full"
                />
                {newTagInput.trim() && (
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="p-1 rounded bg-gold-100 text-gold-800 hover:bg-gold-200"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Apply Action Button */}
          <div className="pt-2 flex items-center justify-between border-t border-ivory-300">
            <div>
              {appliedNotice && (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-tamil">கதை படிவத்திற்கு மெட்டாடேட்டா வெற்றிகரமாக மாற்றப்பட்டது!</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-forest-900 hover:bg-forest-950 text-gold-300 hover:text-gold-200 border border-forest-700 shadow-sm flex items-center gap-2 transition-transform active:scale-95"
            >
              <Check className="h-4 w-4" />
              <span className="font-tamil">படிவத்திற்குப் பயன்படுத்து</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty State Prompt */}
      {!loading && !hasMetadata && (
        <div className="mt-4 p-5 rounded-xl border border-dashed border-ivory-300 text-center">
          <p className="text-xs text-charcoal-500 font-tamil">
            மேலே உள்ள <strong className="text-forest-900 font-semibold">"மெட்டாடேட்டா உருவாக்கு"</strong> பொத்தானை அழுத்தி,
            வாய்மொழி வரலாற்றிற்கான தலைப்பு மற்றும் சுருக்கத்தைப் பெறவும்.
          </p>
        </div>
      )}
    </div>
  );
}
