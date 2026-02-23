'use client';

import { motion } from 'framer-motion';
import { Lock, CheckCircle, Star, Flame } from 'lucide-react';
import { EmptyState } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/i18n';

// Generic world type for the map - works with both legacy and Modern Wisdom
interface MapWorld {
  name: string;
  subtitle: string;
  chapters: Array<{
    lessons: Array<{
      id: string;
      title: string;
      xpReward: number;
    }>;
  }>;
}

interface WorldMapProps {
  world: MapWorld;
  onSelectLesson: (lessonId: string) => void;
}

export function WorldMap({ world, onSelectLesson }: WorldMapProps) {
  const { completedLessons } = useStore();
  const { t, isRTL } = useTranslation();

  // Flatten all lessons in order
  const allLessons = world.chapters.flatMap((ch) => ch.lessons);
  const completedCount = allLessons.filter((l) => completedLessons[l.id]).length;
  const progress = (completedCount / allLessons.length) * 100;

  // Find next lesson
  const nextLesson = allLessons.find((l) => !completedLessons[l.id]) || null;

  // Check if a lesson is accessible (all previous lessons completed)
  const isLessonAccessible = (index: number) => {
    for (let i = 0; i < index; i++) {
      if (!completedLessons[allLessons[i].id]) return false;
    }
    return true;
  };

  return (
    <div className={`min-h-screen bg-stone-950 light:bg-stone-50 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-stone-950/95 light:bg-stone-50/95 backdrop-blur border-b border-stone-800 light:border-stone-300">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
              <Flame size={24} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white light:text-stone-900">{world.name}</h1>
              <p className="text-sm text-stone-500 light:text-stone-600">{world.subtitle}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-stone-800 light:bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-stone-500 light:text-stone-600 mt-2 text-center">
            {t('world.lessonsProgress')
              .replace('{completed}', completedCount.toString())
              .replace('{total}', allLessons.length.toString())}
          </p>
        </div>
      </div>

      {/* Scrollable lesson list */}
      <div className="pb-24 pt-4">
        <div className="relative max-w-sm mx-auto px-8">
          {completedCount === allLessons.length && (
            <EmptyState
              icon={<Star size={24} />}
              title={t('world.complete')}
              description={t('dailyFlow.revisitDeepen')}
              className="pt-2 pb-6"
            />
          )}

          {/* Vertical connecting line */}
          <div className="absolute left-1/2 top-8 bottom-8 w-0.5 bg-stone-800 light:bg-stone-300 -translate-x-1/2" />

          {/* Completed progress line overlay */}
          <motion.div
            className="absolute left-1/2 top-8 w-0.5 bg-gradient-to-b from-emerald-500 to-emerald-400 -translate-x-1/2 origin-top"
            initial={{ height: 0 }}
            animate={{ height: `${Math.min(progress, 100) * 0.84}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          />

          {/* Lesson nodes */}
          <div className="relative space-y-6">
            {allLessons.map((lesson, index) => {
              const isCompleted = completedLessons[lesson.id];
              const isNext = nextLesson?.id === lesson.id;
              const accessible = isLessonAccessible(index);
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="relative"
                >
                  {/* Node and content wrapper */}
                  <div className={`flex items-center gap-4 ${isEven ? '' : 'flex-row-reverse'}`}>
                    {/* Lesson info card */}
                    <button
                      onClick={() => accessible && onSelectLesson(lesson.id)}
                      disabled={!accessible}
                      className={`flex-1 text-left p-4 rounded-2xl border transition-all ${
                        isCompleted
                          ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                          : isNext
                          ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50'
                          : accessible
                          ? 'bg-stone-800/50 light:bg-stone-100/90 border-stone-700 light:border-stone-300 hover:border-stone-600 light:hover:border-stone-400'
                          : 'bg-stone-900/30 light:bg-stone-100/70 border-stone-800/50 light:border-stone-300 opacity-50'
                      }`}
                    >
                      <p className={`font-medium text-sm mb-1 ${
                        isCompleted
                          ? 'text-emerald-300'
                          : isNext
                          ? 'text-amber-300'
                          : accessible
                          ? 'text-white light:text-stone-900'
                          : 'text-stone-600 light:text-stone-500'
                      }`}>
                        {lesson.title}
                      </p>
                      <p className={`text-xs ${
                        accessible ? 'text-stone-500 light:text-stone-600' : 'text-stone-700 light:text-stone-500'
                      }`}>
                        {isCompleted ? `✓ ${t('world.completed')}` : `${lesson.xpReward} ${t('common.xp')}`}
                      </p>
                    </button>

                    {/* Center node */}
                    <button
                      onClick={() => accessible && onSelectLesson(lesson.id)}
                      disabled={!accessible}
                      className="relative flex-shrink-0"
                    >
                      {/* Pulse animation for next lesson */}
                      {isNext && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-amber-500"
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.6, 0, 0.6],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      )}

                      {/* Node circle */}
                      <div
                        className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-3 transition-all ${
                          isCompleted
                            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 shadow-lg shadow-emerald-500/30'
                            : isNext
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 shadow-lg shadow-amber-500/40'
                            : accessible
                            ? 'bg-stone-800 light:bg-stone-200 border-stone-600 light:border-stone-400 hover:border-stone-500 light:hover:border-stone-500'
                            : 'bg-stone-900 light:bg-stone-100 border-stone-800 light:border-stone-300'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={24} className="text-white" />
                        ) : !accessible ? (
                          <Lock size={18} className="text-stone-600 light:text-stone-500" />
                        ) : isNext ? (
                          <Star size={22} className="text-stone-900" />
                        ) : (
                          <span className="text-lg font-bold text-stone-400 light:text-stone-600">{index + 1}</span>
                        )}
                      </div>
                    </button>

                    {/* Empty space for alignment */}
                    <div className="flex-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summit marker at the end */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + allLessons.length * 0.05 }}
            className="relative mt-8 flex justify-center"
          >
            <div className="relative">
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30"
                animate={completedCount === allLessons.length ? {
                  boxShadow: [
                    '0 0 20px rgba(251, 191, 36, 0.3)',
                    '0 0 40px rgba(251, 191, 36, 0.5)',
                    '0 0 20px rgba(251, 191, 36, 0.3)',
                  ],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-3xl">⭐</span>
              </motion.div>
              <p className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-sm font-medium text-amber-400 whitespace-nowrap">
                {completedCount === allLessons.length ? t('world.complete') : t('world.summit')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default WorldMap;
