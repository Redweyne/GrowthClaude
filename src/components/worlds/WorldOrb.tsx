'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { Lock } from 'lucide-react';
import type { WorldDisplay } from '@/content/worldsData';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface WorldOrbProps {
  world: WorldDisplay;
  locale: string;
  completedLessons?: number;
  featured?: boolean;
  index: number;
  onContinue?: () => void;
  continueLabel: string;
  comingSoonLabel: string;
  lockedLabel: string;
  lessonsLabel: string;
}

export const WorldOrb = memo(function WorldOrb({
  world,
  locale,
  completedLessons = 0,
  featured = false,
  index,
  onContinue,
  continueLabel,
  comingSoonLabel,
  lockedLabel,
  lessonsLabel,
}: WorldOrbProps) {
  const lang = locale as 'en' | 'fr' | 'ar';
  const name = world.name[lang] || world.name.en;
  const subtitle = world.subtitle[lang] || world.subtitle.en;
  const isActive = world.status === 'active';
  const isComingSoon = world.status === 'coming-soon';
  const isLocked = world.status === 'locked';

  const floatDelay = index * 0.8;
  const floatDuration = 5 + index * 0.5;

  const imageSize = featured ? 'w-56 h-56 sm:w-64 sm:h-64' : 'w-36 h-36 sm:w-44 sm:h-44';

  return (
    <motion.div
      className="flex flex-col items-center cursor-pointer group"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      {/* Floating animation wrapper */}
      <motion.div
        className="flex flex-col items-center"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: floatDuration,
          delay: floatDelay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Image + glow */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={isActive ? onContinue : undefined}
        >
          {/* Subtle glow behind image */}
          <div
            className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500 rounded-full"
            style={{
              background: `radial-gradient(circle, ${world.themeColor.glow}, transparent 65%)`,
              filter: 'blur(20px)',
              transform: 'scale(0.8)',
            }}
          />

          {/* World illustration */}
          <div className={`relative ${imageSize}`}>
            <img
              src={`${basePath}${world.imagePath}`}
              alt={name}
              className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-300 ${
                isLocked ? 'grayscale opacity-40' : isComingSoon ? 'opacity-75 group-hover:opacity-90' : ''
              }`}
              loading="lazy"
            />
          </div>

          {/* Lock icon overlay for locked worlds */}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="p-3 rounded-full bg-stone-900/70 border border-stone-700/40 backdrop-blur-sm">
                <Lock className="w-5 h-5 text-stone-400" />
              </div>
            </div>
          )}
        </motion.div>

        {/* World info */}
        <div className="flex flex-col items-center text-center px-2 -mt-2">
          <h3
            className={`font-semibold tracking-tight ${
              featured ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'
            }`}
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              color: isLocked ? '#78716c' : world.themeColor.primary,
              textShadow: isLocked ? 'none' : `0 0 20px ${world.themeColor.glow}`,
            }}
          >
            {name}
          </h3>

          {/* Active world: progress + button */}
          {isActive && (
            <div className="flex flex-col items-center gap-1.5 mt-1">
              <p className="text-stone-400 text-xs">
                {completedLessons} / {world.totalLessons} {lessonsLabel}
              </p>
              <div className="w-24 h-1 rounded-full bg-stone-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: world.themeColor.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedLessons / world.totalLessons) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
              {featured && (
                <motion.button
                  className="mt-2 px-6 py-2.5 rounded-full text-sm font-semibold text-stone-900"
                  style={{
                    background: `linear-gradient(135deg, ${world.themeColor.primary}, #f59e0b)`,
                    boxShadow: `0 0 20px ${world.themeColor.glow}, 0 4px 12px rgba(0,0,0,0.3)`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onContinue}
                >
                  {continueLabel}
                </motion.button>
              )}
            </div>
          )}

          {/* Coming soon */}
          {isComingSoon && (
            <div className="mt-1 flex flex-col items-center gap-0.5">
              <span className="text-xs font-medium text-stone-500 italic">
                {comingSoonLabel}
              </span>
              <p className="text-[10px] text-stone-600 max-w-[130px] leading-tight">
                {subtitle}
              </p>
            </div>
          )}

          {/* Locked */}
          {isLocked && (
            <span className="text-xs text-stone-600 mt-1">
              {lockedLabel}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

export default WorldOrb;
