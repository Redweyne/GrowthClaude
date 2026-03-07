'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui';
import { useStore, type PatternTheme } from '@/store/useStore';
import { useTranslation } from '@/i18n';

const THEME_CONFIG: Record<PatternTheme, { color: string; emoji: string }> = {
  control: { color: '#8b5cf6', emoji: '🎯' },
  acceptance: { color: '#10b981', emoji: '🙏' },
  patience: { color: '#06b6d4', emoji: '⏳' },
  courage: { color: '#f59e0b', emoji: '🦁' },
  discipline: { color: '#ef4444', emoji: '💪' },
  gratitude: { color: '#ec4899', emoji: '✨' },
  perspective: { color: '#6366f1', emoji: '👁️' },
  judgment: { color: '#f97316', emoji: '⚖️' },
  anger: { color: '#dc2626', emoji: '🔥' },
  fear: { color: '#7c3aed', emoji: '😰' },
  comparison: { color: '#14b8a6', emoji: '👀' },
  procrastination: { color: '#64748b', emoji: '⏰' },
};

const GROWTH_THEMES: PatternTheme[] = ['acceptance', 'patience', 'courage', 'discipline', 'gratitude', 'perspective'];
const CHALLENGE_THEMES: PatternTheme[] = ['control', 'judgment', 'anger', 'fear', 'comparison', 'procrastination'];

interface PatternAnalysisProps {
  compact?: boolean;
}

