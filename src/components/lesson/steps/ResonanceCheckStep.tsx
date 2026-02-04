'use client';

// ═══════════════════════════════════════════════════════════════════════════
// RESONANCE CHECK STEP - TAP WHAT RESONATES
// ═══════════════════════════════════════════════════════════════════════════
//
// Replaces writing prompts in the engagement path.
// Users tap options that resonate with them - personal without typing.
// Multi-select with satisfying feedback on each selection.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAudio } from '@/hooks/useAudio';
import type { ResonanceCheckStep as ResonanceCheckStepType } from '@/types/lessons';

interface ResonanceCheckStepProps {
  step: ResonanceCheckStepType;
  onComplete: (selections: string[]) => void;
}

export function ResonanceCheckStep({ step, onComplete }: ResonanceCheckStepProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showOptions, setShowOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mountedRef = useRef(true);

  const { playTapConfirm, playSuccess } = useAudio();

  const minSelections = step.minSelections ?? 1;
  const maxSelections = step.maxSelections ?? step.options.length;
  const canContinue = selected.size >= minSelections;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Stagger option reveal
  useEffect(() => {
    const timer = setTimeout(() => setShowOptions(true), 400);
    return () => clearTimeout(timer);
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
    playTapConfirm();
  }, [maxSelections, isSubmitting, playTapConfirm]);

  const handleContinue = useCallback(() => {
    if (!canContinue || isSubmitting) return;
    setIsSubmitting(true);
    playSuccess();
    // Brief pause for visual feedback
    setTimeout(() => {
      if (mountedRef.current) {
        onComplete(Array.from(selected));
      }
    }, 300);
  }, [canContinue, isSubmitting, selected, playSuccess, onComplete]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Atmospheric glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(99, 102, 241, 0.10) 0%, transparent 60%)',
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
            <h2 className="text-2xl sm:text-3xl text-stone-100 leading-relaxed">
              {step.prompt}
            </h2>
            {step.instruction && (
              <p className="text-sm text-indigo-400/80 tracking-wide">
                {step.instruction}
              </p>
            )}
            {!step.instruction && (
              <p className="text-sm text-stone-500">
                {maxSelections > 1
                  ? `Tap all that resonate${minSelections > 1 ? ` (at least ${minSelections})` : ''}`
                  : 'Choose one'}
              </p>
            )}
          </div>

          {/* Options grid */}
          {showOptions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {step.options.map((option, index) => {
                const isSelected = selected.has(option.id);
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.3 }}
                    onClick={() => handleToggle(option.id)}
                    disabled={isSubmitting}
                    className={`
                      w-full px-5 py-4 rounded-2xl text-left transition-all duration-200
                      border-2 relative overflow-hidden
                      active:scale-[0.98]
                      ${isSelected
                        ? 'bg-indigo-500/15 border-indigo-500/50'
                        : 'bg-stone-900/50 border-stone-700/40 hover:border-stone-600/60'
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
                          background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
                        }}
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-3">
                      {/* Check indicator */}
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        flex-shrink-0 transition-all duration-200
                        ${isSelected
                          ? 'bg-indigo-500 border-indigo-400'
                          : 'border-stone-600 bg-transparent'
                        }
                      `}>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          >
                            <Check size={14} className="text-white" strokeWidth={3} />
                          </motion.div>
                        )}
                      </div>

                      {/* Option text */}
                      <span className={`
                        text-base leading-snug transition-colors duration-200
                        ${isSelected ? 'text-stone-100' : 'text-stone-300'}
                      `}>
                        {option.emoji && <span className="mr-2">{option.emoji}</span>}
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
                  size="lg"
                  onClick={handleContinue}
                  disabled={isSubmitting}
                  glow
                  className="w-full group"
                >
                  {selected.size === 1 ? 'This is me' : 'These resonate'}
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
