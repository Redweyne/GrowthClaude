'use client';

// ============================================================================
// LESSON AMBIENCE - THE BREATH OF THE EXPERIENCE
// ============================================================================
//
// This isn't background noise. It's the breath of the experience.
// Each phase of a lesson has its own atmosphere, its own feeling.
//
// PHASES:
// - Entering: Dawn breaking. Possibility. A door opening.
// - Wisdom: Ancient spaces. Depth. Reverence.
// - Action: Grounded presence. Focus. Clarity.
// - Reflection: Vast stillness. Inner space. The ocean at night.
// - Completion: Warm light. Achievement. Coming home.
//
// PRINCIPLES:
// - Ambience should be felt, not heard consciously
// - Transitions are slow and organic
// - Silence is part of the composition
// - Sound should make you feel held, not watched
// ============================================================================

import { useCallback, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
  NOTES,
  CHORDS,
  HAPTICS,
  VOLUMES,
  createReverb,
  createWarmthFilter,
  createOceanNoise,
  playHaptic,
} from '@/lib/soundscape';

type LessonPhase = 'entering' | 'wisdom' | 'action' | 'reflection' | 'completion';
type ActionType = 'write' | 'reflect' | 'observe' | 'breathe' | 'act';

// Phase-specific atmosphere configurations
const ATMOSPHERES: Record<LessonPhase, {
  baseFrequency: number;
  harmonics: number[];
  filterCutoff: number;
  volume: number;
  breathRate: number;
  reverbDecay: number;
  warmth: number;
}> = {
  entering: {
    baseFrequency: NOTES.C3,
    harmonics: [1, 1.5, 2],      // Octave + fifth
    filterCutoff: 400,
    volume: 0.015,
    breathRate: 0.08,            // Slow, welcoming
    reverbDecay: 2.5,
    warmth: 0.7,
  },
  wisdom: {
    baseFrequency: NOTES.G2,     // Deep, grounding
    harmonics: [1, 1.5, 2, 3],   // Rich harmonics
    filterCutoff: 300,
    volume: 0.012,
    breathRate: 0.06,            // Very slow, contemplative
    reverbDecay: 3.5,            // Long reverb for space
    warmth: 0.9,
  },
  action: {
    baseFrequency: NOTES.C4,
    harmonics: [1, 2],           // Clean, focused
    filterCutoff: 600,
    volume: 0.01,
    breathRate: 0.12,            // Slightly faster, energized
    reverbDecay: 1.5,
    warmth: 0.5,
  },
  reflection: {
    baseFrequency: NOTES.A2,     // Introspective
    harmonics: [1, 1.5, 2, 2.5], // Minor quality
    filterCutoff: 250,
    volume: 0.008,               // Quietest - space for thought
    breathRate: 0.04,            // Slowest - meditative
    reverbDecay: 4.0,            // Maximum space
    warmth: 1.0,                 // Maximum warmth
  },
  completion: {
    baseFrequency: NOTES.G3,
    harmonics: [1, 1.25, 1.5, 2], // Major quality, bright
    filterCutoff: 500,
    volume: 0.018,
    breathRate: 0.1,
    reverbDecay: 2.0,
    warmth: 0.6,
  },
};

// Keystroke pitch variations based on reflection depth
const KEYSTROKE_SCALES = {
  shallow: [NOTES.E4, NOTES.G4, NOTES.A4],
  building: [NOTES.E4, NOTES.G4, NOTES.A4, NOTES.B4, NOTES.E5],
  deep: [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.B4, NOTES.C5, NOTES.E5],
};

