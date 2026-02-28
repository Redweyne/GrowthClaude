'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { playUILoop, playUI } from '@/lib/audioEngine';

interface Point {
  x: number;
  y: number;
}

interface UseCrossOffOptions {
  cardRef: React.RefObject<HTMLDivElement | null>;
  onComplete: () => void;
  enabled?: boolean;
  completionThreshold?: number; // percentage of width, default 80
}

export function useCrossOff({
  cardRef,
  onComplete,
  enabled = true,
  completionThreshold = 80,
}: UseCrossOffOptions) {
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [progress, setProgress] = useState(0);

  const isTouching = useRef(false);
  const audioLoopRef = useRef<{ stop: () => void } | null>(null);
  const hapticIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const stopFeedback = useCallback(() => {
    if (audioLoopRef.current) {
      audioLoopRef.current.stop();
      audioLoopRef.current = null;
    }
    if (hapticIntervalRef.current) {
      clearInterval(hapticIntervalRef.current);
      hapticIntervalRef.current = null;
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(0); } catch {}
    }
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setProgress(0);
    isTouching.current = false;
    stopFeedback();
  }, [stopFeedback]);

  const getRelativePoint = useCallback((e: PointerEvent): Point => {
    const card = cardRef.current;
    if (!card) return { x: 0, y: 0 };
    const rect = card.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, [cardRef]);

  const onPointerDown = useCallback((e: PointerEvent) => {
    if (!enabled || completedRef.current) return;
    e.preventDefault();

    const point = getRelativePoint(e);
    isTouching.current = true;
    setIsActive(true);
    setStartPoint(point);
    setCurrentPoint(point);
    setProgress(0);

    // Capture pointer for smooth tracking
    try {
      (e.target as HTMLElement)?.setPointerCapture(e.pointerId);
    } catch {}

    // Start continuous audio loop
    try {
      audioLoopRef.current = playUILoop('scratchLoop');
    } catch {}

    // Start INTENSE continuous haptic — 30ms vibration every 50ms
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      hapticIntervalRef.current = setInterval(() => {
        try { navigator.vibrate(30); } catch {}
      }, 50);
    }
  }, [enabled, getRelativePoint]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isTouching.current || completedRef.current) return;
    e.preventDefault();

    const point = getRelativePoint(e);
    setCurrentPoint(point);

    // Calculate progress as horizontal distance percentage
    const card = cardRef.current;
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width;

    // Use startPoint from state via ref workaround
    const start = startPoint;
    if (!start) return;

    const horizontalDistance = Math.abs(point.x - start.x);
    const newProgress = Math.min(100, (horizontalDistance / cardWidth) * 100);
    setProgress(newProgress);

    // Check completion
    if (newProgress >= completionThreshold) {
      completedRef.current = true;
      isTouching.current = false;
      setIsComplete(true);
      setIsActive(false);
      stopFeedback();

      // Fire celebration burst vibration
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate([40, 30, 60, 30, 80]); } catch {}
      }

      // Pre-play chime so it layers with the celebrate sound from parent
      try { playUI('chime'); } catch {}

      onComplete();
    }
  }, [cardRef, completionThreshold, onComplete, stopFeedback, startPoint]);

  const onPointerUp = useCallback(() => {
    if (!isTouching.current) return;
    // Not complete — reset everything, line disappears
    reset();
  }, [reset]);

  const onPointerCancel = useCallback(() => {
    reset();
  }, [reset]);

  // Attach pointer events
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !enabled) return;

    card.addEventListener('pointerdown', onPointerDown, { passive: false });
    card.addEventListener('pointermove', onPointerMove, { passive: false });
    card.addEventListener('pointerup', onPointerUp);
    card.addEventListener('pointercancel', onPointerCancel);

    // Prevent scrolling while crossing off
    const preventScroll = (e: TouchEvent) => {
      if (isTouching.current) {
        e.preventDefault();
      }
    };
    card.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      card.removeEventListener('pointerdown', onPointerDown);
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerup', onPointerUp);
      card.removeEventListener('pointercancel', onPointerCancel);
      card.removeEventListener('touchmove', preventScroll);
      stopFeedback();
    };
  }, [cardRef, enabled, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, stopFeedback]);

  return {
    isActive,
    isComplete,
    startPoint,
    currentPoint,
    progress,
  };
}
