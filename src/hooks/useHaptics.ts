'use client';

// ═══════════════════════════════════════════════════════════════════════════
// HAPTIC FEEDBACK HOOK - MOBILE SENSORY ENHANCEMENT
// ═══════════════════════════════════════════════════════════════════════════
//
// Adds subtle haptic feedback at key moments to make the app feel more
// native and satisfying on mobile devices.
//
// Uses the Vibration API with graceful fallback for unsupported devices.
//
// Patterns inspired by Apple's haptic design guidelines:
// - Light: Selection/navigation (10ms)
// - Medium: Success/confirmation (20ms)
// - Heavy: Major milestone/celebration (30-50ms)
// - Pattern: Complex feedback (array of on/off times)
//
// ═══════════════════════════════════════════════════════════════════════════

import { useCallback, useRef } from 'react';

// Check if vibration is supported
const isVibrationSupported = () => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
};

// Haptic pattern definitions
const HAPTIC_PATTERNS = {
  // Light touch - for selections, navigation
  light: [10],

  // Medium - for confirmations, button presses
  medium: [20],

  // Success - for completing actions
  success: [15, 50, 25],

  // Heavy - for major milestones
  heavy: [40],

  // Celebration - for milestones, level ups
  celebration: [20, 30, 20, 30, 40],

  // Wisdom reveal - gentle pulsing for insights
  wisdom: [10, 50, 10, 50, 20],

  // Error/warning - distinctive pattern
  warning: [50, 30, 50],

  // Heartbeat - for emotional moments
  heartbeat: [30, 100, 40, 200, 30, 100, 40],

  // Gentle tap - very subtle
  tap: [5],

  // Double tap
  doubleTap: [10, 30, 10],
};

type HapticType = keyof typeof HAPTIC_PATTERNS;

export function useHaptics() {
  const lastHapticTime = useRef(0);
  const minInterval = 50; // Prevent haptic spam

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!isVibrationSupported()) return false;

    const now = Date.now();
    if (now - lastHapticTime.current < minInterval) return false;

    lastHapticTime.current = now;

    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }, []);

  // Trigger a specific haptic pattern
  const haptic = useCallback((type: HapticType) => {
    const pattern = HAPTIC_PATTERNS[type];
    return vibrate(pattern);
  }, [vibrate]);

  // Custom pattern
  const customHaptic = useCallback((pattern: number[]) => {
    return vibrate(pattern);
  }, [vibrate]);

  // Stop any ongoing vibration
  const stopHaptic = useCallback(() => {
    if (isVibrationSupported()) {
      navigator.vibrate(0);
    }
  }, []);

  // Convenience methods for common actions
  const hapticLight = useCallback(() => haptic('light'), [haptic]);
  const hapticMedium = useCallback(() => haptic('medium'), [haptic]);
  const hapticSuccess = useCallback(() => haptic('success'), [haptic]);
  const hapticHeavy = useCallback(() => haptic('heavy'), [haptic]);
  const hapticCelebration = useCallback(() => haptic('celebration'), [haptic]);
  const hapticWisdom = useCallback(() => haptic('wisdom'), [haptic]);
  const hapticTap = useCallback(() => haptic('tap'), [haptic]);
  const hapticWarning = useCallback(() => haptic('warning'), [haptic]);

  return {
    // General haptic trigger
    haptic,
    customHaptic,
    stopHaptic,

    // Convenience methods
    hapticLight,
    hapticMedium,
    hapticSuccess,
    hapticHeavy,
    hapticCelebration,
    hapticWisdom,
    hapticTap,
    hapticWarning,

    // Check support
    isSupported: isVibrationSupported(),
  };
}

export default useHaptics;
