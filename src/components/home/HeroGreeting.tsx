'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { Settings, Shield, Flame } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { generateGreeting, GreetingContext } from '@/lib/greetingEngine';

// ═══════════════════════════════════════════════════════════════════════════
// HERO GREETING — Compact, elegant header for the Sanctum home
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
  dayNumber?: number;
  worldName?: string;
  onOpenSettings: () => void;
}

export function HeroGreeting({
  name,
  streak,
  longestStreak,
  totalLessons,
  lastLessonDate,
  lastLessonCoreTag,
  transformationGoal,
  streakShieldCount,
  dayNumber,
  worldName,
  onOpenSettings,
}: HeroGreetingProps) {
  const { t, isRTL, locale } = useTranslation();
  const [mounted, setMounted] = useState(false);

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
    return generateGreeting(ctx, locale);
  }, [locale, name, streak, longestStreak, totalLessons, lastLessonDate, lastLessonCoreTag, transformationGoal, t]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-24" />;
  }

  return (
    <motion.header
      className="relative mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top row — streak + settings */}
      <div className={`flex items-center justify-between mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <motion.div
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Streak badge */}
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Flame size={14} className="text-amber-400" />
              <span className="text-sm font-semibold text-amber-400 tabular-nums">{streak}</span>
            </div>
          )}
          {/* Shield count */}
          {streakShieldCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Shield size={12} className="text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">{streakShieldCount}</span>
            </div>
          )}
        </motion.div>

        <motion.button
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-xl bg-stone-900/60 light:bg-stone-200/60 border border-stone-800/60 light:border-stone-300/60 flex items-center justify-center hover:border-stone-700 light:hover:border-stone-400 transition-colors"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings size={18} className="text-stone-500 light:text-stone-600" />
        </motion.button>
      </div>

      {/* Greeting + Name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <p className={`text-sm uppercase tracking-[0.2em] text-stone-500 light:text-stone-600 mb-1 ${isRTL ? 'text-right' : ''}`}>
          {greetingResult.greeting}
        </p>
        <h1 className={`text-3xl sm:text-4xl font-serif font-bold text-stone-100 light:text-stone-900 tracking-tight mb-1.5 ${isRTL ? 'text-right' : ''}`}>
          {name || t('settings.seeker')}
        </h1>
        {dayNumber && worldName && (
          <p className={`text-sm text-stone-500 light:text-stone-600 ${isRTL ? 'text-right' : ''}`}>
            {t('dailyFlow.dayOf').replace('{current}', String(dayNumber)).replace('{total}', '')} {worldName}
          </p>
        )}
      </motion.div>
    </motion.header>
  );
}

export default HeroGreeting;
