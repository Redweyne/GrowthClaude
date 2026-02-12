'use client';

// ═══════════════════════════════════════════════════════════════════════════
// SOUL COMPASS EXERCISE
// ═══════════════════════════════════════════════════════════════════════════
//
// Where does this land in your life?
// Multi-select what resonates, then gauge intensity.
// No writing - just honest selection.
// Your pattern reveals your truth.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAudio } from '@/hooks/useAudio';
import type { SoulCompassContent } from '@/types/dailyPractice';

type Phase = 'selecting' | 'intensity' | 'followup' | 'response' | 'complete';

interface SoulCompassExerciseProps {
  title: string;
  content: SoulCompassContent;
  onComplete: () => void;
  onBack?: () => void;
  isRTL?: boolean;
  t?: (key: string) => string;
}

const STYLE_CONFIG = {
  introspective: {
    glow: 'rgba(99, 102, 241, 0.12)',
    accent: 'text-indigo-400',
    accentBg: 'bg-indigo-500/15',
    border: 'border-indigo-500/40',
    selectedBg: 'bg-indigo-500/20',
    sliderTrack: 'bg-indigo-500/30',
    sliderFill: 'from-indigo-600 to-indigo-400',
    sliderThumb: 'bg-indigo-500',
  },
  energizing: {
    glow: 'rgba(244, 63, 94, 0.10)',
    accent: 'text-rose-400',
    accentBg: 'bg-rose-500/15',
    border: 'border-rose-500/40',
    selectedBg: 'bg-rose-500/20',
    sliderTrack: 'bg-rose-500/30',
    sliderFill: 'from-rose-600 to-rose-400',
    sliderThumb: 'bg-rose-500',
  },
  grounding: {
    glow: 'rgba(16, 185, 129, 0.12)',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    selectedBg: 'bg-emerald-500/20',
    sliderTrack: 'bg-emerald-500/30',
    sliderFill: 'from-emerald-600 to-emerald-400',
    sliderThumb: 'bg-emerald-500',
  },
  awakening: {
    glow: 'rgba(251, 191, 36, 0.15)',
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    selectedBg: 'bg-amber-500/20',
    sliderTrack: 'bg-amber-500/30',
    sliderFill: 'from-amber-600 to-amber-400',
    sliderThumb: 'bg-amber-500',
  },
};

