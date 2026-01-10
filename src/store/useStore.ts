import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TransformationGoal } from '@/types';

interface CheckinResponseData {
  promptId: string;
  mainResponse: string;
  followUpResponse?: string;
}

interface WeeklyCheckinData {
  id: string;
  date: string;
  weekNumber: number;
  responses: CheckinResponseData[];
  xpEarned: number;
}

// Reflection data for pattern analysis
export interface ReflectionEntry {
  id: string;
  lessonId: string;
  lessonTitle: string;
  coreConceptTag: string;
  reflection: string;
  actionCompleted: boolean;
  date: string;
}

// ============================================
// PHASE 2: PROOF OF TRANSFORMATION
// ============================================

// Monthly Self-Assessment - 5 dimensions measured 1-10
export interface MonthlyAssessment {
  id: string;
  date: string; // ISO date string
  month: string; // "2025-01" format for easy grouping
  scores: {
    emotionalMastery: number;  // 1-10: Managing difficult emotions
    discipline: number;        // 1-10: Consistency with commitments
    perspective: number;       // 1-10: Maintaining wisdom in challenges
    selfAwareness: number;     // 1-10: Noticing thought patterns
    growth: number;            // 1-10: Learning and improving
  };
  reflection: string; // Open-ended reflection on the month
  xpEarned: number;
}

// Wisdom in Action - Real-world application log
export interface WisdomInAction {
  id: string;
  date: string;
  situation: string;      // What happened
  stoicPrinciple: string; // Which principle was applied
  application: string;    // How the principle was applied
  outcome: string;        // What was the result
  tags: string[];         // e.g., ["dichotomy-of-control", "patience"]
}

// Pattern themes to track in reflections
export type PatternTheme =
  | 'control'
  | 'acceptance'
  | 'patience'
  | 'courage'
  | 'discipline'
  | 'gratitude'
  | 'perspective'
  | 'judgment'
  | 'anger'
  | 'fear'
  | 'comparison'
  | 'procrastination';

// Monthly pattern frequency
export interface MonthlyPatternData {
  month: string; // "2025-01" format
  themes: Record<PatternTheme, number>; // count of each theme
  totalReflections: number;
}

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

  // Weekly check-ins
  weeklyCheckins: WeeklyCheckinData[];
  lastCheckinDate: string | null;

  // Reflections for pattern analysis (last 14 for AI, all for historical)
  reflections: ReflectionEntry[];
  allReflections: ReflectionEntry[]; // Keep ALL reflections for pattern tracking

  // Phase 2: Proof of Transformation
  monthlyAssessments: MonthlyAssessment[];
  wisdomInActionLogs: WisdomInAction[];
  lastAssessmentMonth: string | null; // "2025-01" format

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

  // Weekly check-ins
  completeWeeklyCheckin: (responses: CheckinResponseData[]) => void;
  isCheckinDue: () => boolean;
  getWeekNumber: () => number;

  // Reflections
  saveReflection: (entry: Omit<ReflectionEntry, 'id' | 'date'>) => void;
  getRecentReflections: (count?: number) => ReflectionEntry[];

  // Phase 2: Proof of Transformation
  saveMonthlyAssessment: (assessment: Omit<MonthlyAssessment, 'id' | 'date' | 'month' | 'xpEarned'>) => void;
  isAssessmentDue: () => boolean;
  getAssessmentHistory: () => MonthlyAssessment[];
  getAssessmentComparison: (months?: number) => { current: MonthlyAssessment | null; previous: MonthlyAssessment | null };

  // Wisdom in Action
  saveWisdomInAction: (entry: Omit<WisdomInAction, 'id' | 'date'>) => void;
  getWisdomInActionLogs: (limit?: number) => WisdomInAction[];

  // Pattern Analysis
  analyzePatterns: (month?: string) => MonthlyPatternData;
  getPatternTrends: () => { theme: PatternTheme; trend: 'up' | 'down' | 'stable'; change: number }[];

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
  weeklyCheckins: [],
  lastCheckinDate: null,
  reflections: [],
  allReflections: [],
  monthlyAssessments: [],
  wisdomInActionLogs: [],
  lastAssessmentMonth: null,
  soundEnabled: true,
  hapticEnabled: true,
};

