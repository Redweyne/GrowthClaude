'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy, Filter, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AchievementBadge } from './AchievementBadge';
import {
  ACHIEVEMENTS,
  type AchievementCategory,
  type Achievement,
  getRarityColor,
  getRarityLabel,
} from '@/types/achievements';

interface AchievementGalleryProps {
  onBack: () => void;
}

type FilterType = 'all' | 'unlocked' | 'locked' | AchievementCategory;

const CATEGORY_LABELS: Record<AchievementCategory, { label: string; icon: string }> = {
  streak: { label: 'Streaks', icon: '🔥' },
  lessons: { label: 'Lessons', icon: '📚' },
  reflections: { label: 'Reflections', icon: '💭' },
  identity: { label: 'Identity', icon: '🦋' },
  milestones: { label: 'Milestones', icon: '🎯' },
  mastery: { label: 'Mastery', icon: '✨' },
};

export function AchievementGallery({ onBack }: AchievementGalleryProps) {
  const { getUnlockedAchievements, isAchievementUnlocked, name } = useStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const unlockedAchievements = getUnlockedAchievements();
  const unlockedIds = useMemo(
    () => new Set(unlockedAchievements.map(a => a.achievementId)),
    [unlockedAchievements]
  );

  const getUnlockDate = (achievementId: string) => {
    const unlock = unlockedAchievements.find(a => a.achievementId === achievementId);
    return unlock?.unlockedAt;
  };

  const filteredAchievements = useMemo(() => {
    let filtered = [...ACHIEVEMENTS];

    if (filter === 'unlocked') {
      filtered = filtered.filter(a => unlockedIds.has(a.id));
    } else if (filter === 'locked') {
      filtered = filtered.filter(a => !unlockedIds.has(a.id));
    } else if (filter !== 'all') {
      filtered = filtered.filter(a => a.category === filter);
    }

    // Sort: unlocked first, then by rarity
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
    filtered.sort((a, b) => {
      const aUnlocked = unlockedIds.has(a.id) ? 0 : 1;
      const bUnlocked = unlockedIds.has(b.id) ? 0 : 1;
      if (aUnlocked !== bUnlocked) return aUnlocked - bUnlocked;
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });

    return filtered;
  }, [filter, unlockedIds]);

  const stats = {
    total: ACHIEVEMENTS.length,
    unlocked: unlockedIds.size,
    percentage: Math.round((unlockedIds.size / ACHIEVEMENTS.length) * 100),
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Achievements
              </h1>
              <p className="text-sm text-zinc-500">
                {stats.unlocked} of {stats.total} unlocked ({stats.percentage}%)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">Collection Progress</span>
            <span className="text-sm font-semibold text-amber-400">{stats.percentage}%</span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label="All"
          />
          <FilterButton
            active={filter === 'unlocked'}
            onClick={() => setFilter('unlocked')}
            label={`Unlocked (${stats.unlocked})`}
          />
          <FilterButton
            active={filter === 'locked'}
            onClick={() => setFilter('locked')}
            label={`Locked (${stats.total - stats.unlocked})`}
          />
          {Object.entries(CATEGORY_LABELS).map(([key, { label, icon }]) => (
            <FilterButton
              key={key}
              active={filter === key}
              onClick={() => setFilter(key as AchievementCategory)}
              label={`${icon} ${label}`}
            />
          ))}
        </motion.div>

        {/* Achievement grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 sm:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement, index) => {
              const unlocked = unlockedIds.has(achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.02 }}
                  layout
                >
                  <AchievementBadge
                    achievement={achievement}
                    unlocked={unlocked}
                    unlockedAt={getUnlockDate(achievement.id)}
                    size="md"
                    showDetails
                    onClick={() => setSelectedAchievement(achievement)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Trophy className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-500">No achievements match this filter</p>
          </motion.div>
        )}

        {/* Motivational message */}
        {stats.unlocked > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-amber-500/5 to-purple-500/5 border border-amber-500/20 rounded-xl p-6 text-center"
          >
            <p className="text-zinc-300">
              {name ? `${name}, you` : 'You'}&apos;ve unlocked{' '}
              <span className="text-amber-400 font-semibold">{stats.unlocked} achievements</span>.
              Each badge is proof of your commitment to growth.
              {stats.total - stats.unlocked > 0 && (
                <span className="text-zinc-500">
                  {' '}Keep going - {stats.total - stats.unlocked} more await you.
                </span>
              )}
            </p>
          </motion.div>
        )}
      </div>

      {/* Achievement detail modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>

              <AchievementBadge
                achievement={selectedAchievement}
                unlocked={unlockedIds.has(selectedAchievement.id)}
                unlockedAt={getUnlockDate(selectedAchievement.id)}
                size="lg"
              />

              <h3 className="text-xl font-bold text-white mt-6 mb-2">
                {selectedAchievement.name}
              </h3>

              <p className="text-zinc-400 mb-4">
                {selectedAchievement.description}
              </p>

              <div className={`inline-block px-3 py-1 rounded-full text-sm bg-gradient-to-r ${getRarityColor(selectedAchievement.rarity)} text-white mb-4`}>
                {getRarityLabel(selectedAchievement.rarity)}
              </div>

              <div className="bg-zinc-800/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Requirement</span>
                  <span className="text-zinc-300">{selectedAchievement.condition}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">XP Bonus</span>
                  <span className="text-amber-400">+{selectedAchievement.xpBonus} XP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Category</span>
                  <span className="text-zinc-300">
                    {CATEGORY_LABELS[selectedAchievement.category].icon}{' '}
                    {CATEGORY_LABELS[selectedAchievement.category].label}
                  </span>
                </div>
                {unlockedIds.has(selectedAchievement.id) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Unlocked</span>
                    <span className="text-emerald-400">
                      {new Date(getUnlockDate(selectedAchievement.id)!).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Filter button component
function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
        active
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:border-zinc-600'
      }`}
    >
      {label}
    </button>
  );
}

export default AchievementGallery;
