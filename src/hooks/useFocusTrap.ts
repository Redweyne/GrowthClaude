'use client';

// ═══════════════════════════════════════════════════════════════════════════
// USE FOCUS TRAP — Accessible Modal Focus Management
// ═══════════════════════════════════════════════════════════════════════════
//
// Traps keyboard focus within a container (modal, dialog) while active.
//
// Behaviour:
// - Tab cycles forward through all focusable elements inside the container
// - Shift+Tab cycles backwards
// - Escape calls the optional onEscape callback (e.g. close the modal)
// - On activation: focuses the first focusable element automatically
// - On deactivation: restores focus to the element that was focused before
//
// Usage:
//   const containerRef = useFocusTrap(isOpen, onClose);
//   return <div ref={containerRef}>...</div>;
//
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function useFocusTrap(isActive: boolean, onEscape?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Remember what was focused before the trap activated
    previousFocusRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Focus first focusable element after a short delay (post-animation)
    const focusTimer = setTimeout(() => {
      const firstFocusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
      firstFocusable?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableEls = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      );
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (event.shiftKey) {
        // Shift+Tab: wrap from first → last
        if (document.activeElement === firstEl) {
          event.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab: wrap from last → first
        if (document.activeElement === lastEl) {
          event.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the previously focused element
      if (previousFocusRef.current?.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive, onEscape]);

  return containerRef;
}

export default useFocusTrap;
