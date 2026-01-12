// ============================================================================
// PATTERN EVOLUTION ANALYZER
// Tracks how thought patterns shift over time.
// This reveals the deeper transformation happening beneath the surface.
// ============================================================================

import {
  MonthlyPatternForStory,
  PatternData,
  PatternShiftData,
  TransformationInsight
} from '@/types/story';

// ----------------------------------------------------------------------------
// PATTERN DEFINITIONS
// ----------------------------------------------------------------------------

// Challenge patterns - things users are working through
export const CHALLENGE_PATTERNS = {
  control: {
    label: 'Control',
    keywords: ['control', 'can\'t control', 'out of control', 'controlling', 'manage'],
    color: '#EF4444',
    category: 'challenge'
  },
  judgment: {
    label: 'Judgment',
    keywords: ['judge', 'judging', 'judgment', 'critical', 'criticize', 'harsh'],
    color: '#F97316',
    category: 'challenge'
  },
  anger: {
    label: 'Anger',
    keywords: ['angry', 'anger', 'frustrated', 'frustration', 'rage', 'irritated', 'annoyed'],
    color: '#DC2626',
    category: 'challenge'
  },
  fear: {
    label: 'Fear',
    keywords: ['fear', 'afraid', 'scared', 'worry', 'worried', 'anxious', 'anxiety'],
    color: '#7C3AED',
    category: 'challenge'
  },
  comparison: {
    label: 'Comparison',
    keywords: ['compare', 'comparison', 'others', 'better than', 'worse than', 'envy', 'jealous'],
    color: '#EC4899',
    category: 'challenge'
  },
  procrastination: {
    label: 'Procrastination',
    keywords: ['procrastinat', 'delay', 'putting off', 'avoid', 'later', 'tomorrow'],
    color: '#F59E0B',
    category: 'challenge'
  }
};

// Growth patterns - positive transformations
export const GROWTH_PATTERNS = {
  acceptance: {
    label: 'Acceptance',
    keywords: ['accept', 'acceptance', 'let go', 'release', 'surrender', 'peace with', 'okay with'],
    color: '#10B981',
    category: 'growth'
  },
  patience: {
    label: 'Patience',
    keywords: ['patient', 'patience', 'wait', 'time', 'slow down', 'not rushing'],
    color: '#06B6D4',
    category: 'growth'
  },
  courage: {
    label: 'Courage',
    keywords: ['courage', 'brave', 'bravery', 'face', 'facing', 'despite fear', 'anyway'],
    color: '#8B5CF6',
    category: 'growth'
  },
  discipline: {
    label: 'Discipline',
    keywords: ['discipline', 'disciplined', 'consistent', 'routine', 'habit', 'commit', 'dedicated'],
    color: '#3B82F6',
    category: 'growth'
  },
  gratitude: {
    label: 'Gratitude',
    keywords: ['grateful', 'gratitude', 'thankful', 'appreciate', 'blessed', 'fortunate'],
    color: '#F59E0B',
    category: 'growth'
  },
  perspective: {
    label: 'Perspective',
    keywords: ['perspective', 'realize', 'see now', 'understand', 'bigger picture', 'view from above'],
    color: '#6366F1',
    category: 'growth'
  },
  presence: {
    label: 'Presence',
    keywords: ['present', 'moment', 'now', 'here', 'mindful', 'aware', 'awareness', 'attention'],
    color: '#14B8A6',
    category: 'growth'
  },
  resilience: {
    label: 'Resilience',
    keywords: ['resilient', 'resilience', 'bounce back', 'overcome', 'despite', 'keep going', 'persever'],
    color: '#22C55E',
    category: 'growth'
  }
};

export const ALL_PATTERNS = { ...CHALLENGE_PATTERNS, ...GROWTH_PATTERNS };

export type PatternKey = keyof typeof ALL_PATTERNS;

// ----------------------------------------------------------------------------
// PATTERN ANALYSIS FUNCTIONS
// ----------------------------------------------------------------------------

export interface PatternEvolutionResult {
  // Current state
  currentDominantPatterns: PatternData[];

  // Historical progression
  patternHistory: MonthlyPatternSnapshot[];

  // Key shifts detected
  significantShifts: PatternShift[];

  // Overall trajectory
  trajectory: 'improving' | 'stable' | 'mixed' | 'declining';

  // Narrative summary
  evolutionNarrative: string;

  // Insights for story
  insights: TransformationInsight[];
}

