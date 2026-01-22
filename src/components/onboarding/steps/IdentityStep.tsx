'use client';

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY STEP - ANONYMOUS IDENTITY SELECTION
// ═══════════════════════════════════════════════════════════════════════════
//
// This step asks users how they want to be referred to when sharing
// reflections anonymously. It's about creating connection without
// exposing identity - warmth without vulnerability.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/components/ui';
import { useEchoesStore } from '@/store/useEchoesStore';
import type { GenderIdentity } from '@/types/echoes';

interface IdentityStepProps {
  onNext: () => void;
  onBack: () => void;
}

const IDENTITY_OPTIONS: {
  id: GenderIdentity;
  label: string;
  description: string;
  pronoun: string;
  icon: string;
}[] = [
  {
    id: 'brother',
    label: 'Brother',
    description: 'He/Him',
    pronoun: 'A fellow brother',
    icon: '👤',
  },
  {
    id: 'sister',
    label: 'Sister',
    description: 'She/Her',
    pronoun: 'A fellow sister',
    icon: '👤',
  },
  {
    id: 'traveler',
    label: 'Traveler',
    description: 'They/Them',
    pronoun: 'A fellow traveler',
    icon: '🌟',
  },
];

export function IdentityStep({ onNext, onBack }: IdentityStepProps) {
  const { genderIdentity, setGenderIdentity } = useEchoesStore();
  const [selected, setSelected] = useState<GenderIdentity | null>(genderIdentity);

  const handleSelect = (identity: GenderIdentity) => {
    setSelected(identity);
    setGenderIdentity(identity);
  };

  const handleContinue = () => {
    if (selected) {
      onNext();
    }
  };

  return (
    <div className="text-center">
      {/* Icon */}
      <motion.div
        className="mb-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <div className="relative inline-block">
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
              transform: 'scale(1.5)',
            }}
          />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <Users size={36} className="text-amber-400" />
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Your Anonymous Identity
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-stone-400 mb-8 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        When you share reflections with fellow travelers,
        <br />
        how would you like to be referred to?
      </motion.p>

      {/* Identity options */}
      <motion.div
        className="space-y-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {IDENTITY_OPTIONS.map((option, index) => (
          <motion.button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 ${
              selected === option.id
                ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
                : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 hover:bg-stone-900/80'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              {/* Selection indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === option.id
                    ? 'border-amber-500 bg-amber-500'
                    : 'border-stone-600'
                }`}
              >
                {selected === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-stone-950"
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold ${
                      selected === option.id ? 'text-amber-200' : 'text-stone-200'
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="text-stone-500 text-sm">({option.description})</span>
                </div>
                <p className="text-stone-500 text-sm mt-1">
                  Others will see: &quot;{option.pronoun} reflected...&quot;
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Privacy note */}
      <motion.p
        className="text-stone-600 text-xs mb-8 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Your name and identity are never revealed.
        <br />
        Only this label is shown when you share anonymously.
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ChevronLeft size={18} className="mr-1" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selected}
          glow={!!selected}
          className="flex-1"
        >
          Continue
          <ChevronRight size={18} className="ml-1" />
        </Button>
      </motion.div>
    </div>
  );
}

export default IdentityStep;
