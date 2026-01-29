'use client';

// ═══════════════════════════════════════════════════════════════════════════
// INSIGHT STEP - THE REVELATION
// ═══════════════════════════════════════════════════════════════════════════
//
// Wisdom delivered cleanly and readably.
// No word-by-word reveals that feel buggy.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
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
  const [showButton, setShowButton] = useState(false);

  // Audio for revelation moments
  const { playReveal, playSuccess, playBell } = useAudio();

  const style = step.style || 'revelation';
  const config = STYLE_CONFIG[style];
  const Icon = config.icon;

  // Play revelation sound when insight appears
  useEffect(() => {
    // Different sounds for different insight styles
    if (style === 'quote') {
      playBell(); // Gentle bell for quotes
    } else {
      playReveal(); // Revelation sound for principles/insights
    }
  }, [style, playBell, playReveal]);

  // Simple delay before showing button
  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 600);
    return () => clearTimeout(timer);
  }, []);

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

          {/* The wisdom text - breathable, readable stanzas with slow reveal */}
          <WisdomText
            variant="insight"
            animate={true}
            staggerDelay={0.7}
            maxWordsPerStanza={10}
            initialDelay={0.5}
          >
            {step.text}
          </WisdomText>

          {/* Source attribution */}
          {step.source && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
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
          {step.followUp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
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
                  onComplete();
                }}
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
