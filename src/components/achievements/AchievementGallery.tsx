'use client';

// ============================================================================
// MILESTONE GALLERY - A Chronicle of Your Journey
// ============================================================================
//
// This is not a trophy case. This is a map of where you've been.
// Each milestone represents a moment you showed up for yourself.
// ============================================================================

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Compass, X } from 'lucide-react';
import { EmptyState } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { MilestoneBadge } from './AchievementBadge';
import {
  MILESTONES,
  type MilestoneCategory,
  type Milestone,
  type Virtue,
  getVirtueColor,
  getVirtueLabel,
  getVirtueGreek,
  getWeightLabel,
} from '@/types/achievements';

interface MilestoneGalleryProps {
  onBack: () => void;
}

// Legacy alias
interface AchievementGalleryProps extends MilestoneGalleryProps {}

type FilterType = 'all' | 'unlocked' | 'locked' | MilestoneCategory | Virtue;

// Categories with meaningful labels
const CATEGORY_INFO: Record<MilestoneCategory, { label: string; description: string }> = {
  consistency: { label: 'Consistency', description: 'Showing up, day after day' },
  learning: { label: 'Learning', description: 'Absorbing wisdom' },
  reflection: { label: 'Reflection', description: 'Looking inward' },
  identity: { label: 'Identity', description: 'Becoming who you\'re meant to be' },
  integration: { label: 'Integration', description: 'Making wisdom part of life' },
  depth: { label: 'Depth', description: 'Going deeper' },
};

// Virtue filters
const VIRTUE_INFO: Record<Virtue, { label: string; greek: string }> = {
  wisdom: { label: 'Wisdom', greek: 'σοφία' },
  courage: { label: 'Courage', greek: 'ἀνδρεία' },
  temperance: { label: 'Temperance', greek: 'σωφροσύνη' },
  justice: { label: 'Justice', greek: 'δικαιοσύνη' },
};

