import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
} from 'lucide-react';

/**
 * Format seconds into mm:ss display
 */
export function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Accessible, culturally styled AudioPlayer for playback preview
 */
export default function AudioPlayer({ src, title = 'Audio Preview', onEnded }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    // Reset state on new src
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.currentTime = 0;
    }
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Audio playback error:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current || isSeeking) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const dur = audioRef.current.duration;
    if (!isNaN(dur) && isFinite(dur)) {
      setDuration(dur);
    }
  };

  const handleSeekChange = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = (e) => {
    setIsSeeking(false);
    if (audioRef.current) {
      const val = parseFloat(e.target.value);
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 0.75];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    if (onEnded) onEnded();
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-xl border border-ivory-300 bg-ivory-50/80 p-4 shadow-xs space-y-3">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnd}
        preload="metadata"
      />

      {/* Top title & time display */}
      <div className="flex items-center justify-between text-xs text-charcoal-700">
        <span className="font-semibold truncate max-w-[220px] text-charcoal-900">
          {title}
        </span>
        <div className="font-mono text-xs text-charcoal-600 font-medium">
          <span>{formatTime(currentTime)}</span>
          <span className="mx-1 text-charcoal-400">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Scrubber / Progress bar */}
      <div className="relative flex items-center group">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onMouseDown={handleSeekStart}
          onTouchStart={handleSeekStart}
          onChange={handleSeekChange}
          onMouseUp={handleSeekEnd}
          onTouchEnd={handleSeekEnd}
          disabled={!duration}
          aria-label="Audio scrubber"
          className="w-full h-2 bg-ivory-300 rounded-lg appearance-none cursor-pointer accent-maroon-800 focus:outline-none disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, #7E1F2D 0%, #7E1F2D ${progressPercent}%, #E8E2D5 ${progressPercent}%, #E8E2D5 100%)`,
          }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={togglePlay}
            disabled={!src}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-800 text-white hover:bg-maroon-900 transition-colors shadow-xs disabled:opacity-50"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={handleRestart}
            disabled={!src}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-ivory-300 bg-white text-charcoal-600 hover:bg-ivory-100 hover:text-charcoal-900 transition-colors disabled:opacity-50"
            title="மீண்டும் தொடங்கு (Restart from beginning)"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Mute toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-ivory-300 bg-white text-charcoal-600 hover:bg-ivory-100 hover:text-charcoal-900 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 text-rose-600" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Playback speed toggle */}
        <button
          type="button"
          onClick={cyclePlaybackRate}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-ivory-300 bg-white text-xs font-mono font-medium text-charcoal-700 hover:bg-ivory-100 transition-colors"
          title="வேகம் (Playback Speed)"
        >
          <Gauge className="h-3 w-3 text-gold-600" />
          <span>{playbackRate}x</span>
        </button>
      </div>
    </div>
  );
}
