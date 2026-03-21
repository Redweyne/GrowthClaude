'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Landmark, TrendingUp, Clock, Plus, Lightbulb, Bug, Heart, HelpCircle } from 'lucide-react';
import { useAgoraStore } from '@/store/useAgoraStore';
import { useStore } from '@/store/useStore';
import { AgoraPostCard } from './AgoraPostCard';
import { AgoraNewPostModal } from './AgoraNewPostModal';
import type { AgoraCategory } from '@/types/agora';
import { useTranslation } from '@/i18n';
import { useHaptics } from '@/hooks/useHaptics';

interface AgoraViewProps {
  onClose: () => void;
}

const FILTERS: { id: AgoraCategory | null; icon: typeof Lightbulb | null; labelKey: string }[] = [
  { id: null, icon: null, labelKey: 'agora.filterAll' },
  { id: 'idea', icon: Lightbulb, labelKey: 'agora.filterIdeas' },
  { id: 'bug', icon: Bug, labelKey: 'agora.filterBugs' },
  { id: 'love', icon: Heart, labelKey: 'agora.filterLove' },
  { id: 'question', icon: HelpCircle, labelKey: 'agora.filterQuestions' },
];

export function AgoraView({ onClose }: AgoraViewProps) {
  const { t, isRTL } = useTranslation();
  const { hapticLight, hapticMedium } = useHaptics();
  const [showNewPost, setShowNewPost] = useState(false);

  const userId = useStore((s) => s.userId);
  const {
    posts, userVoteIds, categoryFilter, sortOrder, isLoading,
    fetchPosts, fetchUserVotes, createPost, toggleVote,
    setCategoryFilter, setSortOrder,
  } = useAgoraStore();

  // Fetch on mount and when filter/sort changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, categoryFilter, sortOrder]);

  useEffect(() => {
    if (userId) fetchUserVotes(userId);
  }, [userId, fetchUserVotes]);

  const handleCreatePost = useCallback(async (content: string, category: AgoraCategory) => {
    if (!userId) return;
    await createPost(userId, content, category);
  }, [userId, createPost]);

  const handleVote = useCallback((postId: string) => {
    if (!userId) return;
    hapticLight();
    toggleVote(userId, postId);
  }, [userId, toggleVote, hapticLight]);

  const handleFilterChange = useCallback((cat: AgoraCategory | null) => {
    hapticLight();
    setCategoryFilter(cat);
  }, [setCategoryFilter, hapticLight]);

  const handleSortChange = useCallback((sort: 'top' | 'new') => {
    hapticLight();
    setSortOrder(sort);
  }, [setSortOrder, hapticLight]);

  return (
    <div className="h-full flex flex-col bg-stone-950 light:bg-stone-50">
      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 bg-stone-950/80 light:bg-stone-50/80 backdrop-blur-xl border-b border-stone-800/40 light:border-stone-200"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className={`flex items-center gap-3 px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <motion.button
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl bg-stone-800/60 light:bg-stone-200 flex items-center justify-center"
          >
            {isRTL ? <ArrowRight size={18} className="text-stone-300 light:text-stone-600" /> : <ArrowLeft size={18} className="text-stone-300 light:text-stone-600" />}
          </motion.button>

          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/15 to-orange-500/15 border border-amber-500/20 flex items-center justify-center">
              <Landmark size={16} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-100 light:text-stone-900 leading-tight">
                {t('agora.title')}
              </h1>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider">
                {t('agora.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="px-5 pb-3">
          <div className={`flex gap-2 overflow-x-auto no-scrollbar ${isRTL ? 'flex-row-reverse' : ''}`}>
            {FILTERS.map((f) => {
              const isActive = categoryFilter === f.id;
              const Icon = f.icon;
              return (
                <motion.button
                  key={f.id ?? 'all'}
                  onClick={() => handleFilterChange(f.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 border
                    ${isActive
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 light:text-amber-700 shadow-[0_0_10px_rgba(251,191,36,0.1)]'
                      : 'bg-stone-800/40 light:bg-stone-200/60 border-stone-700/30 light:border-stone-300 text-stone-400 light:text-stone-600 hover:border-stone-600'
                    }
                  `}
                >
                  {Icon && <Icon size={12} />}
                  {t(f.labelKey as 'agora.filterAll')}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Sort toggle ── */}
        <div className={`flex items-center gap-1 px-5 pb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex bg-stone-800/50 light:bg-stone-200 rounded-lg p-0.5">
            {([
              { id: 'top' as const, icon: TrendingUp, label: t('agora.sortTop') },
              { id: 'new' as const, icon: Clock, label: t('agora.sortNew') },
            ]).map((s) => (
              <button
                key={s.id}
                onClick={() => handleSortChange(s.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300
                  ${sortOrder === s.id
                    ? 'bg-stone-700/80 light:bg-white text-stone-200 light:text-stone-800 shadow-sm'
                    : 'text-stone-500 hover:text-stone-300 light:hover:text-stone-700'
                  }
                `}
              >
                <s.icon size={12} />
                {s.label}
              </button>
            ))}
          </div>

          <span className={`text-[10px] text-stone-600 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
            {posts.length} {t('agora.posts')}
          </span>
        </div>
      </motion.header>

      {/* ── Post List ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="px-4 py-4 space-y-3 pb-24">
          <AnimatePresence mode="popLayout">
            {isLoading && posts.length === 0 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-400"
                />
              </motion.div>
            ) : posts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center px-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center mb-4"
                >
                  <Landmark size={28} className="text-amber-400/60" />
                </motion.div>
                <h3 className="text-base font-semibold text-stone-300 light:text-stone-700 mb-1">
                  {t('agora.emptyTitle')}
                </h3>
                <p className="text-sm text-stone-500 max-w-[240px]">
                  {t('agora.emptyDescription')}
                </p>
              </motion.div>
            ) : (
              posts.map((post) => (
                <AgoraPostCard
                  key={post.id}
                  post={post}
                  hasVoted={userVoteIds.includes(post.id)}
                  onVote={() => handleVote(post.id)}
                  isOwnPost={post.userId === userId}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── FAB — New Post ── */}
      <motion.button
        onClick={() => { setShowNewPost(true); hapticMedium(); }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.3 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`fixed bottom-6 ${isRTL ? 'left-5' : 'right-5'} z-30 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 text-stone-950 flex items-center justify-center shadow-xl shadow-amber-500/30`}
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              '0 0 0px rgba(251,191,36,0)',
              '0 0 20px rgba(251,191,36,0.35)',
              '0 0 0px rgba(251,191,36,0)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Plus size={24} strokeWidth={2.5} />
      </motion.button>

      {/* ── New Post Modal ── */}
      <AnimatePresence>
        {showNewPost && (
          <AgoraNewPostModal
            onSubmit={handleCreatePost}
            onClose={() => setShowNewPost(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
