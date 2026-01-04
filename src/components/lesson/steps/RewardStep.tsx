'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, TrendingUp } from 'lucide-react';
import { Button, ProgressBar } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { getLevelFromXp, getXpProgress } from '@/types';
import type { Lesson } from '@/types';

interface RewardStepProps {
  xpEarned: number;
  lesson: Lesson;
  onComplete: () => void;
}

export function RewardStep({ xpEarned, lesson, onComplete }: RewardStepProps) {
  const { totalXp, currentStreak } = useStore();
  const [displayXp, setDisplayXp] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const previousXp = totalXp;
  const newTotalXp = totalXp + xpEarned;
  const previousLevel = getLevelFromXp(previousXp);
  const newLevel = getLevelFromXp(newTotalXp);
  const leveledUp = newLevel.level > previousLevel.level;

  // Animate XP count
  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const increment = xpEarned / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= xpEarned) {
        setDisplayXp(xpEarned);
        clearInterval(timer);

        if (leveledUp) {
          setTimeout(() => setShowLevelUp(true), 300);
        }
      } else {
        setDisplayXp(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [xpEarned, leveledUp]);

  const xpProgress = getXpProgress(newTotalXp);

  return (
    <div className="text-center">
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
                scale: [0, 1, 1],
                opacity: [1, 1, 0],
                x: [0, Math.cos((i * Math.PI) / 4) * 60],
                y: [0, Math.sin((i * Math.PI) / 4) * 60],
              }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute left-1/2 top-1/2 w-2 h-2 bg-amber-400 rounded-full"
              style={{ marginLeft: -4, marginTop: -4 }}
            />
          ))}

          {/* XP badge */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/30"
          >
            <div className="text-center">
              <Zap size={24} className="mx-auto text-white mb-1" />
              <span className="text-3xl font-bold text-white">+{displayXp}</span>
              <span className="text-sm text-amber-200 block">XP</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Level up notification */}
      {showLevelUp && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-6 p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl"
        >
          <div className="flex items-center justify-center gap-2 text-indigo-400 mb-1">
            <TrendingUp size={20} />
            <span className="font-semibold">Level Up!</span>
          </div>
          <p className="text-white font-bold text-lg">{newLevel.title}</p>
          <p className="text-sm text-zinc-400">Level {newLevel.level}</p>
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
          <span className="text-sm text-zinc-400">
            Level {newLevel.level + 1}
          </span>
        </div>
        <ProgressBar progress={xpProgress.percentage} color="indigo" />
        <p className="text-xs text-zinc-500 mt-2">
          {xpProgress.current} / {xpProgress.needed === Infinity ? '∞' : xpProgress.needed} XP
        </p>
      </motion.div>

      {/* Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-2 mb-8"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Flame size={24} className="text-orange-500 fill-orange-500" />
        </motion.div>
        <span className="text-xl font-bold text-white">{currentStreak + 1}</span>
        <span className="text-zinc-400">day streak</span>
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
        <Button size="lg" onClick={onComplete} className="w-full">
          Continue to Mentor
        </Button>
      </motion.div>
    </div>
  );
}

export default RewardStep;
