'use client';

// ============================================================================
// USE AUDIO - The main hook for accessing the audio engine
// ============================================================================
//
// A clean React interface to the audio engine. Use this hook in any component
// to access sounds, music, and ambience with automatic cleanup.
//
// Example usage:
//   const { playUI, startMusic, startWritingAmbience } = useAudio();
//   playUI('tap');
//   startMusic('reflection');
//   startWritingAmbience('rain');
// ============================================================================

import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import {
  initAudioEngine,
  resumeAudio,
  playUI as playUISound,
  startAmbientMusic,
  stopAmbientMusic,
  startWritingAmbience as startWriting,
  stopWritingAmbience as stopWriting,
  playSingingBowl as playSingingBowlSound,
  playGong as playGongSound,
  playBreathingTone as playBreathTone,
  playXpCounting as playXpCount,
  playHaptic,
  updateSettings,
  HAPTIC_PATTERNS,
  type UISound,
  type AmbientSound,
  type WritingAmbience,
} from '@/lib/audioEngine';

export function useAudio() {
  const { soundEnabled, hapticEnabled } = useStore();
  const initialized = useRef(false);

  // Initialize audio engine on first user interaction
  const init = useCallback(() => {
    if (initialized.current) return;
    try {
      initAudioEngine();
      // iOS Safari requires resuming audio context after user interaction
      resumeAudio();
      initialized.current = true;
    } catch {
      // Audio not available
    }
  }, []);

  // Auto-initialize on user interaction (critical for iOS Safari)
  useEffect(() => {
    const handleInteraction = () => {
      init();
      // Always try to resume audio on any interaction (iOS requirement)
      resumeAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('touchend', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('touchend', handleInteraction); // iOS sometimes needs touchend
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('touchend', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [init]);

  // ─────────────────────────────────────────────────────────────────────────
  // UI SOUNDS
  // ─────────────────────────────────────────────────────────────────────────

  const playUI = useCallback((sound: UISound) => {
    if (!soundEnabled) return;
    init();
    playUISound(sound);
  }, [soundEnabled, init]);

  // Convenience methods
  const playTap = useCallback(() => {
    playUI('tap');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.tap);
  }, [playUI, hapticEnabled]);

  const playTapConfirm = useCallback(() => {
    playUI('tapConfirm');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.tap);
  }, [playUI, hapticEnabled]);

  const playSuccess = useCallback(() => {
    playUI('success');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.success);
  }, [playUI, hapticEnabled]);

  const playSuccessBig = useCallback(() => {
    playUI('successBig');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.complete);
  }, [playUI, hapticEnabled]);

  const playComplete = useCallback(() => {
    playUI('complete');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.complete);
  }, [playUI, hapticEnabled]);

  const playLevelUp = useCallback(() => {
    playUI('levelUp');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.celebrate);
  }, [playUI, hapticEnabled]);

  const playStreak = useCallback(() => {
    playUI('streak');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.success);
  }, [playUI, hapticEnabled]);

  const playBell = useCallback(() => {
    playUI('bell');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.tap);
  }, [playUI, hapticEnabled]);

  const playChime = useCallback(() => {
    playUI('chime');
  }, [playUI]);

  const playWhoosh = useCallback((direction: 'in' | 'out' = 'in') => {
    playUI(direction === 'in' ? 'whoosh' : 'whooshOut');
  }, [playUI]);

  const playPop = useCallback(() => {
    playUI('pop');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.tap);
  }, [playUI, hapticEnabled]);

  const playCelebrate = useCallback(() => {
    playUI('celebrate');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.celebrate);
  }, [playUI, hapticEnabled]);

  const playUnlock = useCallback(() => {
    playUI('unlock');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.celebrate);
  }, [playUI, hapticEnabled]);

  const playNotification = useCallback(() => {
    playUI('notification');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.tap);
  }, [playUI, hapticEnabled]);

  const playReveal = useCallback(() => {
    playUI('reveal');
  }, [playUI]);

  const playKeystroke = useCallback(() => {
    if (!soundEnabled) return;
    init();
    playUISound('keystroke');
  }, [soundEnabled, init]);

  const playError = useCallback(() => {
    playUI('error');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.error);
  }, [playUI, hapticEnabled]);

  // ─────────────────────────────────────────────────────────────────────────
  // AMBIENT MUSIC
  // ─────────────────────────────────────────────────────────────────────────

  const startMusic = useCallback((type: AmbientSound, fadeIn: number = 3) => {
    if (!soundEnabled) return;
    init();
    startAmbientMusic(type, fadeIn);
  }, [soundEnabled, init]);

  const stopMusic = useCallback((fadeOut: number = 2) => {
    stopAmbientMusic(fadeOut);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // WRITING AMBIENCE
  // ─────────────────────────────────────────────────────────────────────────

  const startWritingAmbience = useCallback((type?: WritingAmbience) => {
    if (!soundEnabled) return;
    init();
    startWriting(type);
  }, [soundEnabled, init]);

  const stopWritingAmbience = useCallback(() => {
    stopWriting();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // MEDITATION SOUNDS
  // ─────────────────────────────────────────────────────────────────────────

  const playSingingBowl = useCallback(() => {
    if (!soundEnabled) return;
    init();
    playSingingBowlSound();
  }, [soundEnabled, init]);

  const playGong = useCallback(() => {
    if (!soundEnabled) return;
    init();
    playGongSound();
  }, [soundEnabled, init]);

  const playBreathingTone = useCallback((
    phase: 'inhale' | 'exhale' | 'hold',
    duration: number
  ) => {
    if (!soundEnabled) return;
    init();
    playBreathTone(phase, duration);
  }, [soundEnabled, init]);

  // ─────────────────────────────────────────────────────────────────────────
  // XP & REWARDS
  // ─────────────────────────────────────────────────────────────────────────

  const playXpCounting = useCallback((xp: number, duration?: number) => {
    if (!soundEnabled) return;
    init();
    playXpCount(xp, duration);
  }, [soundEnabled, init]);

  // ─────────────────────────────────────────────────────────────────────────
  // ALIASES (for compatibility with existing code)
  // ─────────────────────────────────────────────────────────────────────────

  const playSparkle = playChime;
  const playReward = playSuccess;
  const playTransition = playWhoosh;
  const playDing = playBell;
  const playCorrect = playSuccess;

  // Generic sound player for string-based calls
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
      unlock: playUnlock,
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
    playCelebrate, playUnlock, playNotification, playReveal, playKeystroke,
    playError
  ]);

  return {
    // Initialize
    init,

    // UI sounds
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
    playUnlock,
    playNotification,
    playReveal,
    playKeystroke,
    playError,

    // Music
    startMusic,
    stopMusic,

    // Writing ambience
    startWritingAmbience,
    stopWritingAmbience,

    // Meditation
    playSingingBowl,
    playGong,
    playBreathingTone,

    // XP
    playXpCounting,

    // Aliases
    playSparkle,
    playReward,
    playTransition,
    playDing,
    playCorrect,
    playSound,

    // Settings
    updateSettings,
  };
}

export default useAudio;
