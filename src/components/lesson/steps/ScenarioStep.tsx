'use client';

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO STEP - THE HOOK
// ═══════════════════════════════════════════════════════════════════════════
//
// This is where transformation begins - with recognition.
// Clean, readable, engaging - no unnecessary animation tricks.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button, WisdomText } from '@/components/ui';
import type { ScenarioStep as ScenarioStepType } from '@/types/lessons';

interface ScenarioStepProps {
  step: ScenarioStepType;
  onComplete: () => void;
}

const MOOD_COLORS = {
  struggle: {
    glow: 'rgba(244, 63, 94, 0.12)',
    accent: 'text-rose-400',
    border: 'border-rose-500/20',
  },
  curiosity: {
    glow: 'rgba(245, 158, 11, 0.12)',
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  hope: {
    glow: 'rgba(16, 185, 129, 0.12)',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  tension: {
    glow: 'rgba(168, 85, 247, 0.12)',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
  },
};

export function ScenarioStep({ step, onComplete }: ScenarioStepProps) {
  const [showButton, setShowButton] = useState(false);

  const mood = step.mood || 'tension';
  const colors = MOOD_COLORS[mood];

  // Simple delay before showing button
  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      {/* Atmospheric glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 40%, ${colors.glow} 0%, transparent 60%)`,
        }}
      />

      <motion.div
        className="max-w-lg w-full relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="space-y-6 sm:space-y-5">
          {/* The narrative - breathable, readable stanzas */}
          <WisdomText
            variant="narrative"
            animate={true}
            staggerDelay={0.2}
            maxWordsPerStanza={16}
          >
            {step.narrative}
          </WisdomText>

          {/* Subtext */}
          {step.subtext && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <WisdomText
                variant="instruction"
                animate={false}
              >
                {step.subtext}
              </WisdomText>
            </motion.div>
          )}

          {/* Bridge question */}
          {step.bridgeQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`pt-6 border-t ${colors.border}`}
            >
              <WisdomText
                variant="question"
                animate={false}
                className="font-medium"
              >
                {step.bridgeQuestion}
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
                onClick={onComplete}
                glow
                className="w-full group"
              >
                {step.continueLabel || 'I feel this'}
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

export default ScenarioStep;
