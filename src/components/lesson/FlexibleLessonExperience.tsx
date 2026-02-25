'use client';

// ═══════════════════════════════════════════════════════════════════════════
// FLEXIBLE LESSON EXPERIENCE - THE ADAPTIVE JOURNEY
// ═══════════════════════════════════════════════════════════════════════════
//
// This orchestrator brings flexible lessons to life.
// It reads the lesson's step array and dynamically renders each step,
// handling branching, state management, and transitions.
//
// Each lesson can have its own unique flow:
// - Linear (step after step)
// - Branching (based on user choices)
//
// The atmosphere adapts to each step type automatically.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AmbientBackground } from '@/components/ambient';
import { MusicControls } from '@/components/ui/MusicControls';
import { backgroundMusic } from '@/lib/backgroundMusic';
import { getLessonThemeColor } from '@/lib/lessonThemes';
import { useStore } from '@/store/useStore';
import { useAudio } from '@/hooks/useAudio';
import { useTranslation } from '@/i18n';
import { useTheme } from 'next-themes';

// Step components
import { ScenarioStep } from './steps/ScenarioStep';
import { ChoiceStep } from './steps/ChoiceStep';
import { InsightStep } from './steps/InsightStep';
import { ReflectionStep } from './steps/ReflectionStep';
import { MentorStep } from './steps/MentorStep';
import { RewardStep } from './steps/RewardStep';
import { ResonanceCheckStep } from './steps/ResonanceCheckStep';
import { ScaleRatingStep } from './steps/ScaleRatingStep';
import { AffirmationStep } from './steps/AffirmationStep';
import { TapFlowStep } from './steps/TapFlowStep';

// Types
import type {
  FlexibleLesson,
  LessonProgress,
  ChoiceOption,
  ScenarioStep as ScenarioStepType,
  ChoiceStep as ChoiceStepType,
  InsightStep as InsightStepType,
  ReflectionStep as ReflectionStepType,
  MentorStep as MentorStepType,
  RewardStep as RewardStepType,
  ResonanceCheckStep as ResonanceCheckStepType,
  ScaleRatingStep as ScaleRatingStepType,
  AffirmationStep as AffirmationStepType,
  TapFlowStep as TapFlowStepType,
} from '@/types/lessons';

interface FlexibleLessonExperienceProps {
  lesson: FlexibleLesson;
  onComplete: () => void;
  resumeProgress?: LessonProgress;
}

// Step type to theme mapping — bold, visible atmospheres per step type
const STEP_THEMES: Record<string, {
  glow: string;
}> = {
  scenario: { glow: 'rgba(244, 63, 94, 0.30)' },
  choice: { glow: 'rgba(251, 191, 36, 0.28)' },
  insight: { glow: 'rgba(167, 139, 250, 0.35)' },
  reflection: { glow: 'rgba(34, 211, 238, 0.22)' },
  mentor: { glow: 'rgba(168, 85, 247, 0.25)' },
  reward: { glow: 'rgba(251, 191, 36, 0.45)' },
  resonanceCheck: { glow: 'rgba(99, 102, 241, 0.25)' },
  scaleRating: { glow: 'rgba(251, 191, 36, 0.22)' },
  affirmation: { glow: 'rgba(16, 185, 129, 0.30)' },
  tapFlow: { glow: 'rgba(99, 102, 241, 0.28)' },
};

// Step-aware transition system — each step type enters/exits differently
const STEP_TRANSITIONS: Record<string, {
  initial: Record<string, number | string>;
  exit: Record<string, number | string>;
  duration: number;
}> = {
  scenario: {
    initial: { opacity: 0, x: 60 },
    exit: { opacity: 0, x: -40 },
    duration: 0.5,
  },
  choice: {
    initial: { opacity: 0, scale: 0.92 },
    exit: { opacity: 0, scale: 1.05 },
    duration: 0.5,
  },
  insight: {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
    exit: { opacity: 0, filter: 'blur(4px)' },
    duration: 0.6,
  },
  reflection: {
    initial: { opacity: 0, y: 50 },
    exit: { opacity: 0, y: -30 },
    duration: 0.7,
  },
  reward: {
    initial: { opacity: 0, scale: 0.8 },
    exit: { opacity: 0, scale: 1.1 },
    duration: 0.6,
  },
  mentor: {
    initial: { opacity: 0 },
    exit: { opacity: 0 },
    duration: 0.8,
  },
  affirmation: {
    initial: { opacity: 0, y: 40, scale: 0.96 },
    exit: { opacity: 0, y: -20 },
    duration: 0.55,
  },
  tapFlow: {
    initial: { opacity: 0, x: 40 },
    exit: { opacity: 0, x: -30 },
    duration: 0.5,
  },
  resonanceCheck: {
    initial: { opacity: 0, y: 25, scale: 0.96 },
    exit: { opacity: 0, y: -15 },
    duration: 0.5,
  },
  scaleRating: {
    initial: { opacity: 0, y: 25 },
    exit: { opacity: 0, y: -20 },
    duration: 0.5,
  },
};

