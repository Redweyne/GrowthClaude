'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Star } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ALL_BADGES, type BadgeDefinition, type BadgeRarity } from '@/types/profile';
import { getBadgeDisplayList, type BadgeCheckContext } from '@/lib/badgeEngine';
import type { BadgeEarnedRecord } from '@/types/profile';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/i18n';

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

  const featuredBadgeId = useStore(s => s.featuredBadgeId);
  const setFeaturedBadge = useStore(s => s.setFeaturedBadge);
  const { t } = useTranslation();

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
    streak: t('profilePage.badgeCatStreak'),
    world: t('profilePage.badgeCatWorlds'),
    social: t('profilePage.badgeCatSocial'),
    mastery: t('profilePage.badgeCatMastery'),
    special: t('profilePage.badgeCatSpecial'),
  };

  const earnedCount = useMemo(() => badges.filter(b => b.isEarned).length, [badges]);

  return (
    <motion.div
      className="px-5 mt-5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium uppercase tracking-wider text-stone-500">
          {t('profilePage.myBadges')}
        </h3>
        <span className="text-xs text-stone-600">
          {earnedCount}/{badges.length}
        </span>
      </div>

      {/* Featured badge callout */}
      {featuredBadgeId && (
        <FeaturedBadgeDisplay badgeId={featuredBadgeId} earned={earned} />
      )}

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
                isFeatured={featuredBadgeId === badge.id}
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
            isFeatured={featuredBadgeId === selectedBadge.badge.id}
            onSetFeatured={() => {
              if (selectedBadge.isEarned) {
                setFeaturedBadge(
                  featuredBadgeId === selectedBadge.badge.id ? null : selectedBadge.badge.id
                );
              }
            }}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// FEATURED BADGE DISPLAY
// ─────────────────────────────────────────────

function FeaturedBadgeDisplay({ badgeId, earned }: { badgeId: string; earned: BadgeEarnedRecord[] }) {
  const def = ALL_BADGES.find(b => b.id === badgeId);
  const record = earned.find(b => b.badgeId === badgeId);
  const { t } = useTranslation();
  if (!def || !record) return null;

  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[def.icon] || Icons.Award;
  const rarityColors = getRarityColors(def.rarity);

  return (
    <div className="mb-4 p-3 rounded-xl border border-amber-800/30 flex items-center gap-3" style={{ backgroundColor: 'var(--profile-bg, rgba(251,191,36,0.1))' }}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rarityColors.bgFull}`}>
        <IconComponent className={`w-5 h-5 ${rarityColors.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Star className="w-3 h-3" style={{ color: 'var(--profile-accent, #fbbf24)' }} />
          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--profile-accent, #fbbf24)' }}>
            {t('profilePage.featuredBadge')}
          </span>
        </div>
        <div className="text-sm font-medium text-stone-200 mt-0.5">{def.name}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BADGE ITEM
// ─────────────────────────────────────────────

function BadgeItem({
  badge,
  isEarned,
  earnedAt,
  isFeatured,
  onClick,
}: {
  badge: BadgeDefinition;
  isEarned: boolean;
  earnedAt: string | null;
  isFeatured: boolean;
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
          {/* Featured star indicator */}
          {isFeatured && (
            <div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--profile-accent, #fbbf24)' }}
            >
              <Star className="w-2.5 h-2.5 text-stone-900 fill-stone-900" />
            </div>
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
  isFeatured,
  onSetFeatured,
  onClose,
}: {
  badge: BadgeDefinition;
  isEarned: boolean;
  earnedAt: string | null;
  isFeatured: boolean;
  onSetFeatured: () => void;
  onClose: () => void;
}) {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[badge.icon] || Icons.Award;
  const rarityColors = getRarityColors(badge.rarity);
  const { t } = useTranslation();

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
          <>
            <p className="text-xs text-amber-500/60 mb-3">
              {t('profilePage.earnedOn')} {new Date(earnedAt).toLocaleDateString()}
            </p>
            {/* Feature badge button */}
            <button
              onClick={onSetFeatured}
              className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${
                isFeatured
                  ? 'bg-amber-900/40 text-amber-300 border border-amber-700/40'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700'
              }`}
            >
              {isFeatured ? t('profilePage.unfeaturedBadge') : t('profilePage.setFeaturedBadge')}
            </button>
          </>
        ) : (
          <p className="text-xs text-stone-600">
            {t('profilePage.keepGoingToUnlock')}
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
        bgFull: 'bg-stone-800',
      };
    case 'rare':
      return {
        border: 'border-purple-800/50',
        icon: 'text-purple-400',
        tag: 'bg-purple-900/40 text-purple-400',
        glowColor: 'rgba(167,139,250,0.4)',
        bgFull: 'bg-purple-900/40',
      };
    case 'legendary':
      return {
        border: 'border-amber-700/50',
        icon: 'text-amber-400',
        tag: 'bg-amber-900/40 text-amber-400',
        glowColor: 'rgba(251,191,36,0.5)',
        bgFull: 'bg-amber-900/40',
      };
  }
}
