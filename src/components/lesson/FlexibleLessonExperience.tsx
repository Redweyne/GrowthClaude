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
// - Action-based (dismiss and return)
//
// The atmosphere adapts to each step type automatically.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AmbientBackground } from '@/components/ambient';
import { MusicControls } from '@/components/ui/MusicControls';
import { backgroundMusic } from '@/lib/backgroundMusic';
import { useStore } from '@/store/useStore';
import { useAudio } from '@/hooks/useAudio';
import { useTranslation } from '@/i18n';

// Step components
import { ScenarioStep } from './steps/ScenarioStep';
import { ChoiceStep } from './steps/ChoiceStep';
import { CommitmentStep } from './steps/CommitmentStep';
import { GoDoItStep } from './steps/GoDoItStep';
import { ReturnConfirmStep } from './steps/ReturnConfirmStep';
import { InsightStep } from './steps/InsightStep';
import { VisualizationStep } from './steps/VisualizationStep';
import { TimerStep } from './steps/TimerStep';
import { ReflectionStep } from './steps/ReflectionStep';
import { MentorStep } from './steps/MentorStep';
import { RewardStep } from './steps/RewardStep';
// Engagement path step components
import { ResonanceCheckStep } from './steps/ResonanceCheckStep';
import { ScaleRatingStep } from './steps/ScaleRatingStep';
import { AffirmationStep } from './steps/AffirmationStep';
import { TapFlowStep } from './steps/TapFlowStep';

// Types
import type {
  FlexibleLesson,
  LessonStep,
  LessonProgress,
  LessonMode,
  ChoiceOption,
  ScenarioStep as ScenarioStepType,
  ChoiceStep as ChoiceStepType,
  CommitmentStep as CommitmentStepType,
  GoDoItStep as GoDoItStepType,
  ReturnConfirmStep as ReturnConfirmStepType,
  InsightStep as InsightStepType,
  VisualizationStep as VisualizationStepType,
  TimerStep as TimerStepType,
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
  onDismiss?: () => void; // Called when user leaves for GoDoIt action (no Echo prompt)
  // For resuming from a GoDoIt step
  resumeProgress?: LessonProgress;
  // Lesson mode: 'deep' (writing) or 'engagement' (no writing)
  mode?: LessonMode;
}

// Step type to theme mapping (glow only, labels are translated)
const STEP_THEMES: Record<string, {
  glow: string;
}> = {
  scenario: { glow: 'rgba(244, 63, 94, 0.12)' },
  choice: { glow: 'rgba(251, 191, 36, 0.12)' },
  commitment: { glow: 'rgba(16, 185, 129, 0.12)' },
  goDoIt: { glow: 'rgba(168, 85, 247, 0.15)' },
  returnConfirm: { glow: 'rgba(251, 191, 36, 0.12)' },
  insight: { glow: 'rgba(167, 139, 250, 0.12)' },
  visualization: { glow: 'rgba(99, 102, 241, 0.12)' },
  reflection: { glow: 'rgba(34, 211, 238, 0.10)' },
  timer: { glow: 'rgba(251, 191, 36, 0.12)' },
  mentor: { glow: 'rgba(168, 85, 247, 0.12)' },
  reward: { glow: 'rgba(251, 191, 36, 0.20)' },
  // Engagement path step types
  resonanceCheck: { glow: 'rgba(99, 102, 241, 0.12)' },
  scaleRating: { glow: 'rgba(251, 191, 36, 0.10)' },
  affirmation: { glow: 'rgba(16, 185, 129, 0.15)' },
  tapFlow: { glow: 'rgba(99, 102, 241, 0.12)' },
};

