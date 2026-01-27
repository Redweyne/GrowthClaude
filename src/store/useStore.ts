import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TransformationGoal } from '@/types';
import type { AchievementUnlock } from '@/types/achievements';
import type { IdentityStatement, IdentityContext } from '@/types/identity';
import { ACHIEVEMENTS } from '@/types/achievements';

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
    emotionalMastery: number;
    discipline: number;
    perspective: number;
    selfAwareness: number;
    growth: number;
  };
  reflection: string;
  xpEarned: number;
}

// Wisdom in Action - Real-world application log
export interface WisdomInAction {
  id: string;
  date: string;
  situation: string;
  stoicPrinciple: string;
  application: string;
  outcome: string;
  tags: string[];
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
  month: string;
  themes: Record<PatternTheme, number>;
  totalReflections: number;
}

// ============================================
// PHASE 3: ACTIVITY TRACKING
// ============================================

export interface ActivityDay {
  date: string; // "YYYY-MM-DD"
  lessonsCompleted: number;
  xpEarned: number;
  reflectionsWritten: number;
}

// Pending action for GoDoIt lessons
export interface PendingLessonAction {
  lessonId: string;
  currentStepId: string;
  choices: Record<string, string>;
  writings: Record<string, string>;
  dismissedAt: string;
}

interface UserState {
  // Language settings
  language: 'en' | 'fr' | 'ar';
  languageSelected: boolean;

  // User identity
  userId: string | null;
  name: string | null;
  transformationGoal: TransformationGoal | null;
  whyStatement: string | null;
  dailyCommitmentMinutes: number;
  communityIdentity: 'brother' | 'sister' | 'traveler' | null;

  // Onboarding
  onboardingComplete: boolean;
  onboardingStep: number;

  // First session coaching (only shown once)
  firstSessionComplete: boolean;
  coachingStepsSeen: {
    beforeFirstLesson: boolean;
    afterLessonBeforeEcho: boolean;
    afterEchoBeforeExercises: boolean;
    afterFirstDayComplete: boolean;
  };

  // Help system
  helpDismissed: Record<string, boolean>; // Track which help tooltips user has dismissed

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

  // Reflections for pattern analysis
  reflections: ReflectionEntry[];
  allReflections: ReflectionEntry[];

  // Phase 2: Proof of Transformation
  monthlyAssessments: MonthlyAssessment[];
  wisdomInActionLogs: WisdomInAction[];
  lastAssessmentMonth: string | null;

  // Phase 3: Identity & Achievements
  identityStatements: IdentityStatement[];
  unlockedAchievements: AchievementUnlock[];
  activityLog: ActivityDay[];
  pendingAchievementCelebration: string | null; // Achievement ID to celebrate

  // Pending lesson action (for GoDoIt lessons)
  pendingLessonAction: PendingLessonAction | null;

  // Settings
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

interface UserActions {
  // Language
  setLanguage: (language: 'en' | 'fr' | 'ar') => void;
  markLanguageSelected: () => void;

  // Onboarding
  setOnboardingStep: (step: number) => void;
  setTransformationGoal: (goal: TransformationGoal) => void;
  setWhyStatement: (statement: string) => void;
  setDailyCommitment: (minutes: number) => void;
  setName: (name: string) => void;
  setCommunityIdentity: (identity: 'brother' | 'sister' | 'traveler') => void;
  completeOnboarding: () => void;

  // First session coaching
  markCoachingStepSeen: (step: keyof UserState['coachingStepsSeen']) => void;
  isCoachingStepSeen: (step: keyof UserState['coachingStepsSeen']) => boolean;
  completeFirstSession: () => void;
  isFirstSession: () => boolean;

  // Help system
  dismissHelp: (helpId: string) => void;
  isHelpDismissed: (helpId: string) => boolean;
  resetHelpDismissals: () => void;

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
  getAssessmentComparison: () => { current: MonthlyAssessment | null; previous: MonthlyAssessment | null };

  // Wisdom in Action
  saveWisdomInAction: (entry: Omit<WisdomInAction, 'id' | 'date'>) => void;
  getWisdomInActionLogs: (limit?: number) => WisdomInAction[];

  // Pattern Analysis
  analyzePatterns: (month?: string) => MonthlyPatternData;
  getPatternTrends: () => { theme: PatternTheme; trend: 'up' | 'down' | 'stable'; change: number }[];

