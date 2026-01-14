'use client';

// ============================================================================
// ONBOARDING FLOW - THE INITIATION
// This is not a setup wizard. This is the beginning of transformation.
// Each step builds on the last. Each question goes deeper.
// Order: Welcome → Name → Goal → Why → Commitment → Ready
// ============================================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { WelcomeStep } from './steps/WelcomeStep';
import { NameStep } from './steps/NameStep';
import { GoalStep } from './steps/GoalStep';
import { WhyStep } from './steps/WhyStep';
import { CommitmentStep } from './steps/CommitmentStep';
import { ReadyStep } from './steps/ReadyStep';

const TOTAL_STEPS = 6;

export function OnboardingFlow() {
  const { onboardingStep, setOnboardingStep, completeOnboarding } = useStore();
  const [direction, setDirection] = useState(1);

  const nextStep = () => {
    if (onboardingStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setOnboardingStep(onboardingStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (onboardingStep > 0) {
      setDirection(-1);
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 200 : -200,
      opacity: 0,
      scale: 0.98,
    }),
  };

  // New order: Welcome → Name → Goal → Why → Commitment → Ready
  const renderStep = () => {
    switch (onboardingStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return <NameStep onNext={nextStep} onBack={prevStep} />;
      case 2:
        return <GoalStep onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <WhyStep onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <CommitmentStep onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <ReadyStep onNext={nextStep} onBack={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col overflow-hidden">
      {/* Progress indicator - subtle dots instead of bar */}
      {onboardingStep > 0 && onboardingStep < TOTAL_STEPS - 1 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <motion.div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  onboardingStep >= step ? 'bg-indigo-500' : 'bg-zinc-700'
                }`}
                animate={{
                  scale: onboardingStep === step ? [1, 1.3, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={onboardingStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default OnboardingFlow;
