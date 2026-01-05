'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { SageAvatar, type SageMood } from '@/components/mentor';
import { useSound } from '@/hooks/useSound';
import { useStore } from '@/store/useStore';
import { MENTOR, getRandomMentorResponse, MENTOR_RESPONSES, getStreakMilestoneMessage } from '@/content/mentor';
import type { Lesson } from '@/types';

interface MentorStepProps {
  lesson: Lesson;
  reflection: string;
  onComplete: () => void;
}

export function MentorStep({ lesson, reflection, onComplete }: MentorStepProps) {
  const { name, currentStreak } = useStore();
  const { playTap, playSparkle, playCelebration } = useSound();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Memoize the mentor message so it doesn't change on re-renders
  const personalizedMessage = useMemo(() => {
    let message: string;

    // Check for streak milestone first
    const streakMessage = getStreakMilestoneMessage(currentStreak + 1);
    if (streakMessage) {
      message = streakMessage;
    } else if (lesson.mentorResponses.length > 0) {
      // Get a lesson-specific response
      message = lesson.mentorResponses[Math.floor(Math.random() * lesson.mentorResponses.length)];
    } else if (reflection.length > 100) {
      // Fall back to generic responses
      message = getRandomMentorResponse(MENTOR_RESPONSES.reflectionWritten);
    } else {
      message = getRandomMentorResponse(MENTOR_RESPONSES.lessonComplete);
    }

    // Personalize with name
    return name ? `${name}, ${message.charAt(0).toLowerCase()}${message.slice(1)}` : message;
  }, [lesson.id]); // Only recalculate if lesson changes

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      if (index < personalizedMessage.length) {
        setDisplayedText(personalizedMessage.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [personalizedMessage]);

  // Determine Sage's mood based on context
  const sageMood: SageMood = useMemo(() => {
    if (isTyping) return 'thinking';
    // Celebrating for streak milestones
    if (currentStreak > 0 && [7, 14, 30, 50, 100].includes(currentStreak + 1)) {
      return 'celebrating';
    }
    // Proud for good reflections
    if (reflection.length > 100) return 'proud';
    // Default encouraging
    return 'encouraging';
  }, [isTyping, currentStreak, reflection.length]);

  return (
    <div className="text-center">
      {/* Mentor avatar */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="mx-auto mb-6"
      >
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
        className="bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-900/20 rounded-2xl p-6 mb-8 text-left relative shadow-lg shadow-amber-900/5"
      >
        {/* Speech bubble pointer */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-stone-900 border-l border-t border-amber-900/20 rotate-45" />

        <p className="text-stone-200 leading-relaxed">
          {displayedText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-5 bg-amber-400 ml-1 align-middle rounded-sm"
            />
          )}
        </p>
      </motion.div>

      {/* Identity prompt (optional - appears after some lessons) */}
      {currentStreak > 0 && currentStreak % 5 === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
          className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-xl p-4 mb-8"
        >
          <p className="text-sm text-amber-300 mb-2">
            ✨ Reflect on your identity:
          </p>
          <p className="text-white font-medium italic">
            &ldquo;I am someone who shows up every day for my growth.&rdquo;
          </p>
        </motion.div>
      )}

      {/* Complete button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          size="lg"
          onClick={() => {
            playTap();
            if (sageMood === 'celebrating') {
              playCelebration();
            } else {
              playSparkle();
            }
            onComplete();
          }}
          disabled={isTyping}
          className="w-full"
        >
          {isTyping ? 'Sage is speaking...' : 'Complete Lesson'}
        </Button>
      </motion.div>
    </div>
  );
}

export default MentorStep;
