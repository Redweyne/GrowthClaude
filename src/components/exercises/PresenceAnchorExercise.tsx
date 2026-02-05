'use client';

// ═══════════════════════════════════════════════════════════════════════════
// PRESENCE ANCHOR EXERCISE
// ═══════════════════════════════════════════════════════════════════════════
//
// Your body remembers what your mind forgets.
// A physical gesture paired with breathwork.
// Visualization prompts during exhales anchor the wisdom.
// The gesture becomes a trigger for transformation.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAudio } from '@/hooks/useAudio';
import type { PresenceAnchorContent } from '@/types/dailyPractice';

type Phase = 'intro' | 'breathing' | 'complete';

interface PresenceAnchorExerciseProps {
  title: string;
  content: PresenceAnchorContent;
  onComplete: () => void;
  onBack?: () => void;
  isRTL?: boolean;
  t?: (key: string) => string;
}

const STYLE_CONFIG = {
  release: {
    glow: 'rgba(99, 102, 241, 0.15)',
    accent: 'text-indigo-400',
    accentBg: 'bg-indigo-500/20',
    border: 'border-indigo-500/30',
    breathCircle: 'border-indigo-500/40',
    breathFill: 'bg-indigo-500/20',
    gradient: 'from-indigo-500/20 via-purple-500/10 to-stone-950',
  },
  strength: {
    glow: 'rgba(244, 63, 94, 0.12)',
    accent: 'text-rose-400',
    accentBg: 'bg-rose-500/20',
    border: 'border-rose-500/30',
    breathCircle: 'border-rose-500/40',
    breathFill: 'bg-rose-500/20',
    gradient: 'from-rose-500/15 via-orange-500/10 to-stone-950',
  },
  gratitude: {
    glow: 'rgba(251, 191, 36, 0.15)',
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    breathCircle: 'border-amber-500/40',
    breathFill: 'bg-amber-500/20',
    gradient: 'from-amber-500/20 via-orange-500/10 to-stone-950',
  },
  grounding: {
    glow: 'rgba(16, 185, 129, 0.12)',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    breathCircle: 'border-emerald-500/40',
    breathFill: 'bg-emerald-500/20',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-stone-950',
  },
};

const GESTURE_EMOJIS = {
  release: '🤚',
  strength: '✊',
  gratitude: '🙏',
  grounding: '🫱',
};

const BREATH_CYCLE_DURATION = 8000; // 4s inhale + 4s exhale

