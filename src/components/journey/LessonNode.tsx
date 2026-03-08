'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import type { ChapterTheme } from '@/lib/chapterThemes';

type LessonStatus = 'completed' | 'active' | 'accessible' | 'locked';

interface LessonNodeProps {
  title: string;
  xpReward: number;
  status: LessonStatus;
  index: number;
  theme: ChapterTheme;
  onSelect: () => void;
  completedLabel: string;
  xpLabel: string;
  enterLabel: string;
}

export const LessonNode = memo(function LessonNode({
  title,
  xpReward,
  status,
  index,
  theme,
  onSelect,
  completedLabel,
  xpLabel,
  enterLabel,
}: LessonNodeProps) {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isLocked = status === 'locked';
  const isAccessible = status === 'accessible' || isActive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      className="relative"
    >
      <button
        onClick={isAccessible || isCompleted ? onSelect : undefined}
        disabled={isLocked}
        className={`
          w-full text-left px-4 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300
          ${isCompleted
            ? 'bg-emerald-500/10 border-emerald-500/25 hover:border-emerald-400/40'
            : isActive
            ? 'border-2 hover:scale-[1.01]'
            : isAccessible
            ? 'bg-white/5 border-stone-700/30 hover:border-stone-600/50'
            : 'bg-black/20 border-stone-800/30 opacity-50'
          }
        `}
        style={isActive ? {
          borderColor: theme.colors.nodeActiveBorder,
          backgroundColor: theme.colors.nodeBg,
          boxShadow: `0 0 20px ${theme.colors.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
        } : undefined}
      >
        <div className="flex items-center gap-3">
          {/* Status icon */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
              isCompleted
                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300/50'
                : isActive
                ? 'border-2'
                : isAccessible
                ? 'bg-stone-800/50 border-stone-600/50'
                : 'bg-stone-900/50 border-stone-800/40'
            }`}
            style={isActive ? {
              borderColor: theme.colors.primary,
              background: `linear-gradient(135deg, ${theme.colors.primary}33, ${theme.colors.accent}33)`,
            } : undefined}
          >
            {isCompleted ? (
              <CheckCircle size={20} className="text-white" />
            ) : isLocked ? (
              <Lock size={16} className="text-stone-600" />
            ) : (
              <span
                className="text-sm font-bold"
                style={{ color: isActive ? theme.colors.primary : '#a8a29e' }}
              >
                {index + 1}
              </span>
            )}

            {/* Pulse ring for active lesson */}
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ borderColor: theme.colors.primary }}
                animate={{
                  boxShadow: [
                    `0 0 0 0px ${theme.colors.glow}`,
                    `0 0 0 8px transparent`,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            )}
          </div>

          {/* Lesson info */}
          <div className="flex-1 min-w-0">
            <p
              className={`font-medium text-sm truncate ${
                isCompleted ? 'text-emerald-300' : isLocked ? 'text-stone-600' : ''
              }`}
              style={!isCompleted && !isLocked ? { color: theme.colors.text } : undefined}
            >
              {title}
            </p>
            <p className={`text-xs ${isLocked ? 'text-stone-700' : 'text-stone-500'}`}>
              {isCompleted ? `✓ ${completedLabel}` : `${xpReward} ${xpLabel}`}
            </p>
          </div>

          {/* Enter button for active lesson */}
          {isActive && (
            <motion.div
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                color: '#1c1917',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {enterLabel}
            </motion.div>
          )}
        </div>
      </button>
    </motion.div>
  );
});

export default LessonNode;
