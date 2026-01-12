// ============================================================================
// INSIGHT GENERATOR
// The emotional intelligence of the story system.
// Determines what insights matter most and how to present them.
// ============================================================================

import {
  StoryGenerationContext,
  TransformationInsight,
  InsightType,
  StoryMood,
  SlideType
} from '@/types/story';
import {
  analyzeReflection,
  findBestContrast,
  findBreakthroughReflection,
  getReflectionStats
} from './reflectionAnalyzer';
import { analyzePatternEvolution } from './patternAnalyzer';

// ----------------------------------------------------------------------------
// INSIGHT PRIORITY & SCORING
// ----------------------------------------------------------------------------

interface ScoredInsight extends TransformationInsight {
  priority: number;
  impactScore: number;
}

/**
 * Generates all possible insights from the user's data
 */
export function generateInsights(context: StoryGenerationContext): TransformationInsight[] {
  const allInsights: ScoredInsight[] = [];

  // 1. First vs Latest Contrast (highest emotional impact)
  const contrastInsight = generateContrastInsight(context);
  if (contrastInsight) allInsights.push(contrastInsight);

  // 2. Pattern Evolution
  const patternInsights = generatePatternInsights(context);
  allInsights.push(...patternInsights);

  // 3. Breakthrough Moment
  const breakthroughInsight = generateBreakthroughInsight(context);
  if (breakthroughInsight) allInsights.push(breakthroughInsight);

  // 4. Identity Formation
  const identityInsights = generateIdentityInsights(context);
  allInsights.push(...identityInsights);

  // 5. Consistency Story (streaks)
  const consistencyInsight = generateConsistencyInsight(context);
  if (consistencyInsight) allInsights.push(consistencyInsight);

  // 6. Assessment Growth
  const assessmentInsights = generateAssessmentInsights(context);
  allInsights.push(...assessmentInsights);

  // 7. Milestone Reached
  const milestoneInsights = generateMilestoneInsights(context);
  allInsights.push(...milestoneInsights);

  // 8. Wisdom in Action
  const wisdomInsight = generateWisdomInsight(context);
  if (wisdomInsight) allInsights.push(wisdomInsight);

  // Sort by priority and impact
  allInsights.sort((a, b) => {
    // First by priority (lower is higher priority)
    if (a.priority !== b.priority) return a.priority - b.priority;
    // Then by impact score (higher is better)
    return b.impactScore - a.impactScore;
  });

  // Return top insights, ensuring variety
  return selectDiverseInsights(allInsights);
}

/**
 * Selects a diverse set of insights (not all the same type)
 */
function selectDiverseInsights(insights: ScoredInsight[], maxCount: number = 8): TransformationInsight[] {
  const selected: TransformationInsight[] = [];
  const typeCount = new Map<InsightType, number>();

  for (const insight of insights) {
    const currentTypeCount = typeCount.get(insight.type) || 0;

    // Limit each type to 2 occurrences
    if (currentTypeCount < 2) {
      selected.push({
        type: insight.type,
        title: insight.title,
        description: insight.description,
        evidence: insight.evidence,
        emotionalWeight: insight.emotionalWeight,
        suggestedSlide: insight.suggestedSlide
      });
      typeCount.set(insight.type, currentTypeCount + 1);

      if (selected.length >= maxCount) break;
    }
  }

  return selected;
}

// ----------------------------------------------------------------------------
// SPECIFIC INSIGHT GENERATORS
// ----------------------------------------------------------------------------

/**
 * First vs Latest reflection contrast
 */
function generateContrastInsight(context: StoryGenerationContext): ScoredInsight | null {
  if (context.reflections.length < 3) return null;

  const contrast = findBestContrast(context.reflections);
  if (!contrast || contrast.contrastScore < 0.3) return null;

  const daysBetween = Math.floor(
    (new Date(contrast.after.date).getTime() - new Date(contrast.before.date).getTime())
    / (1000 * 60 * 60 * 24)
  );

  return {
    type: 'first_vs_latest',
    title: 'Your Transformation',
    description: contrast.growthNarrative,
    evidence: [
      `${daysBetween} days between these reflections`,
      `Contrast type: ${contrast.contrastType.replace(/_/g, ' ')}`
    ],
    emotionalWeight: contrast.contrastScore > 0.6 ? 'profound' : 'medium',
    suggestedSlide: 'contrast',
    priority: 1, // Highest priority
    impactScore: contrast.contrastScore
  };
}

