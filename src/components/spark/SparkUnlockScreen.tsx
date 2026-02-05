'use client';

import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AmbientBackground } from '@/components/ambient';

// ═══════════════════════════════════════════════════════════════════════════
// SPARK UNLOCK SCREEN
// Celebratory first-time unlock after completing the daily loop
// Sets the tone: "This is your reward, but we're not TikTok"
// ═══════════════════════════════════════════════════════════════════════════

interface SparkUnlockScreenProps {
  onEnterSpark: () => void;
  onSkip: () => void;
}

export function SparkUnlockScreen({ onEnterSpark, onSkip }: SparkUnlockScreenProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <AmbientBackground intensity="vivid" particleCount={25} orbCount={5} />

      {/* Floating sparks */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-400"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
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
        {/* Spark icon with glow */}
        <motion.div
          className="mx-auto mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
        >
          <div className="relative">
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 w-24 h-24 mx-auto rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Icon */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Zap size={40} className="text-amber-400" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-amber-400/80 text-sm font-medium tracking-wider uppercase mb-2">
            You&apos;ve Unlocked
          </p>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent mb-4">
            SPARK
          </h1>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-stone-300 text-lg leading-relaxed mb-2">
            Your daily reward: an endless stream of wisdom and motivation from voices around the world.
          </p>
          <p className="text-stone-500 text-sm leading-relaxed mb-8">
            But remember — watching isn&apos;t growing. We&apos;ll remind you when it&apos;s time to stop and act.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full mb-4"
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
            className="text-stone-600 text-sm hover:text-stone-500 transition-colors"
          >
            Maybe later
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SparkUnlockScreen;
