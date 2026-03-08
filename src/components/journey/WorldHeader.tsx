'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface WorldHeaderProps {
  worldName: string;
  worldSubtitle: string;
  worldImagePath: string;
  completedCount: number;
  totalCount: number;
  sageMessage: string;
  progressLabel: string;
}

export const WorldHeader = memo(function WorldHeader({
  worldName,
  worldSubtitle,
  worldImagePath,
  completedCount,
  totalCount,
  sageMessage,
  progressLabel,
}: WorldHeaderProps) {
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <motion.div
      className="relative px-4 pt-4 pb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Top row: Sage + Title + World art */}
      <div className="flex items-start gap-3">
        {/* Sage character */}
        <motion.div
          className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/30"
          style={{
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.2)',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <img
            src={`${basePath}/images/journey/sage.png`}
            alt="Sage"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Title area */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontStyle: 'italic',
              color: '#fef3c7',
              textShadow: '0 0 30px rgba(251, 191, 36, 0.15)',
            }}
          >
            {worldName}
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm mt-0.5" style={{ fontStyle: 'italic' }}>
            {worldSubtitle}
          </p>
        </div>

        {/* World art landmark (small, decorative) */}
        <motion.div
          className="flex-shrink-0 w-20 h-20 -mt-2 -mr-1 opacity-80"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <img
            src={`${basePath}${worldImagePath}`}
            alt=""
            className="w-full h-full object-contain drop-shadow-lg"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Sage speech bubble */}
      <motion.div
        className="mt-3 mx-2 px-4 py-2.5 rounded-xl border border-stone-700/40 bg-stone-900/40 backdrop-blur-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-stone-300 text-xs sm:text-sm leading-relaxed" style={{ fontStyle: 'italic' }}>
          {sageMessage}
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="mt-4 mx-2">
        <div className="h-2 bg-stone-800/60 rounded-full overflow-hidden border border-stone-700/30">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #ea580c)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
          />
        </div>
        <p className="text-center text-xs text-stone-500 mt-1.5">
          {progressLabel}
        </p>
      </div>
    </motion.div>
  );
});

export default WorldHeader;
