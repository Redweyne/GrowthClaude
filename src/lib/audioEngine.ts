'use client';

// ============================================================================
// AUDIO ENGINE v2.0 - Consolidated Audio System with iOS Safari Support
// ============================================================================
//
// This is the SINGLE SOURCE OF TRUTH for all audio in the app.
// All audio playback, state management, and iOS handling goes through here.
//
// Key features:
// - Proper iOS Safari unlock sequence (waits for callback)
// - Singleton pattern with observable state
// - Debug logging via localStorage.setItem('AUDIO_DEBUG', 'true')
// - Automatic retry on audio failures
// - Proper cleanup with minimum 300ms delays for iOS
//
// ============================================================================

import { Howl, Howler, HowlOptions } from 'howler';

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG LOGGING
// ─────────────────────────────────────────────────────────────────────────────

function isDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('AUDIO_DEBUG') === 'true';
}

function log(message: string, ...args: unknown[]): void {
  if (isDebugEnabled()) {
    console.log(`[AudioEngine] ${message}`, ...args);
  }
}

function logWarn(message: string, ...args: unknown[]): void {
  if (isDebugEnabled()) {
    console.warn(`[AudioEngine] ⚠️ ${message}`, ...args);
  }
}

function logError(message: string, ...args: unknown[]): void {
  // Always log errors
  console.error(`[AudioEngine] ❌ ${message}`, ...args);
}

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

export interface AudioEngineState {
  isInitialized: boolean;
  isUnlocked: boolean;
  isUnlocking: boolean;
  currentMusicTrack: string | null;
  currentAmbienceTrack: string | null;
  isMusicPlaying: boolean;
  isAmbiencePlaying: boolean;
  settings: AudioSettings;
  lastError: string | null;
}

// State change listeners
type StateListener = (state: AudioEngineState) => void;
const stateListeners: Set<StateListener> = new Set();

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

const defaultSettings: AudioSettings = {
  masterVolume: 0.7,
  musicVolume: 0.5,
  uiVolume: 0.8,
  ambienceVolume: 0.4,
  breathingEnabled: true,
  writingAmbienceType: 'rain',
};

// ─────────────────────────────────────────────────────────────────────────────
// SINGLETON STATE
// ─────────────────────────────────────────────────────────────────────────────

const engineState: AudioEngineState = {
  isInitialized: false,
  isUnlocked: false,
  isUnlocking: false,
  currentMusicTrack: null,
  currentAmbienceTrack: null,
  isMusicPlaying: false,
  isAmbiencePlaying: false,
  settings: { ...defaultSettings },
  lastError: null,
};

// Notify all listeners of state change
function notifyStateChange(): void {
  const stateCopy = { ...engineState, settings: { ...engineState.settings } };
  stateListeners.forEach(listener => {
    try {
      listener(stateCopy);
    } catch (e) {
      logError('State listener error:', e);
    }
  });
}

// Subscribe to state changes
export function subscribeToState(listener: StateListener): () => void {
  stateListeners.add(listener);
  // Immediately call with current state
  listener({ ...engineState, settings: { ...engineState.settings } });
  return () => stateListeners.delete(listener);
}

// Get current state (immutable copy)
export function getState(): AudioEngineState {
  return { ...engineState, settings: { ...engineState.settings } };
}

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
  keystroke: `${BASE_PATH}/audio/ui/tap.mp3`,
  error: `${BASE_PATH}/audio/ui/pop.mp3`,
  gong: `${BASE_PATH}/audio/ui/bell.mp3`,
  singingBowl: `${BASE_PATH}/audio/ui/bell.mp3`,
};

const SCENE_MUSIC: Record<string, { path: string; randomStart: boolean; duration?: number }> = {
  lessonCalm: { path: `${BASE_PATH}/audio/writing/rain.mp3`, randomStart: false },
  reflection: { path: `${BASE_PATH}/audio/writing/rain.mp3`, randomStart: false },
  onboarding: { path: `${BASE_PATH}/audio/writing/forest.mp3`, randomStart: false },
  reward: { path: `${BASE_PATH}/audio/writing/forest.mp3`, randomStart: false },
  home: { path: `${BASE_PATH}/audio/writing/rain.mp3`, randomStart: false },
  lessonDeep: { path: `${BASE_PATH}/audio/writing/lessonDeep.mp3`, randomStart: true, duration: 6600 },
  visualization: { path: `${BASE_PATH}/audio/writing/visualization.mp3`, randomStart: true, duration: 7200 },
};

