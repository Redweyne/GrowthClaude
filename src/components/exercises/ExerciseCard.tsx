'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DailyExercise, ExerciseType } from '@/types/dailyPractice';

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE CARD
// Display an exercise in a list with completion status
// ═══════════════════════════════════════════════════════════════════════════

const exerciseIcons: Record<ExerciseType, string> = {
  scenario: '🎭',
  quote: '💎',
  application: '🌅',
  anchor: '🫁',
  reframe: '🔄',
};

const exerciseColors: Record<ExerciseType, string> = {
  scenario: 'from-blue-500/20 to-purple-500/20',
  quote: 'from-amber-500/20 to-orange-500/20',
  application: 'from-emerald-500/20 to-teal-500/20',
  anchor: 'from-violet-500/20 to-purple-500/20',
  reframe: 'from-rose-500/20 to-pink-500/20',
};

const exerciseLabelKeys: Record<ExerciseType, string> = {
  scenario: 'exercises.scenarioTitle',
  quote: 'exercises.quoteTitle',
  application: 'exercises.applicationTitle',
  anchor: 'exercises.anchorTitle',
  reframe: 'exercises.reframeTitle',
};

interface ExerciseCardProps {
  exercise: DailyExercise;
  index: number;
  isCompleted: boolean;
  isLocked: boolean;
  onClick: () => void;
  isRTL?: boolean;
  t?: (key: string) => string;
}

export function ExerciseCard({
  exercise,
  index,
  isCompleted,
  isLocked,
  onClick,
  isRTL = false,
  t = (key: string) => key,
}: ExerciseCardProps) {
  const icon = exerciseIcons[exercise.type];
  const colorGradient = exerciseColors[exercise.type];
  const labelKey = exerciseLabelKeys[exercise.type];
  const label = t(labelKey);

  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked}
      className={`w-full p-4 rounded-xl border transition-all ${isRTL ? 'text-right' : 'text-left'} ${
        isLocked
          ? 'bg-stone-900/30 border-stone-800/50 opacity-50 cursor-not-allowed'
          : isCompleted
          ? 'bg-stone-900/50 border-emerald-500/30 cursor-pointer'
          : 'bg-stone-900/50 border-stone-800 hover:border-amber-500/30 cursor-pointer'
      }`}
      whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Status indicator */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isCompleted
              ? 'bg-emerald-500/20'
              : isLocked
              ? 'bg-stone-800/50'
              : `bg-gradient-to-br ${colorGradient}`
          }`}
        >
          {isCompleted ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xl text-emerald-400"
            >
              ✓
            </motion.span>
          ) : isLocked ? (
            <span className="text-xl text-stone-600">🔒</span>
          ) : (
            <span className="text-xl">{icon}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <span className="text-stone-500 text-xs uppercase tracking-wider">
              {label}
            </span>
            {isCompleted && (
              <span className="text-emerald-500 text-xs">{t('common.complete')}</span>
            )}
          </div>
          <h3
            className={`font-medium truncate ${
              isLocked ? 'text-stone-600' : 'text-stone-100'
            }`}
          >
            {exercise.title}
          </h3>
        </div>

        {/* Arrow */}
        {!isLocked && !isCompleted && (
          <motion.div
            className="text-stone-500"
            animate={{ x: isRTL ? [0, -4, 0] : [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

export default ExerciseCard;
