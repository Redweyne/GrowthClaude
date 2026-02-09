import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SparkAnalyticsEvent } from '@/types/spark';
import { WISDOM_BREAK_CONFIG, SPARK_XP_REWARDS } from '@/types/spark';

// ═══════════════════════════════════════════════════════════════════════════
// SPARK STORE
// ═══════════════════════════════════════════════════════════════════════════
//
// State management for the Spark motivational shorts feed.
// Handles session tracking, video history, saves, analytics, and XP.
//
// ═══════════════════════════════════════════════════════════════════════════

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

interface SparkState {
  // Session tracking
  videosWatchedToday: number;
  videosWatchedThisSession: number;
  currentSessionBreakCount: number;
  videoXpEarnedToday: number;

  // User data
  savedVideos: string[];
  watchedVideos: string[];

  // Feature state
  hasSeenUnlockScreen: boolean;
  isFirstSparkSession: boolean;
  lastSparkDate: string;
  sparkSessionsTotal: number;
  forcedCloseToday: boolean;

  // Analytics
  analyticsEvents: SparkAnalyticsEvent[];
}

interface SparkActions {
  // Video tracking
  markVideoWatched: (videoId: string) => number; // Returns XP earned
  toggleSaveVideo: (videoId: string) => void;
  isVideoSaved: (videoId: string) => boolean;

  // Session management
  startSession: () => void;
  endSession: () => void;
  resetDailyCounters: () => void;

  // Wisdom break
  shouldShowWisdomBreak: () => boolean;
  recordWisdomBreakChoice: (choice: 'leave' | 'continue') => { xpEarned: number; shouldClose: boolean };

  // Unlock
  markUnlockScreenSeen: () => void;

  // Analytics
  logAnalyticsEvent: (event: Omit<SparkAnalyticsEvent, 'timestamp'>) => void;
  getAnalyticsEvents: (limit?: number) => SparkAnalyticsEvent[];

  // Stats
  getTotalVideosWatched: () => number;
  getTotalSaved: () => number;
  getSessionCount: () => number;
  isForcedClosedToday: () => boolean;

