'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
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
  onRetry: () => void; // Go back to reflection
}

export function MentorStep({ lesson, reflection, actionCompleted, onComplete, onRetry }: MentorStepProps) {
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
      setSageResponse({
        observation: '',
        question: '',
        direction: '',
        fullMessage: name
          ? `${name}, you've completed today's practice. Each lesson is a step on your path. Return tomorrow to continue your journey.`
          : "You've completed today's practice. Each lesson is a step on your path. Return tomorrow to continue your journey.",
        isAI: false,
        isLowEffort: false,
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

    // Faster typing for low-effort callouts
    const typingSpeed = sageResponse.isLowEffort ? 20 : sageResponse.isAI ? 25 : 30;

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

    // Disappointed for low-effort
    if (sageResponse?.isLowEffort) return 'thinking'; // Stern look

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
  }, [isLoading, isTyping, currentStreak, sageResponse?.isAI, sageResponse?.isLowEffort, reflection.length]);

  // Subtle indicator that this is AI-powered (only show for AI responses, not low-effort)
  const showAIIndicator = sageResponse?.isAI && !sageResponse?.isLowEffort && !isLoading && !isTyping;

  // Is this a failed attempt due to low effort?
  const isFailedAttempt = sageResponse?.isLowEffort && !isLoading && !isTyping;

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
          isFailedAttempt
            ? 'bg-gradient-to-br from-red-950/50 to-stone-950 border border-red-900/30 shadow-red-900/10'
            : 'bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-900/20 shadow-amber-900/5'
        }`}
      >
        {/* Speech bubble pointer */}
        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 ${
          isFailedAttempt
            ? 'bg-red-950/50 border-l border-t border-red-900/30'
            : 'bg-stone-900 border-l border-t border-amber-900/20'
        }`} />

        {/* Loading state - prominent AI indicator */}
        {isLoading && (
          <div className="py-6">
            <div className="flex flex-col items-center gap-4">
              {/* Animated thinking orb */}
              <motion.div
                className="relative w-16 h-16"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/30 to-purple-500/30 blur-lg"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center">
                  <motion.span
                    className="text-2xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✦
                  </motion.span>
                </div>
              </motion.div>

              <div className="text-center">
                <motion.p
                  className="text-amber-300 font-medium mb-1"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Sage is reading your reflection...
                </motion.p>
                <p className="text-stone-500 text-xs">Analyzing your journey</p>
              </div>
            </div>
          </div>
        )}

        {/* Message content */}
        {!isLoading && (
          <p className={`leading-relaxed whitespace-pre-line ${
            isFailedAttempt ? 'text-red-200' : 'text-stone-200'
          }`}>
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className={`inline-block w-2 h-5 ml-1 align-middle rounded-sm ${
                  isFailedAttempt ? 'bg-red-400' : 'bg-amber-400'
                }`}
              />
            )}
          </p>
        )}

        {/* AI indicator - show that this is personalized */}
        {showAIIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-center gap-2"
          >
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-full"
            >
              <motion.span
                animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-amber-400"
              >
                ✦
              </motion.span>
              <span className="text-xs text-amber-300/80 font-medium">
                Personalized response based on your reflections
              </span>
            </motion.div>
          </motion.div>
        )}

        {/* Low effort indicator */}
        {isFailedAttempt && (
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
      {!isFailedAttempt && currentStreak > 0 && currentStreak % 5 === 0 && (
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

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        {isFailedAttempt ? (
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
            disabled={isLoading || isTyping}
            className="w-full"
          >
            {isLoading ? 'Sage is reflecting...' : isTyping ? 'Sage is speaking...' : 'Complete Lesson'}
          </Button>
        )}
      </motion.div>
    </div>
  );
}

export default MentorStep;
