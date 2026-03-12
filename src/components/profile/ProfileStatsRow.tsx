'use client';

import { motion } from 'framer-motion';
import { Flame, Zap, Trophy } from 'lucide-react';
import { getXpProgress } from '@/types';
import { useTranslation } from '@/i18n';

interface ProfileStatsRowProps {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  level: { level: number; title: string };
}

export function ProfileStatsRow({ totalXp, currentStreak, longestStreak, level }: ProfileStatsRowProps) {
  const { t } = useTranslation();
  const xpProgress = getXpProgress(totalXp);

  return (
    <motion.div
      className="flex gap-3 px-5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      {/* Level */}
      <StatCard
        icon={<Trophy className="w-4 h-4" style={{ color: 'var(--profile-accent, #fbbf24)' }} />}
        label={t('profilePage.level')}
        value={`${level.level}`}
        subtitle={level.title}
        delay={0}
      />

      {/* Streak */}
      <StatCard
        icon={<Flame className="w-4 h-4 text-orange-400" />}
        label={t('profilePage.streak')}
        value={`${currentStreak}d`}
        subtitle={`${t('profilePage.best')}: ${longestStreak}d`}
        delay={0.05}
      />

      {/* XP */}
      <StatCard
        icon={<Zap className="w-4 h-4" style={{ color: 'var(--profile-accent, #fbbf24)' }} />}
        label={t('profilePage.xp')}
        value={`${totalXp}`}
        subtitle={`${Math.round(xpProgress.percentage)}% ${t('profilePage.toNext')}`}
        delay={0.1}
      />
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex-1 bg-stone-900/60 light:bg-stone-200/60 backdrop-blur-sm rounded-xl border border-stone-800/50 light:border-stone-300/50 p-3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.35 + delay, type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">{label}</span>
      </div>
      <div className="text-xl font-bold" style={{ color: 'var(--profile-accent, #fbbf24)' }}>
        {value}
      </div>
      <div className="text-[10px] text-stone-500 mt-0.5">{subtitle}</div>
    </motion.div>
  );
}
