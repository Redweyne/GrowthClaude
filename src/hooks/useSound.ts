'use client';

// ============================================================================
// USE SOUND - DEPRECATED - Use useAudio instead
// ============================================================================
//
// This file is kept for backwards compatibility.
// All functionality now comes from useAudio via AudioProvider.
//
// ============================================================================

import { useAudio } from '@/hooks/useAudio';

/**
 * @deprecated Use useAudio() instead
 */
export function useSound() {
  const audio = useAudio();
  
  return {
    initAudio: () => {}, // No-op, AudioProvider handles initialization
    play: audio.playUI,
    vibrate: audio.playHaptic,
    playTap: audio.playTap,
    playSuccess: audio.playSuccess,
    playComplete: audio.playComplete,
    playLevelUp: audio.playLevelUp,
    playStreak: audio.playStreak,
    playCelebration: audio.playCelebrate,
    playBell: audio.playBell,
    playChime: audio.playChime,
    playWhoosh: () => audio.playWhoosh('in'),
    playPop: audio.playPop,
    playKeystroke: audio.playKeystroke,
    playXpCount: audio.playXpCounting,
    // Aliases
    playSparkle: audio.playChime,
    playReward: audio.playSuccess,
    playTransition: () => audio.playWhoosh('in'),
    playDing: audio.playBell,
    playCorrect: audio.playSuccess,
    playSound: audio.playSound,
  };
}

export default useSound;
