'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Heart, Dumbbell, ChevronRight, ChevronLeft, Zap, Check, BarChart3, Map, MessageCircle, Landmark } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AmbientBackground } from '@/components/ambient';
import { WisdomText } from '@/components/ui/WisdomText';
import { SparkLockedCard } from '@/components/spark/SparkLockedCard';
import { AgoraCTA } from '@/components/agora/AgoraCTA';
import { HeroGreeting } from '@/components/home/HeroGreeting';
import { getLevelFromXp, getXpProgress } from '@/types';
import { useTranslation } from '@/i18n';
import type { FlexibleLesson } from '@/types/lessons';
import type { DailyFlowState } from '@/types/dailyPractice';
import { useStore } from '@/store/useStore';
import { Globe } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// THE SANCTUM — A Daily Transformation Portal
// Not a task manager. A personal sanctuary that reflects your journey.
// ═══════════════════════════════════════════════════════════════════════════

interface DailyFlowHomeProps {
  // User info
  name: string;
  totalXp: number;
  currentStreak: number;

  // Today's info
  dayNumber: number;
  totalDays: number;
  worldName: string;

  // Today's lesson
  todaysLesson: FlexibleLesson | null;
  tomorrowsLesson: FlexibleLesson | null;

  // Flow state
  flowState: DailyFlowState;
  exercisesCompleted: number;
  totalExercises: number;

  // Has pending action from GoDoIt
  hasPendingAction: boolean;
  pendingCommitment?: string;

  // Identity & progress (NEW)
  latestIdentityStatement?: string;
  totalLessonsCompleted: number;
  daysSinceStart: number;
  longestStreak: number;

  // Actions
  onStartLesson: () => void;
  onContinueLesson: () => void;
  onStartEcho: () => void;
  onStartExercises: () => void;
  onOpenSettings: () => void;

  // Post-completion
  onBrowseMoreEchoes?: () => void;
  onRedoPastLesson?: () => void;
  onWeeklyReflection?: () => void;
  onOpenDashboard?: () => void;
  onExploreWorlds?: () => void;

  // Spark
  onOpenSpark?: () => void;
  isSparkForcedClosed?: boolean;

  // Agora
  onOpenAgora?: () => void;
}

