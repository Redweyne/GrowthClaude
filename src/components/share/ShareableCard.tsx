'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { getLevelFromXp } from '@/types';
import { useTranslation } from '@/i18n';

type CardType = 'streak' | 'level' | 'journey';

interface ShareableCardProps {
  type: CardType;
  customMessage?: string;
  onClose: () => void;
}

export function ShareableCard({
  type,
  customMessage,
  onClose,
}: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { name, currentStreak, totalXp, getProgressStats } = useStore();
  const [copied, setCopied] = useState(false);
  const { t, locale } = useTranslation();

  const stats = getProgressStats();
  const level = getLevelFromXp(totalXp);

  const getCardContent = () => {
    switch (type) {
      case 'streak':
        return {
          title: t('share.cards.streak.title', { count: currentStreak }),
          subtitle: t('share.cards.streak.subtitle'),
          emoji: '🔥',
          message: customMessage || t('share.cards.streak.message', { count: currentStreak }),
          gradient: 'from-orange-500 to-red-600',
          stats: [
            { label: t('share.cards.streak.stats.days'), value: currentStreak },
            { label: t('share.cards.streak.stats.lessons'), value: stats.totalLessons },
            { label: t('share.cards.streak.stats.xp'), value: totalXp },
          ],
        };
      case 'level':
        return {
          title: t('share.cards.level.title', { level: level.level }),
          subtitle: level.title,
          emoji: '⭐',
          message: t('share.cards.level.message', { level: level.level, title: level.title }),
          gradient: 'from-purple-500 to-indigo-600',
          stats: [
            { label: t('share.cards.level.stats.level'), value: level.level },
            { label: t('share.cards.level.stats.title'), value: level.title },
            { label: t('share.cards.level.stats.xp'), value: totalXp },
          ],
        };
      case 'journey':
        return {
          title: t('share.cards.journey.title', { days: stats.daysSinceStart }),
          subtitle: t('share.cards.journey.subtitle'),
          emoji: '🦋',
          message: t('share.cards.journey.message', {
            days: stats.daysSinceStart,
            lessons: stats.totalLessons,
            words: stats.totalWords.toLocaleString(),
          }),
          gradient: 'from-emerald-500 to-teal-600',
          stats: [
            { label: t('share.cards.journey.stats.days'), value: stats.daysSinceStart },
            { label: t('share.cards.journey.stats.lessons'), value: stats.totalLessons },
            { label: t('share.cards.journey.stats.words'), value: stats.totalWords.toLocaleString() },
          ],
        };
    }
  };

  const content = getCardContent();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = async () => {
    // Note: For a real implementation, you'd use html2canvas or a similar library
    // For now, we'll just copy the message
    handleCopy();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('transformation.title'),
          text: content.message,
          url: window.location.origin,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled or failed');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-md"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 light:text-stone-500 hover:text-white light:hover:text-stone-900 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Card preview */}
          <div
            ref={cardRef}
            className={`bg-gradient-to-br ${content.gradient} rounded-2xl p-6 mb-4 shadow-2xl`}
          >
            {/* Header decoration */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
                <span className="w-2 h-2 bg-white/50 rounded-full" />
                {t('share.hubLabel')}
              </div>
              <div className="text-white/70 text-sm">
                {new Date().toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            {/* Main content */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{content.emoji}</div>
              <h2 className="text-3xl font-bold text-white mb-2">{content.title}</h2>
              <p className="text-white/80 text-lg">{content.subtitle}</p>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-6">
              {content.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/60 text-xs uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* User name */}
            {name && (
              <div className="text-center pt-4 border-t border-white/20">
                <p className="text-white/70 text-sm">
                  {t('share.achievedBy')} <span className="text-white font-semibold">{name}</span>
                </p>
              </div>
            )}
          </div>

          {/* Share message preview */}
          <div className="bg-stone-900 light:bg-stone-100 border border-stone-800 light:border-stone-300 rounded-xl p-4 mb-4">
            <p className="text-sm text-stone-400 light:text-stone-600 mb-2">{t('share.messageLabel')}</p>
            <p className="text-white light:text-stone-900">{content.message}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleCopy}
              variant="secondary"
              className="flex-1"
            >
              {copied ? (
                <>
                  <Check size={18} className="mr-2" />
                  {t('common.copied')}
                </>
              ) : (
                <>
                  <Copy size={18} className="mr-2" />
                  {t('common.copy')}
                </>
              )}
            </Button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                onClick={handleShare}
                className="flex-1"
              >
                <Share2 size={18} className="mr-2" />
                {t('common.share')}
              </Button>
            )}

            <Button
              onClick={handleDownload}
              variant="secondary"
              className="flex-1"
            >
              <Download size={18} className="mr-2" />
              {t('common.save')}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ShareableCard;
