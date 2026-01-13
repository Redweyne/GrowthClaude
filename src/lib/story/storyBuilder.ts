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
    'This Is Who You\'ve Become',
    'Look How Far You\'ve Risen',
    'The Fire Inside You Won'
  ],
  reflective: [
    'The Quiet Work You\'ve Done',
    'When You Look Back...',
    'This Is Your Story'
  ],
  resilient: [
    'You Never Gave Up',
    'Through It All, You Kept Going',
    'The Strength Was Always There'
  ],
  awakening: [
    'Something In You Shifted',
    'The First Step Matters Most',
    'A New Chapter Began'
  ],
  transformative: [
    'Read This Slowly...',
    'You Are Not The Same Person',
    'This Is What Growth Looks Like'
  ]
};

const CLOSING_MESSAGES = {
  triumphant: [
    'You didn\'t just change. You became.',
    'This version of you — it\'s beautiful.',
    'The fire you\'ve built will light your path forever.'
  ],
  reflective: [
    'The deepest growth happens in silence.',
    'You\'ve been doing the work. It shows.',
    'Some transformations can only be felt.'
  ],
  resilient: [
    'They said it couldn\'t be done. You did it anyway.',
    'Every single day, you chose yourself.',
    'This consistency — it\'s who you are now.'
  ],
  awakening: [
    'The journey of a thousand miles has begun.',
    'Something powerful is taking root inside you.',
    'Trust the process. Trust yourself.'
  ],
  transformative: [
    'The person reading this is not the person who started.',
    'You are proof that change is possible.',
    'What you\'ve done here — it\'s remarkable.'
  ]
};

const PERSONAL_NOTES = {
  triumphant: 'Every word you wrote in reflection, every lesson you completed, every day you showed up — it wasn\'t for nothing. This is the evidence. This is who you\'ve become.',
  reflective: 'Growth isn\'t always fireworks and celebrations. Sometimes it\'s the quiet 2am reflections. The small shifts in perspective. The moments when you chose differently. That\'s where the real magic happened.',
  resilient: 'There were mornings when you didn\'t want to start. Nights when you felt like stopping. But something in you refused to quit. That something — that\'s your power.',
  awakening: 'A single spark can start a fire. You\'ve lit that spark. The path ahead isn\'t always clear, but now you know — you have what it takes to walk it.',
  transformative: 'If someone showed you where you\'d be when you started, you might not have believed them. But here you are. Different. Stronger. More yourself than ever before.'
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
    duration: 5500, // Let the opening breathe
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
    duration: 6000, // The origin story deserves time
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
      ? 'Today, something changed inside you.'
      : `${context.metrics.daysSinceStart} days ago, you made the decision that changed everything.`
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
    headline: 'What Your Commitment Built'
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
    duration: 10000, // The transformation moment - let it sink in
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
    message = 'A month of relentless dedication. This isn\'t discipline anymore — it\'s who you are.';
    emoji = '🔥';
  } else if (currentStreak >= 14) {
    message = 'Two weeks of choosing yourself, every single day. That takes something special.';
    emoji = '💪';
  } else if (currentStreak >= 7) {
    message = 'Seven days of showing up. The habit is taking root. Feel it.';
    emoji = '⭐';
  } else if (longestStreak >= 7) {
    message = `Your personal best: ${longestStreak} days. You proved you can do this. Now do it again.`;
    emoji = '🎯';
  } else {
    message = 'Every day you choose growth is a victory. Never forget that.';
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
    duration: 8000, // Who you're becoming - pause and feel it
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
    message: 'Words shape reality. You\'re writing yourself into existence.',
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
      ? 'Each badge represents a moment you transcended your limits.'
      : 'These aren\'t just badges. They\'re proof of who you\'re becoming.'
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
    message: 'The vocabulary of your transformation'
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
    duration: 9000, // The emotional crescendo
    background: BACKGROUNDS.closing,
    animation: ANIMATIONS.blurIn,
    headline: context.userName ? `${context.userName},` : 'Remember this moment.',
    message,
    personalNote,
    signOff: 'The best is yet to come.'
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
      ? 'Your story has the power to change someone else\'s life. Share it.'
      : 'This moment matters. Your journey matters. You matter.'
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
