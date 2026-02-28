'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useScratchInteraction } from '@/hooks/useScratchInteraction';

interface ScratchCanvasProps {
  width: number;
  height: number;
  onProgress: (coverage: number) => void;
  onComplete: () => void;
  enabled?: boolean;
  initialProgress?: number;
}

export function ScratchCanvas({
  width,
  height,
  onProgress,
  onComplete,
  enabled = true,
  initialProgress = 0,
}: ScratchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useRef(false);

  // Fill canvas with the scratch cover layer
  const fillCover = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width * 2;  // 2x for retina
    canvas.height = height * 2;

    ctx.scale(2, 2);

    // Create a subtle gradient cover
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#2c2520');   // warm dark brown
    gradient.addColorStop(0.5, '#33302b'); // slightly lighter
    gradient.addColorStop(1, '#292524');   // stone-800

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add a subtle noise/texture pattern
    ctx.globalAlpha = 0.06;
    for (let x = 0; x < width; x += 3) {
      for (let y = 0; y < height; y += 3) {
        if (Math.random() > 0.5) {
          ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    ctx.globalAlpha = 1;

    // Add subtle "scratch here" hint lines
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.08)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      const y = height * 0.2 + (height * 0.6 * i / 4);
      ctx.beginPath();
      ctx.setLineDash([4, 8]);
      ctx.moveTo(width * 0.15, y);
      ctx.lineTo(width * 0.85, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // If there was prior scratch progress, simulate it
    if (initialProgress > 0) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
      // Erase random patches proportional to prior progress
      const patches = Math.floor(initialProgress / 5);
      for (let i = 0; i < patches; i++) {
        const px = Math.random() * width;
        const py = Math.random() * height;
        ctx.beginPath();
        ctx.arc(px, py, 20 + Math.random() * 15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
  }, [width, height, initialProgress]);

  useEffect(() => {
    if (!initialized.current && width > 0 && height > 0) {
      fillCover();
      initialized.current = true;
    }
  }, [width, height, fillCover]);

  useScratchInteraction({
    canvasRef,
    onProgress,
    onComplete,
    enabled,
    lineWidth: 45,
    completionThreshold: 65,
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        touchAction: 'none',
        cursor: enabled ? 'crosshair' : 'default',
      }}
    />
  );
}
