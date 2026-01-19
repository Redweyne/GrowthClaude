'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// STREAK BADGE COMPONENT
// A dramatic fire badge that celebrates consistency with living flame effects
// ═══════════════════════════════════════════════════════════════════════════

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  showEmbers?: boolean;
}

// Ember particle rising from the flame
interface Ember {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  yOffset: number;  // Pre-calculated random offset for animation
  xOffset: number;  // Pre-calculated random offset for animation
}

// Fire intensity levels based on streak
type FireIntensity = 'ember' | 'flame' | 'blaze' | 'inferno';

function getFireIntensity(streak: number): FireIntensity {
  if (streak >= 30) return 'inferno';
  if (streak >= 14) return 'blaze';
  if (streak >= 7) return 'flame';
  return 'ember';
}

// Color configurations for different intensities
const fireConfigs = {
  ember: {
    primary: 'text-amber-600',
    secondary: 'text-amber-700',
    fill: 'fill-amber-600',
    bg: 'bg-amber-900/20',
    border: 'border-amber-700/30',
    glow: 'rgba(217, 119, 6, 0.4)',
    glowStrong: 'rgba(217, 119, 6, 0.6)',
    emberColor: 'bg-amber-500',
    gradient: 'from-amber-700 to-amber-600',
  },
  flame: {
    primary: 'text-amber-500',
    secondary: 'text-orange-500',
    fill: 'fill-amber-500',
    bg: 'bg-amber-800/25',
    border: 'border-amber-600/40',
    glow: 'rgba(245, 158, 11, 0.5)',
    glowStrong: 'rgba(245, 158, 11, 0.7)',
    emberColor: 'bg-amber-400',
    gradient: 'from-amber-600 to-orange-500',
  },
  blaze: {
    primary: 'text-orange-400',
    secondary: 'text-orange-500',
    fill: 'fill-orange-400',
    bg: 'bg-orange-800/30',
    border: 'border-orange-500/50',
    glow: 'rgba(251, 146, 60, 0.6)',
    glowStrong: 'rgba(251, 146, 60, 0.8)',
    emberColor: 'bg-orange-300',
    gradient: 'from-orange-500 to-red-500',
  },
  inferno: {
    primary: 'text-orange-300',
    secondary: 'text-red-400',
    fill: 'fill-orange-300',
    bg: 'bg-gradient-to-r from-orange-900/40 to-red-900/40',
    border: 'border-orange-400/60',
    glow: 'rgba(251, 146, 60, 0.7)',
    glowStrong: 'rgba(239, 68, 68, 0.6)',
    emberColor: 'bg-yellow-300',
    gradient: 'from-yellow-400 via-orange-400 to-red-500',
  },
};

