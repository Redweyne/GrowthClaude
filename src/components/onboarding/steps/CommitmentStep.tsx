'use client';

// ============================================================================
// COMMITMENT STEP - THE PLEDGE
// This is not a time selector. This is making a promise to yourself.
// A commitment you will honor. Every single day.
// ============================================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { DAILY_COMMITMENTS, TRANSFORMATION_GOALS } from '@/types';

interface CommitmentStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CommitmentStep({ onNext, onBack }: CommitmentStepProps) {
  const { name, transformationGoal, dailyCommitmentMinutes, setDailyCommitment } = useStore();
  const [showPledge, setShowPledge] = useState(false);

  const selectedGoal = TRANSFORMATION_GOALS.find(g => g.id === transformationGoal);

  const handleSelectCommitment = (minutes: number) => {
    setDailyCommitment(minutes);
    // Show pledge after selection
    setTimeout(() => setShowPledge(true), 300);
  };

  const handleContinue = () => {
    if (dailyCommitmentMinutes) {
      onNext();
    }
  };

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

      {/* Context - their path */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 mb-6"
      >
        <span className="text-2xl">{selectedGoal?.icon}</span>
        <span className="text-zinc-500 text-sm">
          Your path: <span className="text-zinc-300">{selectedGoal?.title}</span>
        </span>
      </motion.div>

      {/* The question - personal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <p className="text-xl sm:text-2xl text-white font-light mb-2">
          {name ? `${name}, how` : 'How'} much time will you give yourself each day?
        </p>
        <p className="text-zinc-500 text-sm">
          Small and consistent beats big and sporadic. Choose what you'll actually do.
        </p>
      </motion.div>

      {/* Commitment options */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {DAILY_COMMITMENTS.map((commitment, index) => (
          <motion.button
            key={commitment.minutes}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            onClick={() => handleSelectCommitment(commitment.minutes)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300 text-center
              ${dailyCommitmentMinutes === commitment.minutes
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'
              }
            `}
          >
            <p className={`text-2xl font-bold mb-1 transition-colors ${
              dailyCommitmentMinutes === commitment.minutes ? 'text-white' : 'text-zinc-300'
            }`}>
              {commitment.label}
            </p>
            <p className="text-xs text-zinc-500">
              {commitment.description}
            </p>

            {/* Selected indicator */}
            {dailyCommitmentMinutes === commitment.minutes && (
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

      {/* The Pledge - appears after selection */}
      <AnimatePresence>
        {showPledge && dailyCommitmentMinutes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-6 px-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-6"
          >
            <p className="text-center text-white leading-relaxed">
              "I, <span className="text-indigo-400">{name || 'I'}</span>, commit to{' '}
              <span className="text-indigo-400">{dailyCommitmentMinutes} minutes</span> daily
              to become{' '}
              <span className="text-indigo-400">{selectedGoal?.title?.toLowerCase()}</span>."
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Tip */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-xs text-zinc-600 mb-4"
      >
        You can change this anytime. What matters is that you show up.
      </motion.p>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={handleContinue}
          disabled={!dailyCommitmentMinutes}
          className={`
            w-full py-4 rounded-xl font-medium text-lg transition-all duration-300
            ${dailyCommitmentMinutes
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
          `}
          whileHover={dailyCommitmentMinutes ? { scale: 1.02 } : {}}
          whileTap={dailyCommitmentMinutes ? { scale: 0.98 } : {}}
        >
          {dailyCommitmentMinutes ? 'I commit to this' : 'Choose your commitment'}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default CommitmentStep;
