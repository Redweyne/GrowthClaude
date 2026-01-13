'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { IdentityJourney } from './IdentityJourney';

interface IdentityScreenProps {
  onBack: () => void;
}

export function IdentityScreen({ onBack }: IdentityScreenProps) {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Identity Journey</h1>
              <p className="text-sm text-zinc-500">Define who you are becoming</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <IdentityJourney />
      </div>
    </div>
  );
}

export default IdentityScreen;
