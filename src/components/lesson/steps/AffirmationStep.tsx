'use client';

// ═══════════════════════════════════════════════════════════════════════════
// AFFIRMATION STEP - THE MOMENT OF COMMITMENT
// ═══════════════════════════════════════════════════════════════════════════
//
// A dramatic, beautifully presented statement the user confirms by tapping.
// Replaces GoDoIt and written commitments in the engagement path.
// Words appear one by one for maximum impact, then user confirms.
// This is the "swipe right on your intention" moment.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import type { AffirmationStep as AffirmationStepType } from '@/types/lessons';

interface AffirmationStepProps {
  step: AffirmationStepType;
  onComplete: () => void;
}

const STYLE_CONFIG = {
  commitment: {
    glow: 'rgba(16, 185, 129, 0.15)',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-500',
    particle: 'bg-emerald-400',
  },
  release: {
    glow: 'rgba(99, 102, 241, 0.15)',
    accent: 'text-indigo-400',
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
    buttonBg: 'bg-indigo-600 hover:bg-indigo-500',
    particle: 'bg-indigo-400',
  },
  gratitude: {
    glow: 'rgba(251, 191, 36, 0.15)',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    buttonBg: 'bg-amber-600 hover:bg-amber-500',
    particle: 'bg-amber-400',
  },
  strength: {
    glow: 'rgba(244, 63, 94, 0.12)',
    accent: 'text-rose-400',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    buttonBg: 'bg-rose-600 hover:bg-rose-500',
    particle: 'bg-rose-400',
  },
};

export function AffirmationStep({ step, onComplete }: AffirmationStepProps) {
  const [phase, setPhase] = useState<'pretext' | 'revealing' | 'ready' | 'confirmed'>('pretext');
  const [visibleWords, setVisibleWords] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const mountedRef = useRef(true);

  const { playReveal, playSuccess, playReward } = useAudio();

  const style = step.style || 'commitment';
  const config = STYLE_CONFIG[style];

  const words = step.statement.split(/\s+/);
  const allWordsVisible = visibleWords >= words.length;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Phase transitions
  useEffect(() => {
    if (phase === 'pretext') {
      // Show pretext briefly, then start revealing
      const delay = step.preText ? 2000 : 200;
      const timer = setTimeout(() => {
        if (mountedRef.current) setPhase('revealing');
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [phase, step.preText]);

  // Word-by-word reveal
  useEffect(() => {
    if (phase !== 'revealing') return;
    if (visibleWords >= words.length) {
      // All words revealed
      playReveal();
      setTimeout(() => {
        if (mountedRef.current) {
          setPhase('ready');
          setShowConfirm(true);
        }
      }, 600);
      return;
    }

    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setVisibleWords(prev => prev + 1);
      }
    }, 120); // Fast but readable word reveal

    return () => clearTimeout(timer);
  }, [phase, visibleWords, words.length, playReveal]);

  const handleConfirm = useCallback(() => {
    if (phase !== 'ready') return;
    setPhase('confirmed');
    playSuccess();
    playReward();

    // Wait for confirmation animation then continue
    setTimeout(() => {
      if (mountedRef.current) {
        onComplete();
      }
    }, 1200);
  }, [phase, playSuccess, playReward, onComplete]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Atmospheric glow - intensifies when ready */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          opacity: phase === 'confirmed' ? 1.5 : 1,
        }}
        transition={{ duration: 0.5 }}
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, ${config.glow} 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 50% 60%, ${config.glow} 0%, transparent 40%)
          `,
        }}
      />

      <motion.div
        className="max-w-lg w-full relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="space-y-8 text-center">
          {/* Pre-text */}
          <AnimatePresence>
            {step.preText && phase === 'pretext' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-lg text-stone-400 light:text-stone-600 leading-relaxed"
              >
                {step.preText}
              </motion.p>
            )}
          </AnimatePresence>

          {/* The statement - word by word reveal */}
          {phase !== 'pretext' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="py-8"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-medium leading-relaxed text-stone-100 light:text-stone-900">
                {words.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={i < visibleWords ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="inline-block mr-[0.3em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            </motion.div>
          )}

          {/* Subtext */}
          <AnimatePresence>
            {step.subtext && allWordsVisible && phase !== 'pretext' && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className={`text-sm ${config.accent} tracking-wide`}
              >
                {step.subtext}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Confirm button */}
          <AnimatePresence>
            {showConfirm && phase === 'ready' && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 200 }}
                className="pt-4"
              >
                <button
                  onClick={handleConfirm}
                  className={`
                    w-full px-8 py-5 rounded-2xl
                    text-white text-lg font-semibold
                    ${config.buttonBg}
                    transition-all duration-200
                    active:scale-[0.97]
                    shadow-lg
                  `}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {step.confirmLabel}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirmed state */}
          <AnimatePresence>
            {phase === 'confirmed' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex flex-col items-center gap-3"
              >
                <div className={`
                  w-16 h-16 rounded-full ${config.bg} ${config.border}
                  border-2 flex items-center justify-center
                `}>
                  <Check size={32} className={config.accent} strokeWidth={3} />
                </div>
                <p className={`text-sm ${config.accent} font-medium tracking-wide`}>
                  Committed
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default AffirmationStep;
