'use client';

import { useCallback, useRef, useEffect } from 'react';
import { playUILoop } from '@/lib/audioEngine';

interface Point {
  x: number;
  y: number;
}

interface UseScratchInteractionOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  lineWidth?: number;
  completionThreshold?: number;
  onProgress?: (coverage: number) => void;
  onComplete?: () => void;
  enabled?: boolean;
}

export function useScratchInteraction({
  canvasRef,
  lineWidth = 45,
  completionThreshold = 65,
  onProgress,
  onComplete,
  enabled = true,
}: UseScratchInteractionOptions) {
  const isScratching = useRef(false);
  const lastPoint = useRef<Point | null>(null);
  const moveCount = useRef(0);
  const audioLoopRef = useRef<{ stop: () => void } | null>(null);
  const hapticIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCompleted = useRef(false);
  const coverageRef = useRef(0);

  const getCanvasPoint = useCallback((e: PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, [canvasRef]);

  const drawScratchLine = useCallback((from: Point, to: Point) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }, [canvasRef, lineWidth]);

  const calculateCoverage = useCallback((): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    let total = 0;

    // Sample every 4th pixel in both x and y (16x faster)
    for (let i = 3; i < pixels.length; i += 16) {
      total++;
      if (pixels[i] === 0) transparent++;
    }

    return total > 0 ? (transparent / total) * 100 : 0;
  }, [canvasRef]);

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

  const onPointerDown = useCallback((e: PointerEvent) => {
    if (!enabled || hasCompleted.current) return;
    e.preventDefault();

    isScratching.current = true;
    lastPoint.current = getCanvasPoint(e);
    moveCount.current = 0;

    // Start continuous audio
    try {
      audioLoopRef.current = playUILoop('scratchLoop');
    } catch {}

    // Start continuous haptic (every 80ms)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      hapticIntervalRef.current = setInterval(() => {
        try { navigator.vibrate(15); } catch {}
      }, 80);
    }

    // Capture pointer for smooth tracking outside element
    try {
      (e.target as HTMLElement)?.setPointerCapture(e.pointerId);
    } catch {}
  }, [enabled, getCanvasPoint, stopFeedback]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isScratching.current || !lastPoint.current || hasCompleted.current) return;
    e.preventDefault();

    const point = getCanvasPoint(e);
    drawScratchLine(lastPoint.current, point);
    lastPoint.current = point;
    moveCount.current++;

    // Recalculate coverage every 5th move
    if (moveCount.current % 5 === 0) {
      const coverage = calculateCoverage();
      coverageRef.current = coverage;
      onProgress?.(coverage);

      if (coverage >= completionThreshold) {
        hasCompleted.current = true;
        isScratching.current = false;
        stopFeedback();
        onComplete?.();
      }
    }
  }, [getCanvasPoint, drawScratchLine, calculateCoverage, completionThreshold, onProgress, onComplete, stopFeedback]);

  const onPointerUp = useCallback(() => {
    isScratching.current = false;
    lastPoint.current = null;
    stopFeedback();
  }, [stopFeedback]);

  const onPointerCancel = useCallback(() => {
    isScratching.current = false;
    lastPoint.current = null;
    stopFeedback();
  }, [stopFeedback]);

  // Attach pointer events to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
    canvas.addEventListener('pointermove', onPointerMove, { passive: false });
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);

    // Prevent scrolling while scratching
    const preventScroll = (e: TouchEvent) => {
      if (isScratching.current) {
        e.preventDefault();
      }
    };
    canvas.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('touchmove', preventScroll);
      stopFeedback();
    };
  }, [canvasRef, enabled, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, stopFeedback]);

  // Reset completion state
  const reset = useCallback(() => {
    hasCompleted.current = false;
    coverageRef.current = 0;
    moveCount.current = 0;
  }, []);

  return {
    isScratching: isScratching.current,
    coverage: coverageRef.current,
    reset,
  };
}
