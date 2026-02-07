'use client';

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD - THE TRANSFORMATION HUB (REDESIGNED)
// ═══════════════════════════════════════════════════════════════════════════
//
// A beautiful, emotionally-resonant dashboard that:
// 1. Leads with IDENTITY - who you're becoming, not just metrics
// 2. Uses a circular progress ring for satisfaction
// 3. Simplified to 3 clear sections: Today, Journey, Community
// 4. Includes a mini journey map showing world progress
// 5. Celebrates streaks with animated flames
//
// Every element is designed to make users FEEL their transformation.
// ═══════════════════════════════════════════════════════════════════════════

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Heart,
  Calendar,
  Award,
  User,
  BarChart3,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Flame,
  Sparkles,
  Target,
  Settings,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { AmbientBackground } from '@/components/ambient';
import { SparkLockedCard } from '@/components/spark/SparkLockedCard';
import { HelpTooltip } from '@/components/help';
import { getXpProgress } from '@/types';
import { useTranslation } from '@/i18n';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface DashboardProps {
  // User info
  name: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  level: { level: number; title: string };
  transformationGoal?: string;
  latestIdentityStatement?: string;

  // Today's status
  todayLessonCompleted: boolean;
  todayEchoCompleted: boolean;
  exercisesCompleted: number;
  totalExercises: number;
  todaysLessonTitle?: string;

  // World progress
  currentWorld: string;
  dayInWorld: number;
  totalDaysInWorld: number;

  // Due indicators
  isWeeklyCheckinDue: boolean;
  isMonthlyAssessmentDue: boolean;

  // Echo counts
  unreadEchoCount: number;

  // Stats
  totalLessons: number;
  totalMilestones: number;
  identityStatements: number;
  daysSinceStart: number;

  // Navigation
  onClose: () => void;
  onOpenTodayPractice: () => void;
  onOpenWeeklyCheckin: () => void;
  onOpenMonthlyAssessment: () => void;
  onOpenBrowseEchoes: () => void;
  onOpenYourEchoes: () => void;
  onOpenPastLessons: () => void;
  onOpenMilestones: () => void;
  onOpenIdentity: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;

  // Spark
  onOpenSpark?: () => void;
  isSparkUnlocked?: boolean;
  isSparkForcedClosed?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// CIRCULAR PROGRESS RING COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

function ProgressRing({ progress, size = 120, strokeWidth = 8, children }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-stone-800"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED STREAK FLAME
// ═══════════════════════════════════════════════════════════════════════════

interface AnimatedFlameProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

function AnimatedFlame({ streak, size = 'md' }: AnimatedFlameProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = { sm: 20, md: 28, lg: 36 };
  const isHot = streak >= 7;
  const isBlazing = streak >= 30;

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} flex items-center justify-center`}
      animate={streak > 0 ? {
        scale: [1, 1.1, 1],
      } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Glow effect */}
      {streak > 0 && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 ${isHot ? '20' : '10'}px rgba(251, 146, 60, 0.3)`,
              `0 0 ${isHot ? '40' : '20'}px rgba(251, 146, 60, 0.5)`,
              `0 0 ${isHot ? '20' : '10'}px rgba(251, 146, 60, 0.3)`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Flame icon */}
      <motion.div
        animate={streak > 0 ? {
          y: [0, -2, 0],
          rotate: isBlazing ? [-3, 3, -3] : 0,
        } : {}}
        transition={{ duration: isBlazing ? 0.3 : 1, repeat: Infinity }}
      >
        <Flame
          size={iconSizes[size]}
          className={
            streak === 0
              ? 'text-stone-600'
              : isBlazing
              ? 'text-orange-400'
              : isHot
              ? 'text-orange-500'
              : 'text-amber-500'
          }
          fill={streak > 0 ? 'currentColor' : 'none'}
        />
      </motion.div>

      {/* Streak number */}
      <div className="absolute -bottom-1 -right-1 bg-stone-900 border border-stone-700 rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
        <span className={`text-xs font-bold ${streak > 0 ? 'text-amber-400' : 'text-stone-500'}`}>
          {streak}
        </span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// JOURNEY MAP MINI
// ═══════════════════════════════════════════════════════════════════════════

interface JourneyMapMiniProps {
  worldName: string;
  currentDay: number;
  totalDays: number;
  onPress?: () => void;
  isRTL?: boolean;
  t: (key: string) => string;
}

function JourneyMapMini({ worldName, currentDay, totalDays, onPress, isRTL = false, t }: JourneyMapMiniProps) {
  const progress = Math.round((currentDay / totalDays) * 100);
  const milestones = [0, 25, 50, 75, 100];

  return (
    <motion.button
      onClick={onPress}
      className={`w-full p-4 rounded-2xl bg-gradient-to-br from-stone-900/80 to-stone-800/50 border border-stone-700/50 ${isRTL ? 'text-right' : 'text-left'}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Target size={16} className="text-amber-400" />
          </div>
          <div>
            <p className="text-stone-300 font-medium text-sm">{worldName}</p>
            <p className="text-stone-500 text-xs">{t('world.dayOf').replace('{current}', String(currentDay)).replace('{total}', String(totalDays))}</p>
          </div>
        </div>
        {isRTL ? <ChevronLeft size={16} className="text-stone-600" /> : <ChevronRight size={16} className="text-stone-600" />}
      </div>

      {/* Progress track */}
      <div className="relative h-2 bg-stone-800 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 ${isRTL ? 'right-0' : 'left-0'} bg-gradient-to-r from-amber-500 to-orange-500 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Milestone markers */}
        {milestones.map((milestone) => (
          <div
            key={milestone}
            className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full ${
              progress >= milestone ? 'bg-stone-900' : 'bg-stone-600'
            }`}
            style={{ [isRTL ? 'right' : 'left']: `${milestone}%` }}
          />
        ))}
      </div>

      {/* Chapter indicators */}
      <div className={`flex justify-between mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {[t('dashboard.chapterLabels.start'), t('dashboard.chapterLabels.chapter2'), t('dashboard.chapterLabels.mid'), t('dashboard.chapterLabels.chapter4'), t('dashboard.chapterLabels.end')].map((label, index) => (
          <span
            key={label}
            className={`text-[10px] ${
              progress >= milestones[index] ? 'text-amber-500' : 'text-stone-600'
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NAV ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface NavItemProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  sublabel?: string;
  badge?: string | number;
  badgeColor?: string;
  onClick: () => void;
  disabled?: boolean;
  compact?: boolean;
  isRTL?: boolean;
}

function NavItem({
  icon,
  iconBg,
  label,
  sublabel,
  badge,
  badgeColor = 'bg-amber-500',
  onClick,
  disabled = false,
  compact = false,
  isRTL = false,
}: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl border transition-all ${isRTL ? 'text-right' : 'text-left'} ${
        compact ? 'p-3' : 'p-4'
      } ${
        disabled
          ? 'bg-stone-900/30 border-stone-800/50 opacity-50 cursor-not-allowed'
          : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 hover:bg-stone-900/70'
      }`}
      whileHover={!disabled ? { scale: 1.01, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
    >
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`${compact ? 'w-9 h-9' : 'w-10 h-10'} rounded-lg ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <p className={`text-stone-200 font-medium ${compact ? 'text-sm' : ''}`}>{label}</p>
            {badge && (
              <span className={`px-2 py-0.5 ${badgeColor} text-white text-xs font-medium rounded-full`}>
                {badge}
              </span>
            )}
          </div>
          {sublabel && (
            <p className="text-stone-500 text-sm truncate">{sublabel}</p>
          )}
        </div>
        {isRTL ? <ChevronLeft size={16} className="text-stone-600" /> : <ChevronRight size={16} className="text-stone-600" />}
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function DashboardNew({
  name,
  totalXp,
  currentStreak,
  longestStreak,
  level,
  transformationGoal,
  latestIdentityStatement,
  todayLessonCompleted,
  todayEchoCompleted,
  exercisesCompleted,
  totalExercises,
  todaysLessonTitle,
  currentWorld,
  dayInWorld,
  totalDaysInWorld,
  isWeeklyCheckinDue,
  isMonthlyAssessmentDue,
  unreadEchoCount,
  totalLessons,
  totalMilestones,
  identityStatements,
  daysSinceStart,
  onClose,
  onOpenTodayPractice,
  onOpenWeeklyCheckin,
  onOpenMonthlyAssessment,
  onOpenBrowseEchoes,
  onOpenYourEchoes,
  onOpenPastLessons,
  onOpenMilestones,
  onOpenIdentity,
  onOpenStats,
  onOpenSettings,
  onOpenSpark,
  isSparkUnlocked,
  isSparkForcedClosed,
}: DashboardProps) {
  const { t, isRTL } = useTranslation();
  const xpProgress = getXpProgress(totalXp);
  const todayComplete = todayLessonCompleted && todayEchoCompleted && exercisesCompleted === totalExercises;

  // Get daily quote index (rotates through 10 quotes based on day of year)
  const getDailyQuoteIndex = (): number => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return dayOfYear % 10;
  };
  const phasesCompleted = (todayLessonCompleted ? 1 : 0) + (todayEchoCompleted ? 1 : 0) + (exercisesCompleted === totalExercises ? 1 : 0);

  // Goal display text
  const goalText = useMemo(() => {
    const goalKey = transformationGoal || 'growing';
    return t(`dashboard.goals.${goalKey}` as any) || t('dashboard.goals.transforming');
  }, [transformationGoal, t]);

  return (
    <div className="min-h-screen bg-stone-950 relative">
      <AmbientBackground intensity="subtle" particleCount={8} orbCount={2} />

      {/* Header */}
      <div className="sticky top-0 z-20 bg-stone-950/90 backdrop-blur-lg border-b border-stone-800">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h1 className="text-xl font-bold text-stone-100">{t('dashboard.yourJourney')}</h1>
            <button
              onClick={onOpenSettings}
              className="p-2 text-stone-500 hover:text-stone-300 transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* ═══════════════════════════════════════════════════════════════════
            IDENTITY HEADER - Who You're Becoming
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Transformation days counter */}
          <motion.p
            className="text-stone-500 text-sm mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {t('dashboard.dayOfTransformation').replace('{day}', String(daysSinceStart || currentStreak))}
          </motion.p>

          {/* Main stats row */}
          <div className={`flex items-center justify-center gap-8 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Streak */}
            <div className="flex flex-col items-center">
              <AnimatedFlame streak={currentStreak} size="md" />
              <p className="text-xs text-stone-500 mt-1">{t('common.streak')}</p>
            </div>

            {/* XP Progress Ring */}
            <ProgressRing progress={xpProgress.percentage} size={100} strokeWidth={6}>
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-100">{level.level}</p>
                <p className="text-xs text-stone-500">{level.title}</p>
              </div>
            </ProgressRing>

            {/* Level info */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles size={24} className="text-purple-400" />
              </div>
              <p className="text-xs text-stone-400 mt-1 font-medium">{totalXp.toLocaleString()}</p>
              <p className="text-xs text-stone-600">{t('common.xp')}</p>
            </div>
          </div>

          {/* Identity statement or goal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-sm mx-auto"
          >
            {latestIdentityStatement ? (
              <div className={`p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 ${isRTL ? 'text-right' : ''}`}>
                <p className="text-stone-300 italic">
                  &ldquo;{latestIdentityStatement}&rdquo;
                </p>
                <p className="text-stone-500 text-xs mt-2">{t('dashboard.latestIdentity')}</p>
              </div>
            ) : (
              <p className="text-stone-400">
                {t('dashboard.youAreBecoming')}{' '}
                <span className="text-amber-400 font-medium">{goalText}</span>.
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            QUOTE OF THE DAY - Daily Wisdom
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/20 via-stone-900/40 to-amber-900/20 border border-purple-500/20 overflow-hidden">
            {/* Decorative quote mark */}
            <div className="absolute top-2 left-4 text-6xl text-purple-500/10 font-serif leading-none select-none">&ldquo;</div>

            <div className="relative z-10">
              <p className={`text-stone-300 text-base leading-relaxed italic ${isRTL ? 'text-right' : ''}`}>
                {t(`home.wisdomQuotes.${getDailyQuoteIndex()}.text` as any) || "The obstacle is the way."}
              </p>
              <p className={`text-purple-400/80 text-sm mt-3 font-medium ${isRTL ? 'text-right' : ''}`}>
                — {t(`home.wisdomQuotes.${getDailyQuoteIndex()}.author` as any) || "Marcus Aurelius"}
              </p>
            </div>

            {/* Subtle label */}
            <div className={`absolute bottom-2 ${isRTL ? 'left-3' : 'right-3'} flex items-center gap-1.5`}>
              <Sparkles size={10} className="text-purple-500/40" />
              <span className="text-[10px] text-purple-500/40 uppercase tracking-wider">{t('dashboard.quoteOfTheDay')}</span>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: TODAY - Current Progress
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={`flex items-center justify-between mb-3 px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <p className="text-stone-500 text-xs uppercase tracking-wider">{t('dashboard.sections.today')}</p>
            <HelpTooltip topic="exercises" size="sm" />
          </div>

          {/* Today's practice card */}
          <motion.button
            onClick={onOpenTodayPractice}
            className={`w-full p-5 rounded-2xl border transition-all ${isRTL ? 'text-right' : 'text-left'} ${
              todayComplete
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-stone-900/50 border-stone-800 hover:border-stone-700'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                todayComplete ? 'bg-emerald-500/20' : 'bg-amber-500/20'
              }`}>
                {todayComplete ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  >
                    <CheckCircle size={28} className="text-emerald-400" />
                  </motion.div>
                ) : (
                  <BookOpen size={28} className="text-amber-400" />
                )}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-stone-100 mb-1">
                  {todayComplete ? t('dashboard.todaysPracticeComplete') : todaysLessonTitle || t('dashboard.todaysPractice')}
                </p>

                {/* Phase indicators */}
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-2 h-2 rounded-full ${todayLessonCompleted ? 'bg-emerald-500' : 'bg-stone-700'}`} />
                    <span className="text-xs text-stone-500">{t('dashboard.lesson')}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-2 h-2 rounded-full ${todayEchoCompleted ? 'bg-emerald-500' : 'bg-stone-700'}`} />
                    <span className="text-xs text-stone-500">{t('dashboard.echo')}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-2 h-2 rounded-full ${exercisesCompleted === totalExercises ? 'bg-emerald-500' : 'bg-stone-700'}`} />
                    <span className="text-xs text-stone-500">{exercisesCompleted}/{totalExercises}</span>
                  </div>
                </div>
              </div>

              {isRTL ? <ChevronLeft size={20} className="text-stone-600" /> : <ChevronRight size={20} className="text-stone-600" />}
            </div>
          </motion.button>

          {/* Spark card */}
          {onOpenSpark && (
            <motion.div
              className="mt-3"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <SparkLockedCard
                isUnlocked={isSparkUnlocked ?? false}
                isForcedClosed={isSparkForcedClosed}
                onOpen={onOpenSpark}
              />
            </motion.div>
          )}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: YOUR JOURNEY - Progress & Reflection
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={`flex items-center justify-between mb-3 px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <p className="text-stone-500 text-xs uppercase tracking-wider">{t('dashboard.sections.yourJourney')}</p>
            <HelpTooltip topic="worlds" size="sm" />
          </div>

          <div className="space-y-3">
            {/* Journey Map Mini */}
            <JourneyMapMini
              worldName={currentWorld}
              currentDay={dayInWorld}
              totalDays={totalDaysInWorld}
              onPress={onOpenPastLessons}
              isRTL={isRTL}
              t={t}
            />

            {/* Check-ins row */}
            <div className="grid grid-cols-2 gap-3">
              <NavItem
                icon={<Calendar size={16} className="text-emerald-400" />}
                iconBg="bg-emerald-500/20"
                label={t('dashboard.weeklyCheckin')}
                badge={isWeeklyCheckinDue ? t('dashboard.due') : undefined}
                badgeColor="bg-emerald-500"
                onClick={onOpenWeeklyCheckin}
                compact
                isRTL={isRTL}
              />
              <NavItem
                icon={<BarChart3 size={16} className="text-blue-400" />}
                iconBg="bg-blue-500/20"
                label={t('dashboard.monthlyReview')}
                badge={isMonthlyAssessmentDue ? t('dashboard.due') : undefined}
                badgeColor="bg-blue-500"
                onClick={onOpenMonthlyAssessment}
                compact
                isRTL={isRTL}
              />
            </div>

            {/* Identity & Milestones */}
            <div className="grid grid-cols-2 gap-3">
              <NavItem
                icon={<User size={16} className="text-cyan-400" />}
                iconBg="bg-cyan-500/20"
                label={t('dashboard.identity')}
                sublabel={identityStatements > 0 ? t('dashboard.statements').replace('{count}', String(identityStatements)) : t('dashboard.whoYoureBecoming')}
                onClick={onOpenIdentity}
                compact
                isRTL={isRTL}
              />
              <NavItem
                icon={<Award size={16} className="text-yellow-400" />}
                iconBg="bg-yellow-500/20"
                label={t('common.milestones')}
                sublabel={t('dashboard.unlocked').replace('{count}', String(totalMilestones))}
                onClick={onOpenMilestones}
                compact
                isRTL={isRTL}
              />
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: COMMUNITY - Connection
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`flex items-center justify-between mb-3 px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <p className="text-stone-500 text-xs uppercase tracking-wider">{t('dashboard.sections.community')}</p>
            <HelpTooltip topic="echoes" size="sm" />
          </div>

          <div className="space-y-2">
            <NavItem
              icon={<Heart size={18} className="text-rose-400" />}
              iconBg="bg-rose-500/20"
              label={t('dashboard.browseEchoes')}
              sublabel={t('dashboard.readRespond')}
              onClick={onOpenBrowseEchoes}
              isRTL={isRTL}
            />
            <NavItem
              icon={<MessageCircle size={18} className="text-amber-400" />}
              iconBg="bg-amber-500/20"
              label={t('dashboard.yourInbox')}
              sublabel={t('dashboard.responsesToReflections')}
              badge={unreadEchoCount > 0 ? unreadEchoCount : undefined}
              onClick={onOpenYourEchoes}
              isRTL={isRTL}
            />
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            STATS SUMMARY - Quick overview
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={onOpenStats}
            className="w-full p-4 rounded-2xl bg-stone-900/30 border border-stone-800/50 hover:border-stone-700 transition-all"
          >
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="text-center">
                  <p className="text-lg font-bold text-stone-200">{totalLessons}</p>
                  <p className="text-xs text-stone-500">{t('common.lessons')}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-stone-200">{longestStreak}</p>
                  <p className="text-xs text-stone-500">{t('dashboard.bestStreak')}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-stone-200">{daysSinceStart || 1}</p>
                  <p className="text-xs text-stone-500">{t('common.days')}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 text-stone-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm">{t('dashboard.viewAllStats')}</span>
                {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </div>
            </div>
          </button>
        </motion.div>

        {/* Bottom spacing for nav bar */}
        <div className="h-24" />
      </div>
    </div>
  );
}

export default DashboardNew;
