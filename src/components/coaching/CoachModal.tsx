'use client';

// ═══════════════════════════════════════════════════════════════════════════
// COACH MODAL - FIRST-SESSION GUIDANCE
// ═══════════════════════════════════════════════════════════════════════════
//
// Contextual coaching that appears ONLY during the user's first session.
// These are not intrusive tutorials - they're gentle, emotional nudges
// that help users understand the depth of each phase.
//
// Appears at key moments:
// 1. Before first lesson - sets the stage
// 2. After lesson, before echo - explains why echoing matters
// 3. After echo, before exercises - builds anticipation for practice
// 4. After first day complete - celebrates and reinforces the habit
//
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, BookOpen, Dumbbell, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';

export type CoachingStep =
  | 'beforeFirstLesson'
  | 'afterLessonBeforeEcho'
  | 'afterEchoBeforeExercises'
  | 'afterFirstDayComplete';

interface CoachModalProps {
  step: CoachingStep;
  onDismiss: () => void;
  userName?: string;
}

// Icon mapping (static, no translations needed)
const STEP_ICONS: Record<CoachingStep, {
  icon: typeof Sparkles;
  iconColor: string;
  iconBg: string;
  celebration?: boolean;
}> = {
  beforeFirstLesson: {
    icon: BookOpen,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/20',
  },
  afterLessonBeforeEcho: {
    icon: Heart,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/20',
  },
  afterEchoBeforeExercises: {
    icon: Dumbbell,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/20',
  },
  afterFirstDayComplete: {
    icon: Trophy,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20',
    celebration: true,
  },
};

export function CoachModal({ step, onDismiss, userName = 'Friend' }: CoachModalProps) {
  const [mounted, setMounted] = useState(false);
  const { t, isRTL } = useTranslation();

  const iconConfig = STEP_ICONS[step];
  const Icon = iconConfig.icon;

  // Get translated content for each step
  const getContent = () => {
    switch (step) {
      case 'beforeFirstLesson':
        return {
          title: t('coaching.beforeFirstLesson.title'),
          message: t('coaching.beforeFirstLesson.message').replace('{name}', userName),
          subMessage: t('coaching.beforeFirstLesson.subMessage'),
          buttonText: t('coaching.beforeFirstLesson.button'),
        };
      case 'afterLessonBeforeEcho':
        return {
          title: t('coaching.afterLessonBeforeEcho.title'),
          message: t('coaching.afterLessonBeforeEcho.message'),
          subMessage: t('coaching.afterLessonBeforeEcho.subMessage'),
          buttonText: t('coaching.afterLessonBeforeEcho.button'),
        };
      case 'afterEchoBeforeExercises':
        return {
          title: t('coaching.afterEchoBeforeExercises.title'),
          message: t('coaching.afterEchoBeforeExercises.message'),
          subMessage: t('coaching.afterEchoBeforeExercises.subMessage'),
          buttonText: t('coaching.afterEchoBeforeExercises.button'),
        };
      case 'afterFirstDayComplete':
        return {
          title: t('coaching.afterFirstDayComplete.title'),
          message: t('coaching.afterFirstDayComplete.message').replace('{name}', userName),
          subMessage: t('coaching.afterFirstDayComplete.subMessage'),
          buttonText: t('coaching.afterFirstDayComplete.button'),
        };
      default:
        return {
          title: '',
          message: '',
          subMessage: '',
          buttonText: '',
        };
    }
  };

  const content = getContent();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-stone-950/90 backdrop-blur-sm"
          onClick={onDismiss}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`relative z-10 w-full max-w-md ${isRTL ? 'rtl' : ''}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Glow effect for celebration */}
          {iconConfig.celebration && (
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(52, 211, 153, 0.2)',
                  '0 0 60px rgba(52, 211, 153, 0.4)',
                  '0 0 20px rgba(52, 211, 153, 0.2)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          <div className="relative bg-stone-900/95 border border-stone-800 rounded-3xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-300 transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="p-8 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                className={`w-20 h-20 rounded-2xl ${iconConfig.iconBg} mx-auto mb-6 flex items-center justify-center`}
              >
                <Icon size={36} className={iconConfig.iconColor} />
              </motion.div>

              {/* Celebration sparkles */}
              {iconConfig.celebration && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{
                        x: '50%',
                        y: '30%',
                        scale: 0,
                        opacity: 1,
                      }}
                      animate={{
                        x: `${20 + Math.random() * 60}%`,
                        y: `${10 + Math.random() * 40}%`,
                        scale: [0, 1, 0],
                        opacity: [1, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.3 + i * 0.1,
                        ease: 'easeOut',
                      }}
                    >
                      <Sparkles size={16} className="text-amber-400" />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-stone-100 mb-4"
              >
                {content.title}
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-stone-300 text-lg leading-relaxed mb-3"
              >
                {content.message}
              </motion.p>

              {/* Sub-message */}
              {content.subMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-stone-500 text-sm leading-relaxed mb-8"
                >
                  {content.subMessage}
                </motion.p>
              )}

              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  size="lg"
                  glow={iconConfig.celebration}
                  onClick={onDismiss}
                  className="w-full"
                >
                  {content.buttonText}
                </Button>
              </motion.div>
            </div>

            {/* Bottom decorative gradient */}
            <div
              className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              style={{
                background: `linear-gradient(to top, ${
                  iconConfig.celebration
                    ? 'rgba(52, 211, 153, 0.1)'
                    : 'rgba(251, 191, 36, 0.05)'
                }, transparent)`,
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CoachModal;
