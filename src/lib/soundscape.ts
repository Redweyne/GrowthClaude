// ============================================================================
// SOUNDSCAPE - THE SOUL OF TRANSFORMATION HUB
// ============================================================================
//
// PHILOSOPHY:
// Sound should evoke, not notify. Each sound is a moment of feeling.
// We use silence as much as sound. What you DON'T hear matters.
//
// PRINCIPLES:
// 1. BREATHING - Sounds that feel alive, not mechanical
// 2. SPACE - Reverb and decay that creates depth
// 3. WARMTH - Frequencies that feel human, not digital
// 4. INTENTION - Every sound has a purpose and emotion
// 5. SILENCE - Some moments are more powerful without sound
//
// EMOTIONAL PALETTE:
// - Arrival: Soft, welcoming, like coming home
// - Wisdom: Deep, resonant, ancient
// - Action: Present, grounded, focused
// - Reflection: Spacious, introspective, still
// - Achievement: Warm triumph, not aggressive celebration
// - Growth: Rising hope, dawn breaking
// ============================================================================

// Musical notes in Hz - for reference
export const NOTES = {
  // Octave 2 (deep, grounding)
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  // Octave 3 (warm, foundation)
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  // Octave 4 (present, human voice range)
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  // Octave 5 (bright, clarity)
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  // Octave 6 (shimmer, ethereal)
  C6: 1046.50, D6: 1174.66, E6: 1318.51, F6: 1396.91, G6: 1567.98, A6: 1760.00,
};

// Emotional chord progressions
export const CHORDS = {
  // Warm, welcoming (C major 7)
  welcome: [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.B4],
  // Deep wisdom (C minor with bass) - Eb3 = 155.56 Hz
  wisdom: [NOTES.C2, NOTES.C3, 155.56, NOTES.G3],
  // Grounded presence (Perfect fifth)
  presence: [NOTES.C3, NOTES.G3, NOTES.C4],
  // Hopeful rising (F major)
  hope: [NOTES.F3, NOTES.A3, NOTES.C4, NOTES.F4],
  // Gentle triumph (G major)
  triumph: [NOTES.G3, NOTES.B3, NOTES.D4, NOTES.G4],
  // Peaceful resolution (C major, spread)
  peace: [NOTES.C3, NOTES.G3, NOTES.E4, NOTES.C5],
  // Introspective (A minor 7)
  introspection: [NOTES.A3, NOTES.C4, NOTES.E4, NOTES.G4],
  // Dawn breaking (D major) - F#4 = 369.99 Hz
  dawn: [NOTES.D3, NOTES.A3, NOTES.D4, 369.99],
};

// Haptic patterns (duration arrays in ms)
export const HAPTICS = {
  // Soft tap - like a heartbeat
  tap: [10],
  // Gentle pulse - acknowledgment
  pulse: [20, 30, 20],
  // Rising energy - building
  rise: [10, 20, 10, 30, 10, 40],
  // Warm embrace - achievement
  embrace: [30, 50, 80, 50, 30],
  // Single deep - grounding
  ground: [80],
  // Breathing pattern - meditation
  breathe: [100, 200, 100, 400, 100, 200, 100],
  // Celebration - triumph
  celebrate: [20, 40, 20, 40, 20, 100, 50, 150],
  // Transition - movement
  transition: [15, 30, 15],
};

// Create convolver for reverb
export function createReverb(ctx: AudioContext, decay: number = 2): ConvolverNode {
  const convolver = ctx.createConvolver();
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * decay;
  const impulse = ctx.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      // Exponential decay with random noise
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }

  convolver.buffer = impulse;
  return convolver;
}

// Create a soft low-pass filter for warmth
export function createWarmthFilter(ctx: AudioContext, frequency: number = 2000): BiquadFilterNode {
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = frequency;
  filter.Q.value = 0.7; // Gentle roll-off
  return filter;
}

// Play haptic pattern
export function playHaptic(pattern: number[]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Haptics not supported or blocked
    }
  }
}

// Stop haptic
export function stopHaptic(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(0);
    } catch {
      // Ignore
    }
  }
}

// Create breathing oscillator (LFO modulated)
export function createBreathingTone(
  ctx: AudioContext,
  frequency: number,
  breathRate: number = 0.15 // Breaths per second (slow, meditative)
): { oscillator: OscillatorNode; gain: GainNode; lfo: OscillatorNode } {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;

  lfo.type = 'sine';
  lfo.frequency.value = breathRate;

  // LFO modulates the gain (breathing effect)
  lfoGain.gain.value = 0.3; // Depth of breathing
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);

  oscillator.connect(gain);

  return { oscillator, gain, lfo };
}

// Generate brown noise (deeper, more natural than pink)
export function createBrownNoise(ctx: AudioContext, duration: number = 2): AudioBuffer {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5; // Normalize
  }

  return buffer;
}

// Generate ocean-like noise with waves
export function createOceanNoise(ctx: AudioContext, duration: number = 10): AudioBuffer {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate); // Stereo

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let lastOut = 0;

    for (let i = 0; i < bufferSize; i++) {
      // Brown noise base
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;

      // Wave modulation (slow sine wave for ebb and flow)
      const wavePhase = (i / ctx.sampleRate) * 0.08; // Very slow
      const wave = Math.sin(wavePhase * Math.PI * 2) * 0.5 + 0.5;

      // Add slight stereo variation
      const stereoOffset = channel === 0 ? 0 : Math.PI * 0.25;
      const stereoWave = Math.sin(wavePhase * Math.PI * 2 + stereoOffset) * 0.5 + 0.5;

      data[i] = lastOut * 2 * stereoWave * wave;
    }
  }

  return buffer;
}

// Emotional moment types
export type EmotionalMoment =
  | 'arrival'       // Entering the app/lesson
  | 'wisdom'        // Wisdom text appears
  | 'presence'      // Action/practice begins
  | 'reflection'    // Reflection phase
  | 'insight'       // User has a realization
  | 'completion'    // Lesson complete
  | 'milestone'     // Streak/achievement
  | 'celebration'   // Major achievement
  | 'transition'    // Moving between phases
  | 'keystroke'     // Typing during reflection
  | 'silence';      // Intentional pause

// Silence durations (when NOT to play sound)
export const SILENCE_MOMENTS = {
  // After displaying wisdom - let it sink in
  afterWisdom: 2000,
  // Before a major reveal
  beforeReveal: 1500,
  // Between lesson phases
  betweenPhases: 1000,
  // After completion - moment of stillness
  afterCompletion: 3000,
};

// Volume levels (intentionally quiet)
export const VOLUMES = {
  ambient: 0.04,      // Barely perceptible background
  subtle: 0.08,       // Soft accents
  present: 0.12,      // Noticeable but not loud
  moment: 0.18,       // Important moments
  celebration: 0.22,  // Peak emotional moments
};

// Default export for convenience
export default {
  NOTES,
  CHORDS,
  HAPTICS,
  VOLUMES,
  SILENCE_MOMENTS,
  createReverb,
  createWarmthFilter,
  createBreathingTone,
  createBrownNoise,
  createOceanNoise,
  playHaptic,
  stopHaptic,
};
