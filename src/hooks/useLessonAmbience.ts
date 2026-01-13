'use client';

// ============================================================================
// LESSON AMBIENCE HOOK
// Creates immersive soundscapes for each phase of the lesson experience.
// Sound is not decoration—it's the texture of the sacred space we create.
// ============================================================================

import { useCallback, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';

type LessonPhase = 'entering' | 'wisdom' | 'action' | 'reflection' | 'completion';
type ActionType = 'write' | 'reflect' | 'observe' | 'breathe' | 'act';

interface AmbienceConfig {
  baseFreq: number;
  harmonics: number[];
  filterFreq: number;
  volume: number;
  breathRate?: number; // For breathing exercises
}

// Phase-specific ambience configurations
const PHASE_CONFIG: Record<LessonPhase, AmbienceConfig> = {
  entering: {
    baseFreq: 110, // A2 - deep, grounding
    harmonics: [1, 0.5, 0.25],
    filterFreq: 400,
    volume: 0.08
  },
  wisdom: {
    baseFreq: 130.81, // C3 - contemplative
    harmonics: [1, 0.6, 0.3, 0.15],
    filterFreq: 600,
    volume: 0.06
  },
  action: {
    baseFreq: 146.83, // D3 - focused
    harmonics: [1, 0.4, 0.2],
    filterFreq: 500,
    volume: 0.05
  },
  reflection: {
    baseFreq: 164.81, // E3 - introspective
    harmonics: [1, 0.5, 0.3, 0.2],
    filterFreq: 700,
    volume: 0.04
  },
  completion: {
    baseFreq: 196, // G3 - resolved, uplifting
    harmonics: [1, 0.6, 0.4, 0.2],
    filterFreq: 900,
    volume: 0.06
  }
};

// Action-specific modulations
const ACTION_MODULATION: Record<ActionType, Partial<AmbienceConfig>> = {
  breathe: {
    baseFreq: 110,
    filterFreq: 350,
    breathRate: 4 // 4 seconds per breath cycle
  },
  reflect: {
    baseFreq: 138.59, // C#3
    filterFreq: 500
  },
  observe: {
    baseFreq: 123.47, // B2
    filterFreq: 450
  },
  write: {
    baseFreq: 155.56, // Eb3
    filterFreq: 550
  },
  act: {
    baseFreq: 174.61, // F3
    filterFreq: 600
  }
};

export function useLessonAmbience() {
  const { soundEnabled } = useStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const breathLFORef = useRef<OscillatorNode | null>(null);
  const breathGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const currentPhaseRef = useRef<LessonPhase | null>(null);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      console.warn('Web Audio API not supported');
    }
  }, []);

  // Create the layered drone
  const createDrone = useCallback((config: AmbienceConfig) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Clean up existing oscillators
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch {}
    });
    oscillatorsRef.current = [];

    // Create master gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    gainNodeRef.current = masterGain;

    // Create filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = config.filterFreq;
    filter.Q.value = 0.5;
    filterRef.current = filter;

    // Connect filter to output
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Create oscillators for each harmonic
    config.harmonics.forEach((harmonicGain, index) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = index === 0 ? 'sine' : 'triangle';
      osc.frequency.value = config.baseFreq * (index + 1);
      oscGain.gain.value = harmonicGain * config.volume;

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();

      oscillatorsRef.current.push(osc);
    });

    // Add subtle detuned layer for richness
    const detuned = ctx.createOscillator();
    const detunedGain = ctx.createGain();
    detuned.type = 'sine';
    detuned.frequency.value = config.baseFreq * 1.002; // Slight detune
    detunedGain.gain.value = config.volume * 0.3;
    detuned.connect(detunedGain);
    detunedGain.connect(filter);
    detuned.start();
    oscillatorsRef.current.push(detuned);
  }, []);

  // Add breathing modulation for breathe actions
  const addBreathModulation = useCallback((breathRate: number) => {
    const ctx = audioContextRef.current;
    const filter = filterRef.current;
    if (!ctx || !filter) return;

    // Create LFO for breathing
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    lfo.type = 'sine';
    lfo.frequency.value = 1 / breathRate; // One cycle per breathRate seconds

    lfoGain.gain.value = 200; // Modulation depth for filter

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    breathLFORef.current = lfo;
    breathGainRef.current = lfoGain;
  }, []);

  // Start ambience for a phase
  const startAmbience = useCallback((phase: LessonPhase, actionType?: ActionType) => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Resume audio context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    let config = { ...PHASE_CONFIG[phase] };

    // Apply action-specific modulation
    if (phase === 'action' && actionType) {
      const modulation = ACTION_MODULATION[actionType];
      config = { ...config, ...modulation };
    }

    createDrone(config);

    // Add breath modulation if needed
    if (config.breathRate) {
      addBreathModulation(config.breathRate);
    }

    // Fade in
    const gain = gainNodeRef.current;
    if (gain) {
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);
    }

    isPlayingRef.current = true;
    currentPhaseRef.current = phase;
  }, [soundEnabled, initAudio, createDrone, addBreathModulation]);

  // Transition between phases
  const transitionTo = useCallback((newPhase: LessonPhase, actionType?: ActionType) => {
    if (!soundEnabled) return;

    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;

    if (!ctx || !isPlayingRef.current) {
      startAmbience(newPhase, actionType);
      return;
    }

    // Crossfade: fade out current, then start new
    if (gain) {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    }

    // Stop breath modulation
    if (breathLFORef.current) {
      try {
        breathLFORef.current.stop();
        breathLFORef.current.disconnect();
      } catch {}
      breathLFORef.current = null;
    }

    // Start new phase after fade
    setTimeout(() => {
      startAmbience(newPhase, actionType);
    }, 1000);
  }, [soundEnabled, startAmbience]);

  // Stop ambience
  const stopAmbience = useCallback(() => {
    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;

    if (ctx && gain && isPlayingRef.current) {
      // Fade out
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

      // Stop after fade
      setTimeout(() => {
        oscillatorsRef.current.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch {}
        });
        oscillatorsRef.current = [];

        if (breathLFORef.current) {
          try { breathLFORef.current.stop(); breathLFORef.current.disconnect(); } catch {}
          breathLFORef.current = null;
        }

        isPlayingRef.current = false;
        currentPhaseRef.current = null;
      }, 1500);
    }
  }, []);

  // Play bell sound for transitions
  const playBell = useCallback((type: 'soft' | 'bright' | 'deep' = 'soft') => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const frequencies = {
      soft: [523.25, 659.25, 783.99], // C5, E5, G5
      bright: [880, 1108.73, 1318.51], // A5, C#6, E6
      deep: [261.63, 329.63, 392] // C4, E4, G4
    };

    const freqs = frequencies[type];
    const now = ctx.currentTime;

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15 - i * 0.03, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + 3);
    });
  }, [soundEnabled, initAudio]);

  // Play keystroke sound for writing
  const playKeystroke = useCallback(() => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 800 + Math.random() * 400;

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, [soundEnabled, initAudio]);

  // Play completion chime
  const playCompletionChime = useCallback(() => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + i * 0.15;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 1.5);
    });
  }, [soundEnabled, initAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbience();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stopAmbience]);

  return {
    startAmbience,
    transitionTo,
    stopAmbience,
    playBell,
    playKeystroke,
    playCompletionChime,
    initAudio
  };
}
