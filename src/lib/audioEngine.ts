'use client';

// ============================================================================
// AUDIO ENGINE - A Revolutionary Generative Audio System
// ============================================================================
//
// This engine creates emotionally resonant audio experiences using:
// 1. Web Audio API for pristine, programmatic sound generation
// 2. Real audio files where available (with graceful fallback)
// 3. Multi-layer audio: Music + Ambience + UI sounds simultaneously
// 4. Beautiful synthesized pads, bells, and atmospheric textures
// 5. Precise breathing guides with binaural elements
//
// Every sound is crafted to touch the heart and create sacred space.
// ============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export type SoundCategory = 'ui' | 'ambient' | 'meditation' | 'writing';
export type UISound = 
  | 'tap' | 'tapConfirm' | 'success' | 'successBig' | 'complete' 
  | 'levelUp' | 'streak' | 'bell' | 'chime' | 'whoosh' | 'whooshOut'
  | 'pop' | 'celebrate' | 'unlock' | 'notification' | 'reveal'
  | 'keystroke' | 'error';

export type AmbientSound = 
  | 'onboarding' | 'lessonCalm' | 'lessonDeep' | 'reflection'
  | 'visualization' | 'reward' | 'home';

export type MeditationSound = 
  | 'singingBowl' | 'gong' | 'inhale' | 'exhale' | 'hold';

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

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO CONTEXT & STATE
// ─────────────────────────────────────────────────────────────────────────────

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let uiGain: GainNode | null = null;
let ambienceGain: GainNode | null = null;

let settings: AudioSettings = { ...defaultSettings };
let isInitialized = false;

// Active sound sources
let activeMusicSource: { nodes: AudioNode[]; stop: () => void } | null = null;
let activeAmbienceSource: { nodes: AudioNode[]; stop: () => void } | null = null;
let activeWritingSource: { nodes: AudioNode[]; stop: () => void } | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function initAudioEngine(): void {
  if (isInitialized) return;
  
  const ctx = getContext();
  
  // Create gain nodes for mixing
  masterGain = ctx.createGain();
  masterGain.gain.value = settings.masterVolume;
  masterGain.connect(ctx.destination);
  
  musicGain = ctx.createGain();
  musicGain.gain.value = settings.musicVolume;
  musicGain.connect(masterGain);
  
  uiGain = ctx.createGain();
  uiGain.gain.value = settings.uiVolume;
  uiGain.connect(masterGain);
  
  ambienceGain = ctx.createGain();
  ambienceGain.gain.value = settings.ambienceVolume;
  ambienceGain.connect(masterGain);
  
  isInitialized = true;
}

