/**
 * Background Music System
 * 
 * A simple standalone music system for GrowthClaude.
 * Uses only tracks from /audio/writing/ folder.
 * 
 * Usage:
 *   import { backgroundMusic } from '@/lib/backgroundMusic';
 *   backgroundMusic.start();
 *   backgroundMusic.stop();
 *   backgroundMusic.changeTrack();
 *   backgroundMusic.toggleMute();
 */

import { Howl, Howler } from 'howler';

// Get base path for assets (handles production deployment at /growthmvp)
const getBasePath = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BASE_PATH || '';
  }
  return '';
};

// Available music tracks from /audio/writing/
// rain.mp3 is first because it's the smallest (6MB) - faster to start
const MUSIC_TRACKS = [
  { name: 'rain', path: '/audio/writing/rain.mp3', isLong: false },
  { name: 'forest', path: '/audio/writing/forest.mp3', isLong: true },
  { name: 'visualization', path: '/audio/writing/visualization.mp3', isLong: true },
  { name: 'lessonDeep', path: '/audio/writing/lessonDeep.mp3', isLong: true },
] as const;

type TrackName = typeof MUSIC_TRACKS[number]['name'];

interface MusicState {
  currentTrack: Howl | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentPlayId: number | null;
}

// Persist track index so it survives page reloads (e.g. OAuth redirects)
const TRACK_INDEX_KEY = 'bgm_trackIndex';

function loadSavedTrackIndex(): number {
  if (typeof window === 'undefined') return 0;
  const saved = localStorage.getItem(TRACK_INDEX_KEY);
  if (saved !== null) {
    const idx = parseInt(saved, 10);
    if (!isNaN(idx) && idx >= 0 && idx < MUSIC_TRACKS.length) return idx;
  }
  return -1; // -1 means "no saved preference, pick random on first start"
}

function saveTrackIndex(index: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TRACK_INDEX_KEY, String(index));
}

const state: MusicState = {
  currentTrack: null,
  currentTrackIndex: Math.max(0, loadSavedTrackIndex()),
  isPlaying: false,
  isMuted: false,
  volume: 0.3,
  currentPlayId: null,
};

// Whether we have a saved track preference (vs fresh first-time user)
const hasSavedTrack = loadSavedTrackIndex() >= 0;

// Debug mode
const DEBUG = typeof window !== 'undefined' && localStorage.getItem('MUSIC_DEBUG') === 'true';

function log(msg: string, ...args: unknown[]) {
  if (DEBUG) console.log(`[BackgroundMusic] ${msg}`, ...args);
}

/**
 * Get a random start position for long tracks
 * Returns a position between 0 and 80% of the track duration
 */
function getRandomStartPosition(duration: number): number {
  if (!duration || duration <= 0) return 0;
  return Math.random() * (duration * 0.8);
}

function applyMuteState(track: Howl, muted: boolean, playId: number | null): void {
  const id = playId !== null ? playId : undefined;
  track.mute(muted, id);
  if (!muted) {
    if (id !== undefined) {
      track.volume(state.volume, id);
    } else {
      track.volume(state.volume);
    }
  }
}

// Track if we want to play (for async loading)
let wantsToPlay = false;

// Subscriber system for track change notifications
const trackChangeListeners = new Set<(trackName: TrackName) => void>();

function notifyTrackChange(): void {
  const name = MUSIC_TRACKS[state.currentTrackIndex].name;
  trackChangeListeners.forEach(listener => {
    try { listener(name); } catch (e) { log('Listener error:', e); }
  });
}

function subscribe(callback: (trackName: TrackName) => void): () => void {
  trackChangeListeners.add(callback);
  return () => { trackChangeListeners.delete(callback); };
}


/**
 * Ensure AudioContext is running (crucial for iOS)
 */
function ensureContext(): void {
  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    log('Resuming suspended audio context');
    Howler.ctx.resume();
  }
}

/**
 * Internal: create Howl and start playback for the track at state.currentTrackIndex.
 * Does NOT change the index — caller is responsible for setting it first.
 */
