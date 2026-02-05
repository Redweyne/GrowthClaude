'use client';

// ═══════════════════════════════════════════════════════════════════════════
// TRUTH MIRROR EXERCISE
// ═══════════════════════════════════════════════════════════════════════════
//
// Tap through truths until one stops you.
// When a statement resonates deeply, hold it.
// The hold becomes your truth for today.
// Then breathe it in through guided exhales.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAudio } from '@/hooks/useAudio';
import type { TruthMirrorContent } from '@/types/dailyPractice';

type Phase = 'tapping' | 'held' | 'breathing' | 'complete';

interface TruthMirrorExerciseProps {
  title: string;
  content: TruthMirrorContent;
  onComplete: () => void;
  onBack?: () => void;
  isRTL?: boolean;
  t?: (key: string) => string;
}

const STYLE_CONFIG = {
  release: {
    glow: 'rgba(99, 102, 241, 0.15)',
    accent: 'text-indigo-400',
    accentBg: 'bg-indigo-500/20',
    border: 'border-indigo-500/30',
    gradient: 'from-indigo-500/20 via-purple-500/10 to-stone-950',
    breathCircle: 'border-indigo-500/40',
    breathFill: 'bg-indigo-500/20',
  },
  strength: {
    glow: 'rgba(244, 63, 94, 0.12)',
    accent: 'text-rose-400',
    accentBg: 'bg-rose-500/20',
    border: 'border-rose-500/30',
    gradient: 'from-rose-500/15 via-orange-500/10 to-stone-950',
    breathCircle: 'border-rose-500/40',
    breathFill: 'bg-rose-500/20',
  },
  gratitude: {
    glow: 'rgba(251, 191, 36, 0.15)',
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    gradient: 'from-amber-500/20 via-orange-500/10 to-stone-950',
    breathCircle: 'border-amber-500/40',
    breathFill: 'bg-amber-500/20',
  },
  clarity: {
    glow: 'rgba(16, 185, 129, 0.12)',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-stone-950',
    breathCircle: 'border-emerald-500/40',
    breathFill: 'bg-emerald-500/20',
  },
};

const HOLD_DURATION = 800; // ms to hold for selection
const BREATH_CYCLE_DURATION = 8000; // 4s inhale + 4s exhale

