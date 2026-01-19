'use client';

// ═══════════════════════════════════════════════════════════════════════════
// WISDOM STEP - THE REVELATION
// ═══════════════════════════════════════════════════════════════════════════
//
// This is not a quote card. This is the transmission of ancient wisdom.
// The atmosphere builds. The words arrive like gifts from the ancients.
// Each syllable carries weight. Each pause allows the truth to land.
//
// Visual principles:
// - Mystical preparation through breath
// - Luminous glow that builds with the reveal
// - Words that appear like light forming into meaning
// - Sacred geometry underlying the presentation
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import type { Lesson } from '@/types';

interface WisdomStepProps {
  lesson: Lesson;
  onComplete: () => void;
  onStartAmbience?: () => void;
}

type Phase = 'settling' | 'title' | 'wisdom' | 'source' | 'ready';

// Spring configurations
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  soft: { type: 'spring' as const, stiffness: 80, damping: 20 },
};

export function WisdomStep({ lesson, onComplete, onStartAmbience }: WisdomStepProps) {
  const [phase, setPhase] = useState<Phase>('settling');
  const [visibleWords, setVisibleWords] = useState(0);
  const [breathCount, setBreathCount] = useState(0);

  // Split wisdom text into words for reveal
  const wisdomWords = lesson.wisdomText.split(' ');

  // Phase timing
  useEffect(() => {
    // Start ambience on mount
    onStartAmbience?.();

    const timers: NodeJS.Timeout[] = [];

    // Settling phase - 3 breaths
    const breathInterval = setInterval(() => {
      setBreathCount(prev => {
        if (prev >= 2) {
          clearInterval(breathInterval);
          setPhase('title');
        }
        return prev + 1;
      });
    }, 4000);

    timers.push(breathInterval as unknown as NodeJS.Timeout);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(breathInterval);
    };
  }, [onStartAmbience]);

  // Progress through phases
  useEffect(() => {
    if (phase === 'title') {
      const timer = setTimeout(() => setPhase('wisdom'), 2800);
      return () => clearTimeout(timer);
    }
    if (phase === 'source') {
      const timer = setTimeout(() => setPhase('ready'), 2200);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Word-by-word reveal for wisdom text
  useEffect(() => {
    if (phase !== 'wisdom') return;

    if (visibleWords < wisdomWords.length) {
      // Varying pace - longer pauses after punctuation
      const currentWord = wisdomWords[visibleWords - 1] || '';
      const hasPunctuation = /[.,;:!?—]$/.test(currentWord);
      const delay = hasPunctuation ? 450 : 140;

      const timer = setTimeout(() => {
        setVisibleWords(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // All words revealed, move to source
      const timer = setTimeout(() => setPhase('source'), 1800);
      return () => clearTimeout(timer);
    }
  }, [phase, visibleWords, wisdomWords]);

  const handleContinue = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Breathing messages
  const breathMessages = [
    'Settle into this moment...',
    'Let go of what came before...',
    'Open to receive...',
  ];

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <AnimatePresence mode="wait">
        {/* ─────────────────────────────────────────────────────────────────
            Settling Phase - Sacred Preparation
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'settling' && (
          <motion.div
            key="settling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            {/* Breathing circles - mystical orb */}
            <motion.div
              className="relative w-36 h-36 mb-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, ...springs.soft }}
            >
              {/* Outer ring - expanding breath */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '2px solid rgba(167, 139, 250, 0.3)',
                }}
                animate={{
                  scale: [1, 1.25, 1],
                  borderColor: [
                    'rgba(167, 139, 250, 0.3)',
                    'rgba(167, 139, 250, 0.6)',
                    'rgba(167, 139, 250, 0.3)',
                  ],
                  boxShadow: [
                    '0 0 20px rgba(167, 139, 250, 0.1)',
                    '0 0 40px rgba(167, 139, 250, 0.25)',
                    '0 0 20px rgba(167, 139, 250, 0.1)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Middle ring */}
              <motion.div
                className="absolute inset-4 rounded-full bg-purple-500/5"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              />

              {/* Inner glow */}
              <motion.div
                className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-500/20 to-amber-500/10"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              />

              {/* Core light */}
              <motion.div
                className="absolute inset-12 rounded-full flex items-center justify-center"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-purple-400"
                  style={{
                    boxShadow: '0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(167, 139, 250, 0.3)',
                  }}
                />
              </motion.div>

              {/* Floating particles around orb */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-purple-400/60"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos((i / 6) * Math.PI * 2 + breathCount) * 80],
                    y: [0, Math.sin((i / 6) * Math.PI * 2 + breathCount) * 80],
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>

            {/* Breathing instruction */}
            <AnimatePresence mode="wait">
              <motion.p
                key={breathCount}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="text-xl text-stone-400 font-light"
              >
                {breathMessages[breathCount] || breathMessages[2]}
              </motion.p>
            </AnimatePresence>

            {/* Breath counter dots */}
            <div className="flex gap-3 mt-8">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i <= breathCount ? 'bg-purple-400' : 'bg-stone-700'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    boxShadow: i <= breathCount
                      ? '0 0 10px rgba(167, 139, 250, 0.5)'
                      : 'none',
                  }}
                  transition={{ delay: i * 0.3, duration: 0.5 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            Title Phase - The Announcement
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Decorative top element */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-20 h-px mb-8"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.5), transparent)',
              }}
            />

            {/* Label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm font-medium text-purple-400 mb-5 tracking-[0.2em] uppercase"
            >
              Today&apos;s Wisdom
            </motion.p>

            {/* Title with glow */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-3xl sm:text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 leading-tight"
              style={{
                textShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
              }}
            >
              {lesson.title}
            </motion.h1>

            {/* Decorative bottom element */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="w-12 h-px mt-8"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.5), transparent)',
              }}
            />
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            Wisdom Phase - The Revelation
        ───────────────────────────────────────────────────────────────── */}
        {(phase === 'wisdom' || phase === 'source' || phase === 'ready') && (
          <motion.div
            key="wisdom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-2xl"
          >
            {/* The wisdom container with glow */}
            <motion.div
              className="relative mb-10"
              animate={{
                boxShadow: visibleWords >= wisdomWords.length
                  ? '0 0 60px rgba(167, 139, 250, 0.1)'
                  : '0 0 30px rgba(167, 139, 250, 0.05)',
              }}
              transition={{ duration: 1 }}
            >
              {/* Opening quote mark */}
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.5, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-6 -left-2 text-6xl text-purple-400/30 font-serif"
              >
                &ldquo;
              </motion.span>

              {/* The wisdom text - word by word reveal */}
              <p className="text-xl sm:text-2xl text-stone-200 leading-relaxed font-light px-4">
                {wisdomWords.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                    animate={{
                      opacity: index < visibleWords ? 1 : 0,
                      y: index < visibleWords ? 0 : 15,
                      filter: index < visibleWords ? 'blur(0px)' : 'blur(4px)',
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="inline"
                    style={{
                      textShadow: index < visibleWords
                        ? '0 0 20px rgba(251, 191, 36, 0.2)'
                        : 'none',
                    }}
                  >
                    {word}{' '}
                  </motion.span>
                ))}
              </p>

              {/* Closing quote mark */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: visibleWords >= wisdomWords.length ? 0.5 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute -bottom-6 -right-2 text-6xl text-purple-400/30 font-serif"
              >
                &rdquo;
              </motion.span>
            </motion.div>

            {/* Source attribution */}
            <AnimatePresence>
              {(phase === 'source' || phase === 'ready') && lesson.wisdomSource && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mb-12"
                >
                  <p className="text-stone-500 text-lg italic">
                    — {lesson.wisdomSource}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue button */}
            <AnimatePresence>
              {phase === 'ready' && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  <Button
                    size="lg"
                    glow
                    onClick={handleContinue}
                    className="w-full max-w-md mx-auto group"
                  >
                    <Sparkles size={18} className="mr-2 text-amber-300" />
                    I receive this wisdom. What is the practice?
                    <ChevronRight
                      size={18}
                      className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                    />
                  </Button>

                  {/* Subtle hint */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="text-stone-600 text-xs"
                  >
                    Press Enter to continue
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WisdomStep;
