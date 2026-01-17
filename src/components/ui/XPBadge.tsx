'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// XP BADGE COMPONENT
// A prestigious badge that celebrates earned experience with luminous energy
// ═══════════════════════════════════════════════════════════════════════════

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showIcon?: boolean;
  variant?: 'default' | 'earned' | 'bonus';
  showSparkles?: boolean;
}

// Energy particle for the earned variant
interface EnergyParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

export function XPBadge({
  xp,
  size = 'md',
  animated = false,
  showIcon = true,
  variant = 'default',
  showSparkles = false,
}: XPBadgeProps) {
  const [particles, setParticles] = useState<EnergyParticle[]>([]);
  const [showInitialBurst, setShowInitialBurst] = useState(animated);

  // Size configurations
  const sizes = {
    sm: {
      text: 'text-xs',
      padding: 'px-2.5 py-1',
      icon: 12,
      gap: 'gap-1',
    },
    md: {
      text: 'text-sm',
      padding: 'px-3.5 py-1.5',
      icon: 14,
      gap: 'gap-1.5',
    },
    lg: {
      text: 'text-base',
      padding: 'px-4 py-2',
      icon: 18,
      gap: 'gap-2',
    },
  };

  const sizeConfig = sizes[size];

  // Variant configurations
  const variants = {
    default: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/25',
      text: 'text-amber-400',
      icon: 'text-amber-400',
      glow: 'rgba(251, 191, 36, 0.3)',
    },
    earned: {
      bg: 'bg-gradient-to-r from-amber-500/15 to-orange-500/15',
      border: 'border-amber-400/40',
      text: 'text-amber-300',
      icon: 'text-amber-300',
      glow: 'rgba(251, 191, 36, 0.5)',
    },
    bonus: {
      bg: 'bg-gradient-to-r from-purple-500/15 to-indigo-500/15',
      border: 'border-purple-400/40',
      text: 'text-purple-300',
      icon: 'text-purple-300',
      glow: 'rgba(167, 139, 250, 0.5)',
    },
  };

  const variantConfig = variants[variant];

  // Generate particles for earned/bonus variants
  useEffect(() => {
    if ((variant === 'earned' || variant === 'bonus' || showSparkles) && animated) {
      const generateParticles = () => {
        const newParticles: EnergyParticle[] = [];
        const particleCount = 6;

        for (let i = 0; i < particleCount; i++) {
          newParticles.push({
            id: Date.now() + i,
            angle: (360 / particleCount) * i + Math.random() * 30,
            distance: 15 + Math.random() * 10,
            size: 2 + Math.random() * 2,
            delay: i * 0.08,
          });
        }
        setParticles(newParticles);
      };

      generateParticles();

      // Turn off burst after initial animation
      const timeout = setTimeout(() => setShowInitialBurst(false), 1000);

      return () => clearTimeout(timeout);
    }
  }, [variant, animated, showSparkles]);

  const content = (
    <motion.div
      className={`
        relative inline-flex items-center ${sizeConfig.gap}
        ${variantConfig.bg}
        border ${variantConfig.border}
        rounded-full ${sizeConfig.padding}
        overflow-visible
      `}
      initial={animated ? { scale: 0.5, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 15,
      }}
      style={{
        boxShadow: animated || variant !== 'default'
          ? `0 0 20px ${variantConfig.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`
          : 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Inner glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${variantConfig.glow} 0%, transparent 70%)`,
          opacity: 0.5,
        }}
      />

      {/* Shimmer effect for earned/bonus */}
      {(variant === 'earned' || variant === 'bonus') && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        </motion.div>
      )}

      {/* Icon */}
      {showIcon && (
        <motion.div
          className="relative"
          animate={variant === 'earned' || variant === 'bonus' ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          <Zap
            size={sizeConfig.icon}
            className={`${variantConfig.icon} fill-current relative z-10`}
          />
          {/* Icon glow */}
          {(variant === 'earned' || variant === 'bonus') && (
            <motion.div
              className="absolute inset-0 blur-sm"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            >
              <Zap
                size={sizeConfig.icon}
                className={`${variantConfig.icon} fill-current`}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* XP value */}
      <motion.span
        className={`font-bold ${variantConfig.text} ${sizeConfig.text} relative z-10`}
        key={xp}
        initial={animated ? { scale: 1.3, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: 0.1,
        }}
      >
        {xp > 0 ? '+' : ''}{xp} XP
      </motion.span>

      {/* Sparkles icon for bonus */}
      {variant === 'bonus' && (
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          <Sparkles
            size={sizeConfig.icon - 2}
            className={`${variantConfig.icon} fill-current`}
          />
        </motion.div>
      )}

      {/* Energy particles */}
      <AnimatePresence>
        {showInitialBurst && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${
              variant === 'bonus' ? 'bg-purple-300' : 'bg-amber-300'
            }`}
            style={{
              width: particle.size,
              height: particle.size,
              left: '50%',
              top: '50%',
            }}
            initial={{
              x: '-50%',
              y: '-50%',
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: `calc(-50% + ${Math.cos(particle.angle * Math.PI / 180) * particle.distance}px)`,
              y: `calc(-50% + ${Math.sin(particle.angle * Math.PI / 180) * particle.distance}px)`,
              opacity: 0,
              scale: 0.3,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: particle.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Pulse ring for animated earned/bonus */}
      {(variant === 'earned' || variant === 'bonus') && animated && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: `1px solid ${variantConfig.glow}`,
          }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{
            scale: [1, 1.5],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 1,
            ease: 'easeOut',
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        />
      )}
    </motion.div>
  );

  return content;
}

export default XPBadge;
