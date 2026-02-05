'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, AlertCircle, Loader2 } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// SPARK VIDEO PLAYER
// YouTube embed wrapper with play/pause overlay and loading states
// ═══════════════════════════════════════════════════════════════════════════

interface SparkVideoPlayerProps {
  youtubeId: string;
  isActive: boolean;
  onVideoEnd?: () => void;
}

export function SparkVideoPlayer({ youtubeId, isActive, onVideoEnd }: SparkVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showPlayPause, setShowPlayPause] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playPauseTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const loadTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Build YouTube embed URL
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?` +
    'autoplay=1' +
    '&mute=0' +
    '&modestbranding=1' +
    '&rel=0' +
    '&playsinline=1' +
    '&loop=1' +
    `&playlist=${youtubeId}` +
    '&enablejsapi=1' +
    '&origin=' + (typeof window !== 'undefined' ? window.location.origin : '');

  // Handle iframe load
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    if (loadTimeout.current) clearTimeout(loadTimeout.current);
  }, []);

  // Handle iframe error
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Set a timeout for loading — if iframe doesn't load in 10s, show error
  useEffect(() => {
    if (isActive) {
      setIsLoading(true);
      setHasError(false);
      loadTimeout.current = setTimeout(() => {
        if (isLoading) {
          setHasError(true);
          setIsLoading(false);
        }
      }, 10000);
    }

    return () => {
      if (loadTimeout.current) clearTimeout(loadTimeout.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId, isActive]);

  // Send postMessage to control YouTube iframe
  const sendCommand = useCallback((command: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command }),
        '*'
      );
    }
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendCommand('playVideo');
      setIsPlaying(true);
    }

    // Show play/pause indicator briefly
    setShowPlayPause(true);
    if (playPauseTimeout.current) clearTimeout(playPauseTimeout.current);
    playPauseTimeout.current = setTimeout(() => setShowPlayPause(false), 800);
  }, [isPlaying, sendCommand]);

  // Pause when not active
  useEffect(() => {
    if (!isActive && isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else if (isActive && !isPlaying) {
      sendCommand('playVideo');
      setIsPlaying(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (playPauseTimeout.current) clearTimeout(playPauseTimeout.current);
      if (loadTimeout.current) clearTimeout(loadTimeout.current);
    };
  }, []);

  // Error state
  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-stone-950 px-8">
        <AlertCircle size={48} className="text-stone-600 mb-4" />
        <p className="text-stone-400 text-center text-lg mb-2">Video unavailable</p>
        <p className="text-stone-600 text-center text-sm">
          Swipe to see the next spark
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-stone-950 overflow-hidden">
      {/* YouTube iframe */}
      {isActive && (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleLoad}
          onError={handleError}
          title="Spark motivational video"
        />
      )}

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-stone-950 z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 size={40} className="text-amber-500/60" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click area for play/pause */}
      <div
        className="absolute inset-0 z-20 cursor-pointer"
        onClick={togglePlayPause}
        role="button"
        tabIndex={0}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            togglePlayPause();
          }
        }}
      />

      {/* Play/Pause indicator */}
      <AnimatePresence>
        {showPlayPause && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              {isPlaying ? (
                <Pause size={36} className="text-white" />
              ) : (
                <Play size={36} className="text-white ml-1" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SparkVideoPlayer;
