'use client';

// ═══════════════════════════════════════════════════════════════════════════
// CHOICE STEP - THE CROSSROADS
// ═══════════════════════════════════════════════════════════════════════════
//
// Every transformation requires a choice.
// Clean, readable options - no unnecessary animation phases.
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

  // Audio for choice interactions
  const { playTapConfirm, playSuccess } = useAudio();

  // Show options after brief delay
  useEffect(() => {
    const timer = setTimeout(() => setShowOptions(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (option: ChoiceOption) => {
    setSelectedOption(option.id);
    playTapConfirm(); // Confirmation sound on selection
    // Brief pause before moving on
    setTimeout(() => {
      playSuccess(); // Success sound before completing
      onComplete(option);
    }, 500);
  };

  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center px-4">
      {/* Atmospheric glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(251, 191, 36, 0.10) 0%, transparent 60%)',
        }}
      />

      <motion.div
        className="max-w-lg w-full relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="space-y-8">
          {/* The question */}
          <div className="text-center space-y-3">
            {step.instruction && (
              <p className="text-sm text-amber-400/80 tracking-[0.15em] uppercase font-medium">
                {step.instruction}
              </p>
            )}
            <h2 className="text-2xl sm:text-3xl text-stone-100 light:text-stone-900 leading-relaxed">
              {step.question}
            </h2>
          </div>

          {/* The options */}
          {showOptions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {step.options.map((option, index) => (
<motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  onClick={() => handleSelect(option)}
                  disabled={selectedOption !== null}
                  data-testid={`choice-option-${option.id}`}
                  className={`
                    w-full p-6 rounded-2xl text-left transition-all duration-300
                    border-2 group relative overflow-hidden
                    ${selectedOption === option.id
                      ? 'bg-amber-500/20 border-amber-500/50 scale-[1.02]'
                      : selectedOption !== null
                      ? 'bg-stone-900/30 border-stone-800/50 opacity-40'
                      : 'bg-stone-900/50 light:bg-stone-200/50 border-stone-700/50 hover:bg-stone-800/50 hover:border-amber-500/30'
                    }
                  `}
                >
                  {/* Selection glow effect */}
                  {selectedOption === option.id && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.15) 0%, transparent 70%)',
                      }}
                    />
                  )}

                  <div className="relative z-10">
                    <span className={`
                      text-xl font-medium block mb-1 transition-colors
                      ${selectedOption === option.id
                        ? 'text-amber-300'
                        : 'text-stone-100 light:text-stone-900 group-hover:text-amber-200'
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

                  {/* Selection indicator */}
                  <div className={`
                    absolute right-6 top-1/2 -translate-y-1/2
                    w-3 h-3 rounded-full transition-all
                    ${selectedOption === option.id
                      ? 'bg-amber-400 opacity-100'
                      : 'bg-stone-600 opacity-0 group-hover:opacity-50'
                    }
                  `} />
                </motion.button>
              ))}
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
