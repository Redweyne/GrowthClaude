'use client';

// ═══════════════════════════════════════════════════════════════════════════
// PATH STEP - THE REVELATION
// ═══════════════════════════════════════════════════════════════════════════
//
// This is where users understand HOW transformation happens.
// Not abstract promises. Concrete steps. Visual clarity.
//
// The three-phase loop is revealed with beautiful animations:
// Learn → Echo → Practice
//
// This creates anticipation for what's to come and sets clear expectations.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Heart, Dumbbell, ChevronRight, ChevronLeft, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui';

interface PathStepProps {
  onNext: () => void;
  onBack: () => void;
}

// Spring configurations for smooth animations
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 20 },
};

// Phase data for the three-step loop
const phases = [
  {
    number: 1,
    title: 'The Lesson',
    subtitle: 'Ancient wisdom made real',
    description: 'Each day, learn a powerful principle that can transform how you see the world.',
    duration: '~3 min',
    icon: BookOpen,
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'rgba(168, 85, 247, 0.4)',
  },
  {
    number: 2,
    title: 'The Echo',
    subtitle: 'Teach what you learn',
    description: 'Respond to another traveler\'s reflection. Teaching deepens your own understanding.',
    duration: '~1 min',
    icon: Heart,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'rgba(244, 63, 94, 0.4)',
  },
  {
    number: 3,
    title: 'The Practice',
    subtitle: 'Apply it to your life',
    description: 'Five exercises to make today\'s wisdom real. This is where transformation happens.',
    duration: '~3 min',
    icon: Dumbbell,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(251, 191, 36, 0.4)',
  },
];

export function PathStep({ onNext, onBack }: PathStepProps) {
  const [mounted, setMounted] = useState(false);
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [showCommunity, setShowCommunity] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Animate through phases
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setActivePhase(0), 800));
    timers.push(setTimeout(() => setActivePhase(1), 1600));
    timers.push(setTimeout(() => setActivePhase(2), 2400));
    timers.push(setTimeout(() => setShowCommunity(true), 3200));

    return () => timers.forEach(clearTimeout);
  }, []);

  if (!mounted) {
    return <div className="min-h-[70vh]" />;
  }

  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center text-stone-500 hover:text-stone-300 transition-colors mb-6 self-start"
      >
        <ChevronLeft size={20} />
        <span className="text-sm">Back</span>
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <motion.p
          className="text-stone-500 text-sm uppercase tracking-[0.2em] mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Here&apos;s How It Works
        </motion.p>
        <motion.h2
          className="text-2xl sm:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Your Daily Path
        </motion.h2>
      </motion.div>

      {/* The Three Phases - Vertical Flow */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="relative">
          {/* Connecting Line */}
          <motion.div
            className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-500/50 via-rose-500/50 to-amber-500/50"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
          />

          {/* Phase Cards */}
          <div className="space-y-4">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isActive = activePhase !== null && activePhase >= index;
              const isHighlighted = activePhase === index;

              return (
                <motion.div
                  key={phase.number}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{
                    opacity: isActive ? 1 : 0.3,
                    x: 0,
                    scale: isHighlighted ? 1.02 : 1,
                  }}
                  transition={{
                    delay: 0.5 + index * 0.3,
                    duration: 0.5,
                    scale: { duration: 0.3 }
                  }}
                  className="relative flex items-start gap-4"
                >
                  {/* Phase Icon */}
                  <motion.div
                    className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? `bg-gradient-to-br ${phase.gradient}`
                        : 'bg-stone-800/50 border border-stone-700/50'
                    }`}
                    animate={isHighlighted ? {
                      boxShadow: [
                        `0 0 0px ${phase.glow}`,
                        `0 0 30px ${phase.glow}`,
                        `0 0 0px ${phase.glow}`,
                      ],
                    } : {}}
                    transition={{ duration: 2, repeat: isHighlighted ? Infinity : 0 }}
                  >
                    <Icon
                      size={24}
                      className={isActive ? 'text-white' : 'text-stone-600'}
                    />

                    {/* Phase number badge */}
                    <motion.div
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive
                          ? 'bg-stone-950 text-white border-2 border-stone-800'
                          : 'bg-stone-800 text-stone-600'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: isActive ? 1 : 0.8 }}
                      transition={{ delay: 0.6 + index * 0.3, type: 'spring', bounce: 0.5 }}
                    >
                      {phase.number}
                    </motion.div>
                  </motion.div>

                  {/* Phase Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold transition-colors duration-500 ${
                        isActive ? 'text-stone-100' : 'text-stone-600'
                      }`}>
                        {phase.title}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full transition-all duration-500 ${
                        isActive
                          ? 'bg-stone-800 text-stone-400'
                          : 'bg-stone-900 text-stone-700'
                      }`}>
                        {phase.duration}
                      </span>
                    </div>
                    <p className={`text-sm transition-colors duration-500 ${
                      isActive ? 'text-stone-400' : 'text-stone-700'
                    }`}>
                      {phase.subtitle}
                    </p>

                    {/* Expanded description on highlight */}
                    <AnimatePresence>
                      {isHighlighted && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-xs text-stone-500 mt-2 leading-relaxed"
                        >
                          {phase.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Community Message */}
        <AnimatePresence>
          {showCommunity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Users size={16} className="text-amber-400" />
                </div>
                <p className="text-stone-300 font-medium">Same lesson. Same day. Together.</p>
              </div>
              <p className="text-stone-500 text-sm pl-11">
                Everyone learns the same wisdom on the same day. You&apos;re never alone on this journey.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Total time */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="text-center my-6"
      >
        <p className="text-stone-500 text-sm">
          Total: <span className="text-amber-400 font-medium">~7 minutes</span> of intentional growth, every day
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.8, duration: 0.5 }}
      >
        <Button
          size="lg"
          glow
          onClick={onNext}
          className="w-full group"
        >
          <Sparkles size={18} className="mr-2 text-amber-300" />
          I understand the path
          <ChevronRight
            size={18}
            className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
          />
        </Button>
      </motion.div>
    </div>
  );
}

export default PathStep;
