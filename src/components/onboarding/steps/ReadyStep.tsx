'use client';

// ============================================================================
// READY STEP - THE BEGINNING
// This is not a summary screen. This is the threshold crossing.
// The moment before everything changes. The first step into a new life.
// ============================================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TRANSFORMATION_GOALS } from '@/types';

interface ReadyStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ReadyStep({ onNext, onBack }: ReadyStepProps) {
  const { name, transformationGoal, dailyCommitmentMinutes, whyStatement } = useStore();
  const [phase, setPhase] = useState<'summary' | 'mentor' | 'ready'>('summary');

  const selectedGoal = TRANSFORMATION_GOALS.find(g => g.id === transformationGoal);

  // Progress through phases
  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('mentor'), 3000);
    const timer2 = setTimeout(() => setPhase('ready'), 6500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Back button - only in summary phase */}
      {phase === 'summary' && (
        <button
          onClick={onBack}
          className="flex items-center text-zinc-500 hover:text-zinc-300 transition-colors mb-6 self-start"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Back</span>
        </button>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Phase 1: Summary - What they've committed to */}
          {phase === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center w-full max-w-md"
            >
              {/* Their commitment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="text-5xl mb-4">{selectedGoal?.icon}</div>
                <p className="text-2xl text-white font-light mb-2">
                  {name}, you've chosen to
                </p>
                <p className="text-xl text-indigo-400">
                  {selectedGoal?.title}
                </p>
              </motion.div>

              {/* The commitment summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="py-4 px-6 rounded-xl bg-zinc-900/50 border border-zinc-800"
              >
                <p className="text-zinc-400 text-sm">
                  <span className="text-white">{dailyCommitmentMinutes} minutes</span> daily •{' '}
                  <span className="text-white">Stoic wisdom</span> • {' '}
                  <span className="text-white">Starting now</span>
                </p>
              </motion.div>

              {/* Loading indicator */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mt-8 rounded-full"
              />
            </motion.div>
          )}

          {/* Phase 2: Meet the Mentor */}
          {phase === 'mentor' && (
            <motion.div
              key="mentor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center w-full max-w-md"
            >
              {/* Sage avatar */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center"
              >
                <span className="text-4xl">🧙</span>
              </motion.div>

              {/* Mentor introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-xl text-white font-light mb-4">
                  You won't walk this path alone.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  A mentor will guide you—responding to your reflections with wisdom tailored to your journey.
                </p>
              </motion.div>

              {/* Loading indicator */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3.5, ease: 'linear' }}
                className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mt-8 rounded-full"
              />
            </motion.div>
          )}

          {/* Phase 3: Ready */}
          {phase === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center w-full max-w-md"
            >
              {/* The moment */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-6xl mb-6"
              >
                ✨
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-2xl sm:text-3xl text-white font-light mb-4">
                  {name}, you're ready.
                </p>
                <p className="text-zinc-400 mb-8">
                  Your first lesson awaits.
                </p>
              </motion.div>

              {/* The button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={onNext}
                  className="w-full py-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-lg hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Begin My Journey
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-xs text-zinc-600 mt-4"
                >
                  The person you become is shaped by what you do every day.
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ReadyStep;
