'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WisdomStep } from './steps/WisdomStep';
import { ActionStep } from './steps/ActionStep';
import { ReflectionStep } from './steps/ReflectionStep';
import { RewardStep } from './steps/RewardStep';
import { MentorStep } from './steps/MentorStep';
import type { Lesson } from '@/types';
import { useStore } from '@/store/useStore';
import { useSound } from '@/hooks/useSound';

// Check if reflection is low-effort (must match sageService logic)
function isLowEffortReflection(text: string): boolean {
  const trimmed = text.trim().toLowerCase();
  if (trimmed.length < 10) return true;
  const lowEffortPatterns = [
    /^[a-z]{1,5}$/,
    /^(idk|ok|whatever|test|asdf|qwer|nothing|none|na|n\/a|\.+|no|yes|meh|lol|lmao)$/i,
    /^[^a-zA-Z]*$/,
    /^(.)\1{3,}$/,
    /^[a-z]+$/i,
    /asdf|qwer|zxcv/i,
    /^[0-9\s]+$/,
    /(.{1,3})\1{2,}/,
  ];
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 3 && trimmed.length < 30) return true;
  return lowEffortPatterns.some(pattern => pattern.test(trimmed));
}

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
  const xpEarnedRef = useRef(0);
  const [isLowEffort, setIsLowEffort] = useState(false);
  const { completeLesson, currentStreak, lastLessonDate, saveReflection } = useStore();
  const { playComplete, playReward, initAudio } = useSound();

  const handleWisdomComplete = () => {
    initAudio();
    setStage('action');
  };

  const handleActionComplete = (completed: boolean) => {
    setActionCompleted(completed);
    setStage('reflection');
  };

  const handleReflectionComplete = (text: string) => {
    setReflection(text);

    // Check for low-effort BEFORE proceeding
    const lowEffort = isLowEffortReflection(text);
    setIsLowEffort(lowEffort);

    if (lowEffort) {
      // Skip reward, go straight to mentor for the callout
      // Do NOT save reflection, do NOT award XP
      setXpEarned(0);
      xpEarnedRef.current = 0;
      setStage('mentor');
      return;
    }

    // Good reflection - save it and calculate XP
    saveReflection({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      coreConceptTag: lesson.coreConceptTag,
      reflection: text,
      actionCompleted: actionCompleted,
    });

    // Calculate XP - ALWAYS award at least 15 XP for completing a lesson
    // Use lesson.xpReward if available, otherwise default to 15
    const baseXp = (lesson.xpReward && lesson.xpReward > 0) ? lesson.xpReward : 15;
    let xp = baseXp;

    // Bonus XP for completing the action
    if (actionCompleted) xp += 5;

    // Bonus XP for thoughtful reflections
    if (text.length > 50) xp += 5;
    if (text.length > 150) xp += 5;

    // Streak bonus (up to 50% extra)
    const streakBonus = Math.min(currentStreak * 0.02, 0.5);
    xp = Math.round(xp * (1 + streakBonus));

    // ENSURE XP is always valid and never 0 for a valid reflection
    if (!Number.isFinite(xp) || xp <= 0) {
      xp = Math.max(lesson.xpReward ?? 0, 15);
    }

    console.log('[XP DEBUG] baseXp:', baseXp, 'finalXp:', xp, 'lesson.xpReward:', lesson.xpReward, 'actionCompleted:', actionCompleted, 'textLength:', text.length);
    setXpEarned(xp);
    xpEarnedRef.current = xp;
    playReward();
    setStage('reward');
  };

  const handleRewardComplete = () => {
    setStage('mentor');
  };

  const handleMentorComplete = () => {
    // Save lesson completion to store (only for successful lessons)
    completeLesson(lesson.id, xpEarnedRef.current);
    playComplete();
    onComplete();
  };

  const handleRetry = () => {
    // Go back to reflection step
    setReflection('');
    setIsLowEffort(false);
    setStage('reflection');
  };

  const stageVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Calculate progress percentage
  const getProgress = () => {
    if (isLowEffort && stage === 'mentor') return 60; // Failed at reflection
    switch (stage) {
      case 'wisdom': return 20;
      case 'action': return 40;
      case 'reflection': return 60;
      case 'reward': return 80;
      case 'mentor': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-zinc-800">
          <motion.div
            className={`h-full ${
              isLowEffort && stage === 'mentor'
                ? 'bg-gradient-to-r from-red-600 to-orange-600'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 pt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage + (isLowEffort ? '-loweffort' : '')}
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
                actionCompleted={actionCompleted}
                onComplete={handleMentorComplete}
                onRetry={handleRetry}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default LessonExperience;
