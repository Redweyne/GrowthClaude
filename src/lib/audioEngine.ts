'use client';

// ============================================================================
// AUDIO ENGINE - Real MP3 Audio System using Howler.js
// ============================================================================
//
// This engine plays real audio files for an immersive experience:
// - UI sounds from /public/audio/ui/
// - Ambient/Writing ambience from /public/audio/writing/
// - Scene music with random start positions for long tracks
//
// ============================================================================

import { Howl, Howler } from 'howler';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export type UISound =
  | 'tap' | 'tapConfirm' | 'success' | 'successBig' | 'complete'
  | 'levelUp' | 'streak' | 'bell' | 'chime' | 'whoosh' | 'whooshOut'
  | 'pop' | 'celebrate' | 'unlock' | 'notification' | 'reveal'
  | 'keystroke' | 'error' | 'gong' | 'singingBowl';

export type AmbientSound =
  | 'onboarding' | 'lessonCalm' | 'lessonDeep' | 'reflection'
  | 'visualization' | 'reward' | 'home';

export type WritingAmbience = 'rain' | 'fire' | 'forest' | 'silence';

export interface AudioSettings {
  masterVolume: number;      // 0-1
  musicVolume: number;       // 0-1
  uiVolume: number;          // 0-1
  ambienceVolume: number;    // 0-1
  breathingEnabled: boolean;
  writingAmbienceType: WritingAmbience;
}

// Default settings
const defaultSettings: AudioSettings = {
  masterVolume: 0.7,
  musicVolume: 0.5,
  uiVolume: 0.8,
  ambienceVolume: 0.4,
  breathingEnabled: true,
  writingAmbienceType: 'rain',
};

let settings: AudioSettings = { ...defaultSettings };
let isInitialized = false;

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO FILE PATHS
// ─────────────────────────────────────────────────────────────────────────────

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

const UI_SOUNDS: Record<string, string> = {
  tap: `${BASE_PATH}/audio/ui/tap.mp3`,
  tapConfirm: `${BASE_PATH}/audio/ui/tap.mp3`,
  success: `${BASE_PATH}/audio/ui/success.mp3`,
  successBig: `${BASE_PATH}/audio/ui/celebrate.mp3`,
  complete: `${BASE_PATH}/audio/ui/complete.mp3`,
  levelUp: `${BASE_PATH}/audio/ui/level-up.mp3`,
  streak: `${BASE_PATH}/audio/ui/streak.mp3`,
  bell: `${BASE_PATH}/audio/ui/bell.mp3`,
  chime: `${BASE_PATH}/audio/ui/chime.mp3`,
  whoosh: `${BASE_PATH}/audio/ui/whoosh.mp3`,
  whooshOut: `${BASE_PATH}/audio/ui/whoosh.mp3`,
  pop: `${BASE_PATH}/audio/ui/pop.mp3`,
  celebrate: `${BASE_PATH}/audio/ui/celebrate.mp3`,
  unlock: `${BASE_PATH}/audio/ui/streak.mp3`,
  notification: `${BASE_PATH}/audio/ui/bell.mp3`,
  reveal: `${BASE_PATH}/audio/ui/chime.mp3`,
  keystroke: `${BASE_PATH}/audio/ui/tap.mp3`, // Use soft tap sound instead of harsh keystroke
  error: `${BASE_PATH}/audio/ui/pop.mp3`,
  gong: `${BASE_PATH}/audio/ui/bell.mp3`,
  singingBowl: `${BASE_PATH}/audio/ui/bell.mp3`,
};

// Scene/Music tracks - ALL use existing writing folder files for FAST loading
const SCENE_MUSIC: Record<string, { path: string; randomStart: boolean; duration?: number }> = {
  // Use existing rain.mp3 and forest.mp3 for fast loading (they're already loaded for ambience)
  lessonCalm: { path: `${BASE_PATH}/audio/writing/rain.mp3`, randomStart: false },
  reflection: { path: `${BASE_PATH}/audio/writing/rain.mp3`, randomStart: false },
  onboarding: { path: `${BASE_PATH}/audio/writing/forest.mp3`, randomStart: false },
  reward: { path: `${BASE_PATH}/audio/writing/forest.mp3`, randomStart: false },
  home: { path: `${BASE_PATH}/audio/writing/rain.mp3`, randomStart: false },
  // Longer tracks for specific steps
  lessonDeep: { path: `${BASE_PATH}/audio/writing/lessonDeep.mp3`, randomStart: true, duration: 6600 },
  visualization: { path: `${BASE_PATH}/audio/writing/visualization.mp3`, randomStart: true, duration: 7200 },
};

