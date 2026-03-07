'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';

interface SparkUnlockScreenProps {
  onEnterSpark: () => void;
  onSkip: () => void;
}

const PARTICLES = [
  { left: '18%', top: '20%', duration: 2.8, delay: 0.1 },
  { left: '28%', top: '62%', duration: 3.1, delay: 0.6 },
  { left: '40%', top: '34%', duration: 2.6, delay: 1.1 },
  { left: '52%', top: '70%', duration: 3.3, delay: 1.6 },
  { left: '63%', top: '28%', duration: 2.9, delay: 0.35 },
  { left: '74%', top: '58%', duration: 3.0, delay: 1.4 },
  { left: '82%', top: '36%', duration: 2.7, delay: 0.8 },
  { left: '66%', top: '80%', duration: 3.2, delay: 1.9 },
] as const;

export function SparkUnlockScreen({ onEnterSpark, onSkip }: SparkUnlockScreenProps) {
  const { locale } = useTranslation();
  const copy = {
    en: {
      unlocked: "You've Unlocked",
      description: 'Your daily feed of short, high-energy wisdom.',
      subDescription: 'Swipe vertically, stay focused, and act on what resonates.',
      enterSpark: 'Enter Spark',
      maybeLater: 'Maybe later',
    },
    fr: {
      unlocked: 'Vous avez débloqué',
      description: "Votre flux quotidien de sagesse courte et puissante.",
      subDescription: 'Glissez verticalement, restez concentré, puis passez à l’action.',
      enterSpark: 'Entrer dans Spark',
      maybeLater: 'Peut-être plus tard',
    },
    ar: {
      unlocked: 'لقد فتحت',
      description: 'خلاصتك اليومية من حكمة قصيرة وعالية الطاقة.',
      subDescription: 'اسحب عمودياً، وابقَ مركزاً، وتصرف وفق ما يلامسك.',
      enterSpark: 'الدخول إلى Spark',
      maybeLater: 'ربما لاحقاً',
    },
  } as const;
  const c = copy[locale] ?? copy.en;

  return (
    <div className="fixed inset-0 bg-black light:bg-stone-50 flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.08) 0%, transparent 60%)',
        }}
      />

      {PARTICLES.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute w-0.5 h-0.5 rounded-full bg-amber-400/60 light:bg-amber-500/40"
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
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
          <p className="text-amber-400/60 light:text-amber-600/60 text-xs font-medium tracking-[0.2em] uppercase mb-3">
            {c.unlocked}
          </p>
          <h1 className="text-6xl font-black text-white light:text-stone-900 mb-5 tracking-tight">
            SPARK
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-white/60 light:text-stone-700 text-base leading-relaxed mb-2">
            {c.description}
          </p>
          <p className="text-white/30 light:text-stone-500 text-sm leading-relaxed mb-10">
            {c.subDescription}
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
            {c.enterSpark}
            <ArrowRight size={18} className="ml-2" />
          </Button>

          <button
            type="button"
            onClick={onSkip}
            className="text-white/20 light:text-stone-400 text-sm hover:text-white/40 light:hover:text-stone-600 transition-colors"
          >
            {c.maybeLater}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SparkUnlockScreen;
