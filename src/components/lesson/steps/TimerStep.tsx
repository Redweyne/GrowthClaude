'use client';

// ═══════════════════════════════════════════════════════════════════════════
// TIMER STEP - THE PRACTICE
// ═══════════════════════════════════════════════════════════════════════════
//
// Timed practices: breathing, focus, presence.
// This is where wisdom becomes embodied experience.
//
// Different timer styles for different practices:
// - Breathing: Guided inhale/hold/exhale cycles
// - Focus: Countdown with gentle progress
// - Presence: Minimal, just time passing
// - Countdown: Clear timer display
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { MusicControl } from '@/components/ui/MusicControl';
import { useAudio } from '@/hooks/useAudio';
import { useBreathingGuide } from '@/hooks/useBreathingGuide';
import type { TimerStep as TimerStepType } from '@/types/lessons';

interface TimerStepProps {
  step: TimerStepType;
  onComplete: (completed: boolean) => void;
}

// Format seconds as MM:SS
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
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Audio hooks for meditation experience
  const { startMusic, stopMusic, playSuccess, playComplete, playSingingBowl, playGong } = useAudio();
  const { start: startBreathingGuide, stop: stopBreathingGuide } = useBreathingGuide({
    pattern: '4-7-8', // Relaxation breathing pattern: 4s in, 7s hold, 8s out
    playBowlOnStart: false, // We play it manually
    playBowlOnEnd: false,
  });

  const progress = 1 - (timeRemaining / step.durationSeconds);
  const messages = step.guidanceMessages || [];

  // Start practice after preparation with audio
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('practicing');

      // Play singing bowl to signal start
      playSingingBowl();

      // Start appropriate audio based on timer style
      if (step.timerStyle === 'breathing') {
        startBreathingGuide();
      } else {
        // Start ambient music for focus/presence/countdown
        startMusic('lessonDeep', 2);
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [playSingingBowl, startBreathingGuide, startMusic, step.timerStyle]);

  // Handle completion audio (no cleanup - that kills audio on phase changes)
  useEffect(() => {
    if (phase === 'complete') {
      stopBreathingGuide();
      stopMusic(1);
      playGong(); // Signal completion
      playComplete();
    }
    // NO cleanup - React StrictMode and phase changes were killing audio
  }, [phase, stopBreathingGuide, stopMusic, playGong, playComplete]);

  // Main timer
  useEffect(() => {
    if (phase !== 'practicing' || isPaused) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setPhase('complete');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, isPaused]);

  // Breathing cycle (for breathing style)
  useEffect(() => {
    if (phase !== 'practicing' || step.timerStyle !== 'breathing') return;

    // 4s inhale, 4s hold, 6s exhale = 14s cycle
    const breathCycle = () => {
      setBreathPhase('inhale');
      setTimeout(() => setBreathPhase('hold'), 4000);
      setTimeout(() => setBreathPhase('exhale'), 8000);
    };

    breathCycle();
    const interval = setInterval(breathCycle, 14000);
    return () => clearInterval(interval);
  }, [phase, step.timerStyle]);

  // Rotate guidance messages
  useEffect(() => {
    if (phase !== 'practicing' || messages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % messages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [phase, messages.length]);

  const handleComplete = useCallback((completed: boolean) => {
    onComplete(completed);
  }, [onComplete]);

  // Render timer visualization based on style
  const renderTimerVisualization = () => {
    switch (step.timerStyle) {
      case 'breathing':
        return (
          <div className="relative w-48 h-48 mx-auto">
            {/* Breathing circle */}
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

            {/* Inner glow */}
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

            {/* Breath instruction */}
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
            {/* Progress ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(68, 64, 60, 0.3)"
                strokeWidth="3"
              />
              {/* Progress ring */}
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

            {/* Time display */}
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
            {/* Gentle pulsing circle */}
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

            {/* Inner static circle */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20" />

            {/* Time display */}
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
      {/* Atmospheric glow */}
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
          {/* ─────────────────────────────────────────────────────────────────
              Preparing Phase
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'preparing' && (
            <motion.div
              key="preparing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6"
            >
              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl text-stone-100 font-light"
              >
                {step.title}
              </motion.h2>

              {/* Pulsing preparation indicator */}
              <motion.div
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="text-amber-400 text-sm tracking-[0.2em] uppercase">Ready</span>
              </motion.div>

              {/* Instruction preview */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-stone-400 text-lg"
              >
                {step.instruction}
              </motion.p>

              {/* Duration */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-stone-600 text-sm"
              >
                {formatTime(step.durationSeconds)} duration
              </motion.p>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              Practicing Phase
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'practicing' && (
            <motion.div
              key="practicing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8"
            >
              {/* Title */}
              <h2 className="text-xl text-stone-300 font-light">
                {step.title}
              </h2>

              {/* Timer visualization */}
              {renderTimerVisualization()}

              {/* Guidance message */}
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

              {/* Main instruction */}
              <p className="text-stone-500 text-sm">
                {step.instruction}
              </p>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              Complete Phase
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              {/* Success indicator */}
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

              {/* Completion question if provided */}
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

              {/* Completion buttons */}
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

      {/* Music control - visible during practicing phase */}
      {phase === 'practicing' && <MusicControl currentTrack="lessonDeep" />}
    </div>
  );
}

export default TimerStep;
