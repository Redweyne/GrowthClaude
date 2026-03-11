'use client';

import { useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AvatarDisplay } from './AvatarDisplay';
import { AvatarUploadModal } from './AvatarUploadModal';
import { GOAL_TO_AURA, AURA_STYLES, BANNER_PRESETS, type ProfileAura } from '@/types/profile';
import type { TransformationGoal } from '@/types';

interface HeroBannerProps {
  name: string;
  avatarUrl: string | null;
  level: number;
  isSupporter: boolean;
  equippedTitle: string | null;
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
  equippedTitle,
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

  // Banner image (overrides aura if set)
  const bannerPreset = useMemo(() => {
    if (!bannerKey) return null;
    return BANNER_PRESETS.find(b => b.key === bannerKey) ?? null;
  }, [bannerKey]);

  return (
    <>
      <div className="relative overflow-hidden" style={{ minHeight: 340 }}>
        {/* Banner background */}
        <motion.div
          className="absolute inset-0"
          style={{ y: bannerY }}
        >
          {bannerPreset ? (
            <img
              src={bannerPreset.imagePath}
              alt=""
              className="w-full h-[400px] object-cover"
              draggable={false}
            />
          ) : (
            <div className={`w-full h-[400px] bg-gradient-to-b ${auraStyle.gradient}`}>
              {/* Floating aura particles */}
              <AuraParticles color={auraStyle.particleColor} />
            </div>
          )}
          {/* Gradient overlay fading to background */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--color-bg-abyss)] to-transparent" />
        </motion.div>

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
              <span className="text-xs text-amber-500/60">◆</span>
              <motion.span
                className="text-sm font-medium text-amber-400/80"
                animate={{
                  textShadow: [
                    '0 0 8px rgba(251,191,36,0)',
                    '0 0 12px rgba(251,191,36,0.3)',
                    '0 0 8px rgba(251,191,36,0)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {equippedTitle}
              </motion.span>
              <span className="text-xs text-amber-500/60">◆</span>
            </motion.div>
          )}

          {/* Identity Statement */}
          {identityStatement && (
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
                    '0 0 20px rgba(251,191,36,0.15)',
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
