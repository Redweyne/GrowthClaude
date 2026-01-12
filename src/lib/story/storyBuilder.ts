// ============================================================================
// STORY BUILDER
// The master orchestrator that assembles all pieces into a cohesive narrative.
// This is where the magic happens - turning data into emotion.
// ============================================================================

import { v4 as uuidv4 } from 'uuid';
import {
  TransformationStory,
  StorySlide,
  StoryType,
  StoryMood,
  StoryGenerationContext,
  StoryMetrics,
  ShareableStoryCard,
  ShareableStat,
  OpeningSlide,
  JourneyStartSlide,
  ReflectionSlide,
  ContrastSlide,
  PatternShiftSlide,
  IdentityMomentSlide,
  StreakHighlightSlide,
  AchievementSlide,
  StatRevealSlide,
  AssessmentGrowthSlide,
  WordCloudSlide,
  ClosingSlide,
  CallToActionSlide,
  SlideBackground,
  SlideAnimation,
  TransformationInsight
} from '@/types/story';
import {
  findBestContrast,
  analyzeWordFrequency,
  getReflectionStats,
  findBreakthroughReflection
} from './reflectionAnalyzer';
import { analyzePatternEvolution, formatPatternsForSlide } from './patternAnalyzer';
import { generateInsights, determineStoryMood } from './insightGenerator';

// ----------------------------------------------------------------------------
// NARRATIVE TEMPLATES - The soul of the story
// ----------------------------------------------------------------------------

const OPENING_HEADLINES = {
  triumphant: [
    'Look What You\'ve Built',
    'Your Transformation Story',
    'A Journey Worth Celebrating'
  ],
  reflective: [
    'A Moment of Reflection',
    'Your Growth Story',
    'Looking Back, Moving Forward'
  ],
  resilient: [
    'The Power of Showing Up',
    'Consistency Creates Change',
    'Day by Day, You Rose'
  ],
  awakening: [
    'The Beginning of Something',
    'Your Journey Has Begun',
    'Seeds of Transformation'
  ],
  transformative: [
    'You\'re Not Who You Were',
    'The Transformation is Real',
    'Before → After: Your Story'
  ]
};

const CLOSING_MESSAGES = {
  triumphant: [
    'This is just the beginning of who you\'re becoming.',
    'Your transformation is inspiring. Keep going.',
    'What you\'ve built here is remarkable. Own it.'
  ],
  reflective: [
    'Every reflection is a step toward wisdom.',
    'You\'re doing the inner work. It matters.',
    'Growth is a journey, not a destination.'
  ],
  resilient: [
    'Consistency beats intensity. You understand this now.',
    'You showed up. Again and again. That\'s who you are.',
    'The discipline you\'ve built is yours forever.'
  ],
  awakening: [
    'The seeds you\'ve planted will grow.',
    'This is how transformation begins.',
    'You\'ve started something powerful.'
  ],
  transformative: [
    'The person who started this journey is not the person reading this.',
    'You didn\'t just learn — you transformed.',
    'This is proof that change is possible.'
  ]
};

const PERSONAL_NOTES = {
  triumphant: 'You\'ve earned every bit of this progress. The work you\'ve done — the honest reflections, the daily showing up — it all adds up to this.',
  reflective: 'Growth isn\'t always loud. Sometimes it\'s in the quiet moments of reflection where the deepest changes happen.',
  resilient: 'There were days when it wasn\'t easy. But you showed up anyway. That discipline is now part of who you are.',
  awakening: 'Every master was once a beginner. What matters is that you started, and you kept going.',
  transformative: 'Read your early reflections. Then read your recent ones. That\'s not just progress — that\'s transformation.'
};

// ----------------------------------------------------------------------------
// BACKGROUND & ANIMATION PRESETS
// ----------------------------------------------------------------------------

