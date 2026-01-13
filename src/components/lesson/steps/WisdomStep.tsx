'use client';

// ============================================================================
// WISDOM STEP
// This is not a quote card. This is the transmission of ancient wisdom.
// Every word should land with weight. Every pause should be felt.
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lesson } from '@/types';

interface WisdomStepProps {
  lesson: Lesson;
  onComplete: () => void;
  onStartAmbience?: () => void;
}

type Phase = 'settling' | 'title' | 'wisdom' | 'source' | 'ready';

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
      const timer = setTimeout(() => setPhase('wisdom'), 2500);
      return () => clearTimeout(timer);
    }
    if (phase === 'source') {
      const timer = setTimeout(() => setPhase('ready'), 2000);
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
      const delay = hasPunctuation ? 400 : 120;

      const timer = setTimeout(() => {
        setVisibleWords(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // All words revealed, move to source
      const timer = setTimeout(() => setPhase('source'), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, visibleWords, wisdomWords]);

  const handleContinue = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <AnimatePresence mode="wait">
        {/* Settling Phase - Breathing */}
        {phase === 'settling' && (
          <motion.div
            key="settling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            {/* Breathing circle */}
            <motion.div
              className="w-32 h-32 rounded-full border-2 border-indigo-500/30 flex items-center justify-center mb-8"
              animate={{
                scale: [1, 1.2, 1],
                borderColor: ['rgba(99, 102, 241, 0.3)', 'rgba(99, 102, 241, 0.6)', 'rgba(99, 102, 241, 0.3)']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-indigo-500/10"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>

            {/* Breathing instruction */}
            <motion.p
              className="text-zinc-400 text-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {breathCount === 0 && 'Settle into this moment...'}
              {breathCount === 1 && 'Let go of what came before...'}
              {breathCount === 2 && 'Open to receive...'}
            </motion.p>

            {/* Breath counter */}
            <div className="flex gap-2 mt-8">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= breathCount ? 'bg-indigo-400' : 'bg-zinc-700'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 4, duration: 0.5 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Title Phase */}
        {phase === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-medium text-indigo-400 mb-4 tracking-widest uppercase"
            >
              Today&apos;s Wisdom
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-3xl sm:text-4xl font-bold text-white leading-tight"
            >
              {lesson.title}
            </motion.h1>
          </motion.div>
        )}

        {/* Wisdom Phase - Word by word reveal */}
        {(phase === 'wisdom' || phase === 'source' || phase === 'ready') && (
          <motion.div
            key="wisdom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-2xl"
          >
            {/* The wisdom text */}
            <div className="mb-8">
              <p className="text-xl sm:text-2xl text-zinc-200 leading-relaxed font-serif italic">
                <span className="text-indigo-400/70 text-4xl leading-none">"</span>
                {wisdomWords.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: index < visibleWords ? 1 : 0,
                      y: index < visibleWords ? 0 : 10
                    }}
                    transition={{ duration: 0.3 }}
                    className="inline"
                  >
                    {word}{' '}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: visibleWords >= wisdomWords.length ? 1 : 0 }}
                  className="text-indigo-400/70 text-4xl leading-none"
                >
                  "
                </motion.span>
              </p>
            </div>

            {/* Source attribution */}
            <AnimatePresence>
              {(phase === 'source' || phase === 'ready') && lesson.wisdomSource && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-zinc-500 text-lg mb-12"
                >
                  — {lesson.wisdomSource}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Continue button */}
            <AnimatePresence>
              {phase === 'ready' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.button
                    onClick={handleContinue}
                    className="group relative px-8 py-4 rounded-xl overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity" />

                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />

                    {/* Text */}
                    <span className="relative z-10 text-white font-medium text-lg">
                      I receive this wisdom. What is the practice?
                    </span>
                  </motion.button>

                  {/* Subtle hint */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="text-zinc-600 text-xs mt-6"
                  >
                    Press Enter or click to continue
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
