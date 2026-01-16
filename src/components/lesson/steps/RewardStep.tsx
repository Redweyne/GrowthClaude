'use client';

// ============================================================================
// REWARD STEP - A Moment of Acknowledgment
// ============================================================================
//
// This is not a gamification moment. This is a moment of genuine acknowledgment.
// The user just did something meaningful - they showed up for themselves.
// We honor that with warmth, wisdom, and personal recognition.
// ============================================================================

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { Confetti } from '@/components/effects';
import { useStore } from '@/store/useStore';
import { useSound } from '@/hooks/useSound';
import {
  getGrowthLevel,
  getGrowthProgress,
  getCompletionMessage,
  getStreakMessage,
  getRandomQuote,
  GROWTH_LEVELS,
} from '@/lib/growthPhilosophy';
import type { Lesson } from '@/types';

interface RewardStepProps {
  xpEarned: number;
  lesson: Lesson;
  onComplete: () => void;
}

export function RewardStep({ xpEarned, lesson, onComplete }: RewardStepProps) {
  const { totalXp, currentStreak, lastLessonDate, name } = useStore();
  const { playLevelUp, playCelebration, playTap, playSuccess } = useSound();

  const [phase, setPhase] = useState<'acknowledgment' | 'growth' | 'wisdom'>('acknowledgment');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Calculate values
  const safeXpEarned = xpEarned > 0 ? xpEarned : Math.max(lesson.xpReward ?? 0, 15);
  const previousXp = totalXp;
  const newTotalXp = totalXp + safeXpEarned;
  const previousLevel = getGrowthLevel(previousXp);
  const newLevel = getGrowthLevel(newTotalXp);
  const leveledUp = newLevel.level > previousLevel.level;

  // Calculate streak
  const today = new Date().toISOString().split('T')[0];
  const isFirstLessonToday = lastLessonDate !== today;
  const predictedStreak = isFirstLessonToday ? currentStreak + 1 : currentStreak;

  // Get personalized messages
  const completionMessage = useMemo(
    () => getCompletionMessage(name, lesson.title, predictedStreak),
    [name, lesson.title, predictedStreak]
  );

  const streakInfo = useMemo(
    () => getStreakMessage(predictedStreak),
    [predictedStreak]
  );

  const wisdomQuote = useMemo(
    () => getRandomQuote(leveledUp ? 'growth' : 'completion'),
    [leveledUp]
  );

  // Progress
  const progress = getGrowthProgress(newTotalXp);
  const nextLevel = GROWTH_LEVELS.find(l => l.level === newLevel.level + 1);

  // Animation sequence
  useEffect(() => {
    // Phase 1: Acknowledgment (immediate)
    playSuccess();

    // Phase 2: Growth (after 1.5s)
    const growthTimer = setTimeout(() => {
      setPhase('growth');
      if (leveledUp) {
        setShowLevelUp(true);
        setShowConfetti(true);
        playLevelUp();
        playCelebration();
      }
    }, 1500);

    // Phase 3: Wisdom (after 3s or 4s if leveled up)
    const wisdomTimer = setTimeout(() => {
      setPhase('wisdom');
    }, leveledUp ? 4000 : 3000);

    return () => {
      clearTimeout(growthTimer);
      clearTimeout(wisdomTimer);
    };
  }, [leveledUp, playSuccess, playLevelUp, playCelebration]);

  return (
    <div className="text-center px-2">
      {/* Confetti for level up */}
      <Confetti
        active={showConfetti}
        particleCount={100}
        duration={4000}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Phase 1: Acknowledgment - The Personal Message */}
      <AnimatePresence mode="wait">
        {phase === 'acknowledgment' && (
          <motion.div
            key="acknowledgment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-[300px] flex flex-col items-center justify-center"
          >
            {/* Warm glow */}
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center mb-8"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-10 h-10 text-amber-400" />
            </motion.div>

            {/* The message that matters */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-zinc-200 font-light leading-relaxed max-w-md"
            >
              {completionMessage}
            </motion.p>

            {/* Subtle XP acknowledgment */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-zinc-500 mt-6"
            >
              +{safeXpEarned} growth points
            </motion.p>
          </motion.div>
        )}

        {/* Phase 2: Growth - Streak & Level */}
        {phase === 'growth' && (
          <motion.div
            key="growth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-[300px] flex flex-col items-center justify-center"
          >
            {/* Level Up Celebration */}
            {showLevelUp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-6 bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/20 rounded-2xl relative overflow-hidden"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />

                <div className="relative z-10">
                  <p className="text-amber-400 text-sm font-medium mb-2">You've grown</p>
                  <h3 className="text-2xl font-bold text-white mb-1">{newLevel.title}</h3>
                  <p className="text-zinc-400 text-sm italic">{newLevel.subtitle}</p>
                  <p className="text-zinc-300 text-sm mt-3 max-w-xs mx-auto">
                    {newLevel.unlockMessage}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Streak */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: showLevelUp ? 0.5 : 0 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  animate={{
                    scale: isFirstLessonToday ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Flame
                    className={`w-8 h-8 ${
                      predictedStreak >= 30
                        ? 'text-orange-400 fill-orange-400'
                        : predictedStreak >= 7
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-amber-500/70 fill-amber-500/70'
                    }`}
                  />
                </motion.div>
                <span className="text-3xl font-bold text-white">{streakInfo.title}</span>
              </div>
              <p className="text-zinc-400">{streakInfo.subtitle}</p>
            </motion.div>

            {/* Progress to next level (if not max) */}
            {nextLevel && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 w-full max-w-xs"
              >
                <div className="flex justify-between text-xs text-zinc-500 mb-2">
                  <span>{newLevel.title}</span>
                  <span>{nextLevel.title}</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <p className="text-xs text-zinc-600 mt-2">
                  {progress.current} / {progress.needed} to next level
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Phase 3: Wisdom - The Quote */}
        {phase === 'wisdom' && (
          <motion.div
            key="wisdom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-[300px] flex flex-col items-center justify-center"
          >
            {/* Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mb-8"
            >
              <p className="text-lg md:text-xl text-zinc-300 font-light italic leading-relaxed">
                "{wisdomQuote.text}"
              </p>
              <p className="text-sm text-zinc-500 mt-4">— {wisdomQuote.author}</p>
            </motion.div>

            {/* Lesson completed note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-zinc-600 mb-8"
            >
              {lesson.title}
            </motion.p>

            {/* Continue button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={() => {
                  playTap();
                  onComplete();
                }}
                className="group"
              >
                Continue to Mentor
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip to end button (subtle) */}
      {phase !== 'wisdom' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={() => setPhase('wisdom')}
          className="absolute bottom-4 right-4 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Skip
        </motion.button>
      )}
    </div>
  );
}

export default RewardStep;
