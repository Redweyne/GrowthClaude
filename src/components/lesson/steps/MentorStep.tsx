'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { SageAvatar, type SageMood } from '@/components/mentor';
import { useSound } from '@/hooks/useSound';
import { useStore } from '@/store/useStore';
import { MENTOR } from '@/content/mentor';
import { isLowEffortReflection } from '@/lib/reflection';
import type { Lesson } from '@/types';

interface MentorStepProps {
  lesson: Lesson;
  reflection: string;
  onComplete: () => void;
  onRetry: () => void;
}

// Static responses for low effort reflections
const LOW_EFFORT_RESPONSES = [
  "Random keystrokes don't count as reflection. You showed up - that's something. But showing up without presence is just going through motions. What would you write if you meant it?",
  "I can see you're here, but I don't see you engaging. The Stoics didn't practice half-measures. What's actually on your mind right now?",
  "This practice only works if you bring yourself to it. A half-hearted reflection yields half-hearted growth. What's really going on today?",
  "You typed something, but you didn't reflect. Try again - what did today's lesson actually stir in you?",
  "I can't guide you if you won't meet me halfway. Seneca wrote that we suffer more in imagination than reality. What are you avoiding by not engaging?",
];

// Static responses based on progress
const MENTOR_MESSAGES = {
  firstLesson: [
    "You've taken your first step on this path. The Stoics believed that the beginning is half of every action. The hardest part is now behind you.",
    "Welcome to the practice. Seneca wrote that we learn not for school, but for life. Today, you chose to learn for life.",
    "You've begun. That single act puts you ahead of countless others who only think about starting. Carry this momentum forward.",
  ],
  earlyJourney: [
    "You're building a foundation. Each reflection is a brick in the fortress of your mind. Keep laying bricks.",
    "Three lessons in and you're still here. Consistency is the mother of mastery. You're proving that to yourself right now.",
    "The early days require the most discipline. You're showing up when it matters most. That's the mark of character.",
  ],
  midJourney: [
    "You're developing a practice now, not just doing exercises. The Stoics would be proud of your consistency.",
    "Halfway through a journey is where most quit. You're still here. That says everything about who you're becoming.",
    "The Stoics practiced daily. So do you now. This wisdom is becoming part of who you are.",
  ],
  deepPractice: [
    "Your reflections have depth now. You're not just completing lessons - you're integrating them into your life.",
    "Marcus Aurelius journaled for himself alone, never expecting others to read his words. Like him, you write for your own transformation.",
    "The practice has become part of you. You carry ancient wisdom into modern challenges. That is the way.",
  ],
  streakMilestones: {
    7: "A week of practice. The habit is forming. You're rewiring how you respond to the world.",
    14: "Two weeks of daily presence. You're building something real. The compound effect of wisdom is beginning.",
    30: "A month of practice. You're no longer trying Stoicism - you're living it. This is who you are now.",
    60: "Two months of daily practice. This is no longer an experiment - it's your philosophy. You've earned this.",
    90: "Ninety days. You've proven your commitment to yourself. The ancient philosophers would recognize you as a fellow practitioner.",
  } as Record<number, string>,
};

function getMentorMessage(
  reflectionCount: number,
  currentStreak: number,
  userName: string | null
): string {
  let message: string;

  // Check for streak milestones first
  const milestones = [7, 14, 30, 60, 90];
  const milestone = milestones.find(m => currentStreak === m);
  if (milestone && MENTOR_MESSAGES.streakMilestones[milestone]) {
    message = MENTOR_MESSAGES.streakMilestones[milestone];
  } else if (reflectionCount === 0) {
    message = MENTOR_MESSAGES.firstLesson[Math.floor(Math.random() * MENTOR_MESSAGES.firstLesson.length)];
  } else if (reflectionCount < 5) {
    message = MENTOR_MESSAGES.earlyJourney[Math.floor(Math.random() * MENTOR_MESSAGES.earlyJourney.length)];
  } else if (reflectionCount < 10) {
    message = MENTOR_MESSAGES.midJourney[Math.floor(Math.random() * MENTOR_MESSAGES.midJourney.length)];
  } else {
    message = MENTOR_MESSAGES.deepPractice[Math.floor(Math.random() * MENTOR_MESSAGES.deepPractice.length)];
  }

  // Personalize with name if available
  if (userName) {
    message = `${userName}, ${message.charAt(0).toLowerCase()}${message.slice(1)}`;
  }

  return message;
}

