'use client';

// ═══════════════════════════════════════════════════════════════════════════
// LESSON MODE SELECTOR - CHOOSE YOUR PATH
// ═══════════════════════════════════════════════════════════════════════════
//
// Shown before every lesson (including redo). User picks between:
// - "Reflect & Write" (deep mode) — the original writing-heavy experience
// - "Feel & Choose" (engagement mode) — interactive, no typing, no long waits
//
// Both paths are respected equally. Neither is "lesser."
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pen, Zap } from 'lucide-react';
import { AmbientBackground } from '@/components/ambient';
import { useAudio } from '@/hooks/useAudio';
import type { LessonMode, FlexibleLesson } from '@/types/lessons';

interface LessonModeSelectorProps {
  lesson: FlexibleLesson;
  onSelect: (mode: LessonMode) => void;
}

export function LessonModeSelector({ lesson, onSelect }: LessonModeSelectorProps) {
  const [selected, setSelected] = useState<LessonMode | null>(null);
  const { playTapConfirm, playSuccess } = useAudio();

  // Check if engagement path is available for this lesson
  const hasEngagementPath = !!(lesson.engagementSteps && lesson.engagementSteps.length > 0);

  const handleSelect = useCallback((mode: LessonMode) => {
    if (selected) return;
    setSelected(mode);
    playTapConfirm();

    setTimeout(() => {
      playSuccess();
      onSelect(mode);
    }, 400);
  }, [selected, playTapConfirm, playSuccess, onSelect]);

  return (
    <div className="min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col relative overflow-hidden">
      <AmbientBackground intensity="subtle" particleCount={3} orbCount={1} />

      {/* Atmospheric glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(168, 85, 247, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          className="max-w-md w-full space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.p
              className="text-sm text-purple-400/80 tracking-[0.2em] uppercase font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {lesson.title}
            </motion.p>
            <motion.h1
              className="text-2xl sm:text-3xl text-stone-100 light:text-stone-900 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              How do you want to experience this?
            </motion.h1>
          </div>

          {/* Mode cards */}
          <div className="space-y-4">
            {/* Deep / Reflect & Write */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              onClick={() => handleSelect('deep')}
              disabled={selected !== null}
              className={`
                w-full p-6 rounded-2xl text-left
                border-2 transition-all duration-300 relative overflow-hidden
                active:scale-[0.98]
                ${selected === 'deep'
                  ? 'bg-amber-500/15 border-amber-500/50 scale-[1.02]'
                  : selected !== null
                  ? 'bg-stone-900/30 border-stone-800/30 opacity-40'
                  : 'bg-stone-900/60 light:bg-stone-200/60 border-stone-700/40 hover:border-amber-500/30 hover:bg-stone-900/80 light:hover:bg-stone-200/80'
                }
              `}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {selected === 'deep' && (
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 70%)' }}
                />
              )}
              <div className="relative z-10 flex items-start gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                  ${selected === 'deep' ? 'bg-amber-500/20' : 'bg-stone-800/80'}
                  transition-colors duration-300
                `}>
                  <Pen size={22} className={`${selected === 'deep' ? 'text-amber-400' : 'text-amber-400/70'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    text-lg font-semibold mb-1 transition-colors
                    ${selected === 'deep' ? 'text-amber-300' : 'text-stone-100 light:text-stone-900'}
                  `}>
                    Reflect & Write
                  </h3>
                  <p className="text-sm text-stone-400 light:text-stone-600 leading-relaxed">
                    Go deeper through writing. More personal, more powerful.
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-stone-500 light:text-stone-600">
                    <span>~{lesson.estimatedMinutes || 5} min</span>
                    <span className="w-1 h-1 rounded-full bg-stone-700" />
                    <span>Writing & reflection</span>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Engagement / Feel & Choose */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              onClick={() => hasEngagementPath ? handleSelect('engagement') : undefined}
              disabled={selected !== null || !hasEngagementPath}
              className={`
                w-full p-6 rounded-2xl text-left
                border-2 transition-all duration-300 relative overflow-hidden
                active:scale-[0.98]
                ${!hasEngagementPath
                  ? 'bg-stone-900/30 border-stone-800/20 opacity-40 cursor-not-allowed'
                  : selected === 'engagement'
                  ? 'bg-purple-500/15 border-purple-500/50 scale-[1.02]'
                  : selected !== null
                  ? 'bg-stone-900/30 border-stone-800/30 opacity-40'
                  : 'bg-stone-900/60 light:bg-stone-200/60 border-stone-700/40 hover:border-purple-500/30 hover:bg-stone-900/80 light:hover:bg-stone-200/80'
                }
              `}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {selected === 'engagement' && (
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 70%)' }}
                />
              )}
              <div className="relative z-10 flex items-start gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                  ${selected === 'engagement' ? 'bg-purple-500/20' : 'bg-stone-800/80'}
                  transition-colors duration-300
                `}>
                  <Zap size={22} className={`${selected === 'engagement' ? 'text-purple-400' : 'text-purple-400/70'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    text-lg font-semibold mb-1 transition-colors
                    ${selected === 'engagement' ? 'text-purple-300' : 'text-stone-100 light:text-stone-900'}
                  `}>
                    Feel & Choose
                  </h3>
                  <p className="text-sm text-stone-400 light:text-stone-600 leading-relaxed">
                    Stay engaged without writing. Interactive, quick, no typing.
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-stone-500 light:text-stone-600">
                    <span>~{Math.max(2, Math.ceil((lesson.estimatedMinutes || 5) * 0.5))} min</span>
                    <span className="w-1 h-1 rounded-full bg-stone-700" />
                    <span>Tap & choose</span>
                  </div>
                </div>
              </div>
            </motion.button>
          </div>

          {/* Selection indicator */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center pt-2"
            >
              <div className={`
                w-10 h-10 mx-auto rounded-full flex items-center justify-center
                ${selected === 'deep' ? 'bg-amber-500/20' : 'bg-purple-500/20'}
              `}>
                <span className={`text-xl ${selected === 'deep' ? 'text-amber-400' : 'text-purple-400'}`}>
                  ✓
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default LessonModeSelector;
