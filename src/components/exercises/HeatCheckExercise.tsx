'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useHaptics } from '@/hooks/useHaptics';
import { useAudio } from '@/hooks/useAudio';
import type { HeatCheckContent } from '@/types/dailyPractice';
import { recordExercisePerformance } from '@/lib/adaptiveDifficulty';

// ═══════════════════════════════════════════════════════════════════════════
// HEAT CHECK EXERCISE
// Beautiful 2D grid for plotting items on an emotional spectrum
// ═══════════════════════════════════════════════════════════════════════════

interface HeatCheckExerciseProps {
  title: string;
  content: HeatCheckContent;
  onComplete: () => void;
  onBack: () => void;
  isRTL?: boolean;
  t: (key: string) => string;
}

interface PlacedItem {
  id: string;
  label: string;
  emoji: string;
  x: number; // 0-1
  y: number; // 0-1
}

const stylePresets = {
  analytical: { bg: 'from-blue-500/5 to-cyan-500/5', dot: 'bg-blue-400', glow: 'shadow-blue-500/30' },
  emotional: { bg: 'from-rose-500/5 to-pink-500/5', dot: 'bg-rose-400', glow: 'shadow-rose-500/30' },
  raw: { bg: 'from-amber-500/5 to-red-500/5', dot: 'bg-amber-400', glow: 'shadow-amber-500/30' },
};
const defaultStyle = stylePresets.analytical;

