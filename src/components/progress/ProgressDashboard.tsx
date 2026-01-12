'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  BookOpen,
  PenTool,
  Award,
  Sparkles,
  Calendar,
  Target,
  ChevronLeft,
  BarChart3,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { StreakCalendar } from './StreakCalendar';
import { StoryTrigger } from '@/components/story';
import { getLevelFromXp, getXpProgress } from '@/types';
import { useTransformationStory } from '@/hooks';

interface ProgressDashboardProps {
  onBack: () => void;
  onOpenAchievements: () => void;
  onOpenIdentity: () => void;
  onOpenStory: () => void;
}

export function ProgressDashboard({
  onBack,
  onOpenAchievements,
  onOpenIdentity,
  onOpenStory,
}: ProgressDashboardProps) {
  const {
    getProgressStats,
    totalXp,
    currentStreak,
    longestStreak,
    name,
  } = useStore();

  const { canGenerateStory, storyReadiness } = useTransformationStory();

  const stats = getProgressStats();
  const level = getLevelFromXp(totalXp);
  const xpProgress = getXpProgress(totalXp);

  const statCards = [
    {
      icon: BookOpen,
      label: 'Lessons Completed',
      value: stats.totalLessons,
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-blue-600/10',
    },
    {
      icon: PenTool,
      label: 'Reflections Written',
      value: stats.totalReflections,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/20 to-purple-600/10',
    },
    {
      icon: Sparkles,
      label: 'Identity Statements',
      value: stats.totalIdentityStatements,
      color: 'text-amber-400',
      bgColor: 'from-amber-500/20 to-amber-600/10',
      onClick: onOpenIdentity,
    },
    {
      icon: Award,
      label: 'Achievements',
      value: stats.totalAchievements,
      color: 'text-emerald-400',
      bgColor: 'from-emerald-500/20 to-emerald-600/10',
      onClick: onOpenAchievements,
    },
  ];

  const insightCards = [
    {
      icon: Calendar,
      label: 'Days Since Start',
      value: stats.daysSinceStart,
      suffix: stats.daysSinceStart === 1 ? ' day' : ' days',
    },
    {
      icon: BarChart3,
      label: 'Words Written',
      value: stats.totalWords.toLocaleString(),
      suffix: '',
    },
    {
      icon: Target,
      label: 'Avg Reflection',
      value: stats.averageReflectionLength,
      suffix: ' words',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Your Progress</h1>
              <p className="text-sm text-zinc-500">
                {name ? `${name}'s` : 'Your'} transformation journey
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Level & XP Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-lg font-bold text-white">
                  {level.level}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{level.title}</h3>
                  <p className="text-sm text-indigo-300/70">Level {level.level}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{totalXp.toLocaleString()}</div>
              <div className="text-sm text-indigo-300/70">Total XP</div>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-indigo-300/70">
              <span>{xpProgress.current} XP</span>
              <span>{level.maxXp === Infinity ? 'Max Level' : `${xpProgress.needed} XP to next level`}</span>
            </div>
            <div className="h-2 bg-indigo-950/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Streak Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{currentStreak}</div>
            <div className="text-sm text-zinc-500">Current Streak</div>
            <div className="text-xs text-zinc-600 mt-1">days</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-1">{longestStreak}</div>
            <div className="text-sm text-zinc-500">Longest Streak</div>
            <div className="text-xs text-zinc-600 mt-1">days</div>
          </div>
        </motion.div>

        {/* Transformation Story Trigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StoryTrigger
            variant="card"
            onClick={onOpenStory}
            label="View Your Transformation Story"
            subtitle={
              canGenerateStory
                ? `${storyReadiness.reflectionCount} reflections • ${storyReadiness.richness} story richness`
                : `${storyReadiness.minimumRequired.current}/${storyReadiness.minimumRequired.reflections} reflections needed`
            }
            disabled={!canGenerateStory}
          />
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {statCards.map((stat, index) => (
            <motion.button
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              onClick={stat.onClick}
              disabled={!stat.onClick}
              className={`bg-gradient-to-br ${stat.bgColor} border border-zinc-800 rounded-xl p-4 text-left transition-all ${
                stat.onClick ? 'hover:border-zinc-700 hover:scale-[1.02] cursor-pointer' : ''
              }`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
            </motion.button>
          ))}
        </motion.div>

        {/* Additional Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
            <TrendingUp size={16} />
            Writing Insights
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {insightCards.map((insight) => (
              <div key={insight.label} className="text-center">
                <insight.icon className="w-5 h-5 mx-auto mb-1 text-zinc-500" />
                <div className="text-lg font-bold text-white">
                  {insight.value}{insight.suffix}
                </div>
                <div className="text-xs text-zinc-500">{insight.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Streak Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StreakCalendar months={3} />
        </motion.div>

        {/* Journey narrative */}
        {stats.daysSinceStart > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-amber-500/5 to-purple-500/5 border border-amber-500/20 rounded-xl p-6 text-center"
          >
            <p className="text-zinc-300 leading-relaxed">
              {name ? `${name}, in` : 'In'} <span className="text-amber-400 font-semibold">{stats.daysSinceStart} days</span>,
              you&apos;ve written <span className="text-purple-400 font-semibold">{stats.totalWords.toLocaleString()} words</span> of
              reflection, completed <span className="text-blue-400 font-semibold">{stats.totalLessons} lessons</span>,
              and earned <span className="text-emerald-400 font-semibold">{stats.totalAchievements} achievements</span>.
              This is proof of who you are becoming.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ProgressDashboard;