export interface MonthlyPatternSnapshot {
  month: string;
  monthLabel: string;
  challengePatterns: PatternData[];
  growthPatterns: PatternData[];
  dominantCategory: 'challenge' | 'growth' | 'balanced';
  totalMentions: number;
}

export interface PatternShift {
  from: PatternKey;
  to: PatternKey;
  fromLabel: string;
  toLabel: string;
  shiftType: 'challenge_to_growth' | 'growth_amplified' | 'challenge_reduced';
  significance: 'minor' | 'moderate' | 'major';
  timespan: string;
  narrative: string;
}

/**
 * Analyzes pattern evolution across monthly data
 */
export function analyzePatternEvolution(
  monthlyData: MonthlyPatternForStory[]
): PatternEvolutionResult {
  if (monthlyData.length === 0) {
    return {
      currentDominantPatterns: [],
      patternHistory: [],
      significantShifts: [],
      trajectory: 'stable',
      evolutionNarrative: 'Your journey is just beginning.',
      insights: []
    };
  }

  // Sort by date
  const sorted = [...monthlyData].sort((a, b) => a.month.localeCompare(b.month));

  // Create monthly snapshots
  const patternHistory = sorted.map(data => createMonthlySnapshot(data));

  // Find current dominant patterns (from most recent month)
  const currentSnapshot = patternHistory[patternHistory.length - 1];
  const currentDominantPatterns = [
    ...currentSnapshot.growthPatterns.slice(0, 3),
    ...currentSnapshot.challengePatterns.slice(0, 2)
  ].sort((a, b) => b.count - a.count).slice(0, 5);

  // Detect significant shifts
  const significantShifts = detectPatternShifts(patternHistory);

  // Determine overall trajectory
  const trajectory = determineTrajectory(patternHistory);

  // Generate narrative
  const evolutionNarrative = generateEvolutionNarrative(patternHistory, significantShifts, trajectory);

  // Generate insights
  const insights = generatePatternInsights(patternHistory, significantShifts);

  return {
    currentDominantPatterns,
    patternHistory,
    significantShifts,
    trajectory,
    evolutionNarrative,
    insights
  };
}

/**
 * Creates a snapshot of patterns for a single month
 */
function createMonthlySnapshot(data: MonthlyPatternForStory): MonthlyPatternSnapshot {
  const challengePatterns: PatternData[] = [];
  const growthPatterns: PatternData[] = [];

  let challengeTotal = 0;
  let growthTotal = 0;

  for (const [key, count] of Object.entries(data.themes)) {
    if (count === 0) continue;

    const pattern = ALL_PATTERNS[key as PatternKey];
    if (!pattern) continue;

    const patternData: PatternData = {
      theme: key,
      label: pattern.label,
      count,
      trend: 'stable', // Will be calculated later
      color: pattern.color
    };

    if (pattern.category === 'challenge') {
      challengePatterns.push(patternData);
      challengeTotal += count;
    } else {
      growthPatterns.push(patternData);
      growthTotal += count;
    }
  }

  // Sort by count
  challengePatterns.sort((a, b) => b.count - a.count);
  growthPatterns.sort((a, b) => b.count - a.count);

  // Determine dominant category
  let dominantCategory: MonthlyPatternSnapshot['dominantCategory'];
  if (growthTotal > challengeTotal * 1.5) {
    dominantCategory = 'growth';
  } else if (challengeTotal > growthTotal * 1.5) {
    dominantCategory = 'challenge';
  } else {
    dominantCategory = 'balanced';
  }

  // Format month label
  const [year, month] = data.month.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;

  return {
    month: data.month,
    monthLabel,
    challengePatterns,
    growthPatterns,
    dominantCategory,
    totalMentions: challengeTotal + growthTotal
  };
}

/**
 * Detects significant shifts in patterns over time
 */
