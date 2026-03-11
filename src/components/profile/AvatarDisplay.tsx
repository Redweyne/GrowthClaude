'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import {
  getFrameTier,
  getEffectiveFrameTier,
  FRAME_COLORS,
  FOUNDER_FRAME_COLORS,
  INITIAL_AVATAR_GRADIENTS,
  type AvatarFrameTier,
  type EquippableFrameId,
} from '@/types/profile';

// ─────────────────────────────────────────────
// SIZES
// ─────────────────────────────────────────────

const SIZES = {
  nav:  { px: 32,  ring: 2, text: 'text-sm',  font: 14 },
  sm:   { px: 40,  ring: 2, text: 'text-base', font: 16 },
  md:   { px: 64,  ring: 3, text: 'text-xl',   font: 24 },
  lg:   { px: 100, ring: 4, text: 'text-3xl',  font: 36 },
  hero: { px: 140, ring: 5, text: 'text-4xl',  font: 48 },
} as const;

type AvatarSize = keyof typeof SIZES;

// ─────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────

interface AvatarDisplayProps {
  size: AvatarSize;
  avatarUrl?: string | null;
  name?: string | null;
  level: number;
  isSupporter?: boolean;
  equippedFrameId?: EquippableFrameId | null;
  layoutId?: string;
  onClick?: () => void;
  className?: string;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function AvatarDisplay({
  size,
  avatarUrl,
  name,
  level,
  isSupporter = false,
  equippedFrameId = null,
  layoutId,
  onClick,
  className = '',
}: AvatarDisplayProps) {
  const { px, ring, font } = SIZES[size];

  // Use equipped frame if set, otherwise derive from level
  const isFounderFrame = equippedFrameId === 'founder';
  const tier = getEffectiveFrameTier(equippedFrameId, level);
  const colors = isFounderFrame ? FOUNDER_FRAME_COLORS : FRAME_COLORS[tier];

  const initial = useMemo(() => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }, [name]);

