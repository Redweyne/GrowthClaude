'use client';

// ============================================================================
// USE AUDIO ENGINE - DEPRECATED - Use useAudio instead
// ============================================================================
//
// This file is kept for backwards compatibility.
// All functionality now comes from useAudio via AudioProvider.
//
// ============================================================================

import { useAudio } from '@/hooks/useAudio';

export type BowlType = 'small' | 'medium' | 'large';
export type SceneType = 'onboarding' | 'lessonCalm' | 'lessonDeep' | 'reflection' | 'visualization' | 'reward' | 'home';

/**
 * @deprecated Use useAudio() instead
 */
export function useAudioEngine() {
  const audio = useAudio();

  return {
    // Initialization
    init: () => {}, // No-op, AudioProvider handles initialization
    isReady: () => audio.isReady,

    // UI Sounds
    playTap: audio.playTap,
    playSuccess: audio.playSuccess,
    playCelebrate: audio.playCelebrate,
    playLevelUp: audio.playLevelUp,
    playUnlock: audio.playUnlock,
    playTransition: () => audio.playWhoosh('in'),
    playChime: audio.playChime,
    playReveal: audio.playReveal,
    playGong: audio.playGong,
    playSingingBowl: audio.playSingingBowl,

    // Scene music
    setScene: (scene: SceneType, fadeSeconds: number = 2) => {
      audio.startMusic(scene, fadeSeconds);
    },
    clearScene: (fadeSeconds: number = 1.5) => {
      audio.stopMusic(fadeSeconds);
    },

    // Ambience
    setAmbience: audio.startAmbience,
    clearAmbience: audio.stopAmbience,

    // Breathing
    startBreathing: () => {},
    breathPhase: audio.playBreathingTone,
    stopBreathing: () => {},

    // Haptic
    vibrate: audio.playHaptic,
  };
}

export default useAudioEngine;
