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
import { MuteButton } from '@/components/ui/MuteButton';
import { useStore } from '@/store/useStore';
import { useAudio } from '@/hooks/useAudio';
import { useContextualAudio } from '@/hooks/useContextualAudio';
import { useTranslation } from '@/i18n';
import { getRandomLessonMusic } from '@/lib/audioEngine';

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

// Types
import type {
  FlexibleLesson,
  LessonStep,
  LessonProgress,
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
} from '@/types/lessons';

interface FlexibleLessonExperienceProps {
  lesson: FlexibleLesson;
  onComplete: () => void;
  onDismiss?: () => void; // Called when user leaves for GoDoIt action (no Echo prompt)
  // For resuming from a GoDoIt step
  resumeProgress?: LessonProgress;
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
};

export function FlexibleLessonExperience({
  lesson,
  onComplete,
  onDismiss,
  resumeProgress,
}: FlexibleLessonExperienceProps) {
  // ─────────────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────────────

  const [currentStepId, setCurrentStepId] = useState<string>(
    resumeProgress?.currentStepId || lesson.startStepId || lesson.steps[0]?.id || ''
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

  const xpEarnedRef = useRef(0);
  const hasInitializedRef = useRef(false);
  // Store ref to audio functions for stable cleanup
  const audioCleanupRef = useRef<{ stopMusic: (fadeOut?: number) => void } | null>(null);

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
  const { playComplete, playReward } = useAudio();

  // Use contextual audio for lessons - starts music immediately
  const contextualAudio = useContextualAudio({
    initialScene: 'silent',
    autoStartMusic: true,
  });
  
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
      default: return '';
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Derived State
  // ─────────────────────────────────────────────────────────────────────────

  const currentStep = lesson.steps.find(s => s.id === currentStepId);
  const currentTheme = currentStep ? STEP_THEMES[currentStep.type] : STEP_THEMES.scenario;


  // Calculate progress based on step position
  const getProgress = () => {
    const stepIndex = lesson.steps.findIndex(s => s.id === currentStepId);
    if (stepIndex === -1) return 0;
    return Math.round(((stepIndex + 1) / lesson.steps.length) * 100);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Audio Initialization - Start lesson music on mount with variety
  // ─────────────────────────────────────────────────────────────────────────
  
  // Select a random music track once per lesson (memoized)
  const selectedMusic = useMemo(() => getRandomLessonMusic(), []);

  const handleInitializeAudio = useCallback(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    // Start lesson music with variety - different track each lesson
    contextualAudio.startMusic(selectedMusic);
    contextualAudio.playStepTransition();
  }, [contextualAudio, selectedMusic]);

  // Store audio ref for stable cleanup
  useEffect(() => {
    audioCleanupRef.current = { stopMusic: contextualAudio.stopMusic };
  }, [contextualAudio.stopMusic]);

  // Initialize on mount
  useEffect(() => {
    handleInitializeAudio();
    // Cleanup: stop music when leaving the lesson
    // Use the ref for stable cleanup that won't have stale closures
    return () => {
      if (audioCleanupRef.current) {
        audioCleanupRef.current.stopMusic(0.5); // Quick fadeout on unmount
      }
    };
  }, [handleInitializeAudio]);

  // ─────────────────────────────────────────────────────────────────────────
  // Persist lesson progress for page refresh resilience
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Don't save if we're at the very first step with no progress
    // (avoid saving empty state on initial load)
    const hasProgress = currentStepId !== (lesson.startStepId || lesson.steps[0]?.id) ||
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
  }, [lesson.id, lesson.startStepId, lesson.steps, currentStepId, choices, writings, saveInProgressLesson]);

  // ─────────────────────────────────────────────────────────────────────────
  // Navigation Helpers
  // ─────────────────────────────────────────────────────────────────────────

  const goToStep = useCallback((stepId: string) => {
    // Validate the target step exists to prevent dead-ends
    const targetStep = lesson.steps.find(s => s.id === stepId);
    if (!targetStep) {
      console.error(`[FlexibleLessonExperience] Step "${stepId}" not found! Attempting fallback.`);
      // Fallback: try to find the next step by array index or complete the lesson
      const currentIndex = lesson.steps.findIndex(s => s.id === currentStepId);
      if (currentIndex >= 0 && currentIndex < lesson.steps.length - 1) {
        // Go to next step in array as fallback
        setIsTransitioning(true);
        contextualAudio.playStepTransition();
        setTimeout(() => {
          setCurrentStepId(lesson.steps[currentIndex + 1].id);
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
    contextualAudio.playStepTransition();
    setTimeout(() => {
      setCurrentStepId(stepId);
      setIsTransitioning(false);
    }, 500);
  }, [contextualAudio, currentStepId, lesson.steps, onComplete]);

  const goToNextStep = useCallback(() => {
    if (!currentStep) {
      console.error(`[FlexibleLessonExperience] No current step found for ID: ${currentStepId}`);
      // Attempt to find step by ID and continue from there
      const stepIndex = lesson.steps.findIndex(s => s.id === currentStepId);
      if (stepIndex >= 0 && stepIndex < lesson.steps.length - 1) {
        goToStep(lesson.steps[stepIndex + 1].id);
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
    const currentIndex = lesson.steps.findIndex(s => s.id === currentStepId);
    // Ensure valid index before navigating
    if (currentIndex >= 0 && currentIndex < lesson.steps.length - 1) {
      goToStep(lesson.steps[currentIndex + 1].id);
    } else if (currentIndex === lesson.steps.length - 1) {
      // At the last step with no explicit nextStepId - this is likely the mentor step
      // The mentor step should call handleMentorComplete, but if we get here somehow, complete
      console.warn(`[FlexibleLessonExperience] At last step "${currentStep.id}" with no nextStepId`);
    }
  }, [currentStep, currentStepId, lesson.steps, goToStep, onComplete]);

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
    contextualAudio.stopMusic(1);


    // Close the lesson (user goes to do their action)
    // Use onDismiss if provided - this skips the Echo prompt
    // Only use onComplete if this is the actual end of the lesson
    if (onDismiss) {
      onDismiss();
    } else {
      onComplete();
    }
  }, [lesson.id, currentStep, choices, writings, onComplete, onDismiss, savePendingLessonAction, contextualAudio]);

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
    contextualAudio.playStepTransition();
    goToNextStep();
  }, [contextualAudio, goToNextStep]);

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

    // Calculate XP
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

    contextualAudio.playStepComplete();
    contextualAudio.playLessonComplete();
    // Transition to reward music when ENTERING reward phase (not when leaving)
    contextualAudio.transitionTo('reward');
    goToNextStep();
  }, [
    lesson, actionCompleted, currentStreak, saveReflection,
    contextualAudio, goToNextStep
  ]);

  const handleRewardComplete = useCallback(() => {
    // Just play celebration sound and move to mentor
    // Music was already started when entering reward phase
    playReward();
    goToNextStep();
  }, [playReward, goToNextStep]);

  const handleMentorComplete = useCallback(() => {
    contextualAudio.stopMusic(1);
    completeLesson(lesson.id, xpEarnedRef.current);
    // Clear saved progress since lesson is complete
    clearInProgressLesson();
    playComplete();
    setTimeout(onComplete, 300);
  }, [contextualAudio, completeLesson, lesson.id, clearInProgressLesson, playComplete, onComplete]);

  const handleRetry = useCallback(() => {
    // Find the reflection step and go back to it
    const reflectionStep = lesson.steps.find(s => s.type === 'reflection');
    if (reflectionStep) {
      setWritings(prev => ({ ...prev, reflection: '' }));
      goToStep(reflectionStep.id);
    }
  }, [lesson.steps, goToStep]);

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

      case 'mentor':
        const mentorStepData = currentStep as MentorStepType;
        // Build mentor responses based on path taken
        let mentorResponses = mentorStepData.responses.default;

        // Check for branch-based responses
        if (mentorStepData.responses.byChoice) {
          for (const [key, value] of Object.entries(choices)) {
            if (mentorStepData.responses.byChoice[value]) {
              mentorResponses = mentorStepData.responses.byChoice[value];
              break;
            }
          }
        }

        // Check for completion-based responses
        if (mentorStepData.responses.byCompletion) {
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

      {/* Simple mute button */}
      <MuteButton />

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
