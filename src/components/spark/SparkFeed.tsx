'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { SparkVideoPlayer } from './SparkVideoPlayer';
import { SparkOverlay } from './SparkOverlay';
import { SparkWisdomBreak } from './SparkWisdomBreak';
import { useSparkStore } from '@/store/useSparkStore';
import { useStore } from '@/store/useStore';
import { getShuffledSparkVideos } from '@/content/sparkVideos';
import { SPARK_XP_REWARDS } from '@/types/spark';

// ═══════════════════════════════════════════════════════════════════════════
// SPARK FEED — TikTok-Style
// Full-screen 9:16 vertical feed with smooth swipe navigation
// ═══════════════════════════════════════════════════════════════════════════

interface SparkFeedProps {
  onExit: () => void;
}

export function SparkFeed({ onExit }: SparkFeedProps) {
  const {
    watchedVideos,
    videosWatchedThisSession,
    currentSessionBreakCount,
    isFirstSparkSession,
    markVideoWatched,
    toggleSaveVideo,
    isVideoSaved,
    startSession,
    endSession,
    shouldShowWisdomBreak,
    recordWisdomBreakChoice,
    isForcedClosedToday,
  } = useSparkStore();

  const addXp = useCallback((amount: number) => {
    if (amount > 0) {
      useStore.setState(state => ({ totalXp: state.totalXp + amount }));
    }
  }, []);

  // Generate shuffled playlist on mount
  const playlist = useMemo(() => {
    return getShuffledSparkVideos(watchedVideos);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWisdomBreak, setShowWisdomBreak] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const lastTapTime = useRef(0);

  const currentVideo = playlist[currentIndex];

  // Start session on mount
  useEffect(() => {
    startSession();
    if (isFirstSparkSession) {
      addXp(SPARK_XP_REWARDS.firstSession);
      useSparkStore.setState({ isFirstSparkSession: false });
    }
    return () => { endSession(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate to next video
  const goNext = useCallback(() => {
    if (isTransitioning || showWisdomBreak) return;
    if (currentIndex >= playlist.length - 1) return;

    const xp = markVideoWatched(currentVideo.id);
    addXp(xp);

    if (shouldShowWisdomBreak()) {
      setShowWisdomBreak(true);
      return;
    }

    setIsTransitioning(true);
    setDirection('up');
    setCurrentIndex(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 350);
  }, [currentIndex, playlist.length, isTransitioning, showWisdomBreak, currentVideo, markVideoWatched, addXp, shouldShowWisdomBreak]);

  // Navigate to previous video
  const goPrevious = useCallback(() => {
    if (isTransitioning || showWisdomBreak) return;
    if (currentIndex <= 0) return;

    setIsTransitioning(true);
    setDirection('down');
    setCurrentIndex(prev => prev - 1);
    setTimeout(() => setIsTransitioning(false), 350);
  }, [currentIndex, isTransitioning, showWisdomBreak]);

  // Handle wisdom break choices
  const handleWisdomBreakLeave = useCallback(() => {
    const { xpEarned } = recordWisdomBreakChoice('leave');
    addXp(xpEarned);
    setShowWisdomBreak(false);
    onExit();
  }, [recordWisdomBreakChoice, addXp, onExit]);

  const handleWisdomBreakContinue = useCallback(() => {
    const { shouldClose } = recordWisdomBreakChoice('continue');
    setShowWisdomBreak(false);

    if (shouldClose) {
      onExit();
      return;
    }

    setIsTransitioning(true);
    setDirection('up');
    setCurrentIndex(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 350);
  }, [recordWisdomBreakChoice, onExit]);

  // Double-tap to save
  const handleDoubleTap = useCallback(() => {
    if (currentVideo) {
      toggleSaveVideo(currentVideo.id);
    }
  }, [currentVideo, toggleSaveVideo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showWisdomBreak) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          goPrevious();
          break;
        case 'Escape':
          e.preventDefault();
          onExit();
          break;
        case 's':
          e.preventDefault();
          if (currentVideo) toggleSaveVideo(currentVideo.id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrevious, onExit, showWisdomBreak, currentVideo, toggleSaveVideo]);

  // Scroll/wheel navigation (debounced)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime.current < 400) return;
      lastScrollTime.current = now;

      if (e.deltaY > 20) {
        goNext();
      } else if (e.deltaY < -20) {
        goPrevious();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [goNext, goPrevious]);

  // Touch/swipe navigation — with velocity detection + double-tap
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();

      // Double-tap detection
      const now = Date.now();
      if (now - lastTapTime.current < 300) {
        handleDoubleTap();
      }
      lastTapTime.current = now;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      const deltaTime = Date.now() - touchStartTime.current;
      const velocity = Math.abs(deltaY) / deltaTime;

      // Lower threshold (30px) + velocity check for faster swipes
      const minDistance = velocity > 0.5 ? 20 : 30;

      if (deltaY > minDistance) {
        goNext();
      } else if (deltaY < -minDistance) {
        goPrevious();
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goNext, goPrevious, handleDoubleTap]);

  // Check if forced closed
  useEffect(() => {
    if (isForcedClosedToday()) {
      onExit();
    }
  }, [isForcedClosedToday, onExit]);

  if (!currentVideo) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center px-8">
          <Zap size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/50 text-lg">No more sparks available</p>
          <p className="text-white/30 text-sm mt-2">Come back tomorrow for fresh inspiration</p>
          <button
            onClick={onExit}
            className="mt-6 px-6 py-3 rounded-2xl bg-white/10 text-white/70 hover:bg-white/15 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 overflow-hidden"
      style={{
        touchAction: 'none',
        // Use dvh for proper mobile viewport height
        height: '100dvh',
      }}
    >
      {/* 9:16 phone-column container — centered */}
      <div className="relative w-full h-full max-w-[430px] mx-auto">
        {/* Video player with spring transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideo.id}
            className="absolute inset-0"
            initial={{
              opacity: 0,
              y: direction === 'up' ? '100%' : '-100%',
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: direction === 'up' ? '-100%' : '100%',
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
          >
            <SparkVideoPlayer
              youtubeId={currentVideo.youtubeId}
              isActive={!showWisdomBreak && !isTransitioning}
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay controls */}
        {!showWisdomBreak && (
          <SparkOverlay
            video={currentVideo}
            videoIndex={currentIndex}
            totalVideos={playlist.length}
            isSaved={isVideoSaved(currentVideo.id)}
            videosWatchedSession={videosWatchedThisSession}
            onSave={() => toggleSaveVideo(currentVideo.id)}
            onNext={goNext}
            onPrevious={goPrevious}
            onExit={onExit}
            hasPrevious={currentIndex > 0}
            hasNext={currentIndex < playlist.length - 1}
          />
        )}

        {/* Wisdom Break interstitial */}
        {showWisdomBreak && (
          <SparkWisdomBreak
            videosWatched={videosWatchedThisSession}
            breakNumber={currentSessionBreakCount + 1}
            onLeave={handleWisdomBreakLeave}
            onContinue={handleWisdomBreakContinue}
            isFinalBreak={currentSessionBreakCount + 1 >= 3}
          />
        )}
      </div>
    </div>
  );
}

export default SparkFeed;
