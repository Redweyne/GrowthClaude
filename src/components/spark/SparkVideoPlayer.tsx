'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, AlertCircle, Loader2 } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// SPARK VIDEO PLAYER — TikTok-Style
// 9:16 vertical YouTube Shorts embed with tap-to-pause
// ═══════════════════════════════════════════════════════════════════════════

interface SparkVideoPlayerProps {
  youtubeId: string;
  isActive: boolean;
  preload?: boolean;
  soundEnabled: boolean;
  onEnableSound: () => void;
}

export function SparkVideoPlayer({
  youtubeId,
  isActive,
  preload = false,
  soundEnabled,
  onEnableSound,
}: SparkVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showPlayPause, setShowPlayPause] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playPauseTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const loadTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  // YouTube embed URL — optimized for Shorts playback
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?` +
    'autoplay=0' +
    '&mute=1' +
    '&modestbranding=1' +
    '&rel=0' +
    '&playsinline=1' +
    '&disablekb=1' +
    '&loop=1' +
    `&playlist=${youtubeId}` +
    '&enablejsapi=1' +
    '&controls=0' +
    '&showinfo=0' +
    '&iv_load_policy=3' +
    '&origin=' + (typeof window !== 'undefined' ? window.location.origin : '');

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    setIsPlayerReady(true);
    if (loadTimeout.current) clearTimeout(loadTimeout.current);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  useEffect(() => {
    if (isActive || preload) {
      setIsLoading(true);
      setHasError(false);
      setIsPlayerReady(false);
      loadTimeout.current = setTimeout(() => {
        setHasError(true);
        setIsLoading(false);
      }, 12000);
    }
    return () => {
      if (loadTimeout.current) clearTimeout(loadTimeout.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId, isActive, preload]);

  const sendCommand = useCallback((command: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command }),
        '*'
      );
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendCommand('playVideo');
      setIsPlaying(true);
    }
    setShowPlayPause(true);
    if (playPauseTimeout.current) clearTimeout(playPauseTimeout.current);
    playPauseTimeout.current = setTimeout(() => setShowPlayPause(false), 600);
  }, [isPlaying, sendCommand]);

  const handleTap = useCallback(() => {
    if (!soundEnabled) {
      onEnableSound();
      sendCommand('unMute');
      sendCommand('playVideo');
      setIsPlaying(true);
      return;
    }
    togglePlayPause();
  }, [soundEnabled, onEnableSound, sendCommand, togglePlayPause]);

  useEffect(() => {
    if (!isPlayerReady) return;
    if (!isActive) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
      return;
    }
    sendCommand('playVideo');
    if (soundEnabled) {
      sendCommand('unMute');
    } else {
      sendCommand('mute');
    }
    setIsPlaying(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, soundEnabled, isPlayerReady]);

  useEffect(() => {
    return () => {
      if (playPauseTimeout.current) clearTimeout(playPauseTimeout.current);
      if (loadTimeout.current) clearTimeout(loadTimeout.current);
    };
  }, []);

  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black px-8">
        <AlertCircle size={40} className="text-stone-700 mb-3" />
        <p className="text-stone-500 text-center text-base mb-1">Video unavailable</p>
        <p className="text-stone-700 text-center text-sm">Swipe up for the next one</p>
      </div>
    );
  }

  const shouldRender = isActive || preload;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {shouldRender && (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="absolute"
            style={{
              border: 'none',
              width: '120%',
              height: '120%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(1.05)',
              pointerEvents: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleLoad}
            onError={handleError}
            title="Spark motivational video"
          />
        </div>
      )}

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 size={32} className="text-white/20" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="absolute inset-0 z-20"
        onClick={handleTap}
        role="button"
        tabIndex={0}
        aria-label={soundEnabled ? (isPlaying ? 'Pause video' : 'Play video') : 'Enable sound'}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleTap();
          }
        }}
      />

      <AnimatePresence>
        {showPlayPause && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              {isPlaying ? (
                <Play size={28} className="text-white ml-1" />
              ) : (
                <Pause size={28} className="text-white" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActive && !soundEnabled && (
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white/80 text-xs font-medium">
              Tap for sound
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SparkVideoPlayer;
