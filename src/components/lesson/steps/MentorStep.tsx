'use client';

// ============================================================================
// MENTOR STEP - SAGE DELIVERS WISDOM
// ============================================================================
//
// This is where the lesson's teaching lands. Sage doesn't just encourage -
// Sage delivers the philosophical insight that makes this lesson matter.
//
// The mentor response should:
// - Connect to the specific lesson concept
// - Feel like genuine wisdom, not cheerleading
// - Give the user something to carry with them
//
// Visual principles:
// - Atmospheric and reverent
// - Sage speaks from a place of knowing
// - The message has weight and space to breathe
// ============================================================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Flame } from 'lucide-react';
import { Button } from '@/components/ui';
import { SageAvatar, type SageMood } from '@/components/mentor';
import { useSound } from '@/hooks/useSound';
import { useStore } from '@/store/useStore';
import { MENTOR, getStreakMilestoneMessage } from '@/content/mentor';
import { isLowEffortReflection } from '@/lib/reflection';
import type { Lesson } from '@/types';

interface MentorStepProps {
  lesson: Lesson;
  reflection: string;
  onComplete: () => void;
  onRetry: () => void;
}

// Deep wisdom for when lessons don't have specific responses
const FALLBACK_WISDOM = [
  {
    wisdom: "Philosophy is not about knowing. It is about becoming. Each lesson you complete shapes who you will be tomorrow.",
    context: "On the practice itself"
  },
  {
    wisdom: "The Stoics did not study philosophy to sound clever. They studied it to live better. You are doing the same.",
    context: "On why this matters"
  },
  {
    wisdom: "What you just practiced is older than empires. Emperors and slaves alike used these same tools. They work.",
    context: "On the tradition"
  },
  {
    wisdom: "The gap between who you are and who you want to be closes one practice at a time. Today it closed a little more.",
    context: "On transformation"
  },
  {
    wisdom: "Most people read about wisdom. You are practicing it. That distinction makes all the difference.",
    context: "On the value of practice"
  },
];

// Low effort responses - direct, not harsh
const LOW_EFFORT_WISDOM = [
  "This doesn't look like genuine reflection. The practice only works if you bring yourself to it. Try again with honesty.",
  "I see you're here, but I don't see you engaging. What did this lesson actually stir in you? Try again.",
  "The reflection is where transformation happens. Without it, this is just going through motions. Be honest this time.",
  "Half-hearted practice yields half-hearted results. Return and write what you actually think.",
];

