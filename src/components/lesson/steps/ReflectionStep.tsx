'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Feather } from 'lucide-react';
import { Button } from '@/components/ui';
import type { Lesson } from '@/types';

interface ReflectionStepProps {
  lesson: Lesson;
  onComplete: (reflection: string) => void;
}

export function ReflectionStep({ lesson, onComplete }: ReflectionStepProps) {
  const [reflection, setReflection] = useState('');
  const minCharacters = 20;

  const handleSubmit = () => {
    onComplete(reflection.trim());
  };

  const canSubmit = reflection.trim().length >= minCharacters;

  return (
    <div>
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-zinc-800 flex items-center justify-center"
      >
        <Feather size={32} className="text-indigo-400" />
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm font-medium text-indigo-400 mb-2 text-center"
      >
        Reflection
      </motion.p>

      {/* Prompt */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-white mb-6 text-center leading-relaxed"
      >
        {lesson.reflectionPrompt}
      </motion.p>

      {/* Text area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full h-40 p-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          autoFocus
        />
        <div className="flex justify-between items-center mt-2">
          <p
            className={`text-xs ${
              canSubmit ? 'text-zinc-500' : 'text-amber-500'
            }`}
          >
            {reflection.length < minCharacters
              ? `${minCharacters - reflection.length} more characters needed`
              : 'Ready to continue'}
          </p>
          <p className="text-xs text-zinc-600">{reflection.length} characters</p>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-6"
      >
        <p className="text-sm text-zinc-400">
          <span className="text-indigo-400 font-medium">Tip:</span> Be honest.
          This reflection is for you. There are no right or wrong answers.
        </p>
      </motion.div>

      {/* Submit button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}

export default ReflectionStep;
