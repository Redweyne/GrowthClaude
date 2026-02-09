'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Loader2, Pause, Play, Volume2 } from 'lucide-react';
import {
  type YouTubeApi,
  type YouTubePlayer,
  loadYouTubeApi,
} from './youtubeApi';

type PlayerStatus = 'loading' | 'ready' | 'error';

type PlayIndicator = 'play' | 'pause' | null;

interface SparkVideoPlayerProps {
  youtubeId: string;
  isActive: boolean;
  soundEnabled: boolean;
  disableTapToggle?: boolean;
}

const TAP_MAX_MOVE_PX = 10;

export function SparkVideoPlayer({
  youtubeId,
  isActive,
  soundEnabled,
  disableTapToggle = false,
}: SparkVideoPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const apiRef = useRef<YouTubeApi | null>(null);
  const activeRef = useRef(isActive);
  const soundRef = useRef(soundEnabled);
  const userPausedRef = useRef(false);
  const autoplayRetryRef = useRef<number | null>(null);
  const indicatorTimerRef = useRef<number | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const readyRef = useRef(false);

  const [status, setStatus] = useState<PlayerStatus>('loading');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playIndicator, setPlayIndicator] = useState<PlayIndicator>(null);

  useEffect(() => {
    activeRef.current = isActive;
    soundRef.current = soundEnabled;
  }, [isActive, soundEnabled]);

  const clearAutoplayRetry = useCallback(() => {
    if (!autoplayRetryRef.current) return;
    window.clearTimeout(autoplayRetryRef.current);
    autoplayRetryRef.current = null;
  }, []);

  const clearIndicatorTimer = useCallback(() => {
    if (!indicatorTimerRef.current) return;
    window.clearTimeout(indicatorTimerRef.current);
    indicatorTimerRef.current = null;
  }, []);

  const setTransientIndicator = useCallback((indicator: PlayIndicator) => {
    setPlayIndicator(indicator);
    clearIndicatorTimer();
    indicatorTimerRef.current = window.setTimeout(() => {
      setPlayIndicator(null);
    }, 580);
  }, [clearIndicatorTimer]);

  const applySoundState = useCallback(() => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;

    try {
      if (!soundRef.current) {
        player.mute();
        return;
      }
      player.unMute();
    } catch {
      try {
        player.mute();
      } catch {
        // no-op
      }
    }
  }, []);

  const attemptPlay = useCallback(() => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;

    try {
      player.mute();
      player.playVideo();
    } catch {
      return;
    }

    if (!soundRef.current) return;

    window.setTimeout(() => {
      if (!activeRef.current || userPausedRef.current) return;
      applySoundState();
    }, 140);
  }, [applySoundState]);

  const syncPlayback = useCallback((allowAutoRetry: boolean) => {
    const player = playerRef.current;
    const api = apiRef.current;

    if (!player || !api || !readyRef.current) return;

    const shouldPlay = activeRef.current && !userPausedRef.current;

    if (!shouldPlay) {
      try {
        player.mute();
        player.pauseVideo();
      } catch {
        // no-op
      }
      setIsPlaying(false);
      clearAutoplayRetry();
      return;
    }

    attemptPlay();

    if (!allowAutoRetry) return;

    clearAutoplayRetry();
    autoplayRetryRef.current = window.setTimeout(() => {
      autoplayRetryRef.current = null;
      if (!activeRef.current || userPausedRef.current || !apiRef.current || !playerRef.current) return;
      const state = playerRef.current.getPlayerState();
      const isRunning = state === apiRef.current.PlayerState.PLAYING || state === apiRef.current.PlayerState.BUFFERING;
      if (!isRunning) {
        attemptPlay();
      }
    }, 520);
  }, [attemptPlay, clearAutoplayRetry]);

  useEffect(() => {
    if (!hostRef.current || playerRef.current) {
      return;
    }

    let isDisposed = false;

    loadYouTubeApi()
      .then((ytApi) => {
        if (isDisposed || !hostRef.current) return;

        apiRef.current = ytApi;
        userPausedRef.current = false;
        setIsPlaying(false);

        playerRef.current = new ytApi.Player(hostRef.current, {
          width: '100%',
          height: '100%',
          videoId: youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            cc_load_policy: 0,
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
              readyRef.current = true;
              setStatus(activeRef.current ? 'loading' : 'ready');
              syncPlayback(true);
            },
            onStateChange: (event) => {
              if (isDisposed || !apiRef.current) return;

              const player = playerRef.current;
              const api = apiRef.current;

              if (event.data === api.PlayerState.PLAYING) {
                setStatus('ready');
                setIsPlaying(true);
                clearAutoplayRetry();
                return;
              }

              if (event.data === api.PlayerState.BUFFERING) {
                setStatus('ready');
                setIsPlaying(true);
                return;
              }

              if (event.data === api.PlayerState.ENDED) {
                setIsPlaying(false);
                if (!activeRef.current || !player) return;
                try {
                  player.seekTo(0, true);
                } catch {
                  // no-op
                }
                syncPlayback(false);
                return;
              }

              if (event.data === api.PlayerState.PAUSED) {
                setIsPlaying(false);
                return;
              }

              if (event.data === api.PlayerState.CUED || event.data === api.PlayerState.UNSTARTED) {
                setIsPlaying(false);
              }
            },
            onError: () => {
              if (isDisposed) return;
              clearAutoplayRetry();
              setStatus('error');
              setIsPlaying(false);
            },
          },
        });
      })
      .catch(() => {
        if (isDisposed) return;
        clearAutoplayRetry();
        setStatus('error');
        setIsPlaying(false);
      });

    return () => {
      isDisposed = true;
      clearAutoplayRetry();
      clearIndicatorTimer();
      readyRef.current = false;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      apiRef.current = null;
      setStatus('loading');
      setIsPlaying(false);
    };
  }, [clearAutoplayRetry, clearIndicatorTimer, syncPlayback, youtubeId]);

  useEffect(() => {
    if (!isActive) {
      userPausedRef.current = false;
    }

    if (!readyRef.current) return;

    let activationAttempts = 0;
    let activationRetryTimer: number | null = null;

    const ensureActivePlayback = () => {
      if (!activeRef.current || userPausedRef.current || !apiRef.current || !playerRef.current || !readyRef.current) {
        return;
      }

      const state = playerRef.current.getPlayerState();
      const isRunning = state === apiRef.current.PlayerState.PLAYING || state === apiRef.current.PlayerState.BUFFERING;

      if (isRunning || activationAttempts >= 3) {
        return;
      }

      activationAttempts += 1;
      syncPlayback(false);
      activationRetryTimer = window.setTimeout(ensureActivePlayback, 320);
    };

    const syncTimer = window.setTimeout(() => {
      syncPlayback(true);

      if (activeRef.current && !userPausedRef.current) {
        activationRetryTimer = window.setTimeout(ensureActivePlayback, 280);
      }
    }, 0);

    return () => {
      window.clearTimeout(syncTimer);
      if (activationRetryTimer !== null) {
        window.clearTimeout(activationRetryTimer);
      }
    };
  }, [isActive, soundEnabled, syncPlayback]);

  const handleTogglePlayback = useCallback(() => {
    if (!isActive || !readyRef.current || !playerRef.current) return;

    const player = playerRef.current;

    try {
      if (isPlaying) {
        userPausedRef.current = true;
        player.pauseVideo();
        setIsPlaying(false);
        setTransientIndicator('pause');
        clearAutoplayRetry();
        return;
      }

      userPausedRef.current = false;
      setTransientIndicator('play');
      syncPlayback(true);
    } catch {
      setStatus('error');
      setIsPlaying(false);
    }
  }, [clearAutoplayRetry, isActive, isPlaying, setTransientIndicator, syncPlayback]);

  const loading = isActive && status === 'loading';
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
            backgroundColor: 'black',
          }}
        />
      </div>

      <div
        className="absolute inset-0 z-30"
        role="button"
        tabIndex={0}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        style={{ touchAction: 'pan-y' }}
        onPointerDown={(event) => {
          if (disableTapToggle) return;
          pointerStartRef.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerCancel={() => {
          pointerStartRef.current = null;
        }}
        onPointerUp={(event) => {
          const start = pointerStartRef.current;
          pointerStartRef.current = null;
          if (disableTapToggle) return;
          if (!start) return;
          const movedX = Math.abs(event.clientX - start.x);
          const movedY = Math.abs(event.clientY - start.y);
          if (movedX > TAP_MAX_MOVE_PX || movedY > TAP_MAX_MOVE_PX) return;
          handleTogglePlayback();
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          handleTogglePlayback();
        }}
      />

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
