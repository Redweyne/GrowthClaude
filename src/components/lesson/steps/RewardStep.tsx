'use client';

// ============================================================================
// REWARD STEP - The Elegant Moment
// ============================================================================
//
// A premium, mobile-first reward experience designed to:
// - Feel like opening a luxury gift (refined, surprising, memorable)
// - Run at 60fps on iOS and Android
// - Respect safe areas and thumb zones
// - Create a genuine moment of accomplishment
//
// Structure: 2 phases only
// 1. THE REVEAL (auto-advances) - Dramatic entrance with lesson concept
// 2. THE CROWN (user-controlled) - XP, streak, level, wisdom, CTA
//
// Design principles:
// - Transforms and opacity only (no layout thrashing)
// - Reduced particles on mobile
// - Spring physics that feel native to iOS
// - Touch targets at least 48px
// ============================================================================

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { GoldShimmer, GlowRing } from '@/components/effects';
import { useStore } from '@/store/useStore';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';
import { useTranslation } from '@/i18n';
import {
  getGrowthLevel,
  getGrowthProgress,
  getRandomQuote,
  GROWTH_LEVELS,
} from '@/lib/growthPhilosophy';
import type { Lesson } from '@/types';

interface RewardStepProps {
  xpEarned: number;
  lesson: Lesson;
  onComplete: () => void;
}

type Phase = 'reveal' | 'crown';

// Spring animation config for iOS-native feel
const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Concept display names for the reveal phase
const CONCEPT_DISPLAY: Record<string, { icon: string; title: string }> = {
  control: { icon: '⚖️', title: 'CONTROL' },
  habits: { icon: '🌱', title: 'HABITS' },
  obstacles: { icon: '🔥', title: 'OBSTACLES' },
  mindset: { icon: '🧠', title: 'MINDSET' },
  gratitude: { icon: '✨', title: 'GRATITUDE' },
  resilience: { icon: '💪', title: 'RESILIENCE' },
  focus: { icon: '🎯', title: 'FOCUS' },
  default: { icon: '⭐', title: 'WISDOM' },
};

