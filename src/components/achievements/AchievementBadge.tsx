'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { Achievement, AchievementRarity } from '@/types/achievements';
import { getRarityColor, getRarityGlow, getRarityLabel } from '@/types/achievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  unlockedAt?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showDetails?: boolean;
}

export function AchievementBadge({
  achievement,
  unlocked,
  unlockedAt,
  size = 'md',
  onClick,
  showDetails = false,
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  const iconSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={!onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={`relative group ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {/* Badge circle */}
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          flex items-center justify-center
          transition-all duration-300
          ${unlocked
            ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} shadow-lg ${getRarityGlow(achievement.rarity)}`
            : 'bg-zinc-800/50 border-2 border-zinc-700/50'
          }
        `}
      >
        {unlocked ? (
          <span className={iconSizes[size]}>{achievement.icon}</span>
        ) : (
          <Lock className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-zinc-600`} />
        )}

        {/* Shine effect for unlocked */}
        {unlocked && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {/* Rarity indicator */}
      {unlocked && (
        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white shadow-sm`}>
          {getRarityLabel(achievement.rarity)}
        </div>
      )}

      {/* Details tooltip/card */}
      {showDetails && (
        <div className="mt-3 text-center">
          <h4 className={`font-semibold ${unlocked ? 'text-white' : 'text-zinc-500'} ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            {achievement.name}
          </h4>
          <p className={`text-zinc-500 ${size === 'sm' ? 'text-[10px]' : 'text-xs'} mt-0.5`}>
            {unlocked ? achievement.description : achievement.condition}
          </p>
          {unlocked && unlockedAt && (
            <p className="text-[10px] text-zinc-600 mt-1">
              {formatDate(unlockedAt)}
            </p>
          )}
          {!unlocked && (
            <p className="text-[10px] text-amber-400/70 mt-1">
              +{achievement.xpBonus} XP
            </p>
          )}
        </div>
      )}
    </motion.button>
  );
}

// Animated unlock version
interface AchievementUnlockAnimationProps {
  achievement: Achievement;
  onComplete: () => void;
}

export function AchievementUnlockAnimation({
  achievement,
  onComplete,
}: AchievementUnlockAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
        className="text-center"
      >
        {/* Glow effect */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2, 1.5], opacity: [0, 0.5, 0] }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} blur-3xl`}
        />

        {/* Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`w-32 h-32 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} shadow-2xl ${getRarityGlow(achievement.rarity)} flex items-center justify-center mx-auto mb-6`}
        >
          <span className="text-6xl">{achievement.icon}</span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-amber-400 text-sm font-medium mb-2">Achievement Unlocked!</p>
          <h2 className="text-3xl font-bold text-white mb-2">{achievement.name}</h2>
          <p className="text-zinc-400 mb-4">{achievement.description}</p>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
          >
            <span className="text-white font-semibold">+{achievement.xpBonus} XP</span>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-zinc-500 text-sm mt-8"
        >
          Tap anywhere to continue
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default AchievementBadge;