export function StreakBadge({
  streak,
  size = 'md',
  showLabel = false,
  animated = false,
  showEmbers = true,
}: StreakBadgeProps) {
  const [embers, setEmbers] = useState<Ember[]>([]);
  const intensity = getFireIntensity(streak);
  const config = fireConfigs[intensity];

  // Size configurations
  const sizes = {
    sm: {
      text: 'text-xs',
      padding: 'px-2.5 py-1',
      icon: 14,
      gap: 'gap-1',
      emberCount: 2,
    },
    md: {
      text: 'text-sm',
      padding: 'px-3.5 py-1.5',
      icon: 18,
      gap: 'gap-1.5',
      emberCount: 3,
    },
    lg: {
      text: 'text-base',
      padding: 'px-4 py-2',
      icon: 22,
      gap: 'gap-2',
      emberCount: 5,
    },
  };

  const sizeConfig = sizes[size];

  // Generate embers continuously for animated badges with active streaks
  useEffect(() => {
    if (!showEmbers || !animated || streak <= 0) return;

    const generateEmbers = () => {
      const newEmbers: Ember[] = [];
      const count = sizeConfig.emberCount + (intensity === 'inferno' ? 3 : intensity === 'blaze' ? 2 : 0);

      for (let i = 0; i < count; i++) {
        newEmbers.push({
          id: Date.now() + i + Math.random(),
          x: Math.random() * 20 - 10,
          size: 2 + Math.random() * 2,
          duration: 0.8 + Math.random() * 0.4,
          delay: Math.random() * 0.3,
          yOffset: Math.random() * 15,
          xOffset: (Math.random() - 0.5) * 10,
        });
      }
      setEmbers(newEmbers);
    };

    generateEmbers();
    const interval = setInterval(generateEmbers, 600);

    return () => clearInterval(interval);
  }, [showEmbers, animated, streak, sizeConfig.emberCount, intensity]);

  // Dynamic glow based on intensity
  const glowShadow = useMemo(() => {
    if (streak <= 0) return 'none';

    const baseGlow = `0 0 15px ${config.glow}`;
    const strongGlow = `0 0 25px ${config.glowStrong}`;
    const innerGlow = 'inset 0 1px 0 rgba(255,255,255,0.1)';

    if (intensity === 'inferno') {
      return `${baseGlow}, ${strongGlow}, 0 0 40px ${config.glow}, ${innerGlow}`;
    }
    if (intensity === 'blaze') {
      return `${baseGlow}, ${strongGlow}, ${innerGlow}`;
    }
    return `${baseGlow}, ${innerGlow}`;
  }, [streak, config.glow, config.glowStrong, intensity]);

  return (
    <motion.div
      className={`
        relative inline-flex items-center ${sizeConfig.gap}
        ${config.bg}
        border ${config.border}
        rounded-full ${sizeConfig.padding}
        overflow-visible
      `}
      initial={animated ? { scale: 0.8, opacity: 0 } : false}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 15,
      }}
      style={{
        boxShadow: glowShadow,
      }}
    >
      {/* Inner fire glow */}
      {streak > 0 && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${config.glow} 0%, transparent 60%)`,
          }}
          animate={animated ? {
            opacity: [0.4, 0.7, 0.4],
          } : {}}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      )}

      {/* Fire shimmer */}
      {streak > 0 && (intensity === 'blaze' || intensity === 'inferno') && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(255,200,100,0.2) 50%, transparent 100%)`,
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
        </motion.div>
      )}

      {/* Flame icon with flicker animation */}
      <motion.div
        className="relative"
        animate={animated && streak > 0 ? {
          scale: [1, 1.05, 0.98, 1.02, 1],
          y: [0, -1, 0.5, -0.5, 0],
        } : {}}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        {/* Main flame */}
        <Flame
          size={sizeConfig.icon}
          className={`${config.primary} ${config.fill} relative z-10`}
        />

        {/* Flame glow layer */}
        {streak > 0 && (
          <motion.div
            className="absolute inset-0 blur-[2px]"
            animate={animated ? {
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 0.6,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          >
            <Flame
              size={sizeConfig.icon}
              className={`${config.secondary} ${config.fill}`}
            />
          </motion.div>
        )}

        {/* Extra intense glow for high streaks */}
        {(intensity === 'blaze' || intensity === 'inferno') && (
          <motion.div
            className="absolute inset-0 blur-[4px]"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1.1, 1.2, 1.1],
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          >
            <Flame
              size={sizeConfig.icon}
              className={`${config.primary} ${config.fill}`}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Streak count */}
      <motion.span
        className={`font-bold ${config.primary} ${sizeConfig.text} relative z-10`}
        key={streak}
        initial={animated ? { scale: 1.3, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      >
        {streak}
      </motion.span>

      {/* Label */}
      {showLabel && (
        <span className={`text-stone-400 font-normal ${sizeConfig.text}`}>
          {streak === 1 ? 'day' : 'days'}
        </span>
      )}

      {/* Rising embers */}
      <AnimatePresence>
        {animated && showEmbers && streak > 0 && embers.map((ember) => (
          <motion.div
            key={ember.id}
            className={`absolute rounded-full ${config.emberColor}`}
            style={{
              width: ember.size,
              height: ember.size,
              left: `calc(${size === 'sm' ? '20%' : '25%'} + ${ember.x}px)`,
              bottom: '50%',
              filter: 'blur(0.5px)',
            }}
            initial={{
              y: 0,
              opacity: 0.9,
              scale: 1,
            }}
            animate={{
              y: -30 - ember.yOffset,
              x: ember.x + ember.xOffset,
              opacity: 0,
              scale: 0.3,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: ember.duration,
              delay: ember.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Pulse ring for milestone streaks */}
      {animated && (streak === 7 || streak === 14 || streak === 30 || streak === 100) && (
        <motion.div
          className="absolute -inset-1 rounded-full pointer-events-none"
          style={{
            border: `2px solid ${config.glow}`,
          }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{
            scale: [1, 1.4],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      )}

      {/* Heat distortion effect for inferno */}
      {intensity === 'inferno' && animated && (
        <motion.div
          className="absolute -inset-2 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${config.glow} 0%, transparent 50%)`,
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
}

export default StreakBadge;
