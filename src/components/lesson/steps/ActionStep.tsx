'use client';

// ═══════════════════════════════════════════════════════════════════════════
// ACTION STEP - THE SACRED PRACTICE
// ═══════════════════════════════════════════════════════════════════════════
//
// This is not a countdown timer. This is guided immersion in presence.
// Each action type creates a unique atmospheric experience.
// The timer becomes invisible - presence becomes everything.
//
// Visual principles:
// - Deep immersion in each practice type
// - Visualizations that guide without distracting
// - Time fades into the background
// - The experience breathes with you
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui';
import type { Lesson } from '@/types';

interface ActionStepProps {
  lesson: Lesson;
  onComplete: (completed: boolean) => void;
  onStartAmbience?: () => void;
  onKeystroke?: () => void;
}

type Phase = 'preparing' | 'practicing' | 'integrating' | 'complete';
type ActionType = 'write' | 'reflect' | 'observe' | 'breathe' | 'act';

// Guidance messages for each action type
const GUIDANCE_MESSAGES: Record<ActionType, string[]> = {
  breathe: [
    'Let your breath find its natural rhythm...',
    'Each breath anchors you deeper into presence...',
    'There is nothing to fix. Just breathe...',
    'Your breath knows the way...',
    'Let go of the last breath. Welcome this one...',
  ],
  reflect: [
    'Turn your attention inward...',
    'What arises when you sit with this?',
    'Notice without judging...',
    'Let the question work on you...',
    'The answer is already forming...',
  ],
  observe: [
    'Soften your gaze...',
    'Notice what you usually miss...',
    'Everything is speaking if you listen...',
    'Stay with what you see...',
    'Let awareness expand...',
  ],
  write: [
    'Let the words come without editing...',
    'Write from the body, not the mind...',
    'There is no wrong answer here...',
    'Follow the thread wherever it leads...',
    'Your hand knows what to write...',
  ],
  act: [
    'Feel the energy building...',
    'You are ready for this...',
    'Action flows from stillness...',
    'Trust your instincts...',
    'Move with intention...',
  ],
};

// Integration messages
const INTEGRATION_MESSAGES = [
  'Let this settle into your being...',
  'Carry this presence with you...',
  'This moment is now part of you...',
  'The practice continues in daily life...',
];

// Get deterministic integration message based on lesson
function getIntegrationMessage(lessonId: string): string {
  let hash = 0;
  for (let i = 0; i < lessonId.length; i++) {
    const char = lessonId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return INTEGRATION_MESSAGES[Math.abs(hash) % INTEGRATION_MESSAGES.length];
}

// Springs
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  soft: { type: 'spring' as const, stiffness: 80, damping: 20 },
};

