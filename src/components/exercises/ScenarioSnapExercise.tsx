'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useHaptics } from '@/hooks/useHaptics';
import { useAudio } from '@/hooks/useAudio';
import type { ScenarioSnapContent } from '@/types/dailyPractice';
import { recordExercisePerformance } from '@/lib/adaptiveDifficulty';

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO SNAP EXERCISE
// Interactive branching story with trait tracking and cinematic transitions
// ═══════════════════════════════════════════════════════════════════════════

interface ScenarioSnapExerciseProps {
  title: string;
  content: ScenarioSnapContent;
  onComplete: () => void;
  onBack: () => void;
  isRTL?: boolean;
  t: (key: string) => string;
}

// Style presets
const stylePresets = {
  tense: { bg: 'from-red-500/5 to-orange-500/5', accent: 'text-rose-400' },
  awkward: { bg: 'from-amber-500/5 to-yellow-500/5', accent: 'text-amber-400' },
  empowering: { bg: 'from-emerald-500/5 to-teal-500/5', accent: 'text-emerald-400' },
  vulnerable: { bg: 'from-violet-500/5 to-purple-500/5', accent: 'text-violet-400' },
};
const defaultStyle = stylePresets.tense;

export function ScenarioSnapExercise({
  title,
  content,
  onComplete,
  onBack,
  isRTL = false,
  t,
}: ScenarioSnapExerciseProps) {
  const startTimeRef = useRef(Date.now());
  const [currentFrameId, setCurrentFrameId] = useState(content.frames[0]?.id || '');
  const [traits, setTraits] = useState<Record<string, number>>({});
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterDone, setTypewriterDone] = useState(false);
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const choiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const haptics = useHaptics();
  const audio = useAudio();

  const colors = stylePresets[content.style] || defaultStyle;
  const currentFrame = content.frames.find((f) => f.id === currentFrameId);
  const isEndFrame = currentFrame && currentFrame.choices.length === 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typewriterRef.current) clearTimeout(typewriterRef.current);
      if (choiceTimerRef.current) clearTimeout(choiceTimerRef.current);
    };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!currentFrame) return;
    setTypewriterText('');
    setTypewriterDone(false);
    setSelectedChoiceId(null);

    let charIndex = 0;
    const text = currentFrame.narrative;

    const typeNext = () => {
      if (charIndex < text.length) {
        setTypewriterText(text.substring(0, charIndex + 1));
        charIndex++;
        typewriterRef.current = setTimeout(typeNext, 22);
      } else {
        setTypewriterDone(true);
      }
    };

    typewriterRef.current = setTimeout(typeNext, 300);

    return () => {
      if (typewriterRef.current) clearTimeout(typewriterRef.current);
    };
  }, [currentFrameId, currentFrame]);

  // Skip typewriter on tap
  const skipTypewriter = useCallback(() => {
    if (!typewriterDone && currentFrame) {
      if (typewriterRef.current) clearTimeout(typewriterRef.current);
      setTypewriterText(currentFrame.narrative);
      setTypewriterDone(true);
    }
  }, [typewriterDone, currentFrame]);

  // Handle choice selection
  const handleChoice = useCallback(
    (choiceId: string, trait: string, nextFrameId?: string) => {
      setSelectedChoiceId(choiceId);
      haptics.haptic('medium');
      audio.playTap();

      // Track trait
      setTraits((prev) => ({ ...prev, [trait]: (prev[trait] || 0) + 1 }));

      // Advance after a brief delay
      choiceTimerRef.current = setTimeout(() => {
        if (nextFrameId) {
          setCurrentFrameId(nextFrameId);
        } else {
          // No next frame — treat as end, show outcome
          recordExercisePerformance({
            exerciseId: title,
            exerciseType: 'scenario-snap',
            completionTimeMs: Date.now() - startTimeRef.current,
            itemsCompleted: content.frames.length,
            totalItems: content.frames.length,
          });
          setShowOutcome(true);
          haptics.hapticSuccess();
          audio.playSuccess();
        }
      }, 600);
    },
    [haptics, audio, title, content.frames.length]
  );

  // Handle end frame — show outcome
  const handleShowOutcome = useCallback(() => {
    recordExercisePerformance({
      exerciseId: title,
      exerciseType: 'scenario-snap',
      completionTimeMs: Date.now() - startTimeRef.current,
      itemsCompleted: content.frames.length,
      totalItems: content.frames.length,
    });
    setShowOutcome(true);
    haptics.hapticSuccess();
    audio.playSuccess();
  }, [haptics, audio, title, content.frames.length]);

  // Calculate outcome
  const getOutcome = () => {
    for (const outcome of content.outcomes) {
      const match = outcome.traitPattern.match(/(\S+?)>=(\d+)/);
      if (match) {
        const [, trait, threshold] = match;
        if ((traits[trait] || 0) >= parseInt(threshold)) {
          return outcome;
        }
      }
    }
    return content.outcomes[content.outcomes.length - 1];
  };

  // Outcome screen
  if (showOutcome) {
    const outcome = getOutcome();
    return (
      <motion.div
        className="min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-7xl mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
        >
          {outcome.emoji}
        </motion.div>

        <motion.h2
          className="text-2xl font-bold text-stone-100 light:text-stone-900 mb-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {outcome.title}
        </motion.h2>

        <motion.p
          className="text-stone-300 light:text-stone-700 text-center max-w-sm mb-5 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {outcome.insight}
        </motion.p>

        <motion.p
          className="text-amber-400/80 text-center text-sm max-w-sm mb-10 italic leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {outcome.wisdomNudge}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full max-w-sm"
        >
          <Button
            onClick={onComplete}
            variant="primary"
            className="w-full"
            sound="celebrate"
          >
            {t('exercises.continue')}
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Broken frame chain — graceful error
  if (!currentFrame) {
    return (
      <motion.div
        className="min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-stone-400 light:text-stone-600 mb-6">{t('exercises.somethingWentWrong')}</p>
        <Button onClick={onBack} variant="primary" className="w-full max-w-sm">
          {t('exercises.back')}
        </Button>
      </motion.div>
    );
  }

  // Slide direction based on RTL
  const slideIn = isRTL ? -40 : 40;
  const slideOut = isRTL ? 40 : -40;

  // Frame view
  return (
    <motion.div
      className={`min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 text-stone-500 light:text-stone-600 hover:text-stone-300 light:hover:text-stone-900 transition-colors text-sm mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          aria-label={t('exercises.back')}
        >
          {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {t('exercises.back')}
        </button>

        <p className={`text-stone-500 light:text-stone-600 text-xs uppercase tracking-wider ${colors.accent}`}>
          {content.title || title}
        </p>
      </div>

      {/* Frame content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-16" onClick={skipTypewriter}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFrameId}
            initial={{ opacity: 0, x: slideIn }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideOut }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* Emoji */}
            <motion.div
              className="text-5xl mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', bounce: 0.4 }}
            >
              {currentFrame.emoji}
            </motion.div>

            {/* Narrative with typewriter */}
            <div className={`max-w-sm bg-gradient-to-br ${colors.bg} rounded-2xl p-6 border border-stone-800/50 light:border-stone-200/50 mb-8`}>
              <p className="text-stone-200 light:text-stone-800 leading-relaxed text-[15px]">
                {typewriterText}
                {!typewriterDone && (
                  <motion.span
                    className="inline-block w-0.5 h-4 bg-stone-400 ms-0.5 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </p>
            </div>

            {/* Choices or end */}
            {typewriterDone && (
              <motion.div
                className="w-full max-w-sm space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isEndFrame ? (
                  <Button
                    onClick={handleShowOutcome}
                    variant="primary"
                    className="w-full"
                    sound="tapConfirm"
                  >
                    {t('exercises.seeResults')}
                  </Button>
                ) : (
                  currentFrame.choices.map((choice, idx) => (
                    <motion.button
                      key={choice.id}
                      onClick={() =>
                        handleChoice(choice.id, choice.trait, choice.nextFrameId)
                      }
                      disabled={selectedChoiceId !== null}
                      className={`w-full p-4 rounded-xl border transition-all ${
                        selectedChoiceId === choice.id
                          ? 'bg-amber-500/15 border-amber-500/40 scale-[1.02]'
                          : selectedChoiceId !== null
                          ? 'opacity-20 border-stone-800 light:border-stone-200'
                          : 'bg-stone-900/50 light:bg-stone-200/50 border-stone-800 light:border-stone-200 hover:border-stone-600 light:hover:border-stone-400 active:scale-[0.98]'
                      } ${isRTL ? 'text-right' : 'text-left'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <span className="text-stone-200 light:text-stone-800 text-sm leading-relaxed">
                        {choice.text}
                      </span>
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default ScenarioSnapExercise;
