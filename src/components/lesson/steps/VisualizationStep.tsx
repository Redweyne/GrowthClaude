'use client';

// ═══════════════════════════════════════════════════════════════════════════
// VISUALIZATION STEP - THE INNER JOURNEY
// ═══════════════════════════════════════════════════════════════════════════
//
// A meditative experience where text reveals slowly to create presence.
// Each instruction appears deliberately, giving time to absorb and visualize.
//
// NOTE: Music is now managed centrally by FlexibleLessonExperience.
// This component no longer starts its own music to prevent double audio.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAudio } from '@/hooks/useAudio';
import type { VisualizationStep as VisualizationStepType } from '@/types/lessons';

interface VisualizationStepProps {
  step: VisualizationStepType;
  onComplete: (response?: string) => void;
}

const STYLE_CONFIG = {
  cosmic: {
    glow: 'rgba(99, 102, 241, 0.12)',
    accent: 'text-indigo-400',
    gradient: 'from-indigo-500/20 via-purple-500/10 to-stone-900',
  },
  grounding: {
    glow: 'rgba(16, 185, 129, 0.12)',
    accent: 'text-emerald-400',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-stone-900',
  },
  fearless: {
    glow: 'rgba(244, 63, 94, 0.10)',
    accent: 'text-rose-400',
    gradient: 'from-rose-500/15 via-amber-500/10 to-stone-900',
  },
  grateful: {
    glow: 'rgba(251, 191, 36, 0.12)',
    accent: 'text-amber-400',
    gradient: 'from-amber-500/20 via-orange-500/10 to-stone-900',
  },
};

// Time per instruction in milliseconds - slow enough to read and visualize
const BASE_REVEAL_DELAY = 3500; // 3.5 seconds between instructions
const CHAR_READ_TIME = 50; // Additional time per character (longer text = more time)
const MIN_INSTRUCTION_TIME = 2500; // Minimum time per instruction
const MAX_INSTRUCTION_TIME = 6000; // Maximum time per instruction

export function VisualizationStep({ step, onComplete }: VisualizationStepProps) {
  const [visibleInstructions, setVisibleInstructions] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const hasPlayedChimeRef = useRef(false);

  // Audio - only for UI sounds, music is managed by FlexibleLessonExperience
  const { playChime, playSuccess } = useAudio();

  const style = step.style || 'cosmic';
  const config = STYLE_CONFIG[style];

  // Calculate reveal time for each instruction based on its length
  const getInstructionTime = (instruction: string): number => {
    const baseTime = BASE_REVEAL_DELAY;
    const charTime = instruction.length * CHAR_READ_TIME;
    return Math.min(Math.max(baseTime + charTime, MIN_INSTRUCTION_TIME), MAX_INSTRUCTION_TIME);
  };

  // Play chime once when visualization begins
  useEffect(() => {
    if (!hasPlayedChimeRef.current) {
      hasPlayedChimeRef.current = true;
      playChime();
    }
  }, [playChime]);

  // Reveal instructions one by one with appropriate timing
  useEffect(() => {
    if (visibleInstructions >= step.instructions.length) {
      // All instructions revealed, show button after a moment
      const timer = setTimeout(() => setShowButton(true), 1500);
      return () => clearTimeout(timer);
    }

    // Calculate time before revealing next instruction
    const currentInstruction = step.instructions[visibleInstructions];
    const revealTime = currentInstruction ? getInstructionTime(currentInstruction) : BASE_REVEAL_DELAY;

    const timer = setTimeout(() => {
      setVisibleInstructions(prev => prev + 1);
    }, visibleInstructions === 0 ? 800 : revealTime); // First instruction appears quickly

    return () => clearTimeout(timer);
  }, [visibleInstructions, step.instructions]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Atmospheric glow */}
      <div
        className="fixed inset-0 pointer-events-none"
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
              <h2 className="text-2xl text-stone-100">
                {step.title}
              </h2>
            )}

            <p className="text-stone-500 text-sm">
              Read slowly. Let the words paint pictures in your mind.
            </p>
          </div>

          {/* Instructions revealed one at a time */}
          <div className="space-y-6 min-h-[300px]">
            <AnimatePresence mode="sync">
              {step.instructions.slice(0, visibleInstructions).map((instruction, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="text-lg sm:text-xl text-stone-200 leading-relaxed text-center"
                >
                  {instruction}
                </motion.p>
              ))}
            </AnimatePresence>

            {/* Breathing indicator while waiting for next instruction */}
            {visibleInstructions < step.instructions.length && visibleInstructions > 0 && (
              <motion.div
                className="flex justify-center pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-stone-600"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
            )}
          </div>

          {/* Continue button */}
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-4"
              >
                <Button
                  size="lg"
                  onClick={() => {
                    playSuccess();
                    onComplete();
                  }}
                  glow
                  className="w-full group"
                  data-testid="visualization-continue-btn"
                >
                  {step.followUpPrompt ? 'Continue to reflect' : 'I have seen'}
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

export default VisualizationStep;
