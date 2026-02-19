// ═══════════════════════════════════════════════════════════════════════════
// ADAPTIVE EXERCISE DIFFICULTY
// ═══════════════════════════════════════════════════════════════════════════
//
// Tracks user performance across exercise completions and adapts:
// - Timer durations (faster users get tighter timers)
// - Item counts (struggling users get fewer items)
// - Difficulty labels for UX feedback
//
// Performance is stored in localStorage for persistence.
//
// ═══════════════════════════════════════════════════════════════════════════

export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'expert';

export interface ExercisePerformance {
  exerciseId: string;
  exerciseType: string;
  completionTimeMs: number;
  itemsCompleted: number;
  totalItems: number;
  timestamp: number;
}

export interface DifficultyProfile {
  level: DifficultyLevel;
  timerMultiplier: number;    // 1.0 = normal, 0.7 = faster, 1.3 = slower
  itemCountAdjust: number;    // 0 = no change, -2 = fewer items, +2 = more items
  totalCompletions: number;
  averageSpeedMs: number;     // Average ms per item
  recentTrend: 'improving' | 'stable' | 'struggling';
}

const STORAGE_KEY = 'exercise-performance-log';
const MIN_COMPLETIONS_FOR_ADAPT = 5;
const MAX_LOG_SIZE = 100;

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE STORAGE
// ─────────────────────────────────────────────────────────────────────────────

function getPerformanceLog(): ExercisePerformance[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ExercisePerformance[];
  } catch {
    return [];
  }
}

function savePerformanceLog(log: ExercisePerformance[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Keep only recent entries
    const trimmed = log.slice(-MAX_LOG_SIZE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full or unavailable
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RECORD PERFORMANCE
// ─────────────────────────────────────────────────────────────────────────────

export function recordExercisePerformance(perf: Omit<ExercisePerformance, 'timestamp'>): void {
  const log = getPerformanceLog();
  log.push({
    ...perf,
    timestamp: Date.now(),
  });
  savePerformanceLog(log);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTE DIFFICULTY
// ─────────────────────────────────────────────────────────────────────────────

export function getDifficultyProfile(exerciseType?: string): DifficultyProfile {
  const log = getPerformanceLog();

  // Filter by type if provided
  const relevant = exerciseType
    ? log.filter(p => p.exerciseType === exerciseType)
    : log;

  const totalCompletions = relevant.length;

  // Default profile
  if (totalCompletions < MIN_COMPLETIONS_FOR_ADAPT) {
    return {
      level: 'normal',
      timerMultiplier: 1.0,
      itemCountAdjust: 0,
      totalCompletions,
      averageSpeedMs: 0,
      recentTrend: 'stable',
    };
  }

  // Calculate average speed (ms per item)
  const speeds = relevant.map(p => {
    if (p.itemsCompleted === 0) return 0;
    return p.completionTimeMs / p.itemsCompleted;
  }).filter(s => s > 0);

  const averageSpeedMs = speeds.length > 0
    ? speeds.reduce((a, b) => a + b, 0) / speeds.length
    : 0;

  // Recent trend (last 5 vs previous 5)
  const recent = speeds.slice(-5);
  const previous = speeds.slice(-10, -5);
  let recentTrend: DifficultyProfile['recentTrend'] = 'stable';

  if (recent.length >= 3 && previous.length >= 3) {
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const prevAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
    const changePercent = ((recentAvg - prevAvg) / prevAvg) * 100;

    if (changePercent < -15) recentTrend = 'improving';
    else if (changePercent > 15) recentTrend = 'struggling';
  }

  // Determine difficulty level based on speed and trend
  let level: DifficultyLevel = 'normal';
  let timerMultiplier = 1.0;
  let itemCountAdjust = 0;

  // Speed thresholds (per item, in ms)
  // These are relative — fast means they're breezing through
  if (averageSpeedMs > 0) {
    if (averageSpeedMs < 1500) {
      // Very fast — under 1.5s per item
      level = 'expert';
      timerMultiplier = 0.65;  // 35% tighter timers
      itemCountAdjust = 2;     // +2 more items
    } else if (averageSpeedMs < 2500) {
      // Fast — under 2.5s per item
      level = 'hard';
      timerMultiplier = 0.8;   // 20% tighter
      itemCountAdjust = 1;     // +1 item
    } else if (averageSpeedMs > 5000) {
      // Slow — over 5s per item (struggling)
      level = 'easy';
      timerMultiplier = 1.3;   // 30% more time
      itemCountAdjust = -2;    // -2 fewer items
    }
  }

  // Override if struggling trend detected
  if (recentTrend === 'struggling' && level !== 'easy') {
    timerMultiplier = Math.min(timerMultiplier + 0.15, 1.3);
    if (itemCountAdjust > 0) itemCountAdjust = 0;
  }

  // Override if improving rapidly
  if (recentTrend === 'improving' && level === 'normal') {
    level = 'hard';
    timerMultiplier = 0.85;
    itemCountAdjust = 1;
  }

  return {
    level,
    timerMultiplier,
    itemCountAdjust,
    totalCompletions,
    averageSpeedMs: Math.round(averageSpeedMs),
    recentTrend,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ADAPT VALUES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Adapt a timer duration based on user's performance profile.
 * @param baseSeconds - The default timer in seconds
 * @param exerciseType - Optional type filter
 * @returns Adjusted timer in seconds (clamped to reasonable bounds)
 */
export function adaptTimer(baseSeconds: number, exerciseType?: string): number {
  const profile = getDifficultyProfile(exerciseType);
  const adjusted = Math.round(baseSeconds * profile.timerMultiplier);
  // Clamp: minimum 1.5s, maximum 2x the base
  return Math.max(1.5, Math.min(adjusted, baseSeconds * 2));
}

/**
 * Adapt item count based on user's performance profile.
 * @param baseCount - The default item count
 * @param exerciseType - Optional type filter
 * @returns Adjusted count (clamped to reasonable bounds)
 */
export function adaptItemCount(baseCount: number, exerciseType?: string): number {
  const profile = getDifficultyProfile(exerciseType);
  const adjusted = baseCount + profile.itemCountAdjust;
  // Clamp: minimum 3 items, maximum baseCount + 4
  return Math.max(3, Math.min(adjusted, baseCount + 4));
}

/**
 * Get a display label for the current difficulty.
 */
export function getDifficultyLabel(exerciseType?: string): string {
  const profile = getDifficultyProfile(exerciseType);
  switch (profile.level) {
    case 'easy': return 'Adapted';
    case 'normal': return 'Standard';
    case 'hard': return 'Challenge';
    case 'expert': return 'Expert';
  }
}