export function SoulCompassExercise({
  title,
  content,
  onComplete,
  onBack,
  isRTL = false,
  t = (key: string) => key,
}: SoulCompassExerciseProps) {
  const [phase, setPhase] = useState<Phase>('selecting');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [intensity, setIntensity] = useState(3);
  const [followUpSelected, setFollowUpSelected] = useState<Set<string>>(new Set());
  const [responseText, setResponseText] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const mountedRef = useRef(true);
  const { playTapConfirm, playSuccess, playReveal } = useAudio();

  const config = STYLE_CONFIG[content.style];
  const minSelections = content.minSelections ?? 1;
  const maxSelections = content.maxSelections ?? content.options.length;
  const canContinue = selected.size >= minSelections;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Stagger option reveal
  useEffect(() => {
    const timer = setTimeout(() => setShowOptions(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= maxSelections) return prev;
        next.add(id);
      }
      return next;
    });
    playTapConfirm();
  }, [maxSelections, playTapConfirm]);

  const handleContinueFromSelection = useCallback(() => {
    if (!canContinue) return;
    playReveal();

    if (content.showIntensity) {
      setPhase('intensity');
    } else if (content.followUpOptions && content.followUpOptions.length > 0) {
      setPhase('followup');
    } else {
      setPhase('complete');
    }
  }, [canContinue, content.showIntensity, content.followUpOptions, playReveal]);

  const handleIntensityChange = useCallback((value: number) => {
    setIntensity(value);
    playTapConfirm();

    // Show contextual response
    if (content.intensityResponses) {
      if (value <= 2) {
        setResponseText(content.intensityResponses.low);
      } else if (value <= 3) {
        setResponseText(content.intensityResponses.mid);
      } else {
        setResponseText(content.intensityResponses.high);
      }
    }
  }, [content.intensityResponses, playTapConfirm]);

  const handleContinueFromIntensity = useCallback(() => {
    playReveal();
    if (content.followUpOptions && content.followUpOptions.length > 0) {
      setPhase('followup');
    } else if (responseText) {
      setPhase('response');
    } else {
      setPhase('complete');
    }
  }, [content.followUpOptions, responseText, playReveal]);

  const handleFollowUpToggle = useCallback((id: string) => {
    setFollowUpSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    playTapConfirm();
  }, [playTapConfirm]);

  const handleContinueFromFollowUp = useCallback(() => {
    playReveal();
    if (responseText) {
      setPhase('response');
    } else {
      setPhase('complete');
    }
  }, [responseText, playReveal]);

  const handleContinueFromResponse = useCallback(() => {
    setPhase('complete');
    playSuccess();
  }, [playSuccess]);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Calculate fill percent for intensity slider
  const fillPercent = ((intensity - 1) / 4) * 100;

  return (
    <motion.div
      className={`min-h-screen bg-stone-950 light:bg-stone-50 flex flex-col ${isRTL ? 'rtl' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Atmospheric glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 40%, ${config.glow} 0%, transparent 60%)`,
        }}
      />

      {/* Header */}
      <div className="px-6 pt-6 pb-4 relative z-10">
        {onBack && phase === 'selecting' && (
          <button
            onClick={onBack}
            className={`flex items-center gap-1 text-stone-500 light:text-stone-600 hover:text-stone-300 light:hover:text-stone-900 transition-colors text-sm mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {t('exercises.back')}
          </button>
        )}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`w-10 h-10 rounded-xl ${config.accentBg} flex items-center justify-center`}>
            <span className="text-xl">🔮</span>
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-stone-500 light:text-stone-600 text-xs uppercase tracking-wider">Soul Compass</p>
            <h1 className="text-xl font-semibold text-stone-100 light:text-stone-900">{title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          {/* SELECTING PHASE */}
          {phase === 'selecting' && (
            <motion.div
              key="selecting"
              className="flex-1 flex flex-col"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              {/* Central question */}
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl text-stone-100 light:text-stone-900 leading-relaxed">
                  {content.centralQuestion}
                </h2>
                <p className="text-sm text-stone-500 light:text-stone-600 mt-2">
                  {maxSelections > 1
                    ? `Tap all that resonate${minSelections > 1 ? ` (at least ${minSelections})` : ''}`
                    : 'Choose one'}
                </p>
              </div>

              {/* Options */}
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3 flex-1"
                >
                  {content.options.map((option, index) => {
                    const isSelected = selected.has(option.id);
                    return (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06, duration: 0.3 }}
                        onClick={() => handleToggle(option.id)}
                        className={`
                          w-full px-5 py-4 rounded-2xl text-left transition-all duration-200
                          border-2 relative overflow-hidden active:scale-[0.98]
                          ${isSelected
                            ? `${config.selectedBg} ${config.border}`
                            : 'bg-stone-900/50 light:bg-stone-200/50 border-stone-700/40 hover:border-stone-600/60'
                          }
                        `}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        {/* Selection glow */}
                        {isSelected && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                              background: `radial-gradient(circle at 50% 50%, ${config.glow} 0%, transparent 70%)`,
                            }}
                          />
                        )}

                        <div className="relative z-10 flex items-center gap-3">
                          {/* Check indicator */}
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center
                            flex-shrink-0 transition-all duration-200
                            ${isSelected
                              ? `${config.sliderThumb} border-transparent`
                              : 'border-stone-600 bg-transparent'
                            }
                          `}>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              >
                                <Check size={14} className="text-white" strokeWidth={3} />
                              </motion.div>
                            )}
                          </div>

                          {/* Option text */}
                          <span className={`
                            text-base leading-snug transition-colors duration-200
                            ${isSelected ? 'text-stone-100 light:text-stone-900' : 'text-stone-300 light:text-stone-700'}
                          `}>
                            <span className="mr-2">{option.emoji}</span>
                            {option.text}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}

              {/* Continue button */}
              <AnimatePresence>
                {canContinue && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pt-4 mt-auto"
                  >
                    <Button
                      onClick={handleContinueFromSelection}
                      variant="primary"
                      className="w-full"
                      sound="tap"
                    >
                      {selected.size === 1 ? 'This is me' : 'These resonate'}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* INTENSITY PHASE */}
          {phase === 'intensity' && (
            <motion.div
              key="intensity"
              className="flex-1 flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              {/* Question */}
              <h2 className="text-xl sm:text-2xl text-stone-100 light:text-stone-900 text-center mb-8 leading-relaxed">
                {content.intensityQuestion || 'How strongly does this feel?'}
              </h2>

              {/* Scale track with fill */}
              <div className="w-full max-w-sm mb-4">
                <div className={`h-2 ${config.sliderTrack} rounded-full overflow-hidden`}>
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${config.sliderFill}`}
                    initial={{ width: '50%' }}
                    animate={{ width: `${fillPercent}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Scale points */}
              <div className="flex justify-between w-full max-w-sm px-1 mb-2">
                {[1, 2, 3, 4, 5].map((value) => {
                  const isActive = intensity === value;
                  return (
                    <motion.button
                      key={value}
                      onClick={() => handleIntensityChange(value)}
                      className={`
                        w-11 h-11 rounded-full flex items-center justify-center
                        text-sm font-semibold transition-all duration-200
                        active:scale-90
                        ${isActive
                          ? `${config.sliderThumb} text-white shadow-lg scale-110`
                          : intensity > 0 && value <= intensity
                          ? `${config.selectedBg} ${config.accent} border ${config.border}`
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
              <div className="flex justify-between w-full max-w-sm px-1 mb-8">
                <span className="text-xs text-stone-500 light:text-stone-600">
                  {content.intensityLabels?.low || 'Barely'}
                </span>
                <span className="text-xs text-stone-500 light:text-stone-600">
                  {content.intensityLabels?.high || 'Deeply'}
                </span>
              </div>

              {/* Contextual response */}
              <AnimatePresence mode="wait">
                {responseText && (
                  <motion.div
                    key={responseText}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-center mb-8"
                  >
                    <p className={`text-lg ${config.accent} leading-relaxed italic px-4`}>
                      {responseText}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue button */}
              <Button
                onClick={handleContinueFromIntensity}
                variant="primary"
                className="w-full max-w-sm"
                sound="tap"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* FOLLOW-UP PHASE */}
          {phase === 'followup' && content.followUpOptions && (
            <motion.div
              key="followup"
              className="flex-1 flex flex-col"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              {/* Question */}
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl text-stone-100 light:text-stone-900 leading-relaxed">
                  {content.followUpQuestion || 'What could this lead to?'}
                </h2>
              </div>

              {/* Follow-up options */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 flex-1"
              >
                {content.followUpOptions.map((option, index) => {
                  const isSelected = followUpSelected.has(option.id);
                  return (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.3 }}
                      onClick={() => handleFollowUpToggle(option.id)}
                      className={`
                        w-full px-5 py-4 rounded-2xl text-left transition-all duration-200
                        border-2 relative overflow-hidden active:scale-[0.98]
                        ${isSelected
                          ? `${config.selectedBg} ${config.border}`
                          : 'bg-stone-900/50 light:bg-stone-200/50 border-stone-700/40 hover:border-stone-600/60'
                        }
                      `}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <div className="relative z-10 flex items-center gap-3">
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center
                          flex-shrink-0 transition-all duration-200
                          ${isSelected
                            ? `${config.sliderThumb} border-transparent`
                            : 'border-stone-600 bg-transparent'
                          }
                        `}>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            >
                              <Check size={14} className="text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </div>
                        <span className={`text-base leading-snug ${isSelected ? 'text-stone-100 light:text-stone-900' : 'text-stone-300 light:text-stone-700'}`}>
                          <span className="mr-2">{option.emoji}</span>
                          {option.text}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Continue button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="pt-4 mt-auto"
              >
                <Button
                  onClick={handleContinueFromFollowUp}
                  variant="primary"
                  className="w-full"
                  sound="tap"
                >
                  Continue
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* RESPONSE PHASE */}
          {phase === 'response' && responseText && (
            <motion.div
              key="response"
              className="flex-1 flex flex-col items-center justify-center"
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

              <div className={`${config.accentBg} ${config.border} border rounded-2xl p-6 mb-8 max-w-sm`}>
                <p className={`text-lg ${config.accent} text-center italic leading-relaxed`}>
                  {responseText}
                </p>
              </div>

              <Button
                onClick={handleContinueFromResponse}
                variant="primary"
                className="w-full max-w-sm"
                sound="success"
              >
                I understand
              </Button>
            </motion.div>
          )}

          {/* COMPLETE PHASE */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              className="flex-1 flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="text-6xl mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                🧭
              </motion.div>

              <h2 className="text-2xl font-semibold text-stone-100 light:text-stone-900 mb-4">
                Compass Set
              </h2>

              <p className="text-stone-400 light:text-stone-600 mb-8 text-center max-w-sm">
                You&apos;ve mapped your inner terrain. This awareness is the first step to change.
              </p>

              <Button onClick={handleComplete} variant="primary" className="w-full max-w-sm" sound="success">
                Complete
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default SoulCompassExercise;
