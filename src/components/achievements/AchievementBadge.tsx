'use client';

// ============================================================================
// MILESTONE BADGE - A Visual Token of the Journey
// ============================================================================
//
// This is not a game badge. It's a marker of genuine human effort.
// Each badge carries the weight of what it took to earn it.
// ============================================================================

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { Milestone } from '@/types/achievements';
import {
  getVirtueColor,
  getVirtueGlow,
  getVirtueLabel,
  getVirtueGreek,
} from '@/types/achievements';

interface MilestoneBadgeProps {
  milestone: Milestone;
  unlocked: boolean;
  unlockedAt?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showDetails?: boolean;
}

// Legacy alias
interface AchievementBadgeProps extends MilestoneBadgeProps {
  achievement?: Milestone;
}

export function MilestoneBadge({
  milestone,
  unlocked,
  unlockedAt,
  size = 'md',
  onClick,
  showDetails = false,
}: MilestoneBadgeProps) {
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

  // Get the visual style based on virtue (not arbitrary rarity)
  const virtueColor = getVirtueColor(milestone.virtue);
  const virtueGlow = getVirtueGlow(milestone.virtue);

  return (
    <motion.button
      onClick={onClick}
      disabled={!onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={`relative group ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {/* Badge circle - styled by virtue */}
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          flex items-center justify-center
          transition-all duration-300
          relative
          ${unlocked
            ? `bg-gradient-to-br ${virtueColor} shadow-lg ${virtueGlow}`
            : 'bg-stone-800/50 light:bg-stone-200/80 border-2 border-stone-700/50 light:border-stone-300'
          }
        `}
      >
        {unlocked ? (
          <>
            <span className={iconSizes[size]}>{milestone.symbol}</span>
            {/* Inner glow for unlocked */}
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
          </>
        ) : (
          <Lock className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-stone-600 light:text-stone-500`} />
        )}

        {/* Shine effect for unlocked on hover */}
        {unlocked && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>

      {/* Virtue indicator (instead of rarity) */}
      {unlocked && (
        <div
          className={`
            absolute -bottom-1 left-1/2 -translate-x-1/2
            px-2 py-0.5 rounded-full
            text-[10px] font-medium
            bg-gradient-to-r ${virtueColor}
            text-white shadow-sm
          `}
        >
          {getVirtueLabel(milestone.virtue)}
        </div>
      )}

      {/* Details */}
      {showDetails && (
        <div className="mt-3 text-center max-w-[120px]">
          <h4
            className={`
              font-semibold
              ${unlocked ? 'text-white light:text-stone-900' : 'text-stone-500 light:text-stone-600'}
              ${size === 'sm' ? 'text-xs' : 'text-sm'}
            `}
          >
            {milestone.name}
          </h4>
          <p
            className={`
              text-stone-400 light:text-stone-600
              ${size === 'sm' ? 'text-[10px]' : 'text-xs'}
              mt-0.5 leading-tight
            `}
          >
            {unlocked ? milestone.meaning : `Unlock: ${milestone.requirement.value}${getRequirementUnit(milestone.requirement.type)}`}
          </p>
          {unlocked && unlockedAt && (
            <p className="text-[10px] text-stone-600 light:text-stone-500 mt-1">
              {formatDate(unlockedAt)}
            </p>
          )}
        </div>
      )}
    </motion.button>
  );
}

// Helper function to get human-readable requirement units
function getRequirementUnit(type: string): string {
  switch (type) {
    case 'streak': return ' days';
    case 'lessons': return ' lessons';
    case 'reflections': return ' reflections';
    case 'identity': return ' statements';
    case 'xp': return ' XP';
    default: return '';
  }
}

// Legacy component alias
export function AchievementBadge(props: AchievementBadgeProps) {
  const milestone = props.achievement || props.milestone;
  return <MilestoneBadge {...props} milestone={milestone} />;
}

// ============================================================================
// MILESTONE UNLOCK ANIMATION - A Moment of Acknowledgment
// ============================================================================
//
// This is the moment where we honor what the user has accomplished.
// Not with confetti and noise, but with meaning and wisdom.
// ============================================================================

interface MilestoneUnlockAnimationProps {
  milestone: Milestone;
  onComplete: () => void;
}

// Legacy alias
interface AchievementUnlockAnimationProps extends MilestoneUnlockAnimationProps {
  achievement?: Milestone;
}

export function MilestoneUnlockAnimation({
  milestone,
  onComplete,
}: MilestoneUnlockAnimationProps) {
  const virtueColor = getVirtueColor(milestone.virtue);
  const virtueGlow = getVirtueGlow(milestone.virtue);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onComplete}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* Ambient glow behind everything */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2, 1.8], opacity: [0, 0.3, 0.15] }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${virtueColor} blur-3xl pointer-events-none`}
          style={{ margin: 'auto', width: '300px', height: '300px' }}
        />

        {/* The virtue being honored */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-stone-500 light:text-stone-500 text-sm tracking-wider mb-6"
        >
          A milestone of {getVirtueLabel(milestone.virtue).toLowerCase()}
        </motion.p>

        {/* The symbol */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 150, delay: 0.5 }}
          className={`
            w-28 h-28 rounded-full
            bg-gradient-to-br ${virtueColor}
            shadow-2xl ${virtueGlow}
            flex items-center justify-center
            mx-auto mb-8
            relative
          `}
        >
          <span className="text-6xl relative z-10">{milestone.symbol}</span>
          {/* Inner light */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.2] }}
            transition={{ duration: 2, delay: 0.8 }}
            className="absolute inset-0 rounded-full bg-white/20"
          />
        </motion.div>

        {/* The name */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-3xl font-bold text-white light:text-stone-900 mb-2"
        >
          {milestone.name}
        </motion.h2>

        {/* The meaning */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="text-lg text-stone-300 light:text-stone-700 mb-6"
        >
          {milestone.meaning}
        </motion.p>

        {/* The personal message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-stone-900/50 light:bg-stone-200/50 rounded-xl p-5 mb-6 border border-stone-800/50 light:border-stone-200/50"
        >
          <p className="text-stone-300 light:text-stone-700 text-sm leading-relaxed italic">
            &ldquo;{milestone.message}&rdquo;
          </p>
        </motion.div>

        {/* The wisdom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-8"
        >
          <p className="text-stone-400 light:text-stone-600 text-sm leading-relaxed">
            &ldquo;{milestone.wisdom.text}&rdquo;
          </p>
          <p className="text-stone-600 light:text-stone-500 text-xs mt-2">
            — {milestone.wisdom.author}
          </p>
        </motion.div>

        {/* Greek virtue label - subtle touch */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-stone-700 light:text-stone-500 text-xs tracking-widest"
        >
          {getVirtueGreek(milestone.virtue)}
        </motion.p>

        {/* Continue prompt */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-stone-600 light:text-stone-500 text-sm mt-8"
        >
          Tap to continue
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// Legacy alias
export function AchievementUnlockAnimation(props: AchievementUnlockAnimationProps) {
  const milestone = props.achievement || props.milestone;
  return <MilestoneUnlockAnimation {...props} milestone={milestone} />;
}

export default MilestoneBadge;