const WRITING_AMBIENCE: Record<string, { path: string; randomStart: boolean; duration?: number }> = {
  rain: { path: `${BASE_PATH}/audio/writing/rain.mp3`, randomStart: false },
  forest: { path: `${BASE_PATH}/audio/writing/forest.mp3`, randomStart: true, duration: 1350 },
  fire: { path: `${BASE_PATH}/audio/writing/rain.mp3`, randomStart: false },
};

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO CACHES & ACTIVE SOURCES
// ─────────────────────────────────────────────────────────────────────────────

const uiSoundCache: Map<string, Howl> = new Map();
let activeMusicHowl: Howl | null = null;
let activeMusicId: number | null = null;
let activeAmbienceHowl: Howl | null = null;
let activeAmbienceId: number | null = null;

// Pending operations (for cleanup)
let pendingMusicStop: ReturnType<typeof setTimeout> | null = null;
let pendingAmbienceStop: ReturnType<typeof setTimeout> | null = null;

// Retry queue for failed audio
const retryQueue: Array<() => void> = [];

// ─────────────────────────────────────────────────────────────────────────────
// DEBOUNCE - Prevent double-plays
// ─────────────────────────────────────────────────────────────────────────────

const lastPlayedTime: Map<string, number> = new Map();
const DEBOUNCE_MS = 150;

function shouldPlay(sound: string): boolean {
  const now = Date.now();
  const lastPlayed = lastPlayedTime.get(sound) || 0;
  if (now - lastPlayed < DEBOUNCE_MS) {
    log(`Debounced: ${sound} (played ${now - lastPlayed}ms ago)`);
    return false;
  }
  lastPlayedTime.set(sound, now);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// iOS AUDIO UNLOCK - The critical fix
// ─────────────────────────────────────────────────────────────────────────────

let unlockPromise: Promise<boolean> | null = null;
let lastUnlockAttempt = 0;
const UNLOCK_THROTTLE_MS = 1000; // Minimum time between unlock attempts

async function unlockAudioAsync(): Promise<boolean> {
  // Already unlocked
  if (engineState.isUnlocked) {
    log('Already unlocked');
    return true;
  }

  // CRITICAL FIX: Don't try to unlock if audio is already playing
  // This can cause iOS Safari to crash when creating new Howl instances
  // while other audio is active
  if (engineState.isMusicPlaying || engineState.isAmbiencePlaying) {
    log('Audio is playing, skipping unlock to prevent iOS conflicts');
    // Just try to resume the context without creating new Howl instances
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      try {
        await Howler.ctx.resume();
        log('✓ Audio context resumed while audio was playing');
      } catch (e) {
        logWarn('Failed to resume context while audio playing:', e);
      }
    }
    return true;
  }

  // Throttle unlock attempts to prevent rapid-fire calls on iOS
  const now = Date.now();
  if (now - lastUnlockAttempt < UNLOCK_THROTTLE_MS) {
    log(`Throttled unlock attempt (${now - lastUnlockAttempt}ms since last)`);
    return engineState.isUnlocked;
  }
  lastUnlockAttempt = now;

  // Already unlocking - wait for that to complete
  if (unlockPromise) {
    log('Unlock in progress, waiting...');
    return unlockPromise;
  }

  log('🔓 Starting audio unlock sequence...');
  engineState.isUnlocking = true;
  notifyStateChange();

  unlockPromise = new Promise<boolean>((resolve) => {
    // Step 1: Resume audio context
    const resumeContext = async () => {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        try {
          await Howler.ctx.resume();
          log('✓ Audio context resumed');
        } catch (e) {
          logWarn('Failed to resume context:', e);
        }
      }
    };

    // Step 2: Play silent sound and WAIT for it to complete
    const playSilentSound = () => {
      return new Promise<boolean>((resolveSound) => {
        const silentSound = new Howl({
          src: ['data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'],
          volume: 0.001, // Tiny volume, not 0 (iOS ignores 0 volume)
          onend: () => {
            log('✓ Silent sound completed - audio UNLOCKED');
            resolveSound(true);
          },
          onplayerror: () => {
            logWarn('Silent sound play error');
            resolveSound(false);
          },
          onloaderror: () => {
            logWarn('Silent sound load error');
            resolveSound(false);
          },
        });

        const playId = silentSound.play();
        if (playId === null || playId === undefined) {
          logWarn('Silent sound failed to start');
          resolveSound(false);
        }

        // Timeout fallback (iOS might not fire onend)
        setTimeout(() => {
          resolveSound(true);
        }, 500);
      });
    };

    // Execute unlock sequence
    resumeContext().then(() => {
      playSilentSound().then((success) => {
        engineState.isUnlocked = success;
        engineState.isUnlocking = false;
        unlockPromise = null;
        notifyStateChange();

        if (success) {
          log('🔓 Audio unlock complete!');
          // Process any queued retries
          while (retryQueue.length > 0) {
            const retry = retryQueue.shift();
            if (retry) {
              log('Processing retry from queue');
              setTimeout(retry, 50);
            }
          }
        } else {
          logWarn('Audio unlock failed - will retry on next interaction');
        }

        resolve(success);
      });
    });
  });

  return unlockPromise;
}

