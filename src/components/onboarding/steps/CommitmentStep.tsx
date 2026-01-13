'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { DAILY_COMMITMENTS } from '@/types';

interface CommitmentStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CommitmentStep({ onNext, onBack }: CommitmentStepProps) {
  const { dailyCommitmentMinutes, setDailyCommitment } = useStore();

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
        How much time can you commit daily?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-zinc-400 mb-8"
      >
        Start small. Consistency beats intensity.
      </motion.p>

      {/* Commitment options */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {DAILY_COMMITMENTS.map((commitment, index) => (
          <motion.button
            key={commitment.minutes}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            onClick={() => setDailyCommitment(commitment.minutes)}
            className={`p-4 rounded-xl border-2 transition-all text-center ${
              dailyCommitmentMinutes === commitment.minutes
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock
                size={18}
                className={
                  dailyCommitmentMinutes === commitment.minutes
                    ? 'text-indigo-400'
                    : 'text-zinc-500'
                }
              />
              <span className="text-xl font-bold text-white">
                {commitment.label}
              </span>
            </div>
            <p className="text-xs text-zinc-500">{commitment.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-8"
      >
        <p className="text-sm text-zinc-400">
          <span className="text-indigo-400 font-medium">Recommended:</span> Start
          with 5 minutes. You can always increase later. The goal is to never
          miss a day.
        </p>
      </motion.div>

      {/* Continue button */}
      <Button size="lg" onClick={onNext} className="w-full">
        Continue
      </Button>
    </div>
  );
}

export default CommitmentStep;
