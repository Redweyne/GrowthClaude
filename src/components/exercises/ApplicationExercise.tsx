'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ApplicationContent } from '@/types/dailyPractice';

// ═══════════════════════════════════════════════════════════════════════════
// APPLICATION EXERCISE
// Bridge today's wisdom to tomorrow's life with specific commitment
// ═══════════════════════════════════════════════════════════════════════════

interface ApplicationExerciseProps {
  title: string;
  content: ApplicationContent;
  onComplete: (response: string) => void;
  onBack?: () => void;
  isRTL?: boolean;
  t?: (key: string) => string;
}

export function ApplicationExercise({
  title,
  content,
  onComplete,
  onBack,
  isRTL = false,
  t = (key: string) => key,
}: ApplicationExerciseProps) {
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
      className={`min-h-screen bg-stone-950 flex flex-col ${isRTL ? 'rtl' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        {onBack && (
          <button
            onClick={onBack}
            className={`flex items-center gap-1 text-stone-500 hover:text-stone-300 transition-colors text-sm mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {t('exercises.back')}
          </button>
        )}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
            <span className="text-xl">🌅</span>
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-stone-500 text-xs uppercase tracking-wider">{t('exercises.applicationTitle')}</p>
            <h1 className="text-xl font-semibold text-stone-100">{title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col">
        {/* Context Card */}
        <Card variant="glow" padding="lg" className="mb-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl mb-4"
            >
              ☀️
            </motion.div>
            <p className="text-stone-300 text-lg">
              {t('exercises.tomorrowOpportunity')}
            </p>
          </div>
        </Card>

        {/* Instruction */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className={`text-stone-300 text-base mb-3 ${isRTL ? 'text-right' : ''}`}>{content.instruction}</p>
          <p className={`text-amber-300 font-medium text-lg mb-2 ${isRTL ? 'text-right' : ''}`}>{content.planPrompt}</p>

          {/* Examples */}
          {content.examples && content.examples.length > 0 && (
            <div className="mt-3 space-y-1">
              {content.examples.map((example, index) => (
                <p key={index} className={`text-stone-500 text-sm flex items-start gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="text-amber-500/60">•</span>
                  {example}
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
                ? 'border-emerald-500/50 bg-stone-900/80'
                : 'border-stone-800 bg-stone-900/50'
            }`}
          >
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={t('exercises.tomorrowIWill')}
              className={`w-full h-full min-h-[200px] bg-transparent text-stone-100 placeholder-stone-600 p-4 resize-none focus:outline-none text-lg ${isRTL ? 'text-right' : ''}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />

            {/* Word count */}
            <div className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'}`}>
              <span
                className={`text-sm ${
                  canSubmit ? 'text-emerald-500' : 'text-stone-500'
                }`}
              >
                {wordCount} / {minimumWords} {t('common.words')}
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
              {t('exercises.setTomorrowsIntention')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ApplicationExercise;