/**
 * Pattern evolution insights
 */
function generatePatternInsights(context: StoryGenerationContext): ScoredInsight[] {
  if (context.patternHistory.length < 2) return [];

  const evolution = analyzePatternEvolution(context.patternHistory);
  const insights: ScoredInsight[] = [];

  for (const shift of evolution.significantShifts) {
    insights.push({
      type: 'pattern_evolution',
      title: `${shift.fromLabel} → ${shift.toLabel}`,
      description: shift.narrative,
      evidence: [shift.timespan],
      emotionalWeight: shift.significance === 'major' ? 'profound' :
                       shift.significance === 'moderate' ? 'medium' : 'light',
      suggestedSlide: 'pattern_shift',
      priority: 2,
      impactScore: shift.significance === 'major' ? 0.9 :
                   shift.significance === 'moderate' ? 0.7 : 0.4
    });
  }

  return insights;
}

/**
 * Breakthrough moment insight
 */
function generateBreakthroughInsight(context: StoryGenerationContext): ScoredInsight | null {
  if (context.reflections.length < 5) return null;

  const breakthrough = findBreakthroughReflection(context.reflections);
  if (!breakthrough) return null;

  const analysis = analyzeReflection(breakthrough.text);
  if (analysis.emotionalDepth === 'surface' || analysis.emotionalDepth === 'moderate') return null;

  return {
    type: 'breakthrough_moment',
    title: 'A Moment of Clarity',
    description: analysis.keyPhrases[0] || 'A profound realization emerged.',
    evidence: [
      `From your reflection on "${breakthrough.lessonTitle}"`,
      new Date(breakthrough.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    ],
    emotionalWeight: 'profound',
    suggestedSlide: 'reflection_now',
    priority: 3,
    impactScore: analysis.introspectionScore + analysis.growthScore
  };
}

/**
 * Identity formation insights
 */
function generateIdentityInsights(context: StoryGenerationContext): ScoredInsight[] {
  if (context.identityStatements.length === 0) return [];

  const insights: ScoredInsight[] = [];

  // Most recent identity statement
  const latestStatement = context.identityStatements[context.identityStatements.length - 1];

  insights.push({
    type: 'identity_formation',
    title: 'Who You\'re Becoming',
    description: latestStatement.statement,
    evidence: [
      `Created ${new Date(latestStatement.date).toLocaleDateString()}`,
      `You have ${context.identityStatements.length} identity statements`
    ],
    emotionalWeight: context.identityStatements.length >= 5 ? 'profound' : 'medium',
    suggestedSlide: 'identity_moment',
    priority: 4,
    impactScore: Math.min(context.identityStatements.length / 10, 1)
  });

  // If multiple statements, show evolution
  if (context.identityStatements.length >= 3) {
    const first = context.identityStatements[0];
    insights.push({
      type: 'identity_formation',
      title: 'Identity Evolution',
      description: `From "${first.statement}" to "${latestStatement.statement}"`,
      evidence: [
        `${context.identityStatements.length} identity statements over your journey`
      ],
      emotionalWeight: 'medium',
      suggestedSlide: 'identity_moment',
      priority: 5,
      impactScore: context.identityStatements.length / 10
    });
  }

  return insights;
}

/**
 * Consistency/streak insight
 */
function generateConsistencyInsight(context: StoryGenerationContext): ScoredInsight | null {
  const { currentStreak, longestStreak, consistencyPercentage } = context.metrics;

  if (currentStreak < 3 && longestStreak < 7) return null;

  const isMilestone = [7, 14, 21, 30, 60, 90, 180, 365].includes(currentStreak);

  let description: string;
  let emotionalWeight: TransformationInsight['emotionalWeight'];

  if (currentStreak >= 30) {
    description = `${currentStreak} days of showing up. That's not luck — that's who you are now.`;
    emotionalWeight = 'profound';
  } else if (currentStreak >= 14) {
    description = `${currentStreak} days strong. You're building something real.`;
    emotionalWeight = 'medium';
  } else if (currentStreak >= 7) {
    description = `A full week of consistency. The foundation is set.`;
    emotionalWeight = 'medium';
  } else {
    description = `${currentStreak} days and counting. Every day matters.`;
    emotionalWeight = 'light';
  }

  return {
    type: 'consistency_story',
    title: isMilestone ? `${currentStreak} Day Milestone` : 'Your Consistency',
    description,
    evidence: [
      `Current streak: ${currentStreak} days`,
      `Longest streak: ${longestStreak} days`,
      `${Math.round(consistencyPercentage)}% consistency rate`
    ],
    emotionalWeight,
    suggestedSlide: 'streak_highlight',
    priority: isMilestone ? 2 : 5,
    impactScore: Math.min(currentStreak / 30, 1)
  };
}

/**
 * Assessment growth insights
 */
function generateAssessmentInsights(context: StoryGenerationContext): ScoredInsight[] {
  if (context.assessments.length < 2) return [];

  const insights: ScoredInsight[] = [];
  const first = context.assessments[0];
  const last = context.assessments[context.assessments.length - 1];

  // Find dimensions with most growth
  const dimensions = ['emotionalMastery', 'discipline', 'perspective', 'selfAwareness', 'growth'];
  const dimensionLabels: Record<string, string> = {
    emotionalMastery: 'Emotional Mastery',
    discipline: 'Discipline',
    perspective: 'Perspective',
    selfAwareness: 'Self-Awareness',
    growth: 'Growth Mindset'
  };

  for (const dim of dimensions) {
    const firstScore = first.scores[dim] || 0;
    const lastScore = last.scores[dim] || 0;
    const growth = lastScore - firstScore;

    if (growth >= 2) {
      const growthPercentage = Math.round((growth / Math.max(firstScore, 1)) * 100);

      insights.push({
        type: 'growth_dimension',
        title: `${dimensionLabels[dim]} Growth`,
        description: `Your ${dimensionLabels[dim].toLowerCase()} grew from ${firstScore}/10 to ${lastScore}/10.`,
        evidence: [
          `+${growth} points`,
          `${growthPercentage}% improvement`,
          `Over ${context.assessments.length} assessments`
        ],
        emotionalWeight: growth >= 4 ? 'profound' : 'medium',
        suggestedSlide: 'assessment_growth',
        priority: 4,
        impactScore: growth / 10
      });
    }
  }

  return insights.slice(0, 2); // Max 2 assessment insights
}

/**
 * Milestone insights
 */
function generateMilestoneInsights(context: StoryGenerationContext): ScoredInsight[] {
  const insights: ScoredInsight[] = [];
  const { lessonsCompleted, totalReflections, totalXpEarned, currentLevel } = context.metrics;

  // Lesson milestones
  const lessonMilestones = [10, 25, 50, 100];
  for (const milestone of lessonMilestones) {
    if (lessonsCompleted >= milestone && lessonsCompleted < milestone * 2) {
      insights.push({
        type: 'milestone_reached',
        title: `${milestone} Lessons Complete`,
        description: `You've completed ${milestone} lessons on your transformation journey.`,
        evidence: [`${lessonsCompleted} total lessons completed`],
        emotionalWeight: milestone >= 50 ? 'profound' : 'medium',
        suggestedSlide: 'milestone',
        priority: 6,
        impactScore: milestone / 100
      });
      break;
    }
  }

  // Reflection milestones
  const reflectionMilestones = [25, 50, 100, 250];
  for (const milestone of reflectionMilestones) {
    if (totalReflections >= milestone && totalReflections < milestone * 2) {
      const totalWords = getReflectionStats(context.reflections).totalWords;
      insights.push({
        type: 'milestone_reached',
        title: `${milestone} Reflections Written`,
        description: `${milestone} moments of honest self-reflection.`,
        evidence: [
          `${totalWords.toLocaleString()} total words written`,
          `That's a small book about your growth`
        ],
        emotionalWeight: milestone >= 100 ? 'profound' : 'medium',
        suggestedSlide: 'stat_reveal',
        priority: 6,
        impactScore: milestone / 250
      });
      break;
    }
  }

  // Level milestone
  if (currentLevel >= 5) {
    const levelTitles: Record<number, string> = {
      5: 'Adept',
      6: 'Journeyman',
      7: 'Master',
      8: 'Sage',
      9: 'Elder',
      10: 'Enlightened'
    };
    insights.push({
      type: 'milestone_reached',
      title: `Level ${currentLevel}: ${levelTitles[currentLevel] || 'Advanced'}`,
      description: `You've reached ${levelTitles[currentLevel] || 'an advanced'} level.`,
      evidence: [`${totalXpEarned.toLocaleString()} XP earned`],
      emotionalWeight: currentLevel >= 7 ? 'profound' : 'medium',
      suggestedSlide: 'milestone',
      priority: 7,
      impactScore: currentLevel / 10
    });
  }

  return insights;
}

/**
 * Wisdom in action insight
 */
function generateWisdomInsight(context: StoryGenerationContext): ScoredInsight | null {
  if (context.wisdomLogs.length === 0) return null;

  // Find the most impactful wisdom application
  const best = context.wisdomLogs.reduce((best, current) => {
    const currentScore = current.outcome.length + current.situation.length;
    const bestScore = best ? best.outcome.length + best.situation.length : 0;
    return currentScore > bestScore ? current : best;
  }, context.wisdomLogs[0]);

  return {
    type: 'wisdom_in_action',
    title: 'Wisdom Applied',
    description: `You applied ${best.principle} in real life: "${best.situation}"`,
    evidence: [
      `Outcome: ${best.outcome}`,
      `${context.wisdomLogs.length} total wisdom applications`
    ],
    emotionalWeight: context.wisdomLogs.length >= 5 ? 'profound' : 'medium',
    suggestedSlide: 'wisdom_applied',
    priority: 5,
    impactScore: Math.min(context.wisdomLogs.length / 10, 1)
  };
}

// ----------------------------------------------------------------------------
// MOOD DETERMINATION
// ----------------------------------------------------------------------------

/**
 * Determines the overall mood/tone of the story based on insights
 */
export function determineStoryMood(insights: TransformationInsight[]): StoryMood {
  const profoundCount = insights.filter(i => i.emotionalWeight === 'profound').length;
  const hasContrast = insights.some(i => i.type === 'first_vs_latest');
  const hasPattern = insights.some(i => i.type === 'pattern_evolution');
  const hasIdentity = insights.some(i => i.type === 'identity_formation');

  // Transformative: identity + pattern shifts
  if (hasIdentity && hasPattern && profoundCount >= 2) {
    return 'transformative';
  }

  // Triumphant: major milestones and high impact
  if (profoundCount >= 3 || insights.some(i =>
    i.type === 'milestone_reached' && i.emotionalWeight === 'profound'
  )) {
    return 'triumphant';
  }

  // Resilient: consistency focus
  if (insights.some(i => i.type === 'consistency_story' && i.emotionalWeight !== 'light')) {
    return 'resilient';
  }

  // Awakening: early journey with contrast
  if (hasContrast && insights.length <= 4) {
    return 'awakening';
  }

  // Default: reflective
  return 'reflective';
}

/**
 * Suggests which slide types to include based on available insights
 */
export function suggestSlideTypes(insights: TransformationInsight[]): SlideType[] {
  const slides: SlideType[] = ['opening'];

  // Always include journey start if we have data
  slides.push('journey_start');

  // Add slides based on insights
  for (const insight of insights) {
    if (!slides.includes(insight.suggestedSlide)) {
      slides.push(insight.suggestedSlide);
    }
  }

  // Always include stats
  if (!slides.includes('stat_reveal')) {
    slides.push('stat_reveal');
  }

  // Always end with closing and CTA
  slides.push('closing');
  slides.push('call_to_action');

  return slides;
}