export function ensureInitialized(): boolean {
  if (!isInitialized) {
    try {
      initAudioEngine();
      return true;
    } catch {
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
  
  if (masterGain) masterGain.gain.value = settings.masterVolume;
  if (musicGain) musicGain.gain.value = settings.musicVolume;
  if (uiGain) uiGain.gain.value = settings.uiVolume;
  if (ambienceGain) ambienceGain.gain.value = settings.ambienceVolume;
}

export function getSettings(): AudioSettings {
  return { ...settings };
}

// ─────────────────────────────────────────────────────────────────────────────
// MUSICAL SCALES & FREQUENCIES (For emotional resonance)
// ─────────────────────────────────────────────────────────────────────────────

// Frequencies that create calm, contemplative moods
const SCALES = {
  // C major pentatonic - universally pleasant
  calm: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
  // D minor - emotional, introspective  
  deep: [293.66, 329.63, 349.23, 392.00, 440.00, 466.16, 523.25],
  // F major - warm, hopeful
  hopeful: [349.23, 392.00, 440.00, 466.16, 523.25, 587.33],
  // A minor pentatonic - mysterious, spiritual
  mystical: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00],
  // C major - bright, triumphant
  triumph: [523.25, 587.33, 659.25, 698.46, 783.99, 880.00],
};

// Singing bowl frequencies (tuned to chakras)
const BOWL_FREQUENCIES = {
  root: 256,      // C4 - grounding
  sacral: 288,    // D4 - creativity
  solar: 320,     // E4 - power
  heart: 341.3,   // F4 - love
  throat: 384,    // G4 - expression
  third: 426.7,   // A4 - intuition
  crown: 480,     // B4 - connection
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function createGain(ctx: AudioContext, value: number = 1): GainNode {
  const gain = ctx.createGain();
  gain.gain.value = value;
  return gain;
}

function createFilter(ctx: AudioContext, type: BiquadFilterType, frequency: number): BiquadFilterNode {
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  return filter;
}

function fadeIn(gainNode: GainNode, duration: number, targetVolume: number = 1): void {
  const ctx = getContext();
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + duration);
}

function fadeOut(gainNode: GainNode, duration: number): void {
  const ctx = getContext();
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
}

// ─────────────────────────────────────────────────────────────────────────────
// UI SOUNDS - Crisp, satisfying interactions
// ─────────────────────────────────────────────────────────────────────────────

const UI_SOUND_CONFIGS: Record<UISound, () => void> = {
  tap: () => playTap(),
  tapConfirm: () => playTapConfirm(),
  success: () => playSuccess(),
  successBig: () => playSuccessBig(),
  complete: () => playComplete(),
  levelUp: () => playLevelUp(),
  streak: () => playStreak(),
  bell: () => playBell(),
  chime: () => playChime(),
  whoosh: () => playWhoosh('in'),
  whooshOut: () => playWhoosh('out'),
  pop: () => playPop(),
  celebrate: () => playCelebrate(),
  unlock: () => playUnlock(),
  notification: () => playNotification(),
  reveal: () => playReveal(),
  keystroke: () => playKeystroke(),
  error: () => playError(),
};

export function playUI(sound: UISound): void {
  if (!ensureInitialized() || !uiGain) return;
  UI_SOUND_CONFIGS[sound]?.();
}

// Gentle tap - like touching water
function playTap(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
  
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  
  osc.connect(gain);
  gain.connect(uiGain!);
  osc.start(now);
  osc.stop(now + 0.1);
}

// Confirmed tap - slightly more presence
function playTapConfirm(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  
  // Layer 1: Main tap
  const osc1 = ctx.createOscillator();
  const gain1 = createGain(ctx, 0);
  osc1.type = 'sine';
  osc1.frequency.value = 880;
  gain1.gain.setValueAtTime(0.3, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  osc1.connect(gain1);
  gain1.connect(uiGain!);
  osc1.start(now);
  osc1.stop(now + 0.15);
  
  // Layer 2: Harmonic
  const osc2 = ctx.createOscillator();
  const gain2 = createGain(ctx, 0);
  osc2.type = 'sine';
  osc2.frequency.value = 1320;
  gain2.gain.setValueAtTime(0.15, now + 0.01);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc2.connect(gain2);
  gain2.connect(uiGain!);
  osc2.start(now + 0.01);
  osc2.stop(now + 0.12);
}

// Success - warm, affirming
function playSuccess(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const start = now + i * 0.06;
    gain.gain.setValueAtTime(0.25, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(start);
    osc.stop(start + 0.25);
  });
}

// Big success - triumphant chord
function playSuccessBig(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  const chord = [392, 493.88, 587.33, 783.99]; // G4, B4, D5, G5
  
  chord.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const start = now + i * 0.03;
    gain.gain.setValueAtTime(0.2, start);
    gain.gain.linearRampToValueAtTime(0.25, start + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(start);
    osc.stop(start + 0.6);
  });
}

// Complete - satisfying resolution
function playComplete(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  const arpeggio = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
  
  arpeggio.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    const start = now + i * 0.08;
    gain.gain.setValueAtTime(0.2, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(start);
    osc.stop(start + 0.4);
  });
}

// Level up - epic ascending
function playLevelUp(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  const notes = [392, 493.88, 587.33, 783.99, 987.77]; // G4-B4-D5-G5-B5
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const start = now + i * 0.07;
    gain.gain.setValueAtTime(0.22, start);
    gain.gain.linearRampToValueAtTime(0.28, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
    
    // Add slight shimmer
    const osc2 = ctx.createOscillator();
    const gain2 = createGain(ctx, 0);
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    gain2.gain.setValueAtTime(0.08, start + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(start);
    osc.stop(start + 0.5);
    
    osc2.connect(gain2);
    gain2.connect(uiGain!);
    osc2.start(start + 0.02);
    osc2.stop(start + 0.3);
  });
}

