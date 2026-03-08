'use client';

import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';
import { LessonNode } from './LessonNode';
import type { ChapterTheme } from '@/lib/chapterThemes';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface ChapterLesson {
  id: string;
  title: string;
  xpReward: number;
}

interface ChapterSectionProps {
  chapterLabel: string;
  chapterTitle: string;
  chapterSubtitle: string;
  lessons: ChapterLesson[];
  completedLessons: Record<string, boolean>;
  nextLessonId: string | null;
  globalLessonOffset: number;
  isChapterAccessible: boolean;
  theme: ChapterTheme;
  chapterIndex: number;
  onSelectLesson: (id: string) => void;
  completedLabel: string;
  xpLabel: string;
  enterLabel: string;
}

export const ChapterSection = memo(function ChapterSection({
  chapterLabel,
  chapterTitle,
  chapterSubtitle,
  lessons,
  completedLessons,
  nextLessonId,
  globalLessonOffset,
  isChapterAccessible,
  theme,
  chapterIndex,
  onSelectLesson,
  completedLabel,
  xpLabel,
  enterLabel,
}: ChapterSectionProps) {
  const completedCount = lessons.filter(l => completedLessons[l.id]).length;
  const chapterProgress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;
  const isChapterComplete = completedCount === lessons.length;

  const getLessonStatus = (lesson: ChapterLesson, lessonGlobalIndex: number): 'completed' | 'active' | 'accessible' | 'locked' => {
    if (completedLessons[lesson.id]) return 'completed';
    if (lesson.id === nextLessonId) return 'active';
    if (!isChapterAccessible) return 'locked';
    // Check if all prior lessons (globally) are completed
    return 'locked';
  };

  return (
    <motion.section
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: chapterIndex * 0.15 }}
    >
      {/* Chapter background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={`${basePath}${theme.backgroundImage}`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          loading="lazy"
        />
        {/* Gradient overlays for atmosphere */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${theme.colors.gradientFrom} 0%, ${theme.colors.gradientVia} 40%, ${theme.colors.gradientTo} 100%)`,
          }}
        />
        {/* Top edge fade into cosmic bg */}
        <div
          className="absolute top-0 left-0 right-0 h-24"
          style={{
            background: 'linear-gradient(180deg, rgba(4,2,8,0.95) 0%, transparent 100%)',
          }}
        />
        {/* Bottom edge fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background: 'linear-gradient(0deg, rgba(4,2,8,0.95) 0%, transparent 100%)',
          }}
        />
        {/* Atmospheric fog glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${theme.colors.fog}, transparent 70%)`,
          }}
        />
      </div>

      {/* Chapter content */}
      <div className="relative z-10 px-5 py-10">
        {/* Chapter header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Chapter label */}
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1"
            style={{ color: theme.colors.mutedText }}
          >
            {chapterLabel}
          </p>

          {/* Chapter title */}
          <h2
            className="text-xl sm:text-2xl font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              color: theme.colors.text,
              textShadow: `0 0 25px ${theme.colors.glow}`,
            }}
          >
            {chapterTitle}
          </h2>

          <p className="text-xs mt-1" style={{ color: theme.colors.mutedText, fontStyle: 'italic' }}>
            {chapterSubtitle}
          </p>

          {/* Chapter progress mini-bar */}
          <div className="mt-3 mx-auto w-32 h-1 rounded-full overflow-hidden bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
              initial={{ width: 0 }}
              whileInView={{ width: `${chapterProgress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />
          </div>
          {isChapterComplete && (
            <p className="text-[10px] mt-1.5" style={{ color: theme.colors.primary }}>
              ✓ Complete
            </p>
          )}
        </motion.div>

        {/* Lesson path */}
        <div className="relative max-w-sm mx-auto">
          {/* Connecting line */}
          <div
            className="absolute left-5 top-5 bottom-5 w-px"
            style={{ backgroundColor: `${theme.colors.primary}15` }}
          />
          {/* Completed progress line */}
          <motion.div
            className="absolute left-5 top-5 w-px origin-top"
            style={{ backgroundColor: `${theme.colors.primary}60` }}
            initial={{ height: 0 }}
            whileInView={{ height: `${Math.min(chapterProgress, 100) * 0.9}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          />

          {/* Lesson nodes */}
          <div className="space-y-3">
            {lessons.map((lesson, i) => {
              const globalIndex = globalLessonOffset + i;
              const status = getLessonStatus(lesson, globalIndex);

              return (
                <LessonNode
                  key={lesson.id}
                  title={lesson.title}
                  xpReward={lesson.xpReward}
                  status={status}
                  index={i}
                  theme={theme}
                  onSelect={() => onSelectLesson(lesson.id)}
                  completedLabel={completedLabel}
                  xpLabel={xpLabel}
                  enterLabel={enterLabel}
                />
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export default ChapterSection;
