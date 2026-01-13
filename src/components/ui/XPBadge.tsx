'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showIcon?: boolean;
}

export function XPBadge({
  xp,
  size = 'md',
  animated = false,
  showIcon = true,
}: XPBadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  const content = (
    <>
      {showIcon && (
        <Zap
          size={iconSizes[size]}
          className="text-amber-400 fill-amber-400"
        />
      )}
      <span className="font-bold text-amber-400">{xp} XP</span>
    </>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded-full ${sizes[size]}`}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded-full ${sizes[size]}`}
    >
      {content}
    </div>
  );
}

export default XPBadge;
