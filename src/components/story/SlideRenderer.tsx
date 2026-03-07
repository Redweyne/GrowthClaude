'use client';

// ============================================================================
// SLIDE RENDERER
// Each slide is a moment. Each moment deserves to be felt.
// These aren't just animations - they're emotional punctuation marks.
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  StorySlide,
  OpeningSlide,
  JourneyStartSlide,
  ContrastSlide,
  StatRevealSlide,
  StreakHighlightSlide,
  IdentityMomentSlide,
  PatternShiftSlide,
  AssessmentGrowthSlide,
  WordCloudSlide,
  ClosingSlide,
  CallToActionSlide,
} from '@/types/story';
import { Flame, BookOpen, Sparkles, TrendingUp, ArrowRight, Heart, Star, Sun, Moon } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface SlideRendererProps {
  slide: StorySlide;
  isActive: boolean;
  onAction?: (action: 'share' | 'continue' | 'review') => void;
}

// ============================================================================
// ANIMATION VARIANTS - Crafted for emotional impact
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1] as const // Slight bounce
    }
  }
};

const revealVariants = {
  hidden: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

const pulseVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1] as const
    }
  }
};

const typewriterContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.5
    }
  }
};

const letterVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

// ============================================================================
// MAIN RENDERER
// ============================================================================

export function SlideRenderer({ slide, isActive, onAction }: SlideRendererProps) {
  const { t } = useTranslation();
  switch (slide.type) {
    case 'opening':
      return <OpeningSlideContent slide={slide as OpeningSlide} />;
    case 'journey_start':
      return <JourneyStartSlideContent slide={slide as JourneyStartSlide} />;
    case 'stat_reveal':
      return <StatRevealSlideContent slide={slide as StatRevealSlide} />;
    case 'contrast':
      return <ContrastSlideContent slide={slide as ContrastSlide} />;
    case 'pattern_shift':
      return <PatternShiftSlideContent slide={slide as PatternShiftSlide} />;
    case 'streak_highlight':
      return <StreakHighlightSlideContent slide={slide as StreakHighlightSlide} />;
    case 'identity_moment':
      return <IdentityMomentSlideContent slide={slide as IdentityMomentSlide} />;
    case 'assessment_growth':
      return <AssessmentGrowthSlideContent slide={slide as AssessmentGrowthSlide} />;
    case 'word_cloud':
      return <WordCloudSlideContent slide={slide as WordCloudSlide} />;
    case 'closing':
      return <ClosingSlideContent slide={slide as ClosingSlide} />;
    case 'call_to_action':
      return <CallToActionSlideContent slide={slide as CallToActionSlide} onAction={onAction} />;
    default:
      return <div className="text-white light:text-stone-900">{t('story.slides.unknownType')}</div>;
  }
}

// ============================================================================
// OPENING SLIDE - The first breath
// ============================================================================

