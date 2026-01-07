'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, TrendingUp } from 'lucide-react';
import { Button, ProgressBar } from '@/components/ui';
import { Confetti, XPOrbs } from '@/components/effects';
import { useStore } from '@/store/useStore';
import { useSound } from '@/hooks/useSound';
import { getLevelFromXp, getXpProgress, LEVELS } from '@/types';
import type { Lesson } from '@/types';

interface RewardStepProps {
  xpEarned: number;
  lesson: Lesson;
  onComplete: () => void;
}

export function RewardStep({ xpEarned, lesson, onComplete }: RewardStepProps) {
  const { totalXp, currentStreak, lastLessonDate } = useStore();
  const { playLevelUp, playXpCount, playStreak, playCelebration, playTap, playWhoosh } = useSound();
  const [displayXp, setDisplayXp] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const hasAnimatedRef = useRef(false);

  const previousXp = totalXp;
  const newTotalXp = totalXp + xpEarned;
  const previousLevel = getLevelFromXp(previousXp);
  const newLevel = getLevelFromXp(newTotalXp);
  const leveledUp = newLevel.level > previousLevel.level;

  // Calculate what streak will be after this lesson
  const today = new Date().toISOString().split('T')[0];
  const isFirstLessonToday = lastLessonDate !== today;
  const predictedStreak = isFirstLessonToday ? currentStreak + 1 : currentStreak;

  // Check if max level
  const nextLevel = LEVELS.find(l => l.level === newLevel.level + 1);
  const isMaxLevel = !nextLevel;

  // Animate XP count and play sounds - ONLY ONCE
  useEffect(() => {
    // Prevent multiple runs
    if (hasAnimatedRef.current) {
      return;
    }

    console.log('RewardStep received xpEarned:', xpEarned);

    // Handle edge case of 0 XP
    if (xpEarned <= 0) {
      setDisplayXp(0);
      hasAnimatedRef.current = true;
      return;
    }

    // Mark as animated immediately to prevent re-runs
    hasAnimatedRef.current = true;

    let intervalId: NodeJS.Timeout | null = null;
    let current = 0;

    const startDelay = 300;
    const duration = 800;
    const steps = Math.max(Math.min(xpEarned, 25), 1);
    const stepDuration = duration / steps;

    const delayTimer = setTimeout(() => {
      // Play sound ticks with the count
      playXpCount(Math.min(xpEarned, 20));

      intervalId = setInterval(() => {
        current += 1;
        if (current >= xpEarned) {
          setDisplayXp(xpEarned);
          if (intervalId) clearInterval(intervalId);

          if (leveledUp) {
            setTimeout(() => {
              setShowLevelUp(true);
              playLevelUp();
              playCelebration();
            }, 300);
          }

          // Play streak sound for milestones
          if (isFirstLessonToday) {
            const streakMilestones = [7, 14, 30, 50, 100];
            if (streakMilestones.includes(predictedStreak)) {
              setTimeout(() => playStreak(), 600);
            }
          }
        } else {
          setDisplayXp(current);
        }
      }, stepDuration);
    }, startDelay);

    return () => {
      clearTimeout(delayTimer);
      if (intervalId) clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xpEarned]); // Only depend on xpEarned - animation runs once per mount

  const xpProgress = getXpProgress(newTotalXp);
  const [showConfetti, setShowConfetti] = useState(true);
  const [showXPOrbs, setShowXPOrbs] = useState(true);

  return (
    <div className="text-center">
      {/* Confetti celebration */}
      <Confetti
        active={showConfetti}
        particleCount={leveledUp ? 80 : 50}
        duration={leveledUp ? 4000 : 3000}
        onComplete={() => setShowConfetti(false)}
      />

      {/* XP Orbs floating up */}
      {showXPOrbs && (
        <XPOrbs
          count={Math.min(Math.floor(xpEarned / 5), 15)}
          onCollect={() => setShowXPOrbs(false)}
        />
      )}

      {/* Celebration animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="mb-8"
      >
        {/* Stars/particles animation */}
        <div className="relative">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: [1, 1, 0],
                x: [0, Math.cos((i * Math.PI) / 4) * 80],
                y: [0, Math.sin((i * Math.PI) / 4) * 80],
              }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
              style={{
                marginLeft: -6,
                marginTop: -6,
                background: `linear-gradient(135deg, ${i % 2 === 0 ? '#fbbf24' : '#f97316'}, ${i % 2 === 0 ? '#f59e0b' : '#ea580c'})`,
                boxShadow: `0 0 10px ${i % 2 === 0 ? '#fbbf24' : '#f97316'}50`
              }}
            />
          ))}

          {/* XP badge - enhanced with glow */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="relative w-36 h-36 mx-auto"
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 blur-xl opacity-50"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Main badge */}
            <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/40">
              {/* Inner shine */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-300/30 to-transparent" />

              <div className="text-center relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Zap size={28} className="mx-auto text-white drop-shadow-lg mb-1" />
                </motion.div>
                <span className="text-4xl font-bold text-white drop-shadow-lg">+{displayXp}</span>
                <span className="text-sm text-amber-100 block font-medium">XP</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Level up notification */}
      {showLevelUp && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="mb-6 p-5 bg-gradient-to-r from-purple-600/20 via-indigo-500/20 to-amber-500/20 border border-purple-500/30 rounded-2xl relative overflow-hidden"
        >
          {/* Animated background shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative z-10">
            <motion.div
              className="flex items-center justify-center gap-2 text-purple-300 mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              <TrendingUp size={22} className="text-amber-400" />
              <span className="font-bold text-lg bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
                Level Up!
              </span>
            </motion.div>
            <p className="text-white font-bold text-xl">{newLevel.title}</p>
            <p className="text-sm text-purple-300/80">Level {newLevel.level}</p>
          </div>
        </motion.div>
      )}

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-zinc-400">{newLevel.title}</span>
          {!isMaxLevel && (
            <span className="text-sm text-zinc-400">
              {nextLevel?.title}
            </span>
          )}
        </div>
        <ProgressBar progress={isMaxLevel ? 100 : xpProgress.percentage} color="indigo" />
        <p className="text-xs text-zinc-500 mt-2">
          {isMaxLevel
            ? `${newTotalXp} XP total - Max level reached!`
            : `${xpProgress.current} / ${xpProgress.needed} XP to next level`
          }
        </p>
      </motion.div>

      {/* Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-3 mb-8 py-3 px-5 bg-gradient-to-r from-orange-500/10 to-rose-500/10 rounded-full border border-orange-500/20"
      >
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
          }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          className="relative"
        >
          <Flame size={28} className="text-orange-500 fill-orange-500 drop-shadow-lg" />
          {isFirstLessonToday && (
            <motion.div
              className="absolute -inset-1 rounded-full bg-orange-500/30 blur-md"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
        <span className="text-2xl font-bold text-white">{predictedStreak}</span>
        <span className="text-stone-300">day streak</span>
        {isFirstLessonToday && predictedStreak > currentStreak && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="text-lg"
          >
            🔥
          </motion.span>
        )}
      </motion.div>

      {/* Lesson title reminder */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-zinc-500 mb-8"
      >
        Lesson complete: {lesson.title}
      </motion.p>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          size="lg"
          onClick={() => {
            playTap();
            playWhoosh();
            onComplete();
          }}
          className="w-full"
        >
          Continue to Mentor
        </Button>
      </motion.div>
    </div>
  );
}

export default RewardStep;
