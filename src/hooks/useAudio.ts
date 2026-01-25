'use client';

// ============================================================================
// USE AUDIO - The single unified hook for all audio in the app
// ============================================================================
//
// This hook provides access to the audio system. It uses the AudioProvider
// context for shared state and the audioEngine for actual playback.
//
// This hook REPLACES:
// - useAudioEngine.ts (deprecated)
// - useSound.ts (deprecated)
// - useLessonAmbience.ts (deprecated)
//
// Example usage:
//   const { playTap, startMusic, state } = useAudio();
//   playTap();
//   startMusic('reflection');
//
// ============================================================================

import { useAudioContext } from '@/providers/AudioProvider';

// Re-export the hook as useAudio for convenience
export function useAudio() {
  return useAudioContext();
}

// Also export as default
export default useAudio;

// Re-export types from audioEngine for convenience
export type {
  UISound,
  AmbientSound,
  WritingAmbience,
  AudioSettings,
  AudioEngineState,
} from '@/lib/audioEngine';