export function RewardStep({ xpEarned, lesson, onComplete }: RewardStepProps) {
  const { totalXp, currentStreak, lastLessonDate, name } = useStore();
  const audio = useAudio();
  const haptics = useHaptics();
  const { t, isRTL } = useTranslation();

  const [phase, setPhase] = useState<Phase>('reveal');
  const [showGoldShimmer, setShowGoldShimmer] = useState(true);
  const [showLevelUpRing, setShowLevelUpRing] = useState(false);

  // Prevent double-playing sounds
  const hasPlayedRevealSound = useRef(false);
  const hasPlayedLevelUpSound = useRef(false);

  // Calculate values
  const safeXpEarned = xpEarned > 0 ? xpEarned : Math.max(lesson.xpReward ?? 0, 15);
  const previousXp = totalXp;
  const newTotalXp = totalXp + safeXpEarned;
  const previousLevel = getGrowthLevel(previousXp);
  const newLevel = getGrowthLevel(newTotalXp);
  const leveledUp = newLevel.level > previousLevel.level;

  // Calculate streak
  const today = new Date().toISOString().split('T')[0];
  const isFirstLessonToday = lastLessonDate !== today;
  const predictedStreak = isFirstLessonToday ? currentStreak + 1 : currentStreak;

  // Get concept for reveal
  const concept = CONCEPT_DISPLAY[lesson.coreConceptTag ?? ''] ?? CONCEPT_DISPLAY.default;

  // Get wisdom quote
  const wisdomQuote = useMemo(
    () => getRandomQuote(leveledUp ? 'growth' : 'completion', lesson.id),
    [leveledUp, lesson.id]
  );

  // Progress to next level
  const progress = getGrowthProgress(newTotalXp);
  const nextLevel = GROWTH_LEVELS.find((l) => l.level === newLevel.level + 1);

  // Personalized greeting
  const greeting = useMemo(() => {
    if (name) {
      return `${t('lessons.reward.wellDone')}, ${name}`;
    }
    return t('lessons.reward.wellDone');
  }, [name, t]);

  // Play reveal sound and haptic on mount
  useEffect(() => {
    if (!hasPlayedRevealSound.current) {
      hasPlayedRevealSound.current = true;
      audio.playSingingBowl();
      haptics.hapticSuccess();
    }
  }, [audio, haptics]);

  // Auto-advance from reveal to crown
  useEffect(() => {
    if (phase !== 'reveal') return;

    const timer = setTimeout(() => {
      setPhase('crown');
      haptics.hapticMedium();

      // Trigger level-up effects if applicable
      if (leveledUp && !hasPlayedLevelUpSound.current) {
        hasPlayedLevelUpSound.current = true;
        setShowLevelUpRing(true);
        audio.playLevelUp();
        audio.playCelebrate();
        haptics.hapticCelebration();
      }
    }, 2500); // 2.5 seconds for reveal

    return () => clearTimeout(timer);
  }, [phase, leveledUp, audio, haptics]);

  // Handle completion
  const handleContinue = useCallback(() => {
    haptics.hapticTap();
    audio.playTap();
    onComplete();
  }, [haptics, audio, onComplete]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'crown') {
        e.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleContinue]);

  return (
    <div
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 pb-safe"
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 24px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
      }}
      data-testid="xp-celebration"
    >
      {/* Subtle grain texture background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Gold shimmer particles */}
      <GoldShimmer
        active={showGoldShimmer}
        variant="gold"
        intensity={leveledUp ? 'intense' : 'medium'}
        duration={4000}
        onComplete={() => setShowGoldShimmer(false)}
      />

      {/* Level-up glow rings */}
      <GlowRing
        active={showLevelUpRing}
        color="#fbbf24"
        rings={4}
        onComplete={() => setShowLevelUpRing(false)}
      />

      <AnimatePresence mode="wait">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* PHASE 1: THE REVEAL - Dramatic entrance with lesson concept */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            className="flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            {/* Concept icon with glow */}
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ ...SPRING_CONFIG, delay: 0.2 }}
            >
              {/* Glow behind icon */}
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-amber-500/20 blur-2xl" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 border border-amber-500/30 flex items-center justify-center">
                <span className="text-4xl" role="img" aria-label={concept.title}>
                  {concept.icon}
                </span>
              </div>
            </motion.div>

            {/* Lesson concept title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-amber-400/80 text-sm font-semibold tracking-[0.3em] uppercase mb-3">
                {t('lessons.reward.youMastered')}
              </p>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-none">
                {concept.title}
              </h2>
            </motion.div>

            {/* Subtle pulse indicator that it will auto-advance */}
            <motion.div
              className="mt-12 flex gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-zinc-500"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* PHASE 2: THE CROWN - XP, streak, level, wisdom, CTA */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {phase === 'crown' && (
          <motion.div
            key="crown"
            className="flex flex-col items-center justify-center w-full max-w-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Greeting */}
            <motion.p
              className="text-zinc-400 text-xl sm:text-2xl font-medium mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {greeting}
            </motion.p>

            {/* Main reward card */}
            <motion.div
              className="relative w-full rounded-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...SPRING_CONFIG, delay: 0.1 }}
            >
              {/* Card background with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/90 via-zinc-900/95 to-black/90 backdrop-blur-sm" />
              
              {/* Gold accent border on top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

              {/* Card content */}
              <div className="relative p-8">
                {/* XP Earned - Hero element */}
                <div className="flex items-center justify-center mb-8">
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ ...SPRING_CONFIG, delay: 0.3 }}
                  >
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
                    <span className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-tighter tabular-nums">
                      +{safeXpEarned}
                    </span>
                    <span className="text-2xl sm:text-3xl text-zinc-400 font-normal">XP</span>
                  </motion.div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent mb-6" />

                {/* Streak and Level row */}
                <div className="flex items-center justify-between mb-6">
                  {/* Streak */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Flame
                        className={`w-6 h-6 ${
                          predictedStreak >= 30
                            ? 'text-orange-400 fill-orange-400'
                            : predictedStreak >= 7
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-amber-500/70 fill-amber-500/70'
                        }`}
                      />
                    </div>
                    <span className="text-white text-xl sm:text-2xl font-bold tabular-nums tracking-tight">
                      {predictedStreak}
                    </span>
                    <span className="text-white text-base font-medium">
                      {predictedStreak === 1 ? t('lessons.reward.day') : t('lessons.reward.days')}
                    </span>
                    <span className="text-zinc-500 text-base">
                      {t('lessons.reward.streak')}
                    </span>
                  </div>

                  {/* Current Level */}
                  <div className="text-right">
                    <span className="text-zinc-500 text-base font-medium">
                      {leveledUp ? t('lessons.reward.levelUp') : newLevel.title}
                    </span>
                  </div>
                </div>

                {/* Level progress bar */}
                {nextLevel && (
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-zinc-600 mb-1.5">
                      <span>{newLevel.title}</span>
                      <span>{nextLevel.title}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                        transition={{
                          duration: 1.2,
                          delay: 0.5,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Level Up Banner - only shown when leveled up */}
                {leveledUp && (
                  <motion.div
                    className="bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 rounded-lg p-6 mb-6 border border-amber-500/20"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-amber-400 text-sm font-semibold tracking-wider uppercase mb-2">
                      {t('lessons.reward.youveGrown')}
                    </p>
                    <p className="text-white font-bold text-2xl sm:text-3xl tracking-tight leading-tight">{newLevel.title}</p>
                    <p className="text-zinc-400 text-base sm:text-lg mt-2 leading-relaxed">{newLevel.subtitle}</p>
                  </motion.div>
                )}

                {/* Wisdom Quote */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-zinc-400 text-base sm:text-lg italic leading-relaxed mb-3">
                    &ldquo;{wisdomQuote.text}&rdquo;
                  </p>
                  <p className="text-zinc-600 text-sm font-medium">
                    — {wisdomQuote.author}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* CTA Button - in the thumb zone */}
            <motion.div
              className="w-full mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                onClick={handleContinue}
                className="w-full py-5 px-8 text-lg font-semibold group"
                data-testid="reward-continue-btn"
              >
                {t('lessons.reward.continueToMentor')}
                <ChevronRight
                  className={`w-6 h-6 ${
                    isRTL
                      ? 'mr-2 group-hover:-translate-x-1'
                      : 'ml-2 group-hover:translate-x-1'
                  } transition-transform`}
                />
              </Button>
            </motion.div>

            {/* Lesson title - very subtle at bottom */}
            <motion.p
              className="text-zinc-700 text-xs mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {lesson.title}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RewardStep;
