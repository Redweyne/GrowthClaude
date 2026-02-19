'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Calendar, Flame, BookOpen, Zap, PenLine, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';

// ═══════════════════════════════════════════════════════════════════════════
// WEEK IN REVIEW SUMMARY CARD
// Shown after 7 active days - a beautiful recap of the user's week
// ═══════════════════════════════════════════════════════════════════════════

interface WeekSummaryCardProps {
  onDismiss: () => void;
}

export function WeekSummaryCard({ onDismiss }: WeekSummaryCardProps) {
  const {
    activityLog,
    currentStreak,
    totalXp,
    completedLessons,
    allReflections,
  } = useStore();

  const weekData = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const thisWeek = activityLog.filter(a => a.date >= weekAgoStr);

    const lessonsThisWeek = thisWeek.reduce((sum, a) => sum + a.lessonsCompleted, 0);
    const xpThisWeek = thisWeek.reduce((sum, a) => sum + a.xpEarned, 0);
    const reflectionsThisWeek = thisWeek.reduce((sum, a) => sum + a.reflectionsWritten, 0);
    const activeDays = thisWeek.length;

    // Find best day
    const bestDay = thisWeek.reduce((best, day) => {
      const score = day.lessonsCompleted + day.reflectionsWritten;
      const bestScore = best ? best.lessonsCompleted + best.reflectionsWritten : 0;
      return score > bestScore ? day : best;
    }, thisWeek[0] as typeof thisWeek[0] | undefined);

    // Day name for best day
    const bestDayName = bestDay
      ? new Date(bestDay.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'long' })
      : '';

    return {
      lessonsThisWeek,
      xpThisWeek,
      reflectionsThisWeek,
      activeDays,
      bestDayName,
      streak: currentStreak,
    };
  }, [activityLog, currentStreak]);

  const stats = [
    {
      icon: BookOpen,
      label: 'Lessons',
      value: weekData.lessonsThisWeek,
      color: 'text-amber-400',
    },
    {
      icon: PenLine,
      label: 'Reflections',
      value: weekData.reflectionsThisWeek,
      color: 'text-violet-400',
    },
    {
      icon: Zap,
      label: 'XP Earned',
      value: weekData.xpThisWeek,
      color: 'text-emerald-400',
    },
    {
      icon: Flame,
      label: 'Active Days',
      value: weekData.activeDays,
      color: 'text-orange-400',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <Card className="relative overflow-hidden p-6">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top center, rgba(245, 158, 11, 0.08) 0%, transparent 60%)',
          }}
        />

        {/* Header */}
        <div className="relative flex items-center gap-3 mb-6">
          <motion.div
            className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Calendar size={20} className="text-amber-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">Your Week in Review</h3>
            <p className="text-xs text-stone-500">Keep building momentum</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="relative grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-stone-800/40 light:bg-stone-100/60 rounded-xl p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon size={14} className={stat.color} />
                <span className="text-xs text-stone-500">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-white light:text-stone-800">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Streak callout */}
        {weekData.streak >= 7 && (
          <motion.div
            className="relative flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Trophy size={18} className="text-amber-400 flex-shrink-0" />
            <p className="text-sm text-stone-300 light:text-stone-600">
              <span className="font-semibold text-amber-400">{weekData.streak}-day streak</span>
              {weekData.bestDayName && (
                <span className="text-stone-500"> &middot; Best day: {weekData.bestDayName}</span>
              )}
            </p>
          </motion.div>
        )}

        {/* Dismiss button */}
        <motion.button
          onClick={onDismiss}
          className="w-full py-2.5 rounded-xl bg-stone-800/60 light:bg-stone-200/60 text-stone-300 light:text-stone-600 text-sm font-medium hover:bg-stone-700/60 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Continue
        </motion.button>
      </Card>
    </motion.div>
  );
}

export default WeekSummaryCard;
