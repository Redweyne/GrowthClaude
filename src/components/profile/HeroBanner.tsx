'use client';

import { useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AvatarDisplay } from './AvatarDisplay';
import { AvatarUploadModal } from './AvatarUploadModal';
import {
  GOAL_TO_AURA, AURA_STYLES, BANNER_PRESETS,
  ALL_BADGES, type ProfileAura, type EquippableFrameId,
} from '@/types/profile';
import type { TransformationGoal } from '@/types';
import type { BadgeEarnedRecord } from '@/types/profile';

interface HeroBannerProps {
  name: string;
  avatarUrl: string | null;
  level: number;
  isSupporter: boolean;
  equippedFrameId: EquippableFrameId | null;
  equippedTitle: string | null;
  motto: string | null;
  featuredBadgeId: string | null;
  badgesEarned: BadgeEarnedRecord[];
  identityStatement: string | null;
  transformationGoal: TransformationGoal | null;
  bannerKey: string | null;
  scrollRef: React.RefObject<HTMLElement | null>;
  onIdentityTap?: () => void;
}

export function HeroBanner({
  name,
  avatarUrl,
  level,
  isSupporter,
  equippedFrameId,
  equippedTitle,
  motto,
  featuredBadgeId,
  badgesEarned,
  identityStatement,
  transformationGoal,
  bannerKey,
  scrollRef,
  onIdentityTap,
}: HeroBannerProps) {
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Parallax scroll
  const { scrollY } = useScroll({ container: scrollRef });
  const bannerY = useTransform(scrollY, [0, 300], [0, -150]);

  // Aura derived from transformation goal
  const aura: ProfileAura = transformationGoal ? GOAL_TO_AURA[transformationGoal] : 'wisdom';
  const auraStyle = AURA_STYLES[aura];

  // Banner gradient (overrides aura if set)
  const bannerPreset = useMemo(() => {
    if (!bannerKey) return null;
    return BANNER_PRESETS.find(b => b.key === bannerKey) ?? null;
  }, [bannerKey]);

  // Featured badge resolution
  const featuredBadge = useMemo(() => {
    if (!featuredBadgeId) return null;
    const earned = badgesEarned.find(b => b.badgeId === featuredBadgeId);
    if (!earned) return null;
    const def = ALL_BADGES.find(b => b.id === featuredBadgeId);
    return def ?? null;
  }, [featuredBadgeId, badgesEarned]);

  return (
    <>
      <div className="relative overflow-hidden" style={{ minHeight: 360 }}>
        {/* Banner background */}
        <motion.div
          className="absolute inset-0"
          style={{ y: bannerY }}
        >
          {bannerPreset ? (
            <div
              className="w-full h-[420px]"
              style={{ background: bannerPreset.gradient }}
            />
          ) : (
            <div className={`w-full h-[420px] bg-gradient-to-b ${auraStyle.gradient}`}>
              <AuraParticles color={auraStyle.particleColor} />
            </div>
          )}
          {/* Gradient overlay fading to background */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--color-bg-abyss,#0a0908)] to-transparent" />
        </motion.div>

        {/* Sacred accent glow at top */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'var(--profile-accent, #fbbf24)' }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse, var(--profile-glow, rgba(251,191,36,0.3)) 0%, transparent 70%)`,
            opacity: 0.5,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center pt-10 pb-6 px-4">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
          >
            <AvatarDisplay
              size="hero"
              avatarUrl={avatarUrl}
              name={name}
              level={level}
              isSupporter={isSupporter}
              equippedFrameId={equippedFrameId}
              layoutId="profileAvatar"
              onClick={() => setShowAvatarModal(true)}
            />
          </motion.div>

          {/* Name */}
          <motion.h1
            className="mt-4 text-2xl font-display font-bold text-amber-100 light:text-stone-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {name}
          </motion.h1>

          {/* Equipped Title */}
          {equippedTitle && (
            <motion.div
              className="mt-1.5 flex items-center gap-1.5"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <span style={{ color: 'var(--profile-accent, #fbbf24)', opacity: 0.6 }} className="text-xs">&#9670;</span>
              <motion.span
                className="text-sm font-medium"
                style={{ color: 'var(--profile-accent, #fbbf24)', opacity: 0.8 }}
                animate={{
                  textShadow: [
                    '0 0 8px rgba(251,191,36,0)',
                    '0 0 12px var(--profile-glow, rgba(251,191,36,0.3))',
                    '0 0 8px rgba(251,191,36,0)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {equippedTitle}
              </motion.span>
              <span style={{ color: 'var(--profile-accent, #fbbf24)', opacity: 0.6 }} className="text-xs">&#9670;</span>
            </motion.div>
          )}

          {/* Featured Badge */}
          {featuredBadge && (
            <motion.div
              className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-700/30"
              style={{ backgroundColor: 'var(--profile-bg, rgba(251,191,36,0.1))' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-[11px] font-medium" style={{ color: 'var(--profile-accent, #fbbf24)' }}>
                {featuredBadge.name}
              </span>
            </motion.div>
          )}

          {/* Motto */}
          {motto && (
            <motion.p
              className="mt-3 text-xs text-stone-400 light:text-stone-500 italic max-w-xs text-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              &ldquo;{motto}&rdquo;
            </motion.p>
          )}

          {/* Identity Statement */}
          {!motto && identityStatement && (
            <motion.button
              className="mt-4 max-w-sm text-center px-4"
              onClick={onIdentityTap}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.p
                className="text-sm italic text-amber-200/70 light:text-stone-600 leading-relaxed"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(251,191,36,0)',
                    '0 0 20px var(--profile-glow, rgba(251,191,36,0.15))',
                    '0 0 10px rgba(251,191,36,0)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                &ldquo;{identityStatement}&rdquo;
              </motion.p>
            </motion.button>
          )}
        </div>
      </div>

      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        level={level}
        isSupporter={isSupporter}
      />
    </>
  );
}

// ─────────────────────────────────────────────
// AURA PARTICLES
// ─────────────────────────────────────────────

function AuraParticles({ color }: { color: string }) {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
          }}
          animate={{
            y: [-20, -60],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
