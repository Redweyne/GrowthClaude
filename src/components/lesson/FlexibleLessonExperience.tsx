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

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AmbientBackground } from '@/components/ambient';
import { useStore } from '@/store/useStore';
import { useSound } from '@/hooks/useSound';
import { useLessonAmbience } from '@/hooks/useLessonAmbience';

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
  // For resuming from a GoDoIt step
  resumeProgress?: LessonProgress;
}

// Step type to theme mapping
const STEP_THEMES: Record<string, {
  glow: string;
  label: string;
}> = {
  scenario: { glow: 'rgba(244, 63, 94, 0.12)', label: 'The Situation' },
  choice: { glow: 'rgba(251, 191, 36, 0.12)', label: 'Your Choice' },
  commitment: { glow: 'rgba(16, 185, 129, 0.12)', label: 'Your Commitment' },
  goDoIt: { glow: 'rgba(168, 85, 247, 0.15)', label: 'Take Action' },
  returnConfirm: { glow: 'rgba(251, 191, 36, 0.12)', label: 'Welcome Back' },
  insight: { glow: 'rgba(167, 139, 250, 0.12)', label: 'Insight' },
  visualization: { glow: 'rgba(99, 102, 241, 0.12)', label: 'Inner Vision' },
  reflection: { glow: 'rgba(34, 211, 238, 0.10)', label: 'Reflection' },
  timer: { glow: 'rgba(251, 191, 36, 0.12)', label: 'Practice' },
  mentor: { glow: 'rgba(168, 85, 247, 0.12)', label: 'Sage Wisdom' },
  reward: { glow: 'rgba(251, 191, 36, 0.20)', label: 'Celebration' },
};

export function FlexibleLessonExperience({
  lesson,
  onComplete,
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

  // ─────────────────────────────────────────────────────────────────────────
  // Store & Audio
  // ─────────────────────────────────────────────────────────────────────────

  const {
    completeLesson,
    currentStreak,
    saveReflection,
    savePendingLessonAction,
    clearPendingLessonAction,
  } = useStore();
  const { playComplete, playReward, initAudio } = useSound();
  const {
    transitionTo,
    stopAmbience,
    playBell,
    playKeystroke,
    playCompletionChime,
    initAudio: initAmbienceAudio,
  } = useLessonAmbience();

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
  // Audio Initialization
  // ─────────────────────────────────────────────────────────────────────────

  const handleInitializeAudio = useCallback(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    initAudio();
    initAmbienceAudio();
    playBell('deep');
  }, [initAudio, initAmbienceAudio, playBell]);

  // Initialize on mount (no cleanup - step components manage their own audio)
  useEffect(() => {
    handleInitializeAudio();
    // NO cleanup here - child step components handle their own audio lifecycle
  }, [handleInitializeAudio]);

  // ─────────────────────────────────────────────────────────────────────────
  // Navigation Helpers
  // ─────────────────────────────────────────────────────────────────────────

  const goToStep = useCallback((stepId: string) => {
    setIsTransitioning(true);
    playBell('soft');
    setTimeout(() => {
      setCurrentStepId(stepId);
      setIsTransitioning(false);
    }, 500);
  }, [playBell]);

  const goToNextStep = useCallback(() => {
    if (!currentStep) return;

    // Check for explicit next step
    if (currentStep.nextStepId) {
      goToStep(currentStep.nextStepId);
      return;
    }

    // Default: go to next step in array
    const currentIndex = lesson.steps.findIndex(s => s.id === currentStepId);
    if (currentIndex < lesson.steps.length - 1) {
      goToStep(lesson.steps[currentIndex + 1].id);
    }
  }, [currentStep, currentStepId, lesson.steps, goToStep]);

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

    // Close the lesson (user goes to do their action)
    onComplete();
  }, [lesson.id, currentStep, choices, writings, onComplete, savePendingLessonAction]);

  const handleReturnConfirmComplete = useCallback((completed: boolean) => {
    setActionCompleted(completed);
    // Clear saved progress from store
    clearPendingLessonAction();
    goToNextStep();
  }, [goToNextStep, clearPendingLessonAction]);

  const handleInsightComplete = useCallback(() => {
    goToNextStep();
  }, [goToNextStep]);

  const handleVisualizationComplete = useCallback(() => {
    goToNextStep();
  }, [goToNextStep]);

  const handleTimerComplete = useCallback(() => {
    playBell('soft');
    goToNextStep();
  }, [playBell, goToNextStep]);

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

    playBell('bright');
    playCompletionChime();
    goToNextStep();
  }, [
    lesson, actionCompleted, currentStreak, saveReflection,
    playBell, playCompletionChime, goToNextStep
  ]);

  const handleRewardComplete = useCallback(() => {
    transitionTo('completion');
    playReward();
    goToNextStep();
  }, [transitionTo, playReward, goToNextStep]);

  const handleMentorComplete = useCallback(() => {
    stopAmbience();
    completeLesson(lesson.id, xpEarnedRef.current);
    playComplete();
    setTimeout(onComplete, 300);
  }, [stopAmbience, completeLesson, lesson.id, playComplete, onComplete]);

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
            onKeystroke={playKeystroke}
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
            onKeystroke={playKeystroke}
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
    <div className="min-h-screen bg-stone-950 flex flex-col relative overflow-hidden">
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
            {currentTheme.label}
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
