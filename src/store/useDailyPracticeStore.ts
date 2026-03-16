import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DailyProgress,
  GlobalCalendar,
  WorldCalendar,
  PastWorldAccess,
  DailyFlowState,
  PastWorldExerciseLog,
} from '@/types/dailyPractice';
import {
  getTodayDateString,
  isToday,
  calculateDayNumber,
  getDailyFlowState,
  canDoPastWorldExercise,
  DAILY_XP_REWARDS,
} from '@/types/dailyPractice';
import type { FlexibleLesson, FlexibleWorld } from '@/types/lessons';
import modernWisdomWorld from '@/content/modernWisdom';

// ═══════════════════════════════════════════════════════════════════════════
// DAILY PRACTICE STORE
// ═══════════════════════════════════════════════════════════════════════════
//
// The synchronized daily lesson system.
// Everyone gets the same lesson on the same day.
// One lesson. One echo. Five exercises. Every day.
//
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// STATE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

interface DailyPracticeState {
  // Today's progress
  todayProgress: DailyProgress | null;

  // Global calendar - synchronized for everyone
  globalCalendar: GlobalCalendar | null;

  // Past world access for exercises
  pastWorldAccess: PastWorldAccess[];

  // Flag for when user has seen today's flow
  hasInitializedToday: boolean;
}

interface DailyPracticeActions {
  // Initialization
  initializeToday: (worlds: FlexibleWorld[]) => void;
  getOrCreateTodayProgress: (worlds: FlexibleWorld[]) => DailyProgress;

  // Today's lesson
  getTodaysLesson: (worlds: FlexibleWorld[]) => FlexibleLesson | null;
  getTomorrowsLesson: (worlds: FlexibleWorld[]) => FlexibleLesson | null;
  getCurrentDayNumber: () => number;
  getTotalDaysInWorld: () => number;

  // Phase completion
  completeLesson: (xpEarned: number, lessonId?: string, totalExercises?: number) => void;
  completeMandatoryEcho: (reflectionId: string) => void;
  completeExercise: (exerciseId: string, response?: string) => number; // Returns XP earned
  markDailyComplete: () => number; // Returns bonus XP

  // Flow state
  getDailyFlowState: () => DailyFlowState;
  isLessonCompletedToday: () => boolean;
  isEchoCompletedToday: () => boolean;
  getExercisesCompletedToday: () => string[];
  isExerciseCompleted: (exerciseId: string) => boolean;
  isDailyPracticeComplete: () => boolean;

  // Past worlds
  canAccessPastWorldExercises: (worldId: string) => boolean;
  canDoPastWorldExerciseToday: (worldId: string) => boolean;
  completePastWorldExercise: (worldId: string, lessonId: string, exerciseId: string, response?: string) => number;
  getPastWorldAccess: () => PastWorldAccess[];

  // World completion
  completeCurrentWorld: () => void;
  startNextWorld: (nextWorld: FlexibleWorld) => void;