export function DailyFlowHome({
  name,
  totalXp,
  currentStreak,
  dayNumber,
  totalDays,
  worldName,
  todaysLesson,
  tomorrowsLesson,
  flowState,
  exercisesCompleted,
  totalExercises,
  hasPendingAction,
  pendingCommitment,
  latestIdentityStatement,
  totalLessonsCompleted,
  daysSinceStart,
  longestStreak,
  onStartLesson,
  onContinueLesson,
  onStartEcho,
  onStartExercises,
  onOpenSettings,
  onBrowseMoreEchoes,
  onRedoPastLesson,
  onOpenDashboard,
  onExploreWorlds,
  onOpenSpark,
  isSparkForcedClosed,
  onOpenAgora,
}: DailyFlowHomeProps) {
  const { t, isRTL } = useTranslation();
  const { lastLessonDate, completedLessons, transformationGoal, streakShieldCount } = useStore();

  const level = getLevelFromXp(totalXp);
  const xpProgress = getXpProgress(totalXp);
  const isComplete = flowState.currentPhase === 'complete';
  const isWorldFinished = !todaysLesson && dayNumber > totalDays;

  // Determine which phase index is active (0=lesson, 1=echo, 2=practice, 3=complete)
  const phaseIndex = isComplete ? 3
    : flowState.currentPhase === 'practice' ? 2
    : flowState.currentPhase === 'echo' ? 1
    : 0;

  return (
    <div className="relative min-h-full flex flex-col" data-testid="daily-flow-home">
      <AmbientBackground intensity="normal" particleCount={15} orbCount={3} />

      <motion.div
        className="relative z-10 flex-1 flex flex-col p-6 pb-20 max-w-lg mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* ═══════════════════════════════════════════════════════════
            SECTION 1: Compact Header
        ═══════════════════════════════════════════════════════════ */}
        <HeroGreeting
          name={name}
          streak={currentStreak}
          longestStreak={longestStreak}
          totalLessons={Object.keys(completedLessons).length}
          lastLessonDate={lastLessonDate}
          transformationGoal={transformationGoal}
          streakShieldCount={streakShieldCount}
          dayNumber={dayNumber}
          worldName={worldName}
          onOpenSettings={onOpenSettings}
        />

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2: Daily Ritual Card (the hero)
        ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {isWorldFinished ? (
              <WorldCompleteCard
                key="world-complete"
                worldName={worldName}
                totalDays={totalDays}
                totalXp={totalXp}
                totalLessonsCompleted={totalLessonsCompleted}
                onExploreWorlds={onExploreWorlds}
                isRTL={isRTL}
                t={t}
              />
            ) : isComplete ? (
              <CompletionCard
                key="complete"
                latestIdentityStatement={latestIdentityStatement}
                totalXp={totalXp}
                isRTL={isRTL}
                t={t}
              />
            ) : (
              <RitualCard
                key={flowState.currentPhase}
                phase={flowState.currentPhase}
                todaysLesson={todaysLesson}
                exercisesCompleted={exercisesCompleted}
                totalExercises={totalExercises}
                hasPendingAction={hasPendingAction}
                pendingCommitment={pendingCommitment}
                onStartLesson={onStartLesson}
                onContinueLesson={onContinueLesson}
                onStartEcho={onStartEcho}
                onStartExercises={onStartExercises}
                isRTL={isRTL}
                t={t}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3: Journey Steps
        ═══════════════════════════════════════════════════════════ */}
        <motion.div
          className="my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <JourneySteps phaseIndex={phaseIndex} isRTL={isRTL} t={t} />
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 4: Becoming (Identity + Level)
        ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <BecomingSection
            level={level}
            totalXp={totalXp}
            xpProgress={xpProgress}
            latestIdentityStatement={latestIdentityStatement}
            transformationGoal={transformationGoal}
            totalLessonsCompleted={totalLessonsCompleted}
            daysSinceStart={daysSinceStart}
            longestStreak={longestStreak}
            isRTL={isRTL}
            t={t}
          />
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 5: Bottom — Spark + Tomorrow + Quick Nav
        ═══════════════════════════════════════════════════════════ */}
        <motion.div
          className="mt-6 flex-1 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          {/* Spark */}
          {isComplete && onOpenSpark && (
            <div className="mb-4">
              <SparkLockedCard
                isUnlocked={true}
                isForcedClosed={isSparkForcedClosed}
                onOpen={onOpenSpark}
              />
            </div>
          )}

          {!isComplete && onOpenSpark && (
            <div className="mb-4">
              <SparkLockedCard
                isUnlocked={false}
                onOpen={onOpenSpark}
              />
            </div>
          )}

          {/* The Agora — community feedback CTA */}
          {onOpenAgora && (
            <div className="mb-4">
              <AgoraCTA onClick={onOpenAgora} />
            </div>
          )}

          {/* Tomorrow's glimpse */}
          {tomorrowsLesson && (
            <div className={`mb-5 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-xs uppercase tracking-[0.15em] text-stone-600 light:text-stone-500 mb-1.5">
                {t('dailyFlow.tomorrowsGlimpse')}
              </p>
              <p className="text-sm text-stone-400 light:text-stone-600">
                <span className="text-stone-300 light:text-stone-700 font-medium">{tomorrowsLesson.title}</span>
                {tomorrowsLesson.teaserText && (
                  <span className="text-stone-500"> — {tomorrowsLesson.teaserText.slice(0, 60)}{tomorrowsLesson.teaserText.length > 60 ? '...' : ''}</span>
                )}
              </p>
            </div>
          )}

          {/* Quick navigation */}
          {isComplete && (
            <div className={`flex justify-center gap-4 pt-2 pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {onOpenDashboard && (
                <QuickNavButton
                  icon={<BarChart3 size={18} />}
                  label={t('dailyFlow.viewDashboard')}
                  onClick={onOpenDashboard}
                />
              )}
              {onRedoPastLesson && (
                <QuickNavButton
                  icon={<Map size={18} />}
                  label={t('dailyFlow.redoPastLesson')}
                  onClick={onRedoPastLesson}
                />
              )}
              {onBrowseMoreEchoes && (
                <QuickNavButton
                  icon={<MessageCircle size={18} />}
                  label={t('dailyFlow.browseMoreEchoes')}
                  onClick={onBrowseMoreEchoes}
                />
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RITUAL CARD — One card, one action. Changes based on phase.
// ═══════════════════════════════════════════════════════════════════════════

function RitualCard({
  phase,
  todaysLesson,
  exercisesCompleted,
  totalExercises,
  hasPendingAction,
  pendingCommitment,
  onStartLesson,
  onContinueLesson,
  onStartEcho,
  onStartExercises,
  isRTL,
  t,
}: {
  phase: string;
  todaysLesson: FlexibleLesson | null;
  exercisesCompleted: number;
  totalExercises: number;
  hasPendingAction: boolean;
  pendingCommitment?: string;
  onStartLesson: () => void;
  onContinueLesson: () => void;
  onStartEcho: () => void;
  onStartExercises: () => void;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  if (phase === 'lesson') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="glass" padding="none" className="border-amber-500/20 overflow-hidden">
          <div className="p-6">
            {/* Wisdom preview */}
            {(todaysLesson?.subtitle || todaysLesson?.teaserText) && (
              <p className={`font-serif text-base text-stone-400 light:text-stone-500 italic leading-relaxed mb-5 ${isRTL ? 'text-right' : ''}`}>
                &ldquo;{todaysLesson.teaserText || todaysLesson.subtitle}&rdquo;
              </p>
            )}

            {/* Lesson title */}
            <h2 className={`text-xl sm:text-2xl font-bold text-stone-100 light:text-stone-900 tracking-tight mb-2 ${isRTL ? 'text-right' : ''}`}>
              {todaysLesson?.title || t('common.loading')}
            </h2>

            {/* Meta */}
            <div className={`flex items-center gap-3 text-sm text-stone-500 light:text-stone-600 mb-5 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              {todaysLesson?.estimatedMinutes && (
                <span>{t('practiceMode.estimatedTime', { minutes: todaysLesson.estimatedMinutes })}</span>
              )}
              {todaysLesson?.xpReward && (
                <>
                  <span className="text-stone-700 light:text-stone-400">·</span>
                  <span className="text-amber-500">+{todaysLesson.xpReward} {t('common.xp')}</span>
                </>
              )}
            </div>

            {/* Pending commitment */}
            {hasPendingAction && pendingCommitment && (
              <div className={`mb-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 ${isRTL ? 'text-right' : ''}`}>
                <p className="text-amber-500/70 text-xs uppercase tracking-wider mb-1">
                  {t('dailyFlow.yourCommitment')}
                </p>
                <p className="text-stone-300 light:text-stone-700 text-sm italic">
                  &ldquo;{pendingCommitment.slice(0, 100)}{pendingCommitment.length > 100 ? '...' : ''}&rdquo;
                </p>
              </div>
            )}

            {/* CTA */}
            <Button
              onClick={hasPendingAction ? onContinueLesson : onStartLesson}
              variant="primary"
              className={`w-full ${isRTL ? 'flex-row-reverse' : ''}`}
              glow
              data-testid={hasPendingAction ? 'continue-lesson-btn' : 'start-lesson-btn'}
            >
              {hasPendingAction ? t('dailyFlow.phases.lesson.continueLesson') : t('dailyFlow.phases.lesson.beginLesson')}
              <ChevronIcon size={18} className={isRTL ? 'mr-2' : 'ml-2'} />
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (phase === 'echo') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="glass" padding="none" className="border-amber-500/20 overflow-hidden">
          <div className="p-6">
            {/* Completed indicator */}
            <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check size={12} className="text-emerald-400" />
              </div>
              <span className="text-xs text-emerald-400 uppercase tracking-wider">{t('dailyFlow.phases.lesson.title')} {t('common.complete')}</span>
            </div>

            <h2 className={`text-xl sm:text-2xl font-bold text-stone-100 light:text-stone-900 tracking-tight mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('dailyFlow.phases.echo.title')}
            </h2>
            <p className={`text-sm text-stone-400 light:text-stone-600 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('dailyFlow.phases.echo.subtitle')}
            </p>
            <div className={`flex items-center gap-3 text-sm text-stone-500 light:text-stone-600 mb-5 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <span>{t('practiceMode.estimatedTime', { minutes: 3 })}</span>
              <span className="text-stone-700 light:text-stone-400">·</span>
              <span className="text-amber-500">+10 {t('common.xp')}</span>
            </div>

            <Button
              onClick={onStartEcho}
              variant="primary"
              className={`w-full ${isRTL ? 'flex-row-reverse' : ''}`}
              glow
              data-testid="start-echo-btn"
            >
              {t('dailyFlow.phases.echo.respondToReflection')}
              <ChevronIcon size={18} className={isRTL ? 'mr-2' : 'ml-2'} />
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Practice phase
  const practiceProgress = totalExercises > 0 ? (exercisesCompleted / totalExercises) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="glass" padding="none" className="border-amber-500/20 overflow-hidden">
        <div className="p-6">
          {/* Completed indicators */}
          <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check size={12} className="text-emerald-400" />
              </div>
              <span className="text-xs text-emerald-400">{t('dailyFlow.phases.lesson.title')}</span>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check size={12} className="text-emerald-400" />
              </div>
              <span className="text-xs text-emerald-400">{t('dailyFlow.phases.echo.title')}</span>
            </div>
          </div>

          <h2 className={`text-xl sm:text-2xl font-bold text-stone-100 light:text-stone-900 tracking-tight mb-2 ${isRTL ? 'text-right' : ''}`}>
            {t('dailyFlow.phases.practice.title')}
          </h2>

          {/* Progress */}
          <div className="mb-5">
            <div className={`flex justify-between text-sm text-stone-500 light:text-stone-600 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span>{t('dailyFlow.phases.practice.completed').replace('{current}', String(exercisesCompleted)).replace('{total}', String(totalExercises))}</span>
              <span className="text-amber-500">+25 {t('common.xp')}</span>
            </div>
            <div className="h-2 bg-stone-800/80 light:bg-stone-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${practiceProgress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>

          <Button
            onClick={onStartExercises}
            variant="primary"
            className={`w-full ${isRTL ? 'flex-row-reverse' : ''}`}
            glow
            data-testid="start-exercises-btn"
          >
            {exercisesCompleted > 0 ? t('dailyFlow.phases.practice.continuePractice') : t('dailyFlow.phases.practice.beginPractice')}
            <ChevronIcon size={18} className={isRTL ? 'mr-2' : 'ml-2'} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPLETION CARD — Today's ritual is complete
// ═══════════════════════════════════════════════════════════════════════════

function CompletionCard({
  latestIdentityStatement,
  totalXp,
  isRTL,
  t,
}: {
  latestIdentityStatement?: string;
  totalXp: number;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <Card variant="glow" padding="none" className="overflow-hidden">
        <div className="p-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
            className="text-4xl mb-4"
          >
            ✨
          </motion.div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 light:text-stone-900 mb-2">
            {t('dailyFlow.todaysPracticeComplete')}
          </h2>
          <p className="text-stone-500 light:text-stone-600 text-sm mb-4">
            {t('dailyFlow.doneTheWork')}
          </p>

          {latestIdentityStatement && (
            <div className="mt-4 pt-4 border-t border-stone-800/50 light:border-stone-300/50">
              <p className="font-serif text-lg text-stone-300 light:text-stone-700 italic leading-relaxed">
                &ldquo;{latestIdentityStatement}&rdquo;
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WORLD COMPLETE CARD — The world has been conquered
// ═══════════════════════════════════════════════════════════════════════════

function WorldCompleteCard({
  worldName,
  totalDays,
  totalXp,
  totalLessonsCompleted,
  onExploreWorlds,
  isRTL,
  t,
}: {
  worldName: string;
  totalDays: number;
  totalXp: number;
  totalLessonsCompleted: number;
  onExploreWorlds?: () => void;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Card variant="glow" padding="none" className="overflow-hidden relative">
        {/* Animated gradient border shimmer */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(168,85,247,0.15), rgba(251,191,36,0.15))',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative p-8 text-center">
          {/* Crown / Achievement icon with particle burst */}
          <motion.div
            className="relative inline-block mb-5"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
          >
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
                transform: 'scale(2.5)',
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [2.2, 2.8, 2.2],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
              <motion.span
                className="text-4xl"
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                👑
              </motion.span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400/70 mb-2 font-medium">
              {t('dailyFlow.worldComplete.label')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 light:text-stone-900 mb-2">
              {worldName}
            </h2>
            <p className="text-stone-400 light:text-stone-600 text-sm leading-relaxed max-w-[280px] mx-auto">
              {t('dailyFlow.worldComplete.message')}
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className={`flex justify-center gap-6 mt-6 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{totalDays}</p>
              <p className="text-[10px] uppercase tracking-wider text-stone-500">{t('dailyFlow.worldComplete.daysCompleted')}</p>
            </div>
            <div className="w-px bg-stone-700/50" />
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{totalLessonsCompleted}</p>
              <p className="text-[10px] uppercase tracking-wider text-stone-500">{t('dailyFlow.lessons')}</p>
            </div>
            <div className="w-px bg-stone-700/50" />
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{totalXp.toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-wider text-stone-500">{t('common.xp')}</p>
            </div>
          </motion.div>

          {/* CTA */}
          {onExploreWorlds && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={onExploreWorlds}
                variant="primary"
                className={`w-full ${isRTL ? 'flex-row-reverse' : ''}`}
                glow
                sound="celebrate"
              >
                <Globe size={18} className={isRTL ? 'ml-2' : 'mr-2'} />
                {t('dailyFlow.worldComplete.exploreWorlds')}
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// JOURNEY STEPS — Minimal 3-step progress indicator
// ═══════════════════════════════════════════════════════════════════════════

const STEPS = [
  { key: 'lesson', icon: BookOpen, labelKey: 'dailyFlow.phases.lesson.title' },
  { key: 'echo', icon: Heart, labelKey: 'dailyFlow.phases.echo.title' },
  { key: 'practice', icon: Dumbbell, labelKey: 'dailyFlow.phases.practice.title' },
];

function JourneySteps({ phaseIndex, isRTL, t }: { phaseIndex: number; isRTL: boolean; t: (key: string, params?: Record<string, string | number>) => string }) {
  return (
    <div className={`flex items-center justify-center gap-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {STEPS.map((step, idx) => {
        const isCompleted = idx < phaseIndex;
        const isCurrent = idx === phaseIndex && phaseIndex < 3;
        const Icon = step.icon;

        return (
          <div key={step.key} className={`flex items-center ${idx < STEPS.length - 1 ? 'flex-1' : ''}`}>
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500/20 border-2 border-emerald-500/40'
                    : isCurrent
                    ? 'bg-amber-500/20 border-2 border-amber-500/40'
                    : 'bg-stone-800/50 light:bg-stone-200/80 border-2 border-stone-700/50 light:border-stone-300/80'
                }`}
                animate={isCurrent ? {
                  boxShadow: ['0 0 0px rgba(251,191,36,0)', '0 0 12px rgba(251,191,36,0.3)', '0 0 0px rgba(251,191,36,0)'],
                } : {}}
                transition={isCurrent ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
              >
                {isCompleted ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <Icon size={14} className={isCurrent ? 'text-amber-400' : 'text-stone-600 light:text-stone-500'} />
                )}
              </motion.div>
              <span className={`text-[10px] font-medium ${
                isCompleted ? 'text-emerald-400/80' : isCurrent ? 'text-amber-400/80' : 'text-stone-600 light:text-stone-500'
              }`}>
                {t(step.labelKey)}
              </span>
            </div>

            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mt-[-18px] relative overflow-hidden rounded-full bg-stone-800/50 light:bg-stone-300/80">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-emerald-500/60 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BECOMING SECTION — Identity + Level + Transformation
// ═══════════════════════════════════════════════════════════════════════════

function BecomingSection({
  level,
  totalXp,
  xpProgress,
  latestIdentityStatement,
  transformationGoal,
  totalLessonsCompleted,
  daysSinceStart,
  longestStreak,
  isRTL,
  t,
}: {
  level: { level: number; title: string };
  totalXp: number;
  xpProgress: { current: number; needed: number; percentage: number };
  latestIdentityStatement?: string;
  transformationGoal?: string | null;
  totalLessonsCompleted: number;
  daysSinceStart: number;
  longestStreak: number;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
    <Card variant="glass" padding="md">
      <p className={`text-xs uppercase tracking-[0.15em] text-stone-500 light:text-stone-600 mb-4 ${isRTL ? 'text-right' : ''}`}>
        {t('dailyFlow.becoming')}
      </p>

      {/* Level & XP Progress */}
      <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shrink-0">
          <span className="text-lg font-bold text-stone-950">{level.level}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium text-stone-200 light:text-stone-800 ${isRTL ? 'text-right' : ''}`}>
            {level.title}
          </p>
          <div className="h-1.5 bg-stone-800/80 light:bg-stone-200 rounded-full overflow-hidden mt-1.5">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress.percentage}%` }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
        <span className="text-xs text-stone-500 light:text-stone-600 tabular-nums shrink-0">
          {totalXp.toLocaleString()} {t('common.xp')}
        </span>
      </div>

      {/* Identity Statement or Transformation Goal */}
      {latestIdentityStatement ? (
        <p className={`font-serif text-base sm:text-lg text-stone-300 light:text-stone-700 italic leading-relaxed mb-4 ${isRTL ? 'text-right' : ''}`}>
          &ldquo;{latestIdentityStatement}&rdquo;
        </p>
      ) : transformationGoal ? (
        <p className={`font-serif text-base text-stone-400 light:text-stone-600 italic mb-4 ${isRTL ? 'text-right' : ''}`}>
          {t('dailyFlow.becomingMore')} {transformationGoal}
        </p>
      ) : null}

      {/* Compact journey stats */}
      <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 light:text-stone-600 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
        {totalLessonsCompleted > 0 && <span>{totalLessonsCompleted} {t('dailyFlow.lessons')}</span>}
        {daysSinceStart > 0 && <span>{daysSinceStart} {t('dailyFlow.days')}</span>}
        {longestStreak > 3 && <span>{t('dailyFlow.bestStreak')}: {longestStreak}</span>}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// QUICK NAV BUTTON
// ═══════════════════════════════════════════════════════════════════════════

function QuickNavButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-stone-800/50 light:hover:bg-stone-200/80 transition-colors"
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-10 h-10 rounded-xl bg-stone-800/80 light:bg-stone-200 border border-stone-700/50 light:border-stone-300 flex items-center justify-center">
        <span className="text-stone-400 light:text-stone-600">{icon}</span>
      </div>
      <span className="text-[10px] text-stone-500 light:text-stone-600 font-medium">{label}</span>
    </motion.button>
  );
}

export default DailyFlowHome;
