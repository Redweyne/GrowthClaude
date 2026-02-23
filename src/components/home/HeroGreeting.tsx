'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { Settings, Shield } from 'lucide-react';
import { StreakBadge } from '@/components/ui';
import { useTranslation } from '@/i18n';
import { generateGreeting, GreetingContext } from '@/lib/greetingEngine';

// ═══════════════════════════════════════════════════════════════════════════
// HERO GREETING
// A dramatic, animated welcome that makes users feel seen and valued
// Features staggered letter animations, time-aware greetings, and
// contextual streak-aware messages from the greeting engine
// ═══════════════════════════════════════════════════════════════════════════

interface HeroGreetingProps {
  name: string;
  streak: number;
  longestStreak: number;
  totalLessons: number;
  lastLessonDate: string | null;
  lastLessonCoreTag?: string;
  transformationGoal?: string | null;
  streakShieldCount: number;
  onOpenSettings: () => void;
}

// Spring configurations
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  responsive: { type: 'spring' as const, stiffness: 300, damping: 20 },
};

export function HeroGreeting({ name, streak, longestStreak, totalLessons, lastLessonDate, lastLessonCoreTag, transformationGoal, streakShieldCount, onOpenSettings }: HeroGreetingProps) {
  const { t, isRTL } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Generate contextual greeting
  const greetingResult = useMemo(() => {
    const ctx: GreetingContext = {
      name: name || t('settings.seeker'),
      streak,
      longestStreak,
      totalLessons,
      lastLessonDate,
      lastLessonCoreTag,
      transformationGoal,
    };
    return generateGreeting(ctx);
  }, [name, streak, longestStreak, totalLessons, lastLessonDate, lastLessonCoreTag, transformationGoal, t]);

  // Mood-based accent colors
  const moodColors = useMemo(() => {
    switch (greetingResult.mood) {
      case 'warm':
        return { text: 'text-amber-200 light:text-amber-600', glow: 'rgba(251, 191, 36, 0.3)', accent: 'rgba(251, 191, 36, 0.4)' };
      case 'motivating':
        return { text: 'text-orange-200 light:text-orange-600', glow: 'rgba(249, 115, 22, 0.3)', accent: 'rgba(249, 115, 22, 0.4)' };
      case 'celebratory':
        return { text: 'text-yellow-200 light:text-yellow-600', glow: 'rgba(234, 179, 8, 0.4)', accent: 'rgba(234, 179, 8, 0.5)' };
      case 'gentle':
        return { text: 'text-stone-300 light:text-stone-500', glow: 'rgba(168, 162, 158, 0.3)', accent: 'rgba(168, 162, 158, 0.3)' };
      case 'fierce':
        return { text: 'text-red-200 light:text-red-600', glow: 'rgba(239, 68, 68, 0.3)', accent: 'rgba(239, 68, 68, 0.4)' };
    }
  }, [greetingResult.mood]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stagger animation for letters
  const nameLetters = (name || t('settings.seeker')).split('');

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2,
      },
    },
  };

  // Letter variants
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: springs.gentle,
    },
  };

  // Message variants
  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.8, duration: 0.6, ease: 'easeOut' as const },
    },
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-between mb-8">
        <div className="h-20" />
      </div>
    );
  }

  return (
    <motion.header
      className="relative mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top row - streak, shield, and settings */}
      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <motion.div
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, ...springs.gentle }}
        >
          <StreakBadge streak={streak} />
          {streakShieldCount > 0 && (
            <motion.div
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, ...springs.gentle }}
              title={`${streakShieldCount} streak shield(s) available`}
            >
              <Shield size={14} className="text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">{streakShieldCount}</span>
            </motion.div>
          )}
        </motion.div>

        <motion.button
          onClick={onOpenSettings}
          className="relative w-11 h-11 rounded-2xl bg-stone-900/60 light:bg-stone-200/60 backdrop-blur-sm border border-stone-800/80 light:border-stone-300/80 flex items-center justify-center hover:border-amber-500/30 transition-all duration-300 group"
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, ...springs.gentle }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings
            size={20}
            className="text-stone-400 light:text-stone-600 group-hover:text-amber-400 transition-colors duration-300"
          />
          {/* Hover glow */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.1)',
            }}
          />
        </motion.button>
      </div>

      {/* Greeting text */}
      <motion.p
        className={`text-stone-500 text-sm tracking-wide uppercase mb-2 ${isRTL ? 'text-right' : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {greetingResult.greeting}
      </motion.p>

      {/* Name with staggered letter animation */}
      <motion.h1
        className={`text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 light:from-amber-700 light:via-amber-600 light:to-amber-700 tracking-tight mb-4 ${isRTL ? 'text-right' : ''}`}
        style={{
          perspective: '1000px',
          WebkitTextStroke: '0.5px rgba(251, 191, 36, 0.1)',
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {nameLetters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block"
            style={{
              transformOrigin: 'center bottom',
              textShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.h1>

      {/* Contextual streak message */}
      <motion.div
        className={`relative ${isRTL ? 'pr-4 border-r-2' : 'pl-4 border-l-2'} border-amber-500/20`}
        variants={messageVariants}
        initial="hidden"
        animate="visible"
      >
        <p className={`text-stone-300 light:text-stone-600 text-sm font-medium leading-relaxed ${isRTL ? 'text-right' : ''}`}>
          {greetingResult.message}
        </p>
        {greetingResult.subMessage && (
          <p className={`text-stone-500 light:text-stone-400 text-xs mt-1.5 italic ${isRTL ? 'text-right' : ''}`}>
            {greetingResult.subMessage}
          </p>
        )}

        {/* Mood-colored accent line */}
        <div
          className={`absolute ${isRTL ? '-right-px' : '-left-px'} top-0 bottom-0 w-0.5 rounded-full`}
          style={{
            background: `linear-gradient(180deg, ${moodColors.accent} 0%, ${moodColors.glow} 100%)`,
            boxShadow: `0 0 8px ${moodColors.glow}`,
          }}
        />
      </motion.div>

      {/* Decorative gradient line */}
      <motion.div
        className="mt-8 h-px w-full"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.3), rgba(167, 139, 250, 0.2), transparent)',
          transformOrigin: 'left',
        }}
      />
    </motion.header>
  );
}

export default HeroGreeting;
