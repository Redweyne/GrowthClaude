'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useHaptics } from '@/hooks/useHaptics';
import { useAudio } from '@/hooks/useAudio';
import type { WordForgeContent } from '@/types/dailyPractice';
import { recordExercisePerformance } from '@/lib/adaptiveDifficulty';

// ═══════════════════════════════════════════════════════════════════════════
// WORD FORGE EXERCISE
// Tap words to compose a personal mantra, then "forge" it
// ═══════════════════════════════════════════════════════════════════════════

interface WordForgeExerciseProps {
  title: string;
  content: WordForgeContent;
  onComplete: () => void;
  onBack: () => void;
  isRTL?: boolean;
  t: (key: string) => string;
}

// Category glow colors
const categoryColors: Record<string, { border: string; bg: string; glow: string }> = {
  action: { border: 'border-amber-500/60', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/30' },
  identity: { border: 'border-purple-500/60', bg: 'bg-purple-500/10', glow: 'shadow-purple-500/30' },
  emotion: { border: 'border-rose-500/60', bg: 'bg-rose-500/10', glow: 'shadow-rose-500/30' },
  value: { border: 'border-emerald-500/60', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/30' },
};

const stylePresets = {
  fiery: { forgeGlow: 'from-orange-500/30 to-red-500/30', text: 'text-orange-300' },
  serene: { forgeGlow: 'from-sky-500/30 to-indigo-500/30', text: 'text-sky-300' },
  electric: { forgeGlow: 'from-yellow-500/30 to-lime-500/30', text: 'text-yellow-300' },
};
const defaultStyle = stylePresets.fiery;

export function WordForgeExercise({
  title,
  content,
  onComplete,
  onBack,
  isRTL = false,
  t,
}: WordForgeExerciseProps) {
  const startTimeRef = useRef(Date.now());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isForged, setIsForged] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const forgeTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const haptics = useHaptics();
  const audio = useAudio();

  const colors = stylePresets[content.style] || defaultStyle;
  const canForge = selectedIds.length >= content.minSelections;
  const atMax = selectedIds.length >= content.maxSelections;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (forgeTimerRef.current) clearTimeout(forgeTimerRef.current);
    };
  }, []);

  // Toggle word selection
  const handleWordTap = useCallback(
    (wordId: string) => {
      setSelectedIds((prev) => {
        if (prev.includes(wordId)) {
          // Deselect
          haptics.hapticTap();
          return prev.filter((id) => id !== wordId);
        } else if (prev.length < content.maxSelections) {
          // Select
          haptics.haptic('medium');
          audio.playTap();
          return [...prev, wordId];
        }
        return prev;
      });
    },
    [content.maxSelections, haptics, audio]
  );

  // Remove word from selection
  const handleRemoveWord = useCallback(
    (wordId: string) => {
      setSelectedIds((prev) => prev.filter((id) => id !== wordId));
      haptics.hapticTap();
    },
    [haptics]
  );

  // Forge the mantra
  const handleForge = useCallback(() => {
    recordExercisePerformance({
      exerciseId: title,
      exerciseType: 'word-forge',
      completionTimeMs: Date.now() - startTimeRef.current,
      itemsCompleted: selectedIds.length,
      totalItems: content.words.length,
    });
    setIsForged(true);
    haptics.hapticCelebration();
    audio.playSuccess();

    forgeTimerRef.current = setTimeout(() => setShowResult(true), 1200);
  }, [haptics, audio, title, selectedIds.length, content.words.length]);

  // Get selected words in order
  const selectedWords = selectedIds
    .map((id) => content.words.find((w) => w.id === id))
    .filter(Boolean) as typeof content.words;

  const forgedStatement = selectedWords.map((w) => w.text).join(' ');

  // Result screen
  if (showResult) {
    return (
      <motion.div
        className="min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Forged mantra */}
        <motion.div
          className={`w-full max-w-sm rounded-2xl border border-amber-500/30 bg-gradient-to-br ${colors.forgeGlow} p-8 mb-6`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.3 }}
        >
          <motion.div
            className="text-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
          >
            <Flame className="w-8 h-8 text-amber-400 mx-auto" />
          </motion.div>

          <motion.p
            className="text-xl font-semibold text-stone-100 light:text-stone-900 text-center leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            &ldquo;{forgedStatement}&rdquo;
          </motion.p>
        </motion.div>

        <motion.p
          className="text-stone-400 light:text-stone-600 text-center text-sm max-w-sm mb-10 italic leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {content.forgeMessage}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
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

  // Forge animation
  if (isForged && !showResult) {
    return (
      <motion.div className="min-h-screen bg-stone-950 light:bg-stone-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <Flame className="w-16 h-16 text-amber-400 mx-auto" />
          </motion.div>

          <motion.p
            className={`text-lg font-medium mt-4 ${colors.text}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.5] }}
            transition={{ duration: 1.2 }}
          >
            {t('exercises.forging')}
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  // Word selection view
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
        <p className="text-stone-400 light:text-stone-600 text-sm leading-relaxed">
          {content.prompt}
        </p>
        <p className="text-stone-500 light:text-stone-600 text-xs mt-1">
          {selectedIds.length}/{content.maxSelections} {t('exercises.selected')}
          {!canForge && ` (${t('exercises.minRequired').replace('{min}', String(content.minSelections))})`}
        </p>
      </div>

      {/* Word cloud */}
      <div className="flex-1 px-6 pb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {content.words.map((word, index) => {
            const isSelected = selectedIds.includes(word.id);
            const catColor = categoryColors[word.category] || categoryColors.action;

            return (
              <motion.button
                key={word.id}
                onClick={() => handleWordTap(word.id)}
                disabled={atMax && !isSelected}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  isSelected
                    ? `${catColor.bg} ${catColor.border} shadow-lg ${catColor.glow}`
                    : atMax
                    ? 'bg-stone-900/30 light:bg-stone-200/30 border-stone-800/50 light:border-stone-300/50 opacity-40'
                    : 'bg-stone-900/50 light:bg-stone-200/50 border-stone-800 light:border-stone-200 hover:border-stone-600 light:hover:border-stone-400'
                } ${isSelected ? 'text-stone-100 light:text-stone-900' : 'text-stone-300 light:text-stone-700'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: isSelected ? 1.05 : 1,
                  y: isSelected ? 0 : [0, -3, 0],
                }}
                transition={
                  isSelected
                    ? { type: 'spring', stiffness: 400, damping: 20 }
                    : {
                        y: {
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.3,
                          ease: 'easeInOut',
                        },
                        opacity: { delay: index * 0.05 },
                        scale: { delay: index * 0.05 },
                      }
                }
                whileTap={{ scale: 0.95 }}
              >
                {word.text}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Forge zone - selected words */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            className="px-6 pb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className={`rounded-xl border border-stone-800/50 light:border-stone-200/50 bg-gradient-to-r ${colors.forgeGlow} p-4`}>
              <p className="text-stone-500 light:text-stone-600 text-xs uppercase tracking-wider mb-2 text-center">
                {t('exercises.yourMantra')}
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center items-center min-h-[36px]">
                <AnimatePresence>
                  {selectedWords.map((word) => {
                    const catColor = categoryColors[word.category] || categoryColors.action;
                    return (
                      <motion.span
                        key={word.id}
                        layoutId={`forge-${word.id}`}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium text-stone-100 light:text-stone-900 ${catColor.bg} ${catColor.border} border`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        {word.text}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveWord(word.id);
                          }}
                          className="text-stone-400 hover:text-stone-200 ms-0.5"
                          aria-label={`${t('common.delete')} ${word.text}`}
                        >
                          <X size={12} />
                        </button>
                      </motion.span>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forge button */}
      <div className="px-6 pb-20 pt-2">
        <Button
          onClick={handleForge}
          variant="primary"
          className="w-full"
          disabled={!canForge}
          sound="tapConfirm"
        >
          <Flame className="w-4 h-4 me-2 inline" />
          {canForge
            ? t('exercises.forgeMantra')
            : t('exercises.selectMore').replace('{count}', String(content.minSelections - selectedIds.length))}
        </Button>
      </div>
    </motion.div>
  );
}

export default WordForgeExercise;
