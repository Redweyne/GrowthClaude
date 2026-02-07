'use client';

import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// ═══════════════════════════════════════════════════════════════════════════
// SPARK UNLOCK SCREEN — Redesigned
// Clean, bold celebration. Mobile-first, TikTok energy.
// ═══════════════════════════════════════════════════════════════════════════

interface SparkUnlockScreenProps {
  onEnterSpark: () => void;
  onSkip: () => void;
}

export function SparkUnlockScreen({ onEnterSpark, onSkip }: SparkUnlockScreenProps) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.08) 0%, transparent 60%)',
        }}
      />

      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-amber-400/60"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2.5 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-sm mx-auto px-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mx-auto mb-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
        >
          <div className="relative w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
            <Zap size={36} className="text-amber-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-amber-400/60 text-xs font-medium tracking-[0.2em] uppercase mb-3">
            You&apos;ve Unlocked
          </p>
          <h1 className="text-6xl font-black text-white mb-5 tracking-tight">
            SPARK
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-white/60 text-base leading-relaxed mb-2">
            Your daily dose of wisdom and motivation from the world&apos;s greatest minds.
          </p>
          <p className="text-white/30 text-sm leading-relaxed mb-10">
            But remember — watching isn&apos;t growing. We&apos;ll remind you when it&apos;s time to act.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full mb-5"
            onClick={onEnterSpark}
            glow
            sound="celebrate"
          >
            <Zap size={20} className="mr-2" />
            Enter Spark
            <ArrowRight size={18} className="ml-2" />
          </Button>

          <button
            onClick={onSkip}
            className="text-white/20 text-sm hover:text-white/40 transition-colors"
          >
            Maybe later
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SparkUnlockScreen;
