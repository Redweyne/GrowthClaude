'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';
import { SparkVideoPlayer } from './SparkVideoPlayer';
import { SparkOverlay } from './SparkOverlay';
import { SparkWisdomBreak } from './SparkWisdomBreak';
import { useSparkStore } from '@/store/useSparkStore';
import { useStore } from '@/store/useStore';
import { getShuffledSparkVideos } from '@/content/sparkVideos';
import { SPARK_XP_REWARDS } from '@/types/spark';

// ═══════════════════════════════════════════════════════════════════════════
// SPARK FEED
// The main container: one video at a time, keyboard/scroll/touch navigation,
// wisdom breaks, and XP integration
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

  const { totalXp } = useStore();
  const addXp = useCallback((amount: number) => {
    if (amount > 0) {
      useStore.setState(state => ({ totalXp: state.totalXp + amount }));
    }
  }, []);

  // Generate shuffled playlist on mount
  const playlist = useMemo(() => {
    return getShuffledSparkVideos(watchedVideos);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only shuffle once on mount

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWisdomBreak, setShowWisdomBreak] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);
  const lastTouchY = useRef(0);

  const currentVideo = playlist[currentIndex];

  // Start session on mount
  useEffect(() => {
    startSession();

    // Award first session XP
    if (isFirstSparkSession) {
      addXp(SPARK_XP_REWARDS.firstSession);
      useSparkStore.setState({ isFirstSparkSession: false });
    }

    return () => {
      endSession();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate to next video
  const goNext = useCallback(() => {
    if (isTransitioning || showWisdomBreak) return;
    if (currentIndex >= playlist.length - 1) return;

    // Mark current video as watched and get XP
    const xp = markVideoWatched(currentVideo.id);
    addXp(xp);

    // Check for wisdom break BEFORE advancing
    // We check AFTER markVideoWatched so the count is updated
    if (shouldShowWisdomBreak()) {
      setShowWisdomBreak(true);
      return;
    }

    setIsTransitioning(true);
    setDirection('up');
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsTransitioning(false);
    }, 200);
  }, [currentIndex, playlist.length, isTransitioning, showWisdomBreak, currentVideo, markVideoWatched, addXp, shouldShowWisdomBreak]);

  // Navigate to previous video
  const goPrevious = useCallback(() => {
    if (isTransitioning || showWisdomBreak) return;
    if (currentIndex <= 0) return;

    setIsTransitioning(true);
    setDirection('down');
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1);
      setIsTransitioning(false);
    }, 200);
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

    // Advance to next video
    setIsTransitioning(true);
    setDirection('up');
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsTransitioning(false);
    }, 200);
  }, [recordWisdomBreakChoice, onExit]);

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
      if (now - lastScrollTime.current < 500) return; // Debounce 500ms
      lastScrollTime.current = now;

      if (e.deltaY > 30) {
        goNext();
      } else if (e.deltaY < -30) {
        goPrevious();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [goNext, goPrevious]);

  // Touch/swipe navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = lastTouchY.current - e.changedTouches[0].clientY;
      const minSwipe = 50; // Minimum swipe distance

      if (deltaY > minSwipe) {
        goNext();
      } else if (deltaY < -minSwipe) {
        goPrevious();
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goNext, goPrevious]);

  // Check if forced closed
  useEffect(() => {
    if (isForcedClosedToday()) {
      onExit();
    }
  }, [isForcedClosedToday, onExit]);

  if (!currentVideo) {
    return (
      <div className="fixed inset-0 bg-stone-950 flex items-center justify-center z-50">
        <div className="text-center px-8">
          <Zap size={48} className="text-amber-500/40 mx-auto mb-4" />
          <p className="text-stone-400 text-lg">No more sparks available</p>
          <p className="text-stone-600 text-sm mt-2">Come back tomorrow for fresh inspiration</p>
          <button
            onClick={onExit}
            className="mt-6 px-6 py-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700 transition-colors"
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
      className="fixed inset-0 bg-stone-950 z-50 overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      {/* Back button */}
      <button
        onClick={onExit}
        className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        aria-label="Exit Spark"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Spark branding */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5">
        <Zap size={16} className="text-amber-400" />
        <span className="text-white font-semibold text-sm">Spark</span>
      </div>

      {/* Video player with transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideo.id}
          className="absolute inset-0"
          initial={{
            opacity: 0,
            y: direction === 'up' ? 100 : -100,
          }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: direction === 'up' ? -100 : 100,
          }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
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
  );
}

export default SparkFeed;
