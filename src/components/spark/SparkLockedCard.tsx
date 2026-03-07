'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight, Lock, Zap } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface SparkLockedCardProps {
  isUnlocked: boolean;
  isForcedClosed?: boolean;
  onOpen: () => void;
}

export function SparkLockedCard({ isUnlocked, isForcedClosed, onOpen }: SparkLockedCardProps) {
  const { locale } = useTranslation();
  const copy = {
    en: {
      lockedTeaser: 'Complete your daily flow to unlock Spark.',
      doneTitle: 'Spark - Done for today',
      doneSub: 'Time to act on what you watched.',
      spark: 'Spark',
      completeToUnlock: "Complete today's practice to unlock",
      ready: 'Your daily wisdom feed is ready',
    },
    fr: {
      lockedTeaser: 'Terminez votre routine quotidienne pour débloquer Spark.',
      doneTitle: "Spark - Terminé pour aujourd'hui",
      doneSub: 'Il est temps de mettre en pratique ce que vous avez regardé.',
      spark: 'Spark',
      completeToUnlock: "Terminez la pratique d'aujourd'hui pour débloquer",
      ready: 'Votre flux quotidien de sagesse est prêt',
    },
    ar: {
      lockedTeaser: 'أكمل مسارك اليومي لفتح Spark.',
      doneTitle: 'Spark - اكتمل لليوم',
      doneSub: 'حان وقت تطبيق ما شاهدته.',
      spark: 'Spark',
      completeToUnlock: 'أكمل تدريب اليوم لفتح الميزة',
      ready: 'خلاصة الحكمة اليومية جاهزة',
    },
  } as const;
  const c = copy[locale] ?? copy.en;

  if (isForcedClosed) {
    return (
      <div className="p-4 rounded-2xl bg-stone-900/30 light:bg-stone-100/30 border border-stone-800/50 light:border-stone-300/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-800/50 light:bg-stone-300/50 flex items-center justify-center">
            <CheckCircle size={18} className="text-stone-600 light:text-stone-400" />
          </div>
          <div className="flex-1">
            <p className="text-stone-500 font-medium text-sm">{c.doneTitle}</p>
            <p className="text-stone-600 light:text-stone-400 text-xs">{c.doneSub}</p>
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
            <p className="text-stone-600 light:text-stone-400 font-medium text-sm">{c.spark}</p>
            <p className="text-stone-700 light:text-stone-400 text-xs">{c.completeToUnlock}</p>
          </div>
          <Zap size={16} className="text-stone-800 light:text-stone-300" />
        </div>
        <p className="mt-2 text-stone-700/60 light:text-stone-400/60 text-[11px] italic pl-[52px]">{c.lockedTeaser}</p>
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
          <p className="text-white light:text-stone-900 font-medium text-sm">{c.spark}</p>
          <p className="text-white/40 light:text-stone-500 text-xs">{c.ready}</p>
        </div>
        <ChevronRight size={18} className="text-amber-400/50" />
      </div>
    </motion.button>
  );
}

export default SparkLockedCard;
