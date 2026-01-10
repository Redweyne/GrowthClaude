'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, X, Sparkles, Zap } from 'lucide-react';
import { Button, Card, ProgressBar } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { useSound } from '@/hooks/useSound';
import { getPracticeScenarios } from '@/content/practiceScenarios';
import { MENTOR, getRandomMentorResponse, MENTOR_RESPONSES } from '@/content/mentor';

interface PracticeModeProps {
  onComplete: () => void;
  onExit: () => void;
}

type PracticeStage = 'intro' | 'scenario' | 'response' | 'reflection' | 'complete';

export function PracticeMode({ onComplete, onExit }: PracticeModeProps) {
  const { completedLessons, completeLesson } = useStore();
  const { playComplete, playSuccess, playReward } = useSound();

  const [stage, setStage] = useState<PracticeStage>('intro');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [reflection, setReflection] = useState('');
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  // Get practice scenarios based on completed lessons
  const scenarios = useMemo(() => {
    const completedIds = Object.keys(completedLessons).filter(id => completedLessons[id]);
    return getPracticeScenarios(completedIds, 3);
  }, [completedLessons]);

  const currentScenario = scenarios[currentScenarioIndex];
  const progress = ((currentScenarioIndex + 1) / scenarios.length) * 100;

  const handleStartPractice = () => {
    if (scenarios.length === 0) {
      // No completed lessons yet
      onExit();
      return;
    }
    setStage('scenario');
  };

  const handleResponseSubmit = () => {
    if (response.trim().length >= 10) {
      playSuccess();
      setStage('reflection');
    }
  };

  const handleReflectionSubmit = () => {
    playComplete();
    const xp = currentScenario.xpReward;
    setTotalXpEarned(prev => prev + xp);

    if (currentScenarioIndex < scenarios.length - 1) {
      // Move to next scenario
      setCurrentScenarioIndex(prev => prev + 1);
      setResponse('');
      setReflection('');
      setStage('scenario');
    } else {
      // Practice complete
      playReward();
      setStage('complete');
    }
  };

  const handlePracticeComplete = () => {
    // Award XP through store
    if (totalXpEarned > 0) {
      // Use a dummy lesson ID for practice XP
      completeLesson(`practice-${Date.now()}`, totalXpEarned);
    }
    onComplete();
  };

  if (scenarios.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <Card variant="elevated" padding="lg" className="max-w-md text-center">
          <Brain size={48} className="mx-auto text-zinc-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Practice Available</h2>
          <p className="text-zinc-400 mb-6">
            Complete some lessons first, then return here to practice and reinforce what you&apos;ve learned.
          </p>
          <Button onClick={onExit}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-800">
        <button
          onClick={onExit}
          className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-zinc-700 transition-colors"
        >
          <X size={20} className="text-zinc-400" />
        </button>
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-indigo-400" />
          <span className="font-medium text-white">Practice Mode</span>
        </div>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Progress bar */}
      {stage !== 'intro' && stage !== 'complete' && (
        <div className="px-4 py-2">
          <ProgressBar progress={progress} size="sm" color="indigo" />
          <p className="text-xs text-zinc-500 mt-1 text-center">
            {currentScenarioIndex + 1} of {scenarios.length}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* Intro Stage */}
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center"
              >
                <Brain size={40} className="text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-4">
                Practice Session
              </h2>

              <p className="text-zinc-400 mb-6">
                Apply what you&apos;ve learned to real-world scenarios. This strengthens your understanding and builds lasting wisdom.
              </p>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">{scenarios.length} scenarios</span>
                  <span className="text-zinc-400">~{scenarios.length * 2} min</span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Zap size={14} />
                    {scenarios.reduce((sum, s) => sum + s.xpReward, 0)} XP
                  </span>
                </div>
              </div>

              <Button size="lg" onClick={handleStartPractice} className="w-full">
                Begin Practice
              </Button>
            </motion.div>
          )}

          {/* Scenario Stage */}
          {stage === 'scenario' && currentScenario && (
            <motion.div
              key={`scenario-${currentScenarioIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-lg"
            >
              <p className="text-sm font-medium text-indigo-400 mb-4 text-center">
                Scenario
              </p>

              <Card variant="glass" padding="lg" className="mb-6">
                <p className="text-white leading-relaxed">
                  {currentScenario.scenario}
                </p>
              </Card>

              <p className="text-lg text-white font-medium mb-4 text-center">
                {currentScenario.question}
              </p>

              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write your response..."
                className="w-full h-32 p-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none mb-4"
              />

              <Button
                size="lg"
                onClick={handleResponseSubmit}
                disabled={response.trim().length < 10}
                className="w-full"
              >
                <ChevronRight size={20} className="mr-2" />
                Continue
              </Button>
            </motion.div>
          )}

          {/* Reflection Stage */}
          {stage === 'reflection' && currentScenario && (
            <motion.div
              key={`reflection-${currentScenarioIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-lg"
            >
              <p className="text-sm font-medium text-indigo-400 mb-4 text-center">
                Reflection
              </p>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-zinc-400 mb-2">Your response:</p>
                <p className="text-zinc-300 italic">&ldquo;{response}&rdquo;</p>
              </div>

              <p className="text-lg text-white font-medium mb-4 text-center">
                {currentScenario.reflectionPrompt}
              </p>

              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Reflect on this..."
                className="w-full h-32 p-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none mb-4"
              />

              <Button
                size="lg"
                onClick={handleReflectionSubmit}
                disabled={reflection.trim().length < 10}
                className="w-full"
              >
                {currentScenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Complete Practice'}
              </Button>
            </motion.div>
          )}

          {/* Complete Stage */}
          {stage === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"
              >
                <Sparkles size={48} className="text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Practice Complete!
              </h2>

              <p className="text-zinc-400 mb-6">
                You&apos;ve strengthened your understanding through application. This is how wisdom becomes instinct.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8"
              >
                <div className="flex items-center justify-center gap-2">
                  <Zap size={24} className="text-amber-400" />
                  <span className="text-2xl font-bold text-amber-400">+{totalXpEarned} XP</span>
                </div>
              </motion.div>

              {/* Mentor message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-8 text-left"
              >
                <p className="text-sm text-indigo-400 mb-2">{MENTOR.name}</p>
                <p className="text-zinc-300 italic">
                  &ldquo;{getRandomMentorResponse(MENTOR_RESPONSES.practiceSession)}&rdquo;
                </p>
              </motion.div>

              <Button size="lg" onClick={handlePracticeComplete} className="w-full">
                Continue
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PracticeMode;
