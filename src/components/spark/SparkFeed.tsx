'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Zap } from 'lucide-react';
import { SparkVideoPlayer } from './SparkVideoPlayer';
import { SparkOverlay } from './SparkOverlay';
import { useSparkStore } from '@/store/useSparkStore';
import { useStore } from '@/store/useStore';
import { getShuffledSparkVideos, sparkVideos } from '@/content/sparkVideos';
import { SPARK_XP_REWARDS } from '@/types/spark';
import { useTranslation } from '@/i18n';

interface SparkFeedProps {
  onExit: () => void;
}

export function SparkFeed({ onExit }: SparkFeedProps) {
  const { locale } = useTranslation();
  const {
    watchedVideos,
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

  const copy = {
    en: {
      noMore: 'No more sparks available',
      comeBackTomorrow: 'Come back tomorrow for fresh inspiration',
      backToHome: 'Back to Home',
    },
    fr: {
      noMore: "Plus d'étincelles disponibles",
      comeBackTomorrow: "Revenez demain pour une nouvelle inspiration",
      backToHome: "Retour à l'accueil",
    },
    ar: {
      noMore: 'لا توجد مقاطع شرارة أخرى متاحة',
      comeBackTomorrow: 'عد غداً لإلهام جديد',
      backToHome: 'العودة إلى الرئيسية',
    },
  } as const;
  const c = copy[locale] ?? copy.en;

  const playlist = useMemo(() => {
    // TikTok-like: if every video in the catalog has been watched, reset history
    const watchedSet = new Set(watchedVideos);
    const allWatched = sparkVideos.every((v) => watchedSet.has(v.id));

    if (allWatched) {
      // Clear watch history (savedVideos are preserved separately)
      useSparkStore.setState({ watchedVideos: [] });
      return getShuffledSparkVideos([]);
    }

    return getShuffledSparkVideos(watchedVideos);
    // Keep this playlist fixed during one Spark session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [soundWanted, setSoundWanted] = useState(false);
  const [soundGestureUnlocked, setSoundGestureUnlocked] = useState(false);

  const feedRef = useRef<HTMLDivElement>(null);
  const watchedInSessionRef = useRef<Set<string>>(new Set());
  const activeIndexRef = useRef(0);
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
    activeIndexRef.current = bounded;
    setActiveIndex(bounded);
    feed.scrollTo({
      top: bounded * cardHeight,
      behavior: 'smooth',
    });
  }, [playlist.length, resolveCardHeight]);

  const toggleSound = useCallback(() => {
    setSoundWanted((previous) => {
      const next = !previous;
      if (next && !soundGestureUnlocked) {
        setSoundGestureUnlocked(true);
      }
      return next;
    });
  }, [soundGestureUnlocked]);

  const soundEnabled = soundWanted && soundGestureUnlocked;

  const handleAutoplaySoundBlocked = useCallback(() => {
    setSoundWanted(false);
  }, []);

  // Auto-skip to the next video when one fails (e.g. deleted from YouTube)
  const handleVideoError = useCallback(() => {
    if (activeIndexRef.current < playlist.length - 1) {
      // Small delay so the error state is visible briefly before skipping
      const timer = window.setTimeout(() => {
        scrollToIndex(activeIndexRef.current + 1);
      }, 800);
      return () => window.clearTimeout(timer);
    }
  }, [playlist.length, scrollToIndex]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

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

      const threshold = cardHeight * 0.9;
      let nextIndex = activeIndexRef.current;
      let delta = feed.scrollTop - nextIndex * cardHeight;

      while (delta > threshold && nextIndex < playlist.length - 1) {
        nextIndex += 1;
        delta = feed.scrollTop - nextIndex * cardHeight;
      }

      while (delta < -threshold && nextIndex > 0) {
        nextIndex -= 1;
        delta = feed.scrollTop - nextIndex * cardHeight;
      }

      if (nextIndex === activeIndexRef.current) return;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    };

    const handleScroll = () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
      scrollRafRef.current = requestAnimationFrame(updateActiveIndex);
    };

    updateActiveIndex();

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
    activeIndexRef.current = 0;
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
          toggleSound();
          break;
        case 'Escape':
          event.preventDefault();
          onExit();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, activeVideo, onExit, scrollToIndex, toggleSaveVideo, toggleSound]);

  if (playlist.length === 0 || !activeVideo) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center px-8">
          <Zap size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/50 text-lg">{c.noMore}</p>
          <p className="text-white/30 text-sm mt-2">{c.comeBackTomorrow}</p>
          <button
            type="button"
            onClick={onExit}
            className="mt-6 px-6 py-3 rounded-2xl bg-white/10 text-white/70 hover:bg-white/15 transition-colors"
          >
            {c.backToHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black" data-testid="spark-feed">
      <div
        ref={feedRef}
        className="absolute inset-0 z-20 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          height: '100svh',
          scrollSnapType: 'y mandatory',
          overscrollBehaviorY: 'none',
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          className="absolute left-0 right-0 z-10 h-[100svh]"
          style={{ top: `calc(${activeIndex} * 100svh)` }}
        >
          <div className="relative w-full h-full max-w-[430px] mx-auto">
            <SparkVideoPlayer
              youtubeId={activeVideo.youtubeId}
              isActive
              soundEnabled={soundEnabled}
              allowAutoplaySound={soundGestureUnlocked}
              onAutoplaySoundBlocked={handleAutoplaySoundBlocked}
              onVideoError={handleVideoError}
            />
          </div>
        </div>

        {playlist.map((video, index) => (
          <section
            key={video.id}
            data-testid={`spark-card-${index}`}
            className="relative h-[100svh]"
            style={{
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="relative w-full h-full max-w-[430px] mx-auto">
          <SparkOverlay
            video={activeVideo}
            isSaved={isVideoSaved(activeVideo.id)}
            soundEnabled={soundEnabled}
            onSave={() => toggleSaveVideo(activeVideo.id)}
            onToggleSound={toggleSound}
            onExit={onExit}
          />
        </div>
      </div>
    </div>
  );
}

export default SparkFeed;
