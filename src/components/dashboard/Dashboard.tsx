'use client';

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD - THE NAVIGATION HUB
// ═══════════════════════════════════════════════════════════════════════════
//
// Clean. Focused. Beautiful.
//
// Today first. Clear categories. Minimal clicks.
// This is where users go to access everything outside the daily flow.
//
// Categories:
// - TODAY: Daily practice status
// - REFLECT: Weekly check-in, Monthly assessment, Sanctuary
// - CONNECT: Echoes, Your echoes
// - REVISIT: Past lessons, Past exercises
// - PROGRESS: Milestones, Identity, Stats
//
// ═══════════════════════════════════════════════════════════════════════════

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
  Clock,
  Flame,
  Zap,
  RefreshCw,
  FileText,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AmbientBackground } from '@/components/ambient';
import { getLevelFromXp, getXpProgress } from '@/types';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface DashboardProps {
  // User info
  name: string;
  totalXp: number;
  currentStreak: number;
  level: { level: number; title: string };

  // Today's status
  todayLessonCompleted: boolean;
  todayEchoCompleted: boolean;
  exercisesCompleted: number;
  totalExercises: number;
  todaysLessonTitle?: string;

  // Due indicators
  isWeeklyCheckinDue: boolean;
  isMonthlyAssessmentDue: boolean;
  daysUntilAssessment: number;

  // Echo counts
  unreadEchoCount: number;
  yourEchoCount: number;

  // Stats
  totalLessons: number;
  totalMilestones: number;
  identityStatements: number;

  // Navigation
  onClose: () => void;
  onOpenTodayPractice: () => void;
  onOpenWeeklyCheckin: () => void;
  onOpenMonthlyAssessment: () => void;
  onOpenSanctuary?: () => void;
  onOpenBrowseEchoes: () => void;
  onOpenYourEchoes: () => void;
  onOpenPastLessons: () => void;
  onOpenPastExercises?: () => void;
  onOpenMilestones: () => void;
  onOpenIdentity: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION ITEM COMPONENT
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
}: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 rounded-xl border transition-all text-left ${
        disabled
          ? 'bg-stone-900/30 border-stone-800/50 opacity-50 cursor-not-allowed'
          : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 hover:bg-stone-900/70'
      }`}
      whileHover={!disabled ? { scale: 1.01, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-stone-200 font-medium">{label}</p>
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
        <ChevronRight size={18} className="text-stone-600" />
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function Dashboard({
  name,
  totalXp,
  currentStreak,
  level,
  todayLessonCompleted,
  todayEchoCompleted,
  exercisesCompleted,
  totalExercises,
  todaysLessonTitle,
  isWeeklyCheckinDue,
  isMonthlyAssessmentDue,
  daysUntilAssessment,
  unreadEchoCount,
  yourEchoCount,
  totalLessons,
  totalMilestones,
  identityStatements,
  onClose,
  onOpenTodayPractice,
  onOpenWeeklyCheckin,
  onOpenMonthlyAssessment,
  onOpenSanctuary,
  onOpenBrowseEchoes,
  onOpenYourEchoes,
  onOpenPastLessons,
  onOpenPastExercises,
  onOpenMilestones,
  onOpenIdentity,
  onOpenStats,
  onOpenSettings,
}: DashboardProps) {
  const xpProgress = getXpProgress(totalXp);

  // Calculate today's completion status
  const todayComplete = todayLessonCompleted && todayEchoCompleted && exercisesCompleted === totalExercises;
  const todayInProgress = todayLessonCompleted || todayEchoCompleted || exercisesCompleted > 0;

  return (
    <div className="min-h-screen bg-stone-950 relative">
      <AmbientBackground intensity="subtle" particleCount={8} orbCount={2} />

      {/* Header */}
      <div className="sticky top-0 z-20 bg-stone-950/90 backdrop-blur-lg border-b border-stone-800">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-stone-100">Dashboard</h1>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-stone-500 hover:text-stone-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* ═══════════════════════════════════════════════════════════════════
            YOUR JOURNEY - Stats header
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-6 mb-4">
            {/* Streak */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Flame size={20} className="text-orange-400" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-stone-100">{currentStreak}</p>
                <p className="text-xs text-stone-500">Day Streak</p>
              </div>
            </div>

            {/* Level */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-400">{level.level}</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-stone-200">{level.title}</p>
                <p className="text-xs text-stone-500">{totalXp.toLocaleString()} XP</p>
              </div>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="max-w-xs mx-auto">
            <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-amber-500"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress.percentage}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            TODAY - Daily practice status
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-stone-500 text-xs uppercase tracking-wider mb-3 px-1">Today</p>

          <Card variant={todayComplete ? 'glow' : 'default'} padding="md" className="mb-4">
            <button
              onClick={onOpenTodayPractice}
              className="w-full text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  todayComplete
                    ? 'bg-emerald-500/20'
                    : todayInProgress
                    ? 'bg-amber-500/20'
                    : 'bg-stone-800'
                }`}>
                  {todayComplete ? (
                    <span className="text-2xl">✨</span>
                  ) : (
                    <BookOpen size={24} className={todayInProgress ? 'text-amber-400' : 'text-stone-500'} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-stone-100">
                      {todayComplete ? "Today's Practice Complete" : todaysLessonTitle || "Today's Practice"}
                    </p>
                  </div>

                  {/* Progress dots */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${todayLessonCompleted ? 'bg-emerald-500' : 'bg-stone-700'}`} />
                      <span className="text-xs text-stone-500">Lesson</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${todayEchoCompleted ? 'bg-emerald-500' : 'bg-stone-700'}`} />
                      <span className="text-xs text-stone-500">Echo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${exercisesCompleted === totalExercises ? 'bg-emerald-500' : 'bg-stone-700'}`} />
                      <span className="text-xs text-stone-500">{exercisesCompleted}/{totalExercises}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight size={20} className="text-stone-600" />
              </div>
            </button>
          </Card>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            REFLECT - Check-ins, assessments, sanctuary
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-stone-500 text-xs uppercase tracking-wider mb-3 px-1">Reflect</p>

          <div className="space-y-2">
            <NavItem
              icon={<Calendar size={18} className="text-emerald-400" />}
              iconBg="bg-emerald-500/20"
              label="Weekly Check-in"
              sublabel={isWeeklyCheckinDue ? 'Ready for you' : 'Reflect on your week'}
              badge={isWeeklyCheckinDue ? 'Due' : undefined}
              badgeColor="bg-emerald-500"
              onClick={onOpenWeeklyCheckin}
            />

            <NavItem
              icon={<BarChart3 size={18} className="text-blue-400" />}
              iconBg="bg-blue-500/20"
              label="Monthly Assessment"
              sublabel={isMonthlyAssessmentDue ? 'Time to reflect' : `${daysUntilAssessment} days`}
              badge={isMonthlyAssessmentDue ? 'Due' : undefined}
              badgeColor="bg-blue-500"
              onClick={onOpenMonthlyAssessment}
            />

            {onOpenSanctuary && (
              <NavItem
                icon={<FileText size={18} className="text-purple-400" />}
                iconBg="bg-purple-500/20"
                label="Sanctuary"
                sublabel="Free-form journaling"
                onClick={onOpenSanctuary}
              />
            )}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            CONNECT - Echoes
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-stone-500 text-xs uppercase tracking-wider mb-3 px-1">Connect</p>

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
              label="Your Echoes"
              sublabel="Responses to your reflections"
              badge={unreadEchoCount > 0 ? unreadEchoCount : undefined}
              onClick={onOpenYourEchoes}
            />
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            REVISIT - Past content
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-stone-500 text-xs uppercase tracking-wider mb-3 px-1">Revisit</p>

          <div className="space-y-2">
            <NavItem
              icon={<BookOpen size={18} className="text-indigo-400" />}
              iconBg="bg-indigo-500/20"
              label="Past Lessons"
              sublabel={`${totalLessons} lessons completed`}
              onClick={onOpenPastLessons}
            />

            {onOpenPastExercises && (
              <NavItem
                icon={<RefreshCw size={18} className="text-teal-400" />}
                iconBg="bg-teal-500/20"
                label="Past Exercises"
                sublabel="Redo exercises from completed worlds"
                onClick={onOpenPastExercises}
              />
            )}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            PROGRESS - Stats and achievements
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-stone-500 text-xs uppercase tracking-wider mb-3 px-1">Progress</p>

          <div className="space-y-2">
            <NavItem
              icon={<Award size={18} className="text-yellow-400" />}
              iconBg="bg-yellow-500/20"
              label="Milestones"
              sublabel={`${totalMilestones} unlocked`}
              onClick={onOpenMilestones}
            />

            <NavItem
              icon={<User size={18} className="text-cyan-400" />}
              iconBg="bg-cyan-500/20"
              label="Identity Statements"
              sublabel={identityStatements > 0 ? `${identityStatements} declarations` : 'Who are you becoming?'}
              onClick={onOpenIdentity}
            />

            <NavItem
              icon={<BarChart3 size={18} className="text-stone-400" />}
              iconBg="bg-stone-700"
              label="Detailed Stats"
              sublabel="Full progress breakdown"
              onClick={onOpenStats}
            />
          </div>
        </motion.div>

        {/* Settings at the bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-4 pb-8"
        >
          <button
            onClick={onOpenSettings}
            className="w-full text-center text-stone-600 hover:text-stone-400 transition-colors text-sm"
          >
            Settings
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
