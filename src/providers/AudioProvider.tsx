'use client';

// ============================================================================
// AUDIO PROVIDER - React Context for centralized audio management
// ============================================================================
//
// This is the SINGLE initialization point for the audio system.
// Wrap your app with this provider to enable audio.
//
// Usage:
//   // In layout.tsx or _app.tsx
//   <AudioProvider>
//     <App />
//   </AudioProvider>
//
//   // In any component
//   const { playUI, startMusic, state } = useAudioContext();
//
// ============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';
import {
  initAudioEngine,
  subscribeToState,
  tryUnlock,
  playUI as enginePlayUI,
  startAmbientMusic as engineStartMusic,
  stopAmbientMusic as engineStopMusic,
  startWritingAmbience as engineStartAmbience,
  stopWritingAmbience as engineStopAmbience,
  stopAllAudio as engineStopAll,
  playSingingBowl as enginePlayBowl,
  playGong as enginePlayGong,
  playBreathingTone as enginePlayBreathTone,
  playXpCounting as enginePlayXp,
  playHaptic as enginePlayHaptic,
  updateSettings,
  cleanup,
  type AudioEngineState,
  type UISound,
  type AmbientSound,
  type WritingAmbience,
  HAPTIC_PATTERNS,
} from '@/lib/audioEngine';

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface AudioContextValue {
  // Engine state
  state: AudioEngineState;
  isReady: boolean;

  // UI Sounds
  playUI: (sound: UISound) => void;
  playTap: () => void;
  playTapConfirm: () => void;
  playSuccess: () => void;
  playSuccessBig: () => void;
  playComplete: () => void;
  playLevelUp: () => void;
  playStreak: () => void;
  playBell: () => void;
  playChime: () => void;
  playWhoosh: (direction?: 'in' | 'out') => void;
  playPop: () => void;
  playCelebrate: () => void;
  playUnlock: () => void;
  playNotification: () => void;
  playReveal: () => void;
  playKeystroke: () => void;
  playError: () => void;

  // Music
  startMusic: (type: AmbientSound, fadeIn?: number) => void;
  stopMusic: (fadeOut?: number) => void;

  // Ambience
  startAmbience: (type?: WritingAmbience) => void;
  stopAmbience: () => void;
  // Aliases for backwards compatibility
  startWritingAmbience: (type?: WritingAmbience) => void;
  stopWritingAmbience: () => void;

  // Stop all
  stopAllAudio: () => void;

  // Meditation
  playSingingBowl: () => void;
  playGong: () => void;
  playBreathingTone: (phase: 'inhale' | 'exhale' | 'hold', duration: number) => void;

  // XP
  playXpCounting: (xp: number, duration?: number) => void;

  // Haptic
  playHaptic: (pattern?: number | number[]) => void;

  // Generic
  playSound: (type: string) => void;

  // Aliases
  playSparkle: () => void;
  playReward: () => void;
  playTransition: () => void;
  playDing: () => void;
  playCorrect: () => void;

  // Settings
  updateSettings: typeof updateSettings;
}

// Default context value (noop functions)
const defaultContextValue: AudioContextValue = {
  state: {
    isInitialized: false,
    isUnlocked: false,
    isUnlocking: false,
    currentMusicTrack: null,
    currentAmbienceTrack: null,
    isMusicPlaying: false,
    isAmbiencePlaying: false,
    settings: {
      masterVolume: 0.7,
      musicVolume: 0.5,
      uiVolume: 0.8,
      ambienceVolume: 0.4,
      breathingEnabled: true,
      writingAmbienceType: 'rain',
    },
    lastError: null,
  },
  isReady: false,
  playUI: () => {},
  playTap: () => {},
  playTapConfirm: () => {},
  playSuccess: () => {},
  playSuccessBig: () => {},
  playComplete: () => {},
  playLevelUp: () => {},
  playStreak: () => {},
  playBell: () => {},
  playChime: () => {},
  playWhoosh: () => {},
  playPop: () => {},
  playCelebrate: () => {},
  playUnlock: () => {},
  playNotification: () => {},
  playReveal: () => {},
  playKeystroke: () => {},
  playError: () => {},
  startMusic: () => {},
  stopMusic: () => {},
  startAmbience: () => {},
  stopAmbience: () => {},
  startWritingAmbience: () => {},
  stopWritingAmbience: () => {},
  stopAllAudio: () => {},
  playSingingBowl: () => {},
  playGong: () => {},
  playBreathingTone: () => {},
  playXpCounting: () => {},
  playHaptic: () => {},
  playSound: () => {},
  playSparkle: () => {},
  playReward: () => {},
  playTransition: () => {},
  playDing: () => {},
  playCorrect: () => {},
  updateSettings,
};