  const gradientIndex = useMemo(() => {
    if (!name) return 0;
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }
    return Math.abs(hash) % INITIAL_AVATAR_GRADIENTS.length;
  }, [name]);

  const outerSize = px + ring * 2 + 4; // avatar + ring + gap

  return (
    <motion.div
      layoutId={layoutId}
      className={`relative flex-shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: outerSize, height: outerSize }}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Frame ring */}
      <FrameRing
        tier={tier}
        size={outerSize}
        ringWidth={ring}
        colors={colors}
        isSupporter={isSupporter}
        isFounderFrame={isFounderFrame}
      />

      {/* Avatar image or initial */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          top: ring + 2,
          left: ring + 2,
          width: px,
          height: px,
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name || 'Avatar'}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${INITIAL_AVATAR_GRADIENTS[gradientIndex]}`}
          >
            <span
              className="font-display font-bold text-white/90"
              style={{ fontSize: font }}
            >
              {initial}
            </span>
          </div>
        )}
      </div>

      {/* Supporter star badge */}
      {isSupporter && (
        <motion.div
          className="absolute flex items-center justify-center rounded-full bg-amber-500 shadow-lg"
          style={{
            bottom: size === 'nav' ? -1 : size === 'hero' ? 4 : 0,
            right: size === 'nav' ? -1 : size === 'hero' ? 4 : 0,
            width: size === 'nav' ? 12 : Math.max(px * 0.2, 16),
            height: size === 'nav' ? 12 : Math.max(px * 0.2, 16),
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
        >
          <Star className="w-[60%] h-[60%] text-white fill-white" />
        </motion.div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// FRAME RING (tier-based animated border)
// ─────────────────────────────────────────────

function FrameRing({
  tier,
  size,
  ringWidth,
  colors,
  isSupporter,
  isFounderFrame,
}: {
  tier: AvatarFrameTier;
  size: number;
  ringWidth: number;
  colors: { primary: string; secondary: string; glow: string };
  isSupporter: boolean;
  isFounderFrame: boolean;
}) {
  const radius = size / 2;

  return (
    <>
      {/* Glow aura (platinum+ or founder) */}
      {(tier === 'platinum' || tier === 'diamond' || isFounderFrame) && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Main ring */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id={`frame-grad-${tier}${isFounderFrame ? '-founder' : ''}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="50%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.primary} />
          </linearGradient>
        </defs>
        <circle
          cx={radius}
          cy={radius}
          r={radius - ringWidth / 2 - 1}
          fill="none"
          stroke={`url(#frame-grad-${tier}${isFounderFrame ? '-founder' : ''})`}
          strokeWidth={ringWidth}
        />
      </svg>

      {/* Rotating shimmer overlay (silver+ or founder) */}
      {(tier !== 'bronze' || isFounderFrame) && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          animate={{ rotate: 360 }}
          transition={{
            duration: isFounderFrame ? 5 : tier === 'diamond' ? 4 : tier === 'platinum' ? 6 : tier === 'gold' ? 8 : 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(
                transparent 0deg,
                ${colors.primary}40 60deg,
                transparent 120deg,
                transparent 360deg
              )`,
              maskImage: `radial-gradient(
                transparent ${radius - ringWidth - 2}px,
                black ${radius - ringWidth}px,
                black ${radius}px,
                transparent ${radius + 1}px
              )`,
              WebkitMaskImage: `radial-gradient(
                transparent ${radius - ringWidth - 2}px,
                black ${radius - ringWidth}px,
                black ${radius}px,
                transparent ${radius + 1}px
              )`,
            }}
          />
        </motion.div>
      )}

      {/* Supporter / Founder counter-rotating shimmer */}
      {(isSupporter || isFounderFrame) && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(
                transparent 0deg,
                rgba(251,191,36,0.3) 30deg,
                transparent 60deg,
                transparent 180deg,
                rgba(251,191,36,0.2) 210deg,
                transparent 240deg,
                transparent 360deg
              )`,
              maskImage: `radial-gradient(
                transparent ${radius - ringWidth - 2}px,
                black ${radius - ringWidth}px,
                black ${radius}px,
                transparent ${radius + 1}px
              )`,
              WebkitMaskImage: `radial-gradient(
                transparent ${radius - ringWidth - 2}px,
                black ${radius - ringWidth}px,
                black ${radius}px,
                transparent ${radius + 1}px
              )`,
            }}
          />
        </motion.div>
      )}

      {/* Orbiting particles (gold+ or founder) */}
      {(tier === 'gold' || tier === 'platinum' || tier === 'diamond' || isFounderFrame) && (
        <OrbitingParticles
          count={isFounderFrame ? 4 : tier === 'diamond' ? 6 : tier === 'platinum' ? 4 : 2}
          radius={radius}
          color={colors.primary}
          size={size}
        />
      )}

      {/* Diamond pulse ring */}
      {tier === 'diamond' && (
        <motion.div
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: colors.primary }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// ORBITING PARTICLES
// ─────────────────────────────────────────────

function OrbitingParticles({
  count,
  radius,
  color,
  size,
}: {
  count: number;
  radius: number;
  color: string;
  size: number;
}) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      startAngle: (360 / count) * i,
      duration: 3 + i * 0.5,
      particleSize: Math.max(3, size * 0.025),
    }));
  }, [count, size]);

  return (
    <>
      {particles.map(({ id, startAngle, duration, particleSize }) => (
        <motion.div
          key={id}
          className="absolute rounded-full"
          style={{
            width: particleSize,
            height: particleSize,
            backgroundColor: color,
            boxShadow: `0 0 ${particleSize * 2}px ${color}`,
            top: radius - particleSize / 2,
            left: radius - particleSize / 2,
          }}
          animate={{
            x: [
              Math.cos((startAngle * Math.PI) / 180) * (radius - 2),
              Math.cos(((startAngle + 360) * Math.PI) / 180) * (radius - 2),
            ],
            y: [
              Math.sin((startAngle * Math.PI) / 180) * (radius - 2),
              Math.sin(((startAngle + 360) * Math.PI) / 180) * (radius - 2),
            ],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </>
  );
}
