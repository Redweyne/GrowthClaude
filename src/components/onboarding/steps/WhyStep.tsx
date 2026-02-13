'use client';

// ============================================================================
// WHY STEP - THE TRUTH
// This is not optional. This is the anchor.
// When motivation fades, this is what remains.
// No skip button. The truth is required.
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TRANSFORMATION_GOALS } from '@/types';
import { useTranslation } from '@/i18n';

interface WhyStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function WhyStep({ onNext, onBack }: WhyStepProps) {
  const { t, isRTL } = useTranslation();
  const { name, whyStatement, setWhyStatement, transformationGoal } = useStore();
  const [localWhy, setLocalWhy] = useState(whyStatement || '');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Word count
  const wordCount = localWhy.trim().split(/\s+/).filter(Boolean).length;
  const isValid = wordCount >= 10;

  // Focus textarea after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (isValid) {
      setWhyStatement(localWhy.trim());
      onNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isValid) {
      handleContinue();
    }
  };

  const selectedGoal = TRANSFORMATION_GOALS.find(g => g.id === transformationGoal);
  const goalTitle = transformationGoal ? t(`onboarding.goal.goals.${transformationGoal}.title` as any) : '';
  const goalKey = transformationGoal || 'calmer';

  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center text-stone-500 light:text-stone-500 hover:text-stone-300 light:hover:text-stone-700 transition-colors mb-6 self-start"
      >
        <ChevronLeft size={20} />
        <span className="text-sm">{t('common.back')}</span>
      </button>

      {/* Context - what they chose */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 mb-6"
      >
        <span className="text-2xl">{selectedGoal?.icon}</span>
        <span className="text-stone-500 light:text-stone-500 text-sm">
          {t('onboarding.why.yourPath')}: <span className="text-stone-300 light:text-stone-700">{goalTitle || selectedGoal?.title}</span>
        </span>
      </motion.div>

      {/* The question - deep, personal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <p className="text-xl sm:text-2xl text-white light:text-stone-900 font-light mb-2">
          {name ? `${name}, ` : ''}{t(`onboarding.why.whatsTheCost.${goalKey}`)}
        </p>
        <p className="text-stone-500 light:text-stone-500 text-sm">
          {t(`onboarding.why.subtext.${goalKey}`)}
        </p>
      </motion.div>

      {/* Writing space */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex-1 mb-4"
      >
        <div className={`
          relative rounded-xl transition-all duration-300
          ${isFocused ? 'ring-2 ring-indigo-500/30' : ''}
        `}>
          <textarea
            ref={textareaRef}
            data-testid="why-input"
            value={localWhy}
            onChange={(e) => setLocalWhy(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={t(`onboarding.why.placeholder.${goalKey}`)}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="
              w-full min-h-[140px] p-4 rounded-xl
              bg-stone-900/50 light:bg-stone-100/50 border-2 border-stone-800 light:border-stone-200
              text-white light:text-stone-900 placeholder-stone-600 light:placeholder-stone-400
              focus:outline-none focus:border-indigo-500/50 focus:bg-stone-900 light:focus:bg-stone-100
              transition-all duration-300 resize-none
              leading-relaxed
            "
            maxLength={800}
          />

          {/* Word count indicator */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className={`text-xs transition-colors ${
              isValid ? 'text-emerald-400' : 'text-stone-600 light:text-stone-500'
            }`}>
              {t('onboarding.why.wordCount', { count: wordCount })}
            </span>
            {wordCount > 0 && wordCount < 10 && (
              <span className="text-xs text-stone-500 light:text-stone-500">
                {t('onboarding.why.moreNeeded', { count: 10 - wordCount })}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Encouragement text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isValid ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
        className="text-center text-sm text-stone-500 light:text-stone-500 mb-6"
      >
        {isValid
          ? t('onboarding.why.anchorText')
          : t('onboarding.why.beHonest')
        }
      </motion.p>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          data-testid="why-continue-btn"
          onClick={handleContinue}
          disabled={!isValid}
          className={`
            w-full py-4 rounded-xl font-medium text-lg transition-all duration-300
            ${isValid
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
              : 'bg-stone-800 light:bg-stone-200 text-stone-500 light:text-stone-500 cursor-not-allowed'}
          `}
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
        >
          {isValid ? t('onboarding.why.thisIsMyTruth') : t('onboarding.why.writeYourWhy')}
        </motion.button>

        {isValid && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-stone-600 light:text-stone-500 mt-3"
          >
            {t('onboarding.why.pressToSubmit', { key: '⌘' })}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default WhyStep;
