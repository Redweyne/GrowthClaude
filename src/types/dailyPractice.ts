// ═══════════════════════════════════════════════════════════════════════════
// DAILY PRACTICE SYSTEM - THE ARCHITECTURE OF TRANSFORMATION
// ═══════════════════════════════════════════════════════════════════════════
//
// One lesson per day. For everyone. Together.
//
// This isn't about consuming content. It's about building a daily practice
// that transforms who you are. Consistency over volume. Depth over breadth.
//
// The Daily Loop:
// 1. THE LESSON - Learn today's wisdom
// 2. THE ECHO - Connect with a fellow traveler's reflection (mandatory)
// 3. THE PRACTICE - 5 exercises to embody the wisdom
//
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE TYPES - Different ways to practice wisdom
// ─────────────────────────────────────────────────────────────────────────────

export type ExerciseType =
  | 'scenario'      // Real-life application scenario
  | 'quote'         // Quote contemplation with reflection
  | 'application'   // Tomorrow's specific application
  | 'anchor'        // Physical anchor with breath work
  | 'reframe';      // Reframe a challenge using today's wisdom

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE CONTENT STRUCTURES
// ─────────────────────────────────────────────────────────────────────────────

export interface ScenarioContent {
  situation: string;          // The real-life situation
  question: string;           // The question to reflect on
  hints?: string[];           // Helpful thinking prompts
}

export interface QuoteContent {
  quote: string;              // The wisdom quote
  author: string;             // Who said it
  source?: string;            // Book or context
  reflectionPrompt: string;   // What to reflect on
}

export interface ApplicationContent {
  instruction: string;        // What to do tomorrow
  planPrompt: string;         // Specific planning question
  examples?: string[];        // Example applications
}

export interface AnchorContent {
  gesture: string;            // Physical anchor description
  meaning: string;            // What the gesture represents
  breathPattern: string;      // Breathing instructions
  repetitions: number;        // Number of times to repeat
}