export function MentorStep({ lesson, reflection, onComplete, onRetry }: MentorStepProps) {
  const { name, currentStreak, reflections } = useStore();
  const { playTap, playSparkle, playCelebration } = useSound();

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Check if reflection is low effort
  const isLowEffort = useMemo(() => isLowEffortReflection(reflection), [reflection]);

  // Generate the mentor message
  const mentorMessage = useMemo(() => {
    if (isLowEffort) {
      const msg = LOW_EFFORT_RESPONSES[Math.floor(Math.random() * LOW_EFFORT_RESPONSES.length)];
      return name ? `${name}, ${msg.charAt(0).toLowerCase()}${msg.slice(1)}` : msg;
    }
    return getMentorMessage(reflections.length, currentStreak, name);
  }, [isLowEffort, reflections.length, currentStreak, name]);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const typingSpeed = isLowEffort ? 20 : 30;

    const timer = setInterval(() => {
      if (index < mentorMessage.length) {
        setDisplayedText(mentorMessage.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [mentorMessage, isLowEffort]);

  // Determine Sage's mood based on context
  const sageMood: SageMood = useMemo(() => {
    if (isTyping) return 'thinking';
    if (isLowEffort) return 'disappointed';

    // Celebrating for streak milestones
    const streakMilestones = [7, 14, 30, 50, 100];
    if (currentStreak > 0 && streakMilestones.includes(currentStreak + 1)) {
      return 'celebrating';
    }

    // Proud for good reflections
    if (reflection.length > 100) return 'proud';

    // Default encouraging
    return 'encouraging';
  }, [isTyping, isLowEffort, currentStreak, reflection.length]);

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
        className={`rounded-2xl p-6 mb-8 text-left relative shadow-lg ${
          isLowEffort
            ? 'bg-gradient-to-br from-red-950/50 to-stone-950 border border-red-900/30 shadow-red-900/10'
            : 'bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-900/20 shadow-amber-900/5'
        }`}
      >
        {/* Speech bubble pointer */}
        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 ${
          isLowEffort
            ? 'bg-red-950/50 border-l border-t border-red-900/30'
            : 'bg-stone-900 border-l border-t border-amber-900/20'
        }`} />

        {/* Message content */}
        <p className={`leading-relaxed whitespace-pre-line ${
          isLowEffort ? 'text-red-200' : 'text-stone-200'
        }`}>
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="mt-4 pt-3 border-t border-red-900/30 flex items-center justify-center gap-2"
          >
            <span className="text-xs text-red-400/80 font-medium">
              Your reflection didn&apos;t meet the minimum effort required
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Identity prompt (optional - appears after some lessons, NOT for failed attempts) */}
      {!isLowEffort && currentStreak > 0 && currentStreak % 5 === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
          className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-xl p-4 mb-8"
        >
          <p className="text-sm text-amber-300 mb-2">
            Reflect on your identity:
          </p>
          <p className="text-white font-medium italic">
            &ldquo;I am someone who shows up every day for my growth.&rdquo;
          </p>
        </motion.div>
      )}

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        {isLowEffort ? (
          // FAILED - Show Try Again button
          <Button
            size="lg"
            onClick={() => {
              playTap();
              onRetry();
            }}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
          >
            <RotateCcw size={18} className="mr-2" />
            Try Again - Write a Real Reflection
          </Button>
        ) : (
          // SUCCESS - Show Complete button
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
        )}
      </motion.div>
    </div>
  );
}

export default MentorStep;
