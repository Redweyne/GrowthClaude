'use client';

// ═══════════════════════════════════════════════════════════════════════════
// MANDATORY ECHO FLOW
// ═══════════════════════════════════════════════════════════════════════════
//
// This is NOT optional. Every user MUST respond to at least one reflection
// before they can access their exercises. This ensures:
// 1. Every reflection gets at least one echo
// 2. Users connect with the community
// 3. The "teach to learn" philosophy is enforced
//
// NO SKIP BUTTON. NO EXCEPTIONS.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Feather, Heart, Users } from 'lucide-react';
import { Button, WisdomText } from '@/components/ui';
import { Card } from '@/components/ui/Card';
import { AmbientBackground } from '@/components/ambient';
import { useEchoesStore } from '@/store/useEchoesStore';
import { useHaptics } from '@/hooks/useHaptics';
import { useTranslation } from '@/i18n';
import { getGenderLabel } from '@/types/echoes';
import type { PublicReflection } from '@/types/echoes';

interface MandatoryEchoFlowProps {
  reflection: PublicReflection;
  onComplete: (reflectionId: string) => void;
  todaysLessonTitle: string;
  skipIntroPhase?: boolean; // Skip intro if coaching modal was shown
}

export function MandatoryEchoFlow({
  reflection,
  onComplete,
  todaysLessonTitle,
  skipIntroPhase = false,
}: MandatoryEchoFlowProps) {
  const [response, setResponse] = useState('');
  const [isOpenToConnect, setIsOpenToConnect] = useState(false);
  // Skip intro phase if coaching modal was already shown (prevents double popup)
  const [phase, setPhase] = useState<'intro' | 'reading' | 'writing' | 'sending' | 'complete'>(
    skipIntroPhase ? 'reading' : 'intro'
  );
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { sendEchoResponse, markReflectionResponded, genderIdentity, setGenderIdentity } = useEchoesStore();
  const { hapticLight, hapticMedium, hapticSuccess } = useHaptics();
  const { t } = useTranslation();

  // Ensure gender identity is set (fallback to 'traveler' if not set during onboarding)
  useEffect(() => {
    if (!genderIdentity) {
      setGenderIdentity('traveler');
    }
  }, [genderIdentity, setGenderIdentity]);

  // Word count
  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
  const isSubstantial = wordCount >= 10;

  // Determine if this is a seed reflection (can't connect)
  const isSeedReflection = reflection.id.startsWith('seed-');

  // Get pronoun info
  const genderLabel = getGenderLabel(reflection.authorGender).toLowerCase();

  // Transition to reading phase
  const handleContinue = () => {
    hapticLight();
    setPhase('reading');
  };

  // Transition to writing phase
  const handleStartWriting = () => {
    hapticMedium();
    setPhase('writing');
    setTimeout(() => textareaRef.current?.focus(), 300);
  };

  // Handle sending the response
  const handleSend = useCallback(() => {
    if (!isSubstantial || !genderIdentity) return;

    setPhase('sending');

    // Send the echo response
    sendEchoResponse(reflection, response.trim(), isOpenToConnect);
    markReflectionResponded(reflection.id);

    // Brief pause, then show completion phase (user will click button to proceed)
    setTimeout(() => {
      setPhase('complete');
      hapticSuccess();
    }, 800);
  }, [isSubstantial, genderIdentity, sendEchoResponse, reflection, response, isOpenToConnect, markReflectionResponded, hapticSuccess]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isSubstantial) {
        e.preventDefault();
        handleSend();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubstantial, handleSend]);

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col relative overflow-hidden">
      {/* Ambient background */}
      <AmbientBackground intensity="subtle" particleCount={6} orbCount={2} />

      {/* Warm glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(251, 191, 36, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Header - NO SKIP BUTTON */}
      <div className="relative z-10 p-4 flex justify-between items-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs tracking-[0.2em] uppercase text-stone-500 font-medium"
        >
          {t('echoes.mandatory.phaseLabel')}
        </motion.span>

        {/* Phase indicator instead of skip */}
        <div className="flex items-center gap-2 text-amber-500">
          <Users size={16} />
          <span className="text-xs font-medium">{t('echoes.mandatory.communityConnection')}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {/* ─────────────────────────────────────────────────────────────────
                Intro Phase - Explain the importance
            ───────────────────────────────────────────────────────────────── */}
            {phase === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto mb-6 flex items-center justify-center"
                  >
                    <Heart size={32} className="text-amber-400" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-semibold text-stone-100 mb-3"
                  >
                    {t('echoes.mandatory.connectBeforePractice')}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-stone-400 mb-6"
                  >
                    {t('echoes.mandatory.encourageTraveler')}
                  </motion.p>
                </div>

                <Card variant="glass" padding="md">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <span className="text-lg">💡</span>
                    </div>
                    <div>
                      <p className="text-stone-300 text-sm">
                        <strong className="text-amber-400">{t('echoes.mandatory.whyMatters')}</strong> {t('echoes.mandatory.whyMattersDesc')}
                      </p>
                    </div>
                  </div>
                </Card>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={handleContinue}
                    size="lg"
                    glow
                    className="w-full group"
                  >
                    {t('echoes.mandatory.readReflection')}
                    <ChevronRight size={18} className="ml-2 opacity-60 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                Reading Phase - Absorbing Their Words
            ───────────────────────────────────────────────────────────────── */}
            {phase === 'reading' && (
              <motion.div
                key="reading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="text-center">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-amber-400 text-sm mb-2"
                  >
                    A fellow {genderLabel} reflected on &ldquo;{reflection.lessonTitle}&rdquo;:
                  </motion.p>
                </div>

                {/* Their reflection - breathable typography */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800"
                >
                  <div className="text-5xl text-amber-400/20 font-serif leading-none mb-3">
                    &ldquo;
                  </div>
                  <WisdomText
                    variant="insight"
                    animate={true}
                    staggerDelay={1.5}
                    maxWordsPerStanza={5}
                    initialDelay={0.6}
                  >
                    {reflection.content}
                  </WisdomText>
                  <div className="text-5xl text-amber-400/20 font-serif leading-none text-right mt-3">
                    &rdquo;
                  </div>
                </motion.div>

                {/* Prompt */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-stone-400 text-sm"
                >
                  {t('echoes.mandatory.absorbWords')}
                </motion.p>

                {/* Continue button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    onClick={handleStartWriting}
                    size="lg"
                    glow
                    className="w-full group"
                  >
                    <Feather size={18} className="mr-2" />
                    {t('echoes.mandatory.writeYourEcho')}
                    <ChevronRight size={18} className="ml-2 opacity-60 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                Writing Phase - Your Response
            ───────────────────────────────────────────────────────────────── */}
            {phase === 'writing' && (
              <motion.div
                key="writing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Their reflection (smaller) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl bg-stone-900/50 border border-stone-800/50"
                >
                  <p className="text-stone-500 text-sm mb-2">
                    A fellow {genderLabel} wrote:
                  </p>
                  <p className="text-stone-400 text-sm leading-relaxed line-clamp-3">
                    &ldquo;{reflection.content}&rdquo;
                  </p>
                </motion.div>

                {/* Writing prompt */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <p className="text-amber-400 text-sm mb-2 tracking-wide">
                    {t('echoes.mandatory.yourEchoFor', { pronoun: reflection.authorGender === 'brother' ? t('echoes.pronounHim') : reflection.authorGender === 'sister' ? t('echoes.pronounHer') : t('echoes.pronounThem') })}
                  </p>
                  <p className="text-stone-300">
                    {t('echoes.mandatory.shareInsight')}
                  </p>
                </motion.div>

                {/* Writing area */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div
                    className={`
                      relative rounded-2xl transition-all duration-300 border-2
                      ${isFocused
                        ? 'bg-stone-900/80 border-amber-500/30'
                        : 'bg-stone-900/50 border-stone-700/50'}
                    `}
                  >
                    <textarea
                      ref={textareaRef}
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder={t('echoes.mandatory.writeThoughts')}
                      className="
                        w-full min-h-[160px] p-5
                        bg-transparent text-lg text-stone-200
                        placeholder-stone-600 leading-relaxed
                        focus:outline-none resize-none
                        font-light tracking-wide
                      "
                      style={{ caretColor: '#fbbf24' }}
                    />

                    {/* Word count */}
                    <div className="absolute bottom-4 left-5 right-5 flex justify-between items-center">
                      <span className="text-stone-500 text-sm">
                        {wordCount} {wordCount === 1 ? t('common.word') : t('common.words')}
                      </span>
                      <span className={`text-sm ${isSubstantial ? 'text-emerald-400' : 'text-stone-600'}`}>
                        {isSubstantial ? t('echoes.mandatory.readyToSend') : t('echoes.mandatory.moreWords', { count: 10 - wordCount })}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Open to connect checkbox (only if not a seed reflection) */}
                {!isSeedReflection && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center"
                  >
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`
                          w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                          ${isOpenToConnect
                            ? 'bg-amber-500 border-amber-500'
                            : 'border-stone-600 group-hover:border-stone-500'}
                        `}
                        onClick={() => {
                          hapticLight();
                          setIsOpenToConnect(!isOpenToConnect);
                        }}
                      >
                        {isOpenToConnect && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 text-stone-950"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </motion.svg>
                        )}
                      </div>
                      <span className="text-stone-400 text-sm">
                        {t('echoes.mandatory.openToConnect')}
                      </span>
                    </label>
                  </motion.div>
                )}

                {/* Send button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <Button
                    onClick={handleSend}
                    size="lg"
                    disabled={!isSubstantial}
                    glow={isSubstantial}
                    className="w-full group"
                  >
                    <Heart size={18} className="mr-2" />
                    {t('echoes.mandatory.sendAndUnlock')}
                    <ChevronRight size={18} className="ml-2 opacity-60 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {isSubstantial && (
                    <p className="text-center text-xs text-stone-600">
                      {t('echoes.mandatory.cmdEnterToSend')}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                Sending Phase - Brief Animation
            ───────────────────────────────────────────────────────────────── */}
            {phase === 'sending' && (
              <motion.div
                key="sending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-6"
                >
                  <Heart size={28} className="text-amber-400" />
                </motion.div>
                <p className="text-stone-400">{t('echoes.mandatory.sendingEcho')}</p>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                Complete Phase - Confirmation & Transition to Exercises
            ───────────────────────────────────────────────────────────────── */}
            {phase === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative w-20 h-20 mb-6"
                >
                  {/* Glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(52, 211, 153, 0.4) 0%, transparent 70%)',
                    }}
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <div className="relative w-full h-full rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-4xl">✨</span>
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-semibold text-stone-200 mb-2"
                >
                  {t('echoes.mandatory.echoSent')}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-stone-400 mb-6"
                >
                  {t('echoes.mandatory.wordsWillBrighten')}
                </motion.p>

                {/* Proceed button - always visible so user can proceed */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => onComplete(reflection.id)}
                    size="lg"
                    glow
                    className="group"
                  >
                    {t('echoes.mandatory.continueToExercises')}
                    <ChevronRight size={18} className="ml-2 opacity-60 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MandatoryEchoFlow;
