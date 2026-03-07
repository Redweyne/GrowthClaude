'use client';

// ==============================================================================
// SCENARIO STEP - "The Immersion"
// ==============================================================================
//
// Where transformation begins with recognition.
// Typography drama: first sentence is large display font, rest flows naturally.
// Mood-driven dual-layer atmospheric glow (3x bolder than before).
// Bridge question arrives as a reflective descent with centered dot divider.
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
    glowStrong: 'rgba(244, 63, 94, 0.30)',
    glowSubtle: 'rgba(244, 63, 94, 0.15)',
    accent: 'text-rose-400',
  },
  curiosity: {
    glowStrong: 'rgba(245, 158, 11, 0.30)',
    glowSubtle: 'rgba(245, 158, 11, 0.15)',
    accent: 'text-amber-400',
  },
  hope: {
    glowStrong: 'rgba(16, 185, 129, 0.30)',
    glowSubtle: 'rgba(16, 185, 129, 0.15)',
    accent: 'text-emerald-400',
  },
  tension: {
    glowStrong: 'rgba(168, 85, 247, 0.30)',
    glowSubtle: 'rgba(168, 85, 247, 0.15)',
    accent: 'text-purple-400',
  },
};

// Mood-specific fallback button text
const MOOD_BUTTON_TEXT_BY_LOCALE = {
  en: {
    tension: 'What would you do?',
    curiosity: "Let's explore...",
    hope: 'Step forward...',
    struggle: 'Face this...',
  },
  fr: {
    tension: 'Que feriez-vous ?',
    curiosity: 'Explorons...',
    hope: 'Avancez...',
    struggle: 'Affrontez cela...',
  },
  ar: {
    tension: 'ماذا ستفعل؟',
    curiosity: 'لنستكشف...',
    hope: 'تقدّم...',
    struggle: 'واجه هذا...',
  },
} as const;

// Phases for sequenced reveal
type Phase = 'narrative' | 'subtext' | 'bridgeQuestion' | 'ready';

export function ScenarioStep({ step, onComplete }: ScenarioStepProps) {
  const { t, locale } = useTranslation();
  const [phase, setPhase] = useState<Phase>('narrative');
  const mountedRef = useRef(true);

  const mood = step.mood || 'tension';
  const colors = MOOD_COLORS[mood];
  const moodButtonText = (MOOD_BUTTON_TEXT_BY_LOCALE[locale] ?? MOOD_BUTTON_TEXT_BY_LOCALE.en)[mood];

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Phase transitions ──────────────────────────────────────────────────────

  const handleNarrativeComplete = useCallback(() => {
    if (!mountedRef.current) return;
    if (step.subtext) setPhase('subtext');
    else if (step.bridgeQuestion) setPhase('bridgeQuestion');
    else setPhase('ready');
  }, [step.subtext, step.bridgeQuestion]);

  const handleSubtextComplete = useCallback(() => {
    if (!mountedRef.current) return;
    if (step.bridgeQuestion) setPhase('bridgeQuestion');
    else setPhase('ready');
  }, [step.bridgeQuestion]);

  const handleBridgeComplete = useCallback(() => {
    if (!mountedRef.current) return;
    setPhase('ready');
  }, []);

  // ── Derived state ──────────────────────────────────────────────────────────

  const showSubtext = phase === 'subtext' || phase === 'bridgeQuestion' || phase === 'ready';
  const showBridge = phase === 'bridgeQuestion' || phase === 'ready';
  const showButton = phase === 'ready';

  // Button text: step's continueLabel > mood-specific > generic fallback
  const buttonText = step.continueLabel || moodButtonText || t('lessons.scenario.continue');

  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center px-4">
      {/* Dual-layer atmospheric glow — 3x bolder than before */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 30%, ${colors.glowStrong} 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 80%, ${colors.glowSubtle} 0%, transparent 40%)
          `,
        }}
      />

      <motion.div
        className="max-w-lg w-full relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="space-y-6 sm:space-y-5">
          {/* ── Full narrative — word-by-word reveal with dramatic first sentence ── */}
          <WisdomText
            variant="narrative"
            animate={true}
            speed="slow"
            firstSentenceClassName="font-serif text-2xl sm:text-3xl leading-[1.5] text-stone-100 light:text-stone-900"
            onComplete={handleNarrativeComplete}
          >
            {step.narrative}
          </WisdomText>

          {/* ── Subtext — supporting context ───────────────────────────── */}
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

          {/* ── Bridge question — reflective descent ───────────────────── */}
          {step.bridgeQuestion && showBridge && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10 pt-8"
            >
              {/* Centered dot divider — replaces clinical border-top */}
              <div className="flex justify-center mb-6">
                <span className="text-stone-500 light:text-stone-400 tracking-[1em] text-sm select-none">·  ·  ·</span>
              </div>

              <WisdomText
                variant="question"
                animate={true}
                speed="normal"
                onComplete={handleBridgeComplete}
                className="font-serif italic"
              >
                {step.bridgeQuestion}
              </WisdomText>
            </motion.div>
          )}

          {/* ── Continue button — atmospheric glass variant ─────────────── */}
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
                onClick={onComplete}
                glow
                className="w-full group"
                data-testid="scenario-continue-btn"
              >
                {buttonText}
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
