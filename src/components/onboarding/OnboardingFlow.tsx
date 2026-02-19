'use client';

// ═══════════════════════════════════════════════════════════════════════════
// ONBOARDING FLOW - THE INITIATION
// ═══════════════════════════════════════════════════════════════════════════
//
// This is not a setup wizard. This is the beginning of transformation.
// Every element is designed to create reverence, not just collect data.
// The atmosphere builds. The journey deepens. The commitment solidifies.
//
// Audio: Mystical ambient music plays from the start, with chimes between
// steps and a triumphant celebration at completion.
//
// Order: Welcome → Name → Anonymous Identity → Goal → Why → Path → Commitment → Origin Point → Ready
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { AmbientBackground } from '@/components/ambient';
import { MusicControls } from '@/components/ui/MusicControls';
import { backgroundMusic } from '@/lib/backgroundMusic';
import { useAudio } from '@/hooks/useAudio';
import { useTranslation } from '@/i18n';
import { useTheme } from 'next-themes';
import { WelcomeStep } from './steps/WelcomeStep';
import { NameStep } from './steps/NameStep';
import { IdentityStep } from './steps/IdentityStep';
import { GoalStep } from './steps/GoalStep';
import { WhyStep } from './steps/WhyStep';
import { PathStep } from './steps/PathStep';
import { CommitmentStep } from './steps/CommitmentStep';
import { AuthStep } from './steps/AuthStep';
import { ReadyStep } from './steps/ReadyStep';

const TOTAL_STEPS = 9;

// Step translation keys (order: Welcome → Name → Identity → Goal → Why → Path → Commitment → OriginPoint → Ready)
const STEP_KEYS = ['welcome', 'yourName', 'community', 'vision', 'purpose', 'thePath', 'commitment', 'createOrigin', 'begin'];

