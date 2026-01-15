'use client';

// ============================================================================
// LESSON AMBIENCE - Background music for different lesson phases
// ============================================================================
//
// Plays actual music files for ambient background during lessons.
// Add your ambient music to /public/audio/ambient/
//
// Get free calm music from:
//   - pixabay.com/music/search/meditation
//   - chosic.com/free-music/relaxing
//   - fesliyanstudios.com
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
  type SoundName,
} from '@/lib/audioManager';

type LessonPhase = 'entering' | 'wisdom' | 'action' | 'reflection' | 'completion';

// Map phases to ambient tracks
const PHASE_AMBIENT: Record<LessonPhase, SoundName> = {
  entering: 'ambientCalm',
  wisdom: 'ambientWisdom',
  action: 'ambientFocus',
  reflection: 'ambientReflection',
  completion: 'ambientCalm',
};

export function useLessonAmbience() {
  const { soundEnabled, hapticEnabled } = useStore();
  const currentPhaseRef = useRef<LessonPhase>('entering');
  const isPlayingRef = useRef(false);

  // Initialize (called on user interaction)
  const initAudio = useCallback(() => {
    // Nothing special needed - audio manager handles it
  }, []);

  // Start ambient for a phase
  const startAmbience = useCallback((phase: LessonPhase) => {
    if (!soundEnabled) return;

    currentPhaseRef.current = phase;
    const ambientTrack = PHASE_AMBIENT[phase];
    startAmbient(ambientTrack, 3000); // 3 second fade in
    isPlayingRef.current = true;
  }, [soundEnabled]);

  // Transition to a new phase
  const transitionTo = useCallback((newPhase: LessonPhase) => {
    if (!soundEnabled) return;

    // Only change if it's a different ambient track
    const oldTrack = PHASE_AMBIENT[currentPhaseRef.current];
    const newTrack = PHASE_AMBIENT[newPhase];

    currentPhaseRef.current = newPhase;

    if (oldTrack !== newTrack) {
      startAmbient(newTrack, 2000);
    }
  }, [soundEnabled]);

  // Stop ambient
  const stopAmbience = useCallback(() => {
    stopAmbient(2000); // 2 second fade out
    isPlayingRef.current = false;
  }, []);

  // Play a bell sound
  const playBell = useCallback((type: 'soft' | 'bright' | 'deep' = 'soft') => {
    if (!soundEnabled) return;
    playSound('bell', type === 'deep' ? 0.8 : 0.6);
    if (hapticEnabled) playHaptic(HAPTIC_PATTERNS.tap);
  }, [soundEnabled, hapticEnabled]);

  // Play keystroke sound (for typing in reflection)
  const playKeystroke = useCallback(() => {
    if (!soundEnabled) return;
    playSound('keystroke', 0.25);
  }, [soundEnabled]);

  // Play completion chime
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
    // Core ambience
    startAmbience,
    transitionTo,
    stopAmbience,
    initAudio,

    // Moment sounds
    playBell,
    playKeystroke,
    playCompletionChime,

    // State
    isPlaying: isPlayingRef.current,
    currentPhase: currentPhaseRef.current,
    isAmbientPlaying,
  };
}

export default useLessonAmbience;
