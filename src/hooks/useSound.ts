'use client';

import { useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';

type SoundType =
  | 'complete'      // Lesson complete
  | 'xp'            // XP earned tick
  | 'streak'        // Streak milestone
  | 'levelUp'       // Level up fanfare
  | 'tap'           // Button tap/click (subtle)
  | 'success'       // Action success
  | 'transition'    // Screen transition (whoosh)
  | 'reward'        // Reward reveal
  | 'pop'           // Bubble pop / selection
  | 'ding'          // Notification ding
  | 'whoosh'        // Slide/swipe sound
  | 'sparkle'       // Magic sparkle
  | 'correct'       // Correct answer chime
  | 'celebrate'     // Big celebration
  | 'heartbeat';    // Pulse sound

// Sound configurations using Web Audio API synthesis
const SOUND_CONFIGS: Record<SoundType, { frequencies: number[]; durations: number[]; type: OscillatorType; gain: number; detune?: number[] }> = {
  complete: {
    frequencies: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6 (triumphant)
    durations: [0.1, 0.1, 0.1, 0.25],
    type: 'sine',
    gain: 0.25,
  },
  xp: {
    frequencies: [880, 988], // A5, B5
    durations: [0.03, 0.03],
    type: 'sine',
    gain: 0.12,
  },
  streak: {
    frequencies: [523.25, 659.25, 783.99, 1046.50, 1318.51], // C5 to E6
    durations: [0.08, 0.08, 0.08, 0.08, 0.3],
    type: 'sine',
    gain: 0.25,
  },
  levelUp: {
    frequencies: [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50],
    durations: [0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.4],
    type: 'sine',
    gain: 0.3,
  },
  tap: {
    frequencies: [800, 1000],
    durations: [0.02, 0.02],
    type: 'sine',
    gain: 0.08,
  },
  success: {
    frequencies: [523.25, 659.25, 783.99], // C5, E5, G5 major chord
    durations: [0.08, 0.08, 0.15],
    type: 'sine',
    gain: 0.2,
  },
  transition: {
    frequencies: [400, 600, 800],
    durations: [0.03, 0.03, 0.03],
    type: 'sine',
    gain: 0.1,
    detune: [0, 5, 10],
  },
  reward: {
    frequencies: [392, 493.88, 587.33, 783.99], // G4, B4, D5, G5 (magical)
    durations: [0.12, 0.12, 0.12, 0.3],
    type: 'triangle',
    gain: 0.25,
  },
  pop: {
    frequencies: [600, 900],
    durations: [0.02, 0.03],
    type: 'sine',
    gain: 0.15,
  },
  ding: {
    frequencies: [1200, 1800],
    durations: [0.05, 0.1],
    type: 'sine',
    gain: 0.15,
  },
  whoosh: {
    frequencies: [200, 400, 300],
    durations: [0.04, 0.04, 0.04],
    type: 'sine',
    gain: 0.08,
    detune: [-50, 0, 50],
  },
  sparkle: {
    frequencies: [1500, 2000, 1800, 2200],
    durations: [0.04, 0.04, 0.04, 0.08],
    type: 'sine',
    gain: 0.1,
  },
  correct: {
    frequencies: [659.25, 783.99], // E5, G5 (happy interval)
    durations: [0.1, 0.15],
    type: 'sine',
    gain: 0.2,
  },
  celebrate: {
    frequencies: [523.25, 587.33, 659.25, 783.99, 880, 1046.50, 1174.66, 1318.51],
    durations: [0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.35],
    type: 'sine',
    gain: 0.25,
  },
  heartbeat: {
    frequencies: [80, 60],
    durations: [0.1, 0.15],
    type: 'sine',
    gain: 0.2,
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
  const lastSoundTimeRef = useRef<Record<SoundType, number>>({} as Record<SoundType, number>);

  // Initialize audio context - must be called from user interaction
  const initAudio = useCallback(() => {
    if (audioContextInitialized) return;

    try {
      const ctx = getGlobalAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      audioContextInitialized = true;
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }, []);

  // Internal play function with debouncing
  const playSoundInternal = useCallback((type: SoundType) => {
    try {
      // Debounce rapid sounds (minimum 30ms apart for same sound)
      const now = Date.now();
      const lastTime = lastSoundTimeRef.current[type] || 0;
      if (now - lastTime < 30) return;
      lastSoundTimeRef.current[type] = now;

      const ctx = getGlobalAudioContext();
      const config = SOUND_CONFIGS[type];
      let startTime = ctx.currentTime;

      config.frequencies.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(freq, startTime);

        // Apply detune if specified
        if (config.detune && config.detune[i]) {
          oscillator.detune.setValueAtTime(config.detune[i], startTime);
        }

        // Smooth envelope for better sound
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(config.gain, startTime + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + config.durations[i]);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + config.durations[i] + 0.01);

        startTime += config.durations[i] * 0.7; // Overlap for smoother sound
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

  // Play XP counting sound (multiple ticks with rising pitch)
  const playXpCount = useCallback((count: number) => {
    if (!soundEnabled) return;

    const ticks = Math.min(count, 25);
    const interval = 35; // ms between ticks

    for (let i = 0; i < ticks; i++) {
      setTimeout(() => {
        try {
          const ctx = getGlobalAudioContext();
          if (ctx.state === 'suspended') return;

          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();

          // Rising pitch as count increases
          const baseFreq = 800 + (i / ticks) * 400;
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);

          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.005);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);

          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.05);
        } catch {
          // Ignore errors during rapid sound playback
        }
      }, i * interval);
    }

    // Play a final "ding" at the end
    setTimeout(() => playSound('ding'), ticks * interval + 50);
  }, [soundEnabled, playSound]);

  // Play celebration sequence
  const playCelebration = useCallback(() => {
    if (!soundEnabled) return;
    playSound('celebrate');
    // Add sparkles
    setTimeout(() => playSound('sparkle'), 300);
    setTimeout(() => playSound('sparkle'), 500);
  }, [soundEnabled, playSound]);

  return {
    playSound,
    playXpCount,
    playCelebration,
    initAudio,
    // Convenience methods
    playComplete: () => playSound('complete'),
    playStreak: () => playSound('streak'),
    playLevelUp: () => playSound('levelUp'),
    playTap: () => playSound('tap'),
    playSuccess: () => playSound('success'),
    playTransition: () => playSound('transition'),
    playReward: () => playSound('reward'),
    playPop: () => playSound('pop'),
    playDing: () => playSound('ding'),
    playWhoosh: () => playSound('whoosh'),
    playSparkle: () => playSound('sparkle'),
    playCorrect: () => playSound('correct'),
  };
}

export default useSound;
