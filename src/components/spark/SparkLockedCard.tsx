'use client';

import { motion } from 'framer-motion';
import { Zap, Lock, CheckCircle } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// SPARK LOCKED CARD
// Shows in the DailyFlowHome completion area and Dashboard
// Locked state when daily practice not complete, unlocked when done
// ═══════════════════════════════════════════════════════════════════════════

// Rotating teaser quotes for the locked state
const LOCKED_TEASERS = [
  '"The only way out is through."',
  '"Discipline equals freedom."',
  '"Stay hard."',
  '"Begin at once to live."',
  '"The obstacle is the way."',
  '"Where focus goes, energy flows."',
  '"Pain + Reflection = Progress."',
];

interface SparkLockedCardProps {
  isUnlocked: boolean;
  isForcedClosed?: boolean;
  onOpen: () => void;
}

export function SparkLockedCard({ isUnlocked, isForcedClosed, onOpen }: SparkLockedCardProps) {
  // Get a teaser based on today's date (rotates daily)
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const teaser = LOCKED_TEASERS[dayOfYear % LOCKED_TEASERS.length];

  if (isForcedClosed) {
    return (
      <div className="p-4 rounded-xl bg-stone-900/50 border border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-800/50 flex items-center justify-center">
            <Zap size={18} className="text-stone-600" />
          </div>
          <div className="flex-1">
            <p className="text-stone-500 font-medium">Spark — Done for today</p>
            <p className="text-stone-600 text-sm">
              You&apos;ve had enough sparks. Time to act on them.
            </p>
          </div>
          <CheckCircle size={18} className="text-stone-600" />
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="p-4 rounded-xl bg-stone-900/30 border border-stone-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-800/50 flex items-center justify-center">
            <Lock size={16} className="text-stone-700" />
          </div>
          <div className="flex-1">
            <p className="text-stone-600 font-medium">Spark</p>
            <p className="text-stone-700 text-sm">
              Complete today&apos;s practice to unlock
            </p>
          </div>
          <Zap size={18} className="text-stone-700" />
        </div>
        {/* Teaser quote */}
        <p className="mt-2 ml-13 text-stone-700 text-xs italic pl-[52px]">
          {teaser}
        </p>
      </div>
    );
  }

  // Unlocked state — tappable
  return (
    <motion.button
      onClick={onOpen}
      className="w-full p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all text-left"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Zap size={18} className="text-amber-400" />
          </motion.div>
        </div>
        <div className="flex-1">
          <p className="text-stone-200 font-medium">Spark</p>
          <p className="text-stone-400 text-sm">
            Your daily wisdom feed is ready
          </p>
        </div>
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-amber-400"
        >
          <Zap size={20} />
        </motion.div>
      </div>
    </motion.button>
  );
}

export default SparkLockedCard;
