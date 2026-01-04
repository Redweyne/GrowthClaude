'use client';

import { motion } from 'framer-motion';
import { Play, Flame, Zap, Map, Settings, Brain, Calendar } from 'lucide-react';
import { Button, Card, StreakBadge, XPBadge, ProgressBar } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { getLevelFromXp, getXpProgress } from '@/types';
import type { Lesson, World } from '@/types';

interface TodaysLessonProps {
  lesson: Lesson | null;
  world: World;
  onStartLesson: () => void;
  onOpenMap: () => void;
  onOpenSettings: () => void;
  onOpenPractice: () => void;
  onOpenCheckin: () => void;
  isCheckinDue: boolean;
}

export function TodaysLesson({
  lesson,
  world,
  onStartLesson,
  onOpenMap,
  onOpenSettings,
  onOpenPractice,
  onOpenCheckin,
  isCheckinDue,
}: TodaysLessonProps) {
  const { name, totalXp, currentStreak, completedLessons } = useStore();
  const level = getLevelFromXp(totalXp);
  const xpProgress = getXpProgress(totalXp);

  // Calculate world progress
  const allLessons = world.chapters.flatMap((ch) => ch.lessons);
  const completedCount = allLessons.filter((l) => completedLessons[l.id]).length;
  const worldProgress = (completedCount / allLessons.length) * 100;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const allComplete = !lesson;

  return (
    <div className="min-h-screen bg-zinc-950 p-6 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <p className="text-zinc-500 text-sm">{greeting()}</p>
          <h1 className="text-2xl font-bold text-white">
            {name || 'Seeker'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <StreakBadge streak={currentStreak} />
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-zinc-700 transition-colors"
          >
            <Settings size={20} className="text-zinc-400" />
          </button>
        </div>
      </motion.div>

      {/* Level progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card variant="glass" padding="md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">{level.level}</span>
              </div>
              <div>
                <p className="text-white font-medium">{level.title}</p>
                <p className="text-xs text-zinc-500">Level {level.level}</p>
              </div>
            </div>
            <XPBadge xp={totalXp} />
          </div>
          <ProgressBar progress={xpProgress.percentage} size="sm" />
          <p className="text-xs text-zinc-500 mt-2">
            {xpProgress.current} / {xpProgress.needed === Infinity ? '∞' : xpProgress.needed} XP to next level
          </p>
        </Card>
      </motion.div>

      {/* Weekly check-in banner */}
      {isCheckinDue && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={onOpenCheckin}
          className="w-full mb-6 p-4 rounded-xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 flex items-center justify-between hover:from-rose-500/30 hover:to-pink-500/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <Calendar size={20} className="text-rose-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Weekly Check-in</p>
              <p className="text-xs text-zinc-400">Reflect on your progress</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <Zap size={14} />
            <span className="text-sm font-medium">+50 XP</span>
          </div>
        </motion.button>
      )}

      {/* Main content - Today's lesson */}
      <div className="flex-1 flex flex-col justify-center">
        {allComplete ? (
          // All lessons complete
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              All caught up!
            </h2>
            <p className="text-zinc-400 mb-6">
              You&apos;ve completed all available lessons in {world.name}.
            </p>
            <Button size="lg" onClick={onOpenPractice} className="w-full mb-3">
              <Brain size={18} className="mr-2" />
              Practice Mode
            </Button>
            {isCheckinDue && (
              <Button size="lg" variant="secondary" onClick={onOpenCheckin} className="w-full mb-3">
                <Calendar size={18} className="mr-2" />
                Weekly Check-in
              </Button>
            )}
            <Button variant="secondary" onClick={onOpenMap} className="w-full">
              <Map size={18} className="mr-2" />
              View Progress
            </Button>
          </motion.div>
        ) : (
          // Lesson available
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-center text-zinc-500 text-sm mb-4">
              TODAY&apos;S LESSON
            </p>

            <Card
              variant="elevated"
              padding="lg"
              className="mb-6 border border-zinc-800"
            >
              {/* World indicator */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${world.color}20` }}
                >
                  <Flame size={14} style={{ color: world.color }} />
                </div>
                <span className="text-sm text-zinc-400">{world.name}</span>
              </div>

              {/* Lesson title */}
              <h2 className="text-xl font-bold text-white mb-2">
                {lesson?.title}
              </h2>

              {/* Lesson meta */}
              <div className="flex items-center gap-4 text-sm text-zinc-500 mb-6">
                <span>
                  ~{Math.ceil((lesson?.actionDurationSeconds || 120) / 60 + 2)} min
                </span>
                <span className="flex items-center gap-1">
                  <Zap size={14} className="text-amber-500" />
                  {lesson?.xpReward} XP
                </span>
              </div>

              {/* Start button */}
              <Button size="lg" onClick={onStartLesson} className="w-full">
                <Play size={20} className="mr-2" />
                Start Lesson
              </Button>
            </Card>

            {/* World progress */}
            <div className="flex items-center justify-between text-sm mb-4">
              <button
                onClick={onOpenMap}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                <Map size={16} />
                View all lessons
              </button>
              <span className="text-zinc-500">
                {completedCount}/{allLessons.length} complete
              </span>
            </div>

            {/* Practice mode button - only show if there are completed lessons */}
            {completedCount > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={onOpenPractice}
                className="w-full p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between hover:bg-indigo-500/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Brain size={20} className="text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Practice Mode</p>
                    <p className="text-xs text-zinc-500">Reinforce what you&apos;ve learned</p>
                  </div>
                </div>
                <Zap size={16} className="text-amber-400" />
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom nav hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8"
      >
        <p className="text-xs text-zinc-600">
          {currentStreak > 0
            ? `${currentStreak} day streak - keep it going!`
            : 'Start your streak today'}
        </p>
      </motion.div>
    </div>
  );
}

export default TodaysLesson;
