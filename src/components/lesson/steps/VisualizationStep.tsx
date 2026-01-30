'use client';

// ═══════════════════════════════════════════════════════════════════════════
// VISUALIZATION STEP - THE INNER JOURNEY
// ═══════════════════════════════════════════════════════════════════════════
//
// Read and imagine. Let the words paint pictures in your mind.
// No "close your eyes" - that's absurd when you need to read instructions.
//
// NOTE: Music is now managed centrally by FlexibleLessonExperience.
// This component no longer starts its own music to prevent double audio.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

export function VisualizationStep({ step, onComplete }: VisualizationStepProps) {
  const [showButton, setShowButton] = useState(false);

  // Audio - only for UI sounds, music is managed by FlexibleLessonExperience
  const { playChime, playSuccess } = useAudio();

  const style = step.style || 'cosmic';
  const config = STYLE_CONFIG[style];

  // Play chime when visualization begins (music already playing from parent)
  useEffect(() => {
    playChime(); // Gentle chime to signal visualization start
  }, [playChime]);

  // Show button after reading time
  useEffect(() => {
    // Calculate read time: ~1 second per instruction
    const readTime = Math.max(step.instructions.length * 1000, 2000);
    const timer = setTimeout(() => setShowButton(true), readTime);
    return () => clearTimeout(timer);
  }, [step.instructions.length]);

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

          {/* All instructions at once - clean and readable */}
          <div className="space-y-6">
            {step.instructions.map((instruction, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.4 }}
                className="text-lg sm:text-xl text-stone-200 leading-relaxed text-center"
              >
                {instruction}
              </motion.p>
            ))}
          </div>

          {/* Continue button */}
          {showButton && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              <Button
                size="lg"
                onClick={() => {
                  playSuccess();
                  // Music continues - managed by FlexibleLessonExperience
                  onComplete();
                }}
                glow
                className="w-full group"
              >
                {step.followUpPrompt ? 'Continue to reflect' : 'I have seen'}
                <ChevronRight
                  size={18}
                  className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                />
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default VisualizationStep;
