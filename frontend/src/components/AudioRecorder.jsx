import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Pause,
  Play,
  RotateCcw,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Radio,
  Trash2,
  Sparkles,
} from 'lucide-react';
import AudioPlayer, { formatTime } from './AudioPlayer';

export default function AudioRecorder({ audioData, onAudioRecorded, onAudioDiscarded }) {
  const [recorderState, setRecorderState] = useState('idle'); // 'idle' | 'requesting' | 'recording' | 'paused' | 'stopped'
  const [elapsedTime, setElapsedTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [unsupportedBrowser, setUnsupportedBrowser] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  // Check browser capability on mount
  useEffect(() => {
    const isSupported =
      typeof window !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function' &&
      typeof window.MediaRecorder === 'function';

    if (!isSupported) {
      setUnsupportedBrowser(true);
    }

    return () => {
      // Ensure all tracks are stopped and timer cleared on unmount
      cleanupStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping audio track:', e);
        }
      });
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setErrorMessage(null);
    setPreviewData(null);
    chunksRef.current = [];
    setElapsedTime(0);

    if (unsupportedBrowser) {
      setErrorMessage(
        'உங்கள் உலாவி நேரடி ஒலிப்பதிவை (MediaRecorder API) ஆதரிக்கவில்லை. தயவுசெய்து Chrome, Firefox, அல்லது Edge உலாவியைப் பயன்படுத்தவும் அல்லது ஒலி கோப்பைப் பதிவேற்றவும். (MediaRecorder not supported).'
      );
      return;
    }

    try {
      setRecorderState('requesting');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Determine best supported mime type
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options = { mimeType: 'audio/webm;codecs=opus' };
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        options = { mimeType: 'audio/ogg;codecs=opus' };
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options = { mimeType: 'audio/mp4' };
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        cleanupStream();
        if (timerRef.current) clearInterval(timerRef.current);

        const mime = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(chunksRef.current, { type: mime });

        if (audioBlob.size === 0) {
          setErrorMessage('ஒலிப்பதிவு எதுவும் சேமிக்கப்படவில்லை. தயவுசெய்து மீண்டும் பதிவு செய்யவும். (Recording was empty).');
          setRecorderState('idle');
          return;
        }

        const objectUrl = URL.createObjectURL(audioBlob);
        const timestamp = Date.now();
        const fileName = `tamil_oral_recording_${timestamp}.webm`;

        const recordedObject = {
          file: audioBlob,
          name: fileName,
          size: audioBlob.size,
          sizeFormatted: `${(audioBlob.size / 1024).toFixed(1)} KB`,
          type: mime,
          extension: 'WEBM',
          duration: elapsedTime > 0 ? elapsedTime : 1,
          durationFormatted: formatTime(elapsedTime > 0 ? elapsedTime : 1),
          url: objectUrl,
          source: 'record',
        };

        setPreviewData(recordedObject);
        setRecorderState('stopped');
        onAudioRecorded(recordedObject);
      };

      recorder.start(250); // collect chunks every 250ms
      setRecorderState('recording');

      // Start elapsed timer
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      cleanupStream();
      setRecorderState('idle');

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage(
          'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. தயவுசெய்து உங்கள் உலாவியின் முகவரிப் பட்டியில் உள்ள அனுமதி அமைப்புகளில் மைக்ரோஃபோனை அனுமதிக்கவும். (Microphone permission denied).'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage(
          'உங்கள் சாதனத்தில் மைக்ரோஃபோன் எதுவும் கண்டறியப்படவில்லை. தயவுசெய்து மைக்ரோஃபோனை இணைக்கவும் அல்லது ஆடியோ கோப்பைப் பதிவேற்றவும். (No microphone found).'
        );
      } else {
        setErrorMessage(
          `ஒலிப்பதிவைத் தொடங்குவதில் பிழை ஏற்பட்டது: ${err.message || 'அறியப்படாத பிழை'} (Recording error).`
        );
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recorderState === 'recording') {
      try {
        mediaRecorderRef.current.pause();
        if (timerRef.current) clearInterval(timerRef.current);
        setRecorderState('paused');
      } catch (err) {
        console.error('Error pausing recording:', err);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recorderState === 'paused') {
      try {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setElapsedTime((prev) => prev + 1);
        }, 1000);
        setRecorderState('recording');
      } catch (err) {
        console.error('Error resuming recording:', err);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (recorderState === 'recording' || recorderState === 'paused')) {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error('Error stopping recording:', err);
      }
    }
  };

  const discardRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    cleanupStream();

    if (previewData?.url) {
      URL.revokeObjectURL(previewData.url);
    }

    setPreviewData(null);
    setRecorderState('idle');
    setElapsedTime(0);
    setErrorMessage(null);
    chunksRef.current = [];
    onAudioDiscarded();
  };

  // If parent already has active recorded audio
  const activeRecording = previewData || (audioData?.source === 'record' ? audioData : null);

  return (
    <div className="space-y-4">
      {/* Unsupported browser warning */}
      {unsupportedBrowser && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 flex items-start gap-2.5">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-semibold mb-0.5">
              உலாவி ஆதரவு வரம்பு (Browser Unsupported):
            </strong>
            இவ்வுலாவியில் மைக்ரோஃபோன் பதிவுக்கான MediaRecorder API ஆதரிக்கப்படவில்லை. தயவுசெய்து Chrome / Edge / Firefox உலாவியைப் பயன்படுத்தவும் அல்லது 'கோப்பு பதிவேற்றம்' வழியைப் பயன்படுத்தவும்.
          </div>
        </div>
      )}

      {/* Permission / Runtime Error banner */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold block mb-0.5">மைக்ரோஃபோன் பிழை (Microphone Notice):</span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Active Recording State or Idle */}
      {!activeRecording ? (
        <div className="border-2 border-dashed border-maroon-200 rounded-2xl p-8 text-center bg-gradient-to-b from-maroon-50/20 via-ivory-50/30 to-white">
          {/* Recording UI: IDLE / REQUESTING */}
          {recorderState === 'idle' || recorderState === 'requesting' ? (
            <div className="space-y-4 max-w-md mx-auto">
              <div className="relative inline-block">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-maroon-800 text-gold-300 shadow-md mx-auto">
                  <Mic className="h-8 w-8" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-charcoal-900">
                  நேரடி உலாவி ஒலிப்பதிவு (Direct Browser Audio Recording)
                </h3>
                <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                  Click the button below to grant microphone access and capture Tamil oral narratives directly in the field.
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={unsupportedBrowser || recorderState === 'requesting'}
                  className="inline-flex items-center gap-2 rounded-xl bg-maroon-800 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-maroon-900 transition-all disabled:opacity-50"
                >
                  <Radio className="h-4 w-4 text-gold-300 animate-pulse" />
                  <span>
                    {recorderState === 'requesting'
                      ? 'அனுமதி பெறப்படுகிறது... (Requesting Mic...)'
                      : 'ஒலிப்பதிவைத் தொடங்கு (Start Recording)'}
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-charcoal-500">
                மைக்ரோஃபோன் அனுமதி நீங்கள் 'Start Recording' கிளிக் செய்யும்போது மட்டுமே கேட்கப்படும்.
              </p>
            </div>
          ) : (
            /* Recording UI: RECORDING or PAUSED */
            <div className="space-y-6 max-w-md mx-auto py-2">
              {/* Status pill & Elapsed Time */}
              <div className="flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wider shadow-xs border-maroon-300 bg-white">
                  {recorderState === 'recording' ? (
                    <>
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping" />
                      <span className="text-maroon-900">பதிவாகிறது (Recording Live)</span>
                    </>
                  ) : (
                    <>
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                      <span className="text-amber-800">இடைநிறுத்தப்பட்டுள்ளது (Paused)</span>
                    </>
                  )}
                </div>

                {/* Big Live Timer */}
                <div className="font-mono text-4xl sm:text-5xl font-extrabold text-charcoal-900 tracking-tight">
                  {formatTime(elapsedTime)}
                </div>

                {/* Audio Wave Visualizer Bars */}
                <div className="flex items-center justify-center gap-1.5 h-10 w-full">
                  {[40, 75, 25, 90, 60, 100, 45, 80, 30, 95, 65, 35, 85, 50, 70].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        recorderState === 'recording'
                          ? 'bg-maroon-700 animate-pulse'
                          : 'bg-ivory-400'
                      }`}
                      style={{
                        height: recorderState === 'recording' ? `${h}%` : '20%',
                        animationDelay: `${(i % 5) * 120}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons: Pause/Resume, Stop, Discard */}
              <div className="flex items-center justify-center gap-3">
                {recorderState === 'recording' ? (
                  <button
                    type="button"
                    onClick={pauseRecording}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-ivory-300 bg-white px-4 py-2 text-xs font-semibold text-charcoal-800 hover:bg-ivory-100 transition-colors shadow-xs"
                    title="Pause recording"
                  >
                    <Pause className="h-4 w-4 text-amber-600" />
                    <span>இடைநிறுத்து (Pause)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resumeRecording}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-ivory-300 bg-white px-4 py-2 text-xs font-semibold text-charcoal-800 hover:bg-ivory-100 transition-colors shadow-xs"
                    title="Resume recording"
                  >
                    <Play className="h-4 w-4 text-emerald-600" />
                    <span>தொடர்க (Resume)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={stopRecording}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-maroon-800 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-maroon-900 transition-colors"
                  title="Stop and complete recording"
                >
                  <Square className="h-3.5 w-3.5 fill-white text-white" />
                  <span>நிறுத்து (Stop & Preview)</span>
                </button>

                <button
                  type="button"
                  onClick={discardRecording}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                  title="Cancel and discard"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>ரத்து (Discard)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completed Recording Review Card */
        <div className="rounded-2xl border border-ivory-300 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ivory-200">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-maroon-50 text-maroon-800 border border-maroon-200">
                <Mic className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-charcoal-900 text-sm truncate max-w-[280px] sm:max-w-[400px]">
                    {activeRecording.name}
                  </h4>
                  <span className="rounded bg-maroon-100 text-maroon-800 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                    Recorded Audio
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-500 mt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3 text-charcoal-400" />
                    {activeRecording.durationFormatted}
                  </span>
                  <span>•</span>
                  <span className="font-mono">{activeRecording.sizeFormatted}</span>
                  <span>•</span>
                  <span className="text-maroon-800 font-medium">Browser MediaRecorder</span>
                </div>
              </div>
            </div>

            {/* Actions: Re-record / Discard */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={discardRecording}
                className="inline-flex items-center gap-1 rounded-lg border border-ivory-300 bg-ivory-100 px-3 py-1.5 text-xs font-medium text-charcoal-700 hover:bg-ivory-200 hover:text-charcoal-900 transition-colors"
                title="Discard and record again"
              >
                <RotateCcw className="h-3 w-3" />
                <span>மீண்டும் பதிவு செய் (Re-record)</span>
              </button>

              <button
                type="button"
                onClick={discardRecording}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors"
                title="Remove recording"
              >
                <Trash2 className="h-3 w-3" />
                <span>நீக்குக (Discard)</span>
              </button>
            </div>
          </div>

          {/* Audio Player Preview */}
          <div>
            <AudioPlayer src={activeRecording.url} title={activeRecording.name} />
          </div>

          <div className="text-[11px] text-charcoal-500 flex items-center gap-1.5 bg-maroon-50/50 p-2.5 rounded-lg border border-maroon-100">
            <CheckCircle2 className="h-3.5 w-3.5 text-maroon-700 shrink-0" />
            <span>
              நேரடி ஒலிப்பதிவு வெற்றிகரமாக பிடிக்கப்பட்டுள்ளது. (Audio recording captured and verified).
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
