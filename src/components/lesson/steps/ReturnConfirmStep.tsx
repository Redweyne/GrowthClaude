'use client';

// ═══════════════════════════════════════════════════════════════════════════
// RETURN CONFIRM STEP - THE HOMECOMING
// ═══════════════════════════════════════════════════════════════════════════
//
// The user returns from their real-world action.
// This moment requires truth - did they do what they said?
//
// We don't judge. We honor honesty above all.
// If they didn't do it, that's valuable self-knowledge.
// If they did, we celebrate the integration of wisdom into life.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReturnConfirmStep as ReturnConfirmStepType } from '@/types/lessons';

interface ReturnConfirmStepProps {
  step: ReturnConfirmStepType;
  commitment?: string;
  onComplete: (completed: boolean) => void;
}

export function ReturnConfirmStep({ step, commitment, onComplete }: ReturnConfirmStepProps) {
  const [phase, setPhase] = useState<'welcome' | 'question' | 'response'>('welcome');
  const [selectedOption, setSelectedOption] = useState<'completed' | 'notCompleted' | null>(null);

  // Phase transitions
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase('question'), 2500));
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const handleSelect = (option: 'completed' | 'notCompleted') => {
    setSelectedOption(option);
    setPhase('response');

    // Give time to read response before moving on
    setTimeout(() => {
      onComplete(option === 'completed');
    }, option === 'completed' ? 1500 : 3000);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Warm atmospheric glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 40%, rgba(251, 191, 36, 0.12) 0%, transparent 60%)`,
        }}
      />

      <div className="max-w-lg w-full relative z-10">
        <AnimatePresence mode="wait">
          {/* ─────────────────────────────────────────────────────────────────
              Welcome Phase
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6"
            >
              {/* Welcome icon - emoji with fixed dimensions for iOS */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center overflow-hidden"
              >
                <span className="text-4xl leading-none flex items-center justify-center w-full h-full" style={{ fontSize: '2.5rem' }}>🙏</span>
              </motion.div>

              {/* Welcome message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl text-stone-100 light:text-stone-900 font-light"
              >
                {step.welcomeMessage}
              </motion.p>

              {/* Reminder of commitment */}
              {commitment && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-stone-900/50 light:bg-stone-200/50 border border-stone-700/50 rounded-xl p-4"
                >
                  <p className="text-xs text-amber-400/70 tracking-[0.15em] uppercase mb-2">
                    You committed to
                  </p>
                  <p className="text-stone-300 light:text-stone-700 italic">&ldquo;{commitment}&rdquo;</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              Question Phase
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8"
            >
              {/* The question */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl text-stone-100 light:text-stone-900 font-light leading-relaxed"
              >
                {step.confirmationQuestion}
              </motion.p>

              {/* Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {/* Completed option */}
<motion.button
                  onClick={() => handleSelect('completed')}
                  data-testid="return-completed-btn"
                  className="
                    w-full p-5 rounded-2xl text-left transition-all duration-300
                    border-2 bg-stone-900/50 light:bg-stone-200/50 border-stone-700/50
                    hover:bg-emerald-500/10 hover:border-emerald-500/30
                    group
                  "
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg font-medium text-stone-100 light:text-stone-900 group-hover:text-emerald-300 transition-colors">
                    {step.completedOption.label}
                  </span>
                </motion.button>

                {/* Did not complete option */}
<motion.button
                  onClick={() => handleSelect('notCompleted')}
                  data-testid="return-not-completed-btn"
                  className="
                    w-full p-5 rounded-2xl text-left transition-all duration-300
                    border-2 bg-stone-900/50 light:bg-stone-200/50 border-stone-700/50
                    hover:bg-amber-500/10 hover:border-amber-500/30
                    group
                  "
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg font-medium text-stone-100 light:text-stone-900 group-hover:text-amber-300 transition-colors">
                    {step.didNotCompleteOption.label}
                  </span>
                </motion.button>
              </motion.div>

              {/* Note about honesty */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-stone-600 light:text-stone-500 text-sm"
              >
                There is no wrong answer. Only honest ones.
              </motion.p>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              Response Phase
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'response' && (
            <motion.div
              key="response"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              {selectedOption === 'completed' ? (
                <>
                  {/* Success indicator */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center overflow-hidden"
                  >
                    <span className="text-4xl leading-none flex items-center justify-center w-full h-full" style={{ fontSize: '2.5rem' }}>✨</span>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-emerald-300 font-light"
                  >
                    Well done. Wisdom becomes power only through action.
                  </motion.p>
                </>
              ) : (
                <>
                  {/* Honesty acknowledgment */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center overflow-hidden"
                  >
                    <span className="text-4xl leading-none flex items-center justify-center w-full h-full" style={{ fontSize: '2.5rem' }}>🙏</span>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-amber-300 font-light leading-relaxed"
                  >
                    {step.didNotCompleteOption.message}
                  </motion.p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ReturnConfirmStep;
