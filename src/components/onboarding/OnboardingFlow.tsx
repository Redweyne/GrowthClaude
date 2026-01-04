'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { WelcomeStep } from './steps/WelcomeStep';
import { GoalStep } from './steps/GoalStep';
import { WhyStep } from './steps/WhyStep';
import { CommitmentStep } from './steps/CommitmentStep';
import { NameStep } from './steps/NameStep';
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
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (onboardingStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return <GoalStep onNext={nextStep} onBack={prevStep} />;
      case 2:
        return <WhyStep onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <CommitmentStep onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <NameStep onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <ReadyStep onNext={nextStep} onBack={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Progress indicator */}
      {onboardingStep > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-zinc-800">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${((onboardingStep) / (TOTAL_STEPS - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
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
            transition={{ duration: 0.3, ease: 'easeInOut' }}
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
