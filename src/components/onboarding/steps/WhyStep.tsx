'use client';

// ============================================================================
// WHY STEP - THE TRUTH
// This is not optional. This is the anchor.
// When motivation fades, this is what remains.
// No skip button. The truth is required.
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TRANSFORMATION_GOALS } from '@/types';

interface WhyStepProps {
  onNext: () => void;
  onBack: () => void;
}

// Deeper prompts that invite real reflection
const GOAL_PROMPTS: Record<string, { question: string; subtext: string; placeholder: string }> = {
  calmer: {
    question: "What's the cost of not finding calm?",
    subtext: "Think about how stress is affecting your life, your relationships, your health.",
    placeholder: "When I'm reactive, I hurt the people I love. I make decisions I regret. I can't sleep. I need to change because..."
  },
  disciplined: {
    question: "What have you lost by not following through?",
    subtext: "Think about the promises you've broken to yourself. The goals abandoned.",
    placeholder: "Every time I give up, I trust myself less. I've let go of dreams because I couldn't show up consistently. I need to change because..."
  },
  confident: {
    question: "What's holding you back from trusting yourself?",
    subtext: "Think about the opportunities you've missed. The words left unsaid.",
    placeholder: "I stay quiet when I should speak. I don't go for what I want because I'm afraid I'm not enough. I need to change because..."
  },
  leader: {
    question: "Why does the world need you to step up?",
    subtext: "Think about who's counting on you. What you could create.",
    placeholder: "People look to me but I shrink back. I have ideas but I don't act on them. I need to become a leader because..."
  },
  focused: {
    question: "What could you create with undivided attention?",
    subtext: "Think about your deepest work. The project that matters most.",
    placeholder: "I scatter my energy on everything and master nothing. My best work never gets done because I'm always distracted. I need to change because..."
  },
  resilient: {
    question: "What challenge are you preparing for?",
    subtext: "Think about what's coming. What you need to be ready for.",
    placeholder: "Life has knocked me down before and I stayed down too long. I know harder times will come, and I need to be stronger because..."
  },
};

export function WhyStep({ onNext, onBack }: WhyStepProps) {
  const { name, whyStatement, setWhyStatement, transformationGoal } = useStore();
  const [localWhy, setLocalWhy] = useState(whyStatement || '');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Word count
  const wordCount = localWhy.trim().split(/\s+/).filter(Boolean).length;
  const isValid = wordCount >= 10;

  // Focus textarea after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (isValid) {
      setWhyStatement(localWhy.trim());
      onNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isValid) {
      handleContinue();
    }
  };

  const selectedGoal = TRANSFORMATION_GOALS.find(g => g.id === transformationGoal);
  const prompts = GOAL_PROMPTS[transformationGoal || 'calmer'];

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

      {/* Context - what they chose */}
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

      {/* The question - deep, personal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <p className="text-xl sm:text-2xl text-white font-light mb-2">
          {name ? `${name}, ` : ''}{prompts.question}
        </p>
        <p className="text-zinc-500 text-sm">
          {prompts.subtext}
        </p>
      </motion.div>

      {/* Writing space */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex-1 mb-4"
      >
        <div className={`
          relative rounded-xl transition-all duration-300
          ${isFocused ? 'ring-2 ring-indigo-500/30' : ''}
        `}>
          <textarea
            ref={textareaRef}
            value={localWhy}
            onChange={(e) => setLocalWhy(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={prompts.placeholder}
            className="
              w-full min-h-[140px] p-4 rounded-xl
              bg-zinc-900/50 border-2 border-zinc-800
              text-white placeholder-zinc-600
              focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-900
              transition-all duration-300 resize-none
              leading-relaxed
            "
            maxLength={800}
          />

          {/* Word count indicator */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className={`text-xs transition-colors ${
              isValid ? 'text-emerald-400' : 'text-zinc-600'
            }`}>
              {wordCount} words
            </span>
            {wordCount > 0 && wordCount < 10 && (
              <span className="text-xs text-zinc-500">
                ({10 - wordCount} more needed)
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Encouragement text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isValid ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
        className="text-center text-sm text-zinc-500 mb-6"
      >
        {isValid
          ? "This will be your anchor. You can always come back to this."
          : "Write at least 10 words. Be honest with yourself."
        }
      </motion.p>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={handleContinue}
          disabled={!isValid}
          className={`
            w-full py-4 rounded-xl font-medium text-lg transition-all duration-300
            ${isValid
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
          `}
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
        >
          {isValid ? 'This is my truth' : 'Write your why...'}
        </motion.button>

        {isValid && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-zinc-600 mt-3"
          >
            Press ⌘+Enter to continue
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default WhyStep;