function detectPatternShifts(history: MonthlyPatternSnapshot[]): PatternShift[] {
  if (history.length < 2) return [];

  const shifts: PatternShift[] = [];
  const first = history[0];
  const last = history[history.length - 1];

  // Create maps for easy lookup
  const firstChallenges = new Map(first.challengePatterns.map(p => [p.theme, p.count]));
  const firstGrowth = new Map(first.growthPatterns.map(p => [p.theme, p.count]));
  const lastChallenges = new Map(last.challengePatterns.map(p => [p.theme, p.count]));
  const lastGrowth = new Map(last.growthPatterns.map(p => [p.theme, p.count]));

  // Check for challenge → growth shifts
  for (const [challengeKey, pattern] of Object.entries(CHALLENGE_PATTERNS)) {
    const firstCount = firstChallenges.get(challengeKey) || 0;
    const lastCount = lastChallenges.get(challengeKey) || 0;

    // Check if challenge reduced significantly
    if (firstCount >= 3 && lastCount < firstCount * 0.5) {
      // Find corresponding growth pattern that increased
      for (const [growthKey, growthPattern] of Object.entries(GROWTH_PATTERNS)) {
        const firstGrowthCount = firstGrowth.get(growthKey) || 0;
        const lastGrowthCount = lastGrowth.get(growthKey) || 0;

        if (lastGrowthCount > firstGrowthCount + 2) {
          const significance = lastGrowthCount - firstGrowthCount >= 5 ? 'major' :
                              lastGrowthCount - firstGrowthCount >= 3 ? 'moderate' : 'minor';

          shifts.push({
            from: challengeKey as PatternKey,
            to: growthKey as PatternKey,
            fromLabel: pattern.label,
            toLabel: growthPattern.label,
            shiftType: 'challenge_to_growth',
            significance,
            timespan: `${first.monthLabel} → ${last.monthLabel}`,
            narrative: generateShiftNarrative(pattern.label, growthPattern.label, significance)
          });
          break;
        }
      }
    }
  }

  // Check for growth amplification
  for (const [growthKey, pattern] of Object.entries(GROWTH_PATTERNS)) {
    const firstCount = firstGrowth.get(growthKey) || 0;
    const lastCount = lastGrowth.get(growthKey) || 0;

    if (lastCount >= firstCount + 4) {
      const significance = lastCount - firstCount >= 8 ? 'major' :
                          lastCount - firstCount >= 5 ? 'moderate' : 'minor';

      shifts.push({
        from: growthKey as PatternKey,
        to: growthKey as PatternKey,
        fromLabel: pattern.label,
        toLabel: pattern.label,
        shiftType: 'growth_amplified',
        significance,
        timespan: `${first.monthLabel} → ${last.monthLabel}`,
        narrative: `Your ${pattern.label.toLowerCase()} has deepened significantly.`
      });
    }
  }

  // Sort by significance
  const significanceOrder = { 'major': 0, 'moderate': 1, 'minor': 2 };
  shifts.sort((a, b) => significanceOrder[a.significance] - significanceOrder[b.significance]);

  return shifts.slice(0, 3); // Return top 3 shifts
}

/**
 * Generates a narrative for a pattern shift
 */