  // Phase 3: Identity Statements
  saveIdentityStatement: (statement: string, context: IdentityContext, tags?: string[]) => void;
  getIdentityStatements: () => IdentityStatement[];

  // Phase 3: Achievements
  checkAndUnlockAchievements: () => string[]; // Returns newly unlocked achievement IDs
  isAchievementUnlocked: (achievementId: string) => boolean;
  getUnlockedAchievements: () => AchievementUnlock[];
  markAchievementCelebrated: (achievementId: string) => void;
  getPendingCelebration: () => string | null;
  clearPendingCelebration: () => void;

  // Phase 3: Activity Log
  getActivityLog: (days?: number) => ActivityDay[];
  getStreakCalendarData: (months?: number) => ActivityDay[];

  // Phase 3: Stats
  getProgressStats: () => {
    totalLessons: number;
    totalReflections: number;
    totalWords: number;
    totalIdentityStatements: number;
    totalAchievements: number;
    daysSinceStart: number;
    averageReflectionLength: number;
  };

  // Pending Lesson Actions (for GoDoIt lessons)
  savePendingLessonAction: (action: PendingLessonAction) => void;
  getPendingLessonAction: () => PendingLessonAction | null;
  clearPendingLessonAction: () => void;
  hasPendingLessonAction: (lessonId: string) => boolean;

  // Settings
  toggleSound: () => void;
  toggleHaptic: () => void;
  setSoundEnabled: (enabled: boolean) => void;

  // Reset
  resetUser: () => void;

  // Demo data for testing story feature
  seedDemoData: () => void;
}

const initialState: UserState = {
  // Language
  language: 'en',
  languageSelected: false,

  userId: null,
  name: null,
  transformationGoal: null,
  whyStatement: null,
  dailyCommitmentMinutes: 5,
  communityIdentity: null,
  onboardingComplete: false,
  onboardingStep: 0,
  // First session coaching
  firstSessionComplete: false,
  coachingStepsSeen: {
    beforeFirstLesson: false,
    afterLessonBeforeEcho: false,
    afterEchoBeforeExercises: false,
    afterFirstDayComplete: false,
  },
  // Help system
  helpDismissed: {},
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
  // Phase 3
  identityStatements: [],
  unlockedAchievements: [],
  activityLog: [],
  pendingAchievementCelebration: null,
  // Pending lesson action
  pendingLessonAction: null,
  // Settings
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

      // ============================================
      // LANGUAGE ACTIONS
      // ============================================
      setLanguage: (language) => set({ language, languageSelected: true }),
      markLanguageSelected: () => set({ languageSelected: true }),

      // ============================================
      // ONBOARDING ACTIONS
      // ============================================
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      setTransformationGoal: (goal) => set({ transformationGoal: goal }),
      setWhyStatement: (statement) => set({ whyStatement: statement }),
      setDailyCommitment: (minutes) => set({ dailyCommitmentMinutes: minutes }),
      setName: (name) => set({ name }),
      setCommunityIdentity: (identity) => set({ communityIdentity: identity }),
      completeOnboarding: () => set({
        onboardingComplete: true,
        userId: crypto.randomUUID(),
      }),

      // ============================================
      // FIRST SESSION COACHING
      // ============================================
      markCoachingStepSeen: (step) => {
        const state = get();
        set({
          coachingStepsSeen: {
            ...state.coachingStepsSeen,
            [step]: true,
          },
        });
      },

      isCoachingStepSeen: (step) => {
        const state = get();
        return state.coachingStepsSeen[step] || state.firstSessionComplete;
      },

      completeFirstSession: () => {
        set({ firstSessionComplete: true });
      },

      isFirstSession: () => {
        const state = get();
        return !state.firstSessionComplete;
      },

      // ============================================
      // HELP SYSTEM
      // ============================================
      dismissHelp: (helpId) => {
        const state = get();
        set({
          helpDismissed: {
            ...state.helpDismissed,
            [helpId]: true,
          },
        });
      },

      isHelpDismissed: (helpId) => {
        const state = get();
        return state.helpDismissed[helpId] || false;
      },

      resetHelpDismissals: () => {
        set({ helpDismissed: {} });
      },

      // ============================================
      // LESSON ACTIONS
      // ============================================
      completeLesson: (lessonId, xpEarned) => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const previousLastLessonDate = state.lastLessonDate;

        // Calculate new streak
        let newStreak = state.currentStreak;
        let newLongestStreak = state.longestStreak;

        if (!previousLastLessonDate) {
          newStreak = 1;
          newLongestStreak = Math.max(1, state.longestStreak);
        } else if (previousLastLessonDate === today) {
          newStreak = Math.max(state.currentStreak, 1);
        } else {
          const lastDate = new Date(previousLastLessonDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak = state.currentStreak + 1;
            newLongestStreak = Math.max(newStreak, state.longestStreak);
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        }

        if (newStreak < 1) newStreak = 1;

        // Update activity log
        const existingActivity = state.activityLog.find(a => a.date === today);
        let newActivityLog: ActivityDay[];

        if (existingActivity) {
          newActivityLog = state.activityLog.map(a =>
            a.date === today
              ? { ...a, lessonsCompleted: a.lessonsCompleted + 1, xpEarned: a.xpEarned + xpEarned }
              : a
          );
        } else {
          newActivityLog = [...state.activityLog, {
            date: today,
            lessonsCompleted: 1,
            xpEarned: xpEarned,
            reflectionsWritten: 0,
          }];
        }

        set({
          completedLessons: { ...state.completedLessons, [lessonId]: true },
          totalXp: state.totalXp + xpEarned,
          lastLessonDate: today,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          activityLog: newActivityLog,
        });

        // Check for new achievements after lesson completion
        setTimeout(() => get().checkAndUnlockAchievements(), 100);
      },

      setCurrentLesson: (lessonId) => set({ currentLessonId: lessonId }),
      setCurrentWorld: (worldSlug) => set({ currentWorldSlug: worldSlug }),

      // ============================================
      // STREAK MANAGEMENT
      // ============================================
      updateStreak: () => {
        const state = get();
        if (state.currentStreak < 1 && Object.keys(state.completedLessons).length > 0) {
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
        set({ graceDays: Math.min(state.graceDays + 1, 5) });
      },

      // ============================================
      // WEEKLY CHECK-INS
      // ============================================
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

        if (!lastCheckin) {
          const completedCount = Object.keys(state.completedLessons).length;
          return completedCount >= 3;
        }

        const lastDate = new Date(lastCheckin);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 7;
      },

      completeWeeklyCheckin: (responses) => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const xpEarned = 50;

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

        // Check for first-checkin achievement
        setTimeout(() => get().checkAndUnlockAchievements(), 100);
      },