export function PresenceAnchorExercise({
  title,
  content,
  onComplete,
  onBack,
  isRTL = false,
  t = (key: string) => key,
}: PresenceAnchorExerciseProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [breathCount, setBreathCount] = useState(0);
  const [isInhaling, setIsInhaling] = useState(true);
  const [currentExhalePrompt, setCurrentExhalePrompt] = useState('');

  const breathIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const { playChime, playSuccess } = useAudio();

  const config = STYLE_CONFIG[content.style];
  const gestureEmoji = GESTURE_EMOJIS[content.style];
  const totalBreaths = content.breathCycles;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, []);

  const handleStart = useCallback(() => {
    setPhase('breathing');
    setBreathCount(0);
    setIsInhaling(true);
    setCurrentExhalePrompt('');

    let currentBreath = 0;

    const runBreathCycle = () => {
      if (!mountedRef.current) return;

      // Inhale phase
      setIsInhaling(true);
      setCurrentExhalePrompt('');

      // After 4s, switch to exhale with prompt
      setTimeout(() => {
        if (!mountedRef.current) return;
        setIsInhaling(false);
        const prompt = content.exhalePrompts[currentBreath] || '';
        setCurrentExhalePrompt(prompt);
        if (prompt) playChime();
      }, 4000);

      // After full cycle (8s), advance or complete
      setTimeout(() => {
        if (!mountedRef.current) return;
        currentBreath++;
        setBreathCount(currentBreath);

        if (currentBreath >= totalBreaths) {
          if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
          setPhase('complete');
          playSuccess();
        }
      }, BREATH_CYCLE_DURATION);
    };

    // Start first cycle immediately
    runBreathCycle();

    // Set up interval for subsequent cycles
    breathIntervalRef.current = setInterval(runBreathCycle, BREATH_CYCLE_DURATION);
  }, [content.exhalePrompts, totalBreaths, playChime, playSuccess]);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <motion.div
      className={`min-h-screen bg-stone-950 flex flex-col ${isRTL ? 'rtl' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Atmospheric glow - intensifies during breathing */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          opacity: phase === 'breathing' ? 1.2 : 0.8,
        }}
        transition={{ duration: 0.5 }}
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 30%, ${config.glow} 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 30% 70%, ${config.glow} 0%, transparent 40%)
          `,
        }}
      />

      {/* Header */}
      <div className="px-6 pt-6 pb-4 relative z-10">
        {onBack && phase === 'intro' && (
          <button
            onClick={onBack}
            className={`flex items-center gap-1 text-stone-500 hover:text-stone-300 transition-colors text-sm mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {t('exercises.back')}
          </button>
        )}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`w-10 h-10 rounded-xl ${config.accentBg} flex items-center justify-center`}>
            <span className="text-xl">🌊</span>
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-stone-500 text-xs uppercase tracking-wider">Presence Anchor</p>
            <h1 className="text-xl font-semibold text-stone-100">{title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {/* INTRO PHASE */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card variant="glass" padding="lg" className="text-center mb-6">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {gestureEmoji}
                </motion.div>
                <h2 className="text-xl font-semibold text-stone-100 mb-4">
                  Create Your Anchor
                </h2>
                <p className="text-stone-300 mb-4 leading-relaxed">
                  {content.gesture}
                </p>
                <div className={`${config.accentBg} ${config.border} border rounded-xl p-4`}>
                  <p className={`${config.accent} text-sm italic leading-relaxed`}>
                    {content.meaning}
                  </p>
                </div>
              </Card>

              <div className="text-center mb-6">
                <p className="text-stone-400 text-sm">
                  {content.breathCycles} breaths with visualization
                </p>
              </div>

              <Button onClick={handleStart} variant="primary" className="w-full" sound="tap">
                Begin Anchoring
              </Button>
            </motion.div>
          )}

          {/* BREATHING PHASE */}
          {phase === 'breathing' && (
            <motion.div
              key="breathing"
              className="w-full max-w-md text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Breath counter */}
              <div className="mb-6">
                <span className="text-stone-500 text-sm">
                  Breath {Math.min(breathCount + 1, totalBreaths)} of {totalBreaths}
                </span>
              </div>

              {/* Breathing circle */}
              <div className="relative flex items-center justify-center mb-8">
                <motion.div
                  className={`w-52 h-52 rounded-full border-4 ${config.breathCircle}`}
                  animate={{
                    scale: isInhaling ? [1, 1.35] : [1.35, 1],
                    borderWidth: isInhaling ? ['4px', '6px'] : ['6px', '4px'],
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                />

                {/* Inner circle with prompt or gesture */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: isInhaling ? [0.75, 1] : [1, 0.75],
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                >
                  <div className={`w-40 h-40 rounded-full ${config.breathFill} flex items-center justify-center p-4`}>
                    <AnimatePresence mode="wait">
                      {currentExhalePrompt ? (
                        <motion.p
                          key={currentExhalePrompt}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className={`${config.accent} text-sm text-center font-medium leading-snug`}
                        >
                          {currentExhalePrompt}
                        </motion.p>
                      ) : (
                        <motion.span
                          key="gesture"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.6 }}
                          exit={{ opacity: 0 }}
                          className="text-4xl"
                        >
                          {gestureEmoji}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Breathing instruction */}
              <motion.div
                key={isInhaling ? 'inhale' : 'exhale'}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <p className="text-2xl font-light text-stone-100">
                  {isInhaling ? 'Breathe In...' : 'Release...'}
                </p>
              </motion.div>

              {/* Gesture reminder */}
              <p className="text-stone-500 text-sm">
                Hold your anchor gesture
              </p>
            </motion.div>
          )}

          {/* COMPLETE PHASE */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              className="w-full max-w-md text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="text-6xl mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                ⚓
              </motion.div>

              <h2 className="text-2xl font-semibold text-stone-100 mb-4">
                Anchor Set
              </h2>

              <Card variant="glass" padding="lg" className="mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-4xl">{gestureEmoji}</span>
                  <span className="text-2xl text-stone-600">=</span>
                  <span className={`text-lg ${config.accent}`}>{content.meaning}</span>
                </div>
                <p className="text-stone-400 text-sm">
                  {content.anchorMessage}
                </p>
              </Card>

              <Button onClick={handleComplete} variant="primary" className="w-full" sound="success">
                Complete
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default PresenceAnchorExercise;
