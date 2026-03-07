'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import {
  calculateTransformationScore,
  type ProgressContext,
  type TransformationScore as TransformationScoreType
} from '@/lib/progressInsights';
import { useTranslation } from '@/i18n';

interface TransformationScoreProps {
  context: ProgressContext;
  compact?: boolean;
  onExpand?: () => void;
}

function ScoreRing({
  score,
  gradeColor,
  size = 180
}: {
  score: number;
  gradeColor: string;
  size?: number;
}) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ backgroundColor: gradeColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
      />

      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth={strokeWidth}
        />

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

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold text-white light:text-stone-900"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <motion.span
          className="text-sm text-stone-400 light:text-stone-600"
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
        <span className="flex items-center gap-2 text-stone-400 light:text-stone-600">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span className="text-white light:text-stone-900 font-medium">{value}/{maxValue}</span>
      </div>
      <div className="h-2 bg-stone-800 light:bg-stone-200 rounded-full overflow-hidden">
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
  const { locale } = useTranslation();
  const score = useMemo(() => calculateTransformationScore(context), [context]);

  const copy = {
    en: {
      trendRising: 'Rising',
      trendNeedsAttention: 'Needs attention',
      trendSteady: 'Steady',
      title: 'Transformation Score',
      subtitle: 'The measure of your journey',
      scoreBreakdown: 'Score Breakdown',
      grades: {
        awakening: { title: 'Awakening', description: "You've opened your eyes to change. The journey has begun." },
        emerging: { title: 'Emerging', description: "You're rising from who you were. The old patterns are loosening." },
        growing: { title: 'Growing', description: "Real progress is happening. You're not the same person who started." },
        flourishing: { title: 'Flourishing', description: 'Your transformation is undeniable. Others can see the change.' },
        transcending: { title: 'Transcending', description: "You've become who you set out to be. Now you're reaching higher." },
      },
      breakdown: {
        consistency: { label: 'Consistency', icon: '🔥' },
        depth: { label: 'Depth', icon: '🌊' },
        commitment: { label: 'Commitment', icon: '⚡' },
        growth: { label: 'Growth', icon: '📈' },
      },
      lowestInsights: {
        consistency: 'Focus on building your streak. Showing up daily, even for just one lesson, compounds over time.',
        depth: 'Try writing longer, more honest reflections. The insights you gain from deep reflection are where real change happens.',
        commitment: 'Complete more lessons to strengthen this area. Each lesson is a brick in the foundation of your transformation.',
        growth: 'Complete a monthly assessment to track your measurable progress. Seeing your growth visualized is powerful motivation.',
      },
    },
    fr: {
      trendRising: 'En hausse',
      trendNeedsAttention: 'À renforcer',
      trendSteady: 'Stable',
      title: 'Score de transformation',
      subtitle: 'La mesure de votre parcours',
      scoreBreakdown: 'Détail du score',
      grades: {
        awakening: { title: 'Éveil', description: 'Vous avez ouvert les yeux au changement. Le parcours commence.' },
        emerging: { title: 'Émergence', description: 'Vous sortez de vos anciens schémas. Ils se relâchent déjà.' },
        growing: { title: 'Croissance', description: 'La progression est réelle. Vous n êtes plus la même personne.' },
        flourishing: { title: 'Épanouissement', description: 'Votre transformation est visible et concrète.' },
        transcending: { title: 'Transcendance', description: 'Vous êtes devenu ce que vous visiez. Vous allez encore plus loin.' },
      },
      breakdown: {
        consistency: { label: 'Régularité', icon: '🔥' },
        depth: { label: 'Profondeur', icon: '🌊' },
        commitment: { label: 'Engagement', icon: '⚡' },
        growth: { label: 'Croissance', icon: '📈' },
      },
      lowestInsights: {
        consistency: 'Concentrez-vous sur votre série. Venir chaque jour, même pour une seule leçon, produit un effet cumulatif.',
        depth: 'Essayez des réflexions plus longues et plus honnêtes. La profondeur accélère le changement réel.',
        commitment: 'Terminez davantage de leçons pour renforcer cette dimension.',
        growth: 'Complétez une évaluation mensuelle pour suivre une progression mesurable.',
      },
    },
    ar: {
      trendRising: 'في تصاعد',
      trendNeedsAttention: 'يحتاج انتباهاً',
      trendSteady: 'مستقر',
      title: 'درجة التحول',
      subtitle: 'مقياس رحلتك',
      scoreBreakdown: 'تفصيل الدرجة',
      grades: {
        awakening: { title: 'الاستيقاظ', description: 'لقد بدأت ترى التغيير بوضوح. الرحلة بدأت.' },
        emerging: { title: 'الانبثاق', description: 'أنت تتجاوز ذاتك السابقة. الأنماط القديمة بدأت تضعف.' },
        growing: { title: 'النمو', description: 'هناك تقدم حقيقي. لم تعد الشخص الذي بدأ.' },
        flourishing: { title: 'الازدهار', description: 'تحوّلك واضح ويمكن ملاحظته.' },
        transcending: { title: 'التجاوز', description: 'أصبحت ما كنت تسعى إليه. والآن تتقدم أكثر.' },
      },
      breakdown: {
        consistency: { label: 'الاستمرارية', icon: '🔥' },
        depth: { label: 'العمق', icon: '🌊' },
        commitment: { label: 'الالتزام', icon: '⚡' },
        growth: { label: 'النمو', icon: '📈' },
      },
      lowestInsights: {
        consistency: 'ركز على بناء سلسلتك. الظهور يومياً، حتى لدرس واحد، يصنع أثراً تراكمياً.',
        depth: 'جرّب كتابة تأملات أطول وأكثر صدقاً. العمق هو بوابة التغيير الحقيقي.',
        commitment: 'أكمل المزيد من الدروس لتقوية هذا الجانب.',
        growth: 'أكمل تقييماً شهرياً لمتابعة تقدمك بشكل قابل للقياس.',
      },
    },
  } as const;

  const c = copy[locale] ?? copy.en;

  const gradeColors: Record<TransformationScoreType['grade'], string> = {
    awakening: '#94a3b8',
    emerging: '#22d3ee',
    growing: '#10b981',
    flourishing: '#8b5cf6',
    transcending: '#f59e0b',
  };

  const gradeInfo = {
    color: gradeColors[score.grade],
    title: c.grades[score.grade].title,
    description: c.grades[score.grade].description,
  };

  const TrendIcon = score.trend === 'rising'
    ? TrendingUp
    : score.trend === 'needs-attention'
    ? TrendingDown
    : Minus;

  const trendColor = score.trend === 'rising'
    ? 'text-emerald-400'
    : score.trend === 'needs-attention'
    ? 'text-amber-400'
    : 'text-stone-500';

  const trendText = score.trend === 'rising'
    ? c.trendRising
    : score.trend === 'needs-attention'
    ? c.trendNeedsAttention
    : c.trendSteady;

  if (compact) {
    return (
      <motion.button
        onClick={onExpand}
        className="w-full bg-gradient-to-br from-stone-900/80 to-stone-950 light:from-white light:to-stone-50 border border-stone-800 light:border-stone-200 rounded-2xl p-4 text-left hover:border-stone-700 light:hover:border-stone-300 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
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
              <span className="text-lg font-bold text-white light:text-stone-900">{score.score}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-white light:text-stone-900 font-semibold truncate">{gradeInfo.title}</h3>
              <div className={`flex items-center gap-1 ${trendColor}`}>
                <TrendIcon size={14} />
              </div>
            </div>
            <p className="text-sm text-stone-500 light:text-stone-500 truncate">{gradeInfo.description}</p>
          </div>

          <ChevronRight size={20} className="text-stone-600 light:text-stone-500 flex-shrink-0" />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-stone-900/80 to-stone-950 light:from-white light:to-stone-50 border border-stone-800 light:border-stone-200 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-6">
        <motion.h2
          className="text-lg font-semibold text-white light:text-stone-900 mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {c.title}
        </motion.h2>
        <motion.p
          className="text-sm text-stone-500 light:text-stone-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {c.subtitle}
        </motion.p>
      </div>

      <div className="flex justify-center mb-6">
        <ScoreRing score={score.score} gradeColor={gradeInfo.color} />
      </div>

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
          <span className="text-white light:text-stone-900 font-semibold">{gradeInfo.title}</span>
          <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
            <TrendIcon size={14} />
            <span>{trendText}</span>
          </div>
        </div>
        <p className="text-sm text-stone-400 light:text-stone-600 mt-3">{gradeInfo.description}</p>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-sm font-medium text-stone-400 light:text-stone-600">{c.scoreBreakdown}</h3>

        <BreakdownBar
          label={c.breakdown.consistency.label}
          value={score.breakdown.consistency}
          maxValue={25}
          icon={c.breakdown.consistency.icon}
          delay={0.9}
        />

        <BreakdownBar
          label={c.breakdown.depth.label}
          value={score.breakdown.depth}
          maxValue={25}
          icon={c.breakdown.depth.icon}
          delay={1.0}
        />

        <BreakdownBar
          label={c.breakdown.commitment.label}
          value={score.breakdown.commitment}
          maxValue={25}
          icon={c.breakdown.commitment.icon}
          delay={1.1}
        />

        <BreakdownBar
          label={c.breakdown.growth.label}
          value={score.breakdown.growth}
          maxValue={25}
          icon={c.breakdown.growth.icon}
          delay={1.2}
        />
      </motion.div>

      <motion.div
        className="mt-6 p-4 bg-stone-800/30 light:bg-stone-200/30 rounded-xl border border-stone-700/50 light:border-stone-300/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <p className="text-sm text-stone-300 light:text-stone-700">
          {(() => {
            const { breakdown } = score;
            const lowest = Object.entries(breakdown).reduce((min, [key, val]) =>
              val < min.val ? { key, val } : min
            , { key: 'consistency', val: 25 });

            return c.lowestInsights[lowest.key as keyof typeof c.lowestInsights];
          })()}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default TransformationScore;
