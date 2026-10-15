import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileAudio,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  HardDrive,
  FileCode,
} from 'lucide-react';
import AudioPlayer, { formatTime } from './AudioPlayer';

const MAX_SIZE_MB = 25;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const SUPPORTED_EXTENSIONS = ['mp3', 'wav', 'm4a', 'ogg', 'webm', 'flac', 'aac'];
const SUPPORTED_MIME_PREFIXES = ['audio/'];

export default function AudioUploader({ audioData, onAudioSelected, onAudioRemoved, onTranscribeClick }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // Validate and process selected file
  const processFile = (file) => {
    setValidationError(null);

    if (!file) return;

    // 1. File size check
    if (file.size > MAX_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setValidationError(
        `கோப்பின் அளவு அனுமதிக்கப்பட்ட அளவை விட அதிகம் (${fileSizeMB} MB). அதிகபட்ச வரம்பு ${MAX_SIZE_MB} MB மட்டுமே.`
      );
      return;
    }

    if (file.size === 0) {
      setValidationError('தேர்ந்தெடுக்கப்பட்ட கோப்பு காலியாக உள்ளது.');
      return;
    }

    // 2. Format / MIME type check
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const isMimeAudio = SUPPORTED_MIME_PREFIXES.some((prefix) => file.type.startsWith(prefix));
    const isExtensionSupported = SUPPORTED_EXTENSIONS.includes(extension);

    if (!isMimeAudio && !isExtensionSupported) {
      setValidationError(
        `ஏற்றுக்கொள்ளப்படாத கோப்பு வடிவம் (.${extension || 'unknown'}). தயவுசெய்து MP3, WAV, M4A, OGG, WebM அல்லது FLAC கோப்புகளைப் பயன்படுத்தவும்.`
      );
      return;
    }

    // 3. Audio integrity check by creating preview URL and reading metadata
    setIsValidating(true);
    const objectUrl = URL.createObjectURL(file);
    const audioTest = new Audio();

    audioTest.preload = 'metadata';

    const cleanUpAudioTest = () => {
      audioTest.onloadedmetadata = null;
      audioTest.onerror = null;
    };

    audioTest.onloadedmetadata = () => {
      const duration = audioTest.duration;
      cleanUpAudioTest();
      setIsValidating(false);

      const parsedData = {
        file,
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        type: file.type || `audio/${extension}`,
        extension: extension.toUpperCase() || 'AUDIO',
        duration: isFinite(duration) ? duration : 0,
        durationFormatted: isFinite(duration) ? formatTime(duration) : '00:00',
        url: objectUrl,
        source: 'upload',
      };

      onAudioSelected(parsedData);
    };

    audioTest.onerror = () => {
      cleanUpAudioTest();
      URL.revokeObjectURL(objectUrl);
      setIsValidating(false);
      setValidationError(
        'இக்கோப்பினை ஒலியாக இயக்க இயலவில்லை. கோப்பு சேதமடைந்திருக்கலாம் அல்லது உலாவியால் ஆதரிக்கப்படாத குறியீட்டு முறையில் இருக்கலாம்.'
      );
    };

    audioTest.src = objectUrl;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onAudioRemoved();
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.flac,.aac"
        onChange={handleFileInputChange}
        className="hidden"
        id="audio-file-picker"
      />

      {/* Validation Error Banner */}
      {validationError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold block mb-0.5">சரிபார்ப்புப் பிழை:</span>
            {validationError}
          </div>
        </div>
      )}

      {/* Validating indicator */}
      {isValidating && (
        <div className="rounded-xl border border-ivory-300 bg-ivory-50 p-4 text-center text-xs text-charcoal-700 flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin text-maroon-700" />
          <span>ஒலிப்பதிவுக் கோப்பு சரிபார்க்கப்படுகிறது...</span>
        </div>
      )}

      {/* Upload Box (when no audio is active) */}
      {!audioData ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-maroon-600 bg-maroon-50/60 scale-[1.005]'
              : 'border-ivory-300 bg-ivory-50/50 hover:bg-ivory-50 hover:border-forest-400'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerFileInput();
            }
          }}
          aria-label="ஒலிப்பதிவுக் கோப்பைப் பதிவேற்றவும்"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-50 text-forest-800 mx-auto mb-3 border border-forest-100 shadow-xs">
            <UploadCloud className="h-7 w-7" />
          </div>

          <h3 className="text-sm sm:text-base font-bold text-charcoal-900 mb-1">
            தமிழ் ஒலிப்பதிவுக் கோப்பை இங்கே பதிவேற்றவும்
          </h3>
          <p className="text-xs text-charcoal-600 mb-3 font-sans">
            கோப்பை இழுத்துவிடவும் அல்லது கணினியிலிருந்து தேர்ந்தெடுக்க கிளிக் செய்யவும்.
          </p>

          <div className="inline-flex items-center gap-2 rounded-xl bg-forest-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-forest-900 transition-colors pointer-events-none">
            <FileAudio className="h-4 w-4 text-emerald-300" />
            <span>கோப்பைத் தேர்ந்தெடுக்கவும்</span>
          </div>

          <div className="mt-4 pt-4 border-t border-ivory-200 flex flex-wrap items-center justify-center gap-3 text-[11px] text-charcoal-500">
            <span>ஆதரிக்கப்படும் வடிவங்கள்: MP3, WAV, M4A, OGG, WebM, FLAC</span>
            <span>•</span>
            <span className="font-semibold text-forest-800">அதிகபட்ச அளவு: 25 MB</span>
          </div>
        </div>
      ) : (
        /* Selected Audio Card & Player */
        <div className="rounded-2xl border border-ivory-300 bg-white p-5 shadow-xs space-y-4">
          {/* File Metadata Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ivory-200">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <FileAudio className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-charcoal-900 text-sm truncate max-w-[280px] sm:max-w-[400px]">
                    {audioData.name}
                  </h4>
                  <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold tracking-wide">
                    சரிபார்க்கப்பட்டது
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-500 mt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <HardDrive className="h-3 w-3 text-charcoal-400" />
                    {audioData.sizeFormatted}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3 text-charcoal-400" />
                    {audioData.durationFormatted}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileCode className="h-3 w-3 text-charcoal-400" />
                    {audioData.extension}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Replace / Remove */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={triggerFileInput}
                className="inline-flex items-center gap-1 rounded-lg border border-ivory-300 bg-ivory-100 px-3 py-1.5 text-xs font-medium text-charcoal-700 hover:bg-ivory-200 hover:text-charcoal-900 transition-colors"
                title="கோப்பை மாற்றுக"
              >
                <RefreshCw className="h-3 w-3" />
                <span>மாற்றுக</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors"
                title="கோப்பை நீக்குக"
              >
                <Trash2 className="h-3 w-3" />
                <span>நீக்குக</span>
              </button>
            </div>
          </div>

          {/* Audio Player Preview */}
          <div>
            <AudioPlayer src={audioData.url} title={audioData.name} />
          </div>

          {/* Audio Ready for Transcription Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-emerald-950 block font-tamil">
                  ஒலிப்பதிவு உரைமாற்றத்திற்குத் தயார்
                </span>
                <span className="text-[11px] text-emerald-800 font-sans">
                  கோப்பு வடிவம்: {audioData.extension} • {audioData.sizeFormatted}
                </span>
              </div>
            </div>

            {onTranscribeClick && (
              <button
                type="button"
                onClick={onTranscribeClick}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-forest-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-forest-900 transition-colors shrink-0"
              >
                <span>உரை ஆய்வுக்குத் தொடர்க</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
