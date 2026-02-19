'use client';

// ═══════════════════════════════════════════════════════════════════════════
// WELCOME STEP - THE THRESHOLD
// ═══════════════════════════════════════════════════════════════════════════
//
// This is the first moment. The user has just arrived.
// They're seeking something. They need to feel seen immediately.
//
// We don't rush. We create atmosphere. We acknowledge their struggle.
// Then we offer hope. Then we extend the invitation.
//
// Every animation, every word, every pause is intentional.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Target, Flame, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/i18n';

interface WelcomeStepProps {
  onNext: () => void;
}

// Spring configurations
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  soft: { type: 'spring' as const, stiffness: 80, damping: 20 },
};

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { t, isRTL } = useTranslation();
  const [phase, setPhase] = useState<'opening' | 'question' | 'invitation'>('opening');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Progress through phases with breathing room
  useEffect(() => {
    if (!mounted) return;
    const timer1 = setTimeout(() => setPhase('question'), 3000);
    const timer2 = setTimeout(() => setPhase('invitation'), 7000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [mounted]);

  if (!mounted) {
    return <div className="min-h-[70dvh]" />;
  }

  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center text-center px-6 py-8">
      <AnimatePresence mode="wait">
        {/* ─────────────────────────────────────────────────────────────────
            Phase 1: Opening - Create presence and stillness
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'opening' && (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="space-y-10"
          >
            {/* Breathing circle - represents the present moment */}
            <motion.div
              className="relative w-28 h-28 mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, ...springs.soft }}
            >
              {/* Outer breathing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-amber-500/20"
                animate={{
                  scale: [1, 1.2, 1],
                  borderColor: [
                    'rgba(251, 191, 36, 0.2)',
                    'rgba(251, 191, 36, 0.4)',
                    'rgba(251, 191, 36, 0.2)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Inner glowing orb */}
              <motion.div
                className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-900/40 to-stone-900"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Core light */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div
                    className="w-4 h-4 rounded-full bg-amber-400"
                    style={{
                      boxShadow: '0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3)',
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Opening words */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl text-amber-100/90 light:text-amber-900 font-bold tracking-tight leading-tight"
            >
              {t('onboarding.welcome.takeBreath')}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="text-stone-400 light:text-stone-600 text-xl sm:text-2xl leading-relaxed"
            >
              {t('onboarding.welcome.hereForReason')}
            </motion.p>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            Phase 2: The Question - Create emotional entry point
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="space-y-12 max-w-2xl"
          >
            {/* The acknowledgment */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <p className="text-2xl sm:text-3xl md:text-4xl text-stone-300 light:text-stone-700 font-medium tracking-tight leading-tight">
                {t('onboarding.welcome.notWorking')}
                <br />
                <span className="text-amber-200 font-bold">{t('onboarding.welcome.theWayYouWant')}</span>
              </p>
            </motion.div>

            {/* The connection */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="relative"
            >
              {/* Decorative line */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -top-6 w-20 h-px"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.3), transparent)',
                }}
              />

              <p className="text-stone-500 light:text-stone-600 text-xl sm:text-2xl italic leading-relaxed">
                {t('onboarding.welcome.thatsWhy')}
              </p>
            </motion.div>

            {/* Subtle pulse to indicate transition */}
            <motion.div
              className="w-2 h-2 rounded-full bg-amber-500/50 mx-auto"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            Phase 3: The Invitation - Offer the path forward
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'invitation' && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-12 max-w-4xl"
          >
            {/* The promise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.p
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 font-bold tracking-tighter leading-tight mb-6"
                style={{
                  textShadow: '0 0 40px rgba(251, 191, 36, 0.2)',
                }}
              >
                {t('onboarding.welcome.whatIf')}
                <br />
                {t('onboarding.welcome.couldChange')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-stone-400 light:text-stone-600 text-lg sm:text-xl leading-relaxed"
              >
                {t('onboarding.welcome.ancientWisdom')}
              </motion.p>
            </motion.div>

            {/* The method - three pillars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="py-10 border-t border-b border-stone-800/50 light:border-stone-300/50"
            >
              <div className={`flex justify-center gap-12 sm:gap-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {[
                  { icon: BookOpen, label: t('onboarding.welcome.learn'), color: 'text-purple-400' },
                  { icon: Target, label: t('onboarding.welcome.practice'), color: 'text-amber-400' },
                  { icon: Sparkles, label: t('onboarding.welcome.transform'), color: 'text-emerald-400' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.15 }}
                  >
                    <motion.div
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-stone-900/60 light:bg-stone-200/60 border border-stone-800/80 flex items-center justify-center"
                      whileHover={{ scale: 1.1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
                    >
                      <item.icon size={28} className={item.color} />
                    </motion.div>
                    <span className="text-base sm:text-lg text-stone-400 light:text-stone-600 font-semibold tracking-wide">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* The CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="pt-4"
            >
              <Button
                size="lg"
                glow
                data-testid="welcome-continue-btn"
                onClick={onNext}
                className={`w-full group ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Flame size={20} className={`${isRTL ? 'ml-2' : 'mr-2'} text-amber-300`} />
                {t('onboarding.welcome.readyToBegin')}
                <ChevronRight
                  size={18}
                  className={`${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} opacity-60 group-hover:opacity-100 transition-all`}
                />
              </Button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-5 text-xs text-stone-600 light:text-stone-500"
              >
                {t('onboarding.welcome.noAccount')}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WelcomeStep;