function generateShiftNarrative(from: string, to: string, significance: string): string {
  const templates = {
    major: [
      `A profound shift: where ${from.toLowerCase()} once dominated, ${to.toLowerCase()} has taken root.`,
      `Your relationship with ${from.toLowerCase()} has transformed into ${to.toLowerCase()}.`,
      `From ${from.toLowerCase()} to ${to.toLowerCase()} — this is real transformation.`
    ],
    moderate: [
      `${from} is giving way to ${to.toLowerCase()} in your reflections.`,
      `You're finding more ${to.toLowerCase()} where ${from.toLowerCase()} used to be.`,
      `The shift from ${from.toLowerCase()} to ${to.toLowerCase()} is becoming clear.`
    ],
    minor: [
      `Seeds of ${to.toLowerCase()} are growing where ${from.toLowerCase()} once was.`,
      `${to} is beginning to replace ${from.toLowerCase()}.`
    ]
  };

  const options = templates[significance as keyof typeof templates] || templates.minor;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Determines the overall trajectory of growth
 */
function determineTrajectory(history: MonthlyPatternSnapshot[]): PatternEvolutionResult['trajectory'] {
  if (history.length < 2) return 'stable';

  const recentHalf = history.slice(Math.floor(history.length / 2));
  const earlierHalf = history.slice(0, Math.floor(history.length / 2));

  // Calculate growth ratio for each half
  const getGrowthRatio = (snapshots: MonthlyPatternSnapshot[]) => {
    let growthTotal = 0;
    let challengeTotal = 0;
    for (const s of snapshots) {
      growthTotal += s.growthPatterns.reduce((sum, p) => sum + p.count, 0);
      challengeTotal += s.challengePatterns.reduce((sum, p) => sum + p.count, 0);
    }
    return challengeTotal === 0 ? 1 : growthTotal / Math.max(challengeTotal, 1);
  };

  const earlierRatio = getGrowthRatio(earlierHalf);
  const recentRatio = getGrowthRatio(recentHalf);

  const improvement = recentRatio - earlierRatio;

  if (improvement > 0.5) return 'improving';
  if (improvement < -0.3) return 'declining';
  if (Math.abs(improvement) < 0.1) return 'stable';
  return 'mixed';
}

/**
 * Generates a human-readable narrative about the pattern evolution
 */
function generateEvolutionNarrative(
  history: MonthlyPatternSnapshot[],
  shifts: PatternShift[],
  trajectory: PatternEvolutionResult['trajectory']
): string {
  if (history.length === 0) {
    return 'Your transformation story is waiting to be written.';
  }

  if (history.length === 1) {
    const snapshot = history[0];
    if (snapshot.dominantCategory === 'growth') {
      return 'Your reflections show a foundation of growth-oriented thinking.';
    } else if (snapshot.dominantCategory === 'challenge') {
      return 'You\'re honestly facing your challenges — that\'s where growth begins.';
    }
    return 'Your journey has begun with honest self-reflection.';
  }

  const first = history[0];
  const last = history[history.length - 1];

  const narratives: string[] = [];

  // Trajectory-based opening
  switch (trajectory) {
    case 'improving':
      narratives.push('Your thought patterns have shifted remarkably.');
      break;
    case 'stable':
      narratives.push('You\'ve maintained consistent growth in your thinking.');
      break;
    case 'mixed':
      narratives.push('Your journey shows the natural ebb and flow of growth.');
      break;
    case 'declining':
      narratives.push('You\'re in a period of working through challenges — this is part of the journey.');
      break;
  }

  // Add shift narrative if available
  if (shifts.length > 0 && shifts[0].significance !== 'minor') {
    narratives.push(shifts[0].narrative);
  }

  // Add comparison
  if (first.dominantCategory !== last.dominantCategory) {
    if (first.dominantCategory === 'challenge' && last.dominantCategory === 'growth') {
      narratives.push('Where challenges once dominated your thoughts, growth now leads the way.');
    }
  }

  return narratives.join(' ');
}

/**
 * Generates transformation insights from pattern data
 */
function generatePatternInsights(
  history: MonthlyPatternSnapshot[],
  shifts: PatternShift[]
): TransformationInsight[] {
  const insights: TransformationInsight[] = [];

  for (const shift of shifts) {
    if (shift.shiftType === 'challenge_to_growth') {
      insights.push({
        type: 'pattern_evolution',
        title: `${shift.fromLabel} → ${shift.toLabel}`,
        description: shift.narrative,
        evidence: [shift.timespan],
        emotionalWeight: shift.significance === 'major' ? 'profound' : 'medium',
        suggestedSlide: 'pattern_shift'
      });
    }
  }

  // Add trajectory insight if improving
  if (history.length >= 2) {
    const trajectory = determineTrajectory(history);
    if (trajectory === 'improving') {
      insights.push({
        type: 'pattern_evolution',
        title: 'Upward Trajectory',
        description: 'Your overall thought patterns are shifting toward growth.',
        evidence: [`Tracked across ${history.length} months`],
        emotionalWeight: 'medium',
        suggestedSlide: 'pattern_shift'
      });
    }
  }

  return insights;
}

/**
 * Gets the most significant pattern shift for display
 */
export function getMostSignificantShift(
  monthlyData: MonthlyPatternForStory[]
): PatternShift | null {
  const analysis = analyzePatternEvolution(monthlyData);
  return analysis.significantShifts[0] || null;
}

/**
 * Formats pattern data for display in a slide
 */
export function formatPatternsForSlide(
  earlierMonth: MonthlyPatternForStory,
  laterMonth: MonthlyPatternForStory
): { fromPatterns: PatternData[]; toPatterns: PatternData[] } {
  const earlier = createMonthlySnapshot(earlierMonth);
  const later = createMonthlySnapshot(laterMonth);

  // Get top challenge patterns from earlier
  const fromPatterns = earlier.challengePatterns.slice(0, 3).map(p => ({
    ...p,
    trend: 'down' as const
  }));

  // Get top growth patterns from later
  const toPatterns = later.growthPatterns.slice(0, 3).map(p => ({
    ...p,
    trend: 'up' as const
  }));

  return { fromPatterns, toPatterns };
}