export function MentorStep({ lesson, reflection, onComplete, onRetry }: MentorStepProps) {
  const { name, currentStreak } = useStore();
  const { playTap, playSparkle, playCelebration } = useSound();

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showStreakBonus, setShowStreakBonus] = useState(false);

  // Check if reflection is low effort
  const isLowEffort = useMemo(() => isLowEffortReflection(reflection), [reflection]);

  // Check for streak milestone (this is shown as a bonus, not replacing wisdom)
  const nextStreak = currentStreak + 1;
  const streakMilestone = useMemo(() => {
    if (isLowEffort) return null;
    return getStreakMilestoneMessage(nextStreak);
  }, [nextStreak, isLowEffort]);

  // Get the mentor's WISDOM - prioritize lesson-specific teaching
  const mentorWisdom = useMemo(() => {
    // Low effort response
    if (isLowEffort) {
      return {
        text: LOW_EFFORT_WISDOM[Math.floor(Math.random() * LOW_EFFORT_WISDOM.length)],
        isWisdom: false,
      };
    }

    // Use the lesson's hand-crafted mentor responses
    // These are specific philosophical insights, not encouragement
    const lessonResponses = lesson.mentorResponses;
    if (lessonResponses && lessonResponses.length > 0) {
      const response = lessonResponses[Math.floor(Math.random() * lessonResponses.length)];

      // Optionally personalize with name (but preserve the wisdom)
      if (name && Math.random() > 0.7) {
        return {
          text: `${name}, ${response.charAt(0).toLowerCase()}${response.slice(1)}`,
          isWisdom: true,
        };
      }
      return { text: response, isWisdom: true };
    }

    // Fallback to philosophical wisdom
    const fallback = FALLBACK_WISDOM[Math.floor(Math.random() * FALLBACK_WISDOM.length)];
    if (name && Math.random() > 0.6) {
      return {
        text: `${name}, ${fallback.wisdom.charAt(0).toLowerCase()}${fallback.wisdom.slice(1)}`,
        isWisdom: true,
        context: fallback.context,
      };
    }
    return { text: fallback.wisdom, isWisdom: true, context: fallback.context };
  }, [lesson.mentorResponses, isLowEffort, name]);

  // Determine Sage's mood
  const sageMood: SageMood = useMemo(() => {
    if (isTyping) return 'thinking';
    if (isLowEffort) return 'disappointed';
    if (streakMilestone) return 'celebrating';
    return 'wise'; // Changed from 'encouraging' to 'wise'
  }, [isTyping, isLowEffort, streakMilestone]);

  // Typewriter effect - slower for wisdom
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    // Slower for wisdom to let it land
    const baseSpeed = isLowEffort ? 22 : 32;

    const typeNextChar = () => {
      if (index < mentorWisdom.text.length) {
        setDisplayedText(mentorWisdom.text.slice(0, index + 1));
        index++;

        let delay = baseSpeed;
        const char = mentorWisdom.text[index - 1];

        // Natural pauses - longer for wisdom
        if (char === '.' || char === '!' || char === '?') {
          delay = baseSpeed * 8;
        } else if (char === ',') {
          delay = baseSpeed * 3;
        } else if (char === '—' || char === ':' || char === ';') {
          delay = baseSpeed * 4;
        } else {
          delay = baseSpeed + Math.random() * 15;
        }

        setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
        // Show streak bonus after wisdom is delivered
        if (streakMilestone && !isLowEffort) {
          setTimeout(() => setShowStreakBonus(true), 800);
        }
      }
    };

    // Longer pause before Sage starts speaking - builds anticipation
    setTimeout(typeNextChar, 800);

    return () => {
      index = mentorWisdom.text.length;
    };
  }, [mentorWisdom.text, isLowEffort, streakMilestone]);

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
    <div className="relative">
      {/* Ambient glow based on mood */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full"
          style={{
            background: isLowEffort
              ? 'radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)'
              : streakMilestone
              ? 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(161,161,170,0.04) 0%, transparent 70%)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="text-center">
        {/* Mentor avatar with subtle animation */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="mx-auto mb-6 relative"
        >
          {/* Glow ring for celebrating */}
          {sageMood === 'celebrating' && (
            <motion.div
              className="absolute inset-0 -m-6 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
          <SageAvatar mood={sageMood} size="lg" />
        </motion.div>

        {/* Mentor name - simpler */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-white">{MENTOR.name}</h3>
          <p className="text-sm text-zinc-600">{MENTOR.title}</p>
        </motion.div>

        {/* Message container - more atmospheric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`relative rounded-2xl p-8 mb-6 text-left ${
            isLowEffort
              ? 'bg-gradient-to-br from-red-950/30 to-zinc-950 border border-red-900/20'
              : 'bg-gradient-to-br from-stone-900/80 to-zinc-950 border border-zinc-800/50'
          }`}
        >
          {/* Subtle corner accent */}
          {!isLowEffort && (
            <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden rounded-tl-2xl pointer-events-none">
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />
            </div>
          )}

          {/* Speech bubble pointer */}
          <div
            className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 ${
              isLowEffort
                ? 'bg-red-950/30 border-l border-t border-red-900/20'
                : 'bg-stone-900/80 border-l border-t border-zinc-800/50'
            }`}
          />

          {/* Message text - larger, more readable */}
          <p className={`text-lg leading-relaxed ${isLowEffort ? 'text-red-200/90' : 'text-zinc-200'}`}>
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className={`inline-block w-2 h-5 ml-1 align-middle rounded-sm ${
                  isLowEffort ? 'bg-red-400' : 'bg-amber-400/80'
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
              className="mt-5 pt-4 border-t border-red-900/20"
            >
              <p className="text-sm text-red-400/70 text-center">
                Your reflection needs more depth
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Streak milestone bonus - shown AFTER wisdom */}
        <AnimatePresence>
          {showStreakBonus && streakMilestone && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-r from-amber-900/20 via-orange-900/20 to-amber-900/20 border border-amber-700/20 rounded-xl p-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 font-medium">
                    {nextStreak} Day Streak
                  </span>
                  <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-zinc-400 text-sm text-center">
                  {streakMilestone}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  ? 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400'
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

        {/* Hint for new users - subtle */}
        {!isLowEffort && !isTyping && !showStreakBonus && currentStreak > 0 && currentStreak < 7 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-zinc-700 mt-4"
          >
            {7 - currentStreak} more {7 - currentStreak === 1 ? 'day' : 'days'} to your first week streak
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default MentorStep;
