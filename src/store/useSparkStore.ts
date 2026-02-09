import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SparkAnalyticsEvent } from '@/types/spark';
import { SPARK_XP_REWARDS } from '@/types/spark';

const MAX_DAILY_VIDEO_XP = 12;

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

interface SparkState {
  videosWatchedToday: number;
  videosWatchedThisSession: number;
  videoXpEarnedToday: number;

  savedVideos: string[];
  watchedVideos: string[];

  hasSeenUnlockScreen: boolean;
  isFirstSparkSession: boolean;
  lastSparkDate: string;
  sparkSessionsTotal: number;

  analyticsEvents: SparkAnalyticsEvent[];
}

interface SparkActions {
  markVideoWatched: (videoId: string) => number;
  toggleSaveVideo: (videoId: string) => void;
  isVideoSaved: (videoId: string) => boolean;

  startSession: () => void;
  endSession: () => void;
  resetDailyCounters: () => void;

  markUnlockScreenSeen: () => void;

  logAnalyticsEvent: (event: Omit<SparkAnalyticsEvent, 'timestamp'>) => void;
  getAnalyticsEvents: (limit?: number) => SparkAnalyticsEvent[];

  getTotalVideosWatched: () => number;
  getTotalSaved: () => number;
  getSessionCount: () => number;
  isForcedClosedToday: () => boolean;

  resetSpark: () => void;
}

const initialState: SparkState = {
  videosWatchedToday: 0,
  videosWatchedThisSession: 0,
  videoXpEarnedToday: 0,
  savedVideos: [],
  watchedVideos: [],
  hasSeenUnlockScreen: false,
  isFirstSparkSession: true,
  lastSparkDate: '',
  sparkSessionsTotal: 0,
  analyticsEvents: [],
};

export const useSparkStore = create<SparkState & SparkActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      markVideoWatched: (videoId: string) => {
        const state = get();
        const today = getTodayString();

        if (state.lastSparkDate !== today) {
          get().resetDailyCounters();
        }

        const currentState = get();

        const xpEarned = currentState.videoXpEarnedToday < MAX_DAILY_VIDEO_XP
          ? SPARK_XP_REWARDS.videoWatched
          : 0;

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

        get().logAnalyticsEvent({
          type: 'video_watched',
          videoId,
          sessionVideoCount: currentState.videosWatchedThisSession + 1,
        });

        return xpEarned;
      },

      toggleSaveVideo: (videoId: string) => {
        const state = get();
        const saved = state.savedVideos.includes(videoId);

        if (saved) {
          set({ savedVideos: state.savedVideos.filter((id) => id !== videoId) });
          return;
        }

        const updated = [...state.savedVideos, videoId].slice(-500);
        set({ savedVideos: updated });
        get().logAnalyticsEvent({ type: 'video_saved', videoId });
      },

      isVideoSaved: (videoId: string) => get().savedVideos.includes(videoId),

      startSession: () => {
        const today = getTodayString();
        const state = get();

        if (state.lastSparkDate !== today) {
          get().resetDailyCounters();
        }

        set({
          videosWatchedThisSession: 0,
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
        set({
          videosWatchedToday: 0,
          videoXpEarnedToday: 0,
          lastSparkDate: getTodayString(),
        });
      },

      markUnlockScreenSeen: () => {
        set({ hasSeenUnlockScreen: true });
        get().logAnalyticsEvent({ type: 'spark_unlocked' });
      },

      logAnalyticsEvent: (event) => {
        const fullEvent: SparkAnalyticsEvent = {
          ...event,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          analyticsEvents: [...state.analyticsEvents, fullEvent].slice(-1000),
        }));
      },

      getAnalyticsEvents: (limit = 100) => get().analyticsEvents.slice(-limit),

      getTotalVideosWatched: () => get().watchedVideos.length,
      getTotalSaved: () => get().savedVideos.length,
      getSessionCount: () => get().sparkSessionsTotal,

      // Kept for compatibility with existing UI checks.
      isForcedClosedToday: () => false,

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
