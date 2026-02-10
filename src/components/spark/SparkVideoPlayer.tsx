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
  allowAutoplaySound?: boolean;
  disableTapToggle?: boolean;
}

const TAP_MAX_MOVE_PX = 10;
const PLAY_RETRY_DELAY_MS = 340;
const UNMUTE_DELAY_MS = 120;
const UNMUTE_BLOCK_WINDOW_MS = 900;
const RECOVERY_THROTTLE_MS = 420;
const MAX_STATE_RECOVERY = 3;

export function SparkVideoPlayer({
  youtubeId,
  isActive,
  soundEnabled,
  allowAutoplaySound = false,
  disableTapToggle = false,
}: SparkVideoPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const apiRef = useRef<YouTubeApi | null>(null);

  const activeRef = useRef(isActive);
  const soundRef = useRef(soundEnabled);
  const allowAutoplaySoundRef = useRef(allowAutoplaySound);
  const userPausedRef = useRef(false);
  const readyRef = useRef(false);

  const activationTokenRef = useRef(0);
  const recoveryCountRef = useRef(0);
  const lastRecoveryAtRef = useRef(0);
  const unmuteAttemptAtRef = useRef(0);
  const soundBlockedForActivationRef = useRef(false);
  const previousIsActiveRef = useRef(isActive);
  const previousSoundEnabledRef = useRef(soundEnabled);

  const playRetryTimerRef = useRef<number | null>(null);
  const unmuteTimerRef = useRef<number | null>(null);
  const indicatorTimerRef = useRef<number | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const [status, setStatus] = useState<PlayerStatus>('loading');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playIndicator, setPlayIndicator] = useState<PlayIndicator>(null);

  const clearPlayRetryTimer = useCallback(() => {
    if (playRetryTimerRef.current === null) return;
    window.clearTimeout(playRetryTimerRef.current);
    playRetryTimerRef.current = null;
  }, []);

  const clearUnmuteTimers = useCallback(() => {
    if (unmuteTimerRef.current !== null) {
      window.clearTimeout(unmuteTimerRef.current);
      unmuteTimerRef.current = null;
    }
  }, []);

  const clearIndicatorTimer = useCallback(() => {
    if (indicatorTimerRef.current === null) return;
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

  const safeMute = useCallback(() => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;

    try {
      player.mute();
    } catch {
      // no-op
    }
  }, []);

  const safeUnmute = useCallback(() => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;

    try {
      player.unMute();
    } catch {
      soundRef.current = false;
      safeMute();
    }
  }, [safeMute]);

  const safePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;

    try {
      player.playVideo();
    } catch {
      // no-op
    }
  }, []);

  const safePause = useCallback(() => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;

    try {
      player.pauseVideo();
    } catch {
      // no-op
    }
  }, []);

  const playMuted = useCallback(() => {
    safeMute();
    safePlay();
  }, [safeMute, safePlay]);

  const recoverPlayback = useCallback(() => {
    if (!activeRef.current || userPausedRef.current) return;

    const now = Date.now();
    if (now - lastRecoveryAtRef.current < RECOVERY_THROTTLE_MS) {
      return;
    }

    if (recoveryCountRef.current >= MAX_STATE_RECOVERY) {
      return;
    }

    recoveryCountRef.current += 1;
    lastRecoveryAtRef.current = now;
    playMuted();
  }, [playMuted]);

  const applySoundIntent = useCallback(() => {
    const player = playerRef.current;
    const api = apiRef.current;

    if (!player || !api || !readyRef.current) return;

    const shouldEnableSound = activeRef.current
      && soundRef.current
      && allowAutoplaySoundRef.current
      && !soundBlockedForActivationRef.current
      && !userPausedRef.current;

    if (!shouldEnableSound) {
      unmuteAttemptAtRef.current = 0;
      clearUnmuteTimers();
      safeMute();
      return;
    }

    const state = player.getPlayerState();
    const isRunning = state === api.PlayerState.PLAYING || state === api.PlayerState.BUFFERING;
    if (!isRunning) return;

    clearUnmuteTimers();
    unmuteTimerRef.current = window.setTimeout(() => {
      if (!activeRef.current || userPausedRef.current) return;

      safeUnmute();
      unmuteAttemptAtRef.current = Date.now();
    }, UNMUTE_DELAY_MS);
  }, [clearUnmuteTimers, safeMute, safeUnmute]);

  const runActivationPlayback = useCallback((activationToken: number, retryCount: number) => {
    const attempt = (remaining: number) => {
      if (activationToken !== activationTokenRef.current) return;
      if (!activeRef.current || userPausedRef.current) return;

      const player = playerRef.current;
      const api = apiRef.current;
      if (!player || !api || !readyRef.current) return;

      const state = player.getPlayerState();
      const isRunning = state === api.PlayerState.PLAYING || state === api.PlayerState.BUFFERING;
      if (isRunning) {
        applySoundIntent();
        return;
      }

      playMuted();

      if (remaining <= 0) {
        clearPlayRetryTimer();
        return;
      }

      clearPlayRetryTimer();
      playRetryTimerRef.current = window.setTimeout(() => {
        attempt(remaining - 1);
      }, PLAY_RETRY_DELAY_MS);
    };

    attempt(retryCount);
  }, [applySoundIntent, clearPlayRetryTimer, playMuted]);

  const beginActivation = useCallback(() => {
    activationTokenRef.current += 1;
    const token = activationTokenRef.current;

    userPausedRef.current = false;
    recoveryCountRef.current = 0;
    lastRecoveryAtRef.current = 0;
    unmuteAttemptAtRef.current = 0;
    soundBlockedForActivationRef.current = false;

    clearPlayRetryTimer();
    clearUnmuteTimers();
    runActivationPlayback(token, 2);
  }, [clearPlayRetryTimer, clearUnmuteTimers, runActivationPlayback]);

  const pauseForInactive = useCallback(() => {
    activationTokenRef.current += 1;
    recoveryCountRef.current = 0;
    lastRecoveryAtRef.current = 0;
    unmuteAttemptAtRef.current = 0;
    soundBlockedForActivationRef.current = false;

    clearPlayRetryTimer();
    clearUnmuteTimers();

    safeMute();
    safePause();
  }, [clearPlayRetryTimer, clearUnmuteTimers, safeMute, safePause]);

  useEffect(() => {
    const wasSoundEnabled = previousSoundEnabledRef.current;
    previousSoundEnabledRef.current = soundEnabled;

    activeRef.current = isActive;
    soundRef.current = soundEnabled;
    allowAutoplaySoundRef.current = allowAutoplaySound;

    if (!wasSoundEnabled && soundEnabled) {
      soundBlockedForActivationRef.current = false;
    }

    if (!isActive) {
      userPausedRef.current = false;
      unmuteAttemptAtRef.current = 0;
      soundBlockedForActivationRef.current = false;
    }
  }, [allowAutoplaySound, isActive, soundEnabled]);

  useEffect(() => {
    if (!hostRef.current || playerRef.current) return;

    let isDisposed = false;

    loadYouTubeApi()
      .then((ytApi) => {
        if (isDisposed || !hostRef.current) return;

        apiRef.current = ytApi;
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
              setStatus('ready');

              if (activeRef.current) {
                beginActivation();
              } else {
                pauseForInactive();
              }
            },
            onStateChange: (event) => {
              if (isDisposed || !apiRef.current) return;

              const api = apiRef.current;
              const player = playerRef.current;

              if (event.data === api.PlayerState.PLAYING) {
                setStatus('ready');
                setIsPlaying(true);
                recoveryCountRef.current = 0;
                clearPlayRetryTimer();
                applySoundIntent();
                return;
              }

              if (event.data === api.PlayerState.BUFFERING) {
                setStatus('ready');
                setIsPlaying(true);
                return;
              }

              if (event.data === api.PlayerState.ENDED) {
                setIsPlaying(false);
                if (activeRef.current && !userPausedRef.current && player) {
                  try {
                    player.seekTo(0, true);
                  } catch {
                    // no-op
                  }
                  beginActivation();
                }
                return;
              }

              if (event.data === api.PlayerState.PAUSED) {
                setIsPlaying(false);
                if (userPausedRef.current) return;

                const pausedAfterUnmute = unmuteAttemptAtRef.current > 0
                  && Date.now() - unmuteAttemptAtRef.current < UNMUTE_BLOCK_WINDOW_MS;

                if (pausedAfterUnmute && activeRef.current) {
                  unmuteAttemptAtRef.current = 0;
                  soundBlockedForActivationRef.current = true;
                  soundRef.current = false;
                  clearUnmuteTimers();
                  safeMute();
                }

                recoverPlayback();
                return;
              }

              if (event.data === api.PlayerState.CUED || event.data === api.PlayerState.UNSTARTED) {
                setIsPlaying(false);
                recoverPlayback();
              }
            },
            onError: () => {
              if (isDisposed) return;
              clearPlayRetryTimer();
              clearUnmuteTimers();
              setStatus('error');
              setIsPlaying(false);
            },
          },
        });
      })
      .catch(() => {
        if (isDisposed) return;
        clearPlayRetryTimer();
        clearUnmuteTimers();
        setStatus('error');
        setIsPlaying(false);
      });

    return () => {
      isDisposed = true;
      clearPlayRetryTimer();
      clearUnmuteTimers();
      clearIndicatorTimer();
      readyRef.current = false;
      activationTokenRef.current += 1;

      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      apiRef.current = null;
    };
  }, [
    applySoundIntent,
    beginActivation,
    clearIndicatorTimer,
    clearPlayRetryTimer,
    clearUnmuteTimers,
    pauseForInactive,
    recoverPlayback,
    safeMute,
    youtubeId,
  ]);

  useEffect(() => {
    const wasActive = previousIsActiveRef.current;
    previousIsActiveRef.current = isActive;

    if (!readyRef.current) return;

    if (!isActive) {
      pauseForInactive();
      return;
    }

    if (!wasActive) {
      beginActivation();
      return;
    }

    if (!userPausedRef.current) {
      runActivationPlayback(activationTokenRef.current, 1);
    }
  }, [beginActivation, isActive, pauseForInactive, runActivationPlayback]);

  useEffect(() => {
    if (!readyRef.current) return;
    if (!activeRef.current) {
      safeMute();
      return;
    }

    if (userPausedRef.current) {
      safeMute();
      return;
    }

    applySoundIntent();
  }, [allowAutoplaySound, applySoundIntent, isPlaying, safeMute, soundEnabled]);

  const handleTogglePlayback = useCallback(() => {
    if (!isActive || !readyRef.current || !playerRef.current) return;

    if (isPlaying) {
      userPausedRef.current = true;
      clearPlayRetryTimer();
      clearUnmuteTimers();
      safePause();
      setIsPlaying(false);
      setTransientIndicator('pause');
      return;
    }

    userPausedRef.current = false;
    beginActivation();
    setTransientIndicator('play');
  }, [
    beginActivation,
    clearPlayRetryTimer,
    clearUnmuteTimers,
    isActive,
    isPlaying,
    safePause,
    setTransientIndicator,
  ]);

  const loading = isActive && status === 'loading';
  const showSoundBadge = isActive && status === 'ready' && soundEnabled && allowAutoplaySound;

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
