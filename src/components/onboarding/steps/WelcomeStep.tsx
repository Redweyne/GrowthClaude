'use client';

// ============================================================================
// WELCOME STEP - THE THRESHOLD
// This is not an app intro. This is the moment before everything changes.
// We acknowledge their struggle. We offer a path. We invite them in.
// ============================================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const [phase, setPhase] = useState<'opening' | 'question' | 'invitation'>('opening');

  // Progress through phases
  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('question'), 2500);
    const timer2 = setTimeout(() => setPhase('invitation'), 6000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <AnimatePresence mode="wait">
        {/* Phase 1: Opening - Create presence */}
        {phase === 'opening' && (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl text-zinc-300 font-light"
            >
              Take a breath.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-zinc-500"
            >
              You're here for a reason.
            </motion.p>
          </motion.div>
        )}

        {/* Phase 2: The Question - Create emotional entry */}
        {phase === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl sm:text-2xl text-zinc-300 font-light leading-relaxed max-w-md"
            >
              Something in your life isn't working the way you want it to.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-zinc-500 text-lg"
            >
              That's why you're here.
            </motion.p>
          </motion.div>
        )}

        {/* Phase 3: The Invitation - Offer the path */}
        {phase === 'invitation' && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 max-w-md"
          >
            {/* The promise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="text-2xl sm:text-3xl text-white font-light leading-relaxed mb-4">
                What if 5 minutes a day could change who you are?
              </p>
              <p className="text-zinc-400">
                Ancient wisdom. Modern practice. Real transformation.
              </p>
            </motion.div>

            {/* The method - subtle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="py-6 border-t border-b border-zinc-800/50"
            >
              <div className="flex justify-center gap-8 text-sm text-zinc-500">
                <div className="text-center">
                  <p className="text-2xl mb-1">📖</p>
                  <p>Learn</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">🎯</p>
                  <p>Practice</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">✨</p>
                  <p>Transform</p>
                </div>
              </div>
            </motion.div>

            {/* The CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <motion.button
                onClick={onNext}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-lg hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                I'm ready to begin
              </motion.button>
              <p className="mt-4 text-xs text-zinc-600">
                No account needed. Takes 2 minutes.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WelcomeStep;
