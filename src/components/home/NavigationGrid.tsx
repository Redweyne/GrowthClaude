'use client';

import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import {
  BarChart3,
  Trophy,
  Sparkles,
  Brain,
  Map,
  TrendingUp,
  Globe,
  type LucideIcon,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION GRID
// A premium bottom navigation with beautiful micro-interactions
// Each button has its own personality through color and animation
// ═══════════════════════════════════════════════════════════════════════════

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  glowColor: string;
  onClick: () => void;
  badge?: string | number;
}

interface NavigationGridProps {
  onOpenProgress: () => void;
  onOpenAchievements: () => void;
  onOpenIdentity: () => void;
  onOpenPractice: () => void;
  onOpenMap: () => void;
  onOpenTransformation: () => void;
  onOpenWorlds: () => void;
  streak: number;
  hasPracticeAvailable: boolean;
  hasTransformationAvailable: boolean;
}

// Spring configurations
const springs = {
  responsive: { type: 'spring' as const, stiffness: 300, damping: 20 },
  bouncy: { type: 'spring' as const, stiffness: 500, damping: 15 },
};

// Individual nav button component
function NavButton({
  item,
  index,
}: {
  item: NavItem;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      onClick={item.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className="relative flex flex-col items-center gap-2 p-4 rounded-2xl bg-stone-900/40 backdrop-blur-sm border border-stone-800/60 transition-colors duration-300 group overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.05, ...springs.responsive }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Hover background glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at center, ${item.glowColor} 0%, transparent 70%)`,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? `0 0 20px ${item.glowColor}, inset 0 0 0 1px ${item.color}40`
            : 'none',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon container */}
      <motion.div
        className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300"
        style={{
          backgroundColor: isHovered ? `${item.color}20` : 'rgba(41, 37, 36, 0.5)',
        }}
        animate={{
          scale: isPressed ? 0.9 : 1,
        }}
        transition={springs.bouncy}
      >
        {/* Icon */}
        <item.icon
          size={22}
          className="transition-colors duration-300"
          style={{
            color: isHovered ? item.color : '#a8a29e',
          }}
        />

        {/* Badge */}
        {item.badge && (
          <motion.div
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={springs.bouncy}
          >
            <span className="text-[10px] font-bold text-stone-950">
              {item.badge}
            </span>
          </motion.div>
        )}

        {/* Ripple effect on press */}
        {isPressed && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ backgroundColor: item.color }}
          />
        )}
      </motion.div>

      {/* Label */}
      <motion.span
        className="text-xs font-medium transition-colors duration-300"
        style={{
          color: isHovered ? item.color : '#a8a29e',
        }}
      >
        {item.label}
      </motion.span>

      {/* Active indicator line */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-0.5 rounded-full"
        initial={{ width: 0, x: '-50%' }}
        animate={{
          width: isHovered ? '40%' : 0,
          x: '-50%',
        }}
        style={{
          backgroundColor: item.color,
          boxShadow: `0 0 8px ${item.glowColor}`,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}

export function NavigationGrid({
  onOpenProgress,
  onOpenAchievements,
  onOpenIdentity,
  onOpenPractice,
  onOpenMap,
  onOpenTransformation,
  onOpenWorlds,
  streak,
  hasPracticeAvailable,
  hasTransformationAvailable,
}: NavigationGridProps) {
  // Primary navigation items (always shown)
  const primaryItems: NavItem[] = [
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart3,
      color: '#3b82f6',
      glowColor: 'rgba(59, 130, 246, 0.2)',
      onClick: onOpenProgress,
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      color: '#fbbf24',
      glowColor: 'rgba(251, 191, 36, 0.2)',
      onClick: onOpenAchievements,
    },
    {
      id: 'identity',
      label: 'Identity',
      icon: Sparkles,
      color: '#a78bfa',
      glowColor: 'rgba(167, 139, 250, 0.2)',
      onClick: onOpenIdentity,
    },
  ];

  // Secondary items (conditionally shown)
  const secondaryItems: NavItem[] = [];

  if (hasPracticeAvailable) {
    secondaryItems.push({
      id: 'practice',
      label: 'Practice',
      icon: Brain,
      color: '#6366f1',
      glowColor: 'rgba(99, 102, 241, 0.2)',
      onClick: onOpenPractice,
    });
  }

  if (hasTransformationAvailable) {
    secondaryItems.push({
      id: 'transformation',
      label: 'Growth',
      icon: TrendingUp,
      color: '#34d399',
      glowColor: 'rgba(52, 211, 153, 0.2)',
      onClick: onOpenTransformation,
    });
  }

  secondaryItems.push({
    id: 'map',
    label: 'Map',
    icon: Map,
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.2)',
    onClick: onOpenMap,
  });

  secondaryItems.push({
    id: 'worlds',
    label: 'Worlds',
    icon: Globe,
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.2)',
    onClick: onOpenWorlds,
  });

  return (
    <motion.nav
      className="mt-auto pt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {/* Decorative divider */}
      <motion.div
        className="h-px w-full mb-6"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(168, 162, 158, 0.2), transparent)',
          transformOrigin: 'center',
        }}
      />

      {/* Secondary row - contextual actions */}
      {secondaryItems.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {secondaryItems.map((item, index) => (
            <NavButton key={item.id} item={item} index={index} />
          ))}
        </div>
      )}

      {/* Primary row - main navigation */}
      <div className="grid grid-cols-3 gap-3">
        {primaryItems.map((item, index) => (
          <NavButton key={item.id} item={item} index={index + secondaryItems.length} />
        ))}
      </div>

      {/* Streak motivation text */}
      <motion.p
        className="text-center text-xs text-stone-600 mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {streak > 0 ? (
          <span>
            <span className="text-amber-500">{streak} day{streak !== 1 ? 's' : ''}</span>
            {' '}of consistent growth
          </span>
        ) : (
          <span>Start your journey today</span>
        )}
      </motion.p>
    </motion.nav>
  );
}

export default NavigationGrid;
