'use client';

// ============================================================================
// REFLECTION STEP
// This is the sanctuary. The sacred space where transformation happens.
// Not a form to fill out. A place to meet yourself.
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lesson } from '@/types';

interface ReflectionStepProps {
  lesson: Lesson;
  onComplete: (reflection: string) => void;
  onKeystroke?: () => void;
}

// Adaptive prompts that appear based on time and content
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

  // Calculate readiness - low bar, we trust the user
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
      textareaRef.current?.focus();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Show encouragement prompts based on inactivity
  useEffect(() => {
    if (phase !== 'writing') return;
    if (reflection.length > 0 && wordCount < 50) {
      const timeSinceKeystroke = Date.now() - lastKeystrokeRef.current;
      if (timeSinceKeystroke > 8000 && !showPrompt) {
        // Show a prompt if user seems stuck
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
    <div className="flex flex-col">
      <AnimatePresence mode="wait">
        {/* Entering phase */}
        {phase === 'entering' && (
          <motion.div
            key="entering"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-4"
          >
            {/* Quill icon */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="text-5xl mb-6"
            >
              ✍️
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-zinc-400"
            >
              Now, reflect...
            </motion.p>
          </motion.div>
        )}

        {/* Writing phase */}
        {phase === 'writing' && (
          <motion.div
            key="writing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col px-4 py-6"
          >
            {/* The prompt - sacred question */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <p className="text-xs font-medium text-indigo-400 mb-3 tracking-widest uppercase">
                Your Reflection
              </p>
              <p className="text-xl sm:text-2xl text-white leading-relaxed max-w-lg mx-auto font-light">
                {lesson.reflectionPrompt}
              </p>
            </motion.div>

            {/* The writing space - sacred sanctuary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`
                flex-1 relative rounded-2xl transition-all duration-500
                ${isFocused
                  ? 'bg-zinc-900/80 ring-2 ring-indigo-500/30'
                  : 'bg-zinc-900/50 ring-1 ring-zinc-800'}
              `}
            >
              {/* Focus mode glow */}
              {isFocused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"
                />
              )}

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={reflection}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Begin writing..."
                className="
                  w-full h-full min-h-[160px] p-5
                  bg-transparent text-lg text-zinc-200
                  placeholder-zinc-600 leading-relaxed
                  focus:outline-none resize-none
                  font-light tracking-wide
                "
                style={{ caretColor: '#818cf8' }}
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
                    <p className="text-indigo-400/80 text-sm italic">
                      💭 {currentPrompt}
                    </p>
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
                  <span className="text-zinc-500 text-sm">
                    {wordCount} {wordCount === 1 ? 'word' : 'words'}
                  </span>

                  {/* Progress dots */}
                  <div className="flex gap-1">
                    {[5, 15, 30, 50].map((threshold, i) => (
                      <motion.div
                        key={threshold}
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                          wordCount >= threshold ? 'bg-indigo-400' : 'bg-zinc-700'
                        }`}
                        animate={{
                          scale: wordCount >= threshold && wordCount < threshold + 5 ? [1, 1.3, 1] : 1
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Readiness indicator */}
                <span className={`text-sm transition-colors duration-300 ${
                  isReady ? 'text-emerald-400' : isSubstantial ? 'text-amber-400/70' : 'text-zinc-600'
                }`}>
                  {isReady ? 'Ready to continue' : isSubstantial ? 'A bit more depth...' : 'Keep writing...'}
                </span>
              </div>
            </motion.div>

            {/* Milestone toast */}
            <AnimatePresence>
              {milestone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed bottom-32 left-1/2 transform -translate-x-1/2"
                >
                  <div className="px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                    <span className="text-indigo-300 text-sm">{milestone}</span>
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
                <p className="text-xs text-zinc-600">
                  Write honestly. This reflection is for your growth alone.
                </p>
              </div>

              {/* Continue button */}
              <motion.button
                onClick={handleSubmit}
                disabled={!isSubstantial}
                className={`
                  w-full py-4 rounded-xl font-medium text-lg
                  transition-all duration-300
                  ${isSubstantial
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
                `}
                whileHover={isSubstantial ? { scale: 1.01 } : {}}
                whileTap={isSubstantial ? { scale: 0.99 } : {}}
              >
                {isReady ? 'Complete Reflection' : isSubstantial ? 'Continue (or write more)' : 'Keep writing...'}
              </motion.button>

              {/* Keyboard hint */}
              {isSubstantial && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xs text-zinc-600"
                >
                  Press ⌘+Enter to continue
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Complete phase - brief acknowledgment */}
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
                transition={{ type: 'spring', stiffness: 300 }}
                className="text-5xl mb-4"
              >
                ✨
              </motion.div>
              <p className="text-zinc-400">Reflection complete</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ReflectionStep;