function OpeningSlideContent({ slide }: { slide: OpeningSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating accent */}
      {slide.accentEmoji && (
        <motion.div
          variants={pulseVariants}
          className="text-6xl mb-8"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {slide.accentEmoji}
        </motion.div>
      )}

      {/* Main headline with typewriter effect */}
      <motion.div
        variants={typewriterContainer}
        className="overflow-hidden"
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-white light:text-stone-900 mb-6 leading-tight tracking-tight"
          variants={revealVariants}
        >
          {slide.headline}
        </motion.h1>
      </motion.div>

      {/* Subheadline */}
      <motion.p
        variants={fadeUpVariants}
        className="text-xl text-white/60 light:text-stone-600 mb-10 font-light"
      >
        {slide.subheadline}
      </motion.p>

      {/* Period label with glow */}
      <motion.div
        variants={scaleInVariants}
        className="relative"
      >
        <div className="absolute inset-0 bg-white/10 rounded-full blur-xl" />
        <div className="relative px-6 py-3 rounded-full bg-white/5 light:bg-stone-200/80 border border-white/10 light:border-stone-300 text-white/70 light:text-stone-700 text-sm font-medium tracking-wide">
          {slide.periodLabel}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// JOURNEY START - Where it all began
// ============================================================================

function JourneyStartSlideContent({ slide }: { slide: JourneyStartSlide }) {
  const { t } = useTranslation();
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Date badge */}
      <motion.div
        variants={fadeInVariants}
        className="flex items-center gap-2 mb-6"
      >
        <Sun className="w-4 h-4 text-amber-400/70" />
        <span className="text-amber-400/70 text-sm tracking-widest uppercase">
          {slide.firstLessonDate}
        </span>
      </motion.div>

      {/* Opening message - the emotional hook */}
      <motion.h2
        variants={revealVariants}
        className="text-3xl sm:text-4xl font-bold text-white light:text-stone-900 mb-8 leading-relaxed"
      >
        {slide.openingMessage}
      </motion.h2>

      {/* First lesson */}
      <motion.div
        variants={fadeUpVariants}
        className="mb-10"
      >
        <p className="text-white/50 light:text-stone-600 text-sm mb-2">{t('story.slides.firstLessonWas')}</p>
        <p className="text-white light:text-stone-900 text-lg font-medium px-4 py-2 rounded-lg bg-white/5 light:bg-stone-100/80 border border-white/10 light:border-stone-300">
          {slide.firstLessonTitle}
        </p>
      </motion.div>

      {/* Days counter - dramatic reveal */}
      <motion.div
        variants={scaleInVariants}
        className="flex flex-col items-center"
      >
        <motion.span
          className="text-7xl font-bold text-white light:text-stone-900"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {slide.daysSinceStart}
        </motion.span>
        <span className="text-white/40 light:text-stone-500 text-lg mt-2">{t('story.slides.daysSinceMoment')}</span>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// STAT REVEAL - The numbers that tell your story
// ============================================================================

function StatRevealSlideContent({ slide }: { slide: StatRevealSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        variants={fadeUpVariants}
        className="text-2xl font-bold text-white light:text-stone-900 mb-10 text-center"
      >
        {slide.headline}
      </motion.h2>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {slide.stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={scaleInVariants}
            className="relative flex flex-col items-center p-5 rounded-2xl bg-white/5 light:bg-stone-100/80 border border-white/10 light:border-stone-300 overflow-hidden group"
            custom={index}
          >
            {/* Subtle glow */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at center, ${stat.color}20, transparent 70%)`
              }}
            />

            <span className="text-2xl mb-3 relative z-10">{stat.icon}</span>

            <motion.span
              className="text-3xl font-bold relative z-10"
              style={{ color: stat.color }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.5 + index * 0.15,
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1]
              }}
            >
              {stat.value}
            </motion.span>

            <span className="text-sm text-white/60 light:text-stone-600 text-center mt-2 relative z-10">
              {stat.label}
            </span>

            {stat.subtext && (
              <span className="text-xs text-white/40 light:text-stone-500 text-center mt-1 relative z-10">
                {stat.subtext}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// CONTRAST SLIDE - The transformation made visible
// ============================================================================

function ContrastSlideContent({ slide }: { slide: ContrastSlide }) {
  return (
    <motion.div
      className="flex flex-col h-full w-full py-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Before - the struggle */}
      <motion.div
        variants={fadeUpVariants}
        className="flex-1 flex flex-col justify-center"
      >
        <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 light:bg-stone-200/80 border border-white/10 light:border-stone-300">
            <Moon className="w-3 h-3 text-white/50 light:text-stone-600" />
            <span className="text-white/50 light:text-stone-600 text-sm font-medium">{slide.before.label}</span>
          </div>
          <span className="text-white/30 light:text-stone-500 text-xs">{slide.before.date}</span>
        </div>
        <motion.p
          className="text-lg text-white/60 light:text-stone-700 italic leading-relaxed pl-4 border-l-2 border-white/20 light:border-stone-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          &ldquo;{slide.before.text}&rdquo;
        </motion.p>
      </motion.div>

      {/* Transformation arrow */}
      <motion.div
        variants={scaleInVariants}
        className="flex items-center justify-center py-6"
      >
        <motion.div
          className="flex items-center gap-4"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent w-16" />
          <div className="p-3 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent w-16" />
        </motion.div>
      </motion.div>

      {/* After - the growth */}
      <motion.div
        variants={fadeUpVariants}
        className="flex-1 flex flex-col justify-center"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <Sun className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">{slide.after.label}</span>
          </div>
          <span className="text-white/30 light:text-stone-500 text-xs">{slide.after.date}</span>
        </div>
        <motion.p
          className="text-lg text-white light:text-stone-900 leading-relaxed pl-4 border-l-2 border-emerald-500/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          &ldquo;{slide.after.text}&rdquo;
        </motion.p>
      </motion.div>

      {/* Insight */}
      <motion.div
        variants={fadeInVariants}
        className="mt-4 pt-4 text-center"
      >
        <p className="text-white/40 light:text-stone-500 text-sm italic">
          {slide.growthIndicator}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// PATTERN SHIFT - The invisible becoming visible
// ============================================================================

function PatternShiftSlideContent({ slide }: { slide: PatternShiftSlide }) {
  const { t } = useTranslation();
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        variants={fadeUpVariants}
        className="text-2xl font-bold text-white light:text-stone-900 mb-10 text-center"
      >
        {t('story.slides.patternShift.title')}
      </motion.h2>

      <div className="flex items-center gap-8 mb-10">
        {/* From patterns */}
        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-white/30 light:text-stone-500 text-xs uppercase tracking-widest mb-2">{t('story.slides.before')}</span>
          {slide.fromPatterns.slice(0, 3).map((pattern, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${pattern.color}15`,
                color: pattern.color,
                border: `1px solid ${pattern.color}30`
              }}
            >
              {pattern.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Arrow */}
        <motion.div
          variants={scaleInVariants}
          animate={{
            x: [0, 5, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="w-8 h-8 text-white/20 light:text-stone-400" />
        </motion.div>

        {/* To patterns */}
        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-white/30 light:text-stone-500 text-xs uppercase tracking-widest mb-2">{t('story.slides.after')}</span>
          {slide.toPatterns.slice(0, 3).map((pattern, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${pattern.color}15`,
                color: pattern.color,
                border: `1px solid ${pattern.color}30`
              }}
            >
              {pattern.label}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.p
        variants={fadeInVariants}
        className="text-center text-white/60 light:text-stone-700 max-w-xs leading-relaxed"
      >
        {slide.shiftMessage}
      </motion.p>
    </motion.div>
  );
}

// ============================================================================
// STREAK HIGHLIGHT - The power of consistency
// ============================================================================

function StreakHighlightSlideContent({ slide }: { slide: StreakHighlightSlide }) {
  const { t } = useTranslation();
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated emoji */}
      <motion.div
        variants={pulseVariants}
        className="text-7xl mb-6"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {slide.streakEmoji}
      </motion.div>

      {/* Streak number - dramatic reveal */}
      <motion.div
        variants={scaleInVariants}
        className="flex items-baseline gap-2 mb-6"
      >
        <motion.span
          className="text-8xl font-bold text-white light:text-stone-900"
          animate={{
            textShadow: [
              '0 0 20px rgba(255,255,255,0.3)',
              '0 0 40px rgba(255,255,255,0.5)',
              '0 0 20px rgba(255,255,255,0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {slide.currentStreak}
        </motion.span>
        <span className="text-2xl text-white/50 light:text-stone-600 font-light">{t('common.days')}</span>
      </motion.div>

      {/* Message */}
      <motion.p
        variants={fadeUpVariants}
        className="text-lg text-white/70 light:text-stone-700 mb-10 max-w-xs leading-relaxed"
      >
        {slide.message}
      </motion.p>

      {/* Stats row */}
      <motion.div
        variants={fadeUpVariants}
        className="flex gap-6 text-center"
      >
        {[
          { value: slide.longestStreak, label: t('story.slides.streak.best') },
          { value: slide.totalActiveDays, label: t('story.slides.streak.totalDays') },
          { value: `${slide.consistencyScore}%`, label: t('story.slides.streak.consistency') }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <p className="text-2xl font-bold text-white light:text-stone-900">{stat.value}</p>
            <p className="text-xs text-white/40 light:text-stone-500 uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// IDENTITY MOMENT - Who you're becoming
// ============================================================================

function IdentityMomentSlideContent({ slide }: { slide: IdentityMomentSlide }) {
  const { t } = useTranslation();
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quote marks */}
      <motion.div
        variants={fadeInVariants}
        className="mb-8"
      >
        <span className="text-6xl text-purple-400/30 font-serif">&ldquo;</span>
      </motion.div>

      {/* Identity statement */}
      <motion.p
        variants={revealVariants}
        className="text-2xl sm:text-3xl font-medium text-white light:text-stone-900 mb-8 leading-relaxed max-w-sm"
      >
        {slide.statement.text}
      </motion.p>

      {/* Context */}
      <motion.div
        variants={fadeUpVariants}
        className="flex items-center gap-2 text-white/40 light:text-stone-500 text-sm mb-8"
      >
        <span>{slide.statement.date}</span>
        <span>•</span>
        <span className="italic">{slide.statement.context}</span>
      </motion.div>

      {/* Badge */}
      <motion.div
        variants={scaleInVariants}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm"
      >
        <Sparkles className="w-4 h-4" />
        <span>{t('story.slides.identityStatementsCreated', { count: slide.totalStatements })}</span>
      </motion.div>

      {/* Message */}
      <motion.p
        variants={fadeInVariants}
        className="text-white/50 light:text-stone-600 mt-8 max-w-xs"
      >
        {slide.message}
      </motion.p>
    </motion.div>
  );
}

// ============================================================================
// ASSESSMENT GROWTH - Measurable progress
// ============================================================================

function AssessmentGrowthSlideContent({ slide }: { slide: AssessmentGrowthSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={pulseVariants}
        className="text-5xl mb-4"
      >
        {slide.dimensionIcon}
      </motion.div>

      <motion.h2
        variants={fadeUpVariants}
        className="text-2xl font-bold text-white light:text-stone-900 mb-8"
      >
        {slide.dimension}
      </motion.h2>

      {/* Progress visualization */}
      <motion.div
        variants={fadeUpVariants}
        className="flex items-center gap-6 mb-8"
      >
        {/* Before */}
        <div className="flex flex-col items-center">
          <motion.span
            className="text-4xl font-bold text-white/40 light:text-stone-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {slide.before.score}
          </motion.span>
          <span className="text-xs text-white/30 light:text-stone-500 mt-1">{slide.before.date}</span>
        </div>

        {/* Arrow and growth */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <TrendingUp className="w-8 h-8 text-emerald-400 mb-1" />
          <motion.span
            className="text-emerald-400 font-bold"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            +{slide.growthPercentage}%
          </motion.span>
        </motion.div>

        {/* After */}
        <div className="flex flex-col items-center">
          <motion.span
            className="text-4xl font-bold text-emerald-400"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            {slide.after.score}
          </motion.span>
          <span className="text-xs text-white/50 light:text-stone-600 mt-1">{slide.after.date}</span>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        variants={fadeUpVariants}
        className="w-full max-w-xs mb-6"
      >
        <div className="h-3 bg-white/10 light:bg-stone-300 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
            initial={{ width: `${slide.before.score * 10}%` }}
            animate={{ width: `${slide.after.score * 10}%` }}
            transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      <motion.p
        variants={fadeInVariants}
        className="text-white/60 light:text-stone-700"
      >
        {slide.message}
      </motion.p>
    </motion.div>
  );
}

// ============================================================================
// WORD CLOUD - The language of your journey
// ============================================================================

function WordCloudSlideContent({ slide }: { slide: WordCloudSlide }) {
  const { t } = useTranslation();
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        variants={fadeUpVariants}
        className="text-xl font-bold text-white light:text-stone-900 mb-8 text-center"
      >
        {slide.message}
      </motion.h2>

      <motion.div
        variants={fadeUpVariants}
        className="flex flex-wrap justify-center gap-2 max-w-sm mb-10"
      >
        {slide.words.map((word, index) => {
          const sizeClasses = {
            small: 'text-sm px-3 py-1',
            medium: 'text-base px-4 py-1.5',
            large: 'text-lg px-5 py-2',
            hero: 'text-xl px-6 py-2.5 font-bold'
          };
          return (
            <motion.span
              key={word.word}
              initial={{ opacity: 0, scale: 0, rotate: (index % 2 === 0 ? -8 : 8) }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.3 + index * 0.05,
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1]
              }}
              whileHover={{ scale: 1.1 }}
              className={`rounded-full ${sizeClasses[word.size]} cursor-default`}
              style={{
                backgroundColor: `${word.color}15`,
                color: word.color,
                border: `1px solid ${word.color}30`
              }}
            >
              {word.word}
            </motion.span>
          );
        })}
      </motion.div>

      <motion.p
        variants={fadeInVariants}
        className="text-white/40 light:text-stone-500 text-sm"
      >
        {t('story.slides.wordsWrittenInReflection', { count: slide.totalWordsWritten.toLocaleString() })}
      </motion.p>
    </motion.div>
  );
}

// ============================================================================
// CLOSING SLIDE - The emotional crescendo
// ============================================================================

function ClosingSlideContent({ slide }: { slide: ClosingSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Headline - personal address */}
      <motion.h2
        variants={fadeInVariants}
        className="text-2xl font-light text-white/60 light:text-stone-600 mb-6"
      >
        {slide.headline}
      </motion.h2>

      {/* Main message - the emotional punch */}
      <motion.p
        variants={revealVariants}
        className="text-3xl sm:text-4xl font-bold text-white light:text-stone-900 mb-10 leading-relaxed max-w-sm"
      >
        {slide.message}
      </motion.p>

      {/* Personal note */}
      <motion.p
        variants={fadeUpVariants}
        className="text-white/50 light:text-stone-600 max-w-sm mb-10 leading-relaxed text-sm"
      >
        {slide.personalNote}
      </motion.p>

      {/* Sign off with heart */}
      <motion.div
        variants={scaleInVariants}
        className="flex items-center gap-2"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
        </motion.div>
        <p className="text-white/70 light:text-stone-700 italic">{slide.signOff}</p>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// CALL TO ACTION - The invitation forward
// ============================================================================

function CallToActionSlideContent({
  slide,
  onAction
}: {
  slide: CallToActionSlide;
  onAction?: (action: 'share' | 'continue' | 'review') => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Encouragement */}
      <motion.p
        variants={fadeUpVariants}
        className="text-xl text-white/70 light:text-stone-700 mb-12 max-w-sm leading-relaxed"
      >
        {slide.encouragement}
      </motion.p>

      {/* Primary action - the star */}
      <motion.button
        variants={scaleInVariants}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onAction?.(slide.primaryAction.action)}
        className="relative px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg mb-6 overflow-hidden group"
      >
        <span className="relative z-10">{slide.primaryAction.label}</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </motion.button>

      {/* Secondary action */}
      {slide.secondaryAction && (
        <motion.button
          variants={fadeUpVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction?.(slide.secondaryAction!.action)}
          className="px-6 py-3 rounded-full bg-white/5 light:bg-stone-200/80 border border-white/10 light:border-stone-300 text-white/70 light:text-stone-700 hover:bg-white/10 light:hover:bg-stone-200 hover:text-white light:hover:text-stone-900 transition-all"
        >
          {slide.secondaryAction.label}
        </motion.button>
      )}
    </motion.div>
  );
}
