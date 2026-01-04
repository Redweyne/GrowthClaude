'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { useStore } from '@/store/useStore';

interface WhyStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function WhyStep({ onNext, onBack }: WhyStepProps) {
  const { whyStatement, setWhyStatement, transformationGoal } = useStore();
  const [localWhy, setLocalWhy] = useState(whyStatement || '');

  const handleContinue = () => {
    if (localWhy.trim()) {
      setWhyStatement(localWhy.trim());
      onNext();
    }
  };

  const getPromptText = () => {
    switch (transformationGoal) {
      case 'calmer':
        return 'Why do you want to find more calm in your life?';
      case 'disciplined':
        return 'Why is discipline important to you right now?';
      case 'confident':
        return 'Why do you want to become more confident?';
      case 'leader':
        return 'Why do you want to become a leader?';
      case 'focused':
        return 'Why do you want sharper focus?';
      case 'resilient':
        return 'Why do you want to build resilience?';
      default:
        return 'Why do you want to transform?';
    }
  };

  const getPlaceholder = () => {
    switch (transformationGoal) {
      case 'calmer':
        return "I want to stop reacting emotionally and find peace even when things are chaotic...";
      case 'disciplined':
        return "I want to follow through on my commitments and stop letting myself down...";
      case 'confident':
        return "I want to trust my decisions and stop second-guessing myself...";
      case 'leader':
        return "I want to inspire others and take responsibility for making things better...";
      case 'focused':
        return "I want to do deep work without constant distraction and achieve what matters...";
      case 'resilient':
        return "I want to face challenges without breaking and come back stronger...";
      default:
        return "Write your personal why...";
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
        {getPromptText()}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-zinc-400 mb-8"
      >
        Your &ldquo;why&rdquo; will anchor you when motivation fades
      </motion.p>

      {/* Text input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <textarea
          value={localWhy}
          onChange={(e) => setLocalWhy(e.target.value)}
          placeholder={getPlaceholder()}
          className="w-full h-40 p-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          maxLength={500}
        />
        <p className="text-right text-xs text-zinc-600 mt-2">
          {localWhy.length}/500
        </p>
      </motion.div>

      {/* Continue button */}
      <Button
        size="lg"
        onClick={handleContinue}
        disabled={!localWhy.trim()}
        className="w-full"
      >
        Continue
      </Button>

      {/* Skip option */}
      <button
        onClick={onNext}
        className="w-full mt-4 text-zinc-500 hover:text-zinc-400 text-sm transition-colors"
      >
        Skip for now
      </button>
    </div>
  );
}

export default WhyStep;