const BACKGROUNDS: Record<string, SlideBackground> = {
  opening: {
    type: 'gradient',
    colors: ['#1a1a2e', '#16213e', '#0f3460'],
    pattern: 'none'
  },
  warmGlow: {
    type: 'gradient',
    colors: ['#1a1a2e', '#2d1f3d', '#3d2449'],
    pattern: 'none'
  },
  growthGreen: {
    type: 'gradient',
    colors: ['#0f2027', '#203a43', '#2c5364'],
    pattern: 'none'
  },
  deepPurple: {
    type: 'gradient',
    colors: ['#1a1a2e', '#2d2b55', '#3d3875'],
    pattern: 'none'
  },
  celebration: {
    type: 'gradient',
    colors: ['#1a1a2e', '#2a2a4a', '#3a3a6a'],
    pattern: 'dots'
  },
  closing: {
    type: 'gradient',
    colors: ['#0f0f1a', '#1a1a2e', '#252545'],
    pattern: 'none'
  }
};

const ANIMATIONS: Record<string, SlideAnimation> = {
  fadeIn: { enter: 'fade', exit: 'fade', stagger: 100 },
  slideUp: { enter: 'slide_up', exit: 'fade', stagger: 150 },
  scaleIn: { enter: 'scale', exit: 'fade', stagger: 100 },
  blurIn: { enter: 'blur', exit: 'blur', stagger: 200 }
};

// ----------------------------------------------------------------------------
// MAIN STORY BUILDER
// ----------------------------------------------------------------------------

/**
 * Builds a complete transformation story from user data
 */
export function buildTransformationStory(
  context: StoryGenerationContext,
  type: StoryType = 'on_demand'
): TransformationStory {
  const storyId = uuidv4();

  // Generate insights from all data
  const insights = generateInsights(context);

  // Determine story mood
  const mood = determineStoryMood(insights);

  // Build slides based on insights and available data
  const slides = buildSlides(context, insights, mood);

  // Generate title and subtitle
  const { title, subtitle } = generateTitleAndSubtitle(context, mood, type);

  // Create shareable card
  const shareCard = buildShareableCard(context, mood, storyId);

  return {
    id: storyId,
    type,
    mood,
    generatedAt: new Date().toISOString(),
    periodStart: context.periodStart.toISOString(),
    periodEnd: context.periodEnd.toISOString(),
    title,
    subtitle,
    slides,
    shareCard,
    metrics: context.metrics
  };
}

/**
 * Generates title and subtitle for the story
 */
function generateTitleAndSubtitle(
  context: StoryGenerationContext,
  mood: StoryMood,
  type: StoryType
): { title: string; subtitle: string } {
  const headlines = OPENING_HEADLINES[mood];
  const title = headlines[Math.floor(Math.random() * headlines.length)];

  let subtitle: string;
  switch (type) {
    case 'weekly':
      subtitle = 'Your week in review';
      break;
    case 'monthly':
      const monthName = context.periodEnd.toLocaleDateString('en-US', { month: 'long' });
      subtitle = `${monthName} ${context.periodEnd.getFullYear()}`;
      break;
    case 'milestone':
      subtitle = 'A milestone worth celebrating';
      break;
    default:
      subtitle = `${context.metrics.daysSinceStart} days of transformation`;
  }

  return { title, subtitle };
}

// ----------------------------------------------------------------------------
// SLIDE BUILDERS
// ----------------------------------------------------------------------------

/**
 * Builds all slides for the story
 */
