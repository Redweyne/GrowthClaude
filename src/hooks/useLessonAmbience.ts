'use client';

// ============================================================================
// LESSON AMBIENCE - Background music ONLY during reflection
// ============================================================================
// Now uses audioEngine.ts (Howler.js) - NO FALLBACKS, NO GENERATED SOUNDS
// ============================================================================

import { useCallback, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
  startAmbientMusic,
  stopAmbientMusic,
  playUI,
  playHaptic,
  HAPTIC_PATTERNS,
} from '@/lib/audioEngine';

type LessonPhase = 'entering' | 'wisdom' | 'action' | 'reflection' | 'completion';

export function useLessonAmbience() {
  const { soundEnabled, hapticEnabled } = useStore();
  const currentPhaseRef = useRef<LessonPhase>('entering');
  const isPlayingRef = useRef(false);

  const initAudio = useCallback(() => {
    // Nothing needed - audioEngine handles this
  }, []);

  // Start ambient - ONLY plays during reflection
  const startAmbience = useCallback((phase: LessonPhase) => {
    if (!soundEnabled) return;
    currentPhaseRef.current = phase;

    // Only play ambient during reflection - the calm writing moment
    if (phase === 'reflection') {
      startAmbientMusic('reflection', 3);
      isPlayingRef.current = true;
    }
  }, [soundEnabled]);

  // Transition between phases
  const transitionTo = useCallback((newPhase: LessonPhase) => {
    if (!soundEnabled) return;
    currentPhaseRef.current = newPhase;

    if (newPhase === 'reflection') {
      // Start ambient for reflection
      startAmbientMusic('reflection', 2);
      isPlayingRef.current = true;
    } else if (isPlayingRef.current) {
      // Stop ambient when leaving reflection
      stopAmbientMusic(1.5);
      isPlayingRef.current = false;
    }
  }, [soundEnabled]);

  // Stop ambient
  const stopAmbience = useCallback(() => {
    stopAmbientMusic(1.5);
    isPlayingRef.current = false;
  }, []);

  // Bell sound
  const playBell = useCallback((type: 'soft' | 'bright' | 'deep' = 'soft') => {
    if (!soundEnabled) return;
    playUI('bell');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.tap);
  }, [soundEnabled, hapticEnabled]);

  // Keystroke - disabled (silence is better)
  const playKeystroke = useCallback(() => {
    // Intentionally empty - silence during typing is more calming
  }, []);

  // Completion chime
  const playCompletionChime = useCallback(() => {
    if (!soundEnabled) return;
    playUI('complete');
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.complete);
  }, [soundEnabled, hapticEnabled]);

  // Check if ambient is playing
  const isAmbientPlaying = useCallback(() => {
    return isPlayingRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbientMusic(0.5);
    };
  }, []);

  return {
    startAmbience,
    transitionTo,
    stopAmbience,
    initAudio,
    playBell,
    playKeystroke,
    playCompletionChime,
    isAmbientPlaying,
  };
}

export default useLessonAmbience;
