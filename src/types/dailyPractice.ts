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
// NEW EXERCISE TYPES - Engaging, emotional, no writing required
// ─────────────────────────────────────────────────────────────────────────────

export type ExerciseType =
  | 'truth-mirror'     // Tap through truths, hold when one resonates deeply
  | 'soul-compass'     // Multi-select what resonates + intensity
  | 'presence-anchor'; // Enhanced breathwork with visualization prompts

// ─────────────────────────────────────────────────────────────────────────────
// TRUTH MIRROR - Tap through revelations until one stops you
// ─────────────────────────────────────────────────────────────────────────────

export interface TruthMirrorContent {
  /** Statements to tap through - user holds when one resonates */
  statements: string[];
  /** Message shown when user holds on their truth */
  holdReveal: string;
  /** Breath prompts after selection (shown during exhales) */
  breathPrompts: string[];
  /** Style affects colors and atmosphere */
  style: 'release' | 'strength' | 'gratitude' | 'clarity';
}

// ─────────────────────────────────────────────────────────────────────────────
// SOUL COMPASS - Multi-select resonance + intensity
// ─────────────────────────────────────────────────────────────────────────────

export interface SoulCompassOption {
  id: string;
  emoji: string;
  text: string;
}

export interface SoulCompassContent {
  /** Central question or prompt */
  centralQuestion: string;
  /** Options arranged around the compass */
  options: SoulCompassOption[];
  /** Minimum selections required (default 1) */
  minSelections?: number;
  /** Maximum selections allowed (default all) */
  maxSelections?: number;
  /** Whether to show intensity slider after selection */
  showIntensity: boolean;
  /** Intensity question (if showIntensity is true) */
  intensityQuestion?: string;
  /** Labels for intensity scale */
  intensityLabels?: { low: string; high: string };
  /** Contextual responses based on intensity (low/mid/high) */
  intensityResponses?: {
    low: string;
    mid: string;
    high: string;
  };
  /** Optional follow-up options after first selection */
  followUpQuestion?: string;
  followUpOptions?: SoulCompassOption[];
  /** Style affects colors */
  style: 'introspective' | 'energizing' | 'grounding' | 'awakening';
}

// ─────────────────────────────────────────────────────────────────────────────
// PRESENCE ANCHOR - Breathwork with visualization prompts
// ─────────────────────────────────────────────────────────────────────────────

export interface PresenceAnchorContent {
  /** Physical gesture description */
  gesture: string;
  /** What the gesture represents */
  meaning: string;
  /** Number of breath cycles */
  breathCycles: number;
  /** Visualization prompts shown during each exhale */
  exhalePrompts: string[];
  /** Final anchoring message */
  anchorMessage: string;
  /** Style affects colors and atmosphere */
  style: 'release' | 'strength' | 'gratitude' | 'grounding';
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY EXERCISE - A single practice item
// ─────────────────────────────────────────────────────────────────────────────

export interface DailyExercise {
  id: string;
  type: ExerciseType;
  title: string;
  content: TruthMirrorContent | SoulCompassContent | PresenceAnchorContent;
}

// Type guards for exercise content
export function isTruthMirrorContent(content: DailyExercise['content']): content is TruthMirrorContent {
  return 'statements' in content && 'holdReveal' in content;
}

export function isSoulCompassContent(content: DailyExercise['content']): content is SoulCompassContent {
  return 'centralQuestion' in content && 'options' in content;
}

export function isPresenceAnchorContent(content: DailyExercise['content']): content is PresenceAnchorContent {
  return 'gesture' in content && 'exhalePrompts' in content;
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
