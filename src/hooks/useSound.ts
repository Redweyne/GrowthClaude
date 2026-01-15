'use client';

// ============================================================================
// USE SOUND - EMOTIONAL AUDIO THAT EVOKES, NOT NOTIFIES
// ============================================================================
//
// Every sound is a moment of feeling. We don't beep at users.
// We create tiny emotional experiences.
//
// - Sounds breathe and have space
// - Haptic feedback accompanies key moments
// - Silence is used intentionally
// - Warmth over brightness
// ============================================================================

import { useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';
import {
  NOTES,
  CHORDS,
  HAPTICS,
  VOLUMES,
  createReverb,
  createWarmthFilter,
  playHaptic,
} from '@/lib/soundscape';

// Singleton AudioContext
let globalCtx: AudioContext | null = null;
let globalReverb: ConvolverNode | null = null;
let isInitialized = false;

function getAudioContext(): AudioContext {
  if (!globalCtx) {
    globalCtx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return globalCtx;
}

function getReverb(): ConvolverNode {
  if (!globalReverb && globalCtx) {
    globalReverb = createReverb(globalCtx, 1.5);
  }
  return globalReverb!;
}

export function useSound() {
  const { soundEnabled, hapticEnabled } = useStore();
  const lastPlayRef = useRef<Record<string, number>>({});

  // Initialize audio (call on first user interaction)
  const initAudio = useCallback(() => {
    if (isInitialized) return;
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      getReverb();
      isInitialized = true;
    } catch (e) {
      console.warn('Audio init failed:', e);
    }
  }, []);

  // Debounce helper
  const canPlay = useCallback((key: string, minGap: number = 50): boolean => {
    const now = Date.now();
    const last = lastPlayRef.current[key] || 0;
    if (now - last < minGap) return false;
    lastPlayRef.current[key] = now;
    return true;
  }, []);

  // Core: Play a chord with emotion
  const playChord = useCallback((
    notes: number[],
    options: {
      volume?: number;
      attack?: number;
      decay?: number;
      sustain?: number;
      release?: number;
      spread?: number; // Stagger notes
      reverb?: number; // 0-1 wet/dry mix
      type?: OscillatorType;
    } = {}
  ) => {
    if (!soundEnabled) return;
    if (!canPlay('chord', 100)) return;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
      return;
    }

    const {
      volume = VOLUMES.present,
      attack = 0.08,
      decay = 0.1,
      sustain = 0.6,
      release = 0.8,
      spread = 0.02,
      reverb = 0.3,
      type = 'sine'
    } = options;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    const warmth = createWarmthFilter(ctx, 3000);
    const reverbNode = getReverb();

    // Dry/wet mix for reverb
    const dryGain = ctx.createGain();
    const wetGain = ctx.createGain();
    dryGain.gain.value = 1 - reverb;
    wetGain.gain.value = reverb;

    masterGain.connect(warmth);
    warmth.connect(dryGain);
    warmth.connect(reverbNode);
    reverbNode.connect(wetGain);
    dryGain.connect(ctx.destination);
    wetGain.connect(ctx.destination);

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.value = freq;

      // ADSR envelope
      const noteStart = now + i * spread;
      const noteVolume = volume / Math.sqrt(notes.length); // Balance chord

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(noteVolume, noteStart + attack);
      gain.gain.linearRampToValueAtTime(noteVolume * sustain, noteStart + attack + decay);
      gain.gain.setValueAtTime(noteVolume * sustain, noteStart + attack + decay + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + attack + decay + release);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(noteStart);
      osc.stop(noteStart + attack + decay + release + 0.1);
    });
  }, [soundEnabled, canPlay]);

  // Play a single tone with breath
  const playTone = useCallback((
    frequency: number,
    options: {
      volume?: number;
      duration?: number;
      type?: OscillatorType;
      reverb?: number;
    } = {}
  ) => {
    if (!soundEnabled) return;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') return;

    const {
      volume = VOLUMES.subtle,
      duration = 0.5,
      type = 'sine',
      reverb = 0.2
    } = options;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const warmth = createWarmthFilter(ctx, 2500);

    // Optional reverb
    if (reverb > 0) {
      const reverbNode = getReverb();
      const wet = ctx.createGain();
      wet.gain.value = reverb;
      warmth.connect(reverbNode);
      reverbNode.connect(wet);
      wet.connect(ctx.destination);
    }

    const dry = ctx.createGain();
    dry.gain.value = 1 - reverb;
    warmth.connect(dry);
    dry.connect(ctx.destination);

    osc.type = type;
    osc.frequency.value = frequency;

    // Soft envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + duration * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(warmth);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }, [soundEnabled]);

  // =========================================================================
  // EMOTIONAL MOMENTS
  // =========================================================================

  // Tap - soft, warm acknowledgment
  const playTap = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('tap', 30)) return;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') return;

    // Soft wood-like tap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = createWarmthFilter(ctx, 1500);

    osc.type = 'triangle';
    osc.frequency.value = 400 + Math.random() * 50;

    gain.gain.setValueAtTime(VOLUMES.subtle, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);

    // Haptic
    if (hapticEnabled) playHaptic(HAPTICS.tap);
  }, [soundEnabled, hapticEnabled, canPlay]);

  // Sparkle - moment of insight or magic
  const playSparkle = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('sparkle', 200)) return;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') return;

    // High, twinkling notes
    const notes = [NOTES.E5, NOTES.G5, NOTES.B5, NOTES.E6];
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const start = now + i * 0.05;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(VOLUMES.subtle, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.35);
    });

    if (hapticEnabled) playHaptic(HAPTICS.pulse);
  }, [soundEnabled, hapticEnabled, canPlay]);

  // Complete - warm resolution
  const playComplete = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('complete', 500)) return;

    playChord(CHORDS.peace, {
      volume: VOLUMES.moment,
      attack: 0.15,
      release: 1.2,
      spread: 0.04,
      reverb: 0.4
    });

    if (hapticEnabled) playHaptic(HAPTICS.embrace);
  }, [soundEnabled, hapticEnabled, playChord, canPlay]);

  // Success - gentle affirmation
  const playSuccess = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('success', 300)) return;

    // Rising two-note interval (perfect fifth)
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') return;

    [NOTES.C4, NOTES.G4].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const start = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(VOLUMES.present, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.55);
    });

    if (hapticEnabled) playHaptic(HAPTICS.pulse);
  }, [soundEnabled, hapticEnabled, canPlay]);

  // Reward - warm, ascending hope
  const playReward = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('reward', 500)) return;

    playChord(CHORDS.hope, {
      volume: VOLUMES.moment,
      attack: 0.1,
      release: 1.0,
      spread: 0.06,
      reverb: 0.35
    });

    if (hapticEnabled) playHaptic(HAPTICS.rise);
  }, [soundEnabled, hapticEnabled, playChord, canPlay]);

  // Streak - building momentum
  const playStreak = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('streak', 500)) return;

    // Ascending arpeggio
    const notes = [NOTES.G3, NOTES.B3, NOTES.D4, NOTES.G4, NOTES.B4];
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') return;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const start = ctx.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(VOLUMES.present, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.65);
    });

    if (hapticEnabled) playHaptic(HAPTICS.rise);
  }, [soundEnabled, hapticEnabled, canPlay]);

  // Level Up - triumphant but warm
  const playLevelUp = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('levelUp', 1000)) return;

    playChord(CHORDS.triumph, {
      volume: VOLUMES.celebration,
      attack: 0.12,
      release: 1.5,
      spread: 0.05,
      reverb: 0.5
    });

    // Add shimmer on top
    setTimeout(() => {
      playTone(NOTES.D6, { volume: VOLUMES.subtle, duration: 0.8, reverb: 0.6 });
    }, 200);

    if (hapticEnabled) playHaptic(HAPTICS.celebrate);
  }, [soundEnabled, hapticEnabled, playChord, playTone, canPlay]);

  // Celebration - full emotional moment
  const playCelebration = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('celebration', 1000)) return;

    // Build up
    playChord(CHORDS.triumph, {
      volume: VOLUMES.celebration,
      attack: 0.15,
      release: 2.0,
      spread: 0.04,
      reverb: 0.5
    });

    // Sparkle accents
    setTimeout(() => playSparkle(), 300);
    setTimeout(() => playSparkle(), 600);

    if (hapticEnabled) playHaptic(HAPTICS.celebrate);
  }, [soundEnabled, hapticEnabled, playChord, playSparkle, canPlay]);

  // Transition - soft movement
  const playTransition = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('transition', 200)) return;

    // Soft whoosh with tone
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = createWarmthFilter(ctx, 1000);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(VOLUMES.subtle, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);

    if (hapticEnabled) playHaptic(HAPTICS.transition);
  }, [soundEnabled, hapticEnabled, canPlay]);

  // Whoosh - quick movement
  const playWhoosh = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('whoosh', 100)) return;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') return;

    // Noise-based whoosh
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Fade in and out
      const envelope = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 1;

    const gain = ctx.createGain();
    gain.gain.value = VOLUMES.subtle;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
  }, [soundEnabled, canPlay]);

  // XP Count - ticking with warmth
  const playXpCount = useCallback((count: number) => {
    if (!soundEnabled) return;

    const ticks = Math.min(count, 20);
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') return;

    for (let i = 0; i < ticks; i++) {
      setTimeout(() => {
        if (ctx.state === 'suspended') return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Rising pitch with warmth
        const progress = i / ticks;
        const freq = 600 + progress * 400;

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(VOLUMES.subtle * 0.8, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      }, i * 40);
    }

    // Final ding
    setTimeout(() => playSuccess(), ticks * 40 + 50);

    if (hapticEnabled) {
      // Light haptic pattern during counting
      setTimeout(() => playHaptic(HAPTICS.pulse), ticks * 40);
    }
  }, [soundEnabled, hapticEnabled, playSuccess]);

  // Pop - selection/bubble
  const playPop = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('pop', 50)) return;

    playTone(800, { volume: VOLUMES.subtle, duration: 0.08 });

    if (hapticEnabled) playHaptic(HAPTICS.tap);
  }, [soundEnabled, hapticEnabled, playTone, canPlay]);

  // Ding - notification (but warm)
  const playDing = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('ding', 200)) return;

    // Bell-like tone
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = NOTES.E5;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(VOLUMES.present, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.85);
  }, [soundEnabled, canPlay]);

  // Correct - gentle affirmation
  const playCorrect = useCallback(() => {
    if (!soundEnabled) return;
    if (!canPlay('correct', 200)) return;

    // Major third interval - universally "correct" feeling
    [NOTES.E4, NOTES.G4].forEach((freq, i) => {
      playTone(freq, {
        volume: VOLUMES.present,
        duration: 0.4 + i * 0.1
      });
    });

    if (hapticEnabled) playHaptic(HAPTICS.pulse);
  }, [soundEnabled, hapticEnabled, playTone, canPlay]);

  return {
    initAudio,
    // Core
    playChord,
    playTone,
    // Emotional moments
    playTap,
    playSparkle,
    playComplete,
    playSuccess,
    playReward,
    playStreak,
    playLevelUp,
    playCelebration,
    playTransition,
    playWhoosh,
    playXpCount,
    playPop,
    playDing,
    playCorrect,
    // Aliases for compatibility
    playSound: (type: string) => {
      const sounds: Record<string, () => void> = {
        tap: playTap,
        sparkle: playSparkle,
        complete: playComplete,
        success: playSuccess,
        reward: playReward,
        streak: playStreak,
        levelUp: playLevelUp,
        celebrate: playCelebration,
        transition: playTransition,
        whoosh: playWhoosh,
        pop: playPop,
        ding: playDing,
        correct: playCorrect,
      };
      sounds[type]?.();
    }
  };
}

export default useSound;
