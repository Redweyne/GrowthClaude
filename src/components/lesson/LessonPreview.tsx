'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Flame, Zap } from 'lucide-react';
import { getLessonThemeColor } from '@/lib/lessonThemes';
import type { FlexibleLesson } from '@/types/lessons';

// ═══════════════════════════════════════════════════════════════════════════
// LESSON PREVIEW
// A 2-3 second cinematic intro before each lesson begins.
// Title zooms in, subtitle fades, theme color washes across, then auto-advances.
// ═══════════════════════════════════════════════════════════════════════════

interface LessonPreviewProps {
  lesson: FlexibleLesson;
  mode?: 'deep' | 'engagement';
  onStart: () => void;
  onBack: () => void;
}

export function LessonPreview({ lesson, mode, onStart, onBack }: LessonPreviewProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');
  const theme = useMemo(() => lesson.themeColor || getLessonThemeColor(lesson.id), [lesson]);

  // Auto-advance through phases
  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase('hold'), 400);
    const exitTimer = setTimeout(() => setPhase('exit'), 2200);
    const advanceTimer = setTimeout(() => onStart(), 3000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(advanceTimer);
    };
  }, [onStart]);

  // Tap to skip
  const handleTap = () => {
    setPhase('exit');
    setTimeout(onStart, 300);
  };

  // Extract chapter number from lesson ID
  const chapterNum = lesson.id.startsWith('modern-1') ? 1
    : lesson.id.startsWith('modern-2') ? 2
    : lesson.id.startsWith('modern-3') ? 3
    : 1;

  const lessonNum = parseInt(lesson.id.replace(/\D/g, ''), 10) || 1;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleTap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background wash */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          background: `radial-gradient(ellipse at center, ${theme.gradient} 0%, rgba(12, 10, 9, 0.98) 70%)`,
        }}
      />

      {/* Animated glow orb */}
      <motion.div
        className="absolute"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: phase === 'exit' ? 3 : phase === 'hold' ? 1.2 : 0.5,
          opacity: phase === 'exit' ? 0 : 0.4,
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-md">
        {/* Chapter / Lesson Number */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: phase === 'exit' ? 0 : 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span
            className="text-xs font-medium tracking-[0.3em] uppercase"
            style={{ color: theme.primary }}
          >
            Chapter {chapterNum} &middot; Lesson {lessonNum}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{
            opacity: phase === 'exit' ? 0 : 1,
            scale: phase === 'hold' ? 1 : 0.95,
            y: phase === 'exit' ? -20 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1], // custom ease
          }}
          style={{
            textShadow: `0 0 60px ${theme.glow}, 0 0 120px ${theme.gradient}`,
          }}
        >
          {lesson.title}
        </motion.h1>

        {/* Subtitle / Description */}
        <motion.p
          className="text-stone-400 text-sm leading-relaxed mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase === 'exit' ? 0 : phase === 'hold' ? 0.8 : 0, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {lesson.subtitle || lesson.description}
        </motion.p>

        {/* Mode indicator */}
        {mode && (
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase === 'exit' ? 0 : phase === 'hold' ? 0.6 : 0, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            {mode === 'deep' ? (
              <>
                <BookOpen size={14} className="text-stone-500" />
                <span className="text-xs text-stone-500 tracking-wide">Deep Wisdom Mode</span>
              </>
            ) : (
              <>
                <Zap size={14} className="text-stone-500" />
                <span className="text-xs text-stone-500 tracking-wide">Engagement Mode</span>
              </>
            )}
          </motion.div>
        )}

        {/* Tap to skip hint */}
        <motion.p
          className="text-stone-600 text-xs mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'hold' ? 0.5 : 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          Tap anywhere to begin
        </motion.p>
      </div>

      {/* Theme-colored top/bottom lines */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: phase === 'exit' ? 0 : 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
          transformOrigin: 'center',
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: phase === 'exit' ? 0 : 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
          transformOrigin: 'center',
        }}
      />
    </motion.div>
  );
}

export default LessonPreview;