export function FlexibleLessonExperience({
  lesson,
  onComplete,
  onDismiss,
  resumeProgress,
  mode = 'deep',
}: FlexibleLessonExperienceProps) {
  // Select step array based on mode
  const activeSteps = mode === 'engagement' && lesson.engagementSteps && lesson.engagementSteps.length > 0
    ? lesson.engagementSteps
    : lesson.steps;
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
  const [actionCompleted, setActionCompleted] = useState(
    resumeProgress?.actionCompleted || false
  );
  const [xpEarned, setXpEarned] = useState(0);
  // Track if user is retrying after low-quality reflection feedback
  const [isRetryingReflection, setIsRetryingReflection] = useState(false);

  const xpEarnedRef = useRef(0);
  const hasInitializedRef = useRef(false);

  // ─────────────────────────────────────────────────────────────────────────
  // Store & Audio
  // ─────────────────────────────────────────────────────────────────────────

  const {
    completeLesson,
    currentStreak,
    saveReflection,
    savePendingLessonAction,
    clearPendingLessonAction,
    saveInProgressLesson,
    clearInProgressLesson,
  } = useStore();
  const { playComplete, playReward, playChime, playSuccess } = useAudio();

  // No-op keystroke handler - silence during typing is more calming
  const handleKeystroke = useCallback(() => {
    // Intentionally silent
  }, []);
  
  const { t, isRTL } = useTranslation();

  // Get translated step labels
  const getStepLabel = (stepType: string): string => {
    switch (stepType) {
      case 'scenario': return t('lessons.steps.theSituation');
      case 'choice': return t('lessons.steps.yourChoice');
      case 'commitment': return t('lessons.steps.yourCommitment');
      case 'goDoIt': return t('lessons.steps.takeAction');
      case 'returnConfirm': return t('lessons.steps.welcomeBack');
      case 'insight': return t('lessons.steps.insight');
      case 'visualization': return t('lessons.steps.innerVision');
      case 'reflection': return t('lessons.steps.reflection');
      case 'timer': return t('lessons.steps.practice');
      case 'mentor': return t('lessons.steps.sageWisdom');
      case 'reward': return t('lessons.steps.celebration');
      // Engagement path step labels
      case 'resonanceCheck': return t('lessons.steps.yourChoice');
      case 'scaleRating': return t('lessons.steps.yourChoice');
      case 'affirmation': return t('lessons.steps.yourCommitment');
      case 'tapFlow': return t('lessons.steps.innerVision');
      default: return '';
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Derived State
  // ─────────────────────────────────────────────────────────────────────────

  const currentStep = activeSteps.find(s => s.id === currentStepId);
  const currentTheme = currentStep ? STEP_THEMES[currentStep.type] : STEP_THEMES.scenario;


  // Calculate progress based on step position
  const getProgress = () => {
    const stepIndex = activeSteps.findIndex(s => s.id === currentStepId);
    if (stepIndex === -1) return 0;
    return Math.round(((stepIndex + 1) / activeSteps.length) * 100);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Audio Initialization - Start lesson music on mount
  // ─────────────────────────────────────────────────────────────────────────

  const handleInitializeAudio = useCallback(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    // Start background music using new system
    backgroundMusic.start();
    playChime(); // Play step transition sound
  }, [playChime]);

  // Initialize on mount
  useEffect(() => {
    handleInitializeAudio();
    // Cleanup: stop music when leaving the lesson
    return () => {
      backgroundMusic.stop();
    };
  }, [handleInitializeAudio]);

  // ─────────────────────────────────────────────────────────────────────────
  // Persist lesson progress for page refresh resilience
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Don't save if we're at the very first step with no progress
    // (avoid saving empty state on initial load)
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
        mode,
      });
    }
  }, [lesson.id, lesson.startStepId, activeSteps, currentStepId, choices, writings, mode, saveInProgressLesson]);

  // ─────────────────────────────────────────────────────────────────────────
  // Navigation Helpers
  // ─────────────────────────────────────────────────────────────────────────

  const goToStep = useCallback((stepId: string) => {
    // Validate the target step exists to prevent dead-ends
    const targetStep = activeSteps.find(s => s.id === stepId);
    if (!targetStep) {
      console.error(`[FlexibleLessonExperience] Step "${stepId}" not found! Attempting fallback.`);
      // Fallback: try to find the next step by array index or complete the lesson
      const currentIndex = activeSteps.findIndex(s => s.id === currentStepId);
      if (currentIndex >= 0 && currentIndex < activeSteps.length - 1) {
        // Go to next step in array as fallback
        setIsTransitioning(true);
        playChime(); // Step transition sound
        setTimeout(() => {
          setCurrentStepId(activeSteps[currentIndex + 1].id);
          setIsTransitioning(false);
        }, 500);
      } else {
        // At the end or can't navigate - force lesson complete
        console.error(`[FlexibleLessonExperience] Cannot navigate, forcing lesson complete.`);
        onComplete();
      }
      return;
    }

    setIsTransitioning(true);
    playChime(); // Step transition sound
    setTimeout(() => {
      setCurrentStepId(stepId);
      setIsTransitioning(false);
    }, 500);
  }, [playChime, currentStepId, activeSteps, onComplete]);

  const goToNextStep = useCallback(() => {
    if (!currentStep) {
      console.error(`[FlexibleLessonExperience] No current step found for ID: ${currentStepId}`);
      // Attempt to find step by ID and continue from there
      const stepIndex = activeSteps.findIndex(s => s.id === currentStepId);
      if (stepIndex >= 0 && stepIndex < activeSteps.length - 1) {
        goToStep(activeSteps[stepIndex + 1].id);
      } else {
        // Force complete if stuck
        onComplete();
      }
      return;
    }

    // Check for explicit next step
    if (currentStep.nextStepId) {
      goToStep(currentStep.nextStepId);
      return;
    }

    // Default: go to next step in array
    const currentIndex = activeSteps.findIndex(s => s.id === currentStepId);
    // Ensure valid index before navigating
    if (currentIndex >= 0 && currentIndex < activeSteps.length - 1) {
      goToStep(activeSteps[currentIndex + 1].id);
    } else if (currentIndex === activeSteps.length - 1) {
      // At the last step with no explicit nextStepId - this is likely the mentor step
      // The mentor step should call handleMentorComplete, but if we get here somehow, complete
      console.warn(`[FlexibleLessonExperience] At last step "${currentStep.id}" with no nextStepId`);
    }
  }, [currentStep, currentStepId, activeSteps, goToStep, onComplete]);

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

  const handleCommitmentComplete = useCallback((commitment: string) => {
    const step = currentStep as CommitmentStepType;
    if (step.storeAs) {
      setWritings(prev => ({ ...prev, [step.storeAs!]: commitment }));
    }
    // Always store as 'commitment' for GoDoIt steps to access
    setWritings(prev => ({ ...prev, commitment }));
    goToNextStep();
  }, [currentStep, goToNextStep]);

  const handleGoDoItDismiss = useCallback(() => {
    // Store progress for when user returns (using Zustand store for persistence)
    savePendingLessonAction({
      lessonId: lesson.id,
      currentStepId: (currentStep as GoDoItStepType).returnStepId,
      choices,
      writings,
      dismissedAt: new Date().toISOString(),
    });

    // Stop any active music before leaving the lesson
    backgroundMusic.stop();


    // Close the lesson (user goes to do their action)
    // Use onDismiss if provided - this skips the Echo prompt
    // Only use onComplete if this is the actual end of the lesson
    if (onDismiss) {
      onDismiss();
    } else {
      onComplete();
    }
  }, [lesson.id, currentStep, choices, writings, onComplete, onDismiss, savePendingLessonAction]);

  const handleReturnConfirmComplete = useCallback((completed: boolean) => {
    setActionCompleted(completed);
    // Clear saved progress from store
    clearPendingLessonAction();

    // CRITICAL: ReturnConfirmStep has different nextStepId for each option
    // We must use the specific nextStepId based on the user's choice
    const returnStep = currentStep as ReturnConfirmStepType;
    if (completed && returnStep.completedOption?.nextStepId) {
      goToStep(returnStep.completedOption.nextStepId);
    } else if (!completed && returnStep.didNotCompleteOption?.nextStepId) {
      goToStep(returnStep.didNotCompleteOption.nextStepId);
    } else {
      // Fallback to generic navigation
      goToNextStep();
    }
  }, [currentStep, goToStep, goToNextStep, clearPendingLessonAction]);

  const handleInsightComplete = useCallback(() => {
    goToNextStep();
  }, [goToNextStep]);

  const handleVisualizationComplete = useCallback(() => {
    goToNextStep();
  }, [goToNextStep]);

  const handleTimerComplete = useCallback(() => {
    playChime(); // Step transition sound
    goToNextStep();
  }, [playChime, goToNextStep]);

  const handleReflectionComplete = useCallback((text: string) => {
    setWritings(prev => ({ ...prev, reflection: text }));

    // Save reflection to store
    saveReflection({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      coreConceptTag: lesson.coreConceptTag,
      reflection: text,
      actionCompleted,
    });

    // Calculate XP (always calculate to get correct value based on reflection quality)
    const baseXp = lesson.xpReward || 15;
    let xp = baseXp;

    if (actionCompleted) xp += 5;

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 25) xp += 5;
    if (wordCount > 50) xp += 5;
    if (wordCount > 100) xp += 10;

    const streakBonus = Math.min(currentStreak * 0.02, 0.5);
    xp = Math.round(xp * (1 + streakBonus));

    if (!Number.isFinite(xp) || xp <= 0) {
      xp = Math.max(lesson.xpReward || 0, 15);
    }

    setXpEarned(xp);
    xpEarnedRef.current = xp;

    // If retrying after low-quality feedback, skip reward phase and go directly to mentor
    // The user already saw the celebration on their first attempt
    if (isRetryingReflection) {
      const mentorStep = activeSteps.find(s => s.type === 'mentor');
      if (mentorStep) {
        playSuccess(); // Step complete sound
        goToStep(mentorStep.id);
        return;
      }
    }

    // First attempt: show full celebration
    playSuccess(); // Step complete sound
    playComplete(); // Lesson complete sound
    goToNextStep();
  }, [
    lesson, actionCompleted, currentStreak, saveReflection,
    playSuccess, playComplete, goToNextStep, isRetryingReflection, goToStep, activeSteps
  ]);

  // Engagement-mode XP calculation (no writing bonuses)
  const calculateEngagementXp = useCallback(() => {
    const baseXp = lesson.xpReward || 15;
    let xp = baseXp;
    const streakBonus = Math.min(currentStreak * 0.02, 0.5);
    xp = Math.round(xp * (1 + streakBonus));
    if (!Number.isFinite(xp) || xp <= 0) {
      xp = Math.max(lesson.xpReward || 0, 15);
    }
    return xp;
  }, [lesson.xpReward, currentStreak]);

  // Handlers for engagement step types
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
    // Just play celebration sound and move to mentor
    // Music was already started when entering reward phase
    playReward();
    // In engagement mode, ensure XP is calculated before reward display
    if (mode === 'engagement' && xpEarnedRef.current === 0) {
      const xp = calculateEngagementXp();
      setXpEarned(xp);
      xpEarnedRef.current = xp;
    }
    goToNextStep();
  }, [playReward, goToNextStep, mode, calculateEngagementXp]);

  const handleMentorComplete = useCallback(() => {
    backgroundMusic.stop();
    // For engagement mode, XP may not have been set by reflection handler
    // Calculate it now if needed
    const finalXp = xpEarnedRef.current > 0 ? xpEarnedRef.current : calculateEngagementXp();
    completeLesson(lesson.id, finalXp);
    // Clear saved progress since lesson is complete
    clearInProgressLesson();
    playComplete();
    setTimeout(onComplete, 300);
  }, [completeLesson, lesson.id, clearInProgressLesson, playComplete, onComplete, calculateEngagementXp]);

  const handleRetry = useCallback(() => {
    // Find the reflection step and go back to it
    const reflectionStep = activeSteps.find(s => s.type === 'reflection');
    if (reflectionStep) {
      setWritings(prev => ({ ...prev, reflection: '' }));
      // Mark as retrying so we skip the reward phase on the second attempt
      setIsRetryingReflection(true);
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

      case 'commitment':
        return (
          <CommitmentStep
            step={currentStep as CommitmentStepType}
            onComplete={handleCommitmentComplete}
            onKeystroke={handleKeystroke}
          />
        );

      case 'goDoIt':
        return (
          <GoDoItStep
            step={currentStep as GoDoItStepType}
            commitment={writings.commitment}
            onDismiss={handleGoDoItDismiss}
          />
        );

      case 'returnConfirm':
        return (
          <ReturnConfirmStep
            step={currentStep as ReturnConfirmStepType}
            commitment={writings.commitment}
            onComplete={handleReturnConfirmComplete}
          />
        );

      case 'insight':
        return (
          <InsightStep
            step={currentStep as InsightStepType}
            onComplete={handleInsightComplete}
          />
        );

      case 'visualization':
        return (
          <VisualizationStep
            step={currentStep as VisualizationStepType}
            onComplete={handleVisualizationComplete}
          />
        );

      case 'timer':
        return (
          <TimerStep
            step={currentStep as TimerStepType}
            onComplete={handleTimerComplete}
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

      case 'reward':
        // In engagement mode, ensure XP is calculated before reward display
        if (mode === 'engagement' && xpEarnedRef.current === 0) {
          const engXp = calculateEngagementXp();
          xpEarnedRef.current = engXp;
          // Use a timeout-free state set since we're in render
          if (xpEarned === 0) {
            // We need to use the calculated value directly
            return (
              <RewardStep
                xpEarned={engXp}
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
        }
        return (
          <RewardStep
            xpEarned={xpEarned}
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

      case 'mentor':
        const mentorStepData = currentStep as MentorStepType;
        // Build mentor responses based on path taken
        let mentorResponses = mentorStepData.responses.default;

        // Check for engagement mode-specific responses first
        if (mode === 'engagement' && mentorStepData.responses.byMode?.engagement) {
          mentorResponses = mentorStepData.responses.byMode.engagement;
        }
        // Check for branch-based responses
        else if (mentorStepData.responses.byChoice) {
          for (const [key, value] of Object.entries(choices)) {
            if (mentorStepData.responses.byChoice[value]) {
              mentorResponses = mentorStepData.responses.byChoice[value];
              break;
            }
          }
        }

        // Check for completion-based responses (only in deep mode)
        if (mode === 'deep' && mentorStepData.responses.byCompletion) {
          mentorResponses = actionCompleted
            ? mentorStepData.responses.byCompletion.completed
            : mentorStepData.responses.byCompletion.notCompleted;
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

      default:
        return null;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className={`min-h-screen bg-stone-950 flex flex-col relative overflow-hidden ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Ambient background */}
      <AmbientBackground
        intensity="subtle"
        particleCount={currentStep?.type === 'reward' ? 8 : 4}
        orbCount={1}
      />

      {/* Step-specific atmospheric glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${currentTheme.glow} 0%, transparent 60%)`,
        }}
      />

      {/* Progress indicator */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-stone-900/80 backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ boxShadow: `0 0 20px ${currentTheme.glow}` }}
          />
        </div>

        {/* Step label */}
        <motion.div
          className="absolute top-4 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span
            key={currentStep?.type}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs tracking-[0.2em] uppercase text-stone-500 font-medium"
          >
            {currentStep ? getStepLabel(currentStep.type) : getStepLabel('scenario')}
          </motion.span>
        </motion.div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-12">
        <AnimatePresence mode="wait">
          {!isTransitioning && currentStep && (
            <motion.div
              key={currentStepId}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-xl"
            >
              {renderStep()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Music controls - mute and change track */}
      <MusicControls />

      {/* Bottom gradient fade */}
      <div
        className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(12, 10, 9, 0.9), transparent)',
        }}
      />
    </div>
  );
}

export default FlexibleLessonExperience;