export function ActionStep({ lesson, onComplete, onStartAmbience }: ActionStepProps) {
  const [phase, setPhase] = useState<Phase>('preparing');
  const [timeRemaining, setTimeRemaining] = useState(lesson.actionDurationSeconds);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [currentGuidance, setCurrentGuidance] = useState('');
  const [guidanceIndex, setGuidanceIndex] = useState(0);
  const [integrationMessage, setIntegrationMessage] = useState('');
  const hasStartedRef = useRef(false);

  const actionType = (lesson.actionType as ActionType) || 'reflect';
  const totalDuration = lesson.actionDurationSeconds;
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;

  // Start ambience
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      onStartAmbience?.();
    }
  }, [onStartAmbience]);

  // Preparation phase
  useEffect(() => {
    if (phase === 'preparing') {
      const messages = GUIDANCE_MESSAGES[actionType];
      setCurrentGuidance(messages[0]);
      const timer = setTimeout(() => setPhase('practicing'), 3500);
      return () => clearTimeout(timer);
    }
  }, [phase, actionType]);

  // Main practice timer
  useEffect(() => {
    if (phase !== 'practicing') return;
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setPhase('integrating');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase, timeRemaining]);

  // Breathing rhythm (4-4-6 pattern for better UX)
  useEffect(() => {
    if (phase !== 'practicing' || actionType !== 'breathe') return;

    let mounted = true;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const clearAllTimers = () => {
      timers.forEach(t => clearTimeout(t));
      timers.length = 0;
    };

    const breathCycle = () => {
      if (!mounted) return;
      setBreathPhase('inhale');

      const t1 = setTimeout(() => {
        if (!mounted) return;
        setBreathPhase('hold');

        const t2 = setTimeout(() => {
          if (!mounted) return;
          setBreathPhase('exhale');

          const t3 = setTimeout(() => {
            if (!mounted) return;
            setBreathPhase('rest');
            setBreathCount(prev => prev + 1);

            const t4 = setTimeout(() => {
              if (mounted) breathCycle();
            }, 800);
            timers.push(t4);
          }, 6000); // Exhale
          timers.push(t3);
        }, 4000); // Hold
        timers.push(t2);
      }, 4000); // Inhale
      timers.push(t1);
    };

    breathCycle();

    return () => {
      mounted = false;
      clearAllTimers();
    };
  }, [phase, actionType]);

  // Rotate guidance messages
  useEffect(() => {
    if (phase !== 'practicing') return;
    const messages = GUIDANCE_MESSAGES[actionType];
    const interval = setInterval(() => {
      setGuidanceIndex(prev => {
        const next = (prev + 1) % messages.length;
        setCurrentGuidance(messages[next]);
        return next;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [phase, actionType]);

  // Integration phase
  useEffect(() => {
    if (phase === 'integrating') {
      setIntegrationMessage(getIntegrationMessage(lesson.id));
      const timer = setTimeout(() => setPhase('complete'), 4000);
      return () => clearTimeout(timer);
    }
  }, [phase, lesson.id]);

  const handleComplete = useCallback((completed: boolean) => {
    onComplete(completed);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    setPhase('integrating');
  }, []);

  const getActionIcon = () => {
    switch (actionType) {
      case 'breathe': return '🌬️';
      case 'reflect': return '🧘';
      case 'observe': return '👁️';
      case 'write': return '✍️';
      case 'act': return '⚡';
      default: return '🎯';
    }
  };

  const getActionLabel = () => {
    switch (actionType) {
      case 'breathe': return 'Breathing Practice';
      case 'reflect': return 'Inner Reflection';
      case 'observe': return 'Mindful Observation';
      case 'write': return 'Free Writing';
      case 'act': return 'Mindful Action';
      default: return 'Practice';
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {/* ─────────────────────────────────────────────────────────────────
            Preparing Phase - Build anticipation
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'preparing' && (
          <motion.div
            key="preparing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Pulsing icon with glow */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...springs.gentle }}
              className="relative w-28 h-28 mx-auto mb-10"
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Icon container */}
              <motion.div
                className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-5xl">{getActionIcon()}</span>
              </motion.div>
            </motion.div>

            {/* Action label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-medium text-amber-400 mb-4 tracking-[0.2em] uppercase"
            >
              {getActionLabel()}
            </motion.p>

            {/* Preparation message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-stone-300 font-light max-w-md"
            >
              {currentGuidance}
            </motion.p>

            {/* Loading bar */}
            <motion.div
              className="w-48 h-1 bg-stone-800 rounded-full mx-auto mt-12 overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3.5, ease: 'linear' }}
                style={{
                  boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)',
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            Practicing Phase - Deep Immersion
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'practicing' && (
          <motion.div
            key="practicing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg text-center"
          >
            {/* The action prompt */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <p className="text-xl sm:text-2xl text-stone-100 leading-relaxed font-light">
                {lesson.actionPrompt}
              </p>
            </motion.div>

            {/* Visualization based on action type */}
            {actionType === 'breathe' ? (
              <BreathingVisualization breathPhase={breathPhase} breathCount={breathCount} />
            ) : actionType === 'observe' ? (
              <ObservationVisualization />
            ) : actionType === 'reflect' ? (
              <ReflectionVisualization />
            ) : (
              <GeneralVisualization progress={progress} />
            )}

            {/* Floating guidance */}
            <AnimatePresence mode="wait">
              <motion.p
                key={guidanceIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-stone-500 text-sm italic mt-10 h-6"
              >
                {currentGuidance}
              </motion.p>
            </AnimatePresence>

            {/* Time and progress - subtle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-10 space-y-4"
            >
              {/* Progress bar */}
              <div className="w-full h-1 bg-stone-800/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500/40 to-orange-500/40 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Time remaining */}
              <p className="text-stone-600 text-xs">
                {formatTime(timeRemaining)} remaining
              </p>

              {/* Skip option */}
              <button
                onClick={handleSkip}
                className="text-stone-700 hover:text-stone-500 text-xs transition-colors"
              >
                I&apos;m ready to continue
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            Integrating Phase - Let it settle
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'integrating' && (
          <motion.div
            key="integrating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            {/* Settling orb */}
            <motion.div
              className="relative w-28 h-28 mx-auto mb-10"
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              {/* Outer glow */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Inner orb */}
              <motion.div
                className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500/20 to-amber-500/10"
                animate={{
                  scale: [1, 0.95, 1],
                  opacity: [0.6, 0.9, 0.6],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Core */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-400/30 to-amber-400/20 flex items-center justify-center">
                <motion.div
                  className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-amber-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    boxShadow: '0 0 20px rgba(167, 139, 250, 0.5)',
                  }}
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-stone-300 font-light"
            >
              {integrationMessage}
            </motion.p>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            Complete Phase - Acknowledge
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md text-center"
          >
            {/* Completion icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...springs.gentle }}
              className="relative w-20 h-20 mx-auto mb-8"
            >
              <div
                className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500/20 to-stone-900 border border-emerald-500/30 flex items-center justify-center"
                style={{
                  boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)',
                }}
              >
                <span className="text-4xl">✨</span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-stone-200 mb-10"
            >
              Practice complete
            </motion.p>

            {/* Completion options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Button
                size="lg"
                glow
                onClick={() => handleComplete(true)}
                className="w-full group"
              >
                <Check size={18} className="mr-2 text-emerald-400" />
                I practiced fully
                <ChevronRight
                  size={18}
                  className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                />
              </Button>

              <button
                onClick={() => handleComplete(false)}
                className="w-full py-3 text-stone-500 hover:text-stone-400 text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Minus size={14} />
                I struggled with this one
              </button>

              <p className="text-xs text-stone-600 mt-4">
                Honesty is part of the practice
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VISUALIZATION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface BreathingVisualizationProps {
  breathPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
  breathCount: number;
}

function BreathingVisualization({ breathPhase, breathCount }: BreathingVisualizationProps) {
  const getPhaseInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe in...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Release...';
      case 'rest': return '...';
    }
  };

  const getScale = () => {
    switch (breathPhase) {
      case 'inhale': return 1.35;
      case 'hold': return 1.35;
      case 'exhale': return 1;
      case 'rest': return 1;
    }
  };

  const getDuration = () => {
    switch (breathPhase) {
      case 'inhale': return 4;
      case 'hold': return 0.3;
      case 'exhale': return 6;
      case 'rest': return 0.3;
    }
  };

  return (
    <div className="relative">
      {/* Breathing circles */}
      <div className="relative w-52 h-52 mx-auto">
        {/* Outermost ring - ethereal glow */}
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: getScale() * 1.1,
            opacity: breathPhase === 'hold' ? 0.8 : 0.4,
          }}
          transition={{ duration: getDuration(), ease: 'easeInOut' }}
        />

        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid rgba(167, 139, 250, 0.3)',
          }}
          animate={{
            scale: getScale(),
            borderColor: breathPhase === 'hold'
              ? 'rgba(167, 139, 250, 0.5)'
              : 'rgba(167, 139, 250, 0.3)',
            boxShadow: breathPhase === 'hold'
              ? '0 0 40px rgba(167, 139, 250, 0.3)'
              : '0 0 20px rgba(167, 139, 250, 0.15)',
          }}
          transition={{ duration: getDuration(), ease: 'easeInOut' }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute inset-6 rounded-full bg-purple-500/5"
          animate={{
            scale: getScale(),
            opacity: breathPhase === 'hold' ? 0.6 : 0.3,
          }}
          transition={{ duration: getDuration(), ease: 'easeInOut', delay: 0.1 }}
        />

        {/* Inner ring */}
        <motion.div
          className="absolute inset-12 rounded-full bg-gradient-to-br from-purple-500/10 to-amber-500/5"
          animate={{
            scale: getScale(),
            opacity: breathPhase === 'hold' ? 0.7 : 0.4,
          }}
          transition={{ duration: getDuration(), ease: 'easeInOut', delay: 0.2 }}
        />

        {/* Core with breath indicator */}
        <motion.div
          className="absolute inset-[4.5rem] rounded-full bg-gradient-to-br from-purple-400/30 to-amber-400/20 flex items-center justify-center"
          animate={{
            scale: getScale() * 0.85,
          }}
          transition={{ duration: getDuration(), ease: 'easeInOut', delay: 0.3 }}
        >
          <motion.div
            className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-amber-400"
            animate={{
              opacity: breathPhase === 'hold' ? 1 : 0.7,
            }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: '0 0 25px rgba(167, 139, 250, 0.5), 0 0 50px rgba(251, 191, 36, 0.3)',
            }}
          />
        </motion.div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-400/50"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [0, Math.cos((i / 8) * Math.PI * 2) * (getScale() * 50)],
              y: [0, Math.sin((i / 8) * Math.PI * 2) * (getScale() * 50)],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: getDuration() * 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Phase instruction */}
      <AnimatePresence mode="wait">
        <motion.p
          key={breathPhase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-lg text-purple-300 mt-8 h-7"
        >
          {getPhaseInstruction()}
        </motion.p>
      </AnimatePresence>

      {/* Breath count */}
      <p className="text-stone-600 text-sm mt-4">
        {breathCount} {breathCount === 1 ? 'breath' : 'breaths'} complete
      </p>
    </div>
  );
}

function ObservationVisualization() {
  return (
    <div className="relative w-52 h-52 mx-auto">
      {/* Radiating awareness rings */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(34, 211, 238, 0.1)',
          }}
          animate={{
            scale: [1 + i * 0.15, 1.4 + i * 0.15, 1 + i * 0.15],
            opacity: [0.3, 0.1, 0.3],
            borderColor: [
              'rgba(34, 211, 238, 0.1)',
              'rgba(34, 211, 238, 0.2)',
              'rgba(34, 211, 238, 0.1)',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Inner glow */}
      <motion.div
        className="absolute inset-12 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center eye */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-5xl"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(34, 211, 238, 0.4))',
          }}
        >
          👁️
        </motion.div>
      </div>
    </div>
  );
}

function ReflectionVisualization() {
  return (
    <div className="relative w-52 h-52 mx-auto">
      {/* Gentle pulsing aura */}
      <motion.div
        className="absolute -inset-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Outer circle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/5 to-amber-500/5"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-10 rounded-full bg-gradient-to-br from-purple-500/10 to-amber-500/10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(167, 139, 250, 0.4))',
          }}
        >
          🧘
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-purple-400/40"
          style={{
            top: '50%',
            left: '50%',
          }}
          animate={{
            x: [0, Math.cos((i / 5) * Math.PI * 2) * 60, 0],
            y: [0, Math.sin((i / 5) * Math.PI * 2) * 60, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 1.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

interface GeneralVisualizationProps {
  progress: number;
}

function GeneralVisualization({ progress }: GeneralVisualizationProps) {
  return (
    <div className="relative w-52 h-52 mx-auto">
      {/* Ambient glow */}
      <motion.div
        className="absolute -inset-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Circular progress */}
      <svg className="w-full h-full transform -rotate-90">
        {/* Background ring */}
        <circle
          cx="104"
          cy="104"
          r="96"
          fill="none"
          stroke="rgba(68, 64, 60, 0.3)"
          strokeWidth="6"
        />
        {/* Progress ring */}
        <motion.circle
          cx="104"
          cy="104"
          r="96"
          fill="none"
          stroke="url(#actionProgressGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={603}
          strokeDashoffset={603 - (603 * progress) / 100}
          transition={{ duration: 0.5 }}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))',
          }}
        />
        <defs>
          <linearGradient id="actionProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.7)" />
            <stop offset="100%" stopColor="rgba(249, 115, 22, 0.7)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-5xl"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.4))',
          }}
        >
          🎯
        </motion.div>
      </div>
    </div>
  );
}

export default ActionStep;
