'use client';

// ============================================================================
// SLIDE RENDERER
// Renders each slide type with its unique layout and animations.
// This is where each moment in the story comes to life.
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
  AchievementSlide,
  PatternShiftSlide,
  AssessmentGrowthSlide,
  WordCloudSlide,
  ClosingSlide,
  CallToActionSlide,
  isOpeningSlide,
  isContrastSlide,
  isStatRevealSlide,
  isClosingSlide
} from '@/types/story';
import { Flame, BookOpen, Zap, Quote, ArrowRight, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

interface SlideRendererProps {
  slide: StorySlide;
  isActive: boolean;
  onAction?: (action: 'share' | 'continue' | 'review') => void;
}

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
  }
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
  }
};

export function SlideRenderer({ slide, isActive, onAction }: SlideRendererProps) {
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
    case 'achievement':
      return <AchievementSlideContent slide={slide as AchievementSlide} />;
    case 'assessment_growth':
      return <AssessmentGrowthSlideContent slide={slide as AssessmentGrowthSlide} />;
    case 'word_cloud':
      return <WordCloudSlideContent slide={slide as WordCloudSlide} />;
    case 'closing':
      return <ClosingSlideContent slide={slide as ClosingSlide} />;
    case 'call_to_action':
      return <CallToActionSlideContent slide={slide as CallToActionSlide} onAction={onAction} />;
    default:
      return <div className="text-white">Unknown slide type</div>;
  }
}

// ============================================================================
// INDIVIDUAL SLIDE COMPONENTS
// ============================================================================

function OpeningSlideContent({ slide }: { slide: OpeningSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {slide.accentEmoji && (
        <motion.div variants={scaleVariants} className="text-5xl mb-6">
          {slide.accentEmoji}
        </motion.div>
      )}
      <motion.h1
        variants={itemVariants}
        className="text-4xl font-bold text-white mb-4 leading-tight"
      >
        {slide.headline}
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="text-xl text-white/70 mb-8"
      >
        {slide.subheadline}
      </motion.p>
      <motion.div
        variants={itemVariants}
        className="px-4 py-2 rounded-full bg-white/10 text-white/60 text-sm"
      >
        {slide.periodLabel}
      </motion.div>
    </motion.div>
  );
}

function JourneyStartSlideContent({ slide }: { slide: JourneyStartSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p
        variants={itemVariants}
        className="text-lg text-white/60 mb-4"
      >
        {slide.firstLessonDate}
      </motion.p>
      <motion.h2
        variants={itemVariants}
        className="text-3xl font-bold text-white mb-6"
      >
        {slide.openingMessage}
      </motion.h2>
      <motion.p
        variants={itemVariants}
        className="text-lg text-white/70 mb-8"
      >
        Your first lesson: <span className="text-white">{slide.firstLessonTitle}</span>
      </motion.p>
      <motion.div
        variants={scaleVariants}
        className="flex items-center gap-2 text-white/50"
      >
        <span className="text-4xl font-bold text-white">{slide.daysSinceStart}</span>
        <span className="text-lg">days ago</span>
      </motion.div>
    </motion.div>
  );
}

