'use client';

// ============================================================================
// PROGRESS DASHBOARD - THE MIRROR OF YOUR TRANSFORMATION
// This is not a stats page. This is where users see proof of who they're becoming.
// Every element should make them FEEL the weight of their journey.
// ============================================================================

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  BookOpen,
  PenTool,
  Sparkles,
  Zap,
  ChevronRight,
  Quote,
  Target,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { StreakCalendar } from './StreakCalendar';
import { TransformationScore } from './TransformationScore';
import { StoryTrigger } from '@/components/story';
import { getLevelFromXp, getXpProgress } from '@/types';
import { useTransformationStory } from '@/hooks';
import {
  generateHeroMessage,
  generatePersonalInsights,
  type ProgressContext,
  type PersonalInsight,
} from '@/lib/progressInsights';

interface ProgressDashboardProps {
  onBack: () => void;
  onOpenIdentity: () => void;
  onOpenStory: () => void;
  onOpenDemoStory?: () => void;
}

// Personal insight card component
function InsightCard({ insight, delay = 0 }: { insight: PersonalInsight; delay?: number }) {
  const bgColors = {
    observation: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
    encouragement: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
    challenge: 'from-amber-500/10 to-orange-500/10 border-amber-500/20',
    celebration: 'from-purple-500/10 to-pink-500/10 border-purple-500/20',
    reflection: 'from-zinc-500/10 to-zinc-600/10 border-zinc-500/20',
  };

  const iconColors = {
    observation: 'text-blue-400',
    encouragement: 'text-emerald-400',
    challenge: 'text-amber-400',
    celebration: 'text-purple-400',
    reflection: 'text-zinc-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${bgColors[insight.type]} border rounded-xl p-4`}
    >
      <div className="flex items-start gap-3">
        <Quote size={16} className={`${iconColors[insight.type]} flex-shrink-0 mt-1`} />
        <p className="text-sm text-zinc-200 leading-relaxed">{insight.message}</p>
      </div>
      {insight.context && (
        <p className="text-xs text-zinc-500 mt-2 ml-7">{insight.context}</p>
      )}
    </motion.div>
  );
}

// Stat card for the grid
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
  onClick,
  delay = 0,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number | string;
  color: string;
  bgColor: string;
  onClick?: () => void;
  delay?: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      onClick={onClick}
      disabled={!onClick}
      className={`bg-gradient-to-br ${bgColor} border border-zinc-800 rounded-xl p-4 text-left transition-all ${
        onClick ? 'hover:border-zinc-700 hover:scale-[1.02] cursor-pointer' : ''
      }`}
    >
      <Icon className={`w-5 h-5 ${color} mb-2`} />
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-zinc-400">{label}</div>
      {onClick && (
        <ChevronRight size={14} className="text-zinc-600 absolute top-4 right-4" />
      )}
    </motion.button>
  );
}

