'use client';

// ═══════════════════════════════════════════════════════════════════════════
// SCALE RATING STEP - QUICK PERSONAL RATING
// ═══════════════════════════════════════════════════════════════════════════
//
// Replaces some commitment/reflection writing in the engagement path.
// A visual scale where users rate something - quick but personally honest.
// Tapping a value forces emotional self-assessment without typing.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button, WisdomText } from '@/components/ui';
import { useAudio } from '@/hooks/useAudio';
import type { ScaleRatingStep as ScaleRatingStepType } from '@/types/lessons';

interface ScaleRatingStepProps {
  step: ScaleRatingStepType;
  onComplete: (value: number) => void;
}

export function ScaleRatingStep({ step, onComplete }: ScaleRatingStepProps) {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [showScale, setShowScale] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mountedRef = useRef(true);

  const { playTapConfirm, playSuccess } = useAudio();

  const scaleSteps = step.steps || 5;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const handlePromptComplete = useCallback(() => {
    setShowScale(true);
  }, []);

  const handleSelect = useCallback((value: number) => {
    if (isSubmitting) return;
    setSelectedValue(value);
    playTapConfirm();

    // Show contextual response if defined
    if (step.responsesByRange) {
      const third = Math.ceil(scaleSteps / 3);
      if (value <= third) {
        setResponseText(step.responsesByRange.low);
      } else if (value <= third * 2) {
        setResponseText(step.responsesByRange.mid);
      } else {
        setResponseText(step.responsesByRange.high);
      }
    }
  }, [isSubmitting, scaleSteps, step.responsesByRange, playTapConfirm]);

  const handleContinue = useCallback(() => {
    if (selectedValue === null || isSubmitting) return;
    setIsSubmitting(true);
    playSuccess();
    setTimeout(() => {
      if (mountedRef.current) {
        onComplete(selectedValue);
      }
    }, 300);
  }, [selectedValue, isSubmitting, playSuccess, onComplete]);

  // Visual position of selected value for the glow bar
  const fillPercent = selectedValue !== null
    ? ((selectedValue - 1) / (scaleSteps - 1)) * 100
    : 0;

  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center px-4 py-8">
      {/* Atmospheric glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(251, 191, 36, 0.18) 0%, transparent 50%)',
        }}
      />

      <motion.div
        className="max-w-lg w-full relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="space-y-8">
          {/* Prompt */}
          <div className="text-center">
            <WisdomText
              variant="dramatic"
              animate={true}
              speed="fast"
              className="text-center"
              onComplete={handlePromptComplete}
            >
              {step.prompt}
            </WisdomText>
          </div>

          {/* Scale */}
          {showScale && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Scale track with fill */}
              <div className="relative px-2">
                <div className="h-2 bg-stone-800 light:bg-stone-200 rounded-full overflow-hidden">
                  {selectedValue !== null && (
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${fillPercent}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{ boxShadow: '0 0 10px rgba(251, 191, 36, 0.4)' }}
                    />
                  )}
                </div>
              </div>

              {/* Scale points */}
              <div className="flex justify-between px-1">
                {Array.from({ length: scaleSteps }, (_, i) => {
                  const value = i + 1;
                  const isActive = selectedValue === value;
                  return (
                    <motion.button
                      key={value}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      onClick={() => handleSelect(value)}
                      disabled={isSubmitting}
                      className={`
                        w-14 h-14 rounded-full flex items-center justify-center
                        text-lg font-semibold transition-all duration-200
                        active:scale-90
                        ${isActive
                          ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30 scale-110'
                          : selectedValue !== null && value <= selectedValue
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-500/30'
                          : 'bg-stone-800/80 text-stone-400 light:text-stone-600 border border-stone-700/50 hover:border-stone-600'
                        }
                      `}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {value}
                    </motion.button>
                  );
                })}
              </div>

              {/* Labels */}
              <div className="flex justify-between px-1">
                <span className="text-xs text-stone-500 light:text-stone-600 max-w-[80px]">{step.lowLabel}</span>
                <span className="text-xs text-stone-500 light:text-stone-600 max-w-[80px] text-right">{step.highLabel}</span>
              </div>
            </motion.div>
          )}

          {/* Contextual response */}
          <AnimatePresence mode="wait">
            {responseText && (
              <motion.div
                key={responseText}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="font-serif text-lg text-amber-300/90 leading-relaxed italic">
                  {responseText}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue button */}
          <AnimatePresence>
            {selectedValue !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="pt-2"
              >
                <Button
                  size="lg"
                  onClick={handleContinue}
                  disabled={isSubmitting}
                  glow
                  className="w-full group"
                >
                  Continue
                  <ChevronRight
                    size={18}
                    className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                  />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default ScaleRatingStep;
