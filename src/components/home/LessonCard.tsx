'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Play, Flame, Zap, Clock, Sparkles, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui';
import type { DisplayLesson, DisplayWorld } from '@/types';
import { useTranslation } from '@/i18n';
import { useTheme } from 'next-themes';

// ═══════════════════════════════════════════════════════════════════════════
// LESSON CARD
// The centerpiece of the home experience - a stunning, inviting call to action
// Features 3D tilt effects, dynamic lighting, particle accents, and
// anticipation-building animations
// ═══════════════════════════════════════════════════════════════════════════

interface LessonCardProps {
  lesson: DisplayLesson | null;
  world: DisplayWorld;
  onStartLesson: () => void;
  completedCount: number;
  totalCount: number;
  hasPendingAction?: boolean;
  pendingCommitment?: string;
}

// Spring configurations
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  responsive: { type: 'spring' as const, stiffness: 300, damping: 20 },
  tilt: { stiffness: 400, damping: 30 },
};

export function LessonCard({
  lesson,
  world,
  onStartLesson,
  completedCount,
  totalCount,
  hasPendingAction = false,
  pendingCommitment,
}: LessonCardProps) {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springs.tilt);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springs.tilt);

  // Light position for dynamic highlight
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(50);
  const highlightX = useSpring(lightX, springs.responsive);
  const highlightY = useSpring(lightY, springs.responsive);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPos);
    y.set(yPos);
    lightX.set((e.clientX - rect.left) / rect.width * 100);
    lightY.set((e.clientY - rect.top) / rect.height * 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    lightX.set(50);
    lightY.set(50);
  };

  // All lessons complete state
  if (!lesson) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springs.gentle}
      >
        {/* Celebration icon */}
        <motion.div
          className="relative w-24 h-24 mx-auto mb-6"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, transparent 70%)',
            }}
          />
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 flex items-center justify-center">
            <span className="text-5xl">🎉</span>
          </div>
        </motion.div>

        <motion.h2
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-200 mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          All Caught Up!
        </motion.h2>

        <motion.p
          className="text-stone-400 light:text-stone-600 mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You&apos;ve completed all available lessons in {world.name}.
          Continue practicing to reinforce your wisdom.
        </motion.p>
      </motion.div>
    );
  }

  if (!mounted) {
    return <div className="h-64 rounded-3xl bg-stone-900/50 light:bg-stone-200/50" />;
  }

  const duration = Math.ceil((lesson.actionDurationSeconds || 120) / 60 + 2);

  // PENDING ACTION STATE - User needs to complete their commitment
  if (hasPendingAction) {
    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ...springs.gentle }}
      >
        {/* Urgent label */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
            <motion.div
              className="w-2 h-2 rounded-full bg-amber-400"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <span className="text-amber-400 text-sm font-medium tracking-wide">
              ACTION IN PROGRESS
            </span>
          </span>
        </motion.div>

        {/* Main card */}
        <motion.div
          className="relative rounded-3xl cursor-pointer overflow-hidden"
          onClick={onStartLesson}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Pulsing border */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              boxShadow: [
                '0 0 0 2px rgba(251, 191, 36, 0.3), 0 0 30px rgba(251, 191, 36, 0.15)',
                '0 0 0 2px rgba(251, 191, 36, 0.5), 0 0 40px rgba(251, 191, 36, 0.25)',
                '0 0 0 2px rgba(251, 191, 36, 0.3), 0 0 30px rgba(251, 191, 36, 0.15)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Card background */}
          <div
            className="relative p-8 rounded-3xl border border-amber-500/30"
            style={{
              background: isLight
                ? `linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(250, 250, 249, 0.95) 30%, rgba(245, 245, 244, 0.98) 100%)`
                : `linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(28, 25, 23, 0.95) 30%, rgba(12, 10, 9, 0.98) 100%)`,
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="text-2xl">⚡</span>
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-amber-100 light:text-amber-900">
                  {t('home.lessonCard.actionAwaits')}
                </h3>
                <p className="text-amber-400/70 light:text-amber-600 text-sm">
                  {t('home.lessonCard.completeThenReturn')}
                </p>
              </div>
            </div>

            {/* The commitment they made */}
            {pendingCommitment && (
              <div className="mb-8 p-5 rounded-2xl bg-stone-900/50 light:bg-stone-200/50 border border-stone-800 light:border-stone-300">
                <p className="text-xs text-stone-500 light:text-stone-600 uppercase tracking-wide mb-2">
                  {t('home.lessonCard.youCommittedTo')}
                </p>
                <p className="text-lg text-stone-100 light:text-stone-900 leading-relaxed">
                  &ldquo;{pendingCommitment}&rdquo;
                </p>
              </div>
            )}

            {/* Message */}
            <p className="text-stone-400 light:text-stone-600 mb-8 leading-relaxed">
              {t('home.lessonCard.rememberPrefix')}{' '}
              <span className="text-amber-300">{t('home.lessonCard.rememberEmphasis')}</span>
              {' '}{t('home.lessonCard.rememberSuffix')}
            </p>

            {/* Return button */}
            <Button
              size="lg"
              glow
              className="w-full group"
              onClick={(e) => {
                e.stopPropagation();
                onStartLesson();
              }}
            >
              <span className="mr-2">✓</span>
              I&apos;ve Done It — Continue
              <ChevronRight
                size={18}
                className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
              />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, ...springs.gentle }}
    >
      {/* Section label */}
      <motion.p
        className="text-center text-stone-600 text-xs tracking-[0.2em] uppercase mb-4 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        Today&apos;s Lesson
      </motion.p>

      {/* Main card with 3D effect */}
      <motion.div
        className="relative rounded-3xl cursor-pointer"
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1200,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.98 }}
        onClick={onStartLesson}
      >
        {/* Card background with multiple layers */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Base gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? `linear-gradient(135deg, rgba(250, 250, 249, 0.95) 0%, rgba(245, 245, 244, 0.98) 50%, rgba(250, 250, 249, 0.95) 100%)`
                : `linear-gradient(135deg, rgba(28, 25, 23, 0.95) 0%, rgba(12, 10, 9, 0.98) 50%, rgba(28, 25, 23, 0.95) 100%)`,
            }}
          />

          {/* World color accent */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(ellipse at top right, ${world.color}40 0%, transparent 60%)`,
            }}
          />

          {/* Dynamic highlight following cursor */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${highlightX}% ${highlightY}%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)`,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Border */}
          <div className="absolute inset-0 rounded-3xl border border-stone-800/80 light:border-stone-300/80" />

          {/* Hover border glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            animate={{
              boxShadow: isHovered
                ? `0 0 40px rgba(251, 191, 36, 0.15), inset 0 0 0 1px rgba(251, 191, 36, 0.2)`
                : '0 0 0 rgba(251, 191, 36, 0), inset 0 0 0 1px rgba(251, 191, 36, 0)',
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Content */}
          <div className="relative p-8" style={{ transform: 'translateZ(30px)' }}>
            {/* Top row - World indicator and XP reward */}
            <div className="flex items-center justify-between mb-6">
              {/* World badge */}
              <motion.div
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-stone-900/60 light:bg-stone-200/60 border border-stone-800/80 light:border-stone-300/80"
                whileHover={{ scale: 1.05, borderColor: `${world.color}40` }}
              >
                <div
                  className="w-5 h-5 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${world.color}20` }}
                >
                  <Flame size={12} style={{ color: world.color }} />
                </div>
                <span className="text-sm text-stone-400 light:text-stone-600 font-medium">{world.name}</span>
              </motion.div>

              {/* XP reward badge */}
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20"
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(251, 191, 36, 0.1)',
                    '0 0 20px rgba(251, 191, 36, 0.2)',
                    '0 0 10px rgba(251, 191, 36, 0.1)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Zap size={14} className="text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">+{lesson.xpReward} XP</span>
              </motion.div>
            </div>

            {/* Lesson title */}
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 light:from-amber-800 light:via-amber-700 light:to-amber-800 mb-3 leading-tight"
              animate={{
                backgroundPosition: isHovered ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                backgroundSize: '200% 100%',
              }}
            >
              {lesson.title}
            </motion.h2>

            {/* Lesson wisdom preview */}
            {lesson.wisdomText && (
              <p className="text-stone-500 light:text-stone-600 text-sm mb-6 line-clamp-2 italic">
                &ldquo;{lesson.wisdomText.substring(0, 100)}...&rdquo;
              </p>
            )}

            {/* Meta info */}
            <div className="flex items-center gap-4 mb-8 text-sm text-stone-500 light:text-stone-600">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-stone-600 light:text-stone-500" />
                <span>~{duration} min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-stone-600 light:text-stone-500" />
                <span>Lesson {completedCount + 1} of {totalCount}</span>
              </div>
            </div>

            {/* Start button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                glow
                className="w-full group"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartLesson();
                }}
              >
                <Play size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                Begin Your Journey
                <ChevronRight
                  size={18}
                  className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                />
              </Button>
            </motion.div>
          </div>

          {/* Decorative elements */}
          {/* Top-right sparkle */}
          <motion.div
            className="absolute top-6 right-6 pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles size={24} className="text-amber-500/40" />
          </motion.div>

          {/* Bottom gradient line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl"
            style={{
              background: `linear-gradient(90deg, transparent, ${world.color}60, rgba(251, 191, 36, 0.5), ${world.color}60, transparent)`,
            }}
          />
        </div>

        {/* Shadow */}
        <div
          className="absolute inset-0 -z-10 rounded-3xl"
          style={{
            transform: 'translateZ(-30px) translateY(10px)',
            background: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.4)',
            filter: 'blur(20px)',
          }}
        />
      </motion.div>

      {/* Progress indicator below card */}
      <motion.div
        className="flex items-center justify-center gap-2 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {Array.from({ length: Math.min(totalCount, 10) }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i < completedCount
                ? 'bg-emerald-500'
                : i === completedCount
                ? 'bg-amber-500'
                : 'bg-stone-800 light:bg-stone-300'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            style={{
              boxShadow: i < completedCount
                ? '0 0 8px rgba(52, 211, 153, 0.5)'
                : i === completedCount
                ? '0 0 8px rgba(251, 191, 36, 0.5)'
                : 'none',
            }}
          />
        ))}
        {totalCount > 10 && (
          <span className="text-xs text-stone-600 ml-1">+{totalCount - 10}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

export default LessonCard;