export interface ReframeContent {
  challengePrompt: string;    // Describe the challenge
  reframeGuide: string;       // How to reframe it
  example: {
    before: string;           // Example before reframe
    after: string;            // Example after reframe
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY EXERCISE - A single practice item
// ─────────────────────────────────────────────────────────────────────────────

export interface DailyExercise {
  id: string;
  type: ExerciseType;
  title: string;
  content: ScenarioContent | QuoteContent | ApplicationContent | AnchorContent | ReframeContent;
}

// Type guards for exercise content
export function isScenarioContent(content: DailyExercise['content']): content is ScenarioContent {
  return 'situation' in content && 'question' in content;
}

export function isQuoteContent(content: DailyExercise['content']): content is QuoteContent {
  return 'quote' in content && 'author' in content;
}

export function isApplicationContent(content: DailyExercise['content']): content is ApplicationContent {
  return 'instruction' in content && 'planPrompt' in content;
}

export function isAnchorContent(content: DailyExercise['content']): content is AnchorContent {
  return 'gesture' in content && 'breathPattern' in content;
}

export function isReframeContent(content: DailyExercise['content']): content is ReframeContent {
  return 'challengePrompt' in content && 'reframeGuide' in content;
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY PROGRESS - Track user's daily journey
// ─────────────────────────────────────────────────────────────────────────────

export interface DailyProgress {
  date: string;                    // ISO date (YYYY-MM-DD)
  lessonId: string;                // Today's lesson
  worldId: string;                 // Current world
  dayNumber: number;               // Day 1, 2, 3... of the world

  // Phase completion tracking
  lessonCompleted: boolean;
  lessonCompletedAt: string | null;

  mandatoryEchoCompleted: boolean;
  echoReflectionId: string | null; // Which reflection they echoed
  echoCompletedAt: string | null;

  exercisesCompleted: string[];    // Exercise IDs completed
  exerciseResponses: Record<string, string>; // exerciseId -> response

  // Overall completion
  allPhasesComplete: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CALENDAR - Synchronized lessons for everyone
// ─────────────────────────────────────────────────────────────────────────────

export interface WorldCalendar {
  worldId: string;
  worldSlug: string;
  startDate: string;              // When this world started (ISO date)
  totalDays: number;              // Total lessons in this world
}

export interface GlobalCalendar {
  currentWorld: WorldCalendar;
  completedWorlds: WorldCalendar[];

  // Computed on access
  currentDayNumber: number;       // 1-based day within current world
  isWorldComplete: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAST WORLD ACCESS - Exercise access for completed worlds
// ─────────────────────────────────────────────────────────────────────────────

export interface PastWorldExerciseLog {
  worldId: string;
  lessonId: string;
  exerciseId: string;
  completedAt: string;
  response?: string;
}

export interface PastWorldAccess {
  worldId: string;
  completedDate: string;          // When the world was finished
  lastExerciseDate: string | null; // Last time user did an exercise from this world
  exercisesRedone: PastWorldExerciseLog[];
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY FLOW PHASE - Current state in the daily loop
// ─────────────────────────────────────────────────────────────────────────────

export type DailyFlowPhase =
  | 'lesson'        // Phase 1: Main lesson
  | 'echo'          // Phase 2: Mandatory echo
  | 'practice'      // Phase 3: 5 exercises
  | 'complete';     // All done for today

export interface DailyFlowState {
  currentPhase: DailyFlowPhase;
  canAccessLesson: boolean;       // Always true if not completed
  canAccessEcho: boolean;         // True after lesson complete
  canAccessPractice: boolean;     // True after echo complete
  exercisesRemaining: number;     // 5 down to 0
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the current date in user's local timezone as ISO date string
 */
export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Check if a date string represents today (in user's local timezone)
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayDateString();
}

/**
 * Calculate day number within a world based on start date
 * Day 1 = start date, Day 2 = start date + 1, etc.
 */
export function calculateDayNumber(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();

  // Reset to midnight local time for accurate day comparison
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1; // 1-based
}

/**
 * Check if user can do a past world exercise today
 * (Only one per day allowed)
 */
export function canDoPastWorldExercise(lastExerciseDate: string | null): boolean {
  if (!lastExerciseDate) return true;
  return lastExerciseDate !== getTodayDateString();
}

/**
 * Get the daily flow state based on progress
 */
export function getDailyFlowState(progress: DailyProgress | null, totalExercises: number = 5): DailyFlowState {
  if (!progress) {
    return {
      currentPhase: 'lesson',
      canAccessLesson: true,
      canAccessEcho: false,
      canAccessPractice: false,
      exercisesRemaining: totalExercises,
    };
  }

  const exercisesRemaining = totalExercises - progress.exercisesCompleted.length;

  if (!progress.lessonCompleted) {
    return {
      currentPhase: 'lesson',
      canAccessLesson: true,
      canAccessEcho: false,
      canAccessPractice: false,
      exercisesRemaining,
    };
  }

  if (!progress.mandatoryEchoCompleted) {
    return {
      currentPhase: 'echo',
      canAccessLesson: true,
      canAccessEcho: true,
      canAccessPractice: false,
      exercisesRemaining,
    };
  }

  if (exercisesRemaining > 0) {
    return {
      currentPhase: 'practice',
      canAccessLesson: true,
      canAccessEcho: true,
      canAccessPractice: true,
      exercisesRemaining,
    };
  }

  return {
    currentPhase: 'complete',
    canAccessLesson: true,
    canAccessEcho: true,
    canAccessPractice: true,
    exercisesRemaining: 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// XP REWARDS
// ─────────────────────────────────────────────────────────────────────────────

export const DAILY_XP_REWARDS = {
  lesson: 20,           // Base XP for lesson (can be more based on lesson config)
  mandatoryEcho: 10,    // XP for the mandatory echo
  exercise: 5,          // XP per exercise (5 exercises = 25 XP potential)
  dailyCompletion: 10,  // Bonus for completing all phases
} as const;

/**
 * Calculate total potential XP for a day
 */
export function calculateDailyXpPotential(lessonXp: number = 20): number {
  return lessonXp +
         DAILY_XP_REWARDS.mandatoryEcho +
         (DAILY_XP_REWARDS.exercise * 5) +
         DAILY_XP_REWARDS.dailyCompletion;
}
