'use client';

// ═══════════════════════════════════════════════════════════════════════════
// CHOICE STEP - "The Crossroads"
// ═══════════════════════════════════════════════════════════════════════════
//
// Every transformation requires a choice.
// Glass-morphism cards that feel substantial and premium.
// Selected choice glows golden; rejected paths fade away.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/hooks/useAudio';
import type { ChoiceStep as ChoiceStepType, ChoiceOption } from '@/types/lessons';

interface ChoiceStepProps {
  step: ChoiceStepType;
  onComplete: (choice: ChoiceOption) => void;
}

export function ChoiceStep({ step, onComplete }: ChoiceStepProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const { playTapConfirm, playSuccess } = useAudio();

  useEffect(() => {
    const timer = setTimeout(() => setShowOptions(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (option: ChoiceOption) => {
    setSelectedOption(option.id);
    playTapConfirm();
    setTimeout(() => {
      playSuccess();
      onComplete(option);
    }, 600);
  };

  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center px-4">
      {/* Atmospheric glow — warmer and bolder */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(251, 191, 36, 0.18) 0%, transparent 50%)',
        }}
      />

      <motion.div
        className="max-w-lg w-full relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="space-y-8">
          {/* The question — serif for gravitas */}
          <div className="text-center space-y-3">
            {step.instruction && (
              <p className="text-sm text-amber-400/80 tracking-[0.15em] uppercase font-medium">
                {step.instruction}
              </p>
            )}
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 light:text-stone-900 leading-relaxed">
              {step.question}
            </h2>
          </div>

          {/* The options — glass cards with stagger */}
          {showOptions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {step.options.map((option, index) => {
                const isSelected = selectedOption === option.id;
                const isRejected = selectedOption !== null && !isSelected;

                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{
                      opacity: isRejected ? 0.15 : 1,
                      y: 0,
                      scale: isSelected ? 1.02 : isRejected ? 0.97 : 1,
                    }}
                    transition={{
                      delay: isRejected ? 0 : index * 0.15,
                      duration: isRejected ? 0.4 : 0.3,
                    }}
                    onClick={() => handleSelect(option)}
                    disabled={selectedOption !== null}
                    data-testid={`choice-option-${option.id}`}
                    className={`
                      w-full p-6 rounded-2xl text-left transition-all duration-300
                      relative overflow-hidden
                      ${isSelected
                        ? 'bg-amber-500/15 border-2 border-amber-500/50 shadow-lg shadow-amber-500/10'
                        : 'bg-stone-900/40 light:bg-stone-100/60 backdrop-blur-xl border border-white/10 light:border-stone-300/50 hover:border-amber-500/30 hover:bg-stone-800/50'
                      }
                    `}
                  >
                    {/* Selection golden glow */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          background: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.20) 0%, transparent 70%)',
                        }}
                      />
                    )}

                    <div className="relative z-10">
                      <span className={`
                        text-xl font-medium block mb-1 transition-colors
                        ${isSelected
                          ? 'text-amber-300'
                          : 'text-stone-100 light:text-stone-900'
                        }
                      `}>
                        {option.label}
                      </span>
                      {option.subtext && (
                        <span className="text-stone-400 light:text-stone-600 text-sm">
                          {option.subtext}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Selection confirmation */}
          {selectedOption && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-amber-400 text-xl">✓</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ChoiceStep;
