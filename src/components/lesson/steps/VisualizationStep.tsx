'use client';

// ═══════════════════════════════════════════════════════════════════════════
// VISUALIZATION STEP - THE INNER JOURNEY
// ═══════════════════════════════════════════════════════════════════════════
//
// Close your eyes. See something new.
// This step guides users through imagination exercises -
// the cosmic zoom-out, confronting fears, cultivating gratitude.
//
// Instructions appear one at a time, with space to breathe.
// The visual atmosphere shifts to match the journey.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui';
import type { VisualizationStep as VisualizationStepType } from '@/types/lessons';

interface VisualizationStepProps {
  step: VisualizationStepType;
  onComplete: (response?: string) => void;
}

const STYLE_CONFIG = {
  cosmic: {
    glow: 'rgba(99, 102, 241, 0.15)',
    accent: 'text-indigo-400',
    gradient: 'from-indigo-500/20 via-purple-500/10 to-stone-900',
  },
  grounding: {
    glow: 'rgba(16, 185, 129, 0.15)',
    accent: 'text-emerald-400',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-stone-900',
  },
  fearless: {
    glow: 'rgba(244, 63, 94, 0.12)',
    accent: 'text-rose-400',
    gradient: 'from-rose-500/15 via-amber-500/10 to-stone-900',
  },
  grateful: {
    glow: 'rgba(251, 191, 36, 0.15)',
    accent: 'text-amber-400',
    gradient: 'from-amber-500/20 via-orange-500/10 to-stone-900',
  },
};

export function VisualizationStep({ step, onComplete }: VisualizationStepProps) {
  const [phase, setPhase] = useState<'entering' | 'visualizing' | 'complete'>('entering');
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [allInstructionsShown, setAllInstructionsShown] = useState(false);

  const style = step.style || 'cosmic';
  const config = STYLE_CONFIG[style];

  // Phase transitions
  useEffect(() => {
    const timer = setTimeout(() => setPhase('visualizing'), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Show instructions one by one
  useEffect(() => {
    if (phase !== 'visualizing') return;
    if (instructionIndex >= step.instructions.length) {
      setAllInstructionsShown(true);
      return;
    }

    const timer = setTimeout(() => {
      setInstructionIndex(prev => prev + 1);
    }, step.paceSeconds * 1000);

    return () => clearTimeout(timer);
  }, [phase, instructionIndex, step.instructions.length, step.paceSeconds]);

  const handleContinue = useCallback(() => {
    setPhase('complete');
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onComplete]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Dynamic atmospheric glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 30%, ${config.glow} 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 30% 70%, ${config.glow} 0%, transparent 40%),
            radial-gradient(ellipse 50% 30% at 70% 60%, ${config.glow} 0%, transparent 40%)
          `,
        }}
      />

      <div className="max-w-lg w-full relative z-10">
        <AnimatePresence mode="wait">
          {/* ─────────────────────────────────────────────────────────────────
              Entering Phase - Settle Into Stillness
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'entering' && (
            <motion.div
              key="entering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6"
            >
              {/* Breathing orb */}
              <motion.div className="relative w-32 h-32 mx-auto">
                {/* Outer glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Inner circle */}
                <motion.div
                  className={`
                    absolute inset-4 rounded-full
                    bg-gradient-to-br ${config.gradient}
                    border border-stone-700/50
                    flex items-center justify-center
                  `}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Eye size={32} className={config.accent} />
                </motion.div>
              </motion.div>

              {/* Title */}
              {step.title && (
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl text-stone-100 font-light"
                >
                  {step.title}
                </motion.h2>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-stone-500"
              >
                Close your eyes. Breathe deeply.
              </motion.p>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              Visualizing Phase - The Guided Journey
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'visualizing' && (
            <motion.div
              key="visualizing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Instructions revealed one by one */}
              <div className="min-h-[200px] flex flex-col justify-center space-y-8">
                {step.instructions.slice(0, instructionIndex).map((instruction, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: i === instructionIndex - 1 ? 1 : 0.4,
                      y: 0,
                    }}
                    transition={{ duration: 0.8 }}
                    className={`
                      text-xl sm:text-2xl leading-relaxed font-light text-center
                      ${i === instructionIndex - 1 ? 'text-stone-100' : 'text-stone-600'}
                    `}
                  >
                    {instruction}
                  </motion.p>
                ))}

                {/* Waiting indicator while more instructions coming */}
                {!allInstructionsShown && instructionIndex > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center gap-2"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className={`w-2 h-2 rounded-full ${config.accent.replace('text-', 'bg-')}/50`}
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Continue button - appears when all instructions shown */}
              <AnimatePresence>
                {allInstructionsShown && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="pt-8"
                  >
                    <Button
                      size="lg"
                      onClick={handleContinue}
                      glow
                      className="w-full group"
                    >
                      {step.followUpPrompt ? 'Continue to reflect' : 'I have seen'}
                      <ChevronRight
                        size={18}
                        className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                      />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              Complete Phase
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-stone-800 to-stone-900 border border-stone-700 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <span className="text-2xl">🌟</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default VisualizationStep;
