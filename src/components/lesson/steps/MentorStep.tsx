'use client';

// ═══════════════════════════════════════════════════════════════════════════
// MENTOR STEP - THE SAGE'S CHAMBER
// ═══════════════════════════════════════════════════════════════════════════
//
// This is where Sage delivers the lesson's teaching.
// Not cheerleading - genuine philosophical insight.
// The atmosphere should feel like receiving wisdom from an ancient guide.
//
// Visual principles:
// - Mystical, ethereal presence around Sage
// - Words that arrive with weight and gravity
// - Atmosphere that shifts with Sage's mood
// - Sacred space for integration
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Flame, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { SageAvatar, type SageMood } from '@/components/mentor';
import { useAudio } from '@/hooks/useAudio';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/i18n';
import {
  getFallbackWisdom,
  getLowEffortWisdom,
  getMentor,
  getStreakMilestoneMessage,
} from '@/content/mentor';
import { isLowEffortReflection } from '@/lib/reflection';
import type { Lesson } from '@/types';

interface MentorStepProps {
  lesson: Lesson;
  reflection: string;
  onComplete: () => void;
  onRetry: () => void;
}

// Localized wisdom is sourced from content/mentor

// Deterministic selection helper - uses string hash instead of Math.random()
function getStableIndex(seed: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % length;
}

// Springs
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
};

