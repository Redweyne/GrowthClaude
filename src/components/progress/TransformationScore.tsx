'use client';

// ============================================================================
// TRANSFORMATION SCORE - THE SINGLE TRUTH
// Not just a number. A reflection of who they're becoming.
// This is the visual centerpiece that tells users "this is real progress."
// ============================================================================

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import {
  calculateTransformationScore,
  GRADE_DESCRIPTIONS,
  BREAKDOWN_LABELS,
  type ProgressContext,
  type TransformationScore as TransformationScoreType
} from '@/lib/progressInsights';

interface TransformationScoreProps {
  context: ProgressContext;
  compact?: boolean;
  onExpand?: () => void;
}

// Circular progress ring
function ScoreRing({
  score,
  grade,
  size = 180
}: {
  score: number;
  grade: TransformationScoreType['grade'];
  size?: number;
}) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;
  const gradeColor = GRADE_DESCRIPTIONS[grade].color;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ backgroundColor: gradeColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
      />

      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gradeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <motion.span
          className="text-sm text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          / 100
        </motion.span>
      </div>
    </div>
  );
}

// Score breakdown bar
function BreakdownBar({
  label,
  value,
  maxValue,
  icon,
  delay = 0
}: {
  label: string;
  value: number;
  maxValue: number;
  icon: string;
  delay?: number;
}) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-zinc-400">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span className="text-white font-medium">{value}/{maxValue}</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function TransformationScore({
  context,
  compact = false,
  onExpand
}: TransformationScoreProps) {
  const score = useMemo(() => calculateTransformationScore(context), [context]);
  const gradeInfo = GRADE_DESCRIPTIONS[score.grade];

  // Trend icon
  const TrendIcon = score.trend === 'rising'
    ? TrendingUp
    : score.trend === 'needs-attention'
    ? TrendingDown
    : Minus;

  const trendColor = score.trend === 'rising'
    ? 'text-emerald-400'
    : score.trend === 'needs-attention'
    ? 'text-amber-400'
    : 'text-zinc-500';

  const trendText = score.trend === 'rising'
    ? 'Rising'
    : score.trend === 'needs-attention'
    ? 'Needs attention'
    : 'Steady';

  // Compact view
  if (compact) {
    return (
      <motion.button
        onClick={onExpand}
        className="w-full bg-gradient-to-br from-zinc-900/80 to-zinc-950 border border-zinc-800 rounded-2xl p-4 text-left hover:border-zinc-700 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          {/* Mini score ring */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg width={64} height={64} className="transform -rotate-90">
              <circle
                cx={32}
                cy={32}
                r={26}
                fill="none"
                stroke="#27272a"
                strokeWidth={6}
              />
              <motion.circle
                cx={32}
                cy={32}
                r={26}
                fill="none"
                stroke={gradeInfo.color}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={163}
                initial={{ strokeDashoffset: 163 }}
                animate={{ strokeDashoffset: 163 - (score.score / 100) * 163 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{score.score}</span>
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold truncate">{gradeInfo.title}</h3>
              <div className={`flex items-center gap-1 ${trendColor}`}>
                <TrendIcon size={14} />
              </div>
            </div>
            <p className="text-sm text-zinc-500 truncate">{gradeInfo.description}</p>
          </div>

          <ChevronRight size={20} className="text-zinc-600 flex-shrink-0" />
        </div>
      </motion.button>
    );
  }

  // Full view
  return (
    <motion.div
      className="bg-gradient-to-br from-zinc-900/80 to-zinc-950 border border-zinc-800 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.h2
          className="text-lg font-semibold text-white mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Transformation Score
        </motion.h2>
        <motion.p
          className="text-sm text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          The measure of your journey
        </motion.p>
      </div>

      {/* Score ring */}
      <div className="flex justify-center mb-6">
        <ScoreRing score={score.score} grade={score.grade} />
      </div>

      {/* Grade badge */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
          style={{
            backgroundColor: `${gradeInfo.color}15`,
            borderColor: `${gradeInfo.color}40`
          }}
        >
          <span className="text-white font-semibold">{gradeInfo.title}</span>
          <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
            <TrendIcon size={14} />
            <span>{trendText}</span>
          </div>
        </div>
        <p className="text-sm text-zinc-400 mt-3">{gradeInfo.description}</p>
      </motion.div>

      {/* Breakdown */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-sm font-medium text-zinc-400">Score Breakdown</h3>

        <BreakdownBar
          label={BREAKDOWN_LABELS.consistency.label}
          value={score.breakdown.consistency}
          maxValue={25}
          icon={BREAKDOWN_LABELS.consistency.icon}
          delay={0.9}
        />

        <BreakdownBar
          label={BREAKDOWN_LABELS.depth.label}
          value={score.breakdown.depth}
          maxValue={25}
          icon={BREAKDOWN_LABELS.depth.icon}
          delay={1.0}
        />

        <BreakdownBar
          label={BREAKDOWN_LABELS.commitment.label}
          value={score.breakdown.commitment}
          maxValue={25}
          icon={BREAKDOWN_LABELS.commitment.icon}
          delay={1.1}
        />

        <BreakdownBar
          label={BREAKDOWN_LABELS.growth.label}
          value={score.breakdown.growth}
          maxValue={25}
          icon={BREAKDOWN_LABELS.growth.icon}
          delay={1.2}
        />
      </motion.div>

      {/* Insight based on lowest score */}
      <motion.div
        className="mt-6 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <p className="text-sm text-zinc-300">
          {(() => {
            const { breakdown } = score;
            const lowest = Object.entries(breakdown).reduce((min, [key, val]) =>
              val < min.val ? { key, val } : min
            , { key: 'consistency', val: 25 });

            const insights: Record<string, string> = {
              consistency: 'Focus on building your streak. Showing up daily, even for just one lesson, compounds over time.',
              depth: 'Try writing longer, more honest reflections. The insights you gain from deep reflection are where real change happens.',
              commitment: 'Complete more lessons to strengthen this area. Each lesson is a brick in the foundation of your transformation.',
              growth: 'Complete a monthly assessment to track your measurable progress. Seeing your growth visualized is powerful motivation.'
            };

            return insights[lowest.key];
          })()}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default TransformationScore;
