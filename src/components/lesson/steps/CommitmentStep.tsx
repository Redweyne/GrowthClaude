'use client';

// ═══════════════════════════════════════════════════════════════════════════
// COMMITMENT STEP - COMPLETELY REWRITTEN FOR iOS SAFARI STABILITY
// ═══════════════════════════════════════════════════════════════════════════
//
// This version prioritizes stability over features:
// - NO audio hooks - audio was causing iOS Safari crashes
// - Minimal useEffects
// - Simple state management
// - No complex cleanup chains
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Target } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/i18n';
import type { CommitmentStep as CommitmentStepType } from '@/types/lessons';

interface CommitmentStepProps {
  step: CommitmentStepType;
  onComplete: (commitment: string) => void;
  onKeystroke?: () => void;
}

const DEFAULT_GUIDANCE = [
  "Be specific - what exactly will you do?",
  "Make it actionable - can you start in the next minute?",
  "Keep it simple - one clear action is enough.",
];

export function CommitmentStep({ step, onComplete, onKeystroke }: CommitmentStepProps) {
  const { t } = useTranslation();
  const [commitment, setCommitment] = useState('');
  const [phase, setPhase] = useState<'entering' | 'writing' | 'confirming'>('entering');
  const [isFocused, setIsFocused] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Refs for timers
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMountedRef = useRef(false);

  const minimumWords = step.minimumWords || 3;
  const wordCount = commitment.trim().split(/\s+/).filter(Boolean).length;
  const isReady = wordCount >= minimumWords;
  const hints = step.guidanceHints || DEFAULT_GUIDANCE;

  // Cleanup function
  const cleanup = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (hintIntervalRef.current) {
      clearInterval(hintIntervalRef.current);
      hintIntervalRef.current = null;
    }
    if (submitTimerRef.current) {
      clearTimeout(submitTimerRef.current);
      submitTimerRef.current = null;
    }
  }, []);

  // Single useLayoutEffect for all setup
  useLayoutEffect(() => {
    // Transition from entering to writing after 1.5s
    transitionTimerRef.current = setTimeout(() => {
      setPhase('writing');
      // Focus textarea after transition
      setTimeout(() => textareaRef.current?.focus(), 100);
    }, 1500);

    // Hint rotation
    hintIntervalRef.current = setInterval(() => {
      setCurrentHintIndex(prev => (prev + 1) % hints.length);
    }, 4000);

    return cleanup;
  }, [hints.length, cleanup]);

  // Handle text change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommitment(e.target.value);
    onKeystroke?.();
  }, [onKeystroke]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!isReady) return;
    setPhase('confirming');

    // Complete after brief confirmation
    submitTimerRef.current = setTimeout(() => {
      onComplete(commitment.trim());
    }, 800);
  }, [isReady, commitment, onComplete]);

  // Keyboard shortcut - using native event listener to avoid useEffect deps
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isReady) {
      e.preventDefault();
      handleSubmit();
    }
  }, [isReady, handleSubmit]);

  return (
    <div className="min-h-[70dvh] flex flex-col px-4 py-8" onKeyDown={handleKeyDown}>
      {/* Atmospheric glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(16, 185, 129, 0.12) 0%, transparent 60%)',
        }}
      />

      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full relative z-10">
        <AnimatePresence mode="wait">
          {/* Entering Phase */}
          {phase === 'entering' && (
            <motion.div
              key="entering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              {/* Target icon */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                className="relative w-20 h-20 mb-6"
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500/20 to-stone-900 border border-emerald-500/30 flex items-center justify-center">
                  <Target size={32} className="text-emerald-400" />
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-stone-300 light:text-stone-700 font-light"
              >
                Time to commit...
              </motion.p>

              {/* Progress bar */}
              <motion.div className="w-32 h-1 bg-stone-800 light:bg-stone-200 rounded-full mx-auto mt-8 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: 'linear' }}
                  style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)' }}
                />
              </motion.div>
            </motion.div>
          )}

          {/* Writing Phase */}
          {phase === 'writing' && (
            <motion.div
              key="writing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col"
            >
              {/* The prompt */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <p className="text-sm font-medium text-emerald-400 mb-4 tracking-[0.2em] uppercase">
                  Your Commitment
                </p>
                <p className="text-xl sm:text-2xl text-stone-100 light:text-stone-900 leading-relaxed font-light">
                  {step.prompt}
                </p>
              </motion.div>

              {/* The writing space */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 relative"
              >
                <div
                  className={`
                    h-full min-h-[140px] relative rounded-2xl transition-all duration-300
                    border-2
                    ${isFocused
                      ? 'bg-stone-900/80 light:bg-stone-200/80 border-emerald-500/30'
                      : 'bg-stone-900/50 light:bg-stone-200/50 border-stone-700/50'}
                  `}
                >
                  {/* Textarea */}
<textarea
                    ref={textareaRef}
                    value={commitment}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={step.placeholder || t('lessons.commitment.placeholder')}
                    data-testid="commitment-input"
                    className="
                      w-full h-full min-h-[140px] p-5 pb-14
                      bg-transparent text-lg text-stone-200 light:text-stone-800
                      placeholder-stone-600 leading-relaxed
                      focus:outline-none resize-none
                      font-light tracking-wide
                    "
                    style={{ caretColor: '#10b981' }}
                  />

                  {/* Word count */}
                  <div className="absolute bottom-4 left-5 right-5 flex justify-between items-center">
                    <span className={`text-sm transition-colors ${
                      isReady ? 'text-emerald-400' : 'text-stone-500 light:text-stone-600'
                    }`}>
                      {wordCount} {wordCount === 1
                        ? t('lessons.commitment.word')
                        : t('lessons.commitment.words')}
                    </span>

                    <span className={`text-sm transition-colors ${
                      isReady ? 'text-emerald-400' : 'text-stone-600 light:text-stone-500'
                    }`}>
                      {isReady
                        ? t('lessons.commitment.readyToCommit')
                        : t('lessons.commitment.moreNeeded', { count: minimumWords - wordCount })}
                    </span>
                  </div>
                </div>

                {/* Hint rotation */}
                <div className="mt-3 h-6 text-center">
                  <AnimatePresence mode="wait">
                    {commitment.length === 0 && !isFocused && (
                      <motion.p
                        key={currentHintIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-stone-600 light:text-stone-500 text-sm italic"
                      >
                        {hints[currentHintIndex]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Submit button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 space-y-4"
              >
<Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!isReady}
                  glow={isReady}
                  className="w-full group"
                  data-testid="commitment-submit-btn"
                >
                  {step.continueLabel || t('lessons.commitment.commitButton')}
                  <ChevronRight
                    size={18}
                    className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                  />
                </Button>

                {/* Keyboard hint */}
                <div className="h-5 text-center">
                  <AnimatePresence>
                    {isReady && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-stone-600 light:text-stone-500"
                      >
                        {t('lessons.commitment.pressToSubmit', { key: '⌘' })}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Confirming Phase */}
          {phase === 'confirming' && (
            <motion.div
              key="confirming"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
                >
                  <span className="text-2xl">✓</span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-stone-400 light:text-stone-600"
                >
                  Commitment sealed
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CommitmentStep;