// Pattern keywords to detect in reflections
const PATTERN_KEYWORDS: Record<PatternTheme, string[]> = {
  control: ['control', 'controlling', 'controllable', 'uncontrollable', 'grip', 'hold on', 'let go', 'release'],
  acceptance: ['accept', 'acceptance', 'accepting', 'resist', 'resistance', 'embrace', 'surrender'],
  patience: ['patient', 'patience', 'impatient', 'wait', 'waiting', 'rush', 'rushing', 'hurry'],
  courage: ['courage', 'courageous', 'brave', 'fear', 'afraid', 'scared', 'bold'],
  discipline: ['discipline', 'disciplined', 'consistent', 'consistency', 'habit', 'routine', 'commitment'],
  gratitude: ['grateful', 'gratitude', 'thankful', 'appreciate', 'appreciation', 'blessed'],
  perspective: ['perspective', 'view', 'viewpoint', 'reframe', 'see differently', 'bigger picture'],
  judgment: ['judge', 'judgment', 'judging', 'critical', 'criticism', 'opinion', 'opinions'],
  anger: ['anger', 'angry', 'frustrated', 'frustration', 'irritated', 'annoyed', 'rage'],
  fear: ['fear', 'fears', 'afraid', 'anxious', 'anxiety', 'worry', 'worried', 'scared'],
  comparison: ['compare', 'comparison', 'comparing', 'envy', 'jealous', 'jealousy', 'others have'],
  procrastination: ['procrastinate', 'procrastination', 'delay', 'delayed', 'put off', 'avoid', 'avoiding'],
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

      // Weekly check-in actions
      getWeekNumber: () => {
        const state = get();
        const onboardingDate = state.userId ? new Date() : new Date();
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - onboardingDate.getTime());
        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
        return diffWeeks + 1;
      },

      isCheckinDue: () => {
        const state = get();
        const lastCheckin = state.lastCheckinDate;

        // If never done a check-in and completed at least 3 lessons, it's due
        if (!lastCheckin) {
          const completedCount = Object.keys(state.completedLessons).length;
          return completedCount >= 3;
        }

        // Check if it's been at least 7 days since last check-in
        const lastDate = new Date(lastCheckin);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 7;
      },

      completeWeeklyCheckin: (responses) => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const xpEarned = 50; // Bonus XP for completing check-in

        const newCheckin: WeeklyCheckinData = {
          id: crypto.randomUUID(),
          date: today,
          weekNumber: get().getWeekNumber(),
          responses,
          xpEarned,
        };

        set({
          weeklyCheckins: [...state.weeklyCheckins, newCheckin],
          lastCheckinDate: today,
          totalXp: state.totalXp + xpEarned,
        });
      },

      // Reflection storage for pattern analysis
      saveReflection: (entry) => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        const newReflection: ReflectionEntry = {
          ...entry,
          id: crypto.randomUUID(),
          date: today,
        };

        // Keep only the last 14 reflections for AI analysis
        const updatedReflections = [...state.reflections, newReflection].slice(-14);
        // Keep ALL reflections for historical pattern tracking
        const updatedAllReflections = [...state.allReflections, newReflection];

        set({
          reflections: updatedReflections,
          allReflections: updatedAllReflections,
        });
      },

      getRecentReflections: (count = 14) => {
        const state = get();
        return state.reflections.slice(-count);
      },

      // ============================================
      // PHASE 2: Monthly Self-Assessment
      // ============================================
      saveMonthlyAssessment: (assessment) => {
        const state = get();
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const xpEarned = 100; // Bonus XP for completing assessment

        const newAssessment: MonthlyAssessment = {
          ...assessment,
          id: crypto.randomUUID(),
          date: now.toISOString(),
          month,
          xpEarned,
        };

        set({
          monthlyAssessments: [...state.monthlyAssessments, newAssessment],
          lastAssessmentMonth: month,
          totalXp: state.totalXp + xpEarned,
        });
      },

      isAssessmentDue: () => {
        const state = get();
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        // Assessment is due if we haven't done one this month
        // AND we have at least 5 completed lessons
        const completedCount = Object.keys(state.completedLessons).length;
        return state.lastAssessmentMonth !== currentMonth && completedCount >= 5;
      },

      getAssessmentHistory: () => {
        const state = get();
        return [...state.monthlyAssessments].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      },

      getAssessmentComparison: (months = 2) => {
        const state = get();
        const sorted = [...state.monthlyAssessments].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return {
          current: sorted[0] || null,
          previous: sorted[1] || null,
        };
      },

      // ============================================
      // PHASE 2: Wisdom in Action Log
      // ============================================
      saveWisdomInAction: (entry) => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        const newEntry: WisdomInAction = {
          ...entry,
          id: crypto.randomUUID(),
          date: today,
        };

        // Award bonus XP for logging wisdom in action
        const xpBonus = 15;

        set({
          wisdomInActionLogs: [...state.wisdomInActionLogs, newEntry],
          totalXp: state.totalXp + xpBonus,
        });
      },

      getWisdomInActionLogs: (limit = 50) => {
        const state = get();
        return [...state.wisdomInActionLogs]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },

      // ============================================
      // PHASE 2: Pattern Analysis
      // ============================================
      analyzePatterns: (month) => {
        const state = get();
        const targetMonth = month || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

        // Filter reflections for the target month
        const monthReflections = state.allReflections.filter(r => r.date.startsWith(targetMonth));

        // Count theme occurrences
        const themes: Record<PatternTheme, number> = {
          control: 0,
          acceptance: 0,
          patience: 0,
          courage: 0,
          discipline: 0,
          gratitude: 0,
          perspective: 0,
          judgment: 0,
          anger: 0,
          fear: 0,
          comparison: 0,
          procrastination: 0,
        };

        monthReflections.forEach(r => {
          const text = r.reflection.toLowerCase();
          (Object.keys(PATTERN_KEYWORDS) as PatternTheme[]).forEach(theme => {
            const keywords = PATTERN_KEYWORDS[theme];
            keywords.forEach(keyword => {
              if (text.includes(keyword)) {
                themes[theme]++;
              }
            });
          });
        });

        return {
          month: targetMonth,
          themes,
          totalReflections: monthReflections.length,
        };
      },

      getPatternTrends: () => {
        const state = get();
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        // Get previous month
        const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

        const currentPatterns = get().analyzePatterns(currentMonth);
        const prevPatterns = get().analyzePatterns(prevMonth);

        const trends: { theme: PatternTheme; trend: 'up' | 'down' | 'stable'; change: number }[] = [];

        (Object.keys(currentPatterns.themes) as PatternTheme[]).forEach(theme => {
          const current = currentPatterns.themes[theme];
          const prev = prevPatterns.themes[theme];
          const change = current - prev;

          let trend: 'up' | 'down' | 'stable' = 'stable';
          if (change > 0) trend = 'up';
          if (change < 0) trend = 'down';

          trends.push({ theme, trend, change });
        });

        return trends;
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
