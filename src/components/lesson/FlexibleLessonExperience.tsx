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

import { useRef, useState, useCallback, useEffect } from 'react';
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
  LessonStep,
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

// Step type to theme mapping (glow only, labels are translated)
const STEP_THEMES: Record<string, {
  glow: string;
}> = {
  scenario: { glow: 'rgba(244, 63, 94, 0.12)' },
  choice: { glow: 'rgba(251, 191, 36, 0.12)' },
  insight: { glow: 'rgba(167, 139, 250, 0.12)' },
  reflection: { glow: 'rgba(34, 211, 238, 0.10)' },
  mentor: { glow: 'rgba(168, 85, 247, 0.12)' },
  reward: { glow: 'rgba(251, 191, 36, 0.20)' },
  resonanceCheck: { glow: 'rgba(99, 102, 241, 0.12)' },
  scaleRating: { glow: 'rgba(251, 191, 36, 0.10)' },
  affirmation: { glow: 'rgba(16, 185, 129, 0.15)' },
  tapFlow: { glow: 'rgba(99, 102, 241, 0.12)' },
};

export function FlexibleLessonExperience({
  lesson,
  onComplete,
  resumeProgress,
}: FlexibleLessonExperienceProps) {
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

  const { t, isRTL } = useTranslation();

  // Get translated step labels
  const getStepLabel = (stepType: string): string => {
    switch (stepType) {
      case 'scenario': return t('lessons.steps.theSituation');
      case 'choice': return t('lessons.steps.yourChoice');
      case 'insight': return t('lessons.steps.insight');
      case 'reflection': return t('lessons.steps.reflection');
      case 'mentor': return t('lessons.steps.sageWisdom');
      case 'reward': return t('lessons.steps.celebration');
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
