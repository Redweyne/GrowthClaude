'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Eye, Brain, TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui';
import { useStore, type MonthlyAssessment } from '@/store/useStore';

// Dimension configuration
const DIMENSIONS = [
  { key: 'emotionalMastery', label: 'Emotional Mastery', shortLabel: 'Emotions', icon: Heart, color: '#ec4899' },
  { key: 'discipline', label: 'Discipline', shortLabel: 'Discipline', icon: Target, color: '#f59e0b' },
  { key: 'perspective', label: 'Perspective', shortLabel: 'Perspective', icon: Eye, color: '#8b5cf6' },
  { key: 'selfAwareness', label: 'Self-Awareness', shortLabel: 'Awareness', icon: Brain, color: '#06b6d4' },
  { key: 'growth', label: 'Growth Mindset', shortLabel: 'Growth', icon: TrendingUp, color: '#10b981' },
] as const;

type DimensionKey = typeof DIMENSIONS[number]['key'];

interface TransformationRadarProps {
  compact?: boolean;
}

// SVG Radar Chart Component
function RadarChart({
  current,
  previous,
  size = 280
}: {
  current: Record<DimensionKey, number> | null;
  previous: Record<DimensionKey, number> | null;
  size?: number;
}) {
  const center = size / 2;
  const radius = size / 2 - 40;

  // Calculate point position on the radar
  const getPoint = (index: number, value: number, maxValue: number = 10) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate polygon path
  const generatePath = (scores: Record<DimensionKey, number>) => {
    const points = DIMENSIONS.map((dim, i) => {
      const point = getPoint(i, scores[dim.key]);
      return `${point.x},${point.y}`;
    });
    return `M${points.join(' L')} Z`;
  };

  // Generate label positions
  const labelPositions = DIMENSIONS.map((dim, i) => {
    const point = getPoint(i, 12); // Slightly outside the chart
    return { ...point, dim };
  });

  // Generate grid circles
  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid circles */}
      {gridLevels.map((level) => (
        <circle
          key={level}
          cx={center}
          cy={center}
          r={(level / 10) * radius}
          fill="none"
          stroke="#27272a"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {DIMENSIONS.map((_, i) => {
        const point = getPoint(i, 10);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="#27272a"
            strokeWidth="1"
          />
        );
      })}

      {/* Previous assessment polygon (if exists) */}
      {previous && (
        <motion.path
          d={generatePath(previous)}
          fill="rgba(168, 85, 247, 0.1)"
          stroke="#a855f7"
          strokeWidth="2"
          strokeDasharray="5,5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Current assessment polygon */}
      {current && (
        <motion.path
          d={generatePath(current)}
          fill="rgba(16, 185, 129, 0.2)"
          stroke="#10b981"
          strokeWidth="2.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      )}

      {/* Dimension points */}
      {current && DIMENSIONS.map((dim, i) => {
        const point = getPoint(i, current[dim.key]);
        return (
          <motion.circle
            key={dim.key}
            cx={point.x}
            cy={point.y}
            r="6"
            fill={dim.color}
            stroke="#18181b"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
          />
        );
      })}

      {/* Labels */}
      {labelPositions.map(({ x, y, dim }) => (
        <text
          key={dim.key}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[10px] fill-zinc-400 font-medium"
        >
          {dim.shortLabel}
        </text>
      ))}

      {/* Center score */}
      {current && (
        <motion.text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold fill-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {(Object.values(current).reduce((a, b) => a + b, 0) / 5).toFixed(1)}
        </motion.text>
      )}
    </svg>
  );
}

export function TransformationRadar({ compact = false }: TransformationRadarProps) {
  const { getAssessmentComparison, getAssessmentHistory, monthlyAssessments } = useStore();

  const { current, previous } = useMemo(() => getAssessmentComparison(), [getAssessmentComparison, monthlyAssessments]);

  // Calculate changes between current and previous
  const changes = useMemo(() => {
    if (!current || !previous) return null;

    return DIMENSIONS.map((dim) => {
      const change = current.scores[dim.key] - previous.scores[dim.key];
      return {
        key: dim.key,
        label: dim.label,
        icon: dim.icon,
        color: dim.color,
        current: current.scores[dim.key],
        previous: previous.scores[dim.key],
        change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      };
    });
  }, [current, previous]);

  // No data state
  if (!current) {
    return (
      <Card variant="glass" padding="lg" className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-emerald-500/20 flex items-center justify-center">
          <TrendingUp size={32} className="text-zinc-600" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No Assessments Yet</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Complete your first monthly assessment to see your transformation visualized.
        </p>
        <p className="text-xs text-zinc-600 italic">
          &quot;No man is free who is not master of himself.&quot; — Epictetus
        </p>
      </Card>
    );
  }

  // Compact view
  if (compact) {
    const averageScore = Object.values(current.scores).reduce((a, b) => a + b, 0) / 5;
    const averageChange = previous
      ? averageScore - Object.values(previous.scores).reduce((a, b) => a + b, 0) / 5
      : 0;

    return (
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">Your Growth</h3>
          <span className="text-xs text-zinc-500">
            {new Date(current.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl font-bold text-white">{averageScore.toFixed(1)}</span>
              {averageChange !== 0 && (
                <div className={`flex items-center justify-center text-xs ${
                  averageChange > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {averageChange > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {Math.abs(averageChange).toFixed(1)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {DIMENSIONS.map((dim) => {
            const Icon = dim.icon;
            const score = current.scores[dim.key];
            return (
              <div key={dim.key} className="text-center">
                <div
                  className="w-8 h-8 mx-auto mb-1 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${dim.color}20` }}
                >
                  <Icon size={14} style={{ color: dim.color }} />
                </div>
                <span className="text-xs font-medium text-white">{score}</span>
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
        <h2 className="text-2xl font-bold text-white mb-2">Your Transformation</h2>
        <p className="text-zinc-400">
          Visual proof of your growth journey
        </p>
      </div>

      {/* Radar Chart */}
      <Card variant="glass" padding="lg">
        <RadarChart
          current={current.scores}
          previous={previous?.scores || null}
        />

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-zinc-400">Current Month</span>
          </div>
          {previous && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 opacity-50" />
              <span className="text-xs text-zinc-400">Last Month</span>
            </div>
          )}
        </div>
      </Card>

      {/* Dimension Breakdown */}
      <Card variant="glass" padding="lg">
        <h3 className="font-medium text-white mb-4">Dimension Breakdown</h3>
        <div className="space-y-4">
          {DIMENSIONS.map((dim, index) => {
            const Icon = dim.icon;
            const score = current.scores[dim.key];
            const prevScore = previous?.scores[dim.key];
            const change = prevScore ? score - prevScore : null;

            return (
              <motion.div
                key={dim.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${dim.color}20` }}
                >
                  <Icon size={20} style={{ color: dim.color }} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{dim.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{score}</span>
                      {change !== null && change !== 0 && (
                        <span className={`flex items-center text-xs ${
                          change > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {change > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                          {Math.abs(change)}
                        </span>
                      )}
                      {change === 0 && (
                        <span className="flex items-center text-xs text-zinc-500">
                          <Minus size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score * 10}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: dim.color }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Month Comparison */}
      {previous && (
        <Card variant="glass" padding="lg">
          <h3 className="font-medium text-white mb-4">Month Over Month</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-800/50 text-center">
              <p className="text-xs text-zinc-500 mb-1">
                {new Date(previous.date).toLocaleDateString('en-US', { month: 'long' })}
              </p>
              <p className="text-2xl font-bold text-purple-400">
                {(Object.values(previous.scores).reduce((a, b) => a + b, 0) / 5).toFixed(1)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/50 text-center">
              <p className="text-xs text-zinc-500 mb-1">
                {new Date(current.date).toLocaleDateString('en-US', { month: 'long' })}
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                {(Object.values(current.scores).reduce((a, b) => a + b, 0) / 5).toFixed(1)}
              </p>
            </div>
          </div>

          {/* Growth insight */}
          {changes && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-300">
                {(() => {
                  const totalChange = changes.reduce((sum, c) => sum + c.change, 0);
                  const avgChange = totalChange / 5;
                  const bestGain = changes.reduce((best, c) => c.change > best.change ? c : best);

                  if (avgChange > 0) {
                    return `You've grown ${avgChange.toFixed(1)} points on average. Your biggest improvement was in ${bestGain.label} (+${bestGain.change}).`;
                  } else if (avgChange < 0) {
                    return `This month was challenging. Remember: setbacks are part of growth. The Stoics teach us to learn from every experience.`;
                  }
                  return `You maintained steady progress this month. Consistency is the foundation of transformation.`;
                })()}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Reflection */}
      {current.reflection && (
        <Card variant="glass" padding="lg">
          <h3 className="font-medium text-white mb-3">Your Reflection</h3>
          <p className="text-zinc-300 italic">&quot;{current.reflection}&quot;</p>
          <p className="text-xs text-zinc-500 mt-2">
            — {new Date(current.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </Card>
      )}
    </div>
  );
}

export default TransformationRadar;
