'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { Card, XPBadge, ProgressBar } from '@/components/ui';
import type { Level } from '@/types';
import { useTranslation } from '@/i18n';

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL DISPLAY
// A stunning visualization of the user's progress and level
// Features animated XP counter, glowing level badge, and radiant progress bar
// ═══════════════════════════════════════════════════════════════════════════

interface LevelDisplayProps {
  level: Level;
  totalXp: number;
  xpProgress: {
    current: number;
    needed: number;
    percentage: number;
  };
}

// Spring configurations
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  bouncy: { type: 'spring' as const, stiffness: 500, damping: 15 },
};

// Animated counter component
function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export function LevelDisplay({ level, totalXp, xpProgress }: LevelDisplayProps) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse tracking for dynamic highlight
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  // Transform mouse position to gradient position
  const highlightX = useTransform(mouseX, [0, 1], [0, 100]);
  const highlightY = useTransform(mouseY, [0, 1], [0, 100]);

  if (!mounted) {
    return <div className="h-40 rounded-2xl bg-stone-900/50" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, ...springs.gentle }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        variant="premium"
        padding="none"
        className="relative overflow-hidden"
        hoverable
        glowOnHover
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${highlightX}% ${highlightY}%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        <div className="relative p-6">
          {/* Level Badge and Title */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              {/* Glowing Level Badge */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={springs.bouncy}
              >
                {/* Outer glow ring */}
                <motion.div
                  className="absolute -inset-1 rounded-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(251, 191, 36, 0.3)',
                      '0 0 30px rgba(251, 191, 36, 0.5)',
                      '0 0 20px rgba(251, 191, 36, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Level number container */}
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  {/* Inner highlight */}
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    }}
                  />

                  {/* Level number */}
                  <span className="relative text-2xl font-bold text-stone-950">
                    {level.level}
                  </span>

                  {/* Sparkle effects */}
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Sparkles size={14} className="text-amber-200" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Title and subtitle */}
              <div>
                <motion.h2
                  className="text-xl font-bold text-amber-100"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {level.title}
                </motion.h2>
                <motion.p
                  className="text-sm text-stone-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Level {level.level} Philosopher
                </motion.p>
              </div>
            </div>

            {/* XP Badge with glow */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, ...springs.bouncy }}
            >
              <XPBadge xp={totalXp} />
            </motion.div>
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            {/* Progress bar with enhanced styling */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ transformOrigin: 'left' }}
            >
              <ProgressBar
                progress={xpProgress.percentage}
                size="md"
                color="gold"
                glowIntensity="strong"
                animated
              />
            </motion.div>

            {/* XP counter */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 text-sm">
                <Zap size={14} className="text-amber-500" />
                <span className="text-stone-400">
                  <span className="text-amber-200 font-semibold tabular-nums">
                    <AnimatedCounter value={xpProgress.current} />
                  </span>
                  {' / '}
                  <span className="text-stone-500">
                    {xpProgress.needed === Infinity ? '∞' : xpProgress.needed.toLocaleString()}
                  </span>
                  {' '}{t('common.xp')}
                </span>
              </div>

              {/* Progress percentage */}
              <motion.span
                className="text-xs text-stone-600 tabular-nums"
                animate={{
                  color: xpProgress.percentage >= 80 ? 'rgb(251, 191, 36)' : 'rgb(113, 113, 122)',
                }}
              >
                {t('home.level.progressToNext', { percent: Math.round(xpProgress.percentage) })}
              </motion.span>
            </motion.div>
          </div>

          {/* Motivational message based on progress */}
          <motion.div
            className="mt-4 pt-4 border-t border-stone-800/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-xs text-stone-500 text-center">
              {xpProgress.percentage >= 80 && (
                <span className="text-amber-400">{t('home.level.motivation.almostThere')}</span>
              )}
              {xpProgress.percentage >= 50 && xpProgress.percentage < 80 && (
                <span>{t('home.level.motivation.halfway')}</span>
              )}
              {xpProgress.percentage < 50 && (
                <span>{t('home.level.motivation.firstStep')}</span>
              )}
            </p>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

export default LevelDisplay;
