'use client';

// ============================================================================
// USE SOUND - Simple hook for playing real audio files
// ============================================================================
//
// This hook plays actual audio files, not generated oscillator nonsense.
// Add your audio files to /public/audio/ui/ and /public/audio/ambient/
//
// Get free sounds from:
//   - pixabay.com/sound-effects
//   - pixabay.com/music
//   - chosic.com/free-music/relaxing
// ============================================================================

import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import {
  playSound as playSoundFile,
  playHaptic,
  preloadUISounds,
  HAPTIC_PATTERNS,
  type SoundName,
} from '@/lib/audioManager';

export function useSound() {
  const { soundEnabled, hapticEnabled } = useStore();
  const initialized = useRef(false);

  // Preload common sounds on first user interaction
  const initAudio = useCallback(() => {
    if (initialized.current) return;
    initialized.current = true;
    preloadUISounds();
  }, []);

  // Generic sound player
  const play = useCallback((name: SoundName, volume?: number) => {
    if (!soundEnabled) return;
    playSoundFile(name, volume);
  }, [soundEnabled]);

  // Haptic helper
  const vibrate = useCallback((pattern: number | number[] = HAPTIC_PATTERNS.tap) => {
    if (!hapticEnabled) return;
    playHaptic(pattern);
  }, [hapticEnabled]);

  // =========================================================================
  // CONVENIENCE METHODS
  // =========================================================================

  const playTap = useCallback(() => {
    play('tap', 0.5);
    vibrate(HAPTIC_PATTERNS.tap);
  }, [play, vibrate]);

  const playSuccess = useCallback(() => {
    play('success', 0.7);
    vibrate(HAPTIC_PATTERNS.success);
  }, [play, vibrate]);

  const playComplete = useCallback(() => {
    play('complete', 0.8);
    vibrate(HAPTIC_PATTERNS.complete);
  }, [play, vibrate]);

  const playLevelUp = useCallback(() => {
    play('levelUp', 0.9);
    vibrate(HAPTIC_PATTERNS.celebrate);
  }, [play, vibrate]);

  const playStreak = useCallback(() => {
    play('streak', 0.7);
    vibrate(HAPTIC_PATTERNS.success);
  }, [play, vibrate]);

  const playCelebration = useCallback(() => {
    play('celebrate', 1.0);
    vibrate(HAPTIC_PATTERNS.celebrate);
  }, [play, vibrate]);

  const playBell = useCallback(() => {
    play('bell', 0.6);
    vibrate(HAPTIC_PATTERNS.tap);
  }, [play, vibrate]);

  const playChime = useCallback(() => {
    play('chime', 0.6);
  }, [play]);

  const playWhoosh = useCallback(() => {
    play('whoosh', 0.4);
  }, [play]);

  const playPop = useCallback(() => {
    play('pop', 0.5);
    vibrate(HAPTIC_PATTERNS.tap);
  }, [play, vibrate]);

  const playKeystroke = useCallback(() => {
    play('keystroke', 0.3);
  }, [play]);

  // Aliases for compatibility
  const playSparkle = playChime;
  const playReward = playSuccess;
  const playTransition = playWhoosh;
  const playDing = playBell;
  const playCorrect = playSuccess;

  // XP counting sound
  const playXpCount = useCallback((count: number) => {
    const ticks = Math.min(count, 15);
    for (let i = 0; i < ticks; i++) {
      setTimeout(() => {
        play('pop', 0.3 + (i / ticks) * 0.3);
      }, i * 50);
    }
    setTimeout(() => playSuccess(), ticks * 50 + 100);
  }, [play, playSuccess]);

  // Initialize on mount if user has interacted before
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [initAudio]);

  return {
    initAudio,
    // Direct play
    play,
    vibrate,
    // Convenience methods
    playTap,
    playSuccess,
    playComplete,
    playLevelUp,
    playStreak,
    playCelebration,
    playBell,
    playChime,
    playWhoosh,
    playPop,
    playKeystroke,
    playXpCount,
    // Aliases
    playSparkle,
    playReward,
    playTransition,
    playDing,
    playCorrect,
    // Generic for string-based calls
    playSound: (type: string) => {
      const soundMap: Record<string, () => void> = {
        tap: playTap,
        success: playSuccess,
        complete: playComplete,
        levelUp: playLevelUp,
        streak: playStreak,
        celebrate: playCelebration,
        bell: playBell,
        chime: playChime,
        whoosh: playWhoosh,
        pop: playPop,
        keystroke: playKeystroke,
        sparkle: playChime,
        reward: playSuccess,
        transition: playWhoosh,
        ding: playBell,
        correct: playSuccess,
      };
      soundMap[type]?.();
    },
  };
}

export default useSound;