// Streak - fiery ascending
function playStreak(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  const notes = [440, 523.25, 659.25];
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    
    const filter = createFilter(ctx, 'lowpass', 2000);
    
    const start = now + i * 0.06;
    gain.gain.setValueAtTime(0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(uiGain!);
    osc.start(start);
    osc.stop(start + 0.25);
  });
}

// Bell - clear, resonant
function playBell(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  const freq = BOWL_FREQUENCIES.heart;
  
  // Main tone
  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0);
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
  
  // Overtones for richness
  const osc2 = ctx.createOscillator();
  const gain2 = createGain(ctx, 0);
  osc2.type = 'sine';
  osc2.frequency.value = freq * 2.756;
  gain2.gain.setValueAtTime(0.12, now);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
  
  const osc3 = ctx.createOscillator();
  const gain3 = createGain(ctx, 0);
  osc3.type = 'sine';
  osc3.frequency.value = freq * 5.404;
  gain3.gain.setValueAtTime(0.06, now);
  gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  
  osc.connect(gain);
  gain.connect(uiGain!);
  osc.start(now);
  osc.stop(now + 1.6);
  
  osc2.connect(gain2);
  gain2.connect(uiGain!);
  osc2.start(now);
  osc2.stop(now + 1.1);
  
  osc3.connect(gain3);
  gain3.connect(uiGain!);
  osc3.start(now);
  osc3.stop(now + 0.7);
}

// Chime - delicate, crystalline
function playChime(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  const freqs = [1047, 1319, 1568]; // C6, E6, G6
  
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const start = now + i * 0.02;
    gain.gain.setValueAtTime(0.15, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(start);
    osc.stop(start + 0.5);
  });
}

// Whoosh - smooth transition
function playWhoosh(direction: 'in' | 'out'): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  
  // Noise-based whoosh
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (direction === 'in' ? i / bufferSize : 1 - i / bufferSize);
  }
  
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  
  const filter = createFilter(ctx, 'bandpass', direction === 'in' ? 800 : 400);
  filter.Q.value = 0.5;
  
  const gain = createGain(ctx, 0.15);
  
  source.connect(filter);
  filter.connect(gain);
  gain.connect(uiGain!);
  source.start(now);
}

// Pop - bubbly, playful
function playPop(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
  
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  
  osc.connect(gain);
  gain.connect(uiGain!);
  osc.start(now);
  osc.stop(now + 0.12);
}

// Celebrate - joyful, triumphant fanfare
function playCelebrate(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  
  // Fanfare pattern
  const notes = [
    { freq: 523.25, time: 0, dur: 0.15 },
    { freq: 659.25, time: 0.08, dur: 0.15 },
    { freq: 783.99, time: 0.16, dur: 0.15 },
    { freq: 1046.5, time: 0.24, dur: 0.4 },
  ];
  
  notes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const start = now + time;
    gain.gain.setValueAtTime(0.25, start);
    gain.gain.linearRampToValueAtTime(0.3, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(start);
    osc.stop(start + dur + 0.1);
  });
  
  // Add shimmer layer
  for (let i = 0; i < 5; i++) {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sine';
    osc.frequency.value = 1500 + Math.random() * 1000;
    
    const start = now + 0.3 + i * 0.05;
    gain.gain.setValueAtTime(0.05, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(start);
    osc.stop(start + 0.2);
  }
}

// Unlock - magical reveal
function playUnlock(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  
  // Ascending magical arpeggio
  const notes = [392, 466.16, 523.25, 622.25, 698.46, 830.61, 932.33, 1046.5];
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const start = now + i * 0.04;
    gain.gain.setValueAtTime(0.15 + i * 0.02, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(start);
    osc.stop(start + 0.35);
  });
}

