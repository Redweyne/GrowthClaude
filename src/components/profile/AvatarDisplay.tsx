'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import {
  getEffectiveFrameTier,
  FRAME_COLORS,
  FOUNDER_FRAME_COLORS,
  GM_FRAME_COLORS,
  INITIAL_AVATAR_GRADIENTS,
  isGmFrame,
  type AvatarFrameTier,
  type EquippableFrameId,
  type GmFrameId,
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
  const isGm = equippedFrameId != null && isGmFrame(equippedFrameId);

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

  // GM frames get extra ring width for the stunning effect
  const effectiveRing = isGm ? Math.max(ring, size === 'nav' ? 3 : size === 'hero' ? 7 : 4) : ring;
  const outerSize = px + effectiveRing * 2 + 4;

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
      {isGm ? (
        <GmFrameRing
          frameId={equippedFrameId as GmFrameId}
          size={outerSize}
          ringWidth={effectiveRing}
          avatarSize={size}
        />
      ) : (
        <FrameRing
          tier={tier}
          size={outerSize}
          ringWidth={effectiveRing}
          colors={colors}
          isSupporter={isSupporter}
          isFounderFrame={isFounderFrame}
        />
      )}

      {/* Avatar image or initial */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          top: effectiveRing + 2,
          left: effectiveRing + 2,
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
// STANDARD FRAME RING (tier-based)
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
// GM FRAME RING — Breathtaking Discord-level
// ─────────────────────────────────────────────
// Each GM frame has its own unique animation profile:
// Aurora: flowing northern lights with rippling colors
// Inferno: blazing fire ring with rising embers
// Void: dark matter with purple lightning arcs
// Celestial: golden sun with stellar corona rays
// Sakura: floating cherry blossom petals

function GmFrameRing({
  frameId,
  size,
  ringWidth,
  avatarSize,
}: {
  frameId: GmFrameId;
  size: number;
  ringWidth: number;
  avatarSize: AvatarSize;
}) {
  const colors = GM_FRAME_COLORS[frameId];
  const radius = size / 2;
  const isLarge = avatarSize === 'hero' || avatarSize === 'lg';

  return (
    <>
      {/* Outer glow aura — breathes and pulses */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: -8,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 60%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Secondary pulse ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: -4,
          border: `1px solid ${colors.primary}`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
      />

      {/* Triple pulse ripple */}
      {isLarge && (
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: -6,
            border: `1px solid ${colors.secondary}`,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0, 0.2],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
        />
      )}

      {/* Main rotating conic gradient ring */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: colors.gradient,
            maskImage: `radial-gradient(
              transparent ${radius - ringWidth - 1}px,
              black ${radius - ringWidth}px,
              black ${radius}px,
              transparent ${radius + 1}px
            )`,
            WebkitMaskImage: `radial-gradient(
              transparent ${radius - ringWidth - 1}px,
              black ${radius - ringWidth}px,
              black ${radius}px,
              transparent ${radius + 1}px
            )`,
          }}
        />
      </motion.div>

      {/* Counter-rotating shimmer layer */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        animate={{ rotate: -360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(
              transparent 0deg,
              ${colors.tertiary}60 40deg,
              transparent 80deg,
              transparent 180deg,
              ${colors.primary}40 220deg,
              transparent 260deg,
              transparent 360deg
            )`,
            maskImage: `radial-gradient(
              transparent ${radius - ringWidth - 1}px,
              black ${radius - ringWidth}px,
              black ${radius}px,
              transparent ${radius + 1}px
            )`,
            WebkitMaskImage: `radial-gradient(
              transparent ${radius - ringWidth - 1}px,
              black ${radius - ringWidth}px,
              black ${radius}px,
              transparent ${radius + 1}px
            )`,
          }}
        />
      </motion.div>

      {/* Frame-specific effects */}
      {frameId === 'aurora' && (
        <AuroraEffect size={size} radius={radius} ringWidth={ringWidth} colors={colors} isLarge={isLarge} />
      )}
      {frameId === 'inferno' && (
        <InfernoEffect size={size} radius={radius} colors={colors} isLarge={isLarge} />
      )}
      {frameId === 'void' && (
        <VoidEffect size={size} radius={radius} ringWidth={ringWidth} colors={colors} isLarge={isLarge} />
      )}
      {frameId === 'celestial' && (
        <CelestialEffect size={size} radius={radius} colors={colors} isLarge={isLarge} />
      )}
      {frameId === 'sakura' && (
        <SakuraEffect size={size} radius={radius} colors={colors} isLarge={isLarge} />
      )}

      {/* Orbiting particles — more and faster for GM frames */}
      <OrbitingParticles
        count={isLarge ? 8 : 4}
        radius={radius}
        color={colors.primary}
        size={size}
        speed={2}
      />

      {/* Second orbit layer going the other direction */}
      {isLarge && (
        <OrbitingParticles
          count={4}
          radius={radius * 0.85}
          color={colors.tertiary}
          size={size}
          speed={3.5}
          reverse
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// AURORA BOREALIS — flowing waves of color
// ─────────────────────────────────────────────

function AuroraEffect({
  size,
  radius,
  ringWidth,
  colors,
  isLarge,
}: {
  size: number;
  radius: number;
  ringWidth: number;
  colors: { primary: string; secondary: string; tertiary: string };
  isLarge: boolean;
}) {
  // Third layer that waves in the opposite direction with different timing
  return (
    <>
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        animate={{ rotate: 180 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(
              ${colors.primary}50 0deg,
              ${colors.secondary}30 90deg,
              ${colors.tertiary}40 180deg,
              ${colors.primary}20 270deg,
              ${colors.primary}50 360deg
            )`,
            maskImage: `radial-gradient(
              transparent ${radius - ringWidth - 1}px,
              black ${radius - ringWidth}px,
              black ${radius}px,
              transparent ${radius + 1}px
            )`,
            WebkitMaskImage: `radial-gradient(
              transparent ${radius - ringWidth - 1}px,
              black ${radius - ringWidth}px,
              black ${radius}px,
              transparent ${radius + 1}px
            )`,
          }}
        />
      </motion.div>

      {/* Breathing inner light */}
      {isLarge && (
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: ringWidth + 2,
            background: `radial-gradient(circle at 30% 30%, ${colors.primary}15, transparent 60%)`,
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// INFERNO — blazing fire with rising embers
// ─────────────────────────────────────────────

function InfernoEffect({
  size,
  radius,
  colors,
  isLarge,
}: {
  size: number;
  radius: number;
  colors: { primary: string; secondary: string; tertiary: string; glow: string };
  isLarge: boolean;
}) {
  const emberCount = isLarge ? 10 : 5;
  const embers = useMemo(() =>
    Array.from({ length: emberCount }, (_, i) => ({
      id: i,
      angle: (360 / emberCount) * i,
      delay: (i / emberCount) * 2,
      size: isLarge ? 2 + (i % 3) : 1.5 + (i % 2),
    })),
    [emberCount, isLarge],
  );

  return (
    <>
      {/* Rising ember particles */}
      {embers.map(ember => {
        const x = radius + Math.cos((ember.angle * Math.PI) / 180) * (radius - 4);
        const y = radius + Math.sin((ember.angle * Math.PI) / 180) * (radius - 4);
        return (
          <motion.div
            key={ember.id}
            className="absolute rounded-full"
            style={{
              width: ember.size,
              height: ember.size,
              backgroundColor: ember.id % 3 === 0 ? colors.tertiary : colors.primary,
              left: x - ember.size / 2,
              top: y - ember.size / 2,
              boxShadow: `0 0 ${ember.size * 3}px ${colors.primary}`,
            }}
            animate={{
              y: [0, -15 - ember.id * 2],
              opacity: [0.8, 0],
              scale: [1, 0.3],
            }}
            transition={{
              duration: 1.2 + (ember.id % 3) * 0.3,
              repeat: Infinity,
              delay: ember.delay,
              ease: 'easeOut',
            }}
          />
        );
      })}

      {/* Heat distortion glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: -3,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 50%)`,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

// ─────────────────────────────────────────────
// VOID — dark matter with energy arcs
// ─────────────────────────────────────────────

function VoidEffect({
  size,
  radius,
  ringWidth,
  colors,
  isLarge,
}: {
  size: number;
  radius: number;
  ringWidth: number;
  colors: { primary: string; secondary: string; tertiary: string; glow: string };
  isLarge: boolean;
}) {
  return (
    <>
      {/* Dark inner vortex */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        animate={{ rotate: -720 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(
              ${colors.secondary}80 0deg,
              transparent 30deg,
              ${colors.tertiary}30 120deg,
              transparent 150deg,
              ${colors.secondary}60 240deg,
              transparent 270deg,
              ${colors.secondary}80 360deg
            )`,
            maskImage: `radial-gradient(
              transparent ${radius - ringWidth - 1}px,
              black ${radius - ringWidth}px,
              black ${radius}px,
              transparent ${radius + 1}px
            )`,
            WebkitMaskImage: `radial-gradient(
              transparent ${radius - ringWidth - 1}px,
              black ${radius - ringWidth}px,
              black ${radius}px,
              transparent ${radius + 1}px
            )`,
          }}
        />
      </motion.div>

      {/* Lightning flash pulses */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${colors.tertiary}`,
        }}
        animate={{
          opacity: [0, 0, 0.8, 0, 0, 0, 0.6, 0],
          scale: [1, 1, 1.02, 1, 1, 1, 1.01, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Void absorption effect */}
      {isLarge && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: -12,
            background: `radial-gradient(circle, transparent 50%, ${colors.glow} 70%, transparent 90%)`,
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// CELESTIAL — golden sun with corona rays
// ─────────────────────────────────────────────

function CelestialEffect({
  size,
  radius,
  colors,
  isLarge,
}: {
  size: number;
  radius: number;
  colors: { primary: string; secondary: string; tertiary: string; glow: string };
  isLarge: boolean;
}) {
  const rayCount = isLarge ? 12 : 6;
  const rays = useMemo(() =>
    Array.from({ length: rayCount }, (_, i) => ({
      id: i,
      angle: (360 / rayCount) * i,
      length: isLarge ? 8 + (i % 3) * 4 : 5 + (i % 2) * 3,
    })),
    [rayCount, isLarge],
  );

  return (
    <>
      {/* Corona rays */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 30 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear', repeatType: 'reverse' }}
      >
        {rays.map(ray => {
          const rad = (ray.angle * Math.PI) / 180;
          const innerR = radius - 1;
          const outerR = radius + ray.length;
          const x1 = radius + Math.cos(rad) * innerR;
          const y1 = radius + Math.sin(rad) * innerR;
          const x2 = radius + Math.cos(rad) * outerR;
          const y2 = radius + Math.sin(rad) * outerR;
          return (
            <motion.div
              key={ray.id}
              className="absolute"
              style={{
                width: isLarge ? 2 : 1,
                height: ray.length,
                background: `linear-gradient(to top, ${colors.primary}80, transparent)`,
                left: x1,
                top: y1,
                transformOrigin: '0 0',
                transform: `rotate(${ray.angle - 90}deg)`,
              }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 2 + (ray.id % 3) * 0.5,
                repeat: Infinity,
                delay: (ray.id / rayCount) * 2,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </motion.div>

      {/* Golden halo */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: -5,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 50%)`,
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

// ─────────────────────────────────────────────
// SAKURA — floating cherry blossom petals
// ─────────────────────────────────────────────

function SakuraEffect({
  size,
  radius,
  colors,
  isLarge,
}: {
  size: number;
  radius: number;
  colors: { primary: string; secondary: string; tertiary: string; glow: string };
  isLarge: boolean;
}) {
  const petalCount = isLarge ? 8 : 4;
  const petals = useMemo(() =>
    Array.from({ length: petalCount }, (_, i) => ({
      id: i,
      startAngle: (360 / petalCount) * i,
      delay: (i / petalCount) * 4,
      petalSize: isLarge ? 4 + (i % 3) : 2.5 + (i % 2),
    })),
    [petalCount, isLarge],
  );

  return (
    <>
      {/* Floating petals */}
      {petals.map(petal => (
        <motion.div
          key={petal.id}
          className="absolute rounded-full"
          style={{
            width: petal.petalSize,
            height: petal.petalSize * 0.6,
            backgroundColor: petal.id % 2 === 0 ? colors.primary : colors.secondary,
            top: radius - petal.petalSize / 2,
            left: radius - petal.petalSize / 2,
            borderRadius: '50% 0 50% 0',
            boxShadow: `0 0 ${petal.petalSize * 2}px ${colors.glow}`,
          }}
          animate={{
            x: [
              Math.cos((petal.startAngle * Math.PI) / 180) * (radius + 5),
              Math.cos(((petal.startAngle + 120) * Math.PI) / 180) * (radius + 10),
              Math.cos(((petal.startAngle + 240) * Math.PI) / 180) * (radius + 5),
              Math.cos((petal.startAngle * Math.PI) / 180) * (radius + 5),
            ],
            y: [
              Math.sin((petal.startAngle * Math.PI) / 180) * (radius + 5),
              Math.sin(((petal.startAngle + 120) * Math.PI) / 180) * (radius + 10),
              Math.sin(((petal.startAngle + 240) * Math.PI) / 180) * (radius + 5),
              Math.sin((petal.startAngle * Math.PI) / 180) * (radius + 5),
            ],
            rotate: [0, 180, 360],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6 + petal.id * 0.3,
            repeat: Infinity,
            delay: petal.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Soft pink glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: -4,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 60%)`,
        }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
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
  speed = 1,
  reverse = false,
}: {
  count: number;
  radius: number;
  color: string;
  size: number;
  speed?: number;
  reverse?: boolean;
}) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      startAngle: (360 / count) * i,
      duration: (3 + i * 0.5) / speed,
      particleSize: Math.max(3, size * 0.025),
    }));
  }, [count, size, speed]);

  return (
    <>
      {particles.map(({ id, startAngle, duration, particleSize }) => {
        const dir = reverse ? -1 : 1;
        return (
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
                Math.cos(((startAngle + 360 * dir) * Math.PI) / 180) * (radius - 2),
              ],
              y: [
                Math.sin((startAngle * Math.PI) / 180) * (radius - 2),
                Math.sin(((startAngle + 360 * dir) * Math.PI) / 180) * (radius - 2),
              ],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        );
      })}
    </>
  );
}
