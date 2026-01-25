'use client';

// ═══════════════════════════════════════════════════════════════════════════
// LESSON EXPERIENCE - THE SACRED JOURNEY
// ═══════════════════════════════════════════════════════════════════════════
//
// This is not a step-by-step wizard. This is a pilgrimage into wisdom.
// Each transition is a threshold crossing into deeper presence.
// The atmosphere breathes with you. The journey transforms you.
//
// Visual principles:
// - Atmospheric depth that responds to each phase
// - Floating particles that follow your progress
// - Gradients that shift like consciousness deepening
// - Sacred geometry underlying every transition
// ═══════════════════════════════════════════════════════════════════════════

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WisdomStep } from './steps/WisdomStep';
import { ActionStep } from './steps/ActionStep';
import { ReflectionStep } from './steps/ReflectionStep';
import { RewardStep } from './steps/RewardStep';
import { MentorStep } from './steps/MentorStep';
import { AmbientBackground } from '@/components/ambient';
import type { Lesson } from '@/types';
import { useStore } from '@/store/useStore';
import { useSound } from '@/hooks/useSound';
import { useLessonAmbience } from '@/hooks/useLessonAmbience';

interface LessonExperienceProps {
  lesson: Lesson;
  onComplete: () => void;
}

type LessonStage = 'wisdom' | 'action' | 'reflection' | 'reward' | 'mentor';

// Stage colors and atmospheres
const STAGE_THEMES: Record<LessonStage, {
  primary: string;
  glow: string;
  label: string;
  intensity: 'subtle' | 'normal' | 'vivid';
}> = {
  wisdom: {
    primary: 'from-purple-500 to-amber-500',
    glow: 'rgba(167, 139, 250, 0.15)',
    label: 'Receiving Wisdom',
    intensity: 'normal',
  },
  action: {
    primary: 'from-amber-500 to-orange-500',
    glow: 'rgba(251, 191, 36, 0.12)',
    label: 'Practicing',
    intensity: 'subtle',
  },
  reflection: {
    primary: 'from-cyan-500 to-purple-500',
    glow: 'rgba(34, 211, 238, 0.10)',
    label: 'Reflecting',
    intensity: 'subtle',
  },
  reward: {
    primary: 'from-amber-400 to-amber-600',
    glow: 'rgba(251, 191, 36, 0.20)',
    label: 'Celebrating',
    intensity: 'vivid',
  },
  mentor: {
    primary: 'from-purple-500 to-amber-500',
    glow: 'rgba(167, 139, 250, 0.12)',
    label: 'Integration',
    intensity: 'normal',
  },
};

// Stage icons for progress indicator
const STAGE_ICONS: Record<LessonStage, string> = {
  wisdom: '📜',
  action: '⚡',
  reflection: '✍️',
  reward: '✨',
  mentor: '🧙',
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
    transitionTo,
    stopAmbience,
    playBell,
    playKeystroke,
    playCompletionChime,
    initAudio: initAmbienceAudio
  } = useLessonAmbience();

  const currentTheme = STAGE_THEMES[stage];

  // Initialize on first user interaction
  const handleInitializeAudio = useCallback(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    initAudio();
    initAmbienceAudio();
  }, [initAudio, initAmbienceAudio]);

  // Start lesson
  const handleStartWisdomAmbience = useCallback(() => {
    handleInitializeAudio();
    playBell('deep');
  }, [handleInitializeAudio, playBell]);

  // Transition to action phase
  const handleWisdomComplete = useCallback(() => {
    setIsTransitioning(true);
    playBell('soft');
    setTimeout(() => {
      setStage('action');
      setIsTransitioning(false);
    }, 600);
  }, [playBell]);

  // Start action phase
  const handleStartActionAmbience = useCallback(() => {
    // Quiet during action - full presence
  }, []);

  // Transition to reflection phase
  const handleActionComplete = useCallback((completed: boolean) => {
    setActionCompleted(completed);
    setIsTransitioning(true);
    playBell('soft');
    setTimeout(() => {
      transitionTo('reflection');
      setStage('reflection');
      setIsTransitioning(false);
    }, 600);
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

    // Bonus XP for thoughtful reflections
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

    // Celebration transition
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
    }, 400);
  }, []);

  // Complete the lesson
  const handleMentorComplete = useCallback(() => {
    stopAmbience();
    completeLesson(lesson.id, xpEarnedRef.current);
    playComplete();
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

  // NO cleanup on unmount - child step components handle their own audio lifecycle
  // Audio is stopped when lesson is completed, not on component unmount

  // Calculate progress
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

  const getStageIndex = (s: LessonStage) => {
    const stages: LessonStage[] = ['wisdom', 'action', 'reflection', 'reward', 'mentor'];
    return stages.indexOf(s);
  };

  // Transition variants - simplified for performance
  const stageVariants = {
    enter: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: -15,
      scale: 0.98,
    },
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col relative overflow-hidden">
      {/* Ambient background - minimal for performance */}
      <AmbientBackground
        intensity="subtle"
        particleCount={stage === 'reward' ? 8 : 4}
        orbCount={1}
      />

      {/* Stage-specific atmospheric glow - static for performance */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${currentTheme.glow} 0%, transparent 60%)`,
        }}
      />

      {/* ─────────────────────────────────────────────────────────────────
          Progress Indicator - Elegant Arc
      ───────────────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Main progress bar */}
        <div className="h-1 bg-stone-900/80 backdrop-blur-sm">
          <motion.div
            className={`h-full bg-gradient-to-r ${currentTheme.primary}`}
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              boxShadow: `0 0 20px ${currentTheme.glow}`,
            }}
          />
        </div>

        {/* Stage indicators */}
        <motion.div
          className="absolute top-4 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col items-center gap-3">
            {/* Current stage label */}
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-lg">{STAGE_ICONS[stage]}</span>
              <span className="text-xs tracking-[0.2em] uppercase text-stone-500 font-medium">
                {currentTheme.label}
              </span>
            </motion.div>

            {/* Stage dots - simplified for performance */}
            <div className="flex items-center gap-3">
              {(['wisdom', 'action', 'reflection', 'reward', 'mentor'] as LessonStage[]).map((s, i) => {
                const isCurrent = stage === s;
                const isComplete = getStageIndex(stage) > i;

                return (
                  <div
                    key={s}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      isComplete
                        ? 'bg-amber-500'
                        : isCurrent
                        ? 'bg-amber-400 scale-125'
                        : 'bg-stone-700'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          Main Content Area
      ───────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={stage}
              variants={stageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.6,
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

      {/* Bottom gradient fade */}
      <div
        className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(12, 10, 9, 0.9), transparent)',
        }}
      />
    </div>
  );
}

export default LessonExperience;
