'use client';

// ============================================================================
// USE BREATHING GUIDE - Synchronized breathing with audio and visuals
// ============================================================================
//
// A hook that provides breathing exercise functionality with:
// - Customizable breath patterns (inhale, hold, exhale, hold)
// - Audio tones synced to each phase
// - Visual animation sync values (0-1 for each phase)
// - Singing bowl sounds at start/end
// - Haptic feedback on phase changes
//
// Example usage:
//   const { 
//     phase, progress, isActive, 
//     start, pause, stop 
//   } = useBreathingGuide({ pattern: '4-7-8' });
// ============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudio } from './useAudio';

export type BreathingPattern = {
  name: string;
  inhale: number;    // seconds
  holdIn: number;    // seconds (hold after inhale)
  exhale: number;    // seconds
  holdOut: number;   // seconds (hold after exhale)
};

export type BreathPhase = 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

// Common breathing patterns
export const BREATHING_PATTERNS: Record<string, BreathingPattern> = {
  // Box breathing - equal phases, great for focus
  'box': { name: 'Box Breathing', inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
  
  // 4-7-8 technique - relaxation and sleep
  '4-7-8': { name: '4-7-8 Relaxation', inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
  
  // Coherent breathing - 5 breaths per minute, heart coherence
  'coherent': { name: 'Coherent Breathing', inhale: 5, holdIn: 0, exhale: 5, holdOut: 0 },
  
  // Energizing breath - quick inhale, slow exhale
  'energize': { name: 'Energizing', inhale: 2, holdIn: 1, exhale: 4, holdOut: 0 },
  
  // Calming breath - slow and extended exhale
  'calm': { name: 'Calming', inhale: 4, holdIn: 2, exhale: 6, holdOut: 2 },
  
  // Simple for beginners
  'simple': { name: 'Simple Breath', inhale: 4, holdIn: 0, exhale: 4, holdOut: 0 },
};

interface UseBreathingGuideOptions {
  pattern?: keyof typeof BREATHING_PATTERNS | BreathingPattern;
  cycles?: number;           // Number of breath cycles (0 = infinite)
  playSounds?: boolean;      // Play breathing tones
  playBowlOnStart?: boolean; // Play singing bowl at start
  playBowlOnEnd?: boolean;   // Play singing bowl at end
  onCycleComplete?: () => void;
  onComplete?: () => void;
  onPhaseChange?: (phase: BreathPhase) => void;
}

interface BreathingGuideState {
  phase: BreathPhase;
  progress: number;           // 0-1 progress within current phase
  cycleCount: number;         // Current cycle number
  totalDuration: number;      // Duration of current phase in seconds
  isActive: boolean;
  isPaused: boolean;
  instruction: string;        // e.g., "Breathe in...", "Hold..."
}

export function useBreathingGuide(options: UseBreathingGuideOptions = {}) {
  const {
    pattern = 'box',
    cycles = 0,
    playSounds = true,
    playBowlOnStart = true,
    playBowlOnEnd = true,
    onCycleComplete,
    onComplete,
    onPhaseChange,
  } = options;

  const audio = useAudio();
  
  const [state, setState] = useState<BreathingGuideState>({
    phase: 'idle',
    progress: 0,
    cycleCount: 0,
    totalDuration: 0,
    isActive: false,
    isPaused: false,
    instruction: 'Ready to begin',
  });

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const phaseStartRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);

  // Get the pattern config
  const getPattern = useCallback((): BreathingPattern => {
    if (typeof pattern === 'string') {
      return BREATHING_PATTERNS[pattern] || BREATHING_PATTERNS['box'];
    }
    return pattern;
  }, [pattern]);

  // Get instruction text for phase
  const getInstruction = (phase: BreathPhase): string => {
    switch (phase) {
      case 'inhale': return 'Breathe in...';
      case 'holdIn': return 'Hold...';
      case 'exhale': return 'Breathe out...';
      case 'holdOut': return 'Hold...';
      default: return 'Ready to begin';
    }
  };

  // Get the next phase in sequence
  const getNextPhase = useCallback((currentPhase: BreathPhase, patternConfig: BreathingPattern): BreathPhase => {
    switch (currentPhase) {
      case 'inhale':
        return patternConfig.holdIn > 0 ? 'holdIn' : 'exhale';
      case 'holdIn':
        return 'exhale';
      case 'exhale':
        return patternConfig.holdOut > 0 ? 'holdOut' : 'inhale';
      case 'holdOut':
        return 'inhale';
      default:
        return 'inhale';
    }
  }, []);

  // Get duration for a phase
  const getPhaseDuration = (phase: BreathPhase, patternConfig: BreathingPattern): number => {
    switch (phase) {
      case 'inhale': return patternConfig.inhale;
      case 'holdIn': return patternConfig.holdIn;
      case 'exhale': return patternConfig.exhale;
      case 'holdOut': return patternConfig.holdOut;
      default: return 0;
    }
  };

  // Play sound for phase
  const playSoundForPhase = useCallback((phase: BreathPhase, duration: number) => {
    if (!playSounds) return;
    
    switch (phase) {
      case 'inhale':
        audio.playBreathingTone('inhale', duration);
        break;
      case 'exhale':
        audio.playBreathingTone('exhale', duration);
        break;
      case 'holdIn':
      case 'holdOut':
        if (duration > 0) {
          audio.playBreathingTone('hold', duration);
        }
        break;
    }
  }, [audio, playSounds]);

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!state.isActive || state.isPaused) return;

    const patternConfig = getPattern();
    const elapsed = (timestamp - phaseStartRef.current) / 1000;
    const phaseDuration = getPhaseDuration(state.phase, patternConfig);
    
    if (elapsed >= phaseDuration) {
      // Phase complete - move to next
      const nextPhase = getNextPhase(state.phase, patternConfig);
      const isNewCycle = nextPhase === 'inhale' && state.phase !== 'idle';
      const newCycleCount = isNewCycle ? state.cycleCount + 1 : state.cycleCount;

      // Check if we've completed all cycles
      if (cycles > 0 && newCycleCount >= cycles && nextPhase === 'inhale') {
        // Complete!
        if (playBowlOnEnd) {
          audio.playSingingBowl();
        }
        onComplete?.();
        setState(prev => ({
          ...prev,
          phase: 'idle',
          progress: 0,
          isActive: false,
          instruction: 'Complete',
        }));
        return;
      }

      // Cycle callback
      if (isNewCycle) {
        onCycleComplete?.();
      }

      // Start new phase
      const nextDuration = getPhaseDuration(nextPhase, patternConfig);
      phaseStartRef.current = timestamp;
      playSoundForPhase(nextPhase, nextDuration);
      onPhaseChange?.(nextPhase);

      setState(prev => ({
        ...prev,
        phase: nextPhase,
        progress: 0,
        cycleCount: newCycleCount,
        totalDuration: nextDuration,
        instruction: getInstruction(nextPhase),
      }));
    } else {
      // Update progress
      setState(prev => ({
        ...prev,
        progress: Math.min(elapsed / phaseDuration, 1),
      }));
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [
    state.isActive, state.isPaused, state.phase, state.cycleCount,
    getPattern, getNextPhase, playSoundForPhase, cycles,
    playBowlOnEnd, audio, onComplete, onCycleComplete, onPhaseChange
  ]);

  // Start the breathing exercise
  const start = useCallback(() => {
    const patternConfig = getPattern();
    const firstDuration = getPhaseDuration('inhale', patternConfig);

    // Play singing bowl
    if (playBowlOnStart) {
      audio.playSingingBowl();
    }

    // Small delay then start
    setTimeout(() => {
      const now = performance.now();
      startTimeRef.current = now;
      phaseStartRef.current = now;

      playSoundForPhase('inhale', firstDuration);
      onPhaseChange?.('inhale');

      setState({
        phase: 'inhale',
        progress: 0,
        cycleCount: 0,
        totalDuration: firstDuration,
        isActive: true,
        isPaused: false,
        instruction: getInstruction('inhale'),
      });

      animationRef.current = requestAnimationFrame(animate);
    }, playBowlOnStart ? 1500 : 100);
  }, [getPattern, playBowlOnStart, audio, playSoundForPhase, onPhaseChange, animate]);

  // Pause
  const pause = useCallback(() => {
    pauseTimeRef.current = performance.now();
    setState(prev => ({ ...prev, isPaused: true }));
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // Resume
  const resume = useCallback(() => {
    if (!state.isPaused) return;
    
    const pauseDuration = performance.now() - pauseTimeRef.current;
    phaseStartRef.current += pauseDuration;
    
    setState(prev => ({ ...prev, isPaused: false }));
    animationRef.current = requestAnimationFrame(animate);
  }, [state.isPaused, animate]);

  // Stop
  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setState({
      phase: 'idle',
      progress: 0,
      cycleCount: 0,
      totalDuration: 0,
      isActive: false,
      isPaused: false,
      instruction: 'Ready to begin',
    });
  }, []);

  // Toggle between start/pause/resume
  const toggle = useCallback(() => {
    if (!state.isActive) {
      start();
    } else if (state.isPaused) {
      resume();
    } else {
      pause();
    }
  }, [state.isActive, state.isPaused, start, resume, pause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Re-start animation when state changes
  useEffect(() => {
    if (state.isActive && !state.isPaused && !animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [state.isActive, state.isPaused, animate]);

  return {
    // State
    ...state,
    patternName: getPattern().name,
    
    // Controls
    start,
    pause,
    resume,
    stop,
    toggle,
    
    // Utilities
    patterns: BREATHING_PATTERNS,
    getPattern,
  };
}

export default useBreathingGuide;
