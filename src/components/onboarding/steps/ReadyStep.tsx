'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Flame, Target, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { TRANSFORMATION_GOALS } from '@/types';

interface ReadyStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ReadyStep({ onNext, onBack }: ReadyStepProps) {
  const { name, transformationGoal, dailyCommitmentMinutes } = useStore();

  const selectedGoal = TRANSFORMATION_GOALS.find((g) => g.id === transformationGoal);

  const features = [
    {
      icon: BookOpen,
      title: 'Daily Lessons',
      description: 'Wisdom from the greatest minds, made actionable',
    },
    {
      icon: Target,
      title: 'Micro-Actions',
      description: 'Small practices that create lasting change',
    },
    {
      icon: Flame,
      title: 'Streaks & Progress',
      description: 'Stay motivated with visible momentum',
    },
    {
      icon: Sparkles,
      title: 'Personal Mentor',
      description: 'Guidance tailored to your journey',
    },
  ];

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

      {/* Personalized greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          {name ? `${name}, you're ready.` : "You're ready."}
        </h2>
        <p className="text-zinc-400">
          Your path to becoming{' '}
          <span className="text-indigo-400 font-medium">
            {selectedGoal?.title.toLowerCase() || 'transformed'}
          </span>{' '}
          begins now.
        </p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-sm font-medium text-zinc-400 mb-3">YOUR COMMITMENT</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">
              {dailyCommitmentMinutes} minutes daily
            </p>
            <p className="text-sm text-zinc-500">Starting with Stoicism</p>
          </div>
          <div className="text-3xl">{selectedGoal?.icon}</div>
        </div>
      </motion.div>

      {/* What's included */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3 mb-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/50"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <feature.icon size={20} className="text-indigo-400" />
            </div>
            <div>
              <h4 className="font-medium text-white text-sm">{feature.title}</h4>
              <p className="text-xs text-zinc-500">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button size="lg" onClick={onNext} className="w-full">
          Start First Lesson
        </Button>
      </motion.div>
    </div>
  );
}

export default ReadyStep;