const DEFAULT_TRANSITION = {
  initial: { opacity: 0, y: 30 },
  exit: { opacity: 0, y: -20 },
  duration: 0.5,
};

// Cinematic easing — fast out, smooth landing
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FlexibleLessonExperience({
  lesson,
  onComplete,
  resumeProgress,
}: FlexibleLessonExperienceProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  const activeSteps = lesson.steps;

  // ─────────────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────────────

  const [currentStepId, setCurrentStepId] = useState<string>(
    resumeProgress?.currentStepId || lesson.startStepId || activeSteps[0]?.id || ''
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [choices, setChoices] = useState<Record<string, string>>(
    resumeProgress?.choices || {}
  );
  const [writings, setWritings] = useState<Record<string, string>>(
    resumeProgress?.writings || {}
  );
  const [xpEarned, setXpEarned] = useState(0);

  const xpEarnedRef = useRef(0);
  const hasInitializedRef = useRef(false);

  // ─────────────────────────────────────────────────────────────────────────
  // Store & Audio
  // ─────────────────────────────────────────────────────────────────────────

  const {
    completeLesson,
    currentStreak,
    saveReflection,
    saveInProgressLesson,
    clearInProgressLesson,
  } = useStore();
  const { playComplete, playReward, playChime, playSuccess } = useAudio();

  // No-op keystroke handler - silence during typing is more calming
  const handleKeystroke = useCallback(() => {
    // Intentionally silent
  }, []);

  const { isRTL } = useTranslation();

  // ─────────────────────────────────────────────────────────────────────────
  // Derived State
  // ─────────────────────────────────────────────────────────────────────────

  const currentStep = activeSteps.find(s => s.id === currentStepId);
  const currentTheme = currentStep ? STEP_THEMES[currentStep.type] : STEP_THEMES.scenario;

  // Compute lesson theme color for ambient background tinting
  const lessonTheme = lesson.themeColor || getLessonThemeColor(lesson.id);

  // ─────────────────────────────────────────────────────────────────────────
  // Audio Initialization - Start lesson music on mount
  // ─────────────────────────────────────────────────────────────────────────

  const handleInitializeAudio = useCallback(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    backgroundMusic.start();
    playChime();
  }, [playChime]);

  useEffect(() => {
    handleInitializeAudio();
    return () => {
      backgroundMusic.stop();
    };
  }, [handleInitializeAudio]);

  // ─────────────────────────────────────────────────────────────────────────
  // Persist lesson progress for page refresh resilience
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const hasProgress = currentStepId !== (lesson.startStepId || activeSteps[0]?.id) ||
                        Object.keys(choices).length > 0 ||
                        Object.keys(writings).length > 0;

    if (hasProgress) {
      saveInProgressLesson({
        lessonId: lesson.id,
        currentStepId,
        choices,
        writings,
        lastUpdated: new Date().toISOString(),
      });
    }
  }, [lesson.id, lesson.startStepId, activeSteps, currentStepId, choices, writings, saveInProgressLesson]);

  // ─────────────────────────────────────────────────────────────────────────
  // Navigation Helpers
  // ─────────────────────────────────────────────────────────────────────────

  const goToStep = useCallback((stepId: string) => {
    const targetStep = activeSteps.find(s => s.id === stepId);
    if (!targetStep) {
      console.error(`[FlexibleLessonExperience] Step "${stepId}" not found! Attempting fallback.`);
      const currentIndex = activeSteps.findIndex(s => s.id === currentStepId);
      if (currentIndex >= 0 && currentIndex < activeSteps.length - 1) {
        setIsTransitioning(true);
        playChime();
        setTimeout(() => {
          setCurrentStepId(activeSteps[currentIndex + 1].id);
          setIsTransitioning(false);
        }, 500);
      } else {
        console.error(`[FlexibleLessonExperience] Cannot navigate, forcing lesson complete.`);
        onComplete();
      }
      return;
    }

    setIsTransitioning(true);
    playChime();
    setTimeout(() => {
      setCurrentStepId(stepId);
      setIsTransitioning(false);
    }, 500);
  }, [playChime, currentStepId, activeSteps, onComplete]);

  const goToNextStep = useCallback(() => {
    if (!currentStep) {
      console.error(`[FlexibleLessonExperience] No current step found for ID: ${currentStepId}`);
      const stepIndex = activeSteps.findIndex(s => s.id === currentStepId);
      if (stepIndex >= 0 && stepIndex < activeSteps.length - 1) {
        goToStep(activeSteps[stepIndex + 1].id);
      } else {
        onComplete();
      }
      return;
    }

    if (currentStep.nextStepId) {
      goToStep(currentStep.nextStepId);
      return;
    }

    const currentIndex = activeSteps.findIndex(s => s.id === currentStepId);
    if (currentIndex >= 0 && currentIndex < activeSteps.length - 1) {
      goToStep(activeSteps[currentIndex + 1].id);
    } else if (currentIndex === activeSteps.length - 1) {
      console.warn(`[FlexibleLessonExperience] At last step "${currentStep.id}" with no nextStepId`);
    }
  }, [currentStep, currentStepId, activeSteps, goToStep, onComplete]);

  // ─────────────────────────────────────────────────────────────────────────
  // XP Calculation
  // ─────────────────────────────────────────────────────────────────────────

  const calculateXp = useCallback((reflectionText?: string) => {
    const baseXp = lesson.xpReward || 15;
    let xp = baseXp;

    // Flat bonus for submitting a reflection
    if (reflectionText && reflectionText.trim().length > 0) {
      xp += 5;
    }

    const streakBonus = Math.min(currentStreak * 0.02, 0.5);
    xp = Math.round(xp * (1 + streakBonus));

    if (!Number.isFinite(xp) || xp <= 0) {
      xp = Math.max(lesson.xpReward || 0, 15);
    }
    return xp;
  }, [lesson.xpReward, currentStreak]);

  // ─────────────────────────────────────────────────────────────────────────
  // Swipe Gesture Support (non-writing steps only)
  // ─────────────────────────────────────────────────────────────────────────

  const WRITING_STEP_TYPES = useMemo(() => new Set(['reflection']), []);

  const swipeTouchStart = useRef<{ x: number; y: number } | null>(null);

  const handleSwipeTouchStart = useCallback((e: React.TouchEvent) => {
    if (!currentStep) return;
    if (WRITING_STEP_TYPES.has(currentStep.type)) return;
    swipeTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, [currentStep, WRITING_STEP_TYPES]);

  const handleSwipeTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!swipeTouchStart.current || !currentStep) return;
    const dx = e.changedTouches[0].clientX - swipeTouchStart.current.x;
    const dy = e.changedTouches[0].clientY - swipeTouchStart.current.y;
    swipeTouchStart.current = null;

    if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 60) return;

    if (dx < 0) {
      goToNextStep();
    }
  }, [currentStep, goToNextStep]);

  // ─────────────────────────────────────────────────────────────────────────
  // Step Completion Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const handleScenarioComplete = useCallback(() => {
    goToNextStep();
  }, [goToNextStep]);

  const handleChoiceComplete = useCallback((option: ChoiceOption) => {
    if (option.storeAs) {
      setChoices(prev => ({ ...prev, [option.storeAs!]: option.id }));
    }
    goToStep(option.nextStepId);
  }, [goToStep]);

  const handleInsightComplete = useCallback(() => {
    goToNextStep();
  }, [goToNextStep]);

  const handleReflectionComplete = useCallback((text: string) => {
    setWritings(prev => ({ ...prev, reflection: text }));

    saveReflection({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      coreConceptTag: lesson.coreConceptTag,
      reflection: text,
      actionCompleted: false,
    });

    const xp = calculateXp(text);
    setXpEarned(xp);
    xpEarnedRef.current = xp;

    playSuccess();
    playComplete();
    goToNextStep();
  }, [lesson, saveReflection, calculateXp, playSuccess, playComplete, goToNextStep]);

  const handleResonanceComplete = useCallback((selections: string[]) => {
    const step = currentStep as ResonanceCheckStepType;
    if (step.storeAs) {
      setChoices(prev => ({ ...prev, [step.storeAs!]: selections.join(',') }));
    }
    goToNextStep();
  }, [currentStep, goToNextStep]);

  const handleScaleComplete = useCallback((value: number) => {
    const step = currentStep as ScaleRatingStepType;
    if (step.storeAs) {
      setChoices(prev => ({ ...prev, [step.storeAs!]: String(value) }));
    }
    goToNextStep();
  }, [currentStep, goToNextStep]);

  const handleAffirmationComplete = useCallback(() => {
    playChime();
    goToNextStep();
  }, [playChime, goToNextStep]);

  const handleTapFlowComplete = useCallback(() => {
    goToNextStep();
  }, [goToNextStep]);

  const handleRewardComplete = useCallback(() => {
    playReward();
    // Ensure XP is calculated before reward display
    if (xpEarnedRef.current === 0) {
      const xp = calculateXp(writings.reflection);
      setXpEarned(xp);
      xpEarnedRef.current = xp;
    }
    goToNextStep();
  }, [playReward, goToNextStep, calculateXp, writings.reflection]);

  const handleMentorComplete = useCallback(() => {
    backgroundMusic.stop();
    const finalXp = xpEarnedRef.current > 0 ? xpEarnedRef.current : calculateXp(writings.reflection);
    completeLesson(lesson.id, finalXp);
    clearInProgressLesson();
    playComplete();
    setTimeout(onComplete, 300);
  }, [completeLesson, lesson.id, clearInProgressLesson, playComplete, onComplete, calculateXp, writings.reflection]);

  const handleRetry = useCallback(() => {
    const reflectionStep = activeSteps.find(s => s.type === 'reflection');
    if (reflectionStep) {
      setWritings(prev => ({ ...prev, reflection: '' }));
      goToStep(reflectionStep.id);
    }
  }, [activeSteps, goToStep]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render Current Step
  // ─────────────────────────────────────────────────────────────────────────

  const renderStep = () => {
    if (!currentStep) return null;

    switch (currentStep.type) {
      case 'scenario':
        return (
          <ScenarioStep
            step={currentStep as ScenarioStepType}
            onComplete={handleScenarioComplete}
          />
        );

      case 'choice':
        return (
          <ChoiceStep
            step={currentStep as ChoiceStepType}
            onComplete={handleChoiceComplete}
          />
        );

      case 'insight':
        return (
          <InsightStep
            step={currentStep as InsightStepType}
            onComplete={handleInsightComplete}
          />
        );

      case 'reflection':
        return (
          <ReflectionStep
            lesson={{
              id: lesson.id,
              slug: lesson.slug,
              order: lesson.order,
              title: lesson.title,
              reflectionPrompt: (currentStep as ReflectionStepType).prompt,
              wisdomText: '',
              actionPrompt: '',
              actionType: 'reflect',
              actionDurationSeconds: 60,
              mentorResponses: [],
              xpReward: lesson.xpReward,
              coreConceptTag: lesson.coreConceptTag,
            }}
            onComplete={handleReflectionComplete}
            onKeystroke={handleKeystroke}
          />
        );

      case 'reward': {
        const rewardXp = xpEarnedRef.current > 0 ? xpEarnedRef.current : calculateXp(writings.reflection);
        return (
          <RewardStep
            xpEarned={rewardXp}
            lesson={{
              id: lesson.id,
              slug: lesson.slug,
              order: lesson.order,
              title: lesson.title,
              wisdomText: '',
              actionPrompt: '',
              actionType: 'reflect',
              actionDurationSeconds: 60,
              reflectionPrompt: '',
              mentorResponses: [],
              xpReward: lesson.xpReward,
              coreConceptTag: lesson.coreConceptTag,
            }}
            onComplete={handleRewardComplete}
          />
        );
      }

      case 'resonanceCheck':
        return (
          <ResonanceCheckStep
            step={currentStep as ResonanceCheckStepType}
            onComplete={handleResonanceComplete}
          />
        );

      case 'scaleRating':
        return (
          <ScaleRatingStep
            step={currentStep as ScaleRatingStepType}
            onComplete={handleScaleComplete}
          />
        );

      case 'affirmation':
        return (
          <AffirmationStep
            step={currentStep as AffirmationStepType}
            onComplete={handleAffirmationComplete}
          />
        );

      case 'tapFlow':
        return (
          <TapFlowStep
            step={currentStep as TapFlowStepType}
            onComplete={handleTapFlowComplete}
          />
        );

      case 'mentor': {
        const mentorStepData = currentStep as MentorStepType;
        let mentorResponses = mentorStepData.responses.default;

        // Check for branch-based responses
        if (mentorStepData.responses.byChoice) {
          for (const [_key, value] of Object.entries(choices)) {
            if (mentorStepData.responses.byChoice[value]) {
              mentorResponses = mentorStepData.responses.byChoice[value];
              break;
            }
          }
        }

        return (
          <MentorStep
            lesson={{
              id: lesson.id,
              slug: lesson.slug,
              order: lesson.order,
              title: lesson.title,
              wisdomText: '',
              actionPrompt: '',
              actionType: 'reflect',
              actionDurationSeconds: 60,
              reflectionPrompt: '',
              mentorResponses,
              xpReward: lesson.xpReward,
              coreConceptTag: lesson.coreConceptTag,
            }}
            reflection={writings.reflection || ''}
            onComplete={handleMentorComplete}
            onRetry={handleRetry}
          />
        );
      }

      default:
        return null;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className={`min-h-[100dvh] bg-stone-950 light:bg-stone-50 flex flex-col relative overflow-x-hidden ${isRTL ? 'rtl' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      onTouchStart={handleSwipeTouchStart}
      onTouchEnd={handleSwipeTouchEnd}
    >
      {/* Ambient background — vivid for reward, normal everywhere else */}
      <AmbientBackground
        intensity={currentStep?.type === 'reward' ? 'vivid' : 'normal'}
        particleCount={currentStep?.type === 'reward' ? 12 : 8}
        orbCount={currentStep?.type === 'reward' ? 2 : 1}
        themeOverride={lessonTheme}
      />

      {/* Step-specific atmospheric glow — bold, viewport-filling */}
      <motion.div
        key={`glow-${currentStep?.type}`}
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        style={{
          background: `radial-gradient(ellipse 100% 80% at 50% 30%, ${currentTheme.glow} 0%, transparent 55%)`,
        }}
      />

      {/* Segmented progress bar — each step is a segment */}
      <div className="fixed top-0 left-0 right-0 z-50 px-3 pt-[max(env(safe-area-inset-top),8px)]">
        <div className="flex gap-[3px]">
          {activeSteps.map((step, index) => {
            const currentIndex = activeSteps.findIndex(s => s.id === currentStepId);
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <motion.div
                key={step.id}
                className="h-[3px] flex-1 rounded-full overflow-hidden"
                style={{
                  backgroundColor: isLight ? 'rgba(214, 211, 209, 0.4)' : 'rgba(41, 37, 36, 0.6)',
                }}
              >
                {(isCompleted || isCurrent) && (
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: isCurrent ? '0%' : '100%' }}
                    animate={{ width: '100%' }}
                    transition={isCurrent ? {
                      duration: 0.8,
                      ease: EASE_OUT_EXPO,
                    } : { duration: 0 }}
                    style={{
                      background: isCompleted
                        ? `${lessonTheme.primary}66`
                        : `linear-gradient(90deg, ${lessonTheme.primary}, ${lessonTheme.primary}dd)`,
                      boxShadow: isCurrent ? `0 0 12px ${lessonTheme.glow}` : 'none',
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main content area — scrollable when content overflows, centered when short */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="min-h-full flex flex-col">
          <AnimatePresence mode="wait">
            {!isTransitioning && currentStep && (
              <motion.div
                key={currentStepId}
                initial={{
                  ...DEFAULT_TRANSITION.initial,
                  ...(STEP_TRANSITIONS[currentStep.type]?.initial || {}),
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                }}
                exit={{
                  ...DEFAULT_TRANSITION.exit,
                  ...(STEP_TRANSITIONS[currentStep.type]?.exit || {}),
                }}
                transition={{
                  duration: STEP_TRANSITIONS[currentStep.type]?.duration || DEFAULT_TRANSITION.duration,
                  ease: EASE_OUT_EXPO,
                }}
                className="w-full max-w-xl my-auto"
              >
                {renderStep()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Music controls - mute and change track */}
      <MusicControls />
    </div>
  );
}

export default FlexibleLessonExperience;
