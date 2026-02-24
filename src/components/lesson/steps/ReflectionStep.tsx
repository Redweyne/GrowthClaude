'use client';

// ═══════════════════════════════════════════════════════════════════════════
// REFLECTION STEP - "The Sanctuary"
// ═══════════════════════════════════════════════════════════════════════════
//
// The sacred space where transformation crystallizes.
// Warm amber atmosphere (not clinical cyan). Journal-feel serif typography.
// Glass-warm textarea that invites depth. Organic fill bar for progress.
//
// NOTE: Music is now managed centrally by FlexibleLessonExperience.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Feather, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui';
import { useEchoesStore } from '@/store/useEchoesStore';
import { useAudio } from '@/hooks/useAudio';
import { useTypingAmbience } from '@/hooks/useTypingAmbience';
import { useTranslation } from '@/i18n';
import type { Lesson } from '@/types';

interface ReflectionStepProps {
  lesson: Lesson;
  onComplete: (reflection: string) => void;
  onKeystroke?: () => void;
}

// Adaptive prompts based on inactivity and content
const ENCOURAGEMENT_PROMPTS = [
  "What's present for you right now?",
  "There's no rush. Let the thoughts come.",
  "Write as if no one will ever read this.",
  "What would honesty look like here?",
  "Go deeper. What's underneath that?",
];

const DEPTH_PROMPTS = [
  "Why does this matter to you?",
  "When have you felt this before?",
  "What would change if you truly believed this?",
  "What are you avoiding saying?",
  "What would your wisest self write here?",
];

// Word count milestones with encouragement
const MILESTONES = [
  { words: 15, message: "You're finding your voice..." },
  { words: 30, message: "Keep going. This is where the gold is." },
  { words: 50, message: "Beautiful. You're going deep." },
];

// Springs
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
};

// Get deterministic prompt index based on reflection content
function getPromptIndex(text: string, arrayLength: number): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % arrayLength;
}

