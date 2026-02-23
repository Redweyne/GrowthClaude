// ═══════════════════════════════════════════════════════════════════════════
// FLEXIBLE LESSON SYSTEM - THE ARCHITECTURE OF TRANSFORMATION
// ═══════════════════════════════════════════════════════════════════════════
//
// This system allows each lesson to define its own unique journey.
// Not a rigid template, but a language for crafting experiences.
// Each lesson can flow differently, branch based on choices,
// and meet users exactly where they are.
//
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// STEP TYPES - The building blocks of transformation
// ─────────────────────────────────────────────────────────────────────────────

export type LessonStepType =
  | 'scenario'       // Present a relatable situation/pain point
  | 'choice'         // Binary or multiple choice with branching
  | 'reflection'     // Open-ended writing reflection
  | 'insight'        // Reveal wisdom/principle (can appear anywhere)
  | 'mentor'         // Sage feedback
  | 'reward'         // Celebration
  | 'resonanceCheck' // Multi-select from emotionally resonant options
  | 'scaleRating'    // Visual scale rating (quick personal input)
  | 'affirmation'    // Dramatic statement confirmation (tap to commit)
  | 'tapFlow';       // Sequential content revealed by tapping (user-paced)

// ─────────────────────────────────────────────────────────────────────────────
// BASE STEP INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

