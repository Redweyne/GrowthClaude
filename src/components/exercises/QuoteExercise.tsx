'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { QuoteContent } from '@/types/dailyPractice';

// ═══════════════════════════════════════════════════════════════════════════
// QUOTE EXERCISE
// Present a wisdom quote and ask the user to reflect on it
// ═══════════════════════════════════════════════════════════════════════════

interface QuoteExerciseProps {
  title: string;
  content: QuoteContent;
  onComplete: (response: string) => void;
  onBack?: () => void;
  isRTL?: boolean;
  t?: (key: string) => string;
}

export function QuoteExercise({
  title,
  content,
  onComplete,
  onBack,
  isRTL = false,
  t = (key: string) => key,
}: QuoteExerciseProps) {
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <span className="text-xl">💎</span>
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-stone-500 text-xs uppercase tracking-wider">{t('exercises.quoteTitle')}</p>
            <h1 className="text-xl font-semibold text-stone-100">{title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col">
        {/* Quote Card */}
        <Card variant="warm" padding="lg" className="mb-6">
          <div className="relative">
            {/* Quote mark */}
            <div className={`absolute -top-2 text-4xl text-amber-500/30 font-serif ${isRTL ? '-right-2' : '-left-2'}`}>
              &ldquo;
            </div>

            <blockquote className={`py-2 ${isRTL ? 'pr-6 pl-4 text-right' : 'pl-6 pr-4'}`}>
              <p className="text-stone-100 text-xl leading-relaxed italic">
                {content.quote}
              </p>
            </blockquote>

            <div className={`mt-4 flex flex-col ${isRTL ? 'pr-6 text-right' : 'pl-6'}`}>
              <span className="text-amber-400 font-medium">— {content.author}</span>
              {content.source && (
                <span className="text-stone-500 text-sm">{content.source}</span>
              )}
            </div>
          </div>
        </Card>

        {/* Prompt */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className={`text-amber-300 font-medium ${isRTL ? 'text-right' : ''}`}>{content.reflectionPrompt}</p>
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
              placeholder={t('exercises.yourThoughts')}
              className={`w-full h-full min-h-[180px] bg-transparent text-stone-100 placeholder-stone-600 p-4 resize-none focus:outline-none text-lg ${isRTL ? 'text-right' : ''}`}
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
              {t('exercises.complete')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default QuoteExercise;
