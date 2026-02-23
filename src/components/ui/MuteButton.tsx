'use client';

// ============================================================================
// MUTE BUTTON - Simple mute toggle for lessons
// ============================================================================
// A minimal floating button to mute/unmute all audio.
// iOS Safari Safe: Uses proper touch event handling.
// ============================================================================

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { useStore } from '@/store/useStore';

export function MuteButton() {
  const { soundEnabled, setSoundEnabled } = useStore();
  const { stopAllAudio } = useAudio();
  const isOperatingRef = useRef(false);
  
  // Debounce to prevent double-firing on iOS
  const lastInteractionRef = useRef<number>(0);
  const DEBOUNCE_MS = 300;

  const shouldIgnoreEvent = useCallback(() => {
    const now = Date.now();
    if (now - lastInteractionRef.current < DEBOUNCE_MS) {
      return true;
    }
    lastInteractionRef.current = now;
    return false;
  }, []);

  // Toggle sound with iOS safety
  const toggleSound = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (shouldIgnoreEvent()) return;
    if (isOperatingRef.current) return;
    isOperatingRef.current = true;

    try {
      if (soundEnabled) {
        // Use immediate=true for instant mute feedback
        // This stops all audio immediately without fade delay
        stopAllAudio(true);
      }
      setSoundEnabled(!soundEnabled);
    } catch (err) {
      console.warn('[MuteButton] Error toggling sound:', err);
    }

    setTimeout(() => {
      isOperatingRef.current = false;
    }, 300);
  }, [soundEnabled, setSoundEnabled, stopAllAudio, shouldIgnoreEvent]);

  return (
    <motion.button
      type="button"
      onClick={toggleSound}
      onTouchEnd={toggleSound}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        fixed bottom-4 left-4 z-[999]
        w-12 h-12 rounded-full
        flex items-center justify-center
        transition-colors shadow-lg
        ${soundEnabled
          ? 'bg-stone-900/90 light:bg-stone-100/90 border border-stone-700/50 light:border-stone-300 text-stone-400 light:text-stone-700 hover:text-cyan-400 hover:border-cyan-500/30'
          : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300'
        }
      `}
      aria-label={soundEnabled ? 'Mute audio' : 'Unmute audio'}
    >
      {soundEnabled ? (
        <Volume2 size={20} />
      ) : (
        <VolumeX size={20} />
      )}
    </motion.button>
  );
}

export default MuteButton;
