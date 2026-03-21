'use client';

import { motion } from 'framer-motion';
import { Landmark, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface AgoraCTAProps {
  onClick: () => void;
}

export function AgoraCTA({ onClick }: AgoraCTAProps) {
  const { t, isRTL } = useTranslation();

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="w-full group relative"
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(251,191,36,0.4), rgba(249,115,22,0.3), rgba(251,191,36,0.2), rgba(249,115,22,0.4))',
          backgroundSize: '300% 300%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Pulsing ambient glow */}
      <motion.div
        className="absolute -inset-2 rounded-3xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 0px rgba(251,191,36,0)',
            '0 0 24px rgba(251,191,36,0.12)',
            '0 0 0px rgba(251,191,36,0)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Card content */}
      <div className={`relative flex items-center gap-4 p-4 rounded-2xl bg-stone-900/90 light:bg-white/90 backdrop-blur-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Icon with glow */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-xl bg-amber-500/20 blur-md" />
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/15 to-orange-500/15 border border-amber-500/25 flex items-center justify-center">
            <Landmark size={22} className="text-amber-400" />
          </div>
        </div>

        {/* Text */}
        <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
          <p className="text-sm font-semibold text-stone-100 light:text-stone-900">
            {t('agora.ctaTitle')}
          </p>
          <p className="text-xs text-stone-400 light:text-stone-500 mt-0.5">
            {t('agora.ctaSubtitle')}
          </p>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0">
          {isRTL ? (
            <ChevronLeft size={18} className="text-stone-500 group-hover:text-amber-400 transition-colors duration-300" />
          ) : (
            <ChevronRight size={18} className="text-stone-500 group-hover:text-amber-400 transition-colors duration-300" />
          )}
        </div>
      </div>
    </motion.button>
  );
}
