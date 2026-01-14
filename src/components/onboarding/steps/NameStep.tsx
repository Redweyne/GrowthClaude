'use client';

// ============================================================================
// NAME STEP - THE FIRST MEETING
// This is not a form field. This is the moment we learn who we're speaking with.
// No skip option. Your name matters. You matter.
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface NameStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function NameStep({ onNext, onBack }: NameStepProps) {
  const { name, setName } = useStore();
  const [localName, setLocalName] = useState(name || '');
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (localName.trim()) {
      setName(localName.trim());
      onNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && localName.trim()) {
      handleContinue();
    }
  };

  const isValid = localName.trim().length >= 1;

  return (
    <div className="min-h-[60vh] flex flex-col">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center text-zinc-500 hover:text-zinc-300 transition-colors mb-8 self-start"
      >
        <ChevronLeft size={20} />
        <span className="text-sm">Back</span>
      </button>

      <div className="flex-1 flex flex-col justify-center">
        {/* The question - intimate, direct */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-2xl sm:text-3xl text-white font-light mb-3">
            Before we begin...
          </p>
          <p className="text-xl text-zinc-400">
            What's your name?
          </p>
        </motion.div>

        {/* Name input - prominent, centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <input
            ref={inputRef}
            type="text"
            value={localName}
            onChange={(e) => {
              setLocalName(e.target.value);
              setHasInteracted(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Your first name"
            className="
              w-full p-5 bg-zinc-900/50 border-2 rounded-xl
              text-white text-center text-xl placeholder-zinc-600
              focus:outline-none transition-all duration-300
              border-zinc-800 focus:border-indigo-500 focus:bg-zinc-900
            "
            maxLength={30}
            autoComplete="given-name"
          />
        </motion.div>

        {/* Response - appears after typing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isValid ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <p className="text-zinc-400">
            Nice to meet you, <span className="text-indigo-400">{localName || '...'}</span>
          </p>
        </motion.div>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
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
            {isValid ? 'Continue' : 'Enter your name'}
          </motion.button>
        </motion.div>
      </div>

      {/* Subtle note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-xs text-zinc-600 mt-4"
      >
        This stays private. It's just between us.
      </motion.p>
    </div>
  );
}

export default NameStep;
