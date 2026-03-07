// ============================================================================
// TRANSFORMATION STORY TYPE SYSTEM
// The architecture for creating deeply personal, emotionally resonant
// stories of human growth and transformation.
// ============================================================================

// ----------------------------------------------------------------------------
// CORE STORY TYPES
// ----------------------------------------------------------------------------

export type StoryType = 'weekly' | 'monthly' | 'milestone' | 'on_demand';

export type StoryMood =
  | 'triumphant'      // Major breakthroughs
  | 'reflective'      // Quiet growth, inner change
  | 'resilient'       // Overcoming struggles, bouncing back
  | 'awakening'       // First realizations, early journey
  | 'transformative'; // Deep identity shifts

export interface TransformationStory {
  id: string;
  type: StoryType;
  mood: StoryMood;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  title: string;
  subtitle: string;
  slides: StorySlide[];
  shareCard: ShareableStoryCard;
  metrics: StoryMetrics;
}

// ----------------------------------------------------------------------------
// SLIDE TYPES - Each represents a different moment in the narrative
// ----------------------------------------------------------------------------

export type SlideType =
  | 'opening'           // The hook - sets the emotional tone
  | 'journey_start'     // Where they began
  | 'reflection_then'   // An early reflection (the "before")
  | 'reflection_now'    // A recent reflection (the "after")
  | 'contrast'          // Side-by-side comparison
  | 'pattern_shift'     // How their patterns evolved
  | 'identity_moment'   // Identity statement highlight
  | 'streak_highlight'  // Streak highlight
  | 'stat_reveal'       // Impressive statistic
  | 'assessment_growth' // Assessment dimension improvement
  | 'word_cloud'        // Their most meaningful words
  | 'wisdom_applied'    // Real-world application moment
  | 'milestone'         // Major milestone reached
  | 'closing'           // The emotional conclusion
  | 'call_to_action';   // Share / continue journey

export interface BaseSlide {
  id: string;
  type: SlideType;
  order: number;
  duration: number; // milliseconds to auto-advance (0 = manual)
  background: SlideBackground;
  animation: SlideAnimation;
}

export interface SlideBackground {
  type: 'gradient' | 'solid' | 'pattern';
  colors: string[];
  pattern?: 'dots' | 'lines' | 'waves' | 'none';
  opacity?: number;
}

export interface SlideAnimation {
  enter: 'fade' | 'slide_up' | 'slide_left' | 'scale' | 'blur';
  exit: 'fade' | 'slide_up' | 'slide_left' | 'scale' | 'blur';
  stagger?: number; // delay between child animations
}

// ----------------------------------------------------------------------------
// SPECIFIC SLIDE INTERFACES
// ----------------------------------------------------------------------------

export interface OpeningSlide extends BaseSlide {
  type: 'opening';
  headline: string;
  subheadline: string;
  periodLabel: string;
  accentEmoji?: string;
}

export interface JourneyStartSlide extends BaseSlide {
  type: 'journey_start';
  daysSinceStart: number;
  firstLessonDate: string;
  firstLessonTitle: string;
  openingMessage: string;
}

export interface ReflectionSlide extends BaseSlide {
  type: 'reflection_then' | 'reflection_now';
  reflection: {
    text: string;
    date: string;
    lessonTitle: string;
    coreConceptTag: string;
  };
  label: string;
  contextMessage: string;
}

export interface ContrastSlide extends BaseSlide {
  type: 'contrast';
  before: {
    text: string;
    date: string;
    label: string;
  };
  after: {
    text: string;
    date: string;
    label: string;
  };
  insightMessage: string;
  growthIndicator: string;
}

export interface PatternShiftSlide extends BaseSlide {
  type: 'pattern_shift';
  fromPatterns: PatternData[];
  toPatterns: PatternData[];
  shiftMessage: string;
  interpretation: string;
}

