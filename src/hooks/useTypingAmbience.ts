'use client';

// ============================================================================
// USE TYPING AMBIENCE - Auto-manages writing ambience for text inputs
// ============================================================================
//
// A hook that automatically starts ambient sounds when the user focuses on
// a text input and stops when they blur. Perfect for journaling, reflection,
// and writing exercises.
//
// Example usage:
//   const { inputRef, isPlaying, setAmbienceType } = useTypingAmbience();
//   return <textarea ref={inputRef} />;
//
// Or with manual control:
//   const { start, stop, isPlaying } = useTypingAmbience({ autoFocus: false });
// ============================================================================

import { useCallback, useRef, useState, useEffect } from 'react';
import { useAudio } from './useAudio';
import { useStore } from '@/store/useStore';
import type { WritingAmbience } from '@/lib/audioEngine';

interface UseTypingAmbienceOptions {
  autoFocus?: boolean;            // Auto-start on focus, stop on blur
  defaultType?: WritingAmbience;  // Default ambience type
  playKeystrokeSounds?: boolean;  // Play subtle keystroke sounds
  startDelay?: number;            // Delay before starting (ms)
  fadeOutOnBlur?: boolean;        // Fade out when blurring
}

export function useTypingAmbience(options: UseTypingAmbienceOptions = {}) {
  const {
    autoFocus = true,
    defaultType = 'rain',
    playKeystrokeSounds = false,
    startDelay = 500,
    fadeOutOnBlur = true,
  } = options;

  const audio = useAudio();
  const { soundEnabled } = useStore();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [ambienceType, setAmbienceType] = useState<WritingAmbience>(defaultType);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
  const startTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastKeystrokeRef = useRef<number>(0);

  // Start ambience
  const start = useCallback((type?: WritingAmbience) => {
    if (!soundEnabled) return;
    
    const targetType = type || ambienceType;
    if (targetType === 'silence') {
      stop();
      return;
    }
    
    audio.startWritingAmbience(targetType);
    setIsPlaying(true);
  }, [audio, soundEnabled, ambienceType]);

  // Stop ambience
  const stop = useCallback(() => {
    audio.stopWritingAmbience();
    setIsPlaying(false);
  }, [audio]);

  // Toggle ambience
  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  // Change ambience type
  const changeType = useCallback((type: WritingAmbience) => {
    setAmbienceType(type);
    if (isPlaying) {
      if (type === 'silence') {
        stop();
      } else {
        audio.startWritingAmbience(type);
      }
    }
  }, [isPlaying, audio, stop]);

  // Handle keystroke sounds
  const handleKeystroke = useCallback(() => {
    if (!playKeystrokeSounds || !soundEnabled) return;
    
    const now = Date.now();
    // Throttle to max 10 keystrokes per second
    if (now - lastKeystrokeRef.current > 100) {
      audio.playKeystroke();
      lastKeystrokeRef.current = now;
    }
  }, [audio, playKeystrokeSounds, soundEnabled]);

  // Focus handler
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    
    if (!autoFocus || !soundEnabled) return;
    
    // Clear any pending timeout
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current);
    }
    
    // Start with delay
    startTimeoutRef.current = setTimeout(() => {
      if (ambienceType !== 'silence') {
        start();
      }
    }, startDelay);
  }, [autoFocus, soundEnabled, startDelay, ambienceType, start]);

  // Blur handler
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    
    // Clear pending start
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }
    
    if (autoFocus && fadeOutOnBlur && isPlaying) {
      stop();
    }
  }, [autoFocus, fadeOutOnBlur, isPlaying, stop]);

  // Handle keydown for keystroke sounds
  const handleKeyDown = useCallback(() => {
    handleKeystroke();
  }, [handleKeystroke]);

  // Attach event listeners to input ref
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    
    if (playKeystrokeSounds) {
      input.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
      input.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleFocus, handleBlur, handleKeyDown, playKeystrokeSounds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
      }
      if (isPlaying) {
        stop();
      }
    };
  }, []);

  // Bind function for spreading onto inputs
  const bind = useCallback(() => ({
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: playKeystrokeSounds ? handleKeyDown : undefined,
  }), [handleFocus, handleBlur, handleKeyDown, playKeystrokeSounds]);

  return {
    // State
    isPlaying,
    isFocused,
    ambienceType,
    
    // Ref to attach to input
    inputRef,
    
    // Manual controls
    start,
    stop,
    toggle,
    
    // Type control
    setAmbienceType: changeType,
    
    // Event handlers (for manual attachment)
    handleFocus,
    handleBlur,
    handleKeystroke,
    
    // Bind function for easy spreading
    bind,
    
    // Available types
    types: ['rain', 'fire', 'forest', 'silence'] as WritingAmbience[],
  };
}

export default useTypingAmbience;