export function MilestoneGallery({ onBack }: MilestoneGalleryProps) {
  const { getUnlockedAchievements, name } = useStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const unlockedMilestones = getUnlockedAchievements();
  const unlockedIds = useMemo(
    () => new Set(unlockedMilestones.map(a => a.achievementId)),
    [unlockedMilestones]
  );

  const getUnlockDate = (milestoneId: string) => {
    const unlock = unlockedMilestones.find(a => a.achievementId === milestoneId);
    return unlock?.unlockedAt;
  };

  const filteredMilestones = useMemo(() => {
    let filtered = [...MILESTONES];

    if (filter === 'unlocked') {
      filtered = filtered.filter(m => unlockedIds.has(m.id));
    } else if (filter === 'locked') {
      filtered = filtered.filter(m => !unlockedIds.has(m.id));
    } else if (filter in CATEGORY_INFO) {
      filtered = filtered.filter(m => m.category === filter);
    } else if (filter in VIRTUE_INFO) {
      filtered = filtered.filter(m => m.virtue === filter);
    }

    // Sort: unlocked first, then by weight (significance)
    const weightOrder = { legacy: 0, monument: 1, cornerstone: 2, marker: 3, 'stepping-stone': 4 };
    filtered.sort((a, b) => {
      const aUnlocked = unlockedIds.has(a.id) ? 0 : 1;
      const bUnlocked = unlockedIds.has(b.id) ? 0 : 1;
      if (aUnlocked !== bUnlocked) return aUnlocked - bUnlocked;
      return weightOrder[a.weight] - weightOrder[b.weight];
    });

    return filtered;
  }, [filter, unlockedIds]);

  const stats = {
    total: MILESTONES.length,
    unlocked: unlockedIds.size,
    percentage: Math.round((unlockedIds.size / MILESTONES.length) * 100),
  };

  // Group by virtues for the summary
  const virtueStats = useMemo(() => {
    const counts: Record<Virtue, { total: number; unlocked: number }> = {
      wisdom: { total: 0, unlocked: 0 },
      courage: { total: 0, unlocked: 0 },
      temperance: { total: 0, unlocked: 0 },
      justice: { total: 0, unlocked: 0 },
    };
    MILESTONES.forEach(m => {
      counts[m.virtue].total++;
      if (unlockedIds.has(m.id)) counts[m.virtue].unlocked++;
    });
    return counts;
  }, [unlockedIds]);

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
                <Compass className="w-5 h-5 text-amber-400" />
                Your Journey
              </h1>
              <p className="text-sm text-zinc-500">
                {stats.unlocked} milestones reached
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Virtue progress cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          {(Object.entries(virtueStats) as [Virtue, { total: number; unlocked: number }][]).map(([virtue, counts]) => {
            const percentage = Math.round((counts.unlocked / counts.total) * 100);
            return (
              <button
                key={virtue}
                onClick={() => setFilter(filter === virtue ? 'all' : virtue)}
                className={`
                  p-4 rounded-xl border transition-all text-left
                  ${filter === virtue
                    ? `bg-gradient-to-br ${getVirtueColor(virtue)} border-transparent`
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${filter === virtue ? 'text-white' : 'text-zinc-300'}`}>
                    {getVirtueLabel(virtue)}
                  </span>
                  <span className={`text-xs ${filter === virtue ? 'text-white/70' : 'text-zinc-600'}`}>
                    {getVirtueGreek(virtue)}
                  </span>
                </div>
                <div className={`text-xs ${filter === virtue ? 'text-white/70' : 'text-zinc-500'}`}>
                  {counts.unlocked} of {counts.total}
                </div>
                <div className={`h-1 mt-2 rounded-full ${filter === virtue ? 'bg-white/20' : 'bg-zinc-800'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      filter === virtue ? 'bg-white/60' : `bg-gradient-to-r ${getVirtueColor(virtue)}`
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Category filters */}
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
            label={`Reached (${stats.unlocked})`}
          />
          <FilterButton
            active={filter === 'locked'}
            onClick={() => setFilter('locked')}
            label={`Ahead (${stats.total - stats.unlocked})`}
          />
          {Object.entries(CATEGORY_INFO).map(([key, { label }]) => (
            <FilterButton
              key={key}
              active={filter === key}
              onClick={() => setFilter(key as MilestoneCategory)}
              label={label}
            />
          ))}
        </motion.div>

        {/* Milestone grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 sm:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredMilestones.map((milestone, index) => {
              const unlocked = unlockedIds.has(milestone.id);
              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.02 }}
                  layout
                >
                  <MilestoneBadge
                    milestone={milestone}
                    unlocked={unlocked}
                    unlockedAt={getUnlockDate(milestone.id)}
                    size="md"
                    showDetails
                    onClick={() => setSelectedMilestone(milestone)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredMilestones.length === 0 && (
          <EmptyState
            icon={<Compass className="w-6 h-6" />}
            title="No milestones yet"
            description="No milestones match this filter"
          />
        )}

        {/* Journey reflection */}
        {stats.unlocked > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 text-center"
          >
            <p className="text-zinc-400 text-sm leading-relaxed">
              {name ? `${name}, each` : 'Each'} milestone here represents a moment you chose growth over comfort.
              {stats.unlocked >= 5 && (
                <span className="text-zinc-500 block mt-2">
                  {stats.unlocked} moments of showing up. That is not nothing.
                </span>
              )}
            </p>
          </motion.div>
        )}
      </div>

      {/* Milestone detail modal */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full relative"
            >
              <button
                onClick={() => setSelectedMilestone(null)}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <MilestoneBadge
                  milestone={selectedMilestone}
                  unlocked={unlockedIds.has(selectedMilestone.id)}
                  unlockedAt={getUnlockDate(selectedMilestone.id)}
                  size="lg"
                />

                <h3 className="text-xl font-bold text-white mt-6 mb-2">
                  {selectedMilestone.name}
                </h3>

                <p className="text-zinc-300 mb-2">
                  {selectedMilestone.meaning}
                </p>

                {unlockedIds.has(selectedMilestone.id) && (
                  <p className="text-zinc-500 text-sm italic mb-4">
                    "{selectedMilestone.message}"
                  </p>
                )}

                {/* Virtue badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-sm bg-gradient-to-r ${getVirtueColor(selectedMilestone.virtue)} text-white mb-4`}>
                  {getVirtueLabel(selectedMilestone.virtue)}
                </div>

                {/* Wisdom quote */}
                <div className="bg-zinc-800/50 rounded-xl p-4 mt-4">
                  <p className="text-zinc-400 text-sm italic">
                    "{selectedMilestone.wisdom.text}"
                  </p>
                  <p className="text-zinc-600 text-xs mt-2">
                    — {selectedMilestone.wisdom.author}
                  </p>
                </div>

                {/* Details */}
                <div className="bg-zinc-800/30 rounded-xl p-4 mt-4 space-y-2 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Category</span>
                    <span className="text-zinc-300">
                      {CATEGORY_INFO[selectedMilestone.category].label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Significance</span>
                    <span className="text-zinc-300">
                      {getWeightLabel(selectedMilestone.weight)}
                    </span>
                  </div>
                  {unlockedIds.has(selectedMilestone.id) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Reached</span>
                      <span className="text-emerald-400">
                        {new Date(getUnlockDate(selectedMilestone.id)!).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Affirmation for unlocked */}
                {unlockedIds.has(selectedMilestone.id) && (
                  <p className="text-zinc-600 text-xs mt-4">
                    {selectedMilestone.affirmation}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Legacy alias
export function AchievementGallery(props: AchievementGalleryProps) {
  return <MilestoneGallery {...props} />;
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

export default MilestoneGallery;
