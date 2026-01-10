'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui';
import { useStore, type PatternTheme } from '@/store/useStore';

// Pattern theme display config
const THEME_CONFIG: Record<PatternTheme, { label: string; color: string; emoji: string }> = {
  control: { label: 'Control', color: '#8b5cf6', emoji: '🎯' },
  acceptance: { label: 'Acceptance', color: '#10b981', emoji: '🙏' },
  patience: { label: 'Patience', color: '#06b6d4', emoji: '⏳' },
  courage: { label: 'Courage', color: '#f59e0b', emoji: '🦁' },
  discipline: { label: 'Discipline', color: '#ef4444', emoji: '💪' },
  gratitude: { label: 'Gratitude', color: '#ec4899', emoji: '✨' },
  perspective: { label: 'Perspective', color: '#6366f1', emoji: '👁️' },
  judgment: { label: 'Judgment', color: '#f97316', emoji: '⚖️' },
  anger: { label: 'Anger', color: '#dc2626', emoji: '🔥' },
  fear: { label: 'Fear', color: '#7c3aed', emoji: '😰' },
  comparison: { label: 'Comparison', color: '#14b8a6', emoji: '👀' },
  procrastination: { label: 'Procrastination', color: '#64748b', emoji: '⏰' },
};

// Categorize themes into growth vs challenge areas
const GROWTH_THEMES: PatternTheme[] = ['acceptance', 'patience', 'courage', 'discipline', 'gratitude', 'perspective'];
const CHALLENGE_THEMES: PatternTheme[] = ['control', 'judgment', 'anger', 'fear', 'comparison', 'procrastination'];

interface PatternAnalysisProps {
  compact?: boolean;
}

export function PatternAnalysis({ compact = false }: PatternAnalysisProps) {
  const { analyzePatterns, getPatternTrends, allReflections } = useStore();

  const currentPatterns = useMemo(() => analyzePatterns(), [analyzePatterns, allReflections]);
  const trends = useMemo(() => getPatternTrends(), [getPatternTrends, allReflections]);

  // Sort themes by frequency
  const sortedThemes = useMemo(() => {
    const entries = Object.entries(currentPatterns.themes) as [PatternTheme, number][];
    return entries.sort((a, b) => b[1] - a[1]).filter(([_, count]) => count > 0);
  }, [currentPatterns.themes]);

  // Get top patterns for growth and challenges
  const topGrowth = useMemo(() =>
    sortedThemes.filter(([theme]) => GROWTH_THEMES.includes(theme)).slice(0, 3),
    [sortedThemes]
  );

  const topChallenges = useMemo(() =>
    sortedThemes.filter(([theme]) => CHALLENGE_THEMES.includes(theme)).slice(0, 3),
    [sortedThemes]
  );

  // Get trend icon
  const getTrendIcon = (theme: PatternTheme) => {
    const trend = trends.find(t => t.theme === theme);
    if (!trend) return null;

    if (trend.trend === 'up') {
      const isGrowth = GROWTH_THEMES.includes(theme);
      return (
        <TrendingUp
          size={14}
          className={isGrowth ? 'text-emerald-400' : 'text-amber-400'}
        />
      );
    }
    if (trend.trend === 'down') {
      const isGrowth = GROWTH_THEMES.includes(theme);
      return (
        <TrendingDown
          size={14}
          className={isGrowth ? 'text-amber-400' : 'text-emerald-400'}
        />
      );
    }
    return <Minus size={14} className="text-zinc-500" />;
  };

  // No data state
  if (currentPatterns.totalReflections === 0) {
    return (
      <Card variant="glass" padding="lg" className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
          <Sparkles size={28} className="text-zinc-600" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No Patterns Yet</h3>
        <p className="text-sm text-zinc-500">
          Complete more lessons to see your transformation patterns emerge.
        </p>
      </Card>
    );
  }

  // Compact view for dashboard
  if (compact) {
    return (
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">Your Patterns</h3>
          <span className="text-xs text-zinc-500">
            {currentPatterns.totalReflections} reflections
          </span>
        </div>

        <div className="space-y-2">
          {sortedThemes.slice(0, 4).map(([theme, count]) => {
            const config = THEME_CONFIG[theme];
            const maxCount = sortedThemes[0]?.[1] || 1;
            const percentage = (count / maxCount) * 100;

            return (
              <div key={theme} className="flex items-center gap-3">
                <span className="text-lg">{config.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-400">{config.label}</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(theme)}
                      <span className="text-xs text-zinc-500">{count}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Your Transformation Patterns</h2>
        <p className="text-zinc-400">
          Based on {currentPatterns.totalReflections} reflection{currentPatterns.totalReflections !== 1 ? 's' : ''} this month
        </p>
      </div>

      {/* Growth Areas */}
      {topGrowth.length > 0 && (
        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <h3 className="font-medium text-white">Growth Themes</h3>
          </div>

          <div className="space-y-4">
            {topGrowth.map(([theme, count], index) => {
              const config = THEME_CONFIG[theme];
              const maxCount = topGrowth[0]?.[1] || 1;
              const percentage = (count / maxCount) * 100;

              return (
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{config.emoji}</span>
                      <span className="text-white font-medium">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(theme)}
                      <span className="text-zinc-400">{count} mentions</span>
                    </div>
                  </div>
                  <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Challenge Areas */}
      {topChallenges.length > 0 && (
        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Sparkles size={16} className="text-amber-400" />
            </div>
            <h3 className="font-medium text-white">Working Through</h3>
          </div>

          <div className="space-y-4">
            {topChallenges.map(([theme, count], index) => {
              const config = THEME_CONFIG[theme];
              const maxCount = topChallenges[0]?.[1] || 1;
              const percentage = (count / maxCount) * 100;

              return (
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{config.emoji}</span>
                      <span className="text-white font-medium">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(theme)}
                      <span className="text-zinc-400">{count} mentions</span>
                    </div>
                  </div>
                  <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                      className="h-full rounded-full opacity-80"
                      style={{ backgroundColor: config.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-zinc-500 italic">
            &quot;The obstacle is the way.&quot; — Marcus Aurelius
          </p>
        </Card>
      )}

      {/* All Patterns Grid */}
      <Card variant="glass" padding="lg">
        <h3 className="font-medium text-white mb-4">All Detected Patterns</h3>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(THEME_CONFIG) as PatternTheme[]).map((theme) => {
            const config = THEME_CONFIG[theme];
            const count = currentPatterns.themes[theme] || 0;
            const isActive = count > 0;

            return (
              <motion.div
                key={theme}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-3 rounded-xl border text-center transition-colors ${
                  isActive
                    ? 'bg-zinc-800/50 border-zinc-700'
                    : 'bg-zinc-900/30 border-zinc-800/50'
                }`}
              >
                <span className="text-2xl mb-1 block">{config.emoji}</span>
                <p className={`text-xs ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                  {config.label}
                </p>
                {isActive && (
                  <p className="text-xs text-zinc-500 mt-1">{count}x</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default PatternAnalysis;
