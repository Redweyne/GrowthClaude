'use client';

import { motion } from 'framer-motion';
import { memo, useMemo, useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TWINKLING STAR
// ═══════════════════════════════════════════════════════════════════════════

const TwinklingStar = memo(function TwinklingStar({
  x, y, size, delay, duration,
}: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.1))',
        boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.3)`,
      }}
      animate={{
        opacity: [0.2, 0.8, 0.2],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// NEBULA CLOUD
// ═══════════════════════════════════════════════════════════════════════════

const NebulaCloud = memo(function NebulaCloud({
  color, x, y, width, height, blur, opacity,
}: { color: string; x: number; y: number; width: number; height: number; blur: number; opacity: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
      }}
      animate={{
        x: [0, 15, -10, 0],
        y: [0, -10, 8, 0],
        opacity: [opacity, opacity * 1.2, opacity * 0.8, opacity],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// COSMIC BACKGROUND
// Reusable starfield + nebula background for immersive pages
// ═══════════════════════════════════════════════════════════════════════════

interface CosmicBackgroundProps {
  fixed?: boolean;
}

export const CosmicBackground = memo(function CosmicBackground({ fixed = false }: CosmicBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const mobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent) ||
      window.matchMedia('(max-width: 768px)').matches;
    setIsMobile(mobile);
  }, []);

  const starCount = prefersReducedMotion ? 0 : (isMobile ? 40 : 80);

  const stars = useMemo(() =>
    Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 4,
    })),
  [starCount]);

  return (
    <div className={`${fixed ? 'fixed' : 'absolute'} inset-0 overflow-hidden pointer-events-none`} style={{ zIndex: 0 }}>
      {/* Deep space gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #0f0d1a 0%, #080612 30%, #040208 60%, #020106 100%)',
        }}
      />

      {/* Nebula clouds */}
      <NebulaCloud color="rgba(88, 28, 135, 0.15)" x={-10} y={10} width={60} height={50} blur={60} opacity={0.6} />
      <NebulaCloud color="rgba(30, 58, 138, 0.12)" x={50} y={-5} width={55} height={45} blur={50} opacity={0.5} />
      <NebulaCloud color="rgba(120, 53, 15, 0.1)" x={20} y={55} width={50} height={40} blur={55} opacity={0.4} />
      <NebulaCloud color="rgba(88, 28, 135, 0.08)" x={60} y={60} width={45} height={35} blur={45} opacity={0.35} />

      {/* Twinkling stars */}
      {stars.map((star) => (
        <TwinklingStar key={star.id} {...star} />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
});

export default CosmicBackground;
