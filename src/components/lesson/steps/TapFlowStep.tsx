'use client';

// ═══════════════════════════════════════════════════════════════════════════
// TAP FLOW STEP - USER-PACED SEQUENTIAL CONTENT
// ═══════════════════════════════════════════════════════════════════════════
//
// Replaces timed visualizations in the engagement path.
// Same powerful content, but user taps to advance instead of waiting.
// Each tap is a micro-commitment to stay present.
// Keeps TikTok-brain users actively engaged instead of passively bored.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAudio } from '@/hooks/useAudio';
import { useTranslation } from '@/i18n';
import type { TapFlowStep as TapFlowStepType } from '@/types/lessons';

interface TapFlowStepProps {
  step: TapFlowStepType;
  onComplete: () => void;
}

const COPY_BY_LOCALE = {
  en: {
    tapAnywhere: 'Tap anywhere to continue',
    iFeelThis: 'I feel this',
  },
  fr: {
    tapAnywhere: 'Touchez n’importe où pour continuer',
    iFeelThis: 'Je le ressens',
  },
  ar: {
    tapAnywhere: 'اضغط في أي مكان للمتابعة',
    iFeelThis: 'أشعر بهذا',
  },
} as const;

const STYLE_CONFIG = {
  cosmic: {
    glow: 'rgba(99, 102, 241, 0.12)',
    accent: 'text-indigo-400',
    gradient: 'from-indigo-500/20 via-purple-500/10 to-stone-900',
    tapColor: 'text-indigo-400/50',
  },
  grounding: {
    glow: 'rgba(16, 185, 129, 0.12)',
    accent: 'text-emerald-400',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-stone-900',
    tapColor: 'text-emerald-400/50',
  },
  fearless: {
    glow: 'rgba(244, 63, 94, 0.10)',
    accent: 'text-rose-400',
    gradient: 'from-rose-500/15 via-amber-500/10 to-stone-900',
    tapColor: 'text-rose-400/50',
  },
  grateful: {
    glow: 'rgba(251, 191, 36, 0.12)',
    accent: 'text-amber-400',
    gradient: 'from-amber-500/20 via-orange-500/10 to-stone-900',
    tapColor: 'text-amber-400/50',
  },
};

export function TapFlowStep({ step, onComplete }: TapFlowStepProps) {
  const { locale } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const mountedRef = useRef(true);

  const { playChime, playSuccess } = useAudio();
  const copy = COPY_BY_LOCALE[locale] ?? COPY_BY_LOCALE.en;

  const style = step.style || 'cosmic';
  const config = STYLE_CONFIG[style];

  const isLastInstruction = currentIndex >= step.instructions.length - 1;
  const allRevealed = currentIndex >= step.instructions.length;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Show complete button after last instruction
  useEffect(() => {
    if (allRevealed) {
      const timer = setTimeout(() => {
        if (mountedRef.current) setShowComplete(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [allRevealed]);

  const handleTap = useCallback(() => {
    if (allRevealed || isFinishing) return;

    // Advance to next instruction
    setCurrentIndex(prev => prev + 1);
    playChime();
  }, [allRevealed, isFinishing, playChime]);

  const handleComplete = useCallback(() => {
    if (isFinishing) return;
    setIsFinishing(true);
    playSuccess();
    setTimeout(() => {
      if (mountedRef.current) {
        onComplete();
      }
    }, 300);
  }, [isFinishing, playSuccess, onComplete]);

  // Progress dots
  const progress = Math.min(currentIndex, step.instructions.length);

  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center px-4 py-8">
      {/* Atmospheric glow - shifts subtly with each tap */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          opacity: 0.7 + (progress / step.instructions.length) * 0.6,
        }}
        transition={{ duration: 0.5 }}
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 30%, ${config.glow} 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 30% 70%, ${config.glow} 0%, transparent 40%)
          `,
        }}
      />

      <motion.div
        className="max-w-lg w-full relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div
              className={`
                w-16 h-16 mx-auto rounded-full
                bg-gradient-to-br ${config.gradient}
                border border-stone-700/50
                flex items-center justify-center
              `}
            >
              <Eye size={28} className={config.accent} />
            </div>

            {step.title && (
              <h2 className="text-2xl text-stone-100 light:text-stone-900">
                {step.title}
              </h2>
            )}

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5">
              {step.instructions.map((_, i) => (
                <motion.div
                  key={i}
                  className={`
                    h-1.5 rounded-full transition-all duration-300
                    ${i < progress
                      ? `w-4 ${style === 'grateful' ? 'bg-amber-400' : style === 'fearless' ? 'bg-rose-400' : style === 'grounding' ? 'bg-emerald-400' : 'bg-indigo-400'}`
                      : i === progress
                      ? `w-3 ${style === 'grateful' ? 'bg-amber-400/50' : style === 'fearless' ? 'bg-rose-400/50' : style === 'grounding' ? 'bg-emerald-400/50' : 'bg-indigo-400/50'}`
                      : 'w-1.5 bg-stone-700'
                    }
                  `}
                />
              ))}
            </div>
          </div>

          {/* Current instruction - tap area */}
          <div
            onClick={!allRevealed ? handleTap : undefined}
            className={`
              min-h-[250px] flex flex-col items-center justify-center
              ${!allRevealed ? 'cursor-pointer' : ''}
            `}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            role={!allRevealed ? 'button' : undefined}
            tabIndex={!allRevealed ? 0 : undefined}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTap(); }}
          >
            <AnimatePresence mode="wait">
              {!allRevealed && currentIndex < step.instructions.length && (
                <motion.p
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="font-serif text-2xl sm:text-3xl text-stone-200 light:text-stone-800 leading-relaxed text-center px-2"
                >
                  {step.instructions[currentIndex]}
                </motion.p>
              )}

              {allRevealed && step.closingText && (
                <motion.p
                  key="closing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`font-serif text-lg ${config.accent} leading-relaxed text-center italic`}
                >
                  {step.closingText}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Tap hint — tells user how to advance */}
            {!allRevealed && (
              <motion.div
                className="flex flex-col items-center gap-3 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: currentIndex === 0 ? 1.5 : 0.3 }}
              >
                <div className="flex justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        config.tapColor.replace('/50', '').replace('text-', 'bg-')
                      }`}
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
                <p className={`text-sm ${config.accent} opacity-50`}>
                  {copy.tapAnywhere}
                </p>
              </motion.div>
            )}
          </div>

          {/* Continue button - after all instructions */}
          <AnimatePresence>
            {showComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="pt-2"
              >
                <Button
                  size="lg"
                  onClick={handleComplete}
                  disabled={isFinishing}
                  glow
                  className="w-full group"
                >
                  {copy.iFeelThis}
                  <ChevronRight
                    size={18}
                    className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                  />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default TapFlowStep;
