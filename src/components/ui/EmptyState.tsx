'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  onCta,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      className={`text-center py-12 ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="mx-auto w-14 h-14 rounded-2xl bg-stone-900/50 light:bg-stone-100/90 border border-stone-800 light:border-stone-300 flex items-center justify-center text-stone-500 light:text-stone-600 mb-4"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {icon}
      </motion.div>

      <h3 className="text-lg font-semibold text-stone-100 light:text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-400 light:text-stone-600 max-w-sm mx-auto">{description}</p>

      {ctaLabel && onCta && (
        <div className="mt-5">
          <Button onClick={onCta} size="sm">
            {ctaLabel}
          </Button>
        </div>
      )}
    </motion.div>
  );
}

export default EmptyState;
