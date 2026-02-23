'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import { ChevronLeft, ChevronRight, Crown, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useHaptics } from '@/hooks/useHaptics';
import { useAudio } from '@/hooks/useAudio';
import type { PriorityTowerContent } from '@/types/dailyPractice';
import { recordExercisePerformance } from '@/lib/adaptiveDifficulty';

// ═══════════════════════════════════════════════════════════════════════════
// PRIORITY TOWER EXERCISE
// Drag-and-drop value ranking with visual scaling and crown animation
// ═══════════════════════════════════════════════════════════════════════════

interface PriorityTowerExerciseProps {
  title: string;
  content: PriorityTowerContent;
  onComplete: () => void;
  onBack: () => void;
  isRTL?: boolean;
  t: (key: string) => string;
}

// Style presets
const stylePresets = {
  warm: {
    accent: 'amber',
    gradient: 'from-amber-500/20 to-orange-500/20',
    crownColor: 'text-amber-400',
    glowColor: 'shadow-amber-500/30',
    borderActive: 'border-amber-500/50',
  },
  stark: {
    accent: 'stone',
    gradient: 'from-stone-500/20 to-zinc-500/20',
    crownColor: 'text-stone-300',
    glowColor: 'shadow-stone-400/30',
    borderActive: 'border-stone-400/50',
  },
  cosmic: {
    accent: 'violet',
    gradient: 'from-violet-500/20 to-indigo-500/20',
    crownColor: 'text-violet-400',
    glowColor: 'shadow-violet-500/30',
    borderActive: 'border-violet-500/50',
  },
};
const defaultStyle = stylePresets.warm;

interface TowerItem {
  id: string;
  emoji: string;
  label: string;
}

export function PriorityTowerExercise({
  title,
  content,
  onComplete,
  onBack,
  isRTL = false,
  t,
}: PriorityTowerExerciseProps) {
  const startTimeRef = useRef(Date.now());
  const [items, setItems] = useState<TowerItem[]>([...content.items]);
  const [confirmed, setConfirmed] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const insightTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const haptics = useHaptics();
  const audio = useAudio();

  const colors = stylePresets[content.style] || defaultStyle;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (insightTimerRef.current) clearTimeout(insightTimerRef.current);
    };
  }, []);

  // Get scale factor based on position (top = biggest)
  const getScale = (index: number, total: number): number => {
    const maxScale = 1.0;
    const minScale = 0.82;
    const step = (maxScale - minScale) / Math.max(total - 1, 1);
    return maxScale - step * index;
  };

  // Handle reorder
  const handleReorder = useCallback(
    (newItems: TowerItem[]) => {
      setItems(newItems);
      haptics.hapticLight();
      audio.playTap();
    },
    [haptics, audio]
  );

  // Handle confirm
  const handleConfirm = useCallback(() => {
    setConfirmed(true);
    haptics.hapticSuccess();
    audio.playSuccess();
    recordExercisePerformance({
      exerciseId: title,
      exerciseType: 'priority-tower',
      completionTimeMs: Date.now() - startTimeRef.current,
      itemsCompleted: content.items.length,
      totalItems: content.items.length,
    });
    insightTimerRef.current = setTimeout(() => setShowInsight(true), 600);
  }, [haptics, audio, title, content.items.length]);

  // Get insight for top choice (with safety guard)
  const topItem = items[0] as TowerItem | undefined;
  const insight = topItem ? (content.insightsByTopChoice[topItem.id] || content.completionMessage) : content.completionMessage;

  // Result screen
  if (showInsight && topItem) {
    return (
      <motion.div
        className="min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Top choice highlight */}
        <motion.div
          className="text-6xl mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
        >
          {topItem.emoji}
        </motion.div>

        <motion.div
          className={`${colors.crownColor} mb-2`}
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.6, delay: 0.3 }}
        >
          <Crown size={28} />
        </motion.div>

        <motion.h2
          className="text-xl font-bold text-stone-100 light:text-stone-900 mb-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {t('exercises.yourTopChoice')} {topItem.label}
        </motion.h2>

        <motion.p
          className="text-stone-400 light:text-stone-600 text-center max-w-sm mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {insight}
        </motion.p>

        <motion.p
          className="text-amber-400/80 text-center text-sm max-w-sm mb-10 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {content.completionMessage}
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

  // Ranking view
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
      </div>

      {/* Tower */}
      <div className="flex-1 px-6 pb-4">
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          className="space-y-2"
        >
          {items.map((item, index) => {
            const scale = getScale(index, items.length);
            const isTop = index === 0;

            return (
              <Reorder.Item
                key={item.id}
                value={item}
                className="touch-none"
                whileDrag={{
                  scale: 1.05,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  zIndex: 50,
                }}
              >
                <motion.div
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                    isTop && confirmed
                      ? `bg-gradient-to-r ${colors.gradient} ${colors.borderActive} shadow-lg ${colors.glowColor}`
                      : 'bg-stone-900/50 light:bg-stone-200/50 border-stone-800 light:border-stone-200'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                  animate={{
                    scale: confirmed ? scale : 1,
                    opacity: confirmed ? 0.5 + scale * 0.5 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {/* Drag handle */}
                  <GripVertical
                    size={18}
                    className="text-stone-600 light:text-stone-400 flex-shrink-0"
                  />

                  {/* Crown for top */}
                  {isTop && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.6 }}
                      className={colors.crownColor}
                    >
                      <Crown size={18} />
                    </motion.div>
                  )}

                  {/* Rank number */}
                  <span className="text-stone-500 light:text-stone-600 text-sm font-mono w-5 text-center flex-shrink-0">
                    {index + 1}
                  </span>

                  {/* Emoji */}
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>

                  {/* Label */}
                  <span
                    className={`flex-1 font-medium ${
                      isTop
                        ? 'text-stone-100 light:text-stone-900'
                        : 'text-stone-300 light:text-stone-700'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>

      {/* Confirm button */}
      {!confirmed && (
        <div className="px-6 pb-8">
          <p className="text-stone-500 light:text-stone-600 text-xs text-center mb-3">
            {t('exercises.dragToReorder')}
          </p>
          <Button
            onClick={handleConfirm}
            variant="primary"
            className="w-full"
            sound="tapConfirm"
          >
            {t('exercises.lockInRanking')}
          </Button>
        </div>
      )}
    </motion.div>
  );
}

export default PriorityTowerExercise;
