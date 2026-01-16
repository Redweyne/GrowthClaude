'use client';

// ============================================================================
// AUDIO MANAGER - Plays real audio files with Web Audio fallback
// ============================================================================

// Audio file paths
export const SOUNDS = {
  tap: '/audio/ui/tap.mp3',
  success: '/audio/ui/success.mp3',
  complete: '/audio/ui/complete.mp3',
  levelUp: '/audio/ui/level-up.mp3',
  streak: '/audio/ui/streak.mp3',
  bell: '/audio/ui/bell.mp3',
  chime: '/audio/ui/chime.mp3',
  whoosh: '/audio/ui/whoosh.mp3',
  pop: '/audio/ui/pop.mp3',
  celebrate: '/audio/ui/celebrate.mp3',
  keystroke: '/audio/ui/keystroke.mp3',
  ambientCalm: '/audio/ambient/calm.mp3',
  ambientFocus: '/audio/ambient/focus.mp3',
  ambientReflection: '/audio/ambient/reflection.mp3',
  ambientWisdom: '/audio/ambient/wisdom.mp3',
} as const;

export type SoundName = keyof typeof SOUNDS;

// Track which files exist
const fileExists = new Map<string, boolean>();
const audioCache = new Map<string, HTMLAudioElement>();

// Global volume
let globalVolume = 0.7;
let ambientVolume = 0.4;

// Audio context for fallback sounds
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// ============================================================================
// FALLBACK SOUNDS - Simple tones when files don't exist
// ============================================================================

const FALLBACK_CONFIG: Record<string, { freq: number; duration: number; type: OscillatorType; ramp?: number[] }> = {
  tap: { freq: 800, duration: 0.05, type: 'sine' },
  pop: { freq: 600, duration: 0.08, type: 'sine' },
  success: { freq: 523, duration: 0.15, type: 'sine', ramp: [523, 659, 784] },
  complete: { freq: 440, duration: 0.3, type: 'sine', ramp: [440, 554, 659, 880] },
  levelUp: { freq: 392, duration: 0.4, type: 'sine', ramp: [392, 494, 587, 784, 988] },
  streak: { freq: 440, duration: 0.25, type: 'sine', ramp: [440, 523, 659] },
  bell: { freq: 880, duration: 0.5, type: 'sine' },
  chime: { freq: 1047, duration: 0.3, type: 'sine' },
  whoosh: { freq: 200, duration: 0.15, type: 'sawtooth' },
  celebrate: { freq: 523, duration: 0.5, type: 'sine', ramp: [523, 659, 784, 1047] },
  keystroke: { freq: 1200, duration: 0.03, type: 'triangle' },
};

function playFallbackSound(name: SoundName, volume: number = 1): void {
  const config = FALLBACK_CONFIG[name];
  if (!config) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const vol = volume * globalVolume * 0.3; // Fallbacks are quieter

    if (config.ramp && config.ramp.length > 1) {
      // Play arpeggio
      config.ramp.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = config.type;
        osc.frequency.value = freq;

        const start = now + i * 0.08;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(vol, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + config.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + config.duration + 0.1);
      });
    } else {
      // Play single tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = config.type;
      osc.frequency.value = config.freq;

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + config.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + config.duration + 0.1);
    }
  } catch {
    // Audio not available
  }
}

// ============================================================================
// MAIN API
// ============================================================================

/**
 * Check if a sound file exists (by trying to load it)
 */
async function checkFileExists(path: string): Promise<boolean> {
  if (fileExists.has(path)) {
    return fileExists.get(path)!;
  }

  return new Promise((resolve) => {
    const audio = new Audio(path);

    audio.addEventListener('canplaythrough', () => {
      fileExists.set(path, true);
      audioCache.set(path, audio);
      resolve(true);
    }, { once: true });

    audio.addEventListener('error', () => {
      fileExists.set(path, false);
      resolve(false);
    }, { once: true });

    audio.load();
  });
}

/**
 * Preload UI sounds and check which exist
 */