  // Reset
  resetSpark: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────

const initialState: SparkState = {
  videosWatchedToday: 0,
  videosWatchedThisSession: 0,
  currentSessionBreakCount: 0,
  videoXpEarnedToday: 0,
  savedVideos: [],
  watchedVideos: [],
  hasSeenUnlockScreen: false,
  isFirstSparkSession: true,
  lastSparkDate: '',
  sparkSessionsTotal: 0,
  forcedCloseToday: false,
  analyticsEvents: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useSparkStore = create<SparkState & SparkActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ═══════════════════════════════════════════════════════════════════════
      // VIDEO TRACKING
      // ═══════════════════════════════════════════════════════════════════════

      markVideoWatched: (videoId: string) => {
        const state = get();
        const today = getTodayString();

        // Reset daily counters if new day
        if (state.lastSparkDate !== today) {
          get().resetDailyCounters();
        }

        const currentState = get();

        // Calculate XP (capped daily)
        let xpEarned = 0;
        if (currentState.videoXpEarnedToday < WISDOM_BREAK_CONFIG.maxDailyVideoXp) {
          xpEarned = SPARK_XP_REWARDS.videoWatched;
        }

        // Add to watched history (cap at 500, FIFO)
        const updatedWatched = currentState.watchedVideos.includes(videoId)
          ? currentState.watchedVideos
          : [...currentState.watchedVideos, videoId].slice(-500);

        set({
          videosWatchedToday: currentState.videosWatchedToday + 1,
          videosWatchedThisSession: currentState.videosWatchedThisSession + 1,
          videoXpEarnedToday: currentState.videoXpEarnedToday + xpEarned,
          watchedVideos: updatedWatched,
          lastSparkDate: today,
        });

        // Log analytics
        get().logAnalyticsEvent({
          type: 'video_watched',
          videoId,
          sessionVideoCount: currentState.videosWatchedThisSession + 1,
        });

        return xpEarned;
      },

      toggleSaveVideo: (videoId: string) => {
        const state = get();
        const isSaved = state.savedVideos.includes(videoId);

        if (isSaved) {
          set({ savedVideos: state.savedVideos.filter(id => id !== videoId) });
        } else {
          // Cap at 500 saves
          const updated = [...state.savedVideos, videoId].slice(-500);
          set({ savedVideos: updated });
          get().logAnalyticsEvent({ type: 'video_saved', videoId });
        }
      },

      isVideoSaved: (videoId: string) => {
        return get().savedVideos.includes(videoId);
      },

      // ═══════════════════════════════════════════════════════════════════════
      // SESSION MANAGEMENT
      // ═══════════════════════════════════════════════════════════════════════

      startSession: () => {
        const state = get();
        const today = getTodayString();

        // Reset daily counters if new day
        if (state.lastSparkDate !== today) {
          get().resetDailyCounters();
        }

        set({
          videosWatchedThisSession: 0,
          currentSessionBreakCount: get().currentSessionBreakCount,
          sparkSessionsTotal: get().sparkSessionsTotal + 1,
          lastSparkDate: today,
        });

        get().logAnalyticsEvent({ type: 'session_start' });
      },

      endSession: () => {
        const state = get();
        get().logAnalyticsEvent({
          type: 'session_end',
          sessionVideoCount: state.videosWatchedThisSession,
        });

        set({ videosWatchedThisSession: 0 });
      },

      resetDailyCounters: () => {
        const today = getTodayString();
        set({
          videosWatchedToday: 0,
          videoXpEarnedToday: 0,
          currentSessionBreakCount: 0,
          forcedCloseToday: false,
          lastSparkDate: today,
        });
      },

      // ═══════════════════════════════════════════════════════════════════════
      // WISDOM BREAK
      // ═══════════════════════════════════════════════════════════════════════

      shouldShowWisdomBreak: () => {
        const state = get();
        const threshold = state.isFirstSparkSession
          ? WISDOM_BREAK_CONFIG.firstSessionThreshold
          : WISDOM_BREAK_CONFIG.normalThreshold;

        return state.videosWatchedThisSession > 0 &&
          state.videosWatchedThisSession % threshold === 0;
      },

      recordWisdomBreakChoice: (choice: 'leave' | 'continue') => {
        const state = get();
        let xpEarned = 0;
        let shouldClose = false;

        if (choice === 'leave') {
          xpEarned = SPARK_XP_REWARDS.wisdomBreakLeave;
          get().logAnalyticsEvent({
            type: 'wisdom_break_leave',
            sessionVideoCount: state.videosWatchedThisSession,
          });
        } else {
          const newBreakCount = state.currentSessionBreakCount + 1;
          set({ currentSessionBreakCount: newBreakCount });

          // Check if we've hit the daily break limit
          if (newBreakCount >= WISDOM_BREAK_CONFIG.maxBreaksPerDay) {
            shouldClose = true;
            set({ forcedCloseToday: true });
          }

          get().logAnalyticsEvent({
            type: 'wisdom_break_continue',
            sessionVideoCount: state.videosWatchedThisSession,
          });
        }

        get().logAnalyticsEvent({
          type: 'wisdom_break_shown',
          sessionVideoCount: state.videosWatchedThisSession,
        });

        return { xpEarned, shouldClose };
      },

      // ═══════════════════════════════════════════════════════════════════════
      // UNLOCK
      // ═══════════════════════════════════════════════════════════════════════

      markUnlockScreenSeen: () => {
        set({ hasSeenUnlockScreen: true });
        get().logAnalyticsEvent({ type: 'spark_unlocked' });
      },

      // ═══════════════════════════════════════════════════════════════════════
      // ANALYTICS
      // ═══════════════════════════════════════════════════════════════════════

      logAnalyticsEvent: (event) => {
        const state = get();
        const fullEvent: SparkAnalyticsEvent = {
          ...event,
          timestamp: new Date().toISOString(),
        };

        // Keep last 1000 events
        const updated = [...state.analyticsEvents, fullEvent].slice(-1000);
        set({ analyticsEvents: updated });
      },

      getAnalyticsEvents: (limit = 100) => {
        return get().analyticsEvents.slice(-limit);
      },

      // ═══════════════════════════════════════════════════════════════════════
      // STATS
      // ═══════════════════════════════════════════════════════════════════════

      getTotalVideosWatched: () => get().watchedVideos.length,
      getTotalSaved: () => get().savedVideos.length,
      getSessionCount: () => get().sparkSessionsTotal,

      isForcedClosedToday: () => {
        const state = get();
        const today = getTodayString();
        return state.forcedCloseToday && state.lastSparkDate === today;
      },

      // ═══════════════════════════════════════════════════════════════════════
      // RESET
      // ═══════════════════════════════════════════════════════════════════════

      resetSpark: () => {
        set(initialState);
      },
    }),
    {
      name: 'spark-storage',
    }
  )
);

export default useSparkStore;
