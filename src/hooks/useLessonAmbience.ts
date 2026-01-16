'use client';

// ============================================================================
// LESSON AMBIENCE - Background music ONLY during reflection
// ============================================================================
//
// Music only plays during the reflection/writing phase - the calm moment
// when the user is thinking and writing. Not during the whole lesson.
//
// Keystroke sounds removed - silence is more calming than bad sounds.
// ============================================================================

import { useCallback, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
  startAmbient,
  stopAmbient,
  isAmbientPlaying,
  playSound,
  playHaptic,
  HAPTIC_PATTERNS,
} from '@/lib/audioManager';

type LessonPhase = 'entering' | 'wisdom' | 'action' | 'reflection' | 'completion';

export function useLessonAmbience() {
  const { soundEnabled, hapticEnabled } = useStore();
  const currentPhaseRef = useRef<LessonPhase>('entering');
  const isPlayingRef = useRef(false);

  const initAudio = useCallback(() => {
    // Nothing needed
  }, []);

  // Start ambient - ONLY plays during reflection
  const startAmbience = useCallback((phase: LessonPhase) => {
    if (!soundEnabled) return;
    currentPhaseRef.current = phase;

    // Only play ambient during reflection - the calm writing moment
    if (phase === 'reflection') {
      startAmbient('ambientReflection', 3000);
      isPlayingRef.current = true;
    }
  }, [soundEnabled]);

  // Transition between phases
  const transitionTo = useCallback((newPhase: LessonPhase) => {
    if (!soundEnabled) return;
    currentPhaseRef.current = newPhase;

    if (newPhase === 'reflection') {
      // Start ambient for reflection
      startAmbient('ambientReflection', 2000);
      isPlayingRef.current = true;
    } else if (isPlayingRef.current) {
      // Stop ambient when leaving reflection
      stopAmbient(1500);
      isPlayingRef.current = false;
    }
  }, [soundEnabled]);

  // Stop ambient
  const stopAmbience = useCallback(() => {
    stopAmbient(1500);
    isPlayingRef.current = false;
  }, []);

  // Bell sound
  const playBell = useCallback((type: 'soft' | 'bright' | 'deep' = 'soft') => {
    if (!soundEnabled) return;
    playSound('bell', type === 'deep' ? 0.8 : 0.6);
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.tap);
  }, [soundEnabled, hapticEnabled]);

  // Keystroke - disabled (silence is better)
  const playKeystroke = useCallback(() => {
    // Intentionally empty - silence during typing is more calming
  }, []);

  // Completion chime
  const playCompletionChime = useCallback(() => {
    if (!soundEnabled) return;
    playSound('complete', 0.8);
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.complete);
  }, [soundEnabled, hapticEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbient(500);
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
    isPlaying: isPlayingRef.current,
    currentPhase: currentPhaseRef.current,
    isAmbientPlaying,
  };
}

export default useLessonAmbience;
