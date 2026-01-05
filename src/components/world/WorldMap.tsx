'use client';

import { motion } from 'framer-motion';
import { Lock, CheckCircle, Sparkles, Star, Flame, Eye, Sword, Mountain, Circle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { World, Lesson } from '@/types';
import type { LucideIcon } from 'lucide-react';

interface WorldMapProps {
  world: World;
  onSelectLesson: (lessonId: string) => void;
}

// Position lessons in a winding path up the mountain
function getPathPosition(index: number, total: number): { x: number; y: number } {
  // Create a winding S-curve path from bottom to top
  const progress = index / Math.max(total - 1, 1);
  const y = 100 - progress * 85; // Bottom to top (leave room for summit)

  // Sine wave for winding effect
  const amplitude = 25;
  const frequency = 2;
  const baseX = 50;
  const x = baseX + Math.sin(progress * Math.PI * frequency) * amplitude;

  return { x, y };
}

export function WorldMap({ world, onSelectLesson }: WorldMapProps) {
  const { completedLessons } = useStore();

  // Flatten all lessons for the path
  const allLessons = world.chapters.flatMap((ch) => ch.lessons);
  const completedCount = allLessons.filter((l) => completedLessons[l.id]).length;
  const progress = (completedCount / allLessons.length) * 100;

  // Find next lesson
  const nextLesson = allLessons.find((l) => !completedLessons[l.id]) || null;

  // Check if a lesson is accessible
  const isLessonAccessible = (targetLessonId: string) => {
    for (const lesson of allLessons) {
      if (lesson.id === targetLessonId) return true;
      if (!completedLessons[lesson.id]) return false;
    }
    return false;
  };

  const iconMap: Record<string, LucideIcon> = {
    Flame, Eye, Sword, Mountain, Circle,
  };

  const getIcon = (iconName: string): LucideIcon => iconMap[iconName] || Circle;

  // Generate path points for SVG
  const pathPoints = allLessons.map((_, i) => getPathPosition(i, allLessons.length));

  // Create SVG path string
  const createPathD = () => {
    if (pathPoints.length < 2) return '';
    let d = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      const prev = pathPoints[i - 1];
      const curr = pathPoints[i];
      // Bezier curve for smoother path
      const cpX = (prev.x + curr.x) / 2;
      d += ` Q ${prev.x} ${(prev.y + curr.y) / 2} ${cpX} ${curr.y}`;
    }
    return d;
  };

  const WorldIcon = getIcon(world.iconName);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/20 overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-200/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Mountain silhouettes */}
        <svg className="absolute bottom-0 left-0 right-0 h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 L15 40 L30 70 L50 20 L70 60 L85 30 L100 100 Z" fill="url(#mountainGrad)" />
          <defs>
            <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78716c" />
              <stop offset="100%" stopColor="#1c1917" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6 pb-0"
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <WorldIcon size={28} className="text-amber-400" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-amber-50">{world.name}</h1>
            <p className="text-sm text-stone-400">{world.subtitle}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-stone-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
        <p className="text-xs text-stone-500 mt-2 text-center">
          {completedCount} of {allLessons.length} lessons complete
        </p>
      </motion.div>

      {/* Journey Map */}
      <div className="relative z-10 px-6 py-8" style={{ minHeight: '70vh' }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 110"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Path trail */}
          <motion.path
            d={createPathD()}
            fill="none"
            stroke="#78716c"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          {/* Completed path */}
          <motion.path
            d={createPathD()}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>

        {/* Summit marker */}
        <motion.div
          className="absolute"
          style={{ left: '50%', top: '5%', transform: 'translateX(-50%)' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <div className="relative">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(251, 191, 36, 0.3)',
                  '0 0 40px rgba(251, 191, 36, 0.5)',
                  '0 0 20px rgba(251, 191, 36, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={28} className="text-stone-900" />
            </motion.div>
            <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-amber-400 whitespace-nowrap">
              Summit
            </p>
          </div>
        </motion.div>

        {/* Lesson nodes */}
        {allLessons.map((lesson, index) => {
          const pos = getPathPosition(index, allLessons.length);
          const isCompleted = completedLessons[lesson.id];
          const isAccessible = isLessonAccessible(lesson.id);
          const isNext = nextLesson?.id === lesson.id;

          return (
            <motion.button
              key={lesson.id}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              onClick={() => isAccessible && onSelectLesson(lesson.id)}
              disabled={!isAccessible}
              whileHover={isAccessible ? { scale: 1.1 } : {}}
              whileTap={isAccessible ? { scale: 0.95 } : {}}
            >
              {/* Glow effect for next lesson */}
              {isNext && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-amber-500"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ margin: -4 }}
                />
              )}

              {/* Node */}
              <div
                className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 shadow-lg shadow-emerald-500/30'
                    : isNext
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 shadow-lg shadow-amber-500/40 animate-pulse-warm'
                    : isAccessible
                    ? 'bg-stone-800 border-stone-600 hover:border-amber-500/50'
                    : 'bg-stone-900 border-stone-700 opacity-40'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle size={20} className="text-white" />
                ) : !isAccessible ? (
                  <Lock size={16} className="text-stone-500" />
                ) : isNext ? (
                  <Star size={20} className="text-stone-900" />
                ) : (
                  <span className="text-sm font-bold text-stone-300">{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <div
                className={`absolute top-full mt-2 whitespace-nowrap text-center ${
                  index % 2 === 0 ? 'left-1/2 -translate-x-1/2' : 'left-1/2 -translate-x-1/2'
                }`}
              >
                <p
                  className={`text-xs font-medium max-w-[80px] truncate ${
                    isCompleted
                      ? 'text-emerald-400'
                      : isNext
                      ? 'text-amber-400'
                      : isAccessible
                      ? 'text-stone-300'
                      : 'text-stone-600'
                  }`}
                >
                  {lesson.title}
                </p>
                {isAccessible && !isCompleted && (
                  <p className="text-[10px] text-stone-500">{lesson.xpReward} XP</p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom gradient fade */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-950 to-transparent pointer-events-none z-20" />
    </div>
  );
}

export default WorldMap;
