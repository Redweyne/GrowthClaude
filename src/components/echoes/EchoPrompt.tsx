'use client';

// ═══════════════════════════════════════════════════════════════════════════
// ECHO PROMPT - THE INVITATION TO TEACH
// ═══════════════════════════════════════════════════════════════════════════
//
// "The best way to learn is to teach."
//
// This prompt appears after completing a lesson, inviting users to
// reflect on another student's words. It's an invitation, not a demand.
// The framing emphasizes growth through service to others.
//
// ═══════════════════════════════════════════════════════════════════════════

import { motion } from 'framer-motion';
import { Users, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { useEchoesStore } from '@/store/useEchoesStore';
import { useTranslation } from '@/i18n';

interface EchoPromptProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function EchoPrompt({ onAccept, onDecline }: EchoPromptProps) {
  const { markEchoPromptSeen } = useEchoesStore();
  const { t, isRTL } = useTranslation();

  const handleDecline = () => {
    markEchoPromptSeen();
    onDecline();
  };

  const handleAccept = () => {
    markEchoPromptSeen();
    onAccept();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(12, 10, 9, 0.9)' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Backdrop glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-md bg-stone-900/90 backdrop-blur-xl border border-stone-800 rounded-3xl p-8 shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={handleDecline}
          className={`absolute top-4 p-2 text-stone-500 hover:text-stone-300 transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
                transform: 'scale(1.5)',
              }}
            />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
              <Users size={36} className="text-amber-400" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 mb-4"
        >
          {t('echoes.bestWayToLearn')}
        </motion.h2>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <p className="text-stone-300 leading-relaxed mb-4">
            {t('echoes.roleOfTeacher')}
          </p>
          <p className="text-stone-400 text-sm leading-relaxed">
            {t('echoes.reflectOnJourney')}
          </p>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 p-4 rounded-xl bg-stone-800/50 border border-stone-700/50"
        >
          <p className="text-stone-400 text-sm italic text-center">
            &ldquo;{t('echoes.byTeachingOthers')}&rdquo;
          </p>
          <p className="text-stone-500 text-xs text-center mt-2">
            — {t('echoes.proverb')}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button
            onClick={handleAccept}
            size="lg"
            glow
            className="w-full group"
          >
            <Heart size={18} className={`${isRTL ? 'ml-2' : 'mr-2'} group-hover:scale-110 transition-transform`} />
            {t('echoes.letsDoThat')}
          </Button>

          <button
            onClick={handleDecline}
            className="w-full py-3 text-stone-500 hover:text-stone-400 text-sm transition-colors"
          >
            {t('echoes.notRightNow')}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default EchoPrompt;