export function MentorStep({ lesson, reflection, onComplete, onRetry }: MentorStepProps) {
  const { name, currentStreak } = useStore();
  const { playTap, playSparkle, playCelebrate } = useAudio();
  const { t, isRTL, locale } = useTranslation();

  const fallbackWisdom = useMemo(() => getFallbackWisdom(locale), [locale]);
  const lowEffortWisdom = useMemo(() => getLowEffortWisdom(locale), [locale]);
  const mentor = useMemo(() => getMentor(locale), [locale]);

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showStreakBonus, setShowStreakBonus] = useState(false);

  // Check if reflection is low effort
  const isLowEffort = useMemo(() => isLowEffortReflection(reflection), [reflection]);

  // Check for streak milestone
  const nextStreak = currentStreak + 1;
  const streakMilestone = useMemo(() => {
    if (isLowEffort) return null;
    return getStreakMilestoneMessage(nextStreak, locale);
  }, [nextStreak, isLowEffort, locale]);

  // Get the mentor's WISDOM - using deterministic selection based on lesson and reflection
  const mentorWisdom = useMemo(() => {
    // Create a stable seed from lesson ID and reflection content
    const seed = `${lesson.id}-${reflection.slice(0, 50)}`;

    if (isLowEffort) {
      const index = getStableIndex(seed + 'low', lowEffortWisdom.length);
      return {
        text: lowEffortWisdom[index],
        isWisdom: false,
      };
    }

    // Use lesson's hand-crafted mentor responses
    const lessonResponses = lesson.mentorResponses;
    if (lessonResponses && lessonResponses.length > 0) {
      const index = getStableIndex(seed + 'response', lessonResponses.length);
      const response = lessonResponses[index];
      // Use name personalization based on seed (deterministic)
      const usePersonalization = getStableIndex(seed + 'personal', 10) > 6;
      if (name && usePersonalization) {
        return {
          text: `${name}, ${response.charAt(0).toLowerCase()}${response.slice(1)}`,
          isWisdom: true,
        };
      }
      return { text: response, isWisdom: true };
    }

    // Fallback to philosophical wisdom
    const fallbackIndex = getStableIndex(seed + 'fallback', fallbackWisdom.length);
    const fallback = fallbackWisdom[fallbackIndex];
    const usePersonalization = getStableIndex(seed + 'fallback-personal', 10) > 5;
    if (name && usePersonalization) {
      return {
        text: `${name}, ${fallback.wisdom.charAt(0).toLowerCase()}${fallback.wisdom.slice(1)}`,
        isWisdom: true,
        context: fallback.context,
      };
    }
    return { text: fallback.wisdom, isWisdom: true, context: fallback.context };
  }, [lesson.id, lesson.mentorResponses, isLowEffort, name, reflection, fallbackWisdom, lowEffortWisdom]);

  // Determine Sage's mood
  const sageMood: SageMood = useMemo(() => {
    if (isTyping) return 'thinking';
    if (isLowEffort) return 'disappointed';
    if (streakMilestone) return 'celebrating';
    return 'wise';
  }, [isTyping, isLowEffort, streakMilestone]);

  // Typewriter effect - slower for wisdom
  useEffect(() => {
    let index = 0;
    let mounted = true;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    setDisplayedText('');
    setIsTyping(true);

    const baseSpeed = isLowEffort ? 22 : 32;

    const typeNextChar = () => {
      if (!mounted) return;

      if (index < mentorWisdom.text.length) {
        setDisplayedText(mentorWisdom.text.slice(0, index + 1));
        index++;

        let delay = baseSpeed;
        const char = mentorWisdom.text[index - 1];

        if (char === '.' || char === '!' || char === '?') {
          delay = baseSpeed * 8;
        } else if (char === ',') {
          delay = baseSpeed * 3;
        } else if (char === '—' || char === ':' || char === ';') {
          delay = baseSpeed * 4;
        } else {
          // Use deterministic variation instead of random
          delay = baseSpeed + ((index * 7) % 15);
        }

        timerId = setTimeout(typeNextChar, delay);
      } else {
        if (mounted) {
          setIsTyping(false);
          if (streakMilestone && !isLowEffort) {
            timerId = setTimeout(() => {
              if (mounted) setShowStreakBonus(true);
            }, 800);
          }
        }
      }
    };

    timerId = setTimeout(typeNextChar, 800);

    return () => {
      mounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [mentorWisdom.text, isLowEffort, streakMilestone]);

  // Handle completion
  const handleComplete = useCallback(() => {
    playTap();
    if (sageMood === 'celebrating') {
      playCelebrate();
    } else {
      playSparkle();
    }
    onComplete();
  }, [playTap, playSparkle, playCelebrate, sageMood, onComplete]);

  // Handle retry
  const handleRetry = useCallback(() => {
    playTap();
    onRetry();
  }, [playTap, onRetry]);

  // Get ambient color based on mood
  const getAmbientColor = () => {
    if (isLowEffort) return 'rgba(239, 68, 68, 0.08)';
    if (streakMilestone) return 'rgba(251, 191, 36, 0.10)';
    return 'rgba(167, 139, 250, 0.08)';
  };

  return (
    <div className="relative">
      {/* Static ambient glow based on mood */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle, ${getAmbientColor()} 0%, transparent 60%)`,
        }}
      />

      <div className="text-center">
        {/* ─────────────────────────────────────────────────────────────────
            Sage Avatar - Mystical Presence
        ───────────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...springs.gentle, delay: 0.1 }}
          className="mx-auto mb-6 relative"
        >
          <SageAvatar mood={sageMood} size="lg" />
        </motion.div>

        {/* Mentor name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-lg font-medium text-stone-100">{mentor.name}</h3>
          <p className="text-sm text-stone-600">{mentor.title}</p>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────────
            Message Container - Atmospheric
        ───────────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`relative rounded-2xl p-8 mb-6 text-left ${
            isLowEffort
              ? 'bg-gradient-to-br from-red-950/30 to-stone-950 border border-red-900/30'
              : 'bg-gradient-to-br from-stone-900/80 to-stone-950 border border-stone-800/50'
          }`}
          style={{
            boxShadow: isLowEffort
              ? '0 0 40px rgba(239, 68, 68, 0.05)'
              : '0 0 40px rgba(167, 139, 250, 0.05)',
          }}
        >
          {/* Corner accent glow - static */}
          {!isLowEffort && (
            <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden rounded-tl-2xl pointer-events-none">
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-purple-500/8 rounded-full" />
            </div>
          )}

          {/* Speech bubble pointer */}
          <div
            className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 ${
              isLowEffort
                ? 'bg-red-950/30 border-l border-t border-red-900/30'
                : 'bg-stone-900/80 border-l border-t border-stone-800/50'
            }`}
          />

          {/* Message text */}
          <p className={`text-lg leading-relaxed ${isLowEffort ? 'text-red-200/90' : 'text-stone-200'}`} data-testid="mentor-response">
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className={`inline-block w-2 h-5 ml-1 align-middle rounded-sm ${
                  isLowEffort ? 'bg-red-400' : 'bg-purple-400/80'
                }`}
              />
            )}
          </p>

          {/* Low effort indicator */}
          {isLowEffort && !isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-5 pt-4 border-t border-red-900/30"
            >
              <p className="text-sm text-red-400/70 text-center">
                {t('lessons.mentor.reflectionNeedsDepth')}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────────
            Streak Milestone Bonus
        ───────────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showStreakBonus && streakMilestone && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6"
            >
              <div
                className="bg-gradient-to-r from-amber-900/20 via-orange-900/20 to-amber-900/20 border border-amber-700/30 rounded-xl p-5"
                style={{
                  boxShadow: '0 0 30px rgba(251, 191, 36, 0.1)',
                }}
              >
                <motion.div
                  className="flex items-center justify-center gap-3 mb-3"
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 font-medium text-lg">
                    {nextStreak} Day Streak
                  </span>
                  <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                </motion.div>
                <p className="text-stone-400 text-sm text-center">
                  {streakMilestone}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─────────────────────────────────────────────────────────────────
            Action Buttons
        ───────────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isLowEffort ? (
            <Button
              size="lg"
              onClick={handleRetry}
              className={`w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <RotateCcw size={18} className={isRTL ? 'ml-2' : 'mr-2'} />
              {t('lessons.mentor.tryAgain')}
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleComplete}
              disabled={isTyping}
              glow={!isTyping}
              data-testid="mentor-complete-btn"
              className={`w-full group ${
                sageMood === 'celebrating'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400'
                  : ''
              }`}
            >
              {isTyping ? (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {t('lessons.mentor.sageIsSpeaking')}
                </motion.span>
              ) : (
                <>
                  {t('lessons.mentor.completeLesson')}
                  <ChevronRight
                    size={18}
                    className={`${isRTL ? 'mr-2 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} opacity-60 group-hover:opacity-100 transition-all`}
                  />
                </>
              )}
            </Button>
          )}
        </motion.div>

        {/* Streak hint for new users */}
        {!isLowEffort && !isTyping && !showStreakBonus && currentStreak > 0 && currentStreak < 7 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-stone-700 mt-5"
          >
            {t('lessons.mentor.daysToStreak')
              .replace('{days}', String(7 - currentStreak))
              .replace('{dayWord}', (7 - currentStreak) === 1 ? t('lessons.mentor.day') : t('lessons.mentor.days'))}
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default MentorStep;
