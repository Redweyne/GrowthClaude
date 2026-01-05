'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSound } from '@/hooks/useSound';
import type { Lesson } from '@/types';

interface WisdomStepProps {
  lesson: Lesson;
  onComplete: () => void;
}

export function WisdomStep({ lesson, onComplete }: WisdomStepProps) {
  const { playTap, playWhoosh } = useSound();

  const handleContinue = () => {
    playTap();
    playWhoosh();
    onComplete();
  };

  return (
    <div className="text-center">
      {/* Lesson number */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-medium text-indigo-400 mb-4"
      >
        Today&apos;s Lesson
      </motion.p>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-white mb-8"
      >
        {lesson.title}
      </motion.h1>

      {/* Quote icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="w-12 h-12 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center"
      >
        <Quote size={24} className="text-zinc-500" />
      </motion.div>

      {/* Wisdom text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <p className="text-lg text-zinc-300 leading-relaxed italic">
          &ldquo;{lesson.wisdomText}&rdquo;
        </p>
      </motion.div>

      {/* Source */}
      {lesson.wisdomSource && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-zinc-500 mb-12"
        >
          — {lesson.wisdomSource}
        </motion.p>
      )}

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button size="lg" onClick={handleContinue} className="w-full">
          I understand. What&apos;s the practice?
        </Button>
      </motion.div>
    </div>
  );
}

export default WisdomStep;
