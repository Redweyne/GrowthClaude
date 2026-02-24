'use client';

// ═══════════════════════════════════════════════════════════════════════════
// AFFIRMATION STEP - "The Moment of Commitment"
// ═══════════════════════════════════════════════════════════════════════════
//
// A dramatic, beautifully presented statement the user confirms by tapping.
// Words appear one by one in large serif typography with gradient color.
// Solidification moment: bell rings, words lock in, then confirm button rises.
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
    glowStrong: 'rgba(16, 185, 129, 0.25)',
    glowSubtle: 'rgba(16, 185, 129, 0.12)',
    gradientClass: 'gradient-text-growth',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-500',
  },
  release: {
    glowStrong: 'rgba(99, 102, 241, 0.25)',
    glowSubtle: 'rgba(99, 102, 241, 0.12)',
    gradientClass: 'gradient-text-wisdom',
    accent: 'text-indigo-400',
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
    buttonBg: 'bg-indigo-600 hover:bg-indigo-500',
  },
  gratitude: {
    glowStrong: 'rgba(251, 191, 36, 0.25)',
    glowSubtle: 'rgba(251, 191, 36, 0.12)',
    gradientClass: 'gradient-text-gold',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    buttonBg: 'bg-amber-600 hover:bg-amber-500',
  },
  strength: {
    glowStrong: 'rgba(244, 63, 94, 0.20)',
    glowSubtle: 'rgba(244, 63, 94, 0.10)',
    gradientClass: 'gradient-text-sunset',
    accent: 'text-rose-400',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    buttonBg: 'bg-rose-600 hover:bg-rose-500',
  },
};

export function AffirmationStep({ step, onComplete }: AffirmationStepProps) {
  const [phase, setPhase] = useState<'pretext' | 'revealing' | 'solidified' | 'ready' | 'confirmed'>('pretext');
  const [visibleWords, setVisibleWords] = useState(0);
  const mountedRef = useRef(true);

  const { playBell, playSuccess, playReward } = useAudio();

  const style = step.style || 'commitment';
  const config = STYLE_CONFIG[style];

  const words = step.statement.split(/\s+/);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Phase transitions
  useEffect(() => {
    if (phase === 'pretext') {
      const delay = step.preText ? 2000 : 200;
      const timer = setTimeout(() => {
        if (mountedRef.current) setPhase('revealing');
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [phase, step.preText]);

  // Word-by-word reveal — 160ms per word for weight
  useEffect(() => {
    if (phase !== 'revealing') return;
    if (visibleWords >= words.length) {
      // All words revealed → solidification moment
      playBell();
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          setPhase('solidified');
          // Brief solidification pause, then show button
          setTimeout(() => {
            if (mountedRef.current) setPhase('ready');
          }, 600);
        }
      }, 400);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setVisibleWords(prev => prev + 1);
      }
    }, 160);

    return () => clearTimeout(timer);
  }, [phase, visibleWords, words.length, playBell]);

  const handleConfirm = useCallback(() => {
    if (phase !== 'ready') return;
    setPhase('confirmed');
    playSuccess();
    playReward();

    setTimeout(() => {
      if (mountedRef.current) {
        onComplete();
      }
    }, 1200);
  }, [phase, playSuccess, playReward, onComplete]);

  const allWordsVisible = visibleWords >= words.length;

  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center px-4 py-8">
      {/* Dual-layer atmospheric glow — intensifies on confirm */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          opacity: phase === 'confirmed' ? 1.5 : 1,
        }}
        transition={{ duration: 0.5 }}
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 30%, ${config.glowStrong} 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 80%, ${config.glowSubtle} 0%, transparent 40%)
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

          {/* The statement — serif + gradient, word by word reveal */}
          {phase !== 'pretext' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="py-8"
            >
              <p className={`font-serif text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.3] ${
                allWordsVisible ? config.gradientClass : 'text-stone-100 light:text-stone-900'
              }`}>
                {words.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={i < visibleWords ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
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
            {phase === 'ready' && (
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
