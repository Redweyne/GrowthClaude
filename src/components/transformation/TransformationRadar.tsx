'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Eye, Brain, TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/i18n';

const DIMENSIONS = [
  { key: 'emotionalMastery', icon: Heart, color: '#ec4899' },
  { key: 'discipline', icon: Target, color: '#f59e0b' },
  { key: 'perspective', icon: Eye, color: '#8b5cf6' },
  { key: 'selfAwareness', icon: Brain, color: '#06b6d4' },
  { key: 'growth', icon: TrendingUp, color: '#10b981' },
] as const;

type DimensionKey = typeof DIMENSIONS[number]['key'];

interface TransformationRadarProps {
  compact?: boolean;
}

function RadarChart({
  current,
  previous,
  labels,
  size = 280
}: {
  current: Record<DimensionKey, number> | null;
  previous: Record<DimensionKey, number> | null;
  labels: Record<DimensionKey, string>;
  size?: number;
}) {
  const center = size / 2;
  const radius = size / 2 - 40;

  const getPoint = (index: number, value: number, maxValue: number = 10) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const generatePath = (scores: Record<DimensionKey, number>) => {
    const points = DIMENSIONS.map((dim, i) => {
      const point = getPoint(i, scores[dim.key]);
      return `${point.x},${point.y}`;
    });
    return `M${points.join(' L')} Z`;
  };

  const labelPositions = DIMENSIONS.map((dim, i) => {
    const point = getPoint(i, 12);
    return { ...point, dim };
  });

  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <svg width={size} height={size} className="mx-auto">
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

      {labelPositions.map(({ x, y, dim }) => (
        <text
          key={dim.key}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[10px] fill-stone-400 light:fill-stone-600 font-medium"
        >
          {labels[dim.key]}
        </text>
      ))}

      {current && (
        <motion.text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold fill-white light:fill-stone-900"
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
  const { locale } = useTranslation();
  const { getAssessmentComparison } = useStore();

  const copy = {
    en: {
      labels: {
        emotionalMastery: { full: 'Emotional Mastery', short: 'Emotions' },
        discipline: { full: 'Discipline', short: 'Discipline' },
        perspective: { full: 'Perspective', short: 'Perspective' },
        selfAwareness: { full: 'Self-Awareness', short: 'Awareness' },
        growth: { full: 'Growth Mindset', short: 'Growth' },
      },
      noAssessments: 'No Assessments Yet',
      noAssessmentsBody: 'Complete your first monthly assessment to see your transformation visualized.',
      noAssessmentsQuote: '"No man is free who is not master of himself." - Epictetus',
      yourGrowth: 'Your Growth',
      yourTransformation: 'Your Transformation',
      visualProof: 'Visual proof of your growth journey',
      currentMonth: 'Current Month',
      lastMonth: 'Last Month',
      dimensionBreakdown: 'Dimension Breakdown',
      monthOverMonth: 'Month Over Month',
      challengingMonth: 'This month was challenging. Remember: setbacks are part of growth. The Stoics teach us to learn from every experience.',
      steadyMonth: 'You maintained steady progress this month. Consistency is the foundation of transformation.',
      yourReflection: 'Your Reflection',
      avgGrowth: "You've grown {avg} points on average. Your biggest improvement was in {label} (+{gain}).",
    },
    fr: {
      labels: {
        emotionalMastery: { full: 'Maîtrise émotionnelle', short: 'Émotions' },
        discipline: { full: 'Discipline', short: 'Discipline' },
        perspective: { full: 'Perspective', short: 'Perspective' },
        selfAwareness: { full: 'Conscience de soi', short: 'Conscience' },
        growth: { full: 'Mentalité de croissance', short: 'Croissance' },
      },
      noAssessments: 'Aucune évaluation pour le moment',
      noAssessmentsBody: 'Complétez votre première évaluation mensuelle pour visualiser votre transformation.',
      noAssessmentsQuote: '"Nul homme n est libre s il n est pas maître de lui-même." - Épictète',
      yourGrowth: 'Votre progression',
      yourTransformation: 'Votre transformation',
      visualProof: 'Preuve visuelle de votre progression',
      currentMonth: 'Mois actuel',
      lastMonth: 'Mois précédent',
      dimensionBreakdown: 'Détail des dimensions',
      monthOverMonth: 'Mois après mois',
      challengingMonth: 'Ce mois-ci a été difficile. Rappelez-vous: les revers font partie de la progression.',
      steadyMonth: 'Vous avez maintenu une progression régulière ce mois-ci. La constance est la base de la transformation.',
      yourReflection: 'Votre réflexion',
      avgGrowth: 'Vous avez gagné en moyenne {avg} points. Votre plus forte progression est {label} (+{gain}).',
    },
    ar: {
      labels: {
        emotionalMastery: { full: 'التمكن العاطفي', short: 'العاطفة' },
        discipline: { full: 'الانضباط', short: 'الانضباط' },
        perspective: { full: 'المنظور', short: 'المنظور' },
        selfAwareness: { full: 'الوعي الذاتي', short: 'الوعي' },
        growth: { full: 'عقلية النمو', short: 'النمو' },
      },
      noAssessments: 'لا توجد تقييمات بعد',
      noAssessmentsBody: 'أكمل أول تقييم شهري لرؤية تحوّلك بشكل مرئي.',
      noAssessmentsQuote: '"لا يكون الإنسان حراً إن لم يكن سيد نفسه." - إبكتيتوس',
      yourGrowth: 'نموك',
      yourTransformation: 'تحوّلك',
      visualProof: 'دليل بصري على رحلة نموك',
      currentMonth: 'الشهر الحالي',
      lastMonth: 'الشهر الماضي',
      dimensionBreakdown: 'تفصيل الأبعاد',
      monthOverMonth: 'مقارنة شهرية',
      challengingMonth: 'كان هذا الشهر صعباً. تذكّر أن الانتكاسات جزء من النمو.',
      steadyMonth: 'حافظت على تقدم ثابت هذا الشهر. الاستمرارية أساس التحول.',
      yourReflection: 'تأملك',
      avgGrowth: 'لقد تطورت بمعدل {avg} نقطة. أكبر تحسن كان في {label} (+{gain}).',
    },
  } as const;

  const c = copy[locale] ?? copy.en;
  const localeTag = locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr-FR' : 'en-US';

  const formatDate = (date: string | Date, options: Intl.DateTimeFormatOptions) =>
    new Date(date).toLocaleDateString(localeTag, options);

  const { current, previous } = useMemo(() => getAssessmentComparison(), [getAssessmentComparison]);

  const changes = useMemo(() => {
    if (!current || !previous) return null;

    return DIMENSIONS.map((dim) => {
      const change = current.scores[dim.key] - previous.scores[dim.key];
      return {
        key: dim.key,
        label: c.labels[dim.key].full,
        icon: dim.icon,
        color: dim.color,
        current: current.scores[dim.key],
        previous: previous.scores[dim.key],
        change,
      };
    });
  }, [c.labels, current, previous]);

  if (!current) {
    return (
      <Card variant="glass" padding="lg" className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-emerald-500/20 flex items-center justify-center">
          <TrendingUp size={32} className="text-stone-600 light:text-stone-500" />
        </div>
        <h3 className="text-lg font-medium text-white light:text-stone-900 mb-2">{c.noAssessments}</h3>
        <p className="text-sm text-stone-500 light:text-stone-500 mb-4">
          {c.noAssessmentsBody}
        </p>
        <p className="text-xs text-stone-600 light:text-stone-500 italic">
          {c.noAssessmentsQuote}
        </p>
      </Card>
    );
  }

  if (compact) {
    const averageScore = Object.values(current.scores).reduce((a, b) => a + b, 0) / 5;
    const averageChange = previous
      ? averageScore - Object.values(previous.scores).reduce((a, b) => a + b, 0) / 5
      : 0;

    return (
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white light:text-stone-900">{c.yourGrowth}</h3>
          <span className="text-xs text-stone-500 light:text-stone-500">
            {formatDate(current.date, { month: 'short', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl font-bold text-white light:text-stone-900">{averageScore.toFixed(1)}</span>
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
                <span className="text-xs font-medium text-white light:text-stone-900">{score}</span>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white light:text-stone-900 mb-2">{c.yourTransformation}</h2>
        <p className="text-stone-400 light:text-stone-600">
          {c.visualProof}
        </p>
      </div>

      <Card variant="glass" padding="lg">
        <RadarChart
          current={current.scores}
          previous={previous?.scores || null}
          labels={{
            emotionalMastery: c.labels.emotionalMastery.short,
            discipline: c.labels.discipline.short,
            perspective: c.labels.perspective.short,
            selfAwareness: c.labels.selfAwareness.short,
            growth: c.labels.growth.short,
          }}
        />

        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-stone-400 light:text-stone-600">{c.currentMonth}</span>
          </div>
          {previous && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 opacity-50" />
              <span className="text-xs text-stone-400 light:text-stone-600">{c.lastMonth}</span>
            </div>
          )}
        </div>
      </Card>

      <Card variant="glass" padding="lg">
        <h3 className="font-medium text-white light:text-stone-900 mb-4">{c.dimensionBreakdown}</h3>
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
                    <span className="text-white light:text-stone-900 font-medium">{c.labels[dim.key].full}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white light:text-stone-900 font-bold">{score}</span>
                      {change !== null && change !== 0 && (
                        <span className={`flex items-center text-xs ${
                          change > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {change > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                          {Math.abs(change)}
                        </span>
                      )}
                      {change === 0 && (
                        <span className="flex items-center text-xs text-stone-500 light:text-stone-500">
                          <Minus size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-stone-800 light:bg-stone-200 rounded-full overflow-hidden">
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

      {previous && (
        <Card variant="glass" padding="lg">
          <h3 className="font-medium text-white light:text-stone-900 mb-4">{c.monthOverMonth}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-stone-800/50 light:bg-stone-200/50 text-center">
              <p className="text-xs text-stone-500 light:text-stone-500 mb-1">
                {formatDate(previous.date, { month: 'long' })}
              </p>
              <p className="text-2xl font-bold text-purple-400">
                {(Object.values(previous.scores).reduce((a, b) => a + b, 0) / 5).toFixed(1)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-stone-800/50 light:bg-stone-200/50 text-center">
              <p className="text-xs text-stone-500 light:text-stone-500 mb-1">
                {formatDate(current.date, { month: 'long' })}
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                {(Object.values(current.scores).reduce((a, b) => a + b, 0) / 5).toFixed(1)}
              </p>
            </div>
          </div>

          {changes && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-300">
                {(() => {
                  const totalChange = changes.reduce((sum, item) => sum + item.change, 0);
                  const avgChange = totalChange / 5;
                  const bestGain = changes.reduce((best, item) => (item.change > best.change ? item : best));

                  if (avgChange > 0) {
                    return c.avgGrowth
                      .replace('{avg}', avgChange.toFixed(1))
                      .replace('{label}', bestGain.label)
                      .replace('{gain}', String(bestGain.change));
                  }
                  if (avgChange < 0) {
                    return c.challengingMonth;
                  }
                  return c.steadyMonth;
                })()}
              </p>
            </div>
          )}
        </Card>
      )}

      {current.reflection && (
        <Card variant="glass" padding="lg">
          <h3 className="font-medium text-white light:text-stone-900 mb-3">{c.yourReflection}</h3>
          <p className="text-stone-300 light:text-stone-700 italic">"{current.reflection}"</p>
          <p className="text-xs text-stone-500 light:text-stone-500 mt-2">
            - {formatDate(current.date, {
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