export interface PatternData {
  theme: string;
  label: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface IdentityMomentSlide extends BaseSlide {
  type: 'identity_moment';
  statement: {
    text: string;
    date: string;
    context: string;
  };
  message: string;
  totalStatements: number;
}

export interface StreakHighlightSlide extends BaseSlide {
  type: 'streak_highlight';
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  consistencyScore: number; // 0-100
  message: string;
  streakEmoji: string;
}

export interface StatRevealSlide extends BaseSlide {
  type: 'stat_reveal';
  stats: StoryStatistic[];
  headline: string;
}

export interface StoryStatistic {
  label: string;
  value: string | number;
  subtext?: string;
  icon: string;
  color: string;
  animation: 'count_up' | 'pop' | 'slide';
}

export interface AssessmentGrowthSlide extends BaseSlide {
  type: 'assessment_growth';
  dimension: string;
  dimensionIcon: string;
  before: {
    score: number;
    date: string;
  };
  after: {
    score: number;
    date: string;
  };
  growthPercentage: number;
  message: string;
}

export interface WordCloudSlide extends BaseSlide {
  type: 'word_cloud';
  words: WordData[];
  totalWordsWritten: number;
  message: string;
}

export interface WordData {
  word: string;
  count: number;
  size: 'small' | 'medium' | 'large' | 'hero';
  color: string;
}

export interface WisdomAppliedSlide extends BaseSlide {
  type: 'wisdom_applied';
  application: {
    situation: string;
    principle: string;
    outcome: string;
    date: string;
  };
  totalApplications: number;
  message: string;
}

export interface MilestoneSlide extends BaseSlide {
  type: 'milestone';
  milestone: {
    type: 'lessons' | 'streak' | 'level' | 'reflections' | 'days';
    value: number;
    label: string;
  };
  celebrationMessage: string;
  nextMilestone?: {
    type: string;
    value: number;
    label: string;
  };
}

export interface ClosingSlide extends BaseSlide {
  type: 'closing';
  headline: string;
  message: string;
  personalNote: string;
  signOff: string;
}

export interface CallToActionSlide extends BaseSlide {
  type: 'call_to_action';
  primaryAction: {
    label: string;
    action: 'share' | 'continue' | 'review';
  };
  secondaryAction?: {
    label: string;
    action: 'share' | 'continue' | 'review';
  };
  encouragement: string;
}

// Union type for all slides
export type StorySlide =
  | OpeningSlide
  | JourneyStartSlide
  | ReflectionSlide
  | ContrastSlide
  | PatternShiftSlide
  | IdentityMomentSlide
  | StreakHighlightSlide
  | StatRevealSlide
  | AssessmentGrowthSlide
  | WordCloudSlide
  | WisdomAppliedSlide
  | MilestoneSlide
  | ClosingSlide
  | CallToActionSlide;

// ----------------------------------------------------------------------------
// SHAREABLE CARD TYPES
// ----------------------------------------------------------------------------

export interface ShareableStoryCard {
  id: string;
  storyId: string;
  title: string;
  subtitle: string;
  stats: ShareableStat[];
  quote?: {
    text: string;
    attribution: string;
  };
  period: string;
  theme: ShareableTheme;
}

export interface ShareableStat {
  icon: string;
  value: string;
  label: string;
}

export interface ShareableTheme {
  background: string[];
  textColor: string;
  accentColor: string;
  pattern: 'minimal' | 'geometric' | 'organic' | 'none';
}

// ----------------------------------------------------------------------------
// METRICS & ANALYTICS
// ----------------------------------------------------------------------------

export interface StoryMetrics {
  // Engagement
  totalReflections: number;
  totalWordsWritten: number;
  averageReflectionLength: number;
  longestReflection: number;

  // Consistency
  totalActiveDays: number;
  currentStreak: number;
  longestStreak: number;
  consistencyPercentage: number;

  // Growth
  lessonsCompleted: number;
  practiceSessionsCompleted: number;
  assessmentsCompleted: number;
  identityStatementsCreated: number;
  wisdomApplications: number;

  totalXpEarned: number;
  currentLevel: number;

