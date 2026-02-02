'use client';

// ==============================================================================
// SCENARIO STEP - The Hook
// ==============================================================================
//
// This is where transformation begins - with recognition.
// All text appears with consistent, clean animations.
// Sequenced reveal: narrative -> subtext -> bridge question -> button
//
// ==============================================================================

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button, WisdomText } from '@/components/ui';
import { useTranslation } from '@/i18n';
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

// Phases for sequenced reveal
type Phase = 'narrative' | 'subtext' | 'bridgeQuestion' | 'ready';

export function ScenarioStep({ step, onComplete }: ScenarioStepProps) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('narrative');
  const mountedRef = useRef(true);

  const mood = step.mood || 'tension';
  const colors = MOOD_COLORS[mood];

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Called when the narrative text animation finishes
  const handleNarrativeComplete = useCallback(() => {
    if (!mountedRef.current) return;
    
    // Determine next phase
    if (step.subtext) {
      setPhase('subtext');
    } else if (step.bridgeQuestion) {
      setPhase('bridgeQuestion');
    } else {
      setPhase('ready');
    }
  }, [step.subtext, step.bridgeQuestion]);

  // Called when subtext animation finishes
  const handleSubtextComplete = useCallback(() => {
    if (!mountedRef.current) return;
    
    if (step.bridgeQuestion) {
      setPhase('bridgeQuestion');
    } else {
      setPhase('ready');
    }
  }, [step.bridgeQuestion]);

  // Called when bridge question animation finishes
  const handleBridgeComplete = useCallback(() => {
    if (!mountedRef.current) return;
    setPhase('ready');
  }, []);

  const showSubtext = phase === 'subtext' || phase === 'bridgeQuestion' || phase === 'ready';
  const showBridge = phase === 'bridgeQuestion' || phase === 'ready';
  const showButton = phase === 'ready';

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
          {/* The narrative - clean sentence-by-sentence reveal */}
          <WisdomText
            variant="narrative"
            animate={true}
            speed="slow"
            onComplete={handleNarrativeComplete}
          >
            {step.narrative}
          </WisdomText>

          {/* Subtext - animated with same style, appears after narrative */}
          {step.subtext && showSubtext && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <WisdomText
                variant="instruction"
                animate={true}
                speed="normal"
                onComplete={handleSubtextComplete}
              >
                {step.subtext}
              </WisdomText>
            </motion.div>
          )}

          {/* Bridge question - animated with same style, appears after subtext */}
          {step.bridgeQuestion && showBridge && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`pt-6 border-t ${colors.border}`}
            >
              <WisdomText
                variant="question"
                animate={true}
                speed="normal"
                onComplete={handleBridgeComplete}
                className="font-medium"
              >
                {step.bridgeQuestion}
              </WisdomText>
            </motion.div>
          )}

          {/* Continue button - only shows after ALL text is complete */}
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="pt-4"
            >
                <Button
                  size="lg"
                  onClick={onComplete}
                  glow
                  className="w-full group"
                  data-testid="scenario-continue-btn"
                >
                  {step.continueLabel || t('lessons.scenario.continue')}
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
