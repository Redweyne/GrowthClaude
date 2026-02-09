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

const ACTIVE_VIDEO_THRESHOLD = 0.72;

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
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const watchedInSessionRef = useRef<Set<string>>(new Set());

  const activeVideo = playlist[activeIndex];

  const markVideoAsWatched = useCallback((videoId: string) => {
    if (watchedInSessionRef.current.has(videoId)) {
      return;
    }

    watchedInSessionRef.current.add(videoId);
    const xp = markVideoWatched(videoId);
    addXp(xp);
  }, [addXp, markVideoWatched]);

  const scrollToIndex = useCallback((index: number) => {
    const bounded = Math.max(0, Math.min(index, playlist.length - 1));
    const target = cardRefs.current[bounded];

    if (!target) return;

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [playlist.length]);

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
    if (!feedRef.current || playlist.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let candidateIndex: number | null = null;
        let candidateRatio = 0;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.intersectionRatio < ACTIVE_VIDEO_THRESHOLD) continue;

          const indexValue = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isNaN(indexValue)) continue;

          if (entry.intersectionRatio > candidateRatio) {
            candidateRatio = entry.intersectionRatio;
            candidateIndex = indexValue;
          }
        }

        if (candidateIndex === null) {
          return;
        }

        setActiveIndex((previous) => {
          if (previous === candidateIndex) return previous;
          return candidateIndex;
        });
      },
      {
        root: feedRef.current,
        threshold: [0.55, 0.72, 0.9],
      }
    );

    for (const card of cardRefs.current) {
      if (card) {
        observer.observe(card);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [playlist.length]);

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
          height: '100dvh',
          scrollSnapType: 'y mandatory',
          overscrollBehaviorY: 'contain',
          touchAction: 'pan-y',
        }}
      >
        {playlist.map((video, index) => {
          const isActive = index === activeIndex;
          const shouldMount = Math.abs(index - activeIndex) <= 1;

          return (
            <section
              key={video.id}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              data-index={index}
              data-testid={`spark-card-${index}`}
              className="relative h-[100dvh]"
              style={{
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
              }}
            >
              <div className="relative w-full h-full max-w-[430px] mx-auto">
                <SparkVideoPlayer
                  youtubeId={video.youtubeId}
                  isActive={isActive}
                  shouldMount={shouldMount}
                  soundEnabled={soundEnabled}
                />

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
