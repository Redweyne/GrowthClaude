'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ReframeContent } from '@/types/dailyPractice';

// ═══════════════════════════════════════════════════════════════════════════
// REFRAME EXERCISE
// Take a challenge and reframe it using today's wisdom
// ═══════════════════════════════════════════════════════════════════════════

interface ReframeExerciseProps {
  title: string;
  content: ReframeContent;
  onComplete: (response: string) => void;
  onBack?: () => void;
}

export function ReframeExercise({
  title,
  content,
  onComplete,
  onBack,
}: ReframeExerciseProps) {
  const [response, setResponse] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
  const minimumWords = 10;
  const canSubmit = wordCount >= minimumWords;

  const handleSubmit = () => {
    if (canSubmit) {
      onComplete(response);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-stone-950 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        {onBack && (
          <button
            onClick={onBack}
            className="text-stone-500 hover:text-stone-300 transition-colors text-sm mb-4"
          >
            ← Back
          </button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
            <span className="text-xl">🔄</span>
          </div>
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-wider">Reframe</p>
            <h1 className="text-xl font-semibold text-stone-100">{title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col">
        {/* Context Card */}
        <Card variant="bordered" padding="lg" className="mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <h3 className="text-stone-200 font-medium mb-2">Shift Your Perspective</h3>
              <p className="text-stone-400">
                Use today&apos;s wisdom to see this situation differently. The obstacle often contains the opportunity.
              </p>
            </div>
          </div>
        </Card>

        {/* Challenge Prompt */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-amber-300 font-medium text-lg mb-2">{content.challengePrompt}</p>
          <p className="text-stone-400 text-sm mb-4">{content.reframeGuide}</p>

          {/* Example */}
          <Card variant="glass" padding="md" className="mt-3">
            <p className="text-stone-500 text-xs uppercase tracking-wider mb-3">
              Example
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-stone-500 text-xs mb-1">Before:</p>
                <p className="text-stone-400 text-sm italic">&ldquo;{content.example.before}&rdquo;</p>
              </div>
              <div className="flex justify-center">
                <span className="text-rose-400">↓</span>
              </div>
              <div>
                <p className="text-emerald-500 text-xs mb-1">After:</p>
                <p className="text-stone-300 text-sm italic">&ldquo;{content.example.after}&rdquo;</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Response Input */}
        <motion.div
          className="flex-1 flex flex-col"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className={`flex-1 relative rounded-xl border transition-colors ${
              isFocused
                ? 'border-rose-500/50 bg-stone-900/80'
                : 'border-stone-800 bg-stone-900/50'
            }`}
          >
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Describe the challenge, then reframe it using today's wisdom..."
              className="w-full h-full min-h-[200px] bg-transparent text-stone-100 placeholder-stone-600 p-4 resize-none focus:outline-none text-lg"
            />

            {/* Word count */}
            <div className="absolute bottom-3 right-3">
              <span
                className={`text-sm ${
                  canSubmit ? 'text-emerald-500' : 'text-stone-500'
                }`}
              >
                {wordCount} / {minimumWords} words
              </span>
            </div>
          </div>

          {/* Submit button */}
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              variant="primary"
              className="w-full"
              sound="tapConfirm"
            >
              Complete Exercise
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ReframeExercise;
