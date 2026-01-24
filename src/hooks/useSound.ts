'use client';

// ============================================================================
// USE SOUND - Simple hook for playing real audio files
// ============================================================================
// Now uses audioEngine.ts (Howler.js) - NO FALLBACKS, NO GENERATED SOUNDS
// ============================================================================

import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import {
  initAudioEngine,
  playUI,
  playHaptic,
  HAPTIC_PATTERNS,
  type UISound,
} from '@/lib/audioEngine';

export function useSound() {
  const { soundEnabled, hapticEnabled } = useStore();
  const initialized = useRef(false);

  // Initialize audio on first user interaction
  const initAudio = useCallback(() => {
    if (initialized.current) return;
    initialized.current = true;
    initAudioEngine();
  }, []);

  // Generic sound player
  const play = useCallback((name: UISound, volume?: number) => {
    if (!soundEnabled) return;
    playUI(name);
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
    play('tap');
    vibrate(HAPTIC_PATTERNS.tap);
  }, [play, vibrate]);

  const playSuccess = useCallback(() => {
    play('success');
    vibrate(HAPTIC_PATTERNS.success);
  }, [play, vibrate]);

  const playComplete = useCallback(() => {
    play('complete');
    vibrate(HAPTIC_PATTERNS.complete);
  }, [play, vibrate]);

  const playLevelUp = useCallback(() => {
    play('levelUp');
    vibrate(HAPTIC_PATTERNS.celebrate);
  }, [play, vibrate]);

  const playStreak = useCallback(() => {
    play('streak');
    vibrate(HAPTIC_PATTERNS.success);
  }, [play, vibrate]);

  const playCelebration = useCallback(() => {
    play('celebrate');
    vibrate(HAPTIC_PATTERNS.celebrate);
  }, [play, vibrate]);

  const playBell = useCallback(() => {
    play('bell');
    vibrate(HAPTIC_PATTERNS.tap);
  }, [play, vibrate]);

  const playChime = useCallback(() => {
    play('chime');
  }, [play]);

  const playWhoosh = useCallback(() => {
    play('whoosh');
  }, [play]);

  const playPop = useCallback(() => {
    play('pop');
    vibrate(HAPTIC_PATTERNS.tap);
  }, [play, vibrate]);

  const playKeystroke = useCallback(() => {
    play('keystroke');
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
        play('pop');
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
