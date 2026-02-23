'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight, Lock, Zap } from 'lucide-react';

interface SparkLockedCardProps {
  isUnlocked: boolean;
  isForcedClosed?: boolean;
  onOpen: () => void;
}

const LOCKED_TEASER = 'Complete your daily flow to unlock Spark.';

export function SparkLockedCard({ isUnlocked, isForcedClosed, onOpen }: SparkLockedCardProps) {
  if (isForcedClosed) {
    return (
      <div className="p-4 rounded-2xl bg-stone-900/30 light:bg-stone-100/30 border border-stone-800/50 light:border-stone-300/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-800/50 light:bg-stone-300/50 flex items-center justify-center">
            <CheckCircle size={18} className="text-stone-600 light:text-stone-400" />
          </div>
          <div className="flex-1">
            <p className="text-stone-500 font-medium text-sm">Spark - Done for today</p>
            <p className="text-stone-600 light:text-stone-400 text-xs">Time to act on what you watched.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="p-4 rounded-2xl bg-stone-900/20 light:bg-stone-100/20 border border-stone-800/30 light:border-stone-300/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-800/30 light:bg-stone-300/30 flex items-center justify-center">
            <Lock size={16} className="text-stone-700 light:text-stone-400" />
          </div>
          <div className="flex-1">
            <p className="text-stone-600 light:text-stone-400 font-medium text-sm">Spark</p>
            <p className="text-stone-700 light:text-stone-400 text-xs">Complete today&apos;s practice to unlock</p>
          </div>
          <Zap size={16} className="text-stone-800 light:text-stone-300" />
        </div>
        <p className="mt-2 text-stone-700/60 light:text-stone-400/60 text-[11px] italic pl-[52px]">{LOCKED_TEASER}</p>
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/8 to-orange-500/8 light:from-amber-500/10 light:to-orange-500/10 border border-amber-500/15 hover:border-amber-500/30 transition-all text-left"
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          >
            <Zap size={18} className="text-amber-400" />
          </motion.div>
        </div>
        <div className="flex-1">
          <p className="text-white light:text-stone-900 font-medium text-sm">Spark</p>
          <p className="text-white/40 light:text-stone-500 text-xs">Your daily wisdom feed is ready</p>
        </div>
        <ChevronRight size={18} className="text-amber-400/50" />
      </div>
    </motion.button>
  );
}

export default SparkLockedCard;
