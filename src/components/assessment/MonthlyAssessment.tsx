'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Target, Eye, Brain, TrendingUp, Sparkles, Check } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { useSound } from '@/hooks/useSound';
import { getAssessmentQuestions, getFinalReflectionPrompt, getDimensionColor } from '@/content/monthlyAssessment';
import { useTranslation } from '@/i18n';

interface MonthlyAssessmentProps {
  onComplete: () => void;
  onSkip: () => void;
}

// Icon component mapping
const DimensionIcon = ({ dimension, size = 24 }: { dimension: string; size?: number }) => {
  const icons: Record<string, React.ReactNode> = {
    emotionalMastery: <Heart size={size} />,
    discipline: <Target size={size} />,
    perspective: <Eye size={size} />,
    selfAwareness: <Brain size={size} />,
    growth: <TrendingUp size={size} />,
  };
  return <>{icons[dimension] || <Sparkles size={size} />}</>;
};

export function MonthlyAssessment({ onComplete, onSkip }: MonthlyAssessmentProps) {
  const { name, saveMonthlyAssessment } = useStore();
  const { playTap, playSparkle, playCelebration } = useSound();
  const { t, locale } = useTranslation();

  const assessmentQuestions = useMemo(() => getAssessmentQuestions(locale), [locale]);
  const reflectionPrompt = useMemo(() => getFinalReflectionPrompt(locale), [locale]);

  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    emotionalMastery: 5,
    discipline: 5,
    perspective: 5,
    selfAwareness: 5,
    growth: 5,
  });
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = assessmentQuestions.length + 2; // Questions + reflection + summary
  const currentQuestion = assessmentQuestions[currentStep];
  const isReflectionStep = currentStep === assessmentQuestions.length;
  const isSummaryStep = currentStep === assessmentQuestions.length + 1;

  const handleScoreChange = (value: number) => {
    if (currentQuestion) {
      playTap();
      setScores(prev => ({
        ...prev,
        [currentQuestion.dimension]: value,
      }));
    }
  };

  const handleNext = () => {
    playSparkle();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    playTap();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    playCelebration();

    // Save assessment to store
    saveMonthlyAssessment({
      scores: {
        emotionalMastery: scores.emotionalMastery,
        discipline: scores.discipline,
        perspective: scores.perspective,
        selfAwareness: scores.selfAwareness,
        growth: scores.growth,
      },
      reflection,
    });

    // Small delay for celebration effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    onComplete();
  };

  const getAverageScore = () => {
    const values = Object.values(scores);
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 6) return 'text-amber-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return t('checkin.monthly.scoreLabels.exceptional');
    if (score >= 7) return t('checkin.monthly.scoreLabels.strong');
    if (score >= 5) return t('checkin.monthly.scoreLabels.developing');
    if (score >= 3) return t('checkin.monthly.scoreLabels.needsWork');
    return t('checkin.monthly.scoreLabels.justStarting');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-zinc-800">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="pt-8 px-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={currentStep === 0 ? onSkip : handleBack}
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <ChevronLeft size={20} />
            {currentStep === 0 ? t('checkin.monthly.skip') : t('common.back')}
          </button>
          <span className="text-zinc-500 text-sm">
            {t('checkin.monthly.progress', { current: currentStep + 1, total: totalSteps })}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* Question Steps */}
          {currentQuestion && !isReflectionStep && !isSummaryStep && (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              {/* Dimension Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${getDimensionColor(currentQuestion.dimension)}20` }}
              >
                <div style={{ color: getDimensionColor(currentQuestion.dimension) }}>
                  <DimensionIcon dimension={currentQuestion.dimension} size={40} />
                </div>
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                {currentQuestion.title}
              </h2>

              {/* Question */}
              <p className="text-lg text-zinc-300 text-center mb-4">
                {currentQuestion.question}
              </p>

              {/* Description */}
              <p className="text-sm text-zinc-500 text-center mb-8">
                {currentQuestion.description}
              </p>

              {/* Score Slider */}
              <Card variant="glass" padding="lg" className="mb-6">
                {/* Current Score Display */}
                <div className="text-center mb-6">
                  <motion.span
                    key={scores[currentQuestion.dimension]}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-5xl font-bold ${getScoreColor(scores[currentQuestion.dimension])}`}
                  >
                    {scores[currentQuestion.dimension]}
                  </motion.span>
                  <p className="text-zinc-500 mt-1">
                    {getScoreLabel(scores[currentQuestion.dimension])}
                  </p>
                </div>

                {/* Score Buttons */}
                <div className="grid grid-cols-10 gap-1 mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                    <button
                      key={value}
                      onClick={() => handleScoreChange(value)}
                      className={`
                        h-12 rounded-lg font-medium transition-all duration-200
                        ${scores[currentQuestion.dimension] === value
                          ? 'text-white scale-110 shadow-lg'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }
                      `}
                      style={{
                        backgroundColor: scores[currentQuestion.dimension] === value
                          ? getDimensionColor(currentQuestion.dimension)
                          : undefined,
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>

                {/* Labels */}
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{currentQuestion.lowLabel}</span>
                  <span>{currentQuestion.highLabel}</span>
                </div>
              </Card>

              {/* Stoic Quote */}
              <p className="text-sm text-zinc-600 text-center italic mb-8">
                {currentQuestion.stoicContext}
              </p>

              {/* Continue Button */}
              <Button size="lg" onClick={handleNext} className="w-full">
                {t('common.continue')}
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Reflection Step */}
          {isReflectionStep && (
            <motion.div
              key="reflection"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center"
              >
                <Sparkles size={40} className="text-purple-400" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white text-center mb-2">
                {reflectionPrompt.title}
              </h2>

              <p className="text-lg text-zinc-300 text-center mb-8">
                {reflectionPrompt.prompt}
              </p>

              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder={reflectionPrompt.placeholder}
                className="w-full h-40 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none mb-6"
              />

              <Button
                size="lg"
                onClick={handleNext}
                disabled={reflection.trim().length < 20}
                className="w-full"
              >
                {t('checkin.monthly.viewResults')}
                <ChevronRight size={18} className="ml-2" />
              </Button>

              {reflection.trim().length < 20 && (
                <p className="text-xs text-zinc-600 text-center mt-2">
                  {t('checkin.monthly.minReflectionChars', { count: 20 })}
                </p>
              )}
            </motion.div>
          )}

          {/* Summary Step */}
          {isSummaryStep && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center"
                >
                  <span className={`text-4xl font-bold ${getScoreColor(getAverageScore())}`}>
                    {getAverageScore()}
                  </span>
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {t('checkin.monthly.scoreTitle')}
                </h2>
                <p className="text-zinc-400">
                  {name
                    ? t('checkin.monthly.snapshotWithName', { name })
                    : t('checkin.monthly.snapshot')}
                </p>
              </div>

              {/* Score Breakdown */}
              <Card variant="glass" padding="md" className="mb-6">
                <div className="space-y-4">
                  {assessmentQuestions.map((q, index) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${getDimensionColor(q.dimension)}20` }}
                        >
                          <div style={{ color: getDimensionColor(q.dimension) }}>
                            <DimensionIcon dimension={q.dimension} size={20} />
                          </div>
                        </div>
                        <span className="text-white">{q.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${scores[q.dimension] * 10}%` }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: getDimensionColor(q.dimension) }}
                          />
                        </div>
                        <span className={`font-bold w-6 text-right ${getScoreColor(scores[q.dimension])}`}>
                          {scores[q.dimension]}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* XP Earned */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-2 mb-8 text-amber-400"
              >
                <Sparkles size={20} />
                <span className="font-medium">{t('checkin.monthly.xpEarned', { xp: 100 })}</span>
              </motion.div>

              {/* Submit Button */}
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    {t('checkin.monthly.saving')}
                  </>
                ) : (
                  <>
                    <Check size={18} className="mr-2" />
                    {t('checkin.monthly.submit')}
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MonthlyAssessment;
