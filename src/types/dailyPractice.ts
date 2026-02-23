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
// 3. THE PRACTICE - 3 exercises to embody the wisdom (no writing!)
//
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE TYPES - 5 game-like interactions, no writing, no breathing
// ─────────────────────────────────────────────────────────────────────────────

export type ExerciseType =
  | 'rapid-verdict'    // Tinder-style swipe cards with timer
  | 'priority-tower'   // Drag-and-drop value ranking
  | 'scenario-snap'    // Interactive branching story
  | 'heat-check'       // 2D emotional spectrum plotting
  | 'word-forge';      // Tap words to forge a personal mantra

// ─────────────────────────────────────────────────────────────────────────────
// RAPID VERDICT - Swipe agree/disagree on statements with a timer
// ─────────────────────────────────────────────────────────────────────────────

export interface RapidVerdictContent {
  statements: Array<{
    text: string;
    agreeTag: string;
    disagreeTag: string;
  }>;
  timePerCard: number;
  resultProfiles: Array<{
    tagPattern: string;
    title: string;
    description: string;
    emoji: string;
  }>;
  style: 'bold' | 'introspective' | 'playful';
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIORITY TOWER - Drag items to rank what matters most
// ─────────────────────────────────────────────────────────────────────────────

export interface PriorityTowerContent {
  prompt: string;
  items: Array<{ id: string; emoji: string; label: string }>;
  insightsByTopChoice: Record<string, string>;
  completionMessage: string;
  style: 'warm' | 'stark' | 'cosmic';
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO SNAP - Interactive branching story with trait tracking
// ─────────────────────────────────────────────────────────────────────────────

export interface ScenarioSnapContent {
  title: string;
  frames: Array<{
    id: string;
    narrative: string;
    emoji: string;
    choices: Array<{
      id: string;
      text: string;
      trait: string;
      nextFrameId?: string;
    }>;
  }>;
  outcomes: Array<{
    traitPattern: string;
    title: string;
    insight: string;
    wisdomNudge: string;
    emoji: string;
  }>;
  style: 'tense' | 'awkward' | 'empowering' | 'vulnerable';
}

// ─────────────────────────────────────────────────────────────────────────────
// HEAT CHECK - Plot items on a 2D emotional spectrum
// ─────────────────────────────────────────────────────────────────────────────

export interface HeatCheckContent {
  prompt: string;
  xAxis: { low: string; high: string };
  yAxis: { low: string; high: string };
  items: Array<{ id: string; label: string; emoji: string }>;
  quadrantInsights: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  completionMessage: string;
  style: 'analytical' | 'emotional' | 'raw';
}

// ─────────────────────────────────────────────────────────────────────────────
// WORD FORGE - Tap words to compose a personal mantra
// ─────────────────────────────────────────────────────────────────────────────

export interface WordForgeContent {
  prompt: string;
  words: Array<{
    id: string;
    text: string;
    category: 'action' | 'identity' | 'emotion' | 'value';
  }>;
  minSelections: number;
  maxSelections: number;
  forgeMessage: string;
  style: 'fiery' | 'serene' | 'electric';
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY EXERCISE - A single practice item
// ─────────────────────────────────────────────────────────────────────────────

export type ExerciseContent =
  | RapidVerdictContent
  | PriorityTowerContent
  | ScenarioSnapContent
  | HeatCheckContent
  | WordForgeContent;

export interface DailyExercise {
  id: string;
  type: ExerciseType;
  title: string;
  content: ExerciseContent;
}

// Type guards for exercise content
export function isRapidVerdictContent(content: ExerciseContent): content is RapidVerdictContent {
  return 'statements' in content && 'timePerCard' in content;
}

export function isPriorityTowerContent(content: ExerciseContent): content is PriorityTowerContent {
  return 'prompt' in content && 'insightsByTopChoice' in content;
}

export function isScenarioSnapContent(content: ExerciseContent): content is ScenarioSnapContent {
  return 'frames' in content && 'outcomes' in content;
}

export function isHeatCheckContent(content: ExerciseContent): content is HeatCheckContent {
  return 'xAxis' in content && 'yAxis' in content;
}

export function isWordForgeContent(content: ExerciseContent): content is WordForgeContent {
  return 'words' in content && 'forgeMessage' in content;
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
  | 'practice'      // Phase 3: 3 exercises
  | 'complete';     // All done for today

export interface DailyFlowState {
  currentPhase: DailyFlowPhase;
  canAccessLesson: boolean;       // Always true if not completed
  canAccessEcho: boolean;         // True after lesson complete
  canAccessPractice: boolean;     // True after echo complete
  exercisesRemaining: number;     // 3 down to 0
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
export function getDailyFlowState(progress: DailyProgress | null, totalExercises: number = 3): DailyFlowState {
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
  exercise: 5,          // XP per exercise (3 exercises = 15 XP potential)
  dailyCompletion: 10,  // Bonus for completing all phases
} as const;

/**
 * Calculate total potential XP for a day
 */
export function calculateDailyXpPotential(lessonXp: number = 20): number {
  return lessonXp +
         DAILY_XP_REWARDS.mandatoryEcho +
         (DAILY_XP_REWARDS.exercise * 3) +
         DAILY_XP_REWARDS.dailyCompletion;
}
