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
  direction: number; // 1 = up, -1 = down
}

interface CrossOffLineProps {
  startPoint: Point | null;
  currentPoint: Point | null;
  points: Point[];
  isActive: boolean;
  isComplete: boolean;
  progress: number;
  cardWidth: number;
  cardHeight: number;
}

const SPARKLE_COLORS = ['#fbbf24', '#fcd34d', '#fde68a', '#f59e0b', '#d97706'];

// Build a smooth SVG path through an array of points using Catmull-Rom to cubic bezier conversion
function buildSmoothPath(pts: Point[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  if (pts.length === 2) {
    return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
  }

  let d = `M ${pts[0].x} ${pts[0].y}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[Math.min(pts.length - 1, i + 1)];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    // Catmull-Rom to cubic bezier control points (tension = 0.3 for smooth but responsive)
    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}

export function CrossOffLine({
  startPoint,
  currentPoint,
  points,
  isActive,
  isComplete,
  progress,
  cardWidth,
  cardHeight,
}: CrossOffLineProps) {
  const lastSparkleProgress = useRef(0);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [burstSparkles, setBurstSparkles] = useState<Sparkle[]>([]);
  const sparkleIdRef = useRef(0);

  // Reset sparkles when drag starts
  useEffect(() => {
    if (isActive && startPoint) {
      lastSparkleProgress.current = 0;
      setSparkles([]);
      setBurstSparkles([]);
    }
  }, [isActive, startPoint]);

  // Spawn sparkles along the line — every 5% of progress
  useEffect(() => {
    if (!isActive || !currentPoint) return;

    const progressDelta = progress - lastSparkleProgress.current;
    if (progressDelta >= 5) {
      lastSparkleProgress.current = progress;
      sparkleIdRef.current++;
      const newSparkle: Sparkle = {
        id: sparkleIdRef.current,
        x: currentPoint.x,
        y: currentPoint.y,
        size: 2 + Math.random() * 3.5,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        direction: Math.random() > 0.5 ? 1 : -1,
      };
      setSparkles(prev => [...prev.slice(-20), newSparkle]);

      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, 550);
    }
  }, [isActive, currentPoint, progress]);

  // Spawn burst sparkles on completion — firework at the endpoint
  useEffect(() => {
    if (!isComplete || !currentPoint) return;
    const burst: Sparkle[] = [];
    for (let i = 0; i < 14; i++) {
      sparkleIdRef.current++;
      burst.push({
        id: sparkleIdRef.current,
        x: currentPoint.x,
        y: currentPoint.y,
        size: 3 + Math.random() * 5,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        direction: 1,
      });
    }
    setBurstSparkles(burst);
    setTimeout(() => setBurstSparkles([]), 800);
  }, [isComplete, currentPoint]);

  // Build the smooth SVG path through ALL tracked points
  const pathD = useMemo(() => {
    if (points.length < 2) return '';
    return buildSmoothPath(points);
  }, [points]);

  if (!startPoint || !currentPoint) return null;
  if (!isActive && !isComplete) return null;
  if (!pathD) return null;

  // Use unique filter IDs to prevent conflicts between multiple cards
  const filterId = `glow-${startPoint.x.toFixed(0)}-${startPoint.y.toFixed(0)}`;
  const filterIdIntense = `glow-i-${startPoint.x.toFixed(0)}-${startPoint.y.toFixed(0)}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      width={cardWidth}
      height={cardHeight}
      viewBox={`0 0 ${cardWidth} ${cardHeight}`}
      style={{ zIndex: 10 }}
    >
      <defs>
        <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={isComplete ? 8 : 4}
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={filterIdIntense} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft underglow shadow path — wide, faint glow behind the line */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(251,191,36,0.15)"
        strokeWidth={18}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* The free-form strikethrough line */}
      <path
        d={pathD}
        fill="none"
        stroke={isComplete ? '#fbbf24' : '#f59e0b'}
        strokeWidth={isComplete ? 8 : 6}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={isComplete ? `url(#${filterIdIntense})` : `url(#${filterId})`}
        style={{
          opacity: isComplete ? 0.9 : 1,
          transition: isComplete ? 'stroke-width 0.3s ease, stroke 0.3s ease, opacity 0.5s ease 0.3s' : 'none',
        }}
      />

      {/* Sparkle trail along the line */}
      {sparkles.map((sparkle) => (
        <circle
          key={sparkle.id}
          cx={sparkle.x}
          cy={sparkle.y}
          r={sparkle.size}
          fill={sparkle.color}
          className={sparkle.direction > 0 ? 'sparkle-up' : 'sparkle-down'}
        />
      ))}

      {/* Burst sparkles on completion — firework at endpoint */}
      {burstSparkles.map((sparkle, i) => {
        const angle = (Math.PI * 2 * i) / burstSparkles.length;
        const dist = 18 + Math.random() * 25;
        return (
          <circle
            key={sparkle.id}
            cx={sparkle.x}
            cy={sparkle.y}
            r={sparkle.size}
            fill={sparkle.color}
            className="sparkle-burst"
            style={{
              '--burst-x': `${Math.cos(angle) * dist}px`,
              '--burst-y': `${Math.sin(angle) * dist}px`,
            } as React.CSSProperties}
          />
        );
      })}

      <style>{`
        .sparkle-up {
          animation: sparkle-trail-up 500ms ease-out forwards;
        }
        .sparkle-down {
          animation: sparkle-trail-down 500ms ease-out forwards;
        }
        .sparkle-burst {
          animation: sparkle-burst 700ms ease-out forwards;
        }
        @keyframes sparkle-trail-up {
          0% { opacity: 1; transform: scale(0.5); }
          40% { opacity: 0.9; transform: scale(1.4); }
          100% { opacity: 0; transform: scale(0) translateY(-16px); }
        }
        @keyframes sparkle-trail-down {
          0% { opacity: 1; transform: scale(0.5); }
          40% { opacity: 0.9; transform: scale(1.4); }
          100% { opacity: 0; transform: scale(0) translateY(16px); }
        }
        @keyframes sparkle-burst {
          0% { opacity: 1; transform: scale(0.3) translate(0, 0); }
          30% { opacity: 1; transform: scale(1.8) translate(var(--burst-x), var(--burst-y)); }
          100% { opacity: 0; transform: scale(0) translate(var(--burst-x), var(--burst-y)); }
        }
      `}</style>
    </svg>
  );
}
