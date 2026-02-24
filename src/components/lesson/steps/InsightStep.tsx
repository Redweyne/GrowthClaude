'use client';

// ==============================================================================
// INSIGHT STEP - "The Revelation"
// ==============================================================================
//
// Full-screen typography that commands attention.
// No icon circles — the words themselves are the visual.
// Gradient text matched to insight style for color identity.
// Breathing atmospheric glow creates a living, sacred space.
//
// ==============================================================================

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button, WisdomText } from '@/components/ui';
import { useAudio } from '@/hooks/useAudio';
import type { InsightStep as InsightStepType } from '@/types/lessons';

interface InsightStepProps {
  step: InsightStepType;
  onComplete: () => void;
}

const STYLE_CONFIG = {
  quote: {
    glowStrong: 'rgba(167, 139, 250, 0.30)',
    glowSubtle: 'rgba(167, 139, 250, 0.15)',
    gradientClass: 'gradient-text-wisdom',
    accent: 'text-purple-400',
    label: 'Ancient Wisdom',
    buttonText: 'I receive this wisdom',
  },
  principle: {
    glowStrong: 'rgba(251, 191, 36, 0.30)',
    glowSubtle: 'rgba(251, 191, 36, 0.15)',
    gradientClass: 'gradient-text-gold',
    accent: 'text-amber-400',
    label: 'Core Principle',
    buttonText: 'I understand',
  },
  revelation: {
    glowStrong: 'rgba(34, 211, 238, 0.25)',
    glowSubtle: 'rgba(34, 211, 238, 0.12)',
    gradientClass: 'gradient-text-insight',
    accent: 'text-cyan-400',
    label: 'Insight',
    buttonText: 'This lands',
  },
  reframe: {
    glowStrong: 'rgba(16, 185, 129, 0.30)',
    glowSubtle: 'rgba(16, 185, 129, 0.15)',
    gradientClass: 'gradient-text-growth',
    accent: 'text-emerald-400',
    label: 'The Reframe',
    buttonText: 'I see it now',
  },
};

// Phases for sequenced reveal
type Phase = 'text' | 'source' | 'followUp' | 'ready';

export function InsightStep({ step, onComplete }: InsightStepProps) {
  const [phase, setPhase] = useState<Phase>('text');
  const mountedRef = useRef(true);
  const soundPlayedRef = useRef(false);

  const { playReveal, playSuccess, playBell } = useAudio();

  const style = step.style || 'revelation';
  const config = STYLE_CONFIG[style];

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Called when the main text animation finishes
  const handleTextComplete = useCallback(() => {
    if (!mountedRef.current) return;

    if (!soundPlayedRef.current) {
      soundPlayedRef.current = true;
      if (style === 'quote') {
        playBell();
      } else {
        playReveal();
      }
    }

    if (step.source) {
      setPhase('source');
    } else if (step.followUp) {
      setPhase('followUp');
    } else {
      setPhase('ready');
    }
  }, [step.source, step.followUp, style, playBell, playReveal]);

  // Source shown briefly then advances
  useEffect(() => {
    if (phase === 'source') {
      const timer = setTimeout(() => {
        if (!mountedRef.current) return;
        if (step.followUp) {
          setPhase('followUp');
        } else {
          setPhase('ready');
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, step.followUp]);

  const handleFollowUpComplete = useCallback(() => {
    if (!mountedRef.current) return;
    setPhase('ready');
  }, []);

  const handleContinue = useCallback(() => {
    playSuccess();
    onComplete();
  }, [playSuccess, onComplete]);

  const showSource = phase === 'source' || phase === 'followUp' || phase === 'ready';
  const showFollowUp = phase === 'followUp' || phase === 'ready';
  const showButton = phase === 'ready';

  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center px-4 py-8">
      {/* Dual-layer atmospheric glow with breathing */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 30%, ${config.glowStrong} 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 80%, ${config.glowSubtle} 0%, transparent 40%)
          `,
        }}
      />

      <motion.div
        className="max-w-lg w-full relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="text-center space-y-6">
          {/* Overline label — style identity */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`text-sm ${config.accent} tracking-[0.2em] uppercase font-medium`}
          >
            {config.label}
          </motion.p>

          {/* Quote marks for quote style */}
          {style === 'quote' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-5xl text-purple-400/20 font-serif leading-none"
            >
              &ldquo;
            </motion.div>
          )}

          {/* The wisdom text — full-screen typography with gradient color */}
          <div className={config.gradientClass}>
            <WisdomText
              variant="insight"
              animate={true}
              speed="slow"
              onComplete={handleTextComplete}
              className="font-serif !text-2xl sm:!text-3xl md:!text-4xl !leading-[1.4]"
            >
              {step.text}
            </WisdomText>
          </div>

          {/* Source attribution */}
          {step.source && showSource && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-1 pt-3"
            >
              <p className={`${config.accent} font-medium text-lg`}>
                — {step.source}
              </p>
              {step.sourceBook && (
                <p className="text-stone-500 light:text-stone-600 text-sm">
                  {step.sourceBook}
                </p>
              )}
            </motion.div>
          )}

          {/* Follow up text */}
          {step.followUp && showFollowUp && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-10 pt-8"
            >
              {/* Centered dot divider */}
              <div className="flex justify-center mb-6">
                <span className="text-stone-500 light:text-stone-400 tracking-[1em] text-sm select-none">·  ·  ·</span>
              </div>
              <WisdomText
                variant="instruction"
                animate={true}
                speed="normal"
                onComplete={handleFollowUpComplete}
              >
                {step.followUp}
              </WisdomText>
            </motion.div>
          )}

          {/* Continue button — style-specific text */}
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="pt-4"
            >
              <Button
                variant="glass"
                size="lg"
                onClick={handleContinue}
                glow
                className="w-full group"
                data-testid="insight-continue-btn"
              >
                {config.buttonText}
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