// Writing ambience tracks
const WRITING_AMBIENCE: Record<string, { path: string; randomStart: boolean; duration?: number }> = {
  rain: { path: `${BASE_PATH}/audio/writing/rain.mp3`, randomStart: false }, // Shorter, no random start
  forest: { path: `${BASE_PATH}/audio/writing/forest.mp3`, randomStart: true, duration: 1350 }, // ~22 min
  fire: { path: `${BASE_PATH}/audio/writing/rain.mp3`, randomStart: false }, // Fallback to rain
};

// ─────────────────────────────────────────────────────────────────────────────
// PRE-LOADED UI SOUNDS (for instant playback)
// ─────────────────────────────────────────────────────────────────────────────

const uiSoundCache: Map<string, Howl> = new Map();

function preloadUISounds(): void {
  // Get unique paths to avoid loading same file multiple times
  const uniquePaths = new Map<string, string[]>();
  Object.entries(UI_SOUNDS).forEach(([name, path]) => {
    if (!uniquePaths.has(path)) {
      uniquePaths.set(path, []);
    }
    uniquePaths.get(path)!.push(name);
  });

  uniquePaths.forEach((names, path) => {
    const howl = new Howl({
      src: [path],
      volume: settings.uiVolume * settings.masterVolume,
      preload: true,
      pool: 3, // Allow 3 simultaneous plays of same sound
      onloaderror: (id, error) => {
        console.error(`[AudioEngine] ❌ Failed to load: ${path}`, error);
      },
      onload: () => {
        console.log(`[AudioEngine] ✅ Loaded: ${names[0]}`);
      }
    });
    // Cache for all names that use this path
    names.forEach(name => uiSoundCache.set(name, howl));
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBOUNCE - Prevent double-plays from React StrictMode / re-renders
// ─────────────────────────────────────────────────────────────────────────────

const lastPlayedTime: Map<string, number> = new Map();
const DEBOUNCE_MS = 200; // Ignore duplicate plays within 200ms

function shouldPlay(sound: string): boolean {
  const now = Date.now();
  const lastPlayed = lastPlayedTime.get(sound) || 0;
  if (now - lastPlayed < DEBOUNCE_MS) {
    return false; // Skip - played too recently
  }
  lastPlayedTime.set(sound, now);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE AUDIO SOURCES
// ─────────────────────────────────────────────────────────────────────────────

let activeMusicHowl: Howl | null = null;
let activeMusicId: number | null = null;
let activeAmbienceHowl: Howl | null = null;
let activeAmbienceId: number | null = null;
let currentMusicType: string | null = null;
let currentAmbienceType: string | null = null;

// Pending stop timeouts - allows cancellation when React StrictMode remounts
let pendingMusicStop: ReturnType<typeof setTimeout> | null = null;
let pendingAmbienceStop: ReturnType<typeof setTimeout> | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

// Track if audio has been unlocked by user interaction
let isAudioUnlocked = false;

function unlockAudio(): void {
  if (isAudioUnlocked) return;

  // Resume audio context
  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    Howler.ctx.resume().then(() => {
      console.log('[AudioEngine] 🔓 Audio context resumed');
    }).catch((e) => {
      console.warn('[AudioEngine] Failed to resume audio context:', e);
    });
  }

  // Play a silent sound to unlock on iOS
  const silentSound = new Howl({
    src: ['data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'],
    volume: 0,
    onend: () => {
      console.log('[AudioEngine] 🔓 Audio unlocked via silent sound');
      isAudioUnlocked = true;
    }
  });
  silentSound.play();

  isAudioUnlocked = true;
}

export function initAudioEngine(): void {
  if (isInitialized) return;

  // Set global volume
  Howler.volume(settings.masterVolume);

  // Preload UI sounds for instant playback
  preloadUISounds();

  // Set up global unlock on first user interaction
  const handleFirstInteraction = () => {
    unlockAudio();
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
    document.removeEventListener('touchend', handleFirstInteraction);
    document.removeEventListener('keydown', handleFirstInteraction);
  };

  document.addEventListener('click', handleFirstInteraction, { once: true });
  document.addEventListener('touchstart', handleFirstInteraction, { once: true });
  document.addEventListener('touchend', handleFirstInteraction, { once: true });
  document.addEventListener('keydown', handleFirstInteraction, { once: true });

  isInitialized = true;
  console.log(`[AudioEngine] 🔊 Initialized with real MP3 files (Howler.js) - Base Path: '${BASE_PATH}'`);
  console.log('[AudioEngine] 🔍 Checking UI sounds:', Object.keys(UI_SOUNDS).length);
}

export function ensureInitialized(): boolean {
  if (!isInitialized) {
    try {
      initAudioEngine();
      return true;
    } catch (e) {
      console.warn('[AudioEngine] Failed to initialize:', e);
      return false;
    }
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export function updateSettings(newSettings: Partial<AudioSettings>): void {
  settings = { ...settings, ...newSettings };

  // Update global volume
  Howler.volume(settings.masterVolume);

  // Update cached UI sounds
  uiSoundCache.forEach((howl) => {
    howl.volume(settings.uiVolume * settings.masterVolume);
  });

  // Update active music
  if (activeMusicHowl && activeMusicId !== null) {
    activeMusicHowl.volume(settings.musicVolume * settings.masterVolume, activeMusicId);
  }

  // Update active ambience
  if (activeAmbienceHowl && activeAmbienceId !== null) {
    activeAmbienceHowl.volume(settings.ambienceVolume * settings.masterVolume, activeAmbienceId);
  }
}

export function getSettings(): AudioSettings {
  return { ...settings };
}

// ─────────────────────────────────────────────────────────────────────────────
// UI SOUNDS - One-shot playback with debouncing
// ─────────────────────────────────────────────────────────────────────────────

export function playUI(sound: UISound): void {
  if (!ensureInitialized()) return;

  // Debounce check - skip if played too recently (prevents React StrictMode double-plays)
  if (!shouldPlay(sound)) {
    return;
  }

  // Ensure audio is unlocked (critical for iOS)
  resumeAudio();

  const cachedSound = uiSoundCache.get(sound);
  if (cachedSound) {
    cachedSound.volume(settings.uiVolume * settings.masterVolume);
    cachedSound.play();
  } else {
    // Fallback: load and play
    const path = UI_SOUNDS[sound];
    if (path) {
      const howl = new Howl({
        src: [path],
        volume: settings.uiVolume * settings.masterVolume,
      });
      howl.play();
    }
  }
}

// Convenience exports for direct access
export const playTap = () => playUI('tap');
export const playSuccess = (volume?: number) => {
  const cached = uiSoundCache.get('success');
  if (cached) {
    cached.volume((volume || settings.uiVolume) * settings.masterVolume);
    cached.play();
  } else {
    playUI('success');
  }
};
export const playComplete = () => playUI('complete');
export const playLevelUp = () => playUI('levelUp');
export const playUnlock = () => playUI('unlock');
export const playReveal = () => playUI('reveal');
export const playChime = (pitch?: 'low' | 'medium' | 'high') => playUI('chime');
export const playTransition = () => playUI('whoosh');
export const playCelebration = (volume?: number) => {
  const cached = uiSoundCache.get('celebrate');
  if (cached) {
    cached.volume((volume || settings.uiVolume) * settings.masterVolume);
    cached.play();
  } else {
    playUI('celebrate');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENE MUSIC - Looping background with optional random start
// ─────────────────────────────────────────────────────────────────────────────

export function startAmbientMusic(type: AmbientSound, fadeInDuration: number = 3): void {
  if (!ensureInitialized()) return;

  // Resume audio context if suspended (critical for iOS)
  resumeAudio();

  // Cancel any pending stop - React StrictMode protection
  if (pendingMusicStop) {
    clearTimeout(pendingMusicStop);
    pendingMusicStop = null;
  }

  // Skip if already playing this exact type
  if (currentMusicType === type && activeMusicHowl && activeMusicId !== null) {
    // Resume if it was fading out
    activeMusicHowl.fade(activeMusicHowl.volume() as number, settings.musicVolume * settings.masterVolume, 500, activeMusicId);
    return;
  }

  // Stop current music immediately if switching tracks (no crossfade delay)
  if (activeMusicHowl && activeMusicId !== null) {
    const oldHowl = activeMusicHowl;
    const oldId = activeMusicId;
    oldHowl.fade(oldHowl.volume(oldId) as number, 0, fadeInDuration * 500, oldId);
    setTimeout(() => {
      oldHowl.stop(oldId);
      oldHowl.unload();
    }, fadeInDuration * 500);
  }

  const config = SCENE_MUSIC[type];
  if (!config) {
    console.warn(`[AudioEngine] Unknown scene type: ${type}`);
    return;
  }

  currentMusicType = type;

  // Calculate random start position BEFORE creating howl
  const randomStartPosition = (config.randomStart && config.duration)
    ? Math.random() * (config.duration * 0.8)
    : 0;

  console.log(`[AudioEngine] 🎵 Loading scene music: ${type} from ${config.path}`);

  const howl = new Howl({
    src: [config.path],
    volume: 0,
    loop: true,
    preload: true,
    onload: function () {
      console.log(`[AudioEngine] ✅ Scene music loaded: ${type}`);
      // Seek to random position BEFORE playing (not after)
      if (randomStartPosition > 0) {
        howl.seek(randomStartPosition);
        console.log(`[AudioEngine] Starting ${type} at ${Math.floor(randomStartPosition)}s`);
      }
      // Now start playing from the correct position
      activeMusicId = howl.play();
      // Fade in
      howl.fade(0, settings.musicVolume * settings.masterVolume, fadeInDuration * 1000, activeMusicId);
    },
    onloaderror: (id, error) => {
      console.error(`[AudioEngine] ❌ Failed to load scene music: ${type} (${config.path})`, error);
      currentMusicType = null;
    },
    onplayerror: (id, error) => {
      console.error(`[AudioEngine] ❌ Failed to play scene music: ${type}`, error);
      // Try to unlock and replay (iOS requirement)
      howl.once('unlock', () => {
        console.log(`[AudioEngine] 🔓 Audio unlocked, retrying scene music...`);
        activeMusicId = howl.play();
        howl.fade(0, settings.musicVolume * settings.masterVolume, fadeInDuration * 1000, activeMusicId);
      });
    },
  });

  activeMusicHowl = howl;
  // Don't play here - wait for onload to seek first
}

export function stopAmbientMusic(fadeOutDuration: number = 2, immediate: boolean = false): void {
  // Cancel any existing pending stop
  if (pendingMusicStop) {
    clearTimeout(pendingMusicStop);
    pendingMusicStop = null;
  }

  if (!activeMusicHowl || activeMusicId === null) return;

  const howl = activeMusicHowl;
  const id = activeMusicId;

  // Clear state immediately to prevent new audio from seeing old state
  activeMusicHowl = null;
  activeMusicId = null;
  currentMusicType = null;

  if (immediate) {
    // Stop immediately without fade
    howl.stop(id);
    howl.unload();
  } else {
    // Use a small delay before stopping - allows React StrictMode remount to cancel
    pendingMusicStop = setTimeout(() => {
      pendingMusicStop = null;
      // Fade out and stop
      howl.fade(howl.volume(id) as number, 0, fadeOutDuration * 1000, id);
      setTimeout(() => {
        howl.stop(id);
        howl.unload();
      }, fadeOutDuration * 1000);
    }, 50); // 50ms delay
  }
}

// Alias for useAudio hook compatibility
export const startSceneMusic = startAmbientMusic;
export const stopSceneMusic = stopAmbientMusic;

// ─────────────────────────────────────────────────────────────────────────────
// WRITING AMBIENCE - Rain for reflection, Forest for commitment
// ─────────────────────────────────────────────────────────────────────────────

export function startWritingAmbience(type?: WritingAmbience): void {
  if (!ensureInitialized()) return;

  // Resume audio context if suspended (critical for iOS)
  resumeAudio();

  // Cancel any pending stop - React StrictMode protection
  if (pendingAmbienceStop) {
    clearTimeout(pendingAmbienceStop);
    pendingAmbienceStop = null;
  }

  const ambienceType = type || settings.writingAmbienceType;
  if (ambienceType === 'silence') {
    stopWritingAmbience();
    return;
  }

  // Skip if already playing this exact type
  if (currentAmbienceType === ambienceType && activeAmbienceHowl && activeAmbienceId !== null) {
    // Resume if it was fading out
    activeAmbienceHowl.fade(activeAmbienceHowl.volume() as number, settings.ambienceVolume * settings.masterVolume, 500, activeAmbienceId);
    return;
  }

  // Stop current ambience immediately if switching
  if (activeAmbienceHowl && activeAmbienceId !== null) {
    const oldHowl = activeAmbienceHowl;
    const oldId = activeAmbienceId;
    oldHowl.fade(oldHowl.volume(oldId) as number, 0, 500, oldId);
    setTimeout(() => {
      oldHowl.stop(oldId);
      oldHowl.unload();
    }, 500);
  }

  const config = WRITING_AMBIENCE[ambienceType];
  if (!config) {
    console.warn(`[AudioEngine] Unknown ambience type: ${ambienceType}`);
    return;
  }

  currentAmbienceType = ambienceType;

  // Calculate random start position BEFORE creating howl
  const randomStartPosition = (config.randomStart && config.duration)
    ? Math.random() * (config.duration * 0.8)
    : 0;

  console.log(`[AudioEngine] 🎵 Loading ambience: ${ambienceType} from ${config.path}`);

  const howl = new Howl({
    src: [config.path],
    volume: 0,
    loop: true,
    preload: true,
    onload: function () {
      console.log(`[AudioEngine] ✅ Ambience loaded: ${ambienceType}`);
      // Seek to random position BEFORE playing (not after)
      if (randomStartPosition > 0) {
        howl.seek(randomStartPosition);
        console.log(`[AudioEngine] Starting ${ambienceType} ambient at ${Math.floor(randomStartPosition)}s`);
      }
      // Now start playing from the correct position
      activeAmbienceId = howl.play();
      // Fade in over 2 seconds
      howl.fade(0, settings.ambienceVolume * settings.masterVolume, 2000, activeAmbienceId);
    },
    onloaderror: (id, error) => {
      console.error(`[AudioEngine] ❌ Failed to load ambience: ${ambienceType} (${config.path})`, error);
      currentAmbienceType = null;
    },
    onplayerror: (id, error) => {
      console.error(`[AudioEngine] ❌ Failed to play ambience: ${ambienceType}`, error);
      // Try to unlock and replay (iOS requirement)
      howl.once('unlock', () => {
        console.log(`[AudioEngine] 🔓 Audio unlocked, retrying ambience...`);
        activeAmbienceId = howl.play();
        howl.fade(0, settings.ambienceVolume * settings.masterVolume, 2000, activeAmbienceId);
      });
    },
  });

  activeAmbienceHowl = howl;
  // Don't play here - wait for onload to seek first
}

export function stopWritingAmbience(immediate: boolean = false): void {
  // Cancel any existing pending stop
  if (pendingAmbienceStop) {
    clearTimeout(pendingAmbienceStop);
    pendingAmbienceStop = null;
  }

  if (!activeAmbienceHowl || activeAmbienceId === null) return;

  const howl = activeAmbienceHowl;
  const id = activeAmbienceId;

  // Clear state immediately to prevent new audio from seeing old state
  activeAmbienceHowl = null;
  activeAmbienceId = null;
  currentAmbienceType = null;

  if (immediate) {
    // Stop immediately without fade
    howl.stop(id);
    howl.unload();
  } else {
    // Use a small delay before stopping - allows React StrictMode remount to cancel
    pendingAmbienceStop = setTimeout(() => {
      pendingAmbienceStop = null;
      // Fade out over 1 second
      howl.fade(howl.volume(id) as number, 0, 1000, id);
      setTimeout(() => {
        howl.stop(id);
        howl.unload();
      }, 1000);
    }, 50); // 50ms delay
  }
}

// Stop all audio immediately (for switching tracks)
export function stopAllAudio(): void {
  stopAmbientMusic(0, true);
  stopWritingAmbience(true);
}

// Aliases for compatibility
export const startAmbience = startWritingAmbience;
export const stopAmbience = stopWritingAmbience;

// ─────────────────────────────────────────────────────────────────────────────
// MEDITATION SOUNDS - Singing bowl and gong
// ─────────────────────────────────────────────────────────────────────────────

export function playSingingBowl(
  bowl: 'small' | 'medium' | 'large' = 'medium',
  intensity: number = 0.6,
  duration: number = 8
): void {
  if (!ensureInitialized()) return;
  playUI('bell'); // Use bell as singing bowl
}

export function playGong(): void {
  if (!ensureInitialized()) return;
  playUI('bell'); // Use bell as gong
}

// ─────────────────────────────────────────────────────────────────────────────
// BREATHING GUIDE
// ─────────────────────────────────────────────────────────────────────────────

let breathingActive = false;

export function startBreathingGuide(): void {
  breathingActive = true;
}

export function updateBreathPhase(phase: 'inhale' | 'exhale' | 'hold', durationMs: number): void {
  // Could play subtle tones here if needed
}

export function stopBreathingGuide(): void {
  breathingActive = false;
}

export function playBreathingTone(
  phase: 'inhale' | 'exhale' | 'hold',
  duration: number
): void {
  // Optional: play subtle breathing tones
}

// ─────────────────────────────────────────────────────────────────────────────
// XP COUNTING SOUNDS
// ─────────────────────────────────────────────────────────────────────────────

export function playXpCounting(totalXp: number, duration: number = 1.5): void {
  if (!ensureInitialized()) return;

  const ticks = Math.min(totalXp, 20);
  const interval = (duration * 1000) / ticks;

  for (let i = 0; i < ticks; i++) {
    setTimeout(() => {
      playUI('tap');
    }, i * interval);
  }

  // Final success sound
  setTimeout(() => {
    playUI('success');
  }, duration * 1000);
}

// ─────────────────────────────────────────────────────────────────────────────
// HAPTIC FEEDBACK
// ─────────────────────────────────────────────────────────────────────────────

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
  breathing: [100],
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPE EXPORTS FOR HOOKS
// ─────────────────────────────────────────────────────────────────────────────

export type BowlType = 'small' | 'medium' | 'large';
export type SceneType = AmbientSound;
export type AmbienceType = WritingAmbience | 'silence';
export type BreathPhase = 'inhale' | 'exhale' | 'hold';

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO READY CHECK
// ─────────────────────────────────────────────────────────────────────────────

export function isAudioReady(): boolean {
  return isInitialized;
}

export function resumeAudio(): void {
  // Always try to unlock audio
  unlockAudio();

  // Also explicitly resume context
  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    Howler.ctx.resume().then(() => {
      console.log('[AudioEngine] 🔓 Audio context resumed via resumeAudio');
    }).catch(() => {
      // Silently fail - might not have user interaction yet
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLEANUP
// ─────────────────────────────────────────────────────────────────────────────

export function cleanup(): void {
  // Cancel any pending stops
  if (pendingMusicStop) {
    clearTimeout(pendingMusicStop);
    pendingMusicStop = null;
  }
  if (pendingAmbienceStop) {
    clearTimeout(pendingAmbienceStop);
    pendingAmbienceStop = null;
  }

  // Stop immediately
  if (activeMusicHowl) {
    activeMusicHowl.stop();
    activeMusicHowl.unload();
    activeMusicHowl = null;
    activeMusicId = null;
    currentMusicType = null;
  }
  if (activeAmbienceHowl) {
    activeAmbienceHowl.stop();
    activeAmbienceHowl.unload();
    activeAmbienceHowl = null;
    activeAmbienceId = null;
    currentAmbienceType = null;
  }

  // Unload all cached sounds
  uiSoundCache.forEach((howl) => {
    howl.unload();
  });
  uiSoundCache.clear();

  isInitialized = false;
}

export default {
  initAudioEngine,
  playUI,
  startAmbientMusic,
  stopAmbientMusic,
  startWritingAmbience,
  stopWritingAmbience,
  playSingingBowl,
  playGong,
  playBreathingTone,
  playXpCounting,
  playHaptic,
  updateSettings,
  getSettings,
  cleanup,
};
