'use client';

// ═══════════════════════════════════════════════════════════════════════════
// RESONANCE CHECK STEP - "Tap What Resonates"
// ═══════════════════════════════════════════════════════════════════════════
//
// 2-column grid of glass cards. Emoji centered, text below.
// No checkbox circles — the entire card is the toggle.
// Satisfying pop sound and scale feedback on each selection.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button, WisdomText } from '@/components/ui';
import { useAudio } from '@/hooks/useAudio';
import { useTranslation } from '@/i18n';
import type { ResonanceCheckStep as ResonanceCheckStepType } from '@/types/lessons';

interface ResonanceCheckStepProps {
  step: ResonanceCheckStepType;
  onComplete: (selections: string[]) => void;
}

const COPY_BY_LOCALE = {
  en: {
    tapAllResonate: (min: number) => `Tap all that resonate${min > 1 ? ` (at least ${min})` : ''}`,
    chooseOne: 'Choose one',
    thisIsMe: 'This is me',
    theseResonate: 'These resonate',
  },
  fr: {
    tapAllResonate: (min: number) => `Touchez tout ce qui résonne${min > 1 ? ` (au moins ${min})` : ''}`,
    chooseOne: 'Choisissez-en un',
    thisIsMe: "C'est moi",
    theseResonate: 'Cela résonne',
  },
  ar: {
    tapAllResonate: (min: number) => `اضغط على كل ما يلامسك${min > 1 ? ` (على الأقل ${min})` : ''}`,
    chooseOne: 'اختر واحدًا',
    thisIsMe: 'هذا أنا',
    theseResonate: 'هذه تلامسني',
  },
} as const;

export function ResonanceCheckStep({ step, onComplete }: ResonanceCheckStepProps) {
  const { locale } = useTranslation();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showOptions, setShowOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mountedRef = useRef(true);

  const { playPop, playSuccess } = useAudio();
  const copy = COPY_BY_LOCALE[locale] ?? COPY_BY_LOCALE.en;

  const minSelections = step.minSelections ?? 1;
  const maxSelections = step.maxSelections ?? step.options.length;
  const canContinue = selected.size >= minSelections;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const handlePromptComplete = useCallback(() => {
    setShowOptions(true);
  }, []);

  const handleToggle = useCallback((id: string) => {
    if (isSubmitting) return;

    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= maxSelections) return prev;
        next.add(id);
      }
      return next;
    });
    playPop();
  }, [maxSelections, isSubmitting, playPop]);

  const handleContinue = useCallback(() => {
    if (!canContinue || isSubmitting) return;
    setIsSubmitting(true);
    playSuccess();
    setTimeout(() => {
      if (mountedRef.current) {
        onComplete(Array.from(selected));
      }
    }, 300);
  }, [canContinue, isSubmitting, selected, playSuccess, onComplete]);

  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center px-4 py-8">
      {/* Atmospheric glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
        }}
      />

      <motion.div
        className="max-w-lg w-full relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="space-y-6">
          {/* Prompt */}
          <div className="text-center space-y-3">
            <WisdomText
              variant="dramatic"
              animate={true}
              speed="fast"
              className="text-center"
              onComplete={handlePromptComplete}
            >
              {step.prompt}
            </WisdomText>
            {step.instruction && (
              <p className="text-sm text-indigo-400/80 tracking-wide">
                {step.instruction}
              </p>
            )}
            {!step.instruction && (
              <p className="text-sm text-stone-500 light:text-stone-600">
                {maxSelections > 1
                  ? copy.tapAllResonate(minSelections)
                  : copy.chooseOne}
              </p>
            )}
          </div>

          {/* Options — 2-column grid of glass cards */}
          {showOptions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-3"
            >
              {step.options.map((option, index) => {
                const isSelected = selected.has(option.id);
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: isSelected ? 1.03 : 1,
                    }}
                    transition={{ delay: index * 0.06, duration: 0.3 }}
                    onClick={() => handleToggle(option.id)}
                    disabled={isSubmitting}
                    className={`
                      p-4 rounded-xl text-center transition-all duration-200
                      relative overflow-hidden
                      active:scale-[0.96]
                      ${isSelected
                        ? 'bg-indigo-500/15 border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                        : 'bg-stone-900/40 light:bg-stone-100/60 backdrop-blur-xl border border-white/10 light:border-stone-300/50 hover:border-indigo-500/30'
                      }
                    `}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {/* Selection glow */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                        }}
                      />
                    )}

                    <div className="relative z-10 flex flex-col items-center gap-2">
                      {/* Emoji — centered and large */}
                      {option.emoji && (
                        <span className="text-3xl block">{option.emoji}</span>
                      )}
                      {/* Option text */}
                      <span className={`
                        text-sm leading-snug transition-colors duration-200
                        ${isSelected ? 'text-stone-100 light:text-stone-900 font-medium' : 'text-stone-300 light:text-stone-700'}
                      `}>
                        {option.text}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Continue button */}
          <AnimatePresence>
            {canContinue && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-2"
              >
                <Button
                  variant="glass"
                  size="lg"
                  onClick={handleContinue}
                  disabled={isSubmitting}
                  glow
                  className="w-full group"
                >
                  {selected.size === 1 ? copy.thisIsMe : copy.theseResonate}
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

export default ResonanceCheckStep;
