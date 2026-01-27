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
  Flame,
  X,
  Sparkles,
  Target,
  Settings,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { AmbientBackground } from '@/components/ambient';
import { HelpTooltip } from '@/components/help';
import { getXpProgress } from '@/types';

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
}

function JourneyMapMini({ worldName, currentDay, totalDays, onPress }: JourneyMapMiniProps) {
  const progress = Math.round((currentDay / totalDays) * 100);
  const milestones = [0, 25, 50, 75, 100];

  return (
    <motion.button
      onClick={onPress}
      className="w-full p-4 rounded-2xl bg-gradient-to-br from-stone-900/80 to-stone-800/50 border border-stone-700/50 text-left"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Target size={16} className="text-amber-400" />
          </div>
          <div>
            <p className="text-stone-300 font-medium text-sm">{worldName}</p>
            <p className="text-stone-500 text-xs">Day {currentDay} of {totalDays}</p>
          </div>
        </div>
        <ChevronRight size={16} className="text-stone-600" />
      </div>

      {/* Progress track */}
      <div className="relative h-2 bg-stone-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
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
            style={{ left: `${milestone}%` }}
          />
        ))}
      </div>

      {/* Chapter indicators */}
      <div className="flex justify-between mt-2">
        {['Start', 'Ch.2', 'Mid', 'Ch.4', 'End'].map((label, index) => (
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
}: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl border transition-all text-left ${
        compact ? 'p-3' : 'p-4'
      } ${
        disabled
          ? 'bg-stone-900/30 border-stone-800/50 opacity-50 cursor-not-allowed'
          : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 hover:bg-stone-900/70'
      }`}
      whileHover={!disabled ? { scale: 1.01, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
    >
      <div className="flex items-center gap-3">
        <div className={`${compact ? 'w-9 h-9' : 'w-10 h-10'} rounded-lg ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
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
        <ChevronRight size={16} className="text-stone-600" />
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
}: DashboardProps) {
  const xpProgress = getXpProgress(totalXp);
  const todayComplete = todayLessonCompleted && todayEchoCompleted && exercisesCompleted === totalExercises;
  const phasesCompleted = (todayLessonCompleted ? 1 : 0) + (todayEchoCompleted ? 1 : 0) + (exercisesCompleted === totalExercises ? 1 : 0);

  // Goal display text
  const goalText = useMemo(() => {
    const goals: Record<string, string> = {
      calmer: 'finding inner calm',
      disciplined: 'building discipline',
      confident: 'growing confidence',
      leader: 'becoming a leader',
      focused: 'sharpening focus',
      resilient: 'building resilience',
    };
    return transformationGoal ? goals[transformationGoal] || 'transforming' : 'growing';
  }, [transformationGoal]);

  return (
    <div className="min-h-screen bg-stone-950 relative">
      <AmbientBackground intensity="subtle" particleCount={8} orbCount={2} />

      {/* Header */}
      <div className="sticky top-0 z-20 bg-stone-950/90 backdrop-blur-lg border-b border-stone-800">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-stone-100">Your Journey</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSettings}
                className="p-2 text-stone-500 hover:text-stone-300 transition-colors"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-stone-500 hover:text-stone-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
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
            Day {daysSinceStart || currentStreak} of Your Transformation
          </motion.p>

          {/* Main stats row */}
          <div className="flex items-center justify-center gap-8 mb-6">
            {/* Streak */}
            <div className="flex flex-col items-center">
              <AnimatedFlame streak={currentStreak} size="md" />
              <p className="text-xs text-stone-500 mt-1">Streak</p>
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
              <p className="text-xs text-stone-600">XP</p>
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
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20">
                <p className="text-stone-300 italic">
                  &ldquo;{latestIdentityStatement}&rdquo;
                </p>
                <p className="text-stone-500 text-xs mt-2">Your latest identity statement</p>
              </div>
            ) : (
              <p className="text-stone-400">
                You are becoming someone who is{' '}
                <span className="text-amber-400 font-medium">{goalText}</span>.
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: TODAY - Current Progress
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-stone-500 text-xs uppercase tracking-wider">Today</p>
            <HelpTooltip topic="exercises" size="sm" />
          </div>

          {/* Today's practice card */}
          <motion.button
            onClick={onOpenTodayPractice}
            className={`w-full p-5 rounded-2xl border text-left transition-all ${
              todayComplete
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-stone-900/50 border-stone-800 hover:border-stone-700'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-4">
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
                  {todayComplete ? "Today's Practice Complete" : todaysLessonTitle || "Today's Practice"}
                </p>

                {/* Phase indicators */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${todayLessonCompleted ? 'bg-emerald-500' : 'bg-stone-700'}`} />
                    <span className="text-xs text-stone-500">Lesson</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${todayEchoCompleted ? 'bg-emerald-500' : 'bg-stone-700'}`} />
                    <span className="text-xs text-stone-500">Echo</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${exercisesCompleted === totalExercises ? 'bg-emerald-500' : 'bg-stone-700'}`} />
                    <span className="text-xs text-stone-500">{exercisesCompleted}/{totalExercises}</span>
                  </div>
                </div>
              </div>

              <ChevronRight size={20} className="text-stone-600" />
            </div>
          </motion.button>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: YOUR JOURNEY - Progress & Reflection
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-stone-500 text-xs uppercase tracking-wider">Your Journey</p>
            <HelpTooltip topic="worlds" size="sm" />
          </div>

          <div className="space-y-3">
            {/* Journey Map Mini */}
            <JourneyMapMini
              worldName={currentWorld}
              currentDay={dayInWorld}
              totalDays={totalDaysInWorld}
              onPress={onOpenPastLessons}
            />

            {/* Check-ins row */}
            <div className="grid grid-cols-2 gap-3">
              <NavItem
                icon={<Calendar size={16} className="text-emerald-400" />}
                iconBg="bg-emerald-500/20"
                label="Weekly Check-in"
                badge={isWeeklyCheckinDue ? 'Due' : undefined}
                badgeColor="bg-emerald-500"
                onClick={onOpenWeeklyCheckin}
                compact
              />
              <NavItem
                icon={<BarChart3 size={16} className="text-blue-400" />}
                iconBg="bg-blue-500/20"
                label="Monthly Review"
                badge={isMonthlyAssessmentDue ? 'Due' : undefined}
                badgeColor="bg-blue-500"
                onClick={onOpenMonthlyAssessment}
                compact
              />
            </div>

            {/* Identity & Milestones */}
            <div className="grid grid-cols-2 gap-3">
              <NavItem
                icon={<User size={16} className="text-cyan-400" />}
                iconBg="bg-cyan-500/20"
                label="Identity"
                sublabel={identityStatements > 0 ? `${identityStatements} statements` : 'Who you\'re becoming'}
                onClick={onOpenIdentity}
                compact
              />
              <NavItem
                icon={<Award size={16} className="text-yellow-400" />}
                iconBg="bg-yellow-500/20"
                label="Milestones"
                sublabel={`${totalMilestones} unlocked`}
                onClick={onOpenMilestones}
                compact
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
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-stone-500 text-xs uppercase tracking-wider">Community</p>
            <HelpTooltip topic="echoes" size="sm" />
          </div>

          <div className="space-y-2">
            <NavItem
              icon={<Heart size={18} className="text-rose-400" />}
              iconBg="bg-rose-500/20"
              label="Browse Echoes"
              sublabel="Read & respond to reflections"
              onClick={onOpenBrowseEchoes}
            />
            <NavItem
              icon={<MessageCircle size={18} className="text-amber-400" />}
              iconBg="bg-amber-500/20"
              label="Your Inbox"
              sublabel="Responses to your reflections"
              badge={unreadEchoCount > 0 ? unreadEchoCount : undefined}
              onClick={onOpenYourEchoes}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-stone-200">{totalLessons}</p>
                  <p className="text-xs text-stone-500">Lessons</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-stone-200">{longestStreak}</p>
                  <p className="text-xs text-stone-500">Best Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-stone-200">{daysSinceStart || 1}</p>
                  <p className="text-xs text-stone-500">Days</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <span className="text-sm">View all stats</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </button>
        </motion.div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}

export default DashboardNew;
