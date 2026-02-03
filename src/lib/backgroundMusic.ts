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

import { Howl } from 'howler';

// Available music tracks from /audio/writing/
const MUSIC_TRACKS = [
  { name: 'forest', path: '/audio/writing/forest.mp3', isLong: true },
  { name: 'lessonDeep', path: '/audio/writing/lessonDeep.mp3', isLong: true },
  { name: 'rain', path: '/audio/writing/rain.mp3', isLong: false },
  { name: 'visualization', path: '/audio/writing/visualization.mp3', isLong: true },
] as const;

type TrackName = typeof MUSIC_TRACKS[number]['name'];

interface MusicState {
  currentTrack: Howl | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
}

const state: MusicState = {
  currentTrack: null,
  currentTrackIndex: 0,
  isPlaying: false,
  isMuted: false,
  volume: 0.3,
};

// Fade duration in milliseconds
const FADE_DURATION = 2000;

/**
 * Get a random start position for long tracks
 * Returns a position between 0 and 80% of the track duration
 */
function getRandomStartPosition(duration: number): number {
  return Math.random() * (duration * 0.8);
}

/**
 * Create a new Howl instance for a track
 */
function createTrack(trackIndex: number): Howl {
  const track = MUSIC_TRACKS[trackIndex];
  
  const howl = new Howl({
    src: [track.path],
    loop: true,
    volume: 0, // Start at 0 for fade in
    html5: true, // Use HTML5 Audio for large files
    preload: true,
  });

  return howl;
}

/**
 * Start playing background music
 * If already playing, does nothing
 */
function start(): void {
  if (state.isPlaying && state.currentTrack) {
    return;
  }

  // Create track if needed
  if (!state.currentTrack) {
    state.currentTrack = createTrack(state.currentTrackIndex);
  }

  const track = state.currentTrack;
  const trackInfo = MUSIC_TRACKS[state.currentTrackIndex];

  // Handle random start position for long tracks
  track.once('load', () => {
    if (trackInfo.isLong) {
      const duration = track.duration();
      const startPos = getRandomStartPosition(duration);
      track.seek(startPos);
    }
    
    // Start playing and fade in
    track.play();
    track.fade(0, state.isMuted ? 0 : state.volume, FADE_DURATION);
    state.isPlaying = true;
  });

  // If already loaded, play immediately
  if (track.state() === 'loaded') {
    if (trackInfo.isLong) {
      const duration = track.duration();
      const startPos = getRandomStartPosition(duration);
      track.seek(startPos);
    }
    
    track.play();
    track.fade(0, state.isMuted ? 0 : state.volume, FADE_DURATION);
    state.isPlaying = true;
  }
}

/**
 * Stop playing background music with fade out
 */
function stop(): void {
  if (!state.currentTrack || !state.isPlaying) {
    return;
  }

  const track = state.currentTrack;
  
  // Fade out then stop
  track.fade(track.volume(), 0, FADE_DURATION);
  
  setTimeout(() => {
    track.stop();
    state.isPlaying = false;
  }, FADE_DURATION);
}

/**
 * Change to the next track (cycles through available tracks)
 * The new track starts at a random position if it's a long track
 */
function changeTrack(): void {
  const wasPlaying = state.isPlaying;
  
  // Stop current track immediately (no fade for track change)
  if (state.currentTrack) {
    state.currentTrack.stop();
    state.currentTrack.unload();
    state.currentTrack = null;
  }
  
  // Move to next track
  state.currentTrackIndex = (state.currentTrackIndex + 1) % MUSIC_TRACKS.length;
  state.isPlaying = false;
  
  // If was playing, start the new track
  if (wasPlaying) {
    state.currentTrack = createTrack(state.currentTrackIndex);
    start();
  }
}

/**
 * Toggle mute state
 */
function toggleMute(): boolean {
  state.isMuted = !state.isMuted;
  
  if (state.currentTrack) {
    if (state.isMuted) {
      state.currentTrack.fade(state.currentTrack.volume(), 0, 300);
    } else {
      state.currentTrack.fade(0, state.volume, 300);
    }
  }
  
  return state.isMuted;
}

/**
 * Set mute state directly
 */
function setMuted(muted: boolean): void {
  if (state.isMuted === muted) return;
  
  state.isMuted = muted;
  
  if (state.currentTrack) {
    if (state.isMuted) {
      state.currentTrack.fade(state.currentTrack.volume(), 0, 300);
    } else {
      state.currentTrack.fade(0, state.volume, 300);
    }
  }
}

/**
 * Check if music is muted
 */
function isMuted(): boolean {
  return state.isMuted;
}

/**
 * Check if music is currently playing
 */
function isPlaying(): boolean {
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
  if (state.currentTrack) {
    state.currentTrack.stop();
    state.currentTrack.unload();
    state.currentTrack = null;
  }
  state.isPlaying = false;
}

// Export as a singleton object
export const backgroundMusic = {
  start,
  stop,
  changeTrack,
  toggleMute,
  setMuted,
  isMuted,
  isPlaying,
  getCurrentTrackName,
  setVolume,
  cleanup,
  TRACKS: MUSIC_TRACKS,
};

export type { TrackName };
