// ============================================================================
// PROGRESS INSIGHTS - THE STORYTELLER OF YOUR JOURNEY
// This is not a stats calculator. This is a meaning-maker.
// It transforms raw numbers into emotional truths about who you're becoming.
// ============================================================================

import type { TransformationGoal } from '@/types';
import type { ReflectionEntry, ActivityDay, MonthlyAssessment } from '@/store/useStore';

// ============================================================================
// TYPES
// ============================================================================

export interface TransformationScore {
  score: number; // 0-100
  grade: 'awakening' | 'emerging' | 'growing' | 'flourishing' | 'transcending';
  trend: 'rising' | 'steady' | 'needs-attention';
  breakdown: {
    consistency: number; // Based on streak and activity
    depth: number; // Based on reflection quality
    commitment: number; // Based on lessons completed
    growth: number; // Based on assessments if available
  };
}

export interface PersonalInsight {
  type: 'observation' | 'encouragement' | 'challenge' | 'celebration' | 'reflection';
  message: string;
  context?: string;
  priority: number; // Higher = more important to show
}

export interface ProgressContext {
  // User info
  name: string | null;
  transformationGoal: TransformationGoal | null;
  whyStatement: string | null;

  // Journey stats
  daysSinceStart: number;
  totalLessons: number;
  totalReflections: number;
  totalWords: number;
  totalIdentityStatements: number;
  averageReflectionLength: number;

  // Streaks
  currentStreak: number;
  longestStreak: number;

  // Data
  reflections: ReflectionEntry[];
  activityLog: ActivityDay[];
  assessments: MonthlyAssessment[];

  // XP
  totalXp: number;
}

// ============================================================================
// TRANSFORMATION SCORE CALCULATOR
// A single powerful metric that captures their entire journey
// ============================================================================

export function calculateTransformationScore(ctx: ProgressContext): TransformationScore {
  // Consistency score (0-25 points)
  // Based on current streak relative to journey length
  let consistency = 0;
  if (ctx.daysSinceStart > 0) {
    const streakRatio = ctx.currentStreak / Math.max(ctx.daysSinceStart, 1);
    consistency = Math.min(25, streakRatio * 30 + (ctx.currentStreak >= 7 ? 5 : 0));
  }
  if (ctx.currentStreak >= 30) consistency = 25;

  // Depth score (0-25 points)
  // Based on reflection quality and engagement
  let depth = 0;
  if (ctx.totalReflections > 0) {
    const avgLength = ctx.averageReflectionLength;
    if (avgLength >= 50) depth += 10;
    else if (avgLength >= 30) depth += 7;
    else if (avgLength >= 15) depth += 4;

    // Bonus for volume
    if (ctx.totalReflections >= 30) depth += 10;
    else if (ctx.totalReflections >= 15) depth += 7;
    else if (ctx.totalReflections >= 5) depth += 4;

    // Bonus for identity statements (shows deep engagement)
    if (ctx.totalIdentityStatements >= 5) depth += 5;
    else if (ctx.totalIdentityStatements >= 2) depth += 3;
  }
  depth = Math.min(25, depth);

  // Commitment score (0-25 points)
  // Based on lessons completed and time invested
  let commitment = 0;
  if (ctx.totalLessons > 0) {
    if (ctx.totalLessons >= 50) commitment = 20;
    else if (ctx.totalLessons >= 25) commitment = 15;
    else if (ctx.totalLessons >= 10) commitment = 10;
    else if (ctx.totalLessons >= 5) commitment = 6;
    else commitment = 3;

    // Bonus for sustained effort over time
    if (ctx.daysSinceStart >= 30 && ctx.totalLessons >= 20) commitment += 5;
  }
  commitment = Math.min(25, commitment);

  // Growth score (0-25 points)
  // Based on assessments and measurable progress
  let growth = 0;
  if (ctx.assessments.length >= 2) {
    const latest = ctx.assessments[ctx.assessments.length - 1];
    const previous = ctx.assessments[ctx.assessments.length - 2];

    const latestAvg = Object.values(latest.scores).reduce((a, b) => a + b, 0) / 5;
    const previousAvg = Object.values(previous.scores).reduce((a, b) => a + b, 0) / 5;

    const improvement = latestAvg - previousAvg;
    if (improvement > 1) growth = 20;
    else if (improvement > 0) growth = 15;
    else if (improvement === 0) growth = 10;
    else growth = 5; // Still showing up matters
  } else if (ctx.assessments.length === 1) {
    growth = 12; // Credit for doing assessment
  } else {
    // No assessments - use other proxies
    if (ctx.totalReflections >= 10) growth = 10;
    else if (ctx.totalReflections >= 5) growth = 7;
  }

  growth = Math.min(25, growth);

  const score = Math.round(consistency + depth + commitment + growth);

  // Determine grade
  let grade: TransformationScore['grade'];
  if (score >= 80) grade = 'transcending';
  else if (score >= 60) grade = 'flourishing';
  else if (score >= 40) grade = 'growing';
  else if (score >= 20) grade = 'emerging';
  else grade = 'awakening';

  // Determine trend
  let trend: TransformationScore['trend'] = 'steady';
  if (ctx.currentStreak >= 3 && ctx.currentStreak > ctx.longestStreak * 0.5) {
    trend = 'rising';
  } else if (ctx.currentStreak === 0 && ctx.longestStreak > 0) {
    trend = 'needs-attention';
  }

  return {
    score,
    grade,
    trend,
    breakdown: {
      consistency: Math.round(consistency),
      depth: Math.round(depth),
      commitment: Math.round(commitment),
      growth: Math.round(growth)
    }
  };
}