// Notification - gentle attention
function playNotification(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  
  const notes = [880, 1108.73, 880]; // A5, C#6, A5
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const start = now + i * 0.12;
    gain.gain.setValueAtTime(0.2, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(start);
    osc.stop(start + 0.2);
  });
}

// Reveal - wisdom appearing
function playReveal(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  
  // Ethereal chord that fades in
  const chord = [349.23, 440, 523.25, 659.25]; // F4, A4, C5, E5
  
  chord.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(now);
    osc.stop(now + 1.3);
  });
}

// Keystroke - subtle typing feedback
function playKeystroke(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200 + Math.random() * 200, now);
  
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  
  osc.connect(gain);
  gain.connect(uiGain!);
  osc.start(now);
  osc.stop(now + 0.05);
}

// Error - gentle warning
function playError(): void {
  const ctx = getContext();
  const now = ctx.currentTime;
  
  const notes = [440, 349.23]; // A4, F4 - minor second down
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    const start = now + i * 0.12;
    gain.gain.setValueAtTime(0.2, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(start);
    osc.stop(start + 0.25);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT MUSIC - Emotional, atmospheric backgrounds
// ─────────────────────────────────────────────────────────────────────────────

export function startAmbientMusic(type: AmbientSound, fadeInDuration: number = 3): void {
  if (!ensureInitialized() || !musicGain) return;
  
  // Stop current music with crossfade
  if (activeMusicSource) {
    const oldSource = activeMusicSource;
    fadeOut(musicGain, fadeInDuration * 0.5);
    setTimeout(() => oldSource.stop(), fadeInDuration * 500);
  }
  
  const ctx = getContext();
  const nodes: AudioNode[] = [];
  
  // Create atmospheric pad based on type
  const scaleType = getScaleForAmbient(type);
  const scale = SCALES[scaleType];
  
  // Create multiple detuned oscillators for rich pad
  const oscillators: OscillatorNode[] = [];
  const gains: GainNode[] = [];
  
  // Base pad - 3 detuned oscillators per note
  for (let n = 0; n < 3; n++) {
    const noteFreq = scale[n % scale.length];
    
    for (let d = 0; d < 3; d++) {
      const osc = ctx.createOscillator();
      const gain = createGain(ctx, 0);
      
      osc.type = 'sine';
      osc.frequency.value = noteFreq * (0.995 + d * 0.005);
      
      // Slow LFO for movement
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1 + Math.random() * 0.1;
      lfoGain.gain.value = noteFreq * 0.002;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      
      gain.gain.value = 0;
      
      osc.connect(gain);
      gain.connect(musicGain);
      osc.start();
      
      oscillators.push(osc);
      gains.push(gain);
      nodes.push(osc, gain, lfo, lfoGain);
    }
  }
  
  // Fade in
  const targetVol = 0.08;
  gains.forEach((g, i) => {
    setTimeout(() => {
      fadeIn(g, fadeInDuration, targetVol);
    }, i * 100);
  });
  
  activeMusicSource = {
    nodes,
    stop: () => {
      oscillators.forEach(osc => {
        try { osc.stop(); } catch {}
      });
    }
  };
}

function getScaleForAmbient(type: AmbientSound): keyof typeof SCALES {
  switch (type) {
    case 'onboarding': return 'mystical';
    case 'lessonCalm': return 'calm';
    case 'lessonDeep': return 'deep';
    case 'reflection': return 'calm';
    case 'visualization': return 'mystical';
    case 'reward': return 'triumph';
    case 'home': return 'hopeful';
    default: return 'calm';
  }
}

export function stopAmbientMusic(fadeOutDuration: number = 2): void {
  if (!musicGain || !activeMusicSource) return;
  
  fadeOut(musicGain, fadeOutDuration);
  
  const source = activeMusicSource;
  activeMusicSource = null;
  
  setTimeout(() => {
    source.stop();
    if (musicGain) musicGain.gain.value = settings.musicVolume;
  }, fadeOutDuration * 1000);
}

// ─────────────────────────────────────────────────────────────────────────────
// WRITING AMBIENCE - Rain, fire, forest
// ─────────────────────────────────────────────────────────────────────────────

export function startWritingAmbience(type?: WritingAmbience): void {
  if (!ensureInitialized() || !ambienceGain) return;
  
  const ambienceType = type || settings.writingAmbienceType;
  if (ambienceType === 'silence') {
    stopWritingAmbience();
    return;
  }
  
  // Stop current ambience
  if (activeWritingSource) {
    activeWritingSource.stop();
  }
  
  const ctx = getContext();
  
  switch (ambienceType) {
    case 'rain':
      activeWritingSource = createRainAmbience(ctx);
      break;
    case 'fire':
      activeWritingSource = createFireAmbience(ctx);
      break;
    case 'forest':
      activeWritingSource = createForestAmbience(ctx);
      break;
  }
}

function createRainAmbience(ctx: AudioContext): { nodes: AudioNode[]; stop: () => void } {
  const nodes: AudioNode[] = [];
  
  // Create noise buffer for rain
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
  
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      // Brownian noise for rain-like texture
      data[i] = (Math.random() * 2 - 1) * 0.5;
      if (i > 0) {
        data[i] = data[i - 1] + data[i] * 0.02;
        data[i] = Math.max(-1, Math.min(1, data[i]));
      }
    }
  }
  
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  
  // Filter for rain characteristics
  const highpass = createFilter(ctx, 'highpass', 400);
  const lowpass = createFilter(ctx, 'lowpass', 4000);
  
  const gain = createGain(ctx, 0);
  fadeIn(gain, 2, 0.25);
  
  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(ambienceGain!);
  
  source.start();
  
  nodes.push(source, highpass, lowpass, gain);
  
  return {
    nodes,
    stop: () => {
      fadeOut(gain, 1);
      setTimeout(() => {
        try { source.stop(); } catch {}
      }, 1000);
    }
  };
}