export function OnboardingFlow() {
  const { onboardingStep, setOnboardingStep, completeOnboarding } = useStore();
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';
  const [direction, setDirection] = useState(1);
  const [mounted, setMounted] = useState(false);
  
  // Audio integration - use new standalone background music system
  const audio = useAudio();
  const [audioStarted, setAudioStarted] = useState(false);
  const prevStepRef = useRef(onboardingStep);

  // Start background music on first user interaction
  // This needs to happen on interaction because browsers block autoplay
  const initializeAudio = useCallback(() => {
    if (!audioStarted) {
      setAudioStarted(true);
      // Start background music using new system
      backgroundMusic.start();
    }
  }, [audioStarted]);

  // Start audio on very first interaction (any touch/click)
  // On Android, touchstart fires before click. Use { once: true } and a flag
  // to ensure only one event triggers audio initialization.
  useEffect(() => {
    setMounted(true);
    let handled = false;

    const handleInteraction = () => {
      if (handled) return;
      handled = true;
      initializeAudio();
      // Clean up both listeners after first interaction
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [initializeAudio]);

  // Cleanup audio when onboarding completes
  useEffect(() => {
    return () => {
      // Only stop if audio was actually started during onboarding
      // Note: We always call stop() since the component unmounting
      // means we're leaving onboarding
      backgroundMusic.stop();
    };
  }, []);

  // Play sounds on step changes
  useEffect(() => {
    if (mounted && prevStepRef.current !== onboardingStep) {
      const wasForward = onboardingStep > prevStepRef.current;
      
      if (wasForward) {
        // Moving forward - play step transition chime
        if (onboardingStep === TOTAL_STEPS - 1) {
          // Final step - play bigger reveal sound
          audio.playReveal();
        } else {
          // Regular step - play chime
          audio.playChime();
        }
      } else {
        // Moving backward - subtle whoosh
        audio.playWhoosh('out');
      }
      
      prevStepRef.current = onboardingStep;
    }
  }, [onboardingStep, mounted, audio]);

  const nextStep = useCallback(() => {
    // Initialize audio on first forward action
    initializeAudio();

    if (onboardingStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setOnboardingStep(onboardingStep + 1);
    } else {
      // Completing onboarding - IMMEDIATELY stop background music
      backgroundMusic.stop();

      // Small delay for clean transition, then complete
      setTimeout(() => {
        completeOnboarding();
      }, 100);
    }
  }, [onboardingStep, setOnboardingStep, completeOnboarding, initializeAudio]);

  const prevStep = useCallback(() => {
    if (onboardingStep > 0) {
      setDirection(-1);
      setOnboardingStep(onboardingStep - 1);
    }
  }, [onboardingStep, setOnboardingStep]);

  // ─── Swipe gesture support ───────────────────────────────────────────────
  // Steps that have text inputs — swipe is disabled on these to avoid
  // conflicting with horizontal text selection gestures.
  const SWIPE_DISABLED_STEPS = useMemo(() => new Set([6, 7]), []); // CommitmentStep (6) and AuthStep (7)

  const swipeTouchStart = useRef<{ x: number; y: number } | null>(null);

  const handleSwipeTouchStart = useCallback((e: React.TouchEvent) => {
    if (SWIPE_DISABLED_STEPS.has(onboardingStep)) return;
    swipeTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, [onboardingStep, SWIPE_DISABLED_STEPS]);

  const handleSwipeTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!swipeTouchStart.current) return;
    const dx = e.changedTouches[0].clientX - swipeTouchStart.current.x;
    const dy = e.changedTouches[0].clientY - swipeTouchStart.current.y;
    swipeTouchStart.current = null;

    // Only register as horizontal swipe if dx dominates and exceeds threshold
    if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 50) return;

    if (dx < 0) {
      nextStep();
    } else {
      prevStep();
    }
  }, [nextStep, prevStep]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.96,
      filter: 'blur(4px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.96,
      filter: 'blur(4px)',
    }),
  };

  const renderStep = () => {
    switch (onboardingStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return <NameStep onNext={nextStep} onBack={prevStep} />;
      case 2:
        return <IdentityStep onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <GoalStep onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <WhyStep onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <PathStep onNext={nextStep} onBack={prevStep} />;
      case 6:
        return <CommitmentStep onNext={nextStep} onBack={prevStep} />;
      case 7:
        return <AuthStep onNext={nextStep} onBack={prevStep} />;
      case 8:
        return <ReadyStep onNext={nextStep} onBack={prevStep} />;
      default:
        return null;
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-stone-950 light:bg-stone-50" />;
  }

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      onTouchStart={handleSwipeTouchStart}
      onTouchEnd={handleSwipeTouchEnd}
    >
      {/* Atmospheric background - deeper for onboarding */}
      <AmbientBackground intensity="vivid" particleCount={20} orbCount={4} />

      {/* Progress indicator - elegant arc of dots (mobile-optimized) */}
      {onboardingStep > 0 && onboardingStep < TOTAL_STEPS - 1 && (
        <motion.div
          className="fixed top-2 sm:top-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-xs sm:max-w-none sm:w-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-1 sm:gap-3">
            {/* Current step label - smaller on mobile, truncated if needed */}
            <motion.span
              key={onboardingStep}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] uppercase text-stone-500 light:text-stone-600 font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-2"
            >
              {t(`onboarding.steps.${STEP_KEYS[onboardingStep]}`)}
            </motion.span>

            {/* Dots - smaller gap and size on mobile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <motion.div
                  key={step}
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: step * 0.1 }}
                >
                  {/* Glow for active step */}
                  {onboardingStep === step && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-amber-500/50"
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{ filter: 'blur(4px)' }}
                    />
                  )}

                  {/* Dot - smaller on mobile */}
                  <motion.div
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-500 ${
                      onboardingStep > step
                        ? 'bg-amber-500'
                        : onboardingStep === step
                        ? 'bg-amber-400 shadow-lg shadow-amber-500/50'
                        : 'bg-stone-700 light:bg-stone-300'
                    }`}
                    animate={
                      onboardingStep === step
                        ? { scale: [1, 1.2, 1] }
                        : {}
                    }
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  {/* Completed checkmark */}
                  {onboardingStep > step && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <svg
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-stone-950"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={4}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Step content - adjusted padding for mobile to avoid overlap with indicator */}
      <div className={`relative z-10 flex-1 flex justify-center p-4 sm:p-6 ${onboardingStep > 0 && onboardingStep < TOTAL_STEPS - 1 ? 'items-start pt-24 sm:pt-24' : 'items-center'}`}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={onboardingStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="w-full max-w-md"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Music controls - mute and change track */}
      <MusicControls show={audioStarted} />

      {/* Bottom decorative gradient */}
      <div
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: isLight
            ? 'linear-gradient(to top, rgba(250, 250, 249, 0.8), transparent)'
            : 'linear-gradient(to top, rgba(12, 10, 9, 0.8), transparent)',
        }}
      />
    </div>
  );
}

export default OnboardingFlow;