// ============================================================================
// JOURNEY MILESTONES GENERATOR
// The significant moments that tell their story
// ============================================================================

// ============================================================================
// PERSONAL INSIGHTS GENERATOR
// The meaningful observations that make users feel seen
// ============================================================================

export function generatePersonalInsights(ctx: ProgressContext): PersonalInsight[] {
  const insights: PersonalInsight[] = [];
  const name = ctx.name || 'You';

  // ========== JOURNEY STAGE INSIGHTS ==========

  // First week
  if (ctx.daysSinceStart <= 7 && ctx.daysSinceStart > 0) {
    insights.push({
      type: 'encouragement',
      message: `${name}, you're in your first week. This is when it matters most. Every day you show up now is laying the foundation for everything that follows.`,
      priority: 90
    });
  }

  // Just started (first 3 days)
  if (ctx.totalLessons <= 3 && ctx.totalLessons > 0) {
    insights.push({
      type: 'celebration',
      message: `You took the hardest step - the first one. Most people only think about changing. You acted.`,
      priority: 85
    });
  }

  // Building momentum (1-2 weeks)
  if (ctx.currentStreak >= 5 && ctx.currentStreak < 14) {
    insights.push({
      type: 'observation',
      message: `${ctx.currentStreak} days in a row. The habit is taking root. Your brain is beginning to expect this practice. Protect this momentum.`,
      priority: 80
    });
  }

  // Solid habit (2+ weeks)
  if (ctx.currentStreak >= 14 && ctx.currentStreak < 30) {
    insights.push({
      type: 'celebration',
      message: `${ctx.currentStreak} consecutive days. This is no longer an experiment - it's becoming part of who you are.`,
      priority: 85
    });
  }

  // Month+ streak
  if (ctx.currentStreak >= 30) {
    insights.push({
      type: 'celebration',
      message: `${ctx.currentStreak} days of unbroken practice. The person who started this journey ${ctx.daysSinceStart} days ago would be proud of who you've become.`,
      priority: 95
    });
  }

  // ========== STREAK INSIGHTS ==========

  // Lost streak recently
  if (ctx.currentStreak === 0 && ctx.longestStreak > 7) {
    insights.push({
      type: 'encouragement',
      message: `Your streak ended, but what you built isn't gone. You proved you can reach ${ctx.longestStreak} days. That person is still you. Begin again.`,
      priority: 90
    });
  }

  // About to beat record
  if (ctx.currentStreak > 0 && ctx.currentStreak === ctx.longestStreak) {
    insights.push({
      type: 'challenge',
      message: `You're at your longest streak ever. Tomorrow, you write a new record. Don't let the old you define your limits.`,
      priority: 88
    });
  }

  // ========== REFLECTION INSIGHTS ==========

  // Deep reflector
  if (ctx.averageReflectionLength >= 50) {
    insights.push({
      type: 'observation',
      message: `Your reflections average ${ctx.averageReflectionLength} words. This isn't going through the motions - this is genuine introspection. That depth is rare.`,
      priority: 75
    });
  }

  // Volume milestone
  if (ctx.totalWords >= 5000) {
    insights.push({
      type: 'celebration',
      message: `${ctx.totalWords.toLocaleString()} words written in reflection. That's not just journaling - that's an ongoing conversation with yourself about who you want to become.`,
      priority: 80
    });
  }

  // ========== GOAL-SPECIFIC INSIGHTS ==========

  if (ctx.transformationGoal) {
    const goalInsights: Record<TransformationGoal, PersonalInsight> = {
      calmer: {
        type: 'observation',
        message: `You set out to become calmer. Every lesson, every reflection, every day of practice is training your nervous system to respond instead of react.`,
        context: 'Goal alignment',
        priority: 70
      },
      disciplined: {
        type: 'observation',
        message: `${ctx.currentStreak > 0 ? `${ctx.currentStreak} days of showing up` : 'Starting fresh'} - this is what discipline looks like. Not motivation. Choice. Day after day.`,
        context: 'Goal alignment',
        priority: 70
      },
      confident: {
        type: 'observation',
        message: `Confidence comes from evidence. ${ctx.totalLessons} lessons completed. ${ctx.totalReflections} times you examined yourself honestly. That's evidence.`,
        context: 'Goal alignment',
        priority: 70
      },
      leader: {
        type: 'observation',
        message: `Leadership starts with self-leadership. You're mastering yourself first. That's the foundation every great leader built on.`,
        context: 'Goal alignment',
        priority: 70
      },
      focused: {
        type: 'observation',
        message: `Every time you complete a lesson, you're training your attention. Focus isn't found - it's built. You're building it.`,
        context: 'Goal alignment',
        priority: 70
      },
      resilient: {
        type: 'observation',
        message: `Resilience is forged in practice, not theory. ${ctx.totalLessons} lessons. ${ctx.currentStreak > 0 ? `${ctx.currentStreak} days in a row.` : ''} You're becoming unshakeable.`,
        context: 'Goal alignment',
        priority: 70
      }
    };
    insights.push(goalInsights[ctx.transformationGoal]);
  }

  // ========== COMPARISON INSIGHTS ==========

  // Show growth over time
  if (ctx.daysSinceStart >= 14 && ctx.totalLessons >= 10) {
    const lessonsPerDay = ctx.totalLessons / ctx.daysSinceStart;
    if (lessonsPerDay >= 0.5) {
      insights.push({
        type: 'observation',
        message: `You've averaged a lesson every ${Math.round(1 / lessonsPerDay)} days for ${ctx.daysSinceStart} days. That kind of consistency transforms people.`,
        priority: 65
      });
    }
  }

  // ========== WHY STATEMENT INTEGRATION ==========

  if (ctx.whyStatement && ctx.daysSinceStart >= 7) {
    insights.push({
      type: 'reflection',
      message: `You started this because: "${ctx.whyStatement.slice(0, 100)}${ctx.whyStatement.length > 100 ? '...' : ''}" - Is that why still burning? Let it fuel you.`,
      priority: 60
    });
  }

  // Sort by priority and return top insights
  return insights.sort((a, b) => b.priority - a.priority);
}

