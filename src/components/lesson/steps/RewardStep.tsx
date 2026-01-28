'use client';

// ============================================================================
// REWARD STEP - A Sacred Moment of Acknowledgment
// ============================================================================
//
// This is not a gamification moment. This is a pause to breathe.
// The user just completed something meaningful. We honor that with:
// - Silence and space (not rushed transitions)
// - Beautiful, atmospheric visuals
// - Words that actually mean something
// - Time to absorb before moving on
// - Triumphant audio that makes the moment unforgettable
//
// Design principles:
// - Each phase LINGERS. User controls when to move forward.
// - Visuals create atmosphere, not distraction
// - Less text, more weight
// ============================================================================

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { Confetti } from '@/components/effects';
import { useStore } from '@/store/useStore';
import { useAudio } from '@/hooks/useAudio';
import { useTranslation } from '@/i18n';
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

type Phase = 'breathing' | 'acknowledgment' | 'growth' | 'wisdom';

export function RewardStep({ xpEarned, lesson, onComplete }: RewardStepProps) {
  const { totalXp, currentStreak, lastLessonDate, name } = useStore();
  const audio = useAudio();
  const { t, isRTL } = useTranslation();

  const [phase, setPhase] = useState<Phase>('breathing');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [canAdvance, setCanAdvance] = useState(false);

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
    () => getRandomQuote(leveledUp ? 'growth' : 'completion', lesson.id),
    [leveledUp, lesson.id]
  );

  // Progress
  const progress = getGrowthProgress(newTotalXp);
  const nextLevel = GROWTH_LEVELS.find(l => l.level === newLevel.level + 1);

  // Handle phase advancement
  const advancePhase = useCallback(() => {
    audio.playTap();
    setCanAdvance(false);

    switch (phase) {
      case 'breathing':
        setPhase('acknowledgment');
        break;
      case 'acknowledgment':
        setPhase('growth');
        if (leveledUp) {
          setShowLevelUp(true);
          setShowConfetti(true);
          audio.playLevelUp();
          audio.playCelebrate();
        }
        break;
      case 'growth':
        setPhase('wisdom');
        break;
      case 'wisdom':
        onComplete();
        break;
    }
  }, [phase, leveledUp, audio, onComplete]);

  // Enable advancement after minimum time per phase
  useEffect(() => {
    const timings: Record<Phase, number> = {
      breathing: 2000,      // 2 seconds of stillness
      acknowledgment: 3500, // 3.5 seconds to read the message
      growth: leveledUp ? 4500 : 3000, // 4.5s if level up, 3s otherwise
      wisdom: 4000,         // 4 seconds to absorb the quote
    };

    const timer = setTimeout(() => {
      setCanAdvance(true);
    }, timings[phase]);

    // Initial sound - a soft singing bowl to create sacred space
    if (phase === 'breathing') {
      audio.playSingingBowl();
    }

    return () => clearTimeout(timer);
  }, [phase, leveledUp, audio]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && canAdvance) {
        e.preventDefault();
        advancePhase();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canAdvance, advancePhase]);

  return (
    <div className="relative min-h-[420px] flex flex-col items-center justify-center px-4">
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: leveledUp
              ? 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, rgba(251,191,36,0) 70%)'
              : 'radial-gradient(circle, rgba(161,161,170,0.05) 0%, rgba(161,161,170,0) 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Confetti for level up */}
      <Confetti
        active={showConfetti}
        particleCount={80}
        duration={5000}
        onComplete={() => setShowConfetti(false)}
      />

      <AnimatePresence mode="wait">
        {/* Phase 0: Breathing - A moment of stillness */}
        {phase === 'breathing' && (
          <motion.div
            key="breathing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center text-center"
          >
            {/* Gentle breathing circle */}
            <motion.div
              className="w-32 h-32 rounded-full border border-zinc-700/50 flex items-center justify-center mb-12"
              animate={{
                scale: [1, 1.15, 1],
                borderColor: ['rgba(113,113,122,0.3)', 'rgba(113,113,122,0.6)', 'rgba(113,113,122,0.3)'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  className="w-3 h-3 rounded-full bg-amber-400/80"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-zinc-500 text-lg font-light tracking-wide"
            >
              {t('lessons.reward.takeABreath')}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-zinc-600 text-sm mt-2"
            >
              {t('lessons.reward.youShowedUp')}
            </motion.p>
          </motion.div>
        )}

        {/* Phase 1: Acknowledgment - The Personal Message */}
        {phase === 'acknowledgment' && (
          <motion.div
            key="acknowledgment"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center max-w-lg"
          >
            {/* Soft glowing orb */}
            <motion.div
              className="relative mb-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-amber-500/10 blur-2xl" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-900/40 to-stone-900 border border-amber-700/30 flex items-center justify-center">
                <motion.div
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(251,191,36,0.3)',
                      '0 0 40px rgba(251,191,36,0.5)',
                      '0 0 20px rgba(251,191,36,0.3)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>

            {/* The message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl md:text-3xl text-zinc-100 font-light leading-relaxed"
            >
              {completionMessage}
            </motion.p>

            {/* XP indicator - subtle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-sm text-zinc-600 mt-8"
            >
              +{safeXpEarned} {t('lessons.reward.growth')}
            </motion.p>
          </motion.div>
        )}

        {/* Phase 2: Growth - Streak & Level */}
        {phase === 'growth' && (
          <motion.div
            key="growth"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center w-full max-w-md"
          >
            {/* Level Up - Full Focus */}
            {showLevelUp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="mb-10 w-full"
              >
                {/* Level up container with glow */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 blur-3xl rounded-3xl" />
                  <div className="relative bg-gradient-to-br from-zinc-900/90 via-stone-900/90 to-zinc-900/90 border border-amber-500/30 rounded-2xl p-8">
                    {/* Shimmer */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      />
                    </motion.div>

                    <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-3">
                      {t('lessons.reward.youveGrown')}
                    </p>
                    <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">
                      {newLevel.title}
                    </h3>
                    <p className="text-zinc-400 italic mb-4">{newLevel.subtitle}</p>

                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent my-5" />

                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {newLevel.unlockMessage}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Streak Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: showLevelUp ? 0.5 : 0 }}
              className="flex flex-col items-center"
            >
              {/* Flame icon with glow */}
              <motion.div
                className="relative mb-4"
                animate={isFirstLessonToday ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{ duration: 0.6 }}
              >
                <div className={`absolute inset-0 rounded-full blur-xl ${
                  predictedStreak >= 30
                    ? 'bg-orange-500/30'
                    : predictedStreak >= 7
                    ? 'bg-amber-500/25'
                    : 'bg-amber-500/15'
                }`} />
                <Flame
                  className={`relative w-12 h-12 ${
                    predictedStreak >= 30
                      ? 'text-orange-400 fill-orange-400'
                      : predictedStreak >= 7
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-amber-500/80 fill-amber-500/80'
                  }`}
                />
              </motion.div>

              <span className="text-4xl font-bold text-white tracking-tight">
                {streakInfo.title}
              </span>
              <p className="text-zinc-400 mt-2 text-lg">{streakInfo.subtitle}</p>
            </motion.div>

            {/* Progress bar (if applicable) */}
            {nextLevel && !showLevelUp && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-10 w-full"
              >
                <div className="flex justify-between text-xs text-zinc-600 mb-2">
                  <span>{newLevel.title}</span>
                  <span>{nextLevel.title}</span>
                </div>
                <div className="h-1 bg-zinc-800/80 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-600 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Phase 3: Wisdom - The Quote */}
        {phase === 'wisdom' && (
          <motion.div
            key="wisdom"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center max-w-lg"
          >
            {/* Decorative quote marks */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-8xl font-serif text-amber-500 mb-4 select-none"
            >
              &ldquo;
            </motion.div>

            {/* The wisdom */}
            <motion.blockquote
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-zinc-200 font-light leading-relaxed italic -mt-8"
            >
              {wisdomQuote.text}
            </motion.blockquote>

            {/* Author */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-zinc-500 mt-6 text-sm tracking-wide"
            >
              — {wisdomQuote.author}
            </motion.p>

            {/* Lesson title - very subtle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-zinc-700 text-xs mt-10"
            >
              {lesson.title}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - appears after minimum time */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 flex justify-center pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: canAdvance ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {phase === 'wisdom' ? (
          <Button
            onClick={advancePhase}
            disabled={!canAdvance}
            className="group"
          >
            {t('lessons.reward.continueToMentor')}
            <ChevronRight className={`w-4 h-4 ${isRTL ? 'mr-1 group-hover:-translate-x-1' : 'ml-1 group-hover:translate-x-1'} transition-transform`} />
          </Button>
        ) : (
          <button
            onClick={advancePhase}
            disabled={!canAdvance}
            className={`flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors py-3 px-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <span className="text-sm">{t('common.continue')}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        )}
      </motion.div>

      {/* Phase indicators */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2">
        {(['breathing', 'acknowledgment', 'growth', 'wisdom'] as Phase[]).map((p, i) => (
          <motion.div
            key={p}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              phase === p
                ? 'bg-amber-400'
                : i < ['breathing', 'acknowledgment', 'growth', 'wisdom'].indexOf(phase)
                ? 'bg-zinc-600'
                : 'bg-zinc-800'
            }`}
            animate={phase === p ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}

export default RewardStep;