type QuadrantKey = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export function HeatCheckExercise({
  title,
  content,
  onComplete,
  onBack,
  isRTL = false,
  t,
}: HeatCheckExerciseProps) {
  const startTimeRef = useRef(Date.now());
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [markerPos, setMarkerPos] = useState({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const resultTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const haptics = useHaptics();
  const audio = useAudio();

  const colors = stylePresets[content.style] || defaultStyle;
  const currentItem = content.items[currentItemIndex];
  const allPlaced = currentItemIndex >= content.items.length;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, []);

  // Handle pointer events on grid
  const updateMarkerFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height)); // Invert Y
      setMarkerPos({ x, y });
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      updateMarkerFromPointer(e.clientX, e.clientY);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [updateMarkerFromPointer]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updateMarkerFromPointer(e.clientX, e.clientY);
    },
    [isDragging, updateMarkerFromPointer]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Place current item
  const handlePlace = useCallback(() => {
    if (!currentItem) return;

    const placed: PlacedItem = {
      ...currentItem,
      x: markerPos.x,
      y: markerPos.y,
    };

    setPlacedItems((prev) => [...prev, placed]);
    haptics.haptic('medium');
    audio.playTap();

    if (currentItemIndex + 1 >= content.items.length) {
      // All items placed
      resultTimerRef.current = setTimeout(() => {
        recordExercisePerformance({
          exerciseId: title,
          exerciseType: 'heat-check',
          completionTimeMs: Date.now() - startTimeRef.current,
          itemsCompleted: placedItems.length + 1,
          totalItems: content.items.length,
        });
        setShowResults(true);
        haptics.hapticSuccess();
        audio.playSuccess();
      }, 400);
    } else {
      setCurrentItemIndex((prev) => prev + 1);
      setMarkerPos({ x: 0.5, y: 0.5 }); // Reset marker
    }
  }, [currentItem, markerPos, currentItemIndex, content.items.length, haptics, audio, title, placedItems.length]);

  // Determine dominant quadrant
  const getDominantQuadrant = (): QuadrantKey => {
    const quadrants: Record<QuadrantKey, number> = { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 };
    for (const item of placedItems) {
      const isRight = item.x > 0.5;
      const isTop = item.y > 0.5;
      if (isTop && isRight) quadrants.topRight++;
      else if (isTop && !isRight) quadrants.topLeft++;
      else if (!isTop && isRight) quadrants.bottomRight++;
      else quadrants.bottomLeft++;
    }

    let max = 0;
    let dominant: QuadrantKey = 'topRight';
    for (const [key, count] of Object.entries(quadrants)) {
      if (count > max) {
        max = count;
        dominant = key as QuadrantKey;
      }
    }
    return dominant;
  };

  // Result screen
  if (showResults) {
    const dominant = getDominantQuadrant();
    const insight = content.quadrantInsights[dominant];

    return (
      <motion.div
        className="min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Mini grid with all dots */}
        <motion.div
          className="w-48 h-48 rounded-xl border border-stone-800 light:border-stone-200 relative mb-8 overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Quadrant tinting */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            <div className={`${dominant === 'topLeft' ? 'bg-amber-500/10' : ''}`} />
            <div className={`${dominant === 'topRight' ? 'bg-amber-500/10' : ''}`} />
            <div className={`${dominant === 'bottomLeft' ? 'bg-amber-500/10' : ''}`} />
            <div className={`${dominant === 'bottomRight' ? 'bg-amber-500/10' : ''}`} />
          </div>

          {/* Grid lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-700/50 light:bg-stone-300/50" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-stone-700/50 light:bg-stone-300/50" />

          {/* Placed dots */}
          {placedItems.map((item, i) => (
            <motion.div
              key={item.id}
              className={`absolute w-6 h-6 rounded-full ${colors.dot} flex items-center justify-center text-xs shadow-lg ${colors.glow}`}
              style={{
                left: `${item.x * 100}%`,
                bottom: `${item.y * 100}%`,
                transform: 'translate(-50%, 50%)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              title={item.label}
            >
              {item.emoji}
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-stone-300 light:text-stone-700 text-center max-w-sm mb-4 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {insight}
        </motion.p>

        <motion.p
          className="text-amber-400/80 text-center text-sm max-w-sm mb-10 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
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

  // Grid placement view
  return (
    <motion.div
      className="min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
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
        <p className="text-stone-400 light:text-stone-600 text-sm">
          {content.prompt}
        </p>
      </div>

      {/* Current item prompt */}
      {!allPlaced && currentItem && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            className="px-6 py-3 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <span className="text-3xl me-2">{currentItem.emoji}</span>
            <span className="text-lg font-medium text-stone-100 light:text-stone-900">
              {currentItem.label}
            </span>
            <p className="text-stone-500 light:text-stone-600 text-xs mt-1">
              {currentItemIndex + 1} / {content.items.length}
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Grid */}
      <div className="flex-1 px-6 pb-4 flex flex-col items-center justify-center">
        {/* Y-axis labels — placed ABOVE the grid container so they don't overflow the screen */}
        <div className="w-full max-w-sm flex justify-between mb-1 px-1">
          <span className="text-[10px] text-stone-500 light:text-stone-600 truncate max-w-[45%]">
            {content.yAxis.high} ↑
          </span>
          <span className="text-[10px] text-stone-500 light:text-stone-600 truncate max-w-[45%] text-right">
            {content.yAxis.low} ↓
          </span>
        </div>

        <div className="w-full max-w-sm aspect-square relative">

          {/* X-axis labels — placed inside the flow, no absolute overflow */}
          {/* (rendered below the grid via the sibling div) */}

          {/* The grid itself */}
          <div
            ref={gridRef}
            className={`w-full h-full rounded-xl border border-stone-800 light:border-stone-200 relative overflow-hidden cursor-crosshair bg-gradient-to-br ${colors.bg} touch-none`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Grid lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-700/30 light:bg-stone-300/30" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-stone-700/30 light:bg-stone-300/30" />

            {/* Subtle grid */}
            <div className="absolute left-1/4 top-0 bottom-0 w-px bg-stone-800/20 light:bg-stone-200/20" />
            <div className="absolute left-3/4 top-0 bottom-0 w-px bg-stone-800/20 light:bg-stone-200/20" />
            <div className="absolute top-1/4 left-0 right-0 h-px bg-stone-800/20 light:bg-stone-200/20" />
            <div className="absolute top-3/4 left-0 right-0 h-px bg-stone-800/20 light:bg-stone-200/20" />

            {/* Placed items as smaller dots */}
            {placedItems.map((item) => (
              <div
                key={item.id}
                className={`absolute w-6 h-6 rounded-full ${colors.dot} flex items-center justify-center text-xs opacity-70`}
                style={{
                  left: `${item.x * 100}%`,
                  bottom: `${item.y * 100}%`,
                  transform: 'translate(-50%, 50%)',
                }}
              >
                {item.emoji}
              </div>
            ))}

            {/* Active marker */}
            {!allPlaced && (
              <motion.div
                className={`absolute w-12 h-12 rounded-full border-2 border-amber-400 ${colors.dot} flex items-center justify-center text-lg shadow-lg shadow-amber-500/30`}
                style={{
                  left: `${markerPos.x * 100}%`,
                  bottom: `${markerPos.y * 100}%`,
                  transform: 'translate(-50%, 50%)',
                }}
                animate={{
                  boxShadow: isDragging
                    ? '0 0 20px rgba(251, 191, 36, 0.4)'
                    : '0 0 10px rgba(251, 191, 36, 0.2)',
                }}
              >
                {currentItem?.emoji}
              </motion.div>
            )}
          </div>
        </div>

        {/* X-axis labels — in-flow below the grid, safe from overflow */}
        <div className="w-full max-w-sm flex justify-between mt-2 px-1">
          <span className="text-[10px] text-stone-500 light:text-stone-600 truncate max-w-[45%]">
            ← {content.xAxis.low}
          </span>
          <span className={`text-[10px] text-stone-500 light:text-stone-600 truncate max-w-[45%] ${isRTL ? 'text-left' : 'text-right'}`}>
            {content.xAxis.high} →
          </span>
        </div>
      </div>

      {/* Place button */}
      {!allPlaced && (
        <div className="px-6 pb-20">
          <p className="text-stone-500 light:text-stone-600 text-xs text-center mb-3">
            {t('exercises.dragToPlace')}
          </p>
          <Button
            onClick={handlePlace}
            variant="primary"
            className="w-full"
            sound="tapConfirm"
          >
            {t('exercises.placeHere')}
          </Button>
        </div>
      )}
    </motion.div>
  );
}

export default HeatCheckExercise;