// Synchronous unlock attempt (for event handlers)
export function tryUnlock(): void {
  unlockAudioAsync().catch((e) => {
    // Log the error in debug mode instead of silently ignoring
    logWarn('Unlock attempt failed:', e);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

let eventListenersAdded = false;

function handleUserInteraction(): void {
  log('User interaction detected');
  tryUnlock();
}

export function initAudioEngine(): void {
  if (engineState.isInitialized) {
    log('Already initialized');
    return;
  }

  log('🔊 Initializing Audio Engine v2.0...');

  // Set global volume
  Howler.volume(engineState.settings.masterVolume);

  // Preload UI sounds
  preloadUISounds();

  // Add event listeners ONCE (not in every hook!)
  if (!eventListenersAdded && typeof document !== 'undefined') {
    const events = ['click', 'touchstart', 'touchend', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { passive: true });
    });
    eventListenersAdded = true;
    log('Event listeners added');
  }

  engineState.isInitialized = true;
  notifyStateChange();

  log('✓ Audio Engine initialized', {
    basePath: BASE_PATH,
    uiSounds: Object.keys(UI_SOUNDS).length,
    musicTracks: Object.keys(SCENE_MUSIC).length,
  });
}

function preloadUISounds(): void {
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
      volume: engineState.settings.uiVolume * engineState.settings.masterVolume,
      preload: true,
      pool: 3,
      onloaderror: (id, error) => {
        logError(`Failed to preload: ${path}`, error);
      },
      onload: () => {
        log(`✓ Preloaded: ${names[0]}`);
      },
    });
    names.forEach(name => uiSoundCache.set(name, howl));
  });
}

