'use client';

// ============================================================================
// USE BREATHING GUIDE - Synchronized breathing with audio and visuals
// ============================================================================
//
// FIXED VERSION - Removed circular dependencies that caused infinite loops
//
// Key changes:
// 1. Use refs for all values accessed in animation loop
// 2. Single animation loop that reads from refs, not state
// 3. State updates batched and controlled
// ============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudio } from './useAudio';

export type BreathingPattern = {
  name: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
};

export type BreathPhase = 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

export const BREATHING_PATTERNS: Record<string, BreathingPattern> = {
  'box': { name: 'Box Breathing', inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
  '4-7-8': { name: '4-7-8 Relaxation', inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
  'coherent': { name: 'Coherent Breathing', inhale: 5, holdIn: 0, exhale: 5, holdOut: 0 },
  'energize': { name: 'Energizing', inhale: 2, holdIn: 1, exhale: 4, holdOut: 0 },
  'calm': { name: 'Calming', inhale: 4, holdIn: 2, exhale: 6, holdOut: 2 },
  'simple': { name: 'Simple Breath', inhale: 4, holdIn: 0, exhale: 4, holdOut: 0 },
};

interface UseBreathingGuideOptions {
  pattern?: keyof typeof BREATHING_PATTERNS | BreathingPattern;
  cycles?: number;
  playSounds?: boolean;
  playBowlOnStart?: boolean;
  playBowlOnEnd?: boolean;
  onCycleComplete?: () => void;
  onComplete?: () => void;
  onPhaseChange?: (phase: BreathPhase) => void;
}

interface BreathingGuideState {
  phase: BreathPhase;
  progress: number;
  cycleCount: number;
  totalDuration: number;
  isActive: boolean;
  isPaused: boolean;
  instruction: string;
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

  // ALL animation state stored in refs to avoid dependency issues
  const animationRef = useRef<number | null>(null);
  const phaseStartRef = useRef<number>(0);
  const isActiveRef = useRef(false);
  const isPausedRef = useRef(false);
  const currentPhaseRef = useRef<BreathPhase>('idle');
  const cycleCountRef = useRef(0);
  const pauseTimeRef = useRef<number>(0);

  // Store callbacks in refs
  const onCompleteRef = useRef(onComplete);
  const onCycleCompleteRef = useRef(onCycleComplete);
  const onPhaseChangeRef = useRef(onPhaseChange);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onCycleCompleteRef.current = onCycleComplete;
    onPhaseChangeRef.current = onPhaseChange;
  }, [onComplete, onCycleComplete, onPhaseChange]);

  // Get the pattern config
  const getPattern = useCallback((): BreathingPattern => {
    if (typeof pattern === 'string') {
      return BREATHING_PATTERNS[pattern] || BREATHING_PATTERNS['box'];
    }
    return pattern;
  }, [pattern]);

  const getInstruction = (phase: BreathPhase): string => {
    switch (phase) {
      case 'inhale': return 'Breathe in...';
      case 'holdIn': return 'Hold...';
      case 'exhale': return 'Breathe out...';
      case 'holdOut': return 'Hold...';
      default: return 'Ready to begin';
    }
  };

  const getNextPhase = (currentPhase: BreathPhase, patternConfig: BreathingPattern): BreathPhase => {
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
  };

  const getPhaseDuration = (phase: BreathPhase, patternConfig: BreathingPattern): number => {
    switch (phase) {
      case 'inhale': return patternConfig.inhale;
      case 'holdIn': return patternConfig.holdIn;
      case 'exhale': return patternConfig.exhale;
      case 'holdOut': return patternConfig.holdOut;
      default: return 0;
    }
  };

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

  // Animation loop - reads ONLY from refs, never from state
  const animate = useCallback((timestamp: number) => {
    // Read from refs, not state
    if (!isActiveRef.current || isPausedRef.current) {
      animationRef.current = null;
      return;
    }

    const patternConfig = getPattern();
    const elapsed = (timestamp - phaseStartRef.current) / 1000;
    const currentPhase = currentPhaseRef.current;
    const phaseDuration = getPhaseDuration(currentPhase, patternConfig);

    if (elapsed >= phaseDuration) {
      // Phase complete - move to next
      const nextPhase = getNextPhase(currentPhase, patternConfig);
      const isNewCycle = nextPhase === 'inhale' && currentPhase !== 'idle';

      if (isNewCycle) {
        cycleCountRef.current += 1;
        onCycleCompleteRef.current?.();
      }

      // Check if we've completed all cycles
      if (cycles > 0 && cycleCountRef.current >= cycles && nextPhase === 'inhale') {
        // Complete!
        if (playBowlOnEnd) {
          audio.playSingingBowl();
        }

        isActiveRef.current = false;
        currentPhaseRef.current = 'idle';
        animationRef.current = null;

        setState({
          phase: 'idle',
          progress: 0,
          cycleCount: cycleCountRef.current,
          totalDuration: 0,
          isActive: false,
          isPaused: false,
          instruction: 'Complete',
        });

        onCompleteRef.current?.();
        return;
      }

      // Start new phase
      const nextDuration = getPhaseDuration(nextPhase, patternConfig);
      phaseStartRef.current = timestamp;
      currentPhaseRef.current = nextPhase;

      playSoundForPhase(nextPhase, nextDuration);
      onPhaseChangeRef.current?.(nextPhase);

      setState({
        phase: nextPhase,
        progress: 0,
        cycleCount: cycleCountRef.current,
        totalDuration: nextDuration,
        isActive: true,
        isPaused: false,
        instruction: getInstruction(nextPhase),
      });
    } else {
      // Just update progress - use functional update to avoid stale state
      const progress = Math.min(elapsed / phaseDuration, 1);
      setState(prev => ({
        ...prev,
        progress,
      }));
    }

    // Continue animation loop
    animationRef.current = requestAnimationFrame(animate);
  }, [getPattern, cycles, playBowlOnEnd, audio, playSoundForPhase]);

  // Start the breathing exercise
  const start = useCallback(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const patternConfig = getPattern();
    const firstDuration = getPhaseDuration('inhale', patternConfig);

    // Reset refs
    isActiveRef.current = false;
    isPausedRef.current = false;
    currentPhaseRef.current = 'inhale';
    cycleCountRef.current = 0;

    // Play singing bowl
    if (playBowlOnStart) {
      audio.playSingingBowl();
    }

    // Small delay then start
    const startDelay = playBowlOnStart ? 1500 : 100;

    setTimeout(() => {
      const now = performance.now();
      phaseStartRef.current = now;
      isActiveRef.current = true;

      playSoundForPhase('inhale', firstDuration);
      onPhaseChangeRef.current?.('inhale');

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
    }, startDelay);
  }, [getPattern, playBowlOnStart, audio, playSoundForPhase, animate]);

  // Pause
  const pause = useCallback(() => {
    pauseTimeRef.current = performance.now();
    isPausedRef.current = true;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setState(prev => ({ ...prev, isPaused: true }));
  }, []);

  // Resume
  const resume = useCallback(() => {
    if (!isPausedRef.current) return;

    const pauseDuration = performance.now() - pauseTimeRef.current;
    phaseStartRef.current += pauseDuration;
    isPausedRef.current = false;

    setState(prev => ({ ...prev, isPaused: false }));
    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  // Stop
  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    isActiveRef.current = false;
    isPausedRef.current = false;
    currentPhaseRef.current = 'idle';
    cycleCountRef.current = 0;

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
    if (!isActiveRef.current) {
      start();
    } else if (isPausedRef.current) {
      resume();
    } else {
      pause();
    }
  }, [start, resume, pause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  return {
    ...state,
    patternName: getPattern().name,
    start,
    pause,
    resume,
    stop,
    toggle,
    patterns: BREATHING_PATTERNS,
    getPattern,
  };
}

export default useBreathingGuide;