export function ReflectionStep({ lesson, onComplete, onKeystroke }: ReflectionStepProps) {
  const [reflection, setReflection] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [milestone, setMilestone] = useState<string | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [phase, setPhase] = useState<'entering' | 'writing' | 'complete'>('entering');
  const [isPublic, setIsPublic] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastKeystrokeRef = useRef<number>(0);
  const promptShownRef = useRef<Set<number>>(new Set());

  const { t, isRTL } = useTranslation();

  const { playSuccess, playChime } = useAudio();
  const { handleKeystroke } = useTypingAmbience({ playKeystrokeSounds: false });

  const { publishReflection, genderIdentity } = useEchoesStore();

  useEffect(() => {
    lastKeystrokeRef.current = Date.now();
  }, []);

  // Word count
  const wordCount = reflection.trim().split(/\s+/).filter(Boolean).length;

  // Calculate readiness
  const isSubstantial = wordCount >= 5;
  const isReady = wordCount >= 15;

  // Timer for idle prompts
  useEffect(() => {
    if (phase !== 'writing') return;
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Entering phase timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('writing');
      setTimeout(() => textareaRef.current?.focus(), 100);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Show encouragement prompts based on inactivity
  useEffect(() => {
    if (phase !== 'writing') return;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    if (reflection.length > 0 && wordCount < 50) {
      const timeSinceKeystroke = Date.now() - lastKeystrokeRef.current;
      if (timeSinceKeystroke > 8000 && !showPrompt) {
        const prompts = reflection.length < 50 ? ENCOURAGEMENT_PROMPTS : DEPTH_PROMPTS;
        const unused = prompts.filter((_, i) => !promptShownRef.current.has(i));
        if (unused.length > 0) {
          const selectedUnusedIndex = getPromptIndex(reflection + secondsElapsed, unused.length);
          const index = prompts.indexOf(unused[selectedUnusedIndex]);
          promptShownRef.current.add(index);
          setCurrentPrompt(prompts[index]);
          setShowPrompt(true);
          timerId = setTimeout(() => setShowPrompt(false), 6000);
        }
      }
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [secondsElapsed, phase, reflection, wordCount, showPrompt]);

  // Track milestones with audio feedback
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    const reachedMilestone = MILESTONES.find(m => wordCount >= m.words && wordCount < m.words + 10);
    if (reachedMilestone && milestone !== reachedMilestone.message) {
      setMilestone(reachedMilestone.message);
      playChime();
      timerId = setTimeout(() => setMilestone(null), 3000);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [wordCount, milestone, playChime]);

  // Handle text change with typing sounds
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReflection(e.target.value);
    lastKeystrokeRef.current = Date.now();
    setShowPrompt(false);
    onKeystroke?.();
    handleKeystroke();
  }, [onKeystroke, handleKeystroke]);

  // Handle submit with completion sound
  const handleSubmit = useCallback(() => {
    if (!isSubstantial) return;
    setPhase('complete');
    playSuccess();

    if (isPublic && genderIdentity) {
      publishReflection(
        lesson.id,
        lesson.title,
        reflection.trim(),
        true
      );
    }

    setTimeout(() => {
      onComplete(reflection.trim());
    }, 800);
  }, [isSubstantial, reflection, onComplete, isPublic, genderIdentity, publishReflection, lesson.id, lesson.title, playSuccess]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isSubstantial) {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubstantial, handleSubmit]);

  return (
    <div className={`min-h-[75vh] flex flex-col ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <AnimatePresence mode="wait">
        {/* ─────────────────────────────────────────────────────────────────
            Entering Phase — Warm Transition
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'entering' && (
          <motion.div
            key="entering"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-4"
          >
            {/* Quill icon with warm glow */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, ...springs.gentle }}
              className="relative w-24 h-24 mb-8"
            >
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-500/15 to-stone-900 border border-amber-500/30 flex items-center justify-center">
                <Feather size={36} className="text-amber-400" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-stone-300 light:text-stone-700 font-light"
            >
              {t('lessons.reflection.nowReflect')}
            </motion.p>

            {/* Progress bar — warm gradient */}
            <motion.div
              className="w-32 h-1 bg-stone-800 light:bg-stone-200 rounded-full mx-auto mt-8 overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.2, ease: 'linear' }}
                style={{
                  boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)',
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            Writing Phase — The Sanctuary
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'writing' && (
          <motion.div
            key="writing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col px-4 py-4"
          >
            {/* The prompt — sacred question */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <p className="text-sm font-medium text-amber-400 mb-4 tracking-[0.2em] uppercase">
                {t('lessons.reflection.yourReflection')}
              </p>
              <p className="font-serif text-xl sm:text-2xl text-stone-100 light:text-stone-900 leading-relaxed max-w-lg mx-auto">
                {lesson.reflectionPrompt}
              </p>
            </motion.div>

            {/* The writing space — warm glass sanctuary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 relative"
            >
              {/* Container with glass-warm feel */}
              <div
                className={`
                  h-full min-h-[180px] relative rounded-2xl transition-all duration-300
                  border-2 backdrop-blur-xl
                  ${isFocused
                    ? 'bg-stone-900/60 light:bg-stone-200/60 border-amber-500/30'
                    : 'bg-stone-900/40 light:bg-stone-200/40 border-white/10 light:border-stone-300/50'}
                `}
              >
                {/* Textarea — serif for journal feel */}
                <textarea
                  ref={textareaRef}
                  value={reflection}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={t('lessons.reflection.beginWriting')}
                  data-testid="reflection-input"
                  className={`
                    w-full h-full min-h-[180px] p-5
                    bg-transparent text-lg text-stone-200 light:text-stone-800
                    placeholder-stone-600 leading-relaxed
                    focus:outline-none resize-none
                    font-serif tracking-wide
                    ${isRTL ? 'text-right' : ''}
                  `}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  style={{ caretColor: '#fbbf24' }}
                />

                {/* Encouragement prompt overlay */}
                <AnimatePresence>
                  {showPrompt && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-20 left-6 right-6"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <span className="text-amber-300/80 text-sm italic">
                          {currentPrompt}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Organic fill bar + readiness indicator */}
                <div className={`absolute bottom-4 left-6 right-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {/* Organic fill bar — replaces clinical dots */}
                  <div className="flex-1">
                    <div className="h-1 bg-stone-800 light:bg-stone-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                        animate={{ width: `${Math.min((wordCount / 50) * 100, 100)}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        style={{
                          boxShadow: wordCount >= 15 ? '0 0 8px rgba(251, 191, 36, 0.4)' : 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Readiness indicator */}
                  <motion.span
                    className={`text-sm shrink-0 transition-colors duration-300 ${
                      isReady
                        ? 'text-emerald-400'
                        : isSubstantial
                        ? 'text-amber-400/70'
                        : 'text-stone-600 light:text-stone-500'
                    }`}
                    animate={{
                      opacity: reflection.length > 0 ? 1 : 0,
                    }}
                  >
                    {isReady ? t('lessons.reflection.readyToContinue') : isSubstantial ? t('lessons.reflection.aBitMoreDepth') : t('lessons.reflection.keepWriting')}
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Milestone toast */}
            <AnimatePresence>
              {milestone && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="fixed bottom-36 left-1/2 transform -translate-x-1/2 z-50"
                >
                  <div
                    className="px-5 py-3 rounded-full bg-amber-500/20 border border-amber-500/30"
                    style={{
                      boxShadow: '0 0 30px rgba(251, 191, 36, 0.2)',
                    }}
                  >
                    <span className="text-amber-300 text-sm">{milestone}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 space-y-4"
            >
              {/* Continue button — first, so it's closest to thumb zone */}
              <Button
                variant="glass"
                size="lg"
                onClick={handleSubmit}
                disabled={!isSubstantial}
                glow={isSubstantial}
                className="w-full group"
                data-testid="reflection-submit-btn"
              >
                {isReady ? (
                  <>
                    {t('lessons.reflection.completeReflection')}
                    <ChevronRight
                      size={18}
                      className={`${isRTL ? 'mr-2 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} opacity-60 group-hover:opacity-100 transition-all`}
                    />
                  </>
                ) : isSubstantial ? (
                  t('lessons.reflection.continueOrWriteMore')
                ) : (
                  t('lessons.reflection.keepWriting')
                )}
              </Button>

              {/* Keyboard hint */}
              <div className="h-5 text-center">
                <AnimatePresence>
                  {isSubstantial && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-stone-600 light:text-stone-500"
                    >
                      {t('lessons.reflection.pressToSubmit')}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Privacy toggle — below submit for less cognitive load */}
              {genderIdentity && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center gap-4 p-3 rounded-xl bg-stone-900/40 light:bg-stone-200/40 backdrop-blur-xl border border-white/10 light:border-stone-300/50"
                >
                  {/* Private option */}
                  <button
                    onClick={() => setIsPublic(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isRTL ? 'flex-row-reverse' : ''} ${
                      !isPublic
                        ? 'bg-stone-800 light:bg-stone-200 text-stone-200 light:text-stone-800 shadow-lg'
                        : 'text-stone-500 light:text-stone-600 hover:text-stone-400 light:hover:text-stone-700'
                    }`}
                  >
                    <Lock size={16} />
                    <span className="text-sm font-medium">{t('lessons.reflection.private')}</span>
                  </button>

                  {/* Public option */}
                  <button
                    onClick={() => setIsPublic(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isRTL ? 'flex-row-reverse' : ''} ${
                      isPublic
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10'
                        : 'text-stone-500 light:text-stone-600 hover:text-stone-400 light:hover:text-stone-700'
                    }`}
                  >
                    <Globe size={16} />
                    <span className="text-sm font-medium">{t('lessons.reflection.shareAnonymously')}</span>
                  </button>
                </motion.div>
              )}

              {/* Privacy description */}
              <div className="text-center">
                <p className="text-xs text-stone-600 light:text-stone-500">
                  {isPublic
                    ? t('lessons.reflection.publicDesc')
                    : t('lessons.reflection.privateDesc')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            Complete Phase — Brief Acknowledgment
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...springs.gentle }}
                className="relative w-20 h-20 mx-auto mb-6"
              >
                {/* Warm glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Icon */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 flex items-center justify-center">
                  <span className="text-4xl">✨</span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-stone-400 light:text-stone-600 text-lg"
              >
                {t('lessons.reflection.reflectionComplete')}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ReflectionStep;
