'use client';

// ==============================================================================
// INSIGHT STEP - The Revelation
// ==============================================================================
//
// Wisdom delivered cleanly and readably.
// Button only appears after text finishes animating.
//
// ==============================================================================

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Quote, Lightbulb, Sparkles, RefreshCw } from 'lucide-react';
import { Button, WisdomText } from '@/components/ui';
import { useAudio } from '@/hooks/useAudio';
import type { InsightStep as InsightStepType } from '@/types/lessons';

interface InsightStepProps {
  step: InsightStepType;
  onComplete: () => void;
}

const STYLE_CONFIG = {
  quote: {
    icon: Quote,
    glow: 'rgba(167, 139, 250, 0.12)',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
    label: 'Ancient Wisdom',
  },
  principle: {
    icon: Lightbulb,
    glow: 'rgba(251, 191, 36, 0.12)',
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
    label: 'Core Principle',
  },
  revelation: {
    icon: Sparkles,
    glow: 'rgba(34, 211, 238, 0.12)',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/20',
    label: 'Insight',
  },
  reframe: {
    icon: RefreshCw,
    glow: 'rgba(16, 185, 129, 0.12)',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
    label: 'The Reframe',
  },
};

export function InsightStep({ step, onComplete }: InsightStepProps) {
  // Button only shows AFTER text animation completes
  const [showButton, setShowButton] = useState(false);

  // Audio for revelation moments
  const { playReveal, playSuccess, playBell } = useAudio();

  const style = step.style || 'revelation';
  const config = STYLE_CONFIG[style];
  const Icon = config.icon;

  // Called when the main text animation finishes
  const handleTextComplete = useCallback(() => {
    // Play sound when wisdom is revealed
    if (style === 'quote') {
      playBell();
    } else {
      playReveal();
    }
    // Now show the button
    setShowButton(true);
  }, [style, playBell, playReveal]);

  // Handle continue button click
  const handleContinue = useCallback(() => {
    playSuccess();
    onComplete();
  }, [playSuccess, onComplete]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Atmospheric glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 40%, ${config.glow} 0%, transparent 60%)`,
        }}
      />

      <motion.div
        className="max-w-lg w-full relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="text-center space-y-6">
          {/* Icon and label */}
          <div className="flex flex-col items-center gap-3">
            <div
              className={`
                w-16 h-16 rounded-full
                bg-gradient-to-br from-stone-800 to-stone-900
                border ${config.border}
                flex items-center justify-center
              `}
            >
              <Icon size={28} className={config.accent} />
            </div>
            <p className={`text-sm ${config.accent} tracking-[0.15em] uppercase font-medium`}>
              {config.label}
            </p>
          </div>

          {/* Quote marks for quote style */}
          {style === 'quote' && (
            <div className="text-5xl text-purple-400/20 font-serif leading-none">
              &ldquo;
            </div>
          )}

          {/* The wisdom text - clean sentence-by-sentence reveal */}
          <WisdomText
            variant="insight"
            animate={true}
            speed="slow"
            onComplete={handleTextComplete}
          >
            {step.text}
          </WisdomText>

          {/* Source attribution */}
          {step.source && showButton && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-1 pt-3"
            >
              <p className={`${config.accent} font-medium text-lg`}>
                — {step.source}
              </p>
              {step.sourceBook && (
                <p className="text-stone-500 text-sm">
                  {step.sourceBook}
                </p>
              )}
            </motion.div>
          )}

          {/* Follow up text */}
          {step.followUp && showButton && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-6 border-t border-stone-800"
            >
              <WisdomText
                variant="instruction"
                animate={false}
              >
                {step.followUp}
              </WisdomText>
            </motion.div>
          )}

          {/* Continue button - only shows after text is complete */}
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-4"
            >
              <Button
                size="lg"
                onClick={handleContinue}
                glow
                className="w-full group"
              >
                I receive this
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

export default InsightStep;
