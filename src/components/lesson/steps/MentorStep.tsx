'use client';

// ============================================================================
// MENTOR STEP - SAGE SPEAKS
// This is not a random message display. This is where the mentor SEES you.
// Sage reads your reflection, understands what you're going through,
// and responds with genuine wisdom tailored to YOUR journey.
// ============================================================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { SageAvatar, type SageMood } from '@/components/mentor';
import { useSound } from '@/hooks/useSound';
import { useStore } from '@/store/useStore';
import { MENTOR } from '@/content/mentor';
import { isLowEffortReflection } from '@/lib/reflection';
import {
  buildMentorResponse,
  buildLowEffortResponse,
  getStreakMilestoneResponse,
  mapMoodToSageMood,
  analyzeReflection,
  type MentorContext,
  type MentorResponse,
  type ReflectionInsight
} from '@/lib/mentorIntelligence';
import type { Lesson } from '@/types';

interface MentorStepProps {
  lesson: Lesson;
  reflection: string;
  onComplete: () => void;
  onRetry: () => void;
}

export function MentorStep({ lesson, reflection, onComplete, onRetry }: MentorStepProps) {
  const {
    name,
    currentStreak,
    longestStreak,
    reflections,
    allReflections,
    transformationGoal,
    whyStatement,
    activityLog
  } = useStore();

  const { playTap, playSparkle, playCelebration } = useSound();

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showInsight, setShowInsight] = useState(false);

  // Check if reflection is low effort
  const isLowEffort = useMemo(() => isLowEffortReflection(reflection), [reflection]);

  // Analyze the reflection for insights
  const reflectionInsight: ReflectionInsight = useMemo(
    () => analyzeReflection(reflection),
    [reflection]
  );

  // Calculate days since start
  const daysSinceStart = useMemo(() => {
    if (activityLog.length === 0) return 0;
    const firstDay = new Date(activityLog[0].date);
    const today = new Date();
    return Math.floor((today.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }, [activityLog]);

  // Build the mentor context
  const mentorContext: MentorContext = useMemo(() => ({
    userName: name,
    transformationGoal,
    whyStatement,
    reflectionCount: allReflections.length,
    currentStreak,
    longestStreak,
    daysSinceStart,
    lesson,
    recentResponseHashes: []
  }), [name, transformationGoal, whyStatement, allReflections.length, currentStreak, longestStreak, daysSinceStart, lesson]);

  // Generate the mentor response
  const mentorResponse: MentorResponse = useMemo(() => {
    // Check for streak milestone first
    const streakMessage = getStreakMilestoneResponse(currentStreak + 1, mentorContext);
    if (streakMessage && !isLowEffort) {
      return {
        message: streakMessage,
        mood: 'celebrating' as const,
        hash: 'streak-milestone'
      };
    }

    if (isLowEffort) {
      return buildLowEffortResponse(reflection, mentorContext);
    }

    return buildMentorResponse(reflection, mentorContext);
  }, [isLowEffort, reflection, mentorContext, currentStreak]);

  // Map mood to SageMood
  const sageMood: SageMood = useMemo(() => {
    if (isTyping) return 'thinking';
    if (isLowEffort) return 'disappointed';

    return mapMoodToSageMood(mentorResponse.mood) as SageMood;
  }, [isTyping, isLowEffort, mentorResponse.mood]);

  // Typewriter effect with natural variation
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);
    setShowInsight(false);

    const message = mentorResponse.message;
    const baseSpeed = isLowEffort ? 18 : 25;

    const typeNextChar = () => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1));
        index++;

        // Natural typing variation
        let delay = baseSpeed;

        // Pause at punctuation
        const char = message[index - 1];
        if (char === '.' || char === '!' || char === '?') {
          delay = baseSpeed * 8;
        } else if (char === ',') {
          delay = baseSpeed * 3;
        } else if (char === '\n') {
          delay = baseSpeed * 6;
        } else {
          // Random variation
          delay = baseSpeed + Math.random() * 15;
        }

        setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
        // Show insight badge after typing completes (for deep reflections)
        if (!isLowEffort && (reflectionInsight.depth === 'deep' || reflectionInsight.depth === 'profound')) {
          setTimeout(() => setShowInsight(true), 500);
        }
      }
    };

    // Start with a small delay (Sage "thinking")
    setTimeout(typeNextChar, isLowEffort ? 300 : 600);

    return () => {
      index = message.length; // Stop typing on unmount
    };
  }, [mentorResponse.message, isLowEffort, reflectionInsight.depth]);

  // Handle completion
  const handleComplete = useCallback(() => {
    playTap();
    if (sageMood === 'celebrating') {
      playCelebration();
    } else {
      playSparkle();
    }
    onComplete();
  }, [playTap, playSparkle, playCelebration, sageMood, onComplete]);

  // Handle retry
  const handleRetry = useCallback(() => {
    playTap();
    onRetry();
  }, [playTap, onRetry]);

  return (
    <div className="text-center">
      {/* Mentor avatar with subtle glow for celebrations */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="mx-auto mb-6 relative"
      >
        {sageMood === 'celebrating' && (
          <motion.div
            className="absolute inset-0 -m-4 rounded-full bg-amber-500/20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <SageAvatar mood={sageMood} size="lg" />
      </motion.div>

      {/* Mentor name and title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h3 className="text-lg font-semibold text-white">{MENTOR.name}</h3>
        <p className="text-sm text-zinc-500">{MENTOR.title}</p>
      </motion.div>

      {/* Message bubble */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl p-6 mb-6 text-left relative shadow-lg ${
          isLowEffort
            ? 'bg-gradient-to-br from-red-950/50 to-stone-950 border border-red-900/30 shadow-red-900/10'
            : sageMood === 'celebrating'
            ? 'bg-gradient-to-br from-amber-950/30 to-stone-950 border border-amber-700/30 shadow-amber-900/10'
            : sageMood === 'proud'
            ? 'bg-gradient-to-br from-indigo-950/30 to-stone-950 border border-indigo-700/20 shadow-indigo-900/5'
            : 'bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-900/20 shadow-amber-900/5'
        }`}
      >
        {/* Speech bubble pointer */}
        <div
          className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 ${
            isLowEffort
              ? 'bg-red-950/50 border-l border-t border-red-900/30'
              : sageMood === 'celebrating'
              ? 'bg-amber-950/30 border-l border-t border-amber-700/30'
              : 'bg-stone-900 border-l border-t border-amber-900/20'
          }`}
        />

        {/* Message content with proper whitespace handling */}
        <div
          className={`leading-relaxed ${
            isLowEffort ? 'text-red-200' : 'text-stone-200'
          }`}
        >
          {displayedText.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className={idx > 0 ? 'mt-4' : ''}>
              {paragraph}
            </p>
          ))}
          {isTyping && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className={`inline-block w-2 h-5 ml-1 align-middle rounded-sm ${
                isLowEffort ? 'bg-red-400' : 'bg-amber-400'
              }`}
            />
          )}
        </div>

        {/* Low effort indicator */}
        {isLowEffort && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="mt-4 pt-3 border-t border-red-900/30 flex items-center justify-center gap-2"
          >
            <span className="text-xs text-red-400/80 font-medium">
              Your reflection didn&apos;t show genuine engagement
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Reflection insight badge (for deep/profound reflections) */}
      <AnimatePresence>
        {showInsight && !isLowEffort && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-sm text-indigo-300">
                {reflectionInsight.depth === 'profound'
                  ? 'Profound reflection'
                  : 'Deep reflection'
                }
              </span>
              {reflectionInsight.themes.length > 0 && (
                <span className="text-xs text-zinc-500">
                  • {reflectionInsight.themes[0]}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Identity prompt (appears periodically for engaged users) */}
      {!isLowEffort &&
        !isTyping &&
        currentStreak > 0 &&
        currentStreak % 5 === 0 &&
        reflectionInsight.depth !== 'surface' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2, type: 'spring' }}
            className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-xl p-4 mb-6"
          >
            <p className="text-sm text-amber-300 mb-2">
              Reflect on your identity:
            </p>
            <p className="text-white font-medium italic">
              &ldquo;I am someone who{' '}
              {transformationGoal === 'calmer'
                ? 'responds instead of reacts'
                : transformationGoal === 'disciplined'
                ? 'follows through on my commitments'
                : transformationGoal === 'confident'
                ? 'trusts my own judgment'
                : transformationGoal === 'leader'
                ? 'takes responsibility and inspires others'
                : transformationGoal === 'focused'
                ? 'protects my attention'
                : transformationGoal === 'resilient'
                ? 'grows stronger through challenges'
                : 'shows up every day for my growth'}
              .&rdquo;
            </p>
          </motion.div>
        )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        {isLowEffort ? (
          <Button
            size="lg"
            onClick={handleRetry}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
          >
            <RotateCcw size={18} className="mr-2" />
            Try Again - Write a Real Reflection
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleComplete}
            disabled={isTyping}
            className={`w-full ${
              sageMood === 'celebrating'
                ? 'bg-gradient-to-r from-amber-600 to-orange-500'
                : ''
            }`}
          >
            {isTyping ? (
              <>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Sage is speaking...
                </motion.span>
              </>
            ) : (
              'Complete Lesson'
            )}
          </Button>
        )}
      </motion.div>

      {/* Streak preview (subtle hint about building momentum) */}
      {!isLowEffort && !isTyping && currentStreak > 0 && currentStreak < 7 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-xs text-zinc-600 mt-4"
        >
          {7 - currentStreak} more days to your first week streak
        </motion.p>
      )}
    </div>
  );
}

export default MentorStep;
