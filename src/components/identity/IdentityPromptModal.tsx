'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { useAudio } from '@/hooks/useAudio';
import type { IdentityContext } from '@/types/identity';
import { IDENTITY_PROMPTS, getRandomIdentityPrompt } from '@/types/identity';
import { useTranslation } from '@/i18n';

interface IdentityPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: IdentityContext;
  suggestedPrompt?: string;
  milestoneMessage?: string;
}

export function IdentityPromptModal({
  isOpen,
  onClose,
  context,
  suggestedPrompt,
  milestoneMessage,
}: IdentityPromptModalProps) {
  const { saveIdentityStatement, name } = useStore();
  const { playTap, playSparkle } = useAudio();
  const { t, isRTL } = useTranslation();

  const [statement, setStatement] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(getRandomIdentityPrompt());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (statement.trim().length < 10) return;

    setIsSubmitting(true);
    playTap();

    // Extract tags from the statement
    const tags: string[] = [];
    const keywords = ['discipline', 'calm', 'patient', 'courage', 'growth', 'consistent', 'grateful'];
    keywords.forEach(keyword => {
      if (statement.toLowerCase().includes(keyword)) {
        tags.push(keyword);
      }
    });

    // Save the identity statement
    saveIdentityStatement(statement, context, tags);

    // Show success animation
    setTimeout(() => {
      setShowSuccess(true);
      playSparkle();

      setTimeout(() => {
        onClose();
        setStatement('');
        setShowSuccess(false);
        setIsSubmitting(false);
      }, 1500);
    }, 500);
  };

  const cyclePrompt = () => {
    playTap();
    setSelectedPrompt(getRandomIdentityPrompt());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 light:bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className={`bg-gradient-to-b from-stone-900 light:from-stone-100 to-stone-950 light:to-stone-50 border border-stone-800 light:border-stone-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl ${isRTL ? 'rtl' : ''}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-500 light:text-stone-500 hover:text-stone-300 light:hover:text-stone-700 transition-colors"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-amber-400" />
            </motion.div>

            <h2 className="text-xl font-bold text-white light:text-stone-900 text-center mb-2">
              {t('identity.defineWhoYouAre')}
            </h2>

            {milestoneMessage && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-amber-400/80 text-center mb-2"
              >
                {milestoneMessage}
              </motion.p>
            )}

            <p className="text-stone-400 light:text-stone-600 text-center text-sm">
              {t('identity.completeStatement').replace('{name}', name || '')}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {/* Prompt suggestion */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <button
                onClick={cyclePrompt}
                className={`w-full p-3 rounded-xl bg-stone-800/50 light:bg-stone-200/50 border border-stone-700/50 light:border-stone-300/50 hover:border-amber-500/30 transition-colors group ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <p className={`text-xs text-stone-500 light:text-stone-500 mb-1 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span>{t('identity.promptInspiration')}</span>
                  <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                    {t('identity.tapForAnother')}
                  </span>
                </p>
                <p className="text-sm text-stone-300 light:text-stone-700 italic">
                  &ldquo;{selectedPrompt.prompt}&rdquo;
                </p>
              </button>
            </motion.div>

            {/* Input area */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <label className={`block text-sm text-stone-400 light:text-stone-600 mb-2 ${isRTL ? 'text-right' : ''}`}>
                {t('identity.yourIdentityStatement')}
              </label>
              <div className="relative">
                <span className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-4 text-amber-400 font-medium`}>
                  {t('identity.iAmSomeoneWho')}
                </span>
                <textarea
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder={t('identity.statementPlaceholder')}
                  className={`w-full h-32 bg-stone-800/50 light:bg-stone-200/50 border border-stone-700 light:border-stone-300 rounded-xl px-4 pt-12 pb-4 text-white light:text-stone-900 placeholder-stone-600 light:placeholder-stone-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none ${isRTL ? 'text-right' : ''}`}
                  disabled={isSubmitting}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              <p className={`text-xs text-stone-500 light:text-stone-500 mt-2 ${isRTL ? 'text-right' : ''}`}>
                {t('identity.example')}: &ldquo;{suggestedPrompt || selectedPrompt.example}&rdquo;
              </p>
            </motion.div>

            {/* Success state */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 bg-stone-900/95 light:bg-stone-100/95 flex items-center justify-center rounded-2xl"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="text-6xl mb-4"
                    >
                      🦋
                    </motion.div>
                    <p className="text-xl font-bold text-white light:text-stone-900">{t('identity.identityClaimed')}</p>
                    <p className="text-amber-400 text-sm mt-1">+25 {t('common.xp')}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              disabled={statement.trim().length < 10 || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  {t('identity.claiming')}
                </span>
              ) : (
                <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Send size={18} />
                  {t('identity.claimThisIdentity')}
                </span>
              )}
            </Button>

            {statement.trim().length > 0 && statement.trim().length < 10 && (
              <p className="text-xs text-red-400 text-center mt-2">
                {t('identity.minCharacters')}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default IdentityPromptModal;
