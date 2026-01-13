'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'green' | 'amber' | 'rose';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  size = 'md',
  color = 'indigo',
  showLabel = false,
  animated = true,
  className = '',
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    indigo: 'from-indigo-600 to-purple-600',
    green: 'from-emerald-600 to-teal-600',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-600 to-pink-600',
  };

  const glowColors = {
    indigo: 'shadow-indigo-500/50',
    green: 'shadow-emerald-500/50',
    amber: 'shadow-amber-500/50',
    rose: 'shadow-rose-500/50',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-zinc-400">Progress</span>
          <span className="text-xs font-bold text-zinc-300">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      <div
        className={`w-full bg-zinc-800 rounded-full overflow-hidden ${heights[size]}`}
      >
        <motion.div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full shadow-lg ${glowColors[color]}`}
          initial={animated ? { width: 0 } : { width: `${clampedProgress}%` }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