function buildSlides(
  context: StoryGenerationContext,
  insights: TransformationInsight[],
  mood: StoryMood
): StorySlide[] {
  const slides: StorySlide[] = [];
  let order = 0;

  // 1. OPENING SLIDE (always)
  slides.push(buildOpeningSlide(context, mood, order++));

  // 2. JOURNEY START (if we have history)
  if (context.metrics.daysSinceStart > 0) {
    slides.push(buildJourneyStartSlide(context, order++));
  }

  // 3. STAT REVEAL (early to set context)
  slides.push(buildStatRevealSlide(context, order++));

  // 4. CONTRAST SLIDE (if we have good contrast)
  const contrast = findBestContrast(context.reflections);
  if (contrast && contrast.contrastScore >= 0.25) {
    slides.push(buildContrastSlide(contrast, context, order++));
  }

  // 5. PATTERN SHIFT (if patterns evolved)
  if (context.patternHistory.length >= 2) {
    const patternSlide = buildPatternShiftSlide(context, order++);
    if (patternSlide) slides.push(patternSlide);
  }

  // 6. STREAK HIGHLIGHT (if notable streak)
  if (context.metrics.currentStreak >= 3 || context.metrics.longestStreak >= 7) {
    slides.push(buildStreakHighlightSlide(context, order++));
  }

  // 7. IDENTITY MOMENT (if they have statements)
  if (context.identityStatements.length > 0) {
    slides.push(buildIdentityMomentSlide(context, order++));
  }

  // 8. ACHIEVEMENT SLIDE (if they have achievements)
  if (context.achievements.length > 0) {
    slides.push(buildAchievementSlide(context, order++));
  }

  // 9. ASSESSMENT GROWTH (if multiple assessments with improvement)
  const assessmentSlide = buildAssessmentGrowthSlide(context, order);
  if (assessmentSlide) {
    slides.push(assessmentSlide);
    order++;
  }

  // 10. WORD CLOUD (if enough reflections)
  if (context.reflections.length >= 5) {
    slides.push(buildWordCloudSlide(context, order++));
  }

  // 11. CLOSING SLIDE (always)
  slides.push(buildClosingSlide(context, mood, order++));

  // 12. CALL TO ACTION (always)
  slides.push(buildCallToActionSlide(mood, order++));

  return slides;
}

function buildOpeningSlide(context: StoryGenerationContext, mood: StoryMood, order: number): OpeningSlide {
  const headlines = OPENING_HEADLINES[mood];
  const periodLabel = context.metrics.daysSinceStart === 0
    ? 'Day One'
    : `${context.metrics.daysSinceStart} Days`;

  return {
    id: uuidv4(),
    type: 'opening',
    order,
    duration: 4000,
    background: BACKGROUNDS.opening,
    animation: ANIMATIONS.blurIn,
    headline: headlines[Math.floor(Math.random() * headlines.length)],
    subheadline: context.userName
      ? `${context.userName}'s Transformation`
      : 'Your Transformation',
    periodLabel,
    accentEmoji: mood === 'triumphant' ? '✨' : undefined
  };
}

function buildJourneyStartSlide(context: StoryGenerationContext, order: number): JourneyStartSlide {
  const firstReflection = context.reflections[0];
  const firstDate = firstReflection
    ? new Date(firstReflection.date)
    : context.periodStart;

  return {
    id: uuidv4(),
    type: 'journey_start',
    order,
    duration: 5000,
    background: BACKGROUNDS.warmGlow,
    animation: ANIMATIONS.slideUp,
    daysSinceStart: context.metrics.daysSinceStart,
    firstLessonDate: firstDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    firstLessonTitle: firstReflection?.lessonTitle || 'Your first lesson',
    openingMessage: context.metrics.daysSinceStart === 0
      ? 'Today, you began.'
      : `${context.metrics.daysSinceStart} days ago, you made a choice.`
  };
}

function buildStatRevealSlide(context: StoryGenerationContext, order: number): StatRevealSlide {
  const stats = getReflectionStats(context.reflections);

  const statItems = [
    {
      label: 'Words Written',
      value: stats.totalWords.toLocaleString(),
      subtext: 'in self-reflection',
      icon: '✍️',
      color: '#8B5CF6',
      animation: 'count_up' as const
    },
    {
      label: 'Lessons Completed',
      value: context.metrics.lessonsCompleted,
      subtext: 'wisdom gained',
      icon: '📚',
      color: '#3B82F6',
      animation: 'count_up' as const
    },
    {
      label: 'Current Level',
      value: context.metrics.currentLevel,
      subtext: `${context.metrics.totalXpEarned.toLocaleString()} XP`,
      icon: '⚡',
      color: '#F59E0B',
      animation: 'pop' as const
    },
    {
      label: 'Reflections',
      value: stats.total,
      subtext: 'moments of clarity',
      icon: '💭',
      color: '#10B981',
      animation: 'count_up' as const
    }
  ];

  return {
    id: uuidv4(),
    type: 'stat_reveal',
    order,
    duration: 6000,
    background: BACKGROUNDS.deepPurple,
    animation: ANIMATIONS.scaleIn,
    stats: statItems,
    headline: 'By the Numbers'
  };
}

