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

// Coaching content for each step
const coachingContent: Record<CoachingStep, {
  icon: typeof Sparkles;
  iconColor: string;
  iconBg: string;
  title: string;
  message: string | ((name: string) => string);
  subMessage?: string;
  buttonText: string;
  celebration?: boolean;
}> = {
  beforeFirstLesson: {
    icon: BookOpen,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/20',
    title: 'Your First Lesson',
    message: (name: string) => `${name}, today thousands of people are learning this same wisdom alongside you.`,
    subMessage: 'Take your time. Let the words sink in. This is where transformation begins.',
    buttonText: 'Begin My Journey',
  },
  afterLessonBeforeEcho: {
    icon: Heart,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/20',
    title: 'The Power of Teaching',
    message: 'You\'ve learned something powerful. Now, deepen it by helping someone else.',
    subMessage: 'Responding to another\'s reflection isn\'t just connection - it\'s how wisdom becomes wisdom. When you teach, you truly understand.',
    buttonText: 'I\'m Ready to Connect',
  },
  afterEchoBeforeExercises: {
    icon: Dumbbell,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/20',
    title: 'Make It Real',
    message: 'Knowledge without practice is just information. Now it\'s time to apply today\'s wisdom to YOUR life.',
    subMessage: 'Five short exercises. Each one brings the lesson into your world, your challenges, your growth.',
    buttonText: 'Let\'s Practice',
  },
  afterFirstDayComplete: {
    icon: Trophy,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20',
    title: 'Day One Complete',
    message: (name: string) => `${name}, you did it. This is how transformation begins.`,
    subMessage: 'One day at a time. One lesson at a time. One choice at a time. Come back tomorrow - your next lesson will be waiting.',
    buttonText: 'I\'ll Be Back',
    celebration: true,
  },
};

export function CoachModal({ step, onDismiss, userName = 'Friend' }: CoachModalProps) {
  const [mounted, setMounted] = useState(false);
  const content = coachingContent[step];
  const Icon = content.icon;

  useEffect(() => {
    setMounted(true);
  }, []);

  const getMessage = () => {
    if (typeof content.message === 'function') {
      return content.message(userName);
    }
    return content.message;
  };

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
          className="relative z-10 w-full max-w-md"
        >
          {/* Glow effect for celebration */}
          {content.celebration && (
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
                className={`w-20 h-20 rounded-2xl ${content.iconBg} mx-auto mb-6 flex items-center justify-center`}
              >
                <Icon size={36} className={content.iconColor} />
              </motion.div>

              {/* Celebration sparkles */}
              {content.celebration && (
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
                {getMessage()}
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
                  glow={content.celebration}
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
                  content.celebration
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
