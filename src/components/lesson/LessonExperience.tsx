'use client';

// ============================================================================
// LESSON EXPERIENCE - THE SACRED JOURNEY ORCHESTRATOR
// This is not a step-by-step wizard. This is a pilgrimage.
// Each transition is an invitation deeper into presence.
// The ambient soundscape breathes life into every moment.
// ============================================================================

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WisdomStep } from './steps/WisdomStep';
import { ActionStep } from './steps/ActionStep';
import { ReflectionStep } from './steps/ReflectionStep';
import { RewardStep } from './steps/RewardStep';
import { MentorStep } from './steps/MentorStep';
import type { Lesson } from '@/types';
import { useStore } from '@/store/useStore';
import { useSound } from '@/hooks/useSound';
import { useLessonAmbience } from '@/hooks/useLessonAmbience';

interface LessonExperienceProps {
  lesson: Lesson;
  onComplete: () => void;
}

type LessonStage = 'wisdom' | 'action' | 'reflection' | 'reward' | 'mentor';

// Map stages to ambience phases
const STAGE_TO_AMBIENCE: Record<LessonStage, 'wisdom' | 'action' | 'reflection' | 'completion'> = {
  wisdom: 'wisdom',
  action: 'action',
  reflection: 'reflection',
  reward: 'completion',
  mentor: 'completion',
};

