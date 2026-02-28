'use client';

import { useMemo, useRef, useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface CrossOffLineProps {
  startPoint: Point | null;
  currentPoint: Point | null;
  isActive: boolean;
  isComplete: boolean;
  progress: number;
  cardWidth: number;
  cardHeight: number;
}

const SPARKLE_COLORS = ['#fbbf24', '#fcd34d', '#fde68a', '#f59e0b'];

export function CrossOffLine({
  startPoint,
  currentPoint,
  isActive,
  isComplete,
  progress,
  cardWidth,
  cardHeight,
}: CrossOffLineProps) {
  const wobbleOffset = useRef(0);
  const lastSparkleProgress = useRef(0);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const sparkleIdRef = useRef(0);

  // Compute wobble once when drag starts
  useEffect(() => {
    if (isActive && startPoint) {
      wobbleOffset.current = (Math.sin(startPoint.x * 7.3 + startPoint.y * 3.7) * 2) - 1;
      lastSparkleProgress.current = 0;
      setSparkles([]);
    }
  }, [isActive, startPoint]);

  // Spawn sparkles along the line as progress increases
  useEffect(() => {
    if (!isActive || !currentPoint) return;

    const progressDelta = progress - lastSparkleProgress.current;
    if (progressDelta >= 8) { // every ~8% of width
      lastSparkleProgress.current = progress;
      sparkleIdRef.current++;
      const newSparkle: Sparkle = {
        id: sparkleIdRef.current,
        x: currentPoint.x,
        y: currentPoint.y,
        size: 2 + Math.random() * 3,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
      };
      setSparkles(prev => [...prev.slice(-12), newSparkle]); // max 12 active sparkles

      // Auto-remove sparkle after animation
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, 450);
    }
  }, [isActive, currentPoint, progress]);

  // Build the SVG path with hand-drawn wobble
  const pathD = useMemo(() => {
    if (!startPoint || !currentPoint) return '';
    const midX = (startPoint.x + currentPoint.x) / 2;
    const midY = (startPoint.y + currentPoint.y) / 2 + wobbleOffset.current * 3;
    return `M ${startPoint.x} ${startPoint.y} Q ${midX} ${midY} ${currentPoint.x} ${currentPoint.y}`;
  }, [startPoint, currentPoint]);

  if (!startPoint || !currentPoint) return null;
  if (!isActive && !isComplete) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      width={cardWidth}
      height={cardHeight}
      viewBox={`0 0 ${cardWidth} ${cardHeight}`}
      style={{ zIndex: 10 }}
    >
      <defs>
        {/* Glow filter for the line */}
        <filter id="cross-off-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={isComplete ? 6 : 3}
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Brighter glow for completion */}
        <filter id="cross-off-glow-intense" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* The strikethrough line */}
      <path
        d={pathD}
        fill="none"
        stroke={isComplete ? '#fbbf24' : '#f59e0b'}
        strokeWidth={isComplete ? 6 : 5}
        strokeLinecap="round"
        filter={isComplete ? 'url(#cross-off-glow-intense)' : 'url(#cross-off-glow)'}
        style={{
          opacity: isComplete ? 0.85 : 1,
          transition: isComplete ? 'stroke-width 0.3s ease, stroke 0.3s ease, opacity 0.5s ease 0.3s' : 'none',
        }}
      />

      {/* Sparkle particles trailing along the line */}
      {sparkles.map((sparkle) => (
        <circle
          key={sparkle.id}
          cx={sparkle.x}
          cy={sparkle.y}
          r={sparkle.size}
          fill={sparkle.color}
          style={{
            animation: 'sparkle-trail 400ms ease-out forwards',
          }}
        />
      ))}

      {/* Inline keyframes for sparkle animation */}
      <style>{`
        @keyframes sparkle-trail {
          0% { opacity: 1; transform: scale(0.5); }
          40% { opacity: 0.9; transform: scale(1.3); }
          100% { opacity: 0; transform: scale(0) translateY(-10px); }
        }
      `}</style>
    </svg>
  );
}
