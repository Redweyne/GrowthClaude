'use client';

// ═══════════════════════════════════════════════════════════════════════════
// REFLECTION STEP - THE SANCTUARY
// ═══════════════════════════════════════════════════════════════════════════
//
// This is the sacred space where transformation crystallizes.
// Not a form to fill out. A place to meet yourself in writing.
// The atmosphere should feel safe, intimate, infinite.
//
// Visual principles:
// - Sanctuary-like calm with subtle ambient glow
// - Writing space that invites depth
// - Progress that encourages without pressuring
// - Atmospheric responses to your journey
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Feather } from 'lucide-react';
import { Button } from '@/components/ui';
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

export function ReflectionStep({ lesson, onComplete, onKeystroke }: ReflectionStepProps) {
  const [reflection, setReflection] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [milestone, setMilestone] = useState<string | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [phase, setPhase] = useState<'entering' | 'writing' | 'complete'>('entering');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastKeystrokeRef = useRef<number>(Date.now());
  const promptShownRef = useRef<Set<number>>(new Set());

  // Word count
  const wordCount = reflection.trim().split(/\s+/).filter(Boolean).length;

  // Calculate readiness
  const isSubstantial = wordCount >= 5;
  const isReady = wordCount >= 15;

  // Timer for idle prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
    if (reflection.length > 0 && wordCount < 50) {
      const timeSinceKeystroke = Date.now() - lastKeystrokeRef.current;
      if (timeSinceKeystroke > 8000 && !showPrompt) {
        const prompts = reflection.length < 50 ? ENCOURAGEMENT_PROMPTS : DEPTH_PROMPTS;
        const unused = prompts.filter((_, i) => !promptShownRef.current.has(i));
        if (unused.length > 0) {
          const index = prompts.indexOf(unused[Math.floor(Math.random() * unused.length)]);
          promptShownRef.current.add(index);
          setCurrentPrompt(prompts[index]);
          setShowPrompt(true);
          setTimeout(() => setShowPrompt(false), 6000);
        }
      }
    }
  }, [secondsElapsed, phase, reflection.length, wordCount, showPrompt]);

  // Track milestones
  useEffect(() => {
    const reachedMilestone = MILESTONES.find(m => wordCount >= m.words && wordCount < m.words + 10);
    if (reachedMilestone && milestone !== reachedMilestone.message) {
      setMilestone(reachedMilestone.message);
      setTimeout(() => setMilestone(null), 3000);
    }
  }, [wordCount, milestone]);

  // Handle text change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReflection(e.target.value);
    lastKeystrokeRef.current = Date.now();
    setShowPrompt(false);
    onKeystroke?.();
  }, [onKeystroke]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!isSubstantial) return;
    setPhase('complete');
    setTimeout(() => {
      onComplete(reflection.trim());
    }, 800);
  }, [isSubstantial, reflection, onComplete]);

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
    <div className="min-h-[75vh] flex flex-col">
      <AnimatePresence mode="wait">
        {/* ─────────────────────────────────────────────────────────────────
            Entering Phase - The Transition
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
            {/* Quill icon with glow */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, ...springs.gentle }}
              className="relative w-24 h-24 mb-8"
            >
              {/* Glow */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Icon container */}
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-500/20 to-stone-900 border border-cyan-500/30 flex items-center justify-center">
                <Feather size={36} className="text-cyan-400" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-stone-300 font-light"
            >
              Now, reflect...
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="w-32 h-1 bg-stone-800 rounded-full mx-auto mt-8 overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.2, ease: 'linear' }}
                style={{
                  boxShadow: '0 0 15px rgba(34, 211, 238, 0.4)',
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            Writing Phase - The Sanctuary
        ───────────────────────────────────────────────────────────────── */}
        {phase === 'writing' && (
          <motion.div
            key="writing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col px-4 py-4"
          >
            {/* The prompt - sacred question */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <p className="text-sm font-medium text-cyan-400 mb-4 tracking-[0.2em] uppercase">
                Your Reflection
              </p>
              <p className="text-xl sm:text-2xl text-stone-100 leading-relaxed max-w-lg mx-auto font-light">
                {lesson.reflectionPrompt}
              </p>
            </motion.div>

            {/* The writing space - sacred sanctuary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 relative"
            >
              {/* Container with dynamic glow */}
              <motion.div
                className={`
                  h-full min-h-[180px] relative rounded-2xl transition-all duration-500
                  ${isFocused
                    ? 'bg-stone-900/80'
                    : 'bg-stone-900/50'}
                `}
                animate={{
                  boxShadow: isFocused
                    ? '0 0 40px rgba(34, 211, 238, 0.1), inset 0 0 20px rgba(34, 211, 238, 0.02)'
                    : '0 0 0 rgba(34, 211, 238, 0)',
                  borderColor: isFocused
                    ? 'rgba(34, 211, 238, 0.3)'
                    : 'rgba(68, 64, 60, 0.5)',
                }}
                style={{
                  border: '2px solid',
                }}
              >
                {/* Focus mode gradient overlay */}
                <AnimatePresence>
                  {isFocused && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(34, 211, 238, 0.03) 0%, transparent 40%)',
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={reflection}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Begin writing..."
                  className="
                    w-full h-full min-h-[180px] p-5
                    bg-transparent text-lg text-stone-200
                    placeholder-stone-600 leading-relaxed
                    focus:outline-none resize-none
                    font-light tracking-wide
                  "
                  style={{ caretColor: '#22d3ee' }}
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
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        <span className="text-cyan-300/80 text-sm italic">
                          💭 {currentPrompt}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Word count and status */}
                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center">
                  {/* Word count */}
                  <motion.div
                    className="flex items-center gap-3"
                    animate={{ opacity: reflection.length > 0 ? 1 : 0.5 }}
                  >
                    <span className="text-stone-500 text-sm">
                      {wordCount} {wordCount === 1 ? 'word' : 'words'}
                    </span>

                    {/* Progress dots */}
                    <div className="flex gap-1.5">
                      {[5, 15, 30, 50].map((threshold) => (
                        <motion.div
                          key={threshold}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                            wordCount >= threshold ? 'bg-cyan-400' : 'bg-stone-700'
                          }`}
                          animate={{
                            scale: wordCount >= threshold && wordCount < threshold + 5 ? [1, 1.4, 1] : 1,
                            boxShadow: wordCount >= threshold
                              ? '0 0 8px rgba(34, 211, 238, 0.5)'
                              : 'none',
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Readiness indicator */}
                  <motion.span
                    className={`text-sm transition-colors duration-300 ${
                      isReady
                        ? 'text-emerald-400'
                        : isSubstantial
                        ? 'text-amber-400/70'
                        : 'text-stone-600'
                    }`}
                    animate={{
                      opacity: reflection.length > 0 ? 1 : 0,
                    }}
                  >
                    {isReady ? 'Ready to continue' : isSubstantial ? 'A bit more depth...' : 'Keep writing...'}
                  </motion.span>
                </div>
              </motion.div>
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
                    className="px-5 py-3 rounded-full bg-cyan-500/20 border border-cyan-500/30"
                    style={{
                      boxShadow: '0 0 30px rgba(34, 211, 238, 0.2)',
                    }}
                  >
                    <span className="text-cyan-300 text-sm">{milestone}</span>
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
              {/* Tip */}
              <div className="text-center">
                <p className="text-xs text-stone-600">
                  Write honestly. This reflection is for your growth alone.
                </p>
              </div>

              {/* Continue button */}
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!isSubstantial}
                glow={isSubstantial}
                className="w-full group"
              >
                {isReady ? (
                  <>
                    Complete Reflection
                    <ChevronRight
                      size={18}
                      className="ml-2 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
                    />
                  </>
                ) : isSubstantial ? (
                  'Continue (or write more)'
                ) : (
                  'Keep writing...'
                )}
              </Button>

              {/* Keyboard hint */}
              <AnimatePresence>
                {isSubstantial && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-xs text-stone-600"
                  >
                    Press ⌘+Enter to continue
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            Complete Phase - Brief Acknowledgment
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
                {/* Glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Icon */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-500/20 to-stone-900 border border-cyan-500/30 flex items-center justify-center">
                  <span className="text-4xl">✨</span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-stone-400 text-lg"
              >
                Reflection complete
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ReflectionStep;
