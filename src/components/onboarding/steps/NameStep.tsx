'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, User } from 'lucide-react';
import { Button } from '@/components/ui';
import { useStore } from '@/store/useStore';

interface NameStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function NameStep({ onNext, onBack }: NameStepProps) {
  const { name, setName } = useStore();
  const [localName, setLocalName] = useState(name || '');

  const handleContinue = () => {
    if (localName.trim()) {
      setName(localName.trim());
    }
    onNext();
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

      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-zinc-800 flex items-center justify-center"
      >
        <User size={32} className="text-zinc-400" />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-2 text-center"
      >
        What should we call you?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-zinc-400 mb-8 text-center"
      >
        Your mentor will use this name to guide you
      </motion.p>

      {/* Name input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <input
          type="text"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          placeholder="Your first name"
          className="w-full p-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl text-white text-center text-lg placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
          maxLength={50}
          autoFocus
        />
      </motion.div>

      {/* Continue button */}
      <Button size="lg" onClick={handleContinue} className="w-full">
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

export default NameStep;