function buildContrastSlide(
  contrast: ReturnType<typeof findBestContrast>,
  context: StoryGenerationContext,
  order: number
): ContrastSlide {
  if (!contrast) {
    throw new Error('Cannot build contrast slide without contrast data');
  }

  const daysBetween = Math.floor(
    (new Date(contrast.after.date).getTime() - new Date(contrast.before.date).getTime())
    / (1000 * 60 * 60 * 24)
  );

  return {
    id: uuidv4(),
    type: 'contrast',
    order,
    duration: 8000,
    background: BACKGROUNDS.growthGreen,
    animation: ANIMATIONS.slideUp,
    before: {
      text: truncateText(contrast.before.text, 200),
      date: new Date(contrast.before.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      label: 'Then'
    },
    after: {
      text: truncateText(contrast.after.text, 200),
      date: new Date(contrast.after.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      label: 'Now'
    },
    insightMessage: contrast.growthNarrative,
    growthIndicator: `${daysBetween} days between these moments`
  };
}

function buildPatternShiftSlide(
  context: StoryGenerationContext,
  order: number
): PatternShiftSlide | null {
  const evolution = analyzePatternEvolution(context.patternHistory);

  if (evolution.significantShifts.length === 0) return null;

  const shift = evolution.significantShifts[0];
  const { fromPatterns, toPatterns } = formatPatternsForSlide(
    context.patternHistory[0],
    context.patternHistory[context.patternHistory.length - 1]
  );

  if (fromPatterns.length === 0 && toPatterns.length === 0) return null;

  return {
    id: uuidv4(),
    type: 'pattern_shift',
    order,
    duration: 7000,
    background: BACKGROUNDS.warmGlow,
    animation: ANIMATIONS.slideUp,
    fromPatterns,
    toPatterns,
    shiftMessage: shift.narrative,
    interpretation: evolution.evolutionNarrative
  };
}

function buildStreakHighlightSlide(context: StoryGenerationContext, order: number): StreakHighlightSlide {
  const { currentStreak, longestStreak, totalActiveDays, consistencyPercentage } = context.metrics;

  let message: string;
  let emoji: string;

  if (currentStreak >= 30) {
    message = 'A month of showing up. This is who you are now.';
    emoji = '🔥';
  } else if (currentStreak >= 14) {
    message = 'Two weeks of consistency. You\'re building something real.';
    emoji = '💪';
  } else if (currentStreak >= 7) {
    message = 'A full week strong. The foundation is set.';
    emoji = '⭐';
  } else if (longestStreak >= 7) {
    message = `Your best: ${longestStreak} days. You know what you're capable of.`;
    emoji = '🎯';
  } else {
    message = 'Every day you show up matters.';
    emoji = '✨';
  }

  return {
    id: uuidv4(),
    type: 'streak_highlight',
    order,
    duration: 5000,
    background: BACKGROUNDS.celebration,
    animation: ANIMATIONS.scaleIn,
    currentStreak,
    longestStreak,
    totalActiveDays,
    consistencyScore: Math.round(consistencyPercentage),
    message,
    streakEmoji: emoji
  };
}

function buildIdentityMomentSlide(context: StoryGenerationContext, order: number): IdentityMomentSlide {
  const latest = context.identityStatements[context.identityStatements.length - 1];

  return {
    id: uuidv4(),
    type: 'identity_moment',
    order,
    duration: 6000,
    background: BACKGROUNDS.deepPurple,
    animation: ANIMATIONS.blurIn,
    statement: {
      text: latest.statement,
      date: new Date(latest.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      }),
      context: latest.context
    },
    message: 'You\'re defining who you\'re becoming.',
    totalStatements: context.identityStatements.length
  };
}

function buildAchievementSlide(context: StoryGenerationContext, order: number): AchievementSlide {
  // Get recent achievements (up to 4)
  const recentAchievements = context.achievements
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 4);

  return {
    id: uuidv4(),
    type: 'achievement',
    order,
    duration: 5000,
    background: BACKGROUNDS.celebration,
    animation: ANIMATIONS.scaleIn,
    achievements: recentAchievements,
    totalUnlocked: context.achievements.length,
    totalAvailable: 30, // Approximate total achievements
    message: context.achievements.length >= 10
      ? 'Your collection grows.'
      : 'Every achievement tells a story.'
  };
}

