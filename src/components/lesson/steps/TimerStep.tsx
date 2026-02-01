'use client';

// ═══════════════════════════════════════════════════════════════════════════
// TIMER STEP - COMPLETELY REWRITTEN FOR iOS SAFARI STABILITY
// ═══════════════════════════════════════════════════════════════════════════
//
// This version prioritizes stability over features:
// - Single timer using requestAnimationFrame (more reliable than setInterval)
// - All audio is optional and called via stable refs
// - Minimal state updates
// - No complex useEffect chains
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui';
import type { TimerStep as TimerStepType } from '@/types/lessons';

interface TimerStepProps {
  step: TimerStepType;
  onComplete: (completed: boolean) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function TimerStep({ step, onComplete }: TimerStepProps) {
  // Core state - kept minimal
  const [phase, setPhase] = useState<'preparing' | 'practicing' | 'complete'>('preparing');
  const [timeRemaining, setTimeRemaining] = useState(step.durationSeconds);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Refs for timer management - no state dependencies
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const breathCycleRef = useRef<number>(0);
  const messageCycleRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  const progress = 1 - (timeRemaining / step.durationSeconds);
  const messages = step.guidanceMessages || [];

  // Stable cleanup function
  const cleanup = useCallback(() => {
    isRunningRef.current = false;
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Main timer loop using requestAnimationFrame
  const tick = useCallback((timestamp: number) => {
    if (!isRunningRef.current) return;

    // Initialize on first tick
    if (lastTickRef.current === 0) {
      lastTickRef.current = timestamp;
      breathCycleRef.current = timestamp;
      messageCycleRef.current = timestamp;
    }

    const elapsed = timestamp - lastTickRef.current;

    // Update time every second
    if (elapsed >= 1000) {
      lastTickRef.current = timestamp;

      setTimeRemaining(prev => {
        const next = prev - 1;
        if (next <= 0) {
          // Timer complete - stop the loop
          cleanup();
          setPhase('complete');
          return 0;
        }
        return next;
      });
    }

    // Breathing cycle (only for breathing style) - 14 second cycle
    if (step.timerStyle === 'breathing') {
      const breathElapsed = timestamp - breathCycleRef.current;
      if (breathElapsed < 4000) {
        setBreathPhase('inhale');
      } else if (breathElapsed < 8000) {
        setBreathPhase('hold');
      } else if (breathElapsed < 14000) {
        setBreathPhase('exhale');
      } else {
        // Reset cycle
        breathCycleRef.current = timestamp;
        setBreathPhase('inhale');
      }
    }

    // Message rotation every 8 seconds
    if (messages.length > 0) {
      const msgElapsed = timestamp - messageCycleRef.current;
      if (msgElapsed >= 8000) {
        messageCycleRef.current = timestamp;
        setCurrentMessageIndex(prev => (prev + 1) % messages.length);
      }
    }

    // Continue loop
    timerRef.current = requestAnimationFrame(tick);
  }, [step.timerStyle, messages.length, cleanup]);

  // Start practice
  const handleStartPractice = useCallback(() => {
    setPhase('practicing');

    // Reset refs
    lastTickRef.current = 0;
    breathCycleRef.current = 0;
    messageCycleRef.current = 0;
    isRunningRef.current = true;

    // Start the timer loop
    timerRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // Cleanup on unmount
  useLayoutEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Handle completion
  const handleComplete = useCallback((completed: boolean) => {
    onComplete(completed);
  }, [onComplete]);

  // Render timer visualization based on style
  const renderTimerVisualization = () => {
    switch (step.timerStyle) {
      case 'breathing':
        return (
          <div className="relative w-48 h-48 mx-auto">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-amber-500/30"
              animate={{
                scale: breathPhase === 'inhale' ? [1, 1.3] :
                       breathPhase === 'hold' ? 1.3 :
                       [1.3, 1],
              }}
              transition={{
                duration: breathPhase === 'inhale' ? 4 :
                          breathPhase === 'hold' ? 4 :
                          6,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-500/20 to-transparent"
              animate={{
                scale: breathPhase === 'inhale' ? [1, 1.2] :
                       breathPhase === 'hold' ? 1.2 :
                       [1.2, 1],
                opacity: breathPhase === 'hold' ? 0.8 : 0.5,
              }}
              transition={{
                duration: breathPhase === 'inhale' ? 4 :
                          breathPhase === 'hold' ? 4 :
                          6,
                ease: 'easeInOut',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                key={breathPhase}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-amber-400 text-xl font-light tracking-wide uppercase"
              >
                {breathPhase === 'inhale' ? 'Breathe in' :
                 breathPhase === 'hold' ? 'Hold' :
                 'Breathe out'}
              </motion.span>
            </div>
          </div>
        );

      case 'focus':
      case 'countdown':
        return (
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(68, 64, 60, 0.3)"
                strokeWidth="3"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#timerGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${progress * 283} 283`}
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-light text-stone-100 tabular-nums">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        );

      case 'presence':
      default:
        return (
          <div className="relative w-48 h-48 mx-auto">
            <motion.div
              className="absolute inset-0 rounded-full border border-purple-500/20"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-light text-stone-300 tabular-nums">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8" data-testid="timer-step">
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: step.timerStyle === 'breathing'
            ? 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(251, 191, 36, 0.12) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(168, 85, 247, 0.12) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-lg w-full relative z-10">
        <AnimatePresence mode="wait">
          {phase === 'preparing' && (
            <motion.div
              key="preparing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6"
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl text-stone-100 font-light"
              >
                {step.title}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-amber-500/10 to-stone-900 border border-amber-500/20 flex items-center justify-center"
              >
                <span className="text-3xl font-light text-amber-400 tabular-nums">
                  {formatTime(step.durationSeconds)}
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-stone-400 text-lg"
              >
                {step.instruction}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <Button
                  size="lg"
                  glow
                  onClick={handleStartPractice}
                  className="w-full group"
                  data-testid="timer-start-btn"
                >
                  <Play size={20} className="mr-2" />
                  Start Practice
                  <ChevronRight
                    size={18}
                    className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                  />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {phase === 'practicing' && (
            <motion.div
              key="practicing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8"
            >
              <h2 className="text-xl text-stone-300 font-light">
                {step.title}
              </h2>

              {renderTimerVisualization()}

              <AnimatePresence mode="wait">
                {messages.length > 0 && (
                  <motion.p
                    key={currentMessageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-stone-400 text-lg italic min-h-[2em]"
                  >
                    {messages[currentMessageIndex]}
                  </motion.p>
                )}
              </AnimatePresence>

              <p className="text-stone-500 text-sm">
                {step.instruction}
              </p>
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
              >
                <span className="text-4xl">✓</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-stone-200"
              >
                Practice complete
              </motion.p>

              {step.completionQuestion && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-stone-400"
                >
                  {step.completionQuestion}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3 pt-4"
              >
                <Button
                  size="lg"
                  onClick={() => handleComplete(true)}
                  glow
                  className="w-full group"
                  data-testid="timer-complete-btn"
                >
                  <Check size={18} className="mr-2" />
                  I practiced fully
                  <ChevronRight
                    size={18}
                    className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                  />
                </Button>

                {step.allowStruggle && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => handleComplete(false)}
                    className="w-full"
                  >
                    <X size={18} className="mr-2 opacity-60" />
                    I struggled
                  </Button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TimerStep;
