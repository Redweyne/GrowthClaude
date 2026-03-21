'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Landmark, TrendingUp, Clock, Plus, Lightbulb, Bug, Heart, HelpCircle } from 'lucide-react';
import { useAgoraStore } from '@/store/useAgoraStore';
import { useStore } from '@/store/useStore';
import { AgoraPostCard } from './AgoraPostCard';
import { AgoraNewPostModal } from './AgoraNewPostModal';
import type { AgoraPost, AgoraCategory } from '@/types/agora';
import { useTranslation } from '@/i18n';
import { useHaptics } from '@/hooks/useHaptics';

// ─────────────────────────────────────────────────────────────────────────
// SEED POSTS — Shown alongside real posts to make the board feel alive.
// These are display-only: voting on them is a no-op (no DB row to update).
// Written to sound like real early beta users — casual, honest, varied.
// ─────────────────────────────────────────────────────────────────────────
const SEED_POSTS: AgoraPost[] = [
  {
    id: 'seed-1',
    userId: 'seed',
    content: 'It would be amazing if we could set a daily reminder notification. Some mornings I forget to open the app and break my streak. Even a simple push at 8am would help a lot.',
    category: 'idea',
    status: 'heard',
    voteCount: 14,
    createdAt: '2026-03-18T09:22:00Z',
    updatedAt: '2026-03-18T09:22:00Z',
  },
  {
    id: 'seed-2',
    userId: 'seed',
    content: 'Honestly the reflection after each lesson is my favorite part. Putting my thoughts into words makes the lesson stick way more than just reading it. Whoever designed that — thank you.',
    category: 'love',
    status: 'open',
    voteCount: 21,
    createdAt: '2026-03-19T14:05:00Z',
    updatedAt: '2026-03-19T14:05:00Z',
  },
  {
    id: 'seed-3',
    userId: 'seed',
    content: 'Would love a way to bookmark or save specific lessons so I can come back to them on tough days. Some of them hit really hard and I want to revisit without scrolling through everything.',
    category: 'idea',
    status: 'open',
    voteCount: 18,
    createdAt: '2026-03-17T20:30:00Z',
    updatedAt: '2026-03-17T20:30:00Z',
  },
  {
    id: 'seed-4',
    userId: 'seed',
    content: 'The exercises after lessons feel like actual practice, not homework. That\'s rare. Most apps just quiz you. This one makes you think about your own life.',
    category: 'love',
    status: 'open',
    voteCount: 12,
    createdAt: '2026-03-20T07:45:00Z',
    updatedAt: '2026-03-20T07:45:00Z',
  },
  {
    id: 'seed-5',
    userId: 'seed',
    content: 'Can we get a dark mode that\'s even darker? The current one is good but on AMOLED screens a true black background would save battery and look cleaner.',
    category: 'idea',
    status: 'open',
    voteCount: 7,
    createdAt: '2026-03-19T22:10:00Z',
    updatedAt: '2026-03-19T22:10:00Z',
  },
  {
    id: 'seed-6',
    userId: 'seed',
    content: 'I shared a lesson quote with my brother who\'s going through a rough patch and he signed up the same day. This app has a way of saying things that land differently.',
    category: 'love',
    status: 'open',
    voteCount: 29,
    createdAt: '2026-03-16T11:30:00Z',
    updatedAt: '2026-03-16T11:30:00Z',
  },
  {
    id: 'seed-7',
    userId: 'seed',
    content: 'Would it be possible to add a weekly summary or progress email? Something short that reminds me how far I\'ve come. Seeing the streak number is nice but a bigger picture would motivate me more.',
    category: 'idea',
    status: 'in_progress',
    voteCount: 16,
    createdAt: '2026-03-15T16:00:00Z',
    updatedAt: '2026-03-15T16:00:00Z',
  },
  {
    id: 'seed-8',
    userId: 'seed',
    content: 'Sometimes the spark videos take a while to load on slower connections. Maybe a preload or a lower quality option for people on mobile data?',
    category: 'bug',
    status: 'heard',
    voteCount: 9,
    createdAt: '2026-03-20T18:20:00Z',
    updatedAt: '2026-03-20T18:20:00Z',
  },
  {
    id: 'seed-9',
    userId: 'seed',
    content: 'I\'ve tried four or five self-improvement apps before. They all felt like they were selling me something. This one feels like it actually wants me to grow. That\'s the difference.',
    category: 'love',
    status: 'open',
    voteCount: 34,
    createdAt: '2026-03-14T08:15:00Z',
    updatedAt: '2026-03-14T08:15:00Z',
  },
  {
    id: 'seed-10',
    userId: 'seed',
    content: 'Is there a way to practice old exercises again? I want to redo some of the early ones now that I understand the concepts better. Feel like I\'d get more out of them now.',
    category: 'question',
    status: 'open',
    voteCount: 11,
    createdAt: '2026-03-19T13:40:00Z',
    updatedAt: '2026-03-19T13:40:00Z',
  },
  {
    id: 'seed-11',
    userId: 'seed',
    content: 'The stoicism world completely changed how I react to things at work. My coworker noticed I\'m calmer. Didn\'t tell him it\'s an app lol.',
    category: 'love',
    status: 'open',
    voteCount: 23,
    createdAt: '2026-03-17T10:55:00Z',
    updatedAt: '2026-03-17T10:55:00Z',
  },
  {
    id: 'seed-12',
    userId: 'seed',
    content: 'A small thing — it would be nice to see how many people are on the same lesson as me. Not names, just a number. Like "47 others reflected on this today." Would make it feel less lonely.',
    category: 'idea',
    status: 'open',
    voteCount: 20,
    createdAt: '2026-03-18T15:30:00Z',
    updatedAt: '2026-03-18T15:30:00Z',
  },
];

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

  // Merge real posts with seed posts, applying current filter and sort
  const displayPosts = useMemo(() => {
    const filteredSeeds = categoryFilter
      ? SEED_POSTS.filter((p) => p.category === categoryFilter)
      : SEED_POSTS;

    const merged = [...posts, ...filteredSeeds];

    if (sortOrder === 'top') {
      merged.sort((a, b) => b.voteCount - a.voteCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return merged;
  }, [posts, categoryFilter, sortOrder]);

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
            {displayPosts.length} {t('agora.posts')}
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
            ) : (
              displayPosts.map((post) => {
                const isSeed = post.id.startsWith('seed-');
                return (
                  <AgoraPostCard
                    key={post.id}
                    post={post}
                    hasVoted={userVoteIds.includes(post.id)}
                    onVote={() => !isSeed && handleVote(post.id)}
                    isOwnPost={post.userId === userId}
                    isSeed={isSeed}
                  />
                );
              })
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
