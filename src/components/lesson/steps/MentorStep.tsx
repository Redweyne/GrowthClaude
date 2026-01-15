'use client';

// ============================================================================
// MENTOR STEP - SAGE SPEAKS WISDOM
// Simple. Warm. Touching. Uses the lesson's hand-crafted wisdom.
// NOT a parrot. NOT an analyzer. A mentor who delivers the right words.
// ============================================================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { SageAvatar, type SageMood } from '@/components/mentor';
import { useSound } from '@/hooks/useSound';
import { useStore } from '@/store/useStore';
import { MENTOR, MENTOR_RESPONSES, getStreakMilestoneMessage } from '@/content/mentor';
import { isLowEffortReflection } from '@/lib/reflection';
import type { Lesson } from '@/types';

interface MentorStepProps {
  lesson: Lesson;
  reflection: string;
  onComplete: () => void;
  onRetry: () => void;
}

export function MentorStep({ lesson, reflection, onComplete, onRetry }: MentorStepProps) {
  const { name, currentStreak } = useStore();
  const { playTap, playSparkle, playCelebration } = useSound();

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Check if reflection is low effort
  const isLowEffort = useMemo(() => isLowEffortReflection(reflection), [reflection]);

  // Get the mentor's message - use lesson-specific wisdom
  const mentorMessage = useMemo(() => {
    // Check for streak milestone first (this is a special moment)
    const nextStreak = currentStreak + 1;
    const streakMessage = getStreakMilestoneMessage(nextStreak);
    if (streakMessage && !isLowEffort) {
      // Add name if available
      if (name) {
        return `${name}, ${streakMessage.charAt(0).toLowerCase()}${streakMessage.slice(1)}`;
      }
      return streakMessage;
    }

    // Low effort response
    if (isLowEffort) {
      const lowEffortResponses = [
        "This doesn't look like a genuine reflection. The practice only works if you bring yourself to it. Try again.",
        "I can see you're here, but I don't see you engaging. What did this lesson actually stir in you?",
        "The reflection is where transformation happens. Without it, this is just going through motions. Try again with honesty.",
        "Half-hearted practice yields half-hearted results. What's really on your mind?",
      ];
      return lowEffortResponses[Math.floor(Math.random() * lowEffortResponses.length)];
    }

    // Use the lesson's hand-crafted mentor responses
    // These are specific to each lesson's concept and are already beautiful
    const lessonResponses = lesson.mentorResponses;
    if (lessonResponses && lessonResponses.length > 0) {
      const response = lessonResponses[Math.floor(Math.random() * lessonResponses.length)];

      // Optionally add name for warmth (but don't change the wisdom)
      if (name && Math.random() > 0.6) {
        return `${name}, ${response.charAt(0).toLowerCase()}${response.slice(1)}`;
      }
      return response;
    }

    // Fallback to general responses (should rarely happen)
    const fallback = MENTOR_RESPONSES.reflectionWritten;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }, [lesson.mentorResponses, isLowEffort, currentStreak, name]);

  // Determine Sage's mood
  const sageMood: SageMood = useMemo(() => {
    if (isTyping) return 'thinking';
    if (isLowEffort) return 'disappointed';

    // Check for streak milestone
    const nextStreak = currentStreak + 1;
    if ([7, 14, 21, 30, 60, 90].includes(nextStreak)) {
      return 'celebrating';
    }

    return 'encouraging';
  }, [isTyping, isLowEffort, currentStreak]);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const baseSpeed = isLowEffort ? 20 : 28;

    const typeNextChar = () => {
      if (index < mentorMessage.length) {
        setDisplayedText(mentorMessage.slice(0, index + 1));
        index++;

        let delay = baseSpeed;
        const char = mentorMessage[index - 1];

        // Natural pauses
        if (char === '.' || char === '!' || char === '?') {
          delay = baseSpeed * 6;
        } else if (char === ',') {
          delay = baseSpeed * 2.5;
        } else if (char === '—' || char === ':') {
          delay = baseSpeed * 3;
        } else {
          delay = baseSpeed + Math.random() * 12;
        }

        setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
      }
    };

    // Small delay before Sage starts speaking
    setTimeout(typeNextChar, 500);

    return () => {
      index = mentorMessage.length;
    };
  }, [mentorMessage, isLowEffort]);

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
      {/* Mentor avatar */}
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

      {/* Mentor name */}
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
        className={`rounded-2xl p-6 mb-6 text-left relative ${
          isLowEffort
            ? 'bg-gradient-to-br from-red-950/40 to-stone-950 border border-red-900/30'
            : sageMood === 'celebrating'
            ? 'bg-gradient-to-br from-amber-950/30 to-stone-950 border border-amber-700/30'
            : 'bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-900/20'
        }`}
      >
        {/* Speech bubble pointer */}
        <div
          className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 ${
            isLowEffort
              ? 'bg-red-950/40 border-l border-t border-red-900/30'
              : sageMood === 'celebrating'
              ? 'bg-amber-950/30 border-l border-t border-amber-700/30'
              : 'bg-stone-900 border-l border-t border-amber-900/20'
          }`}
        />

        {/* Message text */}
        <p className={`leading-relaxed ${isLowEffort ? 'text-red-200' : 'text-stone-200'}`}>
          {displayedText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className={`inline-block w-2 h-5 ml-1 align-middle rounded-sm ${
                isLowEffort ? 'bg-red-400' : 'bg-amber-400'
              }`}
            />
          )}
        </p>

        {/* Low effort indicator */}
        {isLowEffort && !isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 pt-3 border-t border-red-900/30"
          >
            <p className="text-xs text-red-400/80 text-center">
              Your reflection didn&apos;t show genuine engagement
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {isLowEffort ? (
          <Button
            size="lg"
            onClick={handleRetry}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
          >
            <RotateCcw size={18} className="mr-2" />
            Try Again
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
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Sage is speaking...
              </motion.span>
            ) : (
              'Complete Lesson'
            )}
          </Button>
        )}
      </motion.div>

      {/* Streak hint for new users */}
      {!isLowEffort && !isTyping && currentStreak > 0 && currentStreak < 7 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-zinc-600 mt-4"
        >
          {7 - currentStreak} more days to your first week streak
        </motion.p>
      )}
    </div>
  );
}

export default MentorStep;