function createFireAmbience(ctx: AudioContext): { nodes: AudioNode[]; stop: () => void } {
  const nodes: AudioNode[] = [];
  
  // Crackling fire using filtered noise with random amplitude modulation
  const bufferSize = ctx.sampleRate * 3;
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
  
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < bufferSize; i++) {
      // Create crackling effect
      const crackle = Math.random() < 0.001 ? Math.random() * 0.8 : 0;
      const base = (Math.random() * 2 - 1) * 0.3;
      data[i] = base + crackle;
    }
  }
  
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  
  const lowpass = createFilter(ctx, 'lowpass', 800);
  const gain = createGain(ctx, 0);
  fadeIn(gain, 2, 0.2);
  
  source.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(ambienceGain!);
  
  source.start();
  
  nodes.push(source, lowpass, gain);
  
  return {
    nodes,
    stop: () => {
      fadeOut(gain, 1);
      setTimeout(() => {
        try { source.stop(); } catch {}
      }, 1000);
    }
  };
}

function createForestAmbience(ctx: AudioContext): { nodes: AudioNode[]; stop: () => void } {
  const nodes: AudioNode[] = [];
  
  // Gentle wind noise
  const windBuffer = ctx.createBuffer(2, ctx.sampleRate * 4, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = windBuffer.getChannelData(channel);
    let value = 0;
    for (let i = 0; i < windBuffer.length; i++) {
      value += (Math.random() - 0.5) * 0.01;
      value *= 0.999;
      data[i] = value * 10;
    }
  }
  
  const windSource = ctx.createBufferSource();
  windSource.buffer = windBuffer;
  windSource.loop = true;
  
  const windFilter = createFilter(ctx, 'bandpass', 300);
  windFilter.Q.value = 0.3;
  
  const windGain = createGain(ctx, 0);
  fadeIn(windGain, 2, 0.15);
  
  windSource.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(ambienceGain!);
  windSource.start();
  
  nodes.push(windSource, windFilter, windGain);
  
  // Occasional bird-like chirps
  const chirpInterval = setInterval(() => {
    if (Math.random() < 0.3) {
      const osc = ctx.createOscillator();
      const gain = createGain(ctx, 0);
      
      osc.type = 'sine';
      const baseFreq = 2000 + Math.random() * 1000;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.1, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ambienceGain!);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  }, 2000);
  
  return {
    nodes,
    stop: () => {
      clearInterval(chirpInterval);
      fadeOut(windGain, 1);
      setTimeout(() => {
        try { windSource.stop(); } catch {}
      }, 1000);
    }
  };
}

