'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Zap } from 'lucide-react';
import { SparkVideoPlayer } from './SparkVideoPlayer';
import { SparkOverlay } from './SparkOverlay';
import { useSparkStore } from '@/store/useSparkStore';
import { useStore } from '@/store/useStore';
import { getShuffledSparkVideos } from '@/content/sparkVideos';
import { SPARK_XP_REWARDS } from '@/types/spark';

interface SparkFeedProps {
  onExit: () => void;
}

const SNAP_SWITCH_THRESHOLD = 0.62;

export function SparkFeed({ onExit }: SparkFeedProps) {
  const {
    watchedVideos,
    videosWatchedThisSession,
    isFirstSparkSession,
    markVideoWatched,
    toggleSaveVideo,
    isVideoSaved,
    startSession,
    endSession,
    isForcedClosedToday,
  } = useSparkStore();

  const addXp = useCallback((amount: number) => {
    if (amount > 0) {
      useStore.setState((state) => ({ totalXp: state.totalXp + amount }));
    }
  }, []);

  const playlist = useMemo(() => {
    return getShuffledSparkVideos(watchedVideos);
    // Keep this playlist fixed during one Spark session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const feedRef = useRef<HTMLDivElement>(null);
  const watchedInSessionRef = useRef<Set<string>>(new Set());
  const scrollRafRef = useRef<number | null>(null);

  const activeVideo = playlist[activeIndex];

  const markVideoAsWatched = useCallback((videoId: string) => {
    if (watchedInSessionRef.current.has(videoId)) {
      return;
    }

    watchedInSessionRef.current.add(videoId);
    const xp = markVideoWatched(videoId);
    addXp(xp);
  }, [addXp, markVideoWatched]);

  const resolveCardHeight = useCallback(() => {
    const feed = feedRef.current;
    if (!feed) return 0;
    return feed.clientHeight || window.innerHeight || 0;
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const feed = feedRef.current;
    if (!feed) return;

    const cardHeight = resolveCardHeight();
    if (cardHeight <= 0) return;

    const bounded = Math.max(0, Math.min(index, playlist.length - 1));
    feed.scrollTo({
      top: bounded * cardHeight,
      behavior: 'smooth',
    });
  }, [playlist.length, resolveCardHeight]);

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

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;

    const updateActiveIndex = () => {
      const cardHeight = resolveCardHeight();
      if (cardHeight <= 0) return;

      const maxIndex = playlist.length - 1;
      const scrollRatio = feed.scrollTop / cardHeight;

      setActiveIndex((previous) => {
        let next = previous;

        if (Math.abs(scrollRatio - previous) > 1.2) {
          next = Math.round(scrollRatio);
        } else if (scrollRatio >= previous + SNAP_SWITCH_THRESHOLD) {
          next = previous + 1;
        } else if (scrollRatio <= previous - SNAP_SWITCH_THRESHOLD) {
          next = previous - 1;
        }

        const bounded = Math.max(0, Math.min(next, maxIndex));
        return bounded === previous ? previous : bounded;
      });
    };

    const handleScroll = () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
      scrollRafRef.current = requestAnimationFrame(updateActiveIndex);
    };

    handleScroll();

    feed.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      feed.removeEventListener('scroll', handleScroll);
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [playlist.length, resolveCardHeight]);

  useEffect(() => {
    if (!activeVideo) return;

    const watchTimer = window.setTimeout(() => {
      markVideoAsWatched(activeVideo.id);
    }, 1200);

    return () => {
      window.clearTimeout(watchTimer);
    };
  }, [activeVideo, markVideoAsWatched]);

  useEffect(() => {
    if (isForcedClosedToday()) {
      onExit();
    }
  }, [isForcedClosedToday, onExit]);

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    feed.scrollTop = 0;
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
        case 'j':
          event.preventDefault();
          scrollToIndex(activeIndex + 1);
          break;
        case 'ArrowUp':
        case 'k':
          event.preventDefault();
          scrollToIndex(activeIndex - 1);
          break;
        case 's':
          event.preventDefault();
          if (activeVideo) {
            toggleSaveVideo(activeVideo.id);
          }
          break;
        case 'm':
          event.preventDefault();
          setSoundEnabled((previous) => !previous);
          break;
        case 'Escape':
          event.preventDefault();
          onExit();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, activeVideo, onExit, scrollToIndex, toggleSaveVideo]);

  if (playlist.length === 0 || !activeVideo) {
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
    <div className="fixed inset-0 z-50 bg-black" data-testid="spark-feed">
      <div
        ref={feedRef}
        className="absolute inset-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          height: '100svh',
          scrollSnapType: 'y mandatory',
          overscrollBehaviorY: 'none',
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {playlist.map((video, index) => {
          const isActive = index === activeIndex;
          const shouldRenderPlayer = Math.abs(index - activeIndex) <= 1;

          return (
            <section
              key={video.id}
              data-testid={`spark-card-${index}`}
              className="relative h-[100svh]"
              style={{
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
              }}
            >
              <div className="relative w-full h-full max-w-[430px] mx-auto">
                {shouldRenderPlayer ? (
                  <SparkVideoPlayer
                    youtubeId={video.youtubeId}
                    isActive={isActive}
                    soundEnabled={soundEnabled}
                  />
                ) : (
                  <div className="absolute inset-0 bg-black" />
                )}

                {isActive && (
                  <SparkOverlay
                    video={video}
                    videoIndex={index}
                    totalVideos={playlist.length}
                    isSaved={isVideoSaved(video.id)}
                    soundEnabled={soundEnabled}
                    videosWatchedSession={videosWatchedThisSession}
                    onSave={() => toggleSaveVideo(video.id)}
                    onToggleSound={() => setSoundEnabled((previous) => !previous)}
                    onExit={onExit}
                  />
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default SparkFeed;
