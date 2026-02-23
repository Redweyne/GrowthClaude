'use client';

// ═══════════════════════════════════════════════════════════════════════════
// USE KEYBOARD AWARE — Mobile Virtual Keyboard Detection
// ═══════════════════════════════════════════════════════════════════════════
//
// Uses the visualViewport API to detect when the mobile virtual keyboard
// opens, returning the keyboard height and a scroll utility so inputs
// always stay visible during typing.
//
// - keyboardHeight: pixels the keyboard occupies (0 when closed)
// - isKeyboardOpen: boolean convenience flag
// - scrollInputIntoView: call on input focus to keep it visible
//
// Falls back gracefully on desktop where visualViewport height stays constant.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState, useCallback } from 'react';

interface KeyboardAwareState {
  keyboardHeight: number;
  isKeyboardOpen: boolean;
  scrollInputIntoView: (element: HTMLElement | null) => void;
}

export function useKeyboardAware(): KeyboardAwareState {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const viewport = window.visualViewport;

    const handleViewportChange = () => {
      const windowHeight = window.innerHeight;
      const viewportHeight = viewport.height ?? windowHeight;
      const heightDiff = windowHeight - viewportHeight;

      // A diff > 100px reliably indicates the virtual keyboard is open
      if (heightDiff > 100) {
        setKeyboardHeight(heightDiff);
        setIsKeyboardOpen(true);
      } else {
        setKeyboardHeight(0);
        setIsKeyboardOpen(false);
      }
    };

    viewport.addEventListener('resize', handleViewportChange);
    viewport.addEventListener('scroll', handleViewportChange);

    return () => {
      viewport.removeEventListener('resize', handleViewportChange);
      viewport.removeEventListener('scroll', handleViewportChange);
    };
  }, []);

  const scrollInputIntoView = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, []);

  return { keyboardHeight, isKeyboardOpen, scrollInputIntoView };
}

export default useKeyboardAware;
