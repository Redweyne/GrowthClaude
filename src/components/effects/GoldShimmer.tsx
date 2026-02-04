'use client';

// ============================================================================
// GOLD SHIMMER - Elegant Particle Effect for Premium Moments
// ============================================================================
//
// A CSS-based particle system designed for:
// - 60fps performance on iOS and Android
// - No hydration mismatches (SSR-safe)
// - Minimal GPU load (transforms and opacity only)
// - Elegant, luxury aesthetic
//
// Used in the reward phase for a refined celebration effect.
// ============================================================================

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GoldShimmerProps {
  /** Whether the shimmer effect is active */
  active: boolean;
  /** Number of particles (auto-reduced on mobile) */
  particleCount?: number;
  /** Duration in ms before particles fade */
  duration?: number;
  /** Color theme */
  variant?: 'gold' | 'silver' | 'rose';
  /** Intensity of the effect */
  intensity?: 'subtle' | 'medium' | 'intense';
  /** Callback when animation completes */
  onComplete?: () => void;
}

// Deterministic pseudo-random for consistent SSR/client rendering
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Color palettes for different variants
const COLOR_PALETTES = {
  gold: ['#fbbf24', '#f59e0b', '#d97706', '#fcd34d', '#fef3c7'],
  silver: ['#e5e7eb', '#d1d5db', '#9ca3af', '#f3f4f6', '#ffffff'],
  rose: ['#fda4af', '#fb7185', '#f43f5e', '#fecdd3', '#fff1f2'],
};

// Intensity settings
const INTENSITY_SETTINGS = {
  subtle: { count: 8, size: [2, 4], speed: 4000 },
  medium: { count: 14, size: [3, 6], speed: 3000 },
  intense: { count: 20, size: [4, 8], speed: 2500 },
};

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
}

export function GoldShimmer({
  active,
  particleCount,
  duration = 3000,
  variant = 'gold',
  intensity = 'medium',
  onComplete,
}: GoldShimmerProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const hasInitialized = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile on mount (client-side only)
  useEffect(() => {
    const mobile =
      /android|iphone|ipad|ipod/i.test(navigator.userAgent) ||
      window.matchMedia('(max-width: 768px)').matches;
    setIsMobile(mobile);
  }, []);

  // Generate particles when active
  useEffect(() => {
    if (!active) {
      setParticles([]);
      hasInitialized.current = false;
      return;
    }

    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const settings = INTENSITY_SETTINGS[intensity];
    const colors = COLOR_PALETTES[variant];
    
    // Reduce particles on mobile for performance
    const baseCount = particleCount ?? settings.count;
    const effectiveCount = isMobile ? Math.min(baseCount, 12) : baseCount;

    const newParticles: Particle[] = [];

    for (let i = 0; i < effectiveCount; i++) {
      const seed = i + effectiveCount;
      newParticles.push({
        id: i,
        // Spread across the screen horizontally
        x: seededRandom(seed) * 100,
        // Start from random vertical positions
        y: 20 + seededRandom(seed + 1) * 60,
        // Random size within range
        size: settings.size[0] + seededRandom(seed + 2) * (settings.size[1] - settings.size[0]),
        // Pick color from palette
        color: colors[Math.floor(seededRandom(seed + 3) * colors.length)],
        // Stagger the start
        delay: seededRandom(seed + 4) * 0.8,
        // Vary duration slightly
        duration: (settings.speed + seededRandom(seed + 5) * 1000) / 1000,
        // Horizontal drift direction
        drift: (seededRandom(seed + 6) - 0.5) * 30,
      });
    }

    setParticles(newParticles);

    // Call onComplete after duration
    if (onComplete) {
      timeoutRef.current = setTimeout(onComplete, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [active, particleCount, duration, variant, intensity, isMobile, onComplete]);

  if (!active && particles.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-40"
      aria-hidden="true"
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              willChange: 'transform, opacity',
            }}
            initial={{
              opacity: 0,
              scale: 0,
              y: 0,
              x: 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.2, 1, 0.5],
              y: -100 - particle.size * 10,
              x: particle.drift,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
              opacity: {
                times: [0, 0.1, 0.7, 1],
              },
              scale: {
                times: [0, 0.2, 0.5, 1],
              },
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// LIGHT SWEEP - Elegant line of light that reveals content
// ============================================================================

interface LightSweepProps {
  active: boolean;
  duration?: number;
  color?: string;
  onComplete?: () => void;
}

export function LightSweep({
  active,
  duration = 1.2,
  color = '#fbbf24',
  onComplete,
}: LightSweepProps) {
  useEffect(() => {
    if (!active || !onComplete) return;
    const timer = setTimeout(onComplete, duration * 1000);
    return () => clearTimeout(timer);
  }, [active, duration, onComplete]);

  if (!active) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* The sweeping light line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          boxShadow: `0 0 30px 10px ${color}40`,
        }}
        initial={{ top: '-10%', opacity: 0 }}
        animate={{
          top: ['0%', '100%'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration,
          ease: 'easeInOut',
          opacity: {
            times: [0, 0.1, 0.9, 1],
          },
        }}
      />
    </motion.div>
  );
}

// ============================================================================
// GLOW RING - Expanding ring for level-up moments
// ============================================================================

interface GlowRingProps {
  active: boolean;
  color?: string;
  rings?: number;
  onComplete?: () => void;
}

export function GlowRing({
  active,
  color = '#fbbf24',
  rings = 3,
  onComplete,
}: GlowRingProps) {
  useEffect(() => {
    if (!active || !onComplete) return;
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      {Array.from({ length: rings }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            borderColor: color,
            boxShadow: `0 0 20px ${color}40, inset 0 0 20px ${color}20`,
          }}
          initial={{
            width: 20,
            height: 20,
            opacity: 0.8,
          }}
          animate={{
            width: 400,
            height: 400,
            opacity: 0,
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.15,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// SHIMMER OVERLAY - Subtle shimmer effect for cards
// ============================================================================

interface ShimmerOverlayProps {
  active?: boolean;
  className?: string;
}

export function ShimmerOverlay({ active = true, className = '' }: ShimmerOverlayProps) {
  if (!active) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden rounded-inherit ${className}`}>
      <motion.div
        className="absolute inset-0 -translate-x-full"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        }}
        animate={{
          x: ['0%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: 'linear',
        }}
      />
    </div>
  );
}

export default GoldShimmer;
