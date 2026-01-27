'use client';

// ═══════════════════════════════════════════════════════════════════════════
// TIMER STEP - THE PRACTICE (FIXED VERSION)
// ═══════════════════════════════════════════════════════════════════════════
//
// FIXED: All timers now properly tracked with refs to prevent page refresh
// - Main timer uses ref-based state tracking
// - Breathing cycle properly cleans up all timeouts
// - No state updates inside other state updates
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { MusicControl } from '@/components/ui/MusicControl';
import { useAudio } from '@/hooks/useAudio';
import { useBreathingGuide } from '@/hooks/useBreathingGuide';
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
  const [phase, setPhase] = useState<'preparing' | 'practicing' | 'complete'>('preparing');
  const [timeRemaining, setTimeRemaining] = useState(step.durationSeconds);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Use refs to track all timers for proper cleanup
  const mainTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const messageIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef(phase);
  const timeRemainingRef = useRef(timeRemaining);

  // Keep refs in sync
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  const { startMusic, stopMusic, playComplete, playSingingBowl, playGong } = useAudio();
  const { start: startBreathingGuide, stop: stopBreathingGuide } = useBreathingGuide({
    pattern: '4-7-8',
    playBowlOnStart: false,
    playBowlOnEnd: false,
  });

  const progress = 1 - (timeRemaining / step.durationSeconds);
  const messages = step.guidanceMessages || [];

  // Cleanup all timers
  const cleanupAllTimers = useCallback(() => {
    if (mainTimerRef.current) {
      clearInterval(mainTimerRef.current);
      mainTimerRef.current = null;
    }
    if (breathIntervalRef.current) {
      clearInterval(breathIntervalRef.current);
      breathIntervalRef.current = null;
    }
    breathTimeoutsRef.current.forEach(t => clearTimeout(t));
    breathTimeoutsRef.current = [];
    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current);
      messageIntervalRef.current = null;
    }
  }, []);

  // Handle completion
  const handleTimerComplete = useCallback(() => {
    cleanupAllTimers();
    setPhase('complete');
  }, [cleanupAllTimers]);

  // START PRACTICE
  const handleStartPractice = useCallback(() => {
    setPhase('practicing');
    playSingingBowl();

    if (step.timerStyle === 'breathing') {
      startBreathingGuide();
    } else {
      startMusic('lessonDeep', 2);
    }
  }, [playSingingBowl, startBreathingGuide, startMusic, step.timerStyle]);

  // Handle completion audio
  useEffect(() => {
    if (phase === 'complete') {
      stopBreathingGuide();
      stopMusic(1);
      playGong();
      playComplete();
    }
  }, [phase, stopBreathingGuide, stopMusic, playGong, playComplete]);

  // Main timer - uses refs to avoid stale closures
  useEffect(() => {
    if (phase !== 'practicing') return;

    mainTimerRef.current = setInterval(() => {
      // Read from ref for current value
      const current = timeRemainingRef.current;
      if (current <= 1) {
        // Don't call setPhase inside setTimeRemaining
        setTimeRemaining(0);
        // Use setTimeout to break out of the state update cycle
        setTimeout(() => handleTimerComplete(), 0);
      } else {
        setTimeRemaining(current - 1);
      }
    }, 1000);

    return () => {
      if (mainTimerRef.current) {
        clearInterval(mainTimerRef.current);
        mainTimerRef.current = null;
      }
    };
  }, [phase, handleTimerComplete]);

  // Breathing cycle - properly tracks all timeouts
  useEffect(() => {
    if (phase !== 'practicing' || step.timerStyle !== 'breathing') return;

    const runBreathCycle = () => {
      // Check if we're still in practicing phase
      if (phaseRef.current !== 'practicing') return;

      setBreathPhase('inhale');

      const holdTimeout = setTimeout(() => {
        if (phaseRef.current === 'practicing') {
          setBreathPhase('hold');
        }
      }, 4000);
      breathTimeoutsRef.current.push(holdTimeout);

      const exhaleTimeout = setTimeout(() => {
        if (phaseRef.current === 'practicing') {
          setBreathPhase('exhale');
        }
      }, 8000);
      breathTimeoutsRef.current.push(exhaleTimeout);
    };

    // Start first cycle
    runBreathCycle();

    // Set up interval for subsequent cycles
    breathIntervalRef.current = setInterval(() => {
      // Clear old timeouts before starting new cycle
      breathTimeoutsRef.current.forEach(t => clearTimeout(t));
      breathTimeoutsRef.current = [];
      runBreathCycle();
    }, 14000);

    return () => {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
        breathIntervalRef.current = null;
      }
      breathTimeoutsRef.current.forEach(t => clearTimeout(t));
      breathTimeoutsRef.current = [];
    };
  }, [phase, step.timerStyle]);

  // Rotate guidance messages
  useEffect(() => {
    if (phase !== 'practicing' || messages.length === 0) return;

    messageIntervalRef.current = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % messages.length);
    }, 8000);

    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
        messageIntervalRef.current = null;
      }
    };
  }, [phase, messages.length]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanupAllTimers;
  }, [cleanupAllTimers]);

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
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#timerGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${progress * 283} 283`}
                initial={{ strokeDasharray: '0 283' }}
                animate={{ strokeDasharray: `${progress * 283} 283` }}
                transition={{ duration: 0.5 }}
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
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
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

      {phase === 'practicing' && <MusicControl currentTrack="lessonDeep" />}
    </div>
  );
}

export default TimerStep;
