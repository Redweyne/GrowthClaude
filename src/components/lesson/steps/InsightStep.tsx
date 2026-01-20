'use client';

// ═══════════════════════════════════════════════════════════════════════════
// INSIGHT STEP - THE REVELATION
// ═══════════════════════════════════════════════════════════════════════════
//
// Wisdom can appear at any point in the journey - not just the beginning.
// Sometimes it's a quote. Sometimes it's a reframe. Sometimes it's a principle.
//
// This component adapts to deliver insight in the most impactful way,
// whether as a reward for effort or as a lens for what comes next.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Quote, Lightbulb, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';
import type { InsightStep as InsightStepType } from '@/types/lessons';

interface InsightStepProps {
  step: InsightStepType;
  onComplete: () => void;
}

const STYLE_CONFIG = {
  quote: {
    icon: Quote,
    glow: 'rgba(167, 139, 250, 0.15)',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
    label: 'Ancient Wisdom',
  },
  principle: {
    icon: Lightbulb,
    glow: 'rgba(251, 191, 36, 0.15)',
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
    label: 'Core Principle',
  },
  revelation: {
    icon: Sparkles,
    glow: 'rgba(34, 211, 238, 0.15)',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/20',
    label: 'Insight',
  },
  reframe: {
    icon: RefreshCw,
    glow: 'rgba(16, 185, 129, 0.15)',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
    label: 'The Reframe',
  },
};

export function InsightStep({ step, onComplete }: InsightStepProps) {
  const [phase, setPhase] = useState<'entering' | 'revealing' | 'source' | 'ready'>('entering');
  const [wordIndex, setWordIndex] = useState(0);

  const style = step.style || 'revelation';
  const config = STYLE_CONFIG[style];
  const Icon = config.icon;

  // Split text into words for dramatic reveal
  const words = step.text.split(/\s+/);

  // Phase transitions
  useEffect(() => {
    const timer = setTimeout(() => setPhase('revealing'), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Word-by-word reveal
  useEffect(() => {
    if (phase !== 'revealing') return;
    if (wordIndex >= words.length) {
      const timer = setTimeout(() => {
        setPhase(step.source ? 'source' : 'ready');
      }, 800);
      return () => clearTimeout(timer);
    }

    // Variable timing based on punctuation
    const currentWord = words[wordIndex] || '';
    const hasPunctuation = /[.!?,;:]$/.test(currentWord);
    const delay = hasPunctuation ? 400 : 120;

    const timer = setTimeout(() => {
      setWordIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [phase, wordIndex, words, step.source]);

  // Source to ready
  useEffect(() => {
    if (phase !== 'source') return;
    const timer = setTimeout(() => setPhase('ready'), 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  const handleContinue = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Atmospheric glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 40%, ${config.glow} 0%, transparent 60%)`,
        }}
      />

      <div className="max-w-lg w-full relative z-10">
        <AnimatePresence mode="wait">
          {/* ─────────────────────────────────────────────────────────────────
              Entering Phase
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'entering' && (
            <motion.div
              key="entering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                className={`
                  w-20 h-20 mx-auto rounded-full
                  bg-gradient-to-br from-stone-800 to-stone-900
                  border ${config.border}
                  flex items-center justify-center
                `}
              >
                <Icon size={32} className={config.accent} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-sm ${config.accent} tracking-[0.2em] uppercase mt-4`}
              >
                {config.label}
              </motion.p>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              Revealing Phase
          ───────────────────────────────────────────────────────────────── */}
          {(phase === 'revealing' || phase === 'source' || phase === 'ready') && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8"
            >
              {/* Label */}
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm ${config.accent} tracking-[0.2em] uppercase`}
              >
                {config.label}
              </motion.p>

              {/* Quote marks for quote style */}
              {style === 'quote' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.3, scale: 1 }}
                  className="text-6xl text-purple-400/30 font-serif leading-none"
                >
                  &ldquo;
                </motion.div>
              )}

              {/* The wisdom text - word by word */}
              <div className="min-h-[120px] flex items-center justify-center">
                <p className="text-xl sm:text-2xl text-stone-100 leading-relaxed font-light">
                  {words.slice(0, wordIndex).map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block mr-2"
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>
              </div>

              {/* Source attribution */}
              <AnimatePresence>
                {(phase === 'source' || phase === 'ready') && step.source && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                  >
                    <p className={`${config.accent} font-medium`}>
                      — {step.source}
                    </p>
                    {step.sourceBook && (
                      <p className="text-stone-500 text-sm italic">
                        {step.sourceBook}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Follow up text */}
              {step.followUp && phase === 'ready' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-stone-400 text-lg mt-8 pt-8 border-t border-stone-800"
                >
                  {step.followUp}
                </motion.p>
              )}

              {/* Continue button */}
              <AnimatePresence>
                {phase === 'ready' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-4"
                  >
                    <Button
                      size="lg"
                      onClick={handleContinue}
                      glow
                      className="w-full group"
                    >
                      I receive this
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
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InsightStep;
