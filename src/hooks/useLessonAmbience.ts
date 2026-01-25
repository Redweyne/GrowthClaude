'use client';

// ============================================================================
// USE LESSON AMBIENCE - DEPRECATED - Use useAudio instead
// ============================================================================
//
// This file is kept for backwards compatibility.
// All functionality now comes from useAudio via AudioProvider.
//
// ============================================================================

import { useCallback } from 'react';
import { useAudio } from '@/hooks/useAudio';

type LessonPhase = 'entering' | 'wisdom' | 'action' | 'reflection' | 'completion';

/**
 * @deprecated Use useAudio() instead
 */
export function useLessonAmbience() {
  const audio = useAudio();

  const startAmbience = useCallback((phase: LessonPhase) => {
    if (phase === 'reflection') {
      audio.startMusic('reflection', 3);
    }
  }, [audio]);

  const transitionTo = useCallback((newPhase: LessonPhase) => {
    if (newPhase === 'reflection') {
      audio.startMusic('reflection', 2);
    } else {
      audio.stopMusic(1.5);
    }
  }, [audio]);

  const stopAmbience = useCallback(() => {
    audio.stopMusic(1.5);
  }, [audio]);

  const playBell = useCallback((type: 'soft' | 'bright' | 'deep' = 'soft') => {
    audio.playBell();
  }, [audio]);

  const playKeystroke = useCallback(() => {
    // Intentionally empty - silence during typing is more calming
  }, []);

  const playCompletionChime = useCallback(() => {
    audio.playComplete();
  }, [audio]);

  const isAmbientPlaying = useCallback(() => {
    return audio.state.isMusicPlaying;
  }, [audio.state.isMusicPlaying]);

  return {
    startAmbience,
    transitionTo,
    stopAmbience,
    initAudio: () => {}, // No-op, AudioProvider handles initialization
    playBell,
    playKeystroke,
    playCompletionChime,
    isAmbientPlaying,
  };
}

export default useLessonAmbience;