export function ensureInitialized(): boolean {
  if (!engineState.isInitialized) {
    try {
      initAudioEngine();
      return true;
    } catch (e) {
      logError('Failed to initialize:', e);
      return false;
    }
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export function updateSettings(newSettings: Partial<AudioSettings>): void {
  engineState.settings = { ...engineState.settings, ...newSettings };

  // Update global volume
  Howler.volume(engineState.settings.masterVolume);

  // Update cached UI sounds
  uiSoundCache.forEach((howl) => {
    howl.volume(engineState.settings.uiVolume * engineState.settings.masterVolume);
  });

  // Update active music
  if (activeMusicHowl && activeMusicId !== null) {
    activeMusicHowl.volume(
      engineState.settings.musicVolume * engineState.settings.masterVolume,
      activeMusicId
    );
  }

  // Update active ambience
  if (activeAmbienceHowl && activeAmbienceId !== null) {
    activeAmbienceHowl.volume(
      engineState.settings.ambienceVolume * engineState.settings.masterVolume,
      activeAmbienceId
    );
  }

  notifyStateChange();
}

export function getSettings(): AudioSettings {
  return { ...engineState.settings };
}

// ─────────────────────────────────────────────────────────────────────────────
// UI SOUNDS - One-shot playback
// ─────────────────────────────────────────────────────────────────────────────

export function playUI(sound: UISound): void {
  if (!ensureInitialized()) return;

  // Debounce check
  if (!shouldPlay(sound)) return;

  log(`▶ Playing UI sound: ${sound}`);

  // Try to unlock first (async, won't block)
  tryUnlock();

  const cachedSound = uiSoundCache.get(sound);
  if (cachedSound) {
    cachedSound.volume(engineState.settings.uiVolume * engineState.settings.masterVolume);
    const playId = cachedSound.play();

    if (playId === undefined || playId === null) {
      logWarn(`UI sound failed to play: ${sound}, queueing retry`);
      retryQueue.push(() => playUI(sound));
    }
  } else {
    // Fallback: load and play
    const path = UI_SOUNDS[sound];
    if (path) {
      const howl = new Howl({
        src: [path],
        volume: engineState.settings.uiVolume * engineState.settings.masterVolume,
        onplayerror: () => {
          logWarn(`Fallback UI sound failed: ${sound}`);
        },
      });
      howl.play();
    }
  }
}

// Convenience exports
export const playTap = () => playUI('tap');
export const playSuccess = (volume?: number) => {
  const cached = uiSoundCache.get('success');
  if (cached) {
    cached.volume((volume || engineState.settings.uiVolume) * engineState.settings.masterVolume);
    cached.play();
  } else {
    playUI('success');
  }
};
export const playComplete = () => playUI('complete');
export const playLevelUp = () => playUI('levelUp');
export const playUnlock = () => playUI('unlock');
export const playReveal = () => playUI('reveal');
export const playChime = () => playUI('chime');
export const playTransition = () => playUI('whoosh');
export const playCelebration = (volume?: number) => {
  const cached = uiSoundCache.get('celebrate');
  if (cached) {
    cached.volume((volume || engineState.settings.uiVolume) * engineState.settings.masterVolume);
    cached.play();
  } else {
    playUI('celebrate');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENE MUSIC - Looping background with crossfade
// ─────────────────────────────────────────────────────────────────────────────

const MIN_CLEANUP_DELAY = 300; // Minimum delay for iOS cleanup

// iOS Safari detection - used for additional safeguards
function isIOSSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  return isIOS && isSafari;
}

// Safe Howl creation wrapper to prevent iOS Safari crashes
function createSafeHowl(options: HowlOptions): Howl | null {
  try {
    return new Howl(options);
  } catch (e) {
    logError('Failed to create Howl instance:', e);
    return null;
  }
}

// Safe unload with iOS delay
function safeUnload(howl: Howl, id?: number): void {
  try {
    if (id !== undefined && id !== null) {
      howl.stop(id);
    }
    // iOS Safari needs a delay before unload to prevent crashes
    if (isIOSSafari()) {
      setTimeout(() => {
        try {
          howl.unload();
        } catch (e) {
          logWarn('Safe unload failed:', e);
        }
      }, MIN_CLEANUP_DELAY);
    } else {
      howl.unload();
    }
  } catch (e) {
    logWarn('Unload failed:', e);
  }
}

export function startAmbientMusic(type: AmbientSound, fadeInDuration: number = 3): void {
  if (!ensureInitialized()) return;

  log(`🎵 Starting music: ${type}`);

  // Try to unlock
  tryUnlock();

  // Cancel any pending stop
  if (pendingMusicStop) {
    clearTimeout(pendingMusicStop);
    pendingMusicStop = null;
  }

  // Skip if already playing this track
  if (engineState.currentMusicTrack === type && activeMusicHowl && activeMusicId !== null) {
    log(`Already playing: ${type}, resuming volume`);
    activeMusicHowl.fade(
      activeMusicHowl.volume() as number,
      engineState.settings.musicVolume * engineState.settings.masterVolume,
      500,
      activeMusicId
    );
    return;
  }

  // Stop current music with proper cleanup delay
  if (activeMusicHowl && activeMusicId !== null) {
    const oldHowl = activeMusicHowl;
    const oldId = activeMusicId;
    log(`Stopping previous track: ${engineState.currentMusicTrack}`);
    try {
      oldHowl.fade(oldHowl.volume(oldId) as number, 0, MIN_CLEANUP_DELAY, oldId);
    } catch (e) {
      logWarn('Failed to fade old track:', e);
    }
    setTimeout(() => {
      safeUnload(oldHowl, oldId);
    }, MIN_CLEANUP_DELAY);
  }

  // Clear references immediately
  activeMusicHowl = null;
  activeMusicId = null;

  const config = SCENE_MUSIC[type];
  if (!config) {
    logWarn(`Unknown music type: ${type}`);
    engineState.currentMusicTrack = null;
    engineState.isMusicPlaying = false;
    notifyStateChange();
    return;
  }

  // Update state immediately (optimistic)
  engineState.currentMusicTrack = type;
  notifyStateChange();

  // Calculate random start position
  const randomStartPosition = (config.randomStart && config.duration)
    ? Math.random() * (config.duration * 0.8)
    : 0;

  // CRITICAL: Use safe Howl creation to prevent iOS Safari crashes
  const howl = createSafeHowl({
    src: [config.path],
    volume: 0,
    loop: true,
    preload: true,
    onload: function() {
      log(`✓ Music loaded: ${type}`);

      // Seek to random position BEFORE playing
      if (randomStartPosition > 0) {
        try {
          howl!.seek(randomStartPosition);
          log(`Starting at ${Math.floor(randomStartPosition)}s`);
        } catch (e) {
          logWarn('Failed to seek:', e);
        }
      }

      try {
        activeMusicId = howl!.play();
        howl!.fade(0, engineState.settings.musicVolume * engineState.settings.masterVolume, fadeInDuration * 1000, activeMusicId!);
      } catch (e) {
        logError('Failed to start music playback:', e);
      }

      engineState.isMusicPlaying = true;
      notifyStateChange();
    },
    onloaderror: (id, error) => {
      logError(`Failed to load music: ${type}`, error);
      engineState.currentMusicTrack = null;
      engineState.isMusicPlaying = false;
      engineState.lastError = `Failed to load: ${type}`;
      notifyStateChange();
    },
    onplayerror: (id, error) => {
      logError(`Failed to play music: ${type}`, error);

      // Queue retry (but only if not already retrying)
      if (retryQueue.length < 3) {
        retryQueue.push(() => startAmbientMusic(type, fadeInDuration));
      }

      if (howl) {
        howl.once('unlock', () => {
          log(`🔓 Retrying music after unlock: ${type}`);
          try {
            activeMusicId = howl.play();
            howl.fade(0, engineState.settings.musicVolume * engineState.settings.masterVolume, fadeInDuration * 1000, activeMusicId!);
            engineState.isMusicPlaying = true;
            notifyStateChange();
          } catch (e) {
            logError('Failed to retry music after unlock:', e);
          }
        });
      }
    },
  });

  if (!howl) {
    logError('Failed to create Howl for music:', type);
    engineState.currentMusicTrack = null;
    engineState.isMusicPlaying = false;
    notifyStateChange();
    return;
  }

  activeMusicHowl = howl;
}

export function stopAmbientMusic(fadeOutDuration: number = 2, immediate: boolean = false): void {
  // Cancel any pending stop
  if (pendingMusicStop) {
    clearTimeout(pendingMusicStop);
    pendingMusicStop = null;
  }

  if (!activeMusicHowl || activeMusicId === null) {
    engineState.currentMusicTrack = null;
    engineState.isMusicPlaying = false;
    notifyStateChange();
    return;
  }

  const howl = activeMusicHowl;
  const id = activeMusicId;

  log(`⏹ Stopping music: ${engineState.currentMusicTrack}`);

  // Clear state immediately
  activeMusicHowl = null;
  activeMusicId = null;
  engineState.currentMusicTrack = null;
  engineState.isMusicPlaying = false;
  notifyStateChange();

  if (immediate) {
    safeUnload(howl, id);
  } else {
    // Use minimum cleanup delay
    pendingMusicStop = setTimeout(() => {
      pendingMusicStop = null;
      try {
        howl.fade(howl.volume(id) as number, 0, fadeOutDuration * 1000, id);
      } catch (e) {
        logWarn('Failed to fade music:', e);
      }
      setTimeout(() => {
        safeUnload(howl, id);
      }, fadeOutDuration * 1000);
    }, MIN_CLEANUP_DELAY);
  }
}

// Aliases
export const startSceneMusic = startAmbientMusic;
export const stopSceneMusic = stopAmbientMusic;

// ─────────────────────────────────────────────────────────────────────────────
// WRITING AMBIENCE
// ─────────────────────────────────────────────────────────────────────────────

export function startWritingAmbience(type?: WritingAmbience): void {
  if (!ensureInitialized()) return;

  // Try to unlock
  tryUnlock();

  // Cancel any pending stop
  if (pendingAmbienceStop) {
    clearTimeout(pendingAmbienceStop);
    pendingAmbienceStop = null;
  }

  const ambienceType = type || engineState.settings.writingAmbienceType;
  if (ambienceType === 'silence') {
    stopWritingAmbience();
    return;
  }

  log(`🌧 Starting ambience: ${ambienceType}`);

  // Skip if already playing
  if (engineState.currentAmbienceTrack === ambienceType && activeAmbienceHowl && activeAmbienceId !== null) {
    log(`Already playing: ${ambienceType}`);
    activeAmbienceHowl.fade(
      activeAmbienceHowl.volume() as number,
      engineState.settings.ambienceVolume * engineState.settings.masterVolume,
      500,
      activeAmbienceId
    );
    return;
  }

  // Stop current with cleanup delay
  if (activeAmbienceHowl && activeAmbienceId !== null) {
    const oldHowl = activeAmbienceHowl;
    const oldId = activeAmbienceId;
    try {
      oldHowl.fade(oldHowl.volume(oldId) as number, 0, MIN_CLEANUP_DELAY, oldId);
    } catch (e) {
      logWarn('Failed to fade old ambience:', e);
    }
    setTimeout(() => {
      safeUnload(oldHowl, oldId);
    }, MIN_CLEANUP_DELAY);
  }

  // Clear refs
  activeAmbienceHowl = null;
  activeAmbienceId = null;

  const config = WRITING_AMBIENCE[ambienceType];
  if (!config) {
    logWarn(`Unknown ambience type: ${ambienceType}`);
    return;
  }

  engineState.currentAmbienceTrack = ambienceType;
  notifyStateChange();

  const randomStartPosition = (config.randomStart && config.duration)
    ? Math.random() * (config.duration * 0.8)
    : 0;

  // CRITICAL: Use safe Howl creation to prevent iOS Safari crashes
  const howl = createSafeHowl({
    src: [config.path],
    volume: 0,
    loop: true,
    preload: true,
    onload: function() {
      log(`✓ Ambience loaded: ${ambienceType}`);

      if (randomStartPosition > 0) {
        try {
          howl!.seek(randomStartPosition);
        } catch (e) {
          logWarn('Failed to seek ambience:', e);
        }
      }

      try {
        activeAmbienceId = howl!.play();
        howl!.fade(0, engineState.settings.ambienceVolume * engineState.settings.masterVolume, 2000, activeAmbienceId!);
      } catch (e) {
        logError('Failed to start ambience playback:', e);
      }

      engineState.isAmbiencePlaying = true;
      notifyStateChange();
    },
    onloaderror: (id, error) => {
      logError(`Failed to load ambience: ${ambienceType}`, error);
      engineState.currentAmbienceTrack = null;
      engineState.isAmbiencePlaying = false;
      notifyStateChange();
    },
    onplayerror: (id, error) => {
      logError(`Failed to play ambience: ${ambienceType}`, error);
      // Limit retry queue size
      if (retryQueue.length < 3) {
        retryQueue.push(() => startWritingAmbience(ambienceType));
      }
    },
  });

  if (!howl) {
    logError('Failed to create Howl for ambience:', ambienceType);
    engineState.currentAmbienceTrack = null;
    engineState.isAmbiencePlaying = false;
    notifyStateChange();
    return;
  }

  activeAmbienceHowl = howl;
}

export function stopWritingAmbience(immediate: boolean = false): void {
  if (pendingAmbienceStop) {
    clearTimeout(pendingAmbienceStop);
    pendingAmbienceStop = null;
  }

  if (!activeAmbienceHowl || activeAmbienceId === null) {
    engineState.currentAmbienceTrack = null;
    engineState.isAmbiencePlaying = false;
    notifyStateChange();
    return;
  }

  const howl = activeAmbienceHowl;
  const id = activeAmbienceId;

  log(`⏹ Stopping ambience: ${engineState.currentAmbienceTrack}`);

  activeAmbienceHowl = null;
  activeAmbienceId = null;
  engineState.currentAmbienceTrack = null;
  engineState.isAmbiencePlaying = false;
  notifyStateChange();

  if (immediate) {
    safeUnload(howl, id);
  } else {
    pendingAmbienceStop = setTimeout(() => {
      pendingAmbienceStop = null;
      try {
        howl.fade(howl.volume(id) as number, 0, 1000, id);
      } catch (e) {
        logWarn('Failed to fade ambience:', e);
      }
      setTimeout(() => {
        safeUnload(howl, id);
      }, 1000);
    }, MIN_CLEANUP_DELAY);
  }
}

// Aliases
export const startAmbience = startWritingAmbience;
export const stopAmbience = stopWritingAmbience;

// ─────────────────────────────────────────────────────────────────────────────
// STOP ALL AUDIO
// ─────────────────────────────────────────────────────────────────────────────

export function stopAllAudio(): void {
  log('⏹ Stopping all audio');
  // iOS FIX: Don't use immediate=true as it calls unload() right after stop()
  // which can crash iOS WebKit. Use a very short fade instead.
  stopAmbientMusic(0.1, false); // 100ms fade
  stopWritingAmbience(false);   // Uses default fade
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDITATION & SPECIAL SOUNDS
// ─────────────────────────────────────────────────────────────────────────────

export function playSingingBowl(): void {
  playUI('bell');
}

export function playGong(): void {
  playUI('bell');
}

export function playBreathingTone(phase: 'inhale' | 'exhale' | 'hold', duration: number): void {
  // Optional: could add subtle tones here
}

export function startBreathingGuide(): void {
  // No-op for now
}

export function updateBreathPhase(phase: 'inhale' | 'exhale' | 'hold', durationMs: number): void {
  // Optional
}

export function stopBreathingGuide(): void {
  // No-op
}

// ─────────────────────────────────────────────────────────────────────────────
// XP COUNTING
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
// TYPE EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export type BowlType = 'small' | 'medium' | 'large';
export type SceneType = AmbientSound;
export type AmbienceType = WritingAmbience | 'silence';
export type BreathPhase = 'inhale' | 'exhale' | 'hold';

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CHECKS
// ─────────────────────────────────────────────────────────────────────────────

export function isAudioReady(): boolean {
  return engineState.isInitialized && engineState.isUnlocked;
}

export function resumeAudio(): void {
  tryUnlock();
}

// ─────────────────────────────────────────────────────────────────────────────
// CLEANUP
// ─────────────────────────────────────────────────────────────────────────────

export function cleanup(): void {
  log('🧹 Cleaning up audio engine');

  if (pendingMusicStop) {
    clearTimeout(pendingMusicStop);
    pendingMusicStop = null;
  }
  if (pendingAmbienceStop) {
    clearTimeout(pendingAmbienceStop);
    pendingAmbienceStop = null;
  }

  if (activeMusicHowl) {
    activeMusicHowl.stop();
    activeMusicHowl.unload();
    activeMusicHowl = null;
    activeMusicId = null;
  }
  if (activeAmbienceHowl) {
    activeAmbienceHowl.stop();
    activeAmbienceHowl.unload();
    activeAmbienceHowl = null;
    activeAmbienceId = null;
  }

  uiSoundCache.forEach((howl) => howl.unload());
  uiSoundCache.clear();

  engineState.isInitialized = false;
  engineState.isUnlocked = false;
  engineState.currentMusicTrack = null;
  engineState.currentAmbienceTrack = null;
  engineState.isMusicPlaying = false;
  engineState.isAmbiencePlaying = false;
  notifyStateChange();
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default {
  initAudioEngine,
  playUI,
  startAmbientMusic,
  stopAmbientMusic,
  startWritingAmbience,
  stopWritingAmbience,
  stopAllAudio,
  playSingingBowl,
  playGong,
  playBreathingTone,
  playXpCounting,
  playHaptic,
  updateSettings,
  getSettings,
  getState,
  subscribeToState,
  cleanup,
};
