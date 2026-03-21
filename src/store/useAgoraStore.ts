import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AgoraPost, AgoraCategory } from '@/types/agora';
import { mapRowToPost } from '@/types/agora';
import * as agoraApi from '@/lib/api/agora';

interface AgoraState {
  posts: AgoraPost[];
  userVoteIds: string[];
  categoryFilter: AgoraCategory | null;
  sortOrder: 'top' | 'new';
  isLoading: boolean;
}

interface AgoraActions {
  fetchPosts: () => Promise<void>;
  fetchUserVotes: (userId: string) => Promise<void>;
  createPost: (userId: string, content: string, category: AgoraCategory) => Promise<void>;
  toggleVote: (userId: string, postId: string) => Promise<void>;
  setCategoryFilter: (category: AgoraCategory | null) => void;
  setSortOrder: (sort: 'top' | 'new') => void;
}

export const useAgoraStore = create<AgoraState & AgoraActions>()(
  persist(
    (set, get) => ({
      posts: [],
      userVoteIds: [],
      categoryFilter: null,
      sortOrder: 'top',
      isLoading: false,

      fetchPosts: async () => {
        const { categoryFilter, sortOrder } = get();
        set({ isLoading: true });
        try {
          const rows = await agoraApi.listPosts(categoryFilter, sortOrder);
          set({ posts: rows.map(mapRowToPost), isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      fetchUserVotes: async (userId: string) => {
        try {
          const voteIds = await agoraApi.getUserVotes(userId);
          set({ userVoteIds: voteIds });
        } catch {
          // silent
        }
      },

      createPost: async (userId: string, content: string, category: AgoraCategory) => {
        const row = await agoraApi.createPost(userId, content, category);
        const post = mapRowToPost(row);
        set((state) => ({ posts: [post, ...state.posts] }));
      },

      toggleVote: async (userId: string, postId: string) => {
        const { userVoteIds, posts } = get();
        const hasVoted = userVoteIds.includes(postId);

        // Optimistic update
        if (hasVoted) {
          set({
            userVoteIds: userVoteIds.filter((id) => id !== postId),
            posts: posts.map((p) =>
              p.id === postId ? { ...p, voteCount: Math.max(0, p.voteCount - 1) } : p
            ),
          });
        } else {
          set({
            userVoteIds: [...userVoteIds, postId],
            posts: posts.map((p) =>
              p.id === postId ? { ...p, voteCount: p.voteCount + 1 } : p
            ),
          });
        }

        // API call
        try {
          if (hasVoted) {
            await agoraApi.unvotePost(userId, postId);
          } else {
            await agoraApi.votePost(userId, postId);
          }
        } catch {
          // Revert on error
          set({ userVoteIds, posts });
        }
      },

      setCategoryFilter: (category: AgoraCategory | null) => {
        set({ categoryFilter: category });
      },

      setSortOrder: (sort: 'top' | 'new') => {
        set({ sortOrder: sort });
      },
    }),
    {
      name: 'agora-storage',
      partialize: (state) => ({ userVoteIds: state.userVoteIds }),
    }
  )
);