  // Patterns
  dominantPatterns: string[];
  patternShifts: PatternShiftData[];

  // Time
  daysSinceStart: number;
  totalTimeInvested: string; // formatted string like "12 hours"
}

export interface PatternShiftData {
  from: string;
  to: string;
  significance: 'minor' | 'moderate' | 'major';
}

// ----------------------------------------------------------------------------
// STORY GENERATION CONTEXT
// ----------------------------------------------------------------------------

export interface StoryGenerationContext {
  locale: 'en' | 'fr' | 'ar';

  // User info
  userName: string;
  transformationGoal: string;
  whyStatement: string;

  // Time context
  periodStart: Date;
  periodEnd: Date;
  daysSinceJourneyStart: number;

  // Content
  reflections: ReflectionForStory[];
  identityStatements: IdentityForStory[];
  assessments: AssessmentForStory[];
  wisdomLogs: WisdomLogForStory[];

  // Patterns
  patternHistory: MonthlyPatternForStory[];

  // Stats
  metrics: StoryMetrics;
}

export interface ReflectionForStory {
  id: string;
  text: string;
  date: string;
  lessonTitle: string;
  coreConceptTag: string;
  wordCount: number;
}

export interface IdentityForStory {
  statement: string;
  date: string;
  context: string;
}

export interface AssessmentForStory {
  date: string;
  month: string;
  scores: Record<string, number>;
}

export interface WisdomLogForStory {
  situation: string;
  principle: string;
  outcome: string;
  date: string;
}

export interface MonthlyPatternForStory {
  month: string;
  themes: Record<string, number>;
}

// ----------------------------------------------------------------------------
// INSIGHT TYPES - The soul of the story
// ----------------------------------------------------------------------------

export interface TransformationInsight {
  type: InsightType;
  title: string;
  description: string;
  evidence: string[];
  emotionalWeight: 'light' | 'medium' | 'profound';
  suggestedSlide: SlideType;
}

export type InsightType =
  | 'first_vs_latest'      // Contrast between first and most recent
  | 'pattern_evolution'    // How thought patterns changed
  | 'identity_formation'   // Identity statements reveal
  | 'consistency_story'    // The streak narrative
  | 'breakthrough_moment'  // A pivotal reflection
  | 'growth_dimension'     // Assessment improvement
  | 'wisdom_in_action'     // Real-world application
  | 'vocabulary_shift'     // Change in language used
  | 'milestone_reached'    // Quantitative milestone
  | 'resilience_shown';    // Bouncing back after setback

// ----------------------------------------------------------------------------
// NARRATIVE TEMPLATES
// ----------------------------------------------------------------------------

export interface NarrativeTemplate {
  mood: StoryMood;
  openingTemplates: string[];
  closingTemplates: string[];
  transitionPhrases: string[];
  celebrationPhrases: string[];
  reflectionPhrases: string[];
  growthPhrases: string[];
}

// ----------------------------------------------------------------------------
// STORY STATE (for playback)
// ----------------------------------------------------------------------------

export interface StoryPlaybackState {
  storyId: string;
  currentSlideIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  isComplete: boolean;
  slideProgress: number; // 0-100 for current slide
  totalDuration: number;
  elapsedTime: number;
}

// ----------------------------------------------------------------------------
// HELPER TYPE GUARDS
// ----------------------------------------------------------------------------

export function isOpeningSlide(slide: StorySlide): slide is OpeningSlide {
  return slide.type === 'opening';
}

export function isContrastSlide(slide: StorySlide): slide is ContrastSlide {
  return slide.type === 'contrast';
}

export function isReflectionSlide(slide: StorySlide): slide is ReflectionSlide {
  return slide.type === 'reflection_then' || slide.type === 'reflection_now';
}

export function isStatRevealSlide(slide: StorySlide): slide is StatRevealSlide {
  return slide.type === 'stat_reveal';
}

export function isClosingSlide(slide: StorySlide): slide is ClosingSlide {
  return slide.type === 'closing';
}