export async function preloadUISounds(): Promise<void> {
  const uiSounds: SoundName[] = [
    'tap', 'success', 'complete', 'levelUp', 'streak',
    'bell', 'chime', 'whoosh', 'pop', 'celebrate', 'keystroke'
  ];
  await Promise.all(uiSounds.map(name => checkFileExists(SOUNDS[name])));
}

/**
 * Play a sound - tries file first, falls back to generated tone
 */
export function playSound(name: SoundName, volume: number = 1): void {
  const path = SOUNDS[name];

  // If we know the file doesn't exist, use fallback immediately
  if (fileExists.get(path) === false) {
    playFallbackSound(name, volume);
    return;
  }

  // Try to play the file
  try {
    const audio = new Audio(path);
    audio.volume = volume * globalVolume;

    const playPromise = audio.play();

    if (playPromise) {
      playPromise.catch(() => {
        // File doesn't exist or can't play - use fallback
        fileExists.set(path, false);
        playFallbackSound(name, volume);
      });
    }

    // Also handle error event
    audio.addEventListener('error', () => {
      fileExists.set(path, false);
      playFallbackSound(name, volume);
    }, { once: true });

  } catch {
    playFallbackSound(name, volume);
  }
}

export function setGlobalVolume(volume: number): void {
  globalVolume = Math.max(0, Math.min(1, volume));
}

export function setAmbientVolume(volume: number): void {
  ambientVolume = Math.max(0, Math.min(1, volume));
}

export function getVolumes(): { global: number; ambient: number } {
  return { global: globalVolume, ambient: ambientVolume };
}

// ============================================================================
// AMBIENT PLAYER
// ============================================================================

let currentAmbient: HTMLAudioElement | null = null;
let ambientFadeInterval: ReturnType<typeof setInterval> | null = null;

export function startAmbient(name: SoundName, fadeIn: number = 2000): void {
  stopAmbient(500);

  setTimeout(() => {
    const path = SOUNDS[name];

    // Don't try if we know it doesn't exist
    if (fileExists.get(path) === false) return;

    try {
      currentAmbient = new Audio(path);
      currentAmbient.loop = true;
      currentAmbient.volume = 0;

      currentAmbient.play().catch(() => {
        fileExists.set(path, false);
        currentAmbient = null;
      });

      currentAmbient.addEventListener('error', () => {
        fileExists.set(path, false);
        currentAmbient = null;
      }, { once: true });

      // Fade in
      const steps = 20;
      const stepTime = fadeIn / steps;
      const volumeStep = ambientVolume / steps;
      let currentStep = 0;

      ambientFadeInterval = setInterval(() => {
        currentStep++;
        if (currentAmbient) {
          currentAmbient.volume = Math.min(volumeStep * currentStep, ambientVolume);
        }
        if (currentStep >= steps && ambientFadeInterval) {
          clearInterval(ambientFadeInterval);
        }
      }, stepTime);

    } catch {
      // Audio not available
    }
  }, 500);
}

export function stopAmbient(fadeOut: number = 2000): void {
  if (!currentAmbient) return;

  if (ambientFadeInterval) {
    clearInterval(ambientFadeInterval);
  }

  const audio = currentAmbient;
  const startVolume = audio.volume;
  const steps = 20;
  const stepTime = fadeOut / steps;
  const volumeStep = startVolume / steps;
  let currentStep = 0;

  ambientFadeInterval = setInterval(() => {
    currentStep++;
    audio.volume = Math.max(startVolume - volumeStep * currentStep, 0);
    if (currentStep >= steps && ambientFadeInterval) {
      clearInterval(ambientFadeInterval);
      audio.pause();
      audio.src = '';
    }
  }, stepTime);

  currentAmbient = null;
}

export function isAmbientPlaying(): boolean {
  return currentAmbient !== null && !currentAmbient.paused;
}

// ============================================================================
// HAPTIC FEEDBACK
// ============================================================================

export function playHaptic(pattern: number | number[] = 10): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Not supported
    }
  }
}

export const HAPTIC_PATTERNS = {
  tap: 10,
  success: [20, 50, 20],
  complete: [30, 50, 30, 50, 60],
  celebrate: [20, 30, 20, 30, 20, 80],
  error: [50, 30, 50],
};