function playCurrentTrack(): void {
  wantsToPlay = true;
  ensureContext();

  const trackInfo = MUSIC_TRACKS[state.currentTrackIndex];
  const fullPath = getBasePath() + trackInfo.path;
  log('Starting track:', trackInfo.name, fullPath);

  // Notify subscribers of the track we're about to play
  notifyTrackChange();

  // Clean up old track if exists
  if (state.currentTrack) {
    state.currentTrack.unload();
    state.currentTrack = null;
  }

  // Create new track with html5:true for STREAMING (starts playing while downloading)
  // Without html5:true, the entire file must download first which takes forever
  const howl = new Howl({
    src: [fullPath],
    loop: true,
    volume: state.isMuted ? 0 : state.volume,
    mute: state.isMuted,
    html5: true, // CRITICAL: Enables streaming so music starts fast
    preload: true,
    onload: function() {
      log('Track loaded/buffered:', trackInfo.name);
      // Seek to random position for long tracks
      if (trackInfo.isLong && state.isPlaying) {
        const duration = howl.duration();
        if (duration > 0) {
          const startPos = getRandomStartPosition(duration);
          log('Seeking to:', startPos, 'of', duration);
          howl.seek(startPos);
        }
      }
    },
    onplay: function(id) {
      log('Track playing, id:', id);
      state.currentPlayId = id;
      state.isPlaying = true;
    },
    onplayerror: function(_id, error) {
      log('Play error:', error, '- will retry');
      // With html5 mode, play errors are common before buffering is ready
      // Retry after a short delay
      setTimeout(() => {
        if (wantsToPlay && !state.isPlaying) {
          log('Retrying play after error...');
          howl.play();
        }
      }, 100);
    },
    onloaderror: function(_id, error) {
      // Error codes: 1=aborted, 2=network, 3=decode, 4=src_not_supported
      const errorMessages: Record<number, string> = {
        1: 'Load aborted',
        2: 'Network error - check if file exists',
        3: 'Decode error - file may be corrupted',
        4: 'Source not supported or file not found',
      };
      const errorNum = typeof error === 'number' ? error : 0;
      console.error(`[BackgroundMusic] Load error for ${fullPath}:`, errorMessages[errorNum] || error);
    },
  });

  state.currentTrack = howl;
  applyMuteState(howl, state.isMuted, state.currentPlayId);

  // Play immediately - with html5:true this will start as soon as enough is buffered
  log('Calling play()');
  howl.play();

  // Mark as playing optimistically (onplay will confirm)
  state.isPlaying = true;
}

/**
 * Start playing background music.
 * Resumes the last-played track if one was saved, otherwise picks random.
 * If already playing, does nothing.
 */
function start(): void {
  log('start() called, isPlaying:', state.isPlaying);

  // If already playing, just make sure context is active
  if (state.isPlaying && state.currentTrack) {
    ensureContext();
    return;
  }

  // Only randomize for first-time users who have no saved preference
  if (!hasSavedTrack && !state.isPlaying) {
    state.currentTrackIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
    saveTrackIndex(state.currentTrackIndex);
  }

  playCurrentTrack();
}

/**
 * Stop playing background music with fade out
 */
function stop(): void {
  log('stop() called');
  
  wantsToPlay = false; // Prevent any pending retries

  const track = state.currentTrack;
  state.isPlaying = false;
  state.currentPlayId = null;

  if (!track) {
    return;
  }

  track.stop();
  track.unload();
  if (state.currentTrack === track) {
    state.currentTrack = null;
  }
}

/**
 * Change to the next track (cycles through available tracks)
 * The new track starts at a random position if it's a long track
 */
function changeTrack(): void {
  ensureContext();
  log('changeTrack() called');
  
  const wasPlaying = state.isPlaying;
  
  // Stop current track immediately (no fade for track change)
  if (state.currentTrack) {
    state.currentTrack.stop();
    state.currentTrack.unload();
    state.currentTrack = null;
  }
  
  // Move to next track
  state.currentTrackIndex = (state.currentTrackIndex + 1) % MUSIC_TRACKS.length;
  saveTrackIndex(state.currentTrackIndex);
  state.isPlaying = false;
  state.currentPlayId = null;

  log('Changed to track index:', state.currentTrackIndex);

  // If was playing, start the new track (playCurrentTrack, NOT start — start re-randomizes)
  if (wasPlaying) {
    playCurrentTrack();
  } else {
    // Even if not playing, notify subscribers so the UI label updates
    notifyTrackChange();
  }
}

/**
 * Toggle mute state
 */
function toggleMute(): boolean {
  ensureContext();
  state.isMuted = !state.isMuted;
  log('toggleMute, now muted:', state.isMuted);
  
  if (state.currentTrack) {
    applyMuteState(state.currentTrack, state.isMuted, state.currentPlayId);
  }
  
  return state.isMuted;
}

/**
 * Set mute state directly
 */
function setMuted(muted: boolean): void {
  ensureContext();
  if (state.isMuted === muted) return;
  
  state.isMuted = muted;
  log('setMuted:', muted);
  
  if (state.currentTrack) {
    applyMuteState(state.currentTrack, state.isMuted, state.currentPlayId);
  }
}

/**
 * Check if music is muted
 */
function isMutedFn(): boolean {
  return state.isMuted;
}

/**
 * Check if music is currently playing
 */
function isPlayingFn(): boolean {
  return state.isPlaying;
}

/**
 * Get current track name
 */
function getCurrentTrackName(): TrackName {
  return MUSIC_TRACKS[state.currentTrackIndex].name;
}

/**
 * Set volume (0 to 1)
 */
function setVolume(volume: number): void {
  state.volume = Math.max(0, Math.min(1, volume));
  
  if (state.currentTrack && !state.isMuted) {
    state.currentTrack.volume(state.volume);
  }
}

/**
 * Cleanup - call when unmounting the app
 */
function cleanup(): void {
  log('cleanup() called');
  if (state.currentTrack) {
    state.currentTrack.stop();
    state.currentTrack.unload();
    state.currentTrack = null;
  }
  state.isPlaying = false;
  state.currentPlayId = null;
}

// Export as a singleton object
export const backgroundMusic = {
  start,
  stop,
  changeTrack,
  toggleMute,
  setMuted,
  isMuted: isMutedFn,
  isPlaying: isPlayingFn,
  getCurrentTrackName,
  setVolume,
  cleanup,
  subscribe,
  TRACKS: MUSIC_TRACKS,
};

export type { TrackName };
