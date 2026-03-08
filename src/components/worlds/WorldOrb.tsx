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

  // Float animation offset per card
  const floatDelay = index * 0.8;
  const floatDuration = 5 + index * 0.5;

  const orbSize = featured ? 'w-44 h-44 sm:w-52 sm:h-52' : 'w-32 h-32 sm:w-36 sm:h-36';
  const imageSize = featured ? 'w-40 h-40 sm:w-48 sm:h-48' : 'w-28 h-28 sm:w-32 sm:h-32';

  return (
    <motion.div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      {/* Floating animation wrapper */}
      <motion.div
        className="flex flex-col items-center"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: floatDuration,
          delay: floatDelay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Orb container */}
        <motion.div
          className={`relative ${orbSize} rounded-full flex items-center justify-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={isActive ? onContinue : undefined}
        >
          {/* Outer glow ring */}
          <div
            className="absolute inset-[-4px] rounded-full opacity-60 group-hover:opacity-90 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${world.themeColor.glow}, transparent 70%)`,
              filter: 'blur(8px)',
            }}
          />

          {/* Glass orb border */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${world.themeColor.border}, transparent 50%, ${world.themeColor.border})`,
              padding: '1.5px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
            }}
          />

          {/* Inner glass surface */}
          <div className="absolute inset-[1px] rounded-full overflow-hidden bg-black/20 backdrop-blur-sm">
            {/* Specular highlight - top */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 opacity-20"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.5), transparent)',
              }}
            />
          </div>

          {/* World illustration */}
          <div className={`relative ${imageSize} z-10`}>
            <img
              src={`${basePath}${world.imagePath}`}
              alt={name}
              className={`w-full h-full object-contain drop-shadow-2xl ${
                isLocked ? 'grayscale opacity-50' : isComingSoon ? 'opacity-80' : ''
              }`}
              loading="lazy"
            />
          </div>

          {/* Lock overlay for locked worlds */}
          {isLocked && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center z-20 bg-black/30">
              <div className="p-2.5 rounded-full bg-stone-900/80 border border-stone-700/50">
                <Lock className="w-5 h-5 text-stone-400" />
              </div>
            </div>
          )}
        </motion.div>

        {/* World info */}
        <div className="flex flex-col items-center mt-3 text-center px-2">
          <h3
            className={`font-semibold tracking-tight ${
              featured ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
            }`}
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              color: isLocked ? '#78716c' : world.themeColor.primary,
            }}
          >
            {name}
          </h3>

          {/* Status badge / progress */}
          {isActive && (
            <div className="flex flex-col items-center gap-1.5 mt-1">
              <p className="text-stone-400 text-xs">
                {completedLessons} / {world.totalLessons} {lessonsLabel}
              </p>
              {/* Progress bar */}
              <div className="w-20 h-1 rounded-full bg-stone-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: world.themeColor.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedLessons / world.totalLessons) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
              {/* Continue Journey button */}
              {featured && (
                <motion.button
                  className="mt-2 px-5 py-2 rounded-full text-sm font-semibold text-stone-900 transition-shadow"
                  style={{
                    background: `linear-gradient(135deg, ${world.themeColor.primary}, #f59e0b)`,
                    boxShadow: `0 0 20px ${world.themeColor.glow}, 0 4px 12px rgba(0,0,0,0.3)`,
                  }}
                  whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${world.themeColor.glow}` }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onContinue}
                >
                  {continueLabel}
                </motion.button>
              )}
            </div>
          )}

          {isComingSoon && (
            <div className="mt-1.5 flex flex-col items-center gap-0.5">
              <span className="text-xs font-medium text-stone-500 italic">
                {comingSoonLabel}
              </span>
              <p className="text-[10px] text-stone-600 max-w-[120px] leading-tight">
                {subtitle}
              </p>
            </div>
          )}

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