export function useLessonAmbience() {
  const { soundEnabled, hapticEnabled } = useStore();

  // Audio nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);

  // Drone layers
  const droneOscillatorsRef = useRef<OscillatorNode[]>([]);
  const droneGainsRef = useRef<GainNode[]>([]);

  // Ocean texture
  const oceanSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const oceanGainRef = useRef<GainNode | null>(null);

  // LFO for breathing
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);

  // State
  const isPlayingRef = useRef(false);
  const currentPhaseRef = useRef<LessonPhase>('entering');
  const keystrokeCountRef = useRef(0);
  const lastKeystrokeRef = useRef(0);

  // Initialize audio context with all nodes
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const ctx = audioContextRef.current;

      // Master gain
      masterGainRef.current = ctx.createGain();
      masterGainRef.current.gain.value = 0;

      // Reverb
      reverbRef.current = createReverb(ctx, 3);

      // Connect: master -> reverb -> destination
      const wetGain = ctx.createGain();
      wetGain.gain.value = 0.4;
      const dryGain = ctx.createGain();
      dryGain.gain.value = 0.6;

      masterGainRef.current.connect(dryGain);
      masterGainRef.current.connect(reverbRef.current);
      reverbRef.current.connect(wetGain);

      dryGain.connect(ctx.destination);
      wetGain.connect(ctx.destination);

    } catch {
      console.warn('Web Audio API not supported');
    }
  }, []);

  // Create breathing drone for atmosphere
  const createDrone = useCallback((phase: LessonPhase) => {
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const config = ATMOSPHERES[phase];
    const now = ctx.currentTime;

    // Clear existing drone
    droneOscillatorsRef.current.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch {}
    });
    droneGainsRef.current.forEach(gain => {
      try { gain.disconnect(); } catch {}
    });
    droneOscillatorsRef.current = [];
    droneGainsRef.current = [];

    // Stop existing LFO
    if (lfoRef.current) {
      try { lfoRef.current.stop(); lfoRef.current.disconnect(); } catch {}
    }
    if (lfoGainRef.current) {
      try { lfoGainRef.current.disconnect(); } catch {}
    }

    // Create LFO for breathing
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    lfo.type = 'sine';
    lfo.frequency.value = config.breathRate;
    lfoGain.gain.value = 0.3; // Breathing depth

    lfo.connect(lfoGain);
    lfo.start(now);
    lfoRef.current = lfo;
    lfoGainRef.current = lfoGain;

    // Create harmonic drone layers
    config.harmonics.forEach((harmonic, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = createWarmthFilter(ctx, config.filterCutoff);

      osc.type = 'sine';
      osc.frequency.value = config.baseFrequency * harmonic;

      // Quieter for higher harmonics
      const harmonicVolume = config.volume / (1 + i * 0.5);
      gain.gain.value = 0;

      // Connect LFO to modulate gain (breathing)
      lfoGain.connect(gain.gain);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      // Slow fade in with stagger
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(harmonicVolume, now + 3 + i * 0.5);

      osc.start(now);

      droneOscillatorsRef.current.push(osc);
      droneGainsRef.current.push(gain);
    });
  }, []);

  // Create ocean texture for reflection phase
  const createOceanTexture = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Stop existing ocean
    if (oceanSourceRef.current) {
      try {
        oceanSourceRef.current.stop();
        oceanSourceRef.current.disconnect();
      } catch {}
    }

    const oceanBuffer = createOceanNoise(ctx, 15);
    const source = ctx.createBufferSource();
    source.buffer = oceanBuffer;
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    // Very heavy filtering for subtlety
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;
    filter.Q.value = 0.5;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    oceanSourceRef.current = source;
    oceanGainRef.current = gain;

    // Slow fade in
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 5);
  }, []);

  // Start ambience for a lesson phase
  const startAmbience = useCallback((phase: LessonPhase, _actionType?: ActionType) => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    currentPhaseRef.current = phase;

    // Create phase-specific drone
    createDrone(phase);

    // Add ocean texture for reflection
    if (phase === 'reflection') {
      createOceanTexture();
    } else if (oceanGainRef.current) {
      // Fade out ocean for other phases
      oceanGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    }

    // Master volume fade in
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);

    isPlayingRef.current = true;
  }, [soundEnabled, initAudio, createDrone, createOceanTexture]);

  // Smooth transition between phases
  const transitionTo = useCallback((newPhase: LessonPhase, actionType?: ActionType) => {
    if (!soundEnabled) return;

    const ctx = audioContextRef.current;
    if (!ctx) {
      startAmbience(newPhase, actionType);
      return;
    }

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    currentPhaseRef.current = newPhase;

    // Crossfade to new drone
    const oldGains = [...droneGainsRef.current];

    // Create new drone (will replace refs)
    createDrone(newPhase);

    // Fade out old drone
    oldGains.forEach(gain => {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    });

    // Handle ocean for reflection
    if (newPhase === 'reflection' && !oceanSourceRef.current) {
      createOceanTexture();
    } else if (newPhase !== 'reflection' && oceanGainRef.current) {
      oceanGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);
    }

    // Cleanup old oscillators after fade
    setTimeout(() => {
      oldGains.forEach(gain => {
        try { gain.disconnect(); } catch {}
      });
    }, 3000);
  }, [soundEnabled, startAmbience, createDrone, createOceanTexture]);

  // Stop all ambience
  const stopAmbience = useCallback(() => {
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;

    if (!ctx || !master) return;

    // Slow fade out
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);

    // Stop ocean
    if (oceanGainRef.current) {
      oceanGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);
    }

    // Cleanup after fade
    setTimeout(() => {
      // Stop drones
      droneOscillatorsRef.current.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch {}
      });
      droneGainsRef.current.forEach(gain => {
        try { gain.disconnect(); } catch {}
      });
      droneOscillatorsRef.current = [];
      droneGainsRef.current = [];

      // Stop LFO
      if (lfoRef.current) {
        try { lfoRef.current.stop(); lfoRef.current.disconnect(); } catch {}
        lfoRef.current = null;
      }

      // Stop ocean
      if (oceanSourceRef.current) {
        try { oceanSourceRef.current.stop(); oceanSourceRef.current.disconnect(); } catch {}
        oceanSourceRef.current = null;
      }

      isPlayingRef.current = false;
    }, 3500);
  }, []);

  // Bell - crystalline, reverberant
  const playBell = useCallback((type: 'soft' | 'bright' | 'deep' = 'soft') => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
      return;
    }

    // Bell frequencies with harmonics
    const bells: Record<string, { fundamental: number; harmonics: number[] }> = {
      soft: { fundamental: NOTES.E5, harmonics: [1, 2.4, 5.95] },
      bright: { fundamental: NOTES.G5, harmonics: [1, 2, 3.6, 6.2] },
      deep: { fundamental: NOTES.C4, harmonics: [1, 2.76, 5.4] },
    };

    const bell = bells[type];
    const now = ctx.currentTime;

    // Create reverb for bell
    const bellReverb = createReverb(ctx, 2.5);
    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.5;

    bellReverb.connect(wetGain);
    wetGain.connect(ctx.destination);

    // Create each harmonic
    bell.harmonics.forEach((ratio, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = bell.fundamental * ratio;

      // Bell envelope: quick attack, long decay
      const volume = VOLUMES.present / (1 + i * 0.8);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.connect(bellReverb);

      osc.start(now);
      osc.stop(now + 3.5);
    });

    if (hapticEnabled) playHaptic(HAPTICS.tap);
  }, [soundEnabled, hapticEnabled, initAudio]);

  // Keystroke - musical, evolving with depth
  const playKeystroke = useCallback(() => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
      return;
    }

    const now = Date.now();

    // Track keystroke rhythm
    if (now - lastKeystrokeRef.current < 200) {
      keystrokeCountRef.current++;
    } else {
      keystrokeCountRef.current = 1;
    }
    lastKeystrokeRef.current = now;

    // Choose scale based on writing depth
    let scale: number[];
    if (keystrokeCountRef.current > 50) {
      scale = KEYSTROKE_SCALES.deep;
    } else if (keystrokeCountRef.current > 20) {
      scale = KEYSTROKE_SCALES.building;
    } else {
      scale = KEYSTROKE_SCALES.shallow;
    }

    // Pick random note from scale
    const noteIndex = Math.floor(Math.random() * scale.length);
    const frequency = scale[noteIndex];

    // Create the keystroke sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = createWarmthFilter(ctx, 2000);

    // Use triangle for softer tone
    osc.type = 'triangle';

    // Slight pitch variation for naturalness
    osc.frequency.value = frequency * (0.98 + Math.random() * 0.04);

    // Quick, soft attack
    const volume = VOLUMES.subtle * 0.6;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);

    // Occasional sparkle for deep writing
    if (keystrokeCountRef.current > 30 && Math.random() < 0.05) {
      setTimeout(() => {
        const sparkle = ctx.createOscillator();
        const sparkleGain = ctx.createGain();

        sparkle.type = 'sine';
        sparkle.frequency.value = NOTES.E6;

        sparkleGain.gain.setValueAtTime(VOLUMES.subtle * 0.3, ctx.currentTime);
        sparkleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        sparkle.connect(sparkleGain);
        sparkleGain.connect(ctx.destination);

        sparkle.start();
        sparkle.stop(ctx.currentTime + 0.2);
      }, 50);
    }

    // Very subtle haptic
    if (hapticEnabled && Math.random() < 0.3) {
      playHaptic([5]); // Barely there
    }
  }, [soundEnabled, hapticEnabled, initAudio]);

  // Completion chime - triumphant, warm, full
  const playCompletionChime = useCallback(() => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
      return;
    }

    const now = ctx.currentTime;

    // Rich chord progression: resolution
    const chordSequence = [
      { notes: [NOTES.G3, NOTES.B3, NOTES.D4], time: 0 },
      { notes: [NOTES.C3, NOTES.E4, NOTES.G4, NOTES.C5], time: 0.5 },
    ];

    // Create reverb
    const completionReverb = createReverb(ctx, 3);
    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.45;

    completionReverb.connect(wetGain);
    wetGain.connect(ctx.destination);

    chordSequence.forEach(({ notes, time }) => {
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = createWarmthFilter(ctx, 2500);

        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = now + time + i * 0.03;
        const volume = VOLUMES.moment / Math.sqrt(notes.length);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.1);
        gain.gain.setValueAtTime(volume, startTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        gain.connect(completionReverb);

        osc.start(startTime);
        osc.stop(startTime + 3);
      });
    });

    // Add shimmer
    setTimeout(() => {
      [NOTES.G5, NOTES.E5, NOTES.C5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const start = ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(VOLUMES.subtle, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.6);
      });
    }, 800);

    if (hapticEnabled) playHaptic(HAPTICS.embrace);
  }, [soundEnabled, hapticEnabled, initAudio]);

  // Wisdom reveal - deep, ancient
  const playWisdomReveal = useCallback(() => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') return;

    const now = ctx.currentTime;

    // Deep, reverberant chord
    const wisdomChord = CHORDS.wisdom;
    const reverb = createReverb(ctx, 4);
    const wet = ctx.createGain();
    wet.gain.value = 0.6;

    reverb.connect(wet);
    wet.connect(ctx.destination);

    wisdomChord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = createWarmthFilter(ctx, 300);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const start = now + i * 0.15;
      const volume = VOLUMES.moment * 0.7 / Math.sqrt(wisdomChord.length);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.3);
      gain.gain.setValueAtTime(volume, start + 1);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      gain.connect(reverb);

      osc.start(start);
      osc.stop(start + 4.5);
    });

    if (hapticEnabled) playHaptic(HAPTICS.ground);
  }, [soundEnabled, hapticEnabled, initAudio]);

  // Transition whoosh - movement between states
  const playTransitionWhoosh = useCallback((direction: 'forward' | 'back' = 'forward') => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') return;

    const now = ctx.currentTime;

    // Create filtered noise burst
    const duration = 0.2;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2;

    // Sweep direction
    if (direction === 'forward') {
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + duration);
    } else {
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + duration);
    }

    const gain = ctx.createGain();
    gain.gain.value = VOLUMES.subtle;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start(now);

    if (hapticEnabled) playHaptic(HAPTICS.transition);
  }, [soundEnabled, hapticEnabled, initAudio]);

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
    // Core ambience
    startAmbience,
    transitionTo,
    stopAmbience,
    initAudio,

    // Moment sounds
    playBell,
    playKeystroke,
    playCompletionChime,
    playWisdomReveal,
    playTransitionWhoosh,

    // State
    isPlaying: isPlayingRef.current,
    currentPhase: currentPhaseRef.current,
  };
}

export default useLessonAmbience;
