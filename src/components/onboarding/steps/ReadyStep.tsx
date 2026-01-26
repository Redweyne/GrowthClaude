'use client';

// ═══════════════════════════════════════════════════════════════════════════
// READY STEP - THE BEGINNING
// ═══════════════════════════════════════════════════════════════════════════
//
// This is not a summary screen. This is the threshold crossing.
// The moment before everything changes. The first step into a new life.
//
// The atmosphere builds. The commitment solidifies.
// When they press that final button, they're not just starting an app.
// They're making a promise to themselves.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, Flame, Star, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TRANSFORMATION_GOALS } from '@/types';
import { Button } from '@/components/ui';
import { Confetti } from '@/components/effects';
import { useAudio } from '@/hooks/useAudio';

interface ReadyStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ReadyStep({ onNext, onBack }: ReadyStepProps) {
  const { name, transformationGoal, dailyCommitmentMinutes } = useStore();
  const [phase, setPhase] = useState<'summary' | 'mentor' | 'ready'>('summary');
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { playCelebrate } = useAudio();

  const selectedGoal = TRANSFORMATION_GOALS.find((g) => g.id === transformationGoal);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Progress through phases
  useEffect(() => {
    if (!mounted) return;
    const timer1 = setTimeout(() => setPhase('mentor'), 3500);
    const timer2 = setTimeout(() => {
      setPhase('ready');
      // Trigger confetti and celebration sound on ready phase
      setTimeout(() => {
        setShowConfetti(true);
        playCelebrate(); // Play celebration sound when page appears
      }, 300);
    }, 7500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [mounted, playCelebrate]);

  if (!mounted) {
    return <div className="min-h-[70vh]" />;
  }

  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Confetti celebration */}
      <Confetti
        active={showConfetti}
        particleCount={60}
        duration={4000}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Back button - only in summary phase */}
      {phase === 'summary' && (
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center text-stone-500 hover:text-stone-300 transition-colors mb-6 self-start group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </motion.button>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* ─────────────────────────────────────────────────────────────────
              Phase 1: Summary - What they've committed to
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="text-center w-full max-w-md"
            >
              {/* Their chosen path */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                {/* Goal icon with glow */}
                <motion.div
                  className="relative w-24 h-24 mx-auto mb-6"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                    }}
                  />
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center">
                    <span className="text-5xl">{selectedGoal?.icon}</span>
                  </div>
                </motion.div>

                <p className="text-2xl text-amber-100 font-light mb-2">
                  {name}, you&apos;ve chosen to
                </p>
                <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                  {selectedGoal?.title}
                </p>
              </motion.div>

              {/* The commitment summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="py-5 px-6 rounded-2xl bg-stone-900/50 border border-stone-800/80"
              >
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" />
                    <span className="text-amber-200">{dailyCommitmentMinutes} min</span>
                    <span className="text-stone-500">daily</span>
                  </div>
                  <div className="w-px h-4 bg-stone-800" />
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-purple-400" />
                    <span className="text-stone-400">Stoic wisdom</span>
                  </div>
                </div>
              </motion.div>

              {/* Progress indicator */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3.5, ease: 'linear' }}
                className="h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500 mt-10 rounded-full"
                style={{
                  boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
                }}
              />
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              Phase 2: Meet the Mentor
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'mentor' && (
            <motion.div
              key="mentor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="text-center w-full max-w-md"
            >
              {/* Sage avatar with mystical glow */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="relative w-24 h-24 mx-auto mb-8"
              >
                {/* Outer glow rings */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(167, 139, 250, 0.2), 0 0 60px rgba(167, 139, 250, 0.1)',
                      '0 0 40px rgba(167, 139, 250, 0.3), 0 0 80px rgba(167, 139, 250, 0.15)',
                      '0 0 30px rgba(167, 139, 250, 0.2), 0 0 60px rgba(167, 139, 250, 0.1)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Avatar container */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-500/30 to-stone-900 border border-purple-500/40 flex items-center justify-center overflow-hidden">
                  {/* Subtle shimmer */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      background: [
                        'linear-gradient(135deg, transparent 0%, rgba(167, 139, 250, 0.1) 50%, transparent 100%)',
                        'linear-gradient(135deg, transparent 0%, rgba(167, 139, 250, 0.1) 50%, transparent 100%)',
                      ],
                      backgroundPosition: ['-100% -100%', '200% 200%'],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{ backgroundSize: '200% 200%' }}
                  />
                  <span className="text-4xl relative z-10">🧙</span>
                </div>
              </motion.div>

              {/* Mentor introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-2xl text-amber-100 font-light mb-4">
                  You won&apos;t walk this path alone.
                </p>
                <p className="text-stone-400 leading-relaxed">
                  A mentor will guide you—responding to your reflections
                  <br />
                  with wisdom tailored to your journey.
                </p>
              </motion.div>

              {/* Progress indicator */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className="h-1 bg-gradient-to-r from-purple-500 via-amber-500 to-purple-500 mt-10 rounded-full"
                style={{
                  boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)',
                }}
              />
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              Phase 3: Ready - The epic moment
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center w-full max-w-md"
            >
              {/* The triumphant icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="relative w-28 h-28 mx-auto mb-8"
              >
                {/* Radiating glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 40px rgba(251, 191, 36, 0.3), 0 0 80px rgba(251, 191, 36, 0.15)',
                      '0 0 60px rgba(251, 191, 36, 0.4), 0 0 100px rgba(251, 191, 36, 0.2)',
                      '0 0 40px rgba(251, 191, 36, 0.3), 0 0 80px rgba(251, 191, 36, 0.15)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Spinning ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />

                {/* Main container */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-500/30 to-stone-900 border-2 border-amber-500/50 flex items-center justify-center">
                  <Sparkles size={48} className="text-amber-400" />
                </div>

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-amber-400"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [0, Math.cos((i / 6) * Math.PI * 2) * 60],
                      y: [0, Math.sin((i / 6) * Math.PI * 2) * 60],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </motion.div>

              {/* The message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 font-light mb-4">
                  {name}, you&apos;re ready.
                </p>
                <p className="text-stone-400 text-lg mb-10">
                  Your first lesson awaits.
                </p>
              </motion.div>

              {/* The final CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  size="lg"
                  glow
                  onClick={onNext}
                  sound="tapConfirm"
                  className="w-full group text-lg py-5"
                >
                  <Flame size={22} className="mr-3 text-amber-300" />
                  Begin My Journey
                </Button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-xs text-stone-600 mt-6 italic"
                >
                  &ldquo;The person you become is shaped by what you do every day.&rdquo;
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ReadyStep;
