'use client';

// ============================================================================
// STORY AUDIO SYSTEM
// Creates an emotional soundscape that accompanies the transformation story.
// Ambient drones, gentle swells, and moments of silence for impact.
// ============================================================================

import { useCallback, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';

type StoryMood = 'opening' | 'journey' | 'contrast' | 'growth' | 'climax' | 'closing';

interface AudioNode {
  oscillator: OscillatorNode;
  gain: GainNode;
}

export function useStoryAudio() {
  const { soundEnabled } = useStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<AudioNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;

    const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioContextRef.current = ctx;

    // Create master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    return ctx;
  }, []);

  // Create a warm pad sound (emotional foundation)
  const createPad = useCallback((ctx: AudioContext, frequency: number, detune: number = 0): AudioNode => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.detune.setValueAtTime(detune, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);

    oscillator.connect(gain);
    gain.connect(masterGainRef.current!);

    return { oscillator, gain };
  }, []);

  // Create shimmering high tones (for emotional moments)
  const createShimmer = useCallback((ctx: AudioContext, baseFreq: number): AudioNode => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);

    // Subtle vibrato
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(4, ctx.currentTime);
    lfoGain.gain.setValueAtTime(3, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    lfo.start();

    gain.gain.setValueAtTime(0, ctx.currentTime);

    oscillator.connect(gain);
    gain.connect(masterGainRef.current!);

    return { oscillator, gain };
  }, []);

  // Start the ambient soundscape
  const startAmbience = useCallback(() => {
    if (!soundEnabled || isPlayingRef.current) return;

    const ctx = initAudio();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    isPlayingRef.current = true;

    // Create layered ambient sound
    // Deep bass drone (grounding)
    const bass1 = createPad(ctx, 65.41, 0); // C2
    const bass2 = createPad(ctx, 65.41, 7); // Slightly detuned for warmth

    // Mid harmony (emotional core)
    const mid1 = createPad(ctx, 130.81, 0); // C3
    const mid2 = createPad(ctx, 164.81, 0); // E3
    const mid3 = createPad(ctx, 196.00, 0); // G3

    // High shimmer (ethereal)
    const high1 = createShimmer(ctx, 523.25); // C5
    const high2 = createShimmer(ctx, 659.25); // E5

    const nodes = [bass1, bass2, mid1, mid2, mid3, high1, high2];
    activeNodesRef.current = nodes;

    // Start all oscillators
    nodes.forEach(node => node.oscillator.start());

    // Fade in master
    masterGainRef.current?.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 3);

    // Fade in individual layers with different timings
    bass1.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);
    bass2.gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2.5);
    mid1.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3);
    mid2.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3.5);
    mid3.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 4);
    high1.gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 5);
    high2.gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 6);

  }, [soundEnabled, initAudio, createPad, createShimmer]);

  // Swell the music (for emotional moments)
  const swell = useCallback((intensity: 'gentle' | 'medium' | 'powerful' = 'medium') => {
    if (!audioContextRef.current || !masterGainRef.current) return;

    const ctx = audioContextRef.current;
    const multiplier = intensity === 'gentle' ? 1.3 : intensity === 'medium' ? 1.6 : 2;
    const duration = intensity === 'gentle' ? 1 : intensity === 'medium' ? 1.5 : 2;

    // Swell up
    masterGainRef.current.gain.linearRampToValueAtTime(
      0.15 * multiplier,
      ctx.currentTime + duration
    );

    // Return to normal
    setTimeout(() => {
      masterGainRef.current?.gain.linearRampToValueAtTime(
        0.15,
        ctx.currentTime + duration
      );
    }, duration * 1000 + 500);
  }, []);

  // Transition to a different mood
  const setMood = useCallback((mood: StoryMood) => {
    if (!audioContextRef.current || activeNodesRef.current.length === 0) return;

    const ctx = audioContextRef.current;
    const [bass1, bass2, mid1, mid2, mid3, high1, high2] = activeNodesRef.current;

    switch (mood) {
      case 'opening':
        // Mysterious, anticipatory
        mid1?.gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 1);
        mid2?.gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 1);
        high1?.gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1);
        break;

      case 'journey':
        // Warm, nostalgic
        bass1?.gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 1);
        mid1?.gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1);
        mid2?.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1);
        break;

      case 'contrast':
        // Tension building
        bass1?.gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.5);
        mid3?.gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.5);
        high1?.gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 1);
        break;

      case 'growth':
        // Hopeful, ascending
        mid1?.gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 1);
        mid2?.gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1);
        mid3?.gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1);
        high1?.gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 1.5);
        high2?.gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 2);
        break;

      case 'climax':
        // Full, triumphant
        swell('powerful');
        bass1?.gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1);
        mid1?.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1);
        mid2?.gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 1);
        mid3?.gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1);
        high1?.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.5);
        high2?.gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1.5);
        break;

      case 'closing':
        // Gentle, resolved
        bass1?.gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);
        bass2?.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);
        mid1?.gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);
        mid2?.gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2);
        high1?.gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 3);
        break;
    }
  }, [swell]);

  // Play a single note (for transitions)
  const playNote = useCallback((frequency: number, duration: number = 0.5) => {
    if (!soundEnabled) return;

    const ctx = initAudio();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration + 0.1);
  }, [soundEnabled, initAudio]);

  // Play transition chime
  const playTransition = useCallback(() => {
    if (!soundEnabled) return;

    const ctx = initAudio();
    if (ctx.state === 'suspended') ctx.resume();

    // Gentle ascending arpeggio
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => playNote(freq, 0.4), i * 80);
    });
  }, [soundEnabled, initAudio, playNote]);

  // Play emotional reveal sound
  const playReveal = useCallback(() => {
    if (!soundEnabled) return;

    const ctx = initAudio();
    if (ctx.state === 'suspended') ctx.resume();

    // Warm chord reveal
    const frequencies = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08 - i * 0.015, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.6);
      }, i * 100);
    });

    swell('gentle');
  }, [soundEnabled, initAudio, swell]);

  // Stop all audio
  const stopAmbience = useCallback(() => {
    if (!audioContextRef.current || !masterGainRef.current) return;

    const ctx = audioContextRef.current;

    // Fade out
    masterGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);

    // Stop and cleanup after fade
    setTimeout(() => {
      activeNodesRef.current.forEach(node => {
        try {
          node.oscillator.stop();
        } catch {
          // Already stopped
        }
      });
      activeNodesRef.current = [];
      isPlayingRef.current = false;
    }, 2500);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbience();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAmbience]);

  return {
    startAmbience,
    stopAmbience,
    setMood,
    swell,
    playTransition,
    playReveal,
    playNote
  };
}
