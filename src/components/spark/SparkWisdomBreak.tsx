'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WISDOM_BREAK_MESSAGES, WISDOM_BREAK_CONFIG } from '@/types/spark';

// ═══════════════════════════════════════════════════════════════════════════
// SPARK WISDOM BREAK
// The anti-TikTok interstitial: reminding users to act, not just watch
// ═══════════════════════════════════════════════════════════════════════════

interface SparkWisdomBreakProps {
  videosWatched: number;
  breakNumber: number; // Which break this is today (1, 2, 3)
  onLeave: () => void;
  onContinue: () => void;
  isFinalBreak: boolean;
}

export function SparkWisdomBreak({
  videosWatched,
  breakNumber,
  onLeave,
  onContinue,
  isFinalBreak,
}: SparkWisdomBreakProps) {
  const [isExiting, setIsExiting] = useState(false);

  // Rotate through messages
  const messageIndex = (breakNumber - 1) % WISDOM_BREAK_MESSAGES.length;
  const breakMessage = WISDOM_BREAK_MESSAGES[messageIndex];

  const handleLeave = () => {
    setIsExiting(true);
    setTimeout(onLeave, 300);
  };

  const handleContinue = () => {
    setIsExiting(true);
    setTimeout(onContinue, 300);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="max-w-sm mx-auto px-8 text-center"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4, type: 'spring', damping: 20 }}
      >
        {/* Pause icon */}
        <motion.div
          className="mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
            <span className="text-3xl">&#9208;&#65039;</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-2xl font-bold text-stone-100 mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {breakMessage.title}
        </motion.h2>

        {/* Video count */}
        <motion.p
          className="text-amber-400/80 text-sm mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          You&apos;ve watched {videosWatched} sparks
        </motion.p>

        {/* Message */}
        <motion.p
          className="text-stone-300 text-lg leading-relaxed mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {breakMessage.message}
        </motion.p>

        {/* Prompt */}
        <motion.p
          className="text-stone-400 text-sm mb-8 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {breakMessage.prompt}
        </motion.p>

        {/* Primary CTA — Leave and act */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            variant="primary"
            className="w-full mb-4"
            onClick={handleLeave}
            glow
            sound="tapConfirm"
          >
            I&apos;ll go do something now
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </motion.div>

        {/* Secondary CTA — Keep watching (smaller, less prominent) */}
        {!isFinalBreak ? (
          <motion.button
            className="text-stone-500 text-sm hover:text-stone-400 transition-colors flex items-center gap-1.5 mx-auto"
            onClick={handleContinue}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Play size={12} />
            Keep watching ({WISDOM_BREAK_CONFIG.normalThreshold} more)
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-stone-600 text-sm">
              You&apos;ve had plenty of sparks today.<br />
              Time to act on them.
            </p>
          </motion.div>
        )}

        {/* Break indicator dots */}
        <motion.div
          className="flex items-center justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {Array.from({ length: WISDOM_BREAK_CONFIG.maxBreaksPerDay }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < breakNumber
                  ? 'bg-amber-500/60'
                  : 'bg-stone-800'
              }`}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default SparkWisdomBreak;
