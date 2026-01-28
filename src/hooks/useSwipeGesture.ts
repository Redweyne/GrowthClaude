'use client';

// ═══════════════════════════════════════════════════════════════════════════
// SWIPE GESTURE HOOK - NATURAL MOBILE NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════
//
// Enables smooth swipe gestures for mobile navigation.
// Swipe up/down to navigate between steps or dismiss content.
//
// Features:
// - Touch event handling with proper iOS Safari support
// - Configurable threshold and direction
// - Prevents accidental swipes during scroll
// - Optional velocity-based triggering
//
// ═══════════════════════════════════════════════════════════════════════════

import { useCallback, useRef, useEffect } from 'react';
import { useHaptics } from './useHaptics';

interface SwipeGestureOptions {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Minimum distance to trigger swipe (px)
  velocityThreshold?: number; // Minimum velocity to trigger swipe (px/ms)
  enabled?: boolean;
  preventDefault?: boolean;
  hapticFeedback?: boolean;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  currentX: number;
  currentY: number;
}

export function useSwipeGesture(
  ref: React.RefObject<HTMLElement | null>,
  options: SwipeGestureOptions
) {
  const {
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
    threshold = 50,
    velocityThreshold = 0.3,
    enabled = true,
    preventDefault = false,
    hapticFeedback = true,
  } = options;

  const touchState = useRef<TouchState | null>(null);
  const { hapticLight, hapticMedium } = useHaptics();

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      const touch = e.touches[0];
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        currentX: touch.clientX,
        currentY: touch.clientY,
      };
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchState.current) return;

      const touch = e.touches[0];
      touchState.current.currentX = touch.clientX;
      touchState.current.currentY = touch.clientY;

      // Only prevent default if we're clearly swiping (not scrolling)
      if (preventDefault) {
        const deltaX = Math.abs(touch.clientX - touchState.current.startX);
        const deltaY = Math.abs(touch.clientY - touchState.current.startY);

        if (deltaX > 10 || deltaY > 10) {
          // Determine if this is a horizontal or vertical swipe
          if (deltaX > deltaY && (onSwipeLeft || onSwipeRight)) {
            e.preventDefault();
          } else if (deltaY > deltaX && (onSwipeUp || onSwipeDown)) {
            e.preventDefault();
          }
        }
      }
    },
    [enabled, preventDefault, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchState.current) return;

      const { startX, startY, startTime, currentX, currentY } = touchState.current;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      const deltaTime = Date.now() - startTime;

      // Calculate velocity (px/ms)
      const velocityX = Math.abs(deltaX) / deltaTime;
      const velocityY = Math.abs(deltaY) / deltaTime;

      // Determine swipe direction
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Only trigger if we meet threshold (distance OR velocity)
      const meetsDistanceThreshold = absX > threshold || absY > threshold;
      const meetsVelocityThreshold = velocityX > velocityThreshold || velocityY > velocityThreshold;

      if (meetsDistanceThreshold || meetsVelocityThreshold) {
        // Determine primary direction
        if (absY > absX) {
          // Vertical swipe
          if (deltaY < 0 && onSwipeUp) {
            if (hapticFeedback) hapticMedium();
            onSwipeUp();
          } else if (deltaY > 0 && onSwipeDown) {
            if (hapticFeedback) hapticLight();
            onSwipeDown();
          }
        } else {
          // Horizontal swipe
          if (deltaX < 0 && onSwipeLeft) {
            if (hapticFeedback) hapticMedium();
            onSwipeLeft();
          } else if (deltaX > 0 && onSwipeRight) {
            if (hapticFeedback) hapticLight();
            onSwipeRight();
          }
        }
      }

      touchState.current = null;
    },
    [enabled, threshold, velocityThreshold, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, hapticFeedback, hapticLight, hapticMedium]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, enabled, handleTouchStart, handleTouchMove, handleTouchEnd, preventDefault]);

  // Return current swipe state for UI feedback
  const getSwipeProgress = useCallback(() => {
    if (!touchState.current) return { x: 0, y: 0 };
    return {
      x: touchState.current.currentX - touchState.current.startX,
      y: touchState.current.currentY - touchState.current.startY,
    };
  }, []);

  return { getSwipeProgress };
}

export default useSwipeGesture;