function buildAssessmentGrowthSlide(
  context: StoryGenerationContext,
  order: number
): AssessmentGrowthSlide | null {
  if (context.assessments.length < 2) return null;

  const first = context.assessments[0];
  const last = context.assessments[context.assessments.length - 1];

  // Find dimension with most growth
  const dimensions = ['emotionalMastery', 'discipline', 'perspective', 'selfAwareness', 'growth'];
  const labels: Record<string, string> = {
    emotionalMastery: 'Emotional Mastery',
    discipline: 'Discipline',
    perspective: 'Perspective',
    selfAwareness: 'Self-Awareness',
    growth: 'Growth Mindset'
  };
  const icons: Record<string, string> = {
    emotionalMastery: '🧘',
    discipline: '⚡',
    perspective: '🔭',
    selfAwareness: '🪞',
    growth: '🌱'
  };

  let bestDim = dimensions[0];
  let bestGrowth = 0;

  for (const dim of dimensions) {
    const growth = (last.scores[dim] || 0) - (first.scores[dim] || 0);
    if (growth > bestGrowth) {
      bestGrowth = growth;
      bestDim = dim;
    }
  }

  if (bestGrowth < 1) return null;

  const growthPercentage = Math.round(
    (bestGrowth / Math.max(first.scores[bestDim] || 1, 1)) * 100
  );

  return {
    id: uuidv4(),
    type: 'assessment_growth',
    order,
    duration: 6000,
    background: BACKGROUNDS.growthGreen,
    animation: ANIMATIONS.slideUp,
    dimension: labels[bestDim],
    dimensionIcon: icons[bestDim],
    before: {
      score: first.scores[bestDim] || 0,
      date: first.month
    },
    after: {
      score: last.scores[bestDim] || 0,
      date: last.month
    },
    growthPercentage,
    message: `Your ${labels[bestDim].toLowerCase()} grew by ${bestGrowth} points.`
  };
}

function buildWordCloudSlide(context: StoryGenerationContext, order: number): WordCloudSlide {
  const words = analyzeWordFrequency(context.reflections);
  const stats = getReflectionStats(context.reflections);

  return {
    id: uuidv4(),
    type: 'word_cloud',
    order,
    duration: 5000,
    background: BACKGROUNDS.deepPurple,
    animation: ANIMATIONS.fadeIn,
    words: words.slice(0, 20),
    totalWordsWritten: stats.totalWords,
    message: 'The words you\'ve used most on this journey.'
  };
}

function buildClosingSlide(
  context: StoryGenerationContext,
  mood: StoryMood,
  order: number
): ClosingSlide {
  const messages = CLOSING_MESSAGES[mood];
  const message = messages[Math.floor(Math.random() * messages.length)];
  const personalNote = PERSONAL_NOTES[mood];

  return {
    id: uuidv4(),
    type: 'closing',
    order,
    duration: 7000,
    background: BACKGROUNDS.closing,
    animation: ANIMATIONS.blurIn,
    headline: context.userName ? `${context.userName},` : 'Remember this:',
    message,
    personalNote,
    signOff: 'Your transformation continues.'
  };
}

