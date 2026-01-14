'use client';

// ============================================================================
// GOAL STEP - THE VISION
// This is not a goal selector. This is seeing your future self.
// Each choice is a path. Each path leads somewhere different.
// The question is: who do you want to become?
// ============================================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TRANSFORMATION_GOALS, type TransformationGoal } from '@/types';

interface GoalStepProps {
  onNext: () => void;
  onBack: () => void;
}

// Deeper descriptions for each goal - what it really means
const GOAL_DEPTHS: Record<string, string> = {
  calmer: "To respond instead of react. To find stillness in chaos. To be unshaken.",
  disciplined: "To follow through on every commitment. To become someone you can trust.",
  confident: "To stop second-guessing. To trust your own judgment. To act decisively.",
  leader: "To take responsibility. To inspire through action. To serve others.",
  focused: "To protect your attention. To do what matters. To finish what you start.",
  resilient: "To bend without breaking. To grow stronger through adversity.",
};

export function GoalStep({ onNext, onBack }: GoalStepProps) {
  const { name, transformationGoal, setTransformationGoal } = useStore();
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);

  const handleSelectGoal = (goal: TransformationGoal) => {
    setTransformationGoal(goal);
  };

  const handleContinue = () => {
    if (transformationGoal) {
      onNext();
    }
  };

  const selectedGoalData = TRANSFORMATION_GOALS.find(g => g.id === transformationGoal);

  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center text-zinc-500 hover:text-zinc-300 transition-colors mb-6 self-start"
      >
        <ChevronLeft size={20} />
        <span className="text-sm">Back</span>
      </button>

      {/* The question - personalized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <p className="text-2xl sm:text-3xl text-white font-light mb-2">
          {name ? `${name}, who do you` : 'Who do you'} want to become?
        </p>
        <p className="text-zinc-500">
          Choose the transformation that matters most right now
        </p>
      </motion.div>

      {/* Goal options - cards with depth */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {TRANSFORMATION_GOALS.map((goal, index) => (
          <motion.button
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            onClick={() => handleSelectGoal(goal.id)}
            onMouseEnter={() => setHoveredGoal(goal.id)}
            onMouseLeave={() => setHoveredGoal(null)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300 text-left
              ${transformationGoal === goal.id
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'
              }
            `}
          >
            {/* Icon */}
            <div className="text-3xl mb-2">{goal.icon}</div>

            {/* Title */}
            <h3 className={`font-medium text-sm transition-colors ${
              transformationGoal === goal.id ? 'text-white' : 'text-zinc-300'
            }`}>
              {goal.title}
            </h3>

            {/* Selected indicator */}
            {transformationGoal === goal.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Depth reveal - shows deeper meaning when selected */}
      <AnimatePresence mode="wait">
        {transformationGoal && (
          <motion.div
            key={transformationGoal}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center py-6 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 mb-6"
          >
            <p className="text-lg text-white font-light mb-2">
              {selectedGoalData?.title}
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {GOAL_DEPTHS[transformationGoal]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to push button down */}
      <div className="flex-1" />

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={handleContinue}
          disabled={!transformationGoal}
          className={`
            w-full py-4 rounded-xl font-medium text-lg transition-all duration-300
            ${transformationGoal
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
          `}
          whileHover={transformationGoal ? { scale: 1.02 } : {}}
          whileTap={transformationGoal ? { scale: 0.98 } : {}}
        >
          {transformationGoal ? 'This is my path' : 'Choose your transformation'}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default GoalStep;
