'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
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
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Select mentor response
  const getMentorMessage = () => {
    // Check for streak milestone first
    const streakMessage = getStreakMilestoneMessage(currentStreak + 1);
    if (streakMessage) {
      return streakMessage;
    }

    // Try to get a lesson-specific response
    if (lesson.mentorResponses.length > 0) {
      return lesson.mentorResponses[Math.floor(Math.random() * lesson.mentorResponses.length)];
    }

    // Fall back to generic responses
    if (reflection.length > 100) {
      return getRandomMentorResponse(MENTOR_RESPONSES.reflectionWritten);
    }
    return getRandomMentorResponse(MENTOR_RESPONSES.lessonComplete);
  };

  const mentorMessage = getMentorMessage();
  const personalizedMessage = name
    ? mentorMessage.replace(/^/, `${name}, `)
    : mentorMessage;

  // Typewriter effect
  useEffect(() => {
    let index = 0;
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

  return (
    <div className="text-center">
      {/* Mentor avatar */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30"
      >
        <Sparkles size={36} className="text-white" />
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
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 text-left relative"
      >
        {/* Speech bubble pointer */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-zinc-900 border-l border-t border-zinc-800 rotate-45" />

        <p className="text-zinc-300 leading-relaxed">
          {displayedText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-5 bg-indigo-400 ml-1 align-middle"
            />
          )}
        </p>
      </motion.div>

      {/* Identity prompt (optional - appears after some lessons) */}
      {currentStreak > 0 && currentStreak % 5 === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-8"
        >
          <p className="text-sm text-indigo-300 mb-2">
            Reflect on your identity:
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
          onClick={onComplete}
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
