'use client';

// ============================================================================
// ACTION STEP - THE GUIDED PRACTICE
// This is not a countdown timer. This is a guided meditation.
// Each action type creates a unique immersive experience.
// The timer becomes invisible - presence becomes everything.
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Integration messages when practice ends
const INTEGRATION_MESSAGES = [
  'Let this settle into your being...',
  'Carry this presence with you...',
  'This moment is now part of you...',
  'The practice continues in daily life...',
];

export function ActionStep({ lesson, onComplete, onStartAmbience, onKeystroke }: ActionStepProps) {
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

  // Start ambience when component mounts
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      onStartAmbience?.();
    }
  }, [onStartAmbience]);

  // Preparation phase timing
  useEffect(() => {
    if (phase === 'preparing') {
      // Show first guidance
      const messages = GUIDANCE_MESSAGES[actionType];
      setCurrentGuidance(messages[0]);

      const timer = setTimeout(() => {
        setPhase('practicing');
      }, 3000);
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

  // Breathing rhythm for breathe actions (4-7-8 pattern)
  useEffect(() => {
    if (phase !== 'practicing' || actionType !== 'breathe') return;

    const breathCycle = () => {
      // Inhale for 4 seconds
      setBreathPhase('inhale');
      setTimeout(() => {
        // Hold for 7 seconds (shortened for UX)
        setBreathPhase('hold');
        setTimeout(() => {
          // Exhale for 8 seconds (shortened for UX)
          setBreathPhase('exhale');
          setTimeout(() => {
            setBreathPhase('rest');
            setBreathCount(prev => prev + 1);
            setTimeout(() => {
              if (phase === 'practicing') {
                breathCycle();
              }
            }, 1000); // Brief rest
          }, 5000); // Exhale
        }, 3000); // Hold
      }, 4000); // Inhale
    };

    breathCycle();
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
    }, 12000); // Change every 12 seconds

    return () => clearInterval(interval);
  }, [phase, actionType]);

  // Integration phase
  useEffect(() => {
    if (phase === 'integrating') {
      setIntegrationMessage(
        INTEGRATION_MESSAGES[Math.floor(Math.random() * INTEGRATION_MESSAGES.length)]
      );

      const timer = setTimeout(() => {
        setPhase('complete');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Handle completion
  const handleComplete = useCallback((completed: boolean) => {
    onComplete(completed);
  }, [onComplete]);

  // Handle early skip
  const handleSkip = useCallback(() => {
    setPhase('integrating');
  }, []);

  // Get action-specific icon
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

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {/* Preparing Phase */}
        {phase === 'preparing' && (
          <motion.div
            key="preparing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Pulsing icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl mb-8"
            >
              <motion.span
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {getActionIcon()}
              </motion.span>
            </motion.div>

            {/* Action label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-medium text-indigo-400 mb-4 tracking-widest uppercase"
            >
              {actionType === 'breathe' ? 'Breathing Practice' :
               actionType === 'reflect' ? 'Inner Reflection' :
               actionType === 'observe' ? 'Mindful Observation' :
               actionType === 'write' ? 'Free Writing' :
               'Mindful Action'}
            </motion.p>

            {/* Preparation message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-zinc-300 font-light"
            >
              {currentGuidance}
            </motion.p>

            {/* Subtle loading indicator */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
              className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mt-12 max-w-[200px] mx-auto rounded-full"
            />
          </motion.div>
        )}

        {/* Practicing Phase */}
        {phase === 'practicing' && (
          <motion.div
            key="practicing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg text-center"
          >
            {/* The action prompt - sacred instruction */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <p className="text-xl sm:text-2xl text-white leading-relaxed font-light">
                {lesson.actionPrompt}
              </p>
            </motion.div>

            {/* Action-specific visualization */}
            {actionType === 'breathe' ? (
              <BreathingVisualization
                breathPhase={breathPhase}
                breathCount={breathCount}
              />
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
                className="text-zinc-400 text-sm italic mt-8 h-6"
              >
                {currentGuidance}
              </motion.p>
            </AnimatePresence>

            {/* Subtle time indicator - not prominent */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 space-y-4"
            >
              {/* Progress bar - very subtle */}
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500/50 to-purple-500/50"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Time remaining - subdued */}
              <p className="text-zinc-600 text-xs">
                {formatTime(timeRemaining)} remaining
              </p>

              {/* Skip option - very subtle */}
              <button
                onClick={handleSkip}
                className="text-zinc-700 hover:text-zinc-500 text-xs transition-colors"
              >
                I&apos;m ready to continue
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Integrating Phase */}
        {phase === 'integrating' && (
          <motion.div
            key="integrating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            {/* Settling animation */}
            <motion.div
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: [1, 0.9, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-zinc-300 font-light"
            >
              {integrationMessage}
            </motion.p>
          </motion.div>
        )}

        {/* Complete Phase */}
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
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-5xl mb-6"
            >
              ✨
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white mb-8"
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
              <motion.button
                onClick={() => handleComplete(true)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-lg hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                I practiced fully
              </motion.button>

              <button
                onClick={() => handleComplete(false)}
                className="w-full py-3 text-zinc-500 hover:text-zinc-400 text-sm transition-colors"
              >
                I struggled with this one
              </button>

              <p className="text-xs text-zinc-600 mt-4">
                Honesty is part of the practice
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// VISUALIZATION COMPONENTS
// ============================================================================

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
      case 'inhale': return 1.4;
      case 'hold': return 1.4;
      case 'exhale': return 1;
      case 'rest': return 1;
    }
  };

  return (
    <div className="relative">
      {/* Breathing circles */}
      <div className="relative w-48 h-48 mx-auto">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-indigo-500/20"
          animate={{
            scale: getScale(),
            borderColor: breathPhase === 'hold'
              ? 'rgba(99, 102, 241, 0.4)'
              : 'rgba(99, 102, 241, 0.2)'
          }}
          transition={{ duration: breathPhase === 'inhale' ? 4 : breathPhase === 'exhale' ? 5 : 0.3 }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute inset-4 rounded-full border border-purple-500/20"
          animate={{
            scale: getScale(),
            opacity: breathPhase === 'hold' ? 0.6 : 0.3
          }}
          transition={{ duration: breathPhase === 'inhale' ? 4 : breathPhase === 'exhale' ? 5 : 0.3, delay: 0.1 }}
        />

        {/* Inner circle */}
        <motion.div
          className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
          animate={{
            scale: getScale(),
            opacity: breathPhase === 'hold' ? 0.8 : 0.4
          }}
          transition={{ duration: breathPhase === 'inhale' ? 4 : breathPhase === 'exhale' ? 5 : 0.3, delay: 0.2 }}
        />

        {/* Center core */}
        <motion.div
          className="absolute inset-16 rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-400/30 flex items-center justify-center"
          animate={{
            scale: getScale() * 0.9,
          }}
          transition={{ duration: breathPhase === 'inhale' ? 4 : breathPhase === 'exhale' ? 5 : 0.3, delay: 0.3 }}
        >
          <span className="text-2xl">🌬️</span>
        </motion.div>
      </div>

      {/* Phase instruction */}
      <AnimatePresence mode="wait">
        <motion.p
          key={breathPhase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-lg text-indigo-300 mt-6"
        >
          {getPhaseInstruction()}
        </motion.p>
      </AnimatePresence>

      {/* Breath count */}
      <p className="text-zinc-600 text-sm mt-4">
        {breathCount} {breathCount === 1 ? 'breath' : 'breaths'} complete
      </p>
    </div>
  );
}

function ObservationVisualization() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Radiating awareness rings */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-indigo-500/10"
          animate={{
            scale: [1 + i * 0.2, 1.5 + i * 0.2, 1 + i * 0.2],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Center eye */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-5xl"
        >
          👁️
        </motion.div>
      </div>
    </div>
  );
}

function ReflectionVisualization() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Gentle pulsing circle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/5 to-indigo-500/5"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl"
        >
          🧘
        </motion.div>
      </div>
    </div>
  );
}

interface GeneralVisualizationProps {
  progress: number;
}

function GeneralVisualization({ progress }: GeneralVisualizationProps) {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Circular progress - very subtle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="88"
          fill="none"
          stroke="rgba(39, 39, 42, 0.5)"
          strokeWidth="4"
        />
        <motion.circle
          cx="96"
          cy="96"
          r="88"
          fill="none"
          stroke="url(#actionGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={553}
          strokeDashoffset={553 - (553 * progress) / 100}
          transition={{ duration: 0.5 }}
        />
        <defs>
          <linearGradient id="actionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.5)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.5)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-5xl"
        >
          🎯
        </motion.div>
      </div>
    </div>
  );
}

export default ActionStep;
