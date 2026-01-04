'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WisdomStep } from './steps/WisdomStep';
import { ActionStep } from './steps/ActionStep';
import { ReflectionStep } from './steps/ReflectionStep';
import { RewardStep } from './steps/RewardStep';
import { MentorStep } from './steps/MentorStep';
import type { Lesson } from '@/types';
import { useStore } from '@/store/useStore';

interface LessonExperienceProps {
  lesson: Lesson;
  onComplete: () => void;
}

type LessonStage = 'wisdom' | 'action' | 'reflection' | 'reward' | 'mentor';

export function LessonExperience({ lesson, onComplete }: LessonExperienceProps) {
  const [stage, setStage] = useState<LessonStage>('wisdom');
  const [reflection, setReflection] = useState('');
  const [actionCompleted, setActionCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const { completeLesson, currentStreak, soundEnabled } = useStore();

  // Play sound effect
  const playSound = (type: 'complete' | 'xp' | 'levelup') => {
    if (!soundEnabled) return;
    // Sound implementation would go here
    // For now, we'll use the Web Audio API or a library
  };

  const handleWisdomComplete = () => {
    setStage('action');
  };

  const handleActionComplete = (completed: boolean) => {
    setActionCompleted(completed);
    setStage('reflection');
  };

  const handleReflectionComplete = (text: string) => {
    setReflection(text);

    // Calculate XP
    let xp = lesson.xpReward;

    // Bonus for completing action honestly
    if (actionCompleted) xp += 5;

    // Bonus for writing reflection
    if (text.length > 50) xp += 5;
    if (text.length > 150) xp += 5;

    // Streak bonus (cap at 50% bonus)
    const streakBonus = Math.min(currentStreak * 0.02, 0.5);
    xp = Math.round(xp * (1 + streakBonus));

    setXpEarned(xp);
    playSound('complete');
    setStage('reward');
  };

  const handleRewardComplete = () => {
    setStage('mentor');
  };

  const handleMentorComplete = () => {
    // Save lesson completion to store
    completeLesson(lesson.id, xpEarned);
    onComplete();
  };

  const stageVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-zinc-800">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
            initial={{ width: 0 }}
            animate={{
              width: `${
                stage === 'wisdom'
                  ? 20
                  : stage === 'action'
                  ? 40
                  : stage === 'reflection'
                  ? 60
                  : stage === 'reward'
                  ? 80
                  : 100
              }%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 pt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            variants={stageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            {stage === 'wisdom' && (
              <WisdomStep lesson={lesson} onComplete={handleWisdomComplete} />
            )}
            {stage === 'action' && (
              <ActionStep lesson={lesson} onComplete={handleActionComplete} />
            )}
            {stage === 'reflection' && (
              <ReflectionStep
                lesson={lesson}
                onComplete={handleReflectionComplete}
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
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default LessonExperience;
