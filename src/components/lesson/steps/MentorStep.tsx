'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { SageAvatar, type SageMood } from '@/components/mentor';
import { useSound } from '@/hooks/useSound';
import { useStore } from '@/store/useStore';
import { MENTOR } from '@/content/mentor';
import { getSageResponse, type SageResponse } from '@/services/sageService';
import type { Lesson } from '@/types';

interface MentorStepProps {
  lesson: Lesson;
  reflection: string;
  actionCompleted: boolean;
  onComplete: () => void;
}

export function MentorStep({ lesson, reflection, actionCompleted, onComplete }: MentorStepProps) {
  const { name, transformationGoal, currentStreak, reflections } = useStore();
  const { playTap, playSparkle, playCelebration } = useSound();

  const [sageResponse, setSageResponse] = useState<SageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Fetch AI response on mount
  const fetchSageResponse = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getSageResponse(
        reflections,
        lesson.title,
        reflection,
        name,
        transformationGoal,
        currentStreak
      );
      setSageResponse(response);
    } catch (error) {
      console.error('Failed to fetch Sage response:', error);
      // Fallback is handled in the service
      setSageResponse({
        observation: '',
        question: '',
        direction: '',
        fullMessage: name
          ? `${name}, you've completed today's practice. Each lesson is a step on your path. Return tomorrow to continue your journey.`
          : "You've completed today's practice. Each lesson is a step on your path. Return tomorrow to continue your journey.",
        isAI: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, [reflections, lesson.title, reflection, name, transformationGoal, currentStreak]);

  useEffect(() => {
    fetchSageResponse();
  }, [fetchSageResponse]);

  // Typewriter effect - starts when response is loaded
  useEffect(() => {
    if (!sageResponse || isLoading) return;

    const message = sageResponse.fullMessage;
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    // Slightly slower typing for AI responses to feel more thoughtful
    const typingSpeed = sageResponse.isAI ? 25 : 30;

    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [sageResponse, isLoading]);

  // Determine Sage's mood based on context
  const sageMood: SageMood = useMemo(() => {
    if (isLoading) return 'thinking';
    if (isTyping) return 'thinking';

    // Celebrating for streak milestones
    const streakMilestones = [7, 14, 30, 50, 100];
    if (currentStreak > 0 && streakMilestones.includes(currentStreak + 1)) {
      return 'celebrating';
    }

    // If AI gave a response, show proud (it means patterns were detected)
    if (sageResponse?.isAI) return 'proud';

    // Proud for good reflections
    if (reflection.length > 100) return 'proud';

    // Default encouraging
    return 'encouraging';
  }, [isLoading, isTyping, currentStreak, sageResponse?.isAI, reflection.length]);

  // Subtle indicator that this is AI-powered (only show for AI responses)
  const showAIIndicator = sageResponse?.isAI && !isLoading && !isTyping;

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

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <motion.div
              className="flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-amber-400"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>
            <span className="ml-3 text-stone-400 text-sm">Sage is reflecting...</span>
          </div>
        )}

        {/* Message content */}
        {!isLoading && (
          <p className="text-stone-200 leading-relaxed whitespace-pre-line">
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-5 bg-amber-400 ml-1 align-middle rounded-sm"
              />
            )}
          </p>
        )}

        {/* AI indicator - subtle sparkle */}
        {showAIIndicator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 pt-3 border-t border-stone-800/50 flex items-center gap-2"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-amber-400/60"
            >
              ✦
            </motion.span>
            <span className="text-xs text-stone-500">
              Personalized based on your journey
            </span>
          </motion.div>
        )}
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
          disabled={isLoading || isTyping}
          className="w-full"
        >
          {isLoading ? 'Sage is reflecting...' : isTyping ? 'Sage is speaking...' : 'Complete Lesson'}
        </Button>
      </motion.div>
    </div>
  );
}

export default MentorStep;
