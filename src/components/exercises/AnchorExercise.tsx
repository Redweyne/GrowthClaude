'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { AnchorContent } from '@/types/dailyPractice';

// ═══════════════════════════════════════════════════════════════════════════
// ANCHOR EXERCISE
// Create a physical anchor with breath work to embody the wisdom
// No "close your eyes" - users read while doing
// ═══════════════════════════════════════════════════════════════════════════

type AnchorPhase = 'intro' | 'breathing' | 'complete';

interface AnchorExerciseProps {
  title: string;
  content: AnchorContent;
  onComplete: () => void;
  onBack?: () => void;
}

export function AnchorExercise({
  title,
  content,
  onComplete,
  onBack,
}: AnchorExerciseProps) {
  const [phase, setPhase] = useState<AnchorPhase>('intro');
  const [breathCount, setBreathCount] = useState(0);
  const [isInhaling, setIsInhaling] = useState(true);
  const [isHolding, setIsHolding] = useState(false);

  // Use refs to track state without triggering re-renders
  const breathCountRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const totalBreaths = content.repetitions || 3;
  const breathCycleDuration = 8000; // 4s inhale + 4s exhale

  // Cleanup function
  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // Start breathing when entering breathing phase - only runs once
  useEffect(() => {
    if (phase !== 'breathing') return;

    // Reset
    breathCountRef.current = 0;
    setBreathCount(0);

    const runBreathCycle = () => {
      // Check if we should stop
      if (breathCountRef.current >= totalBreaths) {
        cleanup();
        setPhase('complete');
        return;
      }

      setIsInhaling(true);
      setIsHolding(false);

      // Hold after 3.5s
      const holdTimeout = setTimeout(() => {
        setIsHolding(true);
      }, 3500);
      timeoutsRef.current.push(holdTimeout);

      // Start exhale after 4s
      const exhaleTimeout = setTimeout(() => {
        setIsInhaling(false);
        setIsHolding(false);
      }, 4000);
      timeoutsRef.current.push(exhaleTimeout);

      // Complete breath after 8s
      const completeTimeout = setTimeout(() => {
        breathCountRef.current += 1;
        setBreathCount(breathCountRef.current);

        if (breathCountRef.current >= totalBreaths) {
          cleanup();
          setPhase('complete');
        }
      }, breathCycleDuration);
      timeoutsRef.current.push(completeTimeout);
    };

    // Start first cycle immediately
    runBreathCycle();

    // Set up interval for subsequent cycles
    intervalRef.current = setInterval(runBreathCycle, breathCycleDuration);

    return cleanup;
  }, [phase, totalBreaths]); // Only depends on phase and totalBreaths

  const handleStart = () => {
    setPhase('breathing');
    setBreathCount(0);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <motion.div
      className="min-h-screen bg-stone-950 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        {onBack && phase === 'intro' && (
          <button
            onClick={onBack}
            className="text-stone-500 hover:text-stone-300 transition-colors text-sm mb-4"
          >
            ← Back
          </button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-xl">🫁</span>
          </div>
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-wider">Anchor</p>
            <h1 className="text-xl font-semibold text-stone-100">{title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Intro Phase */}
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
                  className="text-5xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🤚
                </motion.div>
                <h2 className="text-xl font-semibold text-stone-100 mb-4">
                  Create Your Anchor
                </h2>
                <p className="text-stone-300 mb-4">
                  {content.gesture}
                </p>
                <p className="text-stone-400 text-sm mb-3">
                  {content.meaning}
                </p>
              </Card>

              <Card variant="warm" padding="md" className="mb-6">
                <p className="text-center text-stone-200 italic text-sm">
                  {content.breathPattern}
                </p>
              </Card>

              <Button onClick={handleStart} variant="primary" className="w-full">
                Begin {totalBreaths} Breaths
              </Button>
            </motion.div>
          )}

          {/* Breathing Phase */}
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
                  className="w-48 h-48 rounded-full border-4 border-violet-500/30"
                  animate={{
                    scale: isInhaling ? [1, 1.3] : [1.3, 1],
                    borderColor: isInhaling
                      ? ['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0.6)']
                      : ['rgba(139, 92, 246, 0.6)', 'rgba(139, 92, 246, 0.3)'],
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                />

                {/* Inner circle with meaning */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: isInhaling ? [0.8, 1] : [1, 0.8],
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                >
                  <div className="w-32 h-32 rounded-full bg-violet-500/10 flex items-center justify-center p-4">
                    <p className="text-violet-300 text-xs text-center font-medium">
                      {content.meaning}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Breathing instruction */}
              <motion.div
                key={isInhaling ? 'inhale' : 'exhale'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <p className="text-2xl font-light text-stone-100">
                  {isHolding ? 'Hold...' : isInhaling ? 'Breathe in...' : 'Breathe out...'}
                </p>
              </motion.div>

              {/* Gesture reminder */}
              <p className="text-stone-500 text-sm">
                Keep your anchor gesture while breathing
              </p>
            </motion.div>
          )}

          {/* Complete Phase */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              className="w-full max-w-md text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                className="text-6xl mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                ✨
              </motion.div>

              <h2 className="text-2xl font-semibold text-stone-100 mb-4">
                Anchor Set
              </h2>

              <Card variant="glass" padding="lg" className="mb-6">
                <p className="text-stone-300 mb-4">
                  Your gesture is now linked to today&apos;s wisdom. Use it whenever you need a reminder.
                </p>
                <p className="text-amber-400 font-medium italic text-sm">
                  {content.meaning}
                </p>
              </Card>

              <Button onClick={handleComplete} variant="primary" className="w-full" sound="success">
                Complete Exercise
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default AnchorExercise;
