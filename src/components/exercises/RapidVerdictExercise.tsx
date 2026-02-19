'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useHaptics } from '@/hooks/useHaptics';
import { useAudio } from '@/hooks/useAudio';
import type { RapidVerdictContent } from '@/types/dailyPractice';
import { adaptTimer, recordExercisePerformance } from '@/lib/adaptiveDifficulty';

interface RapidVerdictExerciseProps {
  title: string;
  content: RapidVerdictContent;
  onComplete: () => void;
  onBack: () => void;
  isRTL?: boolean;
  t: (key: string) => string;
}

// Style defaults
const styleColors = {
  bold: { accent: 'amber', bg: 'from-amber-500/10 to-orange-500/10' },
  introspective: { accent: 'indigo', bg: 'from-indigo-500/10 to-purple-500/10' },
  playful: { accent: 'emerald', bg: 'from-emerald-500/10 to-teal-500/10' },
};
const defaultColors = styleColors.bold;

export function RapidVerdictExercise({
  title,
  content,
  onComplete,
  onBack,
  isRTL = false,
  t,
}: RapidVerdictExerciseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tags, setTags] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(content.timePerCard || 4);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const startTimeRef = useRef(Date.now());
  const haptics = useHaptics();
  const audio = useAudio();

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const agreeOpacity = useTransform(x, [0, 100], [0, 1]);
  const disagreeOpacity = useTransform(x, [-100, 0], [1, 0]);

  // Reset motion value when card changes
  useEffect(() => {
    x.set(0);
  }, [currentIndex, x]);

  const statements = content.statements || [];
  const currentStatement = statements[currentIndex];
  const isLastCard = currentIndex >= statements.length - 1;
  const baseTimePerCard = content.timePerCard || 4;
  const timePerCard = adaptTimer(baseTimePerCard, 'rapid-verdict');

  const colors = styleColors[content.style] || defaultColors;

  // Guard: no statements
  if (statements.length === 0) {
    return (
      <div className="min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col items-center justify-center px-6">
        <p className="text-stone-400 light:text-stone-600 mb-6">{t('exercises.somethingWentWrong')}</p>
        <Button onClick={onBack} variant="primary" className="w-full max-w-sm">
          {t('exercises.back')}
        </Button>
      </div>
    );
  }

  // Process a swipe (agree or disagree)
  const processSwipe = useCallback(
    (direction: 'agree' | 'disagree') => {
      if (!currentStatement) return;

      const tag =
        direction === 'agree'
          ? currentStatement.agreeTag
          : currentStatement.disagreeTag;

      setTags((prev) => ({ ...prev, [tag]: (prev[tag] || 0) + 1 }));
      haptics.haptic(direction === 'agree' ? 'light' : 'tap');
      audio.playUI(direction === 'agree' ? 'swipeRight' : 'swipeLeft');

      if (isLastCard) {
        // Compute results before recording performance
        const results = { ...tags, [tag]: (tags[tag] || 0) + 1 };
        recordExercisePerformance({
          exerciseId: title,
          exerciseType: 'rapid-verdict',
          completionTimeMs: Date.now() - startTimeRef.current,
          itemsCompleted: Object.values(results).reduce((a, b) => a + b, 0),
          totalItems: content.statements.length,
        });
        setShowResult(true);
        haptics.hapticSuccess();
        audio.playSuccess();
      } else {
        setCurrentIndex((prev) => prev + 1);
        setTimeRemaining(timePerCard);
      }
    },
    [currentStatement, isLastCard, timePerCard, haptics, audio, title, tags, content.statements.length]
  );

  // Timer countdown
  useEffect(() => {
    if (showResult || isDragging) return;

    setTimeRemaining(timePerCard);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          processSwipe('disagree');
          return timePerCard;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, showResult, isDragging, timePerCard, processSwipe]);

  // Handle drag end
  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    setIsDragging(false);
    const threshold = 80;
    const velocityThreshold = 300;

    if (
      info.offset.x > threshold ||
      info.velocity.x > velocityThreshold
    ) {
      processSwipe('agree');
    } else if (
      info.offset.x < -threshold ||
      info.velocity.x < -velocityThreshold
    ) {
      processSwipe('disagree');
    }
  };

  // Calculate result profile
  const getResultProfile = () => {
    for (const profile of content.resultProfiles) {
      const match = profile.tagPattern.match(/(\w+)>=(\d+)/);
      if (match) {
        const [, tag, threshold] = match;
        if ((tags[tag] || 0) >= parseInt(threshold)) {
          return profile;
        }
      }
    }
    return content.resultProfiles[content.resultProfiles.length - 1];
  };

  // Result screen
  if (showResult) {
    const profile = getResultProfile();
    return (
      <motion.div
        className="min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-7xl mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
        >
          {profile.emoji}
        </motion.div>

        <motion.h2
          className="text-2xl font-bold text-stone-100 light:text-stone-900 mb-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {profile.title}
        </motion.h2>

        <motion.p
          className="text-stone-400 light:text-stone-600 text-center max-w-sm mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {profile.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-sm"
        >
          <Button
            onClick={onComplete}
            variant="primary"
            className="w-full"
            sound="celebrate"
          >
            {t('exercises.continue')}
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Card swiping view
  return (
    <motion.div
      className="min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 text-stone-500 light:text-stone-600 hover:text-stone-300 light:hover:text-stone-900 transition-colors text-sm mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
          aria-label={t('exercises.back')}
        >
          {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {t('exercises.back')}
        </button>

        <h1 className="text-xl font-semibold text-stone-100 light:text-stone-900 mb-1">
          {title}
        </h1>

        {/* Card counter */}
        <p className="text-stone-500 light:text-stone-600 text-sm">
          {currentIndex + 1} / {statements.length}
        </p>
      </div>

      {/* Timer bar */}
      <div className="px-6 mb-6">
        <div className="h-1.5 bg-stone-800 light:bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${timePerCard > 0 ? (timeRemaining / timePerCard) * 100 : 0}%`,
              backgroundColor:
                timePerCard > 0 && timeRemaining / timePerCard > 0.5
                  ? '#f59e0b'
                  : timePerCard > 0 && timeRemaining / timePerCard > 0.25
                  ? '#f97316'
                  : '#ef4444',
            }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        {/* Agree indicator */}
        <motion.div
          className={`absolute ${isRTL ? 'left-8' : 'right-8'} top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-xl pointer-events-none`}
          style={{ opacity: agreeOpacity }}
        >
          {t('exercises.agree')}
        </motion.div>

        {/* Disagree indicator */}
        <motion.div
          className={`absolute ${isRTL ? 'right-8' : 'left-8'} top-1/2 -translate-y-1/2 text-rose-500 font-bold text-xl pointer-events-none`}
          style={{ opacity: disagreeOpacity }}
        >
          {t('exercises.disagree')}
        </motion.div>

        <AnimatePresence mode="wait">
          {currentStatement && (
            <motion.div
              key={currentIndex}
              className={`w-full max-w-sm bg-gradient-to-br ${colors.bg} border border-stone-800 light:border-stone-200 rounded-2xl p-8 cursor-grab active:cursor-grabbing touch-none`}
              style={{ x, rotate }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              whileTap={{ scale: 1.02 }}
            >
              <p className="text-lg font-medium text-stone-100 light:text-stone-900 text-center leading-relaxed">
                &ldquo;{currentStatement.text}&rdquo;
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe hint */}
      <div className="px-6 pb-8 text-center">
        <p className="text-stone-600 light:text-stone-500 text-xs">
          {t('exercises.swipeHint')}
        </p>
      </div>
    </motion.div>
  );
}

export default RapidVerdictExercise;
