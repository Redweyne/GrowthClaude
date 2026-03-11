'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ALL_BADGES, type BadgeDefinition, type BadgeRarity } from '@/types/profile';
import { getBadgeDisplayList, type BadgeCheckContext } from '@/lib/badgeEngine';
import type { BadgeEarnedRecord } from '@/types/profile';

interface BadgeWallProps {
  ctx: BadgeCheckContext;
  earned: BadgeEarnedRecord[];
}

export function BadgeWall({ ctx, earned }: BadgeWallProps) {
  const [selectedBadge, setSelectedBadge] = useState<{
    badge: BadgeDefinition;
    isEarned: boolean;
    earnedAt: string | null;
  } | null>(null);

  const badges = useMemo(() => getBadgeDisplayList(ctx, earned), [ctx, earned]);

  const categories = useMemo(() => {
    const cats = new Map<string, typeof badges>();
    for (const item of badges) {
      const cat = item.badge.category;
      if (!cats.has(cat)) cats.set(cat, []);
      cats.get(cat)!.push(item);
    }
    return cats;
  }, [badges]);

  const categoryLabels: Record<string, string> = {
    streak: 'Streak',
    world: 'Worlds',
    social: 'Social',
    mastery: 'Mastery',
    special: 'Special',
  };

  return (
    <motion.div
      className="px-5 mt-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
    >
      <h3 className="text-sm font-medium uppercase tracking-wider text-stone-500 mb-3">
        My Badges
      </h3>

      {Array.from(categories.entries()).map(([cat, items]) => (
        <div key={cat} className="mb-4">
          <div className="text-xs text-stone-600 mb-2">{categoryLabels[cat] || cat}</div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {items.map(({ badge, isEarned, earnedAt }) => (
              <BadgeItem
                key={badge.id}
                badge={badge}
                isEarned={isEarned}
                earnedAt={earnedAt}
                onClick={() => setSelectedBadge({ badge, isEarned, earnedAt })}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <BadgeDetailModal
            badge={selectedBadge.badge}
            isEarned={selectedBadge.isEarned}
            earnedAt={selectedBadge.earnedAt}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// BADGE ITEM
// ─────────────────────────────────────────────

function BadgeItem({
  badge,
  isEarned,
  earnedAt,
  onClick,
}: {
  badge: BadgeDefinition;
  isEarned: boolean;
  earnedAt: string | null;
  onClick: () => void;
}) {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[badge.icon] || Icons.Award;
  const rarityColors = getRarityColors(badge.rarity);

  return (
    <motion.button
      onClick={onClick}
      className={`relative flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
        isEarned
          ? `bg-stone-800/80 border ${rarityColors.border}`
          : 'bg-stone-900/40 border border-stone-800/30'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      {isEarned ? (
        <>
          <IconComponent className={`w-5 h-5 ${rarityColors.icon}`} />
          {/* Legendary animated border */}
          {badge.rarity === 'legendary' && (
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                background: `conic-gradient(transparent, ${rarityColors.glowColor}, transparent)`,
                maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
                padding: 1,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </>
      ) : (
        <>
          <Lock className="w-4 h-4 text-stone-700" />
          <span className="text-[8px] text-stone-700">?</span>
        </>
      )}
    </motion.button>
  );
}

// ─────────────────────────────────────────────
// BADGE DETAIL MODAL
// ─────────────────────────────────────────────

function BadgeDetailModal({
  badge,
  isEarned,
  earnedAt,
  onClose,
}: {
  badge: BadgeDefinition;
  isEarned: boolean;
  earnedAt: string | null;
  onClose: () => void;
}) {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[badge.icon] || Icons.Award;
  const rarityColors = getRarityColors(badge.rarity);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-stone-950/80" onClick={onClose} />
      <motion.div
        className="relative bg-stone-900 rounded-2xl border border-stone-800 p-6 w-72 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-500 hover:text-stone-300"
        >
          <X className="w-4 h-4" />
        </button>

        <div className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
          isEarned ? 'bg-stone-800' : 'bg-stone-800/40'
        }`}>
          {isEarned ? (
            <IconComponent className={`w-8 h-8 ${rarityColors.icon}`} />
          ) : (
            <Lock className="w-8 h-8 text-stone-600" />
          )}
        </div>

        <h3 className="text-lg font-display text-amber-100 mb-1">{badge.name}</h3>

        <div className={`inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 ${rarityColors.tag}`}>
          {badge.rarity}
        </div>

        <p className="text-sm text-stone-400 mb-4">{badge.description}</p>

        {isEarned && earnedAt ? (
          <p className="text-xs text-amber-500/60">
            Earned on {new Date(earnedAt).toLocaleDateString()}
          </p>
        ) : (
          <p className="text-xs text-stone-600">
            Keep going to unlock this badge
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// RARITY HELPERS
// ─────────────────────────────────────────────

function getRarityColors(rarity: BadgeRarity) {
  switch (rarity) {
    case 'common':
      return {
        border: 'border-stone-700',
        icon: 'text-stone-300',
        tag: 'bg-stone-800 text-stone-400',
        glowColor: 'rgba(168,162,158,0.4)',
      };
    case 'rare':
      return {
        border: 'border-purple-800/50',
        icon: 'text-purple-400',
        tag: 'bg-purple-900/40 text-purple-400',
        glowColor: 'rgba(167,139,250,0.4)',
      };
    case 'legendary':
      return {
        border: 'border-amber-700/50',
        icon: 'text-amber-400',
        tag: 'bg-amber-900/40 text-amber-400',
        glowColor: 'rgba(251,191,36,0.5)',
      };
  }
}