// ============================================================================
// HERO MESSAGE GENERATOR
// The powerful opening statement on the dashboard
// ============================================================================

export function generateHeroMessage(ctx: ProgressContext): { headline: string; subtext: string } {
  const name = ctx.name || 'You';

  // No activity yet
  if (ctx.totalLessons === 0) {
    return {
      headline: `${name}, your transformation awaits`,
      subtext: 'Take your first step today. One lesson. One reflection. One choice to become who you know you can be.'
    };
  }

  // Just started (1-3 lessons)
  if (ctx.totalLessons <= 3) {
    return {
      headline: `${name}, you've begun`,
      subtext: `${ctx.totalLessons} lesson${ctx.totalLessons > 1 ? 's' : ''} completed. The hardest part is over. Now, keep going.`
    };
  }

  // First week
  if (ctx.daysSinceStart <= 7) {
    return {
      headline: `Week one, ${name}`,
      subtext: `${ctx.totalLessons} lessons. ${ctx.currentStreak} day${ctx.currentStreak !== 1 ? 's' : ''} of practice. You're building something real.`
    };
  }

  // Building streak (7-30 days)
  if (ctx.currentStreak >= 7 && ctx.currentStreak < 30) {
    return {
      headline: `${ctx.currentStreak} days and counting`,
      subtext: `${name}, you're proving what you're capable of. This streak is not luck. It's you.`
    };
  }

  // Strong streak (30+ days)
  if (ctx.currentStreak >= 30) {
    return {
      headline: `${ctx.currentStreak} days of transformation`,
      subtext: `${name}, the person who started ${ctx.daysSinceStart} days ago would barely recognize you now.`
    };
  }

  // Lost streak but has history
  if (ctx.currentStreak === 0 && ctx.longestStreak > 0) {
    return {
      headline: `${name}, welcome back`,
      subtext: `Your ${ctx.longestStreak}-day streak proved what you're capable of. Today is day one of your next chapter.`
    };
  }

  // Long journey, moderate engagement
  if (ctx.daysSinceStart >= 30) {
    return {
      headline: `${ctx.daysSinceStart} days on the path`,
      subtext: `${ctx.totalLessons} lessons. ${ctx.totalWords.toLocaleString()} words written. ${name}, you're becoming who you set out to be.`
    };
  }

  // Default
  return {
    headline: `${name}'s journey continues`,
    subtext: `${ctx.totalLessons} lessons. ${ctx.currentStreak > 0 ? `${ctx.currentStreak} day streak.` : ''} Every day forward is progress.`
  };
}

