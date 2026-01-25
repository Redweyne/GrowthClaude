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

// Scene/Music tracks (longer ambient music)
const SCENE_MUSIC: Record<string, { path: string; randomStart: boolean; duration?: number }> = {
  // lessonDeep is for Timer step
  lessonDeep: { path: `${BASE_PATH}/audio/writing/lessonDeep.mp3`, randomStart: true, duration: 6600 }, // ~110 min
  // visualization is for Visualization step
  visualization: { path: `${BASE_PATH}/audio/writing/visualization.mp3`, randomStart: true, duration: 7200 }, // ~2 hours
  // Other scene types map to ambient folder
  lessonCalm: { path: `${BASE_PATH}/audio/ambient/calm.mp3`, randomStart: false },
  reflection: { path: `${BASE_PATH}/audio/ambient/reflection.mp3`, randomStart: false },
  onboarding: { path: `${BASE_PATH}/audio/ambient/calm.mp3`, randomStart: false },
  reward: { path: `${BASE_PATH}/audio/ambient/focus.mp3`, randomStart: false },
  home: { path: `${BASE_PATH}/audio/ambient/calm.mp3`, randomStart: false },
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
  Object.entries(UI_SOUNDS).forEach(([name, path]) => {
    if (!uiSoundCache.has(name)) {
      const howl = new Howl({
        src: [path],
        volume: settings.uiVolume * settings.masterVolume,
        preload: true,
        html5: false, // Use Web Audio for low latency
        onloaderror: (id, error) => {
          console.error(`[AudioEngine] ❌ Failed to load UI sound: ${name} (${path})`, error);
        },
        onload: () => {
          console.log(`[AudioEngine] ✅ Loaded UI sound: ${name}`);
        }
      });
      uiSoundCache.set(name, howl);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBOUNCE - Prevent double-plays from React StrictMode / re-renders
// ─────────────────────────────────────────────────────────────────────────────

const lastPlayedTime: Map<string, number> = new Map();
const DEBOUNCE_MS = 100; // Ignore duplicate plays within 100ms

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

export function initAudioEngine(): void {
  if (isInitialized) return;

  // Set global volume
  Howler.volume(settings.masterVolume);

  // Preload UI sounds for instant playback
  preloadUISounds();

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

  const howl = new Howl({
    src: [config.path],
    volume: 0,
    loop: true,
    html5: true, // Use HTML5 for long audio
    onload: function () {
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
  });

  activeMusicHowl = howl;
  // Don't play here - wait for onload to seek first
}

export function stopAmbientMusic(fadeOutDuration: number = 2): void {
  // Cancel any existing pending stop
  if (pendingMusicStop) {
    clearTimeout(pendingMusicStop);
    pendingMusicStop = null;
  }

  if (!activeMusicHowl || activeMusicId === null) return;

  const howl = activeMusicHowl;
  const id = activeMusicId;

  // Use a small delay before stopping - allows React StrictMode remount to cancel
  pendingMusicStop = setTimeout(() => {
    pendingMusicStop = null;

    // Double-check we still want to stop this specific howl
    if (activeMusicHowl !== howl) return;

    // Clear state
    activeMusicHowl = null;
    activeMusicId = null;
    currentMusicType = null;

    // Fade out and stop
    howl.fade(howl.volume(id) as number, 0, fadeOutDuration * 1000, id);

    setTimeout(() => {
      howl.stop(id);
      howl.unload();
    }, fadeOutDuration * 1000);
  }, 50); // 50ms delay - enough for React StrictMode but imperceptible
}

// Alias for useAudio hook compatibility
export const startSceneMusic = startAmbientMusic;
export const stopSceneMusic = stopAmbientMusic;

// ─────────────────────────────────────────────────────────────────────────────
// WRITING AMBIENCE - Rain for reflection, Forest for commitment
// ─────────────────────────────────────────────────────────────────────────────

export function startWritingAmbience(type?: WritingAmbience): void {
  if (!ensureInitialized()) return;

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

  const howl = new Howl({
    src: [config.path],
    volume: 0,
    loop: true,
    html5: true,
    onload: function () {
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
  });

  activeAmbienceHowl = howl;
  // Don't play here - wait for onload to seek first
}

export function stopWritingAmbience(): void {
  // Cancel any existing pending stop
  if (pendingAmbienceStop) {
    clearTimeout(pendingAmbienceStop);
    pendingAmbienceStop = null;
  }

  if (!activeAmbienceHowl || activeAmbienceId === null) return;

  const howl = activeAmbienceHowl;
  const id = activeAmbienceId;

  // Use a small delay before stopping - allows React StrictMode remount to cancel
  pendingAmbienceStop = setTimeout(() => {
    pendingAmbienceStop = null;

    // Double-check we still want to stop this specific howl
    if (activeAmbienceHowl !== howl) return;

    // Clear state
    activeAmbienceHowl = null;
    activeAmbienceId = null;
    currentAmbienceType = null;

    // Fade out over 1 second
    howl.fade(howl.volume(id) as number, 0, 1000, id);

    setTimeout(() => {
      howl.stop(id);
      howl.unload();
    }, 1000);
  }, 50); // 50ms delay - enough for React StrictMode but imperceptible
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
  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    Howler.ctx.resume();
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
