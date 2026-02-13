'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExerciseCard } from './ExerciseCard';
import { TruthMirrorExercise } from './TruthMirrorExercise';
import { SoulCompassExercise } from './SoulCompassExercise';
import { PresenceAnchorExercise } from './PresenceAnchorExercise';
import { useTranslation } from '@/i18n';
import type {
  DailyExercise,
  TruthMirrorContent,
  SoulCompassContent,
  PresenceAnchorContent,
} from '@/types/dailyPractice';
import {
  isTruthMirrorContent,
  isSoulCompassContent,
  isPresenceAnchorContent,
} from '@/types/dailyPractice';

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE EXPERIENCE
// The orchestrator for the 3 daily exercises (no writing required!)
// ═══════════════════════════════════════════════════════════════════════════

interface ExerciseExperienceProps {
  exercises: DailyExercise[];
  completedExercises: string[];
  onCompleteExercise: (exerciseId: string, response?: string) => void;
  onAllComplete: () => void;
  onBack: () => void;
  lessonTitle: string;
}

export function ExerciseExperience({
  exercises,
  completedExercises,
  onCompleteExercise,
  onAllComplete,
  onBack,
  lessonTitle,
}: ExerciseExperienceProps) {
  const { t, isRTL } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<DailyExercise | null>(null);

  // Calculate progress
  const completedCount = completedExercises.length;
  const totalCount = exercises.length;
  const allComplete = completedCount === totalCount;

  // Estimated time remaining (roughly 1.5 min per exercise now - no writing!)
  const remainingCount = exercises.filter(
    (ex) => !completedExercises.includes(ex.id)
  ).length;
  const estimatedMinutes = Math.ceil(remainingCount * 1.5);

  // Handle exercise completion
  const handleExerciseComplete = (response?: string) => {
    if (selectedExercise) {
      onCompleteExercise(selectedExercise.id, response);
      setSelectedExercise(null);
    }
  };

  // Render the active exercise based on type
  const renderActiveExercise = () => {
    if (!selectedExercise) return null;

    const commonProps = {
      title: selectedExercise.title,
      onBack: () => setSelectedExercise(null),
      isRTL,
      t,
    };

    // Truth Mirror exercise
    if (isTruthMirrorContent(selectedExercise.content)) {
      return (
        <TruthMirrorExercise
          {...commonProps}
          content={selectedExercise.content as TruthMirrorContent}
          onComplete={() => handleExerciseComplete()}
        />
      );
    }

    // Soul Compass exercise
    if (isSoulCompassContent(selectedExercise.content)) {
      return (
        <SoulCompassExercise
          {...commonProps}
          content={selectedExercise.content as SoulCompassContent}
          onComplete={() => handleExerciseComplete()}
        />
      );
    }

    // Presence Anchor exercise
    if (isPresenceAnchorContent(selectedExercise.content)) {
      return (
        <PresenceAnchorExercise
          {...commonProps}
          content={selectedExercise.content as PresenceAnchorContent}
          onComplete={() => handleExerciseComplete()}
        />
      );
    }

    // Fallback - shouldn't happen with new types
    return null;
  };

  // If an exercise is selected, render it fullscreen
  if (selectedExercise) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedExercise.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {renderActiveExercise()}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Exercise list view
  return (
    <motion.div
      className={`min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col ${isRTL ? 'rtl' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir={isRTL ? 'rtl' : 'ltr'}
      data-testid="exercise-experience"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 text-stone-500 light:text-stone-600 hover:text-stone-300 light:hover:text-stone-900 transition-colors text-sm mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {t('exercises.backToToday')}
        </button>

        <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-stone-500 light:text-stone-600 text-xs uppercase tracking-wider">
              {t('exercises.todaysPractice')}
            </p>
            <h1 className="text-2xl font-semibold text-stone-100 light:text-stone-900">
              {lessonTitle}
            </h1>
          </div>
          <div className={isRTL ? 'text-left' : 'text-right'}>
            <p className="text-amber-400 font-bold text-xl">
              {completedCount}/{totalCount}
            </p>
            <p className="text-stone-500 light:text-stone-600 text-xs">{t('exercises.completed')}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-stone-800 light:bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r from-amber-500 to-orange-500 ${isRTL ? 'origin-right' : ''}`}
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={isRTL ? { marginLeft: 'auto' } : {}}
          />
        </div>

        {!allComplete && (
          <p className={`text-stone-500 light:text-stone-600 text-sm mt-2 ${isRTL ? 'text-right' : ''}`}>
            {t('exercises.minRemaining').replace('{min}', String(estimatedMinutes))}
          </p>
        )}
      </div>

      {/* Exercise List */}
      <div className="flex-1 px-6 pb-6">
        {allComplete ? (
          // All complete celebration
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-12"
          >
            <motion.div
              className="text-6xl mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            >
              🎉
            </motion.div>

            <h2 className="text-2xl font-bold text-stone-100 light:text-stone-900 mb-2">
              {t('exercises.practiceComplete')}
            </h2>

            <p className="text-stone-400 light:text-stone-600 mb-8 max-w-sm">
              {t('exercises.wisdomTakingRoot')}
            </p>

            <Card variant="glow" padding="lg" className="w-full max-w-sm mb-6">
              <div className={`flex items-center justify-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-400">+15</p>
                  <p className="text-stone-500 light:text-stone-600 text-sm">XP earned</p>
                </div>
                <div className="w-px h-12 bg-stone-700 light:bg-stone-300" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-400">{totalCount}/{totalCount}</p>
                  <p className="text-stone-500 light:text-stone-600 text-sm">{t('exercises.exercisesCount')}</p>
                </div>
              </div>
            </Card>

            <Button
              onClick={onAllComplete}
              variant="primary"
              className="w-full max-w-sm"
              sound="celebrate"
              data-testid="daily-complete-celebration"
            >
              {t('exercises.completeTodaysPractice')}
            </Button>
          </motion.div>
        ) : (
          // Exercise list
          <div className="space-y-3">
            <p className={`text-stone-400 light:text-stone-600 text-sm mb-4 ${isRTL ? 'text-right' : ''}`}>
              {t('exercises.completeInAnyOrder')}
            </p>

            {exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                isCompleted={completedExercises.includes(exercise.id)}
                isLocked={false}
                onClick={() => setSelectedExercise(exercise)}
                isRTL={isRTL}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ExerciseExperience;
