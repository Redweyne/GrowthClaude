'use client';

// ============================================================================
// AUDIO MANAGER - Simple system for playing real audio files
// ============================================================================
//
// Place your audio files in:
//   /public/audio/ui/      - UI sounds (tap, success, complete, etc.)
//   /public/audio/ambient/ - Background music/ambience
//
// Recommended sources for free audio:
//   - Pixabay (pixabay.com/sound-effects & pixabay.com/music)
//   - Chosic (chosic.com/free-music/relaxing)
//   - Fesliyan Studios (fesliyanstudios.com)
// ============================================================================

// Audio file paths - update these when you add your audio files
export const SOUNDS = {
  // UI Sounds (short, one-shot)
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

  // Ambient/Background (longer, loopable)
  ambientCalm: '/audio/ambient/calm.mp3',
  ambientFocus: '/audio/ambient/focus.mp3',
  ambientReflection: '/audio/ambient/reflection.mp3',
  ambientWisdom: '/audio/ambient/wisdom.mp3',
} as const;

export type SoundName = keyof typeof SOUNDS;

// Cache for preloaded audio
const audioCache = new Map<string, HTMLAudioElement>();
const loadingPromises = new Map<string, Promise<HTMLAudioElement>>();

// Global volume settings
let globalVolume = 0.7;
let ambientVolume = 0.4;

/**
 * Preload an audio file
 */
export function preloadSound(name: SoundName): Promise<HTMLAudioElement> {
  const path = SOUNDS[name];

  // Already loaded
  if (audioCache.has(path)) {
    return Promise.resolve(audioCache.get(path)!);
  }

  // Already loading
  if (loadingPromises.has(path)) {
    return loadingPromises.get(path)!;
  }

  // Start loading
  const promise = new Promise<HTMLAudioElement>((resolve, reject) => {
    const audio = new Audio(path);

    audio.addEventListener('canplaythrough', () => {
      audioCache.set(path, audio);
      loadingPromises.delete(path);
      resolve(audio);
    }, { once: true });

    audio.addEventListener('error', () => {
      loadingPromises.delete(path);
      // Don't reject - just resolve with the audio element anyway
      // Missing files are not fatal
      console.warn(`Audio file not found: ${path}`);
      resolve(audio);
    }, { once: true });

    audio.load();
  });

  loadingPromises.set(path, promise);
  return promise;
}

/**
 * Preload multiple sounds
 */
export function preloadSounds(names: SoundName[]): Promise<HTMLAudioElement[]> {
  return Promise.all(names.map(preloadSound));
}

/**
 * Preload all UI sounds
 */
export function preloadUISounds(): Promise<HTMLAudioElement[]> {
  const uiSounds: SoundName[] = [
    'tap', 'success', 'complete', 'levelUp', 'streak',
    'bell', 'chime', 'whoosh', 'pop', 'celebrate'
  ];
  return preloadSounds(uiSounds);
}

/**
 * Play a sound effect (one-shot)
 */
export function playSound(name: SoundName, volume?: number): HTMLAudioElement | null {
  const path = SOUNDS[name];

  try {
    // Create new audio instance for overlapping plays
    const audio = new Audio(path);
    audio.volume = (volume ?? 1) * globalVolume;

    audio.play().catch(() => {
      // Autoplay blocked - this is normal, ignore
    });

    return audio;
  } catch {
    return null;
  }
}

/**
 * Set global volume (0-1)
 */
export function setGlobalVolume(volume: number): void {
  globalVolume = Math.max(0, Math.min(1, volume));
}

/**
 * Set ambient volume (0-1)
 */
export function setAmbientVolume(volume: number): void {
  ambientVolume = Math.max(0, Math.min(1, volume));
}

/**
 * Get current volumes
 */
export function getVolumes(): { global: number; ambient: number } {
  return { global: globalVolume, ambient: ambientVolume };
}

// ============================================================================
// AMBIENT PLAYER - For background music
// ============================================================================

let currentAmbient: HTMLAudioElement | null = null;
let ambientFadeInterval: NodeJS.Timeout | null = null;

/**
 * Start playing ambient background music
 */
export function startAmbient(name: SoundName, fadeIn: number = 2000): void {
  stopAmbient(1000); // Fade out current first

  setTimeout(() => {
    const path = SOUNDS[name];

    try {
      currentAmbient = new Audio(path);
      currentAmbient.loop = true;
      currentAmbient.volume = 0;

      currentAmbient.play().catch(() => {
        // Autoplay blocked
      });

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
        if (currentStep >= steps) {
          if (ambientFadeInterval) clearInterval(ambientFadeInterval);
        }
      }, stepTime);

    } catch {
      // Audio not available
    }
  }, 1000);
}

/**
 * Stop ambient music
 */
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
    if (currentStep >= steps) {
      if (ambientFadeInterval) clearInterval(ambientFadeInterval);
      audio.pause();
      audio.src = '';
    }
  }, stepTime);

  currentAmbient = null;
}

/**
 * Check if ambient is currently playing
 */
export function isAmbientPlaying(): boolean {
  return currentAmbient !== null && !currentAmbient.paused;
}

// ============================================================================
// HAPTIC FEEDBACK
// ============================================================================

/**
 * Play haptic feedback if supported
 */
export function playHaptic(pattern: number | number[] = 10): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Vibration not supported
    }
  }
}

// Preset haptic patterns
export const HAPTIC_PATTERNS = {
  tap: 10,
  success: [20, 50, 20],
  complete: [30, 50, 30, 50, 60],
  celebrate: [20, 30, 20, 30, 20, 80],
  error: [50, 30, 50],
};