// Create context
const AudioContext = createContext<AudioContextValue>(defaultContextValue);

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface AudioProviderProps {
  children: React.ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const { soundEnabled, hapticEnabled } = useStore();
  const [state, setState] = useState<AudioEngineState>(defaultContextValue.state);
  const initializedRef = useRef(false);

  // Initialize engine once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    initAudioEngine();

    // Subscribe to state changes
    const unsubscribe = subscribeToState((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
      cleanup();
    };
  }, []);

  // Resume audio on visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        tryUnlock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Sync sound enabled state to stop audio when disabled
  useEffect(() => {
    if (!soundEnabled && (state.isMusicPlaying || state.isAmbiencePlaying)) {
      engineStopAll();
    }
  }, [soundEnabled, state.isMusicPlaying, state.isAmbiencePlaying]);

  // ─────────────────────────────────────────────────────────────────────────
  // WRAPPED FUNCTIONS (check soundEnabled)
  // ─────────────────────────────────────────────────────────────────────────

  const playUI = useCallback((sound: UISound) => {
    if (!soundEnabled) return;
    enginePlayUI(sound);
  }, [soundEnabled]);

  const playWithHaptic = useCallback((sound: UISound, hapticPattern?: number | number[]) => {
    if (!soundEnabled) return;
    enginePlayUI(sound);
    if (hapticEnabled && hapticPattern) {
      enginePlayHaptic(hapticPattern);
    }
  }, [soundEnabled, hapticEnabled]);

  // UI Sound methods
  const playTap = useCallback(() => playWithHaptic('tap', HAPTIC_PATTERNS.tap), [playWithHaptic]);
  const playTapConfirm = useCallback(() => playWithHaptic('tapConfirm', HAPTIC_PATTERNS.tap), [playWithHaptic]);
  const playSuccess = useCallback(() => playWithHaptic('success', HAPTIC_PATTERNS.success), [playWithHaptic]);
  const playSuccessBig = useCallback(() => playWithHaptic('successBig', HAPTIC_PATTERNS.complete), [playWithHaptic]);
  const playComplete = useCallback(() => playWithHaptic('complete', HAPTIC_PATTERNS.complete), [playWithHaptic]);
  const playLevelUp = useCallback(() => playWithHaptic('levelUp', HAPTIC_PATTERNS.celebrate), [playWithHaptic]);
  const playStreak = useCallback(() => playWithHaptic('streak', HAPTIC_PATTERNS.success), [playWithHaptic]);
  const playBell = useCallback(() => playWithHaptic('bell', HAPTIC_PATTERNS.tap), [playWithHaptic]);
  const playChime = useCallback(() => playUI('chime'), [playUI]);
  const playWhoosh = useCallback((direction: 'in' | 'out' = 'in') => {
    playUI(direction === 'in' ? 'whoosh' : 'whooshOut');
  }, [playUI]);
  const playPop = useCallback(() => playWithHaptic('pop', HAPTIC_PATTERNS.tap), [playWithHaptic]);
  const playCelebrate = useCallback(() => playWithHaptic('celebrate', HAPTIC_PATTERNS.celebrate), [playWithHaptic]);
  const playUnlockSound = useCallback(() => playWithHaptic('unlock', HAPTIC_PATTERNS.celebrate), [playWithHaptic]);
  const playNotification = useCallback(() => playWithHaptic('notification', HAPTIC_PATTERNS.tap), [playWithHaptic]);
  const playReveal = useCallback(() => playUI('reveal'), [playUI]);
  const playKeystroke = useCallback(() => playUI('keystroke'), [playUI]);
  const playError = useCallback(() => playWithHaptic('error', HAPTIC_PATTERNS.error), [playWithHaptic]);

  // Music
  const startMusic = useCallback((type: AmbientSound, fadeIn: number = 3) => {
    if (!soundEnabled) return;
    engineStartMusic(type, fadeIn);
  }, [soundEnabled]);

  const stopMusic = useCallback((fadeOut: number = 2) => {
    engineStopMusic(fadeOut);
  }, []);

  // Ambience
  const startAmbience = useCallback((type?: WritingAmbience) => {
    if (!soundEnabled) return;
    engineStartAmbience(type);
  }, [soundEnabled]);

  const stopAmbience = useCallback(() => {
    engineStopAmbience();
  }, []);

  // Stop all
  const stopAllAudio = useCallback(() => {
    engineStopAll();
  }, []);

  // Meditation
  const playSingingBowl = useCallback(() => {
    if (!soundEnabled) return;
    enginePlayBowl();
    if (hapticEnabled) enginePlayHaptic(HAPTIC_PATTERNS.tap);
  }, [soundEnabled, hapticEnabled]);

  const playGong = useCallback(() => {
    if (!soundEnabled) return;
    enginePlayGong();
    if (hapticEnabled) enginePlayHaptic(HAPTIC_PATTERNS.complete);
  }, [soundEnabled, hapticEnabled]);

  const playBreathingTone = useCallback((phase: 'inhale' | 'exhale' | 'hold', duration: number) => {
    if (!soundEnabled) return;
    enginePlayBreathTone(phase, duration);
  }, [soundEnabled]);

  // XP
  const playXpCounting = useCallback((xp: number, duration?: number) => {
    if (!soundEnabled) return;
    enginePlayXp(xp, duration);
  }, [soundEnabled]);

  // Haptic
  const playHaptic = useCallback((pattern: number | number[] = HAPTIC_PATTERNS.tap) => {
    if (!hapticEnabled) return;
    enginePlayHaptic(pattern);
  }, [hapticEnabled]);

  // Generic sound player
  const playSound = useCallback((type: string) => {
    const soundMap: Record<string, () => void> = {
      tap: playTap,
      tapConfirm: playTapConfirm,
      success: playSuccess,
      successBig: playSuccessBig,
      complete: playComplete,
      levelUp: playLevelUp,
      streak: playStreak,
      bell: playBell,
      chime: playChime,
      whoosh: () => playWhoosh('in'),
      whooshOut: () => playWhoosh('out'),
      pop: playPop,
      celebrate: playCelebrate,
      unlock: playUnlockSound,
      notification: playNotification,
      reveal: playReveal,
      keystroke: playKeystroke,
      error: playError,
      // Aliases
      sparkle: playChime,
      reward: playSuccess,
      transition: () => playWhoosh('in'),
      ding: playBell,
      correct: playSuccess,
    };
    soundMap[type]?.();
  }, [
    playTap, playTapConfirm, playSuccess, playSuccessBig, playComplete,
    playLevelUp, playStreak, playBell, playChime, playWhoosh, playPop,
    playCelebrate, playUnlockSound, playNotification, playReveal, playKeystroke, playError
  ]);

  // Context value
  const contextValue: AudioContextValue = {
    state,
    isReady: state.isInitialized && state.isUnlocked,
    playUI,
    playTap,
    playTapConfirm,
    playSuccess,
    playSuccessBig,
    playComplete,
    playLevelUp,
    playStreak,
    playBell,
    playChime,
    playWhoosh,
    playPop,
    playCelebrate,
    playUnlock: playUnlockSound,
    playNotification,
    playReveal,
    playKeystroke,
    playError,
    startMusic,
    stopMusic,
    startAmbience,
    stopAmbience,
    startWritingAmbience: startAmbience,
    stopWritingAmbience: stopAmbience,
    stopAllAudio,
    playSingingBowl,
    playGong,
    playBreathingTone,
    playXpCounting,
    playHaptic,
    playSound,
    // Aliases
    playSparkle: playChime,
    playReward: playSuccess,
    playTransition: () => playWhoosh('in'),
    playDing: playBell,
    playCorrect: playSuccess,
    updateSettings,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useAudioContext(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    console.warn('[Audio] useAudioContext must be used within AudioProvider');
    return defaultContextValue;
  }
  return context;
}

export default AudioProvider;
