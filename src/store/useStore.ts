import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TransformationGoal } from '@/types';

interface UserState {
  // User identity
  userId: string | null;
  name: string | null;
  transformationGoal: TransformationGoal | null;
  whyStatement: string | null;
  dailyCommitmentMinutes: number;

  // Onboarding
  onboardingComplete: boolean;
  onboardingStep: number;

  // Gamification
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  graceDays: number;
  lastLessonDate: string | null;

  // Current session
  currentWorldSlug: string | null;
  currentLessonId: string | null;

  // Lesson progress (map of lessonId -> completed)
  completedLessons: Record<string, boolean>;

  // Settings
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

interface UserActions {
  // Onboarding
  setOnboardingStep: (step: number) => void;
  setTransformationGoal: (goal: TransformationGoal) => void;
  setWhyStatement: (statement: string) => void;
  setDailyCommitment: (minutes: number) => void;
  setName: (name: string) => void;
  completeOnboarding: () => void;

  // Lesson completion
  completeLesson: (lessonId: string, xpEarned: number) => void;
  setCurrentLesson: (lessonId: string | null) => void;
  setCurrentWorld: (worldSlug: string | null) => void;

  // Streak
  updateStreak: () => void;
  useGraceDay: () => boolean;
  earnGraceDay: () => void;

  // Settings
  toggleSound: () => void;
  toggleHaptic: () => void;

  // Reset
  resetUser: () => void;
}

const initialState: UserState = {
  userId: null,
  name: null,
  transformationGoal: null,
  whyStatement: null,
  dailyCommitmentMinutes: 5,
  onboardingComplete: false,
  onboardingStep: 0,
  totalXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  graceDays: 1,
  lastLessonDate: null,
  currentWorldSlug: null,
  currentLessonId: null,
  completedLessons: {},
  soundEnabled: true,
  hapticEnabled: true,
};

export const useStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Onboarding actions
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      setTransformationGoal: (goal) => set({ transformationGoal: goal }),

      setWhyStatement: (statement) => set({ whyStatement: statement }),

      setDailyCommitment: (minutes) => set({ dailyCommitmentMinutes: minutes }),

      setName: (name) => set({ name }),

      completeOnboarding: () => set({
        onboardingComplete: true,
        userId: crypto.randomUUID(),
      }),

      // Lesson actions
      completeLesson: (lessonId, xpEarned) => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();

        set({
          completedLessons: { ...state.completedLessons, [lessonId]: true },
          totalXp: state.totalXp + xpEarned,
          lastLessonDate: today,
        });

        // Update streak after completing lesson
        get().updateStreak();
      },

      setCurrentLesson: (lessonId) => set({ currentLessonId: lessonId }),

      setCurrentWorld: (worldSlug) => set({ currentWorldSlug: worldSlug }),

      // Streak management
      updateStreak: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const lastLesson = state.lastLessonDate;

        if (!lastLesson) {
          // First lesson ever
          set({ currentStreak: 1, longestStreak: Math.max(1, state.longestStreak) });
          return;
        }

        const lastDate = new Date(lastLesson);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          // Same day, streak unchanged
          return;
        } else if (diffDays === 1) {
          // Next day, streak continues
          const newStreak = state.currentStreak + 1;
          set({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak)
          });

          // Earn grace day every 7 days
          if (newStreak % 7 === 0) {
            get().earnGraceDay();
          }
        } else if (diffDays > 1) {
          // Streak broken - will need grace day or reset
          set({ currentStreak: 1 });
        }
      },

      useGraceDay: () => {
        const state = get();
        if (state.graceDays > 0) {
          set({ graceDays: state.graceDays - 1 });
          return true;
        }
        return false;
      },

      earnGraceDay: () => {
        const state = get();
        set({ graceDays: Math.min(state.graceDays + 1, 5) }); // Max 5 grace days
      },

      // Settings
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      toggleHaptic: () => set((state) => ({ hapticEnabled: !state.hapticEnabled })),

      // Reset
      resetUser: () => set(initialState),
    }),
    {
      name: 'transformation-hub-storage',
    }
  )
);

export default useStore;