function StatRevealSlideContent({ slide }: { slide: StatRevealSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold text-white mb-8 text-center"
      >
        {slide.headline}
      </motion.h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {slide.stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={scaleVariants}
            className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <span className="text-2xl mb-2">{stat.icon}</span>
            <motion.span
              className="text-3xl font-bold"
              style={{ color: stat.color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {stat.value}
            </motion.span>
            <span className="text-sm text-white/60 text-center mt-1">{stat.label}</span>
            {stat.subtext && (
              <span className="text-xs text-white/40 text-center">{stat.subtext}</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ContrastSlideContent({ slide }: { slide: ContrastSlide }) {
  return (
    <motion.div
      className="flex flex-col h-full w-full py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Before */}
      <motion.div
        variants={itemVariants}
        className="flex-1 flex flex-col justify-center"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-sm">
            {slide.before.label}
          </span>
          <span className="text-white/40 text-sm">{slide.before.date}</span>
        </div>
        <p className="text-lg text-white/70 italic leading-relaxed">
          "{slide.before.text}"
        </p>
      </motion.div>

      {/* Divider with arrow */}
      <motion.div
        variants={scaleVariants}
        className="flex items-center justify-center py-4"
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="mx-4 p-2 rounded-full bg-white/10">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </motion.div>

      {/* After */}
      <motion.div
        variants={itemVariants}
        className="flex-1 flex flex-col justify-center"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
            {slide.after.label}
          </span>
          <span className="text-white/40 text-sm">{slide.after.date}</span>
        </div>
        <p className="text-lg text-white leading-relaxed">
          "{slide.after.text}"
        </p>
      </motion.div>

      {/* Insight */}
      <motion.div
        variants={itemVariants}
        className="mt-4 pt-4 border-t border-white/10"
      >
        <p className="text-center text-white/60 text-sm">
          {slide.growthIndicator}
        </p>
      </motion.div>
    </motion.div>
  );
}

function PatternShiftSlideContent({ slide }: { slide: PatternShiftSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold text-white mb-8 text-center"
      >
        Your Thought Patterns Shifted
      </motion.h2>

      <div className="flex items-center gap-6 mb-8">
        {/* From patterns */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/40 text-sm mb-2">From</span>
          {slide.fromPatterns.slice(0, 3).map((pattern, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="px-3 py-1.5 rounded-full text-sm"
              style={{
                backgroundColor: `${pattern.color}20`,
                color: pattern.color
              }}
            >
              {pattern.label}
            </motion.div>
          ))}
        </div>

        {/* Arrow */}
        <motion.div variants={scaleVariants}>
          <ArrowRight className="w-6 h-6 text-white/40" />
        </motion.div>

        {/* To patterns */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/40 text-sm mb-2">To</span>
          {slide.toPatterns.slice(0, 3).map((pattern, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="px-3 py-1.5 rounded-full text-sm"
              style={{
                backgroundColor: `${pattern.color}20`,
                color: pattern.color
              }}
            >
              {pattern.label}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.p
        variants={itemVariants}
        className="text-center text-white/70 max-w-sm"
      >
        {slide.shiftMessage}
      </motion.p>
    </motion.div>
  );
}

function StreakHighlightSlideContent({ slide }: { slide: StreakHighlightSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={scaleVariants} className="text-6xl mb-4">
        {slide.streakEmoji}
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-baseline gap-2 mb-4">
        <span className="text-6xl font-bold text-white">{slide.currentStreak}</span>
        <span className="text-2xl text-white/60">days</span>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-lg text-white/70 mb-8 max-w-sm"
      >
        {slide.message}
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex gap-6 text-center"
      >
        <div>
          <p className="text-2xl font-bold text-white">{slide.longestStreak}</p>
          <p className="text-sm text-white/50">Longest</p>
        </div>
        <div className="w-px bg-white/20" />
        <div>
          <p className="text-2xl font-bold text-white">{slide.totalActiveDays}</p>
          <p className="text-sm text-white/50">Total Days</p>
        </div>
        <div className="w-px bg-white/20" />
        <div>
          <p className="text-2xl font-bold text-white">{slide.consistencyScore}%</p>
          <p className="text-sm text-white/50">Consistency</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function IdentityMomentSlideContent({ slide }: { slide: IdentityMomentSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={scaleVariants} className="mb-6">
        <Quote className="w-10 h-10 text-purple-400/50" />
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-2xl font-medium text-white mb-6 leading-relaxed max-w-sm"
      >
        "{slide.statement.text}"
      </motion.p>

      <motion.p
        variants={itemVariants}
        className="text-white/50 text-sm mb-8"
      >
        {slide.statement.date} • {slide.statement.context}
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm"
      >
        <Sparkles className="w-4 h-4" />
        <span>{slide.totalStatements} identity statements created</span>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-white/60 mt-6"
      >
        {slide.message}
      </motion.p>
    </motion.div>
  );
}

function AchievementSlideContent({ slide }: { slide: AchievementSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold text-white mb-8"
      >
        Achievements Unlocked
      </motion.h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {slide.achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            variants={scaleVariants}
            className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <span className="text-3xl mb-2">{achievement.icon}</span>
            <span className="text-sm text-white font-medium text-center">
              {achievement.name}
            </span>
            <span className="text-xs text-white/40 capitalize">{achievement.rarity}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={itemVariants}
        className="text-center"
      >
        <p className="text-white/60 mb-2">{slide.message}</p>
        <p className="text-white/40 text-sm">
          {slide.totalUnlocked} of {slide.totalAvailable} unlocked
        </p>
      </motion.div>
    </motion.div>
  );
}

function AssessmentGrowthSlideContent({ slide }: { slide: AssessmentGrowthSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={scaleVariants} className="text-4xl mb-4">
        {slide.dimensionIcon}
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold text-white mb-8"
      >
        {slide.dimension}
      </motion.h2>

      {/* Progress visualization */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-4 mb-8"
      >
        {/* Before */}
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-white/40">{slide.before.score}</span>
          <span className="text-sm text-white/30">{slide.before.date}</span>
        </div>

        {/* Arrow and growth */}
        <div className="flex flex-col items-center">
          <TrendingUp className="w-8 h-8 text-emerald-400 mb-1" />
          <span className="text-emerald-400 font-bold">+{slide.growthPercentage}%</span>
        </div>

        {/* After */}
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-emerald-400">{slide.after.score}</span>
          <span className="text-sm text-white/50">{slide.after.date}</span>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-xs mb-6"
      >
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            initial={{ width: `${slide.before.score * 10}%` }}
            animate={{ width: `${slide.after.score * 10}%` }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          />
        </div>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-white/60"
      >
        {slide.message}
      </motion.p>
    </motion.div>
  );
}

function WordCloudSlideContent({ slide }: { slide: WordCloudSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        variants={itemVariants}
        className="text-xl font-bold text-white mb-6 text-center"
      >
        {slide.message}
      </motion.h2>

      <motion.div
        variants={itemVariants}
        className="flex flex-wrap justify-center gap-2 max-w-sm mb-8"
      >
        {slide.words.map((word, index) => {
          const sizeClasses = {
            small: 'text-sm px-2 py-1',
            medium: 'text-base px-3 py-1.5',
            large: 'text-lg px-4 py-2',
            hero: 'text-xl px-5 py-2.5 font-bold'
          };
          return (
            <motion.span
              key={word.word}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className={`rounded-full ${sizeClasses[word.size]}`}
              style={{
                backgroundColor: `${word.color}20`,
                color: word.color
              }}
            >
              {word.word}
            </motion.span>
          );
        })}
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-white/50 text-sm"
      >
        {slide.totalWordsWritten.toLocaleString()} words written in total
      </motion.p>
    </motion.div>
  );
}

function ClosingSlideContent({ slide }: { slide: ClosingSlide }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-medium text-white/60 mb-4"
      >
        {slide.headline}
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="text-3xl font-bold text-white mb-8 leading-relaxed max-w-sm"
      >
        {slide.message}
      </motion.p>

      <motion.p
        variants={itemVariants}
        className="text-white/50 max-w-sm mb-8 leading-relaxed"
      >
        {slide.personalNote}
      </motion.p>

      <motion.p
        variants={itemVariants}
        className="text-white/70 italic"
      >
        {slide.signOff}
      </motion.p>
    </motion.div>
  );
}

function CallToActionSlideContent({
  slide,
  onAction
}: {
  slide: CallToActionSlide;
  onAction?: (action: 'share' | 'continue' | 'review') => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p
        variants={itemVariants}
        className="text-xl text-white/70 mb-10 max-w-sm"
      >
        {slide.encouragement}
      </motion.p>

      <motion.button
        variants={scaleVariants}
        onClick={() => onAction?.(slide.primaryAction.action)}
        className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg mb-4 hover:opacity-90 transition-opacity"
      >
        {slide.primaryAction.label}
      </motion.button>

      {slide.secondaryAction && (
        <motion.button
          variants={itemVariants}
          onClick={() => onAction?.(slide.secondaryAction!.action)}
          className="px-6 py-3 rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
        >
          {slide.secondaryAction.label}
        </motion.button>
      )}
    </motion.div>
  );
}
