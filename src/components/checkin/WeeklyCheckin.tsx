'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, X, Sparkles, Zap, Heart } from 'lucide-react';
import { Button, Card, ProgressBar } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { useAudio } from '@/hooks/useAudio';
import { getWeeklyCheckinPrompts, getRandomCheckinMessage, type CheckinPrompt } from '@/content/weeklyCheckin';
import { getMentor } from '@/content/mentor';
import { useTranslation } from '@/i18n';

interface WeeklyCheckinProps {
  onComplete: () => void;
  onSkip: () => void;
}

type CheckinStage = 'intro' | 'prompt' | 'complete';

interface ResponseData {
  promptId: string;
  mainResponse: string;
  followUpResponse?: string;
}

export function WeeklyCheckin({ onComplete, onSkip }: WeeklyCheckinProps) {
  const { name, completeWeeklyCheckin, getWeekNumber, weeklyCheckins } = useStore();
  const { playComplete, playSuccess, playReward } = useAudio();
  const { t, isRTL, locale } = useTranslation();

  const [stage, setStage] = useState<CheckinStage>('intro');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [mainResponse, setMainResponse] = useState('');
  const [followUpResponse, setFollowUpResponse] = useState('');
  const [responses, setResponses] = useState<ResponseData[]>([]);

  // Get prompts once and memoize
  const prompts = useMemo(() => getWeeklyCheckinPrompts(locale), [locale]);
  const mentorMessage = useMemo(() => getRandomCheckinMessage(locale), [locale]);
  const mentor = useMemo(() => getMentor(locale), [locale]);

  const currentPrompt = prompts[currentPromptIndex];
  const progress = ((currentPromptIndex + 1) / prompts.length) * 100;
  const weekNumber = getWeekNumber();
  const xpReward = 50;

  const getCategoryIcon = (category: CheckinPrompt['category']) => {
    switch (category) {
      case 'progress': return '📈';
      case 'challenges': return '🧗';
      case 'insights': return '💡';
      case 'intentions': return '🎯';
      default: return '✨';
    }
  };

  const getCategoryLabel = (category: CheckinPrompt['category']) => {
    switch (category) {
      case 'progress': return t('checkin.categories.yourProgress');
      case 'challenges': return t('checkin.categories.challengesFaced');
      case 'insights': return t('checkin.categories.keyInsights');
      case 'intentions': return t('checkin.categories.lookingAhead');
      default: return t('checkin.categories.reflection');
    }
  };

  const handleStartCheckin = () => {
    setStage('prompt');
  };

  const handleMainResponseSubmit = () => {
    if (mainResponse.trim().length >= 10) {
      playSuccess();
      if (currentPrompt.followUp) {
        setShowFollowUp(true);
      } else {
        handleNextPrompt();
      }
    }
  };

  const handleFollowUpSubmit = () => {
    handleNextPrompt();
  };

  const handleNextPrompt = () => {
    playComplete();

    // Save response
    const newResponse: ResponseData = {
      promptId: currentPrompt.id,
      mainResponse: mainResponse.trim(),
      followUpResponse: followUpResponse.trim() || undefined,
    };
    const newResponses = [...responses, newResponse];
    setResponses(newResponses);

    if (currentPromptIndex < prompts.length - 1) {
      // Move to next prompt
      setCurrentPromptIndex(prev => prev + 1);
      setMainResponse('');
      setFollowUpResponse('');
      setShowFollowUp(false);
    } else {
      // Complete check-in
      playReward();
      completeWeeklyCheckin(newResponses);
      setStage('complete');
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className={`min-h-screen bg-zinc-950 flex flex-col ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`p-4 flex items-center justify-between border-b border-zinc-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={onSkip}
          className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-zinc-700 transition-colors"
        >
          <X size={20} className="text-zinc-400" />
        </button>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Calendar size={20} className="text-rose-400" />
          <span className="font-medium text-white">{t('checkin.title')}</span>
        </div>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Progress bar */}
      {stage === 'prompt' && (
        <div className="px-4 py-2">
          <ProgressBar progress={progress} size="sm" color="rose" />
          <p className="text-xs text-zinc-500 mt-1 text-center">
            {currentPromptIndex + 1} of {prompts.length}
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
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center"
              >
                <Heart size={40} className="text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-4">
                {t('checkin.weekCheckin').replace('{week}', weekNumber.toString())}
              </h2>

              <p className="text-zinc-400 mb-6">
                {t('checkin.introMessage')}
              </p>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-8">
                <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-zinc-400">{t('checkin.reflectionsCount').replace('{count}', prompts.length.toString())}</span>
                  <span className="text-zinc-400">{t('checkin.duration')}</span>
                  <span className={`flex items-center gap-1 text-amber-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Zap size={14} />
                    {xpReward} XP
                  </span>
                </div>
              </div>

              {weeklyCheckins.length > 0 && (
                <p className="text-sm text-zinc-500 mb-6">
                  {t('checkin.completedCount').replace('{count}', weeklyCheckins.length.toString())}
                </p>
              )}

              <Button size="lg" onClick={handleStartCheckin} className="w-full">
                {t('checkin.beginReflection')}
              </Button>
            </motion.div>
          )}

          {/* Prompt Stage */}
          {stage === 'prompt' && currentPrompt && (
            <motion.div
              key={`prompt-${currentPromptIndex}-${showFollowUp ? 'followup' : 'main'}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-lg"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">{getCategoryIcon(currentPrompt.category)}</span>
                <p className="text-sm font-medium text-rose-400">
                  {getCategoryLabel(currentPrompt.category)}
                </p>
              </div>

              {!showFollowUp ? (
                <>
                  <Card variant="glass" padding="lg" className="mb-6">
                    <p className="text-lg text-white leading-relaxed text-center">
                      {currentPrompt.prompt}
                    </p>
                  </Card>

                  <textarea
                    value={mainResponse}
                    onChange={(e) => setMainResponse(e.target.value)}
                    placeholder={t('checkin.takeYourTime')}
                    className={`w-full h-40 p-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors resize-none mb-4 ${isRTL ? 'text-right' : ''}`}
                    autoFocus
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />

                  <Button
                    size="lg"
                    onClick={handleMainResponseSubmit}
                    disabled={mainResponse.trim().length < 10}
                    className="w-full"
                  >
                    <ChevronRight size={20} className={isRTL ? 'ml-2 rotate-180' : 'mr-2'} />
                    {currentPrompt.followUp ? t('common.continue') : (currentPromptIndex < prompts.length - 1 ? t('common.next') : t('common.complete'))}
                  </Button>
                </>
              ) : (
                <>
                  <div className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-4 ${isRTL ? 'text-right' : ''}`}>
                    <p className="text-sm text-zinc-400 mb-2">{t('checkin.yourReflection')}:</p>
                    <p className="text-zinc-300 italic">&ldquo;{mainResponse}&rdquo;</p>
                  </div>

                  <Card variant="glass" padding="lg" className="mb-6">
                    <p className="text-lg text-white leading-relaxed text-center">
                      {currentPrompt.followUp}
                    </p>
                  </Card>

                  <textarea
                    value={followUpResponse}
                    onChange={(e) => setFollowUpResponse(e.target.value)}
                    placeholder={t('checkin.digDeeper')}
                    className={`w-full h-32 p-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors resize-none mb-4 ${isRTL ? 'text-right' : ''}`}
                    autoFocus
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />

                  <Button
                    size="lg"
                    onClick={handleFollowUpSubmit}
                    disabled={followUpResponse.trim().length < 5}
                    className="w-full"
                  >
                    {currentPromptIndex < prompts.length - 1 ? t('checkin.nextReflection') : t('checkin.completeCheckin')}
                  </Button>
                </>
              )}
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
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center"
              >
                <Sparkles size={48} className="text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {t('checkin.checkinComplete')}
              </h2>

              <p className="text-zinc-400 mb-6">
                {t('checkin.completeMessage').replace('{week}', weekNumber.toString())}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8"
              >
                <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Zap size={24} className="text-amber-400" />
                  <span className="text-2xl font-bold text-amber-400">+{xpReward} XP</span>
                </div>
              </motion.div>

              {/* Mentor message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <p className="text-sm text-rose-400 mb-2">{mentor.name}</p>
                <p className="text-zinc-300 italic">
                  &ldquo;{name ? `${name}, ` : ''}{mentorMessage}&rdquo;
                </p>
              </motion.div>

              <Button size="lg" onClick={handleComplete} className="w-full">
                {t('common.continue')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default WeeklyCheckin;
