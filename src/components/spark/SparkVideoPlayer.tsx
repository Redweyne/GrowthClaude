'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Loader2, Pause, Play } from 'lucide-react';

interface SparkVideoPlayerProps {
  youtubeId: string;
  isActive: boolean;
  preload?: boolean;
  soundEnabled: boolean;
}

export function SparkVideoPlayer({
  youtubeId,
  isActive,
  preload = false,
  soundEnabled,
}: SparkVideoPlayerProps) {
  const shouldRender = isActive || preload;

  const [isPlaying, setIsPlaying] = useState(isActive);
  const [hasError, setHasError] = useState(false);
  const [showPlayPause, setShowPlayPause] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playPauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const embedUrl = useMemo(() => {
    if (!shouldRender) return '';

    const params = new URLSearchParams({
      autoplay: isActive ? '1' : '0',
      mute: '1',
      modestbranding: '1',
      rel: '0',
      playsinline: '1',
      disablekb: '1',
      loop: '1',
      playlist: youtubeId,
      enablejsapi: '1',
      controls: '0',
      iv_load_policy: '3',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    });

    return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
  }, [youtubeId, isActive, shouldRender]);

  const clearTimeouts = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }

    if (playPauseTimeoutRef.current) {
      clearTimeout(playPauseTimeoutRef.current);
      playPauseTimeoutRef.current = null;
    }
  }, []);

  const sendCommand = useCallback((command: 'playVideo' | 'pauseVideo' | 'mute' | 'unMute') => {
    if (!iframeRef.current?.contentWindow) return;

    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: command,
        args: [],
      }),
      '*'
    );
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    loadTimeoutRef.current = setTimeout(() => {
      setHasError(true);
    }, 15000);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [shouldRender, embedUrl]);

  useEffect(() => {
    if (!isIframeLoaded) return;

    if (!isActive || !isPlaying) {
      sendCommand('mute');
      sendCommand('pauseVideo');
      return;
    }

    // Always start muted first so autoplay never gets blocked.
    sendCommand('mute');
    sendCommand('playVideo');

    if (soundEnabled) {
      const unmuteTimer = setTimeout(() => {
        sendCommand('unMute');
      }, 140);

      return () => clearTimeout(unmuteTimer);
    }
  }, [isIframeLoaded, isActive, isPlaying, soundEnabled, sendCommand]);

  const handleLoad = useCallback(() => {
    setHasError(false);
    setIsIframeLoaded(true);
    if (isActive) {
      setIsPlaying(true);
    }

    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, [isActive]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!isActive || !isIframeLoaded) return;

    if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendCommand('playVideo');
      if (soundEnabled) {
        sendCommand('unMute');
      }
      setIsPlaying(true);
    }

    setShowPlayPause(true);
    if (playPauseTimeoutRef.current) {
      clearTimeout(playPauseTimeoutRef.current);
    }

    playPauseTimeoutRef.current = setTimeout(() => {
      setShowPlayPause(false);
    }, 600);
  }, [isActive, isIframeLoaded, isPlaying, soundEnabled, sendCommand]);

  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black px-8">
        <AlertCircle size={40} className="text-stone-700 mb-3" />
        <p className="text-stone-500 text-center text-base mb-1">Video unavailable</p>
        <p className="text-stone-700 text-center text-sm">Swipe up for the next one</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {shouldRender && (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            key={embedUrl}
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
        {shouldRender && !isIframeLoaded && !hasError && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 size={32} className="text-white/25" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="absolute inset-0 z-20"
        onClick={togglePlayPause}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
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
            <div className="w-16 h-16 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center">
              {isPlaying ? (
                <Pause size={28} className="text-white" />
              ) : (
                <Play size={28} className="text-white ml-1" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SparkVideoPlayer;