export function LessonExperience({ lesson, onComplete }: LessonExperienceProps) {
  const [stage, setStage] = useState<LessonStage>('wisdom');
  const [reflection, setReflection] = useState('');
  const [actionCompleted, setActionCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const xpEarnedRef = useRef(0);
  const hasInitializedRef = useRef(false);

  const { completeLesson, currentStreak, saveReflection } = useStore();
  const { playComplete, playReward, initAudio } = useSound();
  const {
    startAmbience,
    transitionTo,
    stopAmbience,
    playBell,
    playKeystroke,
    playCompletionChime,
    initAudio: initAmbienceAudio
  } = useLessonAmbience();

  // Initialize on first user interaction (via wisdom step)
  const handleInitializeAudio = useCallback(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    initAudio();
    initAmbienceAudio();
  }, [initAudio, initAmbienceAudio]);

  // Start wisdom ambience
  const handleStartWisdomAmbience = useCallback(() => {
    handleInitializeAudio();
    startAmbience('wisdom');
    playBell('deep');
  }, [handleInitializeAudio, startAmbience, playBell]);

  // Transition to action phase
  const handleWisdomComplete = useCallback(() => {
    setIsTransitioning(true);
    playBell('soft');

    // Allow transition animation before changing stage
    setTimeout(() => {
      transitionTo('action');
      setStage('action');
      setIsTransitioning(false);
    }, 500);
  }, [transitionTo, playBell]);

  // Start action ambience (called by ActionStep)
  const handleStartActionAmbience = useCallback(() => {
    transitionTo('action');
  }, [transitionTo]);

  // Transition to reflection phase
  const handleActionComplete = useCallback((completed: boolean) => {
    setActionCompleted(completed);
    setIsTransitioning(true);
    playBell('soft');

    setTimeout(() => {
      transitionTo('reflection');
      setStage('reflection');
      setIsTransitioning(false);
    }, 500);
  }, [transitionTo, playBell]);

  // Handle keystroke sounds during reflection
  const handleReflectionKeystroke = useCallback(() => {
    playKeystroke();
  }, [playKeystroke]);

  // Transition to reward phase
  const handleReflectionComplete = useCallback((text: string) => {
    setReflection(text);
    setIsTransitioning(true);

    // Save reflection
    saveReflection({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      coreConceptTag: lesson.coreConceptTag,
      reflection: text,
      actionCompleted: actionCompleted,
    });

    // Calculate XP
    const baseXp = (lesson.xpReward && lesson.xpReward > 0) ? lesson.xpReward : 15;
    let xp = baseXp;

    // Bonus XP for completing the action
    if (actionCompleted) xp += 5;

    // Bonus XP for thoughtful reflections (word-based, matching new ReflectionStep)
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 25) xp += 5;
    if (wordCount > 50) xp += 5;
    if (wordCount > 100) xp += 10;

    // Streak bonus (up to 50% extra)
    const streakBonus = Math.min(currentStreak * 0.02, 0.5);
    xp = Math.round(xp * (1 + streakBonus));

    // Ensure XP is always valid
    if (!Number.isFinite(xp) || xp <= 0) {
      xp = Math.max(lesson.xpReward ?? 0, 15);
    }

    setXpEarned(xp);
    xpEarnedRef.current = xp;

    // Transition with celebration
    playBell('bright');
    playCompletionChime();

    setTimeout(() => {
      transitionTo('completion');
      playReward();
      setStage('reward');
      setIsTransitioning(false);
    }, 800);
  }, [
    saveReflection, lesson, actionCompleted, currentStreak,
    playBell, playCompletionChime, transitionTo, playReward
  ]);

  // Transition to mentor phase
  const handleRewardComplete = useCallback(() => {
    setIsTransitioning(true);

    setTimeout(() => {
      setStage('mentor');
      setIsTransitioning(false);
    }, 300);
  }, []);

  // Complete the lesson
  const handleMentorComplete = useCallback(() => {
    // Stop ambience gracefully
    stopAmbience();

    // Save lesson completion
    completeLesson(lesson.id, xpEarnedRef.current);
    playComplete();

    // Brief pause before closing
    setTimeout(() => {
      onComplete();
    }, 300);
  }, [stopAmbience, completeLesson, lesson.id, playComplete, onComplete]);

  // Retry reflection
  const handleRetry = useCallback(() => {
    setReflection('');
    transitionTo('reflection');
    setStage('reflection');
  }, [transitionTo]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAmbience();
    };
  }, [stopAmbience]);

  // Calculate progress percentage with smooth transitions
  const getProgress = () => {
    switch (stage) {
      case 'wisdom': return 10;
      case 'action': return 35;
      case 'reflection': return 60;
      case 'reward': return 85;
      case 'mentor': return 100;
      default: return 0;
    }
  };

  // Stage transition variants
  const stageVariants = {
    enter: {
      opacity: 0,
      y: 30,
      scale: 0.98,
      filter: 'blur(4px)',
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      filter: 'blur(4px)',
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden">
      {/* Ambient background glow - responds to stage */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: stage === 'wisdom'
              ? 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%)'
              : stage === 'action'
              ? 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%)'
              : stage === 'reflection'
              ? 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.03) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
          }}
          transition={{ duration: 2 }}
        />
      </div>

      {/* Progress bar - elegant and minimal */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-0.5 bg-zinc-900">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Stage indicators - subtle dots */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-3">
          {['wisdom', 'action', 'reflection', 'reward', 'mentor'].map((s, i) => (
            <motion.div
              key={s}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                stage === s
                  ? 'bg-indigo-400'
                  : getProgress() > [10, 35, 60, 85, 100][i]
                  ? 'bg-indigo-400/50'
                  : 'bg-zinc-700'
              }`}
              animate={{
                scale: stage === s ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>
      </div>

      {/* Content container */}
      <div className="flex-1 flex items-center justify-center px-4 pt-16 pb-8">
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={stage}
              variants={stageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="w-full max-w-xl"
            >
              {stage === 'wisdom' && (
                <WisdomStep
                  lesson={lesson}
                  onComplete={handleWisdomComplete}
                  onStartAmbience={handleStartWisdomAmbience}
                />
              )}

              {stage === 'action' && (
                <ActionStep
                  lesson={lesson}
                  onComplete={handleActionComplete}
                  onStartAmbience={handleStartActionAmbience}
                />
              )}

              {stage === 'reflection' && (
                <ReflectionStep
                  lesson={lesson}
                  onComplete={handleReflectionComplete}
                  onKeystroke={handleReflectionKeystroke}
                />
              )}

              {stage === 'reward' && (
                <RewardStep
                  xpEarned={xpEarned}
                  lesson={lesson}
                  onComplete={handleRewardComplete}
                />
              )}

              {stage === 'mentor' && (
                <MentorStep
                  lesson={lesson}
                  reflection={reflection}
                  onComplete={handleMentorComplete}
                  onRetry={handleRetry}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stage label - very subtle */}
      <motion.div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
      >
        <p className="text-zinc-700 text-xs tracking-widest uppercase">
          {stage === 'wisdom' && 'Receiving wisdom'}
          {stage === 'action' && 'Practicing'}
          {stage === 'reflection' && 'Reflecting'}
          {stage === 'reward' && 'Celebrating'}
          {stage === 'mentor' && 'Integration'}
        </p>
      </motion.div>
    </div>
  );
}

export default LessonExperience;
