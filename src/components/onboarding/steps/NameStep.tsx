'use client';

// ═══════════════════════════════════════════════════════════════════════════
// NAME STEP - THE FIRST MEETING
// ═══════════════════════════════════════════════════════════════════════════
//
// This is not a form field. This is the moment we learn who we're speaking with.
// The name input should feel special - glowing, responsive, alive.
// When they type their name, it's acknowledged with warmth and presence.
//
// No skip option. Your name matters. You matter.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, User, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui';
import { useTranslation } from '@/i18n';

interface NameStepProps {
  onNext: () => void;
  onBack: () => void;
}

// Spring configurations
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  responsive: { type: 'spring' as const, stiffness: 300, damping: 20 },
};

export function NameStep({ onNext, onBack }: NameStepProps) {
  const { t, isRTL } = useTranslation();
  const { name, setName } = useStore();
  const [localName, setLocalName] = useState(name || '');
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input after animation
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 800);
    return () => clearTimeout(timer);
  }, [mounted]);

  const handleContinue = () => {
    if (localName.trim()) {
      setName(localName.trim());
      onNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && localName.trim()) {
      handleContinue();
    }
  };

  const isValid = localName.trim().length >= 1;

  if (!mounted) {
    return <div className="min-h-[60vh]" />;
  }

  return (
    <div className="min-h-[60vh] flex flex-col">
      {/* Back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className={`flex items-center text-stone-500 hover:text-stone-300 transition-colors mb-8 ${isRTL ? 'self-end flex-row-reverse' : 'self-start'} group`}
      >
        <ChevronLeft size={20} className={`${isRTL ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'} transition-transform`} />
        <span className="text-sm">{t('common.back')}</span>
      </motion.button>

      <div className="flex-1 flex flex-col justify-center">
        {/* The question - intimate, direct */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, ...springs.gentle }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/20 flex items-center justify-center"
          >
            <User size={28} className="text-amber-400" />
          </motion.div>

          <p className="text-2xl sm:text-3xl text-amber-100 font-light mb-3">
            {t('onboarding.name.beforeWeBegin')}
          </p>
          <p className="text-xl text-stone-400">
            {t('onboarding.name.whatShallICall')}
          </p>
        </motion.div>

        {/* Name input - prominent, centered, glowing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative mb-8"
        >
          {/* Input glow effect */}
          <motion.div
            className="absolute -inset-1 rounded-2xl pointer-events-none"
            animate={{
              boxShadow: isFocused
                ? '0 0 30px rgba(251, 191, 36, 0.2), 0 0 60px rgba(251, 191, 36, 0.1)'
                : '0 0 0 rgba(251, 191, 36, 0)',
              opacity: isFocused ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* The input */}
          <input
            ref={inputRef}
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t('onboarding.name.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
            className={`
              relative w-full p-5 rounded-2xl
              bg-stone-900/60 backdrop-blur-sm
              text-amber-100 text-center text-xl font-light placeholder-stone-600
              focus:outline-none transition-all duration-300
              border-2
              ${isFocused
                ? 'border-amber-500/50 bg-stone-900/80'
                : 'border-stone-800 hover:border-stone-700'
              }
            `}
            maxLength={30}
            autoComplete="given-name"
          />

          {/* Typing indicator sparkle */}
          <AnimatePresence>
            {localName.length > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <Sparkles size={18} className="text-amber-500/50" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Response - appears after typing */}
        <AnimatePresence mode="wait">
          {isValid && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-10"
            >
              <p className="text-stone-400 text-lg">
                {t('onboarding.name.honorToMeet')}{' '}
                <motion.span
                  key={localName}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-medium"
                  style={{
                    textShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
                  }}
                >
                  {localName}
                </motion.span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!isValid}
            glow={isValid}
            className={`w-full group ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isValid ? (
              <>
                {t('common.continue')}
                <ChevronRight
                  size={18}
                  className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} opacity-60 group-hover:opacity-100 transition-all`}
                />
              </>
            ) : (
              t('onboarding.name.enterName')
            )}
          </Button>
        </motion.div>
      </div>

      {/* Subtle privacy note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-xs text-stone-600 mt-6"
      >
        {t('onboarding.name.staysPrivate')}
      </motion.p>
    </div>
  );
}

export default NameStep;
