'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Bug, Heart, HelpCircle, Send, Sparkles } from 'lucide-react';
import type { AgoraCategory } from '@/types/agora';
import { useTranslation } from '@/i18n';
import { useHaptics } from '@/hooks/useHaptics';

interface AgoraNewPostModalProps {
  onSubmit: (content: string, category: AgoraCategory) => Promise<void>;
  onClose: () => void;
}

const CATEGORIES: { id: AgoraCategory; icon: typeof Lightbulb; gradient: string; bg: string; border: string; activeGlow: string }[] = [
  {
    id: 'idea',
    icon: Lightbulb,
    gradient: 'from-blue-400 to-cyan-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    activeGlow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
  },
  {
    id: 'bug',
    icon: Bug,
    gradient: 'from-red-400 to-rose-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    activeGlow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  },
  {
    id: 'love',
    icon: Heart,
    gradient: 'from-pink-400 to-rose-300',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    activeGlow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]',
  },
  {
    id: 'question',
    icon: HelpCircle,
    gradient: 'from-emerald-400 to-teal-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    activeGlow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]',
  },
];

export function AgoraNewPostModal({ onSubmit, onClose }: AgoraNewPostModalProps) {
  const { t, isRTL } = useTranslation();
  const { hapticLight, hapticSuccess } = useHaptics();
  const [category, setCategory] = useState<AgoraCategory | null>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = category !== null && wordCount >= 3 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit || !category) return;
    setIsSubmitting(true);
    hapticLight();
    try {
      await onSubmit(content.trim(), category);
      hapticSuccess();
      setShowSuccess(true);
      setTimeout(() => onClose(), 1200);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-4 mb-4 sm:mb-0"
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-stone-900/95 light:bg-white/95 backdrop-blur-xl border border-stone-800/60 light:border-stone-200 rounded-3xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.6, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center"
              >
                <Sparkles size={28} className="text-amber-400" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-stone-100 light:text-stone-900"
              >
                {t('agora.postPublished')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-sm text-stone-400 light:text-stone-600 mt-1"
              >
                {t('agora.thankYou')}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              className="bg-stone-900/95 light:bg-white/95 backdrop-blur-xl border border-stone-800/60 light:border-stone-200 rounded-3xl overflow-hidden"
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-5 pb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-lg font-bold text-stone-100 light:text-stone-900">
                  {t('agora.newPost')}
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-stone-800/60 light:bg-stone-100 flex items-center justify-center hover:bg-stone-700 light:hover:bg-stone-200 transition-colors"
                >
                  <X size={16} className="text-stone-400" />
                </button>
              </div>

              {/* Category picker */}
              <div className={`px-5 pb-4 ${isRTL ? 'text-right' : ''}`}>
                <p className="text-xs uppercase tracking-wider text-stone-500 mb-3">
                  {t('agora.pickCategory')}
                </p>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = category === cat.id;
                    return (
                      <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => { setCategory(cat.id); hapticLight(); }}
                        className={`
                          flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-300
                          ${isActive
                            ? `${cat.bg} ${cat.border} ${cat.activeGlow}`
                            : 'bg-stone-800/40 light:bg-stone-100/60 border-stone-700/30 light:border-stone-300 hover:border-stone-600'
                          }
                        `}
                      >
                        <Icon
                          size={20}
                          className={`transition-colors duration-300 ${isActive ? `bg-gradient-to-r ${cat.gradient} bg-clip-text` : 'text-stone-500'}`}
                          style={isActive ? { color: cat.id === 'idea' ? '#60a5fa' : cat.id === 'bug' ? '#f87171' : cat.id === 'love' ? '#f472b6' : '#34d399' } : undefined}
                        />
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'text-stone-200 light:text-stone-800' : 'text-stone-600'}`}>
                          {t(`agora.category${cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}` as 'agora.categoryIdea')}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Textarea */}
              <div className="px-5 pb-4">
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, 500))}
                    placeholder={t('agora.postPlaceholder')}
                    rows={4}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="w-full rounded-xl px-4 py-3 bg-stone-800/60 light:bg-stone-100 border border-stone-700/40 light:border-stone-300 text-stone-200 light:text-stone-800 text-sm placeholder:text-stone-600 focus:border-amber-500/40 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300 resize-none"
                  />
                  <div className={`flex items-center justify-between mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-[10px] ${wordCount >= 3 ? 'text-stone-500' : 'text-stone-600'}`}>
                      {wordCount}/3 {t('agora.minWords')}
                    </span>
                    <span className="text-[10px] text-stone-600">
                      {content.length}/500
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="px-5 pb-5">
                <motion.button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  whileHover={canSubmit ? { scale: 1.01 } : undefined}
                  whileTap={canSubmit ? { scale: 0.98 } : undefined}
                  className={`
                    w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300
                    ${canSubmit
                      ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 text-stone-950 shadow-lg shadow-amber-500/20'
                      : 'bg-stone-800/60 text-stone-600 cursor-not-allowed'
                    }
                  `}
                >
                  <Send size={16} className={isRTL ? 'rotate-180' : ''} />
                  {isSubmitting ? t('agora.posting') : t('agora.submitPost')}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