      // ============================================
      // REFLECTIONS
      // ============================================
      saveReflection: (entry) => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        const newReflection: ReflectionEntry = {
          ...entry,
          id: crypto.randomUUID(),
          date: today,
        };

        const updatedReflections = [...state.reflections, newReflection].slice(-14);
        const updatedAllReflections = [...state.allReflections, newReflection];

        // Update activity log
        const existingActivity = state.activityLog.find(a => a.date === today);
        let newActivityLog: ActivityDay[];

        if (existingActivity) {
          newActivityLog = state.activityLog.map(a =>
            a.date === today
              ? { ...a, reflectionsWritten: a.reflectionsWritten + 1 }
              : a
          );
        } else {
          newActivityLog = [...state.activityLog, {
            date: today,
            lessonsCompleted: 0,
            xpEarned: 0,
            reflectionsWritten: 1,
          }];
        }

        set({
          reflections: updatedReflections,
          allReflections: updatedAllReflections,
          activityLog: newActivityLog,
        });

        // Check for reflection achievements
        setTimeout(() => get().checkAndUnlockAchievements(), 100);
      },

      getRecentReflections: (count = 14) => {
        const state = get();
        return state.reflections.slice(-count);
      },

      // ============================================
      // PHASE 2: MONTHLY ASSESSMENT
      // ============================================
      saveMonthlyAssessment: (assessment) => {
        const state = get();
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const xpEarned = 100;

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

        // Check for first-assessment achievement
        setTimeout(() => get().checkAndUnlockAchievements(), 100);
      },

      isAssessmentDue: () => {
        const state = get();
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const completedCount = Object.keys(state.completedLessons).length;
        return state.lastAssessmentMonth !== currentMonth && completedCount >= 1;
      },

      getAssessmentHistory: () => {
        const state = get();
        return [...state.monthlyAssessments].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      },

      getAssessmentComparison: () => {
        const sorted = [...get().monthlyAssessments].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return {
          current: sorted[0] || null,
          previous: sorted[1] || null,
        };
      },

      // ============================================
      // WISDOM IN ACTION
      // ============================================
      saveWisdomInAction: (entry) => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        const newEntry: WisdomInAction = {
          ...entry,
          id: crypto.randomUUID(),
          date: today,
        };

        const xpBonus = 15;

        set({
          wisdomInActionLogs: [...state.wisdomInActionLogs, newEntry],
          totalXp: state.totalXp + xpBonus,
        });

        // Check for wisdom-action achievement
        setTimeout(() => get().checkAndUnlockAchievements(), 100);
      },

      getWisdomInActionLogs: (limit = 50) => {
        const state = get();
        return [...state.wisdomInActionLogs]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },

      // ============================================
      // PATTERN ANALYSIS
      // ============================================
      analyzePatterns: (month) => {
        const state = get();
        const targetMonth = month || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        const monthReflections = state.allReflections.filter(r => r.date.startsWith(targetMonth));

        const themes: Record<PatternTheme, number> = {
          control: 0, acceptance: 0, patience: 0, courage: 0, discipline: 0, gratitude: 0,
          perspective: 0, judgment: 0, anger: 0, fear: 0, comparison: 0, procrastination: 0,
        };

        monthReflections.forEach(r => {
          const text = r.reflection.toLowerCase();
          (Object.keys(PATTERN_KEYWORDS) as PatternTheme[]).forEach(theme => {
            PATTERN_KEYWORDS[theme].forEach(keyword => {
              if (text.includes(keyword)) themes[theme]++;
            });
          });
        });

        return { month: targetMonth, themes, totalReflections: monthReflections.length };
      },

      getPatternTrends: () => {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

        const currentPatterns = get().analyzePatterns(currentMonth);
        const prevPatterns = get().analyzePatterns(prevMonth);

        return (Object.keys(currentPatterns.themes) as PatternTheme[]).map(theme => {
          const change = currentPatterns.themes[theme] - prevPatterns.themes[theme];
          return {
            theme,
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
            change,
          };
        });
      },

      // ============================================
      // PHASE 3: IDENTITY STATEMENTS
      // ============================================
      saveIdentityStatement: (statement, context, tags = []) => {
        const state = get();
        const now = new Date().toISOString();

        const newStatement: IdentityStatement = {
          id: crypto.randomUUID(),
          statement,
          createdAt: now,
          context,
          tags,
        };

        // Award XP for identity statement
        const xpBonus = 25;

        set({
          identityStatements: [...state.identityStatements, newStatement],
          totalXp: state.totalXp + xpBonus,
        });

        // Check for identity achievements
        setTimeout(() => get().checkAndUnlockAchievements(), 100);
      },

      getIdentityStatements: () => {
        const state = get();
        return [...state.identityStatements].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },

      // ============================================
      // PHASE 3: ACHIEVEMENTS
      // ============================================
      checkAndUnlockAchievements: () => {
        const state = get();
        const newlyUnlocked: string[] = [];
        const alreadyUnlocked = state.unlockedAchievements.map(a => a.achievementId);

        const lessonCount = Object.keys(state.completedLessons).length;
        const reflectionCount = state.allReflections.length;
        const identityCount = state.identityStatements.length;
        const currentXp = state.totalXp;
        const streak = state.currentStreak;

        for (const achievement of ACHIEVEMENTS) {
          if (alreadyUnlocked.includes(achievement.id)) continue;

          let shouldUnlock = false;
          const { type, value, specialCondition } = achievement.requirement;

          switch (type) {
            case 'streak':
              shouldUnlock = streak >= value;
              break;
            case 'lessons':
              shouldUnlock = lessonCount >= value;
              break;
            case 'reflections':
              shouldUnlock = reflectionCount >= value;
              break;
            case 'identity':
              shouldUnlock = identityCount >= value;
              break;
            case 'xp':
              shouldUnlock = currentXp >= value;
              break;
            case 'special':
              switch (specialCondition) {
                case 'first-practice':
                  // Check if any practice lessons completed
                  shouldUnlock = Object.keys(state.completedLessons).some(id => id.startsWith('practice-'));
                  break;
                case 'first-checkin':
                  shouldUnlock = state.weeklyCheckins.length >= 1;
                  break;
                case 'first-assessment':
                  shouldUnlock = state.monthlyAssessments.length >= 1;
                  break;
                case 'first-wisdom-action':
                  shouldUnlock = state.wisdomInActionLogs.length >= 1;
                  break;
              }
              break;
          }

          if (shouldUnlock) {
            newlyUnlocked.push(achievement.id);
          }
        }

        if (newlyUnlocked.length > 0) {
          const now = new Date().toISOString();
          const newUnlocks: AchievementUnlock[] = newlyUnlocked.map(id => ({
            achievementId: id,
            unlockedAt: now,
            celebrated: false,
          }));

          // Calculate bonus XP from achievements
          const bonusXp = newlyUnlocked.reduce((sum, id) => {
            const achievement = ACHIEVEMENTS.find(a => a.id === id);
            return sum + (achievement?.xpBonus || 0);
          }, 0);

          set({
            unlockedAchievements: [...state.unlockedAchievements, ...newUnlocks],
            totalXp: state.totalXp + bonusXp,
            pendingAchievementCelebration: newlyUnlocked[0], // Queue first one for celebration
          });
        }

        return newlyUnlocked;
      },

      isAchievementUnlocked: (achievementId) => {
        const state = get();
        return state.unlockedAchievements.some(a => a.achievementId === achievementId);
      },

      getUnlockedAchievements: () => {
        const state = get();
        return [...state.unlockedAchievements].sort((a, b) =>
          new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
        );
      },

      markAchievementCelebrated: (achievementId) => {
        const state = get();
        set({
          unlockedAchievements: state.unlockedAchievements.map(a =>
            a.achievementId === achievementId ? { ...a, celebrated: true } : a
          ),
        });
      },

      getPendingCelebration: () => {
        const state = get();
        return state.pendingAchievementCelebration;
      },

      clearPendingCelebration: () => {
        set({ pendingAchievementCelebration: null });
      },

      // ============================================
      // PHASE 3: ACTIVITY LOG & STATS
      // ============================================
      getActivityLog: (days = 30) => {
        const state = get();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffStr = cutoff.toISOString().split('T')[0];

        return state.activityLog
          .filter(a => a.date >= cutoffStr)
          .sort((a, b) => a.date.localeCompare(b.date));
      },

      getStreakCalendarData: (months = 3) => {
        const state = get();
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - months);
        const cutoffStr = cutoff.toISOString().split('T')[0];

        return state.activityLog
          .filter(a => a.date >= cutoffStr)
          .sort((a, b) => a.date.localeCompare(b.date));
      },

      getProgressStats: () => {
        const state = get();
        const totalLessons = Object.keys(state.completedLessons).length;
        const totalReflections = state.allReflections.length;
        const totalWords = state.allReflections.reduce(
          (sum, r) => sum + r.reflection.split(/\s+/).length, 0
        );
        const totalIdentityStatements = state.identityStatements.length;
        const totalAchievements = state.unlockedAchievements.length;

        // Calculate days since start
        const firstActivity = state.activityLog[0];
        const daysSinceStart = firstActivity
          ? Math.floor((Date.now() - new Date(firstActivity.date).getTime()) / (1000 * 60 * 60 * 24)) + 1
          : 0;

        const averageReflectionLength = totalReflections > 0
          ? Math.round(totalWords / totalReflections)
          : 0;

        return {
          totalLessons,
          totalReflections,
          totalWords,
          totalIdentityStatements,
          totalAchievements,
          daysSinceStart,
          averageReflectionLength,
        };
      },

      // ============================================
      // PENDING LESSON ACTIONS (GoDoIt)
      // ============================================
      savePendingLessonAction: (action) => {
        set({ pendingLessonAction: action });
      },

      getPendingLessonAction: () => {
        return get().pendingLessonAction;
      },

      clearPendingLessonAction: () => {
        set({ pendingLessonAction: null });
      },

      hasPendingLessonAction: (lessonId) => {
        const pending = get().pendingLessonAction;
        return pending !== null && pending.lessonId === lessonId;
      },

      // ============================================
      // SETTINGS
      // ============================================
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleHaptic: () => set((state) => ({ hapticEnabled: !state.hapticEnabled })),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      // ============================================
      // RESET
      // ============================================
      resetUser: () => set(initialState),

      // ============================================
      // DEMO DATA FOR STORY FEATURE
      // ============================================
      seedDemoData: () => {
        const demoReflections: ReflectionEntry[] = [
          {
            id: 'demo-1',
            lessonId: 'intro-stoicism',
            lessonTitle: 'Introduction to Stoicism',
            coreConceptTag: 'acceptance',
            reflection: 'I keep trying to control everything around me and it\'s exhausting. My boss made a decision I disagree with and I spent the whole night stressed about it. I realize now that I waste so much energy fighting battles I can\'t win.',
            actionCompleted: true,
            date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'demo-2',
            lessonId: 'dichotomy-control',
            lessonTitle: 'The Dichotomy of Control',
            coreConceptTag: 'control',
            reflection: 'Today I caught myself getting angry about traffic. But then I remembered - this is outside my control. For the first time, I actually felt my shoulders drop. I can\'t control traffic, but I can control my reaction. This is harder than it sounds.',
            actionCompleted: true,
            date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'demo-3',
            lessonId: 'morning-routine',
            lessonTitle: 'The Stoic Morning',
            coreConceptTag: 'discipline',
            reflection: 'Started my morning with 10 minutes of silent reflection before checking my phone. It felt strange at first - almost uncomfortable. But by the end I noticed my mind was clearer than usual. Small win, but it felt meaningful.',
            actionCompleted: true,
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'demo-4',
            lessonId: 'negative-visualization',
            lessonTitle: 'Negative Visualization',
            coreConceptTag: 'gratitude',
            reflection: 'I imagined losing everything - my job, my relationships, my health. Instead of feeling depressed, I felt this wave of appreciation for what I have. My problems suddenly seemed smaller. I called my mom just to tell her I love her.',
            actionCompleted: true,
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'demo-5',
            lessonId: 'obstacle-is-way',
            lessonTitle: 'The Obstacle Is The Way',
            coreConceptTag: 'perspective',
            reflection: 'Got rejected from a job I really wanted. Old me would have spiraled. But I asked myself: what can this teach me? I realized the interview revealed gaps in my skills I didn\'t know existed. The rejection wasn\'t the end - it was information.',
            actionCompleted: true,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'demo-6',
            lessonId: 'present-moment',
            lessonTitle: 'Living in the Present',
            coreConceptTag: 'acceptance',
            reflection: 'I\'m starting to notice a real shift in myself. When my colleague criticized my work today, I didn\'t react defensively like I used to. I listened, took what was useful, and let go of the rest. It felt... powerful. Like I\'m finally becoming the person I\'ve always wanted to be.',
            actionCompleted: true,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ];

        const demoIdentityStatements: IdentityStatement[] = [
          {
            id: 'identity-1',
            statement: 'I am someone who responds rather than reacts.',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            tags: ['self-control', 'mindfulness'],
            context: {
              type: 'reflection',
              trigger: 'demo-lesson-3',
              description: 'After practicing the pause'
            }
          },
          {
            id: 'identity-2',
            statement: 'I embrace obstacles as opportunities for growth.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            tags: ['resilience', 'perspective'],
            context: {
              type: 'lesson',
              trigger: 'demo-lesson-5',
              description: 'After the job rejection'
            }
          }
        ];

        const demoAchievements: AchievementUnlock[] = [
          { achievementId: 'first-lesson', unlockedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), celebrated: true },
          { achievementId: 'first-reflection', unlockedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), celebrated: true },
          { achievementId: 'week-streak', unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), celebrated: true },
          { achievementId: 'deep-thinker', unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), celebrated: true }
        ];

        const completedLessons: Record<string, boolean> = {};
        demoReflections.forEach(r => {
          completedLessons[r.lessonId] = true;
        });

        set({
          name: 'Seeker',
          transformationGoal: 'calmer',
          whyStatement: 'I want to find calm in the chaos and become the best version of myself.',
          onboardingComplete: true,
          allReflections: demoReflections,
          reflections: demoReflections.slice(-5),
          identityStatements: demoIdentityStatements,
          unlockedAchievements: demoAchievements,
          completedLessons,
          totalXp: 350,
          currentStreak: 7,
          longestStreak: 12,
          lastLessonDate: new Date().toISOString().split('T')[0],
        });
      },
    }),
    {
      name: 'transformation-hub-storage',
    }
  )
);

export default useStore;
