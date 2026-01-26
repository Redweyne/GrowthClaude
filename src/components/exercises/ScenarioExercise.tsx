'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ScenarioContent } from '@/types/dailyPractice';

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO EXERCISE
// Present a real-life situation and ask the user to apply today's wisdom
// ═══════════════════════════════════════════════════════════════════════════

interface ScenarioExerciseProps {
  title: string;
  content: ScenarioContent;
  onComplete: (response: string) => void;
  onBack?: () => void;
}

export function ScenarioExercise({
  title,
  content,
  onComplete,
  onBack,
}: ScenarioExerciseProps) {
  const [response, setResponse] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
  const minimumWords = 5;
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-xl">🎭</span>
          </div>
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-wider">Scenario</p>
            <h1 className="text-xl font-semibold text-stone-100">{title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col">
        {/* Scenario Card */}
        <Card variant="glass" padding="lg" className="mb-6">
          <p className="text-stone-200 text-lg leading-relaxed">
            {content.situation}
          </p>
        </Card>

        {/* Question */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-amber-300 font-medium mb-2">{content.question}</p>
          {/* Hints */}
          {content.hints && content.hints.length > 0 && (
            <div className="mt-3 space-y-1">
              {content.hints.map((hint, index) => (
                <p key={index} className="text-stone-500 text-sm flex items-start gap-2">
                  <span className="text-amber-500/60">•</span>
                  {hint}
                </p>
              ))}
            </div>
          )}
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
                ? 'border-amber-500/50 bg-stone-900/80'
                : 'border-stone-800 bg-stone-900/50'
            }`}
          >
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Apply today's wisdom to this situation..."
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

export default ScenarioExercise;
