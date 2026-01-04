'use client';

import { motion } from 'framer-motion';
import { Lock, CheckCircle, ChevronRight, Flame, Eye, Sword, Mountain, Circle } from 'lucide-react';
import { ProgressBar } from '@/components/ui';
import { useStore } from '@/store/useStore';
import type { World } from '@/types';
import type { LucideIcon } from 'lucide-react';

interface WorldMapProps {
  world: World;
  onSelectLesson: (lessonId: string) => void;
}

export function WorldMap({ world, onSelectLesson }: WorldMapProps) {
  const { completedLessons } = useStore();

  // Calculate progress
  const allLessons = world.chapters.flatMap((ch) => ch.lessons);
  const completedCount = allLessons.filter((l) => completedLessons[l.id]).length;
  const progress = (completedCount / allLessons.length) * 100;

  // Find next lesson
  const getNextLesson = () => {
    for (const chapter of world.chapters) {
      for (const lesson of chapter.lessons) {
        if (!completedLessons[lesson.id]) {
          return lesson;
        }
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();

  // Check if a lesson is unlocked (previous lesson completed or it's the first)
  const isLessonUnlocked = (lessonId: string) => {
    let foundPrevious = false;
    for (const chapter of world.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.id === lessonId) {
          // First lesson is always unlocked
          if (!foundPrevious) return true;
          return true;
        }
        if (!completedLessons[lesson.id]) {
          // This lesson isn't complete, so next one is locked
          // unless it's the current one
          if (foundPrevious) return false;
        }
        foundPrevious = true;
      }
    }
    return false;
  };

  // Actually, simpler logic: a lesson is unlocked if all previous lessons are complete
  const isLessonAccessible = (targetLessonId: string) => {
    for (const chapter of world.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.id === targetLessonId) {
          return true; // We've reached the target, it's accessible
        }
        if (!completedLessons[lesson.id]) {
          return false; // Found an incomplete lesson before target
        }
      }
    }
    return false;
  };

  const iconMap: Record<string, LucideIcon> = {
    Flame,
    Eye,
    Sword,
    Mountain,
    Circle,
  };

  const getIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Circle;
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      {/* World header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${world.color}20` }}
        >
          {(() => {
            const IconComponent = getIcon(world.iconName);
            return (
              <IconComponent size={32} className="text-white" style={{ color: world.color }} />
            );
          })()}
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">{world.name}</h1>
        <p className="text-zinc-400 mb-4">{world.subtitle}</p>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <ProgressBar progress={progress} size="sm" className="flex-1" />
          <span className="text-sm text-zinc-400">
            {completedCount}/{allLessons.length}
          </span>
        </div>
      </motion.div>

      {/* Chapters */}
      <div className="space-y-8">
        {world.chapters.map((chapter, chapterIndex) => {
          const chapterLessons = chapter.lessons;
          const chapterCompleted = chapterLessons.filter(
            (l) => completedLessons[l.id]
          ).length;
          const chapterProgress = (chapterCompleted / chapterLessons.length) * 100;
          const ChapterIcon = getIcon(chapter.iconName);

          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chapterIndex * 0.1 }}
            >
              {/* Chapter header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${world.color}15` }}
                >
                  <ChapterIcon size={20} style={{ color: world.color }} />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-white">{chapter.name}</h2>
                  <p className="text-xs text-zinc-500">{chapter.subtitle}</p>
                </div>
                <span className="text-xs text-zinc-500">
                  {chapterCompleted}/{chapterLessons.length}
                </span>
              </div>

              {/* Lessons */}
              <div className="space-y-2 ml-2 border-l-2 border-zinc-800 pl-6">
                {chapter.lessons.map((lesson, lessonIndex) => {
                  const isCompleted = completedLessons[lesson.id];
                  const isAccessible = isLessonAccessible(lesson.id);
                  const isNext = nextLesson?.id === lesson.id;

                  return (
                    <motion.button
                      key={lesson.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: chapterIndex * 0.1 + lessonIndex * 0.05 }}
                      onClick={() => isAccessible && onSelectLesson(lesson.id)}
                      disabled={!isAccessible}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        isCompleted
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : isNext
                          ? 'bg-indigo-500/10 border-indigo-500/30 hover:border-indigo-500/50'
                          : isAccessible
                          ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                          : 'bg-zinc-900/50 border-zinc-800/50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {/* Status icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : isNext
                            ? 'bg-indigo-500'
                            : isAccessible
                            ? 'bg-zinc-700'
                            : 'bg-zinc-800'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={16} className="text-white" />
                        ) : !isAccessible ? (
                          <Lock size={14} className="text-zinc-500" />
                        ) : (
                          <span className="text-xs font-bold text-white">
                            {lessonIndex + 1}
                          </span>
                        )}
                      </div>

                      {/* Lesson info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium truncate ${
                            isCompleted
                              ? 'text-emerald-400'
                              : isAccessible
                              ? 'text-white'
                              : 'text-zinc-500'
                          }`}
                        >
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-zinc-500 truncate">
                          {Math.ceil(lesson.actionDurationSeconds / 60)} min •{' '}
                          {lesson.xpReward} XP
                        </p>
                      </div>

                      {/* Arrow for next lesson */}
                      {isNext && (
                        <ChevronRight size={20} className="text-indigo-400" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default WorldMap;
