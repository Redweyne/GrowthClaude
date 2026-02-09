'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Zap } from 'lucide-react';
import { SparkVideoPlayer } from './SparkVideoPlayer';
import { SparkOverlay } from './SparkOverlay';
import { SparkWisdomBreak } from './SparkWisdomBreak';
import { useSparkStore } from '@/store/useSparkStore';
import { useStore } from '@/store/useStore';
import { getShuffledSparkVideos } from '@/content/sparkVideos';
import { SPARK_XP_REWARDS } from '@/types/spark';

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
      useStore.setState((state) => ({ totalXp: state.totalXp + amount }));
    }
  }, []);

  const playlist = useMemo(() => {
    return getShuffledSparkVideos(watchedVideos);
    // Keep one stable playlist per Spark session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWisdomBreak, setShowWisdomBreak] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);
  const trackControls = useAnimationControls();

  const currentVideo = playlist[currentIndex];
  const previousVideo = currentIndex > 0 ? playlist[currentIndex - 1] : null;
  const nextVideo = currentIndex < playlist.length - 1 ? playlist[currentIndex + 1] : null;
  const baseOffset = -containerHeight;

  useEffect(() => {
    startSession();

    if (isFirstSparkSession) {
      addXp(SPARK_XP_REWARDS.firstSession);
      useSparkStore.setState({ isFirstSparkSession: false });
    }

    return () => {
      endSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetTrackPosition = useCallback(() => {
    if (containerHeight <= 0) return;

    trackControls.start({
      y: baseOffset,
      transition: { type: 'spring', stiffness: 340, damping: 34, mass: 0.9 },
    });
  }, [containerHeight, baseOffset, trackControls]);

  const animateTo = useCallback(async (direction: 'up' | 'down') => {
    if (isTransitioning || showWisdomBreak) return;
    if (direction === 'up' && currentIndex >= playlist.length - 1) return;
    if (direction === 'down' && currentIndex <= 0) return;

    if (containerHeight === 0) {
      setCurrentIndex((prev) => prev + (direction === 'up' ? 1 : -1));
      return;
    }

    setIsTransitioning(true);

    const targetOffset = baseOffset + (direction === 'up' ? -containerHeight : containerHeight);

    await trackControls.start({
      y: targetOffset,
      transition: { type: 'spring', stiffness: 340, damping: 34, mass: 0.9 },
    });

    setCurrentIndex((prev) => prev + (direction === 'up' ? 1 : -1));
    trackControls.set({ y: baseOffset });
    setIsTransitioning(false);
  }, [isTransitioning, showWisdomBreak, currentIndex, playlist.length, containerHeight, baseOffset, trackControls]);

  const goNext = useCallback(async () => {
    if (isTransitioning || showWisdomBreak) return false;

    if (currentIndex >= playlist.length - 1) {
      resetTrackPosition();
      return false;
    }

    const xp = markVideoWatched(currentVideo.id);
    addXp(xp);

    if (shouldShowWisdomBreak()) {
      setShowWisdomBreak(true);
      resetTrackPosition();
      return false;
    }

    await animateTo('up');
    return true;
  }, [
    isTransitioning,
    showWisdomBreak,
    currentIndex,
    playlist.length,
    currentVideo,
    markVideoWatched,
    addXp,
    shouldShowWisdomBreak,
    animateTo,
    resetTrackPosition,
  ]);

  const goPrevious = useCallback(async () => {
    if (isTransitioning || showWisdomBreak) return false;

    if (currentIndex <= 0) {
      resetTrackPosition();
      return false;
    }

    await animateTo('down');
    return true;
  }, [isTransitioning, showWisdomBreak, currentIndex, animateTo, resetTrackPosition]);

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

    animateTo('up');
  }, [recordWisdomBreakChoice, onExit, animateTo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showWisdomBreak) return;

      switch (event.key) {
        case 'ArrowDown':
        case 'j':
          event.preventDefault();
          goNext();
          break;
        case 'ArrowUp':
        case 'k':
          event.preventDefault();
          goPrevious();
          break;
        case 'Escape':
          event.preventDefault();
          onExit();
          break;
        case 's':
          event.preventDefault();
          if (currentVideo) {
            toggleSaveVideo(currentVideo.id);
          }
          break;
        case 'm':
          event.preventDefault();
          setSoundEnabled((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrevious, onExit, showWisdomBreak, currentVideo, toggleSaveVideo]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const now = Date.now();
      if (now - lastScrollTime.current < 420) return;

      if (event.deltaY > 20) {
        lastScrollTime.current = now;
        goNext();
      } else if (event.deltaY < -20) {
        lastScrollTime.current = now;
        goPrevious();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [goNext, goPrevious]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setContainerHeight(container.clientHeight);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (containerHeight > 0) {
      trackControls.set({ y: -containerHeight });
    }
  }, [containerHeight, trackControls]);

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
            type="button"
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
        touchAction: 'pan-y',
        overscrollBehaviorY: 'contain',
        height: '100dvh',
      }}
    >
      <div className="relative w-full h-full max-w-[430px] mx-auto">
        <motion.div
          className="absolute inset-0"
          initial={{ y: baseOffset }}
          animate={trackControls}
          drag={showWisdomBreak ? false : 'y'}
          dragElastic={0.12}
          dragMomentum={false}
          dragConstraints={{
            top: baseOffset - containerHeight,
            bottom: baseOffset + containerHeight,
          }}
          onDragEnd={(_, info) => {
            if (showWisdomBreak || isTransitioning) {
              resetTrackPosition();
              return;
            }

            const swipeThreshold = Math.min(120, Math.max(60, containerHeight * 0.18));

            if (info.offset.y < -swipeThreshold || info.velocity.y < -600) {
              goNext();
              return;
            }

            if (info.offset.y > swipeThreshold || info.velocity.y > 600) {
              goPrevious();
              return;
            }

            resetTrackPosition();
          }}
        >
          {[previousVideo, currentVideo, nextVideo].map((video, index) => {
            const slotOffset = (index - 1) * (containerHeight || 0);

            return (
              <div
                key={video ? video.id : `spark-slot-${index}`}
                className="absolute inset-0"
                style={{ transform: `translateY(${slotOffset}px)` }}
              >
                {video ? (
                  <SparkVideoPlayer
                    key={`${video.id}-${index === 1 ? 'active' : 'preload'}`}
                    youtubeId={video.youtubeId}
                    isActive={index === 1 && !showWisdomBreak && !isTransitioning}
                    preload={index !== 1}
                    soundEnabled={soundEnabled}
                  />
                ) : (
                  <div className="w-full h-full bg-black" />
                )}
              </div>
            );
          })}
        </motion.div>

        {!showWisdomBreak && (
          <SparkOverlay
            video={currentVideo}
            videoIndex={currentIndex}
            totalVideos={playlist.length}
            isSaved={isVideoSaved(currentVideo.id)}
            soundEnabled={soundEnabled}
            videosWatchedSession={videosWatchedThisSession}
            onSave={() => toggleSaveVideo(currentVideo.id)}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            onExit={onExit}
          />
        )}

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
