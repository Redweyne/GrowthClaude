'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WISDOM_BREAK_MESSAGES, WISDOM_BREAK_CONFIG } from '@/types/spark';

// ═══════════════════════════════════════════════════════════════════════════
// SPARK WISDOM BREAK — Redesigned
// Clean full-screen pause within the 9:16 column
// ═══════════════════════════════════════════════════════════════════════════

interface SparkWisdomBreakProps {
  videosWatched: number;
  breakNumber: number;
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
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full max-w-sm mx-auto px-8 text-center"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4, type: 'spring', damping: 20 }}
      >
        {/* Breathing circle */}
        <motion.div
          className="mx-auto mb-8 w-20 h-20 rounded-full border border-white/10 flex items-center justify-center"
          animate={{
            scale: [1, 1.08, 1],
            borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="w-3 h-3 rounded-full bg-white/40"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.h2
          className="text-2xl font-bold text-white mb-3 tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {breakMessage.title}
        </motion.h2>

        <motion.p
          className="text-white/30 text-sm mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {videosWatched} sparks watched
        </motion.p>

        <motion.p
          className="text-white/70 text-lg leading-relaxed mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {breakMessage.message}
        </motion.p>

        <motion.p
          className="text-white/40 text-sm mb-10 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {breakMessage.prompt}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="primary"
            className="w-full mb-5"
            onClick={handleLeave}
            glow
            sound="tapConfirm"
          >
            I&apos;ll go do something now
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </motion.div>

        {!isFinalBreak ? (
          <motion.button
            className="text-white/30 text-sm hover:text-white/50 transition-colors flex items-center gap-1.5 mx-auto"
            onClick={handleContinue}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Play size={12} />
            Keep watching
          </motion.button>
        ) : (
          <motion.p
            className="text-white/20 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            You&apos;ve had enough sparks today. Time to act.
          </motion.p>
        )}

        <motion.div
          className="flex items-center justify-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {Array.from({ length: WISDOM_BREAK_CONFIG.maxBreaksPerDay }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i < breakNumber ? 'bg-white/40' : 'bg-white/10'
              }`}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default SparkWisdomBreak;
