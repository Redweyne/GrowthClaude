'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  shape: 'circle' | 'square' | 'star';
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  spread?: number;
  onComplete?: () => void;
}

const DEFAULT_COLORS = [
  '#fbbf24', // amber
  '#f59e0b', // orange
  '#ef4444', // red
  '#ec4899', // pink
  '#a855f7', // purple
  '#6366f1', // indigo
  '#22c55e', // green
  '#06b6d4', // cyan
];

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
};

export function Confetti({
  active,
  duration = 3000,
  particleCount = 50,
  colors = DEFAULT_COLORS,
  spread = 180,
  onComplete,
}: ConfettiProps) {
  // Detect mobile and reduce particle count for Android performance
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent) ||
      window.matchMedia('(max-width: 768px)').matches;
    setIsMobile(mobile);
  }, []);

  const effectiveCount = isMobile ? Math.min(particleCount, 20) : particleCount;

  const particles = useMemo(() => {
    if (!active) return [];
    const newParticles: Particle[] = [];
    const shapes: Array<'circle' | 'square' | 'star'> = ['circle', 'square', 'star'];

    for (let i = 0; i < effectiveCount; i++) {
      const angleSeed = pseudoRandom(i + particleCount);
      const velocitySeed = pseudoRandom(i + spread);
      const colorSeed = pseudoRandom(i + colors.length);
      const sizeSeed = pseudoRandom(i + 42);
      const rotationSeed = pseudoRandom(i + 99);
      const shapeSeed = pseudoRandom(i + 7);
      const angle = (angleSeed * spread - spread / 2) * (Math.PI / 180);
      const velocity = 8 + velocitySeed * 12;

      newParticles.push({
        id: i,
        x: 50, // Start from center
        y: 50,
        color: colors[Math.floor(colorSeed * colors.length)],
        size: 6 + sizeSeed * 8,
        rotation: rotationSeed * 360,
        velocityX: Math.sin(angle) * velocity,
        velocityY: -Math.cos(angle) * velocity - 5,
        shape: shapes[Math.floor(shapeSeed * shapes.length)],
      });
    }

    return newParticles;
  }, [active, effectiveCount, colors, spread]);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [active, duration, onComplete]);

  const renderShape = (particle: Particle) => {
    switch (particle.shape) {
      case 'star':
        return (
          <svg width={particle.size} height={particle.size} viewBox="0 0 24 24">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={particle.color}
            />
          </svg>
        );
      case 'square':
        return (
          <div
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: 2,
            }}
          />
        );
      default:
        return (
          <div
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: '50%',
            }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              rotate: particle.rotation,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              left: `${particle.x + particle.velocityX * 10}%`,
              top: `${particle.y + particle.velocityY * 10 + 80}%`,
              rotate: particle.rotation + 720,
              scale: [0, 1.2, 1, 0.8],
              opacity: [1, 1, 1, 0],
            }}
            transition={{
              duration: duration / 1000,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {renderShape(particle)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// XP Orbs that float and collect
interface XPOrbProps {
  count: number;
  onCollect?: () => void;
}

export function XPOrbs({ count, onCollect }: XPOrbProps) {
  // Reduce orb count on mobile for performance
  const [isMobileOrb, setIsMobileOrb] = useState(false);
  useEffect(() => {
    setIsMobileOrb(/android|iphone|ipad|ipod/i.test(navigator.userAgent));
  }, []);
  const maxOrbs = isMobileOrb ? 8 : 15;

  const orbs = useMemo(() => (
    Array.from({ length: Math.min(count, maxOrbs) }, (_, i) => ({
      id: i,
      delay: i * 0.05,
      offsetX: (pseudoRandom(i + count) - 0.5) * 200,
      offsetY: (pseudoRandom(i + count + 12) - 0.5) * 200,
    }))
  ), [count, maxOrbs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onCollect?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [count, onCollect]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute left-1/2 top-1/2"
          initial={{
            x: orb.offsetX,
            y: orb.offsetY,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: 0,
            y: -200,
            scale: [0, 1.5, 1, 0.5],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.2,
            delay: orb.delay,
            ease: 'easeOut',
          }}
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg shadow-amber-500/50">
            <div className="absolute inset-0 rounded-full bg-amber-200 opacity-50 animate-ping" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Star burst for special moments
interface StarBurstProps {
  active: boolean;
  color?: string;
}

export function StarBurst({ active, color = '#fbbf24' }: StarBurstProps) {
  if (!active) return null;

  const stars = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i * 45) * (Math.PI / 180),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute left-1/2 top-1/2"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos(star.angle) * 100,
            y: Math.sin(star.angle) * 100,
            scale: [0, 1, 0.5],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={color}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

export default Confetti;