export interface BaseLessonStep {
  id: string;
  type: LessonStepType;
  // Optional: override which step comes next (for linear flows)
  nextStepId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO STEP - Hook them with relatable pain
// ─────────────────────────────────────────────────────────────────────────────

export interface ScenarioStep extends BaseLessonStep {
  type: 'scenario';
  // The scene to paint
  narrative: string;
  // Optional secondary text
  subtext?: string;
  // The question that bridges to the next step
  bridgeQuestion?: string;
  // Button text
  continueLabel?: string;
  // Visual theme
  mood?: 'struggle' | 'curiosity' | 'hope' | 'tension';
}

// ─────────────────────────────────────────────────────────────────────────────
// CHOICE STEP - Branching based on user's truth
// ─────────────────────────────────────────────────────────────────────────────

export interface ChoiceOption {
  id: string;
  label: string;
  subtext?: string;
  // Which step ID to navigate to
  nextStepId: string;
  // Store this choice for later personalization
  storeAs?: string;
}

export interface ChoiceStep extends BaseLessonStep {
  type: 'choice';
  // The question
  question: string;
  // Context/instruction
  instruction?: string;
  // The options
  options: ChoiceOption[];
}

// ─────────────────────────────────────────────────────────────────────────────
// REFLECTION STEP - The sanctuary of writing
// ─────────────────────────────────────────────────────────────────────────────

export interface ReflectionStep extends BaseLessonStep {
  type: 'reflection';
  // The prompt
  prompt: string;
  // Minimum words (default 5)
  minimumWords?: number;
  // Idle encouragement prompts
  encouragements?: string[];
  // Depth prompts (shown after some writing)
  depthPrompts?: string[];
  // Placeholder
  placeholder?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// INSIGHT STEP - Wisdom revealed
// ─────────────────────────────────────────────────────────────────────────────

export interface InsightStep extends BaseLessonStep {
  type: 'insight';
  // The wisdom text
  text: string;
  // Attribution
  source?: string;
  // Modern book (if from a book)
  sourceBook?: string;
  // Presentation style
  style?: 'quote' | 'principle' | 'revelation' | 'reframe';
  // Optional follow-up context
  followUp?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MENTOR STEP - Sage's wisdom
// ─────────────────────────────────────────────────────────────────────────────

export interface MentorResponseSet {
  // Default responses (picked based on reflection quality)
  default: string[];
  // Low effort response
  lowEffort?: string;
  // Responses based on which branch they took
  byChoice?: Record<string, string[]>;
}

export interface MentorStep extends BaseLessonStep {
  type: 'mentor';
  // The response configuration
  responses: MentorResponseSet;
}

// ─────────────────────────────────────────────────────────────────────────────
// REWARD STEP - Celebration
// ─────────────────────────────────────────────────────────────────────────────

export interface RewardStep extends BaseLessonStep {
  type: 'reward';
  // Custom celebration message
  customMessage?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// RESONANCE CHECK STEP - Select what resonates (replaces writing in engagement path)
// ─────────────────────────────────────────────────────────────────────────────

export interface ResonanceOption {
  id: string;
  text: string;
  emoji?: string;
}

export interface ResonanceCheckStep extends BaseLessonStep {
  type: 'resonanceCheck';
  prompt: string;
  instruction?: string;
  options: ResonanceOption[];
  minSelections?: number;
  maxSelections?: number;
  storeAs?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCALE RATING STEP - Quick personal rating (replaces some commitments)
// ─────────────────────────────────────────────────────────────────────────────

export interface ScaleRatingStep extends BaseLessonStep {
  type: 'scaleRating';
  prompt: string;
  lowLabel: string;
  highLabel: string;
  steps: number;
  storeAs?: string;
  responsesByRange?: {
    low: string;
    mid: string;
    high: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AFFIRMATION STEP - Dramatic statement confirmation (replaces GoDoIt/written commitments)
// ─────────────────────────────────────────────────────────────────────────────

export interface AffirmationStep extends BaseLessonStep {
  type: 'affirmation';
  preText?: string;
  statement: string;
  subtext?: string;
  confirmLabel: string;
  style?: 'commitment' | 'release' | 'gratitude' | 'strength';
}

// ─────────────────────────────────────────────────────────────────────────────
// TAP FLOW STEP - User-paced sequential content (replaces timed visualizations)
// ─────────────────────────────────────────────────────────────────────────────

export interface TapFlowStep extends BaseLessonStep {
  type: 'tapFlow';
  title?: string;
  instructions: string[];
  closingText?: string;
  style?: 'cosmic' | 'grounding' | 'fearless' | 'grateful';
}

// ─────────────────────────────────────────────────────────────────────────────
// UNION TYPE FOR ALL STEPS
// ─────────────────────────────────────────────────────────────────────────────

export type LessonStep =
  | ScenarioStep
  | ChoiceStep
  | ReflectionStep
  | InsightStep
  | MentorStep
  | RewardStep
  | ResonanceCheckStep
  | ScaleRatingStep
  | AffirmationStep
  | TapFlowStep;

// ─────────────────────────────────────────────────────────────────────────────
// FLEXIBLE LESSON INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

import type { DailyExercise } from './dailyPractice';

export interface FlexibleLesson {
  id: string;
  slug: string;
  order: number;

  // Display info
  title: string;
  subtitle?: string;
  description?: string;

  // Categorization
  coreConceptTag: string;

  // Rewards
  xpReward: number;

  // The lesson flow - steps executed in sequence unless branching
  steps: LessonStep[];

  // Which step to start on (defaults to first)
  startStepId?: string;

  // Thumbnail for the map
  thumbnail?: {
    icon: string;
    color: string;
  };

  // Estimated time in minutes
  estimatedMinutes?: number;

  // ═══════════════════════════════════════════════════════════════════════════
  // DAILY PRACTICE SYSTEM ADDITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  // 5 exercises for the daily practice phase
  exercises?: DailyExercise[];

  // Teaser text for "tomorrow's glimpse" preview
  teaserText?: string;

  // Phase 9: Theme color for ambient background tinting and progress bars
  themeColor?: {
    primary: string;
    glow: string;
    gradient: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER & WORLD (UPDATED)
// ─────────────────────────────────────────────────────────────────────────────

export interface FlexibleChapter {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  order: number;
  iconName: string;
  lessons: FlexibleLesson[];
}

export interface FlexibleWorld {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  iconName: string;
  color: string;
  order: number;
  isPremium: boolean;
  estimatedDays: number;
  totalLessons: number;
  chapters: FlexibleChapter[];
}

// ─────────────────────────────────────────────────────────────────────────────
// LESSON STATE - For tracking progress within a lesson
// ─────────────────────────────────────────────────────────────────────────────

export interface LessonProgress {
  lessonId: string;
  currentStepId: string;
  // Choices made during the lesson
  choices: Record<string, string>;
  // Written content (reflections)
  writings: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER TYPE GUARDS
// ─────────────────────────────────────────────────────────────────────────────

export function isScenarioStep(step: LessonStep): step is ScenarioStep {
  return step.type === 'scenario';
}

export function isChoiceStep(step: LessonStep): step is ChoiceStep {
  return step.type === 'choice';
}

export function isReflectionStep(step: LessonStep): step is ReflectionStep {
  return step.type === 'reflection';
}

export function isInsightStep(step: LessonStep): step is InsightStep {
  return step.type === 'insight';
}

export function isMentorStep(step: LessonStep): step is MentorStep {
  return step.type === 'mentor';
}

export function isRewardStep(step: LessonStep): step is RewardStep {
  return step.type === 'reward';
}

export function isResonanceCheckStep(step: LessonStep): step is ResonanceCheckStep {
  return step.type === 'resonanceCheck';
}

export function isScaleRatingStep(step: LessonStep): step is ScaleRatingStep {
  return step.type === 'scaleRating';
}

export function isAffirmationStep(step: LessonStep): step is AffirmationStep {
  return step.type === 'affirmation';
}

export function isTapFlowStep(step: LessonStep): step is TapFlowStep {
  return step.type === 'tapFlow';
}
