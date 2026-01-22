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
// Order: Welcome → Name → Anonymous Identity → Goal → Why → Commitment → Ready
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { AmbientBackground } from '@/components/ambient';
import { useContextualAudio } from '@/hooks/useContextualAudio';
import { useAudio } from '@/hooks/useAudio';
import { WelcomeStep } from './steps/WelcomeStep';
import { NameStep } from './steps/NameStep';
import { IdentityStep } from './steps/IdentityStep';
import { GoalStep } from './steps/GoalStep';
import { WhyStep } from './steps/WhyStep';
import { CommitmentStep } from './steps/CommitmentStep';
import { ReadyStep } from './steps/ReadyStep';

const TOTAL_STEPS = 7;

// Step titles for context
const STEP_LABELS = [
  'Welcome',
  'Your Name',
  'Community',
  'Vision',
  'Purpose',
  'Commitment',
  'Begin',
];

export function OnboardingFlow() {
  const { onboardingStep, setOnboardingStep, completeOnboarding } = useStore();
  const [direction, setDirection] = useState(1);
  const [mounted, setMounted] = useState(false);
  
  // Audio integration
  const contextualAudio = useContextualAudio({ initialScene: 'silent' });
  const audio = useAudio();
  const audioStartedRef = useRef(false);
  const prevStepRef = useRef(onboardingStep);

  // Start onboarding music on first user interaction
  const initializeAudio = useCallback(() => {
    if (!audioStartedRef.current) {
      audioStartedRef.current = true;
      contextualAudio.enterScene('onboarding');
    }
  }, [contextualAudio]);

  useEffect(() => {
    setMounted(true);
    
    // Listen for first interaction to start audio
    const handleInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [initializeAudio]);

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
      // Completing onboarding - play celebration!
      audio.playCelebrate();
      
      // Transition to reward music briefly, then complete
      contextualAudio.transitionTo('reward', { crossfadeDuration: 1 });
      
      // Small delay to let celebration sound play
      setTimeout(() => {
        contextualAudio.stopMusic(2);
        completeOnboarding();
      }, 1500);
    }
  }, [onboardingStep, setOnboardingStep, completeOnboarding, initializeAudio, audio, contextualAudio]);

  const prevStep = useCallback(() => {
    if (onboardingStep > 0) {
      setDirection(-1);
      setOnboardingStep(onboardingStep - 1);
    }
  }, [onboardingStep, setOnboardingStep]);

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
        return <CommitmentStep onNext={nextStep} onBack={prevStep} />;
      case 6:
        return <ReadyStep onNext={nextStep} onBack={prevStep} />;
      default:
        return null;
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-stone-950" />;
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Atmospheric background - deeper for onboarding */}
      <AmbientBackground intensity="vivid" particleCount={20} orbCount={4} />

      {/* Progress indicator - elegant arc of dots */}
      {onboardingStep > 0 && onboardingStep < TOTAL_STEPS - 1 && (
        <motion.div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-3">
            {/* Current step label */}
            <motion.span
              key={onboardingStep}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs tracking-[0.2em] uppercase text-stone-500 font-medium"
            >
              {STEP_LABELS[onboardingStep]}
            </motion.span>

            {/* Dots */}
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((step) => (
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

                  {/* Dot */}
                  <motion.div
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                      onboardingStep > step
                        ? 'bg-amber-500'
                        : onboardingStep === step
                        ? 'bg-amber-400 shadow-lg shadow-amber-500/50'
                        : 'bg-stone-700'
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
                        className="w-2 h-2 text-stone-950"
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

      {/* Step content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
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

      {/* Bottom decorative gradient */}
      <div
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(12, 10, 9, 0.8), transparent)',
        }}
      />
    </div>
  );
}

export default OnboardingFlow;