function buildCallToActionSlide(mood: StoryMood, order: number): CallToActionSlide {
  return {
    id: uuidv4(),
    type: 'call_to_action',
    order,
    duration: 0, // Manual advance
    background: BACKGROUNDS.closing,
    animation: ANIMATIONS.fadeIn,
    primaryAction: {
      label: 'Share Your Story',
      action: 'share'
    },
    secondaryAction: {
      label: 'Continue Your Journey',
      action: 'continue'
    },
    encouragement: mood === 'triumphant'
      ? 'Your story could inspire someone else.'
      : 'Every step forward matters.'
  };
}

// ----------------------------------------------------------------------------
// SHAREABLE CARD BUILDER
// ----------------------------------------------------------------------------

function buildShareableCard(
  context: StoryGenerationContext,
  mood: StoryMood,
  storyId: string
): ShareableStoryCard {
  const stats: ShareableStat[] = [
    {
      icon: '🔥',
      value: `${context.metrics.currentStreak}`,
      label: 'Day Streak'
    },
    {
      icon: '📚',
      value: `${context.metrics.lessonsCompleted}`,
      label: 'Lessons'
    },
    {
      icon: '✍️',
      value: `${context.metrics.totalWordsWritten?.toLocaleString() || getReflectionStats(context.reflections).totalWords.toLocaleString()}`,
      label: 'Words Written'
    }
  ];

  // Find a good quote from reflections
  const breakthrough = findBreakthroughReflection(context.reflections);
  const quote = breakthrough
    ? {
        text: truncateText(breakthrough.text, 120),
        attribution: `— From my reflection on ${new Date(breakthrough.date).toLocaleDateString()}`
      }
    : undefined;

  const themes: Record<StoryMood, { background: string[]; textColor: string; accentColor: string; pattern: 'minimal' | 'geometric' | 'organic' | 'none' }> = {
    triumphant: {
      background: ['#1a1a2e', '#2d1f3d', '#4a2c4a'],
      textColor: '#ffffff',
      accentColor: '#F59E0B',
      pattern: 'geometric'
    },
    reflective: {
      background: ['#0f2027', '#203a43', '#2c5364'],
      textColor: '#ffffff',
      accentColor: '#06B6D4',
      pattern: 'minimal'
    },
    resilient: {
      background: ['#1a1a2e', '#2a2a4a', '#3a3a6a'],
      textColor: '#ffffff',
      accentColor: '#10B981',
      pattern: 'minimal'
    },
    awakening: {
      background: ['#1a1a2e', '#2d2b55', '#3d3875'],
      textColor: '#ffffff',
      accentColor: '#8B5CF6',
      pattern: 'organic'
    },
    transformative: {
      background: ['#0f0f1a', '#1a1a2e', '#2a1a3e'],
      textColor: '#ffffff',
      accentColor: '#EC4899',
      pattern: 'geometric'
    }
  };

  return {
    id: uuidv4(),
    storyId,
    title: context.userName
      ? `${context.userName}'s Transformation`
      : 'My Transformation Story',
    subtitle: `${context.metrics.daysSinceStart} days of growth`,
    stats,
    quote,
    period: `${context.periodStart.toLocaleDateString()} - ${context.periodEnd.toLocaleDateString()}`,
    theme: themes[mood]
  };
}

// ----------------------------------------------------------------------------
// UTILITIES
// ----------------------------------------------------------------------------

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  // Try to cut at a sentence boundary
  const truncated = text.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastExclamation = truncated.lastIndexOf('!');

  const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);

  if (lastSentenceEnd > maxLength * 0.6) {
    return text.slice(0, lastSentenceEnd + 1);
  }

  // Otherwise cut at word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  return text.slice(0, lastSpace) + '...';
}

// ----------------------------------------------------------------------------
// EXPORTS
// Note: buildTransformationStory is exported at definition
// ----------------------------------------------------------------------------

export {
  OPENING_HEADLINES,
  CLOSING_MESSAGES,
  PERSONAL_NOTES
};
