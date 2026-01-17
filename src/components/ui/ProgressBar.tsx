'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useEffect, useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS BAR COMPONENT
// A luminous progress indicator with particle effects and energy glow
// ═══════════════════════════════════════════════════════════════════════════

interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'indigo' | 'emerald' | 'rose' | 'purple';
  showLabel?: boolean;
  animated?: boolean;
  showParticles?: boolean;
  glowIntensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

// Particle for the trailing effect
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

// Color configurations for different themes
const colorConfigs = {
  gold: {
    gradient: 'from-amber-400 via-amber-500 to-orange-500',
    glow: 'rgba(251, 191, 36, VAR)',
    particle: 'bg-amber-300',
    shimmer: 'rgba(255, 255, 255, 0.4)',
    track: 'bg-amber-950/30',
    trackBorder: 'border-amber-900/30',
  },
  indigo: {
    gradient: 'from-indigo-400 via-indigo-500 to-purple-500',
    glow: 'rgba(129, 140, 248, VAR)',
    particle: 'bg-indigo-300',
    shimmer: 'rgba(255, 255, 255, 0.4)',
    track: 'bg-indigo-950/30',
    trackBorder: 'border-indigo-900/30',
  },
  emerald: {
    gradient: 'from-emerald-400 via-emerald-500 to-teal-500',
    glow: 'rgba(52, 211, 153, VAR)',
    particle: 'bg-emerald-300',
    shimmer: 'rgba(255, 255, 255, 0.4)',
    track: 'bg-emerald-950/30',
    trackBorder: 'border-emerald-900/30',
  },
  rose: {
    gradient: 'from-rose-400 via-rose-500 to-pink-500',
    glow: 'rgba(251, 113, 133, VAR)',
    particle: 'bg-rose-300',
    shimmer: 'rgba(255, 255, 255, 0.4)',
    track: 'bg-rose-950/30',
    trackBorder: 'border-rose-900/30',
  },
  purple: {
    gradient: 'from-purple-400 via-purple-500 to-violet-500',
    glow: 'rgba(167, 139, 250, VAR)',
    particle: 'bg-purple-300',
    shimmer: 'rgba(255, 255, 255, 0.4)',
    track: 'bg-purple-950/30',
    trackBorder: 'border-purple-900/30',
  },
};

// Glow intensity multipliers
const glowIntensities = {
  subtle: { blur: 10, spread: 5, opacity: 0.3 },
  medium: { blur: 20, spread: 10, opacity: 0.5 },
  strong: { blur: 30, spread: 15, opacity: 0.7 },
};

export function ProgressBar({
  progress,
  size = 'md',
  color = 'gold',
  showLabel = false,
  animated = true,
  showParticles = true,
  glowIntensity = 'medium',
  className = '',
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(animated);

  const config = colorConfigs[color];
  const intensity = glowIntensities[glowIntensity];

  // Size configurations
  const sizes = {
    sm: { height: 'h-2', label: 'text-xs', particleSize: 3 },
    md: { height: 'h-3', label: 'text-sm', particleSize: 4 },
    lg: { height: 'h-4', label: 'text-base', particleSize: 5 },
  };

  const sizeConfig = sizes[size];

  // Generate particles at the leading edge
  useEffect(() => {
    if (!showParticles || clampedProgress <= 0 || !isAnimating) return;

    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const particleCount = size === 'lg' ? 5 : size === 'md' ? 4 : 3;

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: Math.random() * 10 - 5,
          y: Math.random() * 20 - 10,
          size: sizeConfig.particleSize * (0.5 + Math.random() * 0.5),
          delay: i * 0.1,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 800);

    // Stop animating after initial load
    const timeout = setTimeout(() => setIsAnimating(false), 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [clampedProgress, showParticles, isAnimating, size, sizeConfig.particleSize]);

  // Glow shadow style
  const glowShadow = useMemo(() => {
    const glowColor = config.glow.replace('VAR', intensity.opacity.toString());
    const glowColorLight = config.glow.replace('VAR', (intensity.opacity * 0.5).toString());
    return `0 0 ${intensity.blur}px ${glowColor}, 0 0 ${intensity.spread}px ${glowColorLight}`;
  }, [config.glow, intensity]);

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {showLabel && (
        <motion.div
          className="flex justify-between items-center mb-2"
          initial={animated ? { opacity: 0, y: -5 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className={`${sizeConfig.label} font-medium text-stone-400`}>
            Progress
          </span>
          <motion.span
            className={`${sizeConfig.label} font-bold text-stone-200`}
            key={clampedProgress}
            initial={animated ? { scale: 1.2, color: config.glow.replace('VAR', '1') } : false}
            animate={{ scale: 1, color: 'rgb(231, 229, 228)' }}
            transition={{ duration: 0.3 }}
          >
            {Math.round(clampedProgress)}%
          </motion.span>
        </motion.div>
      )}

      {/* Track */}
      <div
        className={`
          relative w-full ${sizeConfig.height} rounded-full overflow-hidden
          ${config.track}
          border ${config.trackBorder}
        `}
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Inner track shadow for depth */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
          }}
        />

        {/* Fill */}
        <motion.div
          className={`
            relative h-full rounded-full
            bg-gradient-to-r ${config.gradient}
          `}
          initial={animated ? { width: 0 } : { width: `${clampedProgress}%` }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{
            duration: animated ? 1 : 0.3,
            ease: [0.16, 1, 0.3, 1], // ease-out-expo
          }}
          style={{
            boxShadow: glowShadow,
          }}
        >
          {/* Top highlight */}
          <div
            className="absolute inset-x-0 top-0 h-1/3 rounded-t-full pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
            }}
          />

          {/* Shimmer animation */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${config.shimmer} 50%, transparent 100%)`,
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['200% 0%', '-200% 0%'],
            }}
            transition={{
              duration: 2,
              ease: 'linear',
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />

          {/* Leading edge glow */}
          {clampedProgress > 0 && (
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: sizeConfig.particleSize * 2,
                height: sizeConfig.particleSize * 2,
                background: `radial-gradient(circle, ${config.glow.replace('VAR', '0.8')} 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
          )}

          {/* Particles */}
          <AnimatePresence>
            {showParticles && clampedProgress > 5 && particles.map((particle) => (
              <motion.div
                key={particle.id}
                className={`absolute rounded-full ${config.particle}`}
                style={{
                  width: particle.size,
                  height: particle.size,
                  right: -particle.size / 2,
                  top: '50%',
                }}
                initial={{
                  x: 0,
                  y: '-50%',
                  opacity: 0.9,
                  scale: 1,
                }}
                animate={{
                  x: -20 + particle.x,
                  y: `calc(-50% + ${particle.y}px)`,
                  opacity: 0,
                  scale: 0.3,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  delay: particle.delay,
                  ease: 'easeOut',
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Animated glow pulse on track when low */}
        {clampedProgress < 30 && clampedProgress > 0 && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `linear-gradient(90deg, ${config.glow.replace('VAR', '0.1')} 0%, transparent ${clampedProgress + 10}%)`,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ProgressBar;
