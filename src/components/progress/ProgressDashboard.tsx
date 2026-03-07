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
import { useTranslation } from '@/i18n';

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
    reflection: 'from-stone-500/10 to-stone-600/10 light:from-stone-200/70 light:to-stone-100/70 border-stone-500/20 light:border-stone-300',
  };

  const iconColors = {
    observation: 'text-blue-400',
    encouragement: 'text-emerald-400',
    challenge: 'text-amber-400',
    celebration: 'text-purple-400',
    reflection: 'text-stone-400 light:text-stone-600',
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
        <p className="text-sm text-stone-200 light:text-stone-800 leading-relaxed">{insight.message}</p>
      </div>
      {insight.context && (
        <p className="text-xs text-stone-500 light:text-stone-600 mt-2 ml-7">{insight.context}</p>
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
      className={`bg-gradient-to-br ${bgColor} border border-stone-800 light:border-stone-300 rounded-xl p-4 text-left transition-all ${
        onClick ? 'hover:border-stone-700 light:hover:border-stone-400 hover:scale-[1.02] cursor-pointer' : ''
      }`}
    >
      <Icon className={`w-5 h-5 ${color} mb-2`} />
      <div className="text-2xl font-bold text-white light:text-stone-900">{value}</div>
      <div className="text-xs text-stone-400 light:text-stone-600">{label}</div>
      {onClick && (
        <ChevronRight size={14} className="text-stone-600 light:text-stone-500 absolute top-4 right-4" />
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
  const { locale } = useTranslation();
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

  const copy = {
    en: {
      title: 'Your Progress',
      totalXp: 'Total XP',
      level: 'Level',
      xpThisLevel: '{xp} XP this level',
      maxLevel: 'Max Level',
      toNext: '{xp} to next',
      viewStory: 'View Your Transformation Story',
      reflectionsReady: '{count} reflections ready',
      reflectionsNeeded: '{current}/{target} reflections needed',
      lessonsCompleted: 'Lessons Completed',
      reflectionsWritten: 'Reflections Written',
      identityStatements: 'Identity Statements',
      personalInsights: 'Personal Insights',
      showLess: 'Show less',
      viewAll: 'View all ({count})',
      yourWords: 'Your Words',
      wordsWritten: 'Words written',
      avgPerReflection: 'Avg per reflection',
      daysOnPath: 'Days on path',
      writingBook: "You've written a small book about your transformation.",
      writingThousand: 'Over a thousand words of self-discovery.',
      writingStep: 'Every word is a step toward understanding yourself.',
      writingBeginning: 'Your story is just beginning to be written.',
      journeyDataProof: 'This is not just data. This is proof of who you are becoming.',
      closingQuote: '"No man is free who is not master of himself."',
      quoteAuthor: 'Epictetus',
      withIntention: 'and kept showing up with intention.',
      inDays: 'In {days} days',
      completedLessons: 'completed {count} lessons',
      wroteWords: 'you have written {count} words of reflection',
      declaredStatements: 'declared {count} identity statement{suffix}',
    },
    fr: {
      title: 'Votre progression',
      totalXp: 'XP total',
      level: 'Niveau',
      xpThisLevel: '{xp} XP dans ce niveau',
      maxLevel: 'Niveau max',
      toNext: '{xp} avant le suivant',
      viewStory: 'Voir votre histoire de transformation',
      reflectionsReady: '{count} réflexions prêtes',
      reflectionsNeeded: '{current}/{target} réflexions requises',
      lessonsCompleted: 'Leçons terminées',
      reflectionsWritten: 'Réflexions écrites',
      identityStatements: 'Déclarations identitaires',
      personalInsights: 'Observations personnelles',
      showLess: 'Voir moins',
      viewAll: 'Tout voir ({count})',
      yourWords: 'Vos mots',
      wordsWritten: 'Mots écrits',
      avgPerReflection: 'Moyenne par réflexion',
      daysOnPath: 'Jours sur le chemin',
      writingBook: 'Vous avez écrit un petit livre sur votre transformation.',
      writingThousand: 'Plus de mille mots de découverte de soi.',
      writingStep: 'Chaque mot est un pas vers une meilleure compréhension de vous-même.',
      writingBeginning: "Votre histoire commence tout juste à s'écrire.",
      journeyDataProof: 'Ce ne sont pas seulement des données. C est la preuve de ce que vous devenez.',
      closingQuote: '"Nul homme n est libre s il n est pas maître de lui-même."',
      quoteAuthor: 'Épictète',
      withIntention: 'et vous êtes resté présent avec intention.',
      inDays: 'En {days} jours',
      completedLessons: 'vous avez terminé {count} leçons',
      wroteWords: 'vous avez écrit {count} mots de réflexion',
      declaredStatements: 'déclaré {count} affirmation{suffix} identitaire',
    },
    ar: {
      title: 'تقدمك',
      totalXp: 'إجمالي XP',
      level: 'المستوى',
      xpThisLevel: '{xp} XP في هذا المستوى',
      maxLevel: 'أقصى مستوى',
      toNext: '{xp} للوصول للمستوى التالي',
      viewStory: 'عرض قصة تحوّلك',
      reflectionsReady: '{count} تأملات جاهزة',
      reflectionsNeeded: '{current}/{target} تأملات مطلوبة',
      lessonsCompleted: 'الدروس المكتملة',
      reflectionsWritten: 'التأملات المكتوبة',
      identityStatements: 'عبارات الهوية',
      personalInsights: 'رؤى شخصية',
      showLess: 'عرض أقل',
      viewAll: 'عرض الكل ({count})',
      yourWords: 'كلماتك',
      wordsWritten: 'كلمات مكتوبة',
      avgPerReflection: 'المتوسط لكل تأمل',
      daysOnPath: 'أيام على الطريق',
      writingBook: 'لقد كتبت كتاباً صغيراً عن تحوّلك.',
      writingThousand: 'أكثر من ألف كلمة من اكتشاف الذات.',
      writingStep: 'كل كلمة خطوة نحو فهم نفسك.',
      writingBeginning: 'قصتك بدأت للتو في التشكل.',
      journeyDataProof: 'هذه ليست مجرد بيانات. هذا دليل على من تصبح.',
      closingQuote: '"لا يكون الإنسان حراً إن لم يكن سيد نفسه."',
      quoteAuthor: 'إبكتيتوس',
      withIntention: 'وواصلت الحضور بنية واضحة.',
      inDays: 'خلال {days} يوماً',
      completedLessons: 'أنجزت {count} درساً',
      wroteWords: 'كتبت {count} كلمة تأملية',
      declaredStatements: 'صرحت بـ {count} عبارة هوية{suffix}',
    },
  } as const;

  const c = copy[locale] ?? copy.en;

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
  const heroMessage = useMemo(() => generateHeroMessage(progressContext, locale), [progressContext, locale]);
  const insights = useMemo(() => generatePersonalInsights(progressContext, locale), [progressContext, locale]);

  // Top 2 insights for preview, all for expanded view
  const visibleInsights = showAllInsights ? insights : insights.slice(0, 2);

  return (
    <div className="min-h-screen bg-stone-950 light:bg-stone-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-stone-950/90 light:bg-stone-50/90 backdrop-blur-lg border-b border-stone-800 light:border-stone-300">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 -ml-2 text-stone-400 light:text-stone-600 hover:text-white light:hover:text-stone-900 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-lg font-bold text-white light:text-stone-900">{c.title}</h1>
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
            className="text-2xl font-bold text-white light:text-stone-900 mb-3"
          >
            {heroMessage.headline}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-stone-400 light:text-stone-600 max-w-md mx-auto"
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
            className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 light:from-indigo-100/70 light:to-purple-100/70 border border-indigo-500/20 light:border-indigo-300 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/25">
                {level.level}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white light:text-stone-900">{level.title}</h3>
                <p className="text-sm text-indigo-300/70 light:text-indigo-700">{c.level} {level.level}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white light:text-stone-900">{totalXp.toLocaleString()}</div>
              <div className="text-sm text-indigo-300/70 light:text-indigo-700">{c.totalXp}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-indigo-300/70 light:text-indigo-700">
              <span>{c.xpThisLevel.replace('{xp}', String(xpProgress.current))}</span>
              <span>{level.maxXp === Infinity ? c.maxLevel : c.toNext.replace('{xp}', String(xpProgress.needed - xpProgress.current))}</span>
            </div>
            <div className="h-2 bg-indigo-950/50 light:bg-indigo-200 rounded-full overflow-hidden">
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
            label={c.viewStory}
            subtitle={
              canGenerateStory
                ? c.reflectionsReady.replace('{count}', String(storyReadiness.reflectionCount))
                : c.reflectionsNeeded
                  .replace('{current}', String(storyReadiness.minimumRequired.current))
                  .replace('{target}', String(storyReadiness.minimumRequired.reflections))
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
            label={c.lessonsCompleted}
            value={stats.totalLessons}
            color="text-blue-400"
            bgColor="from-blue-500/10 to-blue-600/5"
            delay={0.35}
          />
          <StatCard
            icon={PenTool}
            label={c.reflectionsWritten}
            value={stats.totalReflections}
            color="text-purple-400"
            bgColor="from-purple-500/10 to-purple-600/5"
            delay={0.4}
          />
          <StatCard
            icon={Sparkles}
            label={c.identityStatements}
            value={stats.totalIdentityStatements}
            color="text-amber-400"
            bgColor="from-amber-500/10 to-amber-600/5"
            onClick={onOpenIdentity}
            delay={0.45}
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
              <h3 className="text-sm font-semibold text-stone-400 light:text-stone-600 flex items-center gap-2">
                <Target size={16} />
                {c.personalInsights}
              </h3>
              {insights.length > 2 && (
                <button
                  onClick={() => setShowAllInsights(!showAllInsights)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {showAllInsights ? c.showLess : c.viewAll.replace('{count}', String(insights.length))}
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
          className="bg-stone-900/50 light:bg-stone-100/80 border border-stone-800 light:border-stone-300 rounded-xl p-4"
        >
          <h3 className="text-sm font-semibold text-stone-400 light:text-stone-600 mb-4">{c.yourWords}</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-white light:text-stone-900">
                {stats.totalWords.toLocaleString()}
              </div>
              <div className="text-xs text-stone-500 light:text-stone-600">{c.wordsWritten}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white light:text-stone-900">
                {stats.averageReflectionLength}
              </div>
              <div className="text-xs text-stone-500 light:text-stone-600">{c.avgPerReflection}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white light:text-stone-900">
                {stats.daysSinceStart}
              </div>
              <div className="text-xs text-stone-500 light:text-stone-600">{c.daysOnPath}</div>
            </div>
          </div>

          {/* Contextual message about writing */}
          <div className="mt-4 pt-4 border-t border-stone-800 light:border-stone-300">
            <p className="text-xs text-stone-500 light:text-stone-600 text-center">
              {stats.totalWords >= 5000
                ? c.writingBook
                : stats.totalWords >= 1000
                ? c.writingThousand
                : stats.totalWords >= 100
                ? c.writingStep
                : c.writingBeginning}
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
            <p className="text-stone-300 light:text-stone-700 leading-relaxed">
              {name ? `${name}, ` : ''}
              {c.inDays.replace('{days}', String(stats.daysSinceStart))},{' '}
              {c.wroteWords.replace('{count}', stats.totalWords.toLocaleString())},{' '}
              {c.completedLessons.replace('{count}', String(stats.totalLessons))},
              {stats.totalIdentityStatements > 0 && (
                <> {c.declaredStatements
                  .replace('{count}', String(stats.totalIdentityStatements))
                  .replace('{suffix}', stats.totalIdentityStatements !== 1 ? 's' : '')},</>
              )}
              {' '}{c.withIntention}
            </p>
            <p className="text-sm text-stone-500 light:text-stone-600 mt-4 italic">
              {c.journeyDataProof}
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
          <p className="text-sm text-stone-600 light:text-stone-600 italic">
            {c.closingQuote}
          </p>
          <p className="text-xs text-stone-700 light:text-stone-500 mt-1">- {c.quoteAuthor}</p>
        </motion.div>
      </div>
    </div>
  );
}

export default ProgressDashboard;