export function ProgressDashboard({
  onBack,
  onOpenIdentity,
  onOpenStory,
  onOpenDemoStory,
}: ProgressDashboardProps) {
  const {
    getProgressStats,
    totalXp,
    currentStreak,
    longestStreak,
    name,
    transformationGoal,
    whyStatement,
    allReflections,
    activityLog,
    monthlyAssessments,
  } = useStore();

  const { canGenerateStory, storyReadiness } = useTransformationStory();
  const [showAllInsights, setShowAllInsights] = useState(false);

  const stats = getProgressStats();
  const level = getLevelFromXp(totalXp);
  const xpProgress = getXpProgress(totalXp);

  // Build progress context
  const progressContext: ProgressContext = useMemo(() => ({
    name,
    transformationGoal,
    whyStatement,
    daysSinceStart: stats.daysSinceStart,
    totalLessons: stats.totalLessons,
    totalReflections: stats.totalReflections,
    totalWords: stats.totalWords,
    totalIdentityStatements: stats.totalIdentityStatements,
    averageReflectionLength: stats.averageReflectionLength,
    currentStreak,
    longestStreak,
    reflections: allReflections,
    activityLog,
    assessments: monthlyAssessments,
    totalXp,
  }), [
    name, transformationGoal, whyStatement, stats, currentStreak,
    longestStreak, allReflections, activityLog, monthlyAssessments, totalXp
  ]);

  // Generate personalized content
  const heroMessage = useMemo(() => generateHeroMessage(progressContext), [progressContext]);
  const insights = useMemo(() => generatePersonalInsights(progressContext), [progressContext]);
  // Top 2 insights for preview, all for expanded view
  const visibleInsights = showAllInsights ? insights : insights.slice(0, 2);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-lg font-bold text-white">Your Progress</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <Zap size={18} />
              <span className="font-semibold">{totalXp.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Section - The Personalized Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-white mb-3"
          >
            {heroMessage.headline}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-md mx-auto"
          >
            {heroMessage.subtext}
          </motion.p>
        </motion.div>

        {/* Transformation Score - The Single Truth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <TransformationScore context={progressContext} />
        </motion.div>

        {/* Level & XP Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/25">
                {level.level}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{level.title}</h3>
                <p className="text-sm text-indigo-300/70">Level {level.level}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{totalXp.toLocaleString()}</div>
              <div className="text-sm text-indigo-300/70">Total XP</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-indigo-300/70">
              <span>{xpProgress.current} XP this level</span>
              <span>{level.maxXp === Infinity ? 'Max Level' : `${xpProgress.needed - xpProgress.current} to next`}</span>
            </div>
            <div className="h-2 bg-indigo-950/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Transformation Story Trigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <StoryTrigger
            variant="card"
            onClick={onOpenStory}
            label="View Your Transformation Story"
            subtitle={
              canGenerateStory
                ? `${storyReadiness.reflectionCount} reflections ready`
                : `${storyReadiness.minimumRequired.current}/${storyReadiness.minimumRequired.reflections} reflections needed`
            }
            disabled={!canGenerateStory}
            showDemoOption={!!onOpenDemoStory}
            onSeedDemo={onOpenDemoStory}
          />
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <StatCard
            icon={BookOpen}
            label="Lessons Completed"
            value={stats.totalLessons}
            color="text-blue-400"
            bgColor="from-blue-500/10 to-blue-600/5"
            delay={0.35}
          />
          <StatCard
            icon={PenTool}
            label="Reflections Written"
            value={stats.totalReflections}
            color="text-purple-400"
            bgColor="from-purple-500/10 to-purple-600/5"
            delay={0.4}
          />
          <StatCard
            icon={Sparkles}
            label="Identity Statements"
            value={stats.totalIdentityStatements}
            color="text-amber-400"
            bgColor="from-amber-500/10 to-amber-600/5"
            onClick={onOpenIdentity}
            delay={0.45}
          />
          <StatCard
            icon={Zap}
            label="Best Streak"
            value={longestStreak}
            color="text-emerald-400"
            bgColor="from-emerald-500/10 to-emerald-600/5"
            delay={0.5}
          />
        </motion.div>

        {/* Personal Insights Section */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <Target size={16} />
                Personal Insights
              </h3>
              {insights.length > 2 && (
                <button
                  onClick={() => setShowAllInsights(!showAllInsights)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {showAllInsights ? 'Show less' : `View all (${insights.length})`}
                </button>
              )}
            </div>

            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {visibleInsights.map((insight, index) => (
                  <InsightCard
                    key={`${insight.type}-${index}`}
                    insight={insight}
                    delay={0.6 + index * 0.1}
                  />
                ))}
              </div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Writing Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <h3 className="text-sm font-semibold text-zinc-400 mb-4">Your Words</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-white">
                {stats.totalWords.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-500">Words written</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {stats.averageReflectionLength}
              </div>
              <div className="text-xs text-zinc-500">Avg per reflection</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {stats.daysSinceStart}
              </div>
              <div className="text-xs text-zinc-500">Days on path</div>
            </div>
          </div>

          {/* Contextual message about writing */}
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 text-center">
              {stats.totalWords >= 5000
                ? "You've written a small book about your transformation."
                : stats.totalWords >= 1000
                ? "Over a thousand words of self-discovery."
                : stats.totalWords >= 100
                ? "Every word is a step toward understanding yourself."
                : "Your story is just beginning to be written."}
            </p>
          </div>
        </motion.div>

        {/* Streak Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <StreakCalendar months={3} />
        </motion.div>

        {/* Journey Narrative - Only show if meaningful */}
        {stats.daysSinceStart >= 7 && stats.totalLessons >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-amber-500/5 to-purple-500/5 border border-amber-500/20 rounded-xl p-6 text-center"
          >
            <p className="text-zinc-300 leading-relaxed">
              {name ? `${name}, ` : ''}In <span className="text-amber-400 font-semibold">{stats.daysSinceStart} days</span>,
              you&apos;ve written <span className="text-purple-400 font-semibold">{stats.totalWords.toLocaleString()} words</span> of
              reflection, completed <span className="text-blue-400 font-semibold">{stats.totalLessons} lessons</span>,
              {stats.totalIdentityStatements > 0 && (
                <> declared <span className="text-amber-400 font-semibold">{stats.totalIdentityStatements} identity statement{stats.totalIdentityStatements !== 1 ? 's' : ''}</span>,</>
              )}
              {' '}and practiced daily reflection with consistency.
            </p>
            <p className="text-sm text-zinc-500 mt-4 italic">
              This is not just data. This is proof of who you are becoming.
            </p>
          </motion.div>
        )}

        {/* Closing Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-6"
        >
          <p className="text-sm text-zinc-600 italic">
            &quot;No man is free who is not master of himself.&quot;
          </p>
          <p className="text-xs text-zinc-700 mt-1">— Epictetus</p>
        </motion.div>
      </div>
    </div>
  );
}

export default ProgressDashboard;
