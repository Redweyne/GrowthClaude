'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Loader2, Pause, Play, Volume2 } from 'lucide-react';
import {
  type YouTubeApi,
  type YouTubePlayer,
  loadYouTubeApi,
} from './youtubeApi';

type PlayerStatus = 'idle' | 'ready' | 'error';

type PlayIndicator = 'play' | 'pause' | null;

interface SparkVideoPlayerProps {
  youtubeId: string;
  isActive: boolean;
  shouldMount: boolean;
  soundEnabled: boolean;
}

export function SparkVideoPlayer({
  youtubeId,
  isActive,
  shouldMount,
  soundEnabled,
}: SparkVideoPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const apiRef = useRef<YouTubeApi | null>(null);
  const activeRef = useRef(isActive);
  const soundRef = useRef(soundEnabled);
  const userPausedRef = useRef(false);
  const replayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playIndicator, setPlayIndicator] = useState<PlayIndicator>(null);

  useEffect(() => {
    activeRef.current = isActive;
    soundRef.current = soundEnabled;
  }, [isActive, soundEnabled]);

  const clearReplayTimer = useCallback(() => {
    if (!replayTimerRef.current) return;
    clearTimeout(replayTimerRef.current);
    replayTimerRef.current = null;
  }, []);

  const clearIndicatorTimer = useCallback(() => {
    if (!indicatorTimerRef.current) return;
    clearTimeout(indicatorTimerRef.current);
    indicatorTimerRef.current = null;
  }, []);

  const setTransientIndicator = useCallback((indicator: PlayIndicator) => {
    setPlayIndicator(indicator);
    clearIndicatorTimer();
    indicatorTimerRef.current = setTimeout(() => {
      setPlayIndicator(null);
    }, 580);
  }, [clearIndicatorTimer]);

  const syncPlayback = useCallback((allowAutoRetry: boolean) => {
    const player = playerRef.current;
    const api = apiRef.current;

    if (!player || !api || status !== 'ready') {
      return;
    }

    const shouldPlay = activeRef.current && !userPausedRef.current;

    try {
      if (!shouldPlay) {
        player.mute();
        player.pauseVideo();
        clearReplayTimer();
        return;
      }

      player.mute();
      player.playVideo();

      if (soundRef.current) {
        setTimeout(() => {
          if (!activeRef.current) return;
          try {
            player.unMute();
          } catch {
            // no-op
          }
        }, 120);
      }

      if (allowAutoRetry) {
        clearReplayTimer();
        replayTimerRef.current = setTimeout(() => {
          if (!activeRef.current || userPausedRef.current) return;
          const currentState = player.getPlayerState();
          const isPlayingNow = currentState === api.PlayerState.PLAYING || currentState === api.PlayerState.BUFFERING;
          if (!isPlayingNow) {
            try {
              player.mute();
              player.playVideo();
              if (soundRef.current) {
                player.unMute();
              }
            } catch {
              // no-op: external player retries on next active sync
            }
          }
        }, 700);
      }
    } catch {
      // no-op: external player retries on next active sync
    }
  }, [clearReplayTimer, status]);

  useEffect(() => {
    if (!shouldMount || !hostRef.current || playerRef.current) {
      return;
    }

    let isDisposed = false;

    loadYouTubeApi()
      .then((ytApi) => {
        if (isDisposed || !hostRef.current) return;

        apiRef.current = ytApi;
        userPausedRef.current = false;

        playerRef.current = new ytApi.Player(hostRef.current, {
          width: '100%',
          height: '100%',
          videoId: youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            modestbranding: 1,
            playsinline: 1,
            playlist: youtubeId,
            rel: 0,
            mute: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onReady: () => {
              if (isDisposed) return;
              setStatus('ready');
              syncPlayback(true);
            },
            onStateChange: (event) => {
              if (isDisposed || !apiRef.current) return;
              const isNowPlaying = event.data === apiRef.current.PlayerState.PLAYING;
              setIsPlaying(isNowPlaying);
            },
            onError: () => {
              if (isDisposed) return;
              setStatus('error');
              setIsPlaying(false);
            },
          },
        });
      })
      .catch(() => {
        if (isDisposed) return;
        setStatus('error');
      });

    return () => {
      isDisposed = true;
      clearReplayTimer();
      clearIndicatorTimer();
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      setStatus('idle');
      setIsPlaying(false);
    };
  }, [clearIndicatorTimer, clearReplayTimer, shouldMount, syncPlayback, youtubeId]);

  useEffect(() => {
    if (!isActive) {
      userPausedRef.current = false;
    }
    syncPlayback(true);
  }, [isActive, soundEnabled, syncPlayback]);

  const handleTogglePlayback = useCallback(() => {
    if (!isActive || status !== 'ready' || !playerRef.current) return;

    const player = playerRef.current;
    const shouldPause = isPlaying;

    try {
      if (shouldPause) {
        userPausedRef.current = true;
        player.pauseVideo();
        setIsPlaying(false);
        setTransientIndicator('pause');
        return;
      }

      userPausedRef.current = false;
      if (soundEnabled) {
        player.unMute();
      } else {
        player.mute();
      }
      player.playVideo();
      setIsPlaying(true);
      setTransientIndicator('play');
      syncPlayback(true);
    } catch {
      setStatus('error');
      setIsPlaying(false);
    }
  }, [isActive, isPlaying, setTransientIndicator, soundEnabled, status, syncPlayback]);

  const loading = shouldMount && status !== 'ready' && status !== 'error';
  const showSoundBadge = isActive && status === 'ready' && soundEnabled;

  const icon = useMemo(() => {
    if (playIndicator === 'play') return <Play size={28} className="text-white ml-1" />;
    if (playIndicator === 'pause') return <Pause size={28} className="text-white" />;
    return null;
  }, [playIndicator]);

  if (status === 'error') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black px-8">
        <AlertCircle size={40} className="text-stone-700 mb-3" />
        <p className="text-stone-500 text-center text-base mb-1">Video unavailable</p>
        <p className="text-stone-700 text-center text-sm">Swipe up for the next one</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden" data-testid="spark-video-player">
      {shouldMount && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            ref={hostRef}
            className="absolute inset-0"
            data-testid="spark-video-host"
            style={{
              width: '120%',
              height: '120%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(1.05)',
            }}
          />
        </div>
      )}

      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black"
            data-testid="spark-video-loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 size={30} className="text-white/25" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="absolute inset-0 z-30"
        onClick={handleTogglePlayback}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
      />

      <AnimatePresence>
        {icon && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.16 }}
          >
            <div className="w-16 h-16 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center">
              {icon}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSoundBadge && (
          <motion.div
            className="absolute top-[max(4.25rem,calc(2.5rem+env(safe-area-inset-top)))] left-1/2 -translate-x-1/2 z-40 pointer-events-none"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 py-1.5 rounded-full bg-black/60 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md flex items-center gap-1.5">
              <Volume2 size={14} className="text-emerald-300" />
              Sound on
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SparkVideoPlayer;
