'use client';

// ═══════════════════════════════════════════════════════════════════════════
// LANGUAGE SELECTOR - FIRST-TIME LANGUAGE SELECTION
// ═══════════════════════════════════════════════════════════════════════════
//
// A beautiful, welcoming modal that appears on first app launch.
// Users select their preferred language before beginning their journey.
//
// Features:
// - Elegant flag icons and native language names
// - Smooth Framer Motion animations
// - RTL preview for Arabic selection
// - Persists choice to localStorage via Zustand
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Globe, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { type Locale, languageConfig, locales } from '@/i18n/config';
import { Button } from '@/components/ui';
import { AmbientBackground } from '@/components/ambient';

// Spring configurations for smooth animations
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 20 },
};

export function LanguageSelector() {
  const { setLanguage } = useStore();
  const [selectedLanguage, setSelectedLanguage] = useState<Locale | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleSelectLanguage = (locale: Locale) => {
    setSelectedLanguage(locale);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      setIsExiting(true);
      // Small delay to show the exit animation
      setTimeout(() => {
        setLanguage(selectedLanguage);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-stone-950">
      {/* Ambient background */}
      <AmbientBackground intensity="subtle" particleCount={20} orbCount={4} />

      {/* Content */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Globe icon with glow */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, ...springs.gentle }}
              className="relative mb-8"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(251, 191, 36, 0.2), 0 0 60px rgba(251, 191, 36, 0.1)',
                    '0 0 50px rgba(251, 191, 36, 0.3), 0 0 80px rgba(251, 191, 36, 0.15)',
                    '0 0 30px rgba(251, 191, 36, 0.2), 0 0 60px rgba(251, 191, 36, 0.1)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center">
                <Globe size={40} className="text-amber-400" />
              </div>
            </motion.div>

            {/* Title - in all three languages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-10"
            >
              <h1 className="text-3xl sm:text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 mb-4">
                Choose Your Language
              </h1>
              <div className="space-y-1">
                <p className="text-stone-500">Choisissez votre langue</p>
                <p className="text-stone-500" style={{ fontFamily: 'system-ui' }}>اختر لغتك</p>
              </div>
            </motion.div>

            {/* Language options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full max-w-md space-y-4 mb-10"
            >
              {locales.map((locale, index) => {
                const config = languageConfig[locale];
                const isSelected = selectedLanguage === locale;

                return (
                  <motion.button
                    key={locale}
                    onClick={() => handleSelectLanguage(locale)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, ...springs.gentle }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative w-full p-5 rounded-2xl border-2 transition-all duration-300
                      ${isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
                        : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 hover:bg-stone-900/80'
                      }
                    `}
                    style={{
                      direction: config.dir,
                    }}
                  >
                    <div className={`flex items-center gap-4 ${config.dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      {/* Flag */}
                      <motion.div
                        className="text-4xl"
                        animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {config.flag}
                      </motion.div>

                      {/* Language names */}
                      <div className={`flex-1 ${config.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <p className={`text-lg font-semibold ${isSelected ? 'text-amber-200' : 'text-stone-200'}`}>
                          {config.nativeName}
                        </p>
                        <p className="text-sm text-stone-500">
                          {config.name}
                        </p>
                      </div>

                      {/* Selected indicator */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={springs.bouncy}
                            className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center"
                          >
                            <Check size={18} className="text-stone-950" strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Shimmer effect on selected */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="absolute inset-0"
                          animate={{
                            background: [
                              'linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.1) 50%, transparent 100%)',
                            ],
                            backgroundPosition: ['-100% 0', '200% 0'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          style={{ backgroundSize: '50% 100%' }}
                        />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Continue button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="w-full max-w-md"
            >
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!selectedLanguage}
                glow={!!selectedLanguage}
                className="w-full group text-lg"
              >
                {selectedLanguage ? (
                  <>
                    <Sparkles size={20} className="mr-2 text-amber-300" />
                    {selectedLanguage === 'en' && 'Continue'}
                    {selectedLanguage === 'fr' && 'Continuer'}
                    {selectedLanguage === 'ar' && 'متابعة'}
                  </>
                ) : (
                  'Select a language'
                )}
              </Button>
            </motion.div>

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-xs text-stone-600 mt-8"
            >
              You can change this anytime in settings
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSelector;
