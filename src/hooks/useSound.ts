'use client';

import { useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';

type SoundType =
  | 'complete'      // Lesson complete
  | 'xp'            // XP earned tick
  | 'streak'        // Streak milestone
  | 'levelUp'       // Level up fanfare
  | 'click'         // Button click
  | 'success'       // Action success
  | 'transition'    // Screen transition
  | 'reward';       // Reward reveal

// Sound configurations using Web Audio API synthesis
const SOUND_CONFIGS: Record<SoundType, { frequencies: number[]; durations: number[]; type: OscillatorType; gain: number }> = {
  complete: {
    frequencies: [523.25, 659.25, 783.99], // C5, E5, G5 (major chord arpeggio)
    durations: [0.1, 0.1, 0.2],
    type: 'sine',
    gain: 0.3,
  },
  xp: {
    frequencies: [880], // A5
    durations: [0.05],
    type: 'sine',
    gain: 0.15,
  },
  streak: {
    frequencies: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6
    durations: [0.1, 0.1, 0.1, 0.3],
    type: 'sine',
    gain: 0.3,
  },
  levelUp: {
    frequencies: [261.63, 329.63, 392.00, 523.25, 659.25, 783.99],
    durations: [0.1, 0.1, 0.1, 0.1, 0.1, 0.4],
    type: 'sine',
    gain: 0.35,
  },
  click: {
    frequencies: [600],
    durations: [0.03],
    type: 'square',
    gain: 0.1,
  },
  success: {
    frequencies: [440, 554.37], // A4, C#5
    durations: [0.1, 0.15],
    type: 'sine',
    gain: 0.25,
  },
  transition: {
    frequencies: [300, 400],
    durations: [0.05, 0.05],
    type: 'sine',
    gain: 0.1,
  },
  reward: {
    frequencies: [392, 493.88, 587.33, 783.99], // G4, B4, D5, G5
    durations: [0.15, 0.15, 0.15, 0.3],
    type: 'triangle',
    gain: 0.3,
  },
};

// Singleton AudioContext to persist across hook instances
let globalAudioContext: AudioContext | null = null;
let audioContextInitialized = false;

function getGlobalAudioContext(): AudioContext {
  if (!globalAudioContext) {
    globalAudioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return globalAudioContext;
}

export function useSound() {
  const { soundEnabled } = useStore();
  const pendingSoundsRef = useRef<SoundType[]>([]);

  // Initialize audio context - must be called from user interaction
  const initAudio = useCallback(() => {
    if (audioContextInitialized) return;

    try {
      const ctx = getGlobalAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      audioContextInitialized = true;

      // Play any pending sounds
      pendingSoundsRef.current.forEach(type => {
        playSoundInternal(type);
      });
      pendingSoundsRef.current = [];
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }, []);

  // Internal play function
  const playSoundInternal = useCallback((type: SoundType) => {
    try {
      const ctx = getGlobalAudioContext();
      const config = SOUND_CONFIGS[type];
      let startTime = ctx.currentTime;

      config.frequencies.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(freq, startTime);

        // Envelope
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(config.gain, startTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, startTime + config.durations[i]);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + config.durations[i] + 0.01);

        startTime += config.durations[i] * 0.8; // Slight overlap for smoother sound
      });
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, []);

  // Play a synthesized sound
  const playSound = useCallback((type: SoundType) => {
    if (!soundEnabled) return;

    // Initialize audio context on first sound attempt
    if (!audioContextInitialized) {
      initAudio();
    }

    try {
      const ctx = getGlobalAudioContext();

      // Resume if suspended (e.g., after tab switch)
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          playSoundInternal(type);
        });
        return;
      }

      playSoundInternal(type);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, [soundEnabled, initAudio, playSoundInternal]);

  // Play XP counting sound (multiple ticks)
  const playXpCount = useCallback((count: number) => {
    if (!soundEnabled) return;

    const ticks = Math.min(count, 20); // Cap at 20 ticks
    const interval = 50; // ms between ticks

    for (let i = 0; i < ticks; i++) {
      setTimeout(() => playSound('xp'), i * interval);
    }
  }, [soundEnabled, playSound]);

  return {
    playSound,
    playXpCount,
    initAudio, // Expose for initializing on user interaction
    playComplete: () => playSound('complete'),
    playStreak: () => playSound('streak'),
    playLevelUp: () => playSound('levelUp'),
    playClick: () => playSound('click'),
    playSuccess: () => playSound('success'),
    playTransition: () => playSound('transition'),
    playReward: () => playSound('reward'),
  };
}

export default useSound;