// ============================================================================
// GRADE DESCRIPTIONS
// What each grade means emotionally
// ============================================================================

export const GRADE_DESCRIPTIONS: Record<TransformationScore['grade'], { title: string; description: string; color: string }> = {
  awakening: {
    title: 'Awakening',
    description: 'You\'ve opened your eyes to change. The journey has begun.',
    color: '#94a3b8' // slate
  },
  emerging: {
    title: 'Emerging',
    description: 'You\'re rising from who you were. The old patterns are loosening.',
    color: '#22d3ee' // cyan
  },
  growing: {
    title: 'Growing',
    description: 'Real progress is happening. You\'re not the same person who started.',
    color: '#10b981' // emerald
  },
  flourishing: {
    title: 'Flourishing',
    description: 'Your transformation is undeniable. Others can see the change.',
    color: '#8b5cf6' // violet
  },
  transcending: {
    title: 'Transcending',
    description: 'You\'ve become who you set out to be. Now you\'re reaching higher.',
    color: '#f59e0b' // amber
  }
};

// ============================================================================
// BREAKDOWN LABELS
// What each component of the score represents
// ============================================================================

export const BREAKDOWN_LABELS: Record<keyof TransformationScore['breakdown'], { label: string; description: string; icon: string }> = {
  consistency: {
    label: 'Consistency',
    description: 'Showing up day after day',
    icon: '🔥'
  },
  depth: {
    label: 'Depth',
    description: 'Quality of your reflections',
    icon: '🌊'
  },
  commitment: {
    label: 'Commitment',
    description: 'Lessons completed and time invested',
    icon: '⚡'
  },
  growth: {
    label: 'Growth',
    description: 'Measurable progress over time',
    icon: '📈'
  }
};