export function PatternAnalysis({ compact = false }: PatternAnalysisProps) {
  const { locale } = useTranslation();
  const { analyzePatterns, getPatternTrends } = useStore();

  const copy = {
    en: {
      noPatterns: 'No Patterns Yet',
      noPatternsBody: 'Complete more lessons to see your transformation patterns emerge.',
      yourPatterns: 'Your Patterns',
      reflections: 'reflections',
      title: 'Your Transformation Patterns',
      basedOn: 'Based on {count} reflection{suffix} this month',
      growthThemes: 'Growth Themes',
      workingThrough: 'Working Through',
      mentions: 'mentions',
      obstacleQuote: '"The obstacle is the way." - Marcus Aurelius',
      allDetectedPatterns: 'All Detected Patterns',
      labels: {
        control: 'Control',
        acceptance: 'Acceptance',
        patience: 'Patience',
        courage: 'Courage',
        discipline: 'Discipline',
        gratitude: 'Gratitude',
        perspective: 'Perspective',
        judgment: 'Judgment',
        anger: 'Anger',
        fear: 'Fear',
        comparison: 'Comparison',
        procrastination: 'Procrastination',
      },
    },
    fr: {
      noPatterns: 'Aucun schéma pour le moment',
      noPatternsBody: 'Terminez davantage de leçons pour voir apparaître vos schémas de transformation.',
      yourPatterns: 'Vos schémas',
      reflections: 'réflexions',
      title: 'Vos schémas de transformation',
      basedOn: 'Basé sur {count} réflexion{suffix} ce mois-ci',
      growthThemes: 'Thèmes de progression',
      workingThrough: 'En cours de travail',
      mentions: 'mentions',
      obstacleQuote: "\"L'obstacle est le chemin.\" - Marc Aurèle",
      allDetectedPatterns: 'Tous les schémas détectés',
      labels: {
        control: 'Contrôle',
        acceptance: 'Acceptation',
        patience: 'Patience',
        courage: 'Courage',
        discipline: 'Discipline',
        gratitude: 'Gratitude',
        perspective: 'Perspective',
        judgment: 'Jugement',
        anger: 'Colère',
        fear: 'Peur',
        comparison: 'Comparaison',
        procrastination: 'Procrastination',
      },
    },
    ar: {
      noPatterns: 'لا توجد أنماط بعد',
      noPatternsBody: 'أكمل المزيد من الدروس لتظهر أنماط تحوّلك بوضوح.',
      yourPatterns: 'أنماطك',
      reflections: 'تأملات',
      title: 'أنماط تحوّلك',
      basedOn: 'استناداً إلى {count} تأمل{suffix} هذا الشهر',
      growthThemes: 'مواضيع النمو',
      workingThrough: 'ما تعمل عليه الآن',
      mentions: 'مرات',
      obstacleQuote: '"العقبة هي الطريق." - ماركوس أوريليوس',
      allDetectedPatterns: 'كل الأنماط المكتشفة',
      labels: {
        control: 'التحكم',
        acceptance: 'التقبّل',
        patience: 'الصبر',
        courage: 'الشجاعة',
        discipline: 'الانضباط',
        gratitude: 'الامتنان',
        perspective: 'المنظور',
        judgment: 'الحكم',
        anger: 'الغضب',
        fear: 'الخوف',
        comparison: 'المقارنة',
        procrastination: 'التسويف',
      },
    },
  } as const;

  const c = copy[locale] ?? copy.en;

  const currentPatterns = useMemo(() => analyzePatterns(), [analyzePatterns]);
  const trends = useMemo(() => getPatternTrends(), [getPatternTrends]);

  const sortedThemes = useMemo(() => {
    const entries = Object.entries(currentPatterns.themes) as [PatternTheme, number][];
    return entries.sort((a, b) => b[1] - a[1]).filter(([, count]) => count > 0);
  }, [currentPatterns.themes]);

  const topGrowth = useMemo(
    () => sortedThemes.filter(([theme]) => GROWTH_THEMES.includes(theme)).slice(0, 3),
    [sortedThemes]
  );

  const topChallenges = useMemo(
    () => sortedThemes.filter(([theme]) => CHALLENGE_THEMES.includes(theme)).slice(0, 3),
    [sortedThemes]
  );

  const getTrendIcon = (theme: PatternTheme) => {
    const trend = trends.find((t) => t.theme === theme);
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
    return <Minus size={14} className="text-stone-500" />;
  };

  if (currentPatterns.totalReflections === 0) {
    return (
      <Card variant="glass" padding="lg" className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-800 light:bg-stone-200 flex items-center justify-center">
          <Sparkles size={28} className="text-stone-600 light:text-stone-500" />
        </div>
        <h3 className="text-lg font-medium text-white light:text-stone-900 mb-2">{c.noPatterns}</h3>
        <p className="text-sm text-stone-500 light:text-stone-500">
          {c.noPatternsBody}
        </p>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white light:text-stone-900">{c.yourPatterns}</h3>
          <span className="text-xs text-stone-500 light:text-stone-500">
            {currentPatterns.totalReflections} {c.reflections}
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
                    <span className="text-xs text-stone-400 light:text-stone-600">{c.labels[theme]}</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(theme)}
                      <span className="text-xs text-stone-500 light:text-stone-500">{count}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-stone-800 light:bg-stone-200 rounded-full overflow-hidden">
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white light:text-stone-900 mb-2">{c.title}</h2>
        <p className="text-stone-400 light:text-stone-600">
          {c.basedOn
            .replace('{count}', String(currentPatterns.totalReflections))
            .replace('{suffix}', currentPatterns.totalReflections !== 1 ? 's' : '')}
        </p>
      </div>

      {topGrowth.length > 0 && (
        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <h3 className="font-medium text-white light:text-stone-900">{c.growthThemes}</h3>
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
                      <span className="text-white light:text-stone-900 font-medium">{c.labels[theme]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(theme)}
                      <span className="text-stone-400 light:text-stone-600">{count} {c.mentions}</span>
                    </div>
                  </div>
                  <div className="h-3 bg-stone-800 light:bg-stone-200 rounded-full overflow-hidden">
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

      {topChallenges.length > 0 && (
        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Sparkles size={16} className="text-amber-400" />
            </div>
            <h3 className="font-medium text-white light:text-stone-900">{c.workingThrough}</h3>
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
                      <span className="text-white light:text-stone-900 font-medium">{c.labels[theme]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(theme)}
                      <span className="text-stone-400 light:text-stone-600">{count} {c.mentions}</span>
                    </div>
                  </div>
                  <div className="h-3 bg-stone-800 light:bg-stone-200 rounded-full overflow-hidden">
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

          <p className="mt-4 text-sm text-stone-500 light:text-stone-500 italic">
            {c.obstacleQuote}
          </p>
        </Card>
      )}

      <Card variant="glass" padding="lg">
        <h3 className="font-medium text-white light:text-stone-900 mb-4">{c.allDetectedPatterns}</h3>
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
                    ? 'bg-stone-800/50 light:bg-stone-200/50 border-stone-700 light:border-stone-300'
                    : 'bg-stone-900/30 light:bg-stone-100/30 border-stone-800/50 light:border-stone-200/50'
                }`}
              >
                <span className="text-2xl mb-1 block">{config.emoji}</span>
                <p className={`text-xs ${isActive ? 'text-white light:text-stone-900' : 'text-stone-600 light:text-stone-500'}`}>
                  {c.labels[theme]}
                </p>
                {isActive && (
                  <p className="text-xs text-stone-500 light:text-stone-500 mt-1">{count}x</p>
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