export function stopWritingAmbience(): void {
  if (activeWritingSource) {
    activeWritingSource.stop();
    activeWritingSource = null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDITATION SOUNDS - Breathing guides, singing bowls
// ─────────────────────────────────────────────────────────────────────────────

export function playSingingBowl(frequency?: number): void {
  if (!ensureInitialized() || !uiGain) return;
  
  const ctx = getContext();
  const now = ctx.currentTime;
  const baseFreq = frequency || BOWL_FREQUENCIES.heart;
  
  // Singing bowl with rich harmonics
  const partials = [1, 2.756, 5.404, 8.933];
  const amplitudes = [1, 0.4, 0.2, 0.1];
  
  partials.forEach((partial, i) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sine';
    osc.frequency.value = baseFreq * partial;
    
    // Add slight wobble
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 2 + i;
    lfoGain.gain.value = baseFreq * partial * 0.003;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25 * amplitudes[i], now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 4);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(now);
    osc.stop(now + 4.5);
    
    setTimeout(() => {
      try { lfo.stop(); } catch {}
    }, 4500);
  });
}

export function playGong(): void {
  if (!ensureInitialized() || !uiGain) return;
  
  const ctx = getContext();
  const now = ctx.currentTime;
  
  // Deep, resonant gong
  const frequencies = [80, 160, 240, 320, 480];
  
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const amp = 0.2 / (i + 1);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(amp, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 5);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(now);
    osc.stop(now + 5.5);
  });
}

// Breathing tones - gentle guides for inhale/exhale
export function playBreathingTone(
  phase: 'inhale' | 'exhale' | 'hold',
  duration: number
): void {
  if (!ensureInitialized() || !settings.breathingEnabled || !uiGain) return;
  
  const ctx = getContext();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = createGain(ctx, 0);
  
  osc.type = 'sine';
  
  switch (phase) {
    case 'inhale':
      // Rising tone
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(330, now + duration);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + duration * 0.3);
      gain.gain.linearRampToValueAtTime(0.15, now + duration * 0.7);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      break;
      
    case 'exhale':
      // Falling tone
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.linearRampToValueAtTime(220, now + duration);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + duration * 0.2);
      gain.gain.linearRampToValueAtTime(0.12, now + duration * 0.8);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      break;
      
    case 'hold':
      // Sustained gentle tone
      osc.frequency.value = 275;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
      gain.gain.linearRampToValueAtTime(0.08, now + duration - 0.2);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      break;
  }
  
  osc.connect(gain);
  gain.connect(uiGain!);
  osc.start(now);
  osc.stop(now + duration + 0.1);
}

// ─────────────────────────────────────────────────────────────────────────────
// XP COUNTING SOUNDS
// ─────────────────────────────────────────────────────────────────────────────

export function playXpCounting(totalXp: number, duration: number = 1.5): void {
  if (!ensureInitialized() || !uiGain) return;
  
  const ctx = getContext();
  const now = ctx.currentTime;
  const ticks = Math.min(totalXp, 20);
  const interval = duration / ticks;
  
  for (let i = 0; i < ticks; i++) {
    const time = now + i * interval;
    const progress = i / ticks;
    
    // Rising pitch as count increases
    const freq = 400 + progress * 400;
    
    const osc = ctx.createOscillator();
    const gain = createGain(ctx, 0);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0.15 + progress * 0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    
    osc.connect(gain);
    gain.connect(uiGain!);
    osc.start(time);
    osc.stop(time + 0.1);
  }
  
  // Final flourish
  setTimeout(() => playSuccess(), duration * 1000);
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
// CLEANUP
// ─────────────────────────────────────────────────────────────────────────────

export function cleanup(): void {
  stopAmbientMusic(0);
  stopWritingAmbience();
  
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
  
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
