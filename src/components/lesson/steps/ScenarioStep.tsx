'use client';

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO STEP - THE HOOK
// ═══════════════════════════════════════════════════════════════════════════
//
// This is where transformation begins - with recognition.
// We paint a picture the user knows intimately.
// "Yes, that's me. That's exactly how I feel."
//
// When someone feels truly seen, they open.
// And when they open, change becomes possible.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import type { ScenarioStep as ScenarioStepType } from '@/types/lessons';

interface ScenarioStepProps {
  step: ScenarioStepType;
  onComplete: () => void;
}

const MOOD_COLORS = {
  struggle: {
    primary: 'from-rose-500/20 to-stone-900',
    glow: 'rgba(244, 63, 94, 0.15)',
    accent: 'text-rose-400',
    border: 'border-rose-500/20',
  },
  curiosity: {
    primary: 'from-amber-500/20 to-stone-900',
    glow: 'rgba(245, 158, 11, 0.15)',
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  hope: {
    primary: 'from-emerald-500/20 to-stone-900',
    glow: 'rgba(16, 185, 129, 0.15)',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  tension: {
    primary: 'from-purple-500/20 to-stone-900',
    glow: 'rgba(168, 85, 247, 0.15)',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
  },
};

export function ScenarioStep({ step, onComplete }: ScenarioStepProps) {
  const [phase, setPhase] = useState<'entering' | 'narrative' | 'bridge' | 'ready'>('entering');
  const [narrativeIndex, setNarrativeIndex] = useState(0);

  const mood = step.mood || 'tension';
  const colors = MOOD_COLORS[mood];

  // Split narrative into sentences for dramatic reveal
  const sentences = step.narrative
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0);

  // Phase transitions
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Initial entrance
    timers.push(setTimeout(() => setPhase('narrative'), 800));

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  // Reveal sentences one by one
  useEffect(() => {
    if (phase !== 'narrative') return;
    if (narrativeIndex >= sentences.length) {
      // All sentences shown, move to bridge
      const timer = setTimeout(() => {
        setPhase(step.bridgeQuestion ? 'bridge' : 'ready');
      }, 1200);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setNarrativeIndex(prev => prev + 1);
    }, 1800); // Time between sentences

    return () => clearTimeout(timer);
  }, [phase, narrativeIndex, sentences.length, step.bridgeQuestion]);

  // Bridge to ready
  useEffect(() => {
    if (phase !== 'bridge') return;
    const timer = setTimeout(() => setPhase('ready'), 2500);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      {/* Atmospheric glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 40%, ${colors.glow} 0%, transparent 60%)`,
        }}
      />

      <div className="max-w-lg w-full relative z-10">
        <AnimatePresence mode="wait">
          {/* ─────────────────────────────────────────────────────────────────
              Entering Phase - Breathing Into Presence
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'entering' && (
            <motion.div
              key="entering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* Pulsing circle */}
              <motion.div
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br opacity-60"
                style={{
                  background: `linear-gradient(135deg, ${colors.glow}, transparent)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              Narrative Phase - The Story Unfolds
          ───────────────────────────────────────────────────────────────── */}
          {(phase === 'narrative' || phase === 'bridge' || phase === 'ready') && (
            <motion.div
              key="narrative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* The narrative - sentence by sentence */}
              <div className="space-y-4">
                {sentences.slice(0, narrativeIndex).map((sentence, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`text-xl sm:text-2xl leading-relaxed font-light ${
                      i === narrativeIndex - 1 ? 'text-stone-100' : 'text-stone-400'
                    }`}
                  >
                    {sentence}
                  </motion.p>
                ))}
              </div>

              {/* Subtext */}
              {step.subtext && narrativeIndex >= sentences.length && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-stone-500 text-lg italic"
                >
                  {step.subtext}
                </motion.p>
              )}

              {/* Bridge question */}
              {phase === 'bridge' && step.bridgeQuestion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`pt-8 border-t ${colors.border}`}
                >
                  <p className={`text-lg ${colors.accent} font-medium`}>
                    {step.bridgeQuestion}
                  </p>
                </motion.div>
              )}

              {/* Continue button */}
              <AnimatePresence>
                {phase === 'ready' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-8"
                  >
                    {step.bridgeQuestion && (
                      <p className={`text-lg ${colors.accent} font-medium mb-6`}>
                        {step.bridgeQuestion}
                      </p>
                    )}

                    <Button
                      size="lg"
                      onClick={onComplete}
                      glow
                      className="w-full group"
                    >
                      {step.continueLabel || 'I feel this'}
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

export default ScenarioStep;
