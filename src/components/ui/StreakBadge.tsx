'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function StreakBadge({
  streak,
  size = 'md',
  showLabel = false,
  animated = false,
}: StreakBadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  // Color intensity based on streak length
  const getStreakColor = () => {
    if (streak >= 30) return 'text-orange-400 fill-orange-400';
    if (streak >= 14) return 'text-orange-500 fill-orange-500';
    if (streak >= 7) return 'text-amber-500 fill-amber-500';
    return 'text-amber-600 fill-amber-600';
  };

  const getBgColor = () => {
    if (streak >= 30) return 'bg-orange-500/10 border-orange-500/30';
    if (streak >= 14) return 'bg-orange-500/10 border-orange-500/30';
    if (streak >= 7) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-amber-600/10 border-amber-600/30';
  };

  const content = (
    <>
      <Flame size={iconSizes[size]} className={getStreakColor()} />
      <span className={`font-bold ${getStreakColor().split(' ')[0]}`}>
        {streak}
      </span>
      {showLabel && (
        <span className="text-zinc-500 font-normal">
          {streak === 1 ? 'day' : 'days'}
        </span>
      )}
    </>
  );

  const className = `inline-flex items-center gap-1 border rounded-full ${sizes[size]} ${getBgColor()}`;

  if (animated && streak > 0) {
    return (
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={className}>{content}</div>;
}

export default StreakBadge;