export function TruthMirrorExercise({
  title,
  content,
  onComplete,
  onBack,
  isRTL = false,
  t = (key: string) => key,
}: TruthMirrorExerciseProps) {
  const [phase, setPhase] = useState<Phase>('tapping');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTruth, setSelectedTruth] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [isInhaling, setIsInhaling] = useState(true);
  const [currentExhalePrompt, setCurrentExhalePrompt] = useState('');

  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number | null>(null);
  const breathIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const { playChime, playReveal, playSuccess } = useAudio();

  const config = STYLE_CONFIG[content.style];
  const totalBreaths = content.breathPrompts.length;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, []);

  // Handle tap to advance
  const handleTap = useCallback(() => {
    if (phase !== 'tapping') return;
    if (currentIndex < content.statements.length - 1) {
      setCurrentIndex(prev => prev + 1);
      playChime();
    }
  }, [phase, currentIndex, content.statements.length, playChime]);

  // Handle hold start
  const handleHoldStart = useCallback(() => {
    if (phase !== 'tapping') return;

    holdStartRef.current = Date.now();
    setHoldProgress(0);

    holdTimerRef.current = setInterval(() => {
      if (!holdStartRef.current || !mountedRef.current) return;

      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(elapsed / HOLD_DURATION, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        // Hold complete - select this truth
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        setSelectedTruth(content.statements[currentIndex]);
        setPhase('held');
        playReveal();
      }
    }, 16);
  }, [phase, currentIndex, content.statements, playReveal]);

  // Handle hold end
  const handleHoldEnd = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    holdStartRef.current = null;
    setHoldProgress(0);
  }, []);

  // Start breathing phase
  const handleStartBreathing = useCallback(() => {
    setPhase('breathing');
    setBreathCount(0);
    setIsInhaling(true);
    setCurrentExhalePrompt('');

    let currentBreath = 0;

    const runBreathCycle = () => {
      if (!mountedRef.current) return;

      // Inhale phase
      setIsInhaling(true);
      setCurrentExhalePrompt('');

      // After 4s, switch to exhale
      setTimeout(() => {
        if (!mountedRef.current) return;
        setIsInhaling(false);
        setCurrentExhalePrompt(content.breathPrompts[currentBreath] || '');
      }, 4000);

      // After full cycle (8s), advance or complete
      setTimeout(() => {
        if (!mountedRef.current) return;
        currentBreath++;
        setBreathCount(currentBreath);

        if (currentBreath >= totalBreaths) {
          if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
          setPhase('complete');
          playSuccess();
        }
      }, BREATH_CYCLE_DURATION);
    };

    // Start first cycle immediately
    runBreathCycle();

    // Set up interval for subsequent cycles
    breathIntervalRef.current = setInterval(runBreathCycle, BREATH_CYCLE_DURATION);
  }, [content.breathPrompts, totalBreaths, playSuccess]);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <motion.div
      className={`min-h-screen bg-stone-950 flex flex-col ${isRTL ? 'rtl' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Atmospheric glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          opacity: phase === 'held' || phase === 'breathing' ? 1.2 : 0.8,
        }}
        transition={{ duration: 0.5 }}
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 30%, ${config.glow} 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 30% 70%, ${config.glow} 0%, transparent 40%)
          `,
        }}
      />

      {/* Header */}
      <div className="px-6 pt-6 pb-4 relative z-10">
        {onBack && phase === 'tapping' && (
          <button
            onClick={onBack}
            className={`flex items-center gap-1 text-stone-500 hover:text-stone-300 transition-colors text-sm mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {t('exercises.back')}
          </button>
        )}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`w-10 h-10 rounded-xl ${config.accentBg} flex items-center justify-center`}>
            <span className="text-xl">💫</span>
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-stone-500 text-xs uppercase tracking-wider">Truth Mirror</p>
            <h1 className="text-xl font-semibold text-stone-100">{title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {/* TAPPING PHASE */}
          {phase === 'tapping' && (
            <motion.div
              key="tapping"
              className="w-full max-w-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Progress indicator */}
              <div className="flex justify-center gap-1.5 mb-8">
                {content.statements.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i < currentIndex
                        ? `w-3 ${config.accent.replace('text-', 'bg-')}`
                        : i === currentIndex
                        ? `w-4 ${config.accent.replace('text-', 'bg-')}`
                        : 'w-1.5 bg-stone-700'
                    }`}
                  />
                ))}
              </div>

              {/* Current statement - tap area */}
              <motion.div
                className="min-h-[200px] flex flex-col items-center justify-center cursor-pointer select-none"
                onClick={handleTap}
                onMouseDown={handleHoldStart}
                onMouseUp={handleHoldEnd}
                onMouseLeave={handleHoldEnd}
                onTouchStart={handleHoldStart}
                onTouchEnd={handleHoldEnd}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <motion.p
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl sm:text-2xl text-stone-200 leading-relaxed px-4"
                >
                  {content.statements[currentIndex]}
                </motion.p>

                {/* Hold progress ring */}
                {holdProgress > 0 && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <svg className="w-64 h-64" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-stone-800"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className={config.accent}
                        strokeDasharray={`${holdProgress * 283} 283`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>

              {/* Instructions */}
              <motion.p
                className="text-xs text-stone-500 mt-6 tracking-wider"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                TAP TO CONTINUE • HOLD WHEN IT RESONATES
              </motion.p>
            </motion.div>
          )}

          {/* HELD PHASE - Truth selected */}
          {phase === 'held' && selectedTruth && (
            <motion.div
              key="held"
              className="w-full max-w-md text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <motion.div
                className="text-5xl mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                ✨
              </motion.div>

              <motion.p
                className="text-2xl sm:text-3xl text-stone-100 leading-relaxed mb-6 px-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {selectedTruth}
              </motion.p>

              <motion.p
                className={`text-lg ${config.accent} mb-8 italic`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {content.holdReveal}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={handleStartBreathing}
                  variant="primary"
                  className="w-full"
                  sound="tap"
                >
                  Breathe It In
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* BREATHING PHASE */}
          {phase === 'breathing' && (
            <motion.div
              key="breathing"
              className="w-full max-w-md text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Breath counter */}
              <div className="mb-6">
                <span className="text-stone-500 text-sm">
                  Breath {Math.min(breathCount + 1, totalBreaths)} of {totalBreaths}
                </span>
              </div>

              {/* Breathing circle */}
              <div className="relative flex items-center justify-center mb-8">
                <motion.div
                  className={`w-48 h-48 rounded-full border-4 ${config.breathCircle}`}
                  animate={{
                    scale: isInhaling ? [1, 1.3] : [1.3, 1],
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                />

                {/* Inner circle with prompt */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: isInhaling ? [0.8, 1] : [1, 0.8],
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                >
                  <div className={`w-36 h-36 rounded-full ${config.breathFill} flex items-center justify-center p-4`}>
                    <AnimatePresence mode="wait">
                      {currentExhalePrompt && (
                        <motion.p
                          key={currentExhalePrompt}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className={`${config.accent} text-sm text-center font-medium leading-snug`}
                        >
                          {currentExhalePrompt}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Breathing instruction */}
              <motion.p
                className="text-2xl font-light text-stone-100 mb-4"
                key={isInhaling ? 'inhale' : 'exhale'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {isInhaling ? 'Breathe In...' : 'Release...'}
              </motion.p>

              {/* Selected truth reminder */}
              <p className="text-stone-500 text-sm px-8 italic">
                &ldquo;{selectedTruth}&rdquo;
              </p>
            </motion.div>
          )}

          {/* COMPLETE PHASE */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              className="w-full max-w-md text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="text-6xl mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                🌟
              </motion.div>

              <h2 className="text-2xl font-semibold text-stone-100 mb-4">
                Your Truth Is Set
              </h2>

              <div className={`${config.accentBg} ${config.border} border rounded-2xl p-6 mb-6`}>
                <p className="text-stone-200 text-lg italic">
                  &ldquo;{selectedTruth}&rdquo;
                </p>
              </div>

              <p className="text-stone-400 mb-8 text-sm">
                Carry this with you today. Let it guide your choices.
              </p>

              <Button onClick={handleComplete} variant="primary" className="w-full" sound="success">
                Complete
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default TruthMirrorExercise;