  // Reset
  resetDailyPractice: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────

const initialState: DailyPracticeState = {
  todayProgress: null,
  globalCalendar: null,
  pastWorldAccess: [],
  hasInitializedToday: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useDailyPracticeStore = create<DailyPracticeState & DailyPracticeActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ═══════════════════════════════════════════════════════════════════════
      // INITIALIZATION
      // ═══════════════════════════════════════════════════════════════════════

      initializeToday: (worlds: FlexibleWorld[]) => {
        const state = get();
        const today = getTodayDateString();

        // Initialize global calendar if needed
        let calendar = state.globalCalendar;
        if (!calendar) {
          // Start with first world (Modern Wisdom)
          const firstWorld = worlds[0] || modernWisdomWorld;
          const allLessons = firstWorld.chapters.flatMap(ch => ch.lessons);

          calendar = {
            currentWorld: {
              worldId: firstWorld.id,
              worldSlug: firstWorld.slug,
              startDate: today,
              totalDays: allLessons.length,
            },
            completedWorlds: [],
            currentDayNumber: 1,
            isWorldComplete: false,
          };
        }

        // Calculate current day number
        const currentDayNumber = calculateDayNumber(calendar.currentWorld.startDate);
        const isWorldComplete = currentDayNumber > calendar.currentWorld.totalDays;

        // Update calendar with computed values
        calendar = {
          ...calendar,
          currentDayNumber,
          isWorldComplete,
        };

        // Check if we need fresh progress for today
        let todayProgress = state.todayProgress;
        if (!todayProgress || !isToday(todayProgress.date)) {
          // New day - create fresh progress
          const currentWorld = worlds.find(w => w.id === calendar!.currentWorld.worldId) || worlds[0];
          const allLessons = currentWorld.chapters.flatMap(ch => ch.lessons);
          const todaysLessonIndex = currentDayNumber - 1;
          const todaysLesson = allLessons[todaysLessonIndex];

          todayProgress = {
            date: today,
            lessonId: todaysLesson?.id || '',
            worldId: calendar.currentWorld.worldId,
            dayNumber: currentDayNumber,
            lessonCompleted: false,
            lessonCompletedAt: null,
            mandatoryEchoCompleted: false,
            echoReflectionId: null,
            echoCompletedAt: null,
            exercisesCompleted: [],
            exerciseResponses: {},
            allPhasesComplete: false,
          };
        }

        set({
          globalCalendar: calendar,
          todayProgress,
          hasInitializedToday: true,
        });
      },

      getOrCreateTodayProgress: (worlds: FlexibleWorld[]) => {
        const state = get();
        if (!state.todayProgress || !isToday(state.todayProgress.date)) {
          get().initializeToday(worlds);
        }
        return get().todayProgress!;
      },

      // ═══════════════════════════════════════════════════════════════════════
      // TODAY'S LESSON
      // ═══════════════════════════════════════════════════════════════════════

      getTodaysLesson: (worlds: FlexibleWorld[]) => {
        const state = get();
        if (!state.globalCalendar) {
          get().initializeToday(worlds);
        }

        const calendar = get().globalCalendar;
        if (!calendar) return null;

        const currentWorld = worlds.find(w => w.id === calendar.currentWorld.worldId);
        if (!currentWorld) return null;

        const allLessons = currentWorld.chapters.flatMap(ch => ch.lessons);
        const dayNumber = calculateDayNumber(calendar.currentWorld.startDate);
        const lessonIndex = dayNumber - 1;

        if (lessonIndex >= allLessons.length) {
          return null; // World complete
        }

        return allLessons[lessonIndex];
      },

      getTomorrowsLesson: (worlds: FlexibleWorld[]) => {
        const state = get();
        if (!state.globalCalendar) return null;

        const calendar = state.globalCalendar;
        const currentWorld = worlds.find(w => w.id === calendar.currentWorld.worldId);
        if (!currentWorld) return null;

        const allLessons = currentWorld.chapters.flatMap(ch => ch.lessons);
        const dayNumber = calculateDayNumber(calendar.currentWorld.startDate);
        const tomorrowIndex = dayNumber; // Tomorrow is dayNumber (0-indexed would be dayNumber + 1 - 1)

        if (tomorrowIndex >= allLessons.length) {
          return null; // No tomorrow in this world
        }

        return allLessons[tomorrowIndex];
      },

      getCurrentDayNumber: () => {
        const state = get();
        if (!state.globalCalendar) return 1;
        return calculateDayNumber(state.globalCalendar.currentWorld.startDate);
      },

      getTotalDaysInWorld: () => {
        const state = get();
        if (!state.globalCalendar) return 15;
        return state.globalCalendar.currentWorld.totalDays;
      },

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE COMPLETION
      // ═══════════════════════════════════════════════════════════════════════

      completeLesson: (xpEarned: number, lessonId?: string, totalExercises?: number) => {
        const state = get();
        if (!state.todayProgress) return;

        set({
          todayProgress: {
            ...state.todayProgress,
            lessonCompleted: true,
            lessonCompletedAt: new Date().toISOString(),
            // Persist the actual completed lesson ID so exercises can be
            // recovered after a page refresh (exercisesForSession is ephemeral React state)
            ...(lessonId ? { lessonId } : {}),
            // Persist total exercise count so getDailyFlowState uses the correct number
            ...(totalExercises != null ? { totalExercises } : {}),
          },
        });
      },

      completeMandatoryEcho: (reflectionId: string) => {
        const state = get();
        if (!state.todayProgress) return;
        if (!state.todayProgress.lessonCompleted) {
          console.warn('Cannot complete echo before lesson');
          return;
        }

        set({
          todayProgress: {
            ...state.todayProgress,
            mandatoryEchoCompleted: true,
            echoReflectionId: reflectionId,
            echoCompletedAt: new Date().toISOString(),
          },
        });
      },

      completeExercise: (exerciseId: string, response?: string) => {
        const state = get();
        if (!state.todayProgress) return 0;
        if (!state.todayProgress.mandatoryEchoCompleted) {
          console.warn('Cannot complete exercise before mandatory echo');
          return 0;
        }

        // Don't double-complete
        if (state.todayProgress.exercisesCompleted.includes(exerciseId)) {
          return 0;
        }

        const newCompleted = [...state.todayProgress.exercisesCompleted, exerciseId];
        const newResponses = response
          ? { ...state.todayProgress.exerciseResponses, [exerciseId]: response }
          : state.todayProgress.exerciseResponses;

        set({
          todayProgress: {
            ...state.todayProgress,
            exercisesCompleted: newCompleted,
            exerciseResponses: newResponses,
          },
        });

        return DAILY_XP_REWARDS.exercise;
      },

      markDailyComplete: () => {
        const state = get();
        if (!state.todayProgress) return 0;
        if (state.todayProgress.allPhasesComplete) return 0;

        // Check if all phases are actually complete
        const flowState = getDailyFlowState(state.todayProgress, state.todayProgress.totalExercises);
        if (flowState.currentPhase !== 'complete') {
          return 0;
        }

        set({
          todayProgress: {
            ...state.todayProgress,
            allPhasesComplete: true,
          },
        });

        return DAILY_XP_REWARDS.dailyCompletion;
      },

      // ═══════════════════════════════════════════════════════════════════════
      // FLOW STATE
      // ═══════════════════════════════════════════════════════════════════════

      getDailyFlowState: () => {
        const state = get();
        return getDailyFlowState(state.todayProgress, state.todayProgress?.totalExercises);
      },

      isLessonCompletedToday: () => {
        const state = get();
        return state.todayProgress?.lessonCompleted ?? false;
      },

      isEchoCompletedToday: () => {
        const state = get();
        return state.todayProgress?.mandatoryEchoCompleted ?? false;
      },

      getExercisesCompletedToday: () => {
        const state = get();
        return state.todayProgress?.exercisesCompleted ?? [];
      },

      isExerciseCompleted: (exerciseId: string) => {
        const state = get();
        return state.todayProgress?.exercisesCompleted.includes(exerciseId) ?? false;
      },

      isDailyPracticeComplete: () => {
        const state = get();
        return state.todayProgress?.allPhasesComplete ?? false;
      },

      // ═══════════════════════════════════════════════════════════════════════
      // PAST WORLDS
      // ═══════════════════════════════════════════════════════════════════════

      canAccessPastWorldExercises: (worldId: string) => {
        const state = get();
        return state.pastWorldAccess.some(pw => pw.worldId === worldId);
      },

      canDoPastWorldExerciseToday: (worldId: string) => {
        const state = get();
        const pastWorld = state.pastWorldAccess.find(pw => pw.worldId === worldId);
        if (!pastWorld) return false;
        return canDoPastWorldExercise(pastWorld.lastExerciseDate);
      },

      completePastWorldExercise: (worldId: string, lessonId: string, exerciseId: string, response?: string) => {
        const state = get();
        const pastWorld = state.pastWorldAccess.find(pw => pw.worldId === worldId);
        if (!pastWorld) return 0;
        if (!canDoPastWorldExercise(pastWorld.lastExerciseDate)) {
          console.warn('Can only do one past world exercise per day');
          return 0;
        }

        const today = getTodayDateString();
        const newLog: PastWorldExerciseLog = {
          worldId,
          lessonId,
          exerciseId,
          completedAt: new Date().toISOString(),
          response,
        };

        set({
          pastWorldAccess: state.pastWorldAccess.map(pw =>
            pw.worldId === worldId
              ? {
                  ...pw,
                  lastExerciseDate: today,
                  exercisesRedone: [...pw.exercisesRedone, newLog],
                }
              : pw
          ),
        });

        return DAILY_XP_REWARDS.exercise;
      },

      getPastWorldAccess: () => {
        const state = get();
        return state.pastWorldAccess;
      },

      // ═══════════════════════════════════════════════════════════════════════
      // WORLD COMPLETION
      // ═══════════════════════════════════════════════════════════════════════

      completeCurrentWorld: () => {
        const state = get();
        if (!state.globalCalendar) return;

        const today = getTodayDateString();
        const completedWorld: PastWorldAccess = {
          worldId: state.globalCalendar.currentWorld.worldId,
          completedDate: today,
          lastExerciseDate: null,
          exercisesRedone: [],
        };

        const newCompletedWorlds = [
          ...state.globalCalendar.completedWorlds,
          state.globalCalendar.currentWorld,
        ];

        set({
          globalCalendar: {
            ...state.globalCalendar,
            completedWorlds: newCompletedWorlds,
            isWorldComplete: true,
          },
          pastWorldAccess: [...state.pastWorldAccess, completedWorld],
        });
      },

      startNextWorld: (nextWorld: FlexibleWorld) => {
        const state = get();
        if (!state.globalCalendar) return;

        const today = getTodayDateString();
        const allLessons = nextWorld.chapters.flatMap(ch => ch.lessons);

        set({
          globalCalendar: {
            ...state.globalCalendar,
            currentWorld: {
              worldId: nextWorld.id,
              worldSlug: nextWorld.slug,
              startDate: today,
              totalDays: allLessons.length,
            },
            currentDayNumber: 1,
            isWorldComplete: false,
          },
          todayProgress: {
            date: today,
            lessonId: allLessons[0]?.id || '',
            worldId: nextWorld.id,
            dayNumber: 1,
            lessonCompleted: false,
            lessonCompletedAt: null,
            mandatoryEchoCompleted: false,
            echoReflectionId: null,
            echoCompletedAt: null,
            exercisesCompleted: [],
            exerciseResponses: {},
            allPhasesComplete: false,
          },
        });
      },

      // ═══════════════════════════════════════════════════════════════════════
      // RESET
      // ═══════════════════════════════════════════════════════════════════════

      resetDailyPractice: () => {
        set(initialState);
      },
    }),
    {
      name: 'daily-practice-storage',
    }
  )
);

export default useDailyPracticeStore;
