'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { TRANSFORMATION_GOALS, type TransformationGoal } from '@/types';

interface GoalStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function GoalStep({ onNext, onBack }: GoalStepProps) {
  const { transformationGoal, setTransformationGoal } = useStore();

  const handleSelectGoal = (goal: TransformationGoal) => {
    setTransformationGoal(goal);
  };

  const handleContinue = () => {
    if (transformationGoal) {
      onNext();
    }
  };

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
      >
        <ChevronLeft size={20} />
        <span className="text-sm">Back</span>
      </button>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-2"
      >
        Who do you want to become?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-zinc-400 mb-8"
      >
        Choose your primary transformation goal
      </motion.p>

      {/* Goal options */}
      <div className="space-y-3 mb-8">
        {TRANSFORMATION_GOALS.map((goal, index) => (
          <motion.button
            key={goal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            onClick={() => handleSelectGoal(goal.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${
              transformationGoal === goal.id
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <span className="text-2xl">{goal.icon}</span>
            <div>
              <h3 className="font-semibold text-white">{goal.title}</h3>
              <p className="text-sm text-zinc-400">{goal.description}</p>
            </div>
            {transformationGoal === goal.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Continue button */}
      <Button
        size="lg"
        onClick={handleContinue}
        disabled={!transformationGoal}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
}

export default GoalStep;
