'use client';

// ============================================================================
// LESSON AMBIENCE HOOK
// Subtle, barely-perceptible ambient sounds that create atmosphere
// without being distracting. Less is more. Silence is also valid.
// ============================================================================

import { useCallback, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';

type LessonPhase = 'entering' | 'wisdom' | 'action' | 'reflection' | 'completion';
type ActionType = 'write' | 'reflect' | 'observe' | 'breathe' | 'act';

export function useLessonAmbience() {
  const { soundEnabled } = useStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      console.warn('Web Audio API not supported');
    }
  }, []);

  // Create subtle pink noise (much gentler than drones)
  const createPinkNoise = useCallback((duration: number = 2) => {
    const ctx = audioContextRef.current;
    if (!ctx) return null;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    return buffer;
  }, []);

  // Start very subtle ambient background
  const startAmbience = useCallback((phase: LessonPhase, _actionType?: ActionType) => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Stop existing
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
        noiseSourceRef.current.disconnect();
      } catch {}
    }

    // Create gentle pink noise
    const noiseBuffer = createPinkNoise(2);
    if (!noiseBuffer) return;

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Very low volume - barely perceptible
    const gain = ctx.createGain();
    const volume = phase === 'reflection' ? 0.008 : 0.012; // Even quieter during reflection
    gain.gain.value = 0;

    // Low pass filter to make it even softer
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200; // Very low - just a gentle hum
    filter.Q.value = 0.1;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    noiseSourceRef.current = source;
    gainNodeRef.current = gain;

    // Slow fade in
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 3);

    isPlayingRef.current = true;
  }, [soundEnabled, initAudio, createPinkNoise]);

  // Transition between phases
  const transitionTo = useCallback((newPhase: LessonPhase, actionType?: ActionType) => {
    if (!soundEnabled) return;

    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;

    if (!ctx || !gain || !isPlayingRef.current) {
      startAmbience(newPhase, actionType);
      return;
    }

    // Just adjust volume for different phases
    const volume = newPhase === 'reflection' ? 0.008 : 0.012;
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1);
  }, [soundEnabled, startAmbience]);

  // Stop ambience
  const stopAmbience = useCallback(() => {
    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;

    if (ctx && gain && isPlayingRef.current) {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);

      setTimeout(() => {
        if (noiseSourceRef.current) {
          try {
            noiseSourceRef.current.stop();
            noiseSourceRef.current.disconnect();
          } catch {}
          noiseSourceRef.current = null;
        }
        isPlayingRef.current = false;
      }, 2000);
    }
  }, []);

  // Play soft bell for transitions - gentler version
  const playBell = useCallback((type: 'soft' | 'bright' | 'deep' = 'soft') => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Single gentle tone instead of chord
    const frequencies = {
      soft: 440,    // A4
      bright: 523,  // C5
      deep: 262     // C4
    };

    const freq = frequencies[type];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    // Very quiet
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2);
  }, [soundEnabled, initAudio]);

  // Keystroke sound - soft, satisfying click
  const playKeystroke = useCallback(() => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Soft click sound - like a quality mechanical keyboard
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = 1200 + Math.random() * 200; // Slight variation

    filter.type = 'highpass';
    filter.frequency.value = 800;

    // Quick, soft click
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }, [soundEnabled, initAudio]);

  // Completion chime - simpler, quieter
  const playCompletionChime = useCallback(() => {
    if (!soundEnabled) return;

    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Simple two-note chime
    const notes = [523, 784]; // C5, G5 - just two notes
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + i * 0.2;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.06, startTime + 0.05);
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
